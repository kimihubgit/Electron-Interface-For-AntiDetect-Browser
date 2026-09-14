const { BrowserWindow, screen, ipcMain, app } = require('electron');
const path = require('path');
const { getMainWindow } = require('./window.cjs');

let miniDockWindow = null;

function createMiniDock() {
  if (miniDockWindow && !miniDockWindow.isDestroyed()) {
    return miniDockWindow;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const dockWidth = 64;
  const dockHeight = 440;
  const x = width - dockWidth - 8; // Bám sát mép phải màn hình
  const y = Math.max(30, Math.round((height - dockHeight) / 2));

  miniDockWindow = new BrowserWindow({
    width: dockWidth,
    height: dockHeight,
    x,
    y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    show: false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  miniDockWindow.loadFile(indexPath, { hash: 'mini-dock' });

  miniDockWindow.on('closed', () => {
    miniDockWindow = null;
  });

  return miniDockWindow;
}

function showMiniDock() {
  if (!miniDockWindow || miniDockWindow.isDestroyed()) {
    createMiniDock();
  }
  miniDockWindow.show();
  miniDockWindow.setAlwaysOnTop(true, 'screen-saver');
}

function hideMiniDock() {
  if (miniDockWindow && !miniDockWindow.isDestroyed()) {
    miniDockWindow.hide();
  }
}

function getMiniDockWindow() {
  return miniDockWindow;
}

function registerMiniDockIpc() {
  ipcMain.handle('show-mini-dock', () => {
    showMiniDock();
    return true;
  });

  ipcMain.handle('hide-mini-dock', () => {
    hideMiniDock();
    return true;
  });

  ipcMain.handle('restore-main-window', () => {
    const mainWin = getMainWindow();
    if (mainWin && !mainWin.isDestroyed()) {
      mainWin.show();
      mainWin.focus();
    }
    hideMiniDock();
    return true;
  });

  ipcMain.handle('quit-app-completely', () => {
    app.exit(0);
  });
}

module.exports = {
  createMiniDock,
  showMiniDock,
  hideMiniDock,
  getMiniDockWindow,
  registerMiniDockIpc
};
