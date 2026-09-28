use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApiResponse<T> {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    pub timestamp: i64,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T, message: Option<&str>) -> Self {
        Self {
            success: true,
            message: message.map(|s| s.to_string()),
            data: Some(data),
            error: None,
            timestamp: chrono::Utc::now().timestamp_millis(),
        }
    }

    pub fn error(error_msg: &str) -> Self {
        Self {
            success: false,
            message: None,
            data: None,
            error: Some(error_msg.to_string()),
            timestamp: chrono::Utc::now().timestamp_millis(),
        }
    }
}

// System Health
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DaemonHealth {
    pub status: String,
    pub engine: String,
    pub version: String,
    pub uptime_seconds: u64,
    pub active_browsers: usize,
    pub is_syncing: bool,
}

// Browser Launch Request
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LaunchBrowserPayload {
    pub profile_id: String,
    pub name: Option<String>,
    pub browser_version: Option<String>,
    pub user_agent: Option<String>,
    pub proxy: Option<ProxyConfigPayload>,
    pub resolution: Option<String>,
    pub extra_args: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProxyConfigPayload {
    pub host: String,
    pub port: u16,
    pub protocol: Option<String>,
    pub username: Option<String>,
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RunningProfileInfo {
    pub id: String,
    pub name: String,
    pub pid: u32,
    pub cdp_port: u16,
    pub start_time: i64,
}

// Synchronizer Request
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StartSyncPayload {
    pub master_id: String,
    pub follower_ids: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SyncStatusInfo {
    pub is_syncing: bool,
    pub master_id: Option<String>,
    pub follower_count: usize,
    pub events_dispatched: u64,
}
