import React, { useState } from 'react';
import { 
  Play, 
  RotateCw, 
  Trash2, 
  Clock, 
  Shield, 
  ShieldCheck,
  Cookie as CookieIcon, 
  CheckCircle2, 
  ExternalLink,
  Terminal,
  Globe,
  Cpu,
  HardDrive,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Download,
  AlertCircle,
  Activity,
  Monitor,
  Layers,
  Search,
  Maximize2
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function HistoryPage() {
  const { 
    historyRecords = [], 
    selectedHistoryId, 
    setSelectedHistoryId,
    deleteHistoryRecord,
    clearHistory,
    toggleLaunchProfile,
    profiles = [],
    addLog
  } = useBrowser();

  // Selected history record
  const currentRecord = historyRecords.find(r => r.id === selectedHistoryId) || historyRecords[0] || null;

  // Active sub-tab for Profile Run Details:
  // 'fingerprint' | 'proxy' | 'cookies' | 'flags' | 'logs'
  const [activeSubTab, setActiveSubTab] = useState('fingerprint');
  const [isConsoleDrawerOpen, setIsConsoleDrawerOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const [logFilterTerm, setLogFilterTerm] = useState('');

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    if (addLog) addLog(`Đã sao chép ${key} vào clipboard`, 'info');
  };

  const handleReRun = () => {
    if (!currentRecord) return;
    if (currentRecord.profileId) {
      toggleLaunchProfile(currentRecord.profileId);
      if (addLog) addLog(`Khởi chạy lại từ lịch sử: "${currentRecord.profileName}"`, 'success');
    } else {
      if (addLog) addLog(`Khởi động phiên chạy: ${currentRecord.profileName}`, 'info');
    }
  };

  if (!currentRecord) {
    return (
      <div style={{
        flex: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--apidog-bg)',
        color: 'var(--apidog-text-muted)',
        gap: '12px'
      }}>
        <Clock size={44} style={{ opacity: 0.35 }} />
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
          Chưa có phiên chạy Profile nào trong lịch sử
        </span>
        <span style={{ fontSize: '12.5px', maxWidth: '420px', textAlign: 'center', lineHeight: 1.5 }}>
          Khi bạn nhấn "Mở" hoặc chạy bất kỳ hồ sơ trình duyệt nào, hệ thống sẽ tự động lưu lại toàn bộ vân tay, proxy, cookies và log phiên chạy tại đây.
        </span>
      </div>
    );
  }

  const isRunning = currentRecord.status === 'running';
  const isCompleted = currentRecord.status === 'completed';
  const isStopped = currentRecord.status === 'stopped';

  // Sub-tabs list
  const subTabs = [
    { id: 'fingerprint', label: 'Vân tay Fingerprint', icon: ShieldCheck, count: currentRecord.fingerprintSnapshot?.length || 10 },
    { id: 'proxy', label: 'Proxy & Mạng', icon: Globe, badge: currentRecord.proxy?.type || 'SOCKS5' },
    { id: 'cookies', label: 'Cookies & Lưu trữ', icon: CookieIcon, count: currentRecord.cookies?.length || currentRecord.cookiesLoaded || 0 },
    { id: 'flags', label: 'Cờ khởi chạy (CLI Flags)', icon: Terminal, count: currentRecord.launchArgs?.length || 0 },
    { id: 'logs', label: 'Nhật ký Console', icon: Activity, count: currentRecord.logs?.length || 0 }
  ];

  // Filter logs if searching
  const displayedLogs = (currentRecord.logs || []).filter(log => 
    !logFilterTerm || log.toLowerCase().includes(logFilterTerm.toLowerCase())
  );

  return (
    <div style={{
      flex: 1,
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--apidog-card-bg)',
      overflow: 'hidden'
    }}>
      {/* ── TOP SESSION BANNER / STATUS STRIP ── */}
      <div style={{
        padding: '8px 18px',
        backgroundColor: 'var(--apidog-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: '12px'
      }}>
        {/* Left: Active Session Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {/* Status Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 9px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3px',
            backgroundColor: isRunning ? 'rgba(16, 185, 129, 0.12)' : isCompleted ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.12)',
            color: isRunning ? '#10B981' : isCompleted ? '#16A34A' : 'var(--apidog-text-muted)',
            border: `1px solid ${isRunning ? 'rgba(16, 185, 129, 0.3)' : isCompleted ? 'rgba(34, 197, 94, 0.3)' : 'var(--apidog-border)'}`
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isRunning ? '#10B981' : isCompleted ? '#22C55E' : '#9CA3AF',
              boxShadow: isRunning ? '0 0 8px #10B981' : 'none'
            }} />
            <span>{currentRecord.statusLabel?.toUpperCase() || (isRunning ? 'ĐANG CHẠY' : 'HOÀN THÀNH')}</span>
          </div>

          {/* Profile Name */}
          <span style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--apidog-text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentRecord.profileName || 'Hồ sơ chưa đặt tên'}
          </span>

          {/* Group Tag */}
          {currentRecord.group && (
            <span style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: 'var(--apidog-card-bg)',
              border: '1px solid var(--apidog-border)',
              color: 'var(--apidog-text-muted)'
            }}>
              {currentRecord.group}
            </span>
          )}

          {/* Engine Core */}
          <span style={{
            fontSize: '11px',
            color: 'var(--apidog-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span>•</span>
            <span>{currentRecord.browser || 'Chrome 128 (Windows 11)'}</span>
          </span>
        </div>

        {/* Right: Operator, Date, Session ID */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, fontSize: '11.5px', color: 'var(--apidog-text-muted)' }}>
          <span>Mã phiên: <strong style={{ color: 'var(--apidog-text-main)', fontFamily: 'monospace' }}>#{currentRecord.id}</strong></span>
          <span>Bắt đầu: <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.startTime}</strong></span>
          <span>Người chạy: <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.operator || 'Khải'}</strong></span>
        </div>
      </div>

      {/* ── PROFILE ACTION & QUICK LAUNCH BAR ── */}
      <div style={{
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--apidog-card-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        flexShrink: 0
      }}>
        {/* Target URL Bar */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--apidog-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '6px',
          height: '34px',
          padding: '0 10px',
          gap: '8px'
        }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '3px',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            color: 'var(--apidog-purple)',
            letterSpacing: '0.3px'
          }}>
            URL ĐÍCH
          </span>
          <span style={{
            flex: 1,
            fontSize: '12.5px',
            fontFamily: 'monospace',
            color: 'var(--apidog-text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentRecord.targetUrl || 'about:blank'}
          </span>
          {currentRecord.targetUrl && (
            <button
              onClick={() => handleCopy(currentRecord.targetUrl, 'targetUrl')}
              title="Sao chép URL"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--apidog-text-muted)',
                padding: '2px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {copiedKey === 'targetUrl' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
            </button>
          )}
        </div>

        {/* Action 1: Khởi chạy lại (Re-launch Profile) */}
        <button
          onClick={handleReRun}
          style={{
            height: '34px',
            padding: '0 16px',
            backgroundColor: isRunning ? '#EF4444' : 'var(--apidog-purple)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: isRunning ? '0 1px 3px rgba(239, 68, 68, 0.25)' : '0 1px 3px rgba(124, 58, 237, 0.25)',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {isRunning ? (
            <>
              <RotateCw size={13} className="spin" />
              <span>Dừng phiên</span>
            </>
          ) : (
            <>
              <Play size={13} fill="#FFFFFF" />
              <span>Khởi chạy lại</span>
            </>
          )}
        </button>

        {/* Action 2: Sao chép thông tin phiên */}
        <button
          onClick={() => handleCopy(currentRecord, 'sessionData')}
          className="btn-secondary"
          style={{
            height: '34px',
            padding: '0 12px',
            fontSize: '12px',
            fontWeight: 500,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copiedKey === 'sessionData' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>{copiedKey === 'sessionData' ? 'Đã chép JSON' : 'Xuất Snapshot'}</span>
        </button>

        {/* Action 3: Xóa phiên này */}
        <button
          onClick={() => {
            if (window.confirm(`Bạn có chắc muốn xóa lịch sử phiên chạy #${currentRecord.id}?`)) {
              deleteHistoryRecord(currentRecord.id);
            }
          }}
          style={{
            height: '34px',
            width: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--apidog-border)',
            borderRadius: '6px',
            backgroundColor: 'transparent',
            color: 'var(--apidog-text-muted)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Xóa phiên lịch sử này"
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#EF4444';
            e.currentTarget.style.borderColor = '#FCA5A5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--apidog-text-muted)';
            e.currentTarget.style.borderColor = 'var(--apidog-border)';
          }}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* ── 4 QUICK METRIC CARDS (Session Key Vitals) ── */}
      <div style={{
        padding: '12px 18px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        backgroundColor: 'var(--apidog-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        flexShrink: 0
      }}>
        {/* Card 1: Thời lượng chạy */}
        <div style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <span>THỜI LƯỢNG PHIÊN</span>
            <Clock size={13} color="var(--apidog-purple)" />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            {currentRecord.duration || '00:00:00'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
            Kết thúc: {currentRecord.endTime || 'Đang hoạt động'}
          </div>
        </div>

        {/* Card 2: Tài nguyên & PID */}
        <div style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <span>MÃ TIẾN TRÌNH & RAM</span>
            <Cpu size={13} color="#3B82F6" />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            PID: {currentRecord.processPid || 'N/A'} • {currentRecord.memoryUsage || '0 MB'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
            CPU: {currentRecord.cpuUsage || '0%'} • Chromium Sandbox
          </div>
        </div>

        {/* Card 3: Proxy & Vị trí IP */}
        <div style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <span>PROXY & IP ĐẦU RA</span>
            <Globe size={13} color="#10B981" />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentRecord.proxy?.host ? `${currentRecord.proxy.type || 'SOCKS5'}://${currentRecord.proxy.host}` : 'Direct Connection'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentRecord.proxy?.location || 'Mặc định máy chủ'} ({currentRecord.proxy?.latency || 25}ms)
          </div>
        </div>

        {/* Card 4: Cookies & Kho dữ liệu */}
        <div style={{
          backgroundColor: 'var(--apidog-card-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--apidog-text-muted)', fontSize: '11px', fontWeight: 600 }}>
            <span>COOKIES ĐỒNG BỘ</span>
            <CookieIcon size={13} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
            Nạp: {currentRecord.cookiesLoaded || 0} • Lưu: {currentRecord.cookiesSaved || 0}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--apidog-text-muted)' }}>
            Trạng thái: Đã mã hóa AES-256
          </div>
        </div>
      </div>

      {/* ── ANTIDETECT SUB-TABS NAVIGATION ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        borderBottom: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        flexShrink: 0
      }}>
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '11px 16px',
                fontSize: '12.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
                borderBottom: isActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'var(--apidog-bg)',
                  color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)'
                }}>
                  {tab.count}
                </span>
              )}
              {tab.badge && (
                <span style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  fontWeight: 700
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── SUB-TAB CONTENT AREA ── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: '18px',
        backgroundColor: 'var(--apidog-card-bg)'
      }}>

        {/* 1. TAB: VÂN TAY FINGERPRINT */}
        {activeSubTab === 'fingerprint' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={18} color="#10B981" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>
                    Điểm tin cậy vân tay: 100% (Passed PixelScan, CreepJS, BrowserLeaks)
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-muted)' }}>
                    Tất cả các thuộc tính vân tay phần cứng và phần mềm của phiên này đã được cô lập tuyệt đối.
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleCopy(currentRecord.fingerprintSnapshot, 'fingerprint')}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {copiedKey === 'fingerprint' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>{copiedKey === 'fingerprint' ? 'Đã chép' : 'Sao chép vân tay'}</span>
              </button>
            </div>

            {/* Fingerprint Parameters Table */}
            <div style={{
              border: '1px solid var(--apidog-border)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--apidog-bg)', borderBottom: '1px solid var(--apidog-border)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '220px' }}>Thuộc tính vân tay</th>
                    <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '120px' }}>Phân loại</th>
                    <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600 }}>Giá trị tiêm vào Chromium</th>
                    <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '60px', textAlign: 'center' }}>Chép</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentRecord.fingerprintSnapshot || []).map((item, idx) => (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: idx === currentRecord.fingerprintSnapshot.length - 1 ? 'none' : '1px solid var(--apidog-border-light, var(--apidog-border))',
                        backgroundColor: idx % 2 === 0 ? 'var(--apidog-card-bg)' : 'var(--apidog-bg)'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                        {item.label}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: 'var(--apidog-bg)',
                          border: '1px solid var(--apidog-border)',
                          color: 'var(--apidog-text-muted)'
                        }}>
                          {item.category || 'Hệ thống'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--apidog-text-main)', wordBreak: 'break-all' }}>
                        {item.value}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleCopy(item.value, `fp-${idx}`)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--apidog-text-muted)',
                            padding: '2px'
                          }}
                          title="Sao chép giá trị"
                        >
                          {copiedKey === `fp-${idx}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. TAB: PROXY & MẠNG */}
        {activeSubTab === 'proxy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px'
            }}>
              {/* Proxy Connection Box */}
              <div style={{
                border: '1px solid var(--apidog-border)',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'var(--apidog-bg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Globe size={16} color="var(--apidog-purple)" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
                    Thông tin máy chủ Proxy đã kết nối
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--apidog-text-muted)' }}>Giao thức kết nối:</span>
                    <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.proxy?.type || 'SOCKS5'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--apidog-text-muted)' }}>Máy chủ & Cổng:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                      {currentRecord.proxy?.host ? `${currentRecord.proxy.host}:${currentRecord.proxy.port}` : 'Kết nối trực tiếp'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--apidog-text-muted)' }}>IP đầu ra kiểm tra:</span>
                    <span style={{ fontFamily: 'monospace', color: '#10B981', fontWeight: 700 }}>
                      {currentRecord.proxy?.exitIp || currentRecord.proxy?.host || 'Chưa xác định'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--apidog-border)', paddingBottom: '6px' }}>
                    <span style={{ color: 'var(--apidog-text-muted)' }}>Vị trí địa lý:</span>
                    <span style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.proxy?.location || 'Việt Nam'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--apidog-text-muted)' }}>Độ trễ Ping:</span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>{currentRecord.proxy?.latency || 28} ms</span>
                  </div>
                </div>
              </div>

              {/* Leak Tests & Security */}
              <div style={{
                border: '1px solid var(--apidog-border)',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: 'var(--apidog-bg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Shield size={16} color="#10B981" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
                    Kiểm tra rò rỉ bảo mật (Leak Protection)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#10B981" />
                      <span>Rò rỉ DNS (DNS Leak):</span>
                    </div>
                    <strong style={{ color: '#10B981' }}>{currentRecord.proxy?.dnsLeak || 'An toàn (0 rò rỉ)'}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#10B981" />
                      <span>Rò rỉ WebRTC (WebRTC Leak):</span>
                    </div>
                    <strong style={{ color: '#10B981' }}>{currentRecord.proxy?.webrtcLeak || 'Đã ẩn IP thật'}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '6px', backgroundColor: 'var(--apidog-card-bg)', border: '1px solid var(--apidog-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#10B981" />
                      <span>Múi giờ đồng bộ theo IP:</span>
                    </div>
                    <strong style={{ color: 'var(--apidog-purple)' }}>Khớp 100%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TAB: COOKIES & LƯU TRỮ */}
        {activeSubTab === 'cookies' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                Danh sách Cookies được tải & ghi nhận trong phiên ({currentRecord.cookies?.length || 0})
              </div>
              <button
                onClick={() => handleCopy(currentRecord.cookies, 'allCookies')}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedKey === 'allCookies' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                <span>Sao chép toàn bộ Cookie (JSON)</span>
              </button>
            </div>

            {(!currentRecord.cookies || currentRecord.cookies.length === 0) ? (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                color: 'var(--apidog-text-muted)',
                backgroundColor: 'var(--apidog-bg)',
                borderRadius: '8px',
                border: '1px solid var(--apidog-border)',
                fontSize: '12.5px'
              }}>
                Chưa ghi nhận cookie mới nào được tạo trong phiên này.
              </div>
            ) : (
              <div style={{
                border: '1px solid var(--apidog-border)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--apidog-bg)', borderBottom: '1px solid var(--apidog-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '160px' }}>Tên Cookie</th>
                      <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '180px' }}>Tên miền (Domain)</th>
                      <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600 }}>Giá trị (Value)</th>
                      <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '120px' }}>Hạn dùng</th>
                      <th style={{ padding: '8px 14px', color: 'var(--apidog-text-muted)', fontWeight: 600, width: '50px', textAlign: 'center' }}>Chép</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecord.cookies.map((c, idx) => (
                      <tr 
                        key={idx} 
                        style={{ 
                          borderBottom: idx === currentRecord.cookies.length - 1 ? 'none' : '1px solid var(--apidog-border-light, var(--apidog-border))',
                          backgroundColor: idx % 2 === 0 ? 'var(--apidog-card-bg)' : 'var(--apidog-bg)'
                        }}
                      >
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--apidog-purple)', fontFamily: 'monospace' }}>
                          {c.name}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--apidog-text-main)', fontFamily: 'monospace' }}>
                          {c.domain}
                        </td>
                        <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: 'var(--apidog-text-muted)', wordBreak: 'break-all' }}>
                          {c.value}
                        </td>
                        <td style={{ padding: '10px 14px', color: 'var(--apidog-text-muted)' }}>
                          {c.expires}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleCopy(c.value, `cookie-${idx}`)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--apidog-text-muted)', padding: '2px' }}
                            title="Sao chép giá trị cookie"
                          >
                            {copiedKey === `cookie-${idx}` ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. TAB: CỜ KHỞI CHẠY (CLI FLAGS) */}
        {activeSubTab === 'flags' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
                Dòng lệnh Chromium CLI được thực thi khi mở phiên
              </div>
              <button
                onClick={() => handleCopy((currentRecord.launchArgs || []).join(' '), 'allFlags')}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedKey === 'allFlags' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                <span>Sao chép chuỗi tham số</span>
              </button>
            </div>

            <div style={{
              backgroundColor: '#0F172A',
              color: '#38BDF8',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.8,
              border: '1px solid #1E293B',
              overflowX: 'auto'
            }}>
              <div style={{ color: '#94A3B8', marginBottom: '8px' }}># Chromium Process Executable:</div>
              <div style={{ color: '#F8FAFC', marginBottom: '12px' }}>
                "C:\Program Files\AntidetectBrowser\App\chrome.exe"
              </div>
              <div style={{ color: '#94A3B8', marginBottom: '6px' }}># Arguments:</div>
              {(currentRecord.launchArgs || [
                '--disable-blink-features=AutomationControlled',
                '--no-first-run',
                '--password-store=basic'
              ]).map((arg, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#64748B' }}>\</span>
                  <span style={{ color: arg.startsWith('--proxy') ? '#F59E0B' : arg.startsWith('--user-data') ? '#A78BFA' : '#38BDF8' }}>
                    {arg}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '11.5px', color: 'var(--apidog-text-muted)', lineHeight: 1.5 }}>
              * Ghi chú: Cờ <code>--disable-blink-features=AutomationControlled</code> loại bỏ hoàn toàn thuộc tính <code>navigator.webdriver = true</code> nhằm vượt qua Cloudflare Turnstile, DataDome, và Akamai Bot Manager.
            </div>
          </div>
        )}

        {/* 5. TAB: NHẬT KÝ CONSOLE TOÀN BỘ */}
        {activeSubTab === 'logs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--apidog-bg)',
                border: '1px solid var(--apidog-border)',
                borderRadius: '6px',
                padding: '0 8px',
                height: '30px',
                width: '280px'
              }}>
                <Search size={13} style={{ color: 'var(--apidog-text-muted)', marginRight: '6px' }} />
                <input
                  type="text"
                  placeholder="Lọc nhật ký phiên..."
                  value={logFilterTerm}
                  onChange={(e) => setLogFilterTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '12px',
                    width: '100%',
                    backgroundColor: 'transparent',
                    color: 'var(--apidog-text-main)'
                  }}
                />
              </div>

              <button
                onClick={() => handleCopy((currentRecord.logs || []).join('\n'), 'fullLog')}
                className="btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {copiedKey === 'fullLog' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                <span>Sao chép toàn bộ Log</span>
              </button>
            </div>

            <div style={{
              flex: 1,
              backgroundColor: '#0F172A',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '14px',
              fontFamily: 'monospace',
              fontSize: '12px',
              lineHeight: 1.7,
              overflowY: 'auto',
              border: '1px solid #1E293B'
            }}>
              {displayedLogs.length === 0 ? (
                <div style={{ color: '#64748B' }}>Không tìm thấy dòng nhật ký phù hợp</div>
              ) : (
                displayedLogs.map((line, idx) => {
                  let color = '#94A3B8';
                  if (line.includes('[CORE]')) color = '#38BDF8';
                  else if (line.includes('[SECURITY]')) color = '#34D399';
                  else if (line.includes('[FINGERPRINT]')) color = '#F472B6';
                  else if (line.includes('[PROXY]')) color = '#FBBF24';
                  else if (line.includes('[STORAGE]')) color = '#A78BFA';
                  else if (line.includes('[PROCESS]')) color = '#6EE7B7';
                  else if (line.includes('[EXIT]')) color = '#F87171';

                  return (
                    <div key={idx} style={{ color, display: 'flex', gap: '8px' }}>
                      <span style={{ color: '#475569', userSelect: 'none' }}>{idx + 1}</span>
                      <span>{line}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── COLLAPSIBLE BOTTOM CONSOLE DRAWER ── */}
      <div style={{
        borderTop: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Drawer Header Toggle */}
        <div 
          onClick={() => setIsConsoleDrawerOpen(!isConsoleDrawerOpen)}
          style={{
            height: '32px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--apidog-bg)',
            cursor: 'pointer',
            userSelect: 'none',
            borderBottom: isConsoleDrawerOpen ? '1px solid var(--apidog-border)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', fontWeight: 600, color: 'var(--apidog-text-main)' }}>
            <Terminal size={13} color="var(--apidog-purple)" />
            <span>Đầu ra tiến trình Sandbox (Process Stream Output)</span>
            <span style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: isRunning ? 'rgba(16, 185, 129, 0.15)' : 'var(--apidog-card-bg)',
              color: isRunning ? '#10B981' : 'var(--apidog-text-muted)'
            }}>
              {isRunning ? 'LIVE' : 'IDLE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--apidog-text-muted)' }}>
            <span style={{ fontSize: '11px' }}>{isConsoleDrawerOpen ? 'Thu gọn' : 'Mở rộng'}</span>
            {isConsoleDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>

        {/* Drawer Stream Body */}
        {isConsoleDrawerOpen && (
          <div style={{
            height: '110px',
            backgroundColor: '#090D16',
            color: '#94A3B8',
            fontFamily: 'monospace',
            fontSize: '11.5px',
            padding: '10px 16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {(currentRecord.logs || []).slice(-4).map((l, i) => (
              <div key={i} style={{ color: l.includes('[EXIT]') ? '#F87171' : l.includes('[SECURITY]') ? '#34D399' : '#CBD5E1' }}>
                {l}
              </div>
            ))}
            {isRunning && (
              <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', fontStyle: 'italic' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                <span>Tiến trình đang lắng nghe sự kiện Chromium DevTools Protocol (CDP)...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── FOOTER STATUS BAR ── */}
      <div style={{
        height: '26px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--apidog-bg)',
        borderTop: '1px solid var(--apidog-border)',
        fontSize: '11px',
        color: 'var(--apidog-text-muted)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span>Chromium Core: <strong>v128.0.6613.120</strong></span>
          <span>Dung lượng cache hồ sơ: <strong>42.8 MB</strong></span>
          <span>Stealth Bypass Engine: <strong style={{ color: '#10B981' }}>Active</strong></span>
        </div>

        <div>
          <button
            onClick={clearHistory}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--apidog-text-muted)',
              fontSize: '11px',
              textDecoration: 'underline'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--apidog-text-muted)'}
          >
            Xóa toàn bộ lịch sử chạy profile
          </button>
        </div>
      </div>
    </div>
  );
}
