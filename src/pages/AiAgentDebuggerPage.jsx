import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  RefreshCw,
  Sparkles,
  Bot,
  Settings,
  Key,
  Wrench,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Paperclip,
  Folder,
  Send,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Globe,
  Shield,
  MousePointer,
  Type,
  Eye,
  RotateCw,
  Trash2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';

// ── DEFAULT ANTIDETECT MCP TOOLS (9 CORE TOOLS) ──
const ANTIDETECT_MCP_TOOLS = [
  {
    name: 'antidetect_list_profiles',
    description: 'List all antidetect browser profiles with tags, proxy status, and fingerprint configs.',
    category: 'Management',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Filter by status: all, active, stopped' },
        limit: { type: 'number', description: 'Max profiles to return' }
      }
    },
    sampleArgs: { filter: 'active', limit: 10 }
  },
  {
    name: 'antidetect_launch_profile',
    description: 'Launch an isolated profile with stealth fingerprint spoofing and return CDP WebSocket URL.',
    category: 'Lifecycle',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'ID of the profile to launch' },
        headless: { type: 'boolean', description: 'Launch without UI window' },
        stealth: { type: 'boolean', description: 'Inject antidetect evasion scripts' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', headless: false, stealth: true }
  },
  {
    name: 'antidetect_close_profile',
    description: 'Gracefully close profile, terminate browser process, and flush cookies to persistent storage.',
    category: 'Lifecycle',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'ID of profile to close' },
        saveStorage: { type: 'boolean', description: 'Whether to persist storage/cookies' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', saveStorage: true }
  },
  {
    name: 'antidetect_navigate',
    description: 'Navigate target page with randomized human latency and network idle checks.',
    category: 'Navigation',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        url: { type: 'string', description: 'Target URL' },
        waitUntil: { type: 'string', enum: ['load', 'domcontentloaded', 'networkidle0'] }
      },
      required: ['profileId', 'url']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', url: 'https://browserleaks.com/canvas', waitUntil: 'networkidle0' }
  },
  {
    name: 'antidetect_human_click',
    description: 'Perform human-like mouse movement via Bezier curve trajectory before clicking selector.',
    category: 'Interaction',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        selector: { type: 'string', description: 'CSS or XPath selector' },
        jitter: { type: 'boolean', description: 'Add micro mouse jitter' }
      },
      required: ['profileId', 'selector']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', selector: 'button[type="submit"]', jitter: true }
  },
  {
    name: 'antidetect_human_type',
    description: 'Type text with variable keystroke delays (60-180ms) and organic typo correction simulation.',
    category: 'Interaction',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        selector: { type: 'string', description: 'Input selector' },
        text: { type: 'string', description: 'Text to input' }
      },
      required: ['profileId', 'selector', 'text']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', selector: 'input[name="username"]', text: 'affiliate_partner_us' }
  },
  {
    name: 'antidetect_bypass_captcha',
    description: 'Detect and solve Cloudflare Turnstile, reCAPTCHA v2/v3, GeeTest, or hCaptcha autonomously.',
    category: 'Security',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        type: { type: 'string', enum: ['auto', 'cloudflare_turnstile', 'recaptcha', 'hcaptcha'] },
        timeoutMs: { type: 'number', description: 'Max solving wait time' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', type: 'cloudflare_turnstile', timeoutMs: 15000 }
  },
  {
    name: 'antidetect_rotate_proxy',
    description: 'Trigger dynamic IP rotation on active mobile/residential proxy gateway.',
    category: 'Network',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Profile whose proxy needs rotation' },
        changeCountry: { type: 'string', description: 'Optional 2-letter ISO country code' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', changeCountry: 'US' }
  },
  {
    name: 'antidetect_take_screenshot',
    description: 'Capture screenshot of current page or element without leaving automation artifacts.',
    category: 'Inspection',
    enabled: true,
    parameters: {
      type: 'object',
      properties: {
        profileId: { type: 'string', description: 'Active profile ID' },
        fullPage: { type: 'boolean', description: 'Capture full scrollable height' }
      },
      required: ['profileId']
    },
    sampleArgs: { profileId: 'prof_tiktok_01', fullPage: false }
  }
];

// ── INITIAL SESSIONS (Faithful to screenshot) ──
const INITIAL_SESSIONS = [
  {
    id: 'session-1',
    title: 'Session 1',
    status: 'error', // 'error' | 'success' | 'running'
    turnsCount: 1,
    stepsCount: 0,
    duration: '1s',
    model: 'gpt-5.5',
    errorSnippet: '[Auth Error] Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys',
    turns: [
      {
        id: 'turn-1',
        title: 'Turn 1',
        userPrompt: 'Hi',
        status: 'error',
        error: 'AuthenticationError: Incorrect API key provided. Please configure key in Auth tab.',
        duration: '0.8s',
        tokens: 0,
        toolsCalled: 0,
        steps: []
      }
    ]
  },
  {
    id: 'session-2',
    title: 'Session 2 (TikTok Stealth)',
    status: 'success',
    turnsCount: 1,
    stepsCount: 3,
    duration: '2.4s',
    model: 'gpt-4o',
    errorSnippet: null,
    statusSnippet: 'antidetect_launch_profile -> Success (CDP ws://127.0.0.1:9222/devtools/...)',
    turns: [
      {
        id: 'turn-1',
        title: 'Turn 1',
        userPrompt: 'Launch TikTok US #1 profile, navigate to tiktok.com and check canvas spoofing.',
        status: 'success',
        duration: '2.4s',
        tokens: 684,
        toolsCalled: 3,
        steps: [
          {
            id: 'step-1',
            tool: 'antidetect_launch_profile',
            duration: '820ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              headless: false,
              stealth: true
            },
            result: {
              success: true,
              pid: 14820,
              cdpWebSocketUrl: 'ws://127.0.0.1:9222/devtools/browser/7b1c4e92-3a5f-4d9a',
              fingerprint: {
                os: 'Windows 11',
                browser: 'Chrome 131.0.6778.86',
                canvasNoise: '0.0019248 (Spoofed)',
                webglVendor: 'Google Inc. (NVIDIA GeForce RTX 4070)',
                audioContextLatency: '0.0412s'
              }
            }
          },
          {
            id: 'step-2',
            tool: 'antidetect_navigate',
            duration: '950ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              url: 'https://browserleaks.com/canvas',
              waitUntil: 'networkidle0'
            },
            result: {
              success: true,
              httpStatus: 200,
              pageTitle: 'Canvas Fingerprinting - BrowserLeaks',
              loadedInMs: 942
            }
          },
          {
            id: 'step-3',
            tool: 'antidetect_take_screenshot',
            duration: '630ms',
            status: 'success',
            statusCode: 200,
            args: {
              profileId: 'prof_tiktok_01',
              fullPage: false
            },
            result: {
              success: true,
              mimeType: 'image/png',
              sizeBytes: 124980,
              previewUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
            }
          }
        ]
      }
    ]
  }
];

