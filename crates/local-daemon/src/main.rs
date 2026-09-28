use axum::{
    extract::State,
    http::{HeaderValue, Method},
    response::Json,
    routing::get,
    Router,
};
use std::net::SocketAddr;
use std::time::Instant;
use tower_http::cors::CorsLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod models;
mod routes;
mod services;

use config::AppConfig;
use models::{ApiResponse, DaemonHealth};
use services::{BrowserManager, ProxyService, SynchronizerEngine, Ipv6ProxyServer};

#[derive(Clone)]
pub struct AppState {
    pub config: AppConfig,
    pub browser_manager: BrowserManager,
    pub sync_engine: SynchronizerEngine,
    pub proxy_service: ProxyService,
    pub ipv6_proxy_server: Ipv6ProxyServer,
    pub start_time: Instant,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new("info"))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = AppConfig::from_env();
    let addr = SocketAddr::from(([127, 0, 0, 1], config.port));

    let state = AppState {
        config: config.clone(),
        browser_manager: BrowserManager::new(),
        sync_engine: SynchronizerEngine::new(),
        proxy_service: ProxyService::new(),
        ipv6_proxy_server: Ipv6ProxyServer::new(),
        start_time: Instant::now(),
    };

    let cors = CorsLayer::new()
        .allow_origin(tower_http::cors::Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers(tower_http::cors::Any);

    let app = Router::new()
        .route("/api/v1/health", get(health_check_handler))
        .nest("/api/v1/browser", routes::browser::router())
        .nest("/api/v1/sync", routes::sync::router())
        .nest("/api/v1/proxy", routes::proxy::router())
        .nest("/api/v1/cloud", routes::cloud::router())
        .nest("/api/v1/ipv6", routes::ipv6::router())
        .layer(cors)
        .with_state(state);

    println!("======================================================");
    println!(" Nexus Local Core Daemon (Rust Engine) started!");
    println!(" Listening at: http://{}", addr);
    println!(" Connected to Cloud Server: {}", config.cloud_api_url);
    println!("======================================================");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<DaemonHealth>> {
    let uptime = state.start_time.elapsed().as_secs();
    let active_browsers = state.browser_manager.list_active().await.len();
    let sync_status = state.sync_engine.get_status().await;

    Json(ApiResponse::success(
        DaemonHealth {
            status: "online".to_string(),
            engine: "Rust Axum Native Core".to_string(),
            version: "1.0.0".to_string(),
            uptime_seconds: uptime,
            active_browsers,
            is_syncing: sync_status.is_syncing,
        },
        Some("Nexus Local Daemon is healthy and running"),
    ))
}
