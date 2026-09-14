import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

/**
 * OfflineBanner - Displays a non-intrusive warning strip when internet is disconnected
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const { showToast } = useBrowser() || {};

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToast) {
        showToast('Đã khôi phục kết nối Internet', 'success');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToast) {
        showToast('Mất kết nối Internet. Đang ở chế độ Offline.', 'warn');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  if (isOnline) return null;

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFFBEB',
        borderBottom: '1px solid #FDE68A',
        color: '#B45309',
        fontSize: '12px',
        fontWeight: 500,
        padding: '5px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 9999,
        flexShrink: 0,
        boxSizing: 'border-box'
      }}
    >
      <WifiOff size={14} color="#D97706" />
      <span>
        Không có kết nối Internet. Bạn đang sử dụng ứng dụng ở chế độ cục bộ (Offline Mode).
      </span>
    </div>
  );
}
