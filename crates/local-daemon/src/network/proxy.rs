use std::time::Instant;
use tokio::net::TcpStream;
use tokio::time::{timeout, Duration};
use crate::models::ProxyConfigPayload;

/// Dịch vụ kiểm tra kết nối và đo độ trễ Proxy
#[derive(Clone)]
pub struct ProxyService;

impl ProxyService {
    pub fn new() -> Self {
        Self
    }

    pub async fn test_proxy(&self, proxy: ProxyConfigPayload, timeout_ms: u64) -> (bool, u32, Option<String>) {
        let addr = format!("{}:{}", proxy.host, proxy.port);
        let start = Instant::now();
        let to_duration = Duration::from_millis(timeout_ms);

        match timeout(to_duration, TcpStream::connect(&addr)).await {
            Ok(Ok(_stream)) => {
                let ping = start.elapsed().as_millis() as u32;
                (true, ping, None)
            }
            Ok(Err(e)) => (false, 0, Some(format!("Kết nối thất bại: {}", e))),
            Err(_) => (false, 0, Some("Hết thời gian chờ (Timeout)".to_string())),
        }
    }
}
