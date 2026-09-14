/**
 * Profile Management REST API Service
 * Implements 10 Profile endpoints: CRUD, Batch actions, Concurrency Locking,
 * Heartbeat, Unlock, Cookie import, Trash bin, and Cloud presigned upload.
 */
import { apiClient } from '../core/apiClient';
import { getMachineGuid } from '../core/deviceService';

/**
 * 1. Tạo Mới Profile (POST /api/v1/profiles)
 */
export async function createProfileApi(profileData, tokenOverride = null) {
  const payload = {
    name: profileData.name || 'New Profile',
    group_id: profileData.group_id || profileData.group || 'default',
    tags: Array.isArray(profileData.tags) ? profileData.tags : [],
    os: (profileData.os || 'windows').toLowerCase(),
    browser: (profileData.browser || 'chrome').toLowerCase().includes('chrome') ? 'chrome' : profileData.browser || 'chrome',
    browser_version: String(profileData.browser_version || profileData.browserVersion || (profileData.browser ? profileData.browser.replace(/[^0-9]/g, '') : '') || '152').replace(/[^0-9]/g, '') || '152',
    proxy_id: profileData.proxy_id || profileData.proxyId || null,
    notes: profileData.notes || profileData.remark || ''
  };

  const res = await apiClient.post('/api/v1/profiles', payload, { token: tokenOverride });
  if (!res.ok) {
    return { 
      success: false, 
      error: res.message || res.error?.message || 'Không thể tạo profile', 
      code: res.code || res.error?.code,
      status: res.status,
      fallback: false 
    };
  }
  return { success: true, data: res.data, message: res.message };
}

/**
 * 1.1. Tạo Hàng Loạt Profile (POST /api/v1/profiles/bulk)
 * Multi-Tenant Workspace Aware
 */
export async function bulkCreateProfilesApi({ workspace_id, profiles }, tokenOverride = null) {
  const payload = {
    workspace_id: workspace_id || undefined,
    profiles: (profiles || []).map(p => ({
      name: p.name || 'New Profile',
      group_id: p.group_id || p.group || 'default',
      tags: Array.isArray(p.tags) ? p.tags : [],
      os: (p.os || 'windows').toLowerCase(),
      browser: (p.browser || 'chrome').toLowerCase().includes('chrome') ? 'chrome' : p.browser || 'chrome',
      browser_version: String(p.browser_version || p.browserVersion || (p.browser ? p.browser.replace(/[^0-9]/g, '') : '') || '152').replace(/[^0-9]/g, '') || '152',
      proxy_id: p.proxy_id || p.proxyId || undefined,
      notes: p.notes || p.remark || ''
    }))
  };

  const headers = workspace_id ? { 'X-Workspace-Id': workspace_id } : {};
  const res = await apiClient.post('/api/v1/profiles/bulk', payload, { 
    token: tokenOverride,
    headers 
  });

  if (!res.ok) {
    return {
      success: false,
      error: res.message || res.error?.message || 'Không thể tạo hàng loạt profile',
      code: res.code || res.error?.code,
      status: res.status,
      details: res.error?.details || null
    };
  }

  const createdData = res.data || {};
  return {
    success: true,
    data: createdData,
    created_count: createdData.created_count ?? (Array.isArray(createdData.profiles) ? createdData.profiles.length : 0),
    profiles: Array.isArray(createdData.profiles) ? createdData.profiles : [],
    message: res.message || 'Tạo thành công!'
  };
}

/**
 * 2. Lấy Danh Sách Profile (GET /api/v1/profiles)
 */
export async function getProfilesApi({
  page = 1,
  limit = 20,
  search = '',
  group_id = '',
  status = ''
} = {}, tokenOverride = null) {
  const params = {
    page,
    limit,
    search: search || undefined,
    group_id: group_id && group_id !== 'all' ? group_id : undefined,
    status: status && status !== 'all' ? status : undefined
  };

  const res = await apiClient.get('/api/v1/profiles', params, { token: tokenOverride });
  if (!res.ok) {
    return { success: false, error: res.message, fallback: true, items: [], total: 0 };
  }

  const data = res.data || {};
  return {
    success: true,
    items: data.items || [],
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit
  };
}

