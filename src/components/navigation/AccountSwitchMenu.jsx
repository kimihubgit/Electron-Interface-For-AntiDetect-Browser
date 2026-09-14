import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, LogOut, Plus, X, User, Share2, Languages, Check, Loader2 } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';
import {
  getSavedAccounts,
  saveAccountSession,
  removeSavedAccount,
  switchToAccount,
  loginWithApi,
  getCurrentUserApi
} from '../../services/authService';

export const INITIAL_ACCOUNTS = [];

export default function AccountSwitchMenu({
  onClose,
  flyoutDirection = 'left', // 'left' | 'right'
  style = {}
}) {
  const { t } = useTranslation();
  const { currentUser, login, logout, openLoginForNewAccount, showToast, setActiveSettingsModal } = useBrowser();
  const [isSwitchHovered, setIsSwitchHovered] = useState(false);
  const [hoveredAccountId, setHoveredAccountId] = useState(null);
  const switchHoverTimeoutRef = useRef(null);

  // Load saved accounts from localStorage (pure authenticated sessions)
  const [accounts, setAccounts] = useState(() => getSavedAccounts());

  // Ensure current logged-in user is saved into the accounts list
  useEffect(() => {
    if (currentUser?.email || currentUser?.username) {
      const updated = saveAccountSession({
        user: currentUser,
        token: currentUser.token,
        workspace: currentUser.workspace
      });
      setAccounts(updated);
    }
  }, [currentUser]);

  const activeEmail = (currentUser?.email || currentUser?.username || '').toLowerCase();

  const handleSwitchMouseEnter = () => {
    if (switchHoverTimeoutRef.current) clearTimeout(switchHoverTimeoutRef.current);
    setIsSwitchHovered(true);
  };

  const handleSwitchMouseLeave = () => {
    switchHoverTimeoutRef.current = setTimeout(() => {
      setIsSwitchHovered(false);
    }, 250);
  };

  const handleSelectAccount = (acc) => {
    if (acc.email?.toLowerCase() === activeEmail || acc.username?.toLowerCase() === activeEmail) {
      onClose?.();
      return;
    }

    switchToAccount(acc);

    login({
      ...acc,
      name: acc.name || acc.username || acc.email?.split('@')[0],
      email: acc.email,
      token: acc.token,
      workspace: acc.workspace,
      user: acc
    });

    if (showToast) {
      showToast(t('toasts.accountSwitched', `Đã chuyển sang tài khoản: ${acc.name || acc.email || acc.username}`, { email: acc.email || acc.username }), 'success');
    }
    onClose?.();

    // Verify session with server in background
    if (acc.token) {
      getCurrentUserApi(acc.token).then((res) => {
        if (res.success && res.user) {
          saveAccountSession({ user: res.user, token: acc.token, workspace: res.workspace });
        }
      }).catch(() => { });
    }
  };

  const handleDeleteAccount = (e, accId) => {
    e.stopPropagation();
    const updated = removeSavedAccount(accId);
    setAccounts(updated);
    if (showToast) {
      showToast('Đã xóa tài khoản khỏi danh sách ghi nhớ', 'info');
    }
    // If the deleted account was the currently active one
    const isCurrent = accounts.find(a => a.id === accId)?.email?.toLowerCase() === activeEmail;
    if (isCurrent) {
      if (updated.length > 0) {
        handleSelectAccount(updated[0]);
      } else {
        handleLogoutClick();
      }
    }
  };

  const handleLogoutClick = () => {
    logout?.();
    if (showToast) {
      showToast(t('toasts.loggedOut', 'Đã đăng xuất khỏi tài khoản.'), 'info');
    }
    onClose?.();
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
    >
      {/* ── PARENT MENU MATCHING SCREENSHOT ── */}
      <div
        style={{
          width: '180px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 10px -4px rgba(0, 0, 0, 0.05)',
          padding: '5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          userSelect: 'none',
          zIndex: 1100
        }}
      >
        {/* Item 1: Switch account > (Hover opens flyout) */}
        <div
          onMouseEnter={handleSwitchMouseEnter}
          onMouseLeave={handleSwitchMouseLeave}
          style={{
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              borderRadius: '6px',
              backgroundColor: isSwitchHovered ? '#F1F5F9' : 'transparent',
              color: isSwitchHovered ? '#0F172A' : '#334155',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowLeftRight size={14} style={{ color: '#64748B' }} />
              <span>{t('titlebar.switchAccount', 'Switch account')}</span>
            </div>
            <span style={{ color: '#94A3B8', fontSize: '13px', fontWeight: 600 }}>›</span>
          </div>

          {/* ── FLYOUT SUBMENU MATCHING SCREENSHOT ── */}
          {isSwitchHovered && (
            <div
              onMouseEnter={handleSwitchMouseEnter}
              onMouseLeave={handleSwitchMouseLeave}
              style={{
                position: 'absolute',
                ...(flyoutDirection === 'right'
                  ? { left: 'calc(100% + 4px)', right: 'auto' }
                  : { right: 'calc(100% + 4px)', left: 'auto' }),
                top: '-4px',
                width: '260px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
                padding: '6px',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                animation: 'fadeIn 0.12s ease-out'
              }}
            >
              {/* Invisible mouse bridge to prevent dropping hover */}
              <div
                style={{
                  position: 'absolute',
                  ...(flyoutDirection === 'right'
                    ? { left: '-12px', right: 'auto' }
                    : { right: '-12px', left: 'auto' }),
                  top: 0,
                  width: '12px',
                  height: '100%'
                }}
              />

              {/* Account list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '240px', overflowY: 'auto' }}>
                {accounts.map(acc => {
                  const isActive = (acc.email && acc.email.toLowerCase() === activeEmail) || (acc.username && acc.username.toLowerCase() === activeEmail);
                  const isHovered = hoveredAccountId === acc.id;

                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectAccount(acc)}
                      onMouseEnter={() => setHoveredAccountId(acc.id)}
                      onMouseLeave={() => setHoveredAccountId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '6px',
                        backgroundColor: isActive ? '#EBF5FF' : (isHovered ? '#F8FAFC' : 'transparent'),
                        cursor: 'pointer',
                        transition: 'background-color 0.1s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, overflow: 'hidden' }}>
                        {/* Circle Avatar with letter S, M, T... */}
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: acc.color || (isActive ? '#3B82F6' : '#94A3B8'),
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 600,
                            flexShrink: 0
                          }}
                        >
                          {acc.initial || (acc.name || acc.username || acc.email || 'U')[0].toUpperCase()}
                        </div>

                        {/* Name & Email text */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                          <span
                            style={{
                              fontSize: '12.5px',
                              color: '#1E293B',
                              fontWeight: isActive ? 600 : 500,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {acc.name || acc.username || acc.email}
                          </span>
                          {acc.email && acc.name && acc.name !== acc.email && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#64748B',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {acc.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {/* Active Indicator Checkmark */}
                        {isActive && (
                          <Check size={14} style={{ color: '#3B82F6' }} />
                        )}

                        {/* Delete '×' button on hover for non-active accounts */}
                        {!isActive && isHovered && accounts.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAccount(e, acc.id)}
                            title="Xóa tài khoản khỏi danh sách"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              transition: 'color 0.1s ease'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* + Add account row -> Directly opens standard Login screen */}
              <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                <div
                  onClick={() => {
                    onClose?.();
                    openLoginForNewAccount?.();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    color: '#475569',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  <Plus size={14} style={{ color: '#64748B' }} />
                  <span>{t('titlebar.addAccount', 'Thêm tài khoản...')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item 2: Account Settings */}
        <div
          onClick={() => {
            setActiveSettingsModal?.('account');
            onClose?.();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.12s ease'
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
          <User size={14} style={{ color: '#64748B' }} />
          <span>{t('settings.tabs.account', 'Account Settings')}</span>
        </div>

        {/* Item 3: My Connections */}
        <div
          onClick={() => {
            setActiveSettingsModal?.('connections');
            onClose?.();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.12s ease'
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
          <Share2 size={14} style={{ color: '#64748B' }} />
          <span>{t('settings.tabs.connections', 'My Connections')}</span>
        </div>

        {/* Item 3.5: Language & Region */}
        <div
          onClick={() => {
            setActiveSettingsModal?.('language');
            onClose?.();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.12s ease'
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
          <Languages size={14} style={{ color: '#64748B' }} />
          <span>{t('settings.tabs.language', 'Language & Region')}</span>
        </div>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '2px 0' }} />

        {/* Item 4: Log out */}
        <div
          onClick={handleLogoutClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.12s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <LogOut size={14} style={{ color: 'inherit' }} />
          <span>{t('titlebar.logout', 'Log out')}</span>
        </div>
      </div>
    </div>
  );
}
