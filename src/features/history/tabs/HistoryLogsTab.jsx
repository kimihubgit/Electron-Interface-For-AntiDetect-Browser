import React from 'react';
import { Search, Copy, Check } from 'lucide-react';

export default function HistoryLogsTab({
  displayedLogs,
  currentRecord,
  logFilterTerm,
  setLogFilterTerm,
  handleCopy,
  copiedKey,
  t
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--apidog-bg)',
            border: '1px solid var(--apidog-border)',
            borderRadius: '6px',
            padding: '0 8px',
            height: '30px',
            width: '280px'
          }}
        >
          <Search size={13} style={{ color: 'var(--apidog-text-muted)', marginRight: '6px' }} />
          <input
            type="text"
            placeholder={t('history.filterLogsPlaceholder')}
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
          <span>{t('history.copyAllLogs')}</span>
        </button>
      </div>

      <div
        style={{
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
        }}
      >
        {displayedLogs.length === 0 ? (
          <div style={{ color: '#64748B' }}>{t('common.noData')}</div>
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
  );
}
