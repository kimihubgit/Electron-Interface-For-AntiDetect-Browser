use super::traits::{BackupUploadResponse, ConnectionTestResponse, StorageProvider};
use async_trait::async_trait;
use reqwest::multipart::{Form, Part};
use serde_json::Value;
use std::time::Instant;

pub struct TelegramStorageProvider {
    pub bot_token: String,
    pub chat_id: String,
}

impl TelegramStorageProvider {
    pub fn new(bot_token: String, chat_id: String) -> Self {
        Self {
            bot_token: bot_token.trim().to_string(),
            chat_id: chat_id.trim().to_string(),
        }
    }
}

#[async_trait]
impl StorageProvider for TelegramStorageProvider {
    async fn test_connection(&self) -> Result<ConnectionTestResponse, String> {
        if self.bot_token.is_empty() {
            return Err("Telegram Bot Token không được để trống!".to_string());
        }
        if self.chat_id.is_empty() {
            return Err("Chat ID hoặc Channel ID không được để trống!".to_string());
        }

        let start = Instant::now();
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(6))
            .build()
            .map_err(|e| e.to_string())?;

        // 1. Verify Bot Token with getMe
        let get_me_url = format!("https://api.telegram.org/bot{}/getMe", self.bot_token);
        let me_resp = client
            .get(&get_me_url)
            .send()
            .await
            .map_err(|e| format!("Không thể kết nối tới Telegram API: {}", e))?;

        let me_json: Value = me_resp.json().await.map_err(|e| e.to_string())?;
        if !me_json["ok"].as_bool().unwrap_or(false) {
            let desc = me_json["description"].as_str().unwrap_or("Bot Token không hợp lệ");
            return Err(format!("Lỗi Telegram Bot: {}", desc));
        }

        let bot_user = me_json["result"]["username"].as_str().unwrap_or("Bot");

        // 2. Verify target chat/channel with getChat
        let get_chat_url = format!(
            "https://api.telegram.org/bot{}/getChat?chat_id={}",
            self.bot_token,
            urlencoding::encode(&self.chat_id)
        );
        let chat_resp = client
            .get(&get_chat_url)
            .send()
            .await
            .map_err(|e| format!("Lỗi xác thực Chat Telegram: {}", e))?;

        let chat_json: Value = chat_resp.json().await.map_err(|e| e.to_string())?;
        if !chat_json["ok"].as_bool().unwrap_or(false) {
            let desc = chat_json["description"].as_str().unwrap_or("Không tìm thấy Chat ID");
            return Err(format!(
                "Bot @{} hợp lệ nhưng không thể truy cập Chat ID '{}': {}. Vui lòng thêm Bot làm Quản trị viên (Admin) của kênh/nhóm.",
                bot_user, self.chat_id, desc
            ));
        }

        let chat_title = chat_json["result"]["title"]
            .as_str()
            .or_else(|| chat_json["result"]["username"].as_str())
            .unwrap_or(&self.chat_id);

        let ping_ms = start.elapsed().as_millis() as u64;

        Ok(ConnectionTestResponse {
            success: true,
            ping_ms,
            message: format!(
                "Kết nối thành công tới Bot @{} -> Đích đến: '{}' (Ping: {}ms)",
                bot_user, chat_title, ping_ms
            ),
            details: Some(serde_json::json!({
                "bot": bot_user,
                "chat_title": chat_title,
                "chat_id": self.chat_id
            })),
        })
    }

    async fn upload_backup(&self, filename: &str, data: &[u8]) -> Result<BackupUploadResponse, String> {
        let client = reqwest::Client::builder()
            .timeout(std::time::Duration::from_secs(45))
            .build()
            .map_err(|e| e.to_string())?;

        let url = format!("https://api.telegram.org/bot{}/sendDocument", self.bot_token);

        let part = Part::bytes(data.to_vec())
            .file_name(filename.to_string())
            .mime_str("application/octet-stream")
            .map_err(|e| e.to_string())?;

        let caption = format!(
            "📦 **Sao lưu Antidetect Browser (Rust Native Daemon)**\n📁 Tệp: `{}`\n⏰ Lúc: {}",
            filename,
            chrono::Local::now().format("%Y-%m-%d %H:%M:%S")
        );

        let form = Form::new()
            .text("chat_id", self.chat_id.clone())
            .text("caption", caption)
            .text("parse_mode", "Markdown")
            .part("document", part);

        let resp = client
            .post(&url)
            .multipart(form)
            .send()
            .await
            .map_err(|e| format!("Lỗi gửi tài liệu lên Telegram: {}", e))?;

        let json: Value = resp.json().await.map_err(|e| e.to_string())?;

        if !json["ok"].as_bool().unwrap_or(false) {
            let desc = json["description"].as_str().unwrap_or("Tải lên thất bại");
            return Err(format!("Lỗi Telegram API: {}", desc));
        }

        let msg_id = json["result"]["message_id"].as_i64().unwrap_or(0);
        let file_id = json["result"]["document"]["file_id"]
            .as_str()
            .unwrap_or("")
            .to_string();

        Ok(BackupUploadResponse {
            success: true,
            file_id: if file_id.is_empty() { msg_id.to_string() } else { file_id },
            file_url: Some(format!("https://t.me/c/{}/{}", self.chat_id.trim_start_matches("-100"), msg_id)),
            size_bytes: data.len(),
            message: format!("Đã gửi file sao lưu lên Telegram thành công (Msg #{})", msg_id),
        })
    }
}
