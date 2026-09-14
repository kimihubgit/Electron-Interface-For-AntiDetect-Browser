const { ipcMain, dialog, shell, app } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');
const { getMainWindow } = require('../window.cjs');

function getGlobalExtensionsDir() {
  const dir = path.join(app.getPath('userData'), 'extensions');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Helper to resolve localized message from Chrome extension _locales
function resolveLocalizedText(folderPath, text) {
  if (!text || typeof text !== 'string' || !text.startsWith('__MSG_')) return text;
  const key = text.slice(6, -2);
  const locales = ['vi', 'en', 'en_US', 'en_GB'];
  for (const loc of locales) {
    const locPath = path.join(folderPath, '_locales', loc, 'messages.json');
    if (fs.existsSync(locPath)) {
      try {
        const raw = fs.readFileSync(locPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed[key] && parsed[key].message) {
          return parsed[key].message;
        }
        const lowerKey = key.toLowerCase();
        const foundKey = Object.keys(parsed).find(k => k.toLowerCase() === lowerKey);
        if (foundKey && parsed[foundKey].message) {
          return parsed[foundKey].message;
        }
      } catch {}
    }
  }
  return text;
}

// Download file via HTTPS following redirects
function downloadBuffer(url, maxRedirects = 6) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      return reject(new Error('Quá nhiều chuyển hướng khi tải tệp.'));
    }

    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(downloadBuffer(res.headers.location, maxRedirects - 1));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Máy chủ Chrome Web Store trả về mã HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });

    req.on('error', err => reject(err));
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Quá thời gian tải xuống (Timeout 30s)'));
    });
  });
}

// Helper to extract zip using tar with PowerShell Expand-Archive fallback
function extractZip(zipPath, targetDir) {
  return new Promise((resolve, reject) => {
    exec(`tar -xf "${zipPath}" -C "${targetDir}"`, (tarErr) => {
      if (!tarErr) return resolve();
      // Fallback to PowerShell Expand-Archive
      const psCmd = `powershell.exe -NoProfile -NonInteractive -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${targetDir}' -Force"`;
      exec(psCmd, (psErr) => {
        if (!psErr) return resolve();
        reject(tarErr || psErr);
      });
    });
  });
}

// Helper to download and unpack a Chrome Web Store extension by its 32-character ID
async function downloadAndExtractStoreExtension(extId) {
  const targetDir = path.join(getGlobalExtensionsDir(), extId);

  // Download CRX from Google Web Store API (try multiple user-agent/prodversion variations)
  const urls = [
    `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=128.0.0.0&acceptformat=crx2,crx3&x=id%3D${extId}%26uc`,
    `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=131.0.0.0&acceptformat=crx2,crx3&x=id%3D${extId}%26uc`,
    `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=9999.0.9999.0&acceptformat=crx3&x=id%3D${extId}%26uc`
  ];

  let buf = null;
  let lastErr = null;
  for (const u of urls) {
    try {
      buf = await downloadBuffer(u);
      if (buf && buf.length > 500) break;
    } catch (e) {
      lastErr = e;
    }
  }

  if (!buf || buf.length < 500) {
    throw new Error(lastErr ? lastErr.message : 'Không thể tải gói CRX từ Chrome Web Store.');
  }

  // Extract ZIP payload from CRX
  const zipSig = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  const offset = buf.indexOf(zipSig);
  if (offset === -1) {
    throw new Error('Không thể giải nén dữ liệu từ tệp tải về từ Chrome Web Store (không có header zip).');
  }

  const zipBuf = buf.subarray(offset);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const tempZipPath = path.join(targetDir, `temp_${Date.now()}.zip`);
  fs.writeFileSync(tempZipPath, zipBuf);

  try {
    await extractZip(tempZipPath, targetDir);
  } finally {
    try { fs.unlinkSync(tempZipPath); } catch {}
  }

  // Verify extracted contents
  const extractedFiles = fs.readdirSync(targetDir);
  if (extractedFiles.length === 0) {
    throw new Error('Thư mục tiện ích rỗng sau khi giải nén.');
  }

  // Parse real manifest.json
  let name = extId;
  let version = '1.0.0';
  let description = 'Tiện ích mở rộng tải từ Chrome Web Store.';
  const manifestPath = path.join(targetDir, 'manifest.json');

  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      if (manifest.name) {
        name = resolveLocalizedText(targetDir, manifest.name);
      }
      if (manifest.version) {
        version = manifest.version;
      }
      if (manifest.description) {
        description = resolveLocalizedText(targetDir, manifest.description);
      }
    } catch {}
  }

  const sizeMb = (buf.length / (1024 * 1024)).toFixed(1);

  return {
    success: true,
    extId,
    name,
    version,
    description,
    folderPath: targetDir,
    size: `${sizeMb} MB`,
    hasManifest: true
  };
}

