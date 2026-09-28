use axum::{
    extract::State,
    response::Json,
    routing::{get, post},
    Router,
};
use crate::models::{ApiResponse, StartSyncPayload, SyncStatusInfo};
use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/start", post(start_sync_handler))
        .route("/stop", post(stop_sync_handler))
        .route("/status", get(status_sync_handler))
}

async fn start_sync_handler(
    State(state): State<AppState>,
    Json(payload): Json<StartSyncPayload>,
) -> Json<ApiResponse<SyncStatusInfo>> {
    match state.sync_engine.start_sync(payload).await {
        Ok(status) => Json(ApiResponse::success(status, Some("Đã bắt đầu đồng bộ thao tác"))),
        Err(err) => Json(ApiResponse::error(&err)),
    }
}

async fn stop_sync_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<SyncStatusInfo>> {
    let status = state.sync_engine.stop_sync().await;
    Json(ApiResponse::success(status, Some("Đã dừng đồng bộ thao tác")))
}

async fn status_sync_handler(
    State(state): State<AppState>,
) -> Json<ApiResponse<SyncStatusInfo>> {
    let status = state.sync_engine.get_status().await;
    Json(ApiResponse::success(status, None))
}
