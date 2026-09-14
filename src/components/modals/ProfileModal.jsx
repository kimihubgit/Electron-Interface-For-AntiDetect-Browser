import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Shield, 
  X, 
  Edit3, 
  Check, 
  Globe, 
  Sliders, 
  Folder, 
  Layers, 
  Sparkles, 
  Monitor, 
  Cpu, 
  Volume2, 
  Camera, 
  Mic, 
  Compass, 
  Clock, 
  Languages, 
  Maximize2, 
  HardDrive,
  Eye,
  Zap,
  ExternalLink,
  Download,
  Shuffle,
  ShieldCheck
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import BrowserCoreManagerModal from './BrowserCoreManagerModal';
import { getInstalledBrowserOptions } from '../../services/browserCoreService';

// Standard User-Agents by OS & Browser
const OS_PRESETS = {
  windows: {
    name: 'Windows',
    versions: ['11', '10', '7'],
    defaultVersion: '10',
    uaTemplate: (v, bVer) => `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${bVer}.0.0.0 Safari/537.36`,
    uaFullVersion: (bVer) => String(bVer) === '152' ? '152.0.7958.0' : `${bVer}.0.7871.102`
  },
  mac: {
    name: 'macOS',
    versions: ['14 (Sonoma)', '13 (Ventura)', '12 (Monterey)'],
    defaultVersion: '14 (Sonoma)',
    uaTemplate: (v, bVer) => `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${bVer}.0.0.0 Safari/537.36`,
    uaFullVersion: (bVer) => String(bVer) === '152' ? '152.0.7958.0' : `${bVer}.0.7871.102`
  },
  linux: {
    name: 'Linux',
    versions: ['Ubuntu 24.04', 'Debian 12', 'Fedora 40'],
    defaultVersion: 'Ubuntu 24.04',
    uaTemplate: (v, bVer) => `Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${bVer}.0.0.0 Safari/537.36`,
    uaFullVersion: (bVer) => String(bVer) === '152' ? '152.0.7958.0' : `${bVer}.0.7871.102`
  },
  ios: {
    name: 'iOS',
    versions: ['iOS 17.5', 'iOS 17.0', 'iOS 16.6'],
    defaultVersion: 'iOS 17.5',
    uaTemplate: (v, bVer) => `Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/${bVer}.0.0.0 Mobile/15E148 Safari/604.1`,
    uaFullVersion: (bVer) => String(bVer) === '152' ? '152.0.7958.0' : `${bVer}.0.7871.102`
  },
  android: {
    name: 'Android',
    versions: ['Android 14', 'Android 13', 'Android 12'],
    defaultVersion: 'Android 14',
    uaTemplate: (v, bVer) => `Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${bVer}.0.0.0 Mobile Safari/537.36`,
    uaFullVersion: (bVer) => String(bVer) === '152' ? '152.0.7958.0' : `${bVer}.0.7871.102`
  }
};

// OS Icons
const WindowsIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0078D7">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.551H10.949M0 12.6h9.75V22.05L0 20.7m10.949-8.1H24V24l-13.051-1.8" fill="currentColor"/>
  </svg>
);

const AppleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#0F172A">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.67-1.09 1.74-.96 2.77 1 .08 2.03-.51 2.69-1.27z"/>
  </svg>
);

const LinuxIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
    <path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.2.5 2.3 1.2 3.1-.7.6-1.2 1.5-1.2 2.5 0 .5.1 1 .4 1.4-1.1.8-1.9 2-1.9 3.5 0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4 0-1.5-.8-2.7-1.9-3.5.3-.4.4-.9.4-1.4 0-1-.5-1.9-1.2-2.5.7-.8 1.2-1.9 1.2-3.1C16.5 4 14.5 2 12 2z"/>
  </svg>
);

const AndroidIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#3DDC84">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-4.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 2.23 12.95 2 12 2c-.96 0-1.86.23-2.66.63L7.85 1.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 4.26 6 6.01 6 8h12c0-1.99-.97-3.75-2.47-4.84zM10 5.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm4 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z"/>
  </svg>
);

const renderOsIcon = (osKey, size = 16) => {
  switch (osKey) {
    case 'windows': return <WindowsIcon size={size} />;
    case 'mac': return <AppleIcon size={size} />;
    case 'linux': return <LinuxIcon size={size} />;
    case 'android': return <AndroidIcon size={size} />;
    case 'ios': return <AppleIcon size={size} />;
    default: return <WindowsIcon size={size} />;
  }
};

const getDisplayOsVersion = (osKey, v) => {
  if (!v) return 'Mặc định';
  if (osKey === 'windows') {
    return v.startsWith('Windows') ? v : `Windows ${v}`;
  }
  if (osKey === 'mac') {
    return v.startsWith('macOS') ? v : `macOS ${v}`;
  }
  return v;
};

// Kernel / Browser Core Icon (Blue circle with stylized ring matching screenshot)
const KernelIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#0284C7" strokeWidth="2.2" fill="#E0F2FE" />
    <circle cx="12" cy="12" r="4.5" fill="#0284C7" />
    <path d="M12 2A10 10 0 0 1 20.66 7L12 12" stroke="#0284C7" strokeWidth="1.8" />
    <path d="M20.66 17A10 10 0 0 1 7.34 20.66L12 12" stroke="#0284C7" strokeWidth="1.8" />
    <path d="M3.34 7A10 10 0 0 1 12 2L12 12" stroke="#0284C7" strokeWidth="1.8" />
  </svg>
);

const getDisplayKernel = (choice) => {
  if (!choice) return 'RoxyChrome 138';
  const ver = choice.version || '138';
  return `RoxyChrome ${ver}`;
};

// Search Engine Icons & Options
const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
);

const BingIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#008373">
    <path d="M5 3v18l5.5-3.2L16 21l3-1.8V7.5L13.5 5 10.5 8V4.5L8.5 3H5zm5.5 8.2l3-1.8v5.1l-3 1.8v-5.1z" />
  </svg>
);

const DuckDuckGoIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#DE5833">
    <circle cx="12" cy="12" r="10" fill="#DE5833"/>
    <path d="M8 14c1.5 2 5.5 2 7 0" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill="#FFF"/>
    <circle cx="15" cy="10" r="1.5" fill="#FFF"/>
  </svg>
);

const YahooIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#6001D2">
    <rect width="24" height="24" rx="4" fill="#6001D2" />
    <path d="M6 6l4 7v5h2v-5l4-7h-2.5l-2.5 5-2.5-5H6zM17 14h2v4h-2z" fill="#FFF" />
  </svg>
);

const YandexIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FC3F1D">
    <circle cx="12" cy="12" r="10" fill="#FC3F1D" />
    <path d="M14 6h-2.5c-2 0-3.5 1.5-3.5 3.5 0 1.5.8 2.7 2 3.2L7.5 18H10l2.5-5.3h.5V18H15V6h-1zm-.5 4.7h-1c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5h1v3z" fill="#FFF" />
  </svg>
);

const BaiduIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#2932E1">
    <circle cx="6.5" cy="9.5" r="2" fill="#2932E1"/>
    <circle cx="17.5" cy="9.5" r="2" fill="#2932E1"/>
    <circle cx="9.5" cy="5.5" r="2" fill="#2932E1"/>
    <circle cx="14.5" cy="5.5" r="2" fill="#2932E1"/>
    <path d="M12 10c-3 0-5 2-5 5 0 2 2 4 5 4s5-2 5-4c0-3-2-5-5-5z" fill="#2932E1"/>
  </svg>
);

const SEARCH_ENGINE_OPTIONS = [
  { id: 'google', label: 'Google', url: 'https://www.google.com', icon: GoogleIcon },
  { id: 'bing', label: 'Bing', url: 'https://www.bing.com', icon: BingIcon },
  { id: 'duckduckgo', label: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: DuckDuckGoIcon },
  { id: 'yahoo', label: 'Yahoo', url: 'https://search.yahoo.com', icon: YahooIcon },
  { id: 'yandex', label: 'Yandex', url: 'https://yandex.com', icon: YandexIcon },
  { id: 'baidu', label: 'Baidu', url: 'https://www.baidu.com', icon: BaiduIcon }
];

const BROWSER_OPTIONS = [
  { id: '152', label: 'RoxyChrome 152 (Khuyên dùng)', version: '152' },
  { id: '138', label: 'RoxyChrome 138 (Stable)', version: '138' },
  { id: '132', label: 'RoxyChrome 132', version: '132' },
  { id: '130', label: 'RoxyChrome 130', version: '130' },
  { id: '128', label: 'RoxyChrome 128', version: '128' }
];

const TIMEZONE_OPTIONS = [
  { id: 'Asia/Ho_Chi_Minh', label: '(GMT+07:00) Asia/Ho_Chi_Minh (Việt Nam)' },
  { id: 'Asia/Bangkok', label: '(GMT+07:00) Asia/Bangkok (Thái Lan)' },
  { id: 'Asia/Singapore', label: '(GMT+08:00) Asia/Singapore' },
  { id: 'Asia/Tokyo', label: '(GMT+09:00) Asia/Tokyo (Nhật Bản)' },
  { id: 'Asia/Seoul', label: '(GMT+09:00) Asia/Seoul (Hàn Quốc)' },
  { id: 'America/New_York', label: '(GMT-05:00) America/New_York (US East)' },
  { id: 'America/Chicago', label: '(GMT-06:00) America/Chicago (US Central)' },
  { id: 'America/Los_Angeles', label: '(GMT-08:00) America/Los_Angeles (US West)' },
  { id: 'Europe/London', label: '(GMT+00:00) Europe/London (UK)' },
  { id: 'Europe/Paris', label: '(GMT+01:00) Europe/Paris (France)' },
  { id: 'Europe/Berlin', label: '(GMT+01:00) Europe/Berlin (Germany)' },
  { id: 'Australia/Sydney', label: '(GMT+10:00) Australia/Sydney' }
];

