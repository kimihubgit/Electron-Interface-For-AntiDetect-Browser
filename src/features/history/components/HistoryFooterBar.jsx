import React from 'react';

export default function HistoryFooterBar({ clearHistory, t }) {
  return (
    <div
      style={{
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span>
          Chromium Core: <strong>v128.0.6613.120</strong>
        </span>
        <span>
          Dung lượng cache hồ sơ: <strong>42.8 MB</strong>
        </span>
        <span>
          Stealth Bypass Engine: <strong style={{ color: '#10B981' }}>Active</strong>
        </span>
      </div>

      <div>
        <button
          onClick={() => {
            if (window.confirm(t('history.confirmClearAll'))) {
              clearHistory();
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--apidog-text-muted)',
            fontSize: '11px',
            textDecoration: 'underline'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--apidog-text-muted)')}
        >
          {t('history.clearAllHistory')}
        </button>
      </div>
    </div>
  );
}
