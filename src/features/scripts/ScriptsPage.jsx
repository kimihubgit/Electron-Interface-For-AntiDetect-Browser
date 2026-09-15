import React, { useState } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { DEFAULT_SCRIPTS, INITIAL_SCRIPT_LOGS } from './data/defaultScripts';
import ScriptsHeader from './components/ScriptsHeader';
import ScriptsSubNav from './components/ScriptsSubNav';
import ScriptCard from './components/ScriptCard';
import ScriptLogsTerminal from './components/ScriptLogsTerminal';

export default function ScriptsPage() {
  const { addLog } = useBrowser();

  const [activeSubTab, setActiveSubTab] = useState('templates');
  const [runningScriptId, setRunningScriptId] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [scripts] = useState(DEFAULT_SCRIPTS);
  const [logs, setLogs] = useState(INITIAL_SCRIPT_LOGS);

  const handleRunScript = (script) => {
    setRunningScriptId(script.id);
    if (addLog) addLog(`▶ Đang chạy kịch bản mã nguồn: "${script.name}"`, 'success');
    
    setLogs(prev => [
      `[${new Date().toLocaleTimeString('vi-VN')}] [START] Chạy file script "${script.name}"...`,
      ...prev
    ]);

    setTimeout(() => {
      setRunningScriptId(null);
      if (addLog) addLog(`✓ Kịch bản "${script.name}" đã thực thi thành công!`, 'success');
      setLogs(prev => [
        `[${new Date().toLocaleTimeString('vi-VN')}] [DONE] Hoàn tất script "${script.name}".`,
        ...prev
      ]);
    }, 2000);
  };

  const handleCopyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    if (addLog) addLog('Đã sao chép mã kịch bản vào clipboard', 'info');
  };

  const handleCreateScript = () => {
    alert('Mở trình tạo script mới');
  };

  const filteredScripts = scripts.filter(s => 
    !searchTerm || 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      flex: 1,
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--apidog-bg)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <ScriptsHeader onCreateScript={handleCreateScript} />

      {/* Sub-tabs & Search */}
      <ScriptsSubNav
        activeSubTab={activeSubTab}
        onTabChange={setActiveSubTab}
        scriptsCount={scripts.length}
        logsCount={logs.length}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '20px 24px' }}>
        {activeSubTab === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredScripts.map(script => (
              <ScriptCard
                key={script.id}
                script={script}
                runningScriptId={runningScriptId}
                copiedKey={copiedKey}
                onCopyCode={handleCopyCode}
                onRunScript={handleRunScript}
              />
            ))}
          </div>
        )}

        {activeSubTab === 'logs' && (
          <ScriptLogsTerminal logs={logs} />
        )}
      </div>
    </div>
  );
}
