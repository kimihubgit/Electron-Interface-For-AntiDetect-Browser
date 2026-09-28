use axum::{
    body::Bytes,
    extract::{Request, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Response},
    routing::any,
    Router,
};
use crate::AppState;
use hmac::{Hmac, Mac};
use sha2::Sha256;

pub fn router() -> Router<AppState> {
    Router::new().fallback(any(forward_to_cloud_handler))
}

async fn forward_to_cloud_handler(
    State(state): State<AppState>,
    req: Request,
) -> Response {
    let method = req.method().clone();
    let uri = req.uri().clone();
    let path = uri.path();
    let query = uri.query().map(|q| format!("?{}", q)).unwrap_or_default();
    
    // Đích đến là Cloud Backend Server thật
    let target_url = format!("{}{}{}", state.config.cloud_api_url, path, query);

    // Ký số HMAC xác thực với Cloud Server
    let timestamp = chrono::Utc::now().timestamp().to_string();
    let mut mac = Hmac::<Sha256>::new_from_slice(state.config.secret_token.as_bytes())
        .expect("HMAC can take key of any size");
    mac.update(format!("{}:{}", timestamp, path).as_bytes());
    let signature = hex::encode(mac.finalize().into_bytes());

    // Đọc body của request
    let (_parts, body) = req.into_parts();
    let bytes = match axum::body::to_bytes(body, usize::MAX).await {
        Ok(b) => b,
        Err(_) => return StatusCode::BAD_REQUEST.into_response(),
    };

    let client = reqwest::Client::new();
    let mut forward_req = client.request(method, &target_url)
        .header("X-Daemon-Timestamp", timestamp)
        .header("X-Daemon-Signature", signature)
        .header("Content-Type", "application/json");

    if !bytes.is_empty() {
        forward_req = forward_req.body(bytes);
    }

    match forward_req.send().await {
        Ok(resp) => {
            let status = StatusCode::from_u16(resp.status().as_u16()).unwrap_or(StatusCode::OK);
            let mut headers = HeaderMap::new();
            for (key, val) in resp.headers() {
                headers.insert(key.clone(), val.clone());
            }
            let resp_bytes = resp.bytes().await.unwrap_or(Bytes::new());
            (status, headers, resp_bytes).into_response()
        }
        Err(err) => {
            let error_json = serde_json::json!({
                "success": false,
                "error": format!("Không thể kết nối đến Cloud Server: {}", err)
            });
            (StatusCode::BAD_GATEWAY, axum::Json(error_json)).into_response()
        }
    }
}
