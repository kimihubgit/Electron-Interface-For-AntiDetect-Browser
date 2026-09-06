import { useState } from 'react';

/**
 * Hook that owns UI navigation state, modal visibility, and system logs.
 */
export function useAppState() {
  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [activeProfileModal, setActiveProfileModal] = useState(null);
  const [activeProxyModal, setActiveProxyModal] = useState(false);
  const [activeUpgradeModal, setActiveUpgradeModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Gói Miễn Phí (Trial)');
  const [systemLogs, setSystemLogs] = useState([]);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setSystemLogs(prev => [{ id: Date.now(), time, msg, type }, ...prev.slice(0, 49)]);
  };

  return {
    activeTab, setActiveTab,
    selectedGroup, setSelectedGroup,
    activeProfileModal, setActiveProfileModal,
    activeProxyModal, setActiveProxyModal,
    activeUpgradeModal, setActiveUpgradeModal,
    currentPlan, setCurrentPlan,
    systemLogs, addLog,
  };
}
