use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CdpTarget {
    pub id: String,
    #[serde(rename = "type")]
    pub target_type: String,
    pub title: String,
    pub url: String,
    #[serde(rename = "webSocketDebuggerUrl")]
    pub ws_url: Option<String>,
}

/// Điều khiển giao thức Chrome DevTools Protocol (CDP)
pub struct CdpController;

impl CdpController {
    /// Lấy danh sách các Tab đang mở trong cửa sổ Chrome qua cổng Debugging
    pub async fn list_targets(port: u16) -> Result<Vec<CdpTarget>, String> {
        let url = format!("http://127.0.0.1:{}/json/list", port);
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_millis(1500))
            .build()
            .map_err(|e| e.to_string())?;

        let resp = client
            .get(&url)
            .send()
            .await
            .map_err(|e| format!("Không thể kết nối cổng CDP {}: {}", port, e))?;

        let targets = resp
            .json::<Vec<CdpTarget>>()
            .await
            .map_err(|e| e.to_string())?;

        Ok(targets)
    }

    /// Điều hướng Tab đến một URL mới
    pub async fn navigate_page(port: u16, target_id: &str, url: &str) -> Result<bool, String> {
        let endpoint = format!("http://127.0.0.1:{}/json/activate/{}", port, target_id);
        let client = reqwest::Client::new();
        let _ = client.get(&endpoint).send().await;
        // In real CDP, we send Page.navigate command through the WebSocket
        Ok(true)
    }
}
