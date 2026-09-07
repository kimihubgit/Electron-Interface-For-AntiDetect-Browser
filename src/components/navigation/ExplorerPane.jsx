import React, { useState } from 'react';
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
  Puzzle
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ExplorerPane() {
  const {
    activeTab,
    setActiveTab,
    profiles = [],
    proxies = [],
    trashProfiles = [],
    selectedGroup,
    setSelectedGroup,
    selectedProxyFilter = 'All',
    setSelectedProxyFilter,
    setActiveProfileModal,
    setActiveProxyModal,
    setActiveTrashModal
  } = useBrowser();

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

  // Group stats for Profiles
  const groups = [
    { name: 'All', label: 'Tất cả hồ sơ', count: profiles.length },
    { name: 'Facebook Ads', label: 'Facebook Ads', count: profiles.filter(p => p.group === 'Facebook Ads').length },
    { name: 'TikTok', label: 'TikTok Shop VN', count: profiles.filter(p => p.group === 'TikTok').length },
    { name: 'Crypto', label: 'Crypto Airdrop', count: profiles.filter(p => p.group === 'Crypto').length },
    { name: 'E-Commerce', label: 'E-Commerce US', count: profiles.filter(p => p.group === 'E-Commerce').length },
  ];

  // Protocol stats for Proxies
  const socks5Count = proxies.filter(p => p.type === 'SOCKS5').length;
  const httpCount = proxies.filter(p => p.type === 'HTTP' || p.type === 'HTTPS').length;
  const liveProxyCount = proxies.filter(p => p.status === 'live').length;
  const lowPingCount = proxies.filter(p => p.latency && p.latency < 60).length;

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
          badge: 'Workspace ▾',
          badgeBg: '#EDE9FE',
          badgeColor: '#7C3AED',
          onAdd: () => alert('Tính năng Tạo Nhóm mới đang sẵn sàng.'),
          addTitle: 'Thêm Nhóm Mới'
        };
      case 'automation':
        return {
          title: 'TỰ ĐỘNG HÓA',
          badge: 'RPA Engine ▾',
          badgeBg: '#FEF3C7',
          badgeColor: '#D97706',
          onAdd: () => alert('Tạo kịch bản tự động hóa Playwright / Puppeteer mới.'),
          addTitle: 'Tạo Kịch Bản Mới'
        };
      case 'history':
        return {
          title: 'NHẬT KÝ & LỊCH SỬ',
          badge: 'Audit Logs ▾',
          badgeBg: '#E0F2FE',
          badgeColor: '#0284C7',
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
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxSizing: 'border-box'
    }}>
      {/* Dynamic Pane Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid #F0F0F0',
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
      </div>

      {/* Explorer Tree Content - Switches based on activeTab */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 8px' }}>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. PROXY EXPLORER (when activeTab === 'proxies')            */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'proxies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* All Proxies button */}
            <div
              onClick={() => setSelectedProxyFilter?.('All')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: selectedProxyFilter === 'All' ? '#F3E8FF' : 'transparent',
                color: selectedProxyFilter === 'All' ? 'var(--apidog-purple)' : '#334155',
                fontWeight: selectedProxyFilter === 'All' ? 600 : 500,
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Globe size={14} style={{ color: selectedProxyFilter === 'All' ? 'var(--apidog-purple)' : '#64748B' }} />
                <span>Tất cả Proxy ({proxies.length})</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{proxies.length}</span>
            </div>

            {/* Folder: Giao thức mạng */}
            <div style={{ marginTop: '4px' }}>
              <div
                onClick={() => toggleFolder('protocols')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {foldersOpen.protocols ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Giao thức kết nối</span>
                </div>
              </div>

              {foldersOpen.protocols && (
                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  <div
                    onClick={() => setSelectedProxyFilter?.('SOCKS5')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedProxyFilter === 'SOCKS5' ? '#F3E8FF' : 'transparent',
                      color: selectedProxyFilter === 'SOCKS5' ? 'var(--apidog-purple)' : '#475569',
                      fontWeight: selectedProxyFilter === 'SOCKS5' ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={13} style={{ color: '#7C3AED' }} />
                      <span>SOCKS5 Proxy</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{socks5Count}</span>
                  </div>

                  <div
                    onClick={() => setSelectedProxyFilter?.('HTTP')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedProxyFilter === 'HTTP' ? '#F3E8FF' : 'transparent',
                      color: selectedProxyFilter === 'HTTP' ? 'var(--apidog-purple)' : '#475569',
                      fontWeight: selectedProxyFilter === 'HTTP' ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={13} style={{ color: '#2563EB' }} />
                      <span>HTTP / HTTPS</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{httpCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Folder: Trạng thái & Tốc độ */}
            <div style={{ marginTop: '4px' }}>
              <div
                onClick={() => toggleFolder('proxyStatus')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {foldersOpen.proxyStatus ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Trạng thái & Độ trễ</span>
                </div>
              </div>

              {foldersOpen.proxyStatus && (
                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  <div
                    onClick={() => setSelectedProxyFilter?.('live')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedProxyFilter === 'live' ? '#F3E8FF' : 'transparent',
                      color: selectedProxyFilter === 'live' ? 'var(--apidog-purple)' : '#475569',
                      fontWeight: selectedProxyFilter === 'live' ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} style={{ color: '#16A34A' }} />
                      <span>Hoạt động (Live)</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{liveProxyCount}</span>
                  </div>

                  <div
                    onClick={() => setSelectedProxyFilter?.('low_ping')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: selectedProxyFilter === 'low_ping' ? '#F3E8FF' : 'transparent',
                      color: selectedProxyFilter === 'low_ping' ? 'var(--apidog-purple)' : '#475569',
                      fontWeight: selectedProxyFilter === 'low_ping' ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={13} style={{ color: '#EAB308' }} />
                      <span>Ping nhanh (&lt;60ms)</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{lowPingCount}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Folder: Vị trí Quốc gia */}
            <div style={{ marginTop: '4px' }}>
              <div
                onClick={() => toggleFolder('countries')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: '#1E293B',
                  fontWeight: 600,
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {foldersOpen.countries ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span>Khu vực Quốc gia</span>
                </div>
              </div>

              {foldersOpen.countries && (
                <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                  {[
                    { code: 'US', name: 'Hoa Kỳ (United States)' },
                    { code: 'VN', name: 'Việt Nam (VN)' },
                    { code: 'SG', name: 'Singapore (SG)' },
                    { code: 'GB', name: 'Vương Quốc Anh (GB)' },
                    { code: 'JP', name: 'Nhật Bản (JP)' }
                  ].map(c => {
                    const count = proxies.filter(p => p.country === c.code).length;
                    const isSel = selectedProxyFilter === c.code;
                    return (
                      <div
                        key={c.code}
                        onClick={() => setSelectedProxyFilter?.(c.code)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSel ? '#F3E8FF' : 'transparent',
                          color: isSel ? 'var(--apidog-purple)' : '#475569',
                          fontWeight: isSel ? 600 : 400,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        <span>{c.name}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dashed Add Proxy Button */}
            <div style={{ marginTop: '12px' }}>
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
                <Plus size={13} /> + Thêm Proxy Mới
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. PROFILES EXPLORER (when activeTab === 'profiles')        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(activeTab === 'profiles' || activeTab === 'workspace') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {/* Dashed "+ Thêm Profile Mới" button */}
            <button
              onClick={() => setActiveProfileModal('new')}
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
                marginBottom: '6px'
              }}
            >
              <Plus size={14} /> + Thêm Profile Mới
            </button>

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
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: selectedGroup === g.name ? '#EDE9FE' : 'transparent',
                  color: selectedGroup === g.name ? '#7C3AED' : '#334155',
                  fontWeight: selectedGroup === g.name ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Folder size={14} style={{ color: selectedGroup === g.name ? '#7C3AED' : '#94A3B8' }} />
                  <span>{g.label}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{g.count} hồ sơ</span>
              </div>
            ))}

            <div style={{ marginTop: '12px' }}>
              <button
                onClick={() => alert('Đang mở biểu mẫu thêm nhóm mới.')}
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
                  width: '100%'
                }}
              >
                <Plus size={13} /> + Tạo Nhóm Mới
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. AUTOMATION EXPLORER (when activeTab === 'automation')    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'automation' && (
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
              <span>🤖 Kịch bản RPA có sẵn</span>
            </div>

            {[
              { name: 'Nuôi tài khoản Facebook & Newsfeed', runs: '12 profiles' },
              { name: 'Tự động tương tác TikTok Shop VN', runs: '8 profiles' },
              { name: 'Auto Claim Token & Crypto Airdrop', runs: '15 profiles' },
              { name: 'Cào dữ liệu sản phẩm Shopee/Amazon', runs: '4 profiles' },
              { name: 'Xoay vòng IP Proxy tự động', runs: 'Toàn bộ' }
            ].map((s, idx) => (
              <div
                key={idx}
                onClick={() => alert(`Đang chuẩn bị chạy kịch bản: "${s.name}"`)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  border: '1px solid #F1F5F9',
                  marginBottom: '3px',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>
                  <FileCode size={13} style={{ color: '#D97706' }} />
                  <span>{s.name}</span>
                </div>
                <span style={{ fontSize: '10.5px', color: '#64748B', paddingLeft: '19px' }}>
                  Gán cho: {s.runs}
                </span>
              </div>
            ))}

            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => alert('Mở trình tạo kịch bản tự động hóa RPA mới.')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #D1D5DB',
                  background: 'transparent',
                  color: '#D97706',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <Plus size={13} /> + Tạo Kịch Bản RPA
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. HISTORY EXPLORER (when activeTab === 'history')          */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'history' && (
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
              <span>🕒 Nhật ký & Lịch sử</span>
            </div>

            {[
              { label: 'Lịch sử mở hồ sơ hôm nay', count: '14 lượt', icon: Clock },
              { label: 'Nhật ký đổi IP Proxy', count: '28 lần', icon: RotateCw },
              { label: 'Lịch sử chạy kịch bản RPA', count: '6 tác vụ', icon: Bot },
              { label: 'Cảnh báo kết nối & lỗi mạng', count: '0 lỗi', icon: AlertTriangle }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => alert(`Xem chi tiết: ${item.label}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#334155'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <Icon size={14} style={{ color: '#0284C7' }} />
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>{item.count}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. SETTINGS EXPLORER (when activeTab === 'settings')        */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
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
              <span>⚙️ Mục Cài đặt</span>
            </div>

            {[
              { label: 'Cấu hình chung hệ thống', icon: Settings },
              { label: 'Vân tay Fingerprint & WebGL', icon: Fingerprint },
              { label: 'Cấu hình Mạng & DNS Leaks', icon: Shield },
              { label: 'Kho Cookie & Tiện ích mở rộng', icon: Cookie },
              { label: 'Bản quyền & Nâng cấp gói', icon: Key }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => alert(`Mở mục cấu hình: ${item.label}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#334155'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon size={14} style={{ color: 'var(--apidog-purple)' }} />
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
