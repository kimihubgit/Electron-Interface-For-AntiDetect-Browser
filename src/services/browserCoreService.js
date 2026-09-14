/**
 * Browser Core Management Service
 * Manages installed Chromium & Firefox browser engines, versions, and simulated/real downloading.
 */

const STORAGE_KEY = 'antidetect_browser_cores_v1';

export const INITIAL_BROWSER_CORES = [
  {
    id: 'chrome-152',
    name: 'Antibrowser 152 (Khuyên dùng)',
    version: '152',
    fullVersion: '152.0.7958.0',
    engine: 'chromium',
    size: '233 MB',
    releaseDate: '2026-09-13',
    isDefault: true,
    isInstalled: true,
    badge: 'Khuyên dùng',
    badgeColor: '#10B981',
    description: 'Lõi Chromium tùy chỉnh chống phát hiện mới nhất, tích hợp Canvas Noise & Hardware Spoofing.'
  },
  {
    id: 'chrome-134',
    name: 'MostChrome 134 (Beta)',
    version: '134',
    fullVersion: '134.0.6998.35',
    engine: 'chromium',
    size: '96.5 MB',
    releaseDate: '2026-03-01',
    isDefault: false,
    isInstalled: false,
    badge: 'Beta',
    badgeColor: '#EC4899',
    description: 'Bản dựng Chromium mới nhất hỗ trợ các API WebGPU và Canvas Fingerprint thế hệ mới.'
  },
  {
    id: 'chrome-132',
    name: 'Chrome 132 (Stable)',
    version: '132',
    fullVersion: '132.0.6834.160',
    engine: 'chromium',
    size: '93.8 MB',
    releaseDate: '2026-01-20',
    isDefault: false,
    isInstalled: false,
    badge: 'Stable',
    badgeColor: '#3B82F6',
    description: 'Bản Chromium ổn định, vượt qua các bài kiểm tra Bot Detection & Cloudflare.'
  },
  {
    id: 'chrome-130',
    name: 'Chrome 130',
    version: '130',
    fullVersion: '130.0.6723.116',
    engine: 'chromium',
    size: '91.2 MB',
    releaseDate: '2025-10-15',
    isDefault: false,
    isInstalled: false,
    badge: 'Ổn định',
    badgeColor: '#3B82F6',
    description: 'Phiên bản tương thích cao cho nuôi tài khoản mạng xã hội Facebook và Google Ads.'
  },
  {
    id: 'chrome-128',
    name: 'Chrome 128',
    version: '128',
    fullVersion: '128.0.6613.138',
    engine: 'chromium',
    size: '89.4 MB',
    releaseDate: '2025-08-25',
    isDefault: false,
    isInstalled: false,
    badge: 'Cũ',
    badgeColor: '#64748B',
    description: 'Lõi Chromium phiên bản cũ.'
  },
  {
    id: 'chrome-126',
    name: 'Chrome 126 (LTS)',
    version: '126',
    fullVersion: '126.0.6478.182',
    engine: 'chromium',
    size: '87.1 MB',
    releaseDate: '2025-06-10',
    isDefault: false,
    isInstalled: false,
    badge: 'LTS',
    badgeColor: '#8B5CF6',
    description: 'Bản hỗ trợ dài hạn cho các trang thương mại điện tử Amazon và eBay.'
  },
  {
    id: 'chrome-124',
    name: 'Chrome 124',
    version: '124',
    fullVersion: '124.0.6367.207',
    engine: 'chromium',
    size: '85.0 MB',
    releaseDate: '2025-04-18',
    isDefault: false,
    isInstalled: false,
    badge: 'Cũ',
    badgeColor: '#64748B',
    description: 'Phiên bản dự phòng cho các hệ thống cũ yêu cầu User-Agent thấp.'
  },
  {
    id: 'firefox-132',
    name: 'SunBrowser Gecko 132 (Firefox)',
    version: 'ff-132',
    fullVersion: '132.0.2',
    engine: 'firefox',
    size: '78.4 MB',
    releaseDate: '2025-11-05',
    isDefault: false,
    isInstalled: false,
    badge: 'Firefox Gecko',
    badgeColor: '#F97316',
    description: 'Lõi Gecko độc lập hoàn toàn với Chromium, tránh bị phát hiện đồng loạt.'
  }
];

export function getStoredBrowserCores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động nâng cấp danh sách nếu chưa có core-152
        const has152 = parsed.some(c => String(c.version) === '152');
        if (!has152) {
          const core152 = INITIAL_BROWSER_CORES[0];
          parsed.unshift(core152);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored cores:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BROWSER_CORES));
  return INITIAL_BROWSER_CORES;
}

export function saveStoredBrowserCores(cores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cores));
    // Dispatch custom event for cross-component live sync
    window.dispatchEvent(new CustomEvent('antidetect-cores-updated', { detail: cores }));
  } catch (e) {
    console.error('Failed to save cores:', e);
  }
}

export function getInstalledBrowserOptions() {
  const cores = getStoredBrowserCores();
  const installed = cores.filter(c => c.isInstalled);
  if (installed.length === 0) {
    return [
      { id: '152', label: 'Antibrowser 152 (Khuyên dùng)', version: '152' },
      { id: '132', label: 'Chrome 132 (Stable)', version: '132' }
    ];
  }
  return installed.map(c => ({
    id: c.version,
    label: c.name,
    version: c.version,
    fullVersion: c.fullVersion,
    engine: c.engine
  }));
}
