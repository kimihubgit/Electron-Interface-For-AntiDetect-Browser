import { useState } from 'react';

/**
 * Hook that owns UI navigation state, authentication, modal visibility, and system logs.
 */
export function useAppState() {
  // Authentication state - defaults to false so Login screen shows on app launch
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('profiles');
  const [activeProxySubTab, setActiveProxySubTab] = useState('pool'); // 'pool' | 'rotator' | 'ipv6' | 'dcom' | 'rules'
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedProxyFilter, setSelectedProxyFilter] = useState('All');
  const [activeProfileModal, setActiveProfileModal] = useState(null);
  const [activeProxyModal, setActiveProxyModal] = useState(false);
  const [activeUpgradeModal, setActiveUpgradeModal] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState(false);
  const [activeProxyRequestModal, setActiveProxyRequestModal] = useState(false); // Modal bypass-proxy network inspector
  const [activeReferralModal, setActiveReferralModal] = useState(false); // false | true | 'referrals' | 'project'
  const [activeTrashModal, setActiveTrashModal] = useState(false);
  const [activeGroupModal, setActiveGroupModal] = useState(null); // null | { mode: 'create' } | { mode: 'edit', group }
  const [activeSettingsSection, setActiveSettingsSection] = useState('browser'); // 'browser' | 'general' | 'content' | 'display' | 'core' | 'license'
  const [currentPlan, setCurrentPlan] = useState('Gói Miễn Phí (Trial)');
  const [systemLogs, setSystemLogs] = useState([]);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const addLog = (msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    setSystemLogs(prev => [{ id: Date.now(), time, msg, type }, ...prev.slice(0, 49)]);
  };

  const login = (userData = {}) => {
    const user = {
      name: userData.name || (userData.email ? userData.email.split('@')[0] : 'Admin User'),
      email: userData.email || 'developer@apidog.com',
      avatar: userData.avatar || null,
      provider: userData.provider || 'email',
      isOffline: false,
      ...userData
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    addLog(`Đăng nhập thành công với tài khoản: ${user.email}`, 'success');
  };

  const useOfflineSpace = () => {
    setCurrentUser({ name: 'Offline Space', email: 'offline@local', isOffline: true });
    setIsAuthenticated(true);
    addLog('Đang sử dụng phiên bản Không Gian Offline (Offline Space)', 'info');
  };

  const [isReloading, setIsReloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reloadApp = (delayMs = 900) => {
    if (isReloading) return;
    setIsReloading(true);
    addLog('Đang tải lại giao diện ứng dụng...', 'info');

    setTimeout(() => {
      setReloadKey(prev => prev + 1);
      setIsReloading(false);
      addLog('Tải lại giao diện hoàn tất.', 'success');
    }, delayMs);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    addLog('Đã đăng xuất khỏi tài khoản', 'warn');
  };

  return {
    isAuthenticated, setIsAuthenticated,
    currentUser, login, useOfflineSpace, logout,
    activeTab, setActiveTab,
    activeProxySubTab, setActiveProxySubTab,
    selectedGroup, setSelectedGroup,
    selectedProxyFilter, setSelectedProxyFilter,
    activeProfileModal, setActiveProfileModal,
    activeProxyModal, setActiveProxyModal,
    activeUpgradeModal, setActiveUpgradeModal,
    activeSettingsModal, setActiveSettingsModal,
    activeSettingsSection, setActiveSettingsSection,
    activeProxyRequestModal, setActiveProxyRequestModal,
    activeReferralModal, setActiveReferralModal,
    activeTrashModal, setActiveTrashModal,
    activeGroupModal, setActiveGroupModal,
    currentPlan, setCurrentPlan,
    systemLogs, addLog,
    toasts, showToast, removeToast,
    isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
    isReloading, setIsReloading, reloadApp, reloadKey,
  };
}
