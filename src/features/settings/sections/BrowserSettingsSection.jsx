import React from 'react';
import { Save } from 'lucide-react';
import SettingSwitchItem from '../components/SettingSwitchItem';

export default function BrowserSettingsSection({
  t,
  urlStart,
  setUrlStart,
  clearCookie,
  setClearCookie,
  loadImage,
  setLoadImage,
  restoreSession,
  setRestoreSession,
  bypassCloudflare,
  setBypassCloudflare,
  stopWhenProxyDie,
  setStopWhenProxyDie,
  chromeArgs,
  setChromeArgs,
  allowGpu,
  setAllowGpu,
  soundEnabled,
  setSoundEnabled,
  headless,
  setHeadless,
  clearCache,
  setClearCache,
  saveCookiesBeforeClose,
  setSaveCookiesBeforeClose,
  removeArgs,
  setRemoveArgs,
  allowExtensions,
  setAllowExtensions,
  virtualMouse,
  setVirtualMouse,
  openWithProxy,
  setOpenWithProxy,
  changeFingerprintOnClose,
  setChangeFingerprintOnClose,
  onSave
}) {
  return (
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
      <div
        style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 28px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '36px',
            width: '100%'
          }}
        >
          {/* ── COLUMN 1 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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

            <div style={{ paddingTop: '8px' }}>
              <button
                onClick={onSave}
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3B82F6')}
              >
                <Save size={14} />
                <span>{t('settings.saveBrowserBtn', 'Save')}</span>
              </button>
            </div>
          </div>

          {/* ── COLUMN 2 ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
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
  );
}
