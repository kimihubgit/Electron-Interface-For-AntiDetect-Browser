import React from 'react';
import { Bot } from 'lucide-react';

export default function TurnsColumn({
  selectedSession,
  selectedTurnId,
  onSelectTurn
}) {
  return (
    <div
      style={{
        width: '280px',
        minWidth: '240px',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #E2E8F0',
          fontSize: '12px',
          fontWeight: 600,
          color: '#64748B',
          backgroundColor: '#FAFAFA'
        }}
      >
        Turns
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        {!selectedSession ? (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94A3B8',
              fontSize: '12px',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <Bot size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
            <span>Click a session on the left to view turns</span>
          </div>
        ) : selectedSession.turns?.length === 0 ? (
          <div style={{ color: '#94A3B8', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
            No turns in this session.
          </div>
        ) : (
          selectedSession.turns.map((turn) => {
            const isTurnSelected = turn.id === selectedTurnId;
            return (
              <div
                key={turn.id}
                onClick={() => onSelectTurn(turn)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: isTurnSelected ? '#F8FAFC' : '#FFFFFF',
                  border: isTurnSelected ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{turn.title}</span>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>{turn.duration}</span>
                </div>

                <div
                  style={{
                    fontSize: '12px',
                    color: '#334155',
                    backgroundColor: '#F1F5F9',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    marginBottom: '6px',
                    lineHeight: '1.4'
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#64748B', marginRight: '4px' }}>User:</span>
                  {turn.userPrompt}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B' }}>
                  <span>{turn.toolsCalled} tools</span>
                  <span>•</span>
                  <span>{turn.tokens} tokens</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: turn.status === 'success' ? '#10B981' : turn.status === 'error' ? '#EF4444' : '#3B82F6'
                    }}
                  />
                </div>

                {turn.error && (
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      fontSize: '11px',
                      color: '#DC2626'
                    }}
                  >
                    {turn.error}
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
