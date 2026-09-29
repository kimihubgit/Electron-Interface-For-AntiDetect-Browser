use super::traits::{BackupUploadResponse, ConnectionTestResponse, StorageProvider};
use async_trait::async_trait;
use chrono::Utc;
use hmac::{Hmac, Mac};
use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use sha2::{Digest, Sha256};
use std::time::Instant;

type HmacSha256 = Hmac<Sha256>;

pub struct S3StorageProvider {
    pub provider_id: String,
    pub name: String,
    pub endpoint: String,
    pub bucket_name: String,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub region: String,
    pub path_prefix: String,
}

impl S3StorageProvider {
    pub fn new(
        provider_id: String,
        name: String,
        endpoint: String,
        bucket_name: String,
        access_key_id: String,
        secret_access_key: String,
        region: String,
        path_prefix: Option<String>,
    ) -> Self {
        Self {
            provider_id,
            name,
            endpoint: endpoint.trim_end_matches('/').to_string(),
            bucket_name: bucket_name.trim().to_string(),
            access_key_id: access_key_id.trim().to_string(),
            secret_access_key: secret_access_key.trim().to_string(),
            region: if region.trim().is_empty() { "us-east-1".to_string() } else { region.trim().to_string() },
            path_prefix: path_prefix.unwrap_or_else(|| "vault/".to_string()),
        }
    }

    fn sha256_hex(data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }

    fn hmac_sha256(key: &[u8], data: &[u8]) -> Vec<u8> {
        let mut mac = HmacSha256::new_from_slice(key).expect("HMAC can take key of any size");
        mac.update(data);
        mac.finalize().into_bytes().to_vec()
    }

    /// Sign AWS SigV4 request
    pub fn sign_request(
        &self,
        method: &str,
        path: &str,
        query: &str,
        payload: &[u8],
    ) -> Result<HeaderMap, String> {
        let now = Utc::now();
        let amz_date = now.format("%Y%m%dT%H%M%SZ").to_string();
        let date_stamp = now.format("%Y%m%d").to_string();

        let host = url::Url::parse(&self.endpoint)
            .map_err(|e| format!("Invalid endpoint URL: {}", e))?
            .host_str()
            .ok_or("No host in endpoint URL")?
            .to_string();

        let payload_hash = Self::sha256_hex(payload);

        let canonical_headers = format!(
            "host:{}\nx-amz-content-sha256:{}\nx-amz-date:{}\n",
            host, payload_hash, amz_date
        );
        let signed_headers = "host;x-amz-content-sha256;x-amz-date";

        let canonical_request = format!(
            "{}\n{}\n{}\n{}\n{}\n{}",
            method, path, query, canonical_headers, signed_headers, payload_hash
        );
        let canonical_hash = Self::sha256_hex(canonical_request.as_bytes());

        let credential_scope = format!("{}/{}/s3/aws4_request", date_stamp, self.region);
        let string_to_sign = format!(
            "AWS4-HMAC-SHA256\n{}\n{}\n{}",
            amz_date, credential_scope, canonical_hash
        );

        let k_secret = format!("AWS4{}", self.secret_access_key);
        let k_date = Self::hmac_sha256(k_secret.as_bytes(), date_stamp.as_bytes());
        let k_region = Self::hmac_sha256(&k_date, self.region.as_bytes());
        let k_service = Self::hmac_sha256(&k_region, b"s3");
        let k_signing = Self::hmac_sha256(&k_service, b"aws4_request");
        let signature = hex::encode(Self::hmac_sha256(&k_signing, string_to_sign.as_bytes()));

        let auth_header = format!(
            "AWS4-HMAC-SHA256 Credential={}/{}, SignedHeaders={}, Signature={}",
            self.access_key_id, credential_scope, signed_headers, signature
        );

        let mut headers = HeaderMap::new();
        headers.insert(HeaderName::from_static("x-amz-date"), HeaderValue::from_str(&amz_date).unwrap());
        headers.insert(HeaderName::from_static("x-amz-content-sha256"), HeaderValue::from_str(&payload_hash).unwrap());
        headers.insert(HeaderName::from_static("authorization"), HeaderValue::from_str(&auth_header).unwrap());

        Ok(headers)
    }
}

