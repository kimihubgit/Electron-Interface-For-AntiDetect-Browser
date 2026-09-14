import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  History,
  Trash2,
  HelpCircle,
  ChevronRight,
  Maximize2,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Keyboard,
  ArrowUpCircle,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';

export default function BottomStatusBar() {
  const { t } = useTranslation();
  const {
    profiles,
    trashProfiles = [],
    isSidebarCollapsed,
    toggleSidebar,
    setActiveTrashModal,
    activeTab,
    setActiveTab,
    checkUpdate,
    isUpdateChecking
  } = useBrowser();
  const runningCount = profiles.filter(p => p.status === 'running').length;

  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const helpMenuRef = useRef(null);

  // Close Help Menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(e.target)) {
        setShowHelpMenu(false);
      }
    };

    if (showHelpMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHelpMenu]);

  const handleCheckUpdate = () => {
    if (checkUpdate) {
      checkUpdate(false);
    }
  };

  return (
    <footer style={{
      height: '28px',
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid var(--apidog-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      fontSize: '11px',
      color: 'var(--apidog-text-muted)',
      flexShrink: 0
    }}>
      {/* Left items: Sidebar toggle button replacing "Đã trực tuyến" */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? "Mở rộng thanh bên (Sidebar)" : "Thu gọn thanh bên (Sidebar)"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            color: isSidebarCollapsed ? 'var(--apidog-purple)' : '#374151',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isSidebarCollapsed ? <PanelLeftOpen size={13} /> : <PanelLeftClose size={13} />}
          <span>{isSidebarCollapsed ? t('footer.expandSidebar', "Mở rộng thanh bên") : t('footer.collapseSidebar', "Thu gọn thanh bên")}</span>
        </button>

        {runningCount > 0 && (
          <span style={{ color: 'var(--apidog-purple)', fontWeight: 600 }}>
            {t('footer.profilesRunning', { count: runningCount })}
          </span>
        )}
      </div>

      {/* Right items matching Apidog screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: activeTab === 'proxy-requests' ? '#EDE9FE' : 'transparent',
            color: activeTab === 'proxy-requests' ? '#7C3AED' : 'var(--apidog-text-main)',
            fontWeight: activeTab === 'proxy-requests' ? 700 : 500,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'proxy-requests') e.currentTarget.style.backgroundColor = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'proxy-requests') e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => setActiveTab('proxy-requests')}
          title="Mở hệ thống bắt gói mạng & phân luồng Proxy (Traffic Router)"
        >
          <Shield size={12} style={{ color: activeTab === 'proxy-requests' ? '#7C3AED' : 'var(--apidog-purple)' }} />
          <span>{t('footer.proxyRequest', 'Proxy request')} ▾</span>
        </span>

        <span 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: activeTab === 'history' ? '#EDE9FE' : 'transparent',
            color: activeTab === 'history' ? '#7C3AED' : 'inherit',
            fontWeight: activeTab === 'history' ? 700 : 500,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'history') e.currentTarget.style.backgroundColor = '#E5E7EB';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'history') e.currentTarget.style.backgroundColor = 'transparent';
          }}
          onClick={() => setActiveTab('history')}
          title="Mở Lịch sử phiên chạy"
        >
          <History size={12} style={{ color: activeTab === 'history' ? '#7C3AED' : 'inherit' }} />
          <span>{t('footer.history', 'Lịch sử')}</span>
        </span>

        <span 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px', 
            cursor: 'pointer', 
            padding: '2px 6px', 
            borderRadius: '4px',
            color: trashProfiles.length > 0 ? 'var(--apidog-text-main)' : 'inherit'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          onClick={() => setActiveTrashModal(true)}
          title="Mở Thùng rác (Quản lý hồ sơ đã xóa)"
        >
          <Trash2 size={12} /> {t('footer.trash', 'Trash')}
          {trashProfiles.length > 0 && (
            <span style={{
              fontSize: '10px',
              backgroundColor: '#E2E8F0',
              color: '#334155',
              padding: '0 4px',
              borderRadius: '8px',
              fontWeight: 600,
              lineHeight: '13px'
            }}>
              {trashProfiles.length}
            </span>
          )}
        </span>

        {/* HELP & SUPPORT WITH CLICK POPUP */}
        <div 
          ref={helpMenuRef}
          style={{ position: 'relative' }}
        >
          <button
            onClick={() => setShowHelpMenu(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              border: 'none',
              background: showHelpMenu ? '#E2E8F0' : 'transparent',
              color: '#374151',
              fontSize: '11px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <HelpCircle size={12} />
            <span>{t('footer.helpAndSupport', 'Help & support')}</span>
          </button>

          {/* Floating Menu upward */}
          {showHelpMenu && (
            <div 
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 6px)',
                right: 0,
                zIndex: 1000
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                  padding: '6px',
                  minWidth: '205px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  animation: 'fadeInModal 0.15s ease'
                }}
              >
                {/* Item 1: Help & documentation */}
                <div
                  onClick={() => {
                    window.open('https://apidog.com/help', '_blank');
                    setShowHelpMenu(false);
                  }}
                  style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  color: '#1E293B',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <BookOpen size={14} style={{ color: '#475569' }} />
                <span>{t('footer.helpDocs', 'Help & documentation')}</span>
              </div>

              {/* Item 2: Keyboard Shortcuts */}
              <div
                onClick={() => {
                  alert('Phím tắt hệ thống:\n• Ctrl + N: Tạo Profile mới\n• Ctrl + Shift + P: Mở Proxy\n• Ctrl + ,: Cài đặt hệ thống');
                  setShowHelpMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  color: '#1E293B',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Keyboard size={14} style={{ color: '#475569' }} />
                <span>{t('footer.keyboardShortcuts', 'Keyboard Shortcuts')}</span>
              </div>

              {/* Item 3: What's New? */}
              <div
                onClick={() => {
                  alert('Có gì mới ở phiên bản v2.4.0:\n• Tích hợp giả lập vân tay WebGL 2.0 mới\n• Tối ưu tốc độ khởi tạo profile lên 40%\n• Hỗ trợ Proxy SOCKS5 đa luồng');
                  setShowHelpMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  color: '#1E293B',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowUpCircle size={14} style={{ color: '#475569' }} />
                <span>{t('footer.whatsNew', "What's New?")}</span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#F1F3F5', margin: '4px 0' }} />

              {/* Item 4: Email */}
              <div
                onClick={() => {
                  window.open('mailto:support@apidog.com', '_blank');
                  setShowHelpMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  color: '#1E293B',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Mail size={14} style={{ color: '#3B82F6' }} />
                <span>Email</span>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* CHECK UPDATE VERSION BUTTON (Icon with arrow pointing up) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCheckUpdate}
            disabled={isUpdateChecking}
            title={isUpdateChecking ? 'Đang kiểm tra cập nhật...' : t('footer.checkForUpdates', 'Kiểm tra bản cập nhật phiên bản')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '22px',
              height: '22px',
              border: 'none',
              background: 'transparent',
              color: isUpdateChecking ? '#2563EB' : '#475569',
              borderRadius: '4px',
              cursor: isUpdateChecking ? 'wait' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isUpdateChecking) e.currentTarget.style.backgroundColor = '#E5E7EB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {/* Arrow pointing up icon */}
            <ArrowUpCircle 
              size={13} 
              style={{ 
                animation: isUpdateChecking ? 'spin 0.7s linear infinite' : 'none' 
              }} 
            />
          </button>
        </div>
      </div>
    </footer>
  );
}
