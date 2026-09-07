import React from 'react';
import { BrowserProvider, useBrowser } from './store/BrowserContext';
import TitleBar from './components/titlebar/TitleBar';
import ManagementLayout from './layouts/ManagementLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import ProfileModal from './components/modals/ProfileModal';
import ProxyModal from './components/modals/ProxyModal';
import UpgradeModal from './components/modals/UpgradeModal';
import SettingsModal from './components/modals/SettingsModal';
import ReferralModal from './components/modals/ReferralModal';
import TrashModal from './components/modals/TrashModal';
import HomePage from './pages/HomePage';
import BackupPage from './pages/BackupPage';
import ProfilesPage from './pages/ProfilesPage';
import ProxiesPage from './pages/ProxiesPage';
import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';
import ExtensionsPage from './pages/ExtensionsPage';
import LoginPage from './features/auth/LoginPage';

function AppContent() {
  const {
    isAuthenticated,
    activeTab,
    activeProfileModal,
    activeProxyModal,
    activeUpgradeModal,
    activeSettingsModal,
    activeReferralModal,
    activeTrashModal
  } = useBrowser();

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
        <LoginPage />
        {activeProxyModal && <ProxyModal />}
        {activeSettingsModal && <SettingsModal />}
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'workspace':  return <HomePage />;
      case 'backup':     return <BackupPage />;
      case 'profiles':   return <ProfilesPage />;
      case 'proxies':    return <ProxiesPage />;
      case 'groups':     return <GroupsPage />;
      case 'extensions': return <ExtensionsPage />;
      case 'settings':   return <SettingsPage />;
      default:           return <HomePage />;
    }
  };

  const Layout = (activeTab === 'workspace' || activeTab === 'backup') ? WorkspaceLayout : ManagementLayout;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#EBEEF2',
      border: '1px solid #DCE0E6',
      boxSizing: 'border-box'
    }}>
      <TitleBar />
      <Layout>{renderPage()}</Layout>
      {activeProfileModal && <ProfileModal />}
      <ProxyModal />
      {activeUpgradeModal && <UpgradeModal />}
      {activeSettingsModal && <SettingsModal />}
      {activeReferralModal && <ReferralModal />}
      {activeTrashModal && <TrashModal />}
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
