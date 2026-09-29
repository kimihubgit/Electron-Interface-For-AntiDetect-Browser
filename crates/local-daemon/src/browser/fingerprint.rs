use serde::{Deserialize, Serialize};
use std::path::Path;

/// Cấu hình can thiệp vân tay Anti-detect cấp độ Native Core C++ (Không dùng JS Injection)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FingerprintConfig {
    pub user_agent: String,
    pub platform: String,
    pub canvas_noise: bool,
    pub canvas_noise_seed: u32,
    pub webgl_vendor: String,
    pub webgl_renderer: String,
    pub audio_noise: bool,
    pub audio_noise_factor: f32,
    pub webrtc_mode: String, // "disable_non_proxied_udp" | "disabled" | "fake_public_ip"
    pub timezone: String,
    pub hardware_concurrency: u8,
    pub device_memory: u8,
    pub language: String,
}

impl Default for FingerprintConfig {
    fn default() -> Self {
        Self {
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36".to_string(),
            platform: "Win32".to_string(),
            canvas_noise: true,
            canvas_noise_seed: 849204,
            webgl_vendor: "Google Inc. (NVIDIA)".to_string(),
            webgl_renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)".to_string(),
            audio_noise: true,
            audio_noise_factor: 0.0001,
            webrtc_mode: "disable_non_proxied_udp".to_string(),
            timezone: "Asia/Ho_Chi_Minh".to_string(),
            hardware_concurrency: 8,
            device_memory: 8,
            language: "en-US,en;q=0.9".to_string(),
        }
    }
}

/// Bộ xử lý vân tay Native:
/// Tuyệt đối KHÔNG sử dụng Script Injection (Object.defineProperty, Page.addScriptToEvaluateOnNewDocument)
/// vì các hệ thống Bot Detection (Cloudflare Turnstile, DataDome, Kasada, CreepJS)
/// sẽ kiểm tra prototype, toString() và iframe bypass để phát hiện ngay lập tức.
/// 
/// Thay vào đó, toàn bộ thông số được truyền trực tiếp vào:
/// 1. Chromium Command-Line Native Flags (Chromium C++ Core Switches)
/// 2. Profile Preferences JSON (file Preferences gốc của Chromium)
pub struct NativeFingerprintEngine;

impl NativeFingerprintEngine {
    /// Chuyển đổi cấu hình vân tay thành các cờ dòng lệnh Native C++ truyền cho Chrome
    pub fn build_native_flags(config: &FingerprintConfig) -> Vec<String> {
        let mut flags = Vec::new();

        // 1. User Agent & Language cấp độ Network & Browser Core
        flags.push(format!("--user-agent={}", config.user_agent));
        flags.push(format!("--lang={}", config.language));

        // 2. Chặn hoàn toàn rò rỉ WebRTC IP thật (Native Chromium Policy)
        match config.webrtc_mode.as_str() {
            "disabled" => {
                flags.push("--disable-webrtc".to_string());
                flags.push("--enforce-webrtc-ip-permission-check".to_string());
            }
            _ => {
                // disable_non_proxied_udp: Chỉ cho phép WebRTC đi qua đường hầm Proxy đã cấu hình
                flags.push("--force-webrtc-ip-handling-policy=disable_non_proxied_udp".to_string());
            }
        }

        // 3. Native Custom Chromium Core Flags (Nếu sử dụng nhân Custom Chromium C++ như Orbita / SunBrowser)
        if config.canvas_noise {
            flags.push(format!("--fingerprint-canvas-seed={}", config.canvas_noise_seed));
            flags.push("--fingerprint-canvas-noise=1".to_string());
        }

        if !config.webgl_vendor.is_empty() {
            flags.push(format!("--fingerprint-webgl-vendor={}", config.webgl_vendor));
            flags.push(format!("--fingerprint-webgl-renderer={}", config.webgl_renderer));
        }

        if config.audio_noise {
            flags.push(format!("--fingerprint-audio-factor={}", config.audio_noise_factor));
        }

        flags.push(format!("--fingerprint-hardware-concurrency={}", config.hardware_concurrency));
        flags.push(format!("--fingerprint-device-memory={}", config.device_memory));
        flags.push(format!("--timezone={}", config.timezone));

        // 4. Tắt triệt để cờ Automation gốc của Chromium
        flags.push("--disable-blink-features=AutomationControlled".to_string());
        flags.push("--excludeSwitches=enable-automation".to_string());

        flags
    }

    /// Khởi tạo hoặc cập nhật file Preferences gốc của Chrome Profile trước khi khởi động
    /// Đây là cách các Antidetect hàng đầu ghi đè Geolocation, Timezone, Fonts, WebRTC một cách Native.
    pub async fn apply_profile_preferences(
        profile_dir: &Path,
        config: &FingerprintConfig,
    ) -> Result<(), std::io::Error> {
        let default_dir = profile_dir.join("Default");
        tokio::fs::create_dir_all(&default_dir).await?;

        let prefs_file = default_dir.join("Preferences");

        // Đọc Preferences cũ nếu có hoặc tạo mới
        let mut prefs_json: serde_json::Value = if prefs_file.exists() {
            let content = tokio::fs::read_to_string(&prefs_file).await.unwrap_or_default();
            serde_json::from_str(&content).unwrap_or_else(|_| serde_json::json!({}))
        } else {
            serde_json::json!({})
        };

        // Ghi đè cấu hình Native Preferences vào Chromium
        if let Some(obj) = prefs_json.as_object_mut() {
            obj.insert("intl.accept_languages".to_string(), serde_json::Value::String(config.language.clone()));
            obj.insert("webrtc.ip_handling_policy".to_string(), serde_json::Value::String("disable_non_proxied_udp".to_string()));
            obj.insert("webrtc.multiple_routes_enabled".to_string(), serde_json::Value::Bool(false));
            obj.insert("webrtc.nonproxied_udp_enabled".to_string(), serde_json::Value::Bool(false));
        }

        let serialized = serde_json::to_string_pretty(&prefs_json)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;

        tokio::fs::write(prefs_file, serialized).await?;
        Ok(())
    }
}

// Giữ lại alias để tương thích ngược nếu cần
pub type FingerprintSpoofer = NativeFingerprintEngine;
