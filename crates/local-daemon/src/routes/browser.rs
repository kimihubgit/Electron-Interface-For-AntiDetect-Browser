use axum::{
    extract::{Path, State},
    response::Json,
    routing::{get, post},
    Router,
};
use crate::models::{ApiResponse, LaunchBrowserPayload, RunningProfileInfo};
use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/launch", post(launch_handler))
        .route("/stop/:id", post(stop_handler))
        .route("/active", get(active_handler))
}

async fn launch_handler(
    State(state): State<AppState>,
    Json(payload): Json<LaunchBrowserPayload>,
) -> Json<ApiResponse<RunningProfileInfo>> {
    match state.browser_manager.launch_profile(payload).await {
        Ok(info) => Json(ApiResponse::success(info, Some("Khởi chạy trình duyệt thành công"))),
        Err(err) => Json(ApiResponse::error(&err)),
    }
}

async fn stop_handler(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Json<ApiResponse<bool>> {
    let stopped = state.browser_manager.stop_profile(&id).await;
    if stopped {
        Json(ApiResponse::success(true, Some("Đã dừng trình duyệt")))
    } else {
        Json(ApiResponse::error("Không tìm thấy trình duyệt đang chạy"))
    }
}

async fn active_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<Vec<RunningProfileInfo>>> {
    let list = state.browser_manager.list_active().await;
    Json(ApiResponse::success(list, None))
}
