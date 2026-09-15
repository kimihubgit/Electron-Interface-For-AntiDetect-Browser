import React from 'react';
import { Zap } from 'lucide-react';

export default function AddRuleModal({
  isOpen,
  onClose,
  newPattern,
  setNewPattern,
  newAction,
  setNewAction,
  newNotes,
  setNewNotes,
  onSubmit
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #E5E7EB',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#7C3AED" />
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#111827' }}>Thêm Quy Tắc Phân Luồng</h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              Mẫu URL / Pattern Wildcard
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: *.tiktokcdn.com/* hoặc tos-*-up.*"
              value={newPattern}
              onChange={(e) => setNewPattern(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontFamily: 'monospace', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              Tuyến Đường Phân Phối
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {[
                { id: 'DIRECT', label: 'DIRECT (Đi thẳng)', color: '#059669', bg: '#ECFDF5' },
                { id: 'PROXY', label: 'PROXY (Qua proxy)', color: '#2563EB', bg: '#EFF6FF' },
                { id: 'BLOCKED', label: 'BLOCKED (Chặn)', color: '#DC2626', bg: '#FEF2F2' }
              ].map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => setNewAction(act.id)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1.5px solid ${newAction === act.id ? act.color : '#E2E8F0'}`,
                    backgroundColor: newAction === act.id ? act.bg : '#FFFFFF',
                    color: newAction === act.id ? act.color : '#4B5563',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
              Ghi Chú Mục Đích
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Tiết kiệm băng thông tải video"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 600 }}>
              Tạo Quy Tắc
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
