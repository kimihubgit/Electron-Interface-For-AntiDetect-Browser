import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { switchWorkspaceApi, getUserInfoApi, getWorkspacesApi, createWorkspaceApi } from '../services/api/authApi';

const DEFAULT_WORKSPACES = [
  {
    id: 'ws_personal',
    name: 'Cá nhân (Personal Workspace)',
    role: 'owner',
    role_name: 'Chủ sở hữu',
    color: '#3B82F6',
    is_default: true
  }
];

function readUserWorkspaces(scopeKey, user) {
  const sKey = `antidetect_workspaces_${scopeKey}`;
  try {
    const raw = localStorage.getItem(sKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}

  // If user has workspace, ensure it's in the list
  if (user?.workspace) {
    const initialWs = {
      id: user.workspace.id || 'ws_personal',
      name: user.workspace.name || 'Personal Workspace',
      role: user.workspace.role || 'owner',
      role_name: user.workspace.role_name || 'Chủ sở hữu',
      color: '#3B82F6',
      is_default: true
    };
    return [initialWs];
  }

  return DEFAULT_WORKSPACES;
}

function readUserActiveWsId(scopeKey, user, wsList) {
  try {
    const saved = localStorage.getItem(`antidetect_active_ws_${scopeKey}`);
    if (saved && wsList.some(w => w && w.id === saved)) return saved;
  } catch {}
  return user?.workspace?.id || wsList[0]?.id || 'ws_personal';
}

function readUserOpenTabs(scopeKey, activeId) {
  try {
    const saved = localStorage.getItem(`antidetect_open_ws_tabs_${scopeKey}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [activeId || 'ws_personal'];
}

export function useWorkspaces(currentUser, setCurrentUser, addLog, showToast, setCurrentPlan) {
  const userScopeKey = currentUser
    ? (currentUser.id || (currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, '_') : 'user'))
    : 'guest';

  const storageKey = `antidetect_workspaces_${userScopeKey}`;

  const [workspaces, setWorkspaces] = useState(() => readUserWorkspaces(userScopeKey, currentUser));
  const [activeWsId, setActiveWsId] = useState(() => readUserActiveWsId(userScopeKey, currentUser, workspaces));
  const [openWorkspaceIds, setOpenWorkspaceIds] = useState(() => readUserOpenTabs(userScopeKey, activeWsId));

  const activeScopeRef = useRef(userScopeKey);

  // When switching accounts (userScopeKey changes), immediately switch workspaces, activeWsId & openWorkspaceIds
  if (activeScopeRef.current !== userScopeKey) {
    activeScopeRef.current = userScopeKey;
    const nextWs = readUserWorkspaces(userScopeKey, currentUser);
    const nextActiveId = readUserActiveWsId(userScopeKey, currentUser, nextWs);
    const nextOpenTabs = readUserOpenTabs(userScopeKey, nextActiveId);

    setWorkspaces(nextWs);
    setActiveWsId(nextActiveId);
    setOpenWorkspaceIds(nextOpenTabs);
  }

  // Keep storage in sync ONLY for the currently active userScopeKey
  useEffect(() => {
    if (activeScopeRef.current === userScopeKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(workspaces));
      } catch {}
    }
  }, [storageKey, workspaces, userScopeKey]);

  useEffect(() => {
    if (activeScopeRef.current === userScopeKey) {
      try {
        localStorage.setItem(`antidetect_open_ws_tabs_${userScopeKey}`, JSON.stringify(openWorkspaceIds));
      } catch {}
    }
  }, [openWorkspaceIds, userScopeKey]);

  useEffect(() => {
    if (activeWsId) {
      try {
        localStorage.setItem('antidetect_active_ws_id', activeWsId);
      } catch {}
    }
  }, [activeWsId]);

  // Sync real workspaces from Backend on login / mount
  useEffect(() => {
    if (currentUser && !currentUser.isOffline) {
      getWorkspacesApi()
        .then(res => {
          if (res.success && Array.isArray(res.workspaces) && res.workspaces.length > 0) {
            const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];
            const normalized = res.workspaces.map((ws, idx) => ({
              id: ws.id,
              name: ws.name,
              role: ws.role || (ws.owner_id === currentUser.id ? 'owner' : 'member'),
              role_name: (ws.role === 'owner' || ws.owner_id === currentUser.id) ? 'Chủ sở hữu' : 'Thành viên',
              color: colors[idx % colors.length],
              is_default: idx === 0 || ws.is_default || ws.id === currentUser.default_workspace_id
            }));

            setWorkspaces(normalized);

            // If activeWsId is not in the loaded list, switch to the first valid one
            setActiveWsId(prev => {
              if (normalized.some(w => w.id === prev)) return prev;
              return normalized[0].id;
            });
          }
        })
        .catch(err => console.warn('Fetch workspaces API error:', err));
    }
  }, [currentUser?.id, userScopeKey]);

  // Current active workspace
  const currentWorkspace = useMemo(() => {
    const list = Array.isArray(workspaces) ? workspaces : DEFAULT_WORKSPACES;
    const found = list.find(w => w && w.id === activeWsId);
    if (found) return found;
    if (currentUser?.workspace?.id) {
      const uFound = list.find(w => w && w.id === currentUser.workspace.id);
      if (uFound) return uFound;
      return currentUser.workspace;
    }
    return list[0] || DEFAULT_WORKSPACES[0];
  }, [activeWsId, currentUser?.workspace, workspaces]);

  // Switch Workspace Handler
  const switchWorkspace = useCallback(async (targetWs) => {
    if (!targetWs || !targetWs.id) return;

    // 1. Immediately update active workspace ID & localStorage
    setActiveWsId(targetWs.id);
    try {
      localStorage.setItem('antidetect_active_ws_id', targetWs.id);
      localStorage.setItem(`antidetect_active_ws_${userScopeKey}`, targetWs.id);
    } catch {}

    // Ensure the switched workspace is in open tabs
    setOpenWorkspaceIds(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(targetWs.id) ? arr : [...arr, targetWs.id];
    });

    try {
      // Call backend API if user is authenticated
      if (currentUser && !currentUser.isOffline) {
        await switchWorkspaceApi(targetWs.id);
        const infoRes = await getUserInfoApi();
        if (infoRes.success && infoRes.user && setCurrentUser) {
          setCurrentUser(infoRes.user);
          if (setCurrentPlan && infoRes.user.packageName) {
            setCurrentPlan(infoRes.user.packageName);
          }
        }
      }
    } catch (e) {
      console.warn('Switch workspace API error:', e);
    }

    // Update currentUser state & localStorage if authenticated (keep user plan intact!)
    if (setCurrentUser) {
      setCurrentUser(prev => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          workspace: targetWs
        };
        try {
          localStorage.setItem('auth_user', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    if (addLog) {
      addLog(`Chuyển không gian làm việc sang: "${targetWs.name}"`, 'info');
    }
  }, [userScopeKey, currentUser, setCurrentUser, setCurrentPlan, addLog]);

  // Open a workspace in a new or existing tab and activate it
  const openWorkspaceTab = useCallback((targetWs) => {
    if (!targetWs || !targetWs.id) return;
    setOpenWorkspaceIds(prev => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(targetWs.id) ? arr : [...arr, targetWs.id];
    });
    switchWorkspace(targetWs);
  }, [switchWorkspace]);

  // Close a workspace tab
  const closeWorkspaceTab = useCallback((wsIdToClose) => {
    const rawIds = Array.isArray(openWorkspaceIds) ? openWorkspaceIds : [];
    const nextIds = rawIds.filter(id => id !== wsIdToClose);
    const validWorkspaces = Array.isArray(workspaces) ? workspaces : DEFAULT_WORKSPACES;
    const remainingIds = nextIds.length > 0 ? nextIds : [validWorkspaces[0]?.id || 'ws_personal'];

    setOpenWorkspaceIds(remainingIds);

    if (activeWsId === wsIdToClose) {
      const nextActiveId = remainingIds[remainingIds.length - 1];
      const nextWs = validWorkspaces.find(w => w && w.id === nextActiveId) || validWorkspaces[0];
      if (nextWs) {
        switchWorkspace(nextWs);
      }
    }
  }, [openWorkspaceIds, activeWsId, workspaces, switchWorkspace]);

  // Close all other workspace tabs except the given one
  const closeOtherWorkspaceTabs = useCallback((keepWsId) => {
    if (!keepWsId) return;
    setOpenWorkspaceIds([keepWsId]);
    const validWorkspaces = Array.isArray(workspaces) ? workspaces : DEFAULT_WORKSPACES;
    const target = validWorkspaces.find(w => w && w.id === keepWsId);
    if (target) {
      switchWorkspace(target);
    }
  }, [workspaces, switchWorkspace]);

  // Create New Workspace Handler
  const createWorkspace = useCallback(async ({ name }) => {
    const cleanName = (name || '').trim();
    if (!cleanName) {
      if (showToast) showToast('Tên không gian làm việc không được để trống!', 'error');
      return null;
    }

    const maxWorkspaces = currentUser?.maxWorkspaces ?? (
      currentUser?.packageId === 'plan_enterprise' ? 999 : (currentUser?.packageId === 'plan_pro' ? 5 : 2)
    );

    if (workspaces.length >= maxWorkspaces) {
      alert(`⚠️ Gói cước tài khoản (${currentUser?.packageName || 'Free Starter'}) chỉ hỗ trợ tối đa ${maxWorkspaces} Không gian làm việc.\nVui lòng nâng cấp gói tài khoản để tạo thêm!`);
      return null;
    }

    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    let createdId = `ws_${Date.now()}`;

    // Call backend API if user is authenticated
    if (currentUser && !currentUser.isOffline) {
      try {
        const apiRes = await createWorkspaceApi({ name: cleanName });
        if (apiRes.success && apiRes.workspace?.id) {
          createdId = apiRes.workspace.id;
        } else if (!apiRes.success) {
          const errMsg = apiRes.error || apiRes.message || 'Máy chủ từ chối tạo Không gian làm việc mới';
          alert(`⚠️ ${errMsg}`);
          return null;
        }
      } catch (err) {
        console.warn('createWorkspaceApi network error:', err);
      }
    }

    const newWs = {
      id: createdId,
      name: cleanName,
      role: 'owner',
      role_name: 'Chủ sở hữu',
      color: randomColor,
      is_default: false,
      createdAt: new Date().toISOString()
    };

    setWorkspaces(prev => [...prev, newWs]);

    // Automatically open as a tab & switch to newly created workspace
    openWorkspaceTab(newWs);

    if (showToast) {
      showToast(`Tạo thành công không gian làm việc mới: "${cleanName}"!`, 'success');
    }
    return newWs;
  }, [setWorkspaces, openWorkspaceTab, showToast, workspaces.length, currentUser]);

  return {
    workspaces,
    currentWorkspace,
    activeWsId,
    openWorkspaceIds,
    switchWorkspace,
    openWorkspaceTab,
    closeWorkspaceTab,
    closeOtherWorkspaceTabs,
    createWorkspace
  };
}
