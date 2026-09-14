const { app, BrowserWindow } = require('electron');
const { createWindow, getMainWindow } = require('./window.cjs');
const { registerAllIpcHandlers } = require('./ipc/index.cjs');

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
