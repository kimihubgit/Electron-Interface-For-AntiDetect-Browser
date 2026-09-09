import React, { useState } from 'react';
import {
  Crown,
  Save,
  Globe,
  Settings,
  Fingerprint,
  Shield,
  Cookie,
  Key,
  Sparkles,
  Rocket,
  FolderOpen
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function SettingsPage() {
  const {
    currentPlan,
    setActiveUpgradeModal,
    activeSettingsSection = 'browser',
    showToast,
    addLog
  } = useBrowser();

  // ══════════════════════════════════════════════════════════════
  // BROWSER SETTINGS (3-Column Layout from Screenshot)
  // ══════════════════════════════════════════════════════════════
  // Column 1 States
  const [urlStart, setUrlStart] = useState(() => localStorage.getItem('cfg_browser_url_start') || '');
  const [clearCookie, setClearCookie] = useState(() => localStorage.getItem('cfg_browser_clear_cookie') === 'true');
  const [loadImage, setLoadImage] = useState(() => localStorage.getItem('cfg_browser_load_image') !== 'false'); // default true
  const [restoreSession, setRestoreSession] = useState(() => localStorage.getItem('cfg_browser_restore_session') === 'true');
  const [bypassCloudflare, setBypassCloudflare] = useState(() => localStorage.getItem('cfg_browser_bypass_cloudflare') === 'true');
  const [stopWhenProxyDie, setStopWhenProxyDie] = useState(() => localStorage.getItem('cfg_browser_stop_proxy_die') === 'true');

  // Column 2 States
  const [chromeArgs, setChromeArgs] = useState(() => localStorage.getItem('cfg_browser_chrome_args') || '');
  const [allowGpu, setAllowGpu] = useState(() => localStorage.getItem('cfg_browser_allow_gpu') === 'true');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('cfg_browser_sound') !== 'false'); // default true
  const [headless, setHeadless] = useState(() => localStorage.getItem('cfg_browser_headless') === 'true');
  const [clearCache, setClearCache] = useState(() => localStorage.getItem('cfg_browser_clear_cache') === 'true');
  const [saveCookiesBeforeClose, setSaveCookiesBeforeClose] = useState(() => localStorage.getItem('cfg_browser_save_cookies') === 'true');

  // Column 3 States
  const [removeArgs, setRemoveArgs] = useState(() => localStorage.getItem('cfg_browser_remove_args') || '');
  const [allowExtensions, setAllowExtensions] = useState(() => localStorage.getItem('cfg_browser_allow_extensions') !== 'false'); // default true
  const [virtualMouse, setVirtualMouse] = useState(() => localStorage.getItem('cfg_browser_virtual_mouse') === 'true');
  const [openWithProxy, setOpenWithProxy] = useState(() => localStorage.getItem('cfg_browser_open_proxy') !== 'false'); // default true
  const [changeFingerprintOnClose, setChangeFingerprintOnClose] = useState(() => localStorage.getItem('cfg_browser_change_fp') === 'true');

  // General Settings States
  const [profileDataPath, setProfileDataPath] = useState(() => localStorage.getItem('cfg_profile_data_path') || 'C:\\AntidetectBrowser\\profiles');
  const [chromiumPath, setChromiumPath] = useState(() => localStorage.getItem('cfg_chromium_path') || 'C:\\Program Files\\Chromium\\chrome.exe');
  const [autoSyncCookie, setAutoSyncCookie] = useState(true);
  const [encryptLocalProfiles, setEncryptLocalProfiles] = useState(true);

  // Handle Save Browser Settings
  const handleSaveBrowserSettings = () => {
    localStorage.setItem('cfg_browser_url_start', urlStart);
    localStorage.setItem('cfg_browser_chrome_args', chromeArgs);
    localStorage.setItem('cfg_browser_remove_args', removeArgs);

    localStorage.setItem('cfg_browser_clear_cookie', String(clearCookie));
    localStorage.setItem('cfg_browser_load_image', String(loadImage));
    localStorage.setItem('cfg_browser_restore_session', String(restoreSession));
    localStorage.setItem('cfg_browser_bypass_cloudflare', String(bypassCloudflare));
    localStorage.setItem('cfg_browser_stop_proxy_die', String(stopWhenProxyDie));

    localStorage.setItem('cfg_browser_allow_gpu', String(allowGpu));
    localStorage.setItem('cfg_browser_sound', String(soundEnabled));
    localStorage.setItem('cfg_browser_headless', String(headless));
    localStorage.setItem('cfg_browser_clear_cache', String(clearCache));
    localStorage.setItem('cfg_browser_save_cookies', String(saveCookiesBeforeClose));

    localStorage.setItem('cfg_browser_allow_extensions', String(allowExtensions));
    localStorage.setItem('cfg_browser_virtual_mouse', String(virtualMouse));
    localStorage.setItem('cfg_browser_open_proxy', String(openWithProxy));
    localStorage.setItem('cfg_browser_change_fp', String(changeFingerprintOnClose));

    addLog?.('Đã lưu cấu hình trình duyệt Browser thành công!', 'success');
    if (showToast) showToast('Đã lưu cấu hình trình duyệt Browser thành công!', 'success');
  };

  // Reusable iOS-style Switch Item Component
  const SettingSwitchItem = ({ label, subtitle, checked, onChange, hasCrown = false }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Switch pill */}
          <div
            onClick={() => onChange(!checked)}
            style={{
              width: '38px',
              height: '21px',
              borderRadius: '12px',
              backgroundColor: checked ? '#3B82F6' : '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              cursor: 'pointer',
              transition: 'background-color 0.18s ease',
              flexShrink: 0,
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                width: '17px',
                height: '17px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transform: checked ? 'translateX(17px)' : 'translateX(0px)',
                transition: 'transform 0.18s ease'
              }}
            />
          </div>

          {/* Label + Crown if VIP */}
          <div
            onClick={() => onChange(!checked)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
              {label}
            </span>
            {hasCrown && (
              <Crown size={13} style={{ color: '#F59E0B' }} />
            )}
          </div>
        </div>

        {/* Subtitle description */}
        <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px', userSelect: 'none', lineHeight: '1.3' }}>
          {subtitle}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#F8FAFC',
      boxSizing: 'border-box'
    }}>
      {/* ========================================================= */}
      {/* 1. SECTION: BROWSER (3-COLUMN LAYOUT)                     */}
      {/* ========================================================= */}
      {(!activeSettingsSection || activeSettingsSection === 'browser') && (
        <>
          {/* Header */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cấu Hình Phiên Trình Duyệt (Browser Settings)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Cấu hình tham số khởi động, kiểm soát tài nguyên, cache/cookie và dấu vân tay cho mọi phiên profile
            </p>
          </div>

          {/* 3-Column Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px 28px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '36px',
              width: '100%'
            }}>
              {/* ── COLUMN 1 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Input: URL start */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    URL start:
                  </label>
                  <input
                    type="text"
                    value={urlStart}
                    onChange={(e) => setUrlStart(e.target.value)}
                    placeholder="Enter the URL you want when starting to open the profile..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Switches Column 1 */}
                <SettingSwitchItem
                  label="Clear cookie"
                  subtitle="Clear cookie when close browser"
                  checked={clearCookie}
                  onChange={setClearCookie}
                />

                <SettingSwitchItem
                  label="Image"
                  subtitle="Load images when open profiles"
                  checked={loadImage}
                  onChange={setLoadImage}
                />

                <SettingSwitchItem
                  label="Restore last session"
                  subtitle="Restore tabs from the previous session"
                  checked={restoreSession}
                  onChange={setRestoreSession}
                />

                <SettingSwitchItem
                  label="Bypass CloudFlare"
                  subtitle="Open profiles bypass cloudflare"
                  checked={bypassCloudflare}
                  onChange={setBypassCloudflare}
                />

                <SettingSwitchItem
                  label="Stop open when Proxy die"
                  subtitle="Prevent browser from opening if proxy die"
                  checked={stopWhenProxyDie}
                  onChange={setStopWhenProxyDie}
                />

                {/* Save Button under Column 1 */}
                <div style={{ paddingTop: '8px' }}>
                  <button
                    onClick={handleSaveBrowserSettings}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 24px',
                      borderRadius: '6px',
                      backgroundColor: '#3B82F6',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                </div>
              </div>

              {/* ── COLUMN 2 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Input: Chrome arguments */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Chrome arguments
                  </label>
                  <input
                    type="text"
                    value={chromeArgs}
                    onChange={(e) => setChromeArgs(e.target.value)}
                    placeholder="--argument1 --argument2"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Switches Column 2 */}
                <SettingSwitchItem
                  label="GPU"
                  subtitle="Allow GPU when opening browser"
                  checked={allowGpu}
                  onChange={setAllowGpu}
                />

                <SettingSwitchItem
                  label="Sound"
                  subtitle="Off/on audio when open browser"
                  checked={soundEnabled}
                  onChange={setSoundEnabled}
                />

                <SettingSwitchItem
                  label="Headless"
                  subtitle="Run profiles headless"
                  checked={headless}
                  onChange={setHeadless}
                />

                <SettingSwitchItem
                  label="Clear cache"
                  subtitle="Clear cache when close browser"
                  checked={clearCache}
                  onChange={setClearCache}
                />

                <SettingSwitchItem
                  label="Save profile cookies"
                  subtitle="Save profile cookies before close"
                  checked={saveCookiesBeforeClose}
                  onChange={setSaveCookiesBeforeClose}
                />
              </div>

              {/* ── COLUMN 3 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Input: Remove arguments */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Remove arguments
                  </label>
                  <input
                    type="text"
                    value={removeArgs}
                    onChange={(e) => setRemoveArgs(e.target.value)}
                    placeholder="--argument1 --argument2"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      fontSize: '12px',
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Switches Column 3 */}
                <SettingSwitchItem
                  label="Extensions"
                  subtitle="Allow extensions when open browser"
                  checked={allowExtensions}
                  onChange={setAllowExtensions}
                />

                <SettingSwitchItem
                  label="Virtual mouse"
                  subtitle="Show virtual mouse when open browser"
                  checked={virtualMouse}
                  onChange={setVirtualMouse}
                />

                <SettingSwitchItem
                  label="Proxy"
                  subtitle="Open profiles with proxy"
                  checked={openWithProxy}
                  onChange={setOpenWithProxy}
                />

                <SettingSwitchItem
                  label="Change fingerprint"
                  subtitle="Change fingerprint on close"
                  checked={changeFingerprintOnClose}
                  onChange={setChangeFingerprintOnClose}
                  hasCrown={true}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================= */}
      {/* 2. SECTION: GENERAL SETTINGS                              */}
      {/* ========================================================= */}
      {activeSettingsSection === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cài Đặt Chung Hệ Thống
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Đường dẫn lưu trữ hồ sơ cục bộ, tự động đồng bộ hóa và quản lý bản quyền
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Thư mục lưu trữ User Data Profiles
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={profileDataPath}
                  onChange={(e) => setProfileDataPath(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', fontFamily: 'monospace' }}
                />
                <button
                  onClick={() => alert(`📂 Thư mục profiles: ${profileDataPath}`)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', cursor: 'pointer' }}
                >
                  <FolderOpen size={15} />
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Đường dẫn Chromium Core Executable
              </label>
              <input
                type="text"
                value={chromiumPath}
                onChange={(e) => setChromiumPath(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '12px', fontFamily: 'monospace', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block' }}>Tự Động Lưu Cookie & Phiên Đăng Nhập</span>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Lưu trữ token và cookie sau khi đóng cửa sổ trình duyệt</span>
              </div>
              <input
                type="checkbox"
                checked={autoSyncCookie}
                onChange={(e) => setAutoSyncCookie(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block' }}>Mã Hóa Hồ Sơ Cục Bộ (AES-256)</span>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Mã hóa mật khẩu và proxy lưu trữ trên ổ đĩa</span>
              </div>
              <input
                type="checkbox"
                checked={encryptLocalProfiles}
                onChange={(e) => setEncryptLocalProfiles(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SECTION: FINGERPRINT & WEBGL                           */}
      {/* ========================================================= */}
      {activeSettingsSection === 'fingerprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cấu Hình Vân Tay Fingerprint & WebGL
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Tùy biến thuật toán che giấu Canvas, AudioContext, WebGL và ClientRects
            </p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
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
      )}

      {/* ========================================================= */}
      {/* 4. SECTION: NETWORK & DNS LEAKS                           */}
      {/* ========================================================= */}
      {activeSettingsSection === 'network' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Cấu Hình Mạng & Chống Rò Rỉ DNS
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Bảo vệ lưu lượng mạng, ngăn chặn rò rỉ WebRTC và IP gốc qua DNS
            </p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
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
      )}

      {/* ========================================================= */}
      {/* 5. SECTION: COOKIE & EXTENSIONS                           */}
      {/* ========================================================= */}
      {activeSettingsSection === 'cookie' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Kho Cookie & Tiện Ích Mở Rộng
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Quản lý đồng bộ cookie phiên chạy và môi trường chạy tiện ích mở rộng
            </p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
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
      )}

      {/* ========================================================= */}
      {/* 6. SECTION: LICENSE                                       */}
      {/* ========================================================= */}
      {activeSettingsSection === 'license' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Bản Quyền & Nâng Cấp Gói
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              Kiểm tra thông tin giấy phép kích hoạt và thời hạn gói dịch vụ
            </p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: '#7C3AED' }} />
                <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Gói Bản Quyền Hiện Tại</span>
              </div>
              <span style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
                Trạng thái: <strong style={{ color: '#7C3AED' }}>{currentPlan || 'Gói Dùng Thử (Trial)'}</strong>
              </span>
            </div>
            <button
              onClick={() => setActiveUpgradeModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 18px',
                borderRadius: '6px',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Rocket size={15} /> Nâng Cấp Bản Quyền
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
