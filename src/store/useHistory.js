import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_HISTORY_RECORDS } from '../constants/initialData';

/**
 * Hook that owns all profile run history sessions, filtering, and selection state.
 */
export function useHistory(addLog) {
  const [historyRecords, setHistoryRecords] = useLocalStorage('antidetect_history', INITIAL_HISTORY_RECORDS);
  const [selectedHistoryId, setSelectedHistoryId] = useState(() => {
    return INITIAL_HISTORY_RECORDS[0]?.id || null;
  });
  const [historyScope, setHistoryScope] = useState('all'); // 'all' | 'running' | 'completed'
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  const addHistoryRecord = (record) => {
    const isRunning = record.status === 'running';
    const newRecord = {
      id: `run-${Date.now().toString().slice(-6)}`,
      startTime: new Date().toLocaleString('vi-VN'),
      endTime: isRunning ? 'Đang chạy...' : new Date().toLocaleTimeString('vi-VN'),
      dateGroup: `Hôm nay (${new Date().toLocaleDateString('vi-VN')})`,
      operator: 'Võ Văn Khải',
      status: record.status || 'running',
      statusLabel: isRunning ? 'Đang chạy' : record.status === 'stopped' ? 'Đã dừng' : 'Hoàn thành',
      statusColor: isRunning ? '#10B981' : record.status === 'stopped' ? '#6B7280' : '#10B981',
      processPid: record.processPid || Math.floor(10000 + Math.random() * 90000),
      memoryUsage: isRunning ? `${Math.floor(300 + Math.random() * 250)} MB` : '0 MB',
      cpuUsage: isRunning ? `${(Math.random() * 8 + 2).toFixed(1)}%` : '0%',
      ...record
    };

    setHistoryRecords(prev => [newRecord, ...prev]);
    setSelectedHistoryId(newRecord.id);
    if (addLog) {
      addLog(`Lịch sử: Đã ghi nhận phiên chạy "${newRecord.profileName || newRecord.targetUrl}"`, 'info');
    }
  };

  const deleteHistoryRecord = (id) => {
    setHistoryRecords(prev => prev.filter(item => item.id !== id));
    if (selectedHistoryId === id) {
      const remaining = historyRecords.filter(item => item.id !== id);
      setSelectedHistoryId(remaining[0]?.id || null);
    }
  };

  const deleteHistoryGroup = (dateGroup) => {
    setHistoryRecords(prev => prev.filter(item => (item.dateGroup || 'Hôm nay') !== dateGroup));
    const current = historyRecords.find(item => item.id === selectedHistoryId);
    if (current && (current.dateGroup || 'Hôm nay') === dateGroup) {
      const remaining = historyRecords.filter(item => (item.dateGroup || 'Hôm nay') !== dateGroup);
      setSelectedHistoryId(remaining[0]?.id || null);
    }
    if (addLog) addLog(`Đã xóa toàn bộ lịch sử ngày: ${dateGroup}`, 'warn');
  };

  const clearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chạy profile?')) {
      setHistoryRecords([]);
      setSelectedHistoryId(null);
      if (addLog) addLog('Đã dọn sạch toàn bộ nhật ký phiên chạy profile', 'warn');
    }
  };

  return {
    historyRecords,
    setHistoryRecords,
    selectedHistoryId,
    setSelectedHistoryId,
    historyScope,
    setHistoryScope,
    historySearchTerm,
    setHistorySearchTerm,
    addHistoryRecord,
    deleteHistoryRecord,
    deleteHistoryGroup,
    clearHistory
  };
}
