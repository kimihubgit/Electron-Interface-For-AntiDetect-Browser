import React from 'react';
import { Paperclip, Folder } from 'lucide-react';

export default function PromptSplitView({
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
  clearAfterSend,
  setClearAfterSend,
  onKeyDown,
  onAttachFile,
  onAttachFolder
}) {
  return (
    <div
      style={{
        height: '240px',
        minHeight: '200px',
        display: 'flex',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FAFAFA'
      }}
    >
      {/* Left Pane: System Prompt */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #E2E8F0',
          padding: '10px 16px',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>System Prompt</span>
          <span
            style={{
              fontSize: '11px',
              color: '#64748B',
              backgroundColor: '#F1F5F9',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 500
            }}
          >
            Agent Config
          </span>

          <div style={{ marginLeft: 'auto' }}>
            <select
              onChange={(e) => {
                if (e.target.value === 'stealth') {
                  setSystemPrompt(
                    'You are an Antidetect Automation Agent. Use the available MCP tools to control browser profiles, navigate safely, bypass bot protections, and extract data stealthily. Always verify profile fingerprint integrity and proxy status before sensitive actions.'
                  );
                } else if (e.target.value === 'warmup') {
                  setSystemPrompt(
                    'You are a Social Account Warmup Agent. Launch browser profiles, emulate natural human typing and scrolling, visit random top authority sites, and maintain long residential proxy sessions.'
                  );
                } else {
                  setSystemPrompt(
                    "You are a helpful AI assistant. Use the available tools to answer the user's questions thoroughly."
                  );
                }
              }}
              style={{
                fontSize: '11px',
                color: '#64748B',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                padding: '2px 6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="default">Default Prompt</option>
              <option value="stealth">Antidetect Stealth Mode</option>
              <option value="warmup">Social Warmup Mode</option>
            </select>
          </div>
        </div>

        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          style={{
            flex: 1,
            width: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#334155',
            fontFamily: 'inherit',
            backgroundColor: 'transparent'
          }}
          placeholder="Enter system instructions for the agent..."
        />
      </div>

      {/* Right Pane: User Prompt */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '10px 16px',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>User Prompt</span>
          <span
            style={{
              fontSize: '11px',
              color: '#64748B',
              backgroundColor: '#F1F5F9',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: 500
            }}
          >
            Text Input
          </span>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
            <button
              onClick={() =>
                setUserPrompt(
                  "Launch profile 'TikTok US #1', navigate to https://tiktok.com, bypass captcha if detected, and report cookies."
                )
              }
              style={{
                fontSize: '11px',
                color: '#7C3AED',
                backgroundColor: '#F5F3FF',
                border: '1px solid #EDE9FE',
                borderRadius: '4px',
                padding: '2px 8px',
                cursor: 'pointer'
              }}
            >
              + Example: TikTok Stealth
            </button>
          </div>
        </div>

        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            flex: 1,
            width: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            fontSize: '12px',
            lineHeight: '1.6',
            color: '#1E293B',
            fontFamily: 'inherit',
            backgroundColor: 'transparent'
          }}
          placeholder="Enter user prompt or instruction (e.g. Launch profile, navigate, click, extract data)..."
        />

        {/* Footer toolbar of User Prompt */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '6px',
            borderTop: '1px solid #F1F5F9',
            fontSize: '11px',
            color: '#94A3B8'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onAttachFile}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
              title="Attach file"
            >
              <Paperclip size={14} />
            </button>
            <button
              onClick={onAttachFolder}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
              title="Attach directory"
            >
              <Folder size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Ctrl + Enter to send</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={clearAfterSend}
                onChange={(e) => setClearAfterSend(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Clear after send</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
