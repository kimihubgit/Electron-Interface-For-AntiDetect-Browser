const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { getMainWindow } = require('../window.cjs');
const { extractZipNative } = require('../utils/zipExtractor.cjs');

function getEnginesSearchDirs() {
  const dirs = [
    path.join(__dirname, '..', '..', 'build'), // Nhân Chromium vừa build trong thư mục build/
    path.join(__dirname, '..', '..', 'core'),
    path.join(__dirname, '..', '..', 'resources', 'engines'),
    app && app.getPath ? path.join(app.getPath('userData'), 'engines') : null,
    process.env.APPDATA ? path.join(process.env.APPDATA, 'antidetectbrowser', 'engines') : null
  ].filter(Boolean);
  if (process.resourcesPath) {
    dirs.push(path.join(process.resourcesPath, 'engines'));
  }
  return dirs;
}

function scanInstalledEngines() {
  const engines = [];
  const searchDirs = getEnginesSearchDirs();
  const exeName = process.platform === 'win32' ? 'chrome.exe' : (process.platform === 'darwin' ? 'Chromium' : 'chrome');

  for (const baseDir of searchDirs) {
    if (!fs.existsSync(baseDir)) continue;

    const directExe = path.join(baseDir, exeName);
    if (fs.existsSync(directExe)) {
      let ver = '152.0.7958.0';
      let major = 152;
      try {
        const files = fs.readdirSync(baseDir);
        const manifest = files.find(f => f.endsWith('.manifest') && /^[0-9]/.test(f));
        if (manifest) {
          ver = manifest.replace('.manifest', '');
          major = parseInt(ver.split('.')[0] || '152', 10);
        }
      } catch {}

      engines.push({
        version: ver,
        major: major,
        path: directExe,
        name: `Antibrowser Chromium Core v${ver} (Build)`,
        isCustomBuild: true
      });
    }

    try {
      const subdirs = fs.readdirSync(baseDir, { withFileTypes: true });
      for (const ent of subdirs) {
        if (ent.isDirectory()) {
          const subPath = path.join(baseDir, ent.name);
          let finalExe = null;
          const directSubExe = path.join(subPath, exeName);

          if (fs.existsSync(directSubExe)) {
            finalExe = directSubExe;
          } else {
            // Hỗ trợ trường hợp người dùng nén kèm cả folder build/ hoặc chrome-win/
            try {
              const innerItems = fs.readdirSync(subPath, { withFileTypes: true });
              for (const inner of innerItems) {
                if (inner.isDirectory()) {
                  const innerExe = path.join(subPath, inner.name, exeName);
                  if (fs.existsSync(innerExe)) {
                    finalExe = innerExe;
                    break;
                  }
                }
              }
            } catch {}
          }

          if (finalExe) {
            const cleanVer = ent.name.replace(/[^0-9.]/g, '').split('.')[0];
            const major = parseInt(cleanVer || '0', 10);
            engines.push({
              version: cleanVer || ent.name,
              major: major,
              folderName: ent.name,
              path: finalExe,
              name: `Chromium Core v${cleanVer || ent.name}`
            });
          }
        }
      }
    } catch {}
  }

  return engines;
}

function findBrowserExecutable(requestedVersion = '') {
  const cleanReq = String(requestedVersion).replace(/[^0-9]/g, '');
  const reqMajor = parseInt(cleanReq || '0', 10);

  const installed = scanInstalledEngines();
  if (installed.length === 0) return null;

  // 1. Khớp chính xác phiên bản được yêu cầu
  if (reqMajor > 0) {
    const exact = installed.find(e => e.major === reqMajor || String(e.version).startsWith(String(reqMajor)));
    if (exact) return { path: exact.path, version: exact.version, isCustom: true };
  }

  // 2. Ưu tiên nhân v152 vừa tải về trong hệ thống
  const core152 = installed.find(e => e.major === 152 || String(e.version).startsWith('152'));
  if (core152) {
    return { path: core152.path, version: core152.version, isCustom: true };
  }

  // 3. Ưu tiên nhân vừa build trong thư mục build/
  const customBuild = installed.find(e => e.isCustomBuild);
  if (customBuild) {
    return { path: customBuild.path, version: customBuild.version, isCustom: true };
  }

  // 4. Fallback nhân có sẵn đầu tiên
  return { path: installed[0].path, version: installed[0].version, isCustom: true };
}

