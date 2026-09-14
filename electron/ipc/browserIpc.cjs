const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { getMainWindow } = require('../window.cjs');
const { findBrowserExecutable } = require('./engineIpc.cjs');

const activeBrowserProcesses = new Map(); // profileId -> ChildProcess

// Profile directory size cache: safeProfileId -> { sizeBytes, formatted, timestamp }
const profileSizesCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 phút cache - tuyệt đối không gây giật lag giao diện

function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

async function computeDirSize(dirPath) {
  let total = 0;
  try {
    if (!fs.existsSync(dirPath)) return 0;
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dirPath, entry.name);
      try {
        if (entry.isDirectory()) {
          total += await computeDirSize(full);
        } else if (entry.isFile()) {
          const st = await fs.promises.stat(full);
          total += st.size;
        }
      } catch {}
    }
  } catch {}
  return total;
}

async function getProfileDirSize(profileId, forceRefresh = false) {
  const safeId = String(profileId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const appData = app.getPath('userData');
  const profileDir = path.join(appData, 'profiles_data', safeId);

  // Nếu thư mục chưa tồn tại hoặc chưa từng chạy, trả về 0 KB và không lưu cache 10p
  if (!fs.existsSync(profileDir)) {
    profileSizesCache.delete(safeId);
    return { sizeBytes: 0, formatted: '0 KB', timestamp: Date.now() };
  }

  const cached = profileSizesCache.get(safeId);
  const now = Date.now();
  if (!forceRefresh && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return cached;
  }

  const sizeBytes = await computeDirSize(profileDir);
  const result = {
    sizeBytes,
    formatted: formatBytes(sizeBytes),
    timestamp: now
  };
  profileSizesCache.set(safeId, result);
  return result;
}

function registerBrowserIpc() {
  ipcMain.handle('launch-browser', async (event, profile) => {
    if (!profile || !profile.id) {
      return { success: false, error: 'Thiếu thông tin profile' };
    }

    if (activeBrowserProcesses.has(profile.id)) {
      return { success: true, alreadyRunning: true, pid: activeBrowserProcesses.get(profile.id).pid };
    }

    const reqVersion = profile.browser_version || profile.browserVersion || (profile.browser ? profile.browser.replace(/[^0-9]/g, '') : '') || '128';
    const resolved = findBrowserExecutable(reqVersion);
    if (!resolved || !resolved.path) {
      return {
        success: false,
        needDownload: true,
        version: reqVersion,
        error: `Nhân trình duyệt Chromium v${reqVersion} chưa được cài đặt. Bạn cần tải nhân này về trước khi có thể khởi chạy!`
      };
    }

    const browserExe = resolved.path;

    // Profile User Data Directory (Isolated Cookie / Cache / Session per profile)
    const appData = app.getPath('userData');
    const profileDir = path.join(appData, 'profiles_data', String(profile.id).replace(/[^a-zA-Z0-9_-]/g, '_'));
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }

    const args = [
      `--user-data-dir=${profileDir}`,
      '--no-sandbox',
      '--test-type',
      '--no-first-run',
      '--no-default-browser-check',
      '--password-store=basic',
      '--disable-blink-features=AutomationControlled', // Critical: Hides navigator.webdriver!
      '--disable-features=IsolateOrigins,site-per-process',
      '--remote-debugging-port=0'
    ];

    // Proxy support
    const proxy = profile.proxy;
    if (proxy && proxy.type && proxy.type !== 'NO_PROXY' && proxy.host && proxy.port) {
      const pType = String(proxy.type).toLowerCase();
      const pHost = String(proxy.host).trim();
      const pPort = Number(proxy.port);
      args.push(`--proxy-server=${pType}://${pHost}:${pPort}`);
    }

    // User-Agent support
    if (profile.userAgent) {
      args.push(`--user-agent=${profile.userAgent}`);
    }

    // Window size
    if (profile.screenResolution) {
      const [w, h] = String(profile.screenResolution).split('x');
      if (w && h) {
        args.push(`--window-size=${w},${h}`);
      }
    }

    // Extension folders support (Unpacked extensions)
    if (profile.extensions && Array.isArray(profile.extensions) && profile.extensions.length > 0) {
      const extPaths = profile.extensions
        .map(e => {
          if (typeof e === 'string') return e;
          if (e.folderPath && fs.existsSync(e.folderPath)) return e.folderPath;
          if (e.path && fs.existsSync(e.path)) return e.path;
          const id = e.id || e.extId;
          if (id) {
            const extDir = path.join(app.getPath('userData'), 'extensions', String(id).replace(/[^a-zA-Z0-9_-]/g, '_'));
            if (fs.existsSync(extDir)) {
              return extDir;
            }
          }
          return null;
        })
        .filter(p => p && fs.existsSync(p));

      if (extPaths.length > 0) {
        args.push(`--load-extension=${extPaths.join(',')}`);
        args.push(`--disable-extensions-except=${extPaths.join(',')}`);
      }
    }

    // Custom Antidetect Core flags (Hardware, Memory, Canvas, WebGL)
    const concurrency = profile.hardwareConcurrency || profile.cpu || 12;
    args.push(`--hardware-concurrency=${concurrency}`);

    const memory = profile.deviceMemory || profile.ram || 8;
    args.push(`--device-memory=${memory}`);

    if (profile.canvasNoise !== false) {
      args.push('--canvas-noise=1');
    }

    const webglVendor = profile.webglVendor || 'Google Inc. (NVIDIA)';
    args.push(`--webgl-vendor=${webglVendor}`);

    const webglRenderer = profile.webglRenderer || 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)';
    args.push(`--webgl-renderer=${webglRenderer}`);

    // Target URL / Search Engine
    let targetUrl = profile.startUrl || profile.targetUrl || profile.startUrls;
    if (!targetUrl) {
      const searchUrls = {
        google: 'https://www.google.com',
        bing: 'https://www.bing.com',
        duckduckgo: 'https://duckduckgo.com',
        yahoo: 'https://search.yahoo.com',
        yandex: 'https://yandex.com',
        baidu: 'https://www.baidu.com'
      };
      targetUrl = (profile.searchEngine && searchUrls[profile.searchEngine]) || 'https://www.google.com';
    }
    args.push(targetUrl);

    try {
      const child = spawn(browserExe, args, {
        detached: true,
        stdio: 'ignore'
      });
      child.unref();

      child.on('error', (err) => {
        console.error(`[Browser Launch Error - Profile ${profile.id}]:`, err);
      });

      activeBrowserProcesses.set(profile.id, {
        child,
        pid: child.pid,
        profile: {
          id: profile.id,
          name: profile.name || `Profile #${profile.id}`,
          order: profile.order || activeBrowserProcesses.size + 1,
          browser: profile.browser || 'Chromium'
        },
        startTime: Date.now()
      });

      broadcastRunningProfiles();

      const runStartTime = Date.now();

      child.on('exit', (code) => {
        const elapsedSec = Math.max(1, Math.round((Date.now() - runStartTime) / 1000));
        const formattedDuration = elapsedSec < 60 ? `${elapsedSec}s` : `${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s`;

        console.log(`[Browser Process ${profile.id}] Exited with code: ${code}, duration: ${formattedDuration}`);
        activeBrowserProcesses.delete(profile.id);
        profileSizesCache.delete(String(profile.id).replace(/[^a-zA-Z0-9_-]/g, '_'));
        broadcastRunningProfiles();

        const win = getMainWindow();
        if (win && !win.isDestroyed()) {
          win.webContents.send('browser-exited', {
            profileId: profile.id,
            exitCode: code,
            duration: formattedDuration
          });
        }

        // Tự động đo lại dung lượng profile ở tiến trình nền sau khi tắt (không gây lag giao diện)
        setTimeout(async () => {
          try {
            const updatedSize = await getProfileDirSize(profile.id, true);
            const winLatest = getMainWindow();
            if (winLatest && !winLatest.isDestroyed()) {
              winLatest.webContents.send('profile-size-updated', {
                profileId: profile.id,
                size: updatedSize.formatted,
                sizeBytes: updatedSize.sizeBytes
              });
            }
          } catch {}
        }, 1500);
      });

      return {
        success: true,
        pid: child.pid,
        browserPath: browserExe,
        profileDir
      };
    } catch (err) {
      return {
        success: false,
        error: `Lỗi khởi chạy tiến trình trình duyệt: ${err.message}`
      };
    }
  });

  ipcMain.handle('stop-browser', async (event, profileId) => {
    if (!profileId || !activeBrowserProcesses.has(profileId)) {
      return { success: false, message: 'Profile không trong trạng thái chạy' };
    }

    const item = activeBrowserProcesses.get(profileId);
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(item.pid), '/T', '/F']);
      } else {
        item.child.kill('SIGKILL');
      }
      activeBrowserProcesses.delete(profileId);
      broadcastRunningProfiles();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('get-running-browsers', () => {
    return Array.from(activeBrowserProcesses.keys());
  });

  ipcMain.handle('get-running-profiles-list', () => {
    return getActiveProfilesList();
  });

  ipcMain.handle('stop-all-browsers', async () => {
    for (const [id, item] of activeBrowserProcesses.entries()) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(item.pid), '/T', '/F']);
        } else {
          item.child.kill('SIGKILL');
        }
      } catch {}
    }
    activeBrowserProcesses.clear();
    broadcastRunningProfiles();
    return { success: true };
  });

  // Lấy dung lượng hàng loạt cho danh sách profile (sử dụng cache 10 phút để tránh giật lag)
  ipcMain.handle('get-profile-sizes', async (event, profileIds = []) => {
    const results = {};
    if (!Array.isArray(profileIds)) return results;
    for (const id of profileIds) {
      try {
        const res = await getProfileDirSize(id, false);
        results[id] = res.formatted;
      } catch {
        results[id] = '0 KB';
      }
    }
    return results;
  });

  // Lấy dung lượng của 1 profile cụ thể
  ipcMain.handle('get-profile-size', async (event, profileId) => {
    if (!profileId) return '0 KB';
    try {
      const res = await getProfileDirSize(profileId, false);
      return res.formatted;
    } catch {
      return '0 KB';
    }
  });

  // Xóa thư mục dữ liệu của 1 profile trên ổ đĩa
  ipcMain.handle('delete-profile-data', async (event, profileId) => {
    if (!profileId) return { success: false, error: 'Thiếu profileId' };
    const safeId = String(profileId).replace(/[^a-zA-Z0-9_-]/g, '_');

    // Dừng tiến trình nếu profile đang chạy
    if (activeBrowserProcesses.has(profileId)) {
      const item = activeBrowserProcesses.get(profileId);
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(item.pid), '/T', '/F']);
        } else {
          item.child.kill('SIGKILL');
        }
      } catch {}
      activeBrowserProcesses.delete(profileId);
      broadcastRunningProfiles();
    }

    try {
      const appData = app.getPath('userData');
      const profileDir = path.join(appData, 'profiles_data', safeId);
      if (fs.existsSync(profileDir)) {
        await fs.promises.rm(profileDir, { recursive: true, force: true });
        console.log(`[Browser Data] Deleted directory: ${profileDir}`);
      }
      profileSizesCache.delete(safeId);
      return { success: true };
    } catch (err) {
      console.error(`[Browser Data] Delete error for profile ${profileId}:`, err);
      return { success: false, error: err.message };
    }
  });

  // Xóa thư mục dữ liệu hàng loạt profile trên ổ đĩa
  ipcMain.handle('delete-multiple-profiles-data', async (event, profileIds = []) => {
    if (!Array.isArray(profileIds) || profileIds.length === 0) return { success: true };
    const appData = app.getPath('userData');

    for (const profileId of profileIds) {
      if (!profileId) continue;
      const safeId = String(profileId).replace(/[^a-zA-Z0-9_-]/g, '_');

      if (activeBrowserProcesses.has(profileId)) {
        const item = activeBrowserProcesses.get(profileId);
        try {
          if (process.platform === 'win32') {
            spawn('taskkill', ['/pid', String(item.pid), '/T', '/F']);
          } else {
            item.child.kill('SIGKILL');
          }
        } catch {}
        activeBrowserProcesses.delete(profileId);
      }

      try {
        const profileDir = path.join(appData, 'profiles_data', safeId);
        if (fs.existsSync(profileDir)) {
          await fs.promises.rm(profileDir, { recursive: true, force: true });
          console.log(`[Browser Data] Deleted directory: ${profileDir}`);
        }
        profileSizesCache.delete(safeId);
      } catch (err) {
        console.warn(`[Browser Data] Could not remove folder for ${profileId}:`, err.message);
      }
    }
    broadcastRunningProfiles();
    return { success: true };
  });
}

function getActiveProfilesCount() {
  return activeBrowserProcesses.size;
}

function getActiveProfilesList() {
  const list = [];
  for (const [id, item] of activeBrowserProcesses.entries()) {
    list.push({
      id,
      pid: item.pid,
      name: item.profile?.name || `Profile #${id}`,
      order: item.profile?.order || 1,
      startTime: item.startTime
    });
  }
  return list;
}

function broadcastRunningProfiles() {
  const list = getActiveProfilesList();
  const win = getMainWindow();
  if (win && !win.isDestroyed()) {
    win.webContents.send('running-profiles-updated', list);
  }

  try {
    const { getMiniDockWindow } = require('../miniDock.cjs');
    const dockWin = getMiniDockWindow ? getMiniDockWindow() : null;
    if (dockWin && !dockWin.isDestroyed()) {
      dockWin.webContents.send('running-profiles-updated', list);
    }
  } catch {}
}

module.exports = {
  registerBrowserIpc,
  activeBrowserProcesses,
  getActiveProfilesCount,
  getActiveProfilesList,
  broadcastRunningProfiles
};
