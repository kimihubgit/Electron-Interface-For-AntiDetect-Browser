import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { checkAppUpdate } from '../services/updateService';
import { toastStore } from './toastStore';
import {
  clearAuthSession,
  getAuthToken,
  getStoredUser,
  getStoredWorkspace,
  getCurrentUserApi,
  getAuthMeApi,
  getUserInfoApi,
  logoutWithApi,
  deleteAccountApi
} from '../services/authService';

/**
 * Hook that owns UI navigation state, authentication, modal visibility, and system logs.
 * All action functions are wrapped in useCallback to stabilize references.
 */
export function useAppState() {
  // Authentication state - restore session from localStorage if token & user exist
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = getAuthToken();
    const user = getStoredUser();
    return Boolean(token && user);
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const token = getAuthToken();
    const user = getStoredUser();
    if (token && user) {
      const workspace = getStoredWorkspace();
      return {
        name: user.full_name || user.username || (user.email ? user.email.split('@')[0] : 'Người dùng'),
        email: user.email || 'user@antidetect.io',
        avatar: user.avatar || null,
        provider: 'api',
        isOffline: false,
        workspace: workspace,
        ...user
      };
    }
    return null;
  });

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

  const [currentPlan, setCurrentPlan] = useState(() => {
    const user = getStoredUser();
    if (user?.packageName) return user.packageName;
    const ws = getStoredWorkspace();
    if (ws?.plan_id) {
      return ws.plan_id === 'plan_free' ? 'Gói Miễn Phí (Starter Free)' : ws.plan_id;
    }
    return 'Gói Miễn Phí (Trial)';
  });

  // Bước 2 (Init App): Xác thực token và nạp toàn bộ User Info khi mở ứng dụng
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    getUserInfoApi(token).then((res) => {
      if (res.success && res.user) {
        setCurrentUser((prev) => ({
          ...prev,
          name: res.user.full_name || res.user.username || (res.user.email ? res.user.email.split('@')[0] : 'User'),
          email: res.user.email,
          workspace: res.workspace,
          ...res.user
        }));
        if (res.user.packageName) {
          setCurrentPlan(res.user.packageName);
        } else if (res.workspace?.plan_id) {
          setCurrentPlan(res.workspace.plan_id === 'plan_free' ? 'Gói Miễn Phí (Starter Free)' : res.workspace.plan_id);
        }
      } else if (res.statusCode === 401) {
        // Token has expired or is invalid
        clearAuthSession();
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }).catch((err) => {
      console.warn('Session verification error:', err);
    });
  }, []);

  // Ref-based system logs: avoids triggering React tree re-renders on internal logging
  const systemLogsRef = useRef([]);

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    return toastStore.showToast(message, type, duration);
  }, []);

  const removeToast = useCallback((id) => {
    toastStore.removeToast(id);
  }, []);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setIsSidebarCollapsed(prev => !prev), []);

  const addLog = useCallback((msg, type = 'info') => {
    const time = new Date().toLocaleTimeString('vi-VN');
    systemLogsRef.current = [{ id: Date.now(), time, msg, type }, ...systemLogsRef.current.slice(0, 49)];
  }, []);

  const login = useCallback((userData = {}) => {
    const user = {
      name: userData.full_name || userData.username || userData.name || (userData.email ? userData.email.split('@')[0] : 'Người dùng'),
      email: userData.email || 'user@antidetect.io',
      avatar: userData.avatar || null,
      provider: userData.provider || 'email',
      isOffline: false,
      workspace: userData.workspace || null,
      ...userData
    };
    setCurrentUser(user);
    if (userData.packageName) {
      setCurrentPlan(userData.packageName);
    } else if (userData.workspace?.plan_id) {
      setCurrentPlan(userData.workspace.plan_id === 'plan_free' ? 'Gói Miễn Phí (Starter Free)' : userData.workspace.plan_id);
    }
    setIsAuthenticated(true);
    addLog(`Đăng nhập thành công với tài khoản: ${user.email}`, 'success');
  }, [addLog]);

  const useOfflineSpace = useCallback(() => {
    setCurrentUser({ name: 'Offline Space', email: 'offline@local', isOffline: true });
    setIsAuthenticated(true);
    addLog('Đang sử dụng phiên bản Không Gian Offline (Offline Space)', 'info');
  }, [addLog]);

  const [isReloading, setIsReloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reloadApp = useCallback((delayMs = 900) => {
    setIsReloading(true);
    addLog('Đang tải lại giao diện ứng dụng...', 'info');

    setTimeout(() => {
      setReloadKey(prev => prev + 1);
      setIsReloading(false);
      addLog('Tải lại giao diện hoàn tất.', 'success');
    }, delayMs);
  }, [addLog]);

  const [updateModalInfo, setUpdateModalInfo] = useState(null);
  const [isUpdateChecking, setIsUpdateChecking] = useState(false);

  const checkUpdate = useCallback(async (silent = false, versionOverride = null) => {
    setIsUpdateChecking(true);
    try {
      const res = await checkAppUpdate(versionOverride);
      if (res.hasUpdate) {
        setUpdateModalInfo(res);
      } else {
        if (!silent) {
          showToast(`Bạn đang sử dụng phiên bản v${res.currentVersion} mới nhất!`, 'success');
        }
      }
      return res;
    } catch (e) {
      if (!silent) {
        showToast(`Lỗi kiểm tra cập nhật: ${e.message}`, 'error');
      }
    } finally {
      setIsUpdateChecking(false);
    }
  }, [showToast]);

  const logout = useCallback(async () => {
    const token = getAuthToken();
    try {
      if (token) {
        await logoutWithApi(token);
      }
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      clearAuthSession();
      setCurrentUser(null);
      setIsAuthenticated(false);
      addLog('Đã đăng xuất khỏi tài khoản', 'warn');
    }
  }, [addLog]);

  const openLoginForNewAccount = useCallback(() => {
    // Keep saved accounts in localStorage intact so no accounts are lost
    // Switch to standard Login screen to log in or register a new account
    clearAuthSession();
    setCurrentUser(null);
    setIsAuthenticated(false);
    addLog('Chuyển về màn hình đăng nhập để thêm tài khoản mới', 'info');
  }, [addLog]);

  const deleteAccount = useCallback(async ({ password, reason = '' } = {}) => {
    const token = getAuthToken();
    if (!token) {
      return { success: false, error: 'Chưa đăng nhập' };
    }
    try {
      const res = await deleteAccountApi({ password, reason }, token);
      if (res.success) {
        setCurrentUser(null);
        setIsAuthenticated(false);
        addLog('Tài khoản đã được xóa vĩnh viễn', 'warn');
        return { success: true, message: res.message };
      }
      return res;
    } catch (err) {
      return { success: false, error: err.message || 'Lỗi khi xóa tài khoản' };
    }
  }, [addLog]);

  return useMemo(() => ({
    isAuthenticated, setIsAuthenticated,
    currentUser, login, useOfflineSpace, logout, deleteAccount, openLoginForNewAccount,
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
    updateModalInfo, setUpdateModalInfo,
    isUpdateChecking, checkUpdate,
    currentPlan, setCurrentPlan,
    systemLogs: systemLogsRef.current, addLog,
    toasts: [], showToast, removeToast,
    isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
    isReloading, setIsReloading, reloadApp, reloadKey,
  }), [
    isAuthenticated,
    currentUser,
    activeTab,
    activeProxySubTab,
    selectedGroup,
    selectedProxyFilter,
    activeProfileModal,
    activeProxyModal,
    activeUpgradeModal,
    activeSettingsModal,
    activeSettingsSection,
    activeProxyRequestModal,
    activeReferralModal,
    activeTrashModal,
    activeGroupModal,
    updateModalInfo,
    isUpdateChecking,
    currentPlan,
    isSidebarCollapsed,
    isReloading,
    reloadKey,
    login,
    useOfflineSpace,
    logout,
    deleteAccount,
    openLoginForNewAccount,
    showToast,
    removeToast,
    toggleSidebar,
    addLog,
    checkUpdate,
    reloadApp
  ]);
}
