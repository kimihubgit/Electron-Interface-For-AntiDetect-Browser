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
  FolderOpen,
  Bookmark,
  Monitor,
  Video,
  Upload,
  Trash2,
  Plus,
  Layers,
  Network
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';

export default function SettingsPage() {
  const { t } = useTranslation();
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

  // ══════════════════════════════════════════════════════════════
  // GENERAL SETTINGS STATES (Cài Đặt Chung)
  // ══════════════════════════════════════════════════════════════
  // 1. Trình duyệt & Dấu vân tay
  const [syncIpGeo, setSyncIpGeo] = useState(() => localStorage.getItem('cfg_gen_sync_ip_geo') !== 'false');
  const [allowChromeLogin, setAllowChromeLogin] = useState(() => localStorage.getItem('cfg_gen_chrome_login') === 'true');
  const [translatePages, setTranslatePages] = useState(() => localStorage.getItem('cfg_gen_translate_pages') !== 'false');
  const [disableDevTools, setDisableDevTools] = useState(() => localStorage.getItem('cfg_gen_disable_devtools') === 'true');
  const [disableExtensionsManage, setDisableExtensionsManage] = useState(() => localStorage.getItem('cfg_gen_disable_ext') === 'true');
  const [virtualCamera, setVirtualCamera] = useState(() => localStorage.getItem('cfg_gen_virtual_camera') === 'true');
  const [mobileEmulation, setMobileEmulation] = useState(() => localStorage.getItem('cfg_gen_mobile_emu') === 'true');

  // 2. Khi khởi động
  const [skipProxyDetectPage, setSkipProxyDetectPage] = useState(() => localStorage.getItem('cfg_gen_skip_proxy_detect') === 'true');
  const [resumeLastSession, setResumeLastSession] = useState(() => localStorage.getItem('cfg_gen_resume_session') === 'true');
  const [onlyAvailableProxy, setOnlyAvailableProxy] = useState(() => localStorage.getItem('cfg_gen_only_avail_proxy') !== 'false');
  const [waitCacheLoaded, setWaitCacheLoaded] = useState(() => localStorage.getItem('cfg_gen_wait_cache') === 'true');
  const [geoMatchLast, setGeoMatchLast] = useState(() => localStorage.getItem('cfg_gen_geo_match_last') === 'true');
  const [safeBrowsingHttps, setSafeBrowsingHttps] = useState(() => localStorage.getItem('cfg_gen_safe_https') !== 'false');
  const [disableVideoLoading, setDisableVideoLoading] = useState(() => localStorage.getItem('cfg_gen_disable_video') === 'true');
  const [blockImagesAboveSize, setBlockImagesAboveSize] = useState(() => localStorage.getItem('cfg_gen_block_img') === 'true');
  const [imageSizeLimitKb, setImageSizeLimitKb] = useState(() => localStorage.getItem('cfg_gen_img_size') || '10');
  const [clearCacheOnStartup, setClearCacheOnStartup] = useState(() => localStorage.getItem('cfg_gen_clear_cache_start') === 'true');
  const [clearCacheTypes, setClearCacheTypes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cfg_gen_clear_types')) || { cache: true, cookies: false, history: false };
    } catch {
      return { cache: true, cookies: false, history: false };
    }
  });

  // 3. Upload Dấu trang
  const [bookmarksList, setBookmarksList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cfg_gen_bookmarks')) || [
        { id: '1', title: 'Google Search', url: 'https://google.com' },
        { id: '2', title: 'Facebook', url: 'https://facebook.com' },
        { id: '3', title: 'YouTube', url: 'https://youtube.com' }
      ];
    } catch {
      return [];
    }
  });
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');

  // 4. Chế độ nhiều thiết bị
  const [multiDeviceMode, setMultiDeviceMode] = useState(() => localStorage.getItem('cfg_gen_multi_device') === 'true');
  const [multiDeviceScope, setMultiDeviceScope] = useState(() => localStorage.getItem('cfg_gen_multi_scope') || 'all');
  const [multiDeviceCustomProfiles, setMultiDeviceCustomProfiles] = useState(() => localStorage.getItem('cfg_gen_multi_custom') || '');

  // 5. Quản lý trang web & Mạng
  const [urlFilterEnabled, setUrlFilterEnabled] = useState(() => localStorage.getItem('cfg_gen_url_filter') === 'true');
  const [urlFilterMode, setUrlFilterMode] = useState(() => localStorage.getItem('cfg_gen_url_mode') || 'blacklist');
  const [urlFilterList, setUrlFilterList] = useState(() => localStorage.getItem('cfg_gen_url_list') || '');
  const [fbStaticLocal, setFbStaticLocal] = useState(() => localStorage.getItem('cfg_gen_fb_static') === 'true');
  const [localNetworkAccess, setLocalNetworkAccess] = useState(() => localStorage.getItem('cfg_gen_local_net') === 'true');
  const [localNetworkUrls, setLocalNetworkUrls] = useState(() => localStorage.getItem('cfg_gen_local_urls') || 'http://localhost:*, 127.0.0.1:*');

  // Storage & Core paths
  const [profileDataPath, setProfileDataPath] = useState(() => localStorage.getItem('cfg_profile_data_path') || 'C:\\AntidetectBrowser\\profiles');
  const [chromiumPath, setChromiumPath] = useState(() => localStorage.getItem('cfg_chromium_path') || 'C:\\Program Files\\Chromium\\chrome.exe');
  const [autoSyncCookie, setAutoSyncCookie] = useState(() => localStorage.getItem('cfg_auto_sync_cookie') !== 'false');
  const [encryptLocalProfiles, setEncryptLocalProfiles] = useState(() => localStorage.getItem('cfg_encrypt_local') !== 'false');

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

    addLog?.(t('toasts.savedBrowserSettings', 'Đã lưu cấu hình trình duyệt Browser thành công!'), 'success');
    if (showToast) showToast(t('toasts.savedBrowserSettings', 'Đã lưu cấu hình trình duyệt Browser thành công!'), 'success');
  };

  // Handle Save General Settings
  const handleSaveGeneralSettings = () => {
    localStorage.setItem('cfg_gen_sync_ip_geo', String(syncIpGeo));
    localStorage.setItem('cfg_gen_chrome_login', String(allowChromeLogin));
    localStorage.setItem('cfg_gen_translate_pages', String(translatePages));
    localStorage.setItem('cfg_gen_disable_devtools', String(disableDevTools));
    localStorage.setItem('cfg_gen_disable_ext', String(disableExtensionsManage));
    localStorage.setItem('cfg_gen_virtual_camera', String(virtualCamera));
    localStorage.setItem('cfg_gen_mobile_emu', String(mobileEmulation));

    localStorage.setItem('cfg_gen_skip_proxy_detect', String(skipProxyDetectPage));
    localStorage.setItem('cfg_gen_resume_session', String(resumeLastSession));
    localStorage.setItem('cfg_gen_only_avail_proxy', String(onlyAvailableProxy));
    localStorage.setItem('cfg_gen_wait_cache', String(waitCacheLoaded));
    localStorage.setItem('cfg_gen_geo_match_last', String(geoMatchLast));
    localStorage.setItem('cfg_gen_safe_https', String(safeBrowsingHttps));
    localStorage.setItem('cfg_gen_disable_video', String(disableVideoLoading));
    localStorage.setItem('cfg_gen_block_img', String(blockImagesAboveSize));
    localStorage.setItem('cfg_gen_img_size', String(imageSizeLimitKb));
    localStorage.setItem('cfg_gen_clear_cache_start', String(clearCacheOnStartup));
    localStorage.setItem('cfg_gen_clear_types', JSON.stringify(clearCacheTypes));

    localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(bookmarksList));
    localStorage.setItem('cfg_gen_multi_device', String(multiDeviceMode));
    localStorage.setItem('cfg_gen_multi_scope', multiDeviceScope);
    localStorage.setItem('cfg_gen_multi_custom', multiDeviceCustomProfiles);

    localStorage.setItem('cfg_gen_url_filter', String(urlFilterEnabled));
    localStorage.setItem('cfg_gen_url_mode', urlFilterMode);
    localStorage.setItem('cfg_gen_url_list', urlFilterList);
    localStorage.setItem('cfg_gen_fb_static', String(fbStaticLocal));
    localStorage.setItem('cfg_gen_local_net', String(localNetworkAccess));
    localStorage.setItem('cfg_gen_local_urls', localNetworkUrls);

    localStorage.setItem('cfg_profile_data_path', profileDataPath);
    localStorage.setItem('cfg_chromium_path', chromiumPath);
    localStorage.setItem('cfg_auto_sync_cookie', String(autoSyncCookie));
    localStorage.setItem('cfg_encrypt_local', String(encryptLocalProfiles));

    addLog?.(t('toasts.savedGeneralSettings', 'Đã lưu cấu hình Cài Đặt Chung thành công!'), 'success');
    if (showToast) showToast(t('toasts.savedGeneralSettings', 'Đã lưu cấu hình Cài Đặt Chung thành công!'), 'success');
  };

  // Bookmark actions
  const handleAddBookmark = () => {
    if (!newBookmarkUrl.trim()) return;
    const item = {
      id: String(Date.now()),
      title: newBookmarkTitle.trim() || newBookmarkUrl.trim(),
      url: newBookmarkUrl.trim().startsWith('http') ? newBookmarkUrl.trim() : `https://${newBookmarkUrl.trim()}`
    };
    const updated = [...bookmarksList, item];
    setBookmarksList(updated);
    localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(updated));
    setNewBookmarkTitle('');
    setNewBookmarkUrl('');
  };

  const handleDeleteBookmark = (id) => {
    const updated = bookmarksList.filter(b => b.id !== id);
    setBookmarksList(updated);
    localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(updated));
  };

  const handleFileUploadBookmarks = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result;
        if (typeof text !== 'string') return;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((item, idx) => ({
              id: String(Date.now() + idx),
              title: item.title || item.name || item.url || 'Bookmark',
              url: item.url || ''
            })).filter(b => b.url);
            const combined = [...bookmarksList, ...normalized];
            setBookmarksList(combined);
            localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(combined));
            if (showToast) showToast(t('toasts.importedBookmarksJson', 'Đã nhập thành công {count} dấu trang từ JSON!', { count: normalized.length }), 'success');
          }
        } else {
          // HTML bookmark parsing
          const regex = /<A\s+HREF="([^"]+)"[^>]*>([^<]+)<\/A>/gi;
          let match;
          const extracted = [];
          while ((match = regex.exec(text)) !== null) {
            extracted.push({
              id: String(Date.now() + Math.random()),
              title: match[2].trim(),
              url: match[1].trim()
            });
          }
          if (extracted.length > 0) {
            const combined = [...bookmarksList, ...extracted];
            setBookmarksList(combined);
            localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(combined));
            if (showToast) showToast(t('toasts.extractedBookmarksHtml', 'Đã trích xuất {count} dấu trang từ HTML!', { count: extracted.length }), 'success');
          } else {
            if (showToast) showToast(t('toasts.noBookmarksFoundHtml', 'Không tìm thấy dấu trang hợp lệ trong tệp HTML.'), 'error');
          }
        }
      } catch (err) {
        if (showToast) showToast(t('toasts.bookmarkReadError', 'Lỗi đọc tệp dấu trang: {error}', { error: err.message }), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
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
              {t('settings.browserTitle', 'Cấu Hình Phiên Trình Duyệt (Browser Settings)')}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              {t('settings.browserDesc', 'Cấu hình tham số khởi động, kiểm soát tài nguyên, cache/cookie và dấu vân tay cho mọi phiên profile')}
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
                    {t('settings.urlStartLabel', 'URL start:')}
                  </label>
                  <input
                    type="text"
                    value={urlStart}
                    onChange={(e) => setUrlStart(e.target.value)}
                    placeholder={t('settings.urlStartPlaceholder', 'Enter the URL you want when starting to open the profile...')}
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
                  label={t('settings.clearCookieLabel', 'Clear cookie')}
                  subtitle={t('settings.clearCookieSub', 'Clear cookie when close browser')}
                  checked={clearCookie}
                  onChange={setClearCookie}
                />

                <SettingSwitchItem
                  label={t('settings.imageLabel', 'Image')}
                  subtitle={t('settings.imageSub', 'Load images when open profiles')}
                  checked={loadImage}
                  onChange={setLoadImage}
                />

                <SettingSwitchItem
                  label={t('settings.restoreSessionLabel', 'Restore last session')}
                  subtitle={t('settings.restoreSessionSub', 'Restore tabs from the previous session')}
                  checked={restoreSession}
                  onChange={setRestoreSession}
                />

                <SettingSwitchItem
                  label={t('settings.bypassCloudflareLabel', 'Bypass CloudFlare')}
                  subtitle={t('settings.bypassCloudflareSub', 'Open profiles bypass cloudflare')}
                  checked={bypassCloudflare}
                  onChange={setBypassCloudflare}
                />

                <SettingSwitchItem
                  label={t('settings.stopProxyDieLabel', 'Stop open when Proxy die')}
                  subtitle={t('settings.stopProxyDieSub', 'Prevent browser from opening if proxy die')}
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
                    <span>{t('settings.saveBrowserBtn', 'Save')}</span>
                  </button>
                </div>
              </div>

              {/* ── COLUMN 2 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Input: Chrome arguments */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    {t('settings.chromeArgsLabel', 'Chrome arguments')}
                  </label>
                  <input
                    type="text"
                    value={chromeArgs}
                    onChange={(e) => setChromeArgs(e.target.value)}
                    placeholder={t('settings.chromeArgsPlaceholder', '--argument1 --argument2')}
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
                  label={t('settings.gpuLabel', 'GPU')}
                  subtitle={t('settings.gpuSub', 'Allow GPU when opening browser')}
                  checked={allowGpu}
                  onChange={setAllowGpu}
                />

                <SettingSwitchItem
                  label={t('settings.soundLabel', 'Sound')}
                  subtitle={t('settings.soundSub', 'Off/on audio when open browser')}
                  checked={soundEnabled}
                  onChange={setSoundEnabled}
                />

                <SettingSwitchItem
                  label={t('settings.headlessLabel', 'Headless')}
                  subtitle={t('settings.headlessSub', 'Run profiles headless')}
                  checked={headless}
                  onChange={setHeadless}
                />

                <SettingSwitchItem
                  label={t('settings.clearCacheLabel', 'Clear cache')}
                  subtitle={t('settings.clearCacheSub', 'Clear cache when close browser')}
                  checked={clearCache}
                  onChange={setClearCache}
                />

                <SettingSwitchItem
                  label={t('settings.saveCookiesLabel', 'Save profile cookies')}
                  subtitle={t('settings.saveCookiesSub', 'Save profile cookies before close')}
                  checked={saveCookiesBeforeClose}
                  onChange={setSaveCookiesBeforeClose}
                />
              </div>

              {/* ── COLUMN 3 ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Input: Remove arguments */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    {t('settings.removeArgsLabel', 'Remove arguments')}
                  </label>
                  <input
                    type="text"
                    value={removeArgs}
                    onChange={(e) => setRemoveArgs(e.target.value)}
                    placeholder={t('settings.removeArgsPlaceholder', '--argument1 --argument2')}
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
                  label={t('settings.extensionsLabel', 'Extensions')}
                  subtitle={t('settings.extensionsSub', 'Allow extensions when open browser')}
                  checked={allowExtensions}
                  onChange={setAllowExtensions}
                />

                <SettingSwitchItem
                  label={t('settings.virtualMouseLabel', 'Virtual mouse')}
                  subtitle={t('settings.virtualMouseSub', 'Show virtual mouse when open browser')}
                  checked={virtualMouse}
                  onChange={setVirtualMouse}
                />

                <SettingSwitchItem
                  label={t('settings.openProxyLabel', 'Proxy')}
                  subtitle={t('settings.openProxySub', 'Open profiles with proxy')}
                  checked={openWithProxy}
                  onChange={setOpenWithProxy}
                />

                <SettingSwitchItem
                  label={t('settings.changeFpLabel', 'Change fingerprint')}
                  subtitle={t('settings.changeFpSub', 'Change fingerprint on close')}
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
      {/* 2. SECTION: GENERAL SETTINGS (CÀI ĐẶT CHUNG)              */}
      {/* ========================================================= */}
      {activeSettingsSection === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '880px', paddingBottom: '40px' }}>
          {/* Header & Save Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                {t('settings.generalTitle', 'Cài Đặt Chung Hệ Thống (General Settings)')}
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
                {t('settings.generalDesc', 'Tùy biến môi trường vân tay, hành vi khi khởi động, quản lý dấu trang, chế độ nhiều thiết bị và kiểm soát mạng')}
              </p>
            </div>
            <button
              onClick={handleSaveGeneralSettings}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Save size={15} />
              {t('settings.saveGeneralBtn', 'Lưu Cài Đặt')}
            </button>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 1: TRÌNH DUYỆT & DẤU VÂN TAY                        */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAFCFF'
            }}>
              <Globe size={18} style={{ color: '#3B82F6' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {t('settings.cardBrowserFp', 'Trình Duyệt & Dấu Vân Tay')}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {t('settings.cardBrowserFpDesc', 'Thiết lập hành vi đồng bộ vân tay địa lý, quyền truy cập công cụ nhà phát triển và tiện ích')}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <SettingSwitchItem
                label="Khi IP thay đổi, thời gian và địa lý sẽ thay đổi theo"
                subtitle="Tự động căn chỉnh Timezone, Geolocation và Ngôn ngữ khớp với địa chỉ IP của Proxy"
                checked={syncIpGeo}
                onChange={setSyncIpGeo}
              />

              <SettingSwitchItem
                label="Cho phép đăng nhập Chrome"
                subtitle="Khi tắt, bạn có thể đăng nhập vào các trang Google như Gmail mà không cần Chrome. Việc bật/tắt công tắc này sẽ đăng xuất tài khoản Google hiện đang đăng nhập trong Chrome."
                checked={allowChromeLogin}
                onChange={setAllowChromeLogin}
              />

              <SettingSwitchItem
                label="Yêu cầu dịch các trang không có trong ngôn ngữ của bạn"
                subtitle="Tự động kích hoạt thanh dịch của Chrome khi truy cập trang web nước ngoài"
                checked={translatePages}
                onChange={setTranslatePages}
              />

              {/* Disable DevTools */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    onClick={() => setDisableDevTools(!disableDevTools)}
                    style={{
                      width: '38px',
                      height: '21px',
                      borderRadius: '12px',
                      backgroundColor: disableDevTools ? '#3B82F6' : '#CBD5E1',
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
                        transform: disableDevTools ? 'translateX(17px)' : 'translateX(0px)',
                        transition: 'transform 0.18s ease'
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setDisableDevTools(!disableDevTools)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      Vô hiệu hóa quyền truy cập vào Công cụ Nhà phát triển của trình duyệt
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                      Chrome 133+
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
                  Khóa phím F12 và mục Inspect Element để tránh rò rỉ cấu trúc môi trường. Chỉ áp dụng cho Chrome 133 trở lên.
                </span>
              </div>

              {/* Disable Extensions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    onClick={() => setDisableExtensionsManage(!disableExtensionsManage)}
                    style={{
                      width: '38px',
                      height: '21px',
                      borderRadius: '12px',
                      backgroundColor: disableExtensionsManage ? '#3B82F6' : '#CBD5E1',
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
                        transform: disableExtensionsManage ? 'translateX(17px)' : 'translateX(0px)',
                        transition: 'transform 0.18s ease'
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setDisableExtensionsManage(!disableExtensionsManage)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      Vô hiệu hóa cài đặt và gỡ bỏ tiện ích mở rộng trong trình duyệt
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                      Chrome 133+
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 500 }}>
                      Chủ sở hữu không bị hạn chế
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
                  Ngăn người dùng tự ý cài hoặc xóa extension. Chỉ có hiệu lực với Chrome phiên bản 133 trở lên.
                </span>
              </div>

              {/* Virtual Camera */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    onClick={() => setVirtualCamera(!virtualCamera)}
                    style={{
                      width: '38px',
                      height: '21px',
                      borderRadius: '12px',
                      backgroundColor: virtualCamera ? '#3B82F6' : '#CBD5E1',
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
                        transform: virtualCamera ? 'translateX(17px)' : 'translateX(0px)',
                        transition: 'transform 0.18s ease'
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setVirtualCamera(!virtualCamera)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      Bật camera ảo để mô phỏng video cục bộ như một nguồn phát trực tiếp từ camera
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                      Chrome 140+
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
                  Giả lập webcam từ tệp video định dạng mp4/webm mà không cần camera thực tế.
                </span>
              </div>

              {/* Mobile Emulation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    onClick={() => setMobileEmulation(!mobileEmulation)}
                    style={{
                      width: '38px',
                      height: '21px',
                      borderRadius: '12px',
                      backgroundColor: mobileEmulation ? '#3B82F6' : '#CBD5E1',
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
                        transform: mobileEmulation ? 'translateX(17px)' : 'translateX(0px)',
                        transition: 'transform 0.18s ease'
                      }}
                    />
                  </div>
                  <div
                    onClick={() => setMobileEmulation(!mobileEmulation)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                      Bật tối ưu hóa mô phỏng trên thiết bị di động
                    </span>
                    <span style={{ fontSize: '10.5px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB', fontWeight: 600, border: '1px solid #DBEAFE' }}>
                      Chrome 143+
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11.5px', color: '#94A3B8', paddingLeft: '48px' }}>
                  Tối ưu giao diện hiển thị giống với hiệu ứng của thiết bị thật hơn (touch events, viewport scaling). Chỉ áp dụng cho Chrome 143 trở lên.
                </span>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 2: KHI KHỞI ĐỘNG                                    */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAFCFF'
            }}>
              <Rocket size={18} style={{ color: '#3B82F6' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {t('settings.cardStartup', 'Khi Khởi Động')}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {t('settings.cardStartupDesc', 'Kiểm soát an toàn proxy, điều kiện mở profile, tối ưu hóa tốc độ và bảo mật')}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <SettingSwitchItem
                label="Không khởi động trang phát hiện proxy"
                subtitle="Bỏ qua trang kiểm tra IP và tốc độ mạng mặc định khi mở trình duyệt"
                checked={skipProxyDetectPage}
                onChange={setSkipProxyDetectPage}
              />

              <SettingSwitchItem
                label="Tiếp tục duyệt trang đã mở gần đây nhất"
                subtitle="Tự động khôi phục tất cả các tab đã mở từ phiên làm việc trước"
                checked={resumeLastSession}
                onChange={setResumeLastSession}
              />

              <SettingSwitchItem
                label="Chỉ mở trình duyệt bằng proxy khả dụng"
                subtitle="Nếu không tìm thấy proxy, các mục dấu vân tay dựa trên IP sẽ không khớp với các giá trị."
                checked={onlyAvailableProxy}
                onChange={setOnlyAvailableProxy}
              />

              <SettingSwitchItem
                label="Chỉ mở trình duyệt sau khi dữ liệu bộ nhớ đệm được tải thành công"
                subtitle="Đảm bảo đồng bộ hóa toàn bộ cache và cookie đám mây trước khi bắt đầu phiên duyệt web"
                checked={waitCacheLoaded}
                onChange={setWaitCacheLoaded}
              />

              <SettingSwitchItem
                label="Hồ sơ sẽ không được mở nếu Quốc gia/Khu vực không giống với lần cuối hồ sơ được mở"
                subtitle="Bảo vệ tài khoản tránh bị checkpoint hoặc khóa do thay đổi vị trí địa lý đột ngột"
                checked={geoMatchLast}
                onChange={setGeoMatchLast}
              />

              <SettingSwitchItem
                label="Truy cập an toàn"
                subtitle="Bất cứ khi nào có thể, hãy sử dụng HTTPS và nhận cảnh báo trước khi tải các trang web không phải HTTPS."
                checked={safeBrowsingHttps}
                onChange={setSafeBrowsingHttps}
              />

              <SettingSwitchItem
                label="Vô hiệu hóa tải video"
                subtitle="Chặn các video và luồng media tự động chạy để tiết kiệm băng thông"
                checked={disableVideoLoading}
                onChange={setDisableVideoLoading}
              />

              {/* Block images above size */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: blockImagesAboveSize ? '#F0F9FF' : 'transparent',
                border: blockImagesAboveSize ? '1px solid #BAE6FD' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}>
                <SettingSwitchItem
                  label="Tắt tải hình ảnh để tiết kiệm lưu lượng"
                  subtitle="Có thể đặt kích thước tối thiểu của hình ảnh sẽ được tải lên, chúng tôi khuyên bạn nên điền vào 10 KB; 0 KB có nghĩa là hình ảnh sẽ không được tải lên"
                  checked={blockImagesAboveSize}
                  onChange={setBlockImagesAboveSize}
                />

                {blockImagesAboveSize && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '48px', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                      Ngưỡng kích thước tối đa:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        value={imageSizeLimitKb}
                        onChange={(e) => setImageSizeLimitKb(e.target.value)}
                        style={{
                          width: '80px',
                          padding: '5px 8px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center'
                        }}
                      />
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>KB</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Clear cache on startup */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: clearCacheOnStartup ? '#F0F9FF' : 'transparent',
                border: clearCacheOnStartup ? '1px solid #BAE6FD' : '1px solid transparent',
                transition: 'all 0.15s ease'
              }}>
                <SettingSwitchItem
                  label="Xoá dữ liệu bộ nhớ đệm"
                  subtitle="Dữ liệu sẽ tự động bị xoá khi khởi động và không đồng bộ các loại dữ liệu đã chọn giữa các thiết bị."
                  checked={clearCacheOnStartup}
                  onChange={setClearCacheOnStartup}
                />

                {clearCacheOnStartup && (
                  <div style={{ display: 'flex', gap: '20px', paddingLeft: '48px', marginTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={clearCacheTypes.cache}
                        onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, cache: e.target.checked })}
                      />
                      Dữ liệu bộ nhớ đệm
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={clearCacheTypes.cookies}
                        onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, cookies: e.target.checked })}
                      />
                      Cookie
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#1E293B', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={clearCacheTypes.history}
                        onChange={(e) => setClearCacheTypes({ ...clearCacheTypes, history: e.target.checked })}
                      />
                      Lịch sử duyệt web
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 3: UPLOAD DẤU TRANG (BOOKMARKS)                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FAFCFF'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bookmark size={18} style={{ color: '#3B82F6' }} />
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                    {t('settings.cardBookmarks', 'Upload Dấu Trang (Bookmarks)')}
                  </h3>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {t('settings.cardBookmarksDesc', 'Tải lên danh sách dấu trang HTML / JSON để nạp sẵn cho mọi profile trình duyệt')}
                  </span>
                </div>
              </div>

              {/* Upload File Button */}
              <label style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                border: '1px solid #BFDBFE',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}>
                <Upload size={14} />
                Tải lên tệp (.html, .json)
                <input
                  type="file"
                  accept=".html,.htm,.json"
                  onChange={handleFileUploadBookmarks}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quick Add Row */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Tiêu đề dấu trang (VD: Google)"
                  value={newBookmarkTitle}
                  onChange={(e) => setNewBookmarkTitle(e.target.value)}
                  style={{
                    flex: '0 0 200px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="URL dấu trang (VD: https://google.com)"
                  value={newBookmarkUrl}
                  onChange={(e) => setNewBookmarkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddBookmark(); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleAddBookmark}
                  disabled={!newBookmarkUrl.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    backgroundColor: newBookmarkUrl.trim() ? '#3B82F6' : '#E2E8F0',
                    color: newBookmarkUrl.trim() ? '#FFFFFF' : '#94A3B8',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: newBookmarkUrl.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  <Plus size={15} />
                  Thêm
                </button>
              </div>

              {/* Bookmarks List */}
              <div style={{
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                backgroundColor: '#F8FAFC'
              }}>
                <div style={{
                  padding: '8px 14px',
                  borderBottom: '1px solid #E2E8F0',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#64748B',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>DANH SÁCH DẤU TRANG ({bookmarksList.length})</span>
                  {bookmarksList.length > 0 && (
                    <span
                      onClick={() => {
                        if (confirm('Bạn có chắc muốn xoá tất cả dấu trang?')) {
                          setBookmarksList([]);
                          localStorage.setItem('cfg_gen_bookmarks', JSON.stringify([]));
                        }
                      }}
                      style={{ cursor: 'pointer', color: '#EF4444', fontWeight: 600 }}
                    >
                      Xoá tất cả
                    </span>
                  )}
                </div>

                {bookmarksList.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: '#94A3B8' }}>
                    Chưa có dấu trang nào. Hãy tải lên tệp .html/.json hoặc thêm thủ công ở trên.
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {bookmarksList.map((bm) => (
                      <div
                        key={bm.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <Bookmark size={14} style={{ color: '#3B82F6', flexShrink: 0 }} />
                          <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                            {bm.title}
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#64748B', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {bm.url}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteBookmark(bm.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Xoá dấu trang"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 4: CHẾ ĐỘ NHIỀU THIẾT BỊ                            */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAFCFF'
            }}>
              <Monitor size={18} style={{ color: '#3B82F6' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {t('settings.cardMultiDevice', 'Chế Độ Nhiều Thiết Bị')}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {t('settings.cardMultiDeviceDesc', 'Quản lý quyền mở đồng thời một hồ sơ trình duyệt giữa các tài khoản và máy trạm')}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SettingSwitchItem
                label="Chế độ nhiều thiết bị"
                subtitle="Sau khi bật, hỗ trợ nhiều thành viên mở cùng một hồ sơ đồng thời"
                checked={multiDeviceMode}
                onChange={setMultiDeviceMode}
              />

              {multiDeviceMode && (
                <div style={{
                  paddingLeft: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  paddingTop: '8px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="multiDeviceScope"
                        checked={multiDeviceScope === 'all'}
                        onChange={() => setMultiDeviceScope('all')}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                        Mở nhiều toàn bộ
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        — Tất cả hồ sơ đều hỗ trợ nhiều thành viên mở đồng thời
                      </span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="multiDeviceScope"
                        checked={multiDeviceScope === 'custom'}
                        onChange={() => setMultiDeviceScope('custom')}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                        Mở nhiều chỉ định
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        — Chỉ hồ sơ được chỉ định mới hỗ trợ nhiều thành viên mở đồng thời
                      </span>
                    </label>
                  </div>

                  {multiDeviceScope === 'custom' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        Danh sách tên hoặc ID hồ sơ được phép mở nhiều (cách nhau bởi dấu phẩy):
                      </label>
                      <input
                        type="text"
                        value={multiDeviceCustomProfiles}
                        onChange={(e) => setMultiDeviceCustomProfiles(e.target.value)}
                        placeholder="VD: Profile 1, Profile 2, 1024, 1055"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 5: QUẢN LÝ TRANG WEB & MẠNG                         */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAFCFF'
            }}>
              <Network size={18} style={{ color: '#3B82F6' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {t('settings.cardNetwork', 'Quản Lý Trang Web & Mạng')}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {t('settings.cardNetworkDesc', 'Lọc URL truy cập, định tuyến tài nguyên Facebook và cấu hình mạng nội bộ')}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* URL Filter */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SettingSwitchItem
                  label="Chặn truy cập"
                  subtitle="Sử dụng danh sách chặn và danh sách cho phép để quản lý URL cơ bản."
                  checked={urlFilterEnabled}
                  onChange={setUrlFilterEnabled}
                />

                {urlFilterEnabled && (
                  <div style={{
                    paddingLeft: '48px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="urlFilterMode"
                          checked={urlFilterMode === 'blacklist'}
                          onChange={() => setUrlFilterMode('blacklist')}
                        />
                        Danh sách chặn (Blacklist)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="urlFilterMode"
                          checked={urlFilterMode === 'whitelist'}
                          onChange={() => setUrlFilterMode('whitelist')}
                        />
                        Danh sách cho phép (Whitelist)
                      </label>
                    </div>

                    <textarea
                      rows={3}
                      value={urlFilterList}
                      onChange={(e) => setUrlFilterList(e.target.value)}
                      placeholder="Nhập danh sách domain hoặc URL (mỗi dòng một địa chỉ, ví dụ: *.tiktok.com, facebook.com)..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* FB Static local */}
              <SettingSwitchItem
                label="Nguồn FB tĩnh"
                subtitle="Sau khi mở, sử dụng mạng local để tải tài nguyên tĩnh Facebook (giúp tăng tốc độ tải trang và tiết kiệm lưu lượng proxy)"
                checked={fbStaticLocal}
                onChange={setFbStaticLocal}
              />

              {/* Local network access */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <SettingSwitchItem
                  label="Truy cập mạng local"
                  subtitle="Khi được bật, có thể cài đặt URL để truy cập mạng local"
                  checked={localNetworkAccess}
                  onChange={setLocalNetworkAccess}
                />

                {localNetworkAccess && (
                  <div style={{ paddingLeft: '48px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Địa chỉ truy cập mạng local:
                    </label>
                    <input
                      type="text"
                      value={localNetworkUrls}
                      onChange={(e) => setLocalNetworkUrls(e.target.value)}
                      placeholder="http://localhost:*, 127.0.0.1:*"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────── */}
          {/* CARD 6: ĐƯỜNG DẪN & MÃ HÓA LƯU TRỮ                      */}
          {/* ───────────────────────────────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FAFCFF'
            }}>
              <FolderOpen size={18} style={{ color: '#3B82F6' }} />
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {t('settings.cardStorage', 'Đường Dẫn & Mã Hóa Lưu Trữ')}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  {t('settings.cardStorageDesc', 'Vị trí tệp tin profile cục bộ và đường dẫn thực thi Chromium Core')}
                </span>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. SECTION: FINGERPRINT & WEBGL                           */}
      {/* ========================================================= */}
      {activeSettingsSection === 'fingerprint' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t('settings.cardFpEngine', 'Cấu Hình Vân Tay Fingerprint & WebGL')}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              {t('settings.cardFpEngineDesc', 'Tùy biến thuật toán che giấu Canvas, AudioContext, WebGL và ClientRects')}
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
              onChange={() => { }}
            />
            <SettingSwitchItem
              label="WebGL Metadata Spoofing"
              subtitle="Tự động giả lập GPU Vendor và Renderer theo thiết bị thực tế"
              checked={true}
              onChange={() => { }}
            />
            <SettingSwitchItem
              label="AudioContext Fingerprint Protection"
              subtitle="Thêm nhiễu tần số âm thanh để tránh các trang web theo dõi qua Audio Buffer"
              checked={true}
              onChange={() => { }}
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
              {t('settings.cardNetSecurity', 'Cấu Hình Mạng & Chống Rò Rỉ DNS')}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              {t('settings.cardNetSecurityDesc', 'Bảo vệ lưu lượng mạng, ngăn chặn rò rỉ WebRTC và IP gốc qua DNS')}
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
              onChange={() => { }}
            />
            <SettingSwitchItem
              label="DNS Leak Protection (DoH)"
              subtitle="Mã hóa truy vấn DNS qua giao thức HTTPS bảo mật"
              checked={true}
              onChange={() => { }}
            />
            <SettingSwitchItem
              label="Proxy Fallback Block"
              subtitle="Chặn hoàn toàn kết nối trực tiếp nếu Proxy bị mất kết nối"
              checked={true}
              onChange={() => { }}
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
              {t('settings.cardCookieExt', 'Kho Cookie & Tiện Ích Mở Rộng')}
            </h2>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px', margin: 0 }}>
              {t('settings.cardCookieExtDesc', 'Quản lý đồng bộ cookie phiên chạy và môi trường chạy tiện ích mở rộng')}
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
              onChange={() => { }}
            />
            <SettingSwitchItem
              label="Isolated Extension Sandbox"
              subtitle="Tách biệt dữ liệu các tiện ích giữa các hồ sơ khác nhau"
              checked={true}
              onChange={() => { }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
