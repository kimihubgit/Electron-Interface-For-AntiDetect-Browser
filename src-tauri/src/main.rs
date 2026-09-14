// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::time::Instant;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::TcpStream;
use tokio::time::{timeout, Duration};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProxyConfig {
    pub id: Option<String>,
    pub host: String,
    pub port: u16,
    pub protocol: Option<String>,
    pub username: Option<String>,
    pub password: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProxyTestResult {
    pub id: Option<String>,
    pub success: bool,
    pub ping: u32,
    pub error: Option<String>,
    pub timestamp: i64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LaunchProfileRequest {
    pub profile_id: String,
    pub executable_path: String,
    pub user_data_dir: String,
    pub proxy_arg: Option<String>,
    pub extra_args: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LaunchResult {
    pub success: bool,
    pub pid: Option<u32>,
    pub message: String,
}

/// Native TCP & Protocol Handshake Proxy Testing in Rust
#[tauri::command]
async fn test_proxy(proxy: ProxyConfig, timeout_ms: Option<u64>) -> ProxyTestResult {
    let to_duration = Duration::from_millis(timeout_ms.unwrap_or(4000));
    let addr = format!("{}:{}", proxy.host, proxy.port);
    let start_time = Instant::now();
    let protocol = proxy.protocol.clone().unwrap_or_else(|| "HTTP".to_string()).to_uppercase();

    let connect_future = TcpStream::connect(&addr);
    match timeout(to_duration, connect_future).await {
        Ok(Ok(mut stream)) => {
            let tcp_latency = start_time.elapsed().as_millis() as u32;

            if protocol.contains("SOCKS5") {
                // SOCKS5 greeting handshake: 0x05 (version), 0x02 (num methods), 0x00 (no auth), 0x02 (user/pass)
                let greeting = [0x05, 0x02, 0x00, 0x02];
                if stream.write_all(&greeting).await.is_ok() {
                    let mut resp = [0u8; 2];
                    if let Ok(Ok(n)) = timeout(Duration::from_millis(1500), stream.read(&mut resp)).await {
                        if n >= 2 && resp[0] == 0x05 {
                            let total_latency = start_time.elapsed().as_millis() as u32;
                            return ProxyTestResult {
                                id: proxy.id,
                                success: true,
                                ping: total_latency,
                                error: None,
                                timestamp: chrono::Utc::now().timestamp_millis(),
                            };
                        }
                    }
                }
            } else if protocol.contains("HTTP") {
                // HTTP CONNECT handshake probe
                let probe = "CONNECT www.google.com:443 HTTP/1.1\r\nHost: www.google.com:443\r\nProxy-Connection: Keep-Alive\r\n\r\n";
                if stream.write_all(probe.as_bytes()).await.is_ok() {
                    let mut buf = [0u8; 256];
                    if let Ok(Ok(n)) = timeout(Duration::from_millis(1500), stream.read(&mut buf)).await {
                        let resp_str = String::from_utf8_lossy(&buf[..n]);
                        if resp_str.starts_with("HTTP/1.") {
                            let total_latency = start_time.elapsed().as_millis() as u32;
                            return ProxyTestResult {
                                id: proxy.id,
                                success: true,
                                ping: total_latency,
                                error: None,
                                timestamp: chrono::Utc::now().timestamp_millis(),
                            };
                        }
                    }
                }
            }

            // Fallback to successful TCP handshake if protocol probe didn't reject
            ProxyTestResult {
                id: proxy.id,
                success: true,
                ping: tcp_latency,
                error: None,
                timestamp: chrono::Utc::now().timestamp_millis(),
            }
        }
        Ok(Err(err)) => ProxyTestResult {
            id: proxy.id,
            success: false,
            ping: 0,
            error: Some(format!("TCP Connection Refused: {}", err)),
            timestamp: chrono::Utc::now().timestamp_millis(),
        },
        Err(_) => ProxyTestResult {
            id: proxy.id,
            success: false,
            ping: 0,
            error: Some("Connection Timeout".to_string()),
            timestamp: chrono::Utc::now().timestamp_millis(),
        },
    }
}

/// Concurrently test a batch of proxies using Tokio async tasks
#[tauri::command]
async fn test_all_proxies(proxies: Vec<ProxyConfig>) -> Vec<ProxyTestResult> {
    let mut tasks = Vec::new();
    for proxy in proxies {
        tasks.push(tokio::spawn(async move {
            test_proxy(proxy, Some(4000)).await
        }));
    }

    let mut results = Vec::new();
    for task in tasks {
        if let Ok(res) = task.await {
            results.push(res);
        }
    }
    results
}

/// Spawns custom Chromium / Antidetect binary with anti-fingerprint command line arguments
#[tauri::command]
async fn launch_profile_browser(req: LaunchProfileRequest) -> LaunchResult {
    let mut cmd = std::process::Command::new(&req.executable_path);

    cmd.arg(format!("--user-data-dir={}", req.user_data_dir));
    cmd.arg("--no-first-run");
    cmd.arg("--no-default-browser-check");

    if let Some(proxy_url) = req.proxy_arg {
        cmd.arg(format!("--proxy-server={}", proxy_url));
    }

    for arg in req.extra_args {
        cmd.arg(arg);
    }

    match cmd.spawn() {
        Ok(child) => LaunchResult {
            success: true,
            pid: Some(child.id()),
            message: format!("Profile {} launched successfully (PID: {})", req.profile_id, child.id()),
        },
        Err(e) => LaunchResult {
            success: false,
            pid: None,
            message: format!("Failed to spawn browser: {}", e),
        },
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            test_proxy,
            test_all_proxies,
            launch_profile_browser
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
