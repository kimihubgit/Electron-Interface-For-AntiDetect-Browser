//! APP & SOFTWARE DOMAIN (KHÔNG LIÊN QUAN ĐẾN CHROME)
//! Toàn bộ logic nghiệp vụ cấp phần mềm ứng dụng:
//! 1. Sao lưu & Đồng bộ đám mây (Google Drive, Telegram Storage, AWS S3, mã hóa AES-256)
//! 2. Bộ điều khiển đồng bộ thao tác chuột/phím đa cửa sổ OS (Synchronizer Engine)
//! 3. Giám sát tài nguyên phần cứng máy tính (RAM, CPU Cores, giới hạn an toàn)

pub mod synchronizer;
pub mod system;

pub use synchronizer::SynchronizerEngine;
pub use system::{SystemMonitor, SystemMetrics};
pub use crate::services::backup::{BackupService, StorageProvider};
