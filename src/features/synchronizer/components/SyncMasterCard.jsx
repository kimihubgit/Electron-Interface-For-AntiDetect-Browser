import React from 'react';
import {
  Crown,
  MousePointer,
  Keyboard,
  Clock,
  Shield,
  Monitor,
  Zap,
  Globe,
  Radio,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function SyncMasterCard({
  masterProfile,
  allRunningProfiles = [],
  onSelectMaster,
  isSyncing,
  activeSlavesCount = 0,
  onSimulateAction
}) {
  if (!masterProfile) {
    return (
      <div style={{
        padding: '24px',
        borderRadius: '12px',
        backgroundColor: '#FEF2F2',
        border: '1.5px dashed #FCA5A5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        textAlign: 'center'
      }}>
        <Crown size={32} style={{ color: '#EF4444' }} />
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#991B1B' }}>
          Chưa thiết lập Cửa sổ chính (Master Profile)
        </div>
        <div style={{ fontSize: '12px', color: '#B91C1C', maxWidth: '380px' }}>
          Hãy chọn một trong các cửa sổ Chrome đang chạy bên dưới để chỉ định làm cửa sổ chính điều khiển.
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '12px',
      backgroundColor: 'var(--apidog-card-bg)',
      border: '2px solid #7C3AED',
      boxShadow: '0 8px 24px rgba(124, 58, 237, 0.12)',
      overflow: 'hidden'
    }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#7C3AED',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={18} fill="#FFFFFF" />
          <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            👑 CỬA SỔ CHÍNH (MASTER PROFILE) — CỬA SỔ ĐIỀU KHIỂN
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 10px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          fontSize: '11px',
          fontWeight: 700
        }}>
          <span>{isSyncing ? '🟢 ĐANG PHÁT TÍN HIỆU' : '⏸️ TẠM DỪNG'}</span>
        </div>
      </div>

      {/* Main Details Body */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        backgroundColor: '#FAF5FF'
      }}>
        {/* Profile Name & Switcher Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#EDE9FE',
              border: '1px solid #C4B5FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {masterProfile.os === 'macos' ? '🍎' : masterProfile.os === 'linux' ? '🐧' : '🪟'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1E1B4B' }}>
                  {masterProfile.name}
                </h3>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D'
                }}>
                  PID: {masterProfile.pid || '10482'}
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#6B21A8' }}>
                Hồ sơ số #{masterProfile.order || 1} • Nhóm: {masterProfile.group || 'Chung'}
              </span>
            </div>
          </div>

          {/* Quick Select another profile as master */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', color: '#6B21A8', fontWeight: 600 }}>Đổi Master:</span>
            <select
              value={masterProfile.id}
              onChange={(e) => {
                const found = allRunningProfiles.find(p => String(p.id) === String(e.target.value));
                if (found) onSelectMaster?.(found);
              }}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: '1px solid #C4B5FD',
                backgroundColor: '#FFFFFF',
                color: '#4C1D95',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {allRunningProfiles.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {String(p.id) === String(masterProfile.id) ? ' (Đang là Master)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Grid (Proxy, Resolution, Network) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E9D5FF'
        }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#6B21A8', fontWeight: 600 }}>ĐỊA CHỈ PROXY / IP</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E1B4B', marginTop: '2px' }}>
              {masterProfile.proxy?.host ? `${masterProfile.proxy.host}:${masterProfile.proxy.port || ''}` : 'Mạng trực tiếp (Direct)'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: '#6B21A8', fontWeight: 600 }}>LOẠI PROXY</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E1B4B', marginTop: '2px' }}>
              {masterProfile.proxy?.type || 'Không proxy'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: '#6B21A8', fontWeight: 600 }}>CỬA SỔ PHỤ ĐANG KẾT NỐI</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', marginTop: '2px' }}>
              {activeSlavesCount} Chrome đang lắng nghe
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10.5px', color: '#6B21A8', fontWeight: 600 }}>ĐỘ PHÂN GIẢI THỰC TẾ</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E1B4B', marginTop: '2px' }}>
              {masterProfile.screenResolution || '1280 × 720'}
            </div>
          </div>
        </div>

        {/* Master Instruction & Trigger Simulation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: '8px',
          backgroundColor: '#F3E8FF',
          border: '1px dashed #C4B5FD'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#581C87' }}>
            <Sparkles size={15} style={{ color: '#7C3AED' }} />
            <span>
              <strong>Nguyên lý:</strong> Thao tác chuột, bàn phím và cuộn trang trực tiếp trên cửa sổ Chrome <strong>"{masterProfile.name}"</strong> trên màn hình máy tính của bạn sẽ tự động được bắt và điều khiển đồng loạt sang các Chrome phụ.
            </span>
          </div>

          {/* Test Signal Triggers */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: '#6B21A8', fontWeight: 600 }}>Test phát tín hiệu:</span>
            <button
              onClick={() => onSimulateAction?.('click')}
              style={{
                padding: '4px 9px',
                borderRadius: '5px',
                border: '1px solid #7C3AED',
                backgroundColor: '#FFFFFF',
                color: '#7C3AED',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🖱️ Test Click
            </button>
            <button
              onClick={() => onSimulateAction?.('typing')}
              style={{
                padding: '4px 9px',
                borderRadius: '5px',
                border: '1px solid #7C3AED',
                backgroundColor: '#FFFFFF',
                color: '#7C3AED',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⌨️ Test Phím
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