const LANGUAGE_OPTIONS = [
  { id: 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7', label: 'vi-VN,vi (Tiếng Việt)' },
  { id: 'en-US,en;q=0.9', label: 'en-US,en (English - United States)' },
  { id: 'en-GB,en;q=0.9', label: 'en-GB,en (English - United Kingdom)' },
  { id: 'zh-CN,zh;q=0.9,en;q=0.8', label: 'zh-CN,zh (Tiếng Trung giản thể)' },
  { id: 'ja-JP,ja;q=0.9,en;q=0.8', label: 'ja-JP,ja (Tiếng Nhật)' },
  { id: 'ko-KR,ko;q=0.9,en;q=0.8', label: 'ko-KR,ko (Tiếng Hàn)' },
  { id: 'de-DE,de;q=0.9,en;q=0.8', label: 'de-DE,de (Tiếng Đức)' },
  { id: 'fr-FR,fr;q=0.9,en;q=0.8', label: 'fr-FR,fr (Tiếng Pháp)' }
];

const RESOLUTION_OPTIONS = [
  '1920 × 1080',
  '1440 × 900',
  '1366 × 768',
  '1280 × 720',
  '2560 × 1440',
  '1536 × 864',
  '3840 × 2160'
];

const WEBGL_VENDORS = [
  'Google Inc. (NVIDIA)',
  'Google Inc. (Intel)',
  'Google Inc. (AMD)',
  'Apple Inc.',
  'Google Inc. (Qualcomm)'
];

const WEBGL_RENDERERS = [
  'ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'ANGLE (NVIDIA, NVIDIA GeForce GTX 1660 SUPER Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)',
  'Apple M2 Max',
  'Apple M1 Pro'
];

const TARGET_WEBSITE_PRESETS = [
  { label: 'Facebook', url: 'https://www.facebook.com' },
  { label: 'TikTok', url: 'https://seller-vn.tiktok.com' },
  { label: 'Shopee', url: 'https://shopee.vn' },
  { label: 'Amazon', url: 'https://www.amazon.com' },
  { label: 'YouTube', url: 'https://www.youtube.com' },
  { label: 'Twitter / X', url: 'https://x.com' },
  { label: 'Binance', url: 'https://www.binance.com' }
];

export default function ProfileModal() {
  const { t } = useTranslation();
  const { 
    activeProfileModal,
    setActiveProfileModal, 
    saveProfile, 
    profiles = [], 
    proxies = [],
    customGroups = [],
    addLog,
    showToast
  } = useBrowser();

  const isEditing = activeProfileModal && activeProfileModal !== 'new';
  const initialData = isEditing ? activeProfileModal : {};

  // Extract unique existing groups
  const existingGroups = Array.from(new Set([
    ...customGroups.map(g => g.name),
    'Chung',
    ...profiles.map(p => p.group).filter(Boolean)
  ]));

  // Sub-Tabs: General | Proxy | Fingerprint | Location | Advanced
  const [activeTab, setActiveTab] = useState('General');

  // 1. GENERAL TAB STATES
  const [folder, setFolder] = useState(initialData.group || (customGroups[0]?.name || 'Chung'));
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);
  const [title, setTitle] = useState(initialData.name || '');
  const [selectedOs, setSelectedOs] = useState(initialData.os || 'windows');
  const [osVersion, setOsVersion] = useState(initialData.osVersion || '10');
  const [installedCores, setInstalledCores] = useState(() => getInstalledBrowserOptions());
  const [isCoreManagerOpen, setIsCoreManagerOpen] = useState(false);

  // Sync with core update events
  useEffect(() => {
    const handleCoresUpdated = () => {
      const opts = getInstalledBrowserOptions();
      setInstalledCores(opts);
    };
    window.addEventListener('antidetect-cores-updated', handleCoresUpdated);
    return () => window.removeEventListener('antidetect-cores-updated', handleCoresUpdated);
  }, []);

  const [browserChoice, setBrowserChoice] = useState(() => {
    const opts = getInstalledBrowserOptions();
    if (initialData.browser) {
      const match = opts.find(b => initialData.browser.includes(b.version));
      if (match) return match;
    }
    return opts[0] || BROWSER_OPTIONS[0];
  });
  const [isOsDropdownOpen, setIsOsDropdownOpen] = useState(false);
  const [isOsVersionDropdownOpen, setIsOsVersionDropdownOpen] = useState(false);
  const [isKernelDropdownOpen, setIsKernelDropdownOpen] = useState(false);
  const [searchEngine, setSearchEngine] = useState(initialData.searchEngine || 'google');

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest?.('.system-kernel-dropdown')) {
        setIsOsDropdownOpen(false);
        setIsOsVersionDropdownOpen(false);
        setIsKernelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const [customUserAgent, setCustomUserAgent] = useState(initialData.userAgent || '');
  const [isEditingUa, setIsEditingUa] = useState(false);
  const [remark, setRemark] = useState(initialData.remark || initialData.notes || '');
  
  // Website đích (Target / Start URL)
  const [startUrls, setStartUrls] = useState(initialData.startUrls || initialData.targetUrl || '');

  // 2. PROXY TAB STATES
  const hasProxy = initialData.proxy && initialData.proxy.type && initialData.proxy.type !== 'NO_PROXY';
  const [proxyMode, setProxyMode] = useState(hasProxy ? 'custom' : 'no_proxy');
  const [proxyType, setProxyType] = useState(hasProxy ? initialData.proxy.type : 'SOCKS5');
  const [proxyHost, setProxyHost] = useState(hasProxy ? (initialData.proxy.host || '') : '');
  const [proxyPort, setProxyPort] = useState(hasProxy && initialData.proxy.port ? String(initialData.proxy.port) : '');
  const [proxyUser, setProxyUser] = useState(hasProxy ? (initialData.proxy.user || '') : '');
  const [proxyPass, setProxyPass] = useState(hasProxy ? (initialData.proxy.pass || '') : '');
  const [proxyTesting, setProxyTesting] = useState(false);
  const [proxyTestResult, setProxyTestResult] = useState(null);

  // 3. FINGERPRINT & HARDWARE STATES
  // Canvas (noise / real / off)
  const [canvasNoise, setCanvasNoise] = useState(initialData.canvas || 'noise');
  // Audio context (noise / real / off)
  const [audioNoise, setAudioNoise] = useState(initialData.audio || 'noise');
  // ClientRects (noise / real)
  const [clientRectsNoise, setClientRectsNoise] = useState(initialData.clientRects || 'noise');
  // WebGL Image (noise / real / off)
  const [webglImageNoise, setWebglImageNoise] = useState(initialData.webglImage || 'noise');
  // WebGL Metadata (spoof / real)
  const [webglMetadataMode, setWebglMetadataMode] = useState(initialData.webglMetadataMode || 'spoof');
  // WebGL Vendor & Renderer
  const [webglVendor, setWebglVendor] = useState(initialData.webglVendor || 'Google Inc. (NVIDIA)');
  const [webglRenderer, setWebglRenderer] = useState(initialData.webglRenderer || 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0, D3D11)');
  // CPU & RAM
  const [cpuCores, setCpuCores] = useState(initialData.cores || 8);
  const [ramGb, setRamGb] = useState(initialData.ram || 16);
  // Media Devices (Video / Audio inputs)
  const [videoInputsCount, setVideoInputsCount] = useState(initialData.videoInputs !== undefined ? initialData.videoInputs : 1);
  const [audioInputsCount, setAudioInputsCount] = useState(initialData.audioInputs !== undefined ? initialData.audioInputs : 1);
  const [audioOutputsCount, setAudioOutputsCount] = useState(initialData.audioOutputs !== undefined ? initialData.audioOutputs : 1);

  // 4. LOCATION & TIMEZONE & DISPLAY STATES
  // Timezone (auto / manual)
  const [timezoneMode, setTimezoneMode] = useState(initialData.timezoneMode || 'auto');
  const [timezone, setTimezone] = useState(initialData.timezone || 'Asia/Ho_Chi_Minh');
  // Language (auto / manual)
  const [languageMode, setLanguageMode] = useState(initialData.languageMode || 'auto');
  const [language, setLanguage] = useState(initialData.language || 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7');
  // Location (auto / prompt / block / manual)
  const [locationMode, setLocationMode] = useState(initialData.locationMode || 'auto');
  const [latitude, setLatitude] = useState(initialData.latitude || '10.762622');
  const [longitude, setLongitude] = useState(initialData.longitude || '106.660172');
  const [accuracy, setAccuracy] = useState(initialData.accuracy || 10);
  // Resolution
  const [screenResolution, setScreenResolution] = useState(initialData.resolution ? initialData.resolution.replace('x', ' × ') : '1920 × 1080');

  // 5. ADVANCED STATES
  const [webrtcPolicy, setWebrtcPolicy] = useState(initialData.webrtc || 'altered');
  const [dnsServer, setDnsServer] = useState(initialData.dnsServer || 'cloudflare');
  const [ignoreCertError, setIgnoreCertError] = useState(initialData.ignoreCertError || 'Disabled');
  const [initialCookies, setInitialCookies] = useState(initialData.cookies || '');

  // Generate User-Agent based on OS and Browser
  const currentUa = customUserAgent || (OS_PRESETS[selectedOs] ? OS_PRESETS[selectedOs].uaTemplate(osVersion, browserChoice.version) : OS_PRESETS.windows.uaTemplate('10', '150'));
  const currentUaFullVersion = OS_PRESETS[selectedOs] ? OS_PRESETS[selectedOs].uaFullVersion(browserChoice.version) : '150.0.7871.102';

  // Update default OS version when OS changes
  useEffect(() => {
    if (!isEditing && OS_PRESETS[selectedOs]) {
      setOsVersion(OS_PRESETS[selectedOs].defaultVersion);
      setCustomUserAgent('');
    }
  }, [selectedOs]);

  // Randomize all Fingerprint values realistically
  const handleRandomize = () => {
    const osKeys = ['windows', 'mac', 'linux'];
    const randomOs = osKeys[Math.floor(Math.random() * osKeys.length)];
    const randomBrowser = BROWSER_OPTIONS[Math.floor(Math.random() * BROWSER_OPTIONS.length)];
    const randomVersion = OS_PRESETS[randomOs].versions[0];
    const randomRes = RESOLUTION_OPTIONS[Math.floor(Math.random() * RESOLUTION_OPTIONS.length)];
    const coreOptions = [4, 6, 8, 12, 16];
    const randomCores = coreOptions[Math.floor(Math.random() * coreOptions.length)];
    const ramOptions = [8, 16, 32];
    const randomRam = ramOptions[Math.floor(Math.random() * ramOptions.length)];
    const randomVendor = WEBGL_VENDORS[Math.floor(Math.random() * WEBGL_VENDORS.length)];
    const randomRenderer = WEBGL_RENDERERS[Math.floor(Math.random() * WEBGL_RENDERERS.length)];

    setSelectedOs(randomOs);
    setOsVersion(randomVersion);
    setBrowserChoice(randomBrowser);
    setScreenResolution(randomRes);
    setCpuCores(randomCores);
    setRamGb(randomRam);
    setWebglVendor(randomVendor);
    setWebglRenderer(randomRenderer);
    setCanvasNoise('noise');
    setAudioNoise('noise');
    setClientRectsNoise('noise');
    setWebglImageNoise('noise');
    setCustomUserAgent('');

    if (addLog) addLog('Đã tạo ngẫu nhiên toàn bộ dấu vân tay hồ sơ', 'info');
  };

  // Test Proxy Latency
  const handleTestProxy = () => {
    if (!proxyHost || !proxyPort) {
      alert('Vui lòng nhập đầy đủ Host và Port của Proxy!');
      return;
    }
    setProxyTesting(true);
    setProxyTestResult(null);
    setTimeout(() => {
      setProxyTesting(false);
      setProxyTestResult({
        success: true,
        ip: proxyHost,
        country: 'United States (US)',
        latency: Math.floor(25 + Math.random() * 45)
      });
    }, 700);
  };

  // Submit Profile (Create or Edit)
  const handleConfirm = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên hồ sơ (Title)!');
      return;
    }

    const profilePayload = {
      ...(isEditing ? { id: activeProfileModal.id } : {}),
      name: title.trim(),
      group: folder || 'Default',
      os: selectedOs,
      osVersion: osVersion,
      browser: `Chrome ${browserChoice.version}`,
      userAgent: currentUa,
      proxy: proxyMode === 'no_proxy' ? { type: 'NO_PROXY' } : {
        type: proxyType,
        host: proxyHost,
        port: proxyPort ? parseInt(proxyPort, 10) : 1080,
        user: proxyUser,
        pass: proxyPass
      },
      // Website đích & Search Engine
      searchEngine,
      targetUrl: startUrls.trim(),
      startUrls: startUrls.trim(),
      // Timezone & Location & Language
      timezoneMode,
      timezone: timezoneMode === 'auto' ? 'Theo Proxy' : timezone,
      languageMode,
      language: languageMode === 'auto' ? 'Theo Proxy' : language,
      locationMode,
      latitude: locationMode === 'manual' ? latitude : null,
      longitude: locationMode === 'manual' ? longitude : null,
      accuracy: locationMode === 'manual' ? accuracy : null,
      // Resolution & Hardware
      resolution: screenResolution.replace(' × ', 'x'),
      cores: cpuCores,
      ram: ramGb,
      // Fingerprint details
      canvas: canvasNoise,
      audio: audioNoise,
      clientRects: clientRectsNoise,
      webglImage: webglImageNoise,
      webglMetadataMode,
      webglVendor,
      webglRenderer,
      videoInputs: videoInputsCount,
      audioInputs: audioInputsCount,
      audioOutputs: audioOutputsCount,
      // Network & Advanced
      webrtc: webrtcPolicy,
      dnsServer,
      ignoreCertError,
      remark,
      cookies: initialCookies,
      tags: [folder, selectedOs]
    };

    saveProfile(profilePayload);
    if (showToast) {
      showToast(
        isEditing
          ? t('toasts.profileUpdated', `Đã cập nhật hồ sơ "${profilePayload.name}" thành công!`, { name: profilePayload.name })
          : t('toasts.profileCreated', `Tạo mới hồ sơ "${profilePayload.name}" thành công!`, { name: profilePayload.name }),
        'success'
      );
    }
    if (addLog) addLog(isEditing ? `Đã cập nhật hồ sơ: "${profilePayload.name}"` : `Đã tạo thành công hồ sơ: "${profilePayload.name}"`, 'success');
    setActiveProfileModal(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* ── MAIN MODAL CONTAINER ── */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        height: '92vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid #E2E8F0',
        color: '#1E293B'
      }}>

        {/* ── TOP HEADER (< Create profile / < Edit profile) ── */}
        <div style={{
          height: '52px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EDF2F7',
          flexShrink: 0
        }}>
          <div 
            onClick={() => setActiveProfileModal(null)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              color: '#475569',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#1E293B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
          >
            <ChevronLeft size={18} />
            <span style={{ fontSize: '15.5px', fontWeight: 600, color: '#1E293B' }}>
              {isEditing ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ mới (Create Profile)'}
            </span>
          </div>

          <button
            onClick={() => setActiveProfileModal(null)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── SUB-TABS NAVIGATION ── */}
        <div style={{
          height: '46px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderBottom: '1px solid #EDF2F7',
          flexShrink: 0,
          backgroundColor: '#FAFAFA'
        }}>
          {[
            { id: 'General', label: 'Tổng quan & Website đích' },
            { id: 'Proxy', label: 'Cấu hình Proxy' },
            { id: 'Fingerprint', label: 'Vân tay & Phần cứng (Fingerprint)' },
            { id: 'Location', label: 'Vị trí, Múi giờ & Màn hình' },
            { id: 'Advanced', label: 'Mạng nâng cao & Cookies' }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  height: '100%',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#2563EB' : '#64748B',
                  borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: '0 4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TWO-COLUMN BODY LAYOUT ── */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN: MAIN CONFIGURATION FORM & STICKY ACTIONS       */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* Scrollable Form Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 32px 28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 1: GENERAL (Tổng quan & Website đích)                 */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'General' && (
              <>
                {/* 1. Nhóm / Folder */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '160px', fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    Nhóm hồ sơ <span style={{ color: '#EF4444' }}>*</span>
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div 
                      onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                      style={{
                        height: '38px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        backgroundColor: '#FFFFFF',
                        fontSize: '13px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Folder size={15} style={{ color: '#2563EB' }} />
                        <span style={{ fontWeight: 500, color: '#1E293B' }}>{folder}</span>
                      </div>
                      <ChevronDown size={15} color="#94A3B8" />
                    </div>

                    {isFolderDropdownOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '42px',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                        zIndex: 20,
                        padding: '6px 0',
                        maxHeight: '180px',
                        overflowY: 'auto'
                      }}>
                        {existingGroups.map(g => (
                          <div
                            key={g}
                            onClick={() => {
                              setFolder(g);
                              setIsFolderDropdownOpen(false);
                            }}
                            style={{
                              padding: '8px 14px',
                              fontSize: '13px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              backgroundColor: folder === g ? '#EFF6FF' : 'transparent',
                              color: folder === g ? '#2563EB' : '#1E293B'
                            }}
                          >
                            <span>{g}</span>
                            {folder === g && <Check size={14} color="#2563EB" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Tên hồ sơ (Title) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '160px', fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    Tên hồ sơ (Title) <span style={{ color: '#EF4444' }}>*</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Nhập tên hồ sơ..."
                      style={{
                        width: '100%',
                        height: '38px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0 12px',
                        fontSize: '13px',
                        color: '#1E293B',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* 3. Website đích (Target / Start URL) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ExternalLink size={15} style={{ color: '#2563EB' }} />
                      <span>Website đích (Startup URL)</span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Trang web tự động mở khi bắt đầu khởi chạy hồ sơ
                    </span>
                  </div>

                  <input
                    type="text"
                    value={startUrls}
                    onChange={(e) => setStartUrls(e.target.value)}
                    placeholder="https://www.facebook.com... (để trống sẽ mở trang tìm kiếm mặc định)"
                    style={{
                      width: '100%',
                      height: '38px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '0 12px',
                      fontSize: '13px',
                      color: '#1E293B',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  />

                  {/* Preset Quick Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <span style={{ fontSize: '11.5px', color: '#64748B', marginRight: '4px' }}>Chọn nhanh:</span>
                    {TARGET_WEBSITE_PRESETS.map((site) => (
                      <button
                        key={site.label}
                        type="button"
                        onClick={() => setStartUrls(site.url)}
                        style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11.5px',
                          fontWeight: startUrls === site.url ? 600 : 500,
                          cursor: 'pointer',
                          border: startUrls === site.url ? '1px solid #2563EB' : '1px solid #CBD5E1',
                          backgroundColor: startUrls === site.url ? '#EFF6FF' : '#FFFFFF',
                          color: startUrls === site.url ? '#2563EB' : '#334155'
                        }}
                      >
                        {site.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. System & Kernel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>
                    System & Kernel
                  </label>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Left: OS Selection (OS Icon + Version Dropdown) */}
                    <div className="system-kernel-dropdown" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {/* OS Icon Button with Dropdown */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOsDropdownOpen(prev => !prev);
                            setIsOsVersionDropdownOpen(false);
                            setIsKernelDropdownOpen(false);
                          }}
                          style={{
                            height: '38px',
                            padding: '0 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          title={`Hệ điều hành: ${OS_PRESETS[selectedOs]?.name || selectedOs}`}
                        >
                          {renderOsIcon(selectedOs, 16)}
                          <ChevronDown size={13} color="#64748B" />
                        </button>

                        {isOsDropdownOpen && (
                          <div style={{
                            position: 'absolute',
                            top: '42px',
                            left: 0,
                            width: '160px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                            zIndex: 50,
                            padding: '4px 0',
                            overflow: 'hidden'
                          }}>
                            {Object.keys(OS_PRESETS).map(key => {
                              const os = OS_PRESETS[key];
                              const isSelected = selectedOs === key;
                              return (
                                <div
                                  key={key}
                                  onClick={() => {
                                    setSelectedOs(key);
                                    setOsVersion(os.defaultVersion);
                                    setCustomUserAgent('');
                                    setIsOsDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: '8px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '8px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                                    color: isSelected ? '#2563EB' : '#1E293B'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {renderOsIcon(key, 16)}
                                    <span>{os.name}</span>
                                  </div>
                                  {isSelected && <Check size={14} color="#2563EB" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* OS Version Dropdown */}
                      <div style={{ position: 'relative', flex: 1 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOsVersionDropdownOpen(prev => !prev);
                            setIsOsDropdownOpen(false);
                            setIsKernelDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            height: '38px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '13px',
                            color: '#1E293B',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{getDisplayOsVersion(selectedOs, osVersion)}</span>
                          <ChevronDown size={14} color="#64748B" />
                        </button>

                        {isOsVersionDropdownOpen && (
                          <div style={{
                            position: 'absolute',
                            top: '42px',
                            left: 0,
                            right: 0,
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                            zIndex: 50,
                            padding: '4px 0',
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}>
                            {OS_PRESETS[selectedOs]?.versions.map(v => {
                              const isSelected = osVersion === v;
                              return (
                                <div
                                  key={v}
                                  onClick={() => {
                                    setOsVersion(v);
                                    setCustomUserAgent('');
                                    setIsOsVersionDropdownOpen(false);
                                  }}
                                  style={{
                                    padding: '8px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                                    color: isSelected ? '#2563EB' : '#1E293B'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                  }}
                                >
                                  <span>{getDisplayOsVersion(selectedOs, v)}</span>
                                  {isSelected && <Check size={14} color="#2563EB" />}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Kernel Dropdown */}
                    <div className="system-kernel-dropdown" style={{ flex: 1, position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsKernelDropdownOpen(prev => !prev);
                          setIsOsDropdownOpen(false);
                          setIsOsVersionDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: '0 12px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '13px',
                          color: '#1E293B',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <KernelIcon size={17} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {getDisplayKernel(browserChoice)}
                          </span>
                        </div>
                        <ChevronDown size={14} color="#64748B" />
                      </button>

                      {isKernelDropdownOpen && (
                        <div style={{
                          position: 'absolute',
                          top: '42px',
                          left: 0,
                          right: 0,
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                          zIndex: 50,
                          padding: '4px 0',
                          maxHeight: '260px',
                          overflowY: 'auto'
                        }}>
                          <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Nhân Browser Core khả dụng
                          </div>
                          {installedCores.map(b => {
                            const isSelected = browserChoice.version === b.version;
                            return (
                              <div
                                key={b.version}
                                onClick={() => {
                                  setBrowserChoice(b);
                                  setIsKernelDropdownOpen(false);
                                }}
                                style={{
                                  padding: '8px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                                  color: isSelected ? '#2563EB' : '#1E293B'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <KernelIcon size={16} />
                                  <span style={{ fontWeight: isSelected ? 600 : 400 }}>{getDisplayKernel(b)}</span>
                                  {b.isRecommended && (
                                    <span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 600 }}>
                                      Khuyên dùng
                                    </span>
                                  )}
                                </div>
                                {isSelected && <Check size={14} color="#2563EB" />}
                              </div>
                            );
                          })}

                          <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setIsKernelDropdownOpen(false);
                                setIsCoreManagerOpen(true);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                color: '#7C3AED',
                                fontSize: '12px',
                                fontWeight: 600,
                                textAlign: 'left',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F3FF'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <Download size={13} />
                              <span>Quản lý & Tải thêm nhân Core khác...</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Công cụ tìm kiếm (Search Engine) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Compass size={15} style={{ color: '#7C3AED' }} />
                      <span>Công cụ tìm kiếm mặc định (Search Engine)</span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Công cụ tìm kiếm của thanh địa chỉ & tab mới
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {SEARCH_ENGINE_OPTIONS.map(eng => {
                      const isSelected = searchEngine === eng.id;
                      const Icon = eng.icon;
                      return (
                        <button
                          key={eng.id}
                          type="button"
                          onClick={() => setSearchEngine(eng.id)}
                          style={{
                            height: '36px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            border: isSelected ? '1.5px solid #7C3AED' : '1px solid #CBD5E1',
                            backgroundColor: isSelected ? '#F5F3FF' : '#FFFFFF',
                            color: isSelected ? '#7C3AED' : '#334155',
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: '12.5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '7px',
                            boxShadow: isSelected ? '0 2px 4px rgba(124, 58, 237, 0.12)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Icon size={16} />
                          <span>{eng.label}</span>
                          {isSelected && <Check size={13} color="#7C3AED" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. User-Agent */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Chuỗi User-Agent</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingUa(!isEditingUa)}
                      style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={13} />
                      <span>{isEditingUa ? 'Khóa chỉnh sửa' : 'Tùy chỉnh thủ công'}</span>
                    </button>
                  </div>
                  {isEditingUa ? (
                    <input
                      type="text"
                      value={customUserAgent || currentUa}
                      onChange={(e) => setCustomUserAgent(e.target.value)}
                      style={{ width: '100%', height: '36px', border: '1px solid #2563EB', borderRadius: '6px', padding: '0 10px', fontSize: '12px', fontFamily: 'monospace' }}
                    />
                  ) : (
                    <div style={{ padding: '8px 12px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '11.5px', fontFamily: 'monospace', color: '#475569', wordBreak: 'break-all' }}>
                      {currentUa}
                    </div>
                  )}
                </div>

                {/* 7. Remark */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Ghi chú (Remark)</span>
                  <textarea
                    value={remark}
                    maxLength={500}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Ghi chú mục đích sử dụng cho profile này..."
                    style={{ width: '100%', height: '60px', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', resize: 'none' }}
                  />
                </div>
              </>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 2: PROXY                                              */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'Proxy' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px' }}>
                    <input 
                      type="radio" 
                      name="proxyMode" 
                      checked={proxyMode === 'no_proxy'} 
                      onChange={() => setProxyMode('no_proxy')} 
                    />
                    <span>Không dùng Proxy (Direct IP)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13.5px' }}>
                    <input 
                      type="radio" 
                      name="proxyMode" 
                      checked={proxyMode === 'custom'} 
                      onChange={() => setProxyMode('custom')} 
                    />
                    <span>Cấu hình Proxy riêng</span>
                  </label>
                </div>

                {proxyMode === 'custom' && (
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['SOCKS5', 'HTTP', 'HTTPS'].map(t => (
                        <button
                          key={t}
                          onClick={() => setProxyType(t)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: proxyType === t ? '1.5px solid #2563EB' : '1px solid #CBD5E1',
                            backgroundColor: proxyType === t ? '#EFF6FF' : '#FFFFFF',
                            color: proxyType === t ? '#2563EB' : '#475569',
                            fontWeight: 600,
                            fontSize: '12.5px',
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#475569' }}>Máy chủ (Host / IP)</div>
                        <input
                          type="text"
                          placeholder="154.21.32.88"
                          value={proxyHost}
                          onChange={(e) => setProxyHost(e.target.value)}
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#475569' }}>Cổng (Port)</div>
                        <input
                          type="text"
                          placeholder="1080"
                          value={proxyPort}
                          onChange={(e) => setProxyPort(e.target.value)}
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#475569' }}>Tài khoản (Username)</div>
                        <input
                          type="text"
                          placeholder="Tùy chọn"
                          value={proxyUser}
                          onChange={(e) => setProxyUser(e.target.value)}
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: '#475569' }}>Mật khẩu (Password)</div>
                        <input
                          type="password"
                          placeholder="Tùy chọn"
                          value={proxyPass}
                          onChange={(e) => setProxyPass(e.target.value)}
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                      <button
                        onClick={handleTestProxy}
                        disabled={proxyTesting}
                        style={{
                          height: '34px',
                          padding: '0 16px',
                          backgroundColor: '#2563EB',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {proxyTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối Proxy'}
                      </button>

                      {proxyTestResult && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', fontWeight: 600 }}>
                          <Check size={14} />
                          <span>Kết nối ổn định ({proxyTestResult.latency} ms) - IP: {proxyTestResult.ip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 3: FINGERPRINT & HARDWARE (Canvas, WebGL, Audio...)   */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'Fingerprint' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* 1. Canvas, Audio, ClientRects 3-in-1 Block */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {/* Canvas */}
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>Canvas Fingerprint</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>Chống vẽ nhận diện điểm ảnh 2D</div>
                    <select
                      value={canvasNoise}
                      onChange={(e) => setCanvasNoise(e.target.value)}
                      style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                    >
                      <option value="noise">Nhiễu (Noise - Khuyên dùng)</option>
                      <option value="real">Nguyên bản (Real)</option>
                      <option value="off">Chặn (Block)</option>
                    </select>
                  </div>

                  {/* Audio Context */}
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>Audio Context</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>Chống dò tần số âm thanh</div>
                    <select
                      value={audioNoise}
                      onChange={(e) => setAudioNoise(e.target.value)}
                      style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                    >
                      <option value="noise">Nhiễu (Noise - Khuyên dùng)</option>
                      <option value="real">Nguyên bản (Real)</option>
                      <option value="off">Chặn (Block)</option>
                    </select>
                  </div>

                  {/* Client Rects */}
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>Client Rects</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>Chống đo pixel khung render</div>
                    <select
                      value={clientRectsNoise}
                      onChange={(e) => setClientRectsNoise(e.target.value)}
                      style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                    >
                      <option value="noise">Nhiễu (Noise - Khuyên dùng)</option>
                      <option value="real">Nguyên bản (Real)</option>
                    </select>
                  </div>
                </div>

                {/* 2. WebGL Image & WebGL Metadata Block */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>Cấu hình Đồ Họa WebGL (Vendor & Renderer)</div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>Mô phỏng vân tay GPU 3D và chữ ký phần cứng card màn hình</div>
                    </div>
                    
                    {/* WebGL Image noise option */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#475569', fontWeight: 500 }}>WebGL Image:</span>
                      <select
                        value={webglImageNoise}
                        onChange={(e) => setWebglImageNoise(e.target.value)}
                        style={{ height: '32px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px' }}
                      >
                        <option value="noise">Nhiễu (Noise)</option>
                        <option value="real">Nguyên bản (Real)</option>
                        <option value="off">Tắt (Off)</option>
                      </select>
                    </div>
                  </div>

                  {/* WebGL Vendor */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      WebGL Vendor (Nhà sản xuất)
                    </label>
                    <select
                      value={webglVendor}
                      onChange={(e) => setWebglVendor(e.target.value)}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                    >
                      {WEBGL_VENDORS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* WebGL Renderer */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                      WebGL Renderer (Card màn hình giả lập)
                    </label>
                    <select
                      value={webglRenderer}
                      onChange={(e) => setWebglRenderer(e.target.value)}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                    >
                      {WEBGL_RENDERERS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Phần cứng: CPU Cores & RAM */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>Số lõi CPU (Hardware Concurrency)</div>
                    <select
                      value={cpuCores}
                      onChange={(e) => setCpuCores(parseInt(e.target.value, 10))}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    >
                      <option value={2}>2 Cores</option>
                      <option value={4}>4 Cores</option>
                      <option value={8}>8 Cores (Khuyên dùng)</option>
                      <option value={12}>12 Cores</option>
                      <option value={16}>16 Cores</option>
                    </select>
                  </div>

                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>Bộ nhớ RAM giả lập (Device Memory)</div>
                    <select
                      value={ramGb}
                      onChange={(e) => setRamGb(parseInt(e.target.value, 10))}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                    >
                      <option value={4}>4 GB</option>
                      <option value={8}>8 GB</option>
                      <option value={16}>16 GB (Khuyên dùng)</option>
                      <option value={32}>32 GB</option>
                    </select>
                  </div>
                </div>

                {/* 4. Media Devices: Video Inputs & Audio Inputs */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Thiết bị Media ảo (Media Devices)</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>Mô phỏng số lượng Camera, Micro và Loa của thiết bị thật</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                        <Camera size={14} /> Video Inputs (Camera)
                      </span>
                      <select
                        value={videoInputsCount}
                        onChange={(e) => setVideoInputsCount(Number(e.target.value))}
                        style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                      >
                        <option value={0}>0 Camera</option>
                        <option value={1}>1 Camera (HD Webcam)</option>
                        <option value={2}>2 Cameras (Front/Back)</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                        <Mic size={14} /> Audio Inputs (Micro)
                      </span>
                      <select
                        value={audioInputsCount}
                        onChange={(e) => setAudioInputsCount(Number(e.target.value))}
                        style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                      >
                        <option value={1}>1 Micro (Realtek Audio)</option>
                        <option value={2}>2 Micro (Default + Headset)</option>
                      </select>
                    </div>

                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                        <Volume2 size={14} /> Audio Outputs (Loa)
                      </span>
                      <select
                        value={audioOutputsCount}
                        onChange={(e) => setAudioOutputsCount(Number(e.target.value))}
                        style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                      >
                        <option value={1}>1 Loa (Speakers)</option>
                        <option value={2}>2 Loa (Headphones)</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 4: LOCATION, TIMEZONE & RESOLUTION                    */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'Location' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* 1. Timezone (Múi giờ) */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} style={{ color: '#2563EB' }} />
                      <span>Múi giờ hệ thống (Time zone)</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="tzMode"
                          checked={timezoneMode === 'auto'}
                          onChange={() => setTimezoneMode('auto')}
                        />
                        <span>Tự động theo IP Proxy</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="tzMode"
                          checked={timezoneMode === 'manual'}
                          onChange={() => setTimezoneMode('manual')}
                        />
                        <span>Tùy chỉnh thủ công</span>
                      </label>
                    </div>
                  </div>

                  {timezoneMode === 'manual' && (
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', marginTop: '6px', backgroundColor: '#FFFFFF' }}
                    >
                      {TIMEZONE_OPTIONS.map(tz => (
                        <option key={tz.id} value={tz.id}>{tz.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 2. Ngôn ngữ (Language) */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Languages size={15} style={{ color: '#2563EB' }} />
                      <span>Ngôn ngữ duyệt web (Accept-Language)</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="langMode"
                          checked={languageMode === 'auto'}
                          onChange={() => setLanguageMode('auto')}
                        />
                        <span>Tự động theo IP Proxy</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12.5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="langMode"
                          checked={languageMode === 'manual'}
                          onChange={() => setLanguageMode('manual')}
                        />
                        <span>Tùy chỉnh thủ công</span>
                      </label>
                    </div>
                  </div>

                  {languageMode === 'manual' && (
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', marginTop: '6px', backgroundColor: '#FFFFFF' }}
                    >
                      {LANGUAGE_OPTIONS.map(lang => (
                        <option key={lang.id} value={lang.id}>{lang.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* 3. Location, Kinh độ, Vĩ độ (Geolocation) */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Compass size={15} style={{ color: '#2563EB' }} />
                      <span>Vị trí địa lý (Geolocation & Tọa độ)</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {[
                        { id: 'auto', label: 'Theo IP Proxy' },
                        { id: 'prompt', label: 'Hỏi trước (Prompt)' },
                        { id: 'block', label: 'Chặn (Block)' },
                        { id: 'manual', label: 'Tùy chỉnh tọa độ' }
                      ].map(loc => (
                        <label key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="locMode"
                            checked={locationMode === loc.id}
                            onChange={() => setLocationMode(loc.id)}
                          />
                          <span>{loc.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {locationMode === 'manual' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '4px' }}>
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Vĩ độ (Latitude)</span>
                        <input
                          type="text"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                          placeholder="Ví dụ: 10.762622"
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Kinh độ (Longitude)</span>
                        <input
                          type="text"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                          placeholder="Ví dụ: 106.660172"
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>

                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Bán kính (Accuracy - mét)</span>
                        <input
                          type="number"
                          value={accuracy}
                          onChange={(e) => setAccuracy(Number(e.target.value))}
                          placeholder="10"
                          style={{ width: '100%', height: '36px', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '0 10px', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Resolution (Độ phân giải màn hình) */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Maximize2 size={15} style={{ color: '#2563EB' }} />
                    <span>Độ phân giải màn hình (Screen Resolution)</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '10px' }}>
                    Kích thước viewport và thông số window.screen giả lập
                  </div>

                  <select
                    value={screenResolution}
                    onChange={(e) => setScreenResolution(e.target.value)}
                    style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', backgroundColor: '#FFFFFF' }}
                  >
                    {RESOLUTION_OPTIONS.map(res => (
                      <option key={res} value={res}>{res}</option>
                    ))}
                  </select>
                </div>

              </div>
            )}

            {/* ───────────────────────────────────────────────────────── */}
            {/* TAB 5: ADVANCED & COOKIES                                 */}
            {/* ───────────────────────────────────────────────────────── */}
            {activeTab === 'Advanced' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>Chính sách bảo mật WebRTC</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Ẩn địa chỉ IP mạng nội bộ thật và giả lập IP theo Proxy</div>
                  </div>
                  <select
                    value={webrtcPolicy}
                    onChange={(e) => setWebrtcPolicy(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="altered">Altered (Giả lập theo IP - Khuyên dùng)</option>
                    <option value="disabled">Disabled (Tắt hoàn toàn WebRTC)</option>
                    <option value="real">Real (Để lộ IP thật)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>Bỏ qua lỗi chứng chỉ SSL / HTTPS</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Chấp nhận chứng chỉ tự ký hoặc proxy giải mã HTTPS</div>
                  </div>
                  <select
                    value={ignoreCertError}
                    onChange={(e) => setIgnoreCertError(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="Disabled">Disabled</option>
                    <option value="Enabled">Enabled</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>Máy chủ DNS phân giải</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Ngăn chặn rò rỉ DNS Leaks qua nhà mạng ISP</div>
                  </div>
                  <select
                    value={dnsServer}
                    onChange={(e) => setDnsServer(e.target.value)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  >
                    <option value="cloudflare">Cloudflare DNS (1.1.1.1)</option>
                    <option value="google">Google DNS (8.8.8.8)</option>
                    <option value="proxy">Theo DNS của Proxy</option>
                  </select>
                </div>

                {/* Cookies textarea */}
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                    Nạp Cookie ban đầu cho hồ sơ (JSON Format / Netscape)
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                    Tự động đăng nhập vào các tài khoản bằng Cookie đã lưu trước
                  </div>
                  <textarea
                    value={initialCookies}
                    onChange={(e) => setInitialCookies(e.target.value)}
                    placeholder={'Dán mã Cookie dạng JSON hoặc Netscape tại đây...\n[{"name": "c_user", "value": "100084...", "domain": ".facebook.com"}]'}
                    style={{
                      width: '100%',
                      height: '110px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      padding: '10px 12px',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      resize: 'none',
                      backgroundColor: '#FFFFFF'
                    }}
                  />
                </div>
              </div>
            )}

            </div>

            {/* Sticky Action Buttons bar at the bottom of the left column */}
            <div style={{
              position: 'relative',
              padding: '16px 32px',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #EDF2F7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              flexShrink: 0,
              zIndex: 10
            }}>
              {/* Trắng mờ / Frosted white gradient blur directly above buttons */}
              <div style={{
                position: 'absolute',
                top: '-24px',
                left: 0,
                right: 0,
                height: '24px',
                background: 'linear-gradient(to top, #FFFFFF 0%, rgba(255, 255, 255, 0.85) 45%, rgba(255, 255, 255, 0) 100%)',
                pointerEvents: 'none'
              }} />

              <button
                type="button"
                onClick={() => setActiveProfileModal(null)}
                style={{
                  height: '38px',
                  padding: '0 20px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#94A3B8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }}
              >
                Hủy bỏ (Cancel)
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                style={{
                  height: '38px',
                  padding: '0 26px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
              >
                {isEditing ? 'Lưu cập nhật' : 'Tạo hồ sơ (Confirm)'}
              </button>
            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: STICKY OVERVIEW PANEL                        */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div style={{
            width: '340px',
            flexShrink: 0,
            borderLeft: '1px solid #EDF2F7',
            backgroundColor: '#FFFFFF',
            padding: '20px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>

            {/* Header: Overview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2px'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>Tổng quan cấu hình</span>
              <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '10px' }}>
                Real-time
              </span>
            </div>

            {/* Overview Key-Value List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Nhóm</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{folder}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Tên hồ sơ</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{title || '-'}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Hệ điều hành</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{OS_PRESETS[selectedOs]?.name} {osVersion}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Trình duyệt</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>Chrome {browserChoice.version}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Công cụ tìm kiếm</span>
                <span style={{ color: '#7C3AED', fontWeight: 600 }}>
                  {SEARCH_ENGINE_OPTIONS.find(s => s.id === searchEngine)?.label || 'Google'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Website đích</span>
                <span style={{ color: '#2563EB', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                  {startUrls || '(Mặc định Search Engine)'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Proxy</span>
                <span style={{ color: proxyMode === 'no_proxy' ? '#64748B' : '#10B981', fontWeight: 600 }}>
                  {proxyMode === 'no_proxy' ? 'Direct IP' : `${proxyType}://${proxyHost}:${proxyPort}`}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EDF2F7', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Múi giờ (Timezone)</span>
                <span style={{ color: '#1E293B' }}>{timezoneMode === 'auto' ? 'Theo IP Proxy' : timezone.split('/')[1] || timezone}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Ngôn ngữ</span>
                <span style={{ color: '#1E293B' }}>{languageMode === 'auto' ? 'Theo IP Proxy' : language.split(';')[0]}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Vị trí (Location)</span>
                <span style={{ color: '#1E293B' }}>
                  {locationMode === 'auto' ? 'Theo IP Proxy' : locationMode === 'manual' ? `${latitude}, ${longitude}` : locationMode}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Màn hình (Resolution)</span>
                <span style={{ color: '#1E293B', fontWeight: 600 }}>{screenResolution}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>CPU & RAM</span>
                <span style={{ color: '#1E293B' }}>{cpuCores} Cores / {ramGb} GB</span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EDF2F7', margin: '4px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>WebGL Vendor</span>
                <span style={{ color: '#1E293B', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {webglVendor}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>WebGL Renderer</span>
                <span style={{ color: '#1E293B', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {webglRenderer.split(',')[1] || webglRenderer.slice(0, 24)}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Media Devices</span>
                <span style={{ color: '#1E293B' }}>{videoInputsCount} Cam / {audioInputsCount} Mic / {audioOutputsCount} Loa</span>
              </div>

              {/* Hardware Noise status list */}
              <div style={{ marginTop: '4px', padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Bảo vệ dấu vân tay (Noise):</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Canvas:</span>
                    <span style={{ color: canvasNoise === 'noise' ? '#10B981' : '#64748B', fontWeight: 600 }}>{canvasNoise}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Audio Context:</span>
                    <span style={{ color: audioNoise === 'noise' ? '#10B981' : '#64748B', fontWeight: 600 }}>{audioNoise}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>Client Rects:</span>
                    <span style={{ color: clientRectsNoise === 'noise' ? '#10B981' : '#64748B', fontWeight: 600 }}>{clientRectsNoise}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                    <span>WebGL Image:</span>
                    <span style={{ color: webglImageNoise === 'noise' ? '#10B981' : '#64748B', fontWeight: 600 }}>{webglImageNoise}</span>
                  </div>
                </div>
              </div>

              {/* Prominent "Generate random fingerprint" Button - At the BOTTOM of overview! */}
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={handleRandomize}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    border: '1.5px solid #7DD3FC',
                    backgroundColor: '#FFFFFF',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                    e.currentTarget.style.borderColor = '#38BDF8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#7DD3FC';
                  }}
                  title="Tạo ngẫu nhiên lại toàn bộ dấu vân tay thiết bị & phần cứng"
                >
                  <Shuffle size={16} color="#0284C7" />
                  <span>Generate random fingerprint</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── BROWSER CORE MANAGER MODAL ── */}
      <BrowserCoreManagerModal
        isOpen={isCoreManagerOpen}
        onClose={() => setIsCoreManagerOpen(false)}
        onCoreSelected={(core) => {
          setBrowserChoice({
            id: core.version,
            label: core.name,
            version: core.version,
            fullVersion: core.fullVersion,
            engine: core.engine
          });
        }}
      />
    </div>
  );
}
