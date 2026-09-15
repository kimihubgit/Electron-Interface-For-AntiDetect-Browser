import React, { useState, useEffect, useCallback } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import HomeWorkspaceHeader from './components/HomeWorkspaceHeader';
import HomeReferralBanner from './components/HomeReferralBanner';
import HomeProfileStats from './components/HomeProfileStats';
import HomeSystemHardwareMonitor from './components/HomeSystemHardwareMonitor';
import HomeQuickActionCards from './components/HomeQuickActionCards';

export default function HomePage() {
  const { t } = useTranslation();
  const {
    profiles = [],
    setActiveProfileModal,
    setActiveProxyModal,
    setActiveTab,
    setActiveTrashModal,
    setActiveReferralModal,
    currentWorkspace,
    setActiveUpgradeModal
  } = useBrowser();

  const [showBanner, setShowBanner] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showHomeWorkspaceMenu, setShowHomeWorkspaceMenu] = useState(false);

  // System Hardware Stats (CPU & RAM) - Polling định kỳ 30s tránh lag giao diện
  const [systemStats, setSystemStats] = useState({
    cpuPercent: 14,
    cpuModel: 'Intel / AMD Processor',
    cpuCores: 8,
    totalMemGB: '16.0',
    usedMemGB: '6.2',
    freeMemGB: '9.8',
    memPercent: 38,
    platform: 'Windows'
  });
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [lastStatsUpdated, setLastStatsUpdated] = useState(new Date());

  const fetchSystemStats = useCallback(async () => {
    if (window.electronAPI?.getSystemStats) {
      try {
        setIsRefreshingStats(true);
        const res = await window.electronAPI.getSystemStats();
        if (res.success && res.data) {
          setSystemStats(res.data);
          setLastStatsUpdated(new Date());
        }
      } catch (e) {
        console.warn('Failed to fetch system stats:', e);
      } finally {
        setIsRefreshingStats(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSystemStats();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSystemStats();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemStats]);

  // Stats calculation
  const totalCount = profiles.length;
  const runningCount = profiles.filter((p) => p.status === 'running').length;
  const idleCount = totalCount - runningCount;
  const proxyCount = profiles.filter((p) => p.proxy?.host).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        padding: '24px 36px 48px 36px',
        boxSizing: 'border-box'
      }}
      onClick={() => {
        if (showMoreMenu) setShowMoreMenu(false);
        if (showHomeWorkspaceMenu) setShowHomeWorkspaceMenu(false);
      }}
    >
      {/* 1. Workspace Header & Status Bar */}
      <HomeWorkspaceHeader
        currentWorkspace={currentWorkspace}
        totalCount={totalCount}
        showHomeWorkspaceMenu={showHomeWorkspaceMenu}
        setShowHomeWorkspaceMenu={setShowHomeWorkspaceMenu}
        onOpenUpgradeModal={() => setActiveUpgradeModal(true)}
      />

      {/* 2. Referral Banner */}
      <HomeReferralBanner
        showBanner={showBanner}
        onCloseBanner={() => setShowBanner(false)}
        onOpenReferralModal={() => setActiveReferralModal('referrals')}
        t={t}
      />

      {/* 3. Profile Statistics Cards */}
      <HomeProfileStats
        totalCount={totalCount}
        runningCount={runningCount}
        idleCount={idleCount}
        proxyCount={proxyCount}
        onNavigateTab={setActiveTab}
        t={t}
      />

      {/* 4. System Hardware & Performance Stats (CPU & RAM) */}
      <HomeSystemHardwareMonitor
        systemStats={systemStats}
        isRefreshingStats={isRefreshingStats}
        fetchSystemStats={fetchSystemStats}
        lastStatsUpdated={lastStatsUpdated}
      />

      {/* 5. The 4 Big Prominent Action Boxes & More Dropdown */}
      <HomeQuickActionCards
        onNewProfile={() => setActiveProfileModal('new')}
        onNewProxy={() => setActiveProxyModal(true)}
        onOpenSettings={() => setActiveTab('settings')}
        onQuickLaunch={() => setActiveTab('profiles')}
        showMoreMenu={showMoreMenu}
        setShowMoreMenu={setShowMoreMenu}
        onOpenGroups={() => {
          setActiveTab('groups');
          setShowMoreMenu(false);
        }}
        onOpenTrash={() => {
          setActiveTrashModal(true);
          setShowMoreMenu(false);
        }}
        t={t}
      />
    </div>
  );
}
