/**
 * Authentication REST API Service
 * Handles user login, registration, logout, profile info, password resets, and account deletion.
 */
import { getApiServerUrl } from '../../config/apiConfig';
import { apiClient } from '../core/apiClient';
import { getOrCreateHwid, getDeviceName } from '../core/deviceService';
import { getAuthToken, setAuthSession } from '../storage/authStorage';
import { saveAccountSession } from '../storage/accountStorage';

/**
 * 1. Register API (POST /api/v1/auth/register)
 */
export async function registerWithApi({ email, username, password, full_name = '' }) {
  const cleanEmail = (email || '').trim();
  const cleanUsername = (username || '').trim();
  const hwid = getOrCreateHwid();
  const deviceName = getDeviceName();

  const res = await apiClient.post('/api/v1/auth/register', {
    email: cleanEmail,
    username: cleanUsername,
    password,
    full_name: (full_name || '').trim(),
    hwid,
    device_name: deviceName
  });

  if (!res.ok) {
    return {
      success: false,
      message: res.message || 'Đăng ký tài khoản không thành công'
    };
  }

  const payload = res.data || {};
  const token = payload.token;
  const user = payload.user || {
    id: `usr_${Date.now()}`,
    username: cleanUsername,
    email: cleanEmail,
    full_name: full_name || cleanUsername
  };
  const workspace = payload.workspace || null;

  if (token) {
    setAuthSession({
      token,
      user,
      workspace,
      expires_at: payload.expires_at || ''
    });
    saveAccountSession({
      user,
      token,
      workspace,
      expires_at: payload.expires_at || ''
    });
  }

  return {
    success: true,
    message: res.message || 'Đăng ký thành công',
    token,
    user,
    workspace
  };
}

/**
 * 2. Login API (POST /api/v1/auth/login)
 */
export async function loginWithApi(arg1, arg2, arg3) {
  let loginVal = '';
  let passwordVal = '';
  let hwidVal = '';
  let deviceNameVal = '';
  let code2faVal = '';

  if (typeof arg1 === 'object' && arg1 !== null) {
    loginVal = arg1.login || arg1.identifier || arg1.email || arg1.username || '';
    passwordVal = arg1.password || '';
    hwidVal = arg1.hwid || '';
    deviceNameVal = arg1.device_name || '';
    code2faVal = arg1.code_2fa || arg1.code2fa || '';
  } else {
    loginVal = arg1 || '';
    passwordVal = arg2 || '';
    code2faVal = arg3 || '';
  }

  loginVal = loginVal.trim();
  if (!hwidVal) hwidVal = getOrCreateHwid();
  if (!deviceNameVal) deviceNameVal = getDeviceName();

  const res = await apiClient.post('/api/v1/auth/login', {
    login: loginVal,
    password: passwordVal,
    hwid: hwidVal,
    device_name: deviceNameVal,
    code_2fa: code2faVal || ''
  });

  if (res.code === 'REQUIRES_2FA' || res.error?.requires_2fa || res.data?.requires_2fa) {
    return {
      success: false,
      requires2fa: true,
      message: 'Tài khoản yêu cầu mã xác thực 2FA'
    };
  }

  if (!res.ok) {
    return {
      success: false,
      message: res.message || 'Mật khẩu hoặc tài khoản không chính xác',
      error: res.error
    };
  }

  const payload = res.data || {};
  const token = payload.token;
  const expiresAt = payload.expires_at || '';

  if (token) {
    // Gọi user info để hoàn thiện thông tin
    const infoRes = await getUserInfoApi(token);
    if (infoRes.success && infoRes.user) {
      saveAccountSession({
        user: infoRes.user,
        token,
        workspace: infoRes.workspace,
        expires_at: expiresAt
      });
      return {
        success: true,
        message: res.message || 'Đăng nhập thành công',
        data: payload,
        user: infoRes.user,
        workspace: infoRes.workspace,
        token
      };
    }
  }

  const fallbackUser = {
    username: loginVal,
    name: loginVal.split('@')[0],
    email: loginVal.includes('@') ? loginVal : `${loginVal}@antidetect.io`
  };

  setAuthSession({
    token,
    user: fallbackUser,
    workspace: null,
    expires_at: expiresAt
  });
  saveAccountSession({
    user: fallbackUser,
    token,
    workspace: null,
    expires_at: expiresAt
  });

  return {
    success: true,
    message: res.message || 'Đăng nhập thành công',
    data: payload,
    user: fallbackUser,
    workspace: null,
    token
  };
}

