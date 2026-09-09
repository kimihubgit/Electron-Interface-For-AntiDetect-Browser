import React from 'react';
import ToggleSwitch from './ToggleSwitch';

export default function BrowserSessionsSection({
  clearCacheOnClose,
  setClearCacheOnClose,
  saveSessionOnClose,
  setSaveSessionOnClose,
  autoSavePassword,
  setAutoSavePassword,
  headlessMode,
  setHeadlessMode,
  disableGpu,
  setDisableGpu,
  disableExtensions,
  setDisableExtensions,
  enableTranslate,
  setEnableTranslate
}) {
  return (
    <div id="setting-section-browser">
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#4B5563',
        letterSpacing: '0.5px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <span>MỌI PHIÊN</span>
        <span style={{
          backgroundColor: '#2563EB',
          color: '#FFFFFF',
          padding: '1px 5px',
          borderRadius: '3px',
          fontSize: '11px',
          fontWeight: 800
        }}>
          TRÌNH
        </span>
        <span>DUYỆT</span>
      </div>

      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}>
        {/* Item: Xóa cache khi đóng Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Xóa cache khi đóng Profile
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Giải phóng dung lượng, và đăng xuất hồ sơ khỏi những trang giữ đăng nhập bằng cache.
            </div>
          </div>
          <ToggleSwitch checked={clearCacheOnClose} onChange={setClearCacheOnClose} />
        </div>

        {/* Item: Lưu phiên khi đóng Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Lưu phiên khi đóng Profile
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Các tab đang mở sẽ quay lại ở lần mở hồ sơ kế tiếp.
            </div>
          </div>
          <ToggleSwitch checked={saveSessionOnClose} onChange={setSaveSessionOnClose} />
        </div>

        {/* Item: Profile tự lưu mật khẩu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Profile tự lưu mật khẩu
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Tự lưu password, không hiện thông báo
            </div>
          </div>
          <ToggleSwitch checked={autoSavePassword} onChange={setAutoSavePassword} />
        </div>

        {/* Item: Headless */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Headless
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Chạy profile mà không hiện giao diện
            </div>
          </div>
          <ToggleSwitch checked={headlessMode} onChange={setHeadlessMode} />
        </div>

        {/* Item: Disable GPU */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Disable GPU
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Thêm --disable-gpu khi mở browser
            </div>
          </div>
          <ToggleSwitch checked={disableGpu} onChange={setDisableGpu} />
        </div>

        {/* Item: Disable Extensions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid #F3F4F6'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Disable Extensions
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Thêm --disable-extensions khi mở browser
            </div>
          </div>
          <ToggleSwitch checked={disableExtensions} onChange={setDisableExtensions} />
        </div>

        {/* Item: Bật Google Dịch */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Bật Google Dịch
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Click chuột phải để dịch toàn trang bằng Google
            </div>
          </div>
          <ToggleSwitch checked={enableTranslate} onChange={setEnableTranslate} />
        </div>
      </div>
    </div>
  );
}
