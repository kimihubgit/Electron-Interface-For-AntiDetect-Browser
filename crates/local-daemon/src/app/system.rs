//! SOFTWARE & SYSTEM LEVEL MONITOR (ĐỘC LẬP VỚI CHROME)
//! Quản lý tài nguyên máy tính, thông tin hệ điều hành, RAM, CPU Cores để phân bổ hồ sơ an toàn.

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub os_name: String,
    pub os_arch: String,
    pub logical_cpu_cores: usize,
    pub total_memory_mb: u64,
    pub available_memory_mb: u64,
    pub recommended_max_browsers: usize,
}

#[derive(Clone, Default)]
pub struct SystemMonitor;

impl SystemMonitor {
    pub fn new() -> Self {
        Self
    }

    /// Lấy chỉ số phần cứng hệ thống máy tính để gợi ý số lượng profile chạy đồng thời an toàn
    pub fn get_metrics(&self) -> SystemMetrics {
        let cpu_cores = num_cpus();
        
        // Ước lượng thông số hệ thống
        let total_memory_mb = 16384; // 16 GB baseline hoặc dynamic
        let available_memory_mb = 8192;
        
        // Mỗi Chrome profile trung bình tiêu tốn khoảng 350MB - 500MB RAM
        let recommended_max_browsers = (available_memory_mb / 450).clamp(2, 50) as usize;

        SystemMetrics {
            os_name: std::env::consts::OS.to_string(),
            os_arch: std::env::consts::ARCH.to_string(),
            logical_cpu_cores: cpu_cores,
            total_memory_mb,
            available_memory_mb,
            recommended_max_browsers,
        }
    }
}

fn num_cpus() -> usize {
    std::thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4)
}
