import React, { useEffect } from 'react';
import { BrowserProvider, useBrowser } from './store/BrowserContext';
import TitleBar from './components/titlebar/TitleBar';
import ManagementLayout from './layouts/ManagementLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import ProfileModal from './components/modals/ProfileModal';
import BatchCreateProfileModal from './components/modals/BatchCreateProfileModal';
import ProxyModal from './components/modals/ProxyModal';
import UpgradeModal from './components/modals/UpgradeModal';
import SettingsModal from './components/modals/SettingsModal';
import ReferralModal from './components/modals/ReferralModal';
import TrashModal from './components/modals/TrashModal';
import AppUpdateModal from './components/modals/AppUpdateModal';
import HomePage from './pages/HomePage';
import BackupPage from './pages/BackupPage';
import ProfilesPage from './pages/ProfilesPage';
import ProxiesPage from './pages/ProxiesPage';
import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';
import ExtensionsPage from './pages/ExtensionsPage';
import HistoryPage from './pages/HistoryPage';
import AutomationPage from './pages/AutomationPage';
import ScriptsPage from './pages/ScriptsPage';
import ProxyRequestPage from './pages/ProxyRequestPage';
import TeamPage from './pages/TeamPage';
import LoginPage from './features/auth/LoginPage';
import AiAgentDebuggerPage from './pages/AiAgentDebuggerPage';
import ProxyRequestModal from './components/modals/ProxyRequestModal';
import ErrorBoundary from './components/common/ErrorBoundary';
import GlobalToast from './components/common/GlobalToast';
import OfflineBanner from './components/common/OfflineBanner';

function AppContent() {
  const {
    isAuthenticated,
    activeTab,
    activeProfileModal,
    activeProxyModal,
    activeUpgradeModal,
    activeSettingsModal,
    activeProxyRequestModal,
    activeReferralModal,
    activeTrashModal,
    updateModalInfo,
    setUpdateModalInfo,
    checkUpdate,
    isReloading,
    reloadKey
  } = useBrowser();

  // Silent check for update on app startup
  useEffect(() => {
    if (checkUpdate) {
      checkUpdate(true);
    }
  }, []);

  const handleSimulateVersion = (version) => {
    if (checkUpdate) {
      checkUpdate(false, version);
    }
  };

  // Show Apidog Welcome Login screen on startup
  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '1px solid #DCE0E6',
        boxSizing: 'border-box'
      }}>
        <TitleBar isLoginScreen={true} />
        <OfflineBanner />
        <LoginPage />
        {activeProxyModal && <ProxyModal />}
        {activeSettingsModal && <SettingsModal />}
        {updateModalInfo && (
          <AppUpdateModal
            isOpen={Boolean(updateModalInfo)}
            updateInfo={updateModalInfo}
            onClose={() => setUpdateModalInfo(null)}
            onSimulateVersion={handleSimulateVersion}
          />
        )}
        <GlobalToast />
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'workspace': return <HomePage />;
      case 'backup': return <BackupPage />;
      case 'profiles': return <ProfilesPage />;
      case 'proxies': return <ProxiesPage />;
      case 'groups': return <GroupsPage />;
      case 'extensions': return <ExtensionsPage />;
      case 'history': return <HistoryPage />;
      case 'automation': return <AutomationPage />;
      case 'ai-agent':
      case 'mcp': return <AiAgentDebuggerPage />;
      case 'scripts': return <ScriptsPage />;
      case 'proxy-requests': return <ProxyRequestPage />;
      case 'settings': return <SettingsPage />;
      case 'team':
      case 'invite': return <TeamPage />;
      default: return <HomePage />;
    }
  };

  const Layout = (activeTab === 'workspace' || activeTab === 'automation' || activeTab === 'ai-agent' || activeTab === 'mcp') ? WorkspaceLayout : ManagementLayout;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--apidog-sidebar-bg)',
      border: '1px solid var(--apidog-border)',
      boxSizing: 'border-box'
    }}>
      <TitleBar />
      <OfflineBanner />
      {isReloading ? (
        <div style={{
          flex: 1,
          width: '100%',
          height: '100%',
          minHeight: 0,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none'
        }}>
          {/* Centered spinning clover logo */}
          <div
            style={{
              width: '26px',
              height: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'spin 1s linear infinite'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
            </svg>
          </div>
        </div>
      ) : (
        <ErrorBoundary key={reloadKey}>
          <Layout>{renderPage()}</Layout>
        </ErrorBoundary>
      )}
      {activeProfileModal === 'batch' ? (
        <BatchCreateProfileModal isOpen={true} onClose={() => setActiveProfileModal(null)} />
      ) : (
        activeProfileModal && <ProfileModal />
      )}
      {activeProxyModal && <ProxyModal />}
      {activeUpgradeModal && <UpgradeModal />}
      {activeSettingsModal && <SettingsModal />}
      {activeProxyRequestModal && <ProxyRequestModal />}
      {activeReferralModal && <ReferralModal />}
      {activeTrashModal && <TrashModal />}
      {updateModalInfo && (
        <AppUpdateModal
          isOpen={Boolean(updateModalInfo)}
          updateInfo={updateModalInfo}
          onClose={() => setUpdateModalInfo(null)}
          onSimulateVersion={handleSimulateVersion}
        />
      )}
      <GlobalToast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserProvider>
      <AppContent />
    </BrowserProvider>
  );
}
