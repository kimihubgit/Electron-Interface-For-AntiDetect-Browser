import React from 'react';
import { Activity, RefreshCw, Cpu } from 'lucide-react';

export default function HomeSystemHardwareMonitor({
  systemStats,
  isRefreshingStats,
  fetchSystemStats,
  lastStatsUpdated
}) {
  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        marginBottom: '32px'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={16} color="#4F46E5" />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
            Tài Nguyên Hệ Thống (Hardware Monitor)
          </span>
          <span
            style={{
              fontSize: '11px',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}
          >
            Cập nhật định kỳ 30s
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Lần cập nhật: {lastStatsUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={fetchSystemStats}
            disabled={isRefreshingStats}
            title="Làm mới thông số tài nguyên"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 9px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#3B82F6',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={12} className={isRefreshingStats ? 'animate-spin' : ''} />
            <span>{isRefreshingStats ? 'Đang đọc...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* 2 Column Cards for CPU and RAM */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px'
        }}
      >
        {/* CPU Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Cpu size={17} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                    CPU Usage
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: systemStats.cpuPercent > 80 ? '#FEF2F2' : '#ECFDF5',
                      color: systemStats.cpuPercent > 80 ? '#DC2626' : '#059669'
                    }}
                  >
                    {systemStats.cpuPercent > 80 ? 'Tải cao' : 'Ổn định'}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                  {systemStats.cpuCores} Cores • {systemStats.cpuModel}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: systemStats.cpuPercent > 80 ? '#EF4444' : systemStats.cpuPercent > 50 ? '#F59E0B' : '#10B981'
                }}
              >
                {systemStats.cpuPercent}%
              </span>
            </div>
          </div>

          {/* CPU Bar */}
          <div
            style={{
              height: '6px',
              width: '100%',
              backgroundColor: '#F1F5F9',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${systemStats.cpuPercent}%`,
                backgroundColor: systemStats.cpuPercent > 80 ? '#EF4444' : systemStats.cpuPercent > 50 ? '#F59E0B' : '#10B981',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* RAM Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                  color: '#6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Activity size={17} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                    Bộ Nhớ RAM
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: systemStats.memPercent > 85 ? '#FEF2F2' : '#EEF2FF',
                      color: systemStats.memPercent > 85 ? '#DC2626' : '#4F46E5'
                    }}
                  >
                    {systemStats.usedMemGB} GB / {systemStats.totalMemGB} GB
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                  Khả dụng: {systemStats.freeMemGB} GB trống • Nền tảng: {systemStats.platform}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: systemStats.memPercent > 85 ? '#EF4444' : systemStats.memPercent > 70 ? '#F59E0B' : '#6366F1'
                }}
              >
                {systemStats.memPercent}%
              </span>
            </div>
          </div>

          {/* RAM Bar */}
          <div
            style={{
              height: '6px',
              width: '100%',
              backgroundColor: '#F1F5F9',
              borderRadius: '3px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${systemStats.memPercent}%`,
                backgroundColor: systemStats.memPercent > 85 ? '#EF4444' : systemStats.memPercent > 70 ? '#F59E0B' : '#6366F1',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
