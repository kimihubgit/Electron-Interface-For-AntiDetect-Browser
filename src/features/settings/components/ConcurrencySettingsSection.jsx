import React from 'react';
import { Zap, Clock, ShieldAlert, Cpu, Layers } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

export default function ConcurrencySettingsSection({
  maxConcurrentProfiles,
  setMaxConcurrentProfiles,
  launchDelaySeconds,
  setLaunchDelaySeconds,
  autoCloseIdle,
  setAutoCloseIdle,
  idleTimeoutMinutes,
  setIdleTimeoutMinutes,
  ramWarningThreshold,
  setRamWarningThreshold
}) {
  const presets = [
    { label: 'Không giới hạn', value: 0 },
    { label: '3 Profile', value: 3 },
    { label: '5 Profile (Khuyên dùng)', value: 5 },
    { label: '10 Profile', value: 10 },
    { label: '20 Profile', value: 20 },
  ];

  return (
    <div id="setting-section-concurrency" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 700,
        color: '#4B5563',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Zap size={15} style={{ color: '#2563EB' }} />
        <span>CHẠY ĐỒNG THỜI & HIỆU NĂNG TIẾN TRÌNH</span>
      </div>

      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}>
        {/* 1. Giới hạn Profile chạy đồng thời */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} style={{ color: '#2563EB' }} />
                <span>Giới hạn Profile chạy đồng thời</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                Số lượng cửa sổ hồ sơ trình duyệt được phép hoạt động cùng một thời điểm.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                min="0"
                max="100"
                value={maxConcurrentProfiles}
                onChange={(e) => setMaxConcurrentProfiles(Math.max(0, parseInt(e.target.value, 10) || 0))}
                style={{
                  width: '80px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px',
                  fontWeight: 600,
                  textAlign: 'center',
                  color: '#1E293B',
                  outline: 'none'
                }}
              />
              <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>
                {maxConcurrentProfiles === 0 ? '(Vô hạn)' : 'Hồ sơ'}
              </span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {presets.map((p) => {
              const isActive = maxConcurrentProfiles === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setMaxConcurrentProfiles(p.value)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '5px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    border: isActive ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC',
                    color: isActive ? '#2563EB' : '#475569',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Khoảng cách thời gian mở giữa các Profile */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} style={{ color: '#2563EB' }} />
                <span>Khoảng cách thời gian mở Profile liên tiếp</span>
              </div>
              <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                Tạo độ trễ ngẫu nhiên khi mở hàng loạt hồ sơ, tránh làm nghẽn CPU và tránh bị nhận diện đồng loạt.
              </div>
            </div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#2563EB',
              backgroundColor: '#EFF6FF',
              padding: '3px 10px',
              borderRadius: '6px',
              border: '1px solid #DBEAFE'
            }}>
              {launchDelaySeconds}s
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={launchDelaySeconds}
              onChange={(e) => setLaunchDelaySeconds(parseFloat(e.target.value))}
              style={{
                flex: 1,
                cursor: 'pointer',
                accentColor: '#2563EB',
                height: '6px'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8' }}>
            <span>0.5 giây (Nhanh)</span>
            <span>2 - 3 giây (Tiêu chuẩn khuyên dùng)</span>
            <span>10 giây (An toàn tối đa)</span>
          </div>
        </div>

        {/* 3. Tự động đóng Profile treo/không hoạt động */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              Tự động đóng Profile treo / không hoạt động
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Giải phóng RAM bằng cách tắt profile nếu không có thao tác chuột hoặc bàn phím.
            </div>
            {autoCloseIdle && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>Thời gian chờ tắt:</span>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={idleTimeoutMinutes}
                  onChange={(e) => setIdleTimeoutMinutes(parseInt(e.target.value, 10) || 15)}
                  style={{
                    width: '60px',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '12px', color: '#64748B' }}>phút</span>
              </div>
            )}
          </div>
          <ToggleSwitch checked={autoCloseIdle} onChange={setAutoCloseIdle} />
        </div>

        {/* 4. Cảnh báo ngưỡng tiêu thụ RAM hệ thống */}
        <div style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={15} style={{ color: '#F59E0B' }} />
              <span>Ngưỡng cảnh báo tải bộ nhớ RAM</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
              Thông báo trên khay hệ thống khi tổng RAM máy tính chạm ngưỡng để phòng tránh giật lag.
            </div>
          </div>

          <select
            value={ramWarningThreshold}
            onChange={(e) => setRamWarningThreshold(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              backgroundColor: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#1E293B',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value={70}>70% RAM</option>
            <option value={80}>80% RAM</option>
            <option value={85}>85% RAM (Khuyên dùng)</option>
            <option value={90}>90% RAM</option>
            <option value={95}>95% RAM</option>
          </select>
        </div>
      </div>
    </div>
  );
}
