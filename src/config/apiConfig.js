/**
 * Centralized API & Server Configuration
 * Prioritizes environment variables (VITE_API_URL defined in .env)
 */
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080').replace(/\/$/, '');

export function getApiServerUrl() {
  return API_BASE_URL;
}
