import React from 'react';
import { Search } from 'lucide-react';

export default function ScriptsSubNav({
  activeSubTab,
  onTabChange,
  scriptsCount,
  logsCount,
  searchTerm,
  onSearchChange
}) {
  const tabs = [
    { id: 'templates', label: 'Tất cả Scripts', count: scriptsCount },
    { id: 'logs', label: 'Terminal Logs', count: logsCount }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid var(--apidog-border)',
      backgroundColor: 'var(--apidog-card-bg)',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '11px 16px',
              fontSize: '12.5px',
              fontWeight: activeSubTab === tab.id ? 600 : 500,
              color: activeSubTab === tab.id ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
              borderBottom: activeSubTab === tab.id ? '2px solid var(--apidog-purple)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.label}</span>
            <span style={{
              fontSize: '10.5px',
              padding: '1px 6px',
              borderRadius: '10px',
              backgroundColor: activeSubTab === tab.id ? 'rgba(124, 58, 237, 0.1)' : 'var(--apidog-bg)',
              color: activeSubTab === tab.id ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)'
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--apidog-bg)',
        border: '1px solid var(--apidog-border)',
        borderRadius: '6px',
        padding: '0 8px',
        height: '28px',
        width: '240px'
      }}>
        <Search size={13} style={{ color: 'var(--apidog-text-muted)', marginRight: '6px' }} />
        <input
          type="text"
          placeholder="Tìm script..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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
    </div>
  );
}
