import { apiClient } from '../core/apiClient';
import { getStoredUser } from '../storage/authStorage';

/**
 * Notifications API Service
 * Endpoint: /api/v1/notifications
 * Method: GET
 *
 * Authentication (Flexible):
 * - Unauthenticated (Guest / Login / Splash): No token sent -> Server returns public system notifications (user_id == null).
 * - Authenticated: Header 'Authorization: Bearer <token>' sent -> Server returns merged system + account-specific notifications.
 */

const NOTIFICATIONS_CACHE_PREFIX = 'antidetect_notifications_cache_';

/**
 * Filter notifications to keep only active (non-expired) ones
 * @param {Array} list
 * @returns {Array}
 */
export function filterActiveNotifications(list) {
  if (!Array.isArray(list)) return [];
  const now = Date.now();
  return list.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    if (item.expires_at) {
      const expTime = new Date(item.expires_at).getTime();
      if (!isNaN(expTime) && expTime <= now) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Retrieve cached notifications from localStorage
 * @param {string|null} userKey
 * @returns {Array}
 */
export function getCachedNotifications(userKey = null) {
  try {
    const key = `${NOTIFICATIONS_CACHE_PREFIX}${userKey || 'guest'}`;
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return filterActiveNotifications(parsed);
  } catch {
    return [];
  }
}

/**
 * Persist notifications to localStorage cache
 * @param {Array} list
 * @param {string|null} userKey
 */
export function setCachedNotifications(list, userKey = null) {
  try {
    const key = `${NOTIFICATIONS_CACHE_PREFIX}${userKey || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.warn('[notificationApi] Failed to save notifications cache:', e);
  }
}

/**
 * Fetch list of valid notifications from backend
 * @param {string|boolean|null} tokenOverride Explicit token string, false to force guest (no token), or null to auto-detect
 * @returns {Promise<{ ok: boolean, success: boolean, data: Array, message?: string }>}
 */
export async function getNotificationsApi(tokenOverride = null) {
  const currentUser = getStoredUser();
  const currentKey = currentUser?.id || 'guest';

  try {
    const res = await apiClient.get('/api/v1/notifications', null, { token: tokenOverride });
    
    if (!res.ok) {
      const cached = getCachedNotifications(currentKey);
      return {
        ok: false,
        success: false,
        data: cached,
        message: res.message || 'Không thể tải thông báo'
      };
    }

    // apiClient unwraps res.data, which can be the array directly or inside { data: [...] }
    let rawList = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      rawList = res.data.data;
    } else if (res.data?.notifications && Array.isArray(res.data.notifications)) {
      rawList = res.data.notifications;
    }

    const activeList = filterActiveNotifications(rawList);
    setCachedNotifications(activeList, currentKey);

    return {
      ok: true,
      success: true,
      data: activeList
    };
  } catch (err) {
    console.warn('[notificationApi] getNotifications error:', err.message);
    const cached = getCachedNotifications(currentKey);
    return {
      ok: false,
      success: false,
      data: cached,
      message: err.message
    };
  }
}

/**
 * Create a new notification (optional admin/testing tool)
 * @param {Object} payload { title, message, tab_type, expires_at }
 * @param {string|null} tokenOverride
 */
export async function createNotificationApi(payload, tokenOverride = null) {
  try {
    const res = await apiClient.post('/api/v1/notifications', payload, { token: tokenOverride });
    return res;
  } catch (err) {
    console.warn('[notificationApi] createNotification error:', err.message);
    return { ok: false, success: false, message: err.message };
  }
}
