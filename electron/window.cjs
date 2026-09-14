const { BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow = null;
let isPinned = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 1040,
    minHeight: 680,
    frame: false,
    show: false, // Hidden until content ready to avoid white flash
    center: true,
    backgroundColor: '#F8F9FA',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', (e) => {
    try {
      const { getActiveProfilesCount } = require('./ipc/browserIpc.cjs');
      const runningCount = getActiveProfilesCount ? getActiveProfilesCount() : 0;
      if (runningCount > 0) {
        e.preventDefault();
        mainWindow.hide();
        const { showMiniDock } = require('./miniDock.cjs');
        showMiniDock();
      }
    } catch {}
  });

  return mainWindow;
}

function getMainWindow() {
  return mainWindow;
}

function toggleWindowPin() {
  if (mainWindow) {
    isPinned = !isPinned;
    mainWindow.setAlwaysOnTop(isPinned);
    return isPinned;
  }
  return false;
}

function isWindowPinned() {
  return isPinned;
}

module.exports = {
  createWindow,
  getMainWindow,
  toggleWindowPin,
  isWindowPinned
};
