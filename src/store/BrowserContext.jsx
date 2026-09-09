import React, { createContext, useContext } from 'react';
import { useAppState } from './useAppState';
import { useProfiles } from './useProfiles';
import { useProxies } from './useProxies';
import { useHistory } from './useHistory';

const BrowserContext = createContext(null);

export const useBrowser = () => useContext(BrowserContext);

/**
 * Root provider that composes all sub-hooks into a single context.
 * Components consume via `useBrowser()` – the public API is unchanged.
 */
export const BrowserProvider = ({ children }) => {
  const appState = useAppState();
  const { addLog, setActiveProfileModal, setActiveProxyModal } = appState;

  const historyActions = useHistory(addLog);
  const profileActions = useProfiles(addLog, historyActions.addHistoryRecord);
  const proxyActions = useProxies(addLog);

  // Wrap saveProfile / addProxy so they auto-close their modals
  const saveProfile = (data) => profileActions.saveProfile(data, () => setActiveProfileModal(null));
  const addProxy = (data) => proxyActions.addProxy(data, () => setActiveProxyModal(false));

  return (
    <BrowserContext.Provider value={{
      ...appState,
      ...profileActions,
      ...proxyActions,
      ...historyActions,
      saveProfile,
      addProxy,
    }}>
      {children}
    </BrowserContext.Provider>
  );
};
