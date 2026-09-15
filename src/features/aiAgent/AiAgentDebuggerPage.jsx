import React, { useState } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import { ANTIDETECT_MCP_TOOLS, INITIAL_SESSIONS } from './data/agentConstants';
import ModelConfigBar from './components/ModelConfigBar';
import AgentSubTabs from './components/AgentSubTabs';
import AgentDebuggerTab from './tabs/AgentDebuggerTab';
import AgentToolsTab from './tabs/AgentToolsTab';
import AgentSkillsTab from './tabs/AgentSkillsTab';
import AgentAuthTab from './tabs/AgentAuthTab';
import AgentSettingsTab from './tabs/AgentSettingsTab';

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

    // Step 1: Trigger antidetect_launch_profile
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
                    duration: '420ms',
                    status: 'success',
                    statusCode: 200,
                    args: {
                      profileId: 'prof_default_01',
                      stealth: true,
                      headless: false
                    },
                    result: {
                      success: true,
                      wsEndpoint: 'ws://127.0.0.1:9222/devtools/browser/78b9a12c',
                      pid: 14820,
                      proxyApplied: '142.250.190.46:8080'
                    }
                  }
                ]
              };
            })
          };
        })
      );
      setSelectedStepId('step-run-1');
    }, 1100);

    // Step 2: Trigger antidetect_navigate
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
      {/* 1. TOP MODEL CONFIGURATION BAR */}
      <ModelConfigBar
        provider={provider}
        onProviderChange={handleProviderChange}
        model={model}
        setModel={setModel}
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        apiKey={apiKey}
        isRunning={isRunning}
        onRun={handleRun}
        onOpenAuth={() => setActiveSubTab('auth')}
      />

      {/* 2. SUB-NAVIGATION TABS */}
      <AgentSubTabs
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        toolsCount={toolsList.length}
        hasApiKey={Boolean(apiKey.trim())}
      />

      {/* 3. MAIN CONTENT AREA BASED ON SUB-TAB */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeSubTab === 'prompt' && (
          <AgentDebuggerTab
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            clearAfterSend={clearAfterSend}
            setClearAfterSend={setClearAfterSend}
            onKeyDown={handleKeyDown}
            sessions={sessions}
            selectedSessionId={selectedSessionId}
            setSelectedSessionId={setSelectedSessionId}
            selectedSession={selectedSession}
            selectedTurnId={selectedTurnId}
            setSelectedTurnId={setSelectedTurnId}
            selectedTurn={selectedTurn}
            selectedStepId={selectedStepId}
            setSelectedStepId={setSelectedStepId}
            stepTab={stepTab}
            setStepTab={setStepTab}
            onClearSessions={() => setSessions([])}
          />
        )}

        {activeSubTab === 'tools' && (
          <AgentToolsTab toolsList={toolsList} toggleTool={toggleTool} />
        )}

        {activeSubTab === 'skills' && (
          <AgentSkillsTab />
        )}

        {activeSubTab === 'auth' && (
          <AgentAuthTab
            apiKey={apiKey}
            setApiKey={setApiKey}
            onSaveKey={() => showToast?.('API Key đã được lưu thành công!')}
          />
        )}

        {activeSubTab === 'settings' && (
          <AgentSettingsTab
            copyToClipboard={copyToClipboard}
            copiedKey={copiedKey}
          />
        )}
      </div>
    </div>
  );
}
