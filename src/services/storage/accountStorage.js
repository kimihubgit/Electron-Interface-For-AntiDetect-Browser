/**
 * Multi-Account Local Storage Manager
 * Allows switching between accounts, saving account sessions, and cleaning obsolete entries.
 */
import { getStoredUser, getStoredWorkspace, getAuthToken, setAuthSession } from './authStorage';

export const SAVED_ACCOUNTS_KEY = 'antidetect_saved_accounts_v2';

function sanitizeAccountList(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(acc => {
    if (!acc || typeof acc !== 'object') return false;
    const em = (acc.email || '').toLowerCase().trim();
    const un = (acc.username || '').toLowerCase().trim();
    const id = String(acc.id || '');
    const name = (acc.name || '').toLowerCase();
    // Exclude mock test domains or dummy accounts
    if (em.includes('example.com') || em.includes('@example')) return false;
    if (id === 'acc-1' || id === 'acc-2' || id === 'acc-3') return false;
    if (name === 'alex developer' || name === 'sarah crypto') return false;
    // Must have a real email or username
    return !!(em || un);
  });
}

export function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const sanitized = sanitizeAccountList(parsed);
      if (sanitized.length > 0) {
        if (sanitized.length !== parsed.length) {
          localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved accounts:', e);
  }

  // Also check legacy key and migrate clean entries
  try {
    const legacyRaw = localStorage.getItem('antidetect_saved_accounts_v1');
    if (legacyRaw) {
      const sanitizedLegacy = sanitizeAccountList(JSON.parse(legacyRaw));
      localStorage.removeItem('antidetect_saved_accounts_v1');
      if (sanitizedLegacy.length > 0) {
        localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(sanitizedLegacy));
        return sanitizedLegacy;
      }
    }
  } catch { }

  // Seed with current active session if available
  const currentUser = getStoredUser();
  const currentToken = getAuthToken();
  if (currentUser && currentToken) {
    const email = currentUser.email || '';
    const username = currentUser.username || (email ? email.split('@')[0] : 'user');
    const defaultAcc = {
      id: currentUser.id || `acc_${Date.now()}`,
      email: email,
      username: username,
      name: currentUser.full_name || currentUser.username || (email ? email.split('@')[0] : 'Người dùng'),
      initial: (currentUser.full_name || currentUser.username || email || 'U')[0].toUpperCase(),
      color: '#3B82F6',
      token: currentToken,
      workspace: getStoredWorkspace(),
      expires_at: localStorage.getItem('auth_expires_at') || '',
      last_active: new Date().toISOString()
    };
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify([defaultAcc]));
    return [defaultAcc];
  }
  return [];
}

export function saveAccountSession({ user, token, workspace, expires_at }) {
  if (!user) return [];
  const accounts = getSavedAccounts();
  const email = (user.email || '').toLowerCase().trim();
  const username = (user.username || '').toLowerCase().trim();
  if (!email && !username) return accounts;
  if (email.includes('example.com') || email.includes('@example')) return accounts;

  const name = user.full_name || user.username || (user.email ? user.email.split('@')[0] : 'Người dùng');
  const initial = (name || email || 'U')[0].toUpperCase();

  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];
  const color = colors[Math.abs((email || username || 'u').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % colors.length];

  const existingIndex = accounts.findIndex(a =>
    (email && a.email && a.email.toLowerCase() === email) ||
    (username && a.username && a.username.toLowerCase() === username) ||
    (user.id && a.id === user.id)
  );

  const accountItem = {
    id: user.id || (existingIndex >= 0 ? accounts[existingIndex].id : `acc_${Date.now()}`),
    email: user.email || email,
    username: user.username || username,
    name: name,
    initial: initial,
    color: existingIndex >= 0 ? accounts[existingIndex].color || color : color,
    token: token || (existingIndex >= 0 ? accounts[existingIndex].token : ''),
    workspace: workspace || (existingIndex >= 0 ? accounts[existingIndex].workspace : null),
    expires_at: expires_at || (existingIndex >= 0 ? accounts[existingIndex].expires_at : ''),
    last_active: new Date().toISOString()
  };

  let updatedList;
  if (existingIndex >= 0) {
    updatedList = [...accounts];
    updatedList[existingIndex] = { ...updatedList[existingIndex], ...accountItem };
  } else {
    updatedList = [accountItem, ...accounts];
  }

  const cleanList = sanitizeAccountList(updatedList);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(cleanList));
  return cleanList;
}

export function removeSavedAccount(accountIdOrEmail) {
  const accounts = getSavedAccounts();
  const target = String(accountIdOrEmail).toLowerCase();
  const updated = accounts.filter(a => a.id !== accountIdOrEmail && a.email?.toLowerCase() !== target && a.username?.toLowerCase() !== target);
  localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  return updated;
}

export function switchToAccount(account) {
  if (!account) return null;
  setAuthSession({
    token: account.token,
    user: account,
    workspace: account.workspace,
    expires_at: account.expires_at
  });
  return account;
}
