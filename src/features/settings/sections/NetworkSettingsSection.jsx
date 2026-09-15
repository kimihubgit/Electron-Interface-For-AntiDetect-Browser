import React from 'react';
import SettingSwitchItem from '../components/SettingSwitchItem';

export default function NetworkSettingsSection({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {t('settings.cardNetSecurity', 'Cấu Hình Mạng & Chống Rò Rỉ DNS')}
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
          {t('settings.cardNetSecurityDesc', 'Bảo vệ lưu lượng mạng, ngăn chặn rò rỉ WebRTC và IP gốc qua DNS')}
        </p>
      </div>
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <SettingSwitchItem
          label="WebRTC Disable Non-Proxied UDP"
          subtitle="Vô hiệu hóa WebRTC qua UDP trực tiếp, chống lộ IP mạng thật"
          checked={true}
          onChange={() => {}}
        />
        <SettingSwitchItem
          label="DNS Leak Protection (DoH)"
          subtitle="Mã hóa truy vấn DNS qua giao thức HTTPS bảo mật"
          checked={true}
          onChange={() => {}}
        />
        <SettingSwitchItem
          label="Proxy Fallback Block"
          subtitle="Chặn hoàn toàn kết nối trực tiếp nếu Proxy bị mất kết nối"
          checked={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