/**
 * 3. Get User Profile (GET /api/v1/auth/me)
 */
export async function getAuthMeApi(tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  if (!token) return { success: false, message: 'Missing token' };

  const res = await apiClient.get('/api/v1/auth/me', null, { token });
  if (!res.ok) {
    return { success: false, message: res.message, statusCode: res.status };
  }

  return {
    success: true,
    data: res.data,
    user: res.data
  };
}

export const getCurrentUserApi = getAuthMeApi;

/**
 * 4. Get User Info & Workspace Profile (GET /api/v1/user/info & /api/v1/auth/me)
 */
export async function getUserInfoApi(tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  if (!token) return { success: false, message: 'Missing token' };

  const serverUrl = getApiServerUrl();
  try {
    const [infoRes, meRes] = await Promise.all([
      fetch(`${serverUrl}/api/v1/user/info`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      }),
      fetch(`${serverUrl}/api/v1/auth/me`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }
      }).catch(() => null)
    ]);

    const data = await infoRes.json();
    if (!infoRes.ok || (data.code !== undefined && data.code !== 20000 && data.status === 'error')) {
      return { success: false, message: data.message || 'Không thể lấy thông tin người dùng' };
    }

    const info = data.result || data.data || {};
    let meData = {};
    if (meRes && meRes.ok) {
      try {
        const meJson = await meRes.json();
        meData = meJson.data || {};
      } catch { }
    }

    const user = {
      id: meData.id || info.id || info.belongUserId || '',
      username: meData.username || info.userName || info.username || '',
      name: meData.full_name || info.userName || (info.email ? info.email.split('@')[0] : 'Người dùng'),
      full_name: meData.full_name || info.userName || '',
      email: meData.email || info.email || '',
      role: meData.role || info.roleId || 'owner',
      role_name: meData.role_name || info.roleName || 'Administrators',
      roleId: info.roleId || meData.role || 'owner',
      roleName: info.roleName || meData.role_name || 'Administrators',
      is_active: meData.is_active ?? true,
      default_workspace_id: meData.default_workspace_id || info.belongUserId || '',
      two_factor_enabled: meData.two_factor_enabled ?? false,
      timeZone: meData.time_zone || info.timeZone || 'Asia/Saigon',
      language: info.language || 'en',
      packageId: info.packageId || 'plan_free',
      packageName: info.packageName || 'Free Starter',
      packageStartTime: info.packageStartTime || '',
      packageEndTime: info.packageEndTime || '',
      addBrowsersCount: info.addBrowsersCount ?? 5,
      alreadyAddBrowsersCount: info.alreadyAddBrowsersCount ?? 0,
      canAddBrowsersCount: info.canAddBrowsersCount ?? 5,
      canAddUsers: info.canAddUsers ?? 1,
      alreadyAddUsers: info.alreadyAddUsers ?? 0,
      browserOpenCountMax: info.browserOpenCountMax ?? 50,
      browserOpenCount: info.browserOpenCount ?? 0,
      browserPreOpenCountMax: info.browserPreOpenCountMax ?? 5,
      menuCodes: Array.isArray(info.menuCodes) ? info.menuCodes : [],
      ossEndpoint: info.ossEndpoint || '',
      ossConf: info.ossConf || null
    };

    const workspace = {
      id: info.belongUserId || meData.default_workspace_id || info.id || 'default_ws',
      name: `${user.name}'s Workspace`,
      plan_id: info.packageId || 'plan_free',
      plan_name: info.packageName || 'Free Starter',
      max_profiles: info.addBrowsersCount ?? 5,
      used_profiles: info.alreadyAddBrowsersCount ?? 0,
      remaining_profiles: info.canAddBrowsersCount ?? 5,
      max_concurrent: info.browserOpenCountMax ?? 50,
      ossEndpoint: info.ossEndpoint || '',
      ossConf: info.ossConf || null
    };

    user.workspace = workspace;
    setAuthSession({ token, user, workspace, expires_at: localStorage.getItem('auth_expires_at') || '' });

    return {
      success: true,
      user,
      workspace
    };
  } catch (err) {
    return { success: false, message: err.message };
  }
}

