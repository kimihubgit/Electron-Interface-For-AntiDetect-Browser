import React from 'react';
import { CloudUpload, Play } from 'lucide-react';

export default function BackupHeader({ configuredCount, totalCount, onStartBackup }) {
  return (
    <div style={{
      padding: '16px 24px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <CloudUpload size={18} />
          </div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
            Sao lưu & Đồng bộ Đám mây (Cloud Backup & Sync)
          </h1>
          <span style={{
            fontSize: '11.5px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: '#EDE9FE',
            color: 'var(--apidog-purple)'
          }}>
            {configuredCount}/{totalCount} Nền tảng đã kết nối
          </span>
        </div>
        <p style={{ margin: '4px 0 0 42px', fontSize: '12.5px', color: '#64748B' }}>
          Hỗ trợ sao lưu an toàn hồ sơ, proxy và cấu hình lên Cloudflare R2, Google Drive, AWS S3, Wasabi, DigitalOcean, BizflyCloud VN, Cloudfly VN, MinIO và Telegram.
        </p>
      </div>

      {/* Top Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onStartBackup}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '34px',
            padding: '0 14px',
            borderRadius: '7px',
            border: 'none',
            backgroundColor: 'var(--apidog-purple)',
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple)'}
        >
          <Play size={13} fill="#FFFFFF" />
          <span>Sao lưu ngay</span>
        </button>
      </div>
    </div>
  );
}