// Helper to calculate total directory size on disk
function getDirSize(dirPath) {
  let total = 0;
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        total += getDirSize(fullPath);
      } else if (entry.isFile()) {
        total += fs.statSync(fullPath).size;
      }
    }
  } catch {}
  return total;
}

// Helper to extract real extension icon as base64 data URI
function getIconDataUrl(folderPath, manifest) {
  let iconRel = null;
  if (manifest.icons && typeof manifest.icons === 'object') {
    iconRel = manifest.icons['128'] || manifest.icons['64'] || manifest.icons['48'] || manifest.icons['32'] || manifest.icons['16'] || Object.values(manifest.icons)[0];
  } else if (manifest.action && manifest.action.default_icon) {
    iconRel = typeof manifest.action.default_icon === 'string' ? manifest.action.default_icon : Object.values(manifest.action.default_icon)[0];
  } else if (manifest.browser_action && manifest.browser_action.default_icon) {
    iconRel = typeof manifest.browser_action.default_icon === 'string' ? manifest.browser_action.default_icon : Object.values(manifest.browser_action.default_icon)[0];
  }
  if (!iconRel) return null;
  const iconFullPath = path.join(folderPath, iconRel);
  if (!fs.existsSync(iconFullPath)) return null;
  try {
    const buf = fs.readFileSync(iconFullPath);
    const extName = path.extname(iconFullPath).toLowerCase();
    const mime = extName === '.svg' ? 'image/svg+xml' : extName === '.jpg' || extName === '.jpeg' ? 'image/jpeg' : 'image/png';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {}
  return null;
}

// Read configuration mapping (enabled status, profile assignments)
function getExtensionsConfig() {
  const configPath = path.join(getGlobalExtensionsDir(), 'extensions_config.json');
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch {}
  }
  return {};
}

