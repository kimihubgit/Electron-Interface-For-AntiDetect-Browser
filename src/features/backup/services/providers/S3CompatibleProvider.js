import { BaseStorageProvider } from '../core/BaseStorageProvider';
import { signS3Request } from '../core/S3SignatureV4';

/**
 * S3CompatibleProvider - Real S3 REST API Integration
 * Works with Cloudflare R2, AWS S3, BizflyCloud, Cloudfly, DigitalOcean Spaces, Wasabi, and MinIO.
 * Performs authentic AWS SigV4 signed HTTP requests.
 */
export class S3CompatibleProvider extends BaseStorageProvider {
  getEndpointDetails() {
    const { id } = this;
    const cfg = this.config;

    switch (id) {
      case 'cloudflare_r2': {
        const accountId = (cfg.accountId || '').trim();
        return {
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          region: 'auto',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretAccessKey || '').trim(),
          pathPrefix: cfg.pathPrefix || 'vault/'
        };
      }
      case 'aws_s3': {
        const region = (cfg.region || 'ap-southeast-1').trim();
        return {
          endpoint: `https://s3.${region}.amazonaws.com`,
          region,
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretAccessKey || '').trim(),
          pathPrefix: cfg.pathPrefix || 'backups/'
        };
      }
      case 'bizfly': {
        const rawEndpoint = (cfg.endpoint || 'https://hn.ss.bizflycloud.vn').trim().replace(/\/+$/, '');
        return {
          endpoint: rawEndpoint,
          region: rawEndpoint.includes('hcm') ? 'hcm' : 'hn',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKey || cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretKey || cfg.secretAccessKey || '').trim(),
          pathPrefix: 'profiles/'
        };
      }
      case 'cloudfly': {
        const rawEndpoint = (cfg.endpoint || 'https://s3.cloudfly.vn').trim().replace(/\/+$/, '');
        return {
          endpoint: rawEndpoint,
          region: 'vietnam',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKey || cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretKey || cfg.secretAccessKey || '').trim(),
          pathPrefix: 'backups/'
        };
      }
      case 'digitalocean': {
        const region = (cfg.region || 'sgp1').trim();
        return {
          endpoint: `https://${region}.digitaloceanspaces.com`,
          region,
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKey || cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretKey || cfg.secretAccessKey || '').trim(),
          pathPrefix: 'backups/'
        };
      }
      case 'wasabi': {
        const rawEndpoint = (cfg.endpoint || 'https://s3.ap-northeast-1.wasabisys.com').trim().replace(/\/+$/, '');
        return {
          endpoint: rawEndpoint,
          region: 'ap-northeast-1',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKey || cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretKey || cfg.secretAccessKey || '').trim(),
          pathPrefix: 'profiles/'
        };
      }
      case 'minio': {
        let rawEndpoint = (cfg.endpoint || 'http://localhost:9000').trim().replace(/\/+$/, '');
        if (!/^https?:\/\//i.test(rawEndpoint)) {
          rawEndpoint = (cfg.useSsl ? 'https://' : 'http://') + rawEndpoint;
        }
        return {
          endpoint: rawEndpoint,
          region: 'us-east-1',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKey || cfg.accessKeyId || '').trim(),
          secretAccessKey: (cfg.secretKey || cfg.secretAccessKey || '').trim(),
          pathPrefix: 'vault/'
        };
      }
      default:
        return {
          endpoint: (cfg.endpoint || '').trim().replace(/\/+$/, ''),
          region: 'us-east-1',
          bucketName: (cfg.bucketName || '').trim(),
          accessKeyId: (cfg.accessKeyId || cfg.accessKey || '').trim(),
          secretAccessKey: (cfg.secretAccessKey || cfg.secretKey || '').trim(),
          pathPrefix: 'backups/'
        };
    }
  }

  validateConfig() {
    const { endpoint, bucketName, accessKeyId, secretAccessKey } = this.getEndpointDetails();

    if (this.id === 'cloudflare_r2' && !this.config.accountId) {
      return { valid: false, error: 'Vui lòng nhập Cloudflare Account ID!' };
    }
    if (!accessKeyId) {
      return { valid: false, error: 'Vui lòng nhập Access Key ID / Root Key!' };
    }
    if (!secretAccessKey) {
      return { valid: false, error: 'Vui lòng nhập Secret Access Key!' };
    }
    if (!bucketName) {
      return { valid: false, error: 'Vui lòng nhập tên Bucket Name!' };
    }
    if (!endpoint) {
      return { valid: false, error: 'Vui lòng cấu hình Endpoint URL hợp lệ!' };
    }

    return { valid: true };
  }

  async testConnection() {
    const val = this.validateConfig();
    if (!val.valid) {
      return { success: false, pingMs: 0, message: val.error };
    }

    const { endpoint, region, bucketName, accessKeyId, secretAccessKey } = this.getEndpointDetails();
    const testUrl = `${endpoint}/${bucketName}?max-keys=1`;
    const start = performance.now();

    try {
      // 1. In Electron desktop app: use native IPC test to avoid browser CORS limitations
      if (typeof window !== 'undefined' && window.electronAPI?.testCloudConnection) {
        const res = await window.electronAPI.testCloudConnection({
          providerId: this.id,
          endpoint,
          region,
          bucketName,
          accessKeyId,
          secretAccessKey
        });
        return res;
      }

      // 2. Real Web Crypto SigV4 signed request
      const signedHeaders = await signS3Request({
        method: 'GET',
        url: testUrl,
        region,
        service: 's3',
        accessKeyId,
        secretAccessKey
      });

      const response = await fetch(testUrl, {
        method: 'GET',
        headers: signedHeaders,
        mode: 'cors'
      });

      const pingMs = Math.round(performance.now() - start);

      if (response.status === 200 || response.status === 204) {
        return {
          success: true,
          pingMs,
          message: `Kết nối thành công tới ${this.name}! (Bucket: "${bucketName}", Ping: ${pingMs}ms)`,
          details: { status: response.status, endpoint }
        };
      }

      const bodyText = await response.text();

      if (response.status === 403) {
        return {
          success: false,
          pingMs,
          message: `Lỗi 403 Forbidden: Access Key hoặc Secret Key không đúng, hoặc không có quyền truy cập bucket "${bucketName}".`
        };
      }

      if (response.status === 404) {
        return {
          success: false,
          pingMs,
          message: `Lỗi 404 Not Found: Bucket "${bucketName}" không tồn tại trên ${this.name}. Vui lòng tạo Bucket trước.`
        };
      }

      if (response.status === 301) {
        return {
          success: false,
          pingMs,
          message: `Lỗi 301 Moved: Bucket nằm ở Region khác hoặc Endpoint chưa chính xác.`
        };
      }

      return {
        success: false,
        pingMs,
        message: `Máy chủ ${this.name} trả về lỗi HTTP ${response.status}: ${bodyText.slice(0, 150) || response.statusText}`
      };
    } catch (err) {
      const pingMs = Math.round(performance.now() - start);
      return {
        success: false,
        pingMs,
        message: `Lỗi kết nối tới máy chủ ${this.name}: ${err.message}`
      };
    }
  }

  async uploadBackup(fileName, data, onProgress = () => {}) {
    const { endpoint, region, bucketName, accessKeyId, secretAccessKey, pathPrefix } = this.getEndpointDetails();
    const objectKey = `${pathPrefix.replace(/\/+$/, '')}/${fileName}`;
    const uploadUrl = `${endpoint}/${bucketName}/${objectKey}`;

    onProgress(15, `Đang kết nối tới ${this.name} (${endpoint})...`);

    const payloadContent = typeof data === 'string'
      ? data
      : (data instanceof Blob)
      ? await data.text()
      : JSON.stringify(data || { backup: true, timestamp: Date.now() });

    const payloadBytes = new TextEncoder().encode(payloadContent);

    onProgress(35, `Đang tạo chữ ký bảo mật AWS SigV4...`);

    // 1. If Electron IPC native upload is available, use it for zero-CORS S3 upload
    if (typeof window !== 'undefined' && window.electronAPI?.uploadCloudBackup) {
      onProgress(60, `Đang tải file lên bucket "${bucketName}"...`);
      const ipcRes = await window.electronAPI.uploadCloudBackup({
        providerId: this.id,
        endpoint,
        region,
        bucketName,
        objectKey,
        accessKeyId,
        secretAccessKey,
        payload: payloadContent
      });

      if (!ipcRes.success) {
        throw new Error(ipcRes.message || 'Lỗi tải lên máy chủ S3');
      }

      onProgress(100, `Hoàn tất lưu trữ: ${objectKey}`);
      return {
        success: true,
        fileId: objectKey,
        fileUrl: uploadUrl,
        sizeBytes: payloadBytes.byteLength
      };
    }

    // 2. Real standard signed HTTP PUT request
    const signedHeaders = await signS3Request({
      method: 'PUT',
      url: uploadUrl,
      region,
      service: 's3',
      accessKeyId,
      secretAccessKey,
      headers: {
        'content-type': 'application/octet-stream',
        'x-amz-acl': 'private'
      },
      payload: payloadContent
    });

    onProgress(65, `Đang truyền ${payloadBytes.byteLength} bytes tới bucket "${bucketName}"...`);

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: signedHeaders,
      body: payloadBytes
    });

    if (!putRes.ok && putRes.status !== 204) {
      const errText = await putRes.text();
      throw new Error(`Tải lên S3 thất bại (${putRes.status}): ${errText.slice(0, 150) || putRes.statusText}`);
    }

    onProgress(100, `Hoàn tất lưu trữ trên ${this.name}: ${objectKey}`);

    return {
      success: true,
      fileId: objectKey,
      fileUrl: uploadUrl,
      sizeBytes: payloadBytes.byteLength
    };
  }
}
