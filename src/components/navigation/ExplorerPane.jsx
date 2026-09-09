import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  Shield,
  MoreHorizontal,
  Fingerprint,
  Cookie,
  Zap,
  Globe,
  CheckCircle2,
  Trash2,
  RotateCw,
  Clock,
  Bot,
  Settings,
  Server,
  Key,
  FileCode,
  AlertTriangle,
  Puzzle,
  Search,
  Smartphone,
  Cpu,
  Sliders,
  ArrowRightLeft,
  Activity,
  GitBranch,
  GitPullRequest,
  Info,
  Check,
  Download,
  Sparkles
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ExplorerPane() {
  const {
    activeTab,
    setActiveTab,
    activeProxySubTab = 'pool',
    setActiveProxySubTab,
    profiles = [],
    proxies = [],
    rotatingProxies = [],
    dcomDevices = [],
    trashProfiles = [],
    customGroups = [],
    selectedGroup,
    setSelectedGroup,
    selectedProxyFilter = 'All',
    setSelectedProxyFilter,
    setActiveProfileModal,
    setActiveProxyModal,
    setActiveGroupModal,
    setActiveTrashModal,
    activeSettingsSection = 'general',
    setActiveSettingsSection,
    historyRecords = [],
    selectedHistoryId,
    setSelectedHistoryId,
    historyScope = 'local',
    setHistoryScope,
    historySearchTerm = '',
    setHistorySearchTerm,
    deleteHistoryRecord,
    deleteHistoryGroup,
    addLog = () => { }
  } = useBrowser();

  const safeProfiles = Array.isArray(profiles) ? profiles.filter(Boolean) : [];
  const safeProxies = Array.isArray(proxies) ? proxies.filter(Boolean) : [];
  const safeRotatingProxies = Array.isArray(rotatingProxies) ? rotatingProxies.filter(Boolean) : [];
  const safeDcomDevices = Array.isArray(dcomDevices) ? dcomDevices.filter(Boolean) : [];
  const safeHistory = Array.isArray(historyRecords) ? historyRecords.filter(Boolean) : [];

  // Workspace / Branch management state
  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    return localStorage.getItem('antidetect_current_workspace') || 'main';
  });
  const [workspaceList, setWorkspaceList] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_workspaces');
      return saved ? JSON.parse(saved) : ['main', 'marketing-ads', 'crypto-airdrop', 'ecommerce'];
    } catch {
      return ['main', 'marketing-ads', 'crypto-airdrop', 'ecommerce'];
    }
  });
  const [generalBranchList] = useState(['production', 'staging', 'release/v2.4']);
  const [branchTab, setBranchTab] = useState('sprint'); // 'sprint' | 'general'
  const [branchSearch, setBranchSearch] = useState('');
  const [standardCollapsed, setStandardCollapsed] = useState(false);
  const [aiCollapsed, setAiCollapsed] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [newWorkspaceInput, setNewWorkspaceInput] = useState('');
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const workspaceMenuRef = useRef(null);

  const activeBranchPool = branchTab === 'sprint' ? workspaceList : generalBranchList;
  const filteredBranches = activeBranchPool.filter(b =>
    b.toLowerCase().includes(branchSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(e.target)) {
        setShowWorkspaceMenu(false);
        setIsCreatingWorkspace(false);
      }
    };
    if (showWorkspaceMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showWorkspaceMenu]);

  const handleSelectWorkspace = (ws) => {
    setCurrentWorkspace(ws);
    localStorage.setItem('antidetect_current_workspace', ws);
    setShowWorkspaceMenu(false);
    addLog(`Đã chuyển sang không gian làm việc: ${ws}`, 'info');
  };

  const handleAddWorkspace = (e) => {
    e.preventDefault();
    if (!newWorkspaceInput.trim()) return;
    const name = newWorkspaceInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (!workspaceList.includes(name)) {
      const updated = [...workspaceList, name];
      setWorkspaceList(updated);
      localStorage.setItem('antidetect_workspaces', JSON.stringify(updated));
      setCurrentWorkspace(name);
      localStorage.setItem('antidetect_current_workspace', name);
      addLog(`Đã tạo không gian làm việc mới: ${name}`, 'success');
    }
    setNewWorkspaceInput('');
    setIsCreatingWorkspace(false);
    setShowWorkspaceMenu(false);
  };

  const [collapsedDates, setCollapsedDates] = useState({});
  const [hoveredDate, setHoveredDate] = useState(null);
  const [hoveredRecordId, setHoveredRecordId] = useState(null);

  const toggleDateCollapse = (date) => {
    setCollapsedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const [foldersOpen, setFoldersOpen] = useState({
    protocols: true,
    proxyStatus: true,
    countries: true,
    automation: true,
    history: true,
    settings: true
  });

  const toggleFolder = (key) => {
    setFoldersOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Group stats for Profiles & Groups Tab
  const groups = [
    { name: 'All', label: 'Tất cả hồ sơ', count: safeProfiles.length, color: '#6B7280' },
    ...customGroups.map(g => ({
      id: g.id,
      name: g.name,
      label: g.name,
      count: safeProfiles.filter(p => p && p.group === g.name).length,
      color: g.color || '#7C3AED',
      desc: g.desc
    }))
  ];

  // Protocol stats for Proxies
  const socks5Count = safeProxies.filter(p => p && p.type === 'SOCKS5').length;
  const httpCount = safeProxies.filter(p => p && (p.type === 'HTTP' || p.type === 'HTTPS')).length;
  const liveProxyCount = safeProxies.filter(p => p && p.status === 'live').length;
  const lowPingCount = safeProxies.filter(p => p && p.latency && p.latency < 60).length;

  // Header configuration based on activeTab
  const getHeaderConfig = () => {
    switch (activeTab) {
      case 'proxies':
        return {
          title: 'QUẢN LÝ PROXY',
          badge: 'Proxy Pool ▾',
          badgeBg: '#FCE7F3',
          badgeColor: '#DB2777',
          onAdd: () => setActiveProxyModal(true),
          addTitle: 'Thêm Proxy Mới'
        };
      case 'groups':
        return {
          title: 'QUẢN LÝ NHÓM',
          badge: `${customGroups.length} nhóm`,
          badgeBg: '#EDE9FE',
          badgeColor: '#7C3AED',
          onAdd: () => {
            if (activeTab !== 'groups') setActiveTab('groups');
            if (setActiveGroupModal) setActiveGroupModal({ mode: 'create' });
          },
          addTitle: 'Thêm Nhóm Mới'
        };
      case 'scripts':
        return {
          title: 'KỊCH BẢN MÃ NGUỒN',
          badge: 'Scripts ▾',
          badgeBg: '#EFF6FF',
          badgeColor: '#2563EB',
          onAdd: () => alert('Tạo file script Playwright/Puppeteer mới.'),
          addTitle: 'Tạo Script Mới'
        };
      case 'history':
        return {
          title: 'LỊCH SỬ PHIÊN CHẠY',
          badge: `${historyRecords.length} phiên`,
          badgeBg: 'rgba(124, 58, 237, 0.1)',
          badgeColor: 'var(--apidog-purple)',
          onAdd: null,
          addTitle: null
        };
      case 'settings':
        return {
          title: 'CÀI ĐẶT HỆ THỐNG',
          badge: 'Config ▾',
          badgeBg: '#F1F5F9',
          badgeColor: '#475569',
          onAdd: null,
          addTitle: null
        };
      case 'profiles':
      default:
        return {
          title: 'HỒ SƠ TRÌNH DUYỆT',
          badge: null,
          badgeBg: null,
          badgeColor: null,
          onAdd: () => setActiveProfileModal('new'),
          addTitle: 'Tạo Profile mới'
        };
    }
  };

  const header = getHeaderConfig();

  return (
    <div style={{
      width: '260px',
      height: '100%',
      minHeight: 0,
      backgroundColor: 'var(--apidog-card-bg)',
      borderRight: '1px solid var(--apidog-border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxSizing: 'border-box'
    }}>
      {/* Dynamic Pane Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--apidog-border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            {header.title}
          </span>
          {header.badge && (
            <span style={{
              fontSize: '11px',
              color: header.badgeColor,
              background: header.badgeBg,
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}>
              {header.badge}
            </span>
          )}
        </div>

        {activeTab === 'profiles' ? (
          <div ref={workspaceMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 6px',
                borderRadius: '5px',
                backgroundColor: showWorkspaceMenu ? '#F1F5F9' : 'transparent',
                border: '1px solid',
                borderColor: showWorkspaceMenu ? '#CBD5E1' : 'transparent',
                color: '#475569',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 500,
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!showWorkspaceMenu) {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }
              }}
              onMouseLeave={(e) => {
                if (!showWorkspaceMenu) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'transparent';
                }
              }}
              title={`Không gian làm việc: ${currentWorkspace}`}
            >
              <GitBranch size={13} style={{ color: '#64748B', flexShrink: 0 }} />
              <span style={{
                maxWidth: '60px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#334155',
                fontSize: '11.5px',
                fontWeight: 600
              }}>
                {currentWorkspace}
              </span>
              <ChevronDown size={11} style={{ color: '#94A3B8', flexShrink: 0 }} />
            </button>

            {/* Spacious Workspace / Branch Popover Menu matching user's image */}
            {showWorkspaceMenu && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: '28px',
                width: '345px',
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.18), 0 10px 15px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                zIndex: 99999,
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxSizing: 'border-box',
                textAlign: 'left'
              }}>
                {/* 1. Top Segmented Tabs: Sprint Branches | General Branches */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '7px',
                  padding: '3px',
                  gap: '3px'
                }}>
                  <button
                    type="button"
                    onClick={() => setBranchTab('sprint')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: branchTab === 'sprint' ? '#FFFFFF' : 'transparent',
                      boxShadow: branchTab === 'sprint' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      color: branchTab === 'sprint' ? '#0F172A' : '#64748B',
                      fontSize: '12px',
                      fontWeight: branchTab === 'sprint' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <GitBranch size={13} style={{ color: branchTab === 'sprint' ? '#0F172A' : '#64748B' }} />
                    <span>Sprint Branches</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBranchTab('general')}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: branchTab === 'general' ? '#FFFFFF' : 'transparent',
                      boxShadow: branchTab === 'general' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      color: branchTab === 'general' ? '#0F172A' : '#64748B',
                      fontSize: '12px',
                      fontWeight: branchTab === 'general' ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <GitBranch size={13} style={{ color: branchTab === 'general' ? '#0F172A' : '#64748B' }} />
                    <span>General Branches</span>
                  </button>
                </div>

                {/* 2. Search Branches Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search branches..."
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px 7px 32px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12.5px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                {/* 3. Standard Branches Collapsible */}
                <div>
                  <div
                    onClick={() => setStandardCollapsed(!standardCollapsed)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '2px 0 4px 0',
                      userSelect: 'none'
                    }}
                  >
                    <span>Standard Branches</span>
                    {standardCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </div>

                  {!standardCollapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '160px', overflowY: 'auto' }}>
                      {filteredBranches.map(b => {
                        const isSelected = b === currentWorkspace;
                        return (
                          <div
                            key={b}
                            onClick={() => handleSelectWorkspace(b)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 10px',
                              borderRadius: '6px',
                              backgroundColor: isSelected ? '#F1F5F9' : 'transparent',
                              cursor: 'pointer',
                              transition: 'background-color 0.1s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <GitBranch size={14} style={{ color: isSelected ? '#0F172A' : '#64748B' }} />
                              <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: '#0F172A' }}>
                                {b}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '10.5px',
                              color: '#64748B',
                              backgroundColor: isSelected ? '#FFFFFF' : '#F1F5F9',
                              padding: '1px 7px',
                              borderRadius: '10px',
                              border: '1px solid #E2E8F0',
                              fontWeight: 500
                            }}>
                              {b === 'main' ? 'main' : 'branch'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. AI Branches Collapsible */}
                <div>
                  <div
                    onClick={() => setAiCollapsed(!aiCollapsed)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      color: '#64748B',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '4px 0',
                      userSelect: 'none'
                    }}
                  >
                    <span>AI Branches</span>
                    <Info size={12} style={{ color: '#94A3B8' }} />
                    {aiCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                  </div>

                  {!aiCollapsed && (
                    <div style={{
                      padding: '14px 0',
                      textAlign: 'center',
                      color: '#94A3B8',
                      fontSize: '12px',
                      fontWeight: 500
                    }}>
                      No branches yet
                    </div>
                  )}
                </div>

                {/* 5. Footer Actions */}
                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  {isCreatingWorkspace ? (
                    <form onSubmit={handleAddWorkspace} style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                      <input
                        type="text"
                        autoFocus
                        placeholder="Branch name..."
                        value={newWorkspaceInput}
                        onChange={(e) => setNewWorkspaceInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => setIsCreatingWorkspace(false)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          style={{
                            padding: '3px 10px',
                            fontSize: '11px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: '#0F172A',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div
                      onClick={() => setIsCreatingWorkspace(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12.5px',
                        color: '#334155',
                        fontWeight: 500,
                        transition: 'background-color 0.1s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Plus size={14} style={{ color: '#475569' }} />
                      <span>New Sprint Branch</span>
                    </div>
                  )}

                  <div
                    onClick={() => {
                      addLog?.('Mở danh sách Merge Requests', 'info');
                      setShowWorkspaceMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      color: '#334155',
                      fontWeight: 500,
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <GitPullRequest size={14} style={{ color: '#475569' }} />
                    <span>Merge Requests</span>
                  </div>

                  <div
                    onClick={() => {
                      addLog?.('Mở cài đặt quản lý Sprint Branches', 'info');
                      setShowWorkspaceMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12.5px',
                      color: '#334155',
                      fontWeight: 500,
                      transition: 'background-color 0.1s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings size={14} style={{ color: '#475569' }} />
                    <span>Manage Sprint Branches</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {header.onAdd && (
              <button
                onClick={header.onAdd}
                className="btn-icon-subtle"
                title={header.addTitle}
              >
                <Plus size={15} />
              </button>
            )}
            <button className="btn-icon-subtle" title="Tùy chọn">
              <MoreHorizontal size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Explorer Tree Content - Switches based on activeTab */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 8px' }}>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. PROXY EXPLORER (when activeTab === 'proxies')            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'proxies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Sub-module Nav Tree */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              color: 'var(--apidog-text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>Phân Hệ Proxy</span>
            </div>

            {[
              { id: 'pool', label: 'Kho Proxy Tĩnh', icon: Globe, count: safeProxies.length, color: '#7C3AED' },
              { id: 'rotator', label: 'Xoay Proxy & API', icon: ArrowRightLeft, count: safeRotatingProxies.length, color: '#2563EB' },
              { id: 'ipv6', label: 'Bộ Tạo IPv6 /64', icon: Cpu, badge: 'Gen', color: '#9333EA' },
              { id: 'dcom', label: 'DCOM 4G/5G Dongle', icon: Smartphone, count: safeDcomDevices.length, color: '#059669' },
              { id: 'rules', label: 'Quy Tắc & Mặc Định', icon: Sliders, color: '#D97706' },
              { id: 'router', label: 'Bắt Gói & Phân Luồng', icon: Activity, badge: 'Live', color: '#059669', isPage: true }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = item.isPage ? activeTab === 'proxy-requests' : (activeTab === 'proxies' && activeProxySubTab === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.isPage) {
                      setActiveTab('proxy-requests');
                    } else {
                      setActiveTab('proxies');
                      setActiveProxySubTab(item.id);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#F3E8FF' : 'transparent',
                    color: isSelected ? 'var(--apidog-purple)' : '#334155',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={14} style={{ color: isSelected ? 'var(--apidog-purple)' : item.color }} />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span style={{ fontSize: '11px', color: isSelected ? 'var(--apidog-purple)' : '#94A3B8', fontWeight: isSelected ? 700 : 500 }}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span style={{ fontSize: '9.5px', color: '#7C3AED', backgroundColor: '#EDE9FE', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}

            {/* If in static pool, show detailed filters */}
            {activeProxySubTab === 'pool' && (
              <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: 'var(--apidog-text-muted)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Bộ Lọc Kho Tĩnh
                </div>

                {/* All Proxies button */}
                <div
                  onClick={() => setSelectedProxyFilter?.('All')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: selectedProxyFilter === 'All' ? '#F3E8FF' : 'transparent',
                    color: selectedProxyFilter === 'All' ? 'var(--apidog-purple)' : '#475569',
                    fontWeight: selectedProxyFilter === 'All' ? 600 : 400,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <span>Tất cả ({safeProxies.length})</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{safeProxies.length}</span>
                </div>

                {/* Protocols Folder */}
                <div>
                  <div
                    onClick={() => toggleFolder('protocols')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: '#1E293B',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {foldersOpen.protocols ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>Giao thức</span>
                    </div>
                  </div>
                  {foldersOpen.protocols && (
                    <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        onClick={() => setSelectedProxyFilter?.('SOCKS5')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: selectedProxyFilter === 'SOCKS5' ? '#F3E8FF' : 'transparent',
                          color: selectedProxyFilter === 'SOCKS5' ? 'var(--apidog-purple)' : '#475569',
                          fontWeight: selectedProxyFilter === 'SOCKS5' ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '11.5px'
                        }}
                      >
                        <span>SOCKS5</span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{socks5Count}</span>
                      </div>
                      <div
                        onClick={() => setSelectedProxyFilter?.('HTTP')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: selectedProxyFilter === 'HTTP' ? '#F3E8FF' : 'transparent',
                          color: selectedProxyFilter === 'HTTP' ? 'var(--apidog-purple)' : '#475569',
                          fontWeight: selectedProxyFilter === 'HTTP' ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '11.5px'
                        }}
                      >
                        <span>HTTP / HTTPS</span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{httpCount}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Folder */}
                <div>
                  <div
                    onClick={() => toggleFolder('proxyStatus')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: '#1E293B',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {foldersOpen.proxyStatus ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>Trạng thái</span>
                    </div>
                  </div>
                  {foldersOpen.proxyStatus && (
                    <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div
                        onClick={() => setSelectedProxyFilter?.('live')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: selectedProxyFilter === 'live' ? '#F3E8FF' : 'transparent',
                          color: selectedProxyFilter === 'live' ? 'var(--apidog-purple)' : '#475569',
                          fontWeight: selectedProxyFilter === 'live' ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '11.5px'
                        }}
                      >
                        <span>Hoạt động (Live)</span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{liveProxyCount}</span>
                      </div>
                      <div
                        onClick={() => setSelectedProxyFilter?.('low_ping')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: selectedProxyFilter === 'low_ping' ? '#F3E8FF' : 'transparent',
                          color: selectedProxyFilter === 'low_ping' ? 'var(--apidog-purple)' : '#475569',
                          fontWeight: selectedProxyFilter === 'low_ping' ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '11.5px'
                        }}
                      >
                        <span>Ping nhanh (&lt;60ms)</span>
                        <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{lowPingCount}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Countries Folder */}
                <div>
                  <div
                    onClick={() => toggleFolder('countries')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      color: '#1E293B',
                      fontWeight: 600,
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {foldersOpen.countries ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                      <span>Quốc gia</span>
                    </div>
                  </div>
                  {foldersOpen.countries && (
                    <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {[
                        { code: 'US', name: 'Hoa Kỳ (US)' },
                        { code: 'VN', name: 'Việt Nam (VN)' },
                        { code: 'SG', name: 'Singapore (SG)' },
                        { code: 'GB', name: 'Vương Quốc Anh' },
                        { code: 'JP', name: 'Nhật Bản (JP)' }
                      ].map(c => {
                        const count = safeProxies.filter(p => p && p.country === c.code).length;
                        const isSel = selectedProxyFilter === c.code;
                        return (
                          <div
                            key={c.code}
                            onClick={() => setSelectedProxyFilter?.(c.code)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '4px 8px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: isSel ? '#F3E8FF' : 'transparent',
                              color: isSel ? 'var(--apidog-purple)' : '#475569',
                              fontWeight: isSel ? 600 : 400,
                              cursor: 'pointer',
                              fontSize: '11.5px'
                            }}
                          >
                            <span>{c.name}</span>
                            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dashed Add Proxy Button */}
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setActiveProxyModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #D1D5DB',
                  background: 'transparent',
                  color: 'var(--apidog-purple)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <Plus size={13} />Thêm Proxy Mới
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1.1 TRAFFIC ROUTER EXPLORER (activeTab === 'proxy-requests')*/}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'proxy-requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px',
              fontSize: '11px',
              color: 'var(--apidog-text-muted)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>Bắt Gói Mạng Local</span>
              <span style={{ color: '#10B981', fontWeight: 700, fontSize: '10px' }}>● 127.0.0.1:8899</span>
            </div>

            {[
              { label: '📡 Luồng Bắt Gói Thời Gian Thực', desc: 'Realtime Traffic Stream' },
              { label: '⚡ Tuyến DIRECT (Đi Thẳng)', desc: 'Tiết kiệm 12.84 GB' },
              { label: '🛡 Tuyến PROXY (Ẩn IP)', desc: '1.48 GB tiêu thụ' },
              { label: '🚫 Tuyến BLOCKED (Đã Chặn)', desc: '485 MB chặn rác' },
              { label: '⚙️ Bảng Quy Tắc Phân Luồng', desc: '8 quy tắc kích hoạt' }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: idx === 0 ? '#F3E8FF' : 'transparent',
                  color: idx === 0 ? 'var(--apidog-purple)' : '#334155',
                  fontSize: '12px',
                  fontWeight: idx === 0 ? 600 : 400,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (idx !== 0) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (idx !== 0) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div>{item.label}</div>
                <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>{item.desc}</div>
              </div>
            ))}

            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => setActiveTab('proxies')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                ← Quay Lại Kho Proxy
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. PROFILES EXPLORER (when activeTab === 'profiles')        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === 'profiles' || activeTab === 'workspace') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>

            {/* List of groups directly rendered */}
            {groups.map(g => {
              const isSelected = selectedGroup === g.name;
              return (
                <div
                  key={g.name}
                  onClick={() => {
                    setSelectedGroup(g.name);
                    setActiveTab('profiles');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#F3E8FF' : 'transparent',
                    color: isSelected ? 'var(--apidog-purple)' : '#334155',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Folder size={14} style={{ color: isSelected ? 'var(--apidog-purple)' : '#94A3B8' }} />
                    <span>{g.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: isSelected ? 'var(--apidog-purple)' : '#94A3B8', fontWeight: 500 }}>
                    {g.count}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. GROUPS EXPLORER (when activeTab === 'groups')            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'groups' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              fontSize: '12px',
              color: 'var(--apidog-text-muted)',
              fontWeight: 600
            }}>
              <span>📁 Cây thư mục Nhóm</span>
            </div>

            {groups.map(g => (
              <div
                key={g.name}
                onClick={() => {
                  setSelectedGroup(g.name);
                  setActiveTab('profiles');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedGroup === g.name ? '#EDE9FE' : 'transparent',
                  color: selectedGroup === g.name ? '#7C3AED' : '#334155',
                  fontWeight: selectedGroup === g.name ? 600 : 500,
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedGroup !== g.name) e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (selectedGroup !== g.name) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Folder size={14} style={{ color: g.color || '#7C3AED' }} />
                  <span>{g.label}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{g.count} hồ sơ</span>
              </div>
            ))}

            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => setActiveGroupModal && setActiveGroupModal({ mode: 'create' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #D1D5DB',
                  background: 'transparent',
                  color: '#7C3AED',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7C3AED';
                  e.currentTarget.style.backgroundColor = '#FAF5FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#D1D5DB';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Plus size={13} /> + Tạo Nhóm Mới
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4.1 SCRIPTS EXPLORER (when activeTab === 'scripts')         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'scripts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              fontSize: '12px',
              color: '#2563EB',
              fontWeight: 700
            }}>
              <FileCode size={14} />
              <span>Tệp kịch bản Playwright & Puppeteer</span>
            </div>

            {[
              { name: 'facebook_farming.js', engine: 'Playwright', size: '3.2 KB' },
              { name: 'tiktok_shop_auto.js', engine: 'Puppeteer', size: '4.8 KB' },
              { name: 'crypto_airdrop_bot.js', engine: 'Web3 / PW', size: '5.1 KB' },
              { name: 'shopee_price_scraper.js', engine: 'Puppeteer', size: '2.9 KB' }
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: '1px solid var(--apidog-border)',
                  backgroundColor: 'var(--apidog-bg)',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode size={13} color="#2563EB" />
                  <span style={{ fontFamily: 'monospace', fontWeight: 500, color: 'var(--apidog-text-main)' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--apidog-text-muted)' }}>{s.engine}</span>
              </div>
            ))}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. HISTORY EXPLORER (when activeTab === 'history')          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (() => {
          // Group by dateGroup directly without search/scope filters
          const dateGroups = historyRecords.reduce((acc, r) => {
            const dg = r.dateGroup || 'Hôm nay (07/09/2026)';
            if (!acc[dg]) acc[dg] = [];
            acc[dg].push(r);
            return acc;
          }, {});

          return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Tree Group by Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
                {Object.keys(dateGroups).length === 0 ? (
                  <div style={{ padding: '14px 6px', fontSize: '11.5px', color: 'var(--apidog-text-muted)', textAlign: 'center' }}>
                    Chưa có lịch sử chạy nào
                  </div>
                ) : (
                  Object.entries(dateGroups).map(([date, records]) => {
                    const isCollapsed = !!collapsedDates[date];
                    const isDateHovered = hoveredDate === date;

                    return (
                      <div key={date} style={{ marginBottom: '4px' }}>
                        {/* Date Group Header: Click to toggle, Hover to show delete */}
                        <div
                          onClick={() => toggleDateCollapse(date)}
                          onMouseEnter={() => setHoveredDate(date)}
                          onMouseLeave={() => setHoveredDate(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '5px 6px',
                            borderRadius: '5px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            color: 'var(--apidog-text-muted)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            backgroundColor: isDateHovered ? 'var(--apidog-border-light)' : 'transparent',
                            transition: 'background-color 0.12s ease'
                          }}
                        >
                          {/* Left: Chevron + Date title */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
                            {isCollapsed ? (
                              <ChevronRight size={13} style={{ flexShrink: 0, color: 'var(--apidog-text-muted)' }} />
                            ) : (
                              <ChevronDown size={13} style={{ flexShrink: 0, color: 'var(--apidog-text-muted)' }} />
                            )}
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {date} ({records.length})
                            </span>
                          </div>

                          {/* Right: Hover Delete Button for Date Group */}
                          {isDateHovered && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Bạn có chắc muốn xóa tất cả ${records.length} phiên chạy của "${date}"?`)) {
                                  if (deleteHistoryGroup) {
                                    deleteHistoryGroup(date);
                                  }
                                }
                              }}
                              title={`Xóa tất cả phiên chạy của ${date}`}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                color: 'var(--apidog-text-muted)',
                                transition: 'all 0.12s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = '#EF4444';
                                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--apidog-text-muted)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        {/* Items under date (hidden when collapsed) */}
                        {!isCollapsed && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '4px', marginTop: '2px' }}>
                            {records.map(record => {
                              const isSelected = selectedHistoryId === record.id;
                              const isLive = record.status === 'running';
                              const isItemHovered = hoveredRecordId === record.id;

                              return (
                                <div
                                  key={record.id}
                                  onClick={() => setSelectedHistoryId(record.id)}
                                  onMouseEnter={() => setHoveredRecordId(record.id)}
                                  onMouseLeave={() => setHoveredRecordId(null)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '7px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'var(--apidog-purple-light)' : isItemHovered ? 'var(--apidog-border-light)' : 'transparent',
                                    color: isSelected ? 'var(--apidog-purple)' : 'var(--apidog-text-main)',
                                    fontSize: '12px',
                                    transition: 'all 0.12s ease'
                                  }}
                                >
                                  {/* Status Pulse or Dot */}
                                  <span style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: isLive ? '#10B981' : '#94A3B8',
                                    boxShadow: isLive ? '0 0 0 2px rgba(16, 185, 129, 0.25)' : 'none',
                                    flexShrink: 0
                                  }} />

                                  {/* Profile Title & Subtext */}
                                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                                    <span style={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      fontWeight: isSelected ? 600 : 500,
                                      fontSize: '12px'
                                    }}>
                                      {record.profileName || 'Hồ sơ chưa đặt tên'}
                                    </span>
                                    <span style={{
                                      fontSize: '10.5px',
                                      color: 'var(--apidog-text-muted)',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {record.proxy?.host ? `${record.proxy.country || ''} ${record.proxy.host}` : 'Direct IP'} • {record.duration || 'Hoàn tất'}
                                    </span>
                                  </div>

                                  {/* Item-level Hover Delete Button */}
                                  {isItemHovered && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (deleteHistoryRecord) {
                                          deleteHistoryRecord(record.id);
                                        }
                                      }}
                                      title="Xóa phiên này"
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '2px 4px',
                                        borderRadius: '4px',
                                        color: 'var(--apidog-text-muted)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#EF4444';
                                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'var(--apidog-text-muted)';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                      }}
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. SETTINGS EXPLORER (when activeTab === 'settings')        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>


            {[
              { id: 'browser', label: 'Cấu hình Browser & Khởi chạy', icon: Globe },
              { id: 'general', label: 'Cấu hình chung hệ thống', icon: Settings },
              { id: 'fingerprint', label: 'Vân tay Fingerprint & WebGL', icon: Fingerprint },
              { id: 'network', label: 'Cấu hình Mạng & DNS Leaks', icon: Shield },
              { id: 'cookie', label: 'Kho Cookie & Tiện ích mở rộng', icon: Cookie },
              { id: 'license', label: 'Bản quyền & Nâng cấp gói', icon: Key }
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = (activeSettingsSection || 'browser') === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveSettingsSection?.(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? 'var(--apidog-purple)' : '#334155',
                    backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.08)' : 'transparent',
                    borderLeft: isSelected ? '3px solid var(--apidog-purple)' : '3px solid transparent',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={14} style={{ color: isSelected ? 'var(--apidog-purple)' : '#64748B', flexShrink: 0 }} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PINNED BOTTOM FOOTER: THÙNG RÁC ── */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid #F0F0F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div
          onClick={() => setActiveTrashModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 500,
            transition: 'all 0.15s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
          title="Mở Thùng rác hồ sơ đã xóa"
        >
          <Trash2 size={14} style={{ color: '#DC2626' }} />
          <span style={{ color: '#DC2626', fontWeight: 600 }}>Thùng rác ({trashProfiles.length})</span>
        </div>
      </div>
    </div>
  );
}
