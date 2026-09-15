import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function SessionsColumn({
  sessions,
  selectedSessionId,
  onSelectSession,
  onClearSessions
}) {
  return (
    <div
      style={{
        width: '240px',
        minWidth: '220px',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAFAFA'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FAFAFA'
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
          Sessions ({sessions.length})
        </span>
        <button
          onClick={() => {
            if (window.confirm('Xóa tất cả các session đã debug?')) {
              onClearSessions?.();
            }
          }}
          style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
          title="Options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
        {sessions.length === 0 ? (
          <div style={{ padding: '20px 10px', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
            Chưa có session nào. Nhấn Run để bắt đầu.
          </div>
        ) : (
          sessions.map((s) => {
            const isSelected = s.id === selectedSessionId;
            return (
              <div
                key={s.id}
                onClick={() => onSelectSession(s)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  border: isSelected ? '1px solid #D8DCE3' : '1px solid transparent',
                  boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor:
                        s.status === 'success'
                          ? '#10B981'
                          : s.status === 'error'
                          ? '#EF4444'
                          : '#3B82F6'
                    }}
                  />
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E293B',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {s.title}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748B',
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '3px'
                  }}
                >
                  <span>{s.turnsCount} turn · {s.stepsCount} steps · {s.duration}</span>
                </div>

                <div style={{ fontSize: '10px', color: '#94A3B8' }}>{s.model}</div>

                {s.errorSnippet && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '11px',
                      color: '#EF4444',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {s.errorSnippet}
                  </div>
                )}

                {s.statusSnippet && (
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '11px',
                      color: '#059669',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {s.statusSnippet}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
