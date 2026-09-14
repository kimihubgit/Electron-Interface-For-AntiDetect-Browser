import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { dictionaries, supportedLanguages } from '../locales';

const I18nContext = createContext(null);

const STORAGE_KEY = 'antidetect_language';

export function I18nProvider({ children }) {
  const [langId, setLangId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const changeLanguage = useCallback((newId) => {
    setLangId(newId);
    try {
      localStorage.setItem(STORAGE_KEY, newId);
    } catch {
      // ignore
    }
    // Sync with Electron main process if running in desktop mode
    if (window.electron?.send) {
      window.electron.send('language-changed', newId);
    }
  }, []);

  const currentLanguage = useMemo(() => {
    return supportedLanguages.find((l) => l.id === langId) || supportedLanguages[0];
  }, [langId]);

  const activeDictionary = useMemo(() => {
    return dictionaries[langId] || dictionaries['en'];
  }, [langId]);

  const fallbackDictionary = dictionaries['en'];

  /**
   * Translate key with dot notation (e.g. 'auth.welcome') and optional interpolation.
   * Supports:
   *   t('key')
   *   t('key', { count: 5 })
   *   t('key', 'Default fallback text')
   *   t('key', 'Default fallback text {count}', { count: 5 })
   */
  const t = useCallback(
    (keyPath, arg2 = {}, arg3 = {}) => {
      if (!keyPath) return '';

      let fallbackText = '';
      let params = {};

      if (typeof arg2 === 'string') {
        fallbackText = arg2;
        if (arg3 && typeof arg3 === 'object') {
          params = arg3;
        }
      } else if (arg2 && typeof arg2 === 'object') {
        params = arg2;
        if (typeof arg3 === 'string') {
          fallbackText = arg3;
        }
      }

      const keys = keyPath.split('.');

      // Try active dictionary
      let value = keys.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), activeDictionary);

      // Fallback to English dictionary
      if (value === null || value === undefined) {
        value = keys.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), fallbackDictionary);
      }

      // If still missing, return fallbackText if provided, otherwise keyPath
      if (value === null || value === undefined) {
        value = fallbackText || keyPath;
      }

      // Replace interpolation parameters: support both {param} and {{param}}
      if (typeof value === 'string' && params && typeof params === 'object' && Object.keys(params).length > 0) {
        return Object.entries(params).reduce((str, [k, v]) => {
          const val = v !== undefined && v !== null ? String(v) : '';
          return str
            .replaceAll(`{{${k}}}`, val)
            .replaceAll(`{${k}}`, val);
        }, value);
      }

      return value;
    },
    [activeDictionary, fallbackDictionary]
  );

  const value = useMemo(
    () => ({
      t,
      language: langId,
      currentLanguage,
      changeLanguage,
      supportedLanguages
    }),
    [t, langId, currentLanguage, changeLanguage]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}

export const useI18n = useTranslation;
