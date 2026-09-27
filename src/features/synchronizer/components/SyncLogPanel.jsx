import React, { useState } from 'react';
import {
  Terminal,
  ChevronUp,
  ChevronDown,
  Trash2,
  CheckCircle2,
  MousePointer,
  Keyboard,
  Globe,
  Monitor
} from 'lucide-react';

export default function SyncLogPanel({ logs = [], onClearLogs }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getLogIcon = (type) => {
    switch (type) {
      case 'click':
        return <MousePointer size={11} style={{ color: '#7C3AED' }} />;
      case 'typing':
        return <Keyboard size={11} style={{ color: '#2563EB' }} />;
      case 'nav':
        return <Globe size={11} style={{ color: '#10B981' }} />;
      case 'window':
        return <Monitor size={11} style={{ color: '#F59E0B' }} />;
      default:
        return <CheckCircle2 size={11} style={{ color: '#64748B' }} />;
    }
  };

  return (
    <div style={{
      borderTop: '1px solid var(--apidog-border)',
      backgroundColor: 'var(--apidog-card-bg)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0
    }}>
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 20px',
          cursor: 'pointer',
          backgroundColor: '#F8FAFC',
          fontSize: '11.5px',
          color: '#64748B'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={13} style={{ color: '#7C3AED' }} />
          <span style={{ fontWeight: 600, color: '#334155' }}>
            Nhật ký đồng bộ thao tác thời gian thực ({logs.length} bản ghi)
          </span>
          {logs.length > 0 && (
            <span style={{
              fontSize: '10.5px',
              color: '#64748B',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '380px'
            }}>
              — Mới nhất: {logs[logs.length - 1]?.text || `${logs[logs.length - 1]?.type} tại (${logs[logs.length - 1]?.x}, ${logs[logs.length - 1]?.y})`}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {logs.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearLogs?.();
              }}
              title="Xóa lịch sử log"
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10.5px'
              }}
            >
              <Trash2 size={12} />
              <span>Xóa</span>
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
            <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
            {isExpanded ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </div>
        </div>
      </div>

      {/* Expanded Logs Terminal */}
      {isExpanded && (
        <div style={{
          maxHeight: '130px',
          overflowY: 'auto',
          padding: '8px 20px',
          backgroundColor: '#0F172A',
          fontFamily: 'Consolas, monospace',
          fontSize: '11px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {logs.length === 0 ? (
            <div style={{ color: '#64748B', fontStyle: 'italic', padding: '6px 0' }}>
              Chưa có thao tác đồng bộ nào được thực hiện... Thao tác trên cửa sổ Master để xem nhật ký.
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E2E8F0' }}>
                <span style={{ color: '#64748B' }}>[{log.time}]</span>
                <span style={{ display: 'flex', alignItems: 'center' }}>{getLogIcon(log.type)}</span>
                <span style={{ color: '#A855F7', fontWeight: 600 }}>
                  [{log.type.toUpperCase()}]
                </span>
                <span style={{ color: '#CBD5E1' }}>
                  {log.text ? `Gõ văn bản: "${log.text}"` : `Click chuột tại tọa độ (${log.x}, ${log.y}) thẻ <${log.target || 'element'}>`}
                </span>
                <span style={{ color: '#10B981', marginLeft: 'auto', fontSize: '10px' }}>
                  ✓ Đã đồng bộ
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
