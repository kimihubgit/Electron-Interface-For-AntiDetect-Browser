import React from 'react';
import { Server, CheckCircle2 } from 'lucide-react';

export default function ProxyInterceptorBar({
  localProxyPort,
  upstreamProxy,
  onApplyPreset
}) {
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12.5px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Server size={15} style={{ color: '#7C3AED' }} />
          <span style={{ color: '#475569' }}>Cổng Proxy Cục Bộ (Local Interceptor):</span>
          <span
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              color: '#0F172A',
              backgroundColor: '#FFFFFF',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #CBD5E1'
            }}
          >
            127.0.0.1:{localProxyPort}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#475569' }}>Proxy Đích (Upstream):</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563EB' }}>
            {upstreamProxy}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} /> SSL MITM Decryption: Sẵn Sàng
          </span>
        </div>
      </div>

      {/* Quick Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>Nạp nhanh quy tắc mẫu:</span>
        <button
          onClick={() => onApplyPreset('tiktok')}
          style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#0F172A' }}
        >
          + Mẫu TikTok
        </button>
        <button
          onClick={() => onApplyPreset('facebook')}
          style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#0F172A' }}
        >
          + Mẫu Facebook
        </button>
        <button
          onClick={() => onApplyPreset('block_trackers')}
          style={{ padding: '3px 8px', borderRadius: '5px', border: '1px solid #FCA5A5', background: '#FEF2F2', fontSize: '11px', fontWeight: 600, cursor: 'pointer', color: '#DC2626' }}
        >
          + Chặn Tracking
        </button>
      </div>
    </div>
  );
}
