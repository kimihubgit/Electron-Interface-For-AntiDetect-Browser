import React, { useState, useMemo } from 'react';
import { Play, Square, Edit3, Trash2, MoreVertical, PlusCircle } from 'lucide-react';
import PinnedRunningBar from './PinnedRunningBar';
import ProfileActionMenu from './ProfileActionMenu';
import ColumnVisibilityPopover, { getInitialColumns } from './ColumnVisibilityPopover';
import { getCountryFlag } from '../utils/profileUtils';

/**
 * Table view displaying profiles in rows with configurable columns, badges, and inline actions.
 * Features customizable column visibility via (+) button matching antidetect browser standards.
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
  batchStopProfiles,
  sortBy = 'latest',
  setSortBy
}) {
  // Column configuration state
  const [columns, setColumns] = useState(getInitialColumns);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  // Visible columns in order
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  // CSS Grid template: Checkbox (44px) + Title (minmax(240px, 2fr)) + [dynamic columns] + (+) header (38px) + Launch (60px) + Actions (86px)
  const gridTemplate = useMemo(() => {
    const dynamicColsStr = visibleColumns.map(c => c.flex || '1fr').join(' ');
    return `44px minmax(240px, 2fr) ${dynamicColsStr ? dynamicColsStr + ' ' : ''}38px 60px 86px`;
  }, [visibleColumns]);

  // Min-width for entire table so that it never gets overly compressed
  const tableMinWidth = useMemo(() => {
    const colsTotalMin = visibleColumns.reduce((acc, c) => {
      const val = parseInt(c.minWidth || '120px', 10);
      return acc + (isNaN(val) ? 120 : val);
    }, 0);
    return Math.max(960, 44 + 240 + colsTotalMin + 38 + 60 + 86 + 48);
  }, [visibleColumns]);

  // Render individual cell content based on column ID
  const renderColumnCell = (p, colId, isRunning) => {
    switch (colId) {
      case 'description':
        return (
          <div
            title={p.notes || p.description || ''}
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--apidog-text-muted)',
              fontSize: '12.5px'
            }}
          >
            {p.notes || p.description || <span style={{ color: '#94A3B8' }}>—</span>}
          </div>
        );

      case 'proxy':
        return (
          <div>
            {p.proxy?.host ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{getCountryFlag(p.proxy.country)}</span>
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: 'var(--apidog-text-main)',
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
                    {p.proxy.type || 'SOCKS5'}
                  </span>
                  <span style={{ color: '#16A34A', fontWeight: 500 }}>
                    ● {p.proxy.latency || 28}ms
                  </span>
                </div>
              </div>
            ) : (
              <span style={{ color: 'var(--apidog-text-dim)', fontSize: '11.5px', fontStyle: 'italic' }}>
                Direct
              </span>
            )}
          </div>
        );

      case 'folder':
        return (
          <div>
            <span style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: 'var(--apidog-bg)',
              border: '1px solid var(--apidog-border)',
              color: 'var(--apidog-text-main)',
              fontSize: '11.5px',
              fontWeight: 500
            }}>
              {p.group || 'Chung'}
            </span>
          </div>
        );

      case 'tags':
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', overflow: 'hidden' }}>
            {p.tags && p.tags.length > 0 ? (
              p.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span style={{ color: '#94A3B8' }}>—</span>
            )}
          </div>
        );

      case 'tasks':
        return (
          <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)' }}>
            {p.tasksCount ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 7px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                fontWeight: 600,
                fontSize: '11px'
              }}>
                {p.tasksCount} kịch bản
              </span>
            ) : (
              <span style={{ color: '#94A3B8' }}>—</span>
            )}
          </div>
        );

      case 'workTime':
        return (
          <div style={{
            fontSize: '12px',
            color: isRunning ? '#16A34A' : 'var(--apidog-text-muted)',
            fontWeight: isRunning ? 600 : 400
          }}>
            {isRunning ? '● Đang chạy' : (p.workTime || '—')}
          </div>
        );

      case 'size':
        return (
          <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', fontFamily: 'monospace' }}>
            {p.cacheSize || p.size || '36.8 MB'}
          </div>
        );

      case 'launches':
        return (
          <div style={{ fontSize: '12px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
            {p.launchCount ?? (isRunning ? 1 : 0)}
          </div>
        );

      case 'created':
        return (
          <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-muted)' }}>
            {p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '01/09/2026'}
          </div>
        );

      case 'cookies':
        return (
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#059669',
              fontWeight: 600
            }}>
              {p.cookiesCount ? `${p.cookiesCount} cookies` : 'Có sẵn'}
            </span>
          </div>
        );

      case 'id':
        return (
          <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748B' }} title={p.id}>
            {p.id}
          </div>
        );

      case 'fingerprint':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
              {p.browser || 'Chrome 128'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
              {p.cores || 8}C • {p.ram || 16}GB • {p.resolution || '1920x1080'}
            </div>
          </div>
        );

      default:
        return <div>—</div>;
    }
  };

  return (
    <div style={{ minWidth: `${tableMinWidth}px`, position: 'relative' }}>
      {/* ── TABLE HEADER ── */}
      <div
        data-no-drag="true"
        style={{
          display: 'grid',
          gridTemplateColumns: gridTemplate,
          alignItems: 'center',
          height: '42px',
          padding: '0 24px',
          backgroundColor: 'var(--apidog-bg)',
          borderBottom: '1px solid var(--apidog-border)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--apidog-text-muted)',
          position: 'sticky',
          top: 0,
          zIndex: 25,
          boxSizing: 'border-box'
        }}
      >
        {/* Col 0: Checkbox */}
        <div>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--apidog-purple)' }}
          />
        </div>

        {/* Col 1: Title & Sort indicator matching screenshot */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '14px' }}>
          <span>Title</span>
          {setSortBy && (
            <button
              onClick={() => {
                setSortBy(prev => prev === 'latest' ? 'oldest' : prev === 'oldest' ? 'name-asc' : 'latest');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#3B82F6',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontWeight: 500,
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              title="Nhấn để đổi cách sắp xếp"
            >
              <span>Sort by {sortBy === 'oldest' ? 'Oldest ↑' : sortBy === 'name-asc' ? 'Name A-Z' : 'Created ↓'}</span>
            </button>
          )}
        </div>

        {/* Dynamic Column Headers */}
        {visibleColumns.map((col) => (
          <div
            key={col.id}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              paddingRight: '8px'
            }}
          >
            {col.label}
          </div>
        ))}

        {/* (+) Icon Trigger Column Header matching screenshot */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsColumnMenuOpen(prev => !prev);
            }}
            title="Thêm hoặc ẩn cột (Columns)"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: isColumnMenuOpen ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
              backgroundColor: isColumnMenuOpen ? '#EFF6FF' : '#FFFFFF',
              color: isColumnMenuOpen ? '#2563EB' : '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2563EB';
              e.currentTarget.style.borderColor = '#93C5FD';
              e.currentTarget.style.backgroundColor = '#EFF6FF';
            }}
            onMouseLeave={(e) => {
              if (!isColumnMenuOpen) {
                e.currentTarget.style.color = '#64748B';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }
            }}
          >
            <PlusCircle size={15} />
          </button>

          {/* Column Visibility Customizer Popover */}
          <ColumnVisibilityPopover
            isOpen={isColumnMenuOpen}
            onClose={() => setIsColumnMenuOpen(false)}
            columns={columns}
            onSaveColumns={(updated) => setColumns(updated)}
          />
        </div>

        {/* Khởi chạy Header */}
        <div style={{ textAlign: 'center' }}>Khởi Chạy</div>

        {/* Thao tác Header */}
        <div style={{ textAlign: 'right' }}>Thao Tác</div>
      </div>

      {/* ── TABLE BODY ── */}
      <div>
        {/* Sticky Pinned Running Row */}
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
                gridTemplateColumns: gridTemplate,
                alignItems: 'center',
                padding: '12px 24px',
                borderBottom: '1px solid var(--apidog-border-light)',
                fontSize: '12.5px',
                backgroundColor: isSelected
                  ? 'var(--apidog-purple-light)'
                  : (isRunning
                    ? 'rgba(16, 185, 129, 0.08)'
                    : (index % 2 === 1 ? 'var(--apidog-bg)' : 'var(--apidog-card-bg)')),
                boxShadow: isSelected ? 'inset 0 0 0 1.5px var(--apidog-purple)' : 'none',
                transition: 'background-color 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!isRunning && !isSelected) e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)';
              }}
              onMouseLeave={(e) => {
                if (!isRunning && !isSelected) e.currentTarget.style.backgroundColor = index % 2 === 1 ? 'var(--apidog-bg)' : 'var(--apidog-card-bg)';
              }}
            >
              {/* Col 0: Checkbox */}
              <div>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelect(p.id)}
                  style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: 'var(--apidog-purple)' }}
                />
              </div>

              {/* Col 1: Title & OS & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', paddingRight: '12px' }}>
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
                      color: 'var(--apidog-text-main)',
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
                  </div>
                </div>
              </div>

              {/* Dynamic Column Data Cells */}
              {visibleColumns.map((col) => (
                <div key={col.id} style={{ overflow: 'hidden', paddingRight: '8px' }}>
                  {renderColumnCell(p, col.id, isRunning)}
                </div>
              ))}

              {/* Empty cell matching (+) column space */}
              <div />

              {/* Play/Stop Launch Button */}
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
