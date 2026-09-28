use std::env;

#[derive(Debug, Clone)]
pub struct AppConfig {
    pub host: String,
    pub port: u16,
    pub cloud_api_url: String,
    pub secret_token: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        let host = env::var("DAEMON_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
        let port = env::var("DAEMON_PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(50325);
        let cloud_api_url = env::var("CLOUD_API_URL")
            .unwrap_or_else(|_| "http://127.0.0.1:8080".to_string());
        let secret_token = env::var("DAEMON_SECRET_KEY")
            .unwrap_or_else(|_| "nexus_antidetect_secret_signature_key_2026".to_string());

        Self {
            host,
            port,
            cloud_api_url,
            secret_token,
        }
    }
}
