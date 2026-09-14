import React, { useState } from 'react';
import {
  CloudUpload,
  Database,
  History,
  Clock,
  ShieldCheck,
  Sparkles,
  Play,
  CheckCircle2,
  FileArchive,
  RefreshCw
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { BACKUP_PROVIDERS } from '../features/backup/backupConstants';
import { useBackupManager } from '../features/backup/useBackupManager';
import ProviderCard from '../features/backup/components/ProviderCard';
import ProviderConfigModal from '../features/backup/components/ProviderConfigModal';
import BackupExecutionPanel from '../features/backup/components/BackupExecutionPanel';
import BackupHistoryTable from '../features/backup/components/BackupHistoryTable';
import BackupScheduleTab from '../features/backup/components/BackupScheduleTab';

export default function BackupPage() {
  const { profiles = [], proxies = [] } = useBrowser();
  const [activeSubTab, setActiveSubTab] = useState('providers'); // 'providers' | 'create' | 'history' | 'schedule'
  const [editingProvider, setEditingProvider] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const {
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
  } = useBackupManager();

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleTestConnection = async (providerId, tempConfig) => {
    const res = await testConnection(providerId, tempConfig);
    showToast(res.message);
    return res;
  };

  const handleQuickBackup = (providerId) => {
    setActiveSubTab('create');
    executeBackup(providerId, { encryptWithPassword: false }, profiles);
  };

  const configuredCount = BACKUP_PROVIDERS.filter((p) => configs[p.id]?.isConfigured).length;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#F8F9FA',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* ── Top Header ── */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <CloudUpload size={18} />
            </div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
              Sao lưu & Đồng bộ Đám mây (Cloud Backup & Sync)
            </h1>
            <span style={{
              fontSize: '11.5px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple)'
            }}>
              {configuredCount}/{BACKUP_PROVIDERS.length} Nền tảng đã kết nối
            </span>
          </div>
          <p style={{ margin: '4px 0 0 42px', fontSize: '12.5px', color: '#64748B' }}>
            Hỗ trợ sao lưu an toàn hồ sơ, proxy và cấu hình lên Cloudflare R2, Google Drive, AWS S3, Wasabi, DigitalOcean, BizflyCloud VN, Cloudfly VN, MinIO và Telegram.
          </p>
        </div>

        {/* Top Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 14px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple)'}
          >
            <Play size={13} fill="#FFFFFF" />
            <span>Sao lưu ngay</span>
          </button>
        </div>
      </div>

      {/* ── Sub Navigation Tabs ── */}
      <div style={{
        padding: '0 24px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        gap: '4px',
        flexShrink: 0
      }}>
        {[
          { id: 'providers', label: 'Nền tảng lưu trữ', icon: Database, count: BACKUP_PROVIDERS.length },
          { id: 'create', label: 'Tiến hành sao lưu', icon: CloudUpload },
          { id: 'history', label: 'Lịch sử & Phục hồi', icon: History, count: history.length },
          { id: 'schedule', label: 'Lên lịch tự động', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
                color: isActive ? 'var(--apidog-purple)' : '#64748B',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isActive ? '#EDE9FE' : '#F1F5F9',
                  color: isActive ? 'var(--apidog-purple)' : '#64748B',
                  fontWeight: 600
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toast notification banner */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '52px',
          right: '24px',
          zIndex: 1100,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '12.5px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInModal 0.2s ease'
        }}>
          <CheckCircle2 size={16} style={{ color: '#4ADE80' }} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Main Tab Content ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '24px',
        boxSizing: 'border-box'
      }}>
        {/* Tab 1: Providers Grid (9 providers) */}
        {activeSubTab === 'providers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {BACKUP_PROVIDERS.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  config={configs[provider.id]}
                  onConfigure={(p) => setEditingProvider(p)}
                  onTest={handleTestConnection}
                  onQuickBackup={handleQuickBackup}
                />
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Create Backup */}
        {activeSubTab === 'create' && (
          <BackupExecutionPanel
            configs={configs}
            profiles={profiles}
            proxies={proxies}
            onExecuteBackup={executeBackup}
            backupStatus={backupStatus}
            backupProgress={backupProgress}
            backupLogs={backupLogs}
            currentRunningProvider={currentRunningProvider}
            onResetStatus={resetBackupStatus}
          />
        )}

        {/* Tab 3: History & Restore */}
        {activeSubTab === 'history' && (
          <BackupHistoryTable
            history={history}
            onRestore={restoreBackup}
            onDelete={deleteBackupItem}
          />
        )}

        {/* Tab 4: Schedule */}
        {activeSubTab === 'schedule' && (
          <BackupScheduleTab
            schedule={schedule}
            onUpdateSchedule={updateSchedule}
            configs={configs}
          />
        )}
      </div>

      {/* ── Modal for editing provider config ── */}
      {editingProvider && (
        <ProviderConfigModal
          provider={editingProvider}
          currentConfig={configs[editingProvider.id] || {}}
          onSave={saveProviderConfig}
          onClose={() => setEditingProvider(null)}
          onTestConnection={handleTestConnection}
        />
      )}
    </div>
  );
}
