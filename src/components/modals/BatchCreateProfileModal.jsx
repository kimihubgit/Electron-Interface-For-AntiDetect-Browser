import React, { useState, useMemo } from 'react';
import { 
  X, Layers, Laptop, Globe, Cpu, ShieldCheck, CheckCircle2, 
  AlertCircle, Plus, Minus, Sparkles, Server, HardDrive, RefreshCw,
  Copy, FileText, Check, Shuffle, Monitor, Sliders, Info, Lock,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

// Realistic User Agent pool
const WINDOWS_UAS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
];

const MACOS_UAS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
];

const LINUX_UAS = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
];

const WEBGL_WINDOWS = [
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0, D3D11)' },
  { vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0, D3D11)' },
];

const WEBGL_MACOS = [
  { vendor: 'Apple', renderer: 'Apple M2' },
  { vendor: 'Apple', renderer: 'Apple M3 Pro' },
  { vendor: 'Apple', renderer: 'Apple M1 Max' },
];

const RESOLUTIONS = [
  '1920 × 1080',
  '1920 × 1080',
  '1536 × 864',
  '1440 × 900',
  '2560 × 1440',
  '1366 × 768'
];

const CPU_RAM_COMBOS = [
  { cores: 8, ram: 16 },
  { cores: 8, ram: 16 },
  { cores: 6, ram: 16 },
  { cores: 12, ram: 32 },
  { cores: 4, ram: 8 },
  { cores: 16, ram: 32 }
];

