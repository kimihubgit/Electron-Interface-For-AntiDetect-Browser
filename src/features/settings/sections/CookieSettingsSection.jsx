import React from 'react';
import SettingSwitchItem from '../components/SettingSwitchItem';

export default function CookieSettingsSection({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {t('settings.cardCookieExt', 'Kho Cookie & Tiện Ích Mở Rộng')}
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
          {t('settings.cardCookieExtDesc', 'Quản lý đồng bộ cookie phiên chạy và môi trường chạy tiện ích mở rộng')}
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
          label="Auto Export Cookies on Exit"
          subtitle="Tự động xuất tệp cookie JSON mỗi khi đóng hồ sơ trình duyệt"
          checked={false}
          onChange={() => {}}
        />
        <SettingSwitchItem
          label="Isolated Extension Sandbox"
          subtitle="Tách biệt dữ liệu các tiện ích giữa các hồ sơ khác nhau"
          checked={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
