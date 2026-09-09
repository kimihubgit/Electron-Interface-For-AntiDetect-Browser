import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Puzzle,
  Plus,
  Trash2,
  ExternalLink,
  FolderOpen,
  RotateCw,
  X,
  Check,
  FileArchive,
  CheckCircle2,
  Search,
  ShoppingBag,
  Star,
  Sparkles
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

// Default initial extensions in Manager
const DEFAULT_EXTENSIONS = [
  {
    id: 'ext-omocaptcha',
    name: 'OMOCaptcha: Auto solve captcha',
    extId: 'jahglfdjihedpmljkighddneoejbkmpb',
    version: '1.7.8',
    category: 'tools',
    sourceType: 'file',
    description: 'Tự động giải mã các loại Captcha hình ảnh, reCAPTCHA v2, v3, hCaptcha và Turnstile nhanh chóng.',
    iconColor: '#8B5CF6',
    author: 'omocaptcha.com',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com',
    assignedProfiles: 12,
    size: '2.4 MB'
  },
  {
    id: 'ext-metamask',
    name: 'MetaMask',
    extId: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
    version: '11.16.2',
    category: 'crypto',
    sourceType: 'store',
    description: 'Ví Ethereum và Web3 hàng đầu để tương tác với DApps, smart contracts và token đa chuỗi.',
    iconColor: '#F6851B',
    author: 'metamask.io',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    assignedProfiles: 8,
    size: '18.4 MB'
  },
  {
    id: 'ext-phantom',
    name: 'Phantom Wallet',
    extId: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
    version: '24.18.0',
    category: 'crypto',
    sourceType: 'store',
    description: 'Ví tiền điện tử thân thiện và an toàn cho hệ sinh thái Solana, Ethereum và Bitcoin.',
    iconColor: '#AB9FF2',
    author: 'phantom.app',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    assignedProfiles: 6,
    size: '14.2 MB'
  },
  {
    id: 'ext-cookie-editor',
    name: 'Cookie-Editor',
    extId: 'hlkenndednhfkekhgcdicdfddnkalmdm',
    version: '1.12.2',
    category: 'cookie',
    sourceType: 'store',
    description: 'Xem, chỉnh sửa, tạo và xuất nhập Cookie nhanh chóng dạng JSON/Netscape cho profile.',
    iconColor: '#3B82F6',
    author: 'cookie-editor.cgagnier.ca',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm',
    assignedProfiles: 12,
    size: '1.8 MB'
  },
  {
    id: 'ext-switchyomega',
    name: 'Proxy SwitchyOmega',
    extId: 'padekgcemlokbadohgkifijomclgjgif',
    version: '2.5.21',
    category: 'proxy',
    sourceType: 'file',
    description: 'Quản lý và chuyển đổi nhiều proxy IP HTTP/HTTPS/SOCKS5 linh hoạt và nhanh chóng.',
    iconColor: '#10B981',
    author: 'FelisCatus',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif',
    assignedProfiles: 10,
    size: '2.4 MB'
  },
  {
    id: 'ext-canvas-defender',
    name: 'Canvas Defender',
    extId: 'oboonakemofpalcgghocfoadofidjkkk',
    version: '1.2.1',
    category: 'security',
    sourceType: 'file',
    description: 'Tạo lớp nhiễu ngẫu nhiên giả lập bảo vệ dấu vân tay HTML5 Canvas fingerprinting.',
    iconColor: '#8B5CF6',
    author: 'multilogin.com',
    enabled: false,
    storeUrl: 'https://chromewebstore.google.com',
    assignedProfiles: 4,
    size: '950 KB'
  },
  {
    id: 'ext-authenticator',
    name: 'Authenticator (2FA)',
    extId: 'bhghoamapcdpbohkgfdflcntqdmhhlfa',
    version: '7.1.1',
    category: 'tools',
    sourceType: 'store',
    description: 'Tạo mã xác thực 2 bước (2-Factor Authentication TOTP) trực tiếp trong trình duyệt.',
    iconColor: '#EF4444',
    author: 'authenticator.cc',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com/detail/authenticator/bhghoamapcdpbohkgfdflcntqdmhhlfa',
    assignedProfiles: 9,
    size: '3.1 MB'
  },
  {
    id: 'ext-webrtc-control',
    name: 'WebRTC Control',
    extId: 'fjkmabmdepjfammlhpkfcmmpejnlomfp',
    version: '0.3.5',
    category: 'security',
    sourceType: 'file',
    description: 'Kiểm soát và vô hiệu hóa WebRTC rò rỉ địa chỉ IP thật (IP Leak Protection).',
    iconColor: '#06B6D4',
    author: 'ray-lothian',
    enabled: true,
    storeUrl: 'https://chromewebstore.google.com',
    assignedProfiles: 12,
    size: '620 KB'
  }
];

