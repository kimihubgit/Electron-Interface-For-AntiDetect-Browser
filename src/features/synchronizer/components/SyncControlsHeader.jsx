import React, { useState } from 'react';
import {
  Play,
  Pause,
  Square,
  Crown,
  Grid,
  Maximize2,
  Monitor,
  Globe,
  Send,
  Plus,
  X,
  RotateCw,
  Clock,
  Sliders,
  MousePointer,
  Keyboard,
  Scroll,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

export default function SyncControlsHeader({
  isSyncing,
  setIsSyncing,
  masterProfile,
  runningCount = 0,
  activeSlavesCount = 0,
  delayRange,
  setDelayRange,
  syncMouse,
  setSyncMouse,
  syncKeyboard,
  setSyncKeyboard,
  syncScroll,
  setSyncScroll,
  onTileWindows,
  onAlignSizes,
  onBringToFront,
  onBroadcastUrl,
  onOpenNewTab,
  onCloseTab,
  onReloadAll
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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px 20px',
      backgroundColor: 'var(--apidog-card-bg)',
      borderBottom: '1px solid var(--apidog-border)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      flexShrink: 0
    }}>
      {/* ── ROW 1: Master Signal Status + Big Start/Stop Button + Window Tiling ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Left: Master Indicator & Live Sync Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '8px',
            backgroundColor: masterProfile ? 'rgba(124, 58, 237, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${masterProfile ? 'rgba(124, 58, 237, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: masterProfile ? '#7C3AED' : '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <Crown size={15} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: masterProfile ? '#7C3AED' : '#EF4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Cửa sổ điều khiển chính (Master)
              </span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
                {masterProfile ? masterProfile.name : '(Chưa chọn profile chính)'}
              </span>
            </div>
          </div>

          {/* Sync Engine Status Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: isSyncing && masterProfile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
            border: `1px solid ${isSyncing && masterProfile ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.25)'}`
          }}>
            <span style={{
              position: 'relative',
              display: 'flex',
              width: '8px',
              height: '8px'
            }}>
              {isSyncing && masterProfile && (
                <span style={{
                  position: 'absolute',
                  display: 'inline-flex',
                  height: '100%',
                  width: '100%',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  opacity: 0.75,
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }} />
              )}
              <span style={{
                position: 'relative',
                display: 'inline-flex',
                borderRadius: '50%',
                height: '8px',
                width: '8px',
                backgroundColor: isSyncing && masterProfile ? '#10B981' : '#94A3B8'
              }} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: isSyncing && masterProfile ? '#059669' : '#64748B' }}>
                {isSyncing && masterProfile ? 'ĐANG BẮT & ĐỒNG BỘ THỜI GIAN THỰC' : 'CHẾ ĐỘ TẠM DỪNG / CHƯA ĐỒNG BỘ'}
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>
                {isSyncing && masterProfile
                  ? `Đang sao chép từ Master sang ${activeSlavesCount} Chrome phụ đang chạy`
                  : 'Thao tác trên Chrome Master sẽ không ảnh hưởng các Chrome khác'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Window Tiling & Start/Pause Sync Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Arrange Windows on Desktop */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'var(--apidog-bg)',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid var(--apidog-border)'
          }}>
            <button
              onClick={() => onTileWindows?.('grid-4')}
              title="Tự động xếp 4 cửa sổ Chrome dạng lưới 2x2 trên màn hình desktop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--apidog-text-secondary)',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Grid size={13} />
              <span>Lưới 2x2</span>
            </button>

            <button
              onClick={() => onTileWindows?.('grid-6')}
              title="Xếp 6 cửa sổ dạng lưới 2x3 trên desktop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--apidog-text-secondary)',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Layers size={13} />
              <span>Lưới 2x3</span>
            </button>

            <button
              onClick={onAlignSizes}
              title="Căn chỉnh kích thước tất cả cửa sổ Chrome phụ khớp chính xác với Master"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--apidog-text-secondary)',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Maximize2 size={13} />
              <span>Đồng cỡ</span>
            </button>

            <button
              onClick={onBringToFront}
              title="Đưa toàn bộ các cửa sổ Chrome đang chạy lên trên cùng màn hình máy tính"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                color: 'var(--apidog-text-secondary)',
                cursor: 'pointer',
                fontSize: '11.5px',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Monitor size={13} />
              <span>Lên đầu</span>
            </button>
          </div>

          {/* Big Start / Pause Sync Button */}
          {isSyncing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsSyncing(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(245, 158, 11, 0.35)'
                }}
              >
                <Pause size={15} />
                <span>TẠM DỪNG ĐỒNG BỘ</span>
              </button>
              <button
                onClick={() => setIsSyncing(false)}
                title="Tắt hẳn đồng bộ"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1px solid #EF4444',
                  backgroundColor: '#FEF2F2',
                  color: '#EF4444',
                  cursor: 'pointer'
                }}
              >
                <Square size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSyncing(true)}
              disabled={!masterProfile || runningCount < 2}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 22px',
                borderRadius: '8px',
                border: 'none',
                background: (!masterProfile || runningCount < 2)
                  ? '#CBD5E1'
                  : 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: (!masterProfile || runningCount < 2) ? 'not-allowed' : 'pointer',
                boxShadow: (!masterProfile || runningCount < 2) ? 'none' : '0 4px 14px rgba(124, 58, 237, 0.4)'
              }}
            >
              <Play size={15} fill="#FFFFFF" />
              <span>BẮT ĐẦU ĐỒNG BỘ ({runningCount} Chrome)</span>
            </button>
          )}
        </div>
      </div>

      {/* ── ROW 2: Batch URL Broadcast & Behavior Toggles ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        paddingTop: '8px',
        borderTop: '1px solid var(--apidog-border)'
      }}>
        {/* Fast URL Dispatch Form */}
        <form
          onSubmit={handleSendUrl}
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            minWidth: '300px',
            maxWidth: '560px',
            backgroundColor: 'var(--apidog-bg)',
            border: '1px solid var(--apidog-border)',
            borderRadius: '8px',
            padding: '2px 4px 2px 10px'
          }}
        >
          <Globe size={14} style={{ color: '#7C3AED', marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Nhập URL để mở đồng loạt trên tất cả các Chrome đang chạy..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-main)'
            }}
          />
          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Send size={11} />
            <span>Mở tất cả</span>
          </button>
        </form>

        {/* Sync Mode Toggles (Mouse, Keyboard, Scroll) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSyncMouse(!syncMouse)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncMouse ? '#7C3AED' : 'var(--apidog-border)'}`,
              backgroundColor: syncMouse ? 'rgba(124, 58, 237, 0.08)' : 'var(--apidog-card-bg)',
              color: syncMouse ? '#7C3AED' : 'var(--apidog-text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <MousePointer size={12} />
            <span>Đồng bộ Chuột: {syncMouse ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            onClick={() => setSyncKeyboard(!syncKeyboard)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncKeyboard ? '#2563EB' : 'var(--apidog-border)'}`,
              backgroundColor: syncKeyboard ? 'rgba(37, 99, 235, 0.08)' : 'var(--apidog-card-bg)',
              color: syncKeyboard ? '#2563EB' : 'var(--apidog-text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Keyboard size={12} />
            <span>Đồng bộ Phím: {syncKeyboard ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            onClick={() => setSyncScroll(!syncScroll)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '6px',
              border: `1px solid ${syncScroll ? '#10B981' : 'var(--apidog-border)'}`,
              backgroundColor: syncScroll ? 'rgba(16, 185, 129, 0.08)' : 'var(--apidog-card-bg)',
              color: syncScroll ? '#10B981' : 'var(--apidog-text-secondary)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Scroll size={12} />
            <span>Đồng bộ Cuộn: {syncScroll ? 'BẬT' : 'TẮT'}</span>
          </button>

          {/* Random Jitter Slider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: 'var(--apidog-bg)',
            border: '1px solid var(--apidog-border)',
            fontSize: '11px',
            color: 'var(--apidog-text-secondary)'
          }}
          title="Độ trễ ngẫu nhiên mô phỏng hành vi người thật để tránh bị hệ thống web phát hiện bot"
          >
            <Clock size={12} style={{ color: '#7C3AED' }} />
            <span>Độ trễ:</span>
            <span style={{ fontWeight: 700, color: '#7C3AED' }}>{delayRange}ms</span>
            <input
              type="range"
              min="15"
              max="250"
              step="10"
              value={delayRange}
              onChange={(e) => setDelayRange(Number(e.target.value))}
              style={{ width: '70px', cursor: 'pointer', accentColor: '#7C3AED' }}
            />
          </div>

          {/* Quick tab controls */}
          <button
            onClick={onOpenNewTab}
            title="Mở thêm tab mới trên tất cả profile đang chạy"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 9px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <Plus size={12} />
            <span>Tab mới</span>
          </button>

          <button
            onClick={onReloadAll}
            title="Tải lại trang (F5) tất cả profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 9px',
              borderRadius: '6px',
              border: '1px solid var(--apidog-border)',
              backgroundColor: 'var(--apidog-card-bg)',
              color: 'var(--apidog-text-secondary)',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={12} />
            <span>F5 tất cả</span>
          </button>
        </div>
      </div>
    </div>
  );
}
