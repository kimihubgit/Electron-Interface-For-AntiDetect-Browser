import React from 'react';
import { Trash2 } from 'lucide-react';
import { useModalShortcuts } from '../../../hooks/useModalShortcuts';

export default function ProxyDeleteConfirmModal({
  deleteConfirm,
  onClose,
  onConfirm
}) {
  useModalShortcuts(!!deleteConfirm, onClose);

  if (!deleteConfirm) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '380px',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          padding: '18px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '4px',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626'
            }}
          >
            <Trash2 size={16} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            {deleteConfirm.type === 'die' ? 'Xác nhận xóa Proxy Die' : 'Xác nhận xóa Proxy'}
          </span>
        </div>

        <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5', margin: '0 0 16px 0' }}>
          {deleteConfirm.type === 'single'
            ? `Bạn có chắc chắn muốn xóa proxy "${deleteConfirm.proxy?.host}:${deleteConfirm.proxy?.port}" khỏi danh sách?`
            : deleteConfirm.type === 'die'
            ? `Bạn có chắc chắn muốn xóa toàn bộ ${deleteConfirm.count} proxy bị lỗi / Die khỏi kho không? Thao tác này không thể hoàn tác.`
            : `Bạn có chắc chắn muốn xóa ${deleteConfirm.count} proxy đã chọn khỏi danh sách?`}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
