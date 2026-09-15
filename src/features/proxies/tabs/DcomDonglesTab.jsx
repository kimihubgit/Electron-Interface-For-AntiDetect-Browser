import React from 'react';
import { Smartphone, RefreshCw } from 'lucide-react';

export default function DcomDonglesTab({
  dcomDevices = [],
  triggerDcomRotate,
  deleteDcomDevice
}) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
          Quản Lý Thiết Bị DCOM 4G/5G (Dongle USB)
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
          Kết nối USB 4G vật lý cắm trực tiếp vào máy tính. Hỗ trợ tự động chuyển chế độ máy bay (Airplane Mode toggle) để đổi dải IP WAN sạch từ nhà mạng.
        </p>
      </div>

      {dcomDevices.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#94A3B8' }}>
          <Smartphone size={36} style={{ opacity: 0.4, marginBottom: '8px' }} />
          <div style={{ fontSize: '13px', fontWeight: 600 }}>Chưa có thiết bị DCOM nào được kết nối</div>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>Cắm USB 4G vào cổng máy tính và nhấn "Kết nối DCOM mới".</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
          {dcomDevices.map((dcom) => (
            <div
              key={dcom.id}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                padding: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Smartphone size={16} style={{ color: '#2563EB' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                    {dcom.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    fontWeight: 600
                  }}
                >
                  Đã kết nối
                </span>
              </div>

              <div style={{ fontSize: '11.5px', color: '#475569', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ color: '#94A3B8' }}>Cổng COM / Local:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    {dcom.comPort} (127.0.0.1:{dcom.localPort || 20001})
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span style={{ color: '#94A3B8' }}>Nhà mạng:</span>
                  <span>{dcom.carrier || 'Viettel 4G LTE'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#94A3B8' }}>IP WAN nhà mạng:</span>
                  <strong style={{ fontFamily: 'monospace', color: '#2563EB' }}>
                    {dcom.wanIp || '171.244.18.92'}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => triggerDcomRotate(dcom.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={12} />
                  <span>Reset máy bay (Đổi IP)</span>
                </button>

                <button
                  onClick={() => deleteDcomDevice(dcom.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '11.5px',
                    cursor: 'pointer'
                  }}
                >
                  Ngắt kết nối
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
