export const INITIAL_RULES = [
  { id: 'rule-1', pattern: 'tos*-up*.tiktokcdn.com/*', action: 'DIRECT', type: 'Video CDN', notes: 'Tải video TikTok đi thẳng máy thật', enabled: true },
  { id: 'rule-2', pattern: 'video-*.fbcdn.net/*', action: 'DIRECT', type: 'Video CDN', notes: 'Băng thông video Facebook Reels/Watch', enabled: true },
  { id: 'rule-3', pattern: '*.byteoversea.com/video/*', action: 'DIRECT', type: 'Media', notes: 'Máy chủ video phân phối ByteDance', enabled: true },
  { id: 'rule-4', pattern: 'api*.tiktokv.com/passport/*', action: 'PROXY', type: 'Auth API', notes: 'Bảo mật đăng nhập tài khoản', enabled: true },
  { id: 'rule-5', pattern: 'graph.facebook.com/v*/*', action: 'PROXY', type: 'Graph API', notes: 'API Facebook Ads & Trang', enabled: true },
  { id: 'rule-6', pattern: 'analytics.tiktok.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn thu thập vị trí và phân tích', enabled: true },
  { id: 'rule-7', pattern: '*.doubleclick.net/*', action: 'BLOCKED', type: 'Ad Tracker', notes: 'Chặn tracking quảng cáo rác', enabled: true },
  { id: 'rule-8', pattern: 'telemetry.google.com/*', action: 'BLOCKED', type: 'Telemetry', notes: 'Chặn telemetry hệ thống', enabled: true }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    time: '20:58:12.450',
    profile: 'TikTok Store US #01',
    method: 'POST',
    url: 'https://tos-va-up.tiktokcdn.com/upload/v2/chunk_part_098.mp4',
    domain: 'tos-va-up.tiktokcdn.com',
    sizeBytes: 18450000,
    sizeFormatted: '18.45 MB',
    type: 'Media',
    route: 'DIRECT',
    status: 200,
    latency: 42
  },
  {
    id: 'req-2',
    time: '20:58:11.820',
    profile: 'TikTok Store US #01',
    method: 'POST',
    url: 'https://api16-normal-c-useast1a.tiktokv.com/passport/user/login_status/',
    domain: 'tiktokv.com',
    sizeBytes: 4200,
    sizeFormatted: '4.2 KB',
    type: 'API',
    route: 'PROXY',
    status: 200,
    latency: 85
  },
  {
    id: 'req-3',
    time: '20:58:10.140',
    profile: 'Facebook Ads - Account 01',
    method: 'POST',
    url: 'https://analytics.tiktok.com/api/v2/track_telemetry_batch',
    domain: 'analytics.tiktok.com',
    sizeBytes: 2800,
    sizeFormatted: '2.8 KB',
    type: 'Telemetry',
    route: 'BLOCKED',
    status: 403,
    latency: 2
  },
  {
    id: 'req-4',
    time: '20:58:08.660',
    profile: 'Facebook Ads - Account 01',
    method: 'GET',
    url: 'https://video-sin6-1.fbcdn.net/v/t39.102/reel_hd_720p_segment3.mp4',
    domain: 'video-sin6-1.fbcdn.net',
    sizeBytes: 12200000,
    sizeFormatted: '12.20 MB',
    type: 'Media',
    route: 'DIRECT',
    status: 200,
    latency: 35
  },
  {
    id: 'req-5',
    time: '20:58:06.310',
    profile: 'Crypto Airdrop #03',
    method: 'POST',
    url: 'https://graph.facebook.com/v19.0/act_88912/campaigns',
    domain: 'graph.facebook.com',
    sizeBytes: 3600,
    sizeFormatted: '3.6 KB',
    type: 'API',
    route: 'PROXY',
    status: 200,
    latency: 110
  },
  {
    id: 'req-6',
    time: '20:58:04.990',
    profile: 'Crypto Airdrop #03',
    method: 'GET',
    url: 'https://adservice.google.com/adsid/integrator.sync',
    domain: 'adservice.google.com',
    sizeBytes: 1500,
    sizeFormatted: '1.5 KB',
    type: 'Ad Tracker',
    route: 'BLOCKED',
    status: 403,
    latency: 1
  }
];
