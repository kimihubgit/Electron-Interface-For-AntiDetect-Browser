use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use crate::models::{LaunchBrowserPayload, RunningProfileInfo};

#[derive(Clone)]
pub struct BrowserManager {
    running_profiles: Arc<RwLock<HashMap<String, RunningProfileInfo>>>,
}

impl BrowserManager {
    pub fn new() -> Self {
        Self {
            running_profiles: Arc::new(RwLock::new(HashMap::new())),
        }
    }

    pub async fn launch_profile(&self, payload: LaunchBrowserPayload) -> Result<RunningProfileInfo, String> {
        let mut profiles = self.running_profiles.write().await;

        if let Some(existing) = profiles.get(&payload.profile_id) {
            return Ok(existing.clone());
        }

        // Port allocation for Chrome DevTools Protocol
        let cdp_port = 9222 + (profiles.len() as u16);
        let info = RunningProfileInfo {
            id: payload.profile_id.clone(),
            name: payload.name.unwrap_or_else(|| format!("Profile #{}", payload.profile_id)),
            pid: std::process::id() + (profiles.len() as u32) + 1,
            cdp_port,
            start_time: chrono::Utc::now().timestamp_millis(),
        };

        profiles.insert(payload.profile_id, info.clone());
        Ok(info)
    }

    pub async fn stop_profile(&self, profile_id: &str) -> bool {
        let mut profiles = self.running_profiles.write().await;
        profiles.remove(profile_id).is_some()
    }

    pub async fn list_active(&self) -> Vec<RunningProfileInfo> {
        let profiles = self.running_profiles.read().await;
        profiles.values().cloned().collect()
    }

    pub async fn get_cdp_port(&self, profile_id: &str) -> Option<u16> {
        let profiles = self.running_profiles.read().await;
        profiles.get(profile_id).map(|p| p.cdp_port)
    }
}