#[async_trait]
impl StorageProvider for S3StorageProvider {
    async fn test_connection(&self) -> Result<ConnectionTestResponse, String> {
        if self.access_key_id.is_empty() || self.secret_access_key.is_empty() {
            return Err("Access Key ID và Secret Access Key không được để trống!".to_string());
        }
        if self.bucket_name.is_empty() {
            return Err("Bucket Name không được để trống!".to_string());
        }

        let start = Instant::now();
        let path = format!("/{}", self.bucket_name);
        let query = "max-keys=1";
        let target_url = format!("{}{}?{}", self.endpoint, path, query);

        let headers = self.sign_request("GET", &path, query, b"")?;

        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(5))
            .build()
            .map_err(|e| e.to_string())?;

        let resp = client
            .get(&target_url)
            .headers(headers)
            .send()
            .await
            .map_err(|e| format!("Lỗi kết nối tới máy chủ S3 ({}): {}", self.name, e))?;

        let ping_ms = start.elapsed().as_millis() as u64;
        let status = resp.status();

        if status.is_success() {
            Ok(ConnectionTestResponse {
                success: true,
                ping_ms,
                message: format!(
                    "Kết nối thành công tới {}! (Bucket: '{}', Ping: {}ms)",
                    self.name, self.bucket_name, ping_ms
                ),
                details: Some(serde_json::json!({
                    "provider": self.provider_id,
                    "endpoint": self.endpoint,
                    "status_code": status.as_u16(),
                })),
            })
        } else if status.as_u16() == 403 {
            Err(format!(
                "Lỗi 403 Forbidden: Access Key hoặc Secret Key không có quyền truy cập bucket '{}'.",
                self.bucket_name
            ))
        } else if status.as_u16() == 404 {
            Err(format!(
                "Lỗi 404 Not Found: Không tìm thấy bucket '{}' trên máy chủ {}.",
                self.bucket_name, self.name
            ))
        } else {
            let body_snippet = resp.text().await.unwrap_or_default();
            Err(format!(
                "Máy chủ {} phản hồi mã lỗi HTTP {}: {}",
                self.name,
                status.as_u16(),
                body_snippet.chars().take(120).collect::<String>()
            ))
        }
    }

    async fn upload_backup(&self, filename: &str, data: &[u8]) -> Result<BackupUploadResponse, String> {
        let object_key = format!("{}/{}", self.path_prefix.trim_end_matches('/'), filename);
        let path = format!("/{}/{}", self.bucket_name, object_key);
        let target_url = format!("{}{}", self.endpoint, path);

        let mut headers = self.sign_request("PUT", &path, "", data)?;
        headers.insert(
            HeaderName::from_static("content-type"),
            HeaderValue::from_static("application/octet-stream"),
        );

        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .map_err(|e| e.to_string())?;

        let resp = client
            .put(&target_url)
            .headers(headers)
            .body(data.to_vec())
            .send()
            .await
            .map_err(|e| format!("Lỗi tải lên máy chủ S3: {}", e))?;

        let status = resp.status();
        if status.is_success() {
            Ok(BackupUploadResponse {
                success: true,
                file_id: object_key.clone(),
                file_url: Some(target_url),
                size_bytes: data.len(),
                message: format!("Đã lưu trữ thành công lên {}: {}", self.name, object_key),
            })
        } else {
            let err_text = resp.text().await.unwrap_or_default();
            Err(format!(
                "Tải lên S3 thất bại (HTTP {}): {}",
                status.as_u16(),
                err_text.chars().take(150).collect::<String>()
            ))
        }
    }
}
