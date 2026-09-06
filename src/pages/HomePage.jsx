import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Compass, 
  Star, 
  Clock, 
  Gift, 
  Building2, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  Download, 
  Globe, 
  Play, 
  Square, 
  MoreVertical,
  X,
  ExternalLink,
  ChevronDown,
  Shield,
  Layers
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function HomeWorkspaceView() {
  const { profiles, setActiveProfileModal, setActiveTab, toggleLaunchProfile, setActiveUpgradeModal } = useBrowser();
  const [activeSubTab, setActiveSubTab] = useState('projects'); // 'projects', 'resources', 'activities', etc.
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [showBanner, setShowBanner] = useState(true);

  const subTabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'resources', label: 'Resources' },
    { id: 'activities', label: 'Activities' },
    { id: 'members', label: 'Members' },
    { id: 'plans', label: 'Plans' },
    { id: 'scanner', label: 'Secret Scanner' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
      {/* Left Sidebar (My Teams, API Hub, My Favorites, Recently Visited, Invite) */}
      <aside style={{
        width: '220px',
        borderRight: '1px solid #F0F0F0',
        backgroundColor: '#FAFBFD',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        flexShrink: 0
      }}>
        <div>
          {/* My Teams Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              padding: '0 8px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} />
                <span>My Teams</span>
              </div>
              <ChevronDown size={12} />
            </div>

            {/* Active team: Nhóm cá nhân */}
            <div style={{
              backgroundColor: '#ECEFF4',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1F2937',
              cursor: 'pointer',
              marginBottom: '6px'
            }}>
              Nhóm cá nhân
            </div>

            {/* + New Team button */}
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: 'var(--apidog-purple)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>New Team</span>
            </button>
          </div>

          {/* Navigation items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div 
              onClick={() => setActiveTab('profiles')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={14} color="#6B7280" />
                <span>API Hub</span>
              </div>
              <span style={{ fontSize: '10px', color: '#9CA3AF' }}>Explore More</span>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <Star size={14} color="#6B7280" />
              <span>My Favorites</span>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <Clock size={14} color="#6B7280" />
              <span>Recently Visited</span>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Invite Friends card & Organizations */}
        <div>
          <div style={{
            backgroundColor: '#F5F3FF',
            border: '1px solid #EDE9FE',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            cursor: 'pointer'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--apidog-purple)', fontSize: '12px', fontWeight: 600 }}>
              <Gift size={15} />
              <span>Invite Friends</span>
            </div>
            <span style={{ fontSize: '10px', backgroundColor: '#E0E7FF', color: 'var(--apidog-purple)', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
              Earn $10 Credits
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 10px',
            fontSize: '12px',
            color: '#6B7280',
            cursor: 'pointer'
          }}>
            <Building2 size={14} />
            <span>Organizations</span>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px 32px' }}>
        {/* Header: Nhóm cá nhân [Team Owner] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Nhóm cá nhân
          </h1>
          <span style={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            Team Owner
          </span>
        </div>

        {/* Yellow/Orange referral banner */}
        {showBanner && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FEF3C7',
            borderRadius: '6px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#92400E',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gift size={14} color="#D97706" />
              <span>Invite friends, earn <strong style={{ color: '#D97706' }}>$10 Credits</strong> per referral ➔</span>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', opacity: 0.7 }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Navigation Tabs (Projects, Resources, Activities, Members, Plans, Secret Scanner, Settings) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '20px'
        }}>
          {subTabs.map(tab => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => tab.id === 'plans' ? setActiveUpgradeModal(true) : setActiveSubTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px 0',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--apidog-purple)' : '#6B7280',
                  borderBottom: isActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub-toolbar: [Grid] [List] [Sort] ... [Import Project] [+ New Project] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          {/* Left view controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid #E5E7EB',
                backgroundColor: viewMode === 'grid' ? '#F3F4F6' : '#FFFFFF',
                color: viewMode === 'grid' ? '#111827' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Dạng lưới"
            >
              <LayoutGrid size={14} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid #E5E7EB',
                backgroundColor: viewMode === 'table' ? '#F3F4F6' : '#FFFFFF',
                color: viewMode === 'table' ? '#111827' : '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Dạng danh sách"
            >
              <List size={14} />
            </button>
            <button
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Sắp xếp"
            >
              <ArrowUpDown size={13} />
            </button>
          </div>

          {/* Right action buttons: [Import Project] [+ New Project] */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setActiveProfileModal('new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Import Project</span>
            </button>

            <button
              onClick={() => setActiveProfileModal('new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--apidog-purple)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Plus size={14} />
              <span>+ New Project</span>
            </button>
          </div>
        </div>

        {/* Project Cards (Grid Mode - exactly like the card in user screenshot!) */}
        {viewMode === 'grid' ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 320px))',
            gap: '16px'
          }}>
            {profiles.map(p => {
              const isRunning = p.status === 'running';
              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E5E7EB',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--apidog-purple)';
                    e.currentTarget.style.boxShadow = '0 6px 16px -4px rgba(124, 58, 237, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    {/* Top card: Gradient app icon like screenshot */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7C3AED, #3B82F6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 8px rgba(124, 58, 237, 0.2)'
                      }}>
                        <Globe size={20} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLaunchProfile(p.id);
                          }}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: isRunning ? '#FEE2E2' : '#DCFCE7',
                            color: isRunning ? '#DC2626' : '#15803D'
                          }}
                        >
                          {isRunning ? 'DỪNG' : 'CHẠY'}
                        </button>
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 6px 0' }}>
                      {p.name}
                    </h3>
                  </div>

                  {/* Card Footer: tags */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                    <span style={{
                      fontSize: '11px',
                      color: '#6B7280',
                      backgroundColor: '#F3F4F6',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}>
                      {p.browser || 'Chrome 128'}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: 'var(--apidog-purple)',
                      backgroundColor: '#F5F3FF',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}>
                      {p.proxy?.host ? `${p.proxy.type} Proxy` : 'Direct IP'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table mode */
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280' }}>
                  <th style={{ padding: '10px 14px' }}>Tên Project / Profile</th>
                  <th style={{ padding: '10px 14px' }}>Trạng thái</th>
                  <th style={{ padding: '10px 14px' }}>Proxy</th>
                  <th style={{ padding: '10px 14px' }}>Cấu hình Core</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(p => {
                  const isRunning = p.status === 'running';
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>
                        {p.name}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          color: isRunning ? '#16A34A' : '#9CA3AF',
                          fontWeight: 600,
                          fontSize: '11px'
                        }}>
                          ● {isRunning ? 'Đang chạy' : 'Đã dừng'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#4B5563' }}>
                        {p.proxy?.host ? `${p.proxy.host}:${p.proxy.port}` : 'Direct IP'}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#6B7280' }}>
                        {p.browser} • {p.cores} Cores • {p.ram}GB
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleLaunchProfile(p.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: isRunning ? '#FEE2E2' : '#DCFCE7',
                            color: isRunning ? '#DC2626' : '#15803D'
                          }}
                        >
                          {isRunning ? 'Dừng' : 'Chạy'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
