import React from 'react';
import { RotateCw } from 'lucide-react';

export default function RotatingProxiesTab({
  rotatingProxies = [],
  triggerRotateProxy,
  deleteRotatingProxy
}) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
          Quản Lý Proxy Xoay (Rotating Proxy API)
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
          Cấu hình link API đổi IP tự động của các nhà cung cấp (TMProxy, TinProxy, ProxyNo1, v.v.). Hỗ trợ đếm ngược cooldown và kích hoạt đổi IP tức thì cho profile.
        </p>
      </div>

      {rotatingProxies.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
          <RotateCw size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Chưa có cấu hình Proxy Xoay nào</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Nhấn nút "+ Thêm Proxy Xoay" ở góc trên để cấu hình API đổi IP.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
          {rotatingProxies.map((rot) => (
            <div
              key={rot.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  {rot.name}
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#EDE9FE',
                    color: 'var(--apidog-purple)',
                    fontWeight: 600
                  }}
                >
                  {rot.provider || 'API Gateway'}
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ color: '#94A3B8' }}>IP hiện tại:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#059669' }}>{rot.currentIp || '14.162.88.12'}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ color: '#94A3B8' }}>Lần đổi cuối:</span>
                  <span>{rot.lastRotated || 'Vừa xong'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>Thời gian chờ (Cooldown):</span>
                  <span>{rot.cooldown || 60} giây</span>
                </div>
              </div>

              <div
                style={{
                  padding: '6px 8px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '4px',
                  border: '1px solid #E2E8F0',
                  fontSize: '11px',
                  color: '#64748B',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '10px'
                }}
                title={rot.rotateUrl}
              >
                {rot.rotateUrl || 'https://api.tmproxy.com/api/proxy/change-ip'}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => triggerRotateProxy(rot.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--apidog-purple)',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCw size={12} />
                  <span>Xoay IP ngay</span>
                </button>

                <button
                  onClick={() => deleteRotatingProxy(rot.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    padding: '4px 6px'
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
