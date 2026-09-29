import { BACKUP_PROVIDERS } from '../backupConstants';
import { S3CompatibleProvider } from './providers/S3CompatibleProvider';
import { TelegramStorageProvider } from './providers/TelegramStorageProvider';
import { GoogleDriveProvider } from './providers/GoogleDriveProvider';

const RUST_DAEMON_URL = 'http://127.0.0.1:50325/api/v1/backup';

/**
 * ProviderFactory
 * Factory class to instantiate the appropriate Cloud Backup Provider
 * Dispatches through Rust Local Daemon Engine when available.
 */
export class ProviderFactory {
  /**
   * Instantiate a provider object
   * @param {string} providerId
   * @param {object} config
   * @returns {BaseStorageProvider}
   */
  static create(providerId, config = {}) {
    const providerInfo = BACKUP_PROVIDERS.find(p => p.id === providerId) || { id: providerId, name: providerId };

    switch (providerId) {
      case 'telegram':
        return new TelegramStorageProvider(config, providerInfo);

      case 'google_drive':
        return new GoogleDriveProvider(config, providerInfo);

      case 'cloudflare_r2':
      case 'aws_s3':
      case 'bizfly':
      case 'cloudfly':
      case 'digitalocean':
      case 'wasabi':
      case 'minio':
      default:
        return new S3CompatibleProvider(config, providerInfo);
    }
  }

  /**
   * Connection test helper - Routes through Rust Local Daemon Engine or Provider instance
   */
  static async testConnection(providerId, config = {}) {
    // 1. Prioritize Rust Local Core Daemon if online
    try {
      const daemonRes = await fetch(`${RUST_DAEMON_URL}/test-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: providerId,
          ...config
        })
      });

      if (daemonRes.ok) {
        const json = await daemonRes.json();
        if (json.data && json.data.success !== undefined) {
          return json.data;
        }
        if (json.success !== undefined) {
          return json;
        }
      }
    } catch (e) {
      // Rust daemon not running or network blocked, proceed with provider adapter
    }

    const provider = ProviderFactory.create(providerId, config);
    return await provider.testConnection();
  }

  /**
   * Upload helper - Routes through Rust Local Daemon Engine or Provider instance
   */
  static async uploadBackup(providerId, config = {}, fileName, data, onProgress) {
    // 1. Prioritize Rust Local Core Daemon for high-speed native upload
    try {
      onProgress?.(20, 'Đang gửi gói sao lưu tới Rust Local Daemon Engine...');
      const daemonRes = await fetch(`${RUST_DAEMON_URL}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: {
            provider_id: providerId,
            ...config
          },
          filename: fileName,
          data_utf8: typeof data === 'string' ? data : JSON.stringify(data)
        })
      });

      if (daemonRes.ok) {
        const json = await daemonRes.json();
        if (json.data?.success || json.success) {
          onProgress?.(100, `Hoàn tất lưu trữ qua Rust Daemon: ${fileName}`);
          return json.data || json;
        }
      }
    } catch (e) {
      // Fallback to provider instance
    }

    const provider = ProviderFactory.create(providerId, config);
    return await provider.uploadBackup(fileName, data, onProgress);
  }
}
