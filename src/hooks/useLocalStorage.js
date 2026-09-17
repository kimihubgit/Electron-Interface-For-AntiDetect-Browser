import { useState, useEffect, useRef } from 'react';

/**
 * A generic hook that syncs state to localStorage.
 * Safely handles key changes (e.g. switching accounts/workspaces) without
 * accidentally overwriting the new key with stale data from the previous key.
 * @param {string} key   – localStorage key
 * @param {*}      fallback – value used when key is missing
 */
export function useLocalStorage(key, fallback) {
  const resolveFallback = () => (typeof fallback === 'function' ? fallback() : fallback);

  const readStorage = (k) => {
    try {
      const saved = localStorage.getItem(k);
      if (saved !== null && saved !== undefined && saved !== 'undefined') {
        const parsed = JSON.parse(saved);
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      }
    } catch {}
    return resolveFallback();
  };

  const [value, setValue] = useState(() => readStorage(key));
  const activeKeyRef = useRef(key);

  // If key changes during render (e.g. account or workspace switch),
  // immediately update state and activeKeyRef before effects run.
  if (activeKeyRef.current !== key) {
    activeKeyRef.current = key;
    const nextVal = readStorage(key);
    setValue(nextVal);
  }

  const latestValueRef = useRef(value);
  latestValueRef.current = value;

  // Flush on page unload/close so no pending debounced changes are lost
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        if (activeKeyRef.current === key && latestValueRef.current !== undefined) {
          localStorage.setItem(key, JSON.stringify(latestValueRef.current));
        }
      } catch (e) {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [key]);

  // Debounced sync to localStorage (300ms) to avoid locking main thread during large batch updates
  useEffect(() => {
    if (activeKeyRef.current === key && value !== undefined) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.error(`Failed to save to localStorage for key ${key}:`, e);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [key, value]);

  return [value, setValue];
}


