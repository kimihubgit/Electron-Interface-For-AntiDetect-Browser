use axum::{
    extract::State,
    response::Json,
    routing::post,
    Router,
};
use crate::models::{ApiResponse, ProxyConfigPayload};
use crate::AppState;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct TestProxyRequest {
    pub proxy: ProxyConfigPayload,
    pub timeout_ms: Option<u64>,
}

#[derive(Debug, Serialize)]
pub struct TestProxyResponse {
    pub success: bool,
    pub ping: u32,
    pub error: Option<String>,
}

pub fn router() -> Router<AppState> {
    Router::new().route("/test", post(test_proxy_handler))
}

async fn test_proxy_handler(
    State(state): State<AppState>,
    Json(payload): Json<TestProxyRequest>,
) -> Json<ApiResponse<TestProxyResponse>> {
    let timeout = payload.timeout_ms.unwrap_or(4000);
    let (success, ping, error) = state.proxy_service.test_proxy(payload.proxy, timeout).await;

    Json(ApiResponse::success(
        TestProxyResponse { success, ping, error },
        None,
    ))
}
