import React from 'react';
import { X } from 'lucide-react';

export default function AddRotatingProxyModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit
}) {
  if (!isOpen) return null;

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
          width: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          padding: '18px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
            Thêm Cấu Hình Proxy Xoay (API)
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Tên cấu hình
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="vd: TMProxy VN 4G Fast"
              style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Đường dẫn API đổi IP (Rotate API Key / URL)
            </label>
            <input
              type="text"
              value={formData.rotateUrl}
              onChange={(e) => setFormData({ ...formData, rotateUrl: e.target.value })}
              placeholder="https://api.tmproxy.com/api/proxy/get-new-proxy?api_key=..."
              style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Nhà cung cấp
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="TMProxy / TinProxy / ProxyNo1"
                style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Cooldown (giây)
              </label>
              <input
                type="number"
                value={formData.cooldown}
                onChange={(e) => setFormData({ ...formData, cooldown: Number(e.target.value) })}
                style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

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
            onClick={onSubmit}
            style={{ padding: '6px 16px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--apidog-purple)', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            Thêm cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}
