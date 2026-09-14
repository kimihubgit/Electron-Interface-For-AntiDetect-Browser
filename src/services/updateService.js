import { getApiServerUrl } from '../config/apiConfig';

export { getApiServerUrl };
export const DEFAULT_APP_VERSION = '1.1.0';

let cachedElectronVersion = null;

/**
 * Get current client application version asynchronously from Electron binary
 */
export async function getClientVersionAsync() {
  if (cachedElectronVersion) return cachedElectronVersion;
  if (window.electronAPI?.getAppVersion) {
    try {
      const ver = await window.electronAPI.getAppVersion();
      if (ver && ver !== '0.0.0') {
        cachedElectronVersion = ver;
        return ver;
      }
    } catch (e) {
      console.warn('[UpdateService] Failed to query Electron version:', e);
    }
  }
  return localStorage.getItem('app_client_version') || DEFAULT_APP_VERSION;
}

/**
 * Get current client application version synchronously
 */
export function getClientVersion() {
  return localStorage.getItem('app_client_version') || cachedElectronVersion || DEFAULT_APP_VERSION;
}

/**
 * Set client application version (useful for testing different version scenarios)
 */
export function setClientVersion(version) {
  if (version) {
    localStorage.setItem('app_client_version', version.trim());
  } else {
    localStorage.removeItem('app_client_version');
  }
}

/**
 * Check for application update from server
 * @param {string} [versionOverride] - Optional version to simulate
 * @param {string} [platform='windows']
 * @returns {Promise<{
 *   success: boolean,
 *   hasUpdate: boolean,
 *   forceUpdate: boolean,
 *   currentVersion: string,
 *   latestVersion: string,
 *   downloadUrl?: string,
 *   releaseNotes?: string,
 *   message?: string
 * }>}
 */
export async function checkAppUpdate(versionOverride = null, platform = 'windows') {
  const currentVersion = versionOverride || (await getClientVersionAsync());
  const serverUrl = getApiServerUrl();
  const endpoint = `${serverUrl}/api/v1/app/check-update?platform=${encodeURIComponent(platform)}&version=${encodeURIComponent(currentVersion)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json.status === 'success' && json.data) {
      const data = json.data;
      return {
        success: true,
        hasUpdate: Boolean(data.has_update),
        forceUpdate: Boolean(data.force_update),
        currentVersion: data.current_version || currentVersion,
        latestVersion: data.latest_version || currentVersion,
        downloadUrl: data.download_url || '',
        releaseNotes: data.release_notes || '',
        message: json.message || 'Check version success',
        raw: data
      };
    }

    throw new Error(json.message || 'Phản hồi không hợp lệ từ máy chủ');
  } catch (err) {
    console.warn('[UpdateService] Check update failed:', err);
    return {
      success: false,
      hasUpdate: false,
      forceUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      message: err.name === 'AbortError' ? 'Hết thời gian kết nối (Timeout)' : err.message
    };
  }
}

/**
 * Opens download URL using native OS browser or window.open
 */
export async function openDownloadUrl(url) {
  if (!url) return false;

  if (window.electronAPI?.openExternalUrl) {
    try {
      return await window.electronAPI.openExternalUrl(url);
    } catch (e) {
      console.warn('electronAPI.openExternalUrl failed, fallback to window.open:', e);
    }
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
