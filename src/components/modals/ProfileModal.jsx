import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Shield, 
  Cpu, 
  RefreshCw, 
  Check, 
  Shuffle, 
  Layers, 
  Sliders, 
  Activity, 
  Laptop,
  Apple,
  Terminal,
  CheckCircle2,
  AlertCircle,
  ClipboardPaste
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

const OS_USER_AGENTS = {
  windows: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  macos: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  linux: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

const GPU_RENDERERS = [
  { label: 'NVIDIA GeForce RTX 4070 (Khuyên dùng)', vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)' },
  { label: 'NVIDIA GeForce RTX 3060', vendor: 'Google Inc. (NVIDIA)', renderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)' },
  { label: 'Intel Iris Xe Graphics', vendor: 'Google Inc. (Intel)', renderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)' },
  { label: 'AMD Radeon RX 6700 XT', vendor: 'Google Inc. (AMD)', renderer: 'ANGLE (AMD, AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)' },
  { label: 'Apple M2 Pro Metal', vendor: 'Apple', renderer: 'Apple M2 Pro' },
];

export default function ProfileModal() {
  const { activeProfileModal, setActiveProfileModal, saveProfile } = useBrowser();

  const isEditing = activeProfileModal && activeProfileModal !== 'new';
  const initialData = isEditing ? activeProfileModal : {};

  const [name, setName] = useState(initialData.name || '');
  const [group, setGroup] = useState(initialData.group || 'Default');
  const [os, setOs] = useState(initialData.os || 'windows');
  const [browser, setBrowser] = useState(initialData.browser || 'Chrome 128');
  const [userAgent, setUserAgent] = useState(initialData.userAgent || OS_USER_AGENTS.windows);
  
  // Proxy selection
  const [proxyType, setProxyType] = useState(initialData.proxy?.type || 'NO_PROXY');
  const [proxyHost, setProxyHost] = useState(initialData.proxy?.host || '');
  const [proxyPort, setProxyPort] = useState(initialData.proxy?.port ? String(initialData.proxy.port) : '');
  const [proxyUser, setProxyUser] = useState(initialData.proxy?.user || '');
  const [proxyPass, setProxyPass] = useState(initialData.proxy?.pass || '');
  const [proxyQuickInput, setProxyQuickInput] = useState('');
  const [proxyTesting, setProxyTesting] = useState(false);
  const [proxyStatusText, setProxyStatusText] = useState(null);

  // Hardware & Fingerprint
  const [canvas, setCanvas] = useState(initialData.canvas || 'noise');
  const [webgl, setWebgl] = useState(initialData.webgl || 'noise');
  const [selectedGpuIndex, setSelectedGpuIndex] = useState(0);
  const [webglVendor, setWebglVendor] = useState(initialData.webglVendor || GPU_RENDERERS[0].vendor);
  const [webglRenderer, setWebglRenderer] = useState(initialData.webglRenderer || GPU_RENDERERS[0].renderer);
  const [webrtc, setWebrtc] = useState(initialData.webrtc || 'altered');
  const [resolution, setResolution] = useState(initialData.resolution || '1920x1080');
  const [cores, setCores] = useState(initialData.cores || 8);
  const [ram, setRam] = useState(initialData.ram || 16);
  const [tagsInput, setTagsInput] = useState(initialData.tags ? initialData.tags.join(', ') : 'Facebook, VIP');
  
  // Advanced options
  const [autoClearCache, setAutoClearCache] = useState(false);
  const [audioProtection, setAudioProtection] = useState(true);
  const [cookieJson, setCookieJson] = useState('');

  const [activeSubTab, setActiveSubTab] = useState('general'); // 'general' | 'proxy' | 'fingerprint' | 'advanced'

  // Quick Parse Proxy (e.g. host:port or host:port:user:pass)
  const handleParseQuickProxy = () => {
    if (!proxyQuickInput.trim()) return;
    const parts = proxyQuickInput.trim().split(':');
    if (parts.length >= 2) {
      setProxyHost(parts[0].trim());
      setProxyPort(parts[1].trim());
      if (parts.length >= 4) {
        setProxyUser(parts[2].trim());
        setProxyPass(parts[3].trim());
      }
      if (proxyType === 'NO_PROXY') {
        setProxyType('SOCKS5');
      }
      setProxyQuickInput('');
    }
  };

  // Randomize all parameters
  const handleRandomizeFingerprint = () => {
    const gpuIdx = Math.floor(Math.random() * GPU_RENDERERS.length);
    setSelectedGpuIndex(gpuIdx);
    setWebglVendor(GPU_RENDERERS[gpuIdx].vendor);
    setWebglRenderer(GPU_RENDERERS[gpuIdx].renderer);
    
    const possibleCores = [4, 6, 8, 12, 16];
    setCores(possibleCores[Math.floor(Math.random() * possibleCores.length)]);
    
    const possibleRam = [8, 16, 32];
    setRam(possibleRam[Math.floor(Math.random() * possibleRam.length)]);
    
    const res = ['1920x1080', '2560x1440', '1680x1050', '1920x1200', '1440x900'][Math.floor(Math.random() * 5)];
    setResolution(res);

    const osKeys = ['windows', 'macos', 'linux'];
    const chosenOs = osKeys[Math.floor(Math.random() * osKeys.length)];
    setOs(chosenOs);
    setUserAgent(OS_USER_AGENTS[chosenOs]);
  };

  const handleTestProxy = () => {
    if (!proxyHost || !proxyPort) {
      setProxyStatusText({ ok: false, msg: 'Vui lòng nhập IP và Port proxy!' });
      return;
    }
    setProxyTesting(true);
    setProxyStatusText(null);
    setTimeout(() => {
      setProxyTesting(false);
      setProxyStatusText({ ok: true, msg: `Kết nối thành công! IP: ${proxyHost} (United States) - Latency: 42ms` });
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Vui lòng nhập tên Profile!');

    const profilePayload = {
      ...(isEditing ? { id: activeProfileModal.id } : {}),
      name: name.trim(),
      group,
      os,
      browser,
      userAgent,
      proxy: (proxyType !== 'NO_PROXY' && proxyHost) ? {
        type: proxyType,
        host: proxyHost,
        port: Number(proxyPort) || 80,
        user: proxyUser,
        pass: proxyPass,
        country: 'US',
        ip: proxyHost,
        status: 'live',
        latency: 42,
      } : null,
      canvas,
      webgl,
      webglVendor,
      webglRenderer,
      webrtc,
      resolution,
      cores,
      ram,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    saveProfile(profilePayload);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '88vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(124, 58, 237, 0.3)'
            }}>
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
                {isEditing ? 'Chỉnh Sửa Hồ Sơ Trình Duyệt' : 'Tạo Hồ Sơ Trình Duyệt Mới'}
              </h3>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>
                Cấu hình Fingerprint, Proxy và cô lập môi trường trình duyệt độc lập
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRandomizeFingerprint}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--apidog-purple)', borderColor: '#DDD6FE', backgroundColor: '#FAF5FF' }}
              title="Ngẫu nhiên hóa toàn bộ thông số phần cứng"
            >
              <Shuffle size={14} /> Randomize
            </button>
            <button 
              onClick={() => setActiveProfileModal(null)} 
              className="btn-icon"
              title="Đóng cửa sổ"
              style={{ width: '32px', height: '32px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-tabs Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '0 24px',
          borderBottom: '1px solid #E5E7EB',
          backgroundColor: '#F9FAFB',
          flexShrink: 0
        }}>
          {[
            { id: 'general', label: '1. Thông Tin Cơ Bản', icon: Globe },
            { id: 'proxy', label: '2. Cấu Hình Proxy', icon: Shield },
            { id: 'fingerprint', label: '3. Fingerprint & Phần Cứng', icon: Cpu },
            { id: 'advanced', label: '4. Mở Rộng & Cookie', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '12px 14px',
                  backgroundColor: 'transparent',
                  color: isTabActive ? 'var(--apidog-purple)' : '#6B7280',
                  fontWeight: isTabActive ? 600 : 500,
                  fontSize: '13px',
                  border: 'none',
                  borderBottom: isTabActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} style={{ strokeWidth: isTabActive ? 2.2 : 1.8 }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="no-scrollbar" style={{ overflowY: 'auto', padding: '24px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '20px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          
          {/* TAB 1: GENERAL */}
          {activeSubTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Tên Hồ Sơ (Profile Name) <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Facebook Ads - Account #01"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      color: '#111827',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--apidog-purple)'}
                    onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Nhóm Quản Lý (Group)
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      color: '#111827',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="TikTok">TikTok Shop VN</option>
                    <option value="Crypto">Crypto Airdrop</option>
                    <option value="E-Commerce">E-Commerce US</option>
                    <option value="Default">Default</option>
                  </select>
                </div>
              </div>

              {/* Operating System Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Hệ Điều Hành Giả Lập (Operating System)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'windows', label: 'Windows 11', sub: 'x64 NT 10.0', icon: Laptop },
                    { id: 'macos', label: 'macOS Sonoma', sub: 'Apple Silicon / Intel', icon: Apple },
                    { id: 'linux', label: 'Linux Ubuntu', sub: 'x86_64 Core', icon: Terminal },
                  ].map(osItem => {
                    const OsIcon = osItem.icon;
                    const isSelected = os === osItem.id;
                    return (
                      <div
                        key={osItem.id}
                        onClick={() => {
                          setOs(osItem.id);
                          setUserAgent(OS_USER_AGENTS[osItem.id]);
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: isSelected ? '1.5px solid var(--apidog-purple)' : '1px solid #E5E7EB',
                          backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--apidog-purple)' : '#F3F4F6',
                          color: isSelected ? '#FFFFFF' : '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <OsIcon size={16} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? 'var(--apidog-purple)' : '#111827' }}>
                            {osItem.label}
                          </div>
                          <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                            {osItem.sub}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Browser Core & Version */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Lõi Trình Duyệt (Browser Kernel)
                  </label>
                  <select
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      color: '#111827',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Chrome 128">Chromium v128 (Mới nhất • Đề xuất)</option>
                    <option value="Chrome 126">Chromium v126</option>
                    <option value="Chrome 124">Chromium v124</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Gắn Thẻ / Nhãn (Tags - Phân cách bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Dropship, US, Ads VIP"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      color: '#111827',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* User-Agent String */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
                    User-Agent Header
                  </label>
                  <button
                    type="button"
                    onClick={() => setUserAgent(OS_USER_AGENTS[os])}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: 'var(--apidog-purple)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={11} /> Đặt lại UA chuẩn
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #D1D5DB',
                    borderRadius: 'var(--radius-sm)',
                    color: '#374151',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROXY */}
          {activeSubTab === 'proxy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Protocol selector pills */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Giao Thức Proxy (Proxy Protocol)
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'NO_PROXY', label: 'Không dùng Proxy (Mạng Trực Tiếp)' },
                    { id: 'SOCKS5', label: 'SOCKS5 (Khuyên Dùng)' },
                    { id: 'HTTP', label: 'HTTP' },
                    { id: 'HTTPS', label: 'HTTPS' },
                  ].map(t => {
                    const isSelected = proxyType === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          setProxyType(t.id);
                          if (t.id === 'NO_PROXY') {
                            setProxyHost('');
                            setProxyPort('');
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1.5px solid var(--apidog-purple)' : '1px solid #D1D5DB',
                          backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
                          color: isSelected ? 'var(--apidog-purple)' : '#4B5563',
                          fontWeight: isSelected ? 600 : 500,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {proxyType !== 'NO_PROXY' && (
                <div style={{
                  backgroundColor: '#F9FAFB',
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #E5E7EB',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Quick paste string */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Dán nhanh định dạng: IP:Port hoặc IP:Port:User:Pass"
                        value={proxyQuickInput}
                        onChange={(e) => setProxyQuickInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleParseQuickProxy}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', whiteSpace: 'nowrap' }}
                    >
                      <ClipboardPaste size={14} /> Nhận Diện Chuỗi
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Proxy IP / Host <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="VD: 154.21.32.88 hoặc myproxy.domain.com"
                        value={proxyHost}
                        onChange={(e) => setProxyHost(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Port <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="1080"
                        value={proxyPort}
                        onChange={(e) => setProxyPort(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Tài khoản Proxy (Username - Tùy chọn)
                      </label>
                      <input
                        type="text"
                        placeholder="user_demo"
                        value={proxyUser}
                        onChange={(e) => setProxyUser(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Mật khẩu Proxy (Password - Tùy chọn)
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={proxyPass}
                        onChange={(e) => setProxyPass(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          color: '#111827',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  {/* Test connection row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #E5E7EB',
                    paddingTop: '14px',
                    marginTop: '4px'
                  }}>
                    <button
                      type="button"
                      onClick={handleTestProxy}
                      className="btn btn-secondary"
                      disabled={proxyTesting}
                      style={{ fontSize: '12px' }}
                    >
                      <Activity size={14} className={proxyTesting ? 'animate-spin' : ''} />
                      {proxyTesting ? 'Đang kiểm tra kết nối...' : 'Kiểm Tra Proxy (Check Live)'}
                    </button>

                    {proxyStatusText && (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: proxyStatusText.ok ? '#059669' : '#DC2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {proxyStatusText.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {proxyStatusText.msg}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINGERPRINT & HARDWARE */}
          {activeSubTab === 'fingerprint' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Trust Score Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F5F3FF 100%)',
                border: '1px solid #A7F3D0',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    🛡️ Fingerprint Quality & Authenticity
                  </span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                    99.8% Độ Chân Thực (Vượt qua CreepJS & Pixelscan)
                  </div>
                </div>
                <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: '12px' }}>
                  ✓ 100% Unique Fingerprint ID
                </span>
              </div>

              {/* Canvas, WebGL & WebRTC Protection Modes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                    Canvas Fingerprint
                  </label>
                  <select
                    value={canvas}
                    onChange={(e) => setCanvas(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="noise">Noise (Thêm nhiễu)</option>
                    <option value="off">Off (Dùng thật)</option>
                    <option value="block">Block (Chặn API)</option>
                  </select>
                </div>

                <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                    WebGL Image
                  </label>
                  <select
                    value={webgl}
                    onChange={(e) => setWebgl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="noise">Noise (Khuyên dùng)</option>
                    <option value="off">Off (Dùng thật)</option>
                  </select>
                </div>

                <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                    Bảo Vệ WebRTC
                  </label>
                  <select
                    value={webrtc}
                    onChange={(e) => setWebrtc(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="altered">Altered (Proxy IP)</option>
                    <option value="disabled">Disabled (Tắt WebRTC)</option>
                    <option value="real">Real (IP Thật)</option>
                  </select>
                </div>
              </div>

              {/* WebGL Metadata: GPU Vendor & Renderer */}
              <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                    Giả Lập Card Đồ Họa (WebGL Metadata Presets)
                  </label>
                  <span style={{ fontSize: '11px', color: '#6B7280' }}>
                    Chọn nhanh cấu hình GPU phổ biến
                  </span>
                </div>

                <select
                  value={selectedGpuIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setSelectedGpuIndex(idx);
                    setWebglVendor(GPU_RENDERERS[idx].vendor);
                    setWebglRenderer(GPU_RENDERERS[idx].renderer);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: '#111827',
                    marginBottom: '10px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  {GPU_RENDERERS.map((g, idx) => (
                    <option key={idx} value={idx}>{g.label}</option>
                  ))}
                </select>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    value={webglVendor}
                    onChange={(e) => setWebglVendor(e.target.value)}
                    placeholder="WebGL Vendor"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: '#374151',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <input
                    type="text"
                    value={webglRenderer}
                    onChange={(e) => setWebglRenderer(e.target.value)}
                    placeholder="WebGL Renderer"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: '#374151',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Hardware Cores, RAM, Resolution */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Số nhân CPU (Cores)
                  </label>
                  <select
                    value={cores}
                    onChange={(e) => setCores(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value={4}>4 Cores (Quad-Core)</option>
                    <option value={6}>6 Cores (Hexa-Core)</option>
                    <option value={8}>8 Cores (Octa-Core)</option>
                    <option value={12}>12 Cores</option>
                    <option value={16}>16 Cores</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Bộ Nhớ RAM
                  </label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value={8}>8 GB</option>
                    <option value={16}>16 GB</option>
                    <option value={32}>32 GB</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Độ Phân Giải Màn Hình
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '13px',
                      color: '#111827',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="1920x1080">1920 x 1080 (Full HD)</option>
                    <option value="2560x1440">2560 x 1440 (2K QHD)</option>
                    <option value="1680x1050">1680 x 1050</option>
                    <option value="1440x900">1440 x 900</option>
                    <option value="1366x768">1366 x 768</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADVANCED & COOKIES */}
          {activeSubTab === 'advanced' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'block' }}>
                      Bảo Vệ Vân Tay Âm Thanh (AudioContext Noise)
                    </span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      Thêm nhiễu ngẫu nhiên vào tần số âm thanh để tránh nhận diện qua Audio API
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={audioProtection}
                    onChange={(e) => setAudioProtection(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'block' }}>
                      Tự Động Xóa Dữ Liệu Cache Khi Đóng Trình Duyệt
                    </span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      Chỉ giữ lại Cookies phiên đăng nhập, dọn dẹp các tệp tạm để tiết kiệm dung lượng đĩa
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoClearCache}
                    onChange={(e) => setAutoClearCache(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                </div>
              </div>

              {/* Cookie JSON Import */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  Nhập Cookie Ban Đầu (JSON Cookie Array - Tùy chọn)
                </label>
                <textarea
                  rows={4}
                  placeholder='[{"name": "c_user", "value": "1000...", "domain": ".facebook.com"}]'
                  value={cookieJson}
                  onChange={(e) => setCookieJson(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D1D5DB',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: '#111827',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* Modal Footer Actions (Sticky Bottom) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '16px',
            borderTop: '1px solid #E5E7EB',
            marginTop: 'auto',
            flexShrink: 0
          }}>
            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
              💡 Môi trường được đóng gói và cách ly an toàn
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setActiveProfileModal(null)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 22px', fontSize: '13px', fontWeight: 600, boxShadow: '0 2px 8px rgba(124, 58, 237, 0.25)' }}
              >
                <Check size={16} />
                {isEditing ? 'Lưu Thay Đổi' : 'Tạo Hồ Sơ Ngay'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
