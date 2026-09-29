/// Xây dựng danh sách flags khởi động chuẩn cho Chrome / Chromium
pub struct ChromeLaunchBuilder {
    pub profile_id: String,
    pub args: Vec<String>,
}

impl ChromeLaunchBuilder {
    pub fn new(profile_id: &str) -> Self {
        let mut builder = Self {
            profile_id: profile_id.to_string(),
            args: Vec::new(),
        };

        // Các flags bắt buộc để tách biệt hoàn toàn dữ liệu Profile
        builder.args.push(format!("--user-data-dir=profiles/{}", profile_id));
        builder.args.push("--no-first-run".to_string());
        builder.args.push("--no-default-browser-check".to_string());
        builder.args.push("--password-store=basic".to_string());

        builder
    }

    /// Cấp phát cổng Chrome DevTools Protocol
    pub fn with_cdp_port(mut self, port: u16) -> Self {
        self.args.push(format!("--remote-debugging-port={}", port));
        self
    }

    /// Định tuyến toàn bộ kết nối mạng của cửa sổ Chrome qua Proxy
    pub fn with_proxy(mut self, proxy_url: &str) -> Self {
        if !proxy_url.trim().is_empty() {
            self.args.push(format!("--proxy-server={}", proxy_url.trim()));
        }
        self
    }

    /// Xóa cờ robot WebDriver để qua mặt các hệ thống kiểm tra bot
    pub fn with_anti_automation(mut self) -> Self {
        self.args.push("--disable-blink-features=AutomationControlled".to_string());
        self.args.push("--excludeSwitches=enable-automation".to_string());
        self.args.push("--disable-features=IsolateOrigins,site-per-process".to_string());
        self
    }

    /// Giả lập kích thước cửa sổ hiển thị
    pub fn with_window_size(mut self, width: u32, height: u32) -> Self {
        self.args.push(format!("--window-size={},{}", width, height));
        self
    }

    /// Cấu hình ngôn ngữ hiển thị
    pub fn with_language(mut self, lang: &str) -> Self {
        self.args.push(format!("--lang={}", lang));
        self
    }

    pub fn build(self) -> Vec<String> {
        self.args
    }
}
