import React from 'react';
import { Play, Square, Edit3, Trash2, MoreVertical } from 'lucide-react';
import ProfileActionMenu from './ProfileActionMenu';
import { getCountryFlag } from '../utils/profileUtils';

/**
 * Grid view displaying profiles as interactive cards
 */
export default function ProfileGrid({
  filteredProfiles = [],
  selectedProfiles = [],
  handleToggleSelect,
  activeMenuId,
  setActiveMenuId,
  toggleLaunchProfile,
  setActiveProfileModal,
  deleteProfile,
  saveProfile,
  cloneProfile,
  addLog
}) {
  return (
    <div style={{
      padding: '20px 24px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px'
    }}>
      {filteredProfiles.map(p => {
        const isRunning = p.status === 'running';
        const isSelected = selectedProfiles.includes(p.id);

        return (
          <div
            key={p.id}
            data-profile-id={p.id}
            style={{
              backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
              borderRadius: '10px',
              border: isSelected ? '1.5px solid var(--apidog-purple)' : isRunning ? '1.5px solid #10B981' : '1px solid #E2E8F0',
              boxShadow: isSelected ? '0 0 0 2px rgba(99, 102, 241, 0.25), 0 4px 12px rgba(99, 102, 241, 0.08)' : isRunning ? '0 4px 12px rgba(16, 185, 129, 0.12)' : '0 2px 4px rgba(0,0,0,0.03)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Card Header: Checkbox, Name, Status */}
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(p.id)}
                    style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--apidog-purple)' }}
                  />
                  <span style={{ fontSize: '18px' }}>
                    {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                  </span>
                  <div>
                    <div
                      onClick={() => setActiveProfileModal(p)}
                      style={{
                        fontWeight: 600,
                        fontSize: '13.5px',
                        color: '#0F172A',
                        cursor: 'pointer'
                      }}
                      title={p.name}
                    >
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {p.id}
                    </div>
                  </div>
                </div>

                {/* Status Tag */}
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: isRunning ? '#DCFCE7' : '#F1F5F9',
                  color: isRunning ? '#15803D' : '#64748B'
                }}>
                  {isRunning ? '● Đang chạy' : 'Sẵn sàng'}
                </span>
              </div>

              {/* Group & Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#334155'
                }}>
                  📁 {p.group || 'Chung'}
                </span>
                {p.tags && p.tags.map(t => (
                  <span key={t} style={{
                    fontSize: '11px',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB'
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Proxy Box */}
              <div style={{
                marginTop: '12px',
                padding: '8px 10px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #F1F5F9',
                fontSize: '11.5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Proxy IP:</span>
                  {p.proxy?.host ? (
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>
                      {getCountryFlag(p.proxy.country)} {p.proxy.host}:{p.proxy.port}
                    </span>
                  ) : (
                    <span style={{ color: '#94A3B8' }}>Direct</span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', color: '#64748B', fontSize: '11px' }}>
                  <span>Fingerprint:</span>
                  <span>{p.browser || 'Chrome 128'} ({p.cores || 8}C • {p.ram || 16}GB)</span>
                </div>
              </div>
            </div>

            {/* Card Bottom Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              paddingTop: '10px',
              borderTop: '1px solid #F1F5F9'
            }}>
              {isRunning ? (
                <button
                  onClick={() => toggleLaunchProfile(p.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 0',
                    borderRadius: '6px',
                    border: '1px solid #FECACA',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Square size={12} />
                  <span>Dừng</span>
                </button>
              ) : (
                <button
                  onClick={() => toggleLaunchProfile(p.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '7px 0',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--apidog-purple)',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)'
                  }}
                >
                  <Play size={12} style={{ fill: '#FFFFFF' }} />
                  <span>Khởi chạy</span>
                </button>
              )}

              <button
                onClick={() => setActiveProfileModal(p)}
                title="Chỉnh sửa"
                style={{
                  padding: '7px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                <Edit3 size={14} />
              </button>

              {/* 3-dots More Actions Menu button */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(prev => prev === p.id ? null : p.id);
                  }}
                  title="Tùy chọn thao tác khác"
                  style={{
                    padding: '7px',
                    borderRadius: '6px',
                    border: activeMenuId === p.id ? '1px solid var(--apidog-purple)' : '1px solid #E2E8F0',
                    backgroundColor: activeMenuId === p.id ? '#EDE9FE' : '#FFFFFF',
                    color: activeMenuId === p.id ? 'var(--apidog-purple)' : '#475569',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MoreVertical size={14} />
                </button>

                {activeMenuId === p.id && (
                  <ProfileActionMenu
                    profile={p}
                    isUpward={true}
                    onClose={() => setActiveMenuId(null)}
                    saveProfile={saveProfile}
                    cloneProfile={cloneProfile}
                    addLog={addLog}
                  />
                )}
              </div>

              <button
                onClick={() => deleteProfile(p.id)}
                title="Chuyển vào thùng rác"
                style={{
                  padding: '7px',
                  borderRadius: '6px',
                  border: '1px solid #FCA5A5',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
