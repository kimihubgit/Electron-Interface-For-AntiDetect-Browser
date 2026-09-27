import React, { useState } from 'react';
import {
  Globe,
  Plus,
  X,
  RotateCw,
  Trash2,
  Clipboard,
  Send,
  Sparkles,
  SlidersHorizontal,
  MousePointer,
  Keyboard,
  Scroll,
  ArrowRightLeft
} from 'lucide-react';

export default function SyncQuickActionToolbar({
  onBroadcastUrl,
  onOpenNewTab,
  onCloseTab,
  onReloadAll,
  onClearCookies,
  syncMouse,
  setSyncMouse,
  syncKeyboard,
  setSyncKeyboard,
  syncScroll,
  setSyncScroll,
  syncTabs,
  setSyncTabs,
  onOpenSettingsModal
}) {
  const [urlInput, setUrlInput] = useState('https://www.google.com');

  const handleSendUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    let url = urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    onBroadcastUrl?.(url);
  };

  const quickUrls = [
    { label: 'Google', url: 'https://google.com' },
    { label: 'YouTube', url: 'https://youtube.com' },
    { label: 'Facebook', url: 'https://facebook.com' },
    { label: 'Shopee', url: 'https://shopee.vn' },
    { label: 'Whoer.net', url: 'https://whoer.net' },
    { label: 'Pixelscan', url: 'https://pixelscan.net' }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: 'var(--apidog-bg)',
      borderBottom: '1px solid var(--apidog-border)',
      flexShrink: 0
    }}>
      {/* ── Row 1: Fast URL Broadcaster & Preset Tags ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        {/* URL Form Input */}
        <form
          onSubmit={handleSendUrl}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: '320px',
            maxWidth: '650px',
            backgroundColor: 'var(--apidog-card-bg)',
            border: '1px solid var(--apidog-border)',
            borderRadius: '8px',
            padding: '3px 6px 3px 10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <Globe size={15} style={{ color: '#7C3AED', marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Nhập đường link URL muốn điều hướng đồng loạt..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '12.5px',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-main)'
            }}
          />
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            <Send size={12} />
            <span>Mở trên tất cả</span>
          </button>
        </form>

        {/* Quick URL Bookmark Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>Phím tắt nhanh:</span>
          {quickUrls.map(item => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setUrlInput(item.url);
                onBroadcastUrl?.(item.url);
              }}
              style={{
                padding: '4px 9px',
                borderRadius: '6px',
                border: '1px solid var(--apidog-border)',
                backgroundColor: 'var(--apidog-card-bg)',
                color: 'var(--apidog-text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7C3AED';
                e.currentTarget.style.color = '#7C3AED';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--apidog-border)';
                e.currentTarget.style.color = 'var(--apidog-text-secondary)';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 2: Sync Mode Toggles & Tab Operations ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        {/* Sync Mode Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Mouse Sync Toggle */}
          <button
            onClick={() => setSyncMouse(!syncMouse)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncMouse ? '#7C3AED' : 'var(--apidog-border)'}`,
              backgroundColor: syncMouse ? 'rgba(124, 58, 237, 0.08)' : 'var(--apidog-card-bg)',
              color: syncMouse ? '#7C3AED' : 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <MousePointer size={12} />
            <span>Chuột {syncMouse ? '✓' : '✕'}</span>
          </button>

          {/* Keyboard Sync Toggle */}
          <button
            onClick={() => setSyncKeyboard(!syncKeyboard)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncKeyboard ? '#2563EB' : 'var(--apidog-border)'}`,
              backgroundColor: syncKeyboard ? 'rgba(37, 99, 235, 0.08)' : 'var(--apidog-card-bg)',
              color: syncKeyboard ? '#2563EB' : 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Keyboard size={12} />
            <span>Bàn phím {syncKeyboard ? '✓' : '✕'}</span>
          </button>

          {/* Scroll Sync Toggle */}
          <button
            onClick={() => setSyncScroll(!syncScroll)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncScroll ? '#10B981' : 'var(--apidog-border)'}`,
              backgroundColor: syncScroll ? 'rgba(16, 185, 129, 0.08)' : 'var(--apidog-card-bg)',
              color: syncScroll ? '#10B981' : 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Scroll size={12} />
            <span>Cuộn trang {syncScroll ? '✓' : '✕'}</span>
          </button>

          {/* Tab & Window Sync Toggle */}
          <button
            onClick={() => setSyncTabs(!syncTabs)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncTabs ? '#F59E0B' : 'var(--apidog-border)'}`,
              backgroundColor: syncTabs ? 'rgba(245, 158, 11, 0.08)' : 'var(--apidog-card-bg)',
              color: syncTabs ? '#D97706' : 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowRightLeft size={12} />
            <span>Đổi Tab {syncTabs ? '✓' : '✕'}</span>
          </button>
        </div>

        {/* Tab Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={onOpenNewTab}
            title="Mở thêm 1 tab mới trên tất cả profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Plus size={13} />
            <span>Tab mới</span>
          </button>

          <button
            onClick={onCloseTab}
            title="Đóng tab hiện tại trên tất cả profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <X size={13} />
            <span>Đóng Tab</span>
          </button>

          <button
            onClick={onReloadAll}
            title="Làm mới (F5) toàn bộ trang trên tất cả profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <RotateCw size={13} />
            <span>Tải lại tất cả</span>
          </button>

          <button
            onClick={onClearCookies}
            title="Xóa nhanh cookie và cache các phiên duyệt"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: '#EF4444',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <Trash2 size={13} />
            <span>Xóa Cache</span>
          </button>

          <button
            onClick={onOpenSettingsModal}
            title="Cài đặt đồng bộ nâng cao (SpinText, tọa độ tương đối, phím tắt)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <SlidersHorizontal size={13} />
            <span>Tùy chỉnh sâu</span>
          </button>
        </div>
      </div>
    </div>
  );
}
