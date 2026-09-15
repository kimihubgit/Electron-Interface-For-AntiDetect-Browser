import React from 'react';
import { ChevronDown, Play, Square } from 'lucide-react';

export default function ModelConfigBar({
  provider,
  onProviderChange,
  model,
  setModel,
  baseUrl,
  setBaseUrl,
  hasApiKey,
  isRunning,
  onRun,
  onOpenAuthTab
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        minHeight: '46px',
        boxSizing: 'border-box'
      }}
    >
      {/* Provider Select */}
      <div style={{ position: 'relative', width: '130px' }}>
        <select
          value={provider}
          onChange={(e) => onProviderChange(e.target.value)}
          style={{
            width: '100%',
            height: '32px',
            padding: '0 26px 0 10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DCE3',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#1E293B',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
        >
          <option value="OpenAI">OpenAI</option>
          <option value="Claude">Anthropic (Claude)</option>
          <option value="DeepSeek">DeepSeek</option>
          <option value="Ollama">Ollama (Local)</option>
          <option value="Gemini">Google Gemini</option>
        </select>
        <ChevronDown
          size={13}
          style={{
            position: 'absolute',
            right: '9px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Model Select */}
      <div style={{ position: 'relative', width: '150px' }}>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{
            width: '100%',
            height: '32px',
            padding: '0 26px 0 10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DCE3',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            color: '#1E293B',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
        >
          {provider === 'OpenAI' && (
            <>
              <option value="gpt-5.5">gpt-5.5</option>
              <option value="gpt-4o">gpt-4o</option>
              <option value="gpt-4o-mini">gpt-4o-mini</option>
              <option value="o1-preview">o1-preview</option>
              <option value="o3-mini">o3-mini</option>
            </>
          )}
          {provider === 'Claude' && (
            <>
              <option value="claude-3-7-sonnet">claude-3-7-sonnet</option>
              <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              <option value="claude-3-haiku">claude-3-haiku</option>
            </>
          )}
          {provider === 'DeepSeek' && (
            <>
              <option value="deepseek-chat">deepseek-chat</option>
              <option value="deepseek-reasoner">deepseek-reasoner (R1)</option>
            </>
          )}
          {provider === 'Ollama' && (
            <>
              <option value="llama3.3:latest">llama3.3:latest</option>
              <option value="qwen2.5-coder:32b">qwen2.5-coder:32b</option>
              <option value="mistral:latest">mistral:latest</option>
            </>
          )}
          {provider === 'Gemini' && (
            <>
              <option value="gemini-2.0-flash">gemini-2.0-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro</option>
            </>
          )}
        </select>
        <ChevronDown
          size={13}
          style={{
            position: 'absolute',
            right: '9px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94A3B8',
            pointerEvents: 'none'
          }}
        />
      </div>

      {/* Base URL Input */}
      <div style={{ flex: 1, minWidth: '180px' }}>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="https://api.openai.com/v1"
          style={{
            width: '100%',
            height: '32px',
            padding: '0 10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D8DCE3',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#334155',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Status Indicator (Dot + Label) */}
      <div
        onClick={onOpenAuthTab}
        title="Click to configure API Key in Auth tab"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500,
          color: hasApiKey ? '#10B981' : '#F59E0B',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: hasApiKey ? '#10B981' : '#F59E0B'
          }}
        />
        <span>{hasApiKey ? 'Ready (MCP Connected)' : 'No API Key'}</span>
      </div>

      {/* Run Button */}
      <button
        onClick={onRun}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '32px',
          padding: '0 18px',
          backgroundColor: isRunning ? '#EF4444' : '#7C3AED',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.3)',
          transition: 'all 0.15s ease'
        }}
      >
        {isRunning ? (
          <>
            <Square size={12} fill="#FFFFFF" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Play size={12} fill="#FFFFFF" />
            <span>Run</span>
          </>
        )}
      </button>
    </div>
  );
}
