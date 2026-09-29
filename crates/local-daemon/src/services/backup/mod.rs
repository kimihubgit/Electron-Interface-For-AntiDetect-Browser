pub mod traits;
pub mod s3;
pub mod telegram;
pub mod google_drive;

use serde::{Deserialize, Serialize};
pub use traits::{BackupUploadResponse, ConnectionTestResponse, StorageProvider};
use s3::S3StorageProvider;
use telegram::TelegramStorageProvider;
use google_drive::GoogleDriveProvider;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupConnectionRequest {
    pub provider_id: String,
    pub name: Option<String>,
    pub endpoint: Option<String>,
    pub bucket_name: Option<String>,
    pub access_key_id: Option<String>,
    pub secret_access_key: Option<String>,
    pub region: Option<String>,
    pub path_prefix: Option<String>,
    // Telegram
    pub bot_token: Option<String>,
    pub chat_id: Option<String>,
    // Google Drive
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    pub refresh_token: Option<String>,
    pub access_token: Option<String>,
    pub folder_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupUploadRequest {
    pub provider: BackupConnectionRequest,
    pub filename: String,
    pub data_base64: Option<String>,
    pub data_utf8: Option<String>,
}

#[derive(Clone, Default)]
pub struct BackupService;

impl BackupService {
    pub fn new() -> Self {
        Self
    }

    pub fn create_provider(req: &BackupConnectionRequest) -> Box<dyn StorageProvider> {
        match req.provider_id.as_str() {
            "telegram" => Box::new(TelegramStorageProvider::new(
                req.bot_token.clone().unwrap_or_default(),
                req.chat_id.clone().unwrap_or_default(),
            )),
            "google_drive" => Box::new(GoogleDriveProvider::new(
                req.client_id.clone(),
                req.client_secret.clone(),
                req.refresh_token.clone(),
                req.access_token.clone(),
                req.folder_id.clone(),
            )),
            // All S3-compatible providers (R2, AWS, Bizfly, Cloudfly, Wasabi, DO Spaces, MinIO)
            _ => {
                let name = req.name.clone().unwrap_or_else(|| req.provider_id.clone());
                let endpoint = req.endpoint.clone().unwrap_or_default();
                let bucket = req.bucket_name.clone().unwrap_or_default();
                let ak = req.access_key_id.clone().unwrap_or_default();
                let sk = req.secret_access_key.clone().unwrap_or_default();
                let reg = req.region.clone().unwrap_or_else(|| "us-east-1".to_string());
                let prefix = req.path_prefix.clone();

                Box::new(S3StorageProvider::new(
                    req.provider_id.clone(),
                    name,
                    endpoint,
                    bucket,
                    ak,
                    sk,
                    reg,
                    prefix,
                ))
            }
        }
    }

    pub async fn test_connection(
        &self,
        req: BackupConnectionRequest,
    ) -> Result<ConnectionTestResponse, String> {
        let provider = Self::create_provider(&req);
        provider.test_connection().await
    }

    pub async fn upload_backup(
        &self,
        req: BackupUploadRequest,
    ) -> Result<BackupUploadResponse, String> {
        let provider = Self::create_provider(&req.provider);
        let data_bytes = if let Some(ref b64) = req.data_base64 {
            use base64::Engine;
            base64::engine::general_purpose::STANDARD
                .decode(b64)
                .map_err(|e| format!("Lỗi giải mã base64: {}", e))?
        } else if let Some(ref text) = req.data_utf8 {
            text.as_bytes().to_vec()
        } else {
            return Err("Không có dữ liệu payload backup để tải lên!".to_string());
        };

        provider.upload_backup(&req.filename, &data_bytes).await
    }
}
