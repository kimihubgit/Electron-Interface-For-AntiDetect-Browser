use std::net::SocketAddr;
use std::sync::atomic::{AtomicBool, AtomicU64, AtomicUsize, Ordering};
use std::sync::Arc;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::{broadcast, RwLock};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartLocalProxyPayload {
    pub bind_address: Option<String>,
    pub start_port: Option<u16>,
    pub count: Option<usize>,
    pub user: Option<String>,
    pub pass: Option<String>,
    pub target_ipv6_list: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocalProxyStatus {
    pub is_running: bool,
    pub bind_address: String,
    pub opened_ports: Vec<u16>,
    pub count: usize,
    pub active_connections: usize,
    pub total_bytes_transferred: u64,
    pub lan_ips: Vec<String>,
}

#[derive(Clone)]
pub struct Ipv6ProxyServer {
    is_running: Arc<AtomicBool>,
    shutdown_tx: Arc<RwLock<Option<broadcast::Sender<()>>>>,
    opened_ports: Arc<RwLock<Vec<u16>>>,
    bind_address: Arc<RwLock<String>>,
    active_connections: Arc<AtomicUsize>,
    total_bytes: Arc<AtomicU64>,
}

impl Ipv6ProxyServer {
    pub fn new() -> Self {
        Self {
            is_running: Arc::new(AtomicBool::new(false)),
            shutdown_tx: Arc::new(RwLock::new(None)),
            opened_ports: Arc::new(RwLock::new(Vec::new())),
            bind_address: Arc::new(RwLock::new("127.0.0.1".to_string())),
            active_connections: Arc::new(AtomicUsize::new(0)),
            total_bytes: Arc::new(AtomicU64::new(0)),
        }
    }

    pub async fn start(&self, payload: StartLocalProxyPayload) -> Result<LocalProxyStatus, String> {
        // Tắt server cũ nếu đang chạy
        if self.is_running.load(Ordering::SeqCst) {
            self.stop().await;
        }

        let bind_ip = payload.bind_address.unwrap_or_else(|| "127.0.0.1".to_string());
        let start_port = payload.start_port.unwrap_or(20000);
        let count = payload.count.unwrap_or(5).clamp(1, 200);
        let user = payload.user.unwrap_or_default();
        let pass = payload.pass.unwrap_or_default();
        let ipv6_list = payload.target_ipv6_list.unwrap_or_default();

        let (shutdown_sender, _) = broadcast::channel(1);
        {
            let mut tx = self.shutdown_tx.write().await;
            *tx = Some(shutdown_sender.clone());
        }

        let mut ports_opened = Vec::new();

        for i in 0..count {
            let port = start_port + (i as u16);
            let addr_str = format!("{}:{}", bind_ip, port);

            match TcpListener::bind(&addr_str).await {
                Ok(listener) => {
                    ports_opened.push(port);
                    let mut rx = shutdown_sender.subscribe();
                    let conn_counter = self.active_connections.clone();
                    let byte_counter = self.total_bytes.clone();
                    let auth_user = user.clone();
                    let auth_pass = pass.clone();
                    let target_ipv6 = ipv6_list.get(i).cloned();

                    // Khởi chạy tác vụ nền Tokio bất đồng bộ cho từng port
                    tokio::spawn(async move {
                        loop {
                            tokio::select! {
                                Ok((client_socket, _client_addr)) = listener.accept() => {
                                    let c_counter = conn_counter.clone();
                                    let b_counter = byte_counter.clone();
                                    let a_user = auth_user.clone();
                                    let a_pass = auth_pass.clone();
                                    let t_ip = target_ipv6.clone();

                                    tokio::spawn(async move {
                                        c_counter.fetch_add(1, Ordering::Relaxed);
                                        let _ = handle_proxy_client(client_socket, a_user, a_pass, t_ip, b_counter).await;
                                        c_counter.fetch_sub(1, Ordering::Relaxed);
                                    });
                                }
                                _ = rx.recv() => {
                                    // Tín hiệu tắt cổng
                                    break;
                                }
                            }
                        }
                    });
                }
                Err(err) => {
                    eprintln!("[Rust Proxy] Không thể mở cổng {}: {}", port, err);
                }
            }
        }

        if ports_opened.is_empty() {
            return Err("Không thể mở bất kỳ cổng proxy nào, vui lòng kiểm tra quyền Admin hoặc xung đột cổng!".to_string());
        }

        self.is_running.store(true, Ordering::SeqCst);
        {
            let mut ports = self.opened_ports.write().await;
            *ports = ports_opened.clone();
        }
        {
            let mut b_addr = self.bind_address.write().await;
            *b_addr = bind_ip.clone();
        }

        Ok(self.get_status().await)
    }

    pub async fn stop(&self) -> LocalProxyStatus {
        if let Some(tx) = self.shutdown_tx.write().await.take() {
            let _ = tx.send(());
        }
        self.is_running.store(false, Ordering::SeqCst);
        {
            let mut ports = self.opened_ports.write().await;
            ports.clear();
        }
        self.active_connections.store(0, Ordering::SeqCst);
        self.get_status().await
    }

    pub async fn get_status(&self) -> LocalProxyStatus {
        let is_run = self.is_running.load(Ordering::SeqCst);
        let ports = self.opened_ports.read().await.clone();
        let b_addr = self.bind_address.read().await.clone();
        let active = self.active_connections.load(Ordering::Relaxed);
        let bytes = self.total_bytes.load(Ordering::Relaxed);
        let count = ports.len();

        LocalProxyStatus {
            is_running: is_run,
            bind_address: b_addr,
            opened_ports: ports,
            count,
            active_connections: active,
            total_bytes_transferred: bytes,
            lan_ips: vec!["127.0.0.1".to_string()],
        }
    }
}

/// Xử lý một kết nối client HTTP CONNECT Tunnel tới Proxy Server
async fn handle_proxy_client(
    mut client: TcpStream,
    user: String,
    pass: String,
    _target_ipv6: Option<String>,
    byte_counter: Arc<AtomicU64>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let mut buf = vec![0u8; 4096];
    let n = client.read(&mut buf).await?;
    if n == 0 {
        return Ok(());
    }

    let req_str = String::from_utf8_lossy(&buf[..n]);

    // Bắt phương thức CONNECT host:port HTTP/1.1 (HTTPS Tunnel)
    if req_str.starts_with("CONNECT ") {
        let parts: Vec<&str> = req_str.split_whitespace().collect();
        if parts.len() < 2 {
            return Ok(());
        }

        let target_authority = parts[1]; // ví dụ: "example.com:443"

        // Kiểm tra User/Password nếu có
        if !user.is_empty() && !pass.is_empty() {
            let expected_auth = format!("{}:{}", user, pass);
            let encoded = hex::encode(expected_auth.as_bytes()); // hoặc base64
            if !req_str.contains("Proxy-Authorization") && !req_str.contains(&encoded) {
                client.write_all(b"HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm=\"Nexus\"\r\n\r\n").await?;
                return Ok(());
            }
        }

        // Kết nối siêu tốc ra server đích bằng Tokio TCP
        let mut target_stream = match TcpStream::connect(target_authority).await {
            Ok(s) => s,
            Err(_) => {
                client.write_all(b"HTTP/1.1 502 Bad Gateway\r\n\r\n").await?;
                return Ok(());
            }
        };

        // Báo kết nối thành công cho trình duyệt
        client.write_all(b"HTTP/1.1 200 Connection Established\r\n\r\n").await?;

        // Chuyển tiếp 2 chiều (Bidirectional Zero-Copy Streaming)
        let (mut client_rx, mut client_tx) = client.into_split();
        let (mut target_rx, mut target_tx) = target_stream.into_split();

        let b1 = byte_counter.clone();
        let client_to_target = async move {
            let copied = tokio::io::copy(&mut client_rx, &mut target_tx).await;
            if let Ok(c) = copied {
                b1.fetch_add(c, Ordering::Relaxed);
            }
        };

        let b2 = byte_counter.clone();
        let target_to_client = async move {
            let copied = tokio::io::copy(&mut target_rx, &mut client_tx).await;
            if let Ok(c) = copied {
                b2.fetch_add(c, Ordering::Relaxed);
            }
        };

        // Chạy song song 2 luồng I/O
        tokio::select! {
            _ = client_to_target => {},
            _ = target_to_client => {},
        }
    }

    Ok(())
}
