import React from 'react';
import { useBrowser } from '../../store/BrowserContext';

export default function AppReloadOverlay() {
  const { isReloading } = useBrowser();

  if (!isReloading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '38px', // Header stays untouched and visible
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
    >
      {/* Simple spinning clover logo in center */}
      <div
        style={{
          width: '26px',
          height: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'spin 1s linear infinite'
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="#C084FC" />
        </svg>
      </div>
    </div>
  );
}
