import React, { useState } from 'react';
import { Shield, Plus, RefreshCw, Trash2, CheckCircle2, AlertCircle, Activity, Globe } from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function ProxiesPage() {
  const { proxies, deleteProxy, setActiveProxyModal } = useBrowser();
  const [testingId, setTestingId] = useState(null);

  const handleTestPing = (id) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
    }, 800);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Quản Lý Proxy Pool</h2>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', margin: 0 }}>
            Kiểm tra trạng thái Live/Die, tốc độ kết nối (Ping) và vị trí địa lý của Proxy
          </p>
        </div>
        <button onClick={() => setActiveProxyModal(true)} className="btn btn-primary" style={{ padding: '8px 16px', fontWeight: 600 }}>
          <Plus size={16} /> Thêm Proxy Mới
        </button>
      </div>

      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '12px', fontWeight: 600 }}>
              <th style={{ padding: '12px 16px' }}>Loại Proxy</th>
              <th style={{ padding: '12px 16px' }}>Host / IP & Port</th>
              <th style={{ padding: '12px 16px' }}>Quốc Gia</th>
              <th style={{ padding: '12px 16px' }}>Trạng Thái & Ping</th>
              <th style={{ padding: '12px 16px' }}>Số Profile Đang Dùng</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {proxies.map(px => (
              <tr key={px.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge badge-purple">{px.type}</span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#111827' }}>
                  {px.host}:{px.port}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#374151' }}>
                    <Globe size={14} style={{ color: 'var(--apidog-purple)' }} /> {px.country}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> Live ({px.latency}ms)
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#6B7280' }}>
                  {px.usedCount} profile
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button onClick={() => handleTestPing(px.id)} className="btn-icon" title="Check ping">
                      <RefreshCw size={14} className={testingId === px.id ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={() => deleteProxy(px.id)} className="btn-icon" style={{ color: '#DC2626' }} title="Xóa">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
