import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Terminal,
  ChevronUp,
  ChevronDown,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Maximize2,
  Minimize2,
  GripHorizontal
} from 'lucide-react';

const MIN_TERMINAL_HEIGHT = 70;
const MAX_TERMINAL_HEIGHT = 560;
const DEFAULT_TERMINAL_HEIGHT = 170;

export default function BackupTerminalFooter({
  backupStatus = 'idle',
  backupProgress = 0,
  backupLogs = [],
  currentRunningProvider,
  onResetStatus
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [terminalHeight, setTerminalHeight] = useState(() => {
    try {
      const saved = localStorage.getItem('backup_terminal_height');
      return saved ? parseInt(saved, 10) : DEFAULT_TERMINAL_HEIGHT;
    } catch (e) {
      return DEFAULT_TERMINAL_HEIGHT;
    }
  });
  const [isDragging, setIsDragging] = useState(false);

  const dragStartYRef = useRef(0);
  const dragStartHeightRef = useRef(DEFAULT_TERMINAL_HEIGHT);
  const logContainerRef = useRef(null);

  // Auto-expand when backup starts running
  useEffect(() => {
    if (backupStatus === 'running') {
      setIsExpanded(true);
    }
  }, [backupStatus]);

  // Auto-scroll to bottom on new log lines
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [backupLogs]);

  // Handle Drag-to-resize up and down
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    dragStartYRef.current = e.clientY;
    dragStartHeightRef.current = isExpanded ? terminalHeight : 0;

    if (!isExpanded) {
      setIsExpanded(true);
    }
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [isExpanded, terminalHeight]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      // Dragging up increases height (smaller clientY)
      const deltaY = dragStartYRef.current - e.clientY;
      const maxHeight = Math.min(window.innerHeight * 0.7, MAX_TERMINAL_HEIGHT);
      const calculatedHeight = dragStartHeightRef.current + deltaY;

      if (calculatedHeight < 40) {
        // If dragged almost all the way down, collapse it
        setIsExpanded(false);
      } else {
        setIsExpanded(true);
        const newHeight = Math.min(Math.max(calculatedHeight, MIN_TERMINAL_HEIGHT), maxHeight);
        setTerminalHeight(newHeight);
        try {
          localStorage.setItem('backup_terminal_height', newHeight.toString());
        } catch (err) {}
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  const toggleMaximize = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTerminalHeight(340);
    } else if (terminalHeight >= 320) {
      setTerminalHeight(DEFAULT_TERMINAL_HEIGHT);
    } else {
      setTerminalHeight(340);
    }
  };

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
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.18)',
      position: 'relative',
      userSelect: isDragging ? 'none' : 'auto'
    }}>
      {/* ── DRAGGABLE RESIZER HANDLE BAR (TOP EDGE) ── */}
      <div
        onMouseDown={handleMouseDown}
        title="Kéo lên hoặc kéo xuống để chỉnh kích thước Terminal (Drag to resize)"
        style={{
          width: '100%',
          height: '7px',
          cursor: 'ns-resize',
          backgroundColor: isDragging ? '#7C3AED' : 'transparent',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.15s ease',
          zIndex: 30
        }}
        onMouseEnter={(e) => {
          if (!isDragging) e.currentTarget.style.backgroundColor = 'rgba(124, 58, 237, 0.35)';
        }}
        onMouseLeave={(e) => {
          if (!isDragging) e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {/* Visual grip handle pills */}
        <div style={{
          width: '42px',
          height: '3px',
          borderRadius: '2px',
          backgroundColor: isDragging ? '#C084FC' : '#475569',
          pointerEvents: 'none',
          transition: 'all 0.15s ease'
        }} />
      </div>

      {/* ── HEADER BAR ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 18px',
          backgroundColor: '#1E293B',
          userSelect: 'none',
          borderBottom: isExpanded ? '1px solid #334155' : 'none'
        }}
      >
        {/* Left: Terminal Icon + Title + Status */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
        >
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

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {backupLogs.length > 0 && (
            <button
              type="button"
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
                padding: '3px 7px',
                borderRadius: '4px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F8FAFC';
                e.currentTarget.style.backgroundColor = '#334155';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          )}

          {/* Maximize / Restore Toggle */}
          <button
            type="button"
            onClick={toggleMaximize}
            title={terminalHeight >= 320 ? "Kích thước mặc định" : "Phóng to Terminal"}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F8FAFC';
              e.currentTarget.style.backgroundColor = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {terminalHeight >= 320 ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Expand / Collapse Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Thu gọn Terminal" : "Mở rộng Terminal"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '3px 8px',
              borderRadius: '4px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = '#334155';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#CBD5E1';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{isExpanded ? 'Thu nhỏ' : 'Mở rộng'}</span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* ── RESIZABLE TERMINAL BODY ── */}
      {isExpanded && (
        <div style={{
          height: `${terminalHeight}px`,
          minHeight: `${MIN_TERMINAL_HEIGHT}px`,
          maxHeight: `${MAX_TERMINAL_HEIGHT}px`,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F172A',
          padding: '12px 20px',
          boxSizing: 'border-box',
          overflow: 'hidden'
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
                <span>Console sẵn sàng. Nhấn "Sao lưu ngay" để xuất dữ liệu lên Cloud/Telegram.</span>
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
