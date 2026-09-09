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
 * Seed data for rotating proxies (Change IP via API or List).
 */
export const INITIAL_ROTATING_PROXIES = [
  {
    id: 'rot-1',
    name: 'TMProxy Dân Cư VN #1',
    provider: 'TMProxy (Việt Nam)',
    apiUrl: 'https://tmproxy.com/api/proxy/get-new-proxy?api_key=tm_88a912bc0',
    currentIp: '14.238.10.15',
    port: 10555,
    cooldown: 120,
    remainingCooldown: 0,
    autoRotateInterval: 10,
    status: 'active',
    profilesUsing: 4,
    lastRotated: '2 phút trước'
  },
  {
    id: 'rot-2',
    name: 'TinProxy Dân Cư US #2',
    provider: 'TinProxy (Hoa Kỳ)',
    apiUrl: 'https://api.tinproxy.com/user/get-ip?api_key=tp_9938dce7',
    currentIp: '198.54.120.44',
    port: 8888,
    cooldown: 60,
    remainingCooldown: 35,
    autoRotateInterval: 5,
    status: 'active',
    profilesUsing: 2,
    lastRotated: 'Vừa xong'
  },
  {
    id: 'rot-3',
    name: 'Pool Tĩnh Xoay Vòng (5 Static IPs)',
    provider: 'Static Round-Robin',
    apiUrl: 'Xoay nội bộ theo chu kỳ danh sách tĩnh',
    currentIp: '154.21.32.88',
    port: 1080,
    cooldown: 30,
    remainingCooldown: 0,
    autoRotateInterval: 15,
    status: 'active',
    profilesUsing: 3,
    lastRotated: '10 phút trước'
  }
];

/**
 * Seed data for DCOM 4G/5G USB Dongles.
 */
export const INITIAL_DCOM_DEVICES = [
  {
    id: 'dcom-1',
    name: 'Huawei E3372 4G - Cổng USB 1',
    port: 40001,
    localProxy: '127.0.0.1:40001',
    operator: 'Viettel 4G LTE',
    wanIp: '171.244.15.82',
    gateway: 'http://192.168.8.1',
    signalStrength: 92,
    status: 'connected',
    lastRotated: '5 phút trước',
    profilesUsing: 2
  },
  {
    id: 'dcom-2',
    name: 'ZTE MF79U 4G - Cổng USB 2',
    port: 40002,
    localProxy: '127.0.0.1:40002',
    operator: 'Mobifone 4G/5G',
    wanIp: '14.191.88.20',
    gateway: 'http://192.168.0.1',
    signalStrength: 85,
    status: 'connected',
    lastRotated: '12 phút trước',
    profilesUsing: 1
  },
  {
    id: 'dcom-3',
    name: 'D-Link DWM-222 - Cổng USB 3',
    port: 40003,
    localProxy: '127.0.0.1:40003',
    operator: 'Vinaphone LTE',
    wanIp: '113.185.34.101',
    gateway: 'http://192.168.1.1',
    signalStrength: 78,
    status: 'idle',
    lastRotated: 'Chưa xoay',
    profilesUsing: 0
  }
];

/**
 * Seed data for Proxy Auto-Assign & Default Rules.
 */
export const INITIAL_PROXY_RULES = {
  defaultMode: 'none', // 'none' | 'system' | 'custom' | 'least_used' | 'round_robin'
  defaultCustomProxyId: 'px-1',
  maxProfilesPerProxy: 3,
  preventLaunchIfDead: true,
  warnDuplicateIpInGroup: true,
  autoCheckPingBeforeRun: true,
  dnsLeakProtection: true,
  webrtcPolicy: 'altered' // 'disabled' | 'altered' | 'real'
};

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

/**
 * Seed data for Antidetect Browser profile run history (phiên chạy hồ sơ).
 */
