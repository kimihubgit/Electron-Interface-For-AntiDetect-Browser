import React from 'react';

export default function AgentToolsTab({ toolsList, toggleTool }) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
          Antidetect MCP Tools Catalog (9 Core Functions)
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
          Standard Model Context Protocol (MCP) tool schema for AI Agents to command browser profiles, proxies, stealth interactions, and captcha bypasses.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '14px' }}>
        {toolsList.map((tool) => (
          <div
            key={tool.name}
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              padding: '14px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: '#7C3AED'
                  }}
                >
                  {tool.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    fontWeight: 600
                  }}
                >
                  {tool.category}
                </span>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={tool.enabled}
                  onChange={() => toggleTool(tool.name)}
                  style={{ cursor: 'pointer' }}
                />
              </label>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', margin: '0 0 10px 0' }}>
              {tool.description}
            </p>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '6px', padding: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: '#94A3B8', marginBottom: '4px' }}>
                SAMPLE SCHEMA PAYLOAD
              </div>
              <pre style={{ margin: 0, fontSize: '11px', color: '#1E293B', fontFamily: 'monospace' }}>
                {JSON.stringify(tool.sampleArgs, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
