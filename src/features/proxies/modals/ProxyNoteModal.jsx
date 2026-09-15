import React from 'react';
import { X, FileText } from 'lucide-react';
import { useModalShortcuts } from '../../../hooks/useModalShortcuts';

export default function ProxyNoteModal({
  proxy,
  onClose,
  noteInputText,
  setNoteInputText,
  onSave
}) {
  useModalShortcuts(!!proxy, onClose);

  if (!proxy) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
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
          width: '400px',
          maxWidth: '92vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          padding: '18px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '4px',
                backgroundColor: '#EDE9FE',
                color: 'var(--apidog-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={15} />
            </div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Ghi chú Proxy</h4>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px' }}>
          Proxy:{' '}
          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>
            {(proxy.type || 'socks5').toLowerCase()}://{proxy.host}:{proxy.port}
          </span>
        </div>

        <textarea
          rows={3}
          value={noteInputText}
          onChange={(e) => setNoteInputText(e.target.value)}
          placeholder="Nhập ghi chú hoặc tên gợi nhớ cho proxy..."
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #CBD5E1',
            fontSize: '13px',
            boxSizing: 'border-box',
            outline: 'none',
            resize: 'none',
            marginBottom: '16px'
          }}
          autoFocus
        />

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
            onClick={onSave}
            style={{
              padding: '6px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  );
}
