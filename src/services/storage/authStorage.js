/**
 * Auth Token and Active Session Secure Storage Manager
 * Mã hóa AES-256 + Ký số HMAC phần cứng máy tính chống can thiệp file LevelDB trên Windows.
 */

import { secureGet, secureSet, secureRemove } from '../../utils/secureStorage';

export function getAuthToken() {
  return secureGet('auth_token', '') || '';
}

export function getRefreshToken() {
  return secureGet('auth_refresh_token', '') || '';
}

export function getStoredUser() {
  return secureGet('auth_user', null);
}

export function getStoredWorkspace() {
  return secureGet('auth_workspace', null);
}

export function setAuthSession({ token, access_token, refresh_token, user, workspace, expires_at, refresh_expires_at }) {
  const tokenVal = access_token || token;
  if (tokenVal) {
    secureSet('auth_token', tokenVal);
  } else {
    secureRemove('auth_token');
  }

  if (refresh_token) {
    secureSet('auth_refresh_token', refresh_token);
  } else if (refresh_token === null) {
    secureRemove('auth_refresh_token');
  }

  if (user) {
    secureSet('auth_user', user);
  } else {
    secureRemove('auth_user');
  }

  if (workspace) {
    secureSet('auth_workspace', workspace);
  } else {
    secureRemove('auth_workspace');
  }

  if (expires_at) {
    secureSet('auth_expires_at', expires_at);
  } else {
    secureRemove('auth_expires_at');
  }

  if (refresh_expires_at) {
    secureSet('auth_refresh_expires_at', refresh_expires_at);
  } else if (refresh_expires_at === null) {
    secureRemove('auth_refresh_expires_at');
  }
}

export function clearAuthSession() {
  // 1. Remove active session tokens and user state
  secureRemove('auth_token');
  secureRemove('auth_refresh_token');
  secureRemove('auth_refresh_expires_at');
  secureRemove('auth_user');
  secureRemove('auth_workspace');
  secureRemove('auth_expires_at');
  secureRemove('conn_github');
  secureRemove('conn_google');

  // 2. Clear session storage completely
  try {
    sessionStorage.clear();
  } catch (e) {
    console.warn('Error clearing sessionStorage:', e);
  }

  // 3. Clear all browser session cookies
  try {
    if (typeof document !== 'undefined' && document.cookie) {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
          if (typeof window !== 'undefined' && window.location) {
            const host = window.location.hostname;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${host};`;
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${host};`;
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error clearing cookies on logout:', e);
  }
}
