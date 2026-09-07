import React, { useState, useRef } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

const DEFAULT_EXTENSIONS = [
  {
    id: 'ext-omocaptcha',
    name: 'OMOCaptcha: Auto solve captcha',
    extId: 'jahglfdjihedpmljkighddneoejbkmpb',
    version: '1.7.8',
    category: 'tools',
    sourceType: 'file', // 'file' | 'store'
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

export default function ExtensionsPage() {
  const { profiles = [], addLog } = useBrowser();
  const [extensions, setExtensions] = useState(DEFAULT_EXTENSIONS);

  // Unified "Cài extension" modal state
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSource, setInstallSource] = useState('file'); // 'file' | 'store'
  const [installFile, setInstallFile] = useState(null);
  const [storeUrlInput, setStoreUrlInput] = useState('');

  // "Cập nhật extension" modal state
  const [updateTargetExt, setUpdateTargetExt] = useState(null);
  const [updateFile, setUpdateFile] = useState(null);

  const fileInputRef = useRef(null);
  const updateFileInputRef = useRef(null);

  // Toggle extension enabled
  const handleToggle = (id) => {
    setExtensions(prev => prev.map(ext => {
      if (ext.id === id) {
        const nextState = !ext.enabled;
        addLog?.(`${nextState ? 'Bật' : 'Tắt'} tiện ích "${ext.name}"`, nextState ? 'success' : 'info');
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

  // Delete extension
  const handleDelete = (id, name) => {
    if (confirm(`Bạn có chắc chắn muốn gỡ bỏ tiện ích "${name}" khỏi toàn bộ profile?`)) {
      setExtensions(prev => prev.filter(ext => ext.id !== id));
      addLog?.(`Đã gỡ bỏ tiện ích "${name}"`, 'warning');
    }
  };

  // Handle Install Extension Submission
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
        enabled: false,
        storeUrl: '',
        assignedProfiles: 0,
        size: `${(installFile.size / (1024 * 1024)).toFixed(1)} MB`
      };
      setExtensions([newExt, ...extensions]);
      addLog?.(`Cài đặt thành công extension từ file: ${installFile.name}`, 'success');
      setShowInstallModal(false);
      setInstallFile(null);
    } else {
      if (!storeUrlInput.trim()) return;
      let extName = 'Chrome Extension';
      if (storeUrlInput.toLowerCase().includes('tronlink')) extName = 'TronLink Wallet';
      else if (storeUrlInput.toLowerCase().includes('okx')) extName = 'OKX Web3 Wallet';
      else if (storeUrlInput.toLowerCase().includes('tampermonkey')) extName = 'Tampermonkey';
      else if (storeUrlInput.toLowerCase().includes('adblock')) extName = 'AdBlock Plus';
      else extName = `Store Extension #${Math.floor(100 + Math.random() * 900)}`;

      const newExt = {
        id: `ext-store-${Date.now()}`,
        name: extName,
        extId: Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join(''),
        version: '1.0.0',
        category: 'tools',
        sourceType: 'store',
        description: 'Tiện ích tải và cài đặt trực tiếp từ Chrome Web Store / Edge Add-ons.',
        iconColor: '#7C3AED',
        author: 'Web Store',
        enabled: false,
        storeUrl: storeUrlInput,
        assignedProfiles: 0,
        size: '2.8 MB'
      };
      setExtensions([newExt, ...extensions]);
      addLog?.(`Tải và cài đặt thành công extension: ${extName}`, 'success');
      setShowInstallModal(false);
      setStoreUrlInput('');
    }
  };

  // Handle Update Extension Submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!updateTargetExt || !updateFile) return;

    // Bump version minor
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

    addLog?.(`Cập nhật thành công tiện ích "${updateTargetExt.name}" lên phiên bản v${newVer}`, 'success');
    alert(`✅ Đã cập nhật thành công tiện ích:\n"${updateTargetExt.name}" -> Phiên bản ${newVer}`);
    setUpdateTargetExt(null);
    setUpdateFile(null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: 0,
      overflowY: 'auto',
      backgroundColor: '#FFFFFF',
      padding: '24px 32px 48px 32px',
      boxSizing: 'border-box'
    }}>
      {/* ── 1. PAGE HEADER (Unified single action button) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '19px', fontWeight: 700, color: '#111827', margin: 0 }}>
              Kho Tiện Ích Mở Rộng (Extensions)
            </h1>
            <span style={{
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              Manifest V3
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
            Quản lý, đồng bộ và tự động cài đặt Extension cho {profiles.length} profile trình duyệt antidetect ({extensions.length} tiện ích).
          </p>
        </div>

        {/* Unified "Thêm extension" Button */}
        <div>
          <button
            onClick={() => {
              setInstallSource('file');
              setInstallFile(null);
              setStoreUrlInput('');
              setShowInstallModal(true);
            }}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '8px 18px',
              fontWeight: 600,
              backgroundColor: '#2563EB',
              borderRadius: '6px',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
          >
            <Plus size={16} />
            <span>Thêm extension</span>
          </button>
        </div>
      </div>

      {/* ── 2. EXTENSION GRID (Direct full-width list) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
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
                {/* Icon square */}
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
                    <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', margin: 0 }}>
                      {ext.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {ext.version}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    {ext.sourceType === 'file' ? 'Cài từ file' : 'Chrome Web Store'} • {ext.author}
                  </span>
                </div>
              </div>

              {/* iOS-style toggle switch */}
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

            {/* Footer row: Profiles count, Size, and ACTION BUTTONS */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '10px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '11.5px',
              color: '#64748B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  backgroundColor: ext.enabled ? '#ECFDF5' : '#F1F5F9',
                  color: ext.enabled ? '#059669' : '#64748B',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  fontSize: '11px'
                }}>
                  {ext.assignedProfiles} profile
                </span>
                <span>• {ext.size}</span>
              </div>

              {/* Action Buttons: Mở folder, Cập nhật, Xóa, Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {/* 1. Nút Mở folder */}
                <button
                  onClick={() => handleOpenFolder(ext)}
                  title="Mở thư mục chứa extension"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EFF6FF';
                    e.currentTarget.style.color = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <FolderOpen size={15} />
                </button>

                {/* 2. Nút Cập nhật extension */}
                <button
                  onClick={() => {
                    setUpdateTargetExt(ext);
                    setUpdateFile(null);
                  }}
                  title="Cập nhật extension (thay bản mới)"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F3FF';
                    e.currentTarget.style.color = '#7C3AED';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <RotateCw size={14} />
                </button>

                {/* 3. Nút Xem trên Web Store (nếu có) */}
                {ext.storeUrl && (
                  <a
                    href={ext.storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#64748B',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F1F5F9';
                      e.currentTarget.style.color = '#0F172A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }}
                    title="Mở trên Chrome Web Store"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}

                {/* 4. Nút Xóa extension */}
                <button
                  onClick={() => handleDelete(ext.id, ext.name)}
                  title="Gỡ bỏ extension"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '5px',
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEE2E2';
                    e.currentTarget.style.color = '#DC2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── POPUP 1: CÀI EXTENSION (Exact match to Screenshot 1 & 2) ──     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {showInstallModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '540px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            padding: '24px 26px 20px 26px',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Header: Title + Subtitle + Close 'X' */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Cài extension
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Extension cài xong vẫn tắt cho tới khi một profile bật nó lên.
                </p>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                <X size={18} />
              </button>
            </div>

            {/* 2 Radio Option Cards (Side-by-side) */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {/* Card 1: Từ một file */}
              <div
                onClick={() => setInstallSource('file')}
                style={{
                  flex: 1,
                  border: installSource === 'file' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  backgroundColor: installSource === 'file' ? '#FFFFFF' : '#FFFFFF',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Radio indicator */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: installSource === 'file' ? '5px solid #2563EB' : '1.5px solid #D1D5DB',
                  boxSizing: 'border-box',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    Từ một file
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', lineHeight: '1.35' }}>
                    File .zip hoặc .crx đã có sẵn trên máy này.
                  </div>
                </div>
              </div>

              {/* Card 2: Từ web store */}
              <div
                onClick={() => setInstallSource('store')}
                style={{
                  flex: 1,
                  border: installSource === 'store' ? '1.5px solid #2563EB' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  backgroundColor: installSource === 'store' ? '#FFFFFF' : '#FFFFFF',
                  boxSizing: 'border-box',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Radio indicator */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: installSource === 'store' ? '5px solid #2563EB' : '1.5px solid #D1D5DB',
                  boxSizing: 'border-box',
                  marginTop: '2px',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    Từ web store
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px', lineHeight: '1.35' }}>
                    Dán link Chrome Web Store hoặc Edge Add-ons.
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content Body */}
            <form onSubmit={handleInstallSubmit}>
              {installSource === 'file' ? (
                /* ── Dropzone area matching Screenshot 1 ── */
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '20px'
                }}>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".zip,.crx"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setInstallFile(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Top Dropzone Container */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) {
                        setInstallFile(e.dataTransfer.files[0]);
                      }
                    }}
                    style={{
                      padding: '30px 20px 22px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: installFile ? '#F8FAFC' : '#FFFFFF',
                      transition: 'background-color 0.15s'
                    }}
                  >
                    {/* Blue open box/package icon */}
                    <div style={{ marginBottom: '12px' }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                        <path d="M16 3H8l-2 4h12l-2-4z" />
                        <path d="M10 12h4" />
                      </svg>
                    </div>

                    {installFile ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Check size={16} /> {installFile.name}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {(installFile.size / 1024).toFixed(0)} KB • Bấm để đổi file khác
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#2563EB', marginBottom: '4px' }}>
                          Chọn một gói, hoặc kéo thả vào đây
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          Gói được đọc ngay trên máy này. Không có gì được tải lên.
                        </div>
                      </>
                    )}
                  </div>

                  {/* Bottom bar of Dropzone */}
                  <div style={{
                    borderTop: '1px solid #F1F5F9',
                    backgroundColor: '#FFFFFF',
                    padding: '8px 16px',
                    fontSize: '11.5px',
                    color: '#64748B'
                  }}>
                    Nhận .zip và .crx.
                  </div>
                </div>
              ) : (
                /* ── Web Store Input Container matching Screenshot 2 ── */
                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginBottom: '20px'
                }}>
                  {/* Top row: input */}
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#FFFFFF' }}>
                    <input
                      type="text"
                      placeholder="Dán link trang extension"
                      value={storeUrlInput}
                      onChange={(e) => setStoreUrlInput(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        fontSize: '12.5px',
                        color: '#0F172A',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Bottom hint row */}
                  <div style={{
                    padding: '8px 14px',
                    backgroundColor: '#FFFFFF',
                    fontSize: '11.5px',
                    color: '#64748B'
                  }}>
                    Gói chỉ được tải về lúc bạn bấm cài, nên chưa có gì để xem trước.
                  </div>
                </div>
              )}

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowInstallModal(false)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={installSource === 'file' ? !installFile : !storeUrlInput.trim()}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: (installSource === 'file' ? installFile : storeUrlInput.trim()) ? '#2563EB' : '#F3F4F6',
                    color: (installSource === 'file' ? installFile : storeUrlInput.trim()) ? '#FFFFFF' : '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: (installSource === 'file' ? installFile : storeUrlInput.trim()) ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {installSource === 'file' ? 'Cài đặt' : 'Tải và cài'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── POPUP 2: CẬP NHẬT EXTENSION (Exact match to Screenshot 3) ──   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {updateTargetExt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            width: '540px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            padding: '24px 26px 20px 26px',
            boxSizing: 'border-box',
            position: 'relative'
          }}>
            {/* Header: Title + Subtitle + Close 'X' */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Cập nhật extension
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Thay bản đang có trên máy này. Tên, id và trạng thái giữ nguyên.
                </p>
              </div>
              <button
                onClick={() => setUpdateTargetExt(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Extension Preview Box (Matching Screenshot 3) */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #F1F5F9',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: `${updateTargetExt.iconColor}20`,
                border: `1px solid ${updateTargetExt.iconColor}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Puzzle size={20} color={updateTargetExt.iconColor} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>
                    {updateTargetExt.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    {updateTargetExt.version}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace', marginTop: '2px' }}>
                  {updateTargetExt.extId}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  {updateTargetExt.sourceType === 'file' ? 'Cài từ file' : 'Cài từ web store'}
                </div>
              </div>
            </div>

            {/* Form for File Replacement Dropzone */}
            <form onSubmit={handleUpdateSubmit}>
              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '20px'
              }}>
                <input
                  type="file"
                  ref={updateFileInputRef}
                  accept=".zip,.crx"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUpdateFile(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onClick={() => updateFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      setUpdateFile(e.dataTransfer.files[0]);
                    }
                  }}
                  style={{
                    padding: '30px 20px 22px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: updateFile ? '#F8FAFC' : '#FFFFFF',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                      <path d="M16 3H8l-2 4h12l-2-4z" />
                      <path d="M10 12h4" />
                    </svg>
                  </div>

                  {updateFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Check size={16} /> Gói mới: {updateFile.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {(updateFile.size / 1024).toFixed(0)} KB • Sẵn sàng cập nhật
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#2563EB', marginBottom: '4px' }}>
                        Chọn gói mới hơn, hoặc kéo thả vào đây
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Gói được đọc ngay trên máy này. Không có gì được tải lên.
                      </div>
                    </>
                  )}
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  backgroundColor: '#FFFFFF',
                  padding: '8px 16px',
                  fontSize: '11.5px',
                  color: '#64748B'
                }}>
                  Nhận .zip và .crx.
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setUpdateTargetExt(null)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={!updateFile}
                  style={{
                    padding: '7px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: updateFile ? '#2563EB' : '#F3F4F6',
                    color: updateFile ? '#FFFFFF' : '#9CA3AF',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: updateFile ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
