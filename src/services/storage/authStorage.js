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
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_workspace');
  localStorage.removeItem('auth_expires_at');
}
