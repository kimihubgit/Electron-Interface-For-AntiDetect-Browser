import { useState, useEffect } from 'react';
import { getApiServerUrl } from '../../config/apiConfig';
import { getMachineGuid } from './deviceService';
import {
  getAuthToken,
  getRefreshToken,
  getStoredUser,
  getStoredWorkspace,
  setAuthSession,
  clearAuthSession
} from '../storage/authStorage';
import { saveAccountSession } from '../storage/accountStorage';

let activeRequests = 0;
const apiLoadingListeners = new Set();
let refreshPromise = null;

function notifyApiLoading() {
  const isLoading = activeRequests > 0;
  apiLoadingListeners.forEach(fn => {
    try {
      fn(isLoading);
    } catch {}
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-api-loading', { detail: { isLoading, count: activeRequests } }));
  }
}

export function subscribeApiLoading(callback) {
  apiLoadingListeners.add(callback);
  callback(activeRequests > 0);
  return () => apiLoadingListeners.delete(callback);
}

export function useApiLoading() {
  const [isLoading, setIsLoading] = useState(activeRequests > 0);
  useEffect(() => {
    return subscribeApiLoading(setIsLoading);
  }, []);
  return isLoading;
}

export function getActiveWorkspaceId() {
  try {
    const direct = localStorage.getItem('antidetect_active_ws_id');
    if (direct) return direct;
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      const parsed = JSON.parse(authUser);
      if (parsed?.workspace?.id) return parsed.workspace.id;
    }
  } catch {}
  return '';
}

/**
 * Execute silent refresh with token rotation (Only 1 refresh request at a time)
 */
async function executeTokenRefresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const serverUrl = getApiServerUrl();
  const hwid = getMachineGuid();

  try {
    const res = await fetch(`${serverUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Machine-GUID': hwid
      },
      body: JSON.stringify({ refresh_token: refreshToken, hwid })
    });

    const data = await res.json();
    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Token refresh failed');
    }

    const payload = data.data || {};
    const newAccessToken = payload.access_token || payload.token;
    const newRefreshToken = payload.refresh_token;
    const expiresAt = payload.expires_at || '';
    const refreshExpiresAt = payload.refresh_expires_at || '';

    if (newAccessToken) {
      const user = getStoredUser();
      const ws = getStoredWorkspace();

      setAuthSession({
        token: newAccessToken,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        user,
        workspace: ws,
        expires_at: expiresAt,
        refresh_expires_at: refreshExpiresAt
      });

      saveAccountSession({
        user,
        token: newAccessToken,
        workspace: ws,
        expires_at: expiresAt
      });

      return newAccessToken;
    }
  } catch (err) {
    console.warn('[apiClient] Refresh token failed or expired:', err.message);
    clearAuthSession();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app-auth-unauthorized', { detail: { message: err.message } }));
    }
    return null;
  }
  return null;
}

/**
 * Build standard headers for all requests
 */
export function getApiHeaders(tokenOverride = null, customHeaders = {}) {
  let token = null;
  if (tokenOverride === false) {
    token = null;
  } else if (typeof tokenOverride === 'string' && tokenOverride.trim()) {
    token = tokenOverride.trim();
  } else {
    token = getAuthToken();
  }
  const wsId = getActiveWorkspaceId();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Machine-GUID': getMachineGuid(),
    'X-App-Version': '2.1.0',
    'X-Platform': 'windows',
    ...(wsId ? { 'X-Workspace-Id': wsId } : {}),
    ...customHeaders
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Core request dispatcher with automatic silent token refresh on 401
 */
export async function apiRequest(path, {
  method = 'GET',
  body = null,
  params = null,
  token = null,
  headers: customHeaders = {},
  skipAuthRefresh = false
} = {}) {
  const serverUrl = getApiServerUrl();
  let fullUrl = path.startsWith('http') ? path : `${serverUrl}${path.startsWith('/') ? '' : '/'}${path}`;

  if (params && typeof params === 'object') {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        urlParams.append(key, String(val));
      }
    });
    const queryString = urlParams.toString();
    if (queryString) {
      fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  const reqHeaders = getApiHeaders(token, customHeaders);
  const options = {
    method,
    headers: reqHeaders
  };

  if (body !== null && body !== undefined && method !== 'GET' && method !== 'HEAD') {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  activeRequests++;
  notifyApiLoading();

  try {
    const res = await fetch(fullUrl, options);
    let data;
    try {
      data = await res.json();
    } catch {
      data = { status: res.ok ? 'success' : 'error', message: res.statusText };
    }

    // 401 Unauthorized: Attempt silent refresh with Token Rotation and retry original request
    const isAuthEndpoint = path.includes('/auth/login') || path.includes('/auth/refresh') || path.includes('/auth/register');
    if (res.status === 401 && !skipAuthRefresh && !isAuthEndpoint && getRefreshToken()) {
      if (!refreshPromise) {
        refreshPromise = executeTokenRefresh().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshedToken = await refreshPromise;
      if (refreshedToken) {
        // Silently retry the original request with the fresh rotated token
        return apiRequest(path, {
          method,
          body,
          params,
          token: refreshedToken,
          headers: customHeaders,
          skipAuthRefresh: true
        });
      }
    }

    // 409 Conflict (e.g. Profile locked on another machine)
    if (res.status === 409) {
      return {
        ok: false,
        status: 409,
        conflict: true,
        code: data?.error?.code || 'CONFLICT',
        message: data?.error?.message || data?.message || 'Tài nguyên đang bị xung đột hoặc đang chạy ở máy khác',
        error: data?.error || data
      };
    }

    if (!res.ok || data.status === 'error') {
      return {
        ok: false,
        status: res.status,
        code: data?.error?.code || 'API_ERROR',
        message: data?.error?.message || data?.message || `Yêu cầu thất bại (${res.status})`,
        error: data?.error || data,
        data: data?.data
      };
    }

    return {
      ok: true,
      status: res.status,
      message: data.message,
      data: data.data !== undefined ? data.data : data
    };
  } catch (err) {
    console.warn(`[apiClient] Request to ${path} failed:`, err.message);
    return {
      ok: false,
      status: 0,
      networkError: true,
      message: err.message || 'Lỗi kết nối tới máy chủ',
      error: err
    };
  } finally {
    activeRequests = Math.max(0, activeRequests - 1);
    notifyApiLoading();
  }
}

export const apiClient = {
  get: (path, params, options = {}) => apiRequest(path, { ...options, method: 'GET', params }),
  post: (path, body, options = {}) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => apiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, body, options = {}) => apiRequest(path, { ...options, method: 'DELETE', body })
};
