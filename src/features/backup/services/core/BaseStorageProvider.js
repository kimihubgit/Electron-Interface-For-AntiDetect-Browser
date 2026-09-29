/**
 * BaseStorageProvider - Abstract Base Class for all Cloud Backup Providers
 * Defines standard lifecycle, validation, testConnection and file transfer methods.
 */

export class BaseStorageProvider {
  constructor(config = {}, providerInfo = {}) {
    this.config = config;
    this.providerInfo = providerInfo;
    this.id = providerInfo.id || 'unknown';
    this.name = providerInfo.name || 'Unknown Provider';
  }

  /**
   * Validate configuration fields before attempting network requests
   * @returns {{ valid: boolean, error?: string }}
   */
  validateConfig() {
    throw new Error('validateConfig() must be implemented by subclass');
  }

  /**
   * Test connection to the host server/API
   * @returns {Promise<{ success: boolean, pingMs: number, message: string, details?: any }>}
   */
  async testConnection() {
    throw new Error('testConnection() must be implemented by subclass');
  }

  /**
   * Upload packaged backup data to the remote host
   * @param {string} fileName - Destination filename (e.g. backup_2026.zip)
   * @param {Blob|ArrayBuffer|string} data - Payload data
   * @param {function} onProgress - Callback(percent, stepMessage)
   * @returns {Promise<{ success: boolean, fileId?: string, fileUrl?: string, sizeBytes?: number }>}
   */
  async uploadBackup(fileName, data, onProgress = () => {}) {
    throw new Error('uploadBackup() must be implemented by subclass');
  }

  /**
   * List remote backups stored in the bucket / folder
   * @returns {Promise<Array<{ id: string, fileName: string, size: string, createdAt: string }>>}
   */
  async listBackups() {
    return [];
  }

  /**
   * Delete a backup file from the remote host
   * @param {string} fileId
   * @returns {Promise<boolean>}
   */
  async deleteBackup(fileId) {
    return true;
  }

  /**
   * Utility helper to measure execution latency
   */
  async measureLatency(asyncFn) {
    const start = performance.now();
    const result = await asyncFn();
    const pingMs = Math.round(performance.now() - start);
    return { result, pingMs };
  }
}
