import React from 'react';
import {
  X,
  Sliders,
  MousePointer,
  Keyboard,
  Monitor,
  Clock,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function SyncSettingsDrawer({
  isOpen,
  onClose,
  settings,
  setSettings
}) {
  if (!isOpen) return null;

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} style={{ color: '#7C3AED' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Cấu Hình Đồng Bộ Thao Tác Chuyên Sâu
              </h3>
              <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Tùy chỉnh hành vi nhân bản chuột, bàn phím và cơ chế chống bot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Section 1: Chuột */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED' }}>
              <MousePointer size={14} />
              <span style={{ fontSize: '12.5px', fontWeight: 700 }}>1. Hành vi chuột (Mouse Behavior)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Đồng bộ tọa độ tỉ lệ % (Hữu ích khi các cửa sổ khác kích thước)</span>
                <input
                  type="checkbox"
                  checked={settings.mouse?.relativeCoords ?? true}
                  onChange={(e) => updateSetting('mouse', 'relativeCoords', e.target.checked)}
                  style={{ accentColor: '#7C3AED' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Quỹ đạo di chuyển chuột tự nhiên kiểu Bezier (tránh giật lag đường thẳng)</span>
                <input
                  type="checkbox"
                  checked={settings.mouse?.naturalCurve ?? true}
                  onChange={(e) => updateSetting('mouse', 'naturalCurve', e.target.checked)}
                  style={{ accentColor: '#7C3AED' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Đồng bộ gia tốc cuộn trang (Smooth Inertia Scroll)</span>
                <input
                  type="checkbox"
                  checked={settings.mouse?.smoothScroll ?? true}
                  onChange={(e) => updateSetting('mouse', 'smoothScroll', e.target.checked)}
                  style={{ accentColor: '#7C3AED' }}
                />
              </label>
            </div>
          </div>

          {/* Section 2: Bàn phím */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB' }}>
              <Keyboard size={14} />
              <span style={{ fontSize: '12.5px', fontWeight: 700 }}>2. Hành vi bàn phím (Keyboard & Text)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Kích hoạt cú pháp SpinText tự động <code>{'{A|B|C}'}</code></span>
                <input
                  type="checkbox"
                  checked={settings.keyboard?.enableSpinText ?? true}
                  onChange={(e) => updateSetting('keyboard', 'enableSpinText', e.target.checked)}
                  style={{ accentColor: '#2563EB' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Giả lập tốc độ gõ phím người thật (Human typing jitter)</span>
                <input
                  type="checkbox"
                  checked={settings.keyboard?.humanTypingSpeed ?? true}
                  onChange={(e) => updateSetting('keyboard', 'humanTypingSpeed', e.target.checked)}
                  style={{ accentColor: '#2563EB' }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Đồng bộ tổ hợp phím tắt (Ctrl+A, Ctrl+C, Ctrl+V, Enter, Tab)</span>
                <input
                  type="checkbox"
                  checked={settings.keyboard?.syncShortcuts ?? true}
                  onChange={(e) => updateSetting('keyboard', 'syncShortcuts', e.target.checked)}
                  style={{ accentColor: '#2563EB' }}
                />
              </label>
            </div>
          </div>

          {/* Section 3: Chống phát hiện tự động (Anti-Detection Jitter) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <ShieldCheck size={14} />
              <span style={{ fontSize: '12.5px', fontWeight: 700 }}>3. Cơ chế né Bot & Thuật toán chống trùng lặp</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
                <span>Xáo trộn thứ tự thực thi ngẫu nhiên giữa các cửa sổ con</span>
                <input
                  type="checkbox"
                  checked={settings.antiDetect?.shuffleFollowersOrder ?? true}
                  onChange={(e) => updateSetting('antiDetect', 'shuffleFollowersOrder', e.target.checked)}
                  style={{ accentColor: '#059669' }}
                />
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#475569' }}>
                  <span>Khoảng lệch tọa độ ngẫu nhiên (Offset Pixel Jitter):</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>±{settings.antiDetect?.jitterPixels ?? 4}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={settings.antiDetect?.jitterPixels ?? 4}
                  onChange={(e) => updateSetting('antiDetect', 'jitterPixels', Number(e.target.value))}
                  style={{ accentColor: '#059669' }}
                />
                <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                  Click chuột vào cùng 1 nút sẽ lệch vài pixel ngẫu nhiên, không để lại dấu vân tay tọa độ tuyệt đối.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lưu và áp dụng
          </button>
        </div>
      </div>
    </div>
  );
}
