/**
 * Auth Token and Active Session LocalStorage Manager
 */

export function getAuthToken() {
  return localStorage.getItem('auth_token') || '';
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredWorkspace() {
  try {
    const raw = localStorage.getItem('auth_workspace');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession({ token, user, workspace, expires_at }) {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }

  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('auth_user');
  }

  if (workspace) {
    localStorage.setItem('auth_workspace', JSON.stringify(workspace));
  } else {
    localStorage.removeItem('auth_workspace');
  }

  if (expires_at) {
    localStorage.setItem('auth_expires_at', expires_at);
  } else {
    localStorage.removeItem('auth_expires_at');
  }
}

export function clearAuthSession() {
  // 1. Remove core authentication tokens and user state
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_workspace');
  localStorage.removeItem('auth_expires_at');
  localStorage.removeItem('antidetect_saved_accounts_v2');
  localStorage.removeItem('antidetect_saved_accounts_v1');
  localStorage.removeItem('conn_github');
  localStorage.removeItem('conn_google');

  // 2. Remove all cached user data from localStorage
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key && (
          key.startsWith('antidetect_profiles_') ||
          key.startsWith('antidetect_proxies_') ||
          key.startsWith('antidetect_workspaces_') ||
          key.startsWith('antidetect_custom_groups_') ||
          key.startsWith('antidetect_trash_profiles_') ||
          key.startsWith('antidetect_rotating_proxies_') ||
          key.startsWith('antidetect_dcom_devices_') ||
          key.startsWith('antidetect_active_ws_') ||
          key.startsWith('antidetect_open_ws_tabs_')
        )
      ) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error clearing user cache keys on logout:', e);
  }

  // 3. Clear session storage completely
  try {
    sessionStorage.clear();
  } catch (e) {
    console.warn('Error clearing sessionStorage:', e);
  }

  // 4. Clear all browser session cookies
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
