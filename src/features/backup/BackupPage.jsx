import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { BACKUP_PROVIDERS } from './backupConstants';
import { useBackupManager } from './useBackupManager';
import BackupHeader from './components/BackupHeader';
import BackupSubNav from './components/BackupSubNav';
import ProviderCard from './components/ProviderCard';
import ProviderConfigModal from './components/ProviderConfigModal';
import BackupExecutionPanel from './components/BackupExecutionPanel';
import BackupHistoryTable from './components/BackupHistoryTable';
import BackupScheduleTab from './components/BackupScheduleTab';

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
      <BackupHeader
        configuredCount={configuredCount}
        totalCount={BACKUP_PROVIDERS.length}
        onStartBackup={() => setActiveSubTab('create')}
      />

      {/* ── Sub Navigation Tabs ── */}
      <BackupSubNav
        activeSubTab={activeSubTab}
        onTabChange={setActiveSubTab}
        historyCount={history.length}
      />

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
        {/* Tab 1: Providers Grid */}
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
