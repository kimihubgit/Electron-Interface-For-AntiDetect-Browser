import React, { useState, useEffect, useMemo } from 'react';
import {
  Cookie,
  X,
  Copy,
  Check,
  Download,
  Search,
  Code2,
  Table as TableIcon,
  Bot,
  ExternalLink,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';

function formatNetscape(cookies) {
  let output = '# Netscape HTTP Cookie File\n# https://curl.se/docs/http-cookies.html\n# Exported by AntidetectBrowser\n\n';
  for (const c of cookies) {
    const domain = c.domain || '';
    const flag = domain.startsWith('.') ? 'TRUE' : 'FALSE';
    const path = c.path || '/';
    const secure = c.secure ? 'TRUE' : 'FALSE';
    const expiry = c.expires || c.expirationDate || Math.floor(Date.now() / 1000) + 31536000;
    const name = c.name || '';
    const value = c.value || '';
    output += `${domain}\t${flag}\t${path}\t${secure}\t${Math.floor(expiry)}\t${name}\t${value}\n`;
  }
  return output;
}

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
    // Netscape format
    const lines = trimmed.split('\n');
    const list = [];
    for (const line of lines) {
      const l = line.trim();
      if (!l || l.startsWith('#')) continue;
      const parts = l.split('\t');
      if (parts.length >= 7) {
        list.push({
          domain: parts[0],
          path: parts[2],
          secure: parts[3] === 'TRUE',
          expires: parseInt(parts[4]) || 0,
          name: parts[5],
          value: parts[6]
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
  onOpenCookieRobot,
  addLog,
  showToast
}) {
  const [format, setFormat] = useState('json'); // 'json' | 'netscape'
  const [viewMode, setViewMode] = useState('raw'); // 'raw' | 'table'
  const [domainFilter, setDomainFilter] = useState('');
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

  // Filter cookies by domain / name
  const filteredCookies = useMemo(() => {
    if (!domainFilter.trim()) return rawCookies;
    const q = domainFilter.trim().toLowerCase();
    return rawCookies.filter(
      (c) =>
        (c.domain && c.domain.toLowerCase().includes(q)) ||
        (c.name && c.name.toLowerCase().includes(q))
    );
  }, [rawCookies, domainFilter]);

  // Formatted text for export
  const exportText = useMemo(() => {
    if (format === 'json') {
      return JSON.stringify(filteredCookies, null, 2);
    }
    return formatNetscape(filteredCookies);
  }, [filteredCookies, format]);

  if (!isOpen || !profile) return null;

  const handleCopy = () => {
    if (!exportText || filteredCookies.length === 0) return;
    navigator.clipboard.writeText(exportText).then(() => {
      setCopied(true);
      if (showToast) showToast(`Đã sao chép ${filteredCookies.length} cookies vào Clipboard!`, 'success');
      addLog?.(`Đã sao chép ${filteredCookies.length} cookies của "${profile.name}"`, 'info');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!exportText || filteredCookies.length === 0) return;
    const ext = format === 'json' ? 'json' : 'txt';
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const safeName = profile.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const fileName = `cookies_${safeName}_${format}.${ext}`;

    const blob = new Blob([exportText], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (showToast) showToast(`Đã tải xuống tệp ${fileName}!`, 'success');
    addLog?.(`Đã xuất và tải về tệp cookie "${fileName}" cho hồ sơ "${profile.name}"`, 'success');
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
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFC'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Cookie size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Xuất Cookies Hồ Sơ
                </h3>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: '#F1F5F9',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#64748B'
                  }}
                >
                  {profile.name}
                </span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: rawCookies.length > 0 ? '#DCFCE7' : '#F1F5F9',
                    color: rawCookies.length > 0 ? '#15803D' : '#64748B',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {rawCookies.length} Cookies
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Xuất cookie tiêu chuẩn dùng cho EditThisCookie, Puppeteer, cURL hoặc trình duyệt khác
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px',
              cursor: 'pointer',
              color: '#94A3B8',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Toolbar: Format Switcher, View Switcher & Search ── */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Format Tabs (JSON vs Netscape) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Định dạng:</span>
            <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setFormat('json')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: format === 'json' ? '#FFFFFF' : 'transparent',
                  color: format === 'json' ? '#7C3AED' : '#64748B',
                  fontWeight: format === 'json' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: format === 'json' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                JSON (EditThisCookie)
              </button>
              <button
                type="button"
                onClick={() => setFormat('netscape')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: format === 'netscape' ? '#FFFFFF' : 'transparent',
                  color: format === 'netscape' ? '#7C3AED' : '#64748B',
                  fontWeight: format === 'netscape' ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  boxShadow: format === 'netscape' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                Netscape (TXT / cURL)
              </button>
            </div>
          </div>

          {/* Search by Domain / Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: '100%',
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF'
              }}
            >
              <Search size={14} color="#64748B" />
              <input
                type="text"
                placeholder="Lọc tên miền (facebook, google...)"
                value={domainFilter}
                onChange={(e) => setDomainFilter(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#1E293B'
                }}
              />
              {domainFilter && (
                <button
                  type="button"
                  onClick={() => setDomainFilter('')}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Modal Content Body ── */}
        <div
          style={{
            flex: 1,
            minHeight: '260px',
            maxHeight: '440px',
            overflowY: 'auto',
            padding: '16px 24px',
            backgroundColor: '#F8FAFC'
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', gap: '10px' }}>
              <RefreshCw size={24} color="#7C3AED" className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
                Đang trích xuất cookies từ hồ sơ Chromium...
              </span>
            </div>
          ) : rawCookies.length === 0 ? (
            /* Empty State */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px dashed #CBD5E1'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}
              >
                <Cookie size={24} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                Hồ sơ này chưa có Cookie
              </h4>
              <p style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', maxWidth: '420px', margin: '0 0 16px 0' }}>
                Hồ sơ chưa duyệt web hoặc chưa lưu cookie phiên nào. Bạn có thể mở trình duyệt lướt web hoặc chạy Cookie Robot để tự động thu thập cookies.
              </p>
              {onOpenCookieRobot && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCookieRobot(profile);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  <Bot size={15} />
                  <span>Chạy Cookie Robot cho hồ sơ này</span>
                </button>
              )}
            </div>
          ) : (
            /* Cookies Raw Code View */
            <div
              style={{
                backgroundColor: '#0F172A',
                borderRadius: '10px',
                padding: '14px 16px',
                border: '1px solid #1E293B',
                overflowX: 'auto',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontSize: '12px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  color: '#38BDF8',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {exportText}
              </pre>
            </div>
          )}
        </div>

        {/* ── Modal Footer: Copy & Download Actions ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            {filteredCookies.length > 0 ? (
              <span>
                Đang chọn <strong>{filteredCookies.length}</strong> / {rawCookies.length} cookies
              </span>
            ) : null}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              Đóng
            </button>

            <button
              type="button"
              disabled={filteredCookies.length === 0}
              onClick={handleCopy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: copied ? '#10B981' : '#1E293B',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: filteredCookies.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (filteredCookies.length > 0) e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép'}</span>
            </button>

            <button
              type="button"
              disabled={filteredCookies.length === 0}
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filteredCookies.length === 0 ? '#C4B5FD' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: filteredCookies.length === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (filteredCookies.length > 0) e.currentTarget.style.backgroundColor = '#6D28D9';
              }}
              onMouseLeave={(e) => {
                if (filteredCookies.length > 0) e.currentTarget.style.backgroundColor = '#7C3AED';
              }}
            >
              <Download size={14} />
              <span>Tải tệp .{format === 'json' ? 'json' : 'txt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
