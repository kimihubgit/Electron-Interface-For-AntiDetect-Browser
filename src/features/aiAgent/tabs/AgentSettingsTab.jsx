import React from 'react';
import { Copy, Check } from 'lucide-react';

export default function AgentSettingsTab({ copyToClipboard, copiedKey }) {
  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
        MCP Server Integration (Claude Desktop & Cursor IDE)
      </h3>
      <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#64748B' }}>
        Connect Antidetect Browser directly into Claude Desktop or Cursor using the official Model Context Protocol standard.
      </p>

      <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Claude Desktop Config Snippet */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
              claude_desktop_config.json
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  JSON.stringify(
                    {
                      mcpServers: {
                        antidetect: {
                          command: 'node',
                          args: ['C:/Users/vkhai/AppData/Local/AntidetectBrowser/mcp/server.js'],
                          env: {
                            ANTIDETECT_PORT: '3000',
                            ANTIDETECT_TOKEN: 'ant_live_8f93b102948a7c'
                          }
                        }
                      }
                    },
                    null,
                    2
                  ),
                  'claude-json'
                )
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: copiedKey === 'claude-json' ? '#059669' : '#7C3AED',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {copiedKey === 'claude-json' ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedKey === 'claude-json' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre
            style={{
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: 'Consolas, monospace',
              margin: 0,
              overflowX: 'auto'
            }}
          >
{`{
  "mcpServers": {
    "antidetect": {
      "command": "node",
      "args": ["C:/Users/vkhai/AppData/Local/AntidetectBrowser/mcp/server.js"],
      "env": {
        "ANTIDETECT_PORT": "3000",
        "ANTIDETECT_TOKEN": "ant_live_8f93b102948a7c"
      }
    }
  }
}`}
          </pre>
        </div>

        {/* Cursor / Windsurf SSE Endpoint */}
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', backgroundColor: '#FFFFFF' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B', display: 'block', marginBottom: '4px' }}>
            Server-Sent Events (SSE) Endpoint
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
            For clients that support HTTP/SSE MCP transport:
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value="http://127.0.0.1:3000/mcp/sse"
              readOnly
              style={{
                flex: 1,
                height: '32px',
                padding: '0 10px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            />
            <button
              onClick={() => copyToClipboard('http://127.0.0.1:3000/mcp/sse', 'sse-url')}
              style={{
                padding: '0 12px',
                height: '32px',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
