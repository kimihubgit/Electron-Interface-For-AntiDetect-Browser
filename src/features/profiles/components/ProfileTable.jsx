import React from 'react';
import { Play, Square, Edit3, Trash2, MoreVertical } from 'lucide-react';
import PinnedRunningBar from './PinnedRunningBar';
import ProfileActionMenu from './ProfileActionMenu';
import { getCountryFlag } from '../utils/profileUtils';

/**
 * Table view displaying profiles in rows with columns, badges, and inline actions
 */
export default function ProfileTable({
  filteredProfiles = [],
  selectedProfiles = [],
  handleToggleSelect,
  isAllSelected,
  handleSelectAll,
  runningProfiles = [],
  isPinnedHovered,
  setIsPinnedHovered,
  activeMenuId,
  setActiveMenuId,
  toggleLaunchProfile,
  setActiveProfileModal,
  deleteProfile,
  saveProfile,
  cloneProfile,
  addLog,
  batchStopProfiles
}) {
  return (
    <div style={{ minWidth: '950px' }}>
      {/* Table Header */}
      <div
        data-no-drag="true"
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(260px, 2.5fr) 1.8fr 1.1fr 1.6fr 70px 100px',
          alignItems: 'center',
          height: '40px',
          padding: '0 24px',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          fontSize: '12px',
          fontWeight: 600,
          color: '#475569',
          position: 'sticky',
          top: 0,
          zIndex: 25,
          boxSizing: 'border-box'
        }}
      >
        <div>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--apidog-purple)' }}
          />
        </div>
        <div>Tên Hồ Sơ & Thông Tin</div>
        <div>Proxy & Địa Chỉ IP</div>
        <div>Nhóm</div>
        <div>Fingerprint & Cấu Hình</div>
        <div style={{ textAlign: 'center' }}>Khởi Chạy</div>
        <div style={{ textAlign: 'right' }}>Thao Tác</div>
      </div>

      {/* Table Body */}
      <div>
        {/* ── PINNED RUNNING ROW (INSIDE TABLE - STICKY UNDER HEADER) ── */}
        <PinnedRunningBar
          runningProfiles={runningProfiles}
          isPinnedHovered={isPinnedHovered}
          setIsPinnedHovered={setIsPinnedHovered}
          toggleLaunchProfile={toggleLaunchProfile}
          batchStopProfiles={batchStopProfiles}
        />

        {/* Profile Rows */}
        {filteredProfiles.map((p, index) => {
          const isRunning = p.status === 'running';
          const isSelected = selectedProfiles.includes(p.id);

          return (
            <div
              key={p.id}
              data-profile-id={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '44px minmax(260px, 2.5fr) 1.8fr 1.1fr 1.6fr 70px 100px',
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid #F1F5F9',
                fontSize: '12.5px',
                backgroundColor: isSelected ? (isRunning ? '#EEF2FF' : '#F5F3FF') : (isRunning ? '#F0FDF4' : (index % 2 === 1 ? '#FAFBFC' : '#FFFFFF')),
                boxShadow: isSelected ? 'inset 0 0 0 1.5px #A5B4FC' : 'none',
                transition: 'background-color 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!isRunning && !isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => {
                if (!isRunning && !isSelected) e.currentTarget.style.backgroundColor = index % 2 === 1 ? '#FAFBFC' : '#FFFFFF';
              }}
            >
              {/* Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelect(p.id)}
                  style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--apidog-purple)' }}
                />
              </div>

              {/* Name & OS info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  backgroundColor: isRunning ? '#DCFCE7' : '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '15px'
                }}>
                  {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <div
                    onClick={() => setActiveProfileModal(p)}
                    style={{
                      fontWeight: 600,
                      color: '#0F172A',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      fontSize: '13px'
                    }}
                    title={p.name}
                  >
                    {p.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {p.id}
                    </span>
                    {p.tags && p.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '10px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          fontWeight: 500
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proxy Details */}
              <div>
                {p.proxy?.host ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{getCountryFlag(p.proxy.country)}</span>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        color: '#1E293B',
                        fontWeight: 500
                      }}>
                        {p.proxy.host}:{p.proxy.port}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px' }}>
                      <span style={{
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        padding: '0 4px',
                        borderRadius: '3px',
                        fontWeight: 600
                      }}>
                        {p.proxy.type}
                      </span>
                      <span style={{ color: '#16A34A', fontWeight: 500 }}>
                        ● {p.proxy.latency || 28}ms
                      </span>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#94A3B8', fontSize: '11.5px', fontStyle: 'italic' }}>
                    Direct (Không Proxy)
                  </span>
                )}
              </div>

              {/* Group */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#334155',
                  fontSize: '11.5px',
                  fontWeight: 500
                }}>
                  {p.group || 'Chung'}
                </span>
              </div>

              {/* Specs / Fingerprint */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '11.5px', color: '#1E293B', fontWeight: 500 }}>
                  {p.browser || 'Chrome 128'}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {p.cores || 8} Cores • {p.ram || 16}GB • {p.resolution || '1920x1080'}
                </div>
              </div>

              {/* Play/Stop Launch Button (Column Kế Cuối - Icon Only) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                  onClick={() => toggleLaunchProfile(p.id)}
                  title={isRunning ? "Dừng hồ sơ" : "Khởi chạy hồ sơ"}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: isRunning ? '1px solid #FECACA' : '1px solid #BBF7D0',
                    backgroundColor: isRunning ? '#FEF2F2' : '#F0FDF4',
                    color: isRunning ? '#DC2626' : '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    padding: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isRunning ? '#FEE2E2' : '#DCFCE7';
                    e.currentTarget.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isRunning ? '#FEF2F2' : '#F0FDF4';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {isRunning ? (
                    <Square size={11} style={{ fill: '#DC2626' }} />
                  ) : (
                    <Play size={11} style={{ fill: '#15803D', marginLeft: '1px' }} />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <button
                  onClick={() => setActiveProfileModal(p)}
                  title="Chỉnh sửa cấu hình hồ sơ"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E0E7FF';
                    e.currentTarget.style.color = 'var(--apidog-purple)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
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
                      background: activeMenuId === p.id ? '#EDE9FE' : 'none',
                      border: 'none',
                      padding: '6px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      color: activeMenuId === p.id ? 'var(--apidog-purple)' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (activeMenuId !== p.id) {
                        e.currentTarget.style.backgroundColor = '#F1F5F9';
                        e.currentTarget.style.color = '#0F172A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeMenuId !== p.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>

                  {activeMenuId === p.id && (
                    <ProfileActionMenu
                      profile={p}
                      isUpward={index >= filteredProfiles.length - 2}
                      onClose={() => setActiveMenuId(null)}
                      saveProfile={saveProfile}
                      cloneProfile={cloneProfile}
                      addLog={addLog}
                    />
                  )}
                </div>

                <button
                  onClick={() => deleteProfile(p.id)}
                  title="Chuyển hồ sơ vào Thùng rác"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    color: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
