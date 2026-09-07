import React from 'react';
import { useBrowser } from '../../store/BrowserContext';
import LoginBackgroundRipples from './components/LoginBackgroundRipples';
import LoginCard from './components/LoginCard';
import LoginFooter from './components/LoginFooter';

/**
 * Main Login Page replicating the Apidog Welcome screen
 */
export default function LoginPage() {
  const { login, useOfflineSpace, setActiveProxyModal, setActiveSettingsModal } = useBrowser();

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* ── TOP-LEFT BRAND LOGO ── */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 20
        }}
      >
        {/* Apidog Butterfly / Bowtie Logo */}
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
          <path d="M6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10V14H10C7.79086 14 6 12.2091 6 10Z" fill="#3B82F6" />
          <path d="M18 10C18 7.79086 19.7909 6 22 6C24.2091 6 26 7.79086 26 10C26 12.2091 24.2091 14 22 14H18V10Z" fill="#2563EB" />
          <path d="M14 22C14 24.2091 12.2091 26 10 26C7.79086 26 6 24.2091 6 22C6 19.7909 7.79086 18 10 18H14V22Z" fill="#2563EB" />
          <path d="M22 18C24.2091 18 26 19.7909 26 22C26 24.2091 24.2091 26 22 26C19.7909 26 18 24.2091 18 22V18H22Z" fill="#3B82F6" />
        </svg>
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.3px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          Apidog
        </span>
      </div>

      {/* ── CONCENTRIC CIRCLE RIPPLES BACKGROUND ── */}
      <LoginBackgroundRipples />

      {/* ── CENTER LOGIN CARD ── */}
      <LoginCard
        onLogin={login}
        onOfflineSpace={useOfflineSpace}
      />

      {/* ── BOTTOM FOOTER ── */}
      <LoginFooter
        onOpenProxy={() => setActiveProxyModal(true)}
        onOfflineSpace={useOfflineSpace}
        onToggleAppearance={() => setActiveSettingsModal(true)}
      />
    </div>
  );
}
