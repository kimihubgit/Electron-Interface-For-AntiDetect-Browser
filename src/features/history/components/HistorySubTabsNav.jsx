import React from 'react';

export default function HistorySubTabsNav({ subTabs, activeSubTab, setActiveSubTab }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        borderBottom: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        flexShrink: 0
      }}
    >
      {subTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeSubTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: '11px 16px',
              fontSize: '12.5px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)',
              borderBottom: isActive ? '2px solid var(--apidog-purple)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(124, 58, 237, 0.1)' : 'var(--apidog-bg)',
                  color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)'
                }}
              >
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span
                style={{
                  fontSize: '10px',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  fontWeight: 700
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