// Rich Curated Extension Store Catalog
const STORE_CATALOG = [
  {
    id: 'store-metamask',
    name: 'MetaMask',
    extId: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
    version: '11.16.2',
    category: 'crypto',
    description: 'Ví Ethereum và Web3 hàng đầu để tương tác với DApps, smart contracts và token đa chuỗi.',
    iconColor: '#F6851B',
    author: 'metamask.io',
    rating: 4.8,
    users: '10,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    size: '18.4 MB'
  },
  {
    id: 'store-phantom',
    name: 'Phantom Wallet',
    extId: 'bfnaelmomeimhlpmgjnjophhpkkoljpa',
    version: '24.18.0',
    category: 'crypto',
    description: 'Ví tiền điện tử thân thiện và an toàn cho hệ sinh thái Solana, Ethereum và Bitcoin.',
    iconColor: '#AB9FF2',
    author: 'phantom.app',
    rating: 4.9,
    users: '5,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa',
    size: '14.2 MB'
  },
  {
    id: 'store-okx',
    name: 'OKX Web3 Wallet',
    extId: 'mcohilncbfahbmgdjkbpemancgipnpbh',
    version: '3.12.0',
    category: 'crypto',
    description: 'Ví đa chuỗi hỗ trợ hơn 80+ blockchain, DEX aggregator và NFT marketplace bảo mật cao.',
    iconColor: '#0F172A',
    author: 'okx.com',
    rating: 4.8,
    users: '2,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemancgipnpbh',
    size: '22.1 MB'
  },
  {
    id: 'store-rabby',
    name: 'Rabby Wallet',
    extId: 'acmacodkjbdgmoleebolmdjonilkdbch',
    version: '0.92.74',
    category: 'crypto',
    description: 'Ví Web3 chuyên nghiệp cho dân cày Airdrop & DeFi, tích hợp quét bảo mật hợp đồng trước khi ký.',
    iconColor: '#8B5CF6',
    author: 'rabby.io',
    rating: 4.9,
    users: '800,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/rabby-wallet/acmacodkjbdgmoleebolmdjonilkdbch',
    size: '16.5 MB'
  },
  {
    id: 'store-tronlink',
    name: 'TronLink',
    extId: 'ibnejdfjmmkpcnlpebklmnkoeoihofec',
    version: '4.1.4',
    category: 'crypto',
    description: 'Ví TRON chính thức, hỗ trợ chuyển nhận TRX, USDT TRC-20 và các hợp đồng thông minh TRON.',
    iconColor: '#DC2626',
    author: 'tronlink.org',
    rating: 4.7,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec',
    size: '11.8 MB'
  },
  {
    id: 'store-keplr',
    name: 'Keplr Wallet',
    extId: 'dmkamcknogkgcdfhhbddcghachkejeap',
    version: '0.12.98',
    category: 'crypto',
    description: 'Ví liên chuỗi hàng đầu cho hệ sinh thái Cosmos IBC, Osmosis, Celestia, TIA và Injective.',
    iconColor: '#3B82F6',
    author: 'keplr.app',
    rating: 4.8,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
    size: '12.4 MB'
  },
  {
    id: 'store-sui',
    name: 'Sui Wallet',
    extId: 'opcgpfmipidbgpenhmajoajpbobppdil',
    version: '24.8.2',
    category: 'crypto',
    description: 'Ví chính thức của Sui Network, quản lý tài sản SUI, tham gia staking và tương tác dApps Move.',
    iconColor: '#38BDF8',
    author: 'mystenlabs.com',
    rating: 4.8,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
    size: '9.8 MB'
  },
  {
    id: 'store-coin98',
    name: 'Coin98 Super Wallet',
    extId: 'aeachknmefphepccionboohckonoeemg',
    version: '8.4.1',
    category: 'crypto',
    description: 'Cổng kết nối Web3 đa chuỗi hàng đầu châu Á, hỗ trợ 70+ blockchain và hoán đổi token tự động.',
    iconColor: '#F59E0B',
    author: 'coin98.com',
    rating: 4.7,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg',
    size: '19.2 MB'
  },
  {
    id: 'store-omocaptcha',
    name: 'OMOCaptcha: Auto solve captcha',
    extId: 'jahglfdjihedpmljkighddneoejbkmpb',
    version: '1.7.8',
    category: 'captcha',
    description: 'Tự động giải mã các loại Captcha hình ảnh, reCAPTCHA v2, v3, hCaptcha và Cloudflare Turnstile.',
    iconColor: '#7C3AED',
    author: 'omocaptcha.com',
    rating: 4.9,
    users: '200,000+',
    storeUrl: 'https://chromewebstore.google.com',
    size: '2.4 MB'
  },
  {
    id: 'store-twocaptcha',
    name: '2Captcha Solver',
    extId: 'ifibfemgeogfhoebkmheepdoosmhpkeb',
    version: '3.6.1',
    category: 'captcha',
    description: 'Tiện ích tự động bypass và giải reCAPTCHA, FunCaptcha, Geetest, Arkose Labs qua API 2captcha.',
    iconColor: '#EA580C',
    author: '2captcha.com',
    rating: 4.7,
    users: '600,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/2captcha-solver/ifibfemgeogfhoebkmheepdoosmhpkeb',
    size: '3.2 MB'
  },
  {
    id: 'store-buster',
    name: 'Buster: Captcha Solver for Humans',
    extId: 'mpbjkejclgfgadiemmefgebjfoehiphp',
    version: '2.0.1',
    category: 'captcha',
    description: 'Giải reCAPTCHA âm thanh bằng nhận diện giọng nói tự động, tiết kiệm thời gian vượt rào cản.',
    iconColor: '#059669',
    author: 'Armin Sebastian',
    rating: 4.6,
    users: '800,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/buster-captcha-solver-for/mpbjkejclgfgadiemmefgebjfoehiphp',
    size: '1.5 MB'
  },
  {
    id: 'store-tampermonkey',
    name: 'Tampermonkey',
    extId: 'dhdgffkkebhmkfjojejmpbldmpobfkfo',
    version: '5.1.1',
    category: 'automation',
    description: 'Trình quản lý Userscript phổ biến nhất, cho phép chạy kịch bản JS tự động hóa trên mọi trang web.',
    iconColor: '#1E293B',
    author: 'tampermonkey.net',
    rating: 4.8,
    users: '10,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo',
    size: '4.2 MB'
  },
  {
    id: 'store-cookie-editor',
    name: 'Cookie-Editor',
    extId: 'hlkenndednhfkekhgcdicdfddnkalmdm',
    version: '1.12.2',
    category: 'cookie',
    description: 'Xem, chỉnh sửa, tạo và xuất nhập Cookie nhanh chóng dạng JSON/Netscape cho profile antidetect.',
    iconColor: '#3B82F6',
    author: 'cookie-editor.cgagnier.ca',
    rating: 4.9,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm',
    size: '1.8 MB'
  },
  {
    id: 'store-editthiscookie',
    name: 'EditThisCookie',
    extId: 'fngmhnnpilhplaeedifhccceomclgfbg',
    version: '1.6.3',
    category: 'cookie',
    description: 'Tiện ích quản trị cookie kinh điển, lọc cookie theo domain, bảo vệ và khóa cookie phiên.',
    iconColor: '#D97706',
    author: 'editthiscookie.com',
    rating: 4.6,
    users: '3,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg',
    size: '1.6 MB'
  },
  {
    id: 'store-authenticator',
    name: 'Authenticator (2FA)',
    extId: 'bhghoamapcdpbohkgfdflcntqdmhhlfa',
    version: '7.1.1',
    category: 'cookie',
    description: 'Tạo mã xác thực 2 bước (2-Factor Authentication TOTP) trực tiếp trong trình duyệt.',
    iconColor: '#EF4444',
    author: 'authenticator.cc',
    rating: 4.9,
    users: '4,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/authenticator/bhghoamapcdpbohkgfdflcntqdmhhlfa',
    size: '3.1 MB'
  },
  {
    id: 'store-switchyomega',
    name: 'Proxy SwitchyOmega',
    extId: 'padekgcemlokbadohgkifijomclgjgif',
    version: '2.5.21',
    category: 'proxy',
    description: 'Quản lý và chuyển đổi nhiều proxy IP HTTP/HTTPS/SOCKS5 linh hoạt và nhanh chóng.',
    iconColor: '#10B981',
    author: 'FelisCatus',
    rating: 4.7,
    users: '2,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif',
    size: '2.4 MB'
  },
  {
    id: 'store-canvas-defender',
    name: 'Canvas Defender',
    extId: 'oboonakemofpalcgghocfoadofidjkkk',
    version: '1.2.1',
    category: 'proxy',
    description: 'Tạo lớp nhiễu ngẫu nhiên giả lập bảo vệ dấu vân tay HTML5 Canvas fingerprinting.',
    iconColor: '#8B5CF6',
    author: 'multilogin.com',
    rating: 4.6,
    users: '300,000+',
    storeUrl: 'https://chromewebstore.google.com',
    size: '950 KB'
  },
  {
    id: 'store-webrtc-control',
    name: 'WebRTC Control',
    extId: 'fjkmabmdepjfammlhpkfcmmpejnlomfp',
    version: '0.3.5',
    category: 'proxy',
    description: 'Kiểm soát và vô hiệu hóa WebRTC rò rỉ địa chỉ IP thật (IP Leak Protection).',
    iconColor: '#06B6D4',
    author: 'ray-lothian',
    rating: 4.8,
    users: '400,000+',
    storeUrl: 'https://chromewebstore.google.com',
    size: '620 KB'
  },
  {
    id: 'store-user-agent-switcher',
    name: 'User-Agent Switcher and Manager',
    extId: 'bhchdhfcdfanioanflhijafelbcddgah',
    version: '0.5.1',
    category: 'proxy',
    description: 'Tùy biến User-Agent theo hàng trăm thiết bị di động, desktop, tablet và OS khác nhau.',
    iconColor: '#F59E0B',
    author: 'ray-lothian',
    rating: 4.8,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/user-agent-switcher-and-m/bhchdhfcdfanioanflhijafelbcddgah',
    size: '1.9 MB'
  },
  {
    id: 'store-ublock',
    name: 'uBlock Origin',
    extId: 'cjpalhdlnbpafiamejdnhcphjbkeiagm',
    version: '1.58.0',
    category: 'proxy',
    description: 'Trình chặn quảng cáo và mã theo dõi siêu nhẹ, tiết kiệm RAM và CPU tối đa khi chạy nhiều profile.',
    iconColor: '#991B1B',
    author: 'Raymond Hill',
    rating: 4.9,
    users: '30,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm',
    size: '3.8 MB'
  },
  {
    id: 'store-fb-pixel',
    name: 'Facebook Pixel Helper',
    extId: 'fdgfkebogiimcoedlicjlajpkdmockpc',
    version: '2.2.14',
    category: 'ads',
    description: 'Kiểm tra và khắc phục sự cố cài đặt Facebook Pixel, sự kiện chuyển đổi Event Tracking cho Ads.',
    iconColor: '#1877F2',
    author: 'Meta Platforms',
    rating: 4.5,
    users: '2,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc',
    size: '1.2 MB'
  },
  {
    id: 'store-tiktok-pixel',
    name: 'TikTok Pixel Helper',
    extId: 'aelgobnahiehhfhkfdbimnejnflimcnf',
    version: '2.1.2',
    category: 'ads',
    description: 'Công cụ gỡ lỗi và kiểm tra hoạt động TikTok Pixel cho các chiến dịch quảng cáo TikTok Ads.',
    iconColor: '#0F172A',
    author: 'TikTok Pte. Ltd.',
    rating: 4.6,
    users: '400,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/tiktok-pixel-helper/aelgobnahiehhfhkfdbimnejnflimcnf',
    size: '980 KB'
  },
  {
    id: 'store-similarweb',
    name: 'Similarweb - Traffic & Ranking',
    extId: 'hoklmmgfnpapgjgcpechhaamimifchmp',
    version: '7.1.4',
    category: 'ads',
    description: 'Phân tích lưu lượng truy cập web, thứ hạng domain và nguồn traffic của đối thủ cạnh tranh.',
    iconColor: '#2563EB',
    author: 'SimilarWeb Ltd.',
    rating: 4.6,
    users: '1,000,000+',
    storeUrl: 'https://chromewebstore.google.com/detail/similarweb-traffic-rank-w/hoklmmgfnpapgjgcpechhaamimifchmp',
    size: '4.5 MB'
  }
];

