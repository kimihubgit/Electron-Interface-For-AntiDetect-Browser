//! BROWSER CORE DOMAIN
//! Chuyên trách mọi tác vụ can thiệp trực tiếp vào Chrome / Chromium:
//! 1. Quản lý tiến trình (Process Lifecycle: Spawn, Kill, PID, RAM/CPU)
//! 2. Cờ khởi động (Launch Flags: --user-data-dir, --proxy-server, --remote-debugging-port)
//! 3. Can thiệp vân tay Anti-detect (Canvas, WebGL, Audio, WebRTC, User-Agent)
//! 4. Kết nối giao thức Chrome DevTools Protocol (CDP)

pub mod process;
pub mod launch_flags;
pub mod fingerprint;
pub mod cdp;

pub use process::BrowserProcessManager;
pub use launch_flags::ChromeLaunchBuilder;
pub use fingerprint::{NativeFingerprintEngine, FingerprintConfig, FingerprintSpoofer};
pub use cdp::CdpController;
