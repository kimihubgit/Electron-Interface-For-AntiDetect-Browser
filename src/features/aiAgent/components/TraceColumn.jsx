import React from 'react';
import { Play, ChevronDown, ChevronRight } from 'lucide-react';

export default function TraceColumn({
  selectedTurn,
  selectedStepId,
  onSelectStepId,
  stepTab,
  setStepTab
}) {
  return (
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
                    onClick={() => onSelectStepId(isExpanded ? null : step.id)}
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
  );
}
