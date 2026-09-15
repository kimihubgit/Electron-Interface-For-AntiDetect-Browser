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

  ipcMain.handle('open-google-auth-window', async (event, authUrl) => {
    const { BrowserWindow } = require('electron');
    return new Promise((resolve) => {
      let resolved = false;
      const mainWin = getMainWindow();

      const authWin = new BrowserWindow({
        width: 520,
        height: 680,
        title: 'Đăng nhập với Google',
        parent: mainWin || undefined,
        modal: false,
        autoHideMenuBar: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });

      const checkUrl = (url) => {
        try {
          if (url && (url.includes('/api/v1/auth/google/callback') || url.includes('callback?code='))) {
            const parsed = new URL(url);
            const code = parsed.searchParams.get('code');
            const token = parsed.searchParams.get('token');
            const error = parsed.searchParams.get('error');

            if ((code || token) && !resolved) {
              resolved = true;
              resolve({ success: true, code, token });
              setTimeout(() => {
                if (!authWin.isDestroyed()) authWin.close();
              }, 400);
            } else if (error && !resolved) {
              resolved = true;
              resolve({ success: false, error });
              setTimeout(() => {
                if (!authWin.isDestroyed()) authWin.close();
              }, 400);
            }
          }
        } catch (e) {
          console.error('Failed to parse Google OAuth URL:', e);
        }
      };

      authWin.webContents.on('will-redirect', (e, url) => checkUrl(url));
      authWin.webContents.on('will-navigate', (e, url) => checkUrl(url));
      authWin.webContents.on('did-navigate', (e, url) => checkUrl(url));

      authWin.on('closed', () => {
        if (!resolved) {
          resolved = true;
          resolve({ success: false, error: 'Cửa sổ đăng nhập đã được đóng' });
        }
      });

      authWin.loadURL(authUrl);
    });
  });
}

module.exports = {
  registerWindowIpc
};
