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
   * Translate key with dot notation (e.g. 'auth.welcome') and optional interpolation
   */
  const t = useCallback(
    (keyPath, params = {}) => {
      if (!keyPath) return '';
      const keys = keyPath.split('.');

      // Try active dictionary
      let value = keys.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), activeDictionary);

      // Fallback to English dictionary
      if (value === null || value === undefined) {
        value = keys.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : null), fallbackDictionary);
      }

      // If still missing, return keyPath as fallback
      if (value === null || value === undefined) {
        return keyPath;
      }

      if (typeof value === 'string' && Object.keys(params).length > 0) {
        return Object.entries(params).reduce((str, [k, v]) => {
          return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
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
