import React from 'react';
import SettingSwitchItem from '../components/SettingSwitchItem';

export default function FingerprintSettingsSection({ t }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          {t('settings.cardFpEngine', 'Cấu Hình Vân Tay Fingerprint & WebGL')}
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
          {t('settings.cardFpEngineDesc', 'Tùy biến thuật toán che giấu Canvas, AudioContext, WebGL và ClientRects')}
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
          label="Canvas Noise Injection"
          subtitle="Thêm nhiễu ngẫu nhiên vào dữ liệu xuất điểm ảnh Canvas 2D"
          checked={true}
          onChange={() => {}}
        />
        <SettingSwitchItem
          label="WebGL Metadata Spoofing"
          subtitle="Tự động giả lập GPU Vendor và Renderer theo thiết bị thực tế"
          checked={true}
          onChange={() => {}}
        />
        <SettingSwitchItem
          label="AudioContext Fingerprint Protection"
          subtitle="Thêm nhiễu tần số âm thanh để tránh các trang web theo dõi qua Audio Buffer"
          checked={true}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
