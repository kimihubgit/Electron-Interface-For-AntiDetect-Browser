import React from 'react';
import {
  Globe,
  Shield,
  FolderTree,
  History,
  Settings,
  Users,
  Rocket,
  Sparkles,
  Zap,
  Puzzle
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ActivityBar() {
  const {
    activeTab,
    setActiveTab,
    setActiveUpgradeModal,
    setActiveSettingsModal,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    toggleSidebar
  } = useBrowser();

  const primaryItems = [
    { id: 'profiles', label: 'Hồ sơ', icon: Globe },
    { id: 'proxies', label: 'Proxy', icon: Shield },
    { id: 'groups', label: 'Nhóm', icon: FolderTree },
    { id: 'extensions', label: 'Tiện ích', icon: Puzzle },
    { id: 'automation', label: 'Kịch bản', icon: Zap },
    { id: 'history', label: 'Lịch sử', icon: History },
  ];

  const bottomItems = [
    { id: 'invite', label: 'Nhóm', icon: Users },
  ];

  return (
    <aside style={{
      width: '56px',
      height: '100%',
      minHeight: 0,
      backgroundColor: 'var(--apidog-activity-bg)',
      borderRight: '1px solid var(--apidog-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0 8px 0',
      flexShrink: 0,
      zIndex: 30,
      boxSizing: 'border-box'
    }}>
      {/* Top App Logo (Gradient square like Apidog) */}
      <div
        onClick={() => setActiveTab('workspace')}
        title="Trang chủ (Home Workspace)"
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          marginBottom: '14px',
          boxShadow: '0 4px 10px rgba(124, 58, 237, 0.35)',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <Shield size={20} />
      </div>

      {/* Primary Navigation Stack */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        alignItems: 'center',
        flexGrow: 1,
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {primaryItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'upgrade') {
                  setActiveUpgradeModal(true);
                } else if (activeTab === item.id) {
                  toggleSidebar();
                } else {
                  setActiveTab(item.id);
                  if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                }
              }}
              title={item.label}
              style={{
                width: '44px',
                height: '46px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <Icon size={18} style={{ strokeWidth: isActive ? 2.3 : 1.8 }} />
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Stack */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
        alignItems: 'center',
        flexShrink: 0,
        marginTop: 'auto',
        paddingTop: '6px'
      }}>
        {bottomItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'upgrade') setActiveUpgradeModal(true);
                else if (item.id === 'settings') setActiveSettingsModal(true);
                else setActiveTab(item.id);
              }}
              title={item.label}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: item.highlight ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <Icon size={17} />
              <span style={{ fontSize: '10px', fontWeight: 500 }}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Watermark Logo */}
        <div style={{
          marginTop: '6px',
          fontSize: '10px',
          fontWeight: 700,
          color: '#9CA3AF',
          letterSpacing: '0.5px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          flexShrink: 0
        }}>
          <Sparkles size={12} style={{ color: 'var(--apidog-purple)' }} />
          <span>Nexus</span>
        </div>
      </div>
    </aside>
  );
}
