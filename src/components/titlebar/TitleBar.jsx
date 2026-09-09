import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Plus,
  MoreHorizontal,
  Rocket,
  RotateCw,
  Settings,
  Gift,
  Bell,
  Pin,
  Minus,
  Square,
  X,
  Shield,
  Globe,
  LogOut,
  Archive,
  Zap,
  Bot,
  Puzzle,
  ChevronRight,
  ArrowLeftRight,
  User,
  Share2,
  Sparkles,
  History
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import { INITIAL_ACCOUNTS } from '../navigation/AccountSwitchMenu';

export default function TitleBar({ isLoginScreen = false }) {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    setActiveUpgradeModal,
    setActiveSettingsModal,
    setActiveReferralModal,
    isSidebarCollapsed,
    toggleSidebar,
    addLog,
    currentUser,
    login,
    logout,
    showToast,
    isReloading,
    reloadApp
  } = useBrowser();
  const [isPinned, setIsPinned] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState('notification'); // 'notification' | 'todo'
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [isAutomationTabOpen, setIsAutomationTabOpen] = useState(false);
  const tabMenuRef = useRef(null);

  // Switch account flyout states
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_saved_accounts_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACCOUNTS;
  });
  const [isSwitchHoveredInTitleBar, setIsSwitchHoveredInTitleBar] = useState(false);
  const [hoveredAccIdInTitleBar, setHoveredAccIdInTitleBar] = useState(null);
  const [isAddingAccInTitleBar, setIsAddingAccInTitleBar] = useState(false);
  const [newEmailTitleBar, setNewEmailTitleBar] = useState('');

  useEffect(() => {
    if (activeTab === 'automation') {
      setIsAutomationTabOpen(true);
    }
  }, [activeTab]);

  // Close tab options dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tabMenuRef.current && !tabMenuRef.current.contains(e.target)) {
        setShowTabMenu(false);
      }
    };
    if (showTabMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTabMenu]);

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.close) {
      window.electronAPI.close();
    } else {
      window.close();
    }
  };

  const handleTogglePin = () => {
    if (window.electronAPI?.togglePin) {
      window.electronAPI.togglePin();
      setIsPinned(!isPinned);
    }
  };

  // Clean titlebar for the Login screen matching screenshot
  if (isLoginScreen) {
    return (
      <div style={{
        height: '38px',
        backgroundColor: '#EBEEF2',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '12px',
        paddingRight: '0px',
        userSelect: 'none',
        WebkitAppRegion: 'drag',
        fontSize: '12px',
        position: 'relative',
        zIndex: 100
      }}>
        {/* Left section: Apidog logo + Home Tab + '+' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', WebkitAppRegion: 'no-drag' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginRight: '6px',
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
            </svg>
            <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, letterSpacing: '-0.2px' }}>
              Apidog
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 10px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid #D8DCE3',
              color: '#1E293B',
              fontWeight: 600
            }}
          >
            <Home size={13} style={{ color: '#2563EB' }} />
            <span>{t('titlebar.home')}</span>
          </div>

          <button
            className="btn-icon-titlebar"
            style={{ width: '24px', height: '24px', color: '#94A3B8', cursor: 'pointer' }}
            title="Thêm tab mới"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Right section: Window Controls */}
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', WebkitAppRegion: 'no-drag' }}>
          <button
            onClick={handleMinimize}
            className="btn-window-control"
            title="Thu nhỏ"
          >
            <Minus size={13} />
          </button>

          <button
            onClick={handleMaximize}
            className="btn-window-control"
            title="Phóng to"
          >
            <Square size={11} />
          </button>

          <button
            onClick={handleClose}
            className="btn-window-control btn-window-close"
            title="Đóng ứng dụng"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '38px',
      backgroundColor: 'var(--apidog-activity-bg)',
      borderBottom: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '12px',
      paddingRight: '0px',
      userSelect: 'none',
      WebkitAppRegion: 'drag',
      fontSize: '12px',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Left section: Logo + Tabs (Home tab, Kimidev tab, ...) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', WebkitAppRegion: 'no-drag' }}>
        {/* Apidog 4-petal clover logo */}
        <div
          onClick={() => setActiveTab('workspace')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginRight: '6px',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '4px'
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#94A3B8" />
          </svg>
          <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600, letterSpacing: '-0.2px' }}>
            Apidog
          </span>
        </div>

        {/* Home Tab (White rounded card when active) */}
        <div
          onClick={() => setActiveTab('workspace')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 10px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: activeTab === 'workspace' ? '#FFFFFF' : 'transparent',
            boxShadow: activeTab === 'workspace' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            border: activeTab === 'workspace' ? '1px solid #D8DCE3' : '1px solid transparent',
            color: activeTab === 'workspace' ? '#1E293B' : '#64748B',
            fontWeight: activeTab === 'workspace' ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'workspace') e.currentTarget.style.backgroundColor = '#E2E5EB';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'workspace') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Home size={13} style={{ color: activeTab === 'workspace' ? '#2563EB' : '#64748B' }} />
          <span>{t('titlebar.home')}</span>
        </div>

        {/* Vertical Divider '|' */}
        <span style={{ color: '#CBD5E1', margin: '0 3px', fontSize: '11px', userSelect: 'none' }}>|</span>

        {/* Backup Tab (Copy of Home tab) */}
        <div
          onClick={() => setActiveTab('backup')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 10px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: activeTab === 'backup' ? '#FFFFFF' : 'transparent',
            boxShadow: activeTab === 'backup' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            border: activeTab === 'backup' ? '1px solid #D8DCE3' : '1px solid transparent',
            color: activeTab === 'backup' ? '#1E293B' : '#64748B',
            fontWeight: activeTab === 'backup' ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab !== 'backup') e.currentTarget.style.backgroundColor = '#E2E5EB';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'backup') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Archive size={13} style={{ color: activeTab === 'backup' ? '#7C3AED' : '#64748B' }} />
          <span>{t('titlebar.backup')}</span>
        </div>

        {/* Vertical Divider '|' */}
        <span style={{ color: '#CBD5E1', margin: '0 3px', fontSize: '11px', userSelect: 'none' }}>|</span>

        {/* Secondary / Workspace Tab: Kimidev */}
        <div
          onClick={() => setActiveTab('profiles')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 6px 0 10px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation') ? '#FFFFFF' : 'transparent',
            boxShadow: (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation') ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
            border: (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation') ? '1px solid #D8DCE3' : '1px solid transparent',
            color: (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation') ? '#1E293B' : '#475569',
            fontWeight: (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation') ? 600 : 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (activeTab === 'workspace' || activeTab === 'backup' || activeTab === 'automation') e.currentTarget.style.backgroundColor = '#E2E5EB';
          }}
          onMouseLeave={(e) => {
            if (activeTab === 'workspace' || activeTab === 'backup' || activeTab === 'automation') e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span>Kimidev</span>
          {/* Close / Thu tab button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('workspace');
            }}
            title="Đóng / Thu tab Kimidev"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '16px',
              height: '16px',
              borderRadius: '3px',
              border: 'none',
              background: 'transparent',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: 0,
              marginLeft: '2px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6';
              e.currentTarget.style.color = '#111827';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#9CA3AF';
            }}
          >
            <X size={12} />
          </button>
        </div>

        {/* Tab Tự Động Hóa (kế bên tab Kimidev) */}
        {isAutomationTabOpen && (
          <div
            onClick={() => setActiveTab('automation')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 6px 0 10px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: activeTab === 'automation' ? '#FFFFFF' : 'transparent',
              boxShadow: activeTab === 'automation' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              border: activeTab === 'automation' ? '1px solid #D8DCE3' : '1px solid transparent',
              color: activeTab === 'automation' ? '#1E293B' : '#475569',
              fontWeight: activeTab === 'automation' ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'automation') e.currentTarget.style.backgroundColor = '#E2E5EB';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'automation') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bot size={13} style={{ color: activeTab === 'automation' ? '#D97706' : '#64748B' }} />
            <span>Tự động hóa</span>
            {/* Close / Thu tab button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAutomationTabOpen(false);
                if (activeTab === 'automation') {
                  setActiveTab('profiles');
                }
              }}
              title="Đóng / Thu tab Tự động hóa"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                border: 'none',
                background: 'transparent',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '2px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* More dots button with Tab options menu */}
        <div style={{ position: 'relative' }} ref={tabMenuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTabMenu(!showTabMenu);
            }}
            className="btn-icon-titlebar"
            style={{
              width: '24px',
              height: '24px',
              color: showTabMenu ? '#111827' : '#94A3B8',
              backgroundColor: showTabMenu ? '#E2E5EB' : 'transparent'
            }}
            title="Tùy chọn tab Kimidev"
          >
            <MoreHorizontal size={14} />
          </button>

          {showTabMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '30px',
                left: '0px',
                width: '205px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
                padding: '5px',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                animation: 'fadeIn 0.12s ease-out'
              }}
            >
              {/* Option 1: Test profile nhanh */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  setActiveTab('profiles');
                  addLog?.('⚡ Đang khởi chạy kiểm tra nhanh cấu hình profile & proxy...', 'info');
                  alert('⚡ Test profile nhanh:\nĐang kiểm tra kết nối WebRTC, Canvas Fingerprint, Audio Context và Proxy IP của hồ sơ.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#1E293B',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Zap size={14} style={{ color: '#EAB308' }} />
                <span>Test profile nhanh</span>
              </button>

              {/* Option 2: Tự động hóa */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  setIsAutomationTabOpen(true);
                  setActiveTab('automation');
                  addLog?.('🤖 Mở trung tâm kịch bản Tự động hóa (RPA Automation)...', 'success');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#1E293B',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Bot size={14} style={{ color: '#D97706' }} />
                <span>Tự động hóa</span>
              </button>

              {/* Option: Tiện ích mở rộng */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  setActiveTab('extensions');
                  addLog?.('🧩 Mở quản lý Tiện ích mở rộng (Extensions)...', 'info');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#1E293B',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Puzzle size={14} style={{ color: '#0EA5E9' }} />
                <span>Tiện ích mở rộng</span>
              </button>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '3px 4px' }} />

              {/* Option 3: Đóng / Thu tab Kimidev */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  setActiveTab('workspace');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={13} style={{ color: '#EF4444' }} />
                <span>Đóng / Thu tab Kimidev</span>
              </button>

              {/* Option 4: Thu gọn / Mở rộng Sidebar */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  toggleSidebar();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Archive size={13} style={{ color: '#6B7280' }} />
                <span>{isSidebarCollapsed ? 'Mở rộng Sidebar' : 'Thu gọn Sidebar'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Drag Area */}
      <div style={{ flex: 1, height: '100%' }} />

      {/* Right section: Exact Match with user screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', WebkitAppRegion: 'no-drag' }}>
        {/* Pill Upgrade Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveUpgradeModal(true);
          }}
          style={{
            WebkitAppRegion: 'no-drag',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#FFFFFF',
            color: '#7C3AED',
            border: '1px solid #C084FC',
            padding: '2px 10px',
            borderRadius: '14px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: '6px',
            height: '24px',
            boxShadow: '0 1px 2px rgba(124, 58, 237, 0.08)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FAF5FF';
            e.currentTarget.style.borderColor = '#A855F7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#C084FC';
          }}
        >
          <Rocket size={12} />
          <span>Upgrade</span>
        </button>

        {/* Action icons */}
        <button
          className="btn-icon-titlebar"
          title="Refresh"
          onClick={() => reloadApp(900)}
          disabled={isReloading}
          style={{
            cursor: isReloading ? 'wait' : 'pointer',
            opacity: isReloading ? 0.7 : 1,
            backgroundColor: isReloading ? '#EDE9FE' : 'transparent',
            color: isReloading ? '#7C3AED' : undefined
          }}
        >
          <RotateCw
            size={13}
            style={{
              animation: isReloading ? 'spin 0.8s linear infinite' : 'none',
              transformOrigin: 'center'
            }}
          />
        </button>

        {/* Gift icon with red badge */}
        <button
          className="btn-icon-titlebar"
          title="Ưu đãi & Quà tặng"
          style={{ position: 'relative' }}
          onClick={() => {
            setActiveReferralModal('referrals');
            setShowNotifications(false);
            setShowAvatarMenu(false);
          }}
        >
          <Gift size={13} />
          <span style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: '#EF4444'
          }} />
        </button>
        {/* Notification Button & Popover */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn-icon-titlebar"
            title="Thông báo"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowAvatarMenu(false);
            }}
            style={{
              backgroundColor: showNotifications ? '#E2E5EB' : 'transparent',
              color: showNotifications ? '#111827' : '#6B7280'
            }}
          >
            <Bell size={13} />
          </button>

          {showNotifications && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '32px',
                right: '-40px',
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                padding: '14px 16px 22px 16px',
                zIndex: 1200,
                cursor: 'default',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              {/* Header Tabs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F3F4F6',
                paddingBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setNotificationTab('notification')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: notificationTab === 'notification' ? '#F3E8FF' : 'transparent',
                      color: notificationTab === 'notification' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: notificationTab === 'notification' ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationTab('todo')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: notificationTab === 'todo' ? '#F3E8FF' : 'transparent',
                      color: notificationTab === 'todo' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: notificationTab === 'todo' ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    To do
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-icon-subtle"
                  style={{ width: '26px', height: '26px', color: '#6B7280' }}
                  title="Dọn sạch thông báo"
                >
                  <Archive size={15} />
                </button>
              </div>

              {/* Empty state illustration matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '32px', paddingBottom: '12px' }}>
                <div style={{ position: 'relative', width: '130px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Soft base shadow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    width: '100px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9'
                  }} />

                  {/* Document sheet */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    width: '74px',
                    height: '70px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '5px',
                    border: '1.5px solid #E2E8F0',
                    padding: '8px 7px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 1,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ width: '100%', height: '24px', backgroundColor: '#E2E8F0', borderRadius: '3px' }} />
                    <div style={{ width: '88%', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px' }} />
                    <div style={{ width: '60%', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px' }} />
                  </div>

                  {/* Speech Bubble with shapes */}
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    right: '10px',
                    backgroundColor: '#CBD5E1',
                    borderRadius: '16px',
                    borderBottomLeftRadius: '2px',
                    padding: '3px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    zIndex: 3,
                    color: '#FFFFFF'
                  }}>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>▲</span>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>■</span>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>●</span>
                  </div>

                  {/* Tray container */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    width: '98px',
                    height: '44px',
                    backgroundColor: '#CBD5E1',
                    borderRadius: '8px',
                    zIndex: 2,
                    clipPath: 'polygon(0% 28%, 18% 28%, 26% 62%, 74% 62%, 82% 28%, 100% 28%, 100% 100%, 0% 100%)'
                  }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#DDE3EA' }} />
                  </div>
                </div>

                <span style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 400,
                  textAlign: 'center'
                }}>
                  You have viewed all notifications.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setShowAvatarMenu(!showAvatarMenu);
              setShowNotifications(false);
            }}
            title="Tài khoản cá nhân"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 6px',
              cursor: 'pointer',
              border: showAvatarMenu ? '2px solid #3B82F6' : '1px solid #E5E7EB',
              boxShadow: showAvatarMenu ? '0 0 0 2px rgba(59, 130, 246, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <svg width="26" height="26" viewBox="0 0 40 40" fill="none" style={{ display: 'block' }}>
              <circle cx="20" cy="20" r="19" fill="#0A192F" stroke="#2563EB" strokeWidth="2" />
              <circle cx="20" cy="18" r="11" fill="#F8FAFC" />
              <path d="M13 18C13 14.1 16.1 11 20 11C23.9 11 27 14.1 27 18C27 21.9 23.9 24 20 24C16.1 24 13 21.9 13 18Z" fill="#0F172A" />
              <path d="M15 17C15.5 14.5 17.5 12.8 20 12.8" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="24" cy="20" r="1.5" fill="#F59E0B" />
              <path d="M10.5 34C11.5 28.5 15.5 26.5 20 26.5C24.5 26.5 28.5 28.5 29.5 34" fill="#E2E8F0" />
            </svg>
          </div>

          {showAvatarMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '34px',
                right: '4px',
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                padding: '12px 10px 10px 10px',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default',
                animation: 'fadeIn 0.12s ease-out',
                userSelect: 'none'
              }}
            >
              {/* User row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '2px 4px 10px 4px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="34" height="34" viewBox="0 0 40 40" fill="none" style={{ display: 'block' }}>
                    <circle cx="20" cy="20" r="19" fill="#0A192F" stroke="#2563EB" strokeWidth="2" />
                    <circle cx="20" cy="18" r="11" fill="#F8FAFC" />
                    <path d="M13 18C13 14.1 16.1 11 20 11C23.9 11 27 14.1 27 18C27 21.9 23.9 24 20 24C16.1 24 13 21.9 13 18Z" fill="#0F172A" />
                    <path d="M15 17C15.5 14.5 17.5 12.8 20 12.8" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
                    <circle cx="24" cy="20" r="1.5" fill="#F59E0B" />
                    <path d="M10.5 34C11.5 28.5 15.5 26.5 20 26.5C24.5 26.5 28.5 28.5 29.5 34" fill="#E2E8F0" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    14. võ văn Khải 11A12
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    vkhai2603@gmail.com
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '0 0 8px 0' }} />

              {/* Workspace / Team row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '2px 4px 8px 4px' }}>
                <div style={{ width: '24px', height: '24px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
                    <defs>
                      <linearGradient id="apidogLeft" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#EC4899" />
                        <stop offset="100%" stopColor="#9333EA" />
                      </linearGradient>
                      <linearGradient id="apidogRight" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                      <linearGradient id="apidogBase" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F43F5E" />
                        <stop offset="100%" stopColor="#F59E0B" />
                      </linearGradient>
                    </defs>
                    <path d="M12 3.5L3.8 19" stroke="url(#apidogLeft)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 3.5L20.2 19" stroke="url(#apidogRight)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 17.5H17" stroke="url(#apidogBase)" strokeWidth="3.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
                    KiMiDev
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>
                    Free plan
                  </span>
                </div>
              </div>

              {/* Switch account item with hover flyout */}
              <div
                onMouseEnter={() => {
                  if (window.__switchAccountTimeout) clearTimeout(window.__switchAccountTimeout);
                  setIsSwitchHoveredInTitleBar(true);
                }}
                onMouseLeave={() => {
                  window.__switchAccountTimeout = setTimeout(() => {
                    setIsSwitchHoveredInTitleBar(false);
                    setIsAddingAccInTitleBar(false);
                  }, 250);
                }}
                style={{
                  position: 'relative',
                  margin: '4px 0 6px 0'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    backgroundColor: isSwitchHoveredInTitleBar ? '#F1F5F9' : '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeftRight size={14} style={{ color: '#64748B' }} />
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1F2937' }}>Switch account</span>
                  </div>
                  <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>›</span>
                </div>

                {/* ── FLYOUT SUBMENU TO THE LEFT (MATCHING SCREENSHOT) ── */}
                {isSwitchHoveredInTitleBar && (
                  <div
                    onMouseEnter={() => {
                      if (window.__switchAccountTimeout) clearTimeout(window.__switchAccountTimeout);
                      setIsSwitchHoveredInTitleBar(true);
                    }}
                    onMouseLeave={() => {
                      window.__switchAccountTimeout = setTimeout(() => {
                        setIsSwitchHoveredInTitleBar(false);
                        setIsAddingAccInTitleBar(false);
                      }, 250);
                    }}
                    style={{
                      position: 'absolute',
                      right: 'calc(100% + 4px)',
                      top: '-4px',
                      width: '260px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                      padding: '6px',
                      zIndex: 1300,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                      animation: 'fadeIn 0.12s ease-out'
                    }}
                  >
                    {/* Invisible bridge */}
                    <div
                      style={{
                        position: 'absolute',
                        right: '-12px',
                        top: 0,
                        width: '12px',
                        height: '100%'
                      }}
                    />

                    {/* Accounts list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '240px', overflowY: 'auto' }}>
                      {savedAccounts.map(acc => {
                        const isActive = acc.email.toLowerCase() === (currentUser?.email || savedAccounts[0]?.email || '').toLowerCase();
                        const isHovered = hoveredAccIdInTitleBar === acc.id;

                        return (
                          <div
                            key={acc.id}
                            onClick={() => {
                              login({ email: acc.email, name: acc.name });
                              if (showToast) showToast(`Đã chuyển sang tài khoản: ${acc.email}`, 'success');
                              setShowAvatarMenu(false);
                              setIsSwitchHoveredInTitleBar(false);
                            }}
                            onMouseEnter={() => setHoveredAccIdInTitleBar(acc.id)}
                            onMouseLeave={() => setHoveredAccIdInTitleBar(null)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              backgroundColor: isActive ? '#EBF5FF' : (isHovered ? '#F8FAFC' : 'transparent'),
                              cursor: 'pointer',
                              transition: 'background-color 0.1s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, overflow: 'hidden' }}>
                              <div
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  backgroundColor: acc.color || (isActive ? '#3B82F6' : '#94A3B8'),
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  flexShrink: 0
                                }}
                              >
                                {acc.initial || acc.email[0].toUpperCase()}
                              </div>
                              <span
                                style={{
                                  fontSize: '13px',
                                  color: '#1E293B',
                                  fontWeight: isActive ? 600 : 400,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                                title={acc.email}
                              >
                                {acc.email}
                              </span>
                            </div>

                            {!isActive && isHovered && savedAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = savedAccounts.filter(a => a.id !== acc.id);
                                  setSavedAccounts(updated);
                                  localStorage.setItem('antidetect_saved_accounts_v1', JSON.stringify(updated));
                                }}
                                title="Xóa tài khoản"
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  color: '#94A3B8',
                                  cursor: 'pointer',
                                  padding: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderRadius: '4px'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* + Add account row */}
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                      {isAddingAccInTitleBar ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const clean = newEmailTitleBar.trim().toLowerCase();
                            if (!clean || !clean.includes('@')) {
                              alert('Vui lòng nhập email hợp lệ!');
                              return;
                            }
                            const newAcc = {
                              id: 'acc-' + Date.now(),
                              email: clean,
                              name: clean.split('@')[0],
                              initial: clean[0].toUpperCase(),
                              color: '#3B82F6'
                            };
                            const updated = [...savedAccounts, newAcc];
                            setSavedAccounts(updated);
                            localStorage.setItem('antidetect_saved_accounts_v1', JSON.stringify(updated));
                            setNewEmailTitleBar('');
                            setIsAddingAccInTitleBar(false);
                            login({ email: newAcc.email, name: newAcc.name });
                            if (showToast) showToast(`Đã chuyển sang tài khoản: ${newAcc.email}`, 'success');
                            setShowAvatarMenu(false);
                          }}
                          style={{ display: 'flex', gap: '4px', padding: '4px' }}
                        >
                          <input
                            type="email"
                            placeholder="email@example.com"
                            value={newEmailTitleBar}
                            onChange={(e) => setNewEmailTitleBar(e.target.value)}
                            autoFocus
                            style={{
                              flex: 1,
                              fontSize: '12px',
                              padding: '4px 8px',
                              border: '1px solid #CBD5E1',
                              borderRadius: '4px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="submit"
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#3B82F6',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Thêm
                          </button>
                        </form>
                      ) : (
                        <div
                          onClick={() => setIsAddingAccInTitleBar(true)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '7px 10px',
                            borderRadius: '6px',
                            color: '#475569',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'background-color 0.1s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F8FAFC';
                            e.currentTarget.style.color = '#0F172A';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }}
                        >
                          <Plus size={14} style={{ color: '#64748B' }} />
                          <span>Add account</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setActiveSettingsModal('account');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={14} style={{ color: '#6B7280' }} />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setActiveSettingsModal('connections');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Share2 size={14} style={{ color: '#6B7280' }} />
                  <span>My Connections</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setActiveUpgradeModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Sparkles size={14} style={{ color: '#F59E0B' }} />
                  <span>Billing &amp; resource usage</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setActiveTab('history');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: '#374151',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <History size={14} style={{ color: '#6B7280' }} />
                  <span>Audit logs</span>
                </button>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '6px 0 4px 0' }} />

              {/* Log out */}
              <button
                type="button"
                onClick={() => {
                  setShowAvatarMenu(false);
                  logout?.();
                  if (showToast) showToast('Bạn đã đăng xuất khỏi tài khoản.', 'info');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s ease, color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FEF2F2';
                  e.currentTarget.style.color = '#DC2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#374151';
                }}
              >
                <LogOut size={14} style={{ color: 'inherit' }} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>

        {/* Click outside overlay */}
        {(showNotifications || showAvatarMenu || showTabMenu) && (
          <div
            onClick={() => {
              setShowNotifications(false);
              setShowAvatarMenu(false);
              setShowTabMenu(false);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              backgroundColor: 'transparent'
            }}
          />
        )}

        {/* Thin vertical separator */}
        <div style={{ width: '1px', height: '16px', backgroundColor: '#D1D5DB', margin: '0 4px' }} />

        {/* Window Controls: Pin, Minimize, Maximize, Close */}
        <button
          onClick={handleTogglePin}
          className="btn-window-control"
          title={isPinned ? "Bỏ ghim cửa sổ" : "Ghim cửa sổ trên cùng"}
          style={{ color: isPinned ? 'var(--apidog-purple)' : '#6B7280' }}
        >
          <Pin size={12} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
        </button>

        <button
          onClick={handleMinimize}
          className="btn-window-control"
          title="Thu nhỏ"
        >
          <Minus size={13} />
        </button>

        <button
          onClick={handleMaximize}
          className="btn-window-control"
          title="Phóng to"
        >
          <Square size={11} />
        </button>

        <button
          onClick={handleClose}
          className="btn-window-control btn-window-close"
          title="Đóng ứng dụng"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