export default function ExtensionsPage() {
  const { profiles = [], addLog, showToast } = useBrowser();

  // Full-page Store display: false = My Extensions Manager, true = Dedicated Store Page
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Extensions in Manager, persisted to localStorage
  const [extensions, setExtensions] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_installed_extensions_v2');
      return saved ? JSON.parse(saved) : DEFAULT_EXTENSIONS;
    } catch {
      return DEFAULT_EXTENSIONS;
    }
  });

  // Store search and category filters
  const [storeSearch, setStoreSearch] = useState('');
  const [storeCategory, setStoreCategory] = useState('all');

  // Unified "Cài extension thủ công" modal state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSource, setInstallSource] = useState('file'); // 'file' | 'store'
  const [installFile, setInstallFile] = useState(null);
  const [storeUrlInput, setStoreUrlInput] = useState('');

  // "Cập nhật extension" modal state
  const [updateTargetExt, setUpdateTargetExt] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);

  const fileInputRef = useRef(null);
  const updateFileInputRef = useRef(null);

  // Sync extensions to localStorage
  useEffect(() => {
    localStorage.setItem('antidetect_installed_extensions_v2', JSON.stringify(extensions));
  }, [extensions]);

  // Set of installed extension IDs or extIds to check if already in manager
  const installedExtIds = useMemo(() => {
    return new Set(extensions.map(e => e.extId || e.name.toLowerCase()));
  }, [extensions]);

  // Filtered store extensions
  const filteredStoreExtensions = useMemo(() => {
    return STORE_CATALOG.filter(item => {
      const matchesSearch = !storeSearch.trim() ||
        item.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(storeSearch.toLowerCase()) ||
        item.author.toLowerCase().includes(storeSearch.toLowerCase());

      const matchesCat = storeCategory === 'all' || item.category === storeCategory;
      return matchesSearch && matchesCat;
    });
  }, [storeSearch, storeCategory]);

  // Toggle extension enabled
  const handleToggle = (id) => {
    setExtensions(prev => prev.map(ext => {
      if (ext.id === id) {
        const nextState = !ext.enabled;
        addLog?.(`${nextState ? 'Bật' : 'Tắt'} tiện ích "${ext.name}"`, nextState ? 'success' : 'info');
        if (showToast) showToast(`${nextState ? 'Đã bật' : 'Đã tắt'} tiện ích "${ext.name}"`, 'info');
        return { ...ext, enabled: nextState };
      }
      return ext;
    }));
  };

  // Open extension folder
  const handleOpenFolder = (ext) => {
    const fakePath = `C:\\Users\\AppData\\Local\\AntidetectBrowser\\extensions\\${ext.id}`;
    if (window.electronAPI?.openPath) {
      window.electronAPI.openPath(fakePath);
    }
    addLog?.(`Đang mở thư mục tiện ích: "${ext.name}" (${fakePath})`, 'info');
    alert(`📂 Đã mở thư mục chứa tiện ích:\n${fakePath}\n\n(Tất cả manifest, icons và script của "${ext.name}" được lưu trữ tại đây)`);
  };

  // Delete extension from Manager
  const handleDelete = (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn gỡ bỏ tiện ích "${name}" khỏi toàn bộ profile?`)) {
      setExtensions(prev => prev.filter(ext => ext.id !== id));
      addLog?.(`Đã gỡ bỏ tiện ích "${name}"`, 'warning');
      if (showToast) showToast(`Đã gỡ bỏ tiện ích "${name}"`, 'info');
    }
  };

  // ── CORE FEATURE: ADD EXTENSION FROM STORE STRAIGHT TO MANAGER ──
  const handleAddFromStore = (storeItem) => {
    // Check if already installed
    if (extensions.some(e => e.extId === storeItem.extId || e.name.toLowerCase() === storeItem.name.toLowerCase())) {
      if (showToast) showToast(`Tiện ích "${storeItem.name}" đã có sẵn trong danh sách quản lý!`, 'info');
      return;
    }

    const newExt = {
      id: `ext-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: storeItem.name,
      extId: storeItem.extId,
      version: storeItem.version,
      category: storeItem.category,
      sourceType: 'store',
      description: storeItem.description,
      iconColor: storeItem.iconColor,
      author: storeItem.author,
      enabled: true,
      storeUrl: storeItem.storeUrl,
      assignedProfiles: profiles.length,
      size: storeItem.size
    };

    setExtensions([newExt, ...extensions]);
    addLog?.(`Đã thêm tiện ích "${storeItem.name}" từ Cửa hàng Extension vào quản lý!`, 'success');
    if (showToast) showToast(`Đã thêm thành công "${storeItem.name}" vào Quản lý tiện ích!`, 'success');
  };

  // Handle Manual Modal Install Submission
  const handleInstallSubmit = (e) => {
    e.preventDefault();
    if (installSource === 'file') {
      if (!installFile) return;
      const cleanName = installFile.name.replace(/\.(zip|crx)$/i, '');
      const newExt = {
        id: `ext-local-${Date.now()}`,
        name: cleanName,
        extId: Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join(''),
        version: '1.0.0',
        category: 'tools',
        sourceType: 'file',
        description: `Tiện ích được cài đặt từ file local (${installFile.name}).`,
        iconColor: '#2563EB',
        author: 'Local File',
        enabled: true,
        storeUrl: '',
        assignedProfiles: profiles.length,
        size: `${(installFile.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setExtensions([newExt, ...extensions]);
      addLog?.(`Cài đặt thành công extension từ file: ${installFile.name}`, 'success');
      if (showToast) showToast(`Đã thêm extension "${cleanName}" từ file!`, 'success');
      setShowInstallModal(false);
      setInstallFile(null);
    } else {
      if (!storeUrlInput.trim()) return;
      let extName = 'Chrome Web Store Extension';
      const lower = storeUrlInput.toLowerCase();
      if (lower.includes('tronlink')) extName = 'TronLink Wallet';
      else if (lower.includes('okx')) extName = 'OKX Web3 Wallet';
      else if (lower.includes('tampermonkey')) extName = 'Tampermonkey';
      else if (lower.includes('adblock')) extName = 'AdBlock Plus';
      else extName = `Store Extension #${Math.floor(100 + Math.random() * 900)}`;

      const newExt = {
        id: `ext-store-${Date.now()}`,
        name: extName,
        extId: Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join(''),
        version: '1.0.0',
        category: 'tools',
        sourceType: 'store',
        description: 'Tiện ích tải và cài đặt trực tiếp từ Chrome Web Store.',
        iconColor: '#7C3AED',
        author: 'Web Store',
        enabled: true,
        storeUrl: storeUrlInput,
        assignedProfiles: profiles.length,
        size: '2.8 MB'
      };
      setExtensions([newExt, ...extensions]);
      addLog?.(`Tải và cài đặt thành công extension: ${extName}`, 'success');
      if (showToast) showToast(`Đã thêm extension "${extName}" vào Manager!`, 'success');
      setShowInstallModal(false);
      setStoreUrlInput('');
    }
  };

  // Handle Update Extension Submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateTargetExt || !updateFile) return;

    const parts = updateTargetExt.version.split('.');
    if (parts.length >= 3) {
      parts[2] = String(Number(parts[2]) + 1);
    } else {
      parts.push('1');
    }
    const newVer = parts.join('.');

    setExtensions(prev => prev.map(ext => {
      if (ext.id === updateTargetExt.id) {
        return {
          ...ext,
          version: newVer,
          size: `${(updateFile.size / (1024 * 1024)).toFixed(1)} MB`
        };
      }
      return ext;
    }));

    addLog?.(`Đã nâng cấp tiện ích "${updateTargetExt.name}" lên phiên bản v${newVer}`, 'success');
    if (showToast) showToast(`Cập nhật thành công v${newVer} cho "${updateTargetExt.name}"`, 'success');
    setUpdateTargetExt(null);
    setUpdateFile(null);
  };

  // ══════════════════════════════════════════════════════════════
  // VIEW 1: TRANG TRẮNG CỬA HÀNG EXTENSION (FULL WHITE STORE PAGE)
  // ══════════════════════════════════════════════════════════════
  if (isStoreOpen) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        boxSizing: 'border-box'
      }}>
        {/* Store Top Navigation Bar */}
        <div style={{
          padding: '18px 32px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          {/* Store Title & Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Cửa Hàng Tiện Ích (Extension Store)
              </h1>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Tìm kiếm và bấm "Thêm vào Manager" để cài đặt thẳng vào trình duyệt
              </span>
            </div>
          </div>

          {/* Nút Quản lý kho extension thay thế ô input và nút cài nhanh */}
          <button
            onClick={() => setIsStoreOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#7C3AED',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6D28D9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#7C3AED';
            }}
          >
            <FolderOpen size={15} />
            <span>Quản lý kho extension</span>
          </button>
        </div>

        {/* Store Content Body */}
        <div style={{ padding: '24px 32px 48px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Search & Category Filter Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            backgroundColor: '#F8FAFC',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 14px',
              width: '100%',
              maxWidth: '380px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <Search size={16} style={{ color: '#7C3AED' }} />
              <input
                type="text"
                value={storeSearch}
                onChange={(e) => setStoreSearch(e.target.value)}
                placeholder="Tìm tiện ích theo tên (MetaMask, Proxy, Captcha...)"
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
              />
              {storeSearch && (
                <button
                  onClick={() => setStoreSearch('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'crypto', label: 'Web3 & Ví Crypto' },
                { id: 'captcha', label: 'Giải Captcha' },
                { id: 'cookie', label: 'Cookie & 2FA' },
                { id: 'proxy', label: 'Proxy & Bảo Mật' },
                { id: 'ads', label: 'Ads & Marketing' },
                { id: 'automation', label: 'Tự động hóa' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setStoreCategory(cat.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: storeCategory === cat.id ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                    backgroundColor: storeCategory === cat.id ? '#EDE9FE' : '#FFFFFF',
                    color: storeCategory === cat.id ? '#7C3AED' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: storeCategory === cat.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', color: '#64748B' }}>
              Hiển thị <strong style={{ color: '#0F172A' }}>{filteredStoreExtensions.length} tiện ích</strong> trong kho:
            </span>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Nhấn <strong>"Thêm vào Manager"</strong> để đưa thẳng vào danh sách quản lý của bạn
            </span>
          </div>

          {/* Extension Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {filteredStoreExtensions.map(item => {
              const isAlreadyAdded = installedExtIds.has(item.extId) ||
                extensions.some(e => e.name.toLowerCase() === item.name.toLowerCase());

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7C3AED';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Top row: Icon, Name, Category */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: `${item.iconColor}15`,
                        border: `1px solid ${item.iconColor}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Puzzle size={22} color={item.iconColor} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                          {item.name}
                        </h3>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {item.author} • v{item.version}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '12px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      flexShrink: 0
                    }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: '1.45',
                    margin: 0,
                    minHeight: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>

                  {/* Rating & User Stats */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11.5px',
                    color: '#64748B',
                    backgroundColor: '#F8FAFC',
                    padding: '6px 10px',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: 600 }}>
                      <Star size={12} fill="#D97706" />
                      <span>{item.rating}</span>
                    </div>
                    <span>{item.users}</span>
                    <span>{item.size}</span>
                  </div>

                  {/* Action row: Link & Add button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '10px'
                  }}>
                    {item.storeUrl ? (
                      <a
                        href={item.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11.5px',
                          color: '#64748B',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={11} />
                        <span>Chi tiết</span>
                      </a>
                    ) : <div />}

                    {isAlreadyAdded ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        color: '#059669',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        <Check size={13} />
                        <span>Đã thêm</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddFromStore(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '6px 16px',
                          borderRadius: '6px',
                          backgroundColor: '#7C3AED',
                          border: 'none',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(124, 58, 237, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
                      >
                        <Plus size={14} />
                        <span>Thêm vào Manager</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStoreExtensions.length === 0 && (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <ShoppingBag size={32} style={{ margin: '0 auto 8px auto', color: '#94A3B8' }} />
              <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                Không tìm thấy tiện ích "{storeSearch}" trong danh mục có sẵn
              </p>
              <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '400px', margin: '0 auto 14px auto' }}>
                Bạn có thể dán trực tiếp đường dẫn Chrome Web Store vào ô ở trên để hệ thống tự động tải và thêm vào trình duyệt.
              </p>
              <button
                onClick={() => {
                  setStoreSearch('');
                  setStoreCategory('all');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Xem tất cả tiện ích
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════
  // VIEW 2: TRANG QUẢN LÝ TIỆN ÍCH (DEFAULT MY EXTENSIONS MANAGER)
  // ══════════════════════════════════════════════════════════════
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: 0,
      overflowY: 'auto',
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box'
    }}>
      {/* Top Header */}
      <div style={{
        padding: '20px 32px 18px 32px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.2px' }}>
                Kho Tiện Ích Mở Rộng (Extensions)
              </h1>
              <span style={{
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid #DDD6FE'
              }}>
                Manifest V3
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
              Quản lý, đồng bộ và tự động cài đặt Extension cho {profiles.length} profile trình duyệt antidetect ({extensions.length} tiện ích).
            </p>
          </div>

          {/* Action Buttons: Open Full White Store Page & Add Manual File */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsStoreOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#7C3AED',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
            >
              <ShoppingBag size={15} />
              <span>Cửa Hàng Extension Store</span>
            </button>

            <button
              onClick={() => {
                setInstallSource('file');
                setInstallFile(null);
                setStoreUrlInput('');
                setShowInstallModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EDE9FE'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            >
              <Plus size={15} />
              <span>Thêm thủ công (.zip / crx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Installed Extensions */}
      <div style={{ padding: '24px 32px 48px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {extensions.map(ext => (
            <div
              key={ext.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
              }}
            >
              {/* Top row: Icon, Name, Version, Toggle */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: `${ext.iconColor}15`,
                    border: `1px solid ${ext.iconColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Puzzle size={22} color={ext.iconColor} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {ext.name}
                      </h3>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        v{ext.version}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      {ext.sourceType === 'file' ? 'Cài từ file' : 'Chrome Web Store'} • {ext.author}
                    </span>
                  </div>
                </div>

                {/* Switch Toggle */}
                <div
                  onClick={() => handleToggle(ext.id)}
                  style={{
                    width: '38px',
                    height: '22px',
                    borderRadius: '12px',
                    backgroundColor: ext.enabled ? '#10B981' : '#CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    boxSizing: 'border-box',
                    flexShrink: 0
                  }}
                  title={ext.enabled ? 'Đang kích hoạt (Bấm để tắt)' : 'Đã tắt (Bấm để bật)'}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    transform: ext.enabled ? 'translateX(16px)' : 'translateX(0px)',
                    transition: 'transform 0.2s'
                  }} />
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '12px',
                color: '#475569',
                lineHeight: '1.45',
                margin: 0,
                minHeight: '36px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {ext.description}
              </p>

              {/* Metadata info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: '#64748B',
                backgroundColor: '#F8FAFC',
                padding: '8px 12px',
                borderRadius: '6px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>{ext.assignedProfiles || profiles.length}</span> profile áp dụng
                </span>
                <span>{ext.size || '2.0 MB'}</span>
              </div>

              {/* Bottom Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '10px'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setUpdateTargetExt(ext);
                      setUpdateFile(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    <RotateCw size={11} />
                    <span>Cập nhật</span>
                  </button>

                  <button
                    onClick={() => handleOpenFolder(ext)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    <FolderOpen size={11} />
                    <span>Thư mục</span>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {ext.storeUrl && (
                    <a
                      href={ext.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Mở trên Chrome Web Store"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '26px',
                        height: '26px',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={12} />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(ext.id, ext.name)}
                    title="Xóa tiện ích"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '26px',
                      height: '26px',
                      borderRadius: '4px',
                      border: '1px solid #FEE2E2',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. MODAL CÀI ĐẶT THỦ CÔNG (.zip / crx / url) ── */}
      {showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Thêm Tiện Ích Mở Rộng Thủ Công
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Cài đặt từ tệp nén máy tính hoặc dán liên kết Chrome Web Store
                </p>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInstallSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div
                  onClick={() => setInstallSource('file')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${installSource === 'file' ? '#7C3AED' : '#E2E8F0'}`,
                    backgroundColor: installSource === 'file' ? '#F5F3FF' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: installSource === 'file' ? '#7C3AED' : '#0F172A' }}>
                    Tệp nén (.zip / .crx)
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0 0' }}>
                    Tải lên gói extension đóng gói sẵn
                  </p>
                </div>

                <div
                  onClick={() => setInstallSource('store')}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1.5px solid ${installSource === 'store' ? '#7C3AED' : '#E2E8F0'}`,
                    backgroundColor: installSource === 'store' ? '#F5F3FF' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: installSource === 'store' ? '#7C3AED' : '#0F172A' }}>
                    Chrome Web Store
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '3px 0 0 0' }}>
                    Dán URL hoặc Extension ID
                  </p>
                </div>
              </div>

              {installSource === 'file' ? (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".zip,.crx"
                    onChange={(e) => setInstallFile(e.target.files?.[0] || null)}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: installFile ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    <FileArchive size={28} style={{ color: installFile ? '#16A34A' : '#7C3AED', margin: '0 auto 8px auto' }} />
                    {installFile ? (
                      <div>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#16A34A' }}>
                          {installFile.name}
                        </span>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                          {(installFile.size / (1024 * 1024)).toFixed(2)} MB - Nhấn để đổi file khác
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>
                          Bấm vào đây để chọn tệp .zip hoặc .crx
                        </span>
                        <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 0 0' }}>
                          Hỗ trợ tiện ích Google Chrome và Microsoft Edge
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Đường dẫn Chrome Web Store
                  </label>
                  <input
                    type="text"
                    required
                    value={storeUrlInput}
                    onChange={(e) => setStoreUrlInput(e.target.value)}
                    placeholder="https://chromewebstore.google.com/detail/..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '4px' }}>
                    Hệ thống sẽ tự động phân giải Extension ID và tải phiên bản mới nhất.
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={installSource === 'file' ? !installFile : !storeUrlInput.trim()}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: (installSource === 'file' ? installFile : storeUrlInput.trim()) ? '#7C3AED' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: (installSource === 'file' ? installFile : storeUrlInput.trim()) ? 'pointer' : 'not-allowed'
                  }}
                >
                  Cài đặt ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 4. MODAL CẬP NHẬT TIỆN ÍCH ── */}
      {updateTargetExt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Cập nhật: {updateTargetExt.name}
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Phiên bản hiện tại: v{updateTargetExt.version}
                </p>
              </div>
              <button
                onClick={() => setUpdateTargetExt(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="file"
                ref={updateFileInputRef}
                accept=".zip,.crx"
                onChange={(e) => setUpdateFile(e.target.files?.[0] || null)}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => updateFileInputRef.current?.click()}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '8px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: updateFile ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                <RotateCw size={24} style={{ color: updateFile ? '#16A34A' : '#7C3AED', margin: '0 auto 6px auto' }} />
                {updateFile ? (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                      {updateFile.name}
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      {(updateFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                      Chọn gói .zip / .crx phiên bản mới
                    </span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setUpdateTargetExt(null)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!updateFile}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: updateFile ? '#7C3AED' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: updateFile ? 'pointer' : 'not-allowed'
                  }}
                >
                  Nâng cấp phiên bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
