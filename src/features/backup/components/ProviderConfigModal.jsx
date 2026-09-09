import React, { useState, useEffect } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Check, 
  ShieldAlert, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  QrCode, 
  Bot, 
  KeyRound, 
  Globe, 
  Smartphone, 
  RefreshCw, 
  LogOut,
  Send,
  HardDrive,
  CheckCircle2
} from 'lucide-react';

export default function ProviderConfigModal({ 
  provider, 
  currentConfig = {}, 
  onSave, 
  onClose,
  onTestConnection
}) {
  const [formData, setFormData] = useState({});
  const [showSecrets, setShowSecrets] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  // Multi-auth mode state
  const [authMode, setAuthMode] = useState(() => {
    if (provider?.id === 'telegram') return currentConfig.authMode || 'qr_login';
    if (provider?.id === 'google_drive') return currentConfig.authMode || 'oauth_browser';
    return 'standard';
  });

  // Telegram QR scan simulation state
  const [isQrScanning, setIsQrScanning] = useState(false);
  const [telegramAccount, setTelegramAccount] = useState(() => currentConfig.telegramAccount || null);
  const [telegramDestination, setTelegramDestination] = useState(() => currentConfig.telegramDestination || 'saved_messages');

  // Google OAuth simulation state
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);
  const [googleAccount, setGoogleAccount] = useState(() => currentConfig.googleAccount || null);

  useEffect(() => {
    if (provider) {
      const initial = { ...currentConfig };
      provider.fields?.forEach((f) => {
        if (initial[f.key] === undefined) {
          initial[f.key] = f.defaultValue || '';
        }
      });
      setFormData(initial);
      setTestResult(null);

      if (provider.id === 'telegram') {
        setAuthMode(currentConfig.authMode || 'qr_login');
        setTelegramAccount(currentConfig.telegramAccount || null);
        setTelegramDestination(currentConfig.telegramDestination || 'saved_messages');
      } else if (provider.id === 'google_drive') {
        setAuthMode(currentConfig.authMode || 'oauth_browser');
        setGoogleAccount(currentConfig.googleAccount || null);
      }
    }
  }, [provider, currentConfig]);

  if (!provider) return null;

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (testResult) setTestResult(null);
  };

  const toggleSecret = (key) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Simulate Telegram QR code scan
  const handleSimulateQrScan = () => {
    setIsQrScanning(true);
    setTimeout(() => {
      setIsQrScanning(false);
      const acc = {
        name: 'Dương Văn Khải',
        username: '@duongvankhai',
        phone: '+84 98***789',
        linkedAt: new Date().toLocaleTimeString('vi-VN')
      };
      setTelegramAccount(acc);
      setTestResult({
        success: true,
        message: 'Quét mã QR thành công! Đã liên kết tài khoản @duongvankhai.'
      });
    }, 1200);
  };

  // Unlink Telegram account
  const handleUnlinkTelegram = () => {
    setTelegramAccount(null);
    setTestResult(null);
  };

  // Simulate Google OAuth login
  const handleGoogleOAuthLogin = () => {
    setIsGoogleAuthenticating(true);
    setTimeout(() => {
      setIsGoogleAuthenticating(false);
      const acc = {
        email: 'vkhai.developer@gmail.com',
        name: 'Văn Khải',
        quotaUsed: '2.8 GB',
        quotaTotal: '15 GB',
        linkedAt: new Date().toLocaleTimeString('vi-VN')
      };
      setGoogleAccount(acc);
      setTestResult({
        success: true,
        message: 'Đăng nhập Google OAuth 2.0 thành công! Đã cấp quyền Google Drive.'
      });
    }, 1400);
  };

  // Unlink Google account
  const handleUnlinkGoogle = () => {
    setGoogleAccount(null);
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await onTestConnection(provider.id, {
        ...formData,
        authMode,
        telegramAccount,
        googleAccount
      });
      setTestResult(res);
    } catch (e) {
      setTestResult({ success: false, message: 'Lỗi kết nối: ' + e.message });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const finalData = {
      ...formData,
      authMode,
      telegramAccount,
      telegramDestination,
      googleAccount,
      isConfigured: 
        (provider.id === 'telegram' && (authMode === 'qr_login' ? !!telegramAccount : !!formData.botToken)) ||
        (provider.id === 'google_drive' && (authMode === 'oauth_browser' ? !!googleAccount : (!!formData.clientId || !!formData.refreshToken))) ||
        (provider.id !== 'telegram' && provider.id !== 'google_drive')
    };
    onSave(provider.id, finalData);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: provider.id === 'telegram' || provider.id === 'google_drive' ? '620px' : '560px',
          maxWidth: '95vw',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s ease'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                Cấu hình {provider.name}
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: provider.tagBg,
                color: provider.tagColor
              }}>
                {provider.tag}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748B' }}>
              {provider.id === 'telegram' 
                ? 'Đăng nhập bằng mã QR qua ứng dụng Telegram hoặc sử dụng Bot Token.' 
                : provider.id === 'google_drive' 
                ? 'Đăng nhập Google cấp quyền 1-click, dùng Refresh Token hoặc Client ID.' 
                : 'Điền thông số xác thực API để tự động mã hóa và đồng bộ hồ sơ.'}
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Sub Mode Selector for Telegram or Google Drive ── */}
        {provider.id === 'telegram' && (
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '4px',
            gap: '4px',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <button
              type="button"
              onClick={() => setAuthMode('qr_login')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'qr_login' ? '#FFFFFF' : 'transparent',
                color: authMode === 'qr_login' ? '#0284C7' : '#64748B',
                fontWeight: authMode === 'qr_login' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: authMode === 'qr_login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <QrCode size={15} />
              <span>1. Đăng nhập bằng Quét mã QR</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('bot_token')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'bot_token' ? '#FFFFFF' : 'transparent',
                color: authMode === 'bot_token' ? '#0284C7' : '#64748B',
                fontWeight: authMode === 'bot_token' ? 700 : 500,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: authMode === 'bot_token' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Bot size={15} />
              <span>2. Sử dụng Bot Token (@BotFather)</span>
            </button>
          </div>
        )}

        {provider.id === 'google_drive' && (
          <div style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '4px',
            gap: '4px',
            borderBottom: '1px solid #E2E8F0'
          }}>
            <button
              type="button"
              onClick={() => setAuthMode('oauth_browser')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'oauth_browser' ? '#FFFFFF' : 'transparent',
                color: authMode === 'oauth_browser' ? '#16A34A' : '#64748B',
                fontWeight: authMode === 'oauth_browser' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: authMode === 'oauth_browser' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Globe size={14} />
              <span>1. Mở Google cấp quyền</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('refresh_token')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'refresh_token' ? '#FFFFFF' : 'transparent',
                color: authMode === 'refresh_token' ? '#16A34A' : '#64748B',
                fontWeight: authMode === 'refresh_token' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: authMode === 'refresh_token' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <RefreshCw size={14} />
              <span>2. Dùng Refresh Token</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('client_id')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: authMode === 'client_id' ? '#FFFFFF' : 'transparent',
                color: authMode === 'client_id' ? '#16A34A' : '#64748B',
                fontWeight: authMode === 'client_id' ? 700 : 500,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: authMode === 'client_id' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <KeyRound size={14} />
              <span>3. Client ID / Authen</span>
            </button>
          </div>
        )}

        {/* Modal Body / Form */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', flex: 1 }}>
          
          {/* ════════════════════════════════════════════════
              CASE 1: TELEGRAM WITH QR CODE LOGIN
             ════════════════════════════════════════════════ */}
          {provider.id === 'telegram' && authMode === 'qr_login' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!telegramAccount ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '200px 1fr',
                  gap: '18px',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0'
                }}>
                  {/* Telegram QR Graphic */}
                  <div style={{
                    width: '190px',
                    height: '190px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    padding: '10px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}>
                    {/* Simulated Telegram SVG QR pattern */}
                    <svg viewBox="0 0 100 100" width="100%" height="100%">
                      <rect width="100" height="100" fill="#ffffff" />
                      {/* Corner 1 */}
                      <rect x="5" y="5" width="26" height="26" fill="#0284c7" rx="3" />
                      <rect x="9" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="13" y="13" width="10" height="10" fill="#0284c7" rx="1" />
                      {/* Corner 2 */}
                      <rect x="69" y="5" width="26" height="26" fill="#0284c7" rx="3" />
                      <rect x="73" y="9" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="77" y="13" width="10" height="10" fill="#0284c7" rx="1" />
                      {/* Corner 3 */}
                      <rect x="5" y="69" width="26" height="26" fill="#0284c7" rx="3" />
                      <rect x="9" y="73" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="13" y="77" width="10" height="10" fill="#0284c7" rx="1" />
                      {/* Random QR bits */}
                      <rect x="36" y="8" width="6" height="6" fill="#1e293b" />
                      <rect x="46" y="8" width="8" height="6" fill="#1e293b" />
                      <rect x="36" y="18" width="12" height="6" fill="#1e293b" />
                      <rect x="8" y="36" width="6" height="12" fill="#1e293b" />
                      <rect x="18" y="42" width="8" height="6" fill="#1e293b" />
                      <rect x="36" y="36" width="28" height="28" fill="#ffffff" rx="5" />
                      <rect x="69" y="36" width="6" height="12" fill="#1e293b" />
                      <rect x="79" y="42" width="12" height="6" fill="#1e293b" />
                      <rect x="36" y="69" width="6" height="14" fill="#1e293b" />
                      <rect x="46" y="76" width="12" height="8" fill="#1e293b" />
                      <rect x="69" y="69" width="10" height="10" fill="#1e293b" />
                      <rect x="83" y="75" width="8" height="14" fill="#1e293b" />
                    </svg>

                    {/* Center Telegram Plane Icon */}
                    <div style={{
                      position: 'absolute',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}>
                      <Send size={18} style={{ transform: 'translateX(-1px) translateY(1px)' }} />
                    </div>
                  </div>

                  {/* QR Instructions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                      Hướng dẫn quét mã bằng ứng dụng Telegram:
                    </div>
                    <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#475569', lineHeight: '1.6' }}>
                      <li>Mở ứng dụng Telegram trên điện thoại</li>
                      <li>Vào <b>Cài đặt (Settings)</b> &gt; <b>Thiết bị (Devices)</b></li>
                      <li>Nhấn <b>Quét mã QR (Link Desktop Device)</b></li>
                      <li>Hướng camera điện thoại vào mã QR bên cạnh để liên kết</li>
                    </ol>

                    <button
                      type="button"
                      onClick={handleSimulateQrScan}
                      disabled={isQrScanning}
                      style={{
                        marginTop: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        height: '36px',
                        borderRadius: '7px',
                        border: 'none',
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isQrScanning ? <Loader2 size={15} className="spin" /> : <Smartphone size={15} />}
                      <span>{isQrScanning ? 'Đang xác thực phiên...' : 'Quét mã QR (Mô phỏng phiên đăng nhập)'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Telegram Account Connected Card */
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#F0F9FF',
                  borderRadius: '10px',
                  border: '1px solid #BAE6FD',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#0284C7',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px'
                      }}>
                        {telegramAccount.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                            {telegramAccount.name}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#ECFDF5',
                            color: '#10B981'
                          }}>
                            ✓ Đã liên kết
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 600 }}>
                          {telegramAccount.username} • {telegramAccount.phone}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUnlinkTelegram}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#EF4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={13} />
                      <span>Hủy liên kết</span>
                    </button>
                  </div>

                  {/* Destination setting */}
                  <div style={{
                    paddingTop: '10px',
                    borderTop: '1px solid #E0F2FE',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                      Nơi lưu trữ file bản sao lưu:
                    </label>
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="teleDest"
                          checked={telegramDestination === 'saved_messages'}
                          onChange={() => setTelegramDestination('saved_messages')}
                          style={{ accentColor: '#0284C7' }}
                        />
                        <span>Saved Messages (Tin nhắn đã lưu cá nhân)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#334155', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="teleDest"
                          checked={telegramDestination === 'custom_chat'}
                          onChange={() => setTelegramDestination('custom_chat')}
                          style={{ accentColor: '#0284C7' }}
                        />
                        <span>Channel / Chat ID riêng</span>
                      </label>
                    </div>

                    {telegramDestination === 'custom_chat' && (
                      <input
                        type="text"
                        placeholder="Nhập Chat ID hoặc Channel ID (ví dụ: -1001234567890)"
                        value={formData.chatId || ''}
                        onChange={(e) => handleFieldChange('chatId', e.target.value)}
                        style={{
                          height: '36px',
                          padding: '0 12px',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12.5px'
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              CASE 2: TELEGRAM WITH BOT TOKEN
             ════════════════════════════════════════════════ */}
          {provider.id === 'telegram' && authMode === 'bot_token' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                border: '1px solid #DBEAFE',
                fontSize: '12px',
                color: '#0369A1',
                lineHeight: '1.45'
              }}>
                Mở <b>@BotFather</b> trên Telegram để tạo bot mới (`/newbot`), lấy <b>Bot Token</b> và thêm bot vào Channel làm Quản trị viên (Admin) để gửi file.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Telegram Bot Token <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showSecrets['botToken'] ? 'text' : 'password'}
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    value={formData.botToken || ''}
                    onChange={(e) => handleFieldChange('botToken', e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 36px 0 12px',
                      borderRadius: '7px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      fontFamily: showSecrets['botToken'] ? 'inherit' : 'monospace'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('botToken')}
                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    {showSecrets['botToken'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Chat ID / Channel ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. -1001234567890 hoặc your_chat_id"
                  value={formData.chatId || ''}
                  onChange={(e) => handleFieldChange('chatId', e.target.value)}
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: '#1E293B' }}>
                <input
                  type="checkbox"
                  checked={formData.notifyOnBackup !== false}
                  onChange={(e) => handleFieldChange('notifyOnBackup', e.target.checked)}
                  style={{ accentColor: '#0284C7' }}
                />
                <span>Gửi tin nhắn thông báo tóm tắt dung lượng vào Telegram sau khi sao lưu</span>
              </label>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              CASE 3: GOOGLE DRIVE WITH OAUTH BROWSER LOGIN
             ════════════════════════════════════════════════ */}
          {provider.id === 'google_drive' && authMode === 'oauth_browser' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!googleAccount ? (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '14px'
                }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '12px',
                    backgroundColor: '#ECFDF5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16A34A'
                  }}>
                    <HardDrive size={28} />
                  </div>

                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      Cấp quyền truy cập Google Drive tự động
                    </h3>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', maxWidth: '440px' }}>
                      Nhấn vào nút bên dưới để mở cửa sổ Google OAuth 2.0. Ứng dụng chỉ yêu cầu quyền lưu file backup trong thư mục ứng dụng (scope: <code>drive.file</code>).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleOAuthLogin}
                    disabled={isGoogleAuthenticating}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '42px',
                      padding: '0 20px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      color: '#1E293B',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    {/* Google G logo */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>{isGoogleAuthenticating ? 'Đang mở cửa sổ ủy quyền...' : 'Đăng nhập với Google để cấp quyền'}</span>
                  </button>
                </div>
              ) : (
                /* Google Account Connected Card */
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#F0FDF4',
                  borderRadius: '10px',
                  border: '1px solid #BBF7D0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '16px'
                      }}>
                        G
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                            {googleAccount.email}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#DCFCE7',
                            color: '#15803D'
                          }}>
                            ✓ Đã ủy quyền
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#16A34A' }}>
                          Tài khoản: {googleAccount.name} • Dung lượng: {googleAccount.quotaUsed} / {googleAccount.quotaTotal}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleUnlinkGoogle}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#EF4444',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={13} />
                      <span>Hủy liên kết</span>
                    </button>
                  </div>

                  {/* Folder Destination */}
                  <div style={{ paddingTop: '8px', borderTop: '1px solid #DCFCE7' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#166534', display: 'block', marginBottom: '5px' }}>
                      Thư mục lưu trữ trên Google Drive:
                    </label>
                    <input
                      type="text"
                      placeholder="Mặc định: Antidetect_Vault/"
                      value={formData.folderId || 'Antidetect_Vault/'}
                      onChange={(e) => handleFieldChange('folderId', e.target.value)}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 12px',
                        borderRadius: '6px',
                        border: '1px solid #86EFAC',
                        backgroundColor: '#FFFFFF',
                        fontSize: '13px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              CASE 4: GOOGLE DRIVE WITH REFRESH TOKEN
             ════════════════════════════════════════════════ */}
          {provider.id === 'google_drive' && authMode === 'refresh_token' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#F0FDF4',
                borderRadius: '8px',
                border: '1px solid #BBF7D0',
                fontSize: '12px',
                color: '#15803D'
              }}>
                Sử dụng <b>Refresh Token</b> để cấp quyền vĩnh viễn không cần đăng nhập lại khi chạy tự động ngầm.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Google Client ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="xxxxx.apps.googleusercontent.com"
                  value={formData.clientId || ''}
                  onChange={(e) => handleFieldChange('clientId', e.target.value)}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Client Secret <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showSecrets['clientSecret'] ? 'text' : 'password'}
                    placeholder="GOCSPX-xxxxxxxxxxxxxx"
                    value={formData.clientSecret || ''}
                    onChange={(e) => handleFieldChange('clientSecret', e.target.value)}
                    style={{ width: '100%', height: '38px', padding: '0 36px 0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('clientSecret')}
                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    {showSecrets['clientSecret'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Refresh Token <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showSecrets['refreshToken'] ? 'text' : 'password'}
                    placeholder="1//0xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.refreshToken || ''}
                    onChange={(e) => handleFieldChange('refreshToken', e.target.value)}
                    style={{ width: '100%', height: '38px', padding: '0 36px 0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecret('refreshToken')}
                    style={{ position: 'absolute', right: '8px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    {showSecrets['refreshToken'] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Google Drive Folder ID (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="Để trống để lưu tại thư mục gốc Drive"
                  value={formData.folderId || ''}
                  onChange={(e) => handleFieldChange('folderId', e.target.value)}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              CASE 5: GOOGLE DRIVE WITH CLIENT ID / SERVICE ACC
             ════════════════════════════════════════════════ */}
          {provider.id === 'google_drive' && authMode === 'client_id' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '10px 14px',
                backgroundColor: '#F0FDF4',
                borderRadius: '8px',
                border: '1px solid #BBF7D0',
                fontSize: '12px',
                color: '#15803D'
              }}>
                Cấu hình Google Service Account hoặc API Client ID từ <b>Google Cloud Console</b>.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Google Authenticate Client ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1098234789123-xxxxx.apps.googleusercontent.com"
                  value={formData.clientId || ''}
                  onChange={(e) => handleFieldChange('clientId', e.target.value)}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Service Account Private Key / API Key
                </label>
                <textarea
                  rows={3}
                  placeholder='Dán nội dung tệp JSON credentials hoặc API Key...'
                  value={formData.clientSecret || ''}
                  onChange={(e) => handleFieldChange('clientSecret', e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '7px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                  Thư mục đích (Folder ID)
                </label>
                <input
                  type="text"
                  placeholder="ID thư mục chia sẻ cho Service Account"
                  value={formData.folderId || ''}
                  onChange={(e) => handleFieldChange('folderId', e.target.value)}
                  style={{ height: '38px', padding: '0 12px', borderRadius: '7px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════
              CASE 6: ALL OTHER S3-COMPATIBLE PROVIDERS
             ════════════════════════════════════════════════ */}
          {provider.id !== 'telegram' && provider.id !== 'google_drive' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {(provider.helpUrl || provider.helpText) && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#EFF6FF',
                  borderRadius: '8px',
                  border: '1px solid #DBEAFE',
                  fontSize: '12px',
                  color: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  lineHeight: '1.45'
                }}>
                  <span>{provider.helpText || `Truy cập bảng điều khiển ${provider.name} để tạo Access Key & Bucket.`}</span>
                  {provider.helpUrl && (
                    <a
                      href={provider.helpUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#2563EB',
                        fontWeight: 600,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        marginLeft: '8px'
                      }}
                    >
                      <span>Mở Console</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}

              {provider.fields?.map((field) => {
                const isSecret = field.secret;
                const isRevealed = showSecrets[field.key];
                const isCheckbox = field.type === 'checkbox';

                if (isCheckbox) {
                  return (
                    <label
                      key={field.key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        color: '#1E293B',
                        userSelect: 'none',
                        padding: '4px 0'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                        style={{ accentColor: 'var(--apidog-purple)', width: '15px', height: '15px' }}
                      />
                      <span>{field.label}</span>
                    </label>
                  );
                }

                return (
                  <div key={field.key} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
                      {field.label} {field.required && <span style={{ color: '#EF4444' }}>*</span>}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type={isSecret && !isRevealed ? 'password' : 'text'}
                        value={formData[field.key] || ''}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder || ''}
                        required={field.required}
                        style={{
                          width: '100%',
                          height: '38px',
                          padding: isSecret ? '0 36px 0 12px' : '0 12px',
                          borderRadius: '7px',
                          border: '1px solid #CBD5E1',
                          fontSize: '13px',
                          color: '#0F172A',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: isSecret && !isRevealed ? 'monospace' : 'inherit'
                        }}
                      />
                      {isSecret && (
                        <button
                          type="button"
                          onClick={() => toggleSecret(field.key)}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            background: 'none',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px'
                          }}
                          tabIndex={-1}
                        >
                          {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Test Connection Output Feedback */}
          {testResult && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: testResult.success ? '#ECFDF5' : '#FEF2F2',
              color: testResult.success ? '#065F46' : '#991B1B',
              border: testResult.success ? '1px solid #A7F3D0' : '1px solid #FECACA'
            }}>
              {testResult.success ? <Check size={16} /> : <ShieldAlert size={16} />}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '36px',
              padding: '0 14px',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {isTesting ? <Loader2 size={14} className="spin" /> : <ShieldCheck size={14} />}
            <span>{isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối (Ping)'}</span>
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                height: '36px',
                padding: '0 18px',
                borderRadius: '7px',
                border: 'none',
                backgroundColor: 'var(--apidog-purple)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
              }}
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
