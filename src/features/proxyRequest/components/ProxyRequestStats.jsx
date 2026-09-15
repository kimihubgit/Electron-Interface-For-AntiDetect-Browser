import React from 'react';
import { Zap, ArrowRightLeft, Ban, Activity, CheckCircle2, Shield } from 'lucide-react';

export default function ProxyRequestStats({
  savedGb,
  usedProxyMb,
  blockedMb,
  savingPercentage
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 4 KPI STATS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* Card 1: Tiết kiệm đi thẳng DIRECT */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Tiết Kiệm Đi Thẳng (DIRECT)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', marginTop: '4px', fontFamily: 'monospace' }}>
              {savedGb} <span style={{ fontSize: '14px', fontWeight: 600 }}>GB</span>
            </div>
            <div style={{ fontSize: '11px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
              <CheckCircle2 size={12} /> Bỏ qua video CDN, không tốn proxy
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} />
          </div>
        </div>

        {/* Card 2: Dùng qua PROXY */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Lưu Lượng Dùng Qua PROXY</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#2563EB', marginTop: '4px', fontFamily: 'monospace' }}>
              {usedProxyMb} <span style={{ fontSize: '14px', fontWeight: 600 }}>MB</span>
            </div>
            <div style={{ fontSize: '11px', color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}>
              <Shield size={12} /> Dành riêng cho API bảo mật tài khoản
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={22} />
          </div>
        </div>

        {/* Card 3: Đã Chặn BLOCKED */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Lưu Lượng Đã Chặn (BLOCKED)</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginTop: '4px', fontFamily: 'monospace' }}>
              {blockedMb} <span style={{ fontSize: '14px', fontWeight: 600 }}>MB</span>
            </div>
            <div style={{ fontSize: '11px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 500 }}>
              <Ban size={12} /> Chặn telemetry, theo dõi & quảng cáo
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ban size={22} />
          </div>
        </div>

        {/* Card 4: Tỉ lệ tiết kiệm */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Tỉ Lệ Tiết Kiệm Băng Thông</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#7C3AED', marginTop: '4px', fontFamily: 'monospace' }}>
              {savingPercentage}%
            </div>
            <div style={{ fontSize: '11px', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: 600 }}>
              ⚡ Tối ưu chi phí proxy vượt trội
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={22} />
          </div>
        </div>
      </div>

      {/* Multi-segment Bandwidth Distribution Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4B5563' }}>
          <span style={{ fontWeight: 600 }}>Biểu Đồ Phân Phối Băng Thông Thực Tế:</span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11.5px' }}>
            <span style={{ color: '#059669', fontWeight: 600 }}>● DIRECT ({savedGb} GB)</span>
            <span style={{ color: '#2563EB', fontWeight: 600 }}>● PROXY ({usedProxyMb} MB)</span>
            <span style={{ color: '#DC2626', fontWeight: 600 }}>● BLOCKED ({blockedMb} MB)</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '10px', borderRadius: '6px', overflow: 'hidden', display: 'flex', backgroundColor: '#F3F4F6' }}>
          <div style={{ width: `${savingPercentage}%`, backgroundColor: '#10B981', transition: 'width 0.4s ease' }} title={`Đi thẳng DIRECT: ${savingPercentage}%`} />
          <div style={{ width: `${(100 - savingPercentage) * 0.75}%`, backgroundColor: '#3B82F6', transition: 'width 0.4s ease' }} title="Dùng qua PROXY" />
          <div style={{ width: `${(100 - savingPercentage) * 0.25}%`, backgroundColor: '#EF4444', transition: 'width 0.4s ease' }} title="Đã Chặn" />
        </div>
      </div>
    </div>
  );
}
