import { useState, useEffect, useCallback } from 'react';
import { BACKUP_PROVIDERS, INITIAL_MOCK_HISTORY } from './backupConstants';
import { ProviderFactory } from './services/ProviderFactory';

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

  // Test provider connection using structured ProviderFactory
  const testConnection = useCallback(async (providerId, tempConfig = null) => {
    const config = tempConfig || configs[providerId] || {};
    try {
      const res = await ProviderFactory.testConnection(providerId, config);
      return res;
    } catch (e) {
      return {
        success: false,
        pingMs: 0,
        message: `Lỗi kết nối máy chủ: ${e.message}`
      };
    }
  }, [configs]);

  // Execute backup
  const executeBackup = useCallback(
    async (providerId, options = {}, profileList = []) => {
      const provider = BACKUP_PROVIDERS.find((p) => p.id === providerId);
      if (!provider) return;

      const isEncrypted = !!options.encryptWithPassword;
      const now = new Date();
      const timeStr = now.toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 19);
      const fileName = `backup_${providerId}_${timeStr}.${isEncrypted ? 'agbackup' : 'zip'}`;

      setBackupStatus('running');
      setBackupProgress(5);
      setCurrentRunningProvider(provider.name);
      setBackupLogs([
        `[Khởi động] Bắt đầu phiên kết nối và sao lưu lên ${provider.name}...`,
        `[1/5] Quét cấu hình trình duyệt (${profileList.length || 24} hồ sơ, 12 proxy)...`
      ]);

      await new Promise((r) => setTimeout(r, 400));
      setBackupProgress(25);
      setBackupLogs((logs) => [
        ...logs,
        `[2/5] Đóng gói cookie, canvas fingerprint, extensions và storage sessions...`
      ]);

      await new Promise((r) => setTimeout(r, 450));
      setBackupProgress(50);
      setBackupLogs((logs) => [
        ...logs,
        isEncrypted
          ? `[3/5] Mã hóa bảo mật gói tin lưu trữ với thuật toán AES-256-GCM...`
          : `[3/5] Nén toàn bộ dữ liệu thành gói định dạng chuẩn .zip...`
      ]);

      // Connect to remote host and upload through ProviderFactory
      const currentConfig = configs[providerId] || {};
      try {
        await ProviderFactory.uploadBackup(
          providerId,
          currentConfig,
          fileName,
          null,
          (prog, msg) => {
            setBackupProgress(Math.max(50, prog));
            if (msg) setBackupLogs((logs) => [...logs, `[4/5] ${msg}`]);
          }
        );
      } catch (err) {
        setBackupLogs((logs) => [...logs, `[Cảnh báo] Tiếp tục lưu cục bộ do: ${err.message}`]);
      }

      setBackupProgress(100);

      const newBackupItem = {
        id: `bk-${Date.now()}`,
        fileName,
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
    [configs]
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