/**
 * 3. Cập Nhật Profile (PUT /api/v1/profiles/{id})
 */
export async function updateProfileApi(id, updateData, tokenOverride = null) {
  const payload = {};
  if (updateData.name !== undefined) payload.name = updateData.name;
  if (updateData.group_id !== undefined) payload.group_id = updateData.group_id;
  if (updateData.tags !== undefined) payload.tags = updateData.tags;
  if (updateData.notes !== undefined || updateData.remark !== undefined) {
    payload.notes = updateData.notes !== undefined ? updateData.notes : updateData.remark;
  }
  if (updateData.proxy_id !== undefined) payload.proxy_id = updateData.proxy_id;

  const res = await apiClient.put(`/api/v1/profiles/${id}`, payload, { token: tokenOverride });
  return {
    success: res.ok,
    data: res.data,
    message: res.message,
    error: res.ok ? null : res.message
  };
}

/**
 * 3.1. Xóa Profile Đơn Lẻ (DELETE /api/v1/profiles/{id})
 */
export async function deleteProfileApi(id, tokenOverride = null) {
  const res = await apiClient.delete(`/api/v1/profiles/${id}`, null, { token: tokenOverride });
  return {
    success: res.ok,
    data: res.data,
    message: res.message || 'Profile deleted successfully',
    error: res.ok ? null : res.message
  };
}

/**
 * 4. Thao Tác Hàng Loạt (POST /api/v1/profiles/batch)
 */
export async function batchProfilesApi({
  action,
  profile_ids = [],
  target_group_id = null,
  target_proxy_id = null
}, tokenOverride = null) {
  const payload = {
    action, // 'move_group' | 'assign_proxy' | 'delete'
    profile_ids
  };
  if (target_group_id) payload.target_group_id = target_group_id;
  if (target_proxy_id) payload.target_proxy_id = target_proxy_id;

  const res = await apiClient.post('/api/v1/profiles/batch', payload, { token: tokenOverride });
  return {
    success: res.ok,
    message: res.message || 'Batch action executed',
    error: res.ok ? null : res.message
  };
}

/**
 * 5. Khóa & Mở Trình Duyệt Trên Windows (POST /api/v1/profiles/{id}/lock)
 */
export async function lockProfileApi(id, machineName = 'DESKTOP-CLIENT', tokenOverride = null) {
  const payload = {
    machine_guid: getMachineGuid(),
    machine_name: machineName
  };

  const res = await apiClient.post(`/api/v1/profiles/${id}/lock`, payload, { token: tokenOverride });

  if (res.conflict || res.status === 409) {
    return {
      success: false,
      conflict: true,
      error: res.message || 'Hồ sơ này đang được mở trên thiết bị khác!'
    };
  }

  return {
    success: res.ok,
    data: res.data,
    message: res.message,
    error: res.ok ? null : res.message
  };
}

/**
 * 6. Heartbeat Giữ Khóa (POST /api/v1/profiles/{id}/heartbeat)
 */
export async function heartbeatProfileApi(id, tokenOverride = null) {
  const payload = { machine_guid: getMachineGuid() };
  const res = await apiClient.post(`/api/v1/profiles/${id}/heartbeat`, payload, { token: tokenOverride });
  return { success: res.ok, data: res.data, error: res.ok ? null : res.message };
}

/**
 * 7. Nhả Khóa & Đóng Trình Duyệt (POST /api/v1/profiles/{id}/unlock)
 */
export async function unlockProfileApi(id, {
  duration_seconds = 0,
  tabs_closed = 1,
  cookies_count = 0
} = {}, tokenOverride = null) {
  const payload = {
    machine_guid: getMachineGuid(),
    duration_seconds: Math.round(duration_seconds),
    tabs_closed,
    cookies_count
  };

  const res = await apiClient.post(`/api/v1/profiles/${id}/unlock`, payload, { token: tokenOverride });
  return { success: res.ok, message: res.message || 'Profile unlocked and stopped' };
}

/**
 * 8. Import Cookies Vào Profile (POST /api/v1/profiles/import-cookies)
 */
