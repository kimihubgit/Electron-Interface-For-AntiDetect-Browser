import React from 'react';
import { FolderPlus, Folder, X } from 'lucide-react';

/**
 * Modal dialog to transfer selected profiles to another group
 */
export default function MoveGroupModal({
  isOpen,
  onClose,
  selectedCount,
  allGroups,
  targetGroup,
  setTargetGroup,
  customGroupInput,
  setCustomGroupInput,
  onConfirm
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '440px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderPlus size={18} style={{ color: 'var(--apidog-purple)' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
              Chuyển nhóm ({selectedCount} hồ sơ)
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px' }}>
          <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
            Chọn nhóm đích để di chuyển {selectedCount} hồ sơ đã chọn:
          </div>

          {/* Group choices */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '16px',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {allGroups.map((grp) => {
              const isSelected = targetGroup === grp && !customGroupInput;
              return (
                <div
                  key={grp}
                  onClick={() => {
                    setTargetGroup(grp);
                    setCustomGroupInput('');
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: isSelected ? '1.5px solid var(--apidog-purple)' : '1px solid #E2E8F0',
                    backgroundColor: isSelected ? '#F5F3FF' : '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <Folder size={14} style={{ color: isSelected ? 'var(--apidog-purple)' : '#64748B' }} />
                  <span style={{
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? 'var(--apidog-purple)' : '#1E293B',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {grp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Or create new group */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Hoặc tạo nhóm mới:
            </div>
            <input
              type="text"
              placeholder="Nhập tên nhóm mới..."
              value={customGroupInput}
              onChange={(e) => setCustomGroupInput(e.target.value)}
              style={{
                width: '100%',
                height: '34px',
                padding: '0 12px',
                borderRadius: '6px',
                border: customGroupInput ? '1.5px solid var(--apidog-purple)' : '1px solid #CBD5E1',
                fontSize: '12.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px',
          backgroundColor: '#F8FAFC'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '7px 16px',
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
            Xác nhận chuyển
          </button>
        </div>
      </div>
    </div>
  );
}
