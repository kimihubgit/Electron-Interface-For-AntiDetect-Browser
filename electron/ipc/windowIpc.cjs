const { ipcMain } = require('electron');
const { getMainWindow, toggleWindowPin } = require('../window.cjs');

function registerWindowIpc() {
  ipcMain.on('window-minimize', () => {
    const win = getMainWindow();
    if (win) win.minimize();
  });

  ipcMain.on('window-maximize', () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });

  ipcMain.on('window-close', () => {
    const win = getMainWindow();
    if (!win) return;
    try {
      const { getActiveProfilesCount } = require('./browserIpc.cjs');
      const runningCount = getActiveProfilesCount ? getActiveProfilesCount() : 0;
      if (runningCount > 0) {
        win.hide();
        const { showMiniDock } = require('../miniDock.cjs');
        showMiniDock();
        return;
      }
    } catch {}
    win.close();
  });

  ipcMain.handle('switch-to-mini-dock', () => {
    const win = getMainWindow();
    if (win) win.hide();
    const { showMiniDock } = require('../miniDock.cjs');
    showMiniDock();
    return true;
  });

  ipcMain.on('window-pin', (event) => {
    const isPinned = toggleWindowPin();
    event.reply('window-pinned-status', isPinned);
  });

  ipcMain.handle('window-is-maximized', () => {
    const win = getMainWindow();
    return win ? win.isMaximized() : false;
  });
}

module.exports = {
  registerWindowIpc
};
