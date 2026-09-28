import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, X } from 'lucide-react';

function parseCookiesInput(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {}
    }
    // Netscape format fallback
    const lines = trimmed.split('\n');
    const list = [];
    for (const line of lines) {
      const l = line.trim();
      if (!l || l.startsWith('#')) continue;
      const parts = l.split('\t');
      if (parts.length >= 7) {
        list.push({
          name: parts[5],
          value: parts[6],
          expires: parseInt(parts[4]) || 0,
          domain: parts[0],
          path: parts[2],
          secure: parts[3] === 'TRUE'
        });
      }
    }
    if (list.length > 0) return list;
  }
  return [];
}

export default function ExportCookieModal({
  isOpen,
  onClose,
  profile,
  addLog,
  showToast
}) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rawCookies, setRawCookies] = useState([]);

  // Extract cookies from Electron backend or profile object
  useEffect(() => {
    if (!isOpen || !profile) return;

    let isMounted = true;
    setIsLoading(true);

    const loadCookies = async () => {
      let found = [];

      // 1. Check Electron native extraction from physical SQLite / live CDP
      if (window.electronAPI?.exportProfileCookies) {
        try {
          const res = await window.electronAPI.exportProfileCookies(profile);
          if (res && res.success && Array.isArray(res.cookies) && res.cookies.length > 0) {
            found = res.cookies;
          }
        } catch (err) {
          console.warn('Electron exportProfileCookies failed:', err);
        }
      }

      // 2. Fallback to profile.cookies in state/storage
      if (found.length === 0 && profile.cookies) {
        found = parseCookiesInput(profile.cookies);
      }

      if (isMounted) {
        setRawCookies(found);
        setIsLoading(false);
      }
    };

    loadCookies();

    return () => {
      isMounted = false;
    };
  }, [isOpen, profile]);

  const jsonText = useMemo(() => {
    return JSON.stringify(rawCookies, null, 2);
  }, [rawCookies]);

  if (!isOpen || !profile) return null;

  // Clean profile order number & clean name
  const orderNum = profile.order !== undefined && profile.order !== null
    ? profile.order
    : (typeof profile.id === 'number' ? profile.id : String(profile.id).replace(/\D/g, '').slice(-3) || '1');
  const profileName = profile.name || `Profile #${orderNum}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopied(true);
      if (showToast) showToast('Đã sao chép danh sách cookie!', 'success');
      addLog?.(`Đã sao chép danh sách cookie của "${profileName}"`, 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveJsonFile = () => {
    const safeName = profileName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `cookies_${safeName}.json`;

    const blob = new Blob([jsonText], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast(`Đã lưu tệp ${fileName}!`, 'success');
    addLog?.(`Đã lưu tệp cookie JSON "${fileName}" cho hồ sơ "${profileName}"`, 'success');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeInModal 0.15s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 20px 35px -8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}
      >
        {/* ── Top Area: Description & Close Button ── */}
        <div style={{ padding: '18px 20px 0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
            <p
              style={{
                margin: 0,
                fontSize: '12.5px',
                color: '#4B5563',
                lineHeight: 1.45
              }}
            >
              Đây là cookie profile đã lưu ở lần đóng trình duyệt gần nhất. Sao chép danh sách, hoặc lưu thành tệp JSON để nhập vào profile khác.
            </p>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              <X size={17} />
            </button>
          </div>

          {/* Profile Badge Input Box */}
          <div
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px'
            }}
          >
            <span style={{ fontWeight: 700, color: '#111827' }}>Profile</span>
            <span style={{ color: '#6B7280', fontWeight: 500 }}>#{orderNum}</span>
            <span style={{ color: '#111827', fontWeight: 500 }}>{profileName}</span>
          </div>

          {/* Cookie Label */}
          <div style={{ marginTop: '14px', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Cookie
            </label>
          </div>

          {/* Cookie Code Box with Vibrant Blue Border */}
          <div
            style={{
              border: '1.5px solid #2563EB',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF'
            }}
          >
            {/* Raw JSON Code Display */}
            <div
              style={{
                height: '210px',
                overflowY: 'auto',
                padding: '10px 12px',
                backgroundColor: '#FFFFFF'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6B7280', fontSize: '12px' }}>
                  Đang tải danh sách cookie...
                </div>
              ) : (
                <pre
                  style={{
                    margin: 0,
                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                    fontSize: '12px',
                    color: '#111827',
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  {jsonText}
                </pre>
              )}
            </div>

            {/* Bottom Info & Copy Bar inside Cookie Box */}
            <div
              style={{
                borderTop: '1px solid #E5E7EB',
                padding: '7px 12px 8px 12px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#6B7280' }}>
                  Chỉ để xem. Mở profile rồi đóng lại để danh sách này được cập nhật.
                </span>
                <span style={{ fontSize: '11.5px', color: '#374151', fontWeight: 500 }}>
                  {rawCookies.length} cookie
                </span>
              </div>

              {/* Copy Button */}
              <div>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '2px 4px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: copied ? '#059669' : '#111827',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {copied ? <Check size={13} color="#059669" /> : <Copy size={13} color="#374151" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Footer: Hủy & Lưu tệp JSON ── */}
        <div
          style={{
            padding: '14px 20px',
            marginTop: '10px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              color: '#374151',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={handleSaveJsonFile}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1677FF',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(22, 119, 255, 0.3)',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0958D9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1677FF')}
          >
            Lưu tệp JSON
          </button>
        </div>
      </div>
    </div>
  );
}
