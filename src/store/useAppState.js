import { useState } from 'react';

/**
 * Hook that owns UI navigation state, authentication, modal visibility, and system logs.
 */
export function useAppState() {
  // Authentication state - defaults to false so Login screen shows on app launch
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('profiles');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedProxyFilter, setSelectedProxyFilter] = useState('All');
  const [activeProfileModal, setActiveProfileModal] = useState(null);
  const [activeProxyModal, setActiveProxyModal] = useState(false);
  const [activeUpgradeModal, setActiveUpgradeModal] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState(false);
  const [activeReferralModal, setActiveReferralModal] = useState(false); // false | true | 'referrals' | 'project'
  const [activeTrashModal, setActiveTrashModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Gói Miễn Phí (Trial)');
  const [systemLogs, setSystemLogs] = useState([]);

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

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    addLog('Đã đăng xuất khỏi tài khoản', 'warn');
  };

  return {
    isAuthenticated, setIsAuthenticated,
    currentUser, login, useOfflineSpace, logout,
    activeTab, setActiveTab,
    selectedGroup, setSelectedGroup,
    selectedProxyFilter, setSelectedProxyFilter,
    activeProfileModal, setActiveProfileModal,
    activeProxyModal, setActiveProxyModal,
    activeUpgradeModal, setActiveUpgradeModal,
    activeSettingsModal, setActiveSettingsModal,
    activeReferralModal, setActiveReferralModal,
    activeTrashModal, setActiveTrashModal,
    currentPlan, setCurrentPlan,
    systemLogs, addLog,
    isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
  };
}
