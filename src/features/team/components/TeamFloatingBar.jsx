import React from 'react';
import { Lock, Trash2 } from 'lucide-react';

export default function TeamFloatingBar({
  selectedCount,
  onLockSelected,
  onDeleteSelected,
  onClearSelection
}) {
  if (selectedCount === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderRadius: '10px',
        padding: '8px 16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED' }} />
        <span>
          Đã chọn <strong>{selectedCount}</strong> thành viên
        </span>
      </div>

      <div style={{ height: '14px', width: '1px', backgroundColor: '#334155' }} />

      {/* Action: Lock selected */}
      <button
        onClick={onLockSelected}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#FDE68A',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        <Lock size={13} />
        <span>Khóa tài khoản</span>
      </button>

      {/* Action: Delete selected */}
      <button
        onClick={onDeleteSelected}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: '#FCA5A5',
          fontSize: '12px',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        <Trash2 size={13} />
        <span>Xóa đã chọn</span>
      </button>

      {/* Clear selection */}
      <button
        onClick={onClearSelection}
        style={{
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: '#334155',
          border: 'none',
          color: '#CBD5E1',
          fontSize: '11px',
          cursor: 'pointer'
        }}
      >
        Bỏ chọn
      </button>
    </div>
  );
}
