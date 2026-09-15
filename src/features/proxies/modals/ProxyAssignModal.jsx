import React from 'react';
import { X } from 'lucide-react';

export default function ProxyAssignModal({
  proxy,
  onClose,
  profiles = [],
  selectedTargetProfileId,
  setSelectedTargetProfileId,
  onAssign
}) {
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
          width: '440px',
          maxWidth: '92vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
            Gán Proxy Vào Hồ Sơ Trình Duyệt
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '16px 18px' }}>
          <div style={{ padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '4px', border: '1px solid #E2E8F0', marginBottom: '14px', fontSize: '12px' }}>
            <div style={{ color: '#64748B', fontSize: '11px' }}>Proxy được chọn:</div>
            <strong style={{ fontFamily: 'monospace', color: 'var(--apidog-purple)' }}>
              {proxy.type}://{proxy.host}:{proxy.port}
            </strong>
          </div>

          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
            Chọn Hồ Sơ Profile muốn gán:
          </label>
          <select
            value={selectedTargetProfileId}
            onChange={(e) => setSelectedTargetProfileId(e.target.value)}
            style={{
              width: '100%',
              height: '34px',
              padding: '0 10px',
              borderRadius: '4px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              backgroundColor: '#FFFFFF',
              marginBottom: '16px'
            }}
          >
            <option value="">-- Chọn hồ sơ profile --</option>
            {profiles.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.title || prof.name} (Nhóm: {prof.group || 'Chung'})
              </option>
            ))}
          </select>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '6px 14px', borderRadius: '4px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '12px', cursor: 'pointer' }}
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={!selectedTargetProfileId}
              onClick={onAssign}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: selectedTargetProfileId ? 'var(--apidog-purple)' : '#CBD5E1',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: selectedTargetProfileId ? 'pointer' : 'not-allowed'
              }}
            >
              Xác nhận gán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
