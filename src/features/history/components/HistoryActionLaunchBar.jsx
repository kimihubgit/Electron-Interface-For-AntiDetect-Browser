import React from 'react';
import { Play, RotateCw, Copy, Check, Trash2 } from 'lucide-react';

export default function HistoryActionLaunchBar({
  currentRecord,
  isRunning,
  handleCopy,
  copiedKey,
  handleReRun,
  deleteHistoryRecord,
  t
}) {
  return (
    <div
      style={{
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--apidog-card-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        flexShrink: 0
      }}
    >
      {/* Target URL Bar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--apidog-bg)',
          border: '1px solid var(--apidog-border)',
          borderRadius: '6px',
          height: '34px',
          padding: '0 10px',
          gap: '8px'
        }}
      >
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '3px',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            color: 'var(--apidog-purple)',
            letterSpacing: '0.3px'
          }}
        >
          {t('history.targetUrl')}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: '12.5px',
            fontFamily: 'monospace',
            color: 'var(--apidog-text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentRecord.targetUrl || 'about:blank'}
        </span>
        {currentRecord.targetUrl && (
          <button
            onClick={() => handleCopy(currentRecord.targetUrl, 'targetUrl')}
            title={t('common.copy')}
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
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {isRunning ? (
          <>
            <RotateCw size={13} className="spin" />
            <span>{t('history.stopSession')}</span>
          </>
        ) : (
          <>
            <Play size={13} fill="#FFFFFF" />
            <span>{t('history.relaunch')}</span>
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
        <span>{copiedKey === 'sessionData' ? t('history.copiedJson') : t('history.exportSnapshot')}</span>
      </button>

      {/* Action 3: Xóa phiên này */}
      <button
        onClick={() => {
          if (window.confirm(t('history.deleteConfirm', { id: currentRecord.id }))) {
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
        title={t('history.deleteSession')}
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
  );
}
