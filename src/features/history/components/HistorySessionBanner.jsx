import React from 'react';

export default function HistorySessionBanner({
  currentRecord,
  isRunning,
  isCompleted,
  t
}) {
  return (
    <div
      style={{
        padding: '8px 18px',
        backgroundColor: 'var(--apidog-bg)',
        borderBottom: '1px solid var(--apidog-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        gap: '12px'
      }}
    >
      {/* Left: Active Session Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Status Indicator */}
        <div
          style={{
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
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isRunning ? '#10B981' : isCompleted ? '#22C55E' : '#9CA3AF',
              boxShadow: isRunning ? '0 0 8px #10B981' : 'none'
            }}
          />
          <span>{currentRecord.statusLabel?.toUpperCase() || (isRunning ? t('history.statusRunning') : isCompleted ? t('history.statusCompleted') : t('history.statusStopped'))}</span>
        </div>

        {/* Profile Name */}
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: 700,
            color: 'var(--apidog-text-main)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {currentRecord.profileName || t('history.unnamedProfile')}
        </span>

        {/* Group Tag */}
        {currentRecord.group && (
          <span
            style={{
              fontSize: '11px',
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: 'var(--apidog-card-bg)',
              border: '1px solid var(--apidog-border)',
              color: 'var(--apidog-text-muted)'
            }}
          >
            {currentRecord.group}
          </span>
        )}

        {/* Engine Core */}
        <span
          style={{
            fontSize: '11px',
            color: 'var(--apidog-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>•</span>
          <span>{currentRecord.browser || 'Chrome 128 (Windows 11)'}</span>
        </span>
      </div>

      {/* Right: Operator, Date, Session ID */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0, fontSize: '11.5px', color: 'var(--apidog-text-muted)' }}>
        <span>
          {t('history.sessionId')}: <strong style={{ color: 'var(--apidog-text-main)', fontFamily: 'monospace' }}>#{currentRecord.id}</strong>
        </span>
        <span>
          {t('history.startedAt')}: <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.startTime}</strong>
        </span>
        <span>
          {t('history.operator')}: <strong style={{ color: 'var(--apidog-text-main)' }}>{currentRecord.operator || 'Khải'}</strong>
        </span>
      </div>
    </div>
  );
}
