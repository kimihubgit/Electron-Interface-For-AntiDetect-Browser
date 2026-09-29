const { ipcMain } = require('electron');
const http = require('http');
const https = require('https');
const crypto = require('crypto');

/**
 * Register Cloud Backup IPC handlers in Electron main process
 */
function registerBackupIpc() {
  // Test S3 / Host connection natively without CORS
  ipcMain.handle('test-cloud-connection', async (event, params = {}) => {
    const { endpoint, bucketName, accessKeyId, secretAccessKey, region = 'us-east-1' } = params;
    const startTime = Date.now();

    try {
      if (!endpoint) {
        return {
          success: false,
          pingMs: 0,
          message: 'Endpoint URL không hợp lệ!'
        };
      }

      const url = new URL(endpoint);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const targetPath = bucketName ? `/${bucketName}?max-keys=1` : '/';

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: targetPath,
        method: 'GET',
        timeout: 4500,
        headers: {
          'User-Agent': 'AntidetectBrowser-CloudBackup/1.1.0',
          'Host': url.host
        }
      };

      if (accessKeyId && secretAccessKey) {
        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = amzDate.slice(0, 8);
        const payloadHash = crypto.createHash('sha256').update('').digest('hex');

        options.headers['x-amz-date'] = amzDate;
        options.headers['x-amz-content-sha256'] = payloadHash;

        const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
        const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
        const canonicalRequest = `GET\n${targetPath}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
        const canonicalHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

        const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
        const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${canonicalHash}`;

        const kDate = crypto.createHmac('sha256', 'AWS4' + secretAccessKey).update(dateStamp).digest();
        const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
        const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
        const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
        const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

        options.headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
      }

      return await new Promise((resolve) => {
        const req = client.request(options, (res) => {
          const pingMs = Date.now() - startTime;
          let body = '';
          res.on('data', chunk => { body += chunk; });
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 204) {
              resolve({
                success: true,
                pingMs,
                message: `Kết nối thành công tới ${url.hostname}! (Mã HTTP: ${res.statusCode}, Ping: ${pingMs}ms)`,
                details: { statusCode: res.statusCode }
              });
            } else if (res.statusCode === 403) {
              resolve({
                success: false,
                pingMs,
                message: `Lỗi 403 Forbidden: Thông tin xác thực Access Key / Secret Key không có quyền truy cập bucket "${bucketName}".`
              });
            } else if (res.statusCode === 404) {
              resolve({
                success: false,
                pingMs,
                message: `Lỗi 404 Not Found: Bucket "${bucketName}" không tồn tại trên máy chủ.`
              });
            } else {
              resolve({
                success: res.statusCode < 400,
                pingMs,
                message: `Máy chủ phản hồi mã ${res.statusCode} (${res.statusMessage || ''}). (Ping: ${pingMs}ms)`
              });
            }
          });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({
            success: false,
            pingMs: Date.now() - startTime,
            message: `Hết thời gian chờ kết nối (Timeout) tới ${url.hostname}!`
          });
        });

        req.on('error', (err) => {
          resolve({
            success: false,
            pingMs: Date.now() - startTime,
            message: `Lỗi kết nối tới máy chủ ${url.hostname}: ${err.message}`
          });
        });

        req.end();
      });
    } catch (e) {
      return {
        success: false,
        pingMs: Date.now() - startTime,
        message: `Lỗi xử lý kết nối: ${e.message}`
      };
    }
  });

  // Native S3 / Cloud Upload bypassing browser CORS
  ipcMain.handle('upload-cloud-backup', async (event, params = {}) => {
    const { endpoint, bucketName, objectKey, accessKeyId, secretAccessKey, region = 'us-east-1', payload } = params;

    try {
      const url = new URL(endpoint);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const targetPath = `/${bucketName}/${objectKey}`;
      const payloadBuffer = Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload));

      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
      const dateStamp = amzDate.slice(0, 8);
      const payloadHash = crypto.createHash('sha256').update(payloadBuffer).digest('hex');

      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: targetPath,
        method: 'PUT',
        timeout: 20000,
        headers: {
          'User-Agent': 'AntidetectBrowser-CloudBackup/1.1.0',
          'Host': url.host,
          'Content-Type': 'application/octet-stream',
          'Content-Length': payloadBuffer.length,
          'x-amz-date': amzDate,
          'x-amz-content-sha256': payloadHash,
          'x-amz-acl': 'private'
        }
      };

      const canonicalHeaders = `content-length:${payloadBuffer.length}\ncontent-type:application/octet-stream\nhost:${url.host}\nx-amz-acl:private\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
      const signedHeaders = 'content-length;content-type;host;x-amz-acl;x-amz-content-sha256;x-amz-date';
      const canonicalRequest = `PUT\n${targetPath}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
      const canonicalHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

      const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
      const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${canonicalHash}`;

      const kDate = crypto.createHmac('sha256', 'AWS4' + secretAccessKey).update(dateStamp).digest();
      const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
      const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
      const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
      const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

      options.headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

      return await new Promise((resolve) => {
        const req = client.request(options, (res) => {
          let body = '';
          res.on('data', chunk => { body += chunk; });
          res.on('end', () => {
            if (res.statusCode === 200 || res.statusCode === 204) {
              resolve({
                success: true,
                message: `Tải lên thành công (${payloadBuffer.length} bytes)`,
                statusCode: res.statusCode
              });
            } else {
              resolve({
                success: false,
                message: `Máy chủ phản hồi mã lỗi ${res.statusCode}: ${body.slice(0, 150) || res.statusMessage}`
              });
            }
          });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, message: 'Hết thời gian chờ (Timeout) khi tải file lên máy chủ!' });
        });

        req.on('error', (err) => {
          resolve({ success: false, message: `Lỗi kết nối máy chủ: ${err.message}` });
        });

        req.write(payloadBuffer);
        req.end();
      });
    } catch (e) {
      return { success: false, message: `Lỗi xử lý upload: ${e.message}` };
    }
  });
}

module.exports = {
  registerBackupIpc
};
