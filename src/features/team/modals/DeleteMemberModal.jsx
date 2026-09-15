import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteMemberModal({
  member,
  onClose,
  onConfirm
}) {
  if (!member) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '360px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trash2 size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A', fontWeight: 700 }}>
              Xóa thành viên
            </h4>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Thao tác này không thể hoàn tác
            </span>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.45' }}>
          Bạn có chắc chắn muốn xóa thành viên <strong>{member.name}</strong> ({member.email}) khỏi tổ chức?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 14px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 500,
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
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Xóa ngay
          </button>
        </div>
      </div>
    </div>
  );
}
