import { useState, useEffect } from 'react';

/**
 * A generic hook that syncs state to localStorage.
 * @param {string} key   – localStorage key
 * @param {*}      fallback – value used when key is missing
 */
export function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
