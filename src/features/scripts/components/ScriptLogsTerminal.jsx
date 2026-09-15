import React from 'react';

export default function ScriptLogsTerminal({ logs = [] }) {
  return (
    <div style={{
      height: '100%',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      borderRadius: '8px',
      padding: '14px',
      fontFamily: 'monospace',
      fontSize: '12px',
      lineHeight: 1.7,
      overflowY: 'auto'
    }}>
      {logs.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
