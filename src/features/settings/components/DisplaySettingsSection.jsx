import React from 'react';
import { Info } from 'lucide-react';

export default function DisplaySettingsSection({
  iconDisplayLabel,
  setIconDisplayLabel,
  recordsPerPage,
  setRecordsPerPage,
  typingSpeed,
  setTypingSpeed
}) {
  const getTypingSpeedLabel = (val) => {
    switch (val) {
      case 1: return 'Rất chậm (250ms/ký tự)';
      case 2: return 'Chậm (180ms/ký tự)';
      case 3: return 'Bình thường (120ms/ký tự)';
      case 4: return 'Nhanh (70ms/ký tự)';
      case 5: return 'Siêu tốc (30ms/ký tự)';
      default: return 'Bình thường';
    }
  };

  return (
    <div id="setting-section-display" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Hiển thị trên Icon */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
          Hiển thị trên Icon
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={iconDisplayLabel}
            onChange={(e) => setIconDisplayLabel(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              fontSize: '13px',
              color: '#1F2937',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ID Profile">ID Profile</option>
            <option value="Tên Profile">Tên Profile</option>
            <option value="Tên + ID Profile">Tên + ID Profile</option>
            <option value="Nhóm Profile">Nhóm Profile</option>
            <option value="Không hiển thị">Không hiển thị</option>
          </select>
        </div>
        <span style={{ display: 'block', fontSize: '11.5px', color: '#6B7280', marginTop: '5px' }}>
          Nhãn hiện dưới biểu tượng trên thanh tác vụ của hồ sơ đang mở.
        </span>
      </div>

      {/* 2. Số bản ghi mỗi trang */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1E293B', marginBottom: '6px' }}>
          Số bản ghi mỗi trang
        </label>
        <input
          type="text"
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            fontSize: '13px',
            color: '#1F2937',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <span style={{ display: 'block', fontSize: '11.5px', color: '#6B7280', marginTop: '5px' }}>
          Tối đa 10 số, ngăn cách nhau bằng dấu ','. Tối thiểu: 1. Tối đa: 200
        </span>
      </div>

      {/* 3. Tốc độ gõ */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
            Tốc độ gõ
          </label>
          <div title="Điều chỉnh tốc độ gõ phím mô phỏng người thật" style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}>
            <Info size={14} style={{ color: '#9CA3AF' }} />
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF'
        }}>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={typingSpeed}
            onChange={(e) => setTypingSpeed(Number(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
              accentColor: '#2563EB',
              height: '6px'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginTop: '6px' }}>
            <span style={{ fontWeight: 500 }}>Chậm</span>
            <span style={{ color: '#2563EB', fontWeight: 600, fontSize: '12px' }}>
              {getTypingSpeedLabel(typingSpeed)}
            </span>
            <span style={{ fontWeight: 500 }}>Nhanh</span>
          </div>
        </div>
      </div>
    </div>
  );
}
