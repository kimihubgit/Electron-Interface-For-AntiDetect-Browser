import { getApiServerUrl } from '../config/apiConfig';

const LOCAL_DAEMON_BASE = getApiServerUrl();

/**
 * Local Core Daemon REST Client
 * Tương thích chuẩn API Localhost của AdsPower, GoLogin
 */
export const localDaemonApi = {
  /**
   * Kiểm tra tình trạng sức khỏe của Local Daemon (127.0.0.1:50325)
   */
  async getHealth() {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Lấy danh sách Profile đang chạy
   */
  async getActiveBrowsers() {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/browser/active`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      return data?.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Khởi chạy trình duyệt qua Local Daemon
   */
  async launchBrowser(payload) {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/browser/launch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Dừng trình duyệt qua Local Daemon
   */
  async stopBrowser(profileId) {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/browser/stop/${profileId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Kích hoạt đồng bộ thao tác chuột/phím
   */
  async startSync(masterId, followerIds = []) {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/sync/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          master_id: masterId,
          follower_ids: followerIds
        })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Dừng đồng bộ thao tác
   */
  async stopSync() {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/sync/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Lấy trạng thái đồng bộ hiện tại
   */
  async getSyncStatus() {
    try {
      const res = await fetch(`${LOCAL_DAEMON_BASE}/api/v1/sync/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};

export default localDaemonApi;
