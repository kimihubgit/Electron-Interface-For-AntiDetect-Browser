import React, { useState } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import BrowserSettingsSection from './sections/BrowserSettingsSection';
import GeneralSettingsSection from './sections/GeneralSettingsSection';
import FingerprintSettingsSection from './sections/FingerprintSettingsSection';
import NetworkSettingsSection from './sections/NetworkSettingsSection';
import CookieSettingsSection from './sections/CookieSettingsSection';

export default function SettingsPage() {
  const { t } = useTranslation();
  const {
    activeSettingsSection = 'browser',
    showToast,
    addLog
  } = useBrowser();

  // ══════════════════════════════════════════════════════════════
  // BROWSER SETTINGS (3-Column Layout)
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
    const updated = bookmarksList.filter((b) => b.id !== id);
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
            const normalized = parsed
              .map((item, idx) => ({
                id: String(Date.now() + idx),
                title: item.title || item.name || item.url || 'Bookmark',
                url: item.url || ''
              }))
              .filter((b) => b.url);
            const combined = [...bookmarksList, ...normalized];
            setBookmarksList(combined);
            localStorage.setItem('cfg_gen_bookmarks', JSON.stringify(combined));
            if (showToast)
              showToast(
                t('toasts.importedBookmarksJson', 'Đã nhập thành công {count} dấu trang từ JSON!', { count: normalized.length }),
                'success'
              );
          }
        } else {
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
            if (showToast)
              showToast(
                t('toasts.extractedBookmarksHtml', 'Đã trích xuất {count} dấu trang từ HTML!', { count: extracted.length }),
                'success'
              );
          } else {
            if (showToast)
              showToast(t('toasts.noBookmarksFoundHtml', 'Không tìm thấy dấu trang hợp lệ trong tệp HTML.'), 'error');
          }
        }
      } catch (err) {
        if (showToast)
          showToast(t('toasts.bookmarkReadError', 'Lỗi đọc tệp dấu trang: {error}', { error: err.message }), 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      style={{
        padding: '24px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#F8FAFC',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. SECTION: BROWSER (3-COLUMN LAYOUT) */}
      {(!activeSettingsSection || activeSettingsSection === 'browser') && (
        <BrowserSettingsSection
          t={t}
          urlStart={urlStart}
          setUrlStart={setUrlStart}
          clearCookie={clearCookie}
          setClearCookie={setClearCookie}
          loadImage={loadImage}
          setLoadImage={setLoadImage}
          restoreSession={restoreSession}
          setRestoreSession={setRestoreSession}
          bypassCloudflare={bypassCloudflare}
          setBypassCloudflare={setBypassCloudflare}
          stopWhenProxyDie={stopWhenProxyDie}
          setStopWhenProxyDie={setStopWhenProxyDie}
          chromeArgs={chromeArgs}
          setChromeArgs={setChromeArgs}
          allowGpu={allowGpu}
          setAllowGpu={setAllowGpu}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          headless={headless}
          setHeadless={setHeadless}
          clearCache={clearCache}
          setClearCache={setClearCache}
          saveCookiesBeforeClose={saveCookiesBeforeClose}
          setSaveCookiesBeforeClose={setSaveCookiesBeforeClose}
          removeArgs={removeArgs}
          setRemoveArgs={setRemoveArgs}
          allowExtensions={allowExtensions}
          setAllowExtensions={setAllowExtensions}
          virtualMouse={virtualMouse}
          setVirtualMouse={setVirtualMouse}
          openWithProxy={openWithProxy}
          setOpenWithProxy={setOpenWithProxy}
          changeFingerprintOnClose={changeFingerprintOnClose}
          setChangeFingerprintOnClose={setChangeFingerprintOnClose}
          onSave={handleSaveBrowserSettings}
        />
      )}

      {/* 2. SECTION: GENERAL SETTINGS (CÀI ĐẶT CHUNG) */}
      {activeSettingsSection === 'general' && (
        <GeneralSettingsSection
          t={t}
          syncIpGeo={syncIpGeo}
          setSyncIpGeo={setSyncIpGeo}
          allowChromeLogin={allowChromeLogin}
          setAllowChromeLogin={setAllowChromeLogin}
          translatePages={translatePages}
          setTranslatePages={setTranslatePages}
          disableDevTools={disableDevTools}
          setDisableDevTools={setDisableDevTools}
          disableExtensionsManage={disableExtensionsManage}
          setDisableExtensionsManage={setDisableExtensionsManage}
          virtualCamera={virtualCamera}
          setVirtualCamera={setVirtualCamera}
          mobileEmulation={mobileEmulation}
          setMobileEmulation={setMobileEmulation}
          skipProxyDetectPage={skipProxyDetectPage}
          setSkipProxyDetectPage={setSkipProxyDetectPage}
          resumeLastSession={resumeLastSession}
          setResumeLastSession={setResumeLastSession}
          onlyAvailableProxy={onlyAvailableProxy}
          setOnlyAvailableProxy={setOnlyAvailableProxy}
          waitCacheLoaded={waitCacheLoaded}
          setWaitCacheLoaded={setWaitCacheLoaded}
          geoMatchLast={geoMatchLast}
          setGeoMatchLast={setGeoMatchLast}
          safeBrowsingHttps={safeBrowsingHttps}
          setSafeBrowsingHttps={setSafeBrowsingHttps}
          disableVideoLoading={disableVideoLoading}
          setDisableVideoLoading={setDisableVideoLoading}
          blockImagesAboveSize={blockImagesAboveSize}
          setBlockImagesAboveSize={setBlockImagesAboveSize}
          imageSizeLimitKb={imageSizeLimitKb}
          setImageSizeLimitKb={setImageSizeLimitKb}
          clearCacheOnStartup={clearCacheOnStartup}
          setClearCacheOnStartup={setClearCacheOnStartup}
          clearCacheTypes={clearCacheTypes}
          setClearCacheTypes={setClearCacheTypes}
          bookmarksList={bookmarksList}
          setBookmarksList={setBookmarksList}
          newBookmarkTitle={newBookmarkTitle}
          setNewBookmarkTitle={setNewBookmarkTitle}
          newBookmarkUrl={newBookmarkUrl}
          setNewBookmarkUrl={setNewBookmarkUrl}
          handleAddBookmark={handleAddBookmark}
          handleDeleteBookmark={handleDeleteBookmark}
          handleFileUploadBookmarks={handleFileUploadBookmarks}
          multiDeviceMode={multiDeviceMode}
          setMultiDeviceMode={setMultiDeviceMode}
          multiDeviceScope={multiDeviceScope}
          setMultiDeviceScope={setMultiDeviceScope}
          multiDeviceCustomProfiles={multiDeviceCustomProfiles}
          setMultiDeviceCustomProfiles={setMultiDeviceCustomProfiles}
          urlFilterEnabled={urlFilterEnabled}
          setUrlFilterEnabled={setUrlFilterEnabled}
          urlFilterMode={urlFilterMode}
          setUrlFilterMode={setUrlFilterMode}
          urlFilterList={urlFilterList}
          setUrlFilterList={setUrlFilterList}
          fbStaticLocal={fbStaticLocal}
          setFbStaticLocal={setFbStaticLocal}
          localNetworkAccess={localNetworkAccess}
          setLocalNetworkAccess={setLocalNetworkAccess}
          localNetworkUrls={localNetworkUrls}
          setLocalNetworkUrls={setLocalNetworkUrls}
          profileDataPath={profileDataPath}
          setProfileDataPath={setProfileDataPath}
          chromiumPath={chromiumPath}
          setChromiumPath={setChromiumPath}
          autoSyncCookie={autoSyncCookie}
          setAutoSyncCookie={setAutoSyncCookie}
          encryptLocalProfiles={encryptLocalProfiles}
          setEncryptLocalProfiles={setEncryptLocalProfiles}
          onSave={handleSaveGeneralSettings}
        />
      )}

      {/* 3. SECTION: FINGERPRINT & WEBGL */}
      {activeSettingsSection === 'fingerprint' && (
        <FingerprintSettingsSection t={t} />
      )}

      {/* 4. SECTION: NETWORK & DNS LEAKS */}
      {activeSettingsSection === 'network' && (
        <NetworkSettingsSection t={t} />
      )}

      {/* 5. SECTION: COOKIE & EXTENSIONS */}
      {activeSettingsSection === 'cookie' && (
        <CookieSettingsSection t={t} />
      )}
    </div>
  );
}
