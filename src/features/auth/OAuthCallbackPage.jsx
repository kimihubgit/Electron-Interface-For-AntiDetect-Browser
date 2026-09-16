import React, { useEffect, useState } from 'react';
import { CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';

/**
 * OAuthCallbackPage - Trang hứng kết quả sau khi đăng nhập Google trên trình duyệt ngoài.
 * Tự động chuyển token về Desktop App qua BroadcastChannel, localStorage và Deep Link (antidetect://)
 */
export default function OAuthCallbackPage() {
  const [status, setStatus] = useState('processing');
  const [token, setToken] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const receivedToken = urlParams.get('token') || urlParams.get('access_token');
      const receivedCode = urlParams.get('code');
      const finalToken = receivedToken || receivedCode;

      if (finalToken) {
        setToken(finalToken);
        setStatus('success');

        // 1. Broadcast to Electron Desktop App via BroadcastChannel
        try {
          const channel = new BroadcastChannel('antidetect_oauth_channel');
          channel.postMessage({ token: finalToken, success: true });
        } catch {}

        // 2. Save to localStorage for cross-tab synchronization
        try {
          localStorage.setItem('oauth_pending_token', finalToken);
          localStorage.setItem('oauth_timestamp', String(Date.now()));
        } catch {}

        // 3. Trigger deep link to bring focus back to Antidetect Desktop App
        try {
          window.location.href = `antidetect://oauth-callback?token=${encodeURIComponent(finalToken)}`;
        } catch {}
      } else {
        const error = urlParams.get('error') || 'Không tìm thấy mã xác thực token';
        setStatus('error');
      }
    } catch (err) {
      console.error('Failed to parse OAuth callback:', err);
      setStatus('error');
    }
  }, []);

  const handleOpenApp = () => {
    if (token) {
      window.location.href = `antidetect://oauth-callback?token=${encodeURIComponent(token)}`;
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '36px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
        textAlign: 'center'
      }}>
        {status === 'success' ? (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              Đăng nhập Google thành công!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.5', margin: '0 0 24px 0' }}>
              Xác thực hoàn tất. Bạn có thể quay lại ứng dụng <strong>Antidetect Browser</strong> hoặc đóng tab trình duyệt này.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleOpenApp}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1D4ED8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563EB')}
              >
                <span>Mở lại ứng dụng Antidetect Browser</span>
                <ArrowRight size={16} />
              </button>

              {token && (
                <button
                  onClick={handleCopyToken}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {copied ? 'Đã sao chép Token vào bộ nhớ tạm!' : 'Sao chép Token xác thực'}
                </button>
              )}
            </div>
          </>
        ) : status === 'error' ? (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#EF4444', margin: '0 0 8px 0' }}>
              Xác thực không thành công
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px 0' }}>
              Không thể lấy mã xác thực từ phản hồi của Google. Vui lòng quay lại ứng dụng và thử lại.
            </p>
          </>
        ) : (
          <p style={{ fontSize: '14px', color: '#64748B' }}>Đang xử lý kết quả đăng nhập Google...</p>
        )}
      </div>
    </div>
  );
}
