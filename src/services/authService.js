/**
 * Authentication & Identity Service Facade
 * Backward-compatible barrel re-exporting from modular sub-services:
 * - core/deviceService: HWID & Device identification
 * - storage/authStorage: Session token & user storage
 * - storage/accountStorage: Multi-account switcher & session vault
 * - api/authApi: Authentication REST API endpoints
 */

export {
  getOrCreateHwid,
  getDeviceName,
  getMachineGuid
} from './core/deviceService';

export {
  getAuthToken,
  getStoredUser,
  getStoredWorkspace,
  setAuthSession,
  clearAuthSession
} from './storage/authStorage';

export {
  SAVED_ACCOUNTS_KEY,
  getSavedAccounts,
  saveAccountSession,
  removeSavedAccount,
  switchToAccount
} from './storage/accountStorage';

export {
  registerWithApi,
  loginWithApi,
  getAuthMeApi,
  getCurrentUserApi,
  getUserInfoApi,
  logoutWithApi,
  switchWorkspaceApi,
  sendResetPasswordLinkApi,
  sendResetCodeApi,
  resetPasswordApi,
  deleteAccountApi,
  loginWithGoogleApi,
  getGoogleAuthUrlApi,
  GOOGLE_CLIENT_ID
} from './api/authApi';
