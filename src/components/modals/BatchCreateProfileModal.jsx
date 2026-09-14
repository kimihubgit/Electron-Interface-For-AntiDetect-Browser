import React, { useState, useMemo } from 'react';
import { 
  X, Layers, Laptop, Globe, Cpu, ShieldCheck, CheckCircle2, 
  AlertCircle, Plus, Sparkles, Server, HardDrive, RefreshCw
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

// Standard realistic user agents
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

  // Quota calculation based on User-centric subscription
  const maxProfiles = currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? currentWorkspace?.max_profiles ?? 5;
  const usedCount = currentUser?.alreadyAddBrowsersCount ?? profiles.length;
  const remainingSlots = currentUser?.canAddBrowsersCount ?? Math.max(0, maxProfiles - usedCount);

  // Basic Settings
  const [count, setCount] = useState(() => Math.min(5, Math.max(1, remainingSlots)));
  const [prefix, setPrefix] = useState('Profile');
  const [targetGroup, setTargetGroup] = useState('Chung');
  const [isCreatingNewGroup, setIsCreatingNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [startUrl, setStartUrl] = useState('https://www.google.com');

  // OS & Browser
  const [osChoice, setOsChoice] = useState('windows'); // windows, macos, linux, random
  const [browserChoice, setBrowserChoice] = useState('Chrome 128');

  // Proxy Mode: 'none' | 'list' | 'single'
  const [proxyMode, setProxyMode] = useState('none');
  const [proxyListText, setProxyListText] = useState('');
  const [selectedSingleProxyId, setSelectedSingleProxyId] = useState('');

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
          // format: user:pass@host:port
          const [auth, server] = cleanLine.split('@');
          const [u, p] = auth.split(':');
          const [h, prt] = server.split(':');
          user = u || '';
          pass = p || '';
          host = h || '';
          port = prt || '';
        } else {
          // format: host:port or host:port:user:pass
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

  const handleCreate = () => {
    const qty = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
    const effectiveGroup = isCreatingNewGroup ? (newGroupName.trim() || 'Chung') : targetGroup;
    const finalPrefix = prefix.trim() || 'Profile';

    setIsSubmitting(true);

    const generatedProfiles = [];
    const now = Date.now();

    for (let i = 1; i <= qty; i++) {
      // 1. Determine OS
      let itemOs = osChoice;
      if (osChoice === 'random') {
        itemOs = Math.random() > 0.35 ? 'windows' : 'macos';
      }

      // 2. Realistic UA
      let uaList = WINDOWS_UAS;
      if (itemOs === 'macos') uaList = MACOS_UAS;
      else if (itemOs === 'linux') uaList = LINUX_UAS;
      const ua = uaList[Math.floor(Math.random() * uaList.length)];

      // 3. Realistic WebGL
      let webglList = itemOs === 'macos' ? WEBGL_MACOS : WEBGL_WINDOWS;
      const webglChoice = webglList[Math.floor(Math.random() * webglList.length)];

      // 4. Hardware
      const hardware = CPU_RAM_COMBOS[Math.floor(Math.random() * CPU_RAM_COMBOS.length)];
      const resolution = RESOLUTIONS[Math.floor(Math.random() * RESOLUTIONS.length)];

      // 5. Proxy resolution
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
        // Round-robin or index match
        const pIndex = (i - 1) % parsedProxies.length;
        itemProxy = { ...parsedProxies[pIndex] };
      }

      // Format index with leading zero if qty >= 10
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
        canvas: 'noise',
        canvasNoiseSeed: Math.random().toString(16).slice(2, 10),
        audio: 'noise',
        clientRects: 'noise',
        webglImage: 'noise',
        webglMetadataMode: 'spoof',
        webglVendor: webglChoice.vendor,
        webglRenderer: webglChoice.renderer,
        cores: hardware.cores,
        ram: hardware.ram,
        resolution,
        timezoneMode: 'auto',
        timezone: 'Asia/Ho_Chi_Minh',
        languageMode: 'auto',
        language: 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        webrtc: 'altered',
        dnsServer: 'cloudflare',
        ignoreCertError: 'Disabled'
      });
    }

    // Call batchCreateProfiles
    batchCreateProfiles(generatedProfiles, () => {
      setIsSubmitting(false);
      onClose();
      showToast?.(`Đã tạo thành công ${qty} hồ sơ mới với vân tay Fingerprint độc lập!`, 'success');
      addLog?.(`Đã tạo hàng loạt ${qty} hồ sơ thuộc nhóm "${effectiveGroup}"`, 'success');
    });
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInScale 0.18s ease-out'
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={18} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Tạo Hồ Sơ Hàng Loạt
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  backgroundColor: '#DBEAFE', 
                  color: '#1E40AF', 
                  padding: '1px 7px', 
                  borderRadius: '10px' 
                }}>
                  Bulk Creator
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Sinh đồng loạt nhiều profile với dấu vân tay (Fingerprint) hoàn toàn độc nhất
              </div>
            </div>
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          flex: 1
        }}>
          {/* Quota limit indicator banner */}
          <div style={{
            backgroundColor: remainingSlots <= 0 ? '#FEF2F2' : '#F0FDF4',
            border: remainingSlots <= 0 ? '1px solid #FECACA' : '1px solid #BBF7D0',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <ShieldCheck size={16} color={remainingSlots <= 0 ? '#DC2626' : '#16A34A'} />
              <div>
                <span style={{ color: remainingSlots <= 0 ? '#991B1B' : '#166534', fontWeight: 600 }}>
                  Gói cước: {currentUser?.packageName || currentWorkspace?.plan_name || 'Free Starter'}
                </span>
                <span style={{ color: '#64748B', marginLeft: '6px' }}>
                  (Toàn tài khoản: <strong style={{ color: '#0F172A' }}>{usedCount}/{maxProfiles}</strong> hồ sơ • Còn lại: <strong style={{ color: remainingSlots <= 0 ? '#DC2626' : '#16A34A' }}>{remainingSlots}</strong>)
                </span>
              </div>
            </div>
            {remainingSlots <= 0 && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setActiveUpgradeModal(true);
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Nâng cấp gói ngay
              </button>
            )}
          </div>
          {/* Section 1: Số lượng & Đặt tên */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={15} color="#7C3AED" />
              1. Số lượng & Quy tắc đặt tên
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Số lượng */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Số lượng hồ sơ cần tạo
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                    style={{
                      width: '80px',
                      padding: '7px 10px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0F172A',
                      textAlign: 'center'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[5, 10, 20, 50].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCount(val)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: count === val ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                          backgroundColor: count === val ? '#EDE9FE' : '#F8FAFC',
                          color: count === val ? '#7C3AED' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        +{val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tiền tố tên */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Tiền tố tên hồ sơ (Prefix)
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Ví dụ: Acc_Facebook, Profile..."
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  Mẫu xem trước: <strong style={{ color: '#0F172A' }}>{prefix || 'Profile'}_01, {prefix || 'Profile'}_02...</strong>
                </div>
              </div>
            </div>

            {/* Phân nhóm */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', paddingTop: '4px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Nhóm lưu trữ
                </label>
                {!isCreatingNewGroup ? (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={targetGroup}
                      onChange={(e) => setTargetGroup(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '7px 10px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        fontSize: '13px',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      {groupOptions.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewGroup(true)}
                      style={{
                        padding: '0 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        color: '#475569',
                        fontSize: '12px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      + Nhóm mới
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="Nhập tên nhóm mới..."
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '7px 10px',
                        border: '1px solid #7C3AED',
                        borderRadius: '6px',
                        fontSize: '13px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewGroup(false)}
                      style={{
                        padding: '0 10px',
                        borderRadius: '6px',
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Website mở khi khởi động
                </label>
                <input
                  type="text"
                  value={startUrl}
                  onChange={(e) => setStartUrl(e.target.value)}
                  placeholder="https://www.google.com"
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Môi trường OS & Trình duyệt */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Laptop size={15} color="#2563EB" />
              2. Hệ điều hành & Nhân trình duyệt
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'windows', label: 'Windows 11', desc: 'Phổ biến nhất' },
                { id: 'macos', label: 'macOS (Apple)', desc: 'Apple Silicon' },
                { id: 'linux', label: 'Linux (Ubuntu)', desc: 'Developer' },
                { id: 'random', label: '🎲 Ngẫu nhiên', desc: 'Mix Win & Mac' },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => setOsChoice(item.id)}
                  style={{
                    border: osChoice === item.id ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                    backgroundColor: osChoice === item.id ? '#EFF6FF' : '#FFFFFF',
                    borderRadius: '8px',
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: osChoice === item.id ? '#1D4ED8' : '#1E293B' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Lõi Chromium:</span>
              <select
                value={browserChoice}
                onChange={(e) => setBrowserChoice(e.target.value)}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  backgroundColor: '#FFFFFF',
                  color: '#0F172A',
                  fontWeight: 600
                }}
              >
                <option value="Chrome 128">Chrome 128 (Khuyên dùng - Ổn định nhất)</option>
                <option value="Chrome 126">Chrome 126 (LTS)</option>
                <option value="Chrome 124">Chrome 124 (Legacy)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Cấu hình Proxy hàng loạt */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={15} color="#059669" />
              3. Cấu hình Mạng & Proxy
            </div>

            {/* Mode selection buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'none', label: 'Không dùng Proxy (Direct)' },
                { id: 'list', label: 'Nhập danh sách Proxy (Mỗi dòng 1 IP)' },
                { id: 'single', label: 'Dùng chung 1 Proxy có sẵn' }
              ].map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setProxyMode(mode.id)}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: proxyMode === mode.id ? '1px solid #059669' : '1px solid #E2E8F0',
                    backgroundColor: proxyMode === mode.id ? '#ECFDF5' : '#F8FAFC',
                    color: proxyMode === mode.id ? '#065F46' : '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Mode: List */}
            {proxyMode === 'list' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <textarea
                  rows={4}
                  value={proxyListText}
                  onChange={(e) => setProxyListText(e.target.value)}
                  placeholder={`Dán danh sách proxy tại đây (hỗ trợ định dạng:\nhost:port\nhost:port:user:pass\nsocks5://host:port\nsocks5://user:pass@host:port)`}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                  <span>
                    Đã nhận diện: <strong style={{ color: '#059669' }}>{parsedProxies.length} proxy hợp lệ</strong>
                  </span>
                  <span>
                    {parsedProxies.length < count && parsedProxies.length > 0 && (
                      <span style={{ color: '#D97706' }}>
                        * Ít hơn {count} hồ sơ: các proxy sẽ tự động xoay vòng phân bổ.
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}

            {/* Mode: Single */}
            {proxyMode === 'single' && (
              <div>
                {proxies.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#EF4444', padding: '6px 0' }}>
                    Chưa có proxy nào trong kho lưu trữ! Vui lòng thêm proxy vào kho trước hoặc chọn nhập danh sách.
                  </div>
                ) : (
                  <select
                    value={selectedSingleProxyId}
                    onChange={(e) => setSelectedSingleProxyId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="">-- Chọn một Proxy dùng chung cho tất cả hồ sơ --</option>
                    {proxies.map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.type || 'SOCKS5'}] {p.host}:{p.port} {p.country ? `(${p.country})` : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          {/* Section 4: Antidetect Fingerprint Features Guarantee */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="#10B981" />
              Cơ chế bảo vệ & sinh ngẫu nhiên Fingerprint độc nhất (100% Unique)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: '#64748B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#10B981" />
                Canvas & Audio Noise độc lập từng profile
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#10B981" />
                WebGL GPU Vendor & Renderer khớp hệ điều hành
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#10B981" />
                Phân bổ ngẫu nhiên độ phân giải màn hình
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={12} color="#10B981" />
                WebRTC Altered & DNS Cloudflare chống leak
              </div>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Sẽ tạo: <strong style={{ color: '#7C3AED' }}>{count} hồ sơ</strong> thuộc nhóm <strong style={{ color: '#0F172A' }}>"{isCreatingNewGroup ? (newGroupName.trim() || 'Chung') : targetGroup}"</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
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
                padding: '7px 18px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isSubmitting || remainingSlots <= 0 ? '#94A3B8' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: isSubmitting || remainingSlots <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: remainingSlots <= 0 ? 'none' : '0 2px 4px rgba(124, 58, 237, 0.25)'
              }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Đang khởi tạo...
                </>
              ) : remainingSlots <= 0 ? (
                'Đã đầy hạn mức gói'
              ) : (
                <>
                  <Sparkles size={14} />
                  Tạo ngay {count} hồ sơ
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