/**
 * 5. Logout API (POST /api/v1/auth/logout)
 */
export async function logoutWithApi(tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  if (token) {
    try {
      await apiClient.post('/api/v1/auth/logout', null, { token });
    } catch { }
  }
  return { success: true, message: 'Logged out successfully' };
}

/**
 * 6. Switch Workspace API (POST /api/v1/workspaces/{id}/switch)
 */
export async function switchWorkspaceApi(workspaceId, tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  const res = await apiClient.post(`/api/v1/workspaces/${workspaceId}/switch`, { workspace_id: workspaceId }, { token });
  if (!res.ok) {
    return { success: false, message: res.message || 'Không thể chuyển workspace' };
  }

  const newToken = res.data?.token || token;
  const workspace = res.data?.workspace || null;
  if (newToken) {
    localStorage.setItem('auth_token', newToken);
  }
  return { success: true, token: newToken, workspace, message: res.message };
}

/**
 * 6.1. Get Workspaces List (GET /api/v1/workspaces)
 */
export async function getWorkspacesApi(tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  const res = await apiClient.get('/api/v1/workspaces', {}, { token });
  if (!res.ok) {
    return { success: false, message: res.message || 'Không thể tải danh sách workspace', workspaces: [] };
  }
  const list = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.workspaces) ? res.data.workspaces : []);
  return { success: true, workspaces: list };
}

/**
 * 6.2. Create Workspace API (POST /api/v1/workspaces)
 */
export async function createWorkspaceApi({ name }, tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  const res = await apiClient.post('/api/v1/workspaces', { name: (name || '').trim() }, { token });
  if (!res.ok) {
    return {
      success: false,
      error: res.message || res.error?.message || 'Không thể tạo workspace',
      code: res.code || res.error?.code,
      status: res.status
    };
  }
  return { success: true, workspace: res.data || {}, message: res.message };
}

/**
 * 7. Send Reset Password Link (POST /api/v1/auth/forgot-password)
 */
export async function sendResetPasswordLinkApi(email) {
  const res = await apiClient.post('/api/v1/auth/forgot-password', { email: email.trim() });
  return {
    success: res.ok,
    message: res.message || (res.ok ? 'Đã gửi link đặt lại mật khẩu' : 'Không thể gửi email')
  };
}

export const sendResetCodeApi = sendResetPasswordLinkApi;

/**
 * 8. Reset Password (POST /api/v1/auth/reset-password)
 */
export async function resetPasswordApi(email, code, newPassword) {
  const res = await apiClient.post('/api/v1/auth/reset-password', {
    email: email.trim(),
    token: code,
    new_password: newPassword
  });
  return {
    success: res.ok,
    message: res.message || (res.ok ? 'Đặt lại mật khẩu thành công' : 'Đổi mật khẩu thất bại')
  };
}

/**
 * 9. Delete User Account (DELETE /api/v1/auth/me)
 */
export async function deleteAccountApi({ password, reason = '' } = {}, tokenOverride = null) {
  const token = tokenOverride || getAuthToken();
  const res = await apiClient.delete('/api/v1/auth/me', { password, reason }, { token });
  return {
    success: res.ok,
    message: res.message || (res.ok ? 'Account deleted successfully' : 'Xóa tài khoản thất bại')
  };
}
