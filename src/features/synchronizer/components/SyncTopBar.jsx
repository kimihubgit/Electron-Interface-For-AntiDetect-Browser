import React from 'react';
import {
  Play,
  Pause,
  Square,
  Crown,
  Grid,
  Maximize2,
  Minimize2,
  Sliders,
  Layers,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  ChevronDown,
  Monitor
} from 'lucide-react';

export default function SyncTopBar({
  isSyncing,
  setIsSyncing,
  masterProfile,
  setMasterProfile,
  runningProfiles = [],
  delayRange,
  setDelayRange,
  onTileWindows,
  onAlignSizes,
  onBringToFront,
  isMiniFloating,
  setIsMiniFloating,
  activeFollowersCount = 0
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      backgroundColor: 'var(--apidog-card-bg)',
      borderBottom: '1px solid var(--apidog-border)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      gap: '16px',
      flexWrap: 'wrap',
      flexShrink: 0
    }}>
      {/* ── Left Side: Master Profile Selector & Sync Status ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {/* Master Profile Picker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: 'rgba(124, 58, 237, 0.08)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          boxShadow: '0 1px 3px rgba(124, 58, 237, 0.08)'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            backgroundColor: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Crown size={14} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Cửa sổ chính (Master)
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={masterProfile?.id || ''}
                onChange={(e) => {
                  const found = runningProfiles.find(p => p.id === e.target.value);
                  if (found) setMasterProfile(found);
                }}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontWeight: 600,
                  fontSize: '13px',
                  color: 'var(--apidog-text-main)',
                  cursor: 'pointer',
                  outline: 'none',
                  paddingRight: '12px'
                }}
              >
                {runningProfiles.length === 0 ? (
                  <option value="">(Không có profile đang chạy)</option>
                ) : (
                  runningProfiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.proxy?.host ? `[${p.proxy.type || 'Proxy'}]` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: isSyncing ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)',
          border: `1px solid ${isSyncing ? 'rgba(16, 185, 129, 0.3)' : 'rgba(148, 163, 184, 0.25)'}`
        }}>
          <span style={{
            position: 'relative',
            display: 'flex',
            width: '8px',
            height: '8px'
          }}>
            {isSyncing && (
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
              backgroundColor: isSyncing ? '#10B981' : '#94A3B8'
            }} />
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: isSyncing ? '#059669' : '#64748B' }}>
              {isSyncing ? 'ĐANG ĐỒNG BỘ THỜI GIAN THỰC' : 'CHẾ ĐỘ CHỜ / ĐÃ TẠM DỪNG'}
            </span>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>
              {isSyncing ? `Đang sao chép sang ${activeFollowersCount} cửa sổ con` : 'Nhấn nút Bắt đầu để đồng bộ thao tác'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Center / Right: Big Start CTA & Window Arrangements ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Anti-detection Jitter Slider Control */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--apidog-bg)',
          border: '1px solid var(--apidog-border)',
          fontSize: '11.5px',
          color: 'var(--apidog-text-secondary)'
        }}
        title="Độ trễ ngẫu nhiên mô phỏng hành vi thao tác của người thật, chống bot detection"
        >
          <Clock size={13} style={{ color: '#7C3AED' }} />
          <span>Độ trễ (Jitter):</span>
          <span style={{ fontWeight: 700, color: '#7C3AED' }}>{delayRange}ms</span>
          <input
            type="range"
            min="10"
            max="300"
            step="10"
            value={delayRange}
            onChange={(e) => setDelayRange(Number(e.target.value))}
            style={{
              width: '80px',
              cursor: 'pointer',
              accentColor: '#7C3AED'
            }}
          />
        </div>

        {/* Window Layouts (Tile / Arrange) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--apidog-bg)', padding: '3px', borderRadius: '8px', border: '1px solid var(--apidog-border)' }}>
          <button
            onClick={() => onTileWindows('grid-4')}
            title="Sắp xếp 4 cửa sổ dạng lưới 2x2"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 9px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-secondary)',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Grid size={13} />
            <span>Chia lưới 2x2</span>
          </button>

          <button
            onClick={() => onTileWindows('cascade')}
            title="Xếp tầng so le các cửa sổ"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 9px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-secondary)',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Layers size={13} />
            <span>Xếp tầng</span>
          </button>

          <button
            onClick={onAlignSizes}
            title="Đồng bộ kích thước tất cả cửa sổ khớp với Master"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 9px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-secondary)',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Maximize2 size={13} />
            <span>Cùng cỡ</span>
          </button>

          <button
            onClick={onBringToFront}
            title="Đưa tất cả cửa sổ trình duyệt lên trên cùng màn hình"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 9px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--apidog-text-secondary)',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-card-bg)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Monitor size={13} />
            <span>Lên đầu</span>
          </button>
        </div>

        {/* Toggle Floating Mini Bar Mode */}
        <button
          onClick={() => setIsMiniFloating(!isMiniFloating)}
          title="Bật/Tắt cửa sổ điều khiển nổi mini"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid var(--apidog-border)',
            backgroundColor: isMiniFloating ? '#EDE9FE' : 'var(--apidog-card-bg)',
            color: isMiniFloating ? '#7C3AED' : 'var(--apidog-text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Sliders size={13} />
          <span>Bảng nổi</span>
        </button>

        {/* Big Start / Pause Sync Button */}
        {isSyncing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsSyncing(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(245, 158, 11, 0.35)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Pause size={15} />
              <span>TẠM DỪNG</span>
            </button>
            <button
              onClick={() => setIsSyncing(false)}
              title="Dừng và ngắt kết nối đồng bộ"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 22px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(124, 58, 237, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(124, 58, 237, 0.4)';
            }}
          >
            <Play size={15} fill="#FFFFFF" />
            <span>BẮT ĐẦU ĐỒNG BỘ</span>
          </button>
        )}
      </div>
    </div>
  );
}
