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

      // 1. First check Electron native extraction from physical SQLite / live CDP
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

  const profileDisplayNumber = profile.order || profile.id || 1;
  const profileDisplayName = profile.name || `Profile #${profileDisplayNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText).then(() => {
      setCopied(true);
      if (showToast) showToast('Đã sao chép danh sách cookie vào bộ nhớ tạm!', 'success');
      addLog?.(`Đã sao chép danh sách cookie của "${profileDisplayName}"`, 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSaveJsonFile = () => {
    const safeName = (profile.name || `profile_${profileDisplayNumber}`).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
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
    addLog?.(`Đã lưu tệp cookie JSON "${fileName}" cho hồ sơ "${profileDisplayName}"`, 'success');
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
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
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* ── Top Header / Description ── */}
        <div style={{ padding: '20px 24px 14px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: '#4B5563',
                lineHeight: 1.5,
                maxWidth: '470px'
              }}
            >
              Đây là cookie profile đã lưu ở lần đóng trình duyệt gần nhất. Sao chép danh sách, hoặc lưu thành tệp JSON để nhập vào profile khác.
            </p>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#9CA3AF';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Profile Name Box */}
          <div
            style={{
              marginTop: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px'
            }}
          >
            <span style={{ fontWeight: 700, color: '#111827' }}>Profile</span>
            <span style={{ color: '#6B7280', fontWeight: 600 }}>#{profileDisplayNumber}</span>
            <span style={{ color: '#111827', fontWeight: 500 }}>{profileDisplayName}</span>
          </div>

          {/* Cookie Label */}
          <div style={{ marginTop: '16px', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Cookie
            </label>
          </div>

          {/* Cookie Display Box with Blue Border */}
          <div
            style={{
              border: '1.5px solid #2563EB',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
            }}
          >
            {/* Raw JSON Code Area */}
            <div
              style={{
                maxHeight: '230px',
                minHeight: '160px',
                overflowY: 'auto',
                padding: '12px 14px',
                backgroundColor: '#FFFFFF'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', color: '#6B7280', fontSize: '12.5px' }}>
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

            {/* Sub-footer inside Cookie Box */}
            <div
              style={{
                borderTop: '1px solid #E5E7EB',
                padding: '8px 12px',
                backgroundColor: '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
                  Chỉ để xem. Mở profile rồi đóng lại để danh sách này được cập nhật.
                </span>
                <span style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>
                  {rawCookies.length} cookie
                </span>
              </div>

              {/* Copy button */}
              <div>
                <button
                  type="button"
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '3px 6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: copied ? '#059669' : '#111827',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    borderRadius: '4px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E5E7EB')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} color="#374151" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modal Bottom Actions (Hủy & Lưu tệp JSON) ── */}
        <div
          style={{
            padding: '12px 24px 16px 24px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '7px 20px',
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
              padding: '7px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#1677FF',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(22, 119, 255, 0.25)',
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
