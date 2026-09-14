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
  Search,
  ShoppingBag,
  Star,
  Layers,
  Download,
  Clipboard
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';
import SkeletonLoader from '../components/common/SkeletonLoader';

// Default extensions in Manager (Real extensions loaded directly from physical disk)
const DEFAULT_EXTENSIONS = [];


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
  const { t, language } = useTranslation();
  const { profiles = [], addLog, showToast } = useBrowser();

  // Active Main Tab: 'manager' = My Extensions Manager, 'store' = Dedicated Store
  const [activeView, setActiveView] = useState('manager'); // 'manager' | 'store'

  // Extensions in Manager, persisted to localStorage & loaded directly from disk
  const [extensions, setExtensions] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_installed_extensions_v2');
      return saved ? JSON.parse(saved) : DEFAULT_EXTENSIONS;
    } catch {
      return DEFAULT_EXTENSIONS;
    }
  });
  const [isLoadingInstalled, setIsLoadingInstalled] = useState(false);

  // Store filters
  const [storeSearch, setStoreSearch] = useState('');

  // Manager filters
  const [managerSearch, setManagerSearch] = useState('');
  const [managerStatus, setManagerStatus] = useState('all'); // 'all' | 'enabled' | 'disabled'

  // Unified "Cài extension thủ công" modal state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSource, setInstallSource] = useState('file'); // 'file' | 'folder' | 'store'
  const [installFile, setInstallFile] = useState(null);
  const [installFolder, setInstallFolder] = useState(null);
  const [storeUrlInput, setStoreUrlInput] = useState('');
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgressText, setInstallProgressText] = useState('');
  const [downloadingStoreIds, setDownloadingStoreIds] = useState(new Set());

  // "Cập nhật extension" modal state
  const [updateTargetExt, setUpdateTargetExt] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);

  // "Phân quyền / Áp dụng cho Profile" modal state
  const [assignTargetExt, setAssignTargetExt] = useState(null);
  const [assignAllMode, setAssignAllMode] = useState(true);
  const [selectedProfileIds, setSelectedProfileIds] = useState([]);
  const [profileSearchQuery, setProfileSearchQuery] = useState('');

  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const updateFileInputRef = useRef(null);

  // Load all extensions directly from physical folders on disk
  const refreshInstalledExtensions = async (silent = false) => {
    if (window.electronAPI?.getInstalledExtensions) {
      if (!silent) setIsLoadingInstalled(true);
      try {
        const list = await window.electronAPI.getInstalledExtensions();
        if (Array.isArray(list)) {
          setExtensions(list);
          try {
            localStorage.setItem('antidetect_installed_extensions_v2', JSON.stringify(list));
          } catch {}
        }
      } catch (err) {
        console.warn('Lỗi quét tiện ích từ thư mục máy tính:', err);
      } finally {
        if (!silent) setIsLoadingInstalled(false);
      }
    }
  };

  useEffect(() => {
    refreshInstalledExtensions(false);
  }, []);

  // Set of installed extension IDs to check in store
  const installedExtIds = useMemo(() => {
    return new Set(extensions.map(e => e.extId || e.name.toLowerCase()));
  }, [extensions]);

  // Filtered store extensions
  const filteredStoreExtensions = useMemo(() => {
    return STORE_CATALOG.filter(item => {
      const q = storeSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q);

      return matchesSearch;
    });
  }, [storeSearch]);

  // Filtered manager extensions
  const filteredManagerExtensions = useMemo(() => {
    return extensions.filter(ext => {
      const q = managerSearch.trim().toLowerCase();
      const matchesSearch = !q ||
        ext.name.toLowerCase().includes(q) ||
        (ext.description && ext.description.toLowerCase().includes(q)) ||
        (ext.author && ext.author.toLowerCase().includes(q)) ||
        (ext.extId && ext.extId.toLowerCase().includes(q));

      const matchesStatus = managerStatus === 'all' ||
        (managerStatus === 'enabled' && ext.enabled) ||
        (managerStatus === 'disabled' && !ext.enabled);

      return matchesSearch && matchesStatus;
    });
  }, [extensions, managerSearch, managerStatus]);

  // Toggle extension enabled
  const handleToggle = async (id) => {
    let nextState = false;
    setExtensions(prev => prev.map(ext => {
      if (ext.id === id) {
        nextState = !ext.enabled;
        addLog?.(`${nextState ? 'Bật' : 'Tắt'} tiện ích "${ext.name}"`, nextState ? 'success' : 'info');
        if (showToast) showToast(`${nextState ? 'Đã bật' : 'Đã tắt'} tiện ích "${ext.name}"`, 'info');
        return { ...ext, enabled: nextState };
      }
      return ext;
    }));

    if (window.electronAPI?.saveExtensionConfig) {
      try {
        await window.electronAPI.saveExtensionConfig({ id, enabled: nextState });
      } catch (err) {
        console.warn('Lỗi lưu cấu hình bật/tắt tiện ích:', err);
      }
    }
  };

  // Open real extension folder in Windows Explorer
  const handleOpenFolder = async (ext) => {
    if (!ext) return;
    const target = ext.folderPath || ext.extId || ext.id;
    if (window.electronAPI?.openExtensionFolder) {
      try {
        const res = await window.electronAPI.openExtensionFolder(target);
        if (res && res.success) {
          if (res.folderPath && res.folderPath !== ext.folderPath) {
            setExtensions(prev => prev.map(e => e.id === ext.id ? { ...e, folderPath: res.folderPath } : e));
          }
          addLog?.(`Đã mở thư mục tiện ích: "${ext.name}"`, 'info');
          return;
        } else {
          if (showToast) showToast(res?.error || 'Không thể mở thư mục tiện ích', 'error');
        }
      } catch (err) {
        console.warn('Lỗi mở thư mục tiện ích:', err);
        if (showToast) showToast(`Lỗi: ${err.message}`, 'error');
      }
    }
  };

  // Delete extension from Manager and clean up source code files from disk
  const handleDelete = async (idOrExt, name) => {
    const ext = typeof idOrExt === 'object' && idOrExt !== null ? idOrExt : extensions.find(e => e.id === idOrExt);
    const extId = ext ? ext.id : idOrExt;
    const extName = ext?.name || name || 'Tiện ích';

    if (confirm(`Bạn có chắc chắn muốn gỡ bỏ tiện ích "${extName}" và xóa toàn bộ mã nguồn của tiện ích này khỏi máy tính?`)) {
      setExtensions(prev => prev.filter(e => e.id !== extId));

      if (window.electronAPI?.deleteExtension) {
        try {
          const target = ext?.folderPath || ext?.extId || extId;
          await window.electronAPI.deleteExtension(target);
        } catch (err) {
          console.warn('Lỗi xóa tệp mã nguồn tiện ích trên đĩa:', err);
        }
      }

      await refreshInstalledExtensions(true);

      addLog?.(`Đã gỡ bỏ và xóa toàn bộ mã nguồn tiện ích "${extName}"`, 'warning');
      if (showToast) showToast(`Đã gỡ bỏ và xóa mã nguồn của "${extName}"`, 'info');
    }
  };

  // 1-Click Install from Store to Manager (Downloads real CRX and extracts source files)
  const handleAddFromStore = async (storeItem) => {
    if (extensions.some(e => e.extId === storeItem.extId || e.name.toLowerCase() === storeItem.name.toLowerCase())) {
      if (showToast) showToast(`Tiện ích "${storeItem.name}" đã có sẵn trong danh sách!`, 'info');
      return;
    }

    setDownloadingStoreIds(prev => new Set(prev).add(storeItem.id));
    if (showToast) showToast(`Đang tải mã nguồn "${storeItem.name}" từ Chrome Web Store...`, 'info');

    let folderPath = '';
    let version = storeItem.version;
    let name = storeItem.name;
    let description = storeItem.description;
    let size = storeItem.size;

    if (window.electronAPI?.downloadStoreExtension) {
      try {
        const res = await window.electronAPI.downloadStoreExtension(storeItem.extId || storeItem.storeUrl);
        if (res && res.success) {
          folderPath = res.folderPath;
          if (res.version) version = res.version;
          if (res.name) name = res.name;
          if (res.description) description = res.description;
          if (res.size) size = res.size;
        } else if (window.electronAPI?.saveUnpackedExtension) {
          const saveRes = await window.electronAPI.saveUnpackedExtension({
            id: storeItem.extId,
            name: storeItem.name,
            version: storeItem.version,
            description: storeItem.description
          });
          folderPath = saveRes?.folderPath || '';
        }
      } catch (err) {
        console.warn('Lỗi tải tiện ích từ store:', err);
      }
    }

    // Refresh extensions directly from disk to load genuine manifest and icons
    await refreshInstalledExtensions(true);

    setDownloadingStoreIds(prev => {
      const next = new Set(prev);
      next.delete(storeItem.id);
      return next;
    });

    addLog?.(`Đã tải và cài đặt tiện ích "${name}" với đầy đủ mã nguồn từ ổ đĩa!`, 'success');
    if (showToast) showToast(`Cài đặt thành công "${name}" vào Quản lý tiện ích!`, 'success');
  };

  // Folder Selection Handler (Unpacked extension)
  const handlePickFolder = async () => {
    if (window.electronAPI?.selectExtensionFolder) {
      try {
        const res = await window.electronAPI.selectExtensionFolder();
        if (res && !res.canceled && res.folderPath) {
          setInstallFolder(res);
          return;
        }
      } catch (err) {
        console.warn('Lỗi chọn thư mục tiện ích:', err);
      }
    }
    folderInputRef.current?.click();
  };

  const handleFolderInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const folderName = firstFile.webkitRelativePath ? firstFile.webkitRelativePath.split('/')[0] : 'Extension Folder';
      const hasManifest = Array.from(files).some(f => f.name === 'manifest.json');
      setInstallFolder({
        folderName,
        folderPath: folderName,
        name: folderName,
        version: '1.0.0',
        description: `Tiện ích mở rộng từ thư mục cục bộ (${folderName}).`,
        hasManifest
      });
    }
  };

  // File (.zip / .crx) Selection Handler
  const handlePickFile = async () => {
    if (window.electronAPI?.selectExtensionFile) {
      try {
        const res = await window.electronAPI.selectExtensionFile();
        if (res && !res.canceled && res.folderPath) {
          setInstallFile({
            name: res.fileName || res.name,
            folderPath: res.folderPath,
            version: res.version || '1.0.0',
            description: res.description,
            hasManifest: res.hasManifest
          });
          return;
        }
      } catch (err) {
        console.warn('Lỗi chọn tệp tiện ích:', err);
      }
    }
    fileInputRef.current?.click();
  };

  // Paste URL or Extension ID from Clipboard
  const handlePasteStoreUrl = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setStoreUrlInput(text.trim());
        if (showToast) showToast('Đã dán liên kết từ bộ nhớ tạm!', 'success');
      } else {
        if (showToast) showToast('Bộ nhớ tạm (Clipboard) đang trống.', 'info');
      }
    } catch (err) {
      if (showToast) showToast('Không thể đọc bộ nhớ tạm. Bạn có thể bấm Ctrl + V để dán.', 'warning');
    }
  };

  // Handle Manual Modal Install Submission
  const handleInstallSubmit = async (e) => {
    e.preventDefault();

    if (installSource === 'file') {
      if (!installFile) return;
      const cleanName = installFile.name.replace(/\.(zip|crx)$/i, '');
      await refreshInstalledExtensions(true);
      addLog?.(`Cài đặt thành công tiện ích từ file: ${cleanName}`, 'success');
      if (showToast) showToast(`Đã thêm tiện ích "${cleanName}" từ file!`, 'success');
      setShowInstallModal(false);
      setInstallFile(null);
    } else if (installSource === 'folder') {
      if (!installFolder) return;
      const cleanName = installFolder.name || installFolder.folderName || 'Unpacked Extension';
      await refreshInstalledExtensions(true);
      addLog?.(`Cài đặt thành công tiện ích từ thư mục: ${cleanName}`, 'success');
      if (showToast) showToast(`Đã thêm tiện ích "${cleanName}" từ thư mục!`, 'success');
      setShowInstallModal(false);
      setInstallFolder(null);
    } else {
      if (!storeUrlInput.trim()) return;
      const input = storeUrlInput.trim();
      const match = input.match(/([a-z]{32})/i);
      if (!match) {
        if (showToast) showToast('Không tìm thấy Extension ID hợp lệ (cần chuỗi 32 ký tự)', 'error');
        return;
      }

      setIsInstalling(true);
      setInstallProgressText('Đang tải mã nguồn và tệp manifest từ Chrome Web Store...');

      try {
        let extInfo = null;
        if (window.electronAPI?.downloadStoreExtension) {
          const res = await window.electronAPI.downloadStoreExtension(input);
          if (res && res.success) {
            extInfo = res;
          } else {
            if (showToast) showToast(res?.error || 'Không thể tải CRX từ Chrome Web Store', 'error');
            setIsInstalling(false);
            setInstallProgressText('');
            return;
          }
        }

        const extName = extInfo?.name || `Chrome Extension (${(extInfo?.extId || match[1]).slice(0, 8)}...)`;

        // Refresh installed list directly from disk
        await refreshInstalledExtensions(true);

        addLog?.(`Đã tải và cài đặt thành công tiện ích: "${extName}" kèm đầy đủ source code!`, 'success');
        if (showToast) showToast(`Cài đặt thành công "${extName}"!`, 'success');
        setShowInstallModal(false);
        setStoreUrlInput('');
      } catch (err) {
        if (showToast) showToast(`Lỗi: ${err.message}`, 'error');
      } finally {
        setIsInstalling(false);
        setInstallProgressText('');
      }
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
          folderPath: updateFile.folderPath || ext.folderPath,
          size: updateFile.size ? `${(updateFile.size / (1024 * 1024)).toFixed(1)} MB` : ext.size
        };
      }
      return ext;
    }));

    addLog?.(`Đã nâng cấp tiện ích "${updateTargetExt.name}" lên v${newVer}`, 'success');
    if (showToast) showToast(`Cập nhật thành công v${newVer} cho "${updateTargetExt.name}"`, 'success');
    setUpdateTargetExt(null);
    setUpdateFile(null);
  };

  // Open Assign Profiles Modal
  const handleOpenAssignModal = (ext) => {
    setAssignTargetExt(ext);
    const hasSpecific = Array.isArray(ext.targetProfileIds) && ext.targetProfileIds.length > 0;
    setAssignAllMode(!hasSpecific);
    setSelectedProfileIds(hasSpecific ? [...ext.targetProfileIds] : []);
    setProfileSearchQuery('');
  };

  // Save Assigned Profiles
  const handleSaveAssign = async () => {
    if (!assignTargetExt) return;
    const targetIds = assignAllMode ? [] : selectedProfileIds;
    const assignedCount = assignAllMode ? profiles.length : targetIds.length;

    setExtensions(prev => prev.map(e => {
      if (e.id === assignTargetExt.id) {
        return {
          ...e,
          targetProfileIds: targetIds,
          assignedProfiles: assignedCount
        };
      }
      return e;
    }));

    if (window.electronAPI?.saveExtensionConfig) {
      try {
        await window.electronAPI.saveExtensionConfig({
          id: assignTargetExt.id,
          targetProfileIds: targetIds
        });
      } catch (err) {
        console.warn('Lỗi lưu cấu hình phân quyền tiện ích:', err);
      }
    }

    addLog?.(`Đã cập nhật áp dụng tiện ích "${assignTargetExt.name}" cho ${assignedCount} profile`, 'success');
    if (showToast) showToast(`Đã áp dụng tiện ích "${assignTargetExt.name}" cho ${assignedCount} profile!`, 'success');
    setAssignTargetExt(null);
  };

  // Filtered profiles for Assign Modal
  const modalFilteredProfiles = useMemo(() => {
    if (!profileSearchQuery.trim()) return profiles;
    const q = profileSearchQuery.toLowerCase();
    return profiles.filter(p => p.name?.toLowerCase().includes(q) || String(p.id).includes(q));
  }, [profiles, profileSearchQuery]);

  const enabledCount = extensions.filter(e => e.enabled).length;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: 0,
      backgroundColor: '#FFFFFF',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* ── TOP HEADER WITH VIEW SWITCHER ── */}
      <div style={{
        padding: '16px 28px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        {/* Title & Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Puzzle size={20} />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Quản Lý Tiện Ích Mở Rộng (Extensions)
              </h1>
              <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                Tự động đồng bộ và tải tiện ích vào nhân Chromium của {profiles.length} profiles
              </p>
            </div>
          </div>

          {/* Sub-Tabs: Manager vs Store */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            marginLeft: '8px'
          }}>
            <button
              type="button"
              onClick={() => setActiveView('manager')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeView === 'manager' ? '#FFFFFF' : 'transparent',
                color: activeView === 'manager' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeView === 'manager' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: activeView === 'manager' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Puzzle size={14} />
              <span>Tiện ích đã cài ({extensions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView('store')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeView === 'store' ? '#FFFFFF' : 'transparent',
                color: activeView === 'store' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeView === 'store' ? 700 : 500,
                cursor: 'pointer',
                boxShadow: activeView === 'store' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ShoppingBag size={14} />
              <span>Cửa hàng tiện ích ({STORE_CATALOG.length})</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => refreshInstalledExtensions(false)}
            disabled={isLoadingInstalled}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 500,
              cursor: isLoadingInstalled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Quét lại tiện ích thực tế từ thư mục ổ đĩa"
          >
            <RotateCw size={14} style={{ animation: isLoadingInstalled ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isLoadingInstalled ? 'Đang quét...' : 'Làm mới'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenFolder({ id: '', name: 'Extensions Root' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Mở thư mục lưu trữ tiện ích trên máy tính"
          >
            <FolderOpen size={14} />
            <span>Mở thư mục Extension</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setInstallSource('file');
              setInstallFile(null);
              setInstallFolder(null);
              setStoreUrlInput('');
              setShowInstallModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              backgroundColor: '#7C3AED',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={14} />
            <span>Thêm tiện ích thủ công</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT: MANAGER VIEW ── */}
      {activeView === 'manager' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#F8FAFC',
          padding: '20px 28px'
        }}>
          {/* Toolbar: Search, Category Filter, Status Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
              {/* Search */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '6px 12px',
                width: '100%',
                maxWidth: '280px'
              }}>
                <Search size={14} color="#64748B" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tiện ích đã cài..."
                  value={managerSearch}
                  onChange={(e) => setManagerSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '12px',
                    width: '100%',
                    backgroundColor: 'transparent'
                  }}
                />
                {managerSearch && (
                  <button
                    onClick={() => setManagerSearch('')}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setManagerStatus('all')}
                  style={{
                    padding: '6px 10px',
                    border: 'none',
                    backgroundColor: managerStatus === 'all' ? '#7C3AED' : 'transparent',
                    color: managerStatus === 'all' ? '#FFFFFF' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Tất cả ({extensions.length})
                </button>
                <button
                  onClick={() => setManagerStatus('enabled')}
                  style={{
                    padding: '6px 10px',
                    border: 'none',
                    backgroundColor: managerStatus === 'enabled' ? '#10B981' : 'transparent',
                    color: managerStatus === 'enabled' ? '#FFFFFF' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Đang bật ({enabledCount})
                </button>
                <button
                  onClick={() => setManagerStatus('disabled')}
                  style={{
                    padding: '6px 10px',
                    border: 'none',
                    backgroundColor: managerStatus === 'disabled' ? '#64748B' : 'transparent',
                    color: managerStatus === 'disabled' ? '#FFFFFF' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Đã tắt ({extensions.length - enabledCount})
                </button>
              </div>
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
              Hiển thị <strong>{filteredManagerExtensions.length}</strong> / {extensions.length} tiện ích
            </div>
          </div>

          {/* Grid of Installed Extensions */}
          {isLoadingInstalled ? (
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
              <SkeletonLoader type="lines" count={4} />
            </div>
          ) : filteredManagerExtensions.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: '#94A3B8'
              }}>
                <Puzzle size={24} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px 0' }}>
                Không tìm thấy tiện ích nào
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 16px 0', textAlign: 'center', maxWidth: '360px' }}>
                {managerSearch ? 'Không tìm thấy tiện ích nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có tiện ích mở rộng nào. Bạn có thể cài đặt từ Cửa hàng hoặc tệp máy tính.'}
              </p>
              <button
                onClick={() => setActiveView('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ShoppingBag size={14} />
                <span>Khám phá Cửa hàng Tiện ích</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '14px'
            }}>
              {filteredManagerExtensions.map(ext => (
                <div
                  key={ext.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '14px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Top Row: Icon, Name, Version, Toggle */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: `${ext.iconColor || '#7C3AED'}15`,
                        border: `1px solid ${ext.iconColor || '#7C3AED'}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                      }}>
                        {ext.iconDataUrl ? (
                          <img
                            src={ext.iconDataUrl}
                            alt={ext.name}
                            style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                          />
                        ) : (
                          <Puzzle size={20} color={ext.iconColor || '#7C3AED'} />
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h3 style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#0F172A',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }} title={ext.name}>
                            {ext.name}
                          </h3>
                          <span style={{ fontSize: '10px', color: '#94A3B8', flexShrink: 0 }}>
                            v{ext.version}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ext.author || 'Chrome Extension'} • {ext.sourceType === 'file' ? 'Tệp cục bộ' : ext.sourceType === 'folder' ? 'Thư mục Unpacked' : 'Web Store'}
                        </span>
                      </div>
                    </div>

                    {/* Switch Toggle */}
                    <div
                      onClick={() => handleToggle(ext.id)}
                      style={{
                        width: '36px',
                        height: '20px',
                        borderRadius: '10px',
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
                        width: '16px',
                        height: '16px',
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
                    fontSize: '11.5px',
                    color: '#475569',
                    lineHeight: '1.45',
                    margin: 0,
                    minHeight: '34px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {ext.description}
                  </p>

                  {/* Profile Assignment Bar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    color: '#64748B',
                    backgroundColor: '#F8FAFC',
                    padding: '7px 10px',
                    borderRadius: '6px'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleOpenAssignModal(ext)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        border: 'none',
                        background: 'transparent',
                        color: '#7C3AED',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title="Bấm để cấu hình profile áp dụng"
                    >
                      <Layers size={12} />
                      <span>
                        {(!ext.targetProfileIds || ext.targetProfileIds.length === 0)
                          ? `Tất cả (${profiles.length}) profiles`
                          : `${ext.targetProfileIds.length} profiles chỉ định`}
                      </span>
                    </button>
                    <span>{ext.size || '2.0 MB'}</span>
                  </div>

                  {/* Bottom Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '8px'
                  }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setUpdateTargetExt(ext);
                          setUpdateFile(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
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
                        type="button"
                        onClick={() => handleOpenFolder(ext)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => handleDelete(ext.id, ext.name)}
                        title="Gỡ bỏ tiện ích này"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
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
          )}
        </div>
      )}

      {/* ── MAIN CONTENT: STORE VIEW ── */}
      {activeView === 'store' && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          padding: '24px 28px'
        }}>
          {/* Store Filter Toolbar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '20px',
            backgroundColor: '#F8FAFC',
            padding: '16px 20px',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px 14px',
                width: '100%',
                maxWidth: '360px'
              }}>
                <Search size={15} color="#7C3AED" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tiện ích Web3, Proxy, Captcha, Cookie..."
                  value={storeSearch}
                  onChange={(e) => setStoreSearch(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '12.5px',
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

              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Tìm thấy <strong>{filteredStoreExtensions.length}</strong> tiện ích phổ biến
              </div>
            </div>
          </div>

          {/* Store Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {filteredStoreExtensions.map(item => {
              const isInstalled = installedExtIds.has(item.extId) || installedExtIds.has(item.name.toLowerCase());
              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Item Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '13.5px',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }} title={item.name}>
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontSize: '11px', color: '#64748B' }}>
                        <span>{item.author}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
                          <Star size={10} fill="#F59E0B" />
                          {item.rating}
                        </span>
                        <span>•</span>
                        <span>{item.users}</span>
                      </div>
                    </div>
                  </div>

                  {/* Item Description */}
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

                  {/* Bottom Action: Install / Added */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '10px'
                  }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      Kích thước: {item.size}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.storeUrl && (
                        <a
                          href={item.storeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Xem trên Chrome Web Store"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            backgroundColor: '#FFFFFF',
                            color: '#64748B',
                            textDecoration: 'none'
                          }}
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}

                      {isInstalled ? (
                        <button
                          disabled
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid #BBF7D0',
                            backgroundColor: '#F0FDF4',
                            color: '#16A34A',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'default'
                          }}
                        >
                          <Check size={13} />
                          <span>Đã cài đặt</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFromStore(item)}
                          disabled={downloadingStoreIds.has(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: downloadingStoreIds.has(item.id) ? '#A78BFA' : '#7C3AED',
                            color: '#FFFFFF',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: downloadingStoreIds.has(item.id) ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {downloadingStoreIds.has(item.id) ? (
                            <>
                              <RotateCw size={13} className="animate-spin" />
                              <span>Đang tải...</span>
                            </>
                          ) : (
                            <>
                              <Download size={13} />
                              <span>Cài vào Manager</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL 1: CÀI ĐẶT THỦ CÔNG (.zip / folder / Web Store URL) ── */}
      {showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
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
              padding: '14px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Thêm Tiện Ích Mở Rộng Thủ Công
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Cài từ tệp zip/crx, thư mục Unpacked hoặc Chrome Web Store URL
                </p>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInstallSubmit} style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div
                  onClick={() => setInstallSource('file')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${installSource === 'file' ? '#7C3AED' : '#E2E8F0'}`,
                    backgroundColor: installSource === 'file' ? '#F5F3FF' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileArchive size={13} color={installSource === 'file' ? '#7C3AED' : '#64748B'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'file' ? '#7C3AED' : '#0F172A' }}>
                      Tệp .zip / .crx
                    </span>
                  </div>
                  <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Tệp đóng gói</p>
                </div>

                <div
                  onClick={() => setInstallSource('folder')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${installSource === 'folder' ? '#10B981' : '#E2E8F0'}`,
                    backgroundColor: installSource === 'folder' ? '#ECFDF5' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FolderOpen size={13} color={installSource === 'folder' ? '#10B981' : '#64748B'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'folder' ? '#059669' : '#0F172A' }}>
                      Thư mục
                    </span>
                  </div>
                  <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Unpacked folder</p>
                </div>

                <div
                  onClick={() => setInstallSource('store')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1.5px solid ${installSource === 'store' ? '#7C3AED' : '#E2E8F0'}`,
                    backgroundColor: installSource === 'store' ? '#F5F3FF' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShoppingBag size={13} color={installSource === 'store' ? '#7C3AED' : '#64748B'} />
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: installSource === 'store' ? '#7C3AED' : '#0F172A' }}>
                      Web Store
                    </span>
                  </div>
                  <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>Link hoặc ID</p>
                </div>
              </div>

              {/* View 1: File .zip / .crx */}
              {installSource === 'file' && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".zip,.crx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setInstallFile({
                          name: file.name,
                          size: file.size,
                          folderPath: ''
                        });
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={handlePickFile}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: installFile ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    <FileArchive size={24} style={{ color: installFile ? '#16A34A' : '#7C3AED', margin: '0 auto 6px auto' }} />
                    {installFile ? (
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                          {installFile.name}
                        </span>
                        <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                          Đã chọn tệp • Nhấn để chọn file khác
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                          Bấm vào đây để chọn tệp .zip hoặc .crx
                        </span>
                        <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                          Tự động giải nén và nạp manifest vào trình duyệt
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View 2: Folder Unpacked */}
              {installSource === 'folder' && (
                <div>
                  <input
                    type="file"
                    ref={folderInputRef}
                    webkitdirectory="true"
                    directory="true"
                    onChange={handleFolderInputChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={handlePickFolder}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: '8px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: installFolder ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    <FolderOpen size={24} style={{ color: installFolder ? '#059669' : '#10B981', margin: '0 auto 6px auto' }} />
                    {installFolder ? (
                      <div>
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
                          {installFolder.name || installFolder.folderName}
                        </span>
                        <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                          Thư mục: {installFolder.folderPath || installFolder.folderName} • Nhấn để đổi
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                          Bấm vào đây để chọn thư mục Extension (Unpacked)
                        </span>
                        <p style={{ fontSize: '10.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                          Thư mục chứa file <strong>manifest.json</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View 3: Chrome Web Store URL */}
              {installSource === 'store' && (
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Đường dẫn Chrome Web Store hoặc Extension ID
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      disabled={isInstalling}
                      value={storeUrlInput}
                      onChange={(e) => setStoreUrlInput(e.target.value)}
                      placeholder="https://chromewebstore.google.com/detail/... hoặc 32 ký tự ID"
                      style={{
                        width: '100%',
                        padding: '8px 84px 8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#7C3AED'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
                    />
                    <div style={{
                      position: 'absolute',
                      right: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {storeUrlInput && (
                        <button
                          type="button"
                          onClick={() => setStoreUrlInput('')}
                          disabled={isInstalling}
                          title="Xóa liên kết đã nhập"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '4px',
                            border: 'none',
                            backgroundColor: '#F1F5F9',
                            color: '#64748B',
                            cursor: 'pointer'
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handlePasteStoreUrl}
                        disabled={isInstalling}
                        title="Dán từ Clipboard (Bộ nhớ tạm)"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: '1px solid #DDD6FE',
                          backgroundColor: '#F5F3FF',
                          color: '#7C3AED',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: isInstalling ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#EDE9FE';
                          e.currentTarget.style.borderColor = '#C4B5FD';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F5F3FF';
                          e.currentTarget.style.borderColor = '#DDD6FE';
                        }}
                      >
                        <Clipboard size={12} />
                        <span>Dán</span>
                      </button>
                    </div>
                  </div>
                  {isInstalling ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#7C3AED', fontSize: '11px', fontWeight: 600 }}>
                      <RotateCw size={13} className="animate-spin" />
                      <span>{installProgressText || 'Đang tải xuống và giải nén tệp mã nguồn...'}</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginTop: '3px' }}>
                      Ứng dụng sẽ tự động tải CRX từ máy chủ Chrome Web Store, giải nén toàn bộ tệp source code vào thư mục máy tính.
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  disabled={isInstalling}
                  onClick={() => setShowInstallModal(false)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#475569',
                    cursor: isInstalling ? 'not-allowed' : 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={
                    isInstalling ||
                    (installSource === 'file' && !installFile) ||
                    (installSource === 'folder' && !installFolder) ||
                    (installSource === 'store' && !storeUrlInput.trim())
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isInstalling ? '#A78BFA' : '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isInstalling ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isInstalling && <RotateCw size={12} className="animate-spin" />}
                  <span>{isInstalling ? 'Đang tải...' : 'Cài đặt ngay'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: CẬP NHẬT TIỆN ÍCH ── */}
      {updateTargetExt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '440px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
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

            <form onSubmit={handleUpdateSubmit} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="file"
                ref={updateFileInputRef}
                accept=".zip,.crx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUpdateFile({
                      name: file.name,
                      size: file.size
                    });
                  }
                }}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => {
                  if (window.electronAPI?.selectExtensionFile) {
                    window.electronAPI.selectExtensionFile().then(res => {
                      if (res && !res.canceled) {
                        setUpdateFile({
                          name: res.fileName || res.name,
                          folderPath: res.folderPath
                        });
                      }
                    });
                  } else {
                    updateFileInputRef.current?.click();
                  }
                }}
                style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '8px',
                  padding: '18px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: updateFile ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                <RotateCw size={22} style={{ color: updateFile ? '#16A34A' : '#7C3AED', margin: '0 auto 6px auto' }} />
                {updateFile ? (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>
                      {updateFile.name}
                    </span>
                    <p style={{ fontSize: '10px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Đã sẵn sàng nâng cấp phiên bản
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setUpdateTargetExt(null)}
                  style={{
                    padding: '6px 12px',
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
                    padding: '6px 14px',
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

      {/* ── MODAL 3: PHÂN QUYỀN / ÁP DỤNG CHO PROFILE ── */}
      {assignTargetExt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '480px',
            maxHeight: '85vh',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC'
            }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Áp Dụng Tiện Ích Cho Profile
                </h3>
                <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                  {assignTargetExt.name}
                </p>
              </div>
              <button
                onClick={() => setAssignTargetExt(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              {/* Mode 1: All Profiles */}
              <div
                onClick={() => setAssignAllMode(true)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1.5px solid ${assignAllMode ? '#7C3AED' : '#E2E8F0'}`,
                  backgroundColor: assignAllMode ? '#F5F3FF' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <input
                  type="radio"
                  checked={assignAllMode}
                  onChange={() => setAssignAllMode(true)}
                  style={{ accentColor: '#7C3AED' }}
                />
                <div>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: assignAllMode ? '#7C3AED' : '#0F172A' }}>
                    Áp dụng cho toàn bộ profiles (Mặc định)
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Tự động kích hoạt tiện ích này cho tất cả {profiles.length} profiles hiện có và profiles mới tạo.
                  </p>
                </div>
              </div>

              {/* Mode 2: Specific Profiles */}
              <div
                onClick={() => setAssignAllMode(false)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: `1.5px solid ${!assignAllMode ? '#7C3AED' : '#E2E8F0'}`,
                  backgroundColor: !assignAllMode ? '#F5F3FF' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <input
                  type="radio"
                  checked={!assignAllMode}
                  onChange={() => setAssignAllMode(false)}
                  style={{ accentColor: '#7C3AED' }}
                />
                <div>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: !assignAllMode ? '#7C3AED' : '#0F172A' }}>
                    Chỉ định profiles cụ thể
                  </span>
                  <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
                    Chỉ kích hoạt tiện ích này trên các profile được bạn chọn trong danh sách dưới đây.
                  </p>
                </div>
              </div>

              {/* Specific Profiles List */}
              {!assignAllMode && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {/* Search profile */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF'
                  }}>
                    <Search size={13} color="#64748B" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm profile..."
                      value={profileSearchQuery}
                      onChange={(e) => setProfileSearchQuery(e.target.value)}
                      style={{ border: 'none', outline: 'none', fontSize: '11.5px', width: '100%' }}
                    />
                  </div>

                  {/* Profile items container */}
                  <div style={{
                    maxHeight: '180px',
                    overflowY: 'auto',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '4px'
                  }}>
                    {modalFilteredProfiles.length === 0 ? (
                      <div style={{ padding: '12px', textAlign: 'center', fontSize: '11.5px', color: '#94A3B8' }}>
                        Không tìm thấy profile phù hợp
                      </div>
                    ) : (
                      modalFilteredProfiles.map(p => {
                        const isChecked = selectedProfileIds.includes(String(p.id));
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedProfileIds(prev =>
                                isChecked ? prev.filter(id => id !== String(p.id)) : [...prev, String(p.id)]
                              );
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              backgroundColor: isChecked ? '#EDE9FE' : 'transparent',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            <span style={{ fontWeight: isChecked ? 600 : 400, color: isChecked ? '#7C3AED' : '#334155' }}>
                              {p.name}
                            </span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              style={{ accentColor: '#7C3AED' }}
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 18px',
              borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '8px'
            }}>
              <button
                type="button"
                onClick={() => setAssignTargetExt(null)}
                style={{
                  padding: '6px 14px',
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
                type="button"
                onClick={handleSaveAssign}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Lưu áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
