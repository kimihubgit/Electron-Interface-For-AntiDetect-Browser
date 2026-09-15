import React from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';

export default function HistoryConsoleDrawer({
  isConsoleDrawerOpen,
  setIsConsoleDrawerOpen,
  currentRecord,
  isRunning,
  t
}) {
  return (
    <div
      style={{
        borderTop: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}
    >
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
          <span>{t('history.processOutputDrawer')}</span>
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: isRunning ? 'rgba(16, 185, 129, 0.15)' : 'var(--apidog-card-bg)',
              color: isRunning ? '#10B981' : 'var(--apidog-text-muted)'
            }}
          >
            {isRunning ? 'LIVE' : 'IDLE'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--apidog-text-muted)' }}>
          <span style={{ fontSize: '11px' }}>{isConsoleDrawerOpen ? t('history.collapse') : t('history.expand')}</span>
          {isConsoleDrawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Drawer Stream Body */}
      {isConsoleDrawerOpen && (
        <div
          style={{
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
          }}
        >
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
  );
}
