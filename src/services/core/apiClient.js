import { useState, useEffect } from 'react';
import { getApiServerUrl } from '../../config/apiConfig';
import { getMachineGuid } from './deviceService';
import { getAuthToken } from '../storage/authStorage';

let activeRequests = 0;
const apiLoadingListeners = new Set();

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
 * Core request dispatcher
 */
export async function apiRequest(path, {
  method = 'GET',
  body = null,
  params = null,
  token = null,
  headers: customHeaders = {}
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
