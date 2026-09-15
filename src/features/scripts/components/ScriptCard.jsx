import React from 'react';
import { Play, RotateCw, Copy, Check } from 'lucide-react';

export default function ScriptCard({
  script,
  runningScriptId,
  copiedKey,
  onCopyCode,
  onRunScript
}) {
  const isRunning = runningScriptId === script.id;
  const isCopied = copiedKey === script.id;

  return (
    <div
      style={{
        backgroundColor: 'var(--apidog-card-bg)',
        border: '1px solid var(--apidog-border)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
              {script.name}
            </span>
            <span style={{
              fontSize: '10.5px',
              padding: '1px 6px',
              borderRadius: '4px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              fontWeight: 600
            }}>
              {script.engine}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', marginTop: '4px' }}>
            {script.description}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onCopyCode(script.code, script.id)}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {isCopied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
            <span>{isCopied ? 'Đã chép' : 'Sao chép mã'}</span>
          </button>
          <button
            onClick={() => onRunScript(script)}
            disabled={isRunning}
            style={{
              height: '30px',
              padding: '0 12px',
              backgroundColor: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              opacity: isRunning ? 0.7 : 1
            }}
          >
            {isRunning ? <RotateCw size={12} className="spin" /> : <Play size={12} fill="#FFFFFF" />}
            <span>{isRunning ? 'Đang chạy...' : 'Chạy'}</span>
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#0F172A',
        color: '#38BDF8',
        borderRadius: '6px',
        padding: '10px 14px',
        fontFamily: 'monospace',
        fontSize: '11.5px',
        maxHeight: '100px',
        overflowY: 'hidden',
        whiteSpace: 'pre-wrap',
        opacity: 0.85
      }}>
        {script.code.slice(0, 220)}...
      </div>
    </div>
  );
}
