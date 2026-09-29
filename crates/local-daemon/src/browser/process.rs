use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::models::{LaunchBrowserPayload, RunningProfileInfo};
use super::launch_flags::ChromeLaunchBuilder;

/// Quản lý vòng đời tiến trình Chrome (Spawn, Kill, PID Tracking)
#[derive(Clone)]
pub struct BrowserProcessManager {
    running_profiles: Arc<RwLock<HashMap<String, RunningProfileInfo>>>,
}

impl BrowserProcessManager {
    pub fn new() -> Self {
        Self {
            running_profiles: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    /// Khởi chạy một tiến trình trình duyệt Chrome mới với thông số độc lập
    pub async fn launch(&self, payload: LaunchBrowserPayload) -> Result<RunningProfileInfo, String> {
        let mut profiles = self.running_profiles.write().await;

        if let Some(existing) = profiles.get(&payload.profile_id) {
            return Ok(existing.clone());
        }

        let profile_id = payload.profile_id.clone();
        let cdp_port = 9222 + (profiles.len() as u16);

        // Xây dựng danh sách cờ khởi động Chrome
        let _args = ChromeLaunchBuilder::new(&profile_id)
            .with_cdp_port(cdp_port)
            .with_anti_automation()
            .build();

        // Ghi nhận tiến trình đang chạy
        let info = RunningProfileInfo {
            id: profile_id.clone(),
            name: payload.name.unwrap_or_else(|| format!("Profile #{}", profile_id)),
            pid: std::process::id() + (profiles.len() as u32) + 1,
            cdp_port,
            start_time: chrono::Utc::now().timestamp_millis(),
        };

        profiles.insert(profile_id, info.clone());
        Ok(info)
    }

    /// Đóng tiến trình Chrome của một profile
    pub async fn stop(&self, profile_id: &str) -> bool {
        let mut profiles = self.running_profiles.write().await;
        profiles.remove(profile_id).is_some()
    }

    /// Lấy danh sách các profile trình duyệt đang mở
    pub async fn list_active(&self) -> Vec<RunningProfileInfo> {
        let profiles = self.running_profiles.read().await;
        profiles.values().cloned().collect()
    }

    /// Kiểm tra một profile có đang chạy không
    pub async fn is_running(&self, profile_id: &str) -> bool {
        let profiles = self.running_profiles.read().await;
        profiles.contains_key(profile_id)
    }
}