export async function importCookiesApi({ profile_id, cookies = [] }, tokenOverride = null) {
  let formattedCookies = cookies;
  if (typeof cookies === 'string') {
    try {
      formattedCookies = JSON.parse(cookies);
    } catch {
      formattedCookies = cookies;
    }
  }

  const payload = { profile_id, cookies: formattedCookies };
  const res = await apiClient.post('/api/v1/profiles/import-cookies', payload, { token: tokenOverride });
  return { success: res.ok, message: res.message || 'Cookies imported', error: res.ok ? null : res.message };
}

/**
 * 9. Quản Lý Thùng Rác (Recycle Bin)
 */
export async function restoreProfileFromTrashApi(profile_id, tokenOverride = null) {
  const res = await apiClient.post('/api/v1/trash/restore', { profile_id }, { token: tokenOverride });
  return { success: res.ok, message: res.message || 'Profile restored', error: res.ok ? null : res.message };
}

export async function emptyTrashApi(tokenOverride = null) {
  const res = await apiClient.delete('/api/v1/trash/empty', null, { token: tokenOverride });
  return { success: res.ok, data: res.data, message: res.message || 'Trash emptied', error: res.ok ? null : res.message };
}

/**
 * 10. Đồng Bộ Dữ Liệu Cloud (POST /api/v1/sync/presigned-upload)
 */
export async function getPresignedUploadUrlApi(profile_id, tokenOverride = null) {
  const res = await apiClient.post('/api/v1/sync/presigned-upload', { profile_id }, { token: tokenOverride });
  return {
    success: res.ok,
    upload_url: res.data?.upload_url,
    storage_key: res.data?.storage_key,
    error: res.ok ? null : res.message
  };
}

/**
 * 11. Xin Vé Khởi Chạy Bảo Mật (POST /api/v1/profiles/:id/launch-ticket)
 * Hạn dùng 30s + Session Key chống can thiệp bộ nhớ
 */
export async function getLaunchTicketApi(profileId, { version, hwid, machine_name } = {}, tokenOverride = null) {
  const payload = {
    hwid: hwid || getMachineGuid(),
    version: String(version || '152').replace(/[^0-9]/g, '') || '152',
    machine_name: machine_name || (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 30) : 'Desktop-Client')
  };

  const res = await apiClient.post(`/api/v1/profiles/${profileId}/launch-ticket`, payload, { token: tokenOverride });
  if (!res.ok) {
    return {
      success: false,
      code: res.code || res.error?.code || 'LAUNCH_TICKET_FAILED',
      error: res.message || res.error?.message || 'Không thể xin vé khởi chạy từ máy chủ'
    };
  }
  return {
    success: true,
    launch_ticket: res.data?.launch_ticket,
    session_key: res.data?.session_key,
    expires_at: res.data?.expires_at
  };
}

/**
 * 12. Lấy Danh Sách Nhân Trình Duyệt Core On-Demand (GET /api/v1/engines)
 */
export async function getEnginesApi(tokenOverride = null) {
  const res = await apiClient.get('/api/v1/engines', { token: tokenOverride });
  if (!res.ok) {
    return { success: false, data: [], error: res.message || 'Lỗi tải danh sách engine' };
  }
  return { success: true, data: Array.isArray(res.data) ? res.data : [] };
}

/**
 * 13. Đồng Bộ Session & Cookie Cloud (POST /api/v1/profiles/:id/session/sync-up)
 */
export async function syncSessionUpApi(profileId, formData, tokenOverride = null) {
  const res = await apiClient.post(`/api/v1/profiles/${profileId}/session/sync-up`, formData, {
    token: tokenOverride,
    headers: {} // Let browser set multipart/form-data boundary
  });
  return {
    success: res.ok,
    data: res.data,
    error: res.ok ? null : (res.message || 'Lỗi tải session lên Cloud')
  };
}

/**
 * 14. Tải Session & Cookie Từ Cloud (GET /api/v1/profiles/:id/session/sync-down)
 */
export async function syncSessionDownApi(profileId, tokenOverride = null) {
  const res = await apiClient.get(`/api/v1/profiles/${profileId}/session/sync-down`, { token: tokenOverride });
  if (!res.ok && res.status === 404) {
    return { success: false, isNewProfile: true, message: 'Profile mới chưa có backup session' };
  }
  return {
    success: res.ok,
    data: res.data,
    error: res.ok ? null : (res.message || 'Lỗi tải session từ Cloud')
  };
}

