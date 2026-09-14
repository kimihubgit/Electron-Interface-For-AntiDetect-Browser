/**
 * Profile Service Facade
 * Backward-compatible barrel re-exporting from modular sub-services:
 * - core/deviceService: Machine GUID
 * - core/apiClient: getApiHeaders
 * - api/profileApi: 10 REST API endpoints
 */
import { getApiHeaders } from './core/apiClient';

export { getMachineGuid } from './core/deviceService';

/**
 * Standard headers required for Profile API requests
 */
export function getProfileApiHeaders(tokenOverride = null) {
  return getApiHeaders(tokenOverride);
}

export {
  createProfileApi,
  bulkCreateProfilesApi,
  getProfilesApi,
  updateProfileApi,
  deleteProfileApi,
  batchProfilesApi,
  lockProfileApi,
  heartbeatProfileApi,
  unlockProfileApi,
  importCookiesApi,
  restoreProfileFromTrashApi,
  emptyTrashApi,
  getPresignedUploadUrlApi,
  getLaunchTicketApi,
  getEnginesApi,
  syncSessionUpApi,
  syncSessionDownApi
} from './api/profileApi';
