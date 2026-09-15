import React from 'react';

export default function AgentAuthTab({ apiKey, setApiKey, onSaveKey }) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
        Agent API Keys & Credentials
      </h3>
      <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#64748B' }}>
        Configure your LLM model providers or Local Antidetect Gateway token to authorize tool execution.
      </p>

      <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
            OpenAI API Key (or Compatible Proxy)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              localStorage.setItem('mcp_agent_api_key', e.target.value);
            }}
            placeholder="sk-proj-..."
            style={{
              width: '100%',
              height: '34px',
              padding: '0 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Stored locally in browser localStorage.</span>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
            Antidetect Local Automation API Token
          </label>
          <input
            type="text"
            defaultValue="ant_live_8f93b102948a7c"
            readOnly
            style={{
              width: '100%',
              height: '34px',
              padding: '0 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#F8FAFC',
              fontSize: '12px',
              outline: 'none',
              fontFamily: 'monospace'
            }}
          />
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Used by external MCP clients (Cursor, Claude Desktop) to connect securely to this app.
          </span>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button
            onClick={onSaveKey}
            style={{
              height: '34px',
              padding: '0 18px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Save API Keys
          </button>
        </div>
      </div>
    </div>
  );
}
