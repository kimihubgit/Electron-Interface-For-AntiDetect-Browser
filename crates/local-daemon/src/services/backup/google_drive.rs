use super::traits::{BackupUploadResponse, ConnectionTestResponse, StorageProvider};
use async_trait::async_trait;
use serde_json::Value;
use std::time::Instant;

pub struct GoogleDriveProvider {
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    pub refresh_token: Option<String>,
    pub access_token: Option<String>,
    pub folder_id: Option<String>,
}

impl GoogleDriveProvider {
    pub fn new(
        client_id: Option<String>,
        client_secret: Option<String>,
        refresh_token: Option<String>,
        access_token: Option<String>,
        folder_id: Option<String>,
    ) -> Self {
        Self {
            client_id,
            client_secret,
            refresh_token,
            access_token,
            folder_id,
        }
    }

    async fn get_access_token(&self, client: &reqwest::Client) -> Result<String, String> {
        if let Some(ref token) = self.access_token {
            if !token.trim().is_empty() {
                return Ok(token.trim().to_string());
            }
        }

        if let Some(ref rt) = self.refresh_token {
            let mut params = std::collections::HashMap::new();
            params.insert("refresh_token", rt.as_str());
            params.insert("grant_type", "refresh_token");

            if let Some(ref cid) = self.client_id {
                params.insert("client_id", cid.as_str());
            }
            if let Some(ref sec) = self.client_secret {
                params.insert("client_secret", sec.as_str());
            }

            let resp = client
                .post("https://oauth2.googleapis.com/token")
                .form(&params)
                .send()
                .await
                .map_err(|e| format!("Lỗi gọi Google OAuth Token endpoint: {}", e))?;

            let json: Value = resp.json().await.map_err(|e| e.to_string())?;

            if let Some(at) = json["access_token"].as_str() {
                return Ok(at.to_string());
            }

            let err_desc = json["error_description"]
                .as_str()
                .or_else(|| json["error"].as_str())
                .unwrap_or("Không thể làm mới Google Access Token");
            return Err(format!("Google OAuth error: {}", err_desc));
        }

        Err("Thiếu Access Token hoặc Refresh Token của Google Drive!".to_string())
    }
}

#[async_trait]
impl StorageProvider for GoogleDriveProvider {
    async fn test_connection(&self) -> Result<ConnectionTestResponse, String> {
        let start = Instant::now();
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(8))
            .build()
            .map_err(|e| e.to_string())?;

        let token = self.get_access_token(&client).await?;

        let resp = client
            .get("https://www.googleapis.com/drive/v3/about?fields=user,storageQuota")
            .bearer_auth(&token)
            .send()
            .await
            .map_err(|e| format!("Lỗi kết nối tới Google Drive API v3: {}", e))?;

        let ping_ms = start.elapsed().as_millis() as u64;

        if !resp.status().is_success() {
            let status = resp.status();
            let err_body: Value = resp.json().await.unwrap_or_default();
            let msg = err_body["error"]["message"].as_str().unwrap_or("Xác thực thất bại");
            return Err(format!("Lỗi Google Drive API (HTTP {}): {}", status.as_u16(), msg));
        }

        let json: Value = resp.json().await.map_err(|e| e.to_string())?;

        let email = json["user"]["emailAddress"].as_str().unwrap_or("Google User");
        let name = json["user"]["displayName"].as_str().unwrap_or("");
        let limit_bytes = json["storageQuota"]["limit"].as_str().and_then(|s| s.parse::<u64>().ok()).unwrap_or(0);
        let usage_bytes = json["storageQuota"]["usage"].as_str().and_then(|s| s.parse::<u64>().ok()).unwrap_or(0);

        let limit_gb = if limit_bytes > 0 {
            format!("{:.1} GB", limit_bytes as f64 / 1_073_741_824.0)
        } else {
            "Không giới hạn".to_string()
        };
        let used_gb = format!("{:.1} GB", usage_bytes as f64 / 1_073_741_824.0);

        Ok(ConnectionTestResponse {
            success: true,
            ping_ms,
            message: format!(
                "Kết nối thành công tới Google Drive ({} - {})! Dung lượng: {} / {} (Ping: {}ms)",
                email, name, used_gb, limit_gb, ping_ms
            ),
            details: Some(serde_json::json!({
                "email": email,
                "name": name,
                "used": used_gb,
                "limit": limit_gb
            })),
        })
    }

    async fn upload_backup(&self, filename: &str, data: &[u8]) -> Result<BackupUploadResponse, String> {
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(60))
            .build()
            .map_err(|e| e.to_string())?;

        let token = self.get_access_token(&client).await?;

        let boundary = format!("-------AntidetectRustBoundary{}", chrono::Utc::now().timestamp_millis());
        let delimiter = format!("\r\n--{}\r\n", boundary);
        let close_delimiter = format!("\r\n--{}--", boundary);

        let mut metadata = serde_json::json!({
            "name": filename,
            "mimeType": "application/octet-stream",
            "description": "Antidetect Browser Backup (Uploaded by Rust Engine)"
        });

        if let Some(ref fid) = self.folder_id {
            if !fid.trim().is_empty() && fid != "root" {
                metadata["parents"] = serde_json::json!([fid]);
            }
        }

        let mut body = Vec::new();
        body.extend_from_slice(delimiter.as_bytes());
        body.extend_from_slice(b"Content-Type: application/json; charset=UTF-8\r\n\r\n");
        body.extend_from_slice(metadata.to_string().as_bytes());
        body.extend_from_slice(delimiter.as_bytes());
        body.extend_from_slice(b"Content-Type: application/octet-stream\r\n\r\n");
        body.extend_from_slice(data);
        body.extend_from_slice(close_delimiter.as_bytes());

        let url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,size";

        let resp = client
            .post(url)
            .bearer_auth(&token)
            .header("Content-Type", format!("multipart/related; boundary={}", boundary))
            .body(body)
            .send()
            .await
            .map_err(|e| format!("Lỗi tải lên Google Drive: {}", e))?;

        if !resp.status().is_success() {
            let status = resp.status();
            let err_text = resp.text().await.unwrap_or_default();
            return Err(format!("Tải lên Google Drive thất bại (HTTP {}): {}", status.as_u16(), err_text));
        }

        let json: Value = resp.json().await.map_err(|e| e.to_string())?;
        let file_id = json["id"].as_str().unwrap_or("").to_string();
        let web_view_link = json["webViewLink"].as_str().map(|s| s.to_string());

        Ok(BackupUploadResponse {
            success: true,
            file_id: file_id.clone(),
            file_url: web_view_link.or_else(|| Some(format!("https://drive.google.com/file/d/{}/view", file_id))),
            size_bytes: data.len(),
            message: format!("Đã lưu trữ thành công lên Google Drive (File ID: {})", file_id),
        })
    }
}
