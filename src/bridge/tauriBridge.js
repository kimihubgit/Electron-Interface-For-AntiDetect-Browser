/**
 * Tauri Desktop Bridge Adapter
 * Seamlessly connects the frontend React UI to Tauri v2 native Rust backend.
 * Provides 100% backward-compatibility for window.electronAPI consumers.
 */

const isTauri = typeof window !== 'undefined' && (
  window.__TAURI_INTERNALS__ !== undefined ||
  window.__TAURI__ !== undefined
);

let tauriCore = null;
let tauriEvent = null;
let tauriWindow = null;

async function getTauriModules() {
  if (!isTauri) return null;
  if (!tauriCore) {
    try {
      tauriCore = await import('@tauri-apps/api/core');
      tauriEvent = await import('@tauri-apps/api/event');
      tauriWindow = await import('@tauri-apps/api/window');
    } catch (e) {
      console.warn('[TauriBridge] Dynamic import of Tauri API failed:', e);
    }
  }
  return { core: tauriCore, event: tauriEvent, win: tauriWindow };
}

let isPinned = false;

export const tauriApi = {
  // Window controls
  minimize: async () => {
    const modules = await getTauriModules();
    if (modules?.win) {
      const current = modules.win.getCurrentWindow();
      await current.minimize();
    }
  },

  maximize: async () => {
    const modules = await getTauriModules();
    if (modules?.win) {
      const current = modules.win.getCurrentWindow();
      await current.toggleMaximize();
    }
  },

  close: async () => {
    const modules = await getTauriModules();
    if (modules?.win) {
      const current = modules.win.getCurrentWindow();
      await current.close();
    }
  },

  togglePin: async () => {
    const modules = await getTauriModules();
    if (modules?.win) {
      isPinned = !isPinned;
      const current = modules.win.getCurrentWindow();
      await current.setAlwaysOnTop(isPinned);
      return isPinned;
    }
    return false;
  },

  isMaximized: async () => {
    const modules = await getTauriModules();
    if (modules?.win) {
      const current = modules.win.getCurrentWindow();
      return await current.isMaximized();
    }
    return false;
  },

  // Security & Hardware Binding
  getHardwareFingerprint: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_hardware_fingerprint');
    }
    return {
      machineGuid: 'TAURI_DEV_MACHINE_GUID',
      hardwareKey: 'TAURI_DEV_HARDWARE_KEY',
      isSecureHardware: false
    };
  },

  isSafeStorageAvailable: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('is_safe_storage_available');
    }
    return true;
  },

  safeStorageEncrypt: async (plainText) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('safe_storage_encrypt', { plainText });
    }
    return btoa(unescape(encodeURIComponent(plainText)));
  },

  safeStorageDecrypt: async (cipherBase64) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('safe_storage_decrypt', { cipherBase64 });
    }
    return decodeURIComponent(escape(atob(cipherBase64)));
  },

  // Browser profiles & Engine operations
  launchBrowser: async (profile) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('launch_browser', { profile });
    }
    console.info('[TauriMock] launchBrowser simulated:', profile?.name);
    return { success: true, pid: 12345, debugPort: 9222 };
  },

  stopBrowser: async (profileId) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('stop_browser', { profileId });
    }
    return { success: true };
  },

  getRunningBrowsers: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_running_browsers');
    }
    return [];
  },

  getRunningProfilesList: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_running_profiles_list');
    }
    return [];
  },

  stopAllBrowsers: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('stop_all_browsers');
    }
    return { success: true };
  },

  getProfileSizes: async (profileIds) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_profile_sizes', { profileIds });
    }
    const mock = {};
    (profileIds || []).forEach(id => { mock[id] = 1024 * 1024 * 15; });
    return mock;
  },

  getProfileSize: async (profileId) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_profile_size', { profileId });
    }
    return 1024 * 1024 * 15;
  },

  deleteProfileData: async (profileId) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('delete_profile_data', { profileId });
    }
    return { success: true };
  },

  deleteMultipleProfilesData: async (profileIds) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('delete_multiple_profiles_data', { profileIds });
    }
    return { success: true };
  },

  // App & System info
  getAppVersion: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_app_version');
    }
    return '1.1.0-tauri';
  },

  openExternalUrl: async (url) => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('open_external_url', { url });
    }
    window.open(url, '_blank');
    return true;
  },

  getSystemStats: async () => {
    const modules = await getTauriModules();
    if (modules?.core) {
      return await modules.core.invoke('get_system_stats');
    }
    return {
      cpuUsage: 12,
      ramUsedGb: 4.2,
      ramTotalGb: 16.0,
      runningProfiles: 0
    };
  },

  // Event Listeners
  onBrowserExited: (callback) => {
    let unlisten = () => {};
    getTauriModules().then(modules => {
      if (modules?.event) {
        modules.event.listen('browser-exited', (e) => callback(e.payload)).then(u => {
          unlisten = u;
        });
      }
    });
    return () => unlisten();
  },

  onProfileSizeUpdated: (callback) => {
    let unlisten = () => {};
    getTauriModules().then(modules => {
      if (modules?.event) {
        modules.event.listen('profile-size-updated', (e) => callback(e.payload)).then(u => {
          unlisten = u;
        });
      }
    });
    return () => unlisten();
  },

  onRunningProfilesUpdated: (callback) => {
    let unlisten = () => {};
    getTauriModules().then(modules => {
      if (modules?.event) {
        modules.event.listen('running-profiles-updated', (e) => callback(e.payload)).then(u => {
          unlisten = u;
        });
      }
    });
    return () => unlisten();
  },

  onDownloadUpdateProgress: (callback) => {
    let unlisten = () => {};
    getTauriModules().then(modules => {
      if (modules?.event) {
        modules.event.listen('download-update-progress', (e) => callback(e.payload)).then(u => {
          unlisten = u;
        });
      }
    });
    return () => unlisten();
  },

  onOAuthDeepLink: (callback) => {
    let unlisten = () => {};
    getTauriModules().then(modules => {
      if (modules?.event) {
        modules.event.listen('oauth-deep-link', (e) => callback(e.payload)).then(u => {
          unlisten = u;
        });
      }
    });
    return () => unlisten();
  }
};

// Expose on window.electronAPI if not already defined (or if running inside Tauri)
if (typeof window !== 'undefined') {
  if (!window.electronAPI || isTauri) {
    window.electronAPI = tauriApi;
  }
}

export default tauriApi;
