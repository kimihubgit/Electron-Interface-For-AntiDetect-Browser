import React, { useState } from 'react';
import { useTranslation } from '../../i18n/I18nContext';
import { useBrowser } from '../../store/BrowserContext';
import { ShieldCheck, Globe, Cookie as CookieIcon, Terminal, Activity, Clock } from 'lucide-react';
import HistorySessionBanner from './components/HistorySessionBanner';
import HistoryActionLaunchBar from './components/HistoryActionLaunchBar';
import HistoryMetricCards from './components/HistoryMetricCards';
import HistorySubTabsNav from './components/HistorySubTabsNav';
import HistoryFingerprintTab from './tabs/HistoryFingerprintTab';
import HistoryProxyTab from './tabs/HistoryProxyTab';
import HistoryCookiesTab from './tabs/HistoryCookiesTab';
import HistoryFlagsTab from './tabs/HistoryFlagsTab';
import HistoryLogsTab from './tabs/HistoryLogsTab';
import HistoryConsoleDrawer from './components/HistoryConsoleDrawer';
import HistoryFooterBar from './components/HistoryFooterBar';

export default function HistoryPage() {
  const { t } = useTranslation();
  const {
    historyRecords = [],
    selectedHistoryId,
    deleteHistoryRecord,
    clearHistory,
    toggleLaunchProfile,
    addLog
  } = useBrowser();

  // Selected history record
  const currentRecord = historyRecords.find((r) => r.id === selectedHistoryId) || historyRecords[0] || null;

  // Active sub-tab for Profile Run Details:
  // 'fingerprint' | 'proxy' | 'cookies' | 'flags' | 'logs'
  const [activeSubTab, setActiveSubTab] = useState('fingerprint');
  const [isConsoleDrawerOpen, setIsConsoleDrawerOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [logFilterTerm, setLogFilterTerm] = useState('');

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    if (addLog) addLog(`Đã sao chép ${key} vào clipboard`, 'info');
  };

  const handleReRun = () => {
    if (!currentRecord) return;
    if (currentRecord.profileId) {
      toggleLaunchProfile(currentRecord.profileId);
      if (addLog) addLog(`Khởi chạy lại từ lịch sử: "${currentRecord.profileName}"`, 'success');
    } else {
      if (addLog) addLog(`Khởi động phiên chạy: ${currentRecord.profileName}`, 'info');
    }
  };

  if (!currentRecord) {
    return (
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--apidog-bg)',
          color: 'var(--apidog-text-muted)',
          gap: '12px'
        }}
      >
        <Clock size={44} style={{ opacity: 0.35 }} />
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
          {t('history.emptyTitle')}
        </span>
        <span style={{ fontSize: '12.5px', maxWidth: '420px', textAlign: 'center', lineHeight: 1.5 }}>
          {t('history.emptyDesc')}
        </span>
      </div>
    );
  }

  const isRunning = currentRecord.status === 'running';
  const isCompleted = currentRecord.status === 'completed';

  // Sub-tabs list
  const subTabs = [
    { id: 'fingerprint', label: t('history.tabFingerprint'), icon: ShieldCheck, count: currentRecord.fingerprintSnapshot?.length || 10 },
    { id: 'proxy', label: t('history.tabProxy'), icon: Globe, badge: currentRecord.proxy?.type || 'SOCKS5' },
    { id: 'cookies', label: t('history.tabCookies'), icon: CookieIcon, count: currentRecord.cookies?.length || currentRecord.cookiesLoaded || 0 },
    { id: 'flags', label: t('history.tabFlags'), icon: Terminal, count: currentRecord.launchArgs?.length || 0 },
    { id: 'logs', label: t('history.tabLogs'), icon: Activity, count: currentRecord.logs?.length || 0 }
  ];

  // Filter logs if searching
  const displayedLogs = (currentRecord.logs || []).filter(
    (log) => !logFilterTerm || log.toLowerCase().includes(logFilterTerm.toLowerCase())
  );

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--apidog-card-bg)',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP SESSION BANNER / STATUS STRIP */}
      <HistorySessionBanner
        currentRecord={currentRecord}
        isRunning={isRunning}
        isCompleted={isCompleted}
        t={t}
      />

      {/* 2. PROFILE ACTION & QUICK LAUNCH BAR */}
      <HistoryActionLaunchBar
        currentRecord={currentRecord}
        isRunning={isRunning}
        handleCopy={handleCopy}
        copiedKey={copiedKey}
        handleReRun={handleReRun}
        deleteHistoryRecord={deleteHistoryRecord}
        t={t}
      />

      {/* 3. 4 QUICK METRIC CARDS */}
      <HistoryMetricCards currentRecord={currentRecord} t={t} />

      {/* 4. SUB-TABS NAVIGATION */}
      <HistorySubTabsNav
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
      />

      {/* 5. SUB-TAB CONTENT AREA */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '18px',
          backgroundColor: 'var(--apidog-card-bg)'
        }}
      >
        {activeSubTab === 'fingerprint' && (
          <HistoryFingerprintTab
            currentRecord={currentRecord}
            handleCopy={handleCopy}
            copiedKey={copiedKey}
            t={t}
          />
        )}

        {activeSubTab === 'proxy' && (
          <HistoryProxyTab currentRecord={currentRecord} t={t} />
        )}

        {activeSubTab === 'cookies' && (
          <HistoryCookiesTab
            currentRecord={currentRecord}
            handleCopy={handleCopy}
            copiedKey={copiedKey}
            t={t}
          />
        )}

        {activeSubTab === 'flags' && (
          <HistoryFlagsTab
            currentRecord={currentRecord}
            handleCopy={handleCopy}
            copiedKey={copiedKey}
            t={t}
          />
        )}

        {activeSubTab === 'logs' && (
          <HistoryLogsTab
            displayedLogs={displayedLogs}
            currentRecord={currentRecord}
            logFilterTerm={logFilterTerm}
            setLogFilterTerm={setLogFilterTerm}
            handleCopy={handleCopy}
            copiedKey={copiedKey}
            t={t}
          />
        )}
      </div>

      {/* 6. COLLAPSIBLE BOTTOM CONSOLE DRAWER */}
      <HistoryConsoleDrawer
        isConsoleDrawerOpen={isConsoleDrawerOpen}
        setIsConsoleDrawerOpen={setIsConsoleDrawerOpen}
        currentRecord={currentRecord}
        isRunning={isRunning}
        t={t}
      />

      {/* 7. FOOTER STATUS BAR */}
      <HistoryFooterBar clearHistory={clearHistory} t={t} />
    </div>
  );
}