export default function AiAgentDebuggerPage() {
  const { t } = useTranslation();
  const { showToast } = useBrowser();

  // ── MODEL BAR STATES ──
  const [provider, setProvider] = useState('OpenAI');
  const [model, setModel] = useState('gpt-5.5');
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('mcp_agent_api_key') || '');
  const [isRunning, setIsRunning] = useState(false);

  // ── SUB-TABS ──
  // 'prompt' | 'tools' | 'skills' | 'auth' | 'settings'
  const [activeSubTab, setActiveSubTab] = useState('prompt');

  // ── PROMPT PANE STATES ──
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a helpful AI assistant. Use the available tools to answer the user\'s questions thoroughly.'
  );
  const [userPrompt, setUserPrompt] = useState('Hi');
  const [clearAfterSend, setClearAfterSend] = useState(false);

  // ── MCP TOOLS LIST STATE ──
  const [toolsList, setToolsList] = useState(ANTIDETECT_MCP_TOOLS);

  // ── SESSIONS & TURNS & TRACE STATE ──
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState('session-1');
  const [selectedTurnId, setSelectedTurnId] = useState('turn-1');
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [stepTab, setStepTab] = useState('args'); // 'args' | 'result'

  // Copy state helper
  const [copiedKey, setCopiedKey] = useState('');

  const selectedSession = sessions.find((s) => s.id === selectedSessionId) || null;
  const selectedTurn = selectedSession?.turns?.find((t) => t.id === selectedTurnId) || selectedSession?.turns?.[0] || null;
  const selectedStep = selectedTurn?.steps?.find((s) => s.id === selectedStepId) || selectedTurn?.steps?.[0] || null;

  // Sync endpoint default when provider changes
  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === 'OpenAI') {
      setModel('gpt-5.5');
      setBaseUrl('https://api.openai.com/v1');
    } else if (newProvider === 'Claude') {
      setModel('claude-3-7-sonnet');
      setBaseUrl('https://api.anthropic.com/v1');
    } else if (newProvider === 'DeepSeek') {
      setModel('deepseek-chat');
      setBaseUrl('https://api.deepseek.com/v1');
    } else if (newProvider === 'Ollama') {
      setModel('llama3.3:latest');
      setBaseUrl('http://localhost:11434/v1');
    } else if (newProvider === 'Gemini') {
      setModel('gemini-2.0-flash');
      setBaseUrl('https://generativelanguage.googleapis.com/v1beta');
    }
  };

  // Toggle MCP Tool on/off
  const toggleTool = (toolName) => {
    setToolsList((prev) =>
      prev.map((t) => (t.name === toolName ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast?.('Đã sao chép vào clipboard');
    setTimeout(() => setCopiedKey(''), 2000);
  };

  // ── RUN AGENT EXECUTION SIMULATION / CALL ──
  const handleRun = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }

    if (!userPrompt.trim()) {
      showToast?.('Vui lòng nhập User Prompt trước khi chạy');
      return;
    }

    // Check if key is present
    const hasKey = Boolean(apiKey.trim() || localStorage.getItem('mcp_agent_api_key'));

    setIsRunning(true);

    const newSessionId = `session-${Date.now()}`;
    const newTurnId = `turn-${Date.now()}`;

    if (!hasKey) {
      // Simulate Auth Error matching screenshot
      setTimeout(() => {
        const errorSession = {
          id: newSessionId,
          title: `Session ${sessions.length + 1}`,
          status: 'error',
          turnsCount: 1,
          stepsCount: 0,
          duration: '1s',
          model: model,
          errorSnippet: '[Auth Error] Incorrect API key provided. You can find your API key at https://platform.openai.com/account/api-keys',
          turns: [
            {
              id: newTurnId,
              title: 'Turn 1',
              userPrompt: userPrompt,
              status: 'error',
              error: 'AuthenticationError: No valid API key provided. Go to "Auth" tab to enter your API key or use local Ollama.',
              duration: '0.9s',
              tokens: 0,
              toolsCalled: 0,
              steps: []
            }
          ]
        };

        setSessions((prev) => [errorSession, ...prev]);
        setSelectedSessionId(newSessionId);
        setSelectedTurnId(newTurnId);
        setSelectedStepId(null);
        setIsRunning(false);
        if (clearAfterSend) setUserPrompt('');
      }, 900);
      return;
    }

    // With API Key: Simulate live MCP tool execution pipeline
    const pendingSession = {
      id: newSessionId,
      title: `Session ${sessions.length + 1} (${userPrompt.slice(0, 18)}...)`,
      status: 'running',
      turnsCount: 1,
      stepsCount: 0,
      duration: '0s',
      model: model,
      turns: [
        {
          id: newTurnId,
          title: 'Turn 1',
          userPrompt: userPrompt,
          status: 'running',
          duration: '...',
          tokens: 150,
          toolsCalled: 0,
          steps: []
        }
      ]
    };

    setSessions((prev) => [pendingSession, ...prev]);
    setSelectedSessionId(newSessionId);
    setSelectedTurnId(newTurnId);

    // Step 1: Profile Launch
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== newSessionId) return s;
          return {
            ...s,
            stepsCount: 1,
            turns: s.turns.map((t) => {
              if (t.id !== newTurnId) return t;
              return {
                ...t,
                toolsCalled: 1,
                steps: [
                  {
                    id: 'step-run-1',
                    tool: 'antidetect_launch_profile',
                    duration: '740ms',
                    status: 'success',
                    statusCode: 200,
                    args: { profileId: 'prof_default_01', headless: false, stealth: true },
                    result: {
                      success: true,
                      pid: 21980,
                      cdpWebSocketUrl: 'ws://127.0.0.1:9222/devtools/browser/98d2a1...',
                      message: 'Isolated stealth browser profile launched successfully.'
                    }
                  }
                ]
              };
            })
          };
        })
      );
      setSelectedStepId('step-run-1');
    }, 1000);

    // Step 2: Navigate
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== newSessionId) return s;
          return {
            ...s,
            stepsCount: 2,
            turns: s.turns.map((t) => {
              if (t.id !== newTurnId) return t;
              return {
                ...t,
                toolsCalled: 2,
                steps: [
                  ...t.steps,
                  {
                    id: 'step-run-2',
                    tool: 'antidetect_navigate',
                    duration: '890ms',
                    status: 'success',
                    statusCode: 200,
                    args: {
                      profileId: 'prof_default_01',
                      url: userPrompt.includes('http') ? userPrompt.match(/https?:\/\/[^\s]+/)?.[0] || 'https://google.com' : 'https://google.com',
                      waitUntil: 'networkidle0'
                    },
                    result: {
                      success: true,
                      httpStatus: 200,
                      loadedInMs: 875,
                      cookiesCount: 14
                    }
                  }
                ]
              };
            })
          };
        })
      );
    }, 2200);

    // Step 3: Complete Turn
    setTimeout(() => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== newSessionId) return s;
          return {
            ...s,
            status: 'success',
            duration: '2.8s',
            statusSnippet: 'Execution finished successfully · 2 MCP tools triggered',
            turns: s.turns.map((t) => {
              if (t.id !== newTurnId) return t;
              return {
                ...t,
                status: 'success',
                duration: '2.8s',
                tokens: 542
              };
            })
          };
        })
      );
      setIsRunning(false);
      if (clearAfterSend) setUserPrompt('');
    }, 3100);
  };

  // Keyboard shortcut Ctrl+Enter to trigger Run
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        color: '#1E293B',
        fontFamily: 'inherit',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* ───────────────────────────────────────────────────────────
          1. TOP MODEL CONFIGURATION BAR (Matching Screenshot Exactly)
          ─────────────────────────────────────────────────────────── */}
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
            onChange={(e) => handleProviderChange(e.target.value)}
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
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
            }}
          />
        </div>

        {/* Status Indicator (Dot + Label) */}
        <div
          onClick={() => setActiveSubTab('auth')}
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
            color: apiKey.trim() ? '#10B981' : '#F59E0B',
            whiteSpace: 'nowrap'
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: apiKey.trim() ? '#10B981' : '#F59E0B'
            }}
          />
          <span>{apiKey.trim() ? 'Ready (MCP Connected)' : 'No API Key'}</span>
        </div>

        {/* Run Button (Purple Pill Button matching screenshot) */}
        <button
          onClick={handleRun}
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

      {/* ───────────────────────────────────────────────────────────
          2. SUB-NAVIGATION TABS (Prompt, Tools (9), Skills, Auth, Settings)
          ─────────────────────────────────────────────────────────── */}
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

        {/* Tab 2: Tools (9) */}
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
            {toolsList.length}
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
          {!apiKey.trim() && (
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

      {/* ───────────────────────────────────────────────────────────
          3. MAIN CONTENT AREA BASED ON SUB-TAB
          ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeSubTab === 'prompt' && (
          <>
            {/* Upper Split View: System Prompt (Left) | User Prompt (Right) */}
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
                          setSystemPrompt('You are an Antidetect Automation Agent. Use the available MCP tools to control browser profiles, navigate safely, bypass bot protections, and extract data stealthily. Always verify profile fingerprint integrity and proxy status before sensitive actions.');
                        } else if (e.target.value === 'warmup') {
                          setSystemPrompt('You are a Social Account Warmup Agent. Launch browser profiles, emulate natural human typing and scrolling, visit random top authority sites, and maintain long residential proxy sessions.');
                        } else {
                          setSystemPrompt('You are a helpful AI assistant. Use the available tools to answer the user\'s questions thoroughly.');
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
                      onClick={() => setUserPrompt("Launch profile 'TikTok US #1', navigate to https://tiktok.com, bypass captcha if detected, and report cookies.")}
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
                  onKeyDown={handleKeyDown}
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
                      onClick={() => showToast?.('Chọn file kịch bản / cookies để đính kèm')}
                      className="btn-icon-subtle"
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 2 }}
                      title="Attach file"
                    >
                      <Paperclip size={14} />
                    </button>
                    <button
                      onClick={() => showToast?.('Chọn thư mục profile để đính kèm')}
                      className="btn-icon-subtle"
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

            {/* Lower Split View: 3 Columns Debugger (Sessions | Turns | Trace) */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
              {/* ── COLUMN 1: SESSIONS ── */}
              <div
                style={{
                  width: '240px',
                  minWidth: '220px',
                  borderRight: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FAFAFA'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: '1px solid #E2E8F0',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    Sessions ({sessions.length})
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Xóa tất cả các session đã debug?')) {
                        setSessions([]);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                    title="Options"
                  >
                    <MoreHorizontal size={14} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                  {sessions.length === 0 ? (
                    <div style={{ padding: '20px 10px', textAlign: 'center', color: '#94A3B8', fontSize: '12px' }}>
                      Chưa có session nào. Nhấn Run để bắt đầu.
                    </div>
                  ) : (
                    sessions.map((s) => {
                      const isSelected = s.id === selectedSessionId;
                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            setSelectedSessionId(s.id);
                            setSelectedTurnId(s.turns?.[0]?.id || null);
                            setSelectedStepId(s.turns?.[0]?.steps?.[0]?.id || null);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                            border: isSelected ? '1px solid #D8DCE3' : '1px solid transparent',
                            boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            marginBottom: '4px',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor:
                                  s.status === 'success'
                                    ? '#10B981'
                                    : s.status === 'error'
                                    ? '#EF4444'
                                    : '#3B82F6'
                              }}
                            />
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1E293B',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {s.title}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: '11px',
                              color: '#64748B',
                              display: 'flex',
                              gap: '6px',
                              marginBottom: '3px'
                            }}
                          >
                            <span>{s.turnsCount} turn · {s.stepsCount} steps · {s.duration}</span>
                          </div>

                          <div style={{ fontSize: '10px', color: '#94A3B8' }}>{s.model}</div>

                          {s.errorSnippet && (
                            <div
                              style={{
                                marginTop: '4px',
                                fontSize: '11px',
                                color: '#EF4444',
                                lineHeight: '1.3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}
                            >
                              {s.errorSnippet}
                            </div>
                          )}

                          {s.statusSnippet && (
                            <div
                              style={{
                                marginTop: '4px',
                                fontSize: '11px',
                                color: '#059669',
                                lineHeight: '1.3',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {s.statusSnippet}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ── COLUMN 2: TURNS ── */}
              <div
                style={{
                  width: '280px',
                  minWidth: '240px',
                  borderRight: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #E2E8F0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748B',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  Turns
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                  {!selectedSession ? (
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94A3B8',
                        fontSize: '12px',
                        textAlign: 'center',
                        padding: '20px'
                      }}
                    >
                      <Bot size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
                      <span>Click a session on the left to view turns</span>
                    </div>
                  ) : selectedSession.turns?.length === 0 ? (
                    <div style={{ color: '#94A3B8', fontSize: '12px', textAlign: 'center', marginTop: '20px' }}>
                      No turns in this session.
                    </div>
                  ) : (
                    selectedSession.turns.map((turn) => {
                      const isTurnSelected = turn.id === selectedTurnId;
                      return (
                        <div
                          key={turn.id}
                          onClick={() => {
                            setSelectedTurnId(turn.id);
                            setSelectedStepId(turn.steps?.[0]?.id || null);
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: '6px',
                            backgroundColor: isTurnSelected ? '#F8FAFC' : '#FFFFFF',
                            border: isTurnSelected ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1E293B' }}>{turn.title}</span>
                            <span style={{ fontSize: '10px', color: '#64748B' }}>{turn.duration}</span>
                          </div>

                          <div
                            style={{
                              fontSize: '12px',
                              color: '#334155',
                              backgroundColor: '#F1F5F9',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              marginBottom: '6px',
                              lineHeight: '1.4'
                            }}
                          >
                            <span style={{ fontWeight: 600, color: '#64748B', marginRight: '4px' }}>User:</span>
                            {turn.userPrompt}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#64748B' }}>
                            <span>{turn.toolsCalled} tools</span>
                            <span>•</span>
                            <span>{turn.tokens} tokens</span>
                            <span
                              style={{
                                marginLeft: 'auto',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: turn.status === 'success' ? '#10B981' : turn.status === 'error' ? '#EF4444' : '#3B82F6'
                              }}
                            />
                          </div>

                          {turn.error && (
                            <div
                              style={{
                                marginTop: '6px',
                                padding: '6px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#FEF2F2',
                                border: '1px solid #FEE2E2',
                                fontSize: '11px',
                                color: '#DC2626'
                              }}
                            >
                              {turn.error}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ── COLUMN 3: TRACE ── */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    padding: '8px 16px',
                    borderBottom: '1px solid #E2E8F0',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#64748B',
                    backgroundColor: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Trace</span>
                  {selectedTurn?.steps?.length > 0 && (
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      {selectedTurn.steps.length} MCP calls recorded
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {!selectedTurn || (!selectedTurn.steps || selectedTurn.steps.length === 0) ? (
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#94A3B8',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <Play size={26} style={{ marginBottom: '8px', opacity: 0.35 }} />
                      <span>Select a session or click Run to start</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {selectedTurn.steps.map((step, idx) => {
                        const isExpanded = (selectedStepId === step.id) || (selectedStepId === null && idx === 0);

                        return (
                          <div
                            key={step.id}
                            style={{
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              backgroundColor: '#FFFFFF',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Step Header */}
                            <div
                              onClick={() => setSelectedStepId(isExpanded ? null : step.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 14px',
                                backgroundColor: isExpanded ? '#F8FAFC' : '#FFFFFF',
                                cursor: 'pointer',
                                borderBottom: isExpanded ? '1px solid #E2E8F0' : 'none'
                              }}
                            >
                              <span style={{ color: '#64748B' }}>
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </span>

                              <span
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  backgroundColor: '#EDE9FE',
                                  color: '#7C3AED',
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  fontFamily: 'monospace'
                                }}
                              >
                                {step.tool}
                              </span>

                              <span
                                style={{
                                  fontSize: '11px',
                                  color: '#059669',
                                  backgroundColor: '#ECFDF5',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  fontWeight: 600
                                }}
                              >
                                {step.statusCode || 200} OK
                              </span>

                              <span style={{ fontSize: '11px', color: '#94A3B8', marginLeft: 'auto' }}>
                                {step.duration}
                              </span>
                            </div>

                            {/* Step Body (Payload inspector) */}
                            {isExpanded && (
                              <div style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px', marginBottom: '8px' }}>
                                  <button
                                    onClick={() => setStepTab('args')}
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      color: stepTab === 'args' ? '#7C3AED' : '#64748B',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '2px 4px',
                                      borderBottom: stepTab === 'args' ? '2px solid #7C3AED' : 'none'
                                    }}
                                  >
                                    Arguments
                                  </button>
                                  <button
                                    onClick={() => setStepTab('result')}
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      color: stepTab === 'result' ? '#7C3AED' : '#64748B',
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: '2px 4px',
                                      borderBottom: stepTab === 'result' ? '2px solid #7C3AED' : 'none'
                                    }}
                                  >
                                    Response / Result
                                  </button>
                                </div>

                                {stepTab === 'args' ? (
                                  <pre
                                    style={{
                                      backgroundColor: '#1E293B',
                                      color: '#E2E8F0',
                                      padding: '10px 12px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontFamily: 'Consolas, monospace',
                                      overflowX: 'auto',
                                      margin: 0
                                    }}
                                  >
                                    {JSON.stringify(step.args, null, 2)}
                                  </pre>
                                ) : (
                                  <pre
                                    style={{
                                      backgroundColor: '#1E293B',
                                      color: '#34D399',
                                      padding: '10px 12px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontFamily: 'Consolas, monospace',
                                      overflowX: 'auto',
                                      margin: 0
                                    }}
                                  >
                                    {JSON.stringify(step.result, null, 2)}
                                  </pre>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── SUB-TAB 2: TOOLS (9) ── */}
        {activeSubTab === 'tools' && (
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
        )}

        {/* ── SUB-TAB 3: SKILLS ── */}
        {activeSubTab === 'skills' && (
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>
              Pre-built Agent Skills
            </h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '12px', color: '#64748B' }}>
              Composite high-level capabilities chaining multiple MCP tools for autonomous browser operations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={16} style={{ color: '#7C3AED' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Stealth Social Account Warmup</span>
                  <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
                  Autonomously visits authority domains (Wikipedia, News, Reddit), conducts organic searches, moves mouse organically, and gathers trusted cookies before entering social platforms.
                </p>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Tools chained: <code>antidetect_launch_profile</code> ➔ <code>antidetect_navigate</code> ➔ <code>antidetect_human_click</code>
                </div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Shield size={16} style={{ color: '#2563EB' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Cloudflare Turnstile & reCAPTCHA Auto-Bypass</span>
                  <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
                  Detects challenge iframes, waits for domestic canvas stability, solves Turnstile box with human click coordinates, or calls audio captcha AI transcript.
                </p>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Tools chained: <code>antidetect_bypass_captcha</code> ➔ <code>antidetect_human_click</code>
                </div>
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <RotateCw size={16} style={{ color: '#D97706' }} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Proxy Auto-Failover & IP Health Audit</span>
                  <span style={{ fontSize: '11px', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Ready</span>
                </div>
                <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0' }}>
                  Tests IP fraud score against Scamalytics / IP-API, automatically calls proxy provider rotate endpoint if blacklisted, and verifies DNS leak.
                </p>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Tools chained: <code>antidetect_rotate_proxy</code> ➔ <code>antidetect_navigate</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SUB-TAB 4: AUTH ── */}
        {activeSubTab === 'auth' && (
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
                  onClick={() => showToast?.('API Key đã được lưu thành công!')}
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
        )}

        {/* ── SUB-TAB 5: SETTINGS ── */}
        {activeSubTab === 'settings' && (
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
        )}
      </div>
    </div>
  );
}
