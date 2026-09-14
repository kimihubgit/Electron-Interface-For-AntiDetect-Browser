import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_HISTORY_RECORDS } from '../constants/initialData';

/**
 * Hook that owns all profile run history sessions, filtering, and selection state.
 * Reference-stabilized with useCallback and useMemo.
 */
export function useHistory(addLog, currentUser = null) {
  const userScopeKey = currentUser
    ? (currentUser.workspace?.id || currentUser.id || (currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, '_') : 'user'))
    : 'guest';
  const isRealUser = Boolean(currentUser && !currentUser.isOffline);

  const historyKey = isRealUser ? `antidetect_history_${userScopeKey}` : 'antidetect_history';
  const [historyRecords, setHistoryRecords] = useLocalStorage(historyKey, isRealUser ? [] : INITIAL_HISTORY_RECORDS);
  const [selectedHistoryId, setSelectedHistoryId] = useState(() => {
    return isRealUser ? null : (INITIAL_HISTORY_RECORDS[0]?.id || null);
  });
  const [historyScope, setHistoryScope] = useState('all'); // 'all' | 'running' | 'completed'
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  const addHistoryRecord = useCallback((record) => {
    const isRunning = record.status === 'running';
    const operatorName = currentUser?.full_name || currentUser?.name || currentUser?.username || 'Người dùng';
    const newRecord = {
      id: `run-${Date.now().toString().slice(-6)}`,
      startTime: new Date().toLocaleString('vi-VN'),
      endTime: isRunning ? 'Đang chạy...' : new Date().toLocaleTimeString('vi-VN'),
      dateGroup: `Hôm nay (${new Date().toLocaleDateString('vi-VN')})`,
      operator: operatorName,
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
  }, [addLog, setHistoryRecords]);

  const deleteHistoryRecord = useCallback((id) => {
    setHistoryRecords(prev => {
      const next = prev.filter(item => item.id !== id);
      setSelectedHistoryId(curr => curr === id ? (next[0]?.id || null) : curr);
      return next;
    });
  }, [setHistoryRecords]);

  const deleteHistoryGroup = useCallback((dateGroup) => {
    setHistoryRecords(prev => {
      const next = prev.filter(item => (item.dateGroup || 'Hôm nay') !== dateGroup);
      setSelectedHistoryId(curr => {
        const currentItem = prev.find(item => item.id === curr);
        if (currentItem && (currentItem.dateGroup || 'Hôm nay') === dateGroup) {
          return next[0]?.id || null;
        }
        return curr;
      });
      return next;
    });
    if (addLog) addLog(`Đã xóa toàn bộ lịch sử ngày: ${dateGroup}`, 'warn');
  }, [addLog, setHistoryRecords]);

  const clearHistory = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chạy profile?')) {
      setHistoryRecords([]);
      setSelectedHistoryId(null);
      if (addLog) addLog('Đã dọn sạch toàn bộ nhật ký phiên chạy profile', 'warn');
    }
  }, [addLog, setHistoryRecords]);

  return useMemo(() => ({
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
  }), [
    historyRecords,
    selectedHistoryId,
    historyScope,
    historySearchTerm,
    setHistoryRecords,
    addHistoryRecord,
    deleteHistoryRecord,
    deleteHistoryGroup,
    clearHistory
  ]);
}