export const INITIAL_HISTORY_RECORDS = [
  {
    id: 'run-001',
    profileId: 'prof-001',
    profileName: 'Facebook Ads - Account 01',
    group: 'Facebook Ads',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    statusColor: '#10B981',
    browser: 'Chrome 128 (Windows 11)',
    startTime: '07/09/2026, 19:00:30',
    endTime: '07/09/2026, 19:42:45',
    duration: '42 phút 15 giây',
    dateGroup: 'Hôm nay (07/09/2026)',
    operator: 'Võ Văn Khải',
    processPid: 18492,
    memoryUsage: '480 MB',
    cpuUsage: '7.8%',
    targetUrl: 'https://facebook.com/adsmanager',
    proxy: {
      type: 'SOCKS5',
      host: '154.21.32.88',
      port: 1080,
      country: 'US',
      location: 'Los Angeles, California, US',
      exitIp: '154.21.32.88',
      latency: 45,
      dnsLeak: 'Bảo vệ an toàn (0 rò rỉ)',
      webrtcLeak: 'Đã ẩn IP thật'
    },
    fingerprintSnapshot: [
      { label: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36', category: 'Trình duyệt' },
      { label: 'Hệ điều hành ảo', value: 'Windows 11 Pro 64-bit (Build 22631)', category: 'Hệ thống' },
      { label: 'Card đồ họa (WebGL)', value: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11)', category: 'Đồ họa' },
      { label: 'Canvas Fingerprint', value: 'Noise Vector Hash: #A8F9C1 (Độ lệch 0.00314%)', category: 'Bảo mật' },
      { label: 'AudioContext Hash', value: 'Fake AudioBuffer Vector: #99B214', category: 'Bảo mật' },
      { label: 'Chính sách WebRTC', value: 'Disable Non-Proxied UDP (Ẩn IP thực tuyệt đối)', category: 'Mạng' },
      { label: 'Múi giờ hệ thống', value: 'America/New_York (UTC -05:00) theo IP Proxy', category: 'Vị trí' },
      { label: 'Vị trí Geolocation', value: 'Latitude: 34.0522, Longitude: -118.2437', category: 'Vị trí' },
      { label: 'Độ phân giải màn hình', value: '1920 x 1080 (Color Depth: 24-bit)', category: 'Màn hình' },
      { label: 'Phần cứng CPU & RAM', value: '8 Cores, 16 GB RAM Hardware Concurrency', category: 'Phần cứng' }
    ],
    cookiesLoaded: 24,
    cookiesSaved: 27,
    cookies: [
      { name: 'c_user', domain: '.facebook.com', value: '100084928192831', expires: '2027-09-07' },
      { name: 'xs', domain: '.facebook.com', value: '28%3Ax9b17F818a...92', expires: '2027-09-07' },
      { name: 'datr', domain: '.facebook.com', value: 'w9XZaB_471h_kQ81L', expires: '2028-01-01' },
      { name: 'sb', domain: '.facebook.com', value: 'k1_YaM728_vN', expires: '2027-09-07' },
      { name: 'wd', domain: '.facebook.com', value: '1920x960', expires: 'Session' }
    ],
    launchArgs: [
      '--disable-blink-features=AutomationControlled',
      '--proxy-server=socks5://154.21.32.88:1080',
      '--user-data-dir=C:\\Users\\vkhai\\AppData\\Local\\AntidetectBrowser\\Profiles\\prof-001',
      '--window-size=1920,1080',
      '--lang=en-US',
      '--no-first-run',
      '--password-store=basic'
    ],
    logs: [
      '[19:00:30] [CORE] Khởi tạo môi trường Chromium độc lập cho "Facebook Ads - Account 01"',
      '[19:00:30] [SECURITY] Đã vô hiệu hóa navigator.webdriver và tiêm stealth scripts chống bot',
      '[19:00:31] [FINGERPRINT] Đã tạo Canvas 2D Hash & WebGL noise giả lập card NVIDIA RTX 4070',
      '[19:00:31] [PROXY] Kết nối thành công tới SOCKS5: 154.21.32.88:1080 (Ping: 45ms, Vị trí: US)',
      '[19:00:32] [STORAGE] Khôi phục 24 cookies từ kho lưu trữ bí mật vào Profile Sandbox',
      '[19:00:32] [PROCESS] Cửa sổ trình duyệt đã mở thành công. Mã tiến trình PID: 18492',
      '[19:00:34] [URL] Người dùng truy cập: https://facebook.com/adsmanager',
      '[19:42:45] [EXIT] Đóng tiến trình an toàn. Đã đồng bộ 27 cookies về cơ sở dữ liệu.'
    ]
  },
  {
    id: 'run-002',
    profileId: 'prof-002',
    profileName: 'TikTok Seller Store VN',
    group: 'TikTok',
    status: 'running',
    statusLabel: 'Đang chạy',
    statusColor: '#10B981',
    browser: 'Chrome 128 (Windows 11)',
    startTime: '07/09/2026, 18:14:12',
    endTime: 'Đang hoạt động...',
    duration: '1 giờ 15 phút (Đang chạy)',
    dateGroup: 'Hôm nay (07/09/2026)',
    operator: 'Võ Văn Khải',
    processPid: 14210,
    memoryUsage: '365 MB',
    cpuUsage: '4.5%',
    targetUrl: 'https://seller-vn.tiktok.com',
    proxy: {
      type: 'HTTP',
      host: '113.161.44.12',
      port: 8080,
      country: 'VN',
      location: 'TP. Hồ Chí Minh, Việt Nam',
      exitIp: '113.161.44.12',
      latency: 18,
      dnsLeak: 'Bảo vệ an toàn (0 rò rỉ)',
      webrtcLeak: 'Đã ẩn IP thật'
    },
    fingerprintSnapshot: [
      { label: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36', category: 'Trình duyệt' },
      { label: 'Hệ điều hành ảo', value: 'Windows 11 Pro 64-bit', category: 'Hệ thống' },
      { label: 'Card đồ họa (WebGL)', value: 'ANGLE (Intel, Intel Iris Xe Graphics Direct3D11)', category: 'Đồ họa' },
      { label: 'Múi giờ hệ thống', value: 'Asia/Ho_Chi_Minh (UTC +07:00)', category: 'Vị trí' },
      { label: 'Ngôn ngữ trình duyệt', value: 'vi-VN,vi;q=0.9,en-US;q=0.8', category: 'Ngôn ngữ' }
    ],
    cookiesLoaded: 12,
    cookiesSaved: 14,
    cookies: [
      { name: 'sessionid', domain: '.tiktok.com', value: 'tk_sess_991823192', expires: '2027-01-01' },
      { name: 'tt_csrf_token', domain: '.tiktok.com', value: 'csrf_78129a_bc', expires: 'Session' }
    ],
    launchArgs: [
      '--disable-blink-features=AutomationControlled',
      '--proxy-server=http://113.161.44.12:8080',
      '--lang=vi-VN'
    ],
    logs: [
      '[18:14:12] [CORE] Khởi động Chromium cho hồ sơ TikTok Seller Store VN...',
      '[18:14:13] [NETWORK] Kết nối Proxy HTTP VNPT: 113.161.44.12:8080 (Ping: 18ms)',
      '[18:14:14] [PROCESS] Tiến trình PID 14210 hoạt động ổn định. Đã mở seller-vn.tiktok.com'
    ]
  },
  {
    id: 'run-003',
    profileId: 'prof-003',
    profileName: 'Crypto Airdrop Farming #03',
    group: 'Crypto',
    status: 'stopped',
    statusLabel: 'Đã dừng',
    statusColor: '#6B7280',
    browser: 'Chrome 128 (macOS Sonoma)',
    startTime: '07/09/2026, 16:30:00',
    endTime: '07/09/2026, 17:45:00',
    duration: '1 giờ 15 phút',
    dateGroup: 'Hôm nay (07/09/2026)',
    operator: 'Võ Văn Khải',
    processPid: 9812,
    memoryUsage: '520 MB',
    cpuUsage: '0%',
    targetUrl: 'https://binance.com/futures',
    proxy: {
      type: 'SOCKS5',
      host: '198.51.100.45',
      port: 9050,
      country: 'SG',
      location: 'Singapore Central',
      exitIp: '198.51.100.45',
      latency: 62,
      dnsLeak: 'Bảo vệ an toàn',
      webrtcLeak: 'Đã khóa IP'
    },
    fingerprintSnapshot: [
      { label: 'User-Agent', value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36', category: 'Trình duyệt' },
      { label: 'Hệ điều hành ảo', value: 'macOS Sonoma 14.5 (Apple Silicon M2 Pro)', category: 'Hệ thống' },
      { label: 'Card đồ họa (WebGL)', value: 'Apple M2 Pro Metal GPU Renderer', category: 'Đồ họa' },
      { label: 'Múi giờ hệ thống', value: 'Asia/Singapore (UTC +08:00)', category: 'Vị trí' }
    ],
    cookiesLoaded: 18,
    cookiesSaved: 18,
    cookies: [
      { name: 'bnc-uuid', domain: '.binance.com', value: 'uuid-crypto-9921', expires: '2028-01-01' }
    ],
    launchArgs: [
      '--disable-blink-features=AutomationControlled',
      '--proxy-server=socks5://198.51.100.45:9050'
    ],
    logs: [
      '[16:30:00] [CORE] Mở hồ sơ macOS M2 Pro cho Crypto Airdrop Farming #03...',
      '[16:30:02] [PROXY] Định tuyến qua Proxy Singapore 198.51.100.45:9050 (Ping: 62ms)',
      '[17:45:00] [STOP] Người dùng đã chủ động dừng phiên chạy. Đã lưu bộ nhớ đệm an toàn.'
    ]
  },
  {
    id: 'run-004',
    profileId: 'prof-004',
    profileName: 'Amazon Buyer Account UK',
    group: 'E-Commerce',
    status: 'completed',
    statusLabel: 'Hoàn thành',
    statusColor: '#10B981',
    browser: 'Chrome 128 (Windows 11)',
    startTime: '06/09/2026, 21:10:00',
    endTime: '06/09/2026, 22:40:00',
    duration: '1 giờ 30 phút',
    dateGroup: 'Hôm qua (06/09/2026)',
    operator: 'Võ Văn Khải',
    processPid: 11042,
    memoryUsage: '440 MB',
    cpuUsage: '0%',
    targetUrl: 'https://amazon.co.uk',
    proxy: {
      type: 'SOCKS5',
      host: '185.220.101.5',
      port: 1080,
      country: 'GB',
      location: 'London, Vương Quốc Anh',
      exitIp: '185.220.101.5',
      latency: 85,
      dnsLeak: 'Bảo vệ an toàn',
      webrtcLeak: 'Đã khóa IP'
    },
    fingerprintSnapshot: [
      { label: 'User-Agent', value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', category: 'Trình duyệt' },
      { label: 'Múi giờ hệ thống', value: 'Europe/London (UTC +01:00)', category: 'Vị trí' }
    ],
    cookiesLoaded: 32,
    cookiesSaved: 35,
    cookies: [
      { name: 'session-id', domain: '.amazon.co.uk', value: '259-8129182-99128', expires: '2027-01-01' }
    ],
    launchArgs: [],
    logs: [
      '[21:10:00] [CORE] Bắt đầu phiên duyệt Amazon UK với Proxy London',
      '[22:40:00] [EXIT] Phiên kết thúc thành công.'
    ]
  }
];

export const INITIAL_GROUPS = [
  { id: 'grp-fb', name: 'Facebook Ads', desc: 'Quản lý tài khoản quảng cáo Facebook Agency & BM', color: '#3B82F6' },
  { id: 'grp-tiktok', name: 'TikTok', desc: 'Hồ sơ tài khoản TikTok Shop & Creator Studio', color: '#EC4899' },
  { id: 'grp-crypto', name: 'Crypto', desc: 'Airdrop farming, Whitelist, Retroactive tasks', color: '#8B5CF6' },
  { id: 'grp-ecom', name: 'E-Commerce', desc: 'Amazon, Shopee, eBay Seller/Buyer accounts', color: '#F59E0B' },
];



