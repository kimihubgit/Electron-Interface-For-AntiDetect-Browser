import React from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function CoreSecuritySection({
  chromiumPath,
  setChromiumPath,
  encryptLocalStorage,
  setEncryptLocalStorage
}) {
  return (
    <div id="setting-section-core">
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#4B5563',
        letterSpacing: '0.5px',
        marginBottom: '8px'
      }}>
        LÕI CHROMIUM VÀ BẢO MẬT HỆ THỐNG
      </div>

      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
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
              borderRadius: '6px',
              color: '#111827',
              fontSize: '12px',
              fontFamily: 'Consolas, monospace',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #F3F4F6' }}>
          <div>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#111827', display: 'block' }}>
              Mã Hóa Hồ Sơ Cục Bộ (AES-256)
            </span>
            <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
              Mã hóa an toàn mật khẩu và proxy lưu trữ trên ổ đĩa cứng
            </span>
          </div>
          <ToggleSwitch checked={encryptLocalStorage} onChange={setEncryptLocalStorage} />
        </div>
      </div>
    </div>
  );
}
