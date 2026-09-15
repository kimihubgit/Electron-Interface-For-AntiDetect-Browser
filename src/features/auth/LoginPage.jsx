import React, { useState } from 'react';
import { Server, ChevronDown, ArrowLeft } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import LoginBackgroundRipples from './components/LoginBackgroundRipples';
import LoginCard from './components/LoginCard';
import LoginFooter from './components/LoginFooter';
import SelectServerModal from '../../components/modals/SelectServerModal';
import { useTranslation } from '../../i18n/I18nContext';

/**
 * Main Login Page replicating the Apidog Welcome screen with Server selector
 */
export default function LoginPage() {
  const { t } = useTranslation();
  const {
    login,
    useOfflineSpace,
    setActiveProxyModal,
    setActiveSettingsModal,
    showToast,
    isSwitchingAccount,
    previousAccount,
    cancelSwitchAccount
  } = useBrowser();

  const [selectedServer, setSelectedServer] = useState(() => {
    return localStorage.getItem('login_selected_server') || 'Auto (Default (1))';
  });
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);

  const handleSelectServer = (server) => {
    setSelectedServer(server.name);
    localStorage.setItem('login_selected_server', server.name);
    if (showToast) {
      showToast(t('toasts.serverSwitched', `Đã chuyển sang máy chủ: ${server.name}`, { name: server.name }), 'success');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* ── TOP-LEFT BRAND LOGO ── */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20
        }}
      >
        {/* Apidog Butterfly / Bowtie Logo */}
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10V14H10C7.79086 14 6 12.2091 6 10Z" fill="#3B82F6" />
          <path d="M18 10C18 7.79086 19.7909 6 22 6C24.2091 6 26 7.79086 26 10C26 12.2091 24.2091 14 22 14H18V10Z" fill="#2563EB" />
          <path d="M14 22C14 24.2091 12.2091 26 10 26C7.79086 26 6 24.2091 6 22C6 19.7909 7.79086 18 10 18H14V22Z" fill="#2563EB" />
          <path d="M22 18C24.2091 18 26 19.7909 26 22C26 24.2091 24.2091 26 22 26C19.7909 26 18 24.2091 18 22V18H22Z" fill="#3B82F6" />
        </svg>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.3px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Apidog
        </span>
      </div>

      {/* ── TOP-RIGHT SERVER QUICK-SELECTOR BADGE & BACK BUTTON ── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '28px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {/* Chỉ hiển thị nút "Quay lại ứng dụng" khi đang ở chế độ Switch/Add Account, KHÔNG hiển thị khi Logout */}
        {isSwitchingAccount && previousAccount && (
          <button
            onClick={cancelSwitchAccount}
            title={`Quay lại ứng dụng với tài khoản: ${previousAccount?.name || previousAccount?.email || previousAccount?.username}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '20px',
              padding: '6px 14px',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.backgroundColor = '#F1F5F9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
          >
            <ArrowLeft size={13} style={{ color: '#475569' }} />
            <span>Quay lại ứng dụng</span>
          </button>
        )}

        <button
          onClick={() => setIsServerModalOpen(true)}
          title="Chọn máy chủ (Select server)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 14px',
            color: '#334155',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
            }}
          />
          <Server size={14} style={{ color: '#3B82F6' }} />
          <span>Server: {selectedServer}</span>
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </button>
      </div>

      {/* ── CONCENTRIC CIRCLE RIPPLES BACKGROUND ── */}
      <LoginBackgroundRipples />

      {/* ── CENTER LOGIN CARD ── */}
      <LoginCard
        onLogin={login}
        onOfflineSpace={useOfflineSpace}
        showToast={showToast}
      />

      {/* ── BOTTOM FOOTER ── */}
      <LoginFooter
        onOpenProxy={() => setActiveProxyModal(true)}
        onOfflineSpace={useOfflineSpace}
        onToggleAppearance={() => setActiveSettingsModal('appearance')}
        currentServer={selectedServer}
        onOpenServerModal={() => setIsServerModalOpen(true)}
      />

      {/* ── SELECT SERVER MODAL ── */}
      <SelectServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        currentServer={selectedServer}
        onSelectServer={handleSelectServer}
      />
    </div>
  );
}