function registerEngineIpc() {
  ipcMain.handle('get-installed-engines', () => {
    return scanInstalledEngines();
  });

  ipcMain.handle('check-engine-status', (event, version) => {
    const resolved = findBrowserExecutable(version);
    return {
      isInstalled: !!(resolved && resolved.path),
      path: resolved?.path || null,
      version
    };
  });

  ipcMain.handle('download-engine', async (event, { version, downloadUrl }) => {
    const cleanVer = String(version || '128').replace(/[^0-9]/g, '') || '128';
    const targetUrl = downloadUrl || `http://127.0.0.1:8000/api/v1/engines/download/${cleanVer}`;

    const tempDir = path.join(app.getPath('userData'), 'temp_downloads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const zipPath = path.join(tempDir, `chrome-${cleanVer}.zip`);
    const fileStream = fs.createWriteStream(zipPath);

    return new Promise((resolve) => {
      function fetchFile(url) {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return fetchFile(res.headers.location);
          }

          if (res.statusCode !== 200) {
            fileStream.close();
            fs.unlink(zipPath, () => {});
            const errMsg = `Không thể tải nhân Chromium v${cleanVer}: URL tải không tồn tại hoặc máy chủ báo lỗi HTTP ${res.statusCode} (${res.statusMessage || 'Not Found'}). URL: ${url}`;
            const win = getMainWindow();
            if (win && !win.isDestroyed()) {
              win.webContents.send('engine-download-progress', {
                version: cleanVer,
                stage: 'error',
                percent: 0,
                error: errMsg
              });
            }
            return resolve({
              success: false,
              error: errMsg
            });
          }

          const totalBytes = parseInt(res.headers['content-length'], 10) || 0;
          let receivedBytes = 0;
          let lastPercent = -1;
          let lastSendTime = 0;

          res.on('data', (chunk) => {
            receivedBytes += chunk.length;
            const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;
            const now = Date.now();

            if ((percent > lastPercent && now - lastSendTime >= 100) || percent === 100) {
              lastPercent = percent;
              lastSendTime = now;
              const win = getMainWindow();
              if (win && !win.isDestroyed()) {
                win.webContents.send('engine-download-progress', {
                  version: cleanVer,
                  stage: 'downloading',
                  percent,
                  receivedBytes,
                  totalBytes
                });
              }
            }
          });

          res.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close(async () => {
              try {
                const win = getMainWindow();
                if (win && !win.isDestroyed()) {
                  win.webContents.send('engine-download-progress', {
                    version: cleanVer,
                    stage: 'extracting',
                    percent: 100,
                    receivedBytes,
                    totalBytes
                  });
                }

                const targetDir = path.join(app.getPath('userData'), 'engines', cleanVer);
                await extractZipNative(zipPath, targetDir);

                fs.unlink(zipPath, () => {});

                if (win && !win.isDestroyed()) {
                  win.webContents.send('engine-download-progress', {
                    version: cleanVer,
                    stage: 'completed',
                    percent: 100,
                    receivedBytes,
                    totalBytes
                  });
                }

                resolve({ success: true, version: cleanVer, targetDir });
              } catch (extractErr) {
                fs.unlink(zipPath, () => {});
                const errMsg = `Lỗi giải nén core engine: ${extractErr.message}`;
                const win = getMainWindow();
                if (win && !win.isDestroyed()) {
                  win.webContents.send('engine-download-progress', {
                    version: cleanVer,
                    stage: 'error',
                    percent: 0,
                    error: errMsg
                  });
                }
                resolve({ success: false, error: errMsg });
              }
            });
          });
        });

        req.on('error', (netErr) => {
          fileStream.close();
          fs.unlink(zipPath, () => {});
          const errMsg = `Lỗi kết nối máy chủ tải engine: ${netErr.message}`;
          const win = getMainWindow();
          if (win && !win.isDestroyed()) {
            win.webContents.send('engine-download-progress', {
              version: cleanVer,
              stage: 'error',
              percent: 0,
              error: errMsg
            });
          }
          resolve({ success: false, error: errMsg });
        });

        req.setTimeout(30000, () => {
          req.destroy(new Error('Hết thời gian chờ kết nối tải core engine (Timeout 30s)'));
        });

        req.on('error', (err) => {
          fileStream.close();
          fs.unlink(zipPath, () => {});
          const errMsg = `Không thể kết nối đến máy chủ tải: ${err.message}. Vui lòng kiểm tra lại URL tải hoặc kết nối mạng!`;
          const win = getMainWindow();
          if (win && !win.isDestroyed()) {
            win.webContents.send('engine-download-progress', {
              version: cleanVer,
              stage: 'error',
              percent: 0,
              error: errMsg
            });
          }
          resolve({ success: false, error: errMsg });
        });
      }

      fetchFile(targetUrl);
    });
  });
}

module.exports = {
  registerEngineIpc,
  scanInstalledEngines,
  findBrowserExecutable
};
