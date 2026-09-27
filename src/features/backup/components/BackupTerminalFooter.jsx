import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  ChevronUp,
  ChevronDown,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function BackupTerminalFooter({
  backupStatus = 'idle',
  backupProgress = 0,
  backupLogs = [],
  currentRunningProvider,
  onResetStatus
}) {
  // Auto-expand when backup begins running
  const [isExpanded, setIsExpanded] = useState(false);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (backupStatus === 'running') {
      setIsExpanded(true);
    }
  }, [backupStatus]);

  // Auto-scroll to bottom of logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [backupLogs]);

  const isRunning = backupStatus === 'running';
  const isSuccess = backupStatus === 'success';
  const isError = backupStatus === 'error';

  const latestLog = backupLogs.length > 0 ? backupLogs[backupLogs.length - 1] : null;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#0F172A',
      borderTop: '1px solid #334155',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      zIndex: 20,
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)'
    }}>
      {/* ── FOOTER BAR HEADER ── */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          backgroundColor: '#1E293B',
          cursor: 'pointer',
          userSelect: 'none',
          borderBottom: isExpanded ? '1px solid #334155' : 'none'
        }}
      >
        {/* Left: Terminal Icon + Title + Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* macOS 3 dots */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '4px' }}>
            <Terminal size={14} style={{ color: '#38BDF8' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
              Cloud Backup Terminal
            </span>
          </div>

          {/* Status Badge */}
          {isRunning ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38BDF8',
              color: '#38BDF8',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <RotateCw size={11} className="spin" />
              <span>Đang tải lên {currentRunningProvider || 'Cloud'}... ({backupProgress}%)</span>
            </span>
          ) : isSuccess ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid #4ADE80',
              color: '#4ADE80',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <CheckCircle2 size={11} />
              <span>Sao lưu thành công</span>
            </span>
          ) : isError ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              fontSize: '11px',
              fontWeight: 600
            }}>
              <AlertCircle size={11} />
              <span>Lỗi sao lưu</span>
            </span>
          ) : (
            <span style={{
              fontSize: '11px',
              color: '#64748B',
              padding: '2px 6px'
            }}>
              ○ Sẵn sàng
            </span>
          )}

          {/* Collapsed Snippet: Show latest log */}
          {!isExpanded && latestLog && (
            <span style={{
              fontSize: '11.5px',
              color: '#94A3B8',
              marginLeft: '8px',
              fontFamily: 'monospace',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '460px'
            }}>
              — {latestLog}
            </span>
          )}
        </div>

        {/* Right: Actions (Clear / Toggle Expand) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {backupLogs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetStatus?.();
              }}
              title="Xóa nhật ký terminal"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#CBD5E1',
            fontSize: '11.5px',
            fontWeight: 600
          }}>
            <span>{isExpanded ? 'Thu nhỏ' : 'Mở rộng Console'}</span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </div>
        </div>
      </div>

      {/* ── EXPANDED TERMINAL BODY ── */}
      {isExpanded && (
        <div style={{
          height: '160px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F172A',
          padding: '12px 20px',
          boxSizing: 'border-box'
        }}>
          {/* Progress bar when running */}
          {isRunning && (
            <div style={{ marginBottom: '10px', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#38BDF8', fontFamily: 'monospace' }}>
                <span>Tiến trình tải lên đám mây...</span>
                <span>{backupProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '5px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  width: `${backupProgress}%`,
                  height: '100%',
                  backgroundColor: '#7C3AED',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {/* Log Stream Output */}
          <div
            ref={logContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              fontFamily: 'Consolas, "Fira Code", monospace',
              fontSize: '12px',
              lineHeight: '1.7',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              color: '#CBD5E1'
            }}
          >
            {backupLogs.length === 0 ? (
              <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'center' }}>
                <Terminal size={16} />
                <span>Console sẵn sàng. Nhấn "Bắt đầu Sao lưu ngay" để xuất dữ liệu lên Cloud/Telegram.</span>
              </div>
            ) : (
              backupLogs.map((log, index) => {
                const isHighlight = log.includes('Hoàn tất') || log.includes('thành công');
                const isStartup = log.includes('[Khởi động]');
                const isErr = log.includes('Lỗi') || log.includes('Error') || log.includes('thất bại');

                return (
                  <div
                    key={index}
                    style={{
                      color: isHighlight ? '#4ADE80' : isStartup ? '#38BDF8' : isErr ? '#F87171' : '#CBD5E1'
                    }}
                  >
                    {log}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
