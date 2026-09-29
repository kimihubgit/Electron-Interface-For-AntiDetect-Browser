const { ipcMain, safeStorage } = require('electron');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

let cachedHardwareId = null;

/**
 * Trích xuất Machine GUID thật từ Windows Registry hoặc băm phần cứng vật lý
 */
function getSystemHardwareFingerprint() {
  if (cachedHardwareId) return cachedHardwareId;

  let rawHwid = '';

  // 1. Thử lấy MachineGuid chính thức của Windows từ Registry
  if (process.platform === 'win32') {
    try {
      const output = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid', {
        encoding: 'utf8',
        timeout: 2000,
        windowsHide: true
      });
      const match = output.match(/MachineGuid\s+REG_SZ\s+([a-fA-F0-9-]+)/i);
      if (match && match[1]) {
        rawHwid = match[1].trim();
      }
    } catch {
      // Fallback nếu không đọc được registry
    }
  }

  // 2. Nếu không có, tạo fingerprint từ bo mạch / CPU / MAC Card mạng
  if (!rawHwid) {
    const interfaces = os.networkInterfaces();
    let mac = '';
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (!iface.internal && iface.mac && iface.mac !== '00:00:00:00:00:00') {
          mac = iface.mac;
          break;
        }
      }
      if (mac) break;
    }

    const cpus = os.cpus();
    const cpuModel = cpus[0]?.model || 'UNKNOWN_CPU';
    const totalMem = os.totalmem();
    const hostname = os.hostname();
    const username = os.userInfo().username;

    rawHwid = `${hostname}:${username}:${cpuModel}:${totalMem}:${mac}`;
  }

  // Băm thành SHA-256 Hex làm Hardware Secret cố định cho riêng máy tính này
  cachedHardwareId = crypto.createHash('sha256').update(`NEXUS_HW_${rawHwid}`).digest('hex');
  return cachedHardwareId;
}

function registerSecurityIpc() {
  // 1. Kiểm tra Windows DPAPI safeStorage có khả dụng không
  ipcMain.handle('is-safe-storage-available', async () => {
    return safeStorage.isEncryptionAvailable();
  });

  // 2. Mã hóa chuỗi nhạy cảm bằng Windows DPAPI
  ipcMain.handle('safe-storage-encrypt', async (_event, plainText) => {
    try {
      if (!plainText) return { success: true, data: '' };
      if (!safeStorage.isEncryptionAvailable()) {
        return { success: false, error: 'DPAPI encryption unavailable' };
      }
      const encryptedBuffer = safeStorage.encryptString(String(plainText));
      return {
        success: true,
        data: encryptedBuffer.toString('base64')
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 3. Giải mã chuỗi bằng Windows DPAPI
  ipcMain.handle('safe-storage-decrypt', async (_event, cipherBase64) => {
    try {
      if (!cipherBase64) return { success: true, data: '' };
      if (!safeStorage.isEncryptionAvailable()) {
        return { success: false, error: 'DPAPI encryption unavailable' };
      }
      const buffer = Buffer.from(cipherBase64, 'base64');
      const decryptedString = safeStorage.decryptString(buffer);
      return {
        success: true,
        data: decryptedString
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // 4. Lấy mã nhận dạng phần cứng (Hardware Fingerprint) duy nhất của máy tính
  ipcMain.handle('get-hardware-fingerprint', async () => {
    try {
      const hwid = getSystemHardwareFingerprint();
      return { success: true, hwid };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}

module.exports = {
  registerSecurityIpc,
  getSystemHardwareFingerprint
};
