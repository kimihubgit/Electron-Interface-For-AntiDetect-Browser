const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  togglePin: () => ipcRenderer.send('window-pin'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  testProxy: (proxy) => ipcRenderer.invoke('test-proxy', proxy),
  testAllProxies: (proxiesList) => ipcRenderer.invoke('test-all-proxies', proxiesList),
  openExternalUrl: (url) => ipcRenderer.invoke('open-external-url', url),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  startDownloadUpdate: (url) => ipcRenderer.invoke('start-download-update', url),
  installDownloadedUpdate: () => ipcRenderer.invoke('install-downloaded-update'),
  onDownloadUpdateProgress: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('download-update-progress', handler);
    return () => ipcRenderer.removeListener('download-update-progress', handler);
  },
  launchBrowser: (profile) => ipcRenderer.invoke('launch-browser', profile),
  stopBrowser: (profileId) => ipcRenderer.invoke('stop-browser', profileId),
  getRunningBrowsers: () => ipcRenderer.invoke('get-running-browsers'),
  getInstalledEngines: () => ipcRenderer.invoke('get-installed-engines'),
  checkEngineStatus: (version) => ipcRenderer.invoke('check-engine-status', version),
  downloadEngine: (params) => ipcRenderer.invoke('download-engine', params),
  onEngineDownloadProgress: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('engine-download-progress', handler);
    return () => ipcRenderer.removeListener('engine-download-progress', handler);
  },
  onBrowserExited: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('browser-exited', handler);
    return () => ipcRenderer.removeListener('browser-exited', handler);
  },
  getSystemStats: () => ipcRenderer.invoke('get-system-stats'),
  selectExtensionFolder: () => ipcRenderer.invoke('select-extension-folder'),
  selectExtensionFile: () => ipcRenderer.invoke('select-extension-file'),
  openExtensionFolder: (pathOrId) => ipcRenderer.invoke('open-extension-folder', pathOrId),
  saveUnpackedExtension: (extData) => ipcRenderer.invoke('save-unpacked-extension', extData),
  downloadStoreExtension: (input) => ipcRenderer.invoke('download-store-extension', input),
  deleteExtension: (pathOrId) => ipcRenderer.invoke('delete-extension', pathOrId),
  getInstalledExtensions: () => ipcRenderer.invoke('get-installed-extensions'),
  saveExtensionConfig: (config) => ipcRenderer.invoke('save-extension-config', config),
  getExtensionsDir: () => ipcRenderer.invoke('get-extensions-dir'),
  showMiniDock: () => ipcRenderer.invoke('show-mini-dock'),
  hideMiniDock: () => ipcRenderer.invoke('hide-mini-dock'),
  restoreMainWindow: () => ipcRenderer.invoke('restore-main-window'),
  switchToMiniDock: () => ipcRenderer.invoke('switch-to-mini-dock'),
  quitAppCompletely: () => ipcRenderer.invoke('quit-app-completely'),
  getRunningProfilesList: () => ipcRenderer.invoke('get-running-profiles-list'),
  stopAllBrowsers: () => ipcRenderer.invoke('stop-all-browsers'),
  onRunningProfilesUpdated: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('running-profiles-updated', handler);
    return () => ipcRenderer.removeListener('running-profiles-updated', handler);
  },
  getProfileSizes: (profileIds) => ipcRenderer.invoke('get-profile-sizes', profileIds),
  getProfileSize: (profileId) => ipcRenderer.invoke('get-profile-size', profileId),
  deleteProfileData: (profileId) => ipcRenderer.invoke('delete-profile-data', profileId),
  deleteMultipleProfilesData: (profileIds) => ipcRenderer.invoke('delete-multiple-profiles-data', profileIds),
  onProfileSizeUpdated: (callback) => {
    const handler = (event, data) => callback(data);
    ipcRenderer.on('profile-size-updated', handler);
    return () => ipcRenderer.removeListener('profile-size-updated', handler);
  }
});
