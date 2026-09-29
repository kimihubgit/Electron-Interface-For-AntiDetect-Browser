use axum::{
    extract::State,
    response::Json,
    routing::post,
    Router,
};
use crate::models::ApiResponse;
use crate::services::backup::{BackupConnectionRequest, BackupUploadRequest, BackupUploadResponse, ConnectionTestResponse};
use crate::AppState;

pub fn router() -> Router<AppState> {
    Router::new()
        .route("/test-connection", post(test_connection_handler))
        .route("/upload", post(upload_backup_handler))
}

async fn test_connection_handler(
    State(state): State<AppState>,
    Json(payload): Json<BackupConnectionRequest>,
) -> Json<ApiResponse<ConnectionTestResponse>> {
    match state.backup_service.test_connection(payload).await {
        Ok(res) => Json(ApiResponse::success(res, Some("Kiểm tra kết nối thành công"))),
        Err(err) => Json(ApiResponse::error(&err)),
    }
}

async fn upload_backup_handler(
    State(state): State<AppState>,
    Json(payload): Json<BackupUploadRequest>,
) -> Json<ApiResponse<BackupUploadResponse>> {
    match state.backup_service.upload_backup(payload).await {
        Ok(res) => Json(ApiResponse::success(res, Some("Tải lên bản sao lưu thành công"))),
        Err(err) => Json(ApiResponse::error(&err)),
    }
}
