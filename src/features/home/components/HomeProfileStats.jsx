import React from 'react';
import { Globe, Play, Monitor, Shield } from 'lucide-react';

export default function HomeProfileStats({
  totalCount,
  runningCount,
  idleCount,
  proxyCount,
  onNavigateTab,
  t
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}
    >
      {/* Stat 1: Total Profiles */}
      <div
        onClick={() => onNavigateTab('profiles')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '14px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--apidog-purple)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div>
          <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {t('home.statTotal', 'Tổng Profile')}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
            {totalCount}
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#F5F3FF',
            color: 'var(--apidog-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Globe size={19} />
        </div>
      </div>

      {/* Stat 2: Running Profiles */}
      <div
        onClick={() => onNavigateTab('profiles')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '14px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#10B981';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div>
          <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
            {t('home.statRunning', 'Đang hoạt động')}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#065F46', marginTop: '2px' }}>
            {runningCount}
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Play size={18} style={{ fill: '#16A34A' }} />
        </div>
      </div>

      {/* Stat 3: Idle Profiles */}
      <div
        onClick={() => onNavigateTab('profiles')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '14px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#94A3B8';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div>
          <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {t('home.statIdle', 'Sẵn sàng (Idle)')}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
            {idleCount}
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Monitor size={18} />
        </div>
      </div>

      {/* Stat 4: Configured Proxies */}
      <div
        onClick={() => onNavigateTab('proxies')}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          padding: '14px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2563EB';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#E2E8F0';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div>
          <div style={{ fontSize: '11.5px', color: '#1D4ED8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {t('home.statProxy', 'Proxy Đã gán')}
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#1E3A8A', marginTop: '2px' }}>
            {proxyCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>/ {totalCount}</span>
          </div>
        </div>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Shield size={18} />
        </div>
      </div>
    </div>
  );
}
