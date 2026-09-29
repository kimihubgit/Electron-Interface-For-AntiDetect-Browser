/**
 * Centralized API & Server Configuration
 * Cấu hình chuẩn Local Daemon 127.0.0.1:50325 & Cloud API
 */
export const LOCAL_DAEMON_URL = (import.meta.env.VITE_LOCAL_DAEMON_URL || 'http://127.0.0.1:50325').replace(/\/$/, '');
// Trong môi trường Dev, dùng relative path để đi qua Vite proxy (tránh lỗi CORS)
export const CLOUD_API_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Mặc định các lệnh gọi Client API (Auth, Profiles, Plans...) hướng về Cloud Server
export const API_BASE_URL = CLOUD_API_URL;

export function getApiServerUrl() {
  return CLOUD_API_URL;
}

export function getCloudApiUrl() {
  return CLOUD_API_URL;
}

export function getLocalDaemonUrl() {
  return LOCAL_DAEMON_URL;
}

// Cấu hình mã hóa tầng ứng dụng (RSA-OAEP + AES-256-GCM)
export const ENABLE_API_ENCRYPTION = import.meta.env.VITE_ENABLE_API_ENCRYPTION !== 'false';
export const DEFAULT_SERVER_PUBLIC_KEY = import.meta.env.VITE_SERVER_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw/V2pW3eNS66qDcx53LS
Q70gyg1vtXH7MCr3FItEdbdBnSJDp5BjuR0pke/Y7Gn5tw6vL2mJfrJHm7HqfEaL
KB5o+w5T4fhTJ+D7e0cy5JwNjISeSgHQ9zUTnbqoN/t9TSf3mQAOMghyfzbhoiDE
nFg5eowITGEDP4GJVg3kAYt9rWq7LZJRaIg05rXTOp/lJAbra+sogix8LoV5maIR
H1TdgP9AZ1pI3Vjxiwu4DqoBCAt1iNSWPojy8g48sLJOE12SOh84gh9ImxJ/v/5t
7iUtvhEmKnVxWyGflLI0ijqBunEhkikZsNlFtSI4lKrzuNVd+zOioHCG0wLWWt53
EwIDAQAB
-----END PUBLIC KEY-----`;
