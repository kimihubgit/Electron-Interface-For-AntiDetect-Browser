import React from 'react';
import { BrowserProvider, useBrowser } from './store/BrowserContext';
import TitleBar from './components/titlebar/TitleBar';
import ManagementLayout from './layouts/ManagementLayout';
import WorkspaceLayout from './layouts/WorkspaceLayout';
import ProfileModal from './components/modals/ProfileModal';
import ProxyModal from './components/modals/ProxyModal';
import UpgradeModal from './components/modals/UpgradeModal';
import HomePage from './pages/HomePage';
import ProfilesPage from './pages/ProfilesPage';
import ProxiesPage from './pages/ProxiesPage';
import GroupsPage from './pages/GroupsPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { activeTab, activeProfileModal, activeUpgradeModal } = useBrowser();

  const renderPage = () => {
    switch (activeTab) {
      case 'workspace': return <HomePage />;
      case 'profiles':  return <ProfilesPage />;
      case 'proxies':   return <ProxiesPage />;
      case 'groups':    return <GroupsPage />;
      case 'settings':  return <SettingsPage />;
      default:          return <HomePage />;
    }
  };

  const Layout = activeTab === 'workspace' ? WorkspaceLayout : ManagementLayout;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      <TitleBar />
      <Layout>{renderPage()}</Layout>
      {activeProfileModal && <ProfileModal />}
      <ProxyModal />
      {activeUpgradeModal && <UpgradeModal />}
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