export default function BatchCreateProfileModal({ isOpen, onClose }) {
  const { 
    batchCreateProfiles, 
    profiles = [], 
    proxies = [], 
    customGroups = [],
    currentUser,
    currentWorkspace,
    setActiveUpgradeModal,
    showToast,
    addLog
  } = useBrowser();

  // Quota calculation
  const maxProfiles = currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? currentWorkspace?.max_profiles ?? 5;
  const usedCount = currentUser?.alreadyAddBrowsersCount ?? profiles.length;
  const remainingSlots = currentUser?.canAddBrowsersCount ?? Math.max(0, maxProfiles - usedCount);

  // Tab State
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'proxy' | 'fingerprint'

  // General Settings
  const [count, setCount] = useState(() => Math.min(5, Math.max(1, remainingSlots)));
  const [prefix, setPrefix] = useState('Profile');
  const [targetGroup, setTargetGroup] = useState('Chung');
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [startUrl, setStartUrl] = useState('https://www.google.com');

  // OS & Browser
  const [osChoice, setOsChoice] = useState('windows'); // windows, macos, linux, random
  const [browserChoice, setBrowserChoice] = useState('Chrome 128');

  // Proxy Settings
  const [proxyMode, setProxyMode] = useState('none'); // 'none' | 'list' | 'single'
  const [proxyListText, setProxyListText] = useState('');
  const [selectedSingleProxyId, setSelectedSingleProxyId] = useState('');

  // Advanced Fingerprint Toggles
  const [canvasNoise, setCanvasNoise] = useState(true);
  const [audioNoise, setAudioNoise] = useState(true);
  const [webglNoise, setWebglNoise] = useState(true);
  const [autoTimezone, setAutoTimezone] = useState(true);
  const [webrtcAltered, setWebrtcAltered] = useState(true);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group list options
  const groupOptions = useMemo(() => {
    const fromCustom = customGroups.map(g => g.name).filter(Boolean);
    const fromProf = profiles.map(p => p.group).filter(Boolean);
    return Array.from(new Set(['Chung', ...fromCustom, ...fromProf]));
  }, [customGroups, profiles]);

  // Parse raw proxy list textarea
  const parsedProxies = useMemo(() => {
    if (proxyMode !== 'list' || !proxyListText.trim()) return [];
    const lines = proxyListText.split('\n').map(l => l.trim()).filter(Boolean);
    const result = [];

    for (const line of lines) {
      try {
        let type = 'HTTP';
        let host = '';
        let port = '';
        let user = '';
        let pass = '';

        let cleanLine = line;
        if (cleanLine.includes('://')) {
          const parts = cleanLine.split('://');
          type = parts[0].toUpperCase();
          cleanLine = parts[1];
        }

        if (cleanLine.includes('@')) {
          const [auth, server] = cleanLine.split('@');
          const [u, p] = auth.split(':');
          const [h, prt] = server.split(':');
          user = u || '';
          pass = p || '';
          host = h || '';
          port = prt || '';
        } else {
          const segments = cleanLine.split(':');
          if (segments.length >= 2) {
            host = segments[0];
            port = segments[1];
          }
          if (segments.length >= 4) {
            user = segments[2];
            pass = segments[3];
          }
        }

        if (host && port) {
          result.push({
            type: type === 'SOCKS5' ? 'SOCKS5' : (type === 'SOCKS4' ? 'SOCKS4' : 'HTTP'),
            host,
            port: parseInt(port, 10) || 80,
            user,
            pass,
            status: 'live'
          });
        }
      } catch (e) {
        // ignore malformed line
      }
    }
    return result;
  }, [proxyMode, proxyListText]);

  if (!isOpen) return null;

  // Handle Create Profiles
  const handleCreate = () => {
    const qty = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
    const effectiveGroup = isCreatingNewGroup ? (newGroupName.trim() || 'Chung') : targetGroup;
    const finalPrefix = prefix.trim() || 'Profile';

    setIsSubmitting(true);

    const generatedProfiles = [];

    for (let i = 1; i <= qty; i++) {
      let itemOs = osChoice;
      if (osChoice === 'random') {
        itemOs = Math.random() > 0.4 ? 'windows' : 'macos';
      }

      let uaList = WINDOWS_UAS;
      if (itemOs === 'macos') uaList = MACOS_UAS;
      else if (itemOs === 'linux') uaList = LINUX_UAS;
      const ua = uaList[Math.floor(Math.random() * uaList.length)];

      let webglList = itemOs === 'macos' ? WEBGL_MACOS : WEBGL_WINDOWS;
      const webglChoice = webglList[Math.floor(Math.random() * webglList.length)];

      const hardware = CPU_RAM_COMBOS[Math.floor(Math.random() * CPU_RAM_COMBOS.length)];
      const resolution = RESOLUTIONS[Math.floor(Math.random() * RESOLUTIONS.length)];

      let itemProxy = { type: 'NO_PROXY' };
      if (proxyMode === 'single' && selectedSingleProxyId) {
        const found = proxies.find(p => p.id === selectedSingleProxyId);
        if (found) {
          itemProxy = {
            type: found.type || 'SOCKS5',
            host: found.host,
            port: found.port,
            user: found.user || '',
            pass: found.pass || '',
            status: 'live'
          };
        }
      } else if (proxyMode === 'list' && parsedProxies.length > 0) {
        const pIndex = (i - 1) % parsedProxies.length;
        itemProxy = { ...parsedProxies[pIndex] };
      }

      const indexStr = qty >= 10 && i < 10 ? `0${i}` : `${i}`;
      const name = `${finalPrefix}_${indexStr}`;

      generatedProfiles.push({
        name,
        group: effectiveGroup,
        os: itemOs,
        osVersion: itemOs === 'windows' ? '11' : (itemOs === 'macos' ? '14' : '10'),
        browser: browserChoice,
        userAgent: ua,
        startUrls: startUrl.trim() || 'https://www.google.com',
        proxy: itemProxy,
        canvas: canvasNoise ? 'noise' : 'off',
        canvasNoiseSeed: Math.random().toString(16).slice(2, 10),
        audio: audioNoise ? 'noise' : 'off',
        clientRects: 'noise',
        webglImage: webglNoise ? 'noise' : 'off',
        webglMetadataMode: 'spoof',
        webglVendor: webglChoice.vendor,
        webglRenderer: webglChoice.renderer,
        cores: hardware.cores,
        ram: hardware.ram,
        resolution,
        timezoneMode: autoTimezone ? 'auto' : 'custom',
        timezone: 'Asia/Ho_Chi_Minh',
        languageMode: 'auto',
        language: 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        webrtc: webrtcAltered ? 'altered' : 'real',
        dnsServer: 'cloudflare',
        ignoreCertError: 'Disabled'
      });
    }

    batchCreateProfiles(generatedProfiles, () => {
      setIsSubmitting(false);
      onClose();
      showToast?.(`Đã tạo thành công ${qty} hồ sơ mới với vân tay Fingerprint độc lập!`, 'success');
      addLog?.(`Đã tạo hàng loạt ${qty} hồ sơ thuộc nhóm "${effectiveGroup}"`, 'success');
    });
  };

  // Helper demo sample paste
  const handlePasteDemoProxies = () => {
    setProxyListText(
      `198.54.120.45:1080:user1:pass123\n198.54.120.46:1080:user2:pass123\n46.101.12.89:8080:user3:pass123\n128.199.200.15:1080\n118.69.21.32:8888`
    );
  };

  // Calculated preview items
  const previewCount = Math.min(count, 5);
  const previewItems = Array.from({ length: previewCount }).map((_, idx) => {
    const i = idx + 1;
    const indexStr = count >= 10 && i < 10 ? `0${i}` : `${i}`;
    let itemProxyLabel = 'Không proxy';
    if (proxyMode === 'single' && selectedSingleProxyId) {
      const found = proxies.find(p => p.id === selectedSingleProxyId);
      itemProxyLabel = found ? `${found.type || 'SOCKS5'} ${found.host}:${found.port}` : 'Proxy đơn';
    } else if (proxyMode === 'list' && parsedProxies.length > 0) {
      const p = parsedProxies[(i - 1) % parsedProxies.length];
      itemProxyLabel = `${p.type} ${p.host}:${p.port}`;
    }

    return {
      name: `${prefix || 'Profile'}_${indexStr}`,
      os: osChoice === 'random' ? (i % 2 === 0 ? 'macos' : 'windows') : osChoice,
      proxy: itemProxyLabel,
      res: RESOLUTIONS[(i - 1) % RESOLUTIONS.length],
      cpu: `${CPU_RAM_COMBOS[(i - 1) % CPU_RAM_COMBOS.length].cores}C / ${CPU_RAM_COMBOS[(i - 1) % CPU_RAM_COMBOS.length].ram}GB`
    };
  });

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          width: '100%',
          maxWidth: '940px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInScale 0.18s ease-out'
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
            }}>
              <Layers size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Tạo Hồ Sơ Hàng Loạt
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  backgroundColor: '#EDE9FE', 
                  color: '#7C3AED', 
                  padding: '2px 8px', 
                  borderRadius: '6px' 
                }}>
                  Batch Creator
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Khởi tạo đồng loạt nhiều profile với vân tay Fingerprint độc lập & thông số chuẩn
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quota indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: remainingSlots <= 0 ? '#FEF2F2' : '#F8FAFC',
              border: `1px solid ${remainingSlots <= 0 ? '#FECACA' : '#E2E8F0'}`,
              fontSize: '11.5px',
              color: remainingSlots <= 0 ? '#DC2626' : '#475569'
            }}>
              <ShieldCheck size={14} style={{ color: remainingSlots <= 0 ? '#DC2626' : '#10B981' }} />
              <span>Hạn mức: <strong>{usedCount}/{maxProfiles}</strong></span>
              <span>(Còn: <strong style={{ color: remainingSlots <= 0 ? '#DC2626' : '#7C3AED' }}>{remainingSlots}</strong>)</span>
            </div>

            <button 
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── 2-COLUMN MAIN BODY ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(480px, 1.35fr) minmax(320px, 0.95fr)',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* ──── LEFT COLUMN: CONFIGURATION TABS ──── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid #E2E8F0',
            overflowY: 'auto'
          }}>
            {/* Sleek Sub-Tabs Nav */}
            <div style={{
              display: 'flex',
              padding: '10px 20px',
              gap: '8px',
              borderBottom: '1px solid #F1F5F9',
              backgroundColor: '#FAFAFC',
              flexShrink: 0
            }}>
              {[
                { id: 'general', label: '1. Cấu hình chung', icon: Laptop },
                { id: 'proxy', label: '2. Mạng & Proxy', icon: Server, badge: parsedProxies.length > 0 ? `${parsedProxies.length}` : null },
                { id: 'fingerprint', label: '3. Vân tay & Hardware', icon: Cpu }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                      color: isActive ? '#7C3AED' : '#64748B',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} style={{ color: isActive ? '#7C3AED' : '#94A3B8' }} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* ────── TAB 1: GENERAL ────── */}
              {activeTab === 'general' && (
                <>
                  {/* Quantity Counter */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Số lượng hồ sơ muốn tạo
                      </label>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Tối đa 100 hồ sơ / lần
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Counter Box */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <button
                          type="button"
                          onClick={() => setCount(prev => Math.max(1, prev - 1))}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            backgroundColor: '#F8FAFC',
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={Math.min(100, remainingSlots || 100)}
                          value={count}
                          onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                          style={{
                            width: '60px',
                            border: 'none',
                            outline: 'none',
                            textAlign: 'center',
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#0F172A'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setCount(prev => Math.min(100, prev + 1))}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            backgroundColor: '#F8FAFC',
                            color: '#475569',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Quick Quantity Pills */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {[5, 10, 20, 50].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setCount(val)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 600,
                              border: count === val ? '1.5px solid #7C3AED' : '1px solid #E2E8F0',
                              backgroundColor: count === val ? '#EDE9FE' : '#FFFFFF',
                              color: count === val ? '#7C3AED' : '#475569',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {val}
                          </button>
                        ))}
                        {remainingSlots > 0 && remainingSlots <= 100 && (
                          <button
                            type="button"
                            onClick={() => setCount(remainingSlots)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              border: '1px solid #DDD6FE',
                              backgroundColor: '#F5F3FF',
                              color: '#7C3AED',
                              cursor: 'pointer'
                            }}
                          >
                            Tối đa ({remainingSlots})
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name Prefix & Group */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {/* Prefix */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Tiền tố tên hồ sơ (Prefix)
                      </label>
                      <input
                        type="text"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        placeholder="Ví dụ: Shopee, Facebook, Acc..."
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        Mẫu: <strong>{prefix || 'Profile'}_01, {prefix || 'Profile'}_02...</strong>
                      </span>
                    </div>

                    {/* Target Group */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Lưu vào nhóm
                      </label>
                      {!isCreatingNewGroup ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select
                            value={targetGroup}
                            onChange={(e) => setTargetGroup(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '13px',
                              backgroundColor: '#FFFFFF',
                              color: '#0F172A',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {groupOptions.map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setIsCreatingNewGroup(true)}
                            title="Tạo nhanh nhóm mới"
                            style={{
                              padding: '0 10px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#F8FAFC',
                              color: '#475569',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            + Mới
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            placeholder="Tên nhóm mới..."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1.5px solid #7C3AED',
                              fontSize: '13px',
                              outline: 'none'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setIsCreatingNewGroup(false)}
                            style={{
                              padding: '0 10px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#F8FAFC',
                              color: '#64748B',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operating System Choice (Visual Cards) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                      Hệ điều hành giả lập (Operating System)
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[
                        { id: 'windows', label: 'Windows 11', desc: 'Khuyên dùng', icon: '🪟' },
                        { id: 'macos', label: 'macOS', desc: 'Apple Silicon', icon: '🍎' },
                        { id: 'linux', label: 'Linux', desc: 'Ubuntu 22', icon: '🐧' },
                        { id: 'random', label: 'Ngẫu nhiên', desc: 'Mix Win & Mac', icon: '🎲' }
                      ].map(item => {
                        const isSelected = osChoice === item.id;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setOsChoice(item.id)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              padding: '12px 8px',
                              borderRadius: '10px',
                              border: `1.5px solid ${isSelected ? '#7C3AED' : '#E2E8F0'}`,
                              backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.05)' : '#FFFFFF',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <span style={{ fontSize: '20px', marginBottom: '4px' }}>{item.icon}</span>
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: isSelected ? '#6D28D9' : '#0F172A' }}>
                              {item.label}
                            </span>
                            <span style={{ fontSize: '10.5px', color: isSelected ? '#7C3AED' : '#94A3B8', marginTop: '2px' }}>
                              {item.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Browser Core & Start URL */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Nhân trình duyệt (Chromium)
                      </label>
                      <select
                        value={browserChoice}
                        onChange={(e) => setBrowserChoice(e.target.value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px',
                          color: '#0F172A',
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Chrome 128">Chrome 128 (Mới nhất - Khuyên dùng)</option>
                        <option value="Chrome 126">Chrome 126 (LTS)</option>
                        <option value="Chrome 124">Chrome 124 (Legacy)</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                        Trang web mở khi khởi động
                      </label>
                      <input
                        type="text"
                        value={startUrl}
                        onChange={(e) => setStartUrl(e.target.value)}
                        placeholder="https://www.google.com"
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* ────── TAB 2: PROXY SETTINGS ────── */}
              {activeTab === 'proxy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Mode Selector Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'none', title: 'Không dùng Proxy', desc: 'Duyệt bằng mạng máy thật', icon: Globe },
                      { id: 'list', title: 'Dán danh sách Proxy', desc: 'Mỗi dòng 1 Proxy IP', icon: FileText },
                      { id: 'single', title: 'Dùng chung 1 Proxy', desc: 'Chọn từ kho có sẵn', icon: Server }
                    ].map(mode => {
                      const isSelected = proxyMode === mode.id;
                      const Icon = mode.icon;
                      return (
                        <div
                          key={mode.id}
                          onClick={() => setProxyMode(mode.id)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '12px',
                            borderRadius: '10px',
                            border: `1.5px solid ${isSelected ? '#7C3AED' : '#E2E8F0'}`,
                            backgroundColor: isSelected ? 'rgba(124, 58, 237, 0.05)' : '#FFFFFF',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Icon size={15} style={{ color: isSelected ? '#7C3AED' : '#64748B' }} />
                            <span style={{ fontSize: '12.5px', fontWeight: 700, color: isSelected ? '#6D28D9' : '#1E293B' }}>
                              {mode.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: isSelected ? '#7C3AED' : '#94A3B8' }}>
                            {mode.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mode: List View */}
                  {proxyMode === 'list' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                          Nhập danh sách Proxy (Hỗ trợ HTTP/SOCKS5):
                        </span>
                        <button
                          type="button"
                          onClick={handlePasteDemoProxies}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#7C3AED',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Sparkles size={12} />
                          <span>Dán 5 Proxy mẫu test</span>
                        </button>
                      </div>

                      <textarea
                        rows={6}
                        value={proxyListText}
                        onChange={(e) => setProxyListText(e.target.value)}
                        placeholder={`198.54.120.45:1080:username:password\nhost:port\nsocks5://user:pass@host:port`}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '12px',
                          fontFamily: 'Consolas, monospace',
                          lineHeight: '1.6',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box',
                          resize: 'vertical'
                        }}
                      />

                      {/* Parse Stats */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        fontSize: '11.5px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                          <span>
                            Nhận diện: <strong style={{ color: '#059669' }}>{parsedProxies.length} proxy hợp lệ</strong>
                          </span>
                        </div>
                        {parsedProxies.length > 0 && parsedProxies.length < count && (
                          <span style={{ color: '#D97706' }}>
                            * Sẽ tự động gán xoay vòng cho đủ {count} hồ sơ
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mode: Single View */}
                  {proxyMode === 'single' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                        Chọn một Proxy có sẵn trong kho lưu trữ:
                      </label>
                      {proxies.length === 0 ? (
                        <div style={{
                          padding: '16px',
                          borderRadius: '8px',
                          backgroundColor: '#FEF2F2',
                          border: '1px solid #FECACA',
                          fontSize: '12.5px',
                          color: '#DC2626'
                        }}>
                          Kho proxy hiện tại đang trống! Vui lòng thêm proxy vào kho trước hoặc chuyển sang chế độ "Dán danh sách Proxy".
                        </div>
                      ) : (
                        <select
                          value={selectedSingleProxyId}
                          onChange={(e) => setSelectedSingleProxyId(e.target.value)}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            fontSize: '12.5px',
                            color: '#0F172A',
                            backgroundColor: '#FFFFFF',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">-- Chọn Proxy dùng chung cho tất cả hồ sơ --</option>
                          {proxies.map(p => (
                            <option key={p.id} value={p.id}>
                              [{p.type || 'SOCKS5'}] {p.host}:{p.port} {p.country ? `(${p.country})` : ''}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* Mode: None Info */}
                  {proxyMode === 'none' && (
                    <div style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      border: '1px dashed #CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '12px',
                      color: '#64748B'
                    }}>
                      <Info size={16} style={{ color: '#7C3AED', flexShrink: 0 }} />
                      <span>Các hồ sơ sẽ sử dụng kết nối mạng Internet mặc định của máy tính hiện tại mà không thông qua máy chủ Proxy trung gian.</span>
                    </div>
                  )}
                </div>
              )}

              {/* ────── TAB 3: FINGERPRINT ────── */}
              {activeTab === 'fingerprint' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                    Tất cả các hồ sơ sinh ra sẽ được tạo vân tay trình duyệt hoàn toàn độc nhất (100% Unique Fingerprint).
                  </div>

                  {/* Toggles */}
                  {[
                    { state: canvasNoise, setter: setCanvasNoise, title: 'Canvas Noise độc lập', desc: 'Thêm nhiễu ngẫu nhiên vào dữ liệu vẽ Canvas 2D/3D của từng profile' },
                    { state: audioNoise, setter: setAudioNoise, title: 'AudioContext Spoofing', desc: 'Giả lập tần số sóng âm Audio Buffer độc nhất chống theo dõi âm thanh' },
                    { state: webglNoise, setter: setWebglNoise, title: 'WebGL Metadata Spoofing', desc: 'Tự động gán card đồ họa GPU Vendor & Renderer khớp hệ điều hành' },
                    { state: autoTimezone, setter: setAutoTimezone, title: 'Múi giờ & Ngôn ngữ theo IP Proxy', desc: 'Tự động đồng bộ vị trí địa lý, múi giờ và bảng mã ngôn ngữ theo IP' },
                    { state: webrtcAltered, setter: setWebrtcAltered, title: 'Chống rò rỉ WebRTC IP', desc: 'Chặn rò rỉ địa chỉ IP thật của máy tính qua giao thức WebRTC' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => item.setter(!item.state)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                          {item.title}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {item.desc}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.state}
                        onChange={() => {}}
                        style={{ accentColor: '#7C3AED', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ──── RIGHT COLUMN: LIVE GENERATION PREVIEW ──── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F8FAFC',
            padding: '20px',
            overflowY: 'auto',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: '#7C3AED' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                  Xem trước kết quả ({count} hồ sơ)
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: '#DCFCE7',
                color: '#15803D'
              }}>
                100% Unique
              </span>
            </div>

            {/* Summary card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Quy tắc tên:</span>
                <strong style={{ color: '#0F172A' }}>{prefix || 'Profile'}_01 ... {prefix || 'Profile'}_{count >= 10 && count < 10 ? `0${count}` : count}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Lưu vào nhóm:</span>
                <strong style={{ color: '#7C3AED' }}>"{isCreatingNewGroup ? (newGroupName.trim() || 'Chung') : targetGroup}"</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Hệ điều hành:</span>
                <strong style={{ color: '#0F172A' }}>
                  {osChoice === 'windows' ? 'Windows 11' : osChoice === 'macos' ? 'macOS Sonoma' : osChoice === 'linux' ? 'Ubuntu Linux' : 'Ngẫu nhiên (Win & Mac)'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Phân bổ Proxy:</span>
                <strong style={{ color: proxyMode === 'none' ? '#64748B' : '#059669' }}>
                  {proxyMode === 'none' ? 'Mạng Direct' : proxyMode === 'list' ? `${parsedProxies.length} Proxy nhập vào` : 'Proxy chung'}
                </strong>
              </div>
            </div>

            {/* Generated Items Mini Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#475569' }}>
                Mẫu hồ sơ sẽ được tạo:
              </span>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {previewItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      fontSize: '11.5px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px' }}>
                        {item.os === 'macos' ? '🍎' : item.os === 'linux' ? '🐧' : '🪟'}
                      </span>
                      <strong style={{ color: '#1E293B' }}>{item.name}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        fontSize: '10.5px'
                      }}>
                        {item.cpu}
                      </span>
                      <span style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: item.proxy.includes('Không') ? '#F1F5F9' : '#DCFCE7',
                        color: item.proxy.includes('Không') ? '#64748B' : '#15803D',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.proxy}
                      </span>
                    </div>
                  </div>
                ))}

                {count > 5 && (
                  <div style={{
                    padding: '6px 10px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#94A3B8',
                    fontStyle: 'italic'
                  }}>
                    ... và thêm {count - 5} hồ sơ tương tự tiếp theo
                  </div>
                )}
              </div>
            </div>

            {/* Antidetect Certification Guarantee Box */}
            <div style={{
              marginTop: 'auto',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              border: '1px solid #C4B5FD',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#5B21B6'
            }}>
              <CheckCircle2 size={16} style={{ color: '#7C3AED', flexShrink: 0 }} />
              <span>Mỗi hồ sơ sinh ra có chuỗi Canvas Hash & WebGL Shader riêng biệt, đạt 100% Trust Score.</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ fontSize: '12.5px', color: '#475569' }}>
            Tổng cộng: <strong style={{ color: '#7C3AED', fontSize: '14px' }}>{count} hồ sơ</strong>
            <span style={{ color: '#94A3B8', marginLeft: '6px' }}>
              • Sẽ được sinh tự động trong ~1 giây
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isSubmitting || remainingSlots <= 0}
              style={{
                padding: '8px 22px',
                borderRadius: '8px',
                border: 'none',
                background: isSubmitting || remainingSlots <= 0 ? '#94A3B8' : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: isSubmitting || remainingSlots <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: remainingSlots <= 0 ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={15} className="spin" />
                  <span>Đang khởi tạo {count} hồ sơ...</span>
                </>
              ) : remainingSlots <= 0 ? (
                'Đã đầy hạn mức'
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Khởi tạo ngay {count} hồ sơ</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
