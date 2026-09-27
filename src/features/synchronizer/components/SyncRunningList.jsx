import React from 'react';
import {
  Crown,
  Monitor,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Globe,
  Clock,
  Radio,
  Sliders,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function SyncRunningList({
  runningProfiles = [],
  masterProfileId,
  onSetMaster,
  onToggleSlaveSync,
  onStopProfile,
  onLaunchProfile,
  allProfiles = [],
  isSyncing,
  slaveSyncMap = {},
  isDemoMode,
  onToggleDemoMode
}) {
  if (runningProfiles.length === 0) {
    return (
      <div style={{
        padding: '36px 24px',
        borderRadius: '12px',
        backgroundColor: 'var(--apidog-card-bg)',
        border: '1px solid var(--apidog-border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94A3B8'
        }}>
          <Monitor size={28} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: 'var(--apidog-text-main)' }}>
            Hiện chưa có cửa sổ Chrome nào đang chạy trên máy tính
          </h3>
          <p style={{ fontSize: '12.5px', color: 'var(--apidog-text-secondary)', margin: 0, maxWidth: '440px' }}>
            Hệ thống đang sẵn sàng bắt tín hiệu. Vui lòng mở từ 2 cửa sổ Chrome trở lên để bắt đầu thiết lập profile chính và profile phụ điều khiển đồng bộ.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          {allProfiles.slice(0, 3).map(p => (
            <button
              key={p.id}
              onClick={() => onLaunchProfile?.(p.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #C4B5FD',
                backgroundColor: '#F5F3FF',
                color: '#7C3AED',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Play size={11} fill="#7C3AED" />
              <span>Chạy "{p.name}"</span>
            </button>
          ))}

          <button
            onClick={onToggleDemoMode}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} />
            <span>Nạp 4 Profile đang chạy (Xem demo giao diện)</span>
          </button>
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
      border: '1px solid var(--apidog-border)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
      overflow: 'hidden'
    }}>
      {/* Table Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Monitor size={16} style={{ color: '#2563EB' }} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1E293B' }}>
            DANH SÁCH CỬA SỔ CHROME ĐANG CHẠY ({runningProfiles.length} CỬA SỔ)
          </span>
          {isDemoMode && (
            <span style={{
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: '#FEF3C7',
              color: '#D97706'
            }}>
              CHẾ ĐỘ MẪU
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Chọn 1 cửa sổ làm <strong>Master 👑</strong>, các cửa sổ còn lại sẽ là <strong>Slaves 🎯</strong>
          </span>
        </div>
      </div>

      {/* Profile Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '12px',
          textAlign: 'left'
        }}>
          <thead>
            <tr style={{
              backgroundColor: '#F1F5F9',
              color: '#475569',
              fontWeight: 600,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              borderBottom: '1px solid #E2E8F0'
            }}>
              <th style={{ padding: '10px 16px', width: '60px', textAlign: 'center' }}>CHÍNH</th>
              <th style={{ padding: '10px 16px', width: '130px' }}>VAI TRÒ</th>
              <th style={{ padding: '10px 16px' }}>TÊN PROFILE CHROME</th>
              <th style={{ padding: '10px 16px', width: '130px' }}>TIẾN TRÌNH PID</th>
              <th style={{ padding: '10px 16px' }}>MẠNG PROXY</th>
              <th style={{ padding: '10px 16px', width: '110px' }}>ĐỘ TRỄ (JITTER)</th>
              <th style={{ padding: '10px 16px', width: '130px', textAlign: 'center' }}>NHẬN ĐỒNG BỘ</th>
              <th style={{ padding: '10px 16px', width: '110px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {runningProfiles.map((p, index) => {
              const isMaster = String(p.id) === String(masterProfileId);
              const isSlaveSyncActive = slaveSyncMap[p.id] ?? true;

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: isMaster ? 'rgba(124, 58, 237, 0.05)' : index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                    transition: 'background-color 0.15s ease'
                  }}
                >
                  {/* Radio Set as Master */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <input
                      type="radio"
                      name="master-profile-radio"
                      checked={isMaster}
                      onChange={() => onSetMaster?.(p)}
                      title="Chọn cửa sổ này làm Cửa sổ chính (Master)"
                      style={{ cursor: 'pointer', accentColor: '#7C3AED', width: '16px', height: '16px' }}
                    />
                  </td>

                  {/* Role Badge */}
                  <td style={{ padding: '12px 16px' }}>
                    {isMaster ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 9px',
                        borderRadius: '6px',
                        backgroundColor: '#7C3AED',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        <Crown size={12} fill="#FFFFFF" />
                        <span>CHÍNH (MASTER)</span>
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#E0E7FF',
                        color: '#3730A3',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        <span>🎯 PHỤ (SLAVE)</span>
                      </span>
                    )}
                  </td>

                  {/* Profile Name & OS */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px' }}>
                        {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: isMaster ? '#6D28D9' : '#0F172A', fontSize: '13px' }}>
                          {p.name}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          Thứ tự #{p.order || index + 1} • Nhóm: {p.group || 'Chung'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* PID / Port */}
                  <td style={{ padding: '12px 16px', color: '#475569', fontFamily: 'monospace', fontSize: '11.5px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #E2E8F0'
                    }}>
                      PID: {p.pid || (10240 + index * 4)}
                    </span>
                  </td>

                  {/* Proxy */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={13} style={{ color: p.proxy?.host ? '#059669' : '#94A3B8' }} />
                      <span style={{ color: p.proxy?.host ? '#065F46' : '#64748B', fontWeight: p.proxy?.host ? 600 : 400 }}>
                        {p.proxy?.host ? `${p.proxy.host}:${p.proxy.port || ''}` : 'Mạng Direct'}
                      </span>
                    </div>
                  </td>

                  {/* Latency Offset */}
                  <td style={{ padding: '12px 16px' }}>
                    {isMaster ? (
                      <span style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700 }}>
                        GỐC (0ms)
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        fontWeight: 600
                      }}>
                        +{p.baseLatency || (25 + index * 18)}ms
                      </span>
                    )}
                  </td>

                  {/* Sync Receive Checkbox */}
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {isMaster ? (
                      <span style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 600 }}>
                        Phát tín hiệu 📡
                      </span>
                    ) : (
                      <label style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: isSlaveSyncActive ? 'rgba(16, 185, 129, 0.1)' : '#F1F5F9',
                        color: isSlaveSyncActive ? '#059669' : '#64748B',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        <input
                          type="checkbox"
                          checked={isSlaveSyncActive}
                          onChange={() => onToggleSlaveSync?.(p.id)}
                          style={{ accentColor: '#10B981', cursor: 'pointer' }}
                        />
                        <span>{isSlaveSyncActive ? 'Đang nhận' : 'Tạm dừng'}</span>
                      </label>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      {!isMaster && (
                        <button
                          onClick={() => onSetMaster?.(p)}
                          title="Đặt cửa sổ Chrome này làm Cửa sổ chính"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #C4B5FD',
                            backgroundColor: '#F5F3FF',
                            color: '#7C3AED',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          👑 Đặt Master
                        </button>
                      )}

                      <button
                        onClick={() => onStopProfile?.(p.id)}
                        title="Đóng tiến trình Chrome này"
                        style={{
                          padding: '4px 7px',
                          borderRadius: '4px',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        <Square size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
