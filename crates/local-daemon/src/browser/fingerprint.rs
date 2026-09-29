use serde::{Deserialize, Serialize};

/// Cấu hình can thiệp vân tay Anti-detect (Chỉ áp dụng bên trong Chrome)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FingerprintConfig {
    pub user_agent: String,
    pub platform: String,
    pub canvas_noise: bool,
    pub webgl_vendor: String,
    pub webgl_renderer: String,
    pub audio_noise: bool,
    pub webrtc_mode: String, // "disabled" | "public_ip" | "altered"
    pub timezone: String,
    pub hardware_concurrency: u8,
    pub device_memory: u8,
}

impl Default for FingerprintConfig {
    fn default() -> Self {
        Self {
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36".to_string(),
            platform: "Win32".to_string(),
            canvas_noise: true,
            webgl_vendor: "Google Inc. (NVIDIA)".to_string(),
            webgl_renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)".to_string(),
            audio_noise: true,
            webrtc_mode: "disabled".to_string(),
            timezone: "Asia/Ho_Chi_Minh".to_string(),
            hardware_concurrency: 8,
            device_memory: 8,
        }
    }
}

pub struct FingerprintSpoofer;

impl FingerprintSpoofer {
    /// Sinh script JavaScript can thiệp vào trước khi trang web load (Pre-load / Page.addScriptToEvaluateOnNewDocument)
    pub fn generate_injection_script(config: &FingerprintConfig) -> String {
        format!(
            r#"(function() {{
                // 1. Ghi đè Navigator thông số phần cứng
                Object.defineProperty(navigator, 'webdriver', {{ get: () => undefined }});
                Object.defineProperty(navigator, 'platform', {{ get: () => '{}' }});
                Object.defineProperty(navigator, 'hardwareConcurrency', {{ get: () => {} }});
                Object.defineProperty(navigator, 'deviceMemory', {{ get: () => {} }});

                // 2. Can thiệp Canvas Fingerprint với độ lệch vi lượng
                if ({}) {{
                    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
                    HTMLCanvasElement.prototype.toDataURL = function(type) {{
                        const ctx = this.getContext('2d');
                        if (ctx) {{
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
                            ctx.fillRect(0, 0, 1, 1);
                        }}
                        return origToDataURL.apply(this, arguments);
                    }};
                }}

                // 3. Can thiệp WebGL Vendor & Renderer
                const getParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(param) {{
                    if (param === 37445) return '{}'; // UNMASKED_VENDOR_WEBGL
                    if (param === 37446) return '{}'; // UNMASKED_RENDERER_WEBGL
                    return getParameter.apply(this, arguments);
                }};
            }})();"#,
            config.platform,
            config.hardware_concurrency,
            config.device_memory,
            config.canvas_noise,
            config.webgl_vendor,
            config.webgl_renderer
        )
    }
}
