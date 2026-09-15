import React from 'react';
import { X } from 'lucide-react';

export default function AddDcomModal({
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
          width: '420px',
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
            Kết Nối Thiết Bị DCOM 4G Mới
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Tên thiết bị
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Cổng COM (Serial)
              </label>
              <input
                type="text"
                value={formData.comPort}
                onChange={(e) => setFormData({ ...formData, comPort: e.target.value })}
                placeholder="COM3"
                style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                Local Port chuyển tiếp
              </label>
              <input
                type="number"
                value={formData.localPort}
                onChange={(e) => setFormData({ ...formData, localPort: Number(e.target.value) })}
                style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Nhà mạng Sim
            </label>
            <input
              type="text"
              value={formData.carrier}
              onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
              placeholder="Viettel 4G / Vinaphone / Mobifone"
              style={{ width: '100%', height: '34px', padding: '0 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px', outline: 'none' }}
            />
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
            Kết nối
          </button>
        </div>
      </div>
    </div>
  );
}
