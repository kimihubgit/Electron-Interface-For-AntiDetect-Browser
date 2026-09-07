/**
 * Seed data for browser profiles.
 * Used when localStorage is empty (first launch).
 */
export const INITIAL_PROFILES = [
  {
    id: 'prof-001',
    name: 'Facebook Ads - Account 01',
    group: 'Facebook Ads',
    os: 'windows',
    browser: 'Chrome 128',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    status: 'idle',
    proxy: { type: 'SOCKS5', host: '154.21.32.88', port: 1080, user: 'user_phuc', pass: 'pass_123', country: 'US', ip: '154.21.32.88', latency: 45, status: 'live' },
    canvas: 'noise', webgl: 'noise',
    webglVendor: 'Google Inc. (NVIDIA)',
    webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)',
    webrtc: 'altered', resolution: '1920x1080', cores: 8, ram: 16,
    tags: ['E-Commerce', 'VIP'],
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'prof-002',
    name: 'TikTok Seller Store VN',
    group: 'TikTok',
    os: 'windows',
    browser: 'Chrome 128',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    status: 'idle',
    proxy: { type: 'HTTP', host: '113.161.44.12', port: 8080, user: '', pass: '', country: 'VN', ip: '113.161.44.12', latency: 18, status: 'live' },
    canvas: 'noise', webgl: 'noise',
    webglVendor: 'Google Inc. (Intel)',
    webglRenderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)',
    webrtc: 'altered', resolution: '1920x1080', cores: 6, ram: 8,
    tags: ['Dropship'],
    createdAt: '2026-09-02T14:30:00Z',
  },
  {
    id: 'prof-003',
    name: 'Crypto Airdrop Farming #03',
    group: 'Crypto',
    os: 'macos',
    browser: 'Chrome 128',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    status: 'idle',
    proxy: { type: 'SOCKS5', host: '198.51.100.45', port: 9050, user: 'airdrop_bot', pass: 'secure_key', country: 'SG', ip: '198.51.100.45', latency: 62, status: 'live' },
    canvas: 'noise', webgl: 'noise',
    webglVendor: 'Apple',
    webglRenderer: 'Apple M2 Pro',
    webrtc: 'altered', resolution: '2560x1440', cores: 10, ram: 16,
    tags: ['Solana', 'Airdrop'],
    createdAt: '2026-09-03T08:15:00Z',
  },
  {
    id: 'prof-004',
    name: 'Amazon Buyer Account UK',
    group: 'E-Commerce',
    os: 'windows',
    browser: 'Chrome 128',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    status: 'idle',
    proxy: { type: 'HTTP', host: '51.140.22.90', port: 3128, user: '', pass: '', country: 'GB', ip: '51.140.22.90', latency: 120, status: 'live' },
    canvas: 'noise', webgl: 'noise',
    webglVendor: 'Google Inc. (AMD)',
    webglRenderer: 'ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)',
    webrtc: 'altered', resolution: '1920x1080', cores: 8, ram: 16,
    tags: ['Amazon UK'],
    createdAt: '2026-09-04T16:00:00Z',
  }
];

/**
 * Seed data for proxy pool.
 */
export const INITIAL_PROXIES = [
  { id: 'px-1', type: 'SOCKS5', host: '154.21.32.88', port: 1080, user: 'user_phuc', pass: 'pass_123', country: 'US', latency: 45, status: 'live', usedCount: 1 },
  { id: 'px-2', type: 'HTTP', host: '113.161.44.12', port: 8080, user: '', pass: '', country: 'VN', latency: 18, status: 'live', usedCount: 1 },
  { id: 'px-3', type: 'SOCKS5', host: '198.51.100.45', port: 9050, user: 'airdrop_bot', pass: 'secure_key', country: 'SG', latency: 62, status: 'live', usedCount: 1 },
  { id: 'px-4', type: 'HTTP', host: '51.140.22.90', port: 3128, user: '', pass: '', country: 'GB', latency: 120, status: 'live', usedCount: 1 },
  { id: 'px-5', type: 'SOCKS5', host: '103.149.28.11', port: 1080, user: 'proxy_test', pass: 'test1234', country: 'JP', latency: 75, status: 'live', usedCount: 0 },
];

/**
 * Seed data for deleted browser profiles in Trash.
 */
export const INITIAL_TRASH_PROFILES = [
  {
    id: 'trash-001',
    name: 'Facebook Ads - Campaign Old #09',
    group: 'Facebook Ads',
    category: 'Facebook Ads',
    os: 'windows',
    browser: 'Chrome 128',
    branchVersion: 'Chrome 128 / Windows 11',
    operator: 'Admin',
    daysRemaining: 29,
    deletedAt: '2026-09-05T09:00:00Z',
    proxy: { type: 'SOCKS5', host: '154.21.32.88', port: 1080 }
  },
  {
    id: 'trash-002',
    name: 'TikTok US Farm - Beta #02',
    group: 'TikTok',
    category: 'TikTok',
    os: 'windows',
    browser: 'Chrome 128',
    branchVersion: 'Chrome 128 / Windows 11',
    operator: 'Admin',
    daysRemaining: 27,
    deletedAt: '2026-09-04T11:20:00Z',
    proxy: { type: 'HTTP', host: '113.161.44.12', port: 8080 }
  },
  {
    id: 'trash-003',
    name: 'Crypto Airdrop Bot - Archive',
    group: 'Crypto',
    category: 'Crypto',
    os: 'macos',
    browser: 'Chrome 128',
    branchVersion: 'Chrome 128 / macOS',
    operator: 'KimiDev',
    daysRemaining: 18,
    deletedAt: '2026-08-25T14:40:00Z',
    proxy: { type: 'SOCKS5', host: '198.51.100.45', port: 9050 }
  }
];

