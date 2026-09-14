const fs = require('fs');
const { spawn } = require('child_process');

/**
 * Native ZIP Extraction utility with zero external dependencies.
 * Uses native tar.exe / PowerShell on Windows, unzip on macOS / Linux.
 */
function extractZipNative(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (process.platform === 'win32') {
      // Windows 10/11 tích hợp sẵn lệnh tar.exe giải nén file .zip cực nhanh
      const tarProcess = spawn('tar', ['-xf', zipPath, '-C', destDir]);
      tarProcess.on('close', (code) => {
        if (code === 0) return resolve();
        // Dự phòng bằng PowerShell Expand-Archive nếu tar bị lỗi
        const psCmd = `Expand-Archive -Force -LiteralPath '${zipPath}' -DestinationPath '${destDir}'`;
        const psProcess = spawn('powershell', ['-NoProfile', '-Command', psCmd]);
        psProcess.on('close', (psCode) => {
          if (psCode === 0) resolve();
          else reject(new Error(`Giải nén thất bại với mã lỗi ${psCode}`));
        });
        psProcess.on('error', reject);
      });
      tarProcess.on('error', () => {
        const psCmd = `Expand-Archive -Force -LiteralPath '${zipPath}' -DestinationPath '${destDir}'`;
        const psProcess = spawn('powershell', ['-NoProfile', '-Command', psCmd]);
        psProcess.on('close', (psCode) => {
          if (psCode === 0) resolve();
          else reject(new Error(`Giải nén thất bại với mã lỗi ${psCode}`));
        });
        psProcess.on('error', reject);
      });
    } else {
      // macOS / Linux dùng lệnh unzip hệ thống
      const unzipProcess = spawn('unzip', ['-o', zipPath, '-d', destDir]);
      unzipProcess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Giải nén thất bại với mã lỗi ${code}`));
      });
      unzipProcess.on('error', reject);
    }
  });
}

module.exports = {
  extractZipNative
};
