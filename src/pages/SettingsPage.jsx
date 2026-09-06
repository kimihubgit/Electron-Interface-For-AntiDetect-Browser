import React, { useState } from 'react';
import { Settings, Cpu, HardDrive, Shield, Check, RefreshCw, Rocket, Sparkles } from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function SettingsPage() {
  const { currentPlan, setActiveUpgradeModal } = useBrowser();
  const [chromiumPath, setChromiumPath] = useState('C:\\Program Files\\Chromium\\chrome.exe');
  const [autoSyncCookie, setAutoSyncCookie] = useState(true);
  const [cloudBackup, setCloudBackup] = useState(false);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Cài Đặt Hệ Thống & Lõi Chromium</h2>
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', margin: 0 }}>
          Cấu hình đường dẫn binary Chromium, tùy chọn lưu trữ profile cục bộ và bảo mật
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        maxWidth: '720px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
            Đường Dẫn Chromium Core Executable
          </label>
          <input
            type="text"
            value={chromiumPath}
            onChange={(e) => setChromiumPath(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#F9FAFB',
              border: '1px solid #D1D5DB',
              borderRadius: 'var(--radius-sm)',
              color: '#111827',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827', display: 'block' }}>Tự Động Lưu Cookie & Session</span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Lưu lại trạng thái đăng nhập tài khoản sau khi tắt trình duyệt</span>
          </div>
          <input
            type="checkbox"
            checked={autoSyncCookie}
            onChange={(e) => setAutoSyncCookie(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827', display: 'block' }}>Mã Hóa Hồ Sơ Cục Bộ (AES-256)</span>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Mã hóa mật khẩu và proxy lưu trữ trên ổ cứng</span>
          </div>
          <input
            type="checkbox"
            defaultChecked={true}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>
      </div>

      {/* Gói Bản Quyền & Giấy Phép */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        maxWidth: '720px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--apidog-purple)' }} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: '#111827' }}>Gói Bản Quyền Hiện Tại</span>
            </div>
            <span style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', display: 'block' }}>
              Trạng thái: <strong style={{ color: 'var(--apidog-purple)' }}>{currentPlan || 'Gói Dùng Thử (Trial)'}</strong>
            </span>
          </div>
          <button
            onClick={() => setActiveUpgradeModal(true)}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontWeight: 600 }}
          >
            <Rocket size={14} /> Nâng Cấp Bản Quyền
          </button>
        </div>
      </div>
    </div>
  );
}
