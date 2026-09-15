import React from 'react';

export default function AgentSubTabs({
  activeSubTab,
  setActiveSubTab,
  toolsCount,
  hasApiKey
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '0 16px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        minHeight: '38px'
      }}
    >
      {/* Tab 1: Prompt */}
      <button
        onClick={() => setActiveSubTab('prompt')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '38px',
          background: 'none',
          border: 'none',
          borderBottom: activeSubTab === 'prompt' ? '2px solid #7C3AED' : '2px solid transparent',
          color: activeSubTab === 'prompt' ? '#7C3AED' : '#64748B',
          fontSize: '13px',
          fontWeight: activeSubTab === 'prompt' ? 600 : 500,
          cursor: 'pointer',
          padding: '0 4px',
          transition: 'all 0.15s ease'
        }}
      >
        Prompt
      </button>

      {/* Tab 2: Tools */}
      <button
        onClick={() => setActiveSubTab('tools')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '38px',
          background: 'none',
          border: 'none',
          borderBottom: activeSubTab === 'tools' ? '2px solid #7C3AED' : '2px solid transparent',
          color: activeSubTab === 'tools' ? '#7C3AED' : '#64748B',
          fontSize: '13px',
          fontWeight: activeSubTab === 'tools' ? 600 : 500,
          cursor: 'pointer',
          padding: '0 4px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>Tools</span>
        <span
          style={{
            padding: '1px 6px',
            borderRadius: '10px',
            backgroundColor: activeSubTab === 'tools' ? '#F3E8FF' : '#F1F5F9',
            color: activeSubTab === 'tools' ? '#7C3AED' : '#64748B',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          {toolsCount}
        </span>
      </button>

      {/* Tab 3: Skills */}
      <button
        onClick={() => setActiveSubTab('skills')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '38px',
          background: 'none',
          border: 'none',
          borderBottom: activeSubTab === 'skills' ? '2px solid #7C3AED' : '2px solid transparent',
          color: activeSubTab === 'skills' ? '#7C3AED' : '#64748B',
          fontSize: '13px',
          fontWeight: activeSubTab === 'skills' ? 600 : 500,
          cursor: 'pointer',
          padding: '0 4px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>Skills</span>
        <span
          style={{
            padding: '1px 6px',
            borderRadius: '10px',
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          3
        </span>
      </button>

      {/* Tab 4: Auth */}
      <button
        onClick={() => setActiveSubTab('auth')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '38px',
          background: 'none',
          border: 'none',
          borderBottom: activeSubTab === 'auth' ? '2px solid #7C3AED' : '2px solid transparent',
          color: activeSubTab === 'auth' ? '#7C3AED' : '#64748B',
          fontSize: '13px',
          fontWeight: activeSubTab === 'auth' ? 600 : 500,
          cursor: 'pointer',
          padding: '0 4px',
          transition: 'all 0.15s ease'
        }}
      >
        <span>Auth</span>
        {!hasApiKey && (
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#EF4444'
            }}
          />
        )}
      </button>

      {/* Tab 5: Settings */}
      <button
        onClick={() => setActiveSubTab('settings')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '38px',
          background: 'none',
          border: 'none',
          borderBottom: activeSubTab === 'settings' ? '2px solid #7C3AED' : '2px solid transparent',
          color: activeSubTab === 'settings' ? '#7C3AED' : '#64748B',
          fontSize: '13px',
          fontWeight: activeSubTab === 'settings' ? 600 : 500,
          cursor: 'pointer',
          padding: '0 4px',
          transition: 'all 0.15s ease'
        }}
      >
        Settings
      </button>
    </div>
  );
}
