export const BACKUP_PROVIDERS = [
  {
    id: 'cloudflare_r2',
    name: 'Cloudflare R2',
    category: 'S3-Compatible',
    tag: 'Khuyên dùng • 0đ Egress',
    tagColor: '#EA580C',
    tagBg: '#FFF7ED',
    description: 'Miễn phí 10GB/tháng, không tính phí băng thông tải về (Free Egress). Cực kỳ tối ưu cho MMO & Devs.',
    iconType: 'cloudflare',
    color: '#F97316',
    defaultEndpoint: 'https://<ACCOUNT_ID>.r2.cloudflarestorage.com',
    fields: [
      { key: 'accountId', label: 'Cloudflare Account ID', placeholder: 'e.g. 7c94e82f10b84c68832a89c2567...', required: true },
      { key: 'accessKeyId', label: 'Access Key ID', placeholder: 'Nhập R2 Token Access Key ID', required: true, secret: true },
      { key: 'secretAccessKey', label: 'Secret Access Key', placeholder: 'Nhập R2 Secret Key', required: true, secret: true },
      { key: 'bucketName', label: 'Bucket Name', placeholder: 'antidetect-backups', required: true },
      { key: 'pathPrefix', label: 'Thư mục tiền tố (Path Prefix)', placeholder: 'profiles_backup/', defaultValue: 'profiles/' }
    ],
    helpUrl: 'https://dash.cloudflare.com/?to=/:account/r2'
  },
  {
    id: 'telegram',
    name: 'Telegram Storage',
    category: 'QR Login & Bot Token',
    tag: 'QR Code • Bot Token • 0đ',
    tagColor: '#0284C7',
    tagBg: '#F0F9FF',
    description: 'Đăng nhập quét mã QR từ điện thoại hoặc sử dụng Telegram Bot Token để tự động lưu file .agbackup vào Saved Messages / Channel bí mật.',
    iconType: 'telegram',
    color: '#0ea5e9',
    modes: [
      { id: 'qr_login', label: 'Quét mã QR (QR Code Login)', desc: 'Đăng nhập tài khoản Telegram cá nhân' },
      { id: 'bot_token', label: 'Telegram Bot Token', desc: 'Dùng Bot Token & Channel ID từ @BotFather' }
    ],
    fields: [
      { key: 'botToken', label: 'Telegram Bot Token (@BotFather)', placeholder: '123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ', required: true, secret: true },
      { key: 'chatId', label: 'Chat ID / Channel ID', placeholder: 'e.g. -1001234567890 hoặc your_chat_id', required: true },
      { key: 'notifyOnBackup', label: 'Gửi tin nhắn thông báo kèm tóm tắt dung lượng', type: 'checkbox', defaultValue: true }
    ],
    helpText: 'Hỗ trợ quét mã QR để lưu vào Saved Messages hoặc cấu hình Bot Token để đẩy vào Private Channel.'
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    category: 'Google Workspace Cloud',
    tag: 'OAuth • Refresh Token • 15GB',
    tagColor: '#16A34A',
    tagBg: '#F0FDF4',
    description: 'Mở Google để đăng nhập cấp quyền 1-click, sử dụng Refresh Token dài hạn hoặc cấu hình Google Client ID / Service Account.',
    iconType: 'google_drive',
    color: '#22C55E',
    modes: [
      { id: 'oauth_browser', label: 'Đăng nhập Google cấp quyền', desc: 'Ủy quyền nhanh 1-click qua trình duyệt' },
      { id: 'refresh_token', label: 'Sử dụng Refresh Token', desc: 'Refresh Token dài hạn không hết hạn' },
      { id: 'client_id', label: 'Google Client ID / Service Account', desc: 'Dành cho Google Cloud Console & Service Account' }
    ],
    fields: [
      { key: 'clientId', label: 'Google Client ID', placeholder: 'xxxxx.apps.googleusercontent.com', required: true },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'GOCSPX-xxxxxxxxxxxxxx', required: true, secret: true },
      { key: 'refreshToken', label: 'Refresh Token', placeholder: '1//0xxxxxxxxxxxxxxxxxxxxxxxx', secret: true },
      { key: 'folderId', label: 'Google Drive Folder ID (Tùy chọn)', placeholder: 'Để trống để lưu tại thư mục gốc Drive' }
    ],
    helpUrl: 'https://console.cloud.google.com/apis/credentials'
  },
  {
    id: 'aws_s3',
    name: 'Amazon S3',
    category: 'Enterprise Object Storage',
    tag: 'Chuẩn quốc tế • Bền vững 99.99%',
    tagColor: '#D97706',
    tagBg: '#FFFBEB',
    description: 'Dịch vụ lưu trữ đối tượng tiêu chuẩn toàn cầu của AWS. Thích hợp cho doanh nghiệp cần độ an toàn dữ liệu cao.',
    iconType: 'aws',
    color: '#F59E0B',
    fields: [
      { key: 'accessKeyId', label: 'AWS Access Key ID', placeholder: 'AKIAIOSFODNN7EXAMPLE', required: true, secret: true },
      { key: 'secretAccessKey', label: 'AWS Secret Access Key', placeholder: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', required: true, secret: true },
      { key: 'region', label: 'AWS Region', placeholder: 'ap-southeast-1 (Singapore)', defaultValue: 'ap-southeast-1', required: true },
      { key: 'bucketName', label: 'S3 Bucket Name', placeholder: 'my-antidetect-vault', required: true },
      { key: 'pathPrefix', label: 'Path Prefix', defaultValue: 'backups/' }
    ]
  },
  {
    id: 'bizfly',
    name: 'BizflyCloud VN',
    category: 'Việt Nam Simple Storage',
    tag: 'Việt Nam DC • Tốc độ cao',
    tagColor: '#7C3AED',
    tagBg: '#F5F3FF',
    description: 'Lưu trữ Simple Storage đặt tại Data Center Việt Nam (Hà Nội & TP.HCM). Không lo nghẽn mạng hay đứt cáp quang biển.',
    iconType: 'bizfly',
    color: '#8B5CF6',
    defaultEndpoint: 'https://hn.ss.bizflycloud.vn',
    fields: [
      { key: 'endpoint', label: 'Endpoint URL', placeholder: 'https://hn.ss.bizflycloud.vn hoặc https://hcm.ss.bizflycloud.vn', defaultValue: 'https://hn.ss.bizflycloud.vn', required: true },
      { key: 'accessKey', label: 'Bizfly Access Key', placeholder: 'Nhập Access Key từ Bizfly Portal', required: true, secret: true },
      { key: 'secretKey', label: 'Bizfly Secret Key', placeholder: 'Nhập Secret Key', required: true, secret: true },
      { key: 'bucketName', label: 'Bucket Name', placeholder: 'antidetect-profiles', required: true }
    ],
    helpUrl: 'https://manage.bizflycloud.vn/simple-storage'
  },
  {
    id: 'cloudfly',
    name: 'Cloudfly VN',
    category: 'Việt Nam S3 Storage',
    tag: 'Nội địa • Chi phí tiết kiệm',
    tagColor: '#2563EB',
    tagBg: '#EFF6FF',
    description: 'Nền tảng Cloud Storage Việt Nam chuẩn S3 với chi phí cực kỳ tiết kiệm, hạ tầng tối ưu cho anh em làm Ads/Automation.',
    iconType: 'cloudfly',
    color: '#3B82F6',
    defaultEndpoint: 'https://s3.cloudfly.vn',
    fields: [
      { key: 'endpoint', label: 'S3 Endpoint', defaultValue: 'https://s3.cloudfly.vn', required: true },
      { key: 'accessKey', label: 'Access Key', placeholder: 'Nhập Access Key', required: true, secret: true },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'Nhập Secret Key', required: true, secret: true },
      { key: 'bucketName', label: 'Bucket Name', placeholder: 'mmo-backup-vault', required: true }
    ],
    helpUrl: 'https://cloudfly.vn/object-storage'
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean Spaces',
    category: 'S3-Compatible',
    tag: 'Data Center Singapore • 250GB',
    tagColor: '#0284C7',
    tagBg: '#F0F9FF',
    description: 'Lưu trữ đám mây Spaces cực nhanh tại Node SGP1 (Singapore). Tích hợp sẵn CDN phân phối toàn cầu.',
    iconType: 'digitalocean',
    color: '#0080FF',
    defaultEndpoint: 'https://sgp1.digitaloceanspaces.com',
    fields: [
      { key: 'region', label: 'Region (sgp1, nyc3, ams3...)', defaultValue: 'sgp1', required: true },
      { key: 'accessKey', label: 'Spaces Access Key', placeholder: 'DO00xxxxxxxxxxxxxxxx', required: true, secret: true },
      { key: 'secretKey', label: 'Spaces Secret Key', placeholder: 'Nhập Spaces Secret Key', required: true, secret: true },
      { key: 'bucketName', label: 'Space / Bucket Name', placeholder: 'antidetect-backups', required: true }
    ]
  },
  {
    id: 'wasabi',
    name: 'Wasabi Storage',
    category: 'Hot Cloud Storage',
    tag: 'Rẻ hơn 80% AWS • No API Fees',
    tagColor: '#059669',
    tagBg: '#ECFDF5',
    description: 'Dịch vụ Hot Cloud Storage tương thích hoàn toàn AWS S3 nhưng không tính phí truy xuất API và băng thông tải về.',
    iconType: 'wasabi',
    color: '#10B981',
    defaultEndpoint: 'https://s3.ap-northeast-1.wasabisys.com',
    fields: [
      { key: 'endpoint', label: 'Wasabi Endpoint', defaultValue: 'https://s3.ap-northeast-1.wasabisys.com', required: true },
      { key: 'accessKey', label: 'Wasabi Access Key', placeholder: 'Nhập Wasabi Access Key', required: true, secret: true },
      { key: 'secretKey', label: 'Wasabi Secret Key', placeholder: 'Nhập Wasabi Secret Key', required: true, secret: true },
      { key: 'bucketName', label: 'Wasabi Bucket', placeholder: 'antidetect-profiles', required: true }
    ]
  },
  {
    id: 'minio',
    name: 'MinIO On-Premise',
    category: 'Self-Hosted S3',
    tag: 'Máy chủ riêng • NAS / VPS',
    tagColor: '#C026D3',
    tagBg: '#FDF4FF',
    description: 'Chạy trên máy chủ riêng (Private Server / Docker / TrueNAS / Synology). Tuyệt đối riêng tư, 100% trong mạng nội bộ của bạn.',
    iconType: 'minio',
    color: '#C72C48',
    defaultEndpoint: 'http://192.168.1.100:9000',
    fields: [
      { key: 'endpoint', label: 'MinIO Server URL', placeholder: 'http://192.168.1.100:9000 hoặc https://s3.yourdomain.com', defaultValue: 'http://localhost:9000', required: true },
      { key: 'accessKey', label: 'MinIO Root / Access Key', placeholder: 'minioadmin', required: true, secret: true },
      { key: 'secretKey', label: 'MinIO Secret Key', placeholder: 'minioadmin', required: true, secret: true },
      { key: 'bucketName', label: 'Bucket Name', placeholder: 'antidetect-vault', required: true },
      { key: 'useSsl', label: 'Bật giao thức bảo mật SSL (HTTPS)', type: 'checkbox', defaultValue: false }
    ]
  }
];

export const INITIAL_MOCK_HISTORY = [
  {
    id: 'bk-01',
    fileName: 'full_backup_2026-09-06_2200.agbackup',
    providerId: 'cloudflare_r2',
    providerName: 'Cloudflare R2',
    size: '14.6 MB',
    profileCount: 24,
    proxyCount: 12,
    createdAt: '2026-09-06 22:00:15',
    status: 'success',
    encrypted: true
  },
  {
    id: 'bk-02',
    fileName: 'telegram_quick_sync_2026-09-05.zip',
    providerId: 'telegram',
    providerName: 'Telegram Bot (MMO Secret Channel)',
    size: '11.2 MB',
    profileCount: 18,
    proxyCount: 8,
    createdAt: '2026-09-05 18:30:42',
    status: 'success',
    encrypted: false
  },
  {
    id: 'bk-03',
    fileName: 'vietnam_bizfly_daily_2026-09-04.agbackup',
    providerId: 'bizfly',
    providerName: 'BizflyCloud VN',
    size: '13.8 MB',
    profileCount: 22,
    proxyCount: 10,
    createdAt: '2026-09-04 02:00:00',
    status: 'success',
    encrypted: true
  }
];
