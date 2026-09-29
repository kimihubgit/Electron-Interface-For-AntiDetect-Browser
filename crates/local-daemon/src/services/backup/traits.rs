use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConnectionTestResponse {
    pub success: bool,
    pub ping_ms: u64,
    pub message: String,
    pub details: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BackupUploadResponse {
    pub success: bool,
    pub file_id: String,
    pub file_url: Option<String>,
    pub size_bytes: usize,
    pub message: String,
}

#[async_trait::async_trait]
pub trait StorageProvider: Send + Sync {
    async fn test_connection(&self) -> Result<ConnectionTestResponse, String>;
    async fn upload_backup(&self, filename: &str, data: &[u8]) -> Result<BackupUploadResponse, String>;
}
