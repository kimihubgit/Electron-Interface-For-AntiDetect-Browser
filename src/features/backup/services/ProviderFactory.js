import { BACKUP_PROVIDERS } from '../backupConstants';
import { S3CompatibleProvider } from './providers/S3CompatibleProvider';
import { TelegramStorageProvider } from './providers/TelegramStorageProvider';
import { GoogleDriveProvider } from './providers/GoogleDriveProvider';

/**
 * ProviderFactory
 * Factory class to instantiate the appropriate Cloud Backup Provider
 * based on provider ID.
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
   * Quick connection test helper
   */
  static async testConnection(providerId, config = {}) {
    const provider = ProviderFactory.create(providerId, config);
    return await provider.testConnection();
  }

  /**
   * Quick upload helper
   */
  static async uploadBackup(providerId, config = {}, fileName, data, onProgress) {
    const provider = ProviderFactory.create(providerId, config);
    return await provider.uploadBackup(fileName, data, onProgress);
  }
}
