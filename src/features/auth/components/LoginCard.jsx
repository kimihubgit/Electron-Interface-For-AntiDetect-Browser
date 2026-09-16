import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Eye, EyeOff, X, QrCode, RefreshCw, ChevronDown, Search, Check, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import {
  loginWithApi,
  registerWithApi,
  sendResetPasswordLinkApi,
  getStoredUser,
  loginWithGoogleApi,
  getGoogleAuthUrlApi,
  GOOGLE_CLIENT_ID
} from '../../../services/authService';
import { COUNTRY_CODES } from '../constants/countryCodes';

/**
 * Modern 2-Column Split Login Modal matching Bilibili / Antidetect UI:
 * - Left column: Interactive QR Code scanner with auto-refresh
 * - Right column: Password & SMS OTP login tabs, Register form
 * - Forgot password flow via email link reset on web
 * - Complete Country / Area code selector with instant search
 * - Custom social login methods (Google, Telegram, GitHub, Discord)
 */
export default function LoginCard({ onLogin, onOfflineSpace, showToast }) {
  const { t } = useTranslation();

  // Tab: 'password' | 'sms'
  const [activeTab, setActiveTab] = useState('password');

  // Form states
  const [account, setAccount] = useState(() => {
    const user = getStoredUser();
    return user?.username || user?.email || '';
  });
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 2FA state for Login
  const [requires2fa, setRequires2fa] = useState(false);
  const [code2fa, setCode2fa] = useState('');

  // Register flow states
  const [isRegister, setIsRegister] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot password flow states (Email link reset on web)
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

  // Country Code selector states (Default: Trung Quốc đại lục +86)
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0] || { name: 'Trung Quốc đại lục', code: '+86' });
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Filtered countries based on search term
  const filteredCountries = useMemo(() => {
    const term = countrySearch.trim().toLowerCase();
    if (!term) return COUNTRY_CODES;
    return COUNTRY_CODES.filter(
      (c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  }, [countrySearch]);

  // QR Code states
  const [qrExpired, setQrExpired] = useState(false);
  const [qrCountdown, setQrCountdown] = useState(120);

  // SMS OTP countdown state
  const [otpCountdown, setOtpCountdown] = useState(0);

  // QR code countdown timer
  useEffect(() => {
    if (qrExpired) return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          setQrExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qrExpired]);

  // SMS OTP timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Resend countdown timer for Forgot Password email link
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRefreshQr = () => {
    setQrExpired(false);
    setQrCountdown(120);
    setErrorMsg('');
  };

  const handleQrClick = () => {
    const msg = 'Tính năng quét mã QR đăng nhập qua App di động đang được phát triển!';
    if (showToast) {
      showToast(msg, 'info');
    }
    setErrorMsg(msg);
  };

  const handleSendOtp = () => {
    const msg = 'Tính năng gửi mã SMS OTP đang được phát triển.';
    if (showToast) {
      showToast(msg, 'info');
    }
    setErrorMsg(msg);
  };

  const handleSendResetLink = async (e) => {
    e?.preventDefault();
    const cleanMail = resetEmail.trim();
    if (!cleanMail) {
      setErrorMsg('Vui lòng nhập địa chỉ email của bạn');
      return;
    }
    if (!cleanMail.includes('@') || !cleanMail.includes('.')) {
      setErrorMsg('Địa chỉ email không hợp lệ');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    const res = await sendResetPasswordLinkApi(cleanMail);
    setIsLoading(false);

    if (res.success) {
      setIsLinkSent(true);
      setResendCountdown(60);
      setSuccessMsg(`Đã gửi đường link đặt lại mật khẩu đến email: ${cleanMail}`);
    } else {
      setErrorMsg(res.message || 'Không thể gửi đường link đặt lại mật khẩu');
    }
  };

  // Submit Password or SMS login
  const handleSubmitLogin = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (activeTab === 'password') {
      const cleanAcc = account.trim();
      if (!cleanAcc) {
        setErrorMsg('Vui lòng nhập tài khoản hoặc email');
        return;
      }
      if (!password) {
        setErrorMsg('Vui lòng nhập mật khẩu');
        return;
      }

      setIsLoading(true);

      // Call real backend API with hwid, device_name, and 2FA code
      const res = await loginWithApi({
        login: cleanAcc,
        password: password,
        code_2fa: code2fa
      });

      if (res.requires2fa) {
        setRequires2fa(true);
        setErrorMsg('Tài khoản đã kích hoạt 2FA. Vui lòng nhập mã xác thực 6 số bên dưới.');
        setIsLoading(false);
        return;
      }

      if (res.success) {
        onLogin({
          name: res.user?.full_name || res.user?.username || cleanAcc.split('@')[0],
          email: res.user?.email || (cleanAcc.includes('@') ? cleanAcc : `${cleanAcc}@antidetect.io`),
          provider: 'api',
          token: res.token,
          user: res.user,
          workspace: res.workspace,
          ...res.user
        });
      } else {
        setErrorMsg(res.message || 'Mật khẩu hoặc tài khoản không chính xác');
      }
      setIsLoading(false);
      return;
    } else {
      // SMS login is under development
      const msg = 'Tính năng đăng nhập qua SMS / OTP đang được phát triển. Vui lòng sử dụng đăng nhập bằng Mật khẩu.';
      if (showToast) {
        showToast(msg, 'info');
      }
      setErrorMsg(msg);
      return;
    }
  };

  // Open register form
  const handleRegister = () => {
    setIsRegister(true);
    setIsForgotPassword(false);
    setErrorMsg('');
    if (account.includes('@')) {
      setRegEmail(account);
    } else if (account) {
      setRegUsername(account);
    }
  };

  // Submit Register form
  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    setErrorMsg('');

    const cleanEmail = regEmail.trim();
    const cleanUsername = regUsername.trim();

    if (!cleanEmail) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Định dạng email không hợp lệ');
      return;
    }
    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 50) {
      setErrorMsg('Tên đăng nhập phải từ 3 đến 50 ký tự');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự');
      return;
    }

    setIsLoading(true);
    const res = await registerWithApi({
      email: cleanEmail,
      username: cleanUsername,
      password: regPassword,
      full_name: regFullName.trim()
    });
    setIsLoading(false);

    if (res.success) {
      // Directly log in user into the application with free starter workspace
      onLogin({
        name: res.user?.full_name || res.user?.username || cleanUsername,
        email: res.user?.email || cleanEmail,
        provider: 'api_register',
        token: res.token,
        user: res.user,
        workspace: res.workspace,
        ...res.user
      });
    } else {
      setErrorMsg(res.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  };

  // Xử lý hoàn tất đăng nhập Google khi nhận được token hoặc authorization code từ trình duyệt
  const completeGoogleLogin = async (tokenOrCode) => {
    try {
      let loginRes;
      if (typeof tokenOrCode === 'object') {
        loginRes = await loginWithGoogleApi(tokenOrCode);
      } else if (tokenOrCode.startsWith('eyJ') || tokenOrCode.length > 50) {
        loginRes = await loginWithGoogleApi({ id_token: tokenOrCode });
      } else {
        loginRes = await loginWithGoogleApi({ code: tokenOrCode });
      }

      if (loginRes.success) {
        if (showToast) showToast('Đăng nhập bằng Google thành công!', 'success');
        onLogin?.(loginRes.user, loginRes.token, loginRes.workspace);
      } else {
        setErrorMsg(loginRes.message || 'Xác thực tài khoản Google thất bại');
      }
    } catch (err) {
      console.error('Google complete login error:', err);
      setErrorMsg(`Lỗi đăng nhập Google: ${err.message}`);
    }
  };

  // Lắng nghe kết quả xác thực trả về từ trình duyệt ngoài
  useEffect(() => {
    // 1. Nhận từ Deep Link Electron: antidetect://oauth-callback?token=...
    let unsubDeepLink;
    if (typeof window !== 'undefined' && window.electronAPI?.onOAuthDeepLink) {
      unsubDeepLink = window.electronAPI.onOAuthDeepLink((url) => {
        try {
          if (!url) return;
          const parsed = new URL(url.replace('antidetect://', 'http://localhost/'));
          const token = parsed.searchParams.get('token') || parsed.searchParams.get('access_token') || parsed.searchParams.get('code');
          if (token) {
            completeGoogleLogin(token);
          }
        } catch (e) {
          console.error('Failed to parse OAuth deep link:', e);
        }
      });
    }

    // 2. Nhận từ BroadcastChannel giữa các tab/cửa sổ
    let channel;
    try {
      channel = new BroadcastChannel('antidetect_oauth_channel');
      channel.onmessage = (event) => {
        if (event.data?.token) {
          completeGoogleLogin(event.data.token);
        }
      };
    } catch {}

    // 3. Nhận từ Storage event (khi tab ngoài set localStorage)
    const handleStorage = (e) => {
      if (e.key === 'oauth_pending_token' && e.newValue) {
        const token = e.newValue;
        try {
          localStorage.removeItem('oauth_pending_token');
        } catch {}
        completeGoogleLogin(token);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 4. Kiểm tra xem có token đang chờ sẵn trong localStorage không
    try {
      const pending = localStorage.getItem('oauth_pending_token');
      if (pending) {
        localStorage.removeItem('oauth_pending_token');
        completeGoogleLogin(pending);
      }
    } catch {}

    return () => {
      if (unsubDeepLink) unsubDeepLink();
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Mở Google Login TRỰC TIẾP TRÊN TRÌNH DUYỆT NGOÀI (Không hiển thị loading)
  const handleGoogleLogin = async () => {
    try {
      // 1. Lấy Google Auth URL từ backend
      const urlRes = await getGoogleAuthUrlApi();
      const authUrl = urlRes.url;

      // 2. Mở trực tiếp trong trình duyệt mặc định của hệ điều hành
      if (typeof window !== 'undefined' && window.electronAPI?.openExternalUrl) {
        await window.electronAPI.openExternalUrl(authUrl);
      } else {
        window.open(authUrl, '_blank');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setErrorMsg(`Lỗi mở trang Google: ${err.message}`);
    }
  };

  // Other social login handlers
  const handleSocialLogin = (provider) => {
    if (provider === 'google') {
      handleGoogleLogin();
      return;
    }
    const providerNames = {
      telegram: 'Telegram',
      github: 'GitHub',
      discord: 'Discord'
    };
    const name = providerNames[provider] || provider;
    const msg = `Tính năng đăng nhập bằng ${name} đang được phát triển. Vui lòng đăng nhập bằng Google hoặc Mật khẩu.`;
    if (showToast) {
      showToast(msg, 'info');
    }
    setErrorMsg(msg);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 10,
        width: '820px',
        maxWidth: '94vw',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12), 0 4px 16px rgba(15, 23, 42, 0.04)',
        padding: '38px 42px 48px 42px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        userSelect: 'none'
      }}
    >

      {/* ── MAIN 2-COLUMN BODY ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '40px',
          minHeight: '330px'
        }}
      >
        {/* ── LEFT COLUMN: QR CODE LOGIN ── */}
        <div
          style={{
            flex: '1 1 310px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '6px'
          }}
        >
          {/* Header Title */}
          <h2
            style={{
              margin: '0 0 24px 0',
              fontSize: '18px',
              fontWeight: 600,
              color: '#18191C',
              letterSpacing: '-0.2px'
            }}
          >
            Quét mã QR đăng nhập
          </h2>

          {/* QR Code Container */}
          <div
            onClick={handleQrClick}
            title="Tính năng quét mã QR đăng nhập đang được phát triển"
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              border: '1px solid #E3E5E7',
              borderRadius: '12px',
              padding: '12px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 174, 236, 0.16)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          >
            {/* Real Crisp SVG QR Code Pattern */}
            <svg
              width="156"
              height="156"
              viewBox="0 0 156 156"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ opacity: qrExpired ? 0.15 : 1, transition: 'opacity 0.2s ease' }}
            >
              <rect width="156" height="156" fill="#FFFFFF" />
              {/* Top-Left Finder */}
              <rect x="12" y="12" width="40" height="40" rx="4" fill="#18191C" />
              <rect x="18" y="18" width="28" height="28" rx="2" fill="#FFFFFF" />
              <rect x="24" y="24" width="16" height="16" rx="2" fill="#00AEEC" />

              {/* Top-Right Finder */}
              <rect x="104" y="12" width="40" height="40" rx="4" fill="#18191C" />
              <rect x="110" y="18" width="28" height="28" rx="2" fill="#FFFFFF" />
              <rect x="116" y="24" width="16" height="16" rx="2" fill="#00AEEC" />

              {/* Bottom-Left Finder */}
              <rect x="12" y="104" width="40" height="40" rx="4" fill="#18191C" />
              <rect x="18" y="110" width="28" height="28" rx="2" fill="#FFFFFF" />
              <rect x="24" y="116" width="16" height="16" rx="2" fill="#00AEEC" />

              {/* Alignment & Timing Patterns */}
              <rect x="94" y="94" width="24" height="24" rx="2" fill="#18191C" />
              <rect x="98" y="98" width="16" height="16" fill="#FFFFFF" />
              <rect x="102" y="102" width="8" height="8" fill="#18191C" />

              {/* Data Modules Matrix */}
              <rect x="60" y="16" width="8" height="8" fill="#18191C" />
              <rect x="76" y="16" width="8" height="8" fill="#18191C" />
              <rect x="68" y="28" width="8" height="8" fill="#18191C" />
              <rect x="84" y="28" width="8" height="8" fill="#18191C" />
              <rect x="60" y="40" width="8" height="8" fill="#18191C" />
              <rect x="76" y="40" width="8" height="8" fill="#18191C" />

              <rect x="16" y="60" width="8" height="8" fill="#18191C" />
              <rect x="28" y="68" width="8" height="8" fill="#18191C" />
              <rect x="40" y="60" width="8" height="8" fill="#18191C" />
              <rect x="16" y="76" width="8" height="8" fill="#18191C" />
              <rect x="28" y="84" width="8" height="8" fill="#18191C" />

              <rect x="60" y="60" width="12" height="12" rx="2" fill="#00AEEC" />
              <rect x="80" y="60" width="8" height="8" fill="#18191C" />
              <rect x="68" y="76" width="8" height="8" fill="#18191C" />
              <rect x="84" y="76" width="12" height="12" rx="2" fill="#00AEEC" />

              <rect x="104" y="60" width="8" height="8" fill="#18191C" />
              <rect x="120" y="68" width="8" height="8" fill="#18191C" />
              <rect x="132" y="60" width="8" height="8" fill="#18191C" />
              <rect x="104" y="76" width="8" height="8" fill="#18191C" />
              <rect x="124" y="80" width="8" height="8" fill="#18191C" />

              <rect x="60" y="104" width="8" height="8" fill="#18191C" />
              <rect x="76" y="112" width="8" height="8" fill="#18191C" />
              <rect x="60" y="124" width="8" height="8" fill="#18191C" />
              <rect x="72" y="132" width="8" height="8" fill="#18191C" />

              <rect x="124" y="104" width="8" height="8" fill="#18191C" />
              <rect x="136" y="116" width="8" height="8" fill="#18191C" />
              <rect x="124" y="128" width="8" height="8" fill="#18191C" />
              <rect x="136" y="136" width="8" height="8" fill="#18191C" />
            </svg>

            {/* Expired Overlay */}
            {qrExpired && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '13px', color: '#61666D', fontWeight: 500 }}>
                  Mã QR đã hết hạn
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRefreshQr();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    backgroundColor: '#00AEEC',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={13} />
                  Làm mới mã
                </button>
              </div>
            )}
          </div>

          {/* Instruction Text below QR */}
          <div
            style={{
              marginTop: '16px',
              fontSize: '12px',
              color: '#61666D',
              textAlign: 'center',
              lineHeight: 1.6
            }}
          >
            Sử dụng <span style={{ color: '#00AEEC', cursor: 'pointer', fontWeight: 500 }}>App Antidetect</span> trên điện thoại
            <br />
            để quét mã đăng nhập hoặc tải ứng dụng
          </div>
        </div>

        {/* ── VERTICAL DIVIDER LINE ── */}
        <div
          style={{
            width: '1px',
            backgroundColor: '#F1F2F3',
            alignSelf: 'stretch',
            margin: '8px 0'
          }}
        />

        {/* ── RIGHT COLUMN: FORM LOGIN TABS OR FORGOT PASSWORD ── */}
        <div
          style={{
            flex: '1 1 380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          {isForgotPassword ? (
            <div>
              {/* Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingTop: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(false);
                      setIsLinkSent(false);
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#61666D',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F1F2F3';
                      e.currentTarget.style.color = '#18191C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#61666D';
                    }}
                    title="Quay lại đăng nhập"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#18191C' }}>
                    Quên mật khẩu
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setIsLinkSent(false);
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12.5px',
                    color: '#00AEEC',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Quay lại đăng nhập
                </button>
              </div>

              {isLinkSent ? (
                /* State: Link already sent */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px 16px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      backgroundColor: '#E0F2FE',
                      color: '#00AEEC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px'
                    }}
                  >
                    <Mail size={26} />
                  </div>

                  <h3
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#18191C'
                    }}
                  >
                    Đã gửi liên kết đổi mật khẩu
                  </h3>

                  <div
                    style={{
                      fontSize: '13px',
                      color: '#61666D',
                      lineHeight: 1.5,
                      marginBottom: '12px'
                    }}
                  >
                    Chúng tôi đã gửi đường link đặt lại mật khẩu đến email:
                  </div>

                  <div
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E3E5E7',
                      borderRadius: '6px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#00AEEC',
                      marginBottom: '14px',
                      wordBreak: 'break-all'
                    }}
                  >
                    {resetEmail}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#9499A0',
                      lineHeight: 1.5,
                      marginBottom: '20px'
                    }}
                  >
                    Vui lòng mở hòm thư (kiểm tra cả thư mục Spam/Rác) và nhấp vào liên kết để đổi mật khẩu trên website.
                  </div>

                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button
                      type="button"
                      onClick={handleSendResetLink}
                      disabled={resendCountdown > 0 || isLoading}
                      style={{
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: resendCountdown > 0 ? '#9499A0' : '#18191C',
                        cursor: resendCountdown > 0 || isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {resendCountdown > 0 ? `Gửi lại sau ${resendCountdown}s` : 'Gửi lại link'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsLinkSent(false);
                        setErrorMsg('');
                      }}
                      style={{
                        flex: 1,
                        height: '38px',
                        backgroundColor: '#00AEEC',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        cursor: 'pointer'
                      }}
                    >
                      Quay lại đăng nhập
                    </button>
                  </div>
                </div>
              ) : (
                /* State: Enter email to receive reset link */
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#61666D',
                      lineHeight: 1.5,
                      marginBottom: '16px'
                    }}
                  >
                    Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi một đường link để bạn đặt lại mật khẩu trực tiếp trên website.
                  </div>

                  {/* Error message banner */}
                  {errorMsg && (
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '12px',
                        marginBottom: '14px',
                        lineHeight: 1.4
                      }}
                    >
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSendResetLink}>
                    <div
                      style={{
                        border: '1px solid #E3E5E7',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        marginBottom: '18px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                      }}
                    >
                      {/* Row 1: Email */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderRadius: '7px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <span
                          style={{
                            width: '74px',
                            fontSize: '13px',
                            color: '#18191C',
                            fontWeight: 500,
                            flexShrink: 0
                          }}
                        >
                          Email
                        </span>
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="Vui lòng nhập địa chỉ email của bạn"
                          autoFocus
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            color: '#18191C',
                            backgroundColor: 'transparent',
                            minWidth: 0
                          }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(false);
                          setErrorMsg('');
                        }}
                        style={{
                          flex: 1,
                          height: '40px',
                          backgroundColor: '#FFFFFF',
                          color: '#18191C',
                          border: '1px solid #E3E5E7',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#CBD5E1';
                          e.currentTarget.style.backgroundColor = '#F8FAFC';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E3E5E7';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        Quay lại
                      </button>

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          flex: 1.5,
                          height: '40px',
                          backgroundColor: isLoading ? '#BAE6FD' : (resetEmail ? '#00AEEC' : '#80D5F7'),
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: isLoading ? 'not-allowed' : 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 2px 6px rgba(0, 174, 236, 0.2)'
                        }}
                      >
                        {isLoading ? 'Đang gửi...' : 'Gửi link đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : isRegister ? (
            /* Register View */
            <div>
              {/* Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                  paddingTop: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#61666D',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F1F2F3';
                      e.currentTarget.style.color = '#18191C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#61666D';
                    }}
                    title="Quay lại đăng nhập"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#18191C' }}>
                    Đăng ký tài khoản
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12.5px',
                    color: '#00AEEC',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Đã có tài khoản? Đăng nhập
                </button>
              </div>

              {/* Free Workspace Info Badge */}
              <div
                style={{
                  fontSize: '12px',
                  color: '#0369A1',
                  backgroundColor: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  borderRadius: '6px',
                  padding: '7px 10px',
                  marginBottom: '12px',
                  lineHeight: 1.4
                }}
              >
                🎁 Tự động khởi tạo <strong>Workspace Starter Free</strong> (5 profiles) và vào thẳng app ngay sau khi đăng ký.
              </div>

              {/* Error message */}
              {errorMsg && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#DC2626',
                    fontSize: '12px',
                    marginBottom: '12px',
                    lineHeight: 1.4
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* Form 4 Fields */}
              <form onSubmit={handleRegisterSubmit}>
                <div
                  style={{
                    border: '1px solid #E3E5E7',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    marginBottom: '16px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {/* Row 1: Email */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #E3E5E7',
                      borderTopLeftRadius: '7px',
                      borderTopRightRadius: '7px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <span style={{ width: '84px', fontSize: '12.5px', color: '#18191C', fontWeight: 500, flexShrink: 0 }}>
                      Email <span style={{ color: '#EF4444' }}>*</span>
                    </span>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="user@antidetect.com"
                      autoFocus
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '12.5px',
                        color: '#18191C',
                        backgroundColor: 'transparent',
                        minWidth: 0
                      }}
                    />
                  </div>

                  {/* Row 2: Username */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #E3E5E7',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <span style={{ width: '84px', fontSize: '12.5px', color: '#18191C', fontWeight: 500, flexShrink: 0 }}>
                      Tài khoản <span style={{ color: '#EF4444' }}>*</span>
                    </span>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="3 - 50 ký tự (vd: antidetect_pro)"
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '12.5px',
                        color: '#18191C',
                        backgroundColor: 'transparent',
                        minWidth: 0
                      }}
                    />
                  </div>

                  {/* Row 3: Password */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottom: '1px solid #E3E5E7',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <span style={{ width: '84px', fontSize: '12.5px', color: '#18191C', fontWeight: 500, flexShrink: 0 }}>
                      Mật khẩu <span style={{ color: '#EF4444' }}>*</span>
                    </span>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '12.5px',
                        color: '#18191C',
                        backgroundColor: 'transparent',
                        minWidth: 0
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '2px 4px',
                        cursor: 'pointer',
                        color: '#9499A0',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showRegPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Row 4: Full Name */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderBottomLeftRadius: '7px',
                      borderBottomRightRadius: '7px',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <span style={{ width: '84px', fontSize: '12.5px', color: '#18191C', fontWeight: 500, flexShrink: 0 }}>
                      Họ và tên
                    </span>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Nguyen Van A (tùy chọn)"
                      style={{
                        flex: 1,
                        border: 'none',
                        outline: 'none',
                        fontSize: '12.5px',
                        color: '#18191C',
                        backgroundColor: 'transparent',
                        minWidth: 0
                      }}
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(false);
                      setErrorMsg('');
                    }}
                    style={{
                      flex: 1,
                      height: '38px',
                      backgroundColor: '#FFFFFF',
                      color: '#18191C',
                      border: '1px solid #E3E5E7',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E3E5E7';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    Quay lại
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      flex: 1.5,
                      height: '38px',
                      backgroundColor: isLoading ? '#BAE6FD' : (regEmail && regUsername && regPassword ? '#00AEEC' : '#80D5F7'),
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0, 174, 236, 0.2)'
                    }}
                  >
                    {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký & Vào App'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Top Sub-tabs (Mật khẩu | SMS) */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  paddingTop: '6px'
                }}
              >
                <button
                  onClick={() => {
                    setActiveTab('password');
                    setErrorMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '17px',
                    fontWeight: activeTab === 'password' ? 700 : 500,
                    color: activeTab === 'password' ? '#00AEEC' : '#61666D',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                >
                  Đăng nhập mật khẩu
                </button>

                <span style={{ color: '#E3E5E7', fontSize: '15px' }}>|</span>

                <button
                  onClick={() => {
                    setActiveTab('sms');
                    setErrorMsg('Tính năng đăng nhập qua SMS/OTP đang được phát triển. Vui lòng đăng nhập bằng Mật khẩu.');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '17px',
                    fontWeight: activeTab === 'sms' ? 700 : 500,
                    color: activeTab === 'sms' ? '#00AEEC' : '#61666D',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                >
                  Đăng nhập SMS / OTP <span style={{ fontSize: '11px', color: '#9499A0', fontWeight: 500 }}>(Sắp có)</span>
                </button>
              </div>

              {/* Error message banner */}
              {errorMsg && (
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#DC2626',
                    fontSize: '12px',
                    marginBottom: '14px',
                    lineHeight: 1.4
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* ── 2-ROW STACKED INPUT CONTAINER ── */}
              <form onSubmit={handleSubmitLogin}>
                <div
                  style={{
                    border: '1px solid #E3E5E7',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    position: 'relative',
                    marginBottom: '18px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  {activeTab === 'password' ? (
                    <>
                      {/* Row 1: Tài khoản */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderBottom: '1px solid #E3E5E7',
                          borderTopLeftRadius: '7px',
                          borderTopRightRadius: '7px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <span
                          style={{
                            width: '74px',
                            fontSize: '13px',
                            color: '#18191C',
                            fontWeight: 500,
                            flexShrink: 0
                          }}
                        >
                          Tài khoản
                        </span>
                        <input
                          type="text"
                          value={account}
                          onChange={(e) => setAccount(e.target.value)}
                          placeholder="Vui lòng nhập tài khoản hoặc email"
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            color: '#18191C',
                            backgroundColor: 'transparent'
                          }}
                        />
                      </div>

                      {/* Row 2: Mật khẩu */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderBottomLeftRadius: '7px',
                          borderBottomRightRadius: '7px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <span
                          style={{
                            width: '74px',
                            fontSize: '13px',
                            color: '#18191C',
                            fontWeight: 500,
                            flexShrink: 0
                          }}
                        >
                          Mật khẩu
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Vui lòng nhập mật khẩu"
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            color: '#18191C',
                            backgroundColor: 'transparent',
                            minWidth: 0
                          }}
                        />

                        {/* Eye toggle icon */}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '2px 6px',
                            cursor: 'pointer',
                            color: '#9499A0',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>

                        {/* Quên mật khẩu? */}
                        <span
                          onClick={() => {
                            setIsForgotPassword(true);
                            setIsLinkSent(false);
                            setErrorMsg('');
                            setSuccessMsg('');
                            if (account.includes('@')) {
                              setResetEmail(account);
                            }
                          }}
                          style={{
                            fontSize: '12px',
                            color: '#00AEEC',
                            cursor: 'pointer',
                            marginLeft: '8px',
                            whiteSpace: 'nowrap',
                            fontWeight: 500
                          }}
                        >
                          Quên mật khẩu?
                        </span>
                      </div>

                      {/* Row 3: Mã xác thực 2FA (TOTP) nếu tài khoản yêu cầu */}
                      {requires2fa && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 14px',
                            borderTop: '1px solid #FDE68A',
                            borderBottomLeftRadius: '7px',
                            borderBottomRightRadius: '7px',
                            backgroundColor: '#FEFCE8'
                          }}
                        >
                          <span
                            style={{
                              width: '74px',
                              fontSize: '13px',
                              color: '#92400E',
                              fontWeight: 600,
                              flexShrink: 0
                            }}
                          >
                            Mã 2FA
                          </span>
                          <input
                            type="text"
                            value={code2fa}
                            onChange={(e) => setCode2fa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="Nhập mã TOTP 6 số"
                            maxLength={6}
                            autoFocus
                            style={{
                              flex: 1,
                              border: 'none',
                              outline: 'none',
                              fontSize: '14px',
                              color: '#92400E',
                              backgroundColor: 'transparent',
                              minWidth: 0,
                              fontWeight: 600,
                              letterSpacing: '2px'
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Row 1: Area Code Selector + Số điện thoại */}
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderBottom: '1px solid #E3E5E7',
                          borderTopLeftRadius: '7px',
                          borderTopRightRadius: '7px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        {/* Area Code Trigger - ONLY showing number/code as requested */}
                        <button
                          type="button"
                          onClick={() => setIsCountryOpen(!isCountryOpen)}
                          style={{
                            width: '74px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            padding: '0 8px 0 0',
                            marginRight: '12px',
                            background: 'none',
                            border: 'none',
                            borderRight: '1px solid #E3E5E7',
                            color: '#18191C',
                            flexShrink: 0,
                            height: '22px'
                          }}
                          title={`${selectedCountry.name} (${selectedCountry.code})`}
                        >
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#18191C',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {selectedCountry.code}
                          </span>
                          <ChevronDown
                            size={14}
                            style={{
                              color: '#9499A0',
                              transform: isCountryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.15s ease',
                              flexShrink: 0
                            }}
                          />
                        </button>

                        {/* Phone Input */}
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Vui lòng nhập số điện thoại"
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            color: '#18191C',
                            backgroundColor: 'transparent',
                            minWidth: 0
                          }}
                        />

                        {/* Area Code Dropdown List Popover matching user's class="area-code-select" */}
                        {isCountryOpen && (
                          <>
                            <div
                              onClick={() => {
                                setIsCountryOpen(false);
                                setCountrySearch('');
                              }}
                              style={{
                                position: 'fixed',
                                inset: 0,
                                zIndex: 99
                              }}
                            />
                            <div
                              className="area-code-select"
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                maxHeight: '260px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E3E5E7',
                                borderRadius: '8px',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Search Filter Header */}
                              <div
                                style={{
                                  padding: '8px 10px',
                                  borderBottom: '1px solid #F1F2F3',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  backgroundColor: '#FAFAFA'
                                }}
                              >
                                <Search size={14} style={{ color: '#9499A0', flexShrink: 0 }} />
                                <input
                                  type="text"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  placeholder="Tìm quốc gia hoặc mã (+84, +86...)"
                                  autoFocus
                                  style={{
                                    flex: 1,
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '12px',
                                    color: '#18191C',
                                    backgroundColor: 'transparent'
                                  }}
                                />
                                {countrySearch && (
                                  <X
                                    size={13}
                                    style={{ color: '#9499A0', cursor: 'pointer', flexShrink: 0 }}
                                    onClick={() => setCountrySearch('')}
                                  />
                                )}
                              </div>

                              {/* Country List matching exact HTML: class="option [checked]" */}
                              <div
                                style={{
                                  overflowY: 'auto',
                                  flex: 1,
                                  padding: '4px 0'
                                }}
                              >
                                {filteredCountries.length === 0 ? (
                                  <div
                                    style={{
                                      padding: '16px',
                                      fontSize: '12px',
                                      color: '#9499A0',
                                      textAlign: 'center'
                                    }}
                                  >
                                    Không tìm thấy quốc gia
                                  </div>
                                ) : (
                                  filteredCountries.map((c, index) => {
                                    const isChecked =
                                      selectedCountry.code === c.code && selectedCountry.name === c.name;
                                    return (
                                      <div
                                        key={`${c.name}-${c.code}-${index}`}
                                        className={`option ${isChecked ? 'checked' : ''}`}
                                        onClick={() => {
                                          setSelectedCountry(c);
                                          setIsCountryOpen(false);
                                          setCountrySearch('');
                                        }}
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          padding: '7px 14px',
                                          cursor: 'pointer',
                                          fontSize: '13px',
                                          backgroundColor: isChecked ? '#F0F9FF' : 'transparent',
                                          color: isChecked ? '#00AEEC' : '#18191C',
                                          fontWeight: isChecked ? 600 : 400,
                                          transition: 'background-color 0.1s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isChecked) e.currentTarget.style.backgroundColor = '#F4F5F7';
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isChecked) e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                      >
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                          {isChecked && <Check size={13} style={{ color: '#00AEEC', flexShrink: 0 }} />}
                                          <span>{c.name}</span>
                                        </span>
                                        <span
                                          style={{
                                            color: isChecked ? '#00AEEC' : '#9499A0',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            marginLeft: '12px'
                                          }}
                                        >
                                          {c.code}
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Row 2: Mã OTP */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 14px',
                          borderBottomLeftRadius: '7px',
                          borderBottomRightRadius: '7px',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <span
                          style={{
                            width: '74px',
                            fontSize: '13px',
                            color: '#18191C',
                            fontWeight: 500,
                            flexShrink: 0
                          }}
                        >
                          Mã OTP
                        </span>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Nhập mã xác nhận 6 số"
                          style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            fontSize: '13px',
                            color: '#18191C',
                            backgroundColor: 'transparent',
                            minWidth: 0
                          }}
                        />

                        {/* Gửi mã OTP button */}
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpCountdown > 0}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: otpCountdown > 0 ? '#9499A0' : '#00AEEC',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: otpCountdown > 0 ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {otpCountdown > 0 ? `${otpCountdown}s gửi lại` : 'Gửi mã'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* ── TWO ACTION BUTTONS (Đăng ký & Đăng nhập) ── */}
                <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                  {/* Đăng ký Button */}
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      height: '40px',
                      backgroundColor: '#FFFFFF',
                      color: '#18191C',
                      border: '1px solid #E3E5E7',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E3E5E7';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    Đăng ký
                  </button>

                  {/* Đăng nhập Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      height: '40px',
                      backgroundColor: isLoading
                        ? '#BAE6FD'
                        : ((activeTab === 'password' ? (account.trim() && password) : (phone.trim() && otp.trim())) ? '#00AEEC' : '#80D5F7'),
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0, 174, 236, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) e.currentTarget.style.backgroundColor = '#00B5E5';
                    }}
                    onMouseLeave={(e) => {
                      if (!isLoading) {
                        const isReady = activeTab === 'password' ? (account.trim() && password) : (phone.trim() && otp.trim());
                        e.currentTarget.style.backgroundColor = isReady ? '#00AEEC' : '#80D5F7';
                      }
                    }}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </button>
                </div>
              </form>

              {/* ── OTHER LOGIN METHODS (Social Icons) ── */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '4px'
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    color: '#9499A0',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Phương thức đăng nhập khác</span>
                </div>

                {/* Icons Row: Google, Telegram, GitHub, Discord */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
                  {/* 1. Google */}
                  <div
                    onClick={handleGoogleLogin}
                    title="Đăng nhập với Google"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E3E5E7',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.97 0 12s.45 3.84 1.24 5.42l4.04-3.15z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '11px', color: '#61666D' }}>Google</span>
                  </div>

                  {/* 2. Telegram */}
                  <div
                    onClick={() => handleSocialLogin('telegram', 'Telegram User', 'user@telegram.org')}
                    title="Đăng nhập với Telegram"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#2AABEE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(42, 171, 238, 0.28)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '11px', color: '#61666D' }}>Telegram</span>
                  </div>

                  {/* 3. GitHub */}
                  <div
                    onClick={() => handleSocialLogin('github', 'GitHub Developer', 'developer@github.com')}
                    title="Đăng nhập với GitHub"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#18191C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '11px', color: '#61666D' }}>GitHub</span>
                  </div>

                  {/* 4. Discord */}
                  <div
                    onClick={() => handleSocialLogin('discord', 'Discord Member', 'member@discord.gg')}
                    title="Đăng nhập với Discord"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: '#5865F2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(88, 101, 242, 0.3)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '11px', color: '#61666D' }}>Discord</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── BOTTOM DISCLAIMER & AGREEMENT ── */}
      <div
        style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid #F1F2F3',
          fontSize: '11.5px',
          color: '#9499A0',
          textAlign: 'center',
          lineHeight: 1.6
        }}
      >
        Tài khoản chưa đăng ký sẽ được tự động kích hoạt mới. Đăng nhập hoặc hoàn tất đăng ký đồng nghĩa bạn đồng ý với{' '}
        <span style={{ color: '#00AEEC', cursor: 'pointer', fontWeight: 500 }}>Điều khoản dịch vụ</span> và{' '}
        <span style={{ color: '#00AEEC', cursor: 'pointer', fontWeight: 500 }}>Chính sách quyền riêng tư</span>.
      </div>
    </div>
  );
}
