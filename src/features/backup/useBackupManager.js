import { useState, useEffect, useCallback } from 'react';
import { BACKUP_PROVIDERS, INITIAL_MOCK_HISTORY } from './backupConstants';

const CONFIGS_STORAGE_KEY = 'antidetect_backup_configs';
const HISTORY_STORAGE_KEY = 'antidetect_backup_history';
const SCHEDULE_STORAGE_KEY = 'antidetect_backup_schedule';

export function useBackupManager() {
  // Provider configurations
  const [configs, setConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default configured provider for quick demo (Cloudflare R2 pre-configured)
    return {
      cloudflare_r2: {
        accountId: 'a8b9c1d2e3f4g5h67890123456789abc',
        accessKeyId: '8f92a34b5c6d7e8f901234567890abcd',
        secretAccessKey: '••••••••••••••••••••••••••••••••••••••••',
        bucketName: 'antidetect-profiles-backup',
        pathPrefix: 'vault/',
        isConfigured: true,
        lastSynced: '2026-09-06 22:00'
      }
    };
  });

  // Backup history
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MOCK_HISTORY;
  });

  // Schedule settings
  const [schedule, setSchedule] = useState(() => {
    try {
      const saved = localStorage.getItem(SCHEDULE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      enabled: true,
      providerId: 'cloudflare_r2',
      interval: 'daily', // 'daily' | 'on_close' | 'weekly'
      autoEncrypt: true,
      notifyTelegram: true
    };
  });

  // Realtime backup execution state
  const [backupStatus, setBackupStatus] = useState('idle'); // 'idle' | 'running' | 'success' | 'error'
  const [backupProgress, setBackupProgress] = useState(0);
  const [backupLogs, setBackupLogs] = useState([]);
  const [currentRunningProvider, setCurrentRunningProvider] = useState(null);

  // Save configs to localStorage
  const saveProviderConfig = useCallback((providerId, formValues) => {
    setConfigs((prev) => {
      const updated = {
        ...prev,
        [providerId]: {
          ...formValues,
          isConfigured: true,
          updatedAt: new Date().toISOString()
        }
      };
      try {
        localStorage.setItem(CONFIGS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  // Update schedule
  const updateSchedule = useCallback((newSchedule) => {
    setSchedule((prev) => {
      const updated = { ...prev, ...newSchedule };
      try {
        localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  // Test provider connection
  const testConnection = useCallback(async (providerId, tempConfig = null) => {
    const provider = BACKUP_PROVIDERS.find((p) => p.id === providerId);
    const config = tempConfig || configs[providerId] || {};

    // Basic validation
    if (providerId === 'telegram') {
      if (config.authMode === 'qr_login' && !config.telegramAccount) {
        return { success: false, message: 'Vui lòng nhấn "Quét mã QR" để liên kết tài khoản Telegram!' };
      }
      if (config.authMode === 'bot_token' && !config.botToken) {
        return { success: false, message: 'Vui lòng nhập Telegram Bot Token (@BotFather)!' };
      }
    } else if (providerId === 'google_drive') {
      if (config.authMode === 'oauth_browser' && !config.googleAccount) {
        return { success: false, message: 'Vui lòng nhấn "Đăng nhập với Google để cấp quyền"!' };
      }
      if (config.authMode === 'refresh_token' && !config.refreshToken) {
        return { success: false, message: 'Vui lòng nhập Google Refresh Token hợp lệ!' };
      }
      if (config.authMode === 'client_id' && !config.clientId) {
        return { success: false, message: 'Vui lòng nhập Google Authenticate Client ID!' };
      }
    } else if (!config.bucketName) {
      return { success: false, message: 'Vui lòng cấu hình Bucket Name!' };
    }

    // Simulate network roundtrip latency
    const pingMs = Math.floor(Math.random() * 45) + 35;
    await new Promise((resolve) => setTimeout(resolve, 600));

    let authDetail = '';
    if (providerId === 'telegram') {
      authDetail = config.authMode === 'qr_login' 
        ? `Tài khoản: ${config.telegramAccount?.username || '@telegram_user'} (Saved Messages)` 
        : `Bot: ${config.botToken?.slice(0, 10)}... (Chat ID: ${config.chatId || 'private'})`;
    } else if (providerId === 'google_drive') {
      authDetail = config.authMode === 'oauth_browser'
        ? `OAuth 2.0: ${config.googleAccount?.email || 'user@gmail.com'}`
        : config.authMode === 'refresh_token'
        ? `Refresh Token (Thư mục: ${config.folderId || 'Root'})`
        : `Client ID: ${config.clientId?.slice(0, 15)}...`;
    }

    return {
      success: true,
      pingMs,
      message: `Kết nối thành công tới ${provider?.name || providerId}! (Ping: ${pingMs}ms, ${authDetail || 'Auth verified'})`
    };
  }, [configs]);

  // Execute backup
  const executeBackup = useCallback(
    async (providerId, options = {}, profileList = []) => {
      const provider = BACKUP_PROVIDERS.find((p) => p.id === providerId);
      if (!provider) return;

      setBackupStatus('running');
      setBackupProgress(5);
      setCurrentRunningProvider(provider.name);
      setBackupLogs([
        `[Khởi động] Bắt đầu phiên sao lưu lên ${provider.name}...`,
        `[1/5] Quét hồ sơ trình duyệt (${profileList.length || 24} profiles)...`
      ]);

      await new Promise((r) => setTimeout(r, 450));
      setBackupProgress(25);
      setBackupLogs((logs) => [
        ...logs,
        `[2/5] Đóng gói cookie, fingerprint canvas, proxy và tiện ích mở rộng...`
      ]);

      await new Promise((r) => setTimeout(r, 550));
      setBackupProgress(55);
      const isEncrypted = !!options.encryptWithPassword;
      setBackupLogs((logs) => [
        ...logs,
        isEncrypted
          ? `[3/5] Mã hóa bảo mật file nén với chuẩn AES-256-GCM...`
          : `[3/5] Nén dữ liệu thành gói lưu trữ định dạng .agbackup...`
      ]);

      await new Promise((r) => setTimeout(r, 650));
      setBackupProgress(85);
      setBackupLogs((logs) => [
        ...logs,
        `[4/5] Đang upload lên ${provider.name} (${providerId === 'telegram' ? 'gửi document' : 'S3 Multi-part Upload'})...`
      ]);

      await new Promise((r) => setTimeout(r, 500));
      setBackupProgress(100);

      const now = new Date();
      const timeStr = now.toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);
      const newBackupItem = {
        id: `bk-${Date.now()}`,
        fileName: `backup_${providerId}_${timeStr}.${isEncrypted ? 'agbackup' : 'zip'}`,
        providerId,
        providerName: provider.name,
        size: `${(Math.random() * 6 + 10).toFixed(1)} MB`,
        profileCount: profileList.length || 24,
        proxyCount: 12,
        createdAt: now.toLocaleString('vi-VN'),
        status: 'success',
        encrypted: isEncrypted
      };

      setBackupLogs((logs) => [
        ...logs,
        `[5/5] Hoàn tất 100%! Đã lưu trữ an toàn: ${newBackupItem.fileName} (${newBackupItem.size})`
      ]);

      setBackupStatus('success');

      setHistory((prev) => {
        const updated = [newBackupItem, ...prev];
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      // Update provider lastSynced
      setConfigs((prev) => ({
        ...prev,
        [providerId]: {
          ...(prev[providerId] || {}),
          isConfigured: true,
          lastSynced: now.toLocaleString('vi-VN')
        }
      }));
    },
    []
  );

  // Restore backup
  const restoreBackup = useCallback(async (backupItem) => {
    const confirmed = confirm(`Bạn có chắc chắn muốn phục hồi bản sao lưu "${backupItem.fileName}" (${backupItem.profileCount} hồ sơ)? Các cấu hình trùng lặp sẽ được cập nhật.`);
    if (!confirmed) return false;

    await new Promise((r) => setTimeout(r, 700));
    alert(`Phục hồi thành công ${backupItem.profileCount} hồ sơ từ bản sao lưu ${backupItem.providerName}!`);
    return true;
  }, []);

  // Delete backup history item
  const deleteBackupItem = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const resetBackupStatus = useCallback(() => {
    setBackupStatus('idle');
    setBackupProgress(0);
    setBackupLogs([]);
    setCurrentRunningProvider(null);
  }, []);

  return {
    configs,
    saveProviderConfig,
    history,
    deleteBackupItem,
    schedule,
    updateSchedule,
    testConnection,
    executeBackup,
    restoreBackup,
    backupStatus,
    backupProgress,
    backupLogs,
    currentRunningProvider,
    resetBackupStatus
  };
}
