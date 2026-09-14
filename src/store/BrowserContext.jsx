import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useAppState } from './useAppState';
import { useProfiles } from './useProfiles';
import { useProxies } from './useProxies';
import { useHistory } from './useHistory';
import { useWorkspaces } from './useWorkspaces';
import { useNotifications } from './useNotifications';

const BrowserContext = createContext(null);

export const useBrowser = () => useContext(BrowserContext);

/**
 * Root provider that composes all sub-hooks into a single context.
 * Uses useMemo and useCallback to avoid full-tree re-renders on every tick.
 */
export const BrowserProvider = ({ children }) => {
  const appState = useAppState();
  const {
    addLog,
    setActiveProfileModal,
    setActiveProxyModal,
    currentUser,
    setCurrentUser,
    showToast,
    setCurrentPlan
  } = appState;

  const workspaceActions = useWorkspaces(currentUser, setCurrentUser, addLog, showToast, setCurrentPlan);
  const historyActions = useHistory(addLog, currentUser);
  const profileActions = useProfiles(addLog, historyActions.addHistoryRecord, currentUser, workspaceActions.currentWorkspace, setCurrentUser);
  const proxyActions = useProxies(addLog, currentUser);
  const notificationActions = useNotifications(currentUser);

  const { saveProfile: baseSaveProfile, batchCreateProfiles: baseBatchCreateProfiles } = profileActions;
  const { addProxy: baseAddProxy } = proxyActions;

  // Wrap saveProfile / addProxy / batchCreateProfiles so they auto-close their modals
  const saveProfile = useCallback(
    (data) => baseSaveProfile(data, () => setActiveProfileModal(null)),
    [baseSaveProfile, setActiveProfileModal]
  );

  const batchCreateProfiles = useCallback(
    (list) => baseBatchCreateProfiles?.(list, () => setActiveProfileModal(null)),
    [baseBatchCreateProfiles, setActiveProfileModal]
  );

  const addProxy = useCallback(
    (data) => baseAddProxy(data, () => setActiveProxyModal(false)),
    [baseAddProxy, setActiveProxyModal]
  );

  // Memoize the composed context value to avoid re-rendering entire app when sub-states stay unchanged
  const contextValue = useMemo(() => ({
    ...appState,
    ...workspaceActions,
    ...profileActions,
    ...proxyActions,
    ...historyActions,
    ...notificationActions,
    saveProfile,
    batchCreateProfiles,
    addProxy,
  }), [
    appState,
    workspaceActions,
    profileActions,
    proxyActions,
    historyActions,
    notificationActions,
    saveProfile,
    batchCreateProfiles,
    addProxy
  ]);

  return (
    <BrowserContext.Provider value={contextValue}>
      {children}
    </BrowserContext.Provider>
  );
};
