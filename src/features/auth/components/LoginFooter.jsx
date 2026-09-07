import React, { useState, useRef, useEffect } from 'react';
import { Languages, Shirt, Shield, Cloud, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

/**
 * Bottom Footer bar matching the exact screenshot:
 * Left: [文A English ⌵] with 2-line language dropdown, 👕 Appearance, 🛡️ Proxy
 * Right: ☁️ Offline Space
 */
export default function LoginFooter({ onOpenProxy, onOfflineSpace, onToggleAppearance }) {
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [appearance, setAppearance] = useState('Light');
  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);
  const langRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (appRef.current && !appRef.current.contains(e.target)) {
        setShowAppearanceMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const appearanceModes = [
    { id: 'Light', labelKey: 'footer.light' },
    { id: 'Dark', labelKey: 'footer.dark' },
    { id: 'System', labelKey: 'footer.system' }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748B',
        zIndex: 30
      }}
    >
      {/* Left controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* 1. Language Button & 2-Line Dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#64748B',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
              e.currentTarget.style.color = '#1E293B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Languages size={14} style={{ color: '#94A3B8' }} />
            <span>{currentLanguage.native}</span>
            <ChevronDown size={12} style={{ color: '#94A3B8' }} />
          </button>

          {/* Upward Language Popover matching screenshot */}
          {showLangMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                width: '205px',
                maxHeight: '350px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 16px 36px rgba(15, 23, 42, 0.14), 0 4px 12px rgba(15, 23, 42, 0.06)',
                padding: '6px',
                overflowY: 'auto',
                zIndex: 100,
                animation: 'fadeInModal 0.15s ease'
              }}
            >
              {supportedLanguages.map((item) => {
                const isSelected = currentLanguage.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      changeLanguage(item.id);
                      setShowLangMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#F1F5F9' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isSelected ? 'var(--apidog-purple)' : '#0F172A',
                      letterSpacing: '-0.2px'
                    }}>
                      {item.native}
                    </span>
                    <span style={{
                      fontSize: '11px',
                      color: '#64748B',
                      marginTop: '1px'
                    }}>
                      {item.english}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Appearance (T-Shirt icon matching screenshot) */}
        <div ref={appRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowAppearanceMenu(!showAppearanceMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '5px',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#334155';
            }}
          >
            <Shirt size={14} style={{ color: '#475569' }} />
            <span>{t('footer.appearance')}</span>
          </button>

          {showAppearanceMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                width: '130px',
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.12)',
                padding: '4px',
                zIndex: 100
              }}
            >
              {appearanceModes.map((mode) => (
                <div
                  key={mode.id}
                  onClick={() => {
                    setAppearance(mode.id);
                    setShowAppearanceMenu(false);
                    onToggleAppearance?.(mode.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: appearance === mode.id ? 'var(--apidog-purple)' : '#334155',
                    fontWeight: appearance === mode.id ? 600 : 400,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span>{t(mode.labelKey)}</span>
                  {appearance === mode.id && <Check size={12} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Proxy */}
        <button
          onClick={onOpenProxy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#334155',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 6px',
            borderRadius: '5px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <Shield size={14} style={{ color: '#475569' }} />
          <span>{t('footer.proxy')}</span>
        </button>
      </div>

      {/* Right item: Offline Space */}
      <div>
        <button
          onClick={onOfflineSpace}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '12.5px',
            fontWeight: 500,
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '5px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <Cloud size={14} style={{ color: '#64748B' }} />
          <span>{t('footer.offlineSpace')}</span>
        </button>
      </div>
    </div>
  );
}
