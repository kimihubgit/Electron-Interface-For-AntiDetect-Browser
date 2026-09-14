import { useReducer, useEffect, useCallback, useRef } from 'react';
import { openDownloadUrl } from '../services/updateService';

const initialState = {
  status: 'idle', // 'idle' | 'downloading' | 'ready' | 'error'
  progress: 0,
  error: null
};

function updateReducer(state, action) {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'START':
      return { status: 'downloading', progress: 0, error: null };
    case 'PROGRESS':
      return { ...state, status: 'downloading', progress: action.payload };
    case 'SUCCESS':
      return { status: 'ready', progress: 100, error: null };
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
}

/**
 * Custom Hook: useAppUpdateDownload
 * Encapsulates the update download state machine, Electron IPC bridges, and network listeners.
 * Hardened against race conditions, duplicate triggers, and timer leaks.
 */
export function useAppUpdateDownload(downloadUrl, isOpen) {
  const [state, dispatch] = useReducer(updateReducer, initialState);
  const simIntervalRef = useRef(null);
  const isDownloadingRef = useRef(false);

  const clearSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  // Reset state and clear timers whenever the modal closes
  useEffect(() => {
    if (!isOpen) {
      clearSimulation();
      isDownloadingRef.current = false;
      dispatch({ type: 'RESET' });
    }
    return () => {
      clearSimulation();
    };
  }, [isOpen, clearSimulation]);

  // Subscribe to Electron IPC download progress
  useEffect(() => {
    if (!window.electronAPI?.onDownloadUpdateProgress) return;

    const unsubscribe = window.electronAPI.onDownloadUpdateProgress((data) => {
      if (typeof data?.percent === 'number') {
        dispatch({ type: 'PROGRESS', payload: data.percent });
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Handle network loss during download
  useEffect(() => {
    if (state.status !== 'downloading') return;

    const handleOffline = () => {
      clearSimulation();
      isDownloadingRef.current = false;
      dispatch({
        type: 'ERROR',
        payload: 'Mất kết nối Internet trong lúc tải bản cập nhật.'
      });
    };

    window.addEventListener('offline', handleOffline);
    return () => window.removeEventListener('offline', handleOffline);
  }, [state.status, clearSimulation]);

  // Start downloading (Protected against concurrent double-clicks)
  const startDownload = useCallback(async () => {
    if (isDownloadingRef.current) return;
    if (!downloadUrl) {
      dispatch({ type: 'ERROR', payload: 'Thiếu đường dẫn tải bản cập nhật' });
      return;
    }

    isDownloadingRef.current = true;
    dispatch({ type: 'START' });

    // 1. Electron Native IPC
    if (window.electronAPI?.startDownloadUpdate) {
      try {
        const res = await window.electronAPI.startDownloadUpdate(downloadUrl);
        if (res?.success) {
          dispatch({ type: 'SUCCESS' });
        } else {
          throw new Error(res?.error || 'Tải file thất bại');
        }
      } catch (err) {
        dispatch({ type: 'ERROR', payload: err.message || 'Không thể tải tự động' });
      } finally {
        isDownloadingRef.current = false;
      }
      return;
    }

    // 2. Browser Dev Mode Simulation (Simulates smooth download)
    clearSimulation();
    let current = 0;
    simIntervalRef.current = setInterval(() => {
      current += 20;
      if (current >= 100) {
        clearSimulation();
        isDownloadingRef.current = false;
        dispatch({ type: 'SUCCESS' });
      } else {
        dispatch({ type: 'PROGRESS', payload: current });
      }
    }, 250);
  }, [downloadUrl, clearSimulation]);

  // Trigger installer execution and app quit
  const installUpdate = useCallback(() => {
    if (window.electronAPI?.installDownloadedUpdate) {
      window.electronAPI.installDownloadedUpdate();
      return;
    }
    openDownloadUrl(downloadUrl);
  }, [downloadUrl]);

  // Fallback to manual browser download
  const manualDownload = useCallback(() => {
    openDownloadUrl(downloadUrl);
  }, [downloadUrl]);

  const reset = useCallback(() => {
    clearSimulation();
    isDownloadingRef.current = false;
    dispatch({ type: 'RESET' });
  }, [clearSimulation]);

  return {
    state,
    startDownload,
    installUpdate,
    manualDownload,
    reset
  };
}
