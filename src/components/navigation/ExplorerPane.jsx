import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  Shield, 
  MoreHorizontal,
  Fingerprint,
  Cookie,
  Layers,
  Cpu,
  Zap,
  Tag
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ExplorerPane() {
  const { 
    profiles, 
    selectedGroup, 
    setSelectedGroup, 
    setActiveProfileModal, 
    setActiveProxyModal,
    setActiveTab 
  } = useBrowser();

  const [searchFilter, setSearchFilter] = useState('');
  const [foldersOpen, setFoldersOpen] = useState({
    groups: true,
    fingerprint: false,
    proxies: false,
    cookies: false,
  });

  const toggleFolder = (key) => {
    setFoldersOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groups = [
    { name: 'All', label: 'Tất cả hồ sơ', count: profiles.length },
    { name: 'Facebook Ads', label: 'Facebook Ads', count: profiles.filter(p => p.group === 'Facebook Ads').length },
    { name: 'TikTok', label: 'TikTok Shop VN', count: profiles.filter(p => p.group === 'TikTok').length },
    { name: 'Crypto', label: 'Crypto Airdrop', count: profiles.filter(p => p.group === 'Crypto').length },
    { name: 'E-Commerce', label: 'E-Commerce US', count: profiles.filter(p => p.group === 'E-Commerce').length },
  ];

  return (
    <div style={{
      width: '260px',
      height: '100%',
      minHeight: 0,
      backgroundColor: 'var(--apidog-sidebar-bg)',
      borderRight: '1px solid var(--apidog-border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxSizing: 'border-box'
    }}>
      {/* Pane Header: "HỒ SƠ" and version/branch */}
      <div style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--apidog-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            HỒ SƠ
          </span>
          <span style={{ fontSize: '11px', color: 'var(--apidog-purple)', background: '#F3E8FF', padding: '1px 6px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
            v2.4 Core ▾
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            onClick={() => setActiveProfileModal('new')}
            className="btn-icon-subtle"
            title="Tạo mới hồ sơ"
          >
            <Plus size={15} />
          </button>
          <button className="btn-icon-subtle" title="Tùy chọn">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      {/* Search Input with purple "+" button (Apidog signature searchbar) */}
      <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--apidog-border)',
          height: '28px',
          padding: '0 8px'
        }}>
          <Search size={13} style={{ color: 'var(--apidog-text-dim)', marginRight: '6px' }} />
          <input
            type="text"
            placeholder="Tìm hồ sơ, proxy..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '12px',
              backgroundColor: 'transparent'
            }}
          />
        </div>

        <button
          className="btn-icon-subtle"
          style={{ width: '28px', height: '28px', border: '1px solid var(--apidog-border)', background: '#FFFFFF' }}
          title="Lọc hồ sơ"
        >
          <Filter size={13} />
        </button>

        <button
          onClick={() => setActiveProfileModal('new')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--apidog-purple)',
            color: '#FFFFFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Tạo Profile mới"
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Explorer Tree Navigation */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '6px 8px' }}>
        {/* Workspace Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 8px',
          fontSize: '12px',
          color: 'var(--apidog-text-muted)',
          fontWeight: 600
        }}>
          <span>📁 Không gian làm việc ▾</span>
        </div>

        {/* Group 1: Danh sách Profile Trình duyệt */}
        <div style={{ marginTop: '2px' }}>
          <div
            onClick={() => toggleFolder('groups')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--apidog-text-main)',
              fontWeight: 600,
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {foldersOpen.groups ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
              <span>Nhóm Profile Trình duyệt</span>
            </div>
          </div>

          {foldersOpen.groups && (
            <div style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
              {/* Dashed "+ Mới" button like Apidog */}
              <button
                onClick={() => setActiveProfileModal('new')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed #D1D5DB',
                  background: 'transparent',
                  color: 'var(--apidog-purple)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
              >
                <Plus size={13} /> + Thêm Profile Mới
              </button>

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
                      padding: '5px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? '#E0E7FF' : 'transparent',
                      color: isSelected ? 'var(--apidog-purple)' : 'var(--apidog-text-main)',
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Folder size={14} style={{ color: isSelected ? 'var(--apidog-purple)' : '#9CA3AF' }} />
                      <span>{g.label}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{g.count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Group 2: Proxy & Mạng */}
        <div style={{ marginTop: '4px' }}>
          <div
            onClick={() => setActiveTab('proxies')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--apidog-text-muted)',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} style={{ color: '#DB2777' }} />
              <span>Quản lý Proxy & IP</span>
            </div>
            <span style={{ fontSize: '11px', color: '#9CA3AF' }}>5</span>
          </div>
        </div>

        {/* Group 3: Cấu hình Vân tay Fingerprint */}
        <div style={{ marginTop: '4px' }}>
          <div
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--apidog-text-muted)',
              fontSize: '12px'
            }}
          >
            <Fingerprint size={14} style={{ color: 'var(--apidog-purple)' }} />
            <span>Vân tay Fingerprint Engine</span>
          </div>
        </div>

        {/* Group 4: Quản lý Cookie & Tiện ích */}
        <div style={{ marginTop: '4px' }}>
          <div
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--apidog-text-muted)',
              fontSize: '12px'
            }}
          >
            <Cookie size={14} style={{ color: '#D97706' }} />
            <span>Kho Cookie & Tiện ích mở rộng</span>
          </div>
        </div>

        {/* Group 5: Khởi chạy hàng loạt */}
        <div style={{ marginTop: '4px' }}>
          <div
            onClick={() => setActiveTab('profiles')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              color: 'var(--apidog-text-muted)',
              fontSize: '12px'
            }}
          >
            <Zap size={14} style={{ color: 'var(--apidog-green)' }} />
            <span>Khởi chạy hàng loạt</span>
          </div>
        </div>
      </div>

      {/* Pane Bottom Footer */}
      <div style={{
        padding: '8px 14px',
        borderTop: '1px solid var(--apidog-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: 'var(--apidog-text-muted)',
        fontSize: '11px',
        flexShrink: 0
      }}>
        <button className="btn-icon-subtle" title="Thu gọn bảng điều khiển">
          ⇤
        </button>
      </div>
    </div>
  );
}
