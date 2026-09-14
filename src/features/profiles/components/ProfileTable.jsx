import React, { useState, useMemo, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import PinnedRunningBar from './PinnedRunningBar';
import ProfileTableRow from './ProfileTableRow';
import ColumnVisibilityPopover, { getInitialColumns } from './ColumnVisibilityPopover';
import { getCountryFlag } from '../utils/profileUtils';
import { useTranslation } from '../../../i18n/I18nContext';

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
  const { t } = useTranslation();

  // Column configuration state
  const [columns, setColumns] = useState(getInitialColumns);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);

  // Visible columns in order
  const visibleColumns = useMemo(() => columns.filter(c => c.visible), [columns]);

  // CSS Grid template: Checkbox (44px) + Title (minmax(240px, 2fr)) + [dynamic columns] + Launch (70px) + Actions / (+) Header (96px)
  const gridTemplate = useMemo(() => {
    const dynamicColsStr = visibleColumns.map(c => c.flex || '1fr').join(' ');
    return `44px minmax(240px, 2fr) ${dynamicColsStr ? dynamicColsStr + ' ' : ''}70px 96px`;
  }, [visibleColumns]);

  // Min-width for entire table so that it never gets overly compressed
  const tableMinWidth = useMemo(() => {
    const colsTotalMin = visibleColumns.reduce((acc, c) => {
      const val = parseInt(c.minWidth || '120px', 10);
      return acc + (isNaN(val) ? 120 : val);
    }, 0);
    return Math.max(960, 44 + 240 + colsTotalMin + 70 + 96 + 48);
  }, [visibleColumns]);

  // Render individual cell content based on column ID
  const renderColumnCell = useCallback((p, colId, isRunning) => {
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
            {p.diskSize || p.cacheSize || (p.size && !p.size.includes('36.8') ? p.size : '0 KB')}
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
  }, []);

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
          <span>{t('profiles.colTitle', 'Title')}</span>
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
              <span>
                {t('profiles.sortBy', 'Sort by {type}', {
                  type: sortBy === 'oldest'
                    ? t('profiles.sortOldest', 'Oldest ↑')
                    : sortBy === 'name-asc'
                    ? t('profiles.sortNameAsc', 'Name A-Z')
                    : t('profiles.sortLatest', 'Created ↓')
                })}
              </span>
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
            {t(`profiles.col_${col.id}`, col.label)}
          </div>
        ))}

        {/* Khởi chạy Header */}
        <div style={{ textAlign: 'center' }}>{t('profiles.start', 'Khởi Chạy')}</div>

        {/* Nút 3 chấm đứng ẩn/hiện và tùy chỉnh cột đưa ra cuối cùng thay thế cho nút Thao Tác */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsColumnMenuOpen(prev => !prev);
            }}
            title={t('profiles.customizeColumnsTooltip', 'Tùy chỉnh cột hiển thị')}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
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
            <MoreVertical size={16} />
          </button>

          {/* Column Visibility Customizer Popover */}
          <ColumnVisibilityPopover
            isOpen={isColumnMenuOpen}
            onClose={() => setIsColumnMenuOpen(false)}
            columns={columns}
            onSaveColumns={(updated) => setColumns(updated)}
          />
        </div>
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

        {/* Profile Rows (Memoized ProfileTableRow to prevent full-table re-rendering) */}
        {filteredProfiles.map((p, index) => {
          const isRunning = p.status === 'running';
          const isSelected = selectedProfiles.includes(p.id);

          return (
            <ProfileTableRow
              key={p.id}
              profile={p}
              index={index}
              isSelected={isSelected}
              isRunning={isRunning}
              isMenuOpen={activeMenuId === p.id}
              gridTemplate={gridTemplate}
              visibleColumns={visibleColumns}
              renderColumnCell={renderColumnCell}
              handleToggleSelect={handleToggleSelect}
              setActiveProfileModal={setActiveProfileModal}
              toggleLaunchProfile={toggleLaunchProfile}
              setActiveMenuId={setActiveMenuId}
              deleteProfile={deleteProfile}
              saveProfile={saveProfile}
              cloneProfile={cloneProfile}
              addLog={addLog}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}
