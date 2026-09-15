import React from 'react';
import PromptSplitView from '../components/PromptSplitView';
import SessionsColumn from '../components/SessionsColumn';
import TurnsColumn from '../components/TurnsColumn';
import TraceColumn from '../components/TraceColumn';

export default function AgentDebuggerTab({
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
  clearAfterSend,
  setClearAfterSend,
  onKeyDown,
  sessions,
  selectedSessionId,
  setSelectedSessionId,
  selectedSession,
  selectedTurnId,
  setSelectedTurnId,
  selectedTurn,
  selectedStepId,
  setSelectedStepId,
  stepTab,
  setStepTab,
  onClearSessions
}) {
  return (
    <>
      <PromptSplitView
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        clearAfterSend={clearAfterSend}
        setClearAfterSend={setClearAfterSend}
        onKeyDown={onKeyDown}
      />

      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        <SessionsColumn
          sessions={sessions}
          selectedSessionId={selectedSessionId}
          onSelectSession={(s) => {
            setSelectedSessionId(s.id);
            setSelectedTurnId(s.turns?.[0]?.id || null);
            setSelectedStepId(s.turns?.[0]?.steps?.[0]?.id || null);
          }}
          onClearSessions={onClearSessions}
        />

        <TurnsColumn
          selectedSession={selectedSession}
          selectedTurnId={selectedTurnId}
          onSelectTurn={(turn) => {
            setSelectedTurnId(turn.id);
            setSelectedStepId(turn.steps?.[0]?.id || null);
          }}
        />

        <TraceColumn
          selectedTurn={selectedTurn}
          selectedStepId={selectedStepId}
          onSelectStepId={setSelectedStepId}
          stepTab={stepTab}
          setStepTab={setStepTab}
        />
      </div>
    </>
  );
}
