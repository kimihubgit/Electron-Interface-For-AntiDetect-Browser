import React, { useState, useMemo } from 'react';
import {
  Cpu,
  Layers,
  Copy,
  Check,
  Download,
  Trash2,
  Sparkles,
  Server,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Shuffle,
  Plus,
  Minus,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

const QUICK_COUNTS = [10, 20, 50, 100, 200, 500];

export default function Ipv6SubnetTab({
  generatedIpv6List = [],
  generateIpv6Batch,
  addGeneratedIpv6ToPool,
  setGeneratedIpv6List,
  showToast
}) {
  const [prefix, setPrefix] = useState('2402:800:6000:a1b2::/64');
  const [bindAddress, setBindAddress] = useState('127.0.0.1'); // '127.0.0.1' | '0.0.0.0'
  const [count, setCount] = useState(20);
  const [startPort, setStartPort] = useState(20000);
  const [protocol, setProtocol] = useState('SOCKS5'); // SOCKS5 | HTTP
  const [userPrefix, setUserPrefix] = useState('ipv6_user');
  const [customPass, setCustomPass] = useState('NexusSecure@2026');
  const [country, setCountry] = useState('VN');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copyFormat, setCopyFormat] = useState('ipv6'); // 'ipv6' ([host]:port:u:p) | 'address' (address:port:u:p) | 'url'

  // Generate random password helper
  const handleRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 14; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomPass(res);
    showToast?.('Đã tạo mật khẩu bảo mật ngẫu nhiên!');
  };

  // Handle Generate
  const handleGenerate = () => {
    if (!prefix.trim()) {
      showToast?.('Vui lòng nhập dải IPv6 Subnet Prefix!', 'error');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      generateIpv6Batch({
        prefix: prefix.trim(),
        count: Math.max(1, Math.min(1000, Number(count) || 20)),
        startPort: Number(startPort) || 20000,
        protocol,
        type: protocol,
        userPrefix: userPrefix.trim() || 'user',
        customPass: customPass.trim() || 'pass123',
        country,
        bindAddress
      });
      setIsGenerating(false);
      showToast?.(`Đã sinh thành công ${count} địa chỉ Proxy IPv6!`, 'success');
    }, 200);
  };

  // Filtered generated list
  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return generatedIpv6List;
    const term = searchTerm.toLowerCase();
    return generatedIpv6List.filter(
      (p) =>
        p.host?.toLowerCase().includes(term) ||
        String(p.port).includes(term) ||
        p.user?.toLowerCase().includes(term) ||
        p.bindAddress?.toLowerCase().includes(term)
    );
  }, [generatedIpv6List, searchTerm]);

  // Copy Single Proxy string
  const handleCopySingle = (proxy) => {
    let text = `[${proxy.host}]:${proxy.port}:${proxy.user}:${proxy.pass}`;
    if (copyFormat === 'address') {
      text = `${proxy.bindAddress || bindAddress}:${proxy.port}:${proxy.user}:${proxy.pass}`;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(proxy.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Copy All Proxies
  const handleCopyAll = () => {
    if (generatedIpv6List.length === 0) return;
    const lines = generatedIpv6List.map((p) => {
      if (copyFormat === 'url') {
        const proto = (p.type || protocol || 'socks5').toLowerCase();
        return `${proto}://${p.user}:${p.pass}@[${p.host}]:${p.port}`;
      }
      if (copyFormat === 'address') {
        return `${p.bindAddress || bindAddress}:${p.port}:${p.user}:${p.pass}`;
      }
      return `[${p.host}]:${p.port}:${p.user}:${p.pass}`;
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    showToast?.(`Đã sao chép ${lines.length} proxy IPv6 vào bộ nhớ tạm!`, 'success');
  };

  // Download as TXT file
  const handleDownloadTxt = () => {
    if (generatedIpv6List.length === 0) return;
    const lines = generatedIpv6List.map((p) => {
      if (copyFormat === 'address') {
        return `${p.bindAddress || bindAddress}:${p.port}:${p.user}:${p.pass}`;
      }
      return `[${p.host}]:${p.port}:${p.user}:${p.pass}`;
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ipv6_proxies_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast?.('Đã tải xuống danh sách proxy IPv6 (.txt)', 'success');
  };

  // Clear list
  const handleClearList = () => {
    if (setGeneratedIpv6List) {
      setGeneratedIpv6List([]);
      showToast?.('Đã xóa toàn bộ kết quả đã sinh.');
    }
  };

  // Add all to main pool
  const handleAddToPool = () => {
    if (generatedIpv6List.length === 0) return;
    addGeneratedIpv6ToPool();
    showToast?.(`Đã nhập ${generatedIpv6List.length} proxy IPv6 vào kho Proxy tĩnh thành công!`, 'success');
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#F8FAFC',
        overflow: 'hidden'
      }}
    >
      {/* ── MAIN WORKSPACE (2-COLUMN SPLIT) ── */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '400px 1fr',
          overflow: 'hidden'
        }}
      >
        {/* ── LEFT COLUMN: CONFIGURATOR FORM ── */}
        <div
          style={{
            borderRight: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
            padding: '18px 22px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Section 1: IPv6 Subnet Prefix */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                Dải Subnet Prefix (/64 hoặc /48) <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>18.4 tỷ tỷ IP</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder="2402:800:6000:a1b2::/64"
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  fontFamily: 'monospace',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--apidog-purple)')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
              />
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Hỗ trợ định dạng CIDR như <code style={{ color: '#0F172A' }}>2402:800:6000:a1b2::/64</code>
            </div>
          </div>

          {/* Section 2: Address (Listen / Bind Address) */}
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
              Address
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={bindAddress}
                onChange={(e) => setBindAddress(e.target.value)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 32px 0 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--apidog-purple)')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
              >
                <option value="127.0.0.1">127.0.0.1 — chỉ dùng trên máy này</option>
                <option value="0.0.0.0">0.0.0.0 — chia sẻ cho mạng LAN / public ra ngoài</option>
              </select>
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {/* Section 3: Quantity Counter & Quick Pills */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                Số lượng Proxy cần sinh
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Tối đa 1,000 / lần</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setCount((prev) => Math.max(1, Number(prev) - 10))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min={1}
                max={1000}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
                style={{
                  flex: 1,
                  height: '36px',
                  textAlign: 'center',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setCount((prev) => Math.min(1000, Number(prev) + 10))}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
              </button>
            </div>
            {/* Quick Pills */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              {QUICK_COUNTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCount(c)}
                  style={{
                    flex: 1,
                    padding: '4px 0',
                    borderRadius: '5px',
                    border: count === c ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                    backgroundColor: count === c ? '#EDE9FE' : '#F8FAFC',
                    color: count === c ? '#7C3AED' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.12s'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Protocol (Selection) & Start Port */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                Giao thức (Protocol)
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value)}
                  style={{
                    width: '100%',
                    height: '36px',
                    padding: '0 30px 0 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--apidog-purple)')}
                  onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                >
                  <option value="SOCKS5">SOCKS5</option>
                  <option value="HTTP">HTTP</option>
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
                Cổng bắt đầu (Start Port)
              </label>
              <input
                type="number"
                min={1000}
                max={65000}
                value={startPort}
                onChange={(e) => setStartPort(Number(e.target.value) || 20000)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Port Range Feedback */}
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#F1F5F9',
              borderRadius: '6px',
              fontSize: '11.5px',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Dải Port cấp tự động:</span>
            <code style={{ fontWeight: 700, color: '#0F172A' }}>
              {startPort} → {startPort + Math.max(1, count) - 1}
            </code>
          </div>

          {/* Section 5: Authentication Credentials */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
              Thông tin xác thực (Auth Credentials)
            </label>

            <div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Tiền tố Username:</div>
              <input
                type="text"
                value={userPrefix}
                onChange={(e) => setUserPrefix(e.target.value)}
                placeholder="ipv6_user"
                style={{
                  width: '100%',
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px' }}>
                Mẫu sinh: <code style={{ color: '#64748B' }}>{userPrefix || 'user'}_1</code>, <code style={{ color: '#64748B' }}>{userPrefix || 'user'}_2</code>...
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Mật khẩu Proxy:</span>
                <button
                  type="button"
                  onClick={handleRandomPassword}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7C3AED',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  <Shuffle size={11} />
                  <span>Sinh ngẫu nhiên</span>
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={customPass}
                  onChange={(e) => setCustomPass(e.target.value)}
                  placeholder="Mật khẩu"
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 34px 0 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontFamily: showPassword ? 'inherit' : 'monospace',
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isGenerating) e.currentTarget.style.opacity = '0.94';
              }}
              onMouseLeave={(e) => {
                if (!isGenerating) e.currentTarget.style.opacity = '1';
              }}
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Đang tính toán Subnet...' : `⚡ Sinh Ngay ${count} Proxy IPv6`}</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: RESULTS & EXPORT PANEL ── */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {generatedIpv6List.length === 0 ? (
            /* Empty State */
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: '#EDE9FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.12)'
                }}
              >
                <Server size={32} />
              </div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                Chưa có danh sách Proxy IPv6 nào
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748B', maxWidth: '440px', lineHeight: 1.5 }}>
                Nhập dải Subnet prefix /64 bên cạnh và nhấn nút <strong>"Sinh Ngay"</strong> để hệ thống tự động sinh hàng nghìn địa chỉ IP tĩnh hoàn toàn độc lập chống checkpoint.
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '36px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  border: '1px solid #DDD6FE',
                  backgroundColor: '#FFFFFF',
                  color: '#7C3AED',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.1)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
              >
                <Sparkles size={14} />
                <span>Sinh nhanh 20 Proxy mẫu (Demo)</span>
              </button>
            </div>
          ) : (
            /* Results Available */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Results Topbar */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                  flexShrink: 0
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      Kết quả đã sinh:
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      {generatedIpv6List.length} Proxies
                    </span>
                  </div>

                  {/* Format Switcher */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#F1F5F9', padding: '2px', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setCopyFormat('ipv6')}
                      style={{
                        border: 'none',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: copyFormat === 'ipv6' ? 600 : 500,
                        backgroundColor: copyFormat === 'ipv6' ? '#FFFFFF' : 'transparent',
                        color: copyFormat === 'ipv6' ? '#7C3AED' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      IPv6 Host
                    </button>
                    <button
                      type="button"
                      onClick={() => setCopyFormat('address')}
                      style={{
                        border: 'none',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: copyFormat === 'address' ? 600 : 500,
                        backgroundColor: copyFormat === 'address' ? '#FFFFFF' : 'transparent',
                        color: copyFormat === 'address' ? '#7C3AED' : '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      Address ({bindAddress})
                    </button>
                  </div>

                  {/* Search Filter */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      padding: '0 8px',
                      height: '30px',
                      width: '160px'
                    }}
                  >
                    <Search size={12} style={{ color: '#94A3B8', marginRight: '6px' }} />
                    <input
                      type="text"
                      placeholder="Lọc host, port..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: 'none',
                        outline: 'none',
                        fontSize: '11.5px',
                        width: '100%',
                        backgroundColor: 'transparent',
                        color: '#0F172A'
                      }}
                    />
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Import into main pool */}
                  <button
                    type="button"
                    onClick={handleAddToPool}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '32px',
                      padding: '0 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#16A34A',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)',
                      transition: 'background-color 0.12s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#15803D')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#16A34A')}
                  >
                    <CheckCircle2 size={13} />
                    <span>Nhập vào kho Proxy chính</span>
                  </button>

                  {/* Copy All */}
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      height: '32px',
                      padding: '0 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedAll ? <Check size={13} style={{ color: '#16A34A' }} /> : <Copy size={13} />}
                    <span>{copiedAll ? 'Đã sao chép' : 'Sao chép tất cả'}</span>
                  </button>

                  {/* Download TXT */}
                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    title="Tải tệp .TXT về máy"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      height: '32px',
                      padding: '0 10px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                    <span>Xuất file</span>
                  </button>

                  {/* Clear */}
                  <button
                    type="button"
                    onClick={handleClearList}
                    title="Xóa danh sách hiện tại"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid #FECACA',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        borderBottom: '1px solid #E2E8F0',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10
                      }}
                    >
                      <th style={{ padding: '8px 14px', width: '35px' }}>#</th>
                      <th style={{ padding: '8px 14px' }}>Địa chỉ IPv6 (Host)</th>
                      <th style={{ padding: '8px 14px', width: '100px' }}>Address (Bind)</th>
                      <th style={{ padding: '8px 14px', width: '80px' }}>Port</th>
                      <th style={{ padding: '8px 14px', width: '80px' }}>Giao thức</th>
                      <th style={{ padding: '8px 14px' }}>Username</th>
                      <th style={{ padding: '8px 14px' }}>Password</th>
                      <th style={{ padding: '8px 14px', width: '80px' }}>Trạng thái</th>
                      <th style={{ padding: '8px 14px', width: '60px', textAlign: 'center' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredList.map((p, idx) => (
                      <tr
                        key={p.id || idx}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC',
                          fontSize: '12px',
                          color: '#1E293B',
                          transition: 'background-color 0.12s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFC')}
                      >
                        <td style={{ padding: '8px 14px', color: '#94A3B8', fontSize: '11px' }}>
                          {idx + 1}
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0F172A' }}>
                            [{p.host}]
                          </span>
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: (p.bindAddress || bindAddress) === '127.0.0.1' ? '#F1F5F9' : '#FEF3C7',
                              color: (p.bindAddress || bindAddress) === '127.0.0.1' ? '#475569' : '#D97706',
                              fontSize: '11px',
                              fontWeight: 600,
                              fontFamily: 'monospace'
                            }}
                          >
                            {p.bindAddress || bindAddress}
                          </span>
                        </td>
                        <td style={{ padding: '8px 14px', fontFamily: 'monospace', fontWeight: 600, color: '#475569' }}>
                          {p.port}
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          <span
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: '#EDE9FE',
                              color: '#7C3AED',
                              fontSize: '10.5px',
                              fontWeight: 700
                            }}
                          >
                            {p.type || protocol}
                          </span>
                        </td>
                        <td style={{ padding: '8px 14px', color: '#334155' }}>
                          {p.user}
                        </td>
                        <td style={{ padding: '8px 14px', color: '#64748B', fontFamily: 'monospace' }}>
                          {p.pass}
                        </td>
                        <td style={{ padding: '8px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>{p.latency || 24}ms</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 14px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleCopySingle(p)}
                            title="Sao chép cấu hình proxy này"
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              color: copiedId === p.id ? '#16A34A' : '#64748B',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {copiedId === p.id ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
