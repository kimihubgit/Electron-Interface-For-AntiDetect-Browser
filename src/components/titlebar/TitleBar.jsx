import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  ChevronDown,
  ArrowLeftRight,
  User,
  Share2,
  Sparkles,
  History,
  Languages,
  Layers,
  Crown,
  PanelRight,
  Clock,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { useApiLoading } from '../../services/core/apiClient';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin}p trước`;
  if (diffHours < 24) return `${diffHours}h trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import { getSavedAccounts, switchToAccount, removeSavedAccount, loginWithApi } from '../../services/authService';
import WorkspaceMenuPopover from '../workspace/WorkspaceMenuPopover';

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
    currentPlan,
    login,
    logout,
    openLoginForNewAccount,
    showToast,
    isReloading,
    isLoadingProfiles = false,
    reloadApp,
    workspaces = [],
    currentWorkspace = null,
    openWorkspaceIds = [],
    switchWorkspace,
    openWorkspaceTab,
    closeWorkspaceTab,
    closeOtherWorkspaceTabs,
    createWorkspace,
    notificationsOnly = [],
    todosOnly = [],
    unreadNotificationsCount = 0,
    unreadTodosCount = 0,
    totalUnreadCount = 0,
    isLoading: isNotifLoading = false,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useBrowser();
  const [isPinned, setIsPinned] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState('notification'); // 'notification' | 'todo'
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showTabMenu, setShowTabMenu] = useState(false);
  const [isAutomationTabOpen, setIsAutomationTabOpen] = useState(false);
  const [isAiAgentTabOpen, setIsAiAgentTabOpen] = useState(true);
  const tabMenuRef = useRef(null);

  // Multi-tab Workspace states
  const [showWorkspacePopover, setShowWorkspacePopover] = useState(false);
  const [activePopoverWsId, setActivePopoverWsId] = useState(null);
  const [showTabsOverview, setShowTabsOverview] = useState(false);
  const workspaceTabsContainerRef = useRef(null);
  const tabsOverviewRef = useRef(null);
  const isApiLoading = useApiLoading();
  const isSpinning = isReloading || isLoadingProfiles || isApiLoading;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workspaceTabsContainerRef.current && !workspaceTabsContainerRef.current.contains(e.target)) {
        setShowWorkspacePopover(false);
        setActivePopoverWsId(null);
      }
      if (tabsOverviewRef.current && !tabsOverviewRef.current.contains(e.target)) {
        setShowTabsOverview(false);
      }
    };
    if (showWorkspacePopover || showTabsOverview) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWorkspacePopover, showTabsOverview]);

  // Handle horizontal mouse wheel scroll on workspace tabs container
  const handleTabsWheel = useCallback((e) => {
    if (workspaceTabsContainerRef.current) {
      if (e.deltaY !== 0) {
        workspaceTabsContainerRef.current.scrollLeft += e.deltaY * 0.8;
      }
    }
  }, []);

  // Derive list of open workspace objects
  const openTabsList = useMemo(() => {
    const rawIds = Array.isArray(openWorkspaceIds) ? openWorkspaceIds : [];
    const validWorkspaces = Array.isArray(workspaces)
      ? workspaces.filter(w => w && typeof w === 'object' && w.id)
      : [];
    const currentId = (currentWorkspace && typeof currentWorkspace === 'object') ? currentWorkspace.id : null;

    const openSet = new Set(rawIds.filter(Boolean));
    if (currentId) {
      openSet.add(currentId);
    }

    const list = [];
    openSet.forEach(id => {
      const found = validWorkspaces.find(w => w.id === id);
      if (found) list.push(found);
    });

    if (list.length === 0) {
      if (currentWorkspace && typeof currentWorkspace === 'object' && currentWorkspace.id) {
        list.push(currentWorkspace);
      } else if (validWorkspaces.length > 0) {
        list.push(validWorkspaces[0]);
      }
    }
    return list;
  }, [openWorkspaceIds, currentWorkspace, workspaces]);

  const getPlanBadgeConfig = (planId) => {
    switch (planId) {
      case 'plan_enterprise':
        return { label: 'Enterprise', bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' };
      case 'plan_pro':
        return { label: 'Pro', bg: '#F5F3FF', color: '#7C3AED', border: '#DDD6FE' };
      case 'plan_basic':
        return { label: 'Base', bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
      case 'plan_free':
      default:
        return { label: 'Free', bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0' };
    }
  };

  // Switch account flyout states
  const [savedAccounts, setSavedAccounts] = useState(() => getSavedAccounts());
  const [isSwitchHoveredInTitleBar, setIsSwitchHoveredInTitleBar] = useState(false);
  const [hoveredAccIdInTitleBar, setHoveredAccIdInTitleBar] = useState(null);

  useEffect(() => {
    setSavedAccounts(getSavedAccounts());
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'automation') {
      setIsAutomationTabOpen(true);
    }
    if (activeTab === 'ai-agent' || activeTab === 'mcp') {
      setIsAiAgentTabOpen(true);
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
      {/* Left section: Logo + Tabs (Home tab, Backup tab, Workspace tabs, Automation, AI Agent, ...) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        WebkitAppRegion: 'no-drag',
        flex: '0 1 auto',
        minWidth: 0
      }}>
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
            borderRadius: '4px',
            flexShrink: 0
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
            transition: 'all 0.15s ease',
            flexShrink: 0
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
        <span style={{ color: '#CBD5E1', margin: '0 3px', fontSize: '11px', userSelect: 'none', flexShrink: 0 }}>|</span>

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
            transition: 'all 0.15s ease',
            flexShrink: 0
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
        <span style={{ color: '#CBD5E1', margin: '0 3px', fontSize: '11px', userSelect: 'none', flexShrink: 0 }}>|</span>

        {/* Open Workspace Tabs Container (Elastic, scrollable with mouse wheel, sits tightly with adjacent tabs) */}
        <div
          ref={workspaceTabsContainerRef}
          onWheel={handleTabsWheel}
          className="ws-tabs-scroll-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            overflowX: 'auto',
            overflowY: 'hidden',
            flex: '0 1 auto',
            minWidth: 0,
            maxWidth: 'calc(100vw - 1000px)',
            scrollbarWidth: 'none'
          }}
        >
          {openTabsList.map((ws) => {
            if (!ws || typeof ws !== 'object' || !ws.id) return null;
            const isTabActive = (activeTab !== 'workspace' && activeTab !== 'backup' && activeTab !== 'automation' && activeTab !== 'ai-agent' && activeTab !== 'mcp') && currentWorkspace?.id === ws.id;
            const badge = getPlanBadgeConfig(ws.plan_id);
            const isPopoverOpenForThisTab = showWorkspacePopover && activePopoverWsId === ws.id;
            const wsName = ws.name || 'Workspace';

            return (
              <div
                key={ws.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  maxWidth: isTabActive ? '200px' : '160px'
                }}
              >
                <div
                  className={`ws-tab-item ${isTabActive ? 'active' : ''}`}
                  onClick={() => {
                    if (isTabActive) {
                      // Click on the currently active tab -> toggle dropdown
                      setShowWorkspacePopover(prev => (activePopoverWsId === ws.id ? !prev : true));
                      setActivePopoverWsId(ws.id);
                    } else {
                      // Click on an inactive tab -> switch directly to that space
                      setShowWorkspacePopover(false);
                      setActivePopoverWsId(null);
                      switchWorkspace(ws);
                      setActiveTab('profiles');
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: isTabActive ? '0 5px 0 8px' : '0 6px',
                    height: '26px',
                    width: '100%',
                    borderRadius: '6px',
                    backgroundColor: isTabActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isTabActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    border: isTabActive ? '1px solid #CBD5E1' : '1px solid transparent',
                    color: isTabActive ? '#0F172A' : '#475569',
                    fontWeight: isTabActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    if (!isTabActive) e.currentTarget.style.backgroundColor = '#E2E5EB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isTabActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  title={isTabActive ? `Đang ở: ${wsName} (Nhấn lần nữa để sổ danh sách Space)` : `Chuyển sang Không gian: ${wsName}`}
                >
                  {/* Small icon badge */}
                  <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '4px',
                    backgroundColor: ws.color || '#3B82F6',
                    color: '#FFFFFF',
                    fontSize: '9.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {wsName[0]?.toUpperCase() || 'W'}
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: isTabActive ? 700 : 500,
                    color: isTabActive ? '#0F172A' : '#475569',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                    flex: 1
                  }}>
                    {wsName}
                  </span>

                  {/* Plan Badge (Visible on active tab to save space) */}
                  {isTabActive && (
                    <span style={{
                      fontSize: '9.5px',
                      fontWeight: 700,
                      padding: '0 4px',
                      borderRadius: '3px',
                      backgroundColor: badge.bg,
                      color: badge.color,
                      border: `1px solid ${badge.border}`,
                      flexShrink: 0
                    }}>
                      {badge.label}
                    </span>
                  )}

                  {/* Dropdown Chevron button (visible on active tab) */}
                  {isTabActive && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowWorkspacePopover(prev => (activePopoverWsId === ws.id ? !prev : true));
                        setActivePopoverWsId(ws.id);
                      }}
                      title="Sổ danh sách Không gian làm việc"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        border: 'none',
                        backgroundColor: isPopoverOpenForThisTab ? '#E2E8F0' : 'transparent',
                        color: '#64748B',
                        cursor: 'pointer',
                        padding: 0,
                        marginLeft: '1px',
                        flexShrink: 0,
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
                      onMouseLeave={(e) => {
                        if (!isPopoverOpenForThisTab) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <ChevronDown
                        size={11}
                        style={{
                          transform: isPopoverOpenForThisTab ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.15s ease'
                        }}
                      />
                    </button>
                  )}

                  {/* Close tab button (Show when more than 1 workspace tab is open) */}
                  {openTabsList.length > 1 && (
                    <button
                      type="button"
                      className="ws-tab-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWorkspaceTab(ws.id);
                        setShowWorkspacePopover(false);
                        setActivePopoverWsId(null);
                      }}
                      title={`Đóng tab ${wsName}`}
                      style={{
                        marginLeft: '1px',
                        flexShrink: 0
                      }}
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>

                {/* Workspace Dropdown Popover attached to this tab */}
                {isPopoverOpenForThisTab && (
                  <WorkspaceMenuPopover
                    workspaces={workspaces}
                    currentWorkspace={currentWorkspace}
                    onSelectWorkspace={(targetWs) => {
                      openWorkspaceTab(targetWs);
                      setActiveTab('profiles');
                      setShowWorkspacePopover(false);
                      setActivePopoverWsId(null);
                    }}
                    onCreateWorkspace={createWorkspace}
                    onOpenUpgrade={() => {
                      setActiveUpgradeModal(true);
                      setShowWorkspacePopover(false);
                      setActivePopoverWsId(null);
                    }}
                    onClose={() => {
                      setShowWorkspacePopover(false);
                      setActivePopoverWsId(null);
                    }}
                  />
                )}
              </div>
            );
          })}
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
              transition: 'all 0.15s ease',
              flexShrink: 0
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

        {/* Tab AI Agent Debugger (Matching user screenshot) */}
        {isAiAgentTabOpen && (
          <div
            onClick={() => setActiveTab('ai-agent')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 8px 0 10px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#262930' : 'transparent',
              boxShadow: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '0 1px 3px rgba(0,0,0,0.2)' : 'none',
              border: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '1px solid #1E2024' : '1px solid transparent',
              color: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#FFFFFF' : '#475569',
              fontWeight: (activeTab === 'ai-agent' || activeTab === 'mcp') ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'ai-agent' && activeTab !== 'mcp') e.currentTarget.style.backgroundColor = '#E2E5EB';
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'ai-agent' && activeTab !== 'mcp') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Bot size={13} style={{ color: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#A78BFA' : '#64748B' }} />
            <span>AI Agent Debugger</span>
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAiAgentTabOpen(false);
                if (activeTab === 'ai-agent' || activeTab === 'mcp') {
                  setActiveTab('profiles');
                }
              }}
              title="Đóng tab AI Agent Debugger"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '16px',
                height: '16px',
                borderRadius: '3px',
                border: 'none',
                background: 'transparent',
                color: (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#94A3B8' : '#9CA3AF',
                cursor: 'pointer',
                padding: 0,
                marginLeft: '2px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#3A3D45' : '#F3F4F6';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = (activeTab === 'ai-agent' || activeTab === 'mcp') ? '#94A3B8' : '#9CA3AF';
              }}
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* More dots button with Tab options menu */}
        <div style={{ position: 'relative', flexShrink: 0 }} ref={tabMenuRef}>
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
                <span>{t('titlebar.quickProfileTest', 'Test profile nhanh')}</span>
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
                <span>{t('titlebar.automation', 'Tự động hóa')}</span>
              </button>

              {/* Option 3: AI Agent Debugger (MCP Studio) */}
              <button
                onClick={() => {
                  setShowTabMenu(false);
                  setIsAiAgentTabOpen(true);
                  setActiveTab('ai-agent');
                  addLog?.('✨ Mở AI Agent Debugger / MCP Studio...', 'success');
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
                <Sparkles size={14} style={{ color: '#7C3AED' }} />
                <span>AI Agent Debugger (MCP)</span>
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
                <span>{t('titlebar.extensions', 'Tiện ích mở rộng')}</span>
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
      <div style={{ flex: 1, height: '100%', minWidth: '12px' }} />

      {/* Right section: Exact Match with user screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', WebkitAppRegion: 'no-drag' }}>
        {/* Dynamic Plan / Upgrade Pill Button */}
        {(() => {
          const planId = String(currentUser?.packageId || currentPlan || currentWorkspace?.plan_id || 'plan_free').toLowerCase();
          const planName = currentUser?.packageName || currentPlan || currentWorkspace?.plan_name || 'Free Starter';
          const isFree = planId.includes('free') || planName.toLowerCase().includes('free') || planId === 'plan_free';
          const isPro = planId.includes('pro') || planName.toLowerCase().includes('pro');
          const isEnterprise = planId.includes('enterprise') || planId.includes('scale') || planName.toLowerCase().includes('enterprise');

          if (isFree) {
            // Gói Free: Nút Upgrade tím như bình thường
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveUpgradeModal(true);
                }}
                title="Gói Free Starter • Bấm để nâng cấp"
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
            );
          }

          if (isPro) {
            // Gói Pro / Team Pro: Huy hiệu Pro Gradient tím vương miện
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveUpgradeModal(true);
                }}
                title={`Gói cước: ${planName} • Bấm để quản lý hoặc gia hạn`}
                style={{
                  WebkitAppRegion: 'no-drag',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '2px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginRight: '6px',
                  height: '24px',
                  boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 8px rgba(124, 58, 237, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(124, 58, 237, 0.25)';
                }}
              >
                <Crown size={12} fill="#FDE047" color="#FDE047" />
                <span>{planName.includes('Pro') ? planName : 'Pro'}</span>
              </button>
            );
          }

          if (isEnterprise) {
            // Gói Enterprise: Huy hiệu Vàng kim hổ phách hoàng gia
            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveUpgradeModal(true);
                }}
                title={`Gói cước: ${planName} • Doanh nghiệp`}
                style={{
                  WebkitAppRegion: 'no-drag',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  padding: '2px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginRight: '6px',
                  height: '24px',
                  boxShadow: '0 2px 5px rgba(217, 119, 6, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 3px 8px rgba(217, 119, 6, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(217, 119, 6, 0.25)';
                }}
              >
                <Crown size={12} fill="#FEF08A" color="#FEF08A" />
                <span>Enterprise</span>
              </button>
            );
          }

          // Các gói trả phí tùy chỉnh khác
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveUpgradeModal(true);
              }}
              title={`Gói cước: ${planName}`}
              style={{
                WebkitAppRegion: 'no-drag',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #93C5FD',
                padding: '2px 10px',
                borderRadius: '14px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                marginRight: '6px',
                height: '24px',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap size={12} fill="#2563EB" color="#2563EB" />
              <span>{planName}</span>
            </button>
          );
        })()}

        {/* Action icons */}
        <button
          className="btn-icon-titlebar"
          title={isSpinning ? "Đang tải dữ liệu..." : "Làm mới (Refresh)"}
          onClick={() => reloadApp(900)}
          disabled={isSpinning}
          style={{
            cursor: isSpinning ? 'wait' : 'pointer',
            opacity: isSpinning ? 0.7 : 1,
            backgroundColor: isSpinning ? '#EDE9FE' : 'transparent',
            color: isSpinning ? '#7C3AED' : undefined
          }}
        >
          <RotateCw
            size={13}
            style={{
              animation: isSpinning ? 'spin 0.8s linear infinite' : 'none',
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
              position: 'relative',
              backgroundColor: showNotifications ? '#E2E5EB' : 'transparent',
              color: showNotifications ? '#111827' : '#6B7280'
            }}
          >
            <Bell size={13} />
            {totalUnreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '13px',
                height: '13px',
                padding: '0 3px',
                borderRadius: '7px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontSize: '8px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1
              }}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '32px',
                right: '-40px',
                width: '340px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                padding: '14px 16px',
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
                paddingBottom: '10px'
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{t('titlebar.notification', 'Thông báo')}</span>
                    {unreadNotificationsCount > 0 && (
                      <span style={{
                        backgroundColor: '#7C3AED',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '10px',
                        lineHeight: 1.2
                      }}>
                        {unreadNotificationsCount}
                      </span>
                    )}
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
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>{t('titlebar.todo', 'Cần làm')}</span>
                    {unreadTodosCount > 0 && (
                      <span style={{
                        backgroundColor: '#F59E0B',
                        color: '#FFFFFF',
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 5px',
                        borderRadius: '10px',
                        lineHeight: 1.2
                      }}>
                        {unreadTodosCount}
                      </span>
                    )}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    style={{ width: '26px', height: '26px', color: '#6B7280' }}
                    title="Làm mới"
                    onClick={(e) => {
                      e.stopPropagation();
                      fetchNotifications?.();
                    }}
                  >
                    <RotateCw size={13} className={isNotifLoading ? 'animate-spin' : ''} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    style={{ width: '26px', height: '26px', color: '#6B7280' }}
                    title="Đánh dấu tất cả đã đọc"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead?.(notificationTab);
                    }}
                  >
                    <CheckCheck size={14} />
                  </button>
                </div>
              </div>

              {/* Body */}
              {(() => {
                const activeList = notificationTab === 'notification' ? notificationsOnly : todosOnly;
                if (activeList.length === 0) {
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '28px', paddingBottom: '12px' }}>
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
                        {t('titlebar.allNotificationsViewed', 'Bạn đã xem hết toàn bộ thông báo.')}
                      </span>
                    </div>
                  );
                }

                return (
                  <div style={{
                    maxHeight: '340px',
                    overflowY: 'auto',
                    margin: '8px -10px -8px -10px',
                    padding: '4px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    {activeList.map((item) => {
                      const isUnread = !item.isRead;
                      return (
                        <div
                          key={item.id}
                          onClick={() => markAsRead?.(item.id)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F3F4F6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                              {isUnread && (
                                <span style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3B82F6',
                                  flexShrink: 0
                                }} />
                              )}
                              <span style={{
                                fontSize: '12px',
                                fontWeight: isUnread ? 600 : 400,
                                color: isUnread ? '#111827' : '#4B5563',
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {item.title}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10px',
                              color: '#94A3B8',
                              whiteSpace: 'nowrap',
                              flexShrink: 0
                            }}>
                              {formatRelativeTime(item.created_at)}
                            </span>
                          </div>

                          <p style={{
                            margin: 0,
                            fontSize: '11px',
                            color: '#64748B',
                            lineHeight: 1.4,
                            wordBreak: 'break-word'
                          }}>
                            {item.message}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                            {item.expires_at ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '10px',
                                color: '#94A3B8'
                              }}>
                                <Clock size={10} />
                                <span>Hạn: {new Date(item.expires_at).toLocaleDateString('vi-VN')}</span>
                              </span>
                            ) : <span />}

                            {item.action_url && (
                              <a
                                href={item.action_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px',
                                  fontSize: '11px',
                                  color: '#3B82F6',
                                  textDecoration: 'none',
                                  fontWeight: 500
                                }}
                              >
                                <span>{item.action_text || 'Xem chi tiết'}</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
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
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                {(currentUser?.full_name || currentUser?.name || currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
              </div>
            )}
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
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 700,
                  flexShrink: 0
                }}>
                  {(currentUser?.full_name || currentUser?.name || currentUser?.username || currentUser?.email || 'U')[0].toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser?.full_name || currentUser?.name || currentUser?.username || 'Người dùng'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {currentUser?.email || currentUser?.username || ''}
                  </span>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '0 0 8px 0' }} />


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
                    setAddAccountErrorTitleBar('');
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
                    <span style={{ fontSize: '13px', fontWeight: 500, color: '#1F2937' }}>{t('titlebar.switchAccount', 'Switch account')}</span>
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
                        setAddAccountErrorTitleBar('');
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
                        const activeUserEmail = (currentUser?.email || currentUser?.username || '').toLowerCase();
                        const isActive = (acc.email && acc.email.toLowerCase() === activeUserEmail) || (acc.username && acc.username.toLowerCase() === activeUserEmail);
                        const isHovered = hoveredAccIdInTitleBar === acc.id;

                        return (
                          <div
                            key={acc.id}
                            onClick={() => {
                              if (isActive) {
                                setShowAvatarMenu(false);
                                return;
                              }
                              switchToAccount(acc);
                              login({
                                ...acc,
                                name: acc.name || acc.username || acc.email?.split('@')[0],
                                email: acc.email,
                                token: acc.token,
                                workspace: acc.workspace,
                                user: acc
                              });
                              setActiveTab('profiles');
                              setShowWorkspacePopover(false);
                              setActivePopoverWsId(null);
                              if (showToast) showToast(t('toasts.accountSwitched', `Đã chuyển sang tài khoản: ${acc.name || acc.email || acc.username}`, { email: acc.email || acc.username }), 'success');
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
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  flexShrink: 0
                                }}
                              >
                                {acc.initial || (acc.name || acc.username || acc.email || 'U')[0].toUpperCase()}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                                <span
                                  style={{
                                    fontSize: '12.5px',
                                    color: '#1E293B',
                                    fontWeight: isActive ? 600 : 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                >
                                  {acc.name || acc.username || acc.email}
                                </span>
                                {acc.email && acc.name && acc.name !== acc.email && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      color: '#64748B',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                  >
                                    {acc.email}
                                  </span>
                                )}
                              </div>
                            </div>

                            {!isActive && isHovered && savedAccounts.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updated = removeSavedAccount(acc.id);
                                  setSavedAccounts(updated);
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

                    {/* + Add account row -> Directly opens standard Login screen */}
                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                      <div
                        onClick={() => {
                          setShowAvatarMenu(false);
                          setIsSwitchHoveredInTitleBar(false);
                          openLoginForNewAccount?.();
                        }}
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
                        <span>{t('titlebar.addAccount', 'Thêm tài khoản...')}</span>
                      </div>
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
                  <span>{t('settings.tabs.account', 'Account Settings')}</span>
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
                  <span>{t('settings.tabs.connections', 'My Connections')}</span>
                </button>

                {/* Language & Region button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowAvatarMenu(false);
                    setActiveSettingsModal('language');
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
                  <Languages size={14} style={{ color: '#6B7280' }} />
                  <span>{t('settings.tabs.language', 'Language & Region')}</span>
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
                  <span>{t('titlebar.billing', 'Billing & resource usage')}</span>
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
                  <span>{t('titlebar.auditLogs', 'Audit logs')}</span>
                </button>
              </div>

              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '6px 0 4px 0' }} />

              {/* Log out */}
              <button
                type="button"
                onClick={() => {
                  setShowAvatarMenu(false);
                  logout?.();
                  if (showToast) showToast(t('auth.loggedOut', 'Bạn đã đăng xuất khỏi tài khoản.'), 'info');
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
                <span>{t('titlebar.logout', 'Log out')}</span>
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
          onClick={() => {
            if (window.electronAPI?.switchToMiniDock) {
              window.electronAPI.switchToMiniDock();
            }
          }}
          className="btn-window-control"
          title="Thu nhỏ thành thanh Dock nổi (Mini Floating Bar)"
          style={{ color: '#6B7280' }}
        >
          <PanelRight size={13} />
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
