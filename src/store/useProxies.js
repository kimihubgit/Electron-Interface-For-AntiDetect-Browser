import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROXIES } from '../constants/initialData';

/**
 * Hook that owns all proxy-related state & actions.
 */
export function useProxies(addLog) {
  const [proxies, setProxies] = useLocalStorage('antidetect_proxies', INITIAL_PROXIES);

  const addProxy = (proxyData, closeModal) => {
    const newPx = {
      ...proxyData,
      id: `px-${Date.now().toString().slice(-4)}`,
      status: 'live',
      usedCount: 0,
      latency: Math.floor(20 + Math.random() * 80),
    };
    setProxies(prev => [newPx, ...prev]);
    addLog(`Thêm Proxy mới: ${newPx.type}://${newPx.host}:${newPx.port}`, 'success');
    closeModal();
  };

  const deleteProxy = (proxyId) => {
    setProxies(prev => prev.filter(p => p.id !== proxyId));
    addLog('Đã xóa proxy khỏi danh sách', 'warn');
  };

  return { proxies, addProxy, deleteProxy };
}
