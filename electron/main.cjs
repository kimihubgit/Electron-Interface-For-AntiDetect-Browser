const path = require('path');
const { app, BrowserWindow } = require('electron');
const { createWindow, getMainWindow } = require('./window.cjs');
const { registerAllIpcHandlers } = require('./ipc/index.cjs');

// Register custom protocol 'antidetect://' for browser OAuth deep linking
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('antidetect', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('antidetect');
}

// Single instance lock to prevent duplicate windows and forward deep link url
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine) => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();

      const deepLinkUrl = commandLine.find(arg => typeof arg === 'string' && arg.startsWith('antidetect://'));
      if (deepLinkUrl) {
        win.webContents.send('oauth-deep-link', deepLinkUrl);
      }
    }
  });

  app.on('open-url', (event, url) => {
    event.preventDefault();
    const win = getMainWindow();
    if (win) {
      win.webContents.send('oauth-deep-link', url);
    }
  });
}

// Khởi tạo toàn bộ các bộ xử lý IPC (Browser, Engine, System, Proxy, Update, Window)
registerAllIpcHandlers();

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
