/**
 * Centralized API & Server Configuration
 * Cấu hình chuẩn Local Daemon 127.0.0.1:50325 & Cloud API
 */
export const LOCAL_DAEMON_URL = (import.meta.env.VITE_LOCAL_DAEMON_URL || 'http://127.0.0.1:50325').replace(/\/$/, '');
export const CLOUD_API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');

// Mặc định các lệnh gọi Client sẽ hướng về Local Daemon để bảo mật
export const API_BASE_URL = LOCAL_DAEMON_URL;

export function getApiServerUrl() {
  return LOCAL_DAEMON_URL;
}

export function getCloudApiUrl() {
  return CLOUD_API_URL;
}
