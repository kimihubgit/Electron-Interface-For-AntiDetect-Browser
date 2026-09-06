const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  togglePin: () => ipcRenderer.send('window-pin'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
});
