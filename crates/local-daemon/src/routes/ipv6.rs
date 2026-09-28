use axum::{
    extract::State,
    response::Json,
    routing::{get, post},
    Router,
};
use crate::models::ApiResponse;
use crate::services::ipv6_proxy_server::{LocalProxyStatus, StartLocalProxyPayload};
use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/start", post(start_handler))
        .route("/stop", post(stop_handler))
        .route("/status", get(status_handler))
}

async fn start_handler(
    State(state): State<AppState>,
    Json(payload): Json<StartLocalProxyPayload>,
) -> Json<ApiResponse<LocalProxyStatus>> {
    match state.ipv6_proxy_server.start(payload).await {
        Ok(status) => Json(ApiResponse::success(status, Some("Đã khởi động Máy Chủ Proxy Rust"))),
        Err(err) => Json(ApiResponse::error(&err)),
    }
}

async fn stop_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<LocalProxyStatus>> {
    let status = state.ipv6_proxy_server.stop().await;
    Json(ApiResponse::success(status, Some("Đã dừng Máy Chủ Proxy Rust")))
}

async fn status_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<LocalProxyStatus>> {
    let status = state.ipv6_proxy_server.get_status().await;
    Json(ApiResponse::success(status, None))
}
