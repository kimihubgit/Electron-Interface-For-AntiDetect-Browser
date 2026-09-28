import React, { useState } from 'react';
import { Bot, X, Play, Globe, CheckCircle2, Sliders, ExternalLink } from 'lucide-react';

const PRESETS = {
  social: {
    label: '🌐 Top Mạng Xã Hội',
    urls: [
      'https://www.google.com',
      'https://www.youtube.com',
      'https://www.facebook.com',
      'https://www.instagram.com',
      'https://twitter.com',
      'https://www.reddit.com'
    ]
  },
  ecommerce: {
    label: '🛍️ Thương Mại Điện Tử',
    urls: [
      'https://www.amazon.com',
      'https://www.ebay.com',
      'https://www.walmart.com',
      'https://shopee.vn',
      'https://tiki.vn'
    ]
  },
  news: {
    label: '📰 Tin Tức & Bách Khoa',
    urls: [
      'https://www.wikipedia.org',
      'https://edition.cnn.com',
      'https://www.bbc.com',
      'https://news.ycombinator.com',
      'https://medium.com'
    ]
  }
};

export default function CookieRobotModal({
  isOpen,
  onClose,
  profile,
  onLaunchProfile,
  addLog,
  showToast
}) {
  const [urlsText, setUrlsText] = useState(PRESETS.social.urls.join('\n'));
  const [delaySec, setDelaySec] = useState(8);
  const [autoScroll, setAutoScroll] = useState(true);
  const [closeWhenDone, setCloseWhenDone] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen || !profile) return null;

  const urlList = urlsText
    .split('\n')
    .map((u) => u.trim())
    .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

  const handleApplyPreset = (presetKey) => {
    const list = PRESETS[presetKey]?.urls || [];
    setUrlsText(list.join('\n'));
  };

  const handleStartRobot = async () => {
    if (urlList.length === 0) {
      alert('Vui lòng nhập ít nhất một đường link URL hợp lệ (bắt đầu bằng http:// hoặc https://)!');
      return;
    }

    setIsRunning(true);
    addLog?.(`[Cookie Robot] Bắt đầu tự động nuôi cookie cho "${profile.name}" với ${urlList.length} trang web (thời gian chờ: ${delaySec}s/trang)...`, 'success');

    // Launch the browser with the first URL if not already running
    if (onLaunchProfile) {
      onLaunchProfile({
        ...profile,
        startUrl: urlList[0]
      });
    }

    if (showToast) {
      showToast(`🤖 Cookie Robot đang tự động lướt web & thu thập cookies cho "${profile.name}"!`, 'success');
    }

    setTimeout(() => {
      setIsRunning(false);
      onClose();
    }, 600);
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
          borderRadius: '16px',
          boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '18px 24px',
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
              <Bot size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  Run Cookie Robot
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
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Tự động lướt các website để thu thập cookies và tạo lịch sử duyệt web tự nhiên
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

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Presets */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Bộ trang web mẫu (Quick Presets):
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(PRESETS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleApplyPreset(key)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    fontSize: '11.5px',
                    fontWeight: 500,
                    color: '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EDE9FE';
                    e.currentTarget.style.borderColor = '#C4B5FD';
                    e.currentTarget.style.color = '#6D28D9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* URLs Textarea */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                Danh sách Website mục tiêu (1 link / dòng):
              </label>
              <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 600 }}>
                {urlList.length} link hợp lệ
              </span>
            </div>
            <textarea
              rows={6}
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              placeholder="https://www.google.com&#10;https://www.youtube.com&#10;https://www.amazon.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                fontFamily: 'Consolas, Monaco, monospace',
                lineHeight: 1.5,
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical',
                backgroundColor: '#FFFFFF',
                color: '#1E293B',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
              onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
            />
          </div>

          {/* Advanced Options */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={14} color="#64748B" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Thời gian dừng lướt mỗi trang:
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  min="3"
                  max="120"
                  value={delaySec}
                  onChange={(e) => setDelaySec(Math.max(1, parseInt(e.target.value) || 5))}
                  style={{
                    width: '56px',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    textAlign: 'center',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>giây</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  style={{ accentColor: '#7C3AED', width: '15px', height: '15px', cursor: 'pointer' }}
                />
                <span>Mô phỏng cuộn trang ngẫu nhiên (Human-like scroll)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#FAFAFC',
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
            Hủy
          </button>

          <button
            type="button"
            disabled={isRunning || urlList.length === 0}
            onClick={handleStartRobot}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isRunning || urlList.length === 0 ? '#C4B5FD' : '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: isRunning || urlList.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isRunning && urlList.length > 0) e.currentTarget.style.backgroundColor = '#6D28D9';
            }}
            onMouseLeave={(e) => {
              if (!isRunning && urlList.length > 0) e.currentTarget.style.backgroundColor = '#7C3AED';
            }}
          >
            <Play size={14} fill="#FFFFFF" />
            <span>{isRunning ? 'Đang Khởi Chạy...' : 'Khởi Chạy Robot'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
