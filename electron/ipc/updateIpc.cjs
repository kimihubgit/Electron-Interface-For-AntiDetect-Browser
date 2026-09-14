const { app, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const { spawn } = require('child_process');
const { getMainWindow } = require('../window.cjs');

let downloadedInstallerPath = null;

function registerUpdateIpc() {
  // Trả về phiên bản hiện tại của app
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Tải file cài đặt cập nhật ngầm với báo cáo tiến trình
  ipcMain.handle('start-download-update', (event, downloadUrl) => {
    return new Promise((resolve, reject) => {
      if (!downloadUrl) return reject(new Error('Thiếu đường link tải cập nhật'));

      const tempDir = app.getPath('temp');
      const fileName = `antidetect-update-${Date.now()}.exe`;
      downloadedInstallerPath = path.join(tempDir, fileName);

      const fileStream = fs.createWriteStream(downloadedInstallerPath);

      function downloadFile(targetUrl) {
        const client = targetUrl.startsWith('https') ? https : http;
        const clientRequest = client.get(targetUrl, (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return downloadFile(response.headers.location);
          }

          if (response.statusCode !== 200) {
            fileStream.close();
            fs.unlink(downloadedInstallerPath, () => {});
            return reject(new Error(`Máy chủ tải file báo mã lỗi HTTP ${response.statusCode}`));
          }

          const totalBytes = parseInt(response.headers['content-length'], 10) || 0;
          let receivedBytes = 0;
          let lastPercent = -1;
          let lastSendTime = 0;

          response.on('data', (chunk) => {
            receivedBytes += chunk.length;
            const percent = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0;
            const now = Date.now();

            if ((percent > lastPercent && now - lastSendTime >= 100) || percent === 100) {
              lastPercent = percent;
              lastSendTime = now;
              const win = getMainWindow();
              if (win && !win.isDestroyed()) {
                win.webContents.send('download-update-progress', {
                  percent,
                  receivedBytes,
                  totalBytes
                });
              }
            }
          });

          response.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            resolve({ success: true, filePath: downloadedInstallerPath });
          });
        });

        clientRequest.setTimeout(15000, () => {
          clientRequest.destroy(new Error('Mất kết nối Internet hoặc hết thời gian chờ tải (Network Timeout)'));
        });

        clientRequest.on('error', (err) => {
          fileStream.close();
          fs.unlink(downloadedInstallerPath, () => {});
          reject(err);
        });
      }

      downloadFile(downloadUrl);
    });
  });

  // Chạy file cài đặt vừa tải và đóng app cũ
  ipcMain.handle('install-downloaded-update', () => {
    if (downloadedInstallerPath && fs.existsSync(downloadedInstallerPath)) {
      try {
        spawn(downloadedInstallerPath, [], {
          detached: true,
          stdio: 'ignore'
        }).unref();

        setTimeout(() => {
          app.quit();
        }, 500);
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
    return { success: false, error: 'Không tìm thấy file cài đặt đã tải' };
  });
}

module.exports = {
  registerUpdateIpc
};