// Save configuration mapping
function saveExtensionsConfig(config) {
  try {
    const configPath = path.join(getGlobalExtensionsDir(), 'extensions_config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.warn('Lỗi lưu extensions_config.json:', err);
  }
}

// Get all installed extensions directly from physical folders on disk
function getInstalledExtensionsList() {
  const baseDir = getGlobalExtensionsDir();
  const config = getExtensionsConfig();

  if (!fs.existsSync(baseDir)) return [];

  const items = fs.readdirSync(baseDir, { withFileTypes: true });
  const result = [];

  for (const item of items) {
    if (!item.isDirectory()) continue;
    const folderPath = path.join(baseDir, item.name);
    const manifestPath = path.join(folderPath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;

    try {
      const raw = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(raw);

      let name = manifest.name || item.name;
      name = resolveLocalizedText(folderPath, name);

      let description = manifest.description || 'Tiện ích mở rộng Antidetect Browser';
      description = resolveLocalizedText(folderPath, description);

      const version = manifest.version || '1.0.0';
      const iconDataUrl = getIconDataUrl(folderPath, manifest);

      const sizeBytes = getDirSize(folderPath);
      const sizeFormatted = sizeBytes > 1024 * 1024
        ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;

      const isStoreId = /^[a-z]{32}$/i.test(item.name);
      const storeUrl = isStoreId ? `https://chromewebstore.google.com/detail/${item.name.toLowerCase()}` : '';

      const extCfg = config[item.name] || {};
      const enabled = extCfg.enabled !== false;
      const targetProfileIds = Array.isArray(extCfg.targetProfileIds) ? extCfg.targetProfileIds : [];

      result.push({
        id: item.name,
        extId: isStoreId ? item.name.toLowerCase() : '',
        name,
        version,
        description,
        iconDataUrl,
        folderPath,
        size: sizeFormatted,
        sourceType: isStoreId ? 'store' : 'folder',
        storeUrl,
        enabled,
        targetProfileIds,
        assignedProfiles: targetProfileIds.length === 0 ? 'all' : targetProfileIds.length
      });
    } catch (err) {
      console.warn(`Lỗi đọc tiện ích ${item.name}:`, err.message);
    }
  }

  return result;
}

function registerExtensionIpc() {
  // 1. Select Unpacked Extension Folder
  ipcMain.handle('select-extension-folder', async () => {
    const win = getMainWindow();
    const result = await dialog.showOpenDialog(win, {
      title: 'Chọn thư mục Tiện ích mở rộng (Unpacked Extension Folder)',
      properties: ['openDirectory']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const originalFolderPath = result.filePaths[0];
    const folderName = path.basename(originalFolderPath);
    const extensionsDir = getGlobalExtensionsDir();

    let targetDir = originalFolderPath;
    if (!originalFolderPath.toLowerCase().startsWith(extensionsDir.toLowerCase())) {
      targetDir = path.join(extensionsDir, folderName);
      if (fs.existsSync(targetDir)) {
        targetDir = path.join(extensionsDir, `${folderName}_${Date.now()}`);
      }
      try {
        fs.cpSync(originalFolderPath, targetDir, { recursive: true });
      } catch (e) {
        console.warn('Lỗi sao chép extension folder:', e);
        targetDir = originalFolderPath;
      }
    }

    let manifest = null;
    let name = folderName;
    let version = '1.0.0';
    let description = `Tiện ích mở rộng tải từ thư mục (${folderName}).`;

    // Check Chrome Extension manifest.json
    const manifestPath = path.join(targetDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const raw = fs.readFileSync(manifestPath, 'utf8');
        manifest = JSON.parse(raw);
        if (manifest.name) {
          name = resolveLocalizedText(targetDir, manifest.name);
        }
        if (manifest.version) {
          version = manifest.version;
        }
        if (manifest.description) {
          description = resolveLocalizedText(targetDir, manifest.description);
        }
      } catch (err) {
        console.warn('Lỗi đọc manifest.json:', err);
      }
    }

    return {
      success: true,
      folderPath: targetDir,
      folderName: path.basename(targetDir),
      hasManifest: !!manifest,
      name,
      version,
      description
    };
  });

  // 2. Select and Unpack .zip or .crx file
  ipcMain.handle('select-extension-file', async () => {
    const win = getMainWindow();
    const result = await dialog.showOpenDialog(win, {
      title: 'Chọn tệp Tiện ích mở rộng (.zip hoặc .crx)',
      filters: [
        { name: 'Chrome Extensions', extensions: ['zip', 'crx'] },
        { name: 'All Files', extensions: ['*'] }
      ],
      properties: ['openFile']
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const filePath = result.filePaths[0];
    const fileName = path.basename(filePath);
    const baseName = path.parse(fileName).name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const targetDir = path.join(getGlobalExtensionsDir(), `${baseName}_${Date.now()}`);

    fs.mkdirSync(targetDir, { recursive: true });

    const ext = path.extname(filePath).toLowerCase();
    let zipToExtract = filePath;
    let tempZipCreated = false;

    if (ext === '.crx') {
      try {
        const fileBuf = fs.readFileSync(filePath);
        const zipSig = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
        const offset = fileBuf.indexOf(zipSig);
        if (offset !== -1) {
          const rawZip = fileBuf.subarray(offset);
          const tempZip = path.join(targetDir, '__temp.zip');
          fs.writeFileSync(tempZip, rawZip);
          zipToExtract = tempZip;
          tempZipCreated = true;
        }
      } catch (e) {
        console.warn('Lỗi phân tích CRX header:', e);
      }
    }

    try {
      await extractZip(zipToExtract, targetDir);
    } catch (err) {
      console.warn('Lỗi giải nén extension file:', err);
    } finally {
      if (tempZipCreated) {
        try { fs.unlinkSync(zipToExtract); } catch {}
      }
    }

    let name = baseName;
    let version = '1.0.0';
    let description = `Cài đặt từ tệp ${fileName}.`;

    const manifestPath = path.join(targetDir, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        if (manifest.name) name = resolveLocalizedText(targetDir, manifest.name);
        if (manifest.version) version = manifest.version;
        if (manifest.description) description = resolveLocalizedText(targetDir, manifest.description);
      } catch {}
    } else {
      // Write default manifest
      const manifest = {
        manifest_version: 3,
        name: baseName,
        version: '1.0.0',
        description: `Extracted extension ${fileName}`
      };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    }

    return {
      success: true,
      folderPath: targetDir,
      fileName,
      name,
      version,
      description,
      hasManifest: true
    };
  });

  // 3. Download & Extract Extension from Chrome Web Store (CRX) by URL or ID
  ipcMain.handle('download-store-extension', async (event, input) => {
    try {
      if (!input || typeof input !== 'string') {
        return { success: false, error: 'Vui lòng cung cấp link hoặc Extension ID hợp lệ.' };
      }

      const match = input.match(/([a-z]{32})/i);
      if (!match) {
        return { success: false, error: 'Không tìm thấy Extension ID hợp lệ (chuỗi 32 ký tự).' };
      }

      const extId = match[1].toLowerCase();
      return await downloadAndExtractStoreExtension(extId);
    } catch (err) {
      console.warn('Lỗi download-store-extension:', err.message);
      return { success: false, error: err.message || 'Không thể tải tiện ích từ Chrome Web Store.' };
    }
  });

  // 4. Open Extension Folder in Windows Explorer
  ipcMain.handle('open-extension-folder', async (event, pathOrId) => {
    try {
      let targetPath = pathOrId;
      const match = typeof pathOrId === 'string' ? pathOrId.match(/([a-z]{32})/i) : null;
      const extId = match ? match[1].toLowerCase() : null;

      if (!targetPath || !fs.existsSync(targetPath)) {
        if (extId) {
          targetPath = path.join(getGlobalExtensionsDir(), extId);
        } else {
          targetPath = path.join(getGlobalExtensionsDir(), pathOrId ? String(pathOrId).replace(/[^a-zA-Z0-9_-]/g, '_') : 'unnamed');
        }
      }

      // Check if directory has real source files
      let hasRealFiles = false;
      if (fs.existsSync(targetPath)) {
        const files = fs.readdirSync(targetPath);
        if (files.length > 2 || files.some(f => f.endsWith('.js') || f.endsWith('.html') || f === '_locales' || f === 'icons')) {
          hasRealFiles = true;
        }
      }

      // If folder is empty or has only fake manifest, and we have a valid 32-char ID, auto download real CRX
      if (!hasRealFiles && extId) {
        try {
          await downloadAndExtractStoreExtension(extId);
        } catch (dlErr) {
          console.warn(`Tự động tải mã nguồn extension ${extId} thất bại:`, dlErr.message);
        }
      }

      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }

      await shell.openPath(targetPath);
      return { success: true, folderPath: targetPath };
    } catch (err) {
      console.warn('Lỗi mở thư mục tiện ích:', err);
      return { success: false, error: err.message };
    }
  });

  // 5. Save/Prepare Unpacked Extension directory on disk
  ipcMain.handle('save-unpacked-extension', async (event, extData) => {
    try {
      const sanitizedId = String(extData.id || extData.extId || Date.now()).replace(/[^a-zA-Z0-9_-]/g, '_');
      const extDir = path.join(getGlobalExtensionsDir(), sanitizedId);
      if (!fs.existsSync(extDir)) {
        fs.mkdirSync(extDir, { recursive: true });
      }

      const manifestPath = path.join(extDir, 'manifest.json');
      if (!fs.existsSync(manifestPath)) {
        const manifest = {
          manifest_version: 3,
          name: extData.name || sanitizedId,
          version: extData.version || '1.0.0',
          description: extData.description || 'Tiện ích mở rộng Antidetect Browser'
        };
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
      }

      return { success: true, folderPath: extDir };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 6. Get extensions directory path
  ipcMain.handle('get-extensions-dir', () => {
    return getGlobalExtensionsDir();
  });

  // 7. Delete Extension files/folder from disk
  ipcMain.handle('delete-extension', async (event, pathOrId) => {
    try {
      if (!pathOrId) return { success: false, error: 'Thiếu ID hoặc đường dẫn tiện ích' };

      const baseExtDir = getGlobalExtensionsDir();
      const match = typeof pathOrId === 'string' ? pathOrId.match(/([a-z]{32})/i) : null;
      const extId = match ? match[1].toLowerCase() : null;

      let deleted = false;

      // Check if direct folder path exists
      if (typeof pathOrId === 'string' && fs.existsSync(pathOrId)) {
        const normalizedTarget = path.normalize(pathOrId).toLowerCase();
        const normalizedBase = path.normalize(baseExtDir).toLowerCase();
        // If it is inside extensions directory, delete it
        if (normalizedTarget.startsWith(normalizedBase) && normalizedTarget !== normalizedBase) {
          fs.rmSync(pathOrId, { recursive: true, force: true });
          deleted = true;
        }
      }

      // Check if folder by extId exists in baseExtDir
      if (extId) {
        const extDirPath = path.join(baseExtDir, extId);
        if (fs.existsSync(extDirPath)) {
          fs.rmSync(extDirPath, { recursive: true, force: true });
          deleted = true;
        }
      }

      // Check if sanitized pathOrId exists in baseExtDir
      const sanitized = String(pathOrId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const sanitizedPath = path.join(baseExtDir, sanitized);
      if (fs.existsSync(sanitizedPath)) {
        fs.rmSync(sanitizedPath, { recursive: true, force: true });
        deleted = true;
      }

      return { success: true, deleted };
    } catch (err) {
      console.warn('Lỗi xóa thư mục tiện ích:', err);
      return { success: false, error: err.message };
    }
  });

  // 8. Get all real installed extensions directly from physical folders on disk
  ipcMain.handle('get-installed-extensions', async () => {
    return getInstalledExtensionsList();
  });

  // 9. Save extension configuration (enabled, targetProfileIds)
  ipcMain.handle('save-extension-config', async (event, { id, enabled, targetProfileIds }) => {
    if (!id) return { success: false };
    const config = getExtensionsConfig();
    config[id] = {
      ...config[id],
      ...(enabled !== undefined ? { enabled } : {}),
      ...(targetProfileIds !== undefined ? { targetProfileIds } : {})
    };
    saveExtensionsConfig(config);
    return { success: true };
  });
}

module.exports = {
  registerExtensionIpc
};
