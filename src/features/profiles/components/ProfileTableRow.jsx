import React, { memo } from 'react';
import { Play, Square, Edit3, MoreVertical, Trash2, RotateCw } from 'lucide-react';
import ProfileActionMenu from './ProfileActionMenu';

/**
 * Memoized ProfileTableRow
 * Only re-renders when this specific row's data, selection state, or running status changes.
 */
function ProfileTableRowComponent({
  profile: p,
  index,
  isSelected,
  isRunning,
  isStarting = false,
  isMenuOpen,
  gridTemplate,
  visibleColumns,
  renderColumnCell,
  handleToggleSelect,
  setActiveProfileModal,
  toggleLaunchProfile,
  setActiveMenuId,
  deleteProfile,
  saveProfile,
  cloneProfile,
  addLog,
  t
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplate,
        alignItems: 'center',
        padding: '9px 12px',
        borderBottom: '1px solid var(--apidog-border)',
        fontSize: '12.5px',
        backgroundColor: isRunning
          ? '#F0FDF4'
          : (isSelected
            ? 'var(--apidog-sidebar-active-bg)'
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


      {/* Play/Stop Launch Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button
          onClick={() => toggleLaunchProfile(p.id)}
          disabled={isStarting}
          title={isStarting ? (isRunning ? "Đang tắt hồ sơ..." : "Đang khởi chạy hồ sơ...") : (isRunning ? "Dừng hồ sơ" : "Khởi chạy hồ sơ")}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            border: isStarting 
              ? '1px solid #BFDBFE' 
              : (isRunning ? '1px solid #FECACA' : '1px solid #BBF7D0'),
            backgroundColor: isStarting 
              ? '#EFF6FF' 
              : (isRunning ? '#FEF2F2' : '#F0FDF4'),
            color: isStarting 
              ? '#2563EB' 
              : (isRunning ? '#DC2626' : '#15803D'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isStarting ? 'wait' : 'pointer',
            pointerEvents: isStarting ? 'none' : 'auto',
            transition: 'all 0.15s ease',
            padding: 0
          }}
          onMouseEnter={(e) => {
            if (isStarting) return;
            e.currentTarget.style.backgroundColor = isRunning ? '#FEE2E2' : '#DCFCE7';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            if (isStarting) return;
            e.currentTarget.style.backgroundColor = isRunning ? '#FEF2F2' : '#F0FDF4';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isStarting ? (
            <RotateCw size={12} className="spin" style={{ color: '#2563EB' }} />
          ) : isRunning ? (
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
              background: isMenuOpen ? '#EDE9FE' : 'none',
              border: 'none',
              padding: '6px',
              borderRadius: '5px',
              cursor: 'pointer',
              color: isMenuOpen ? 'var(--apidog-purple)' : '#475569',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isMenuOpen) {
                e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)';
                e.currentTarget.style.color = 'var(--apidog-text-main)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMenuOpen) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#475569';
              }
            }}
          >
            <MoreVertical size={14} />
          </button>

          {/* Render Action Menu when active */}
          {isMenuOpen && (
            <ProfileActionMenu
              profile={p}
              isRunning={isRunning}
              onClose={() => setActiveMenuId(null)}
              onToggleLaunch={() => toggleLaunchProfile(p.id)}
              onEdit={() => {
                setActiveMenuId(null);
                setActiveProfileModal(p);
              }}
              onDelete={() => {
                setActiveMenuId(null);
                deleteProfile(p.id);
              }}
              onClone={() => {
                setActiveMenuId(null);
                cloneProfile(p.id);
              }}
              onSave={saveProfile}
              addLog={addLog}
            />
          )}
        </div>

        {/* Direct Trash Delete Button */}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

export const ProfileTableRow = memo(ProfileTableRowComponent, (prev, next) => {
  return (
    prev.profile === next.profile &&
    prev.index === next.index &&
    prev.isSelected === next.isSelected &&
    prev.isRunning === next.isRunning &&
    prev.isStarting === next.isStarting &&
    prev.isMenuOpen === next.isMenuOpen &&
    prev.gridTemplate === next.gridTemplate &&
    prev.visibleColumns === next.visibleColumns
  );
});
export default ProfileTableRow;
