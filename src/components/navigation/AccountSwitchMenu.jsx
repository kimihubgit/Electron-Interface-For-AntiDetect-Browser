import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, LogOut, Plus, X, User, Share2 } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export const INITIAL_ACCOUNTS = [
  { id: 'acc-1', email: 'secondmail@example.com', name: 'secondmail', initial: 'S', color: '#3B82F6' },
  { id: 'acc-2', email: 'mymail@example.com', name: 'mymail', initial: 'M', color: '#3B82F6' },
  { id: 'acc-3', email: 'thirdmail@example.com', name: 'thirdmail', initial: 'T', color: '#94A3B8' }
];

const STORAGE_KEY = 'antidetect_saved_accounts_v1';

export default function AccountSwitchMenu({
  onClose,
  flyoutDirection = 'left', // 'left' | 'right'
  style = {}
}) {
  const { currentUser, login, logout, showToast, setActiveSettingsModal } = useBrowser();
  const [isSwitchHovered, setIsSwitchHovered] = useState(false);
  const [hoveredAccountId, setHoveredAccountId] = useState(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const switchHoverTimeoutRef = useRef(null);

  // Load saved accounts from localStorage or fallback
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACCOUNTS;
  });

  // Ensure current logged-in user is in the accounts list if exists
  useEffect(() => {
    if (currentUser?.email) {
      setAccounts(prev => {
        const exists = prev.some(a => a.email.toLowerCase() === currentUser.email.toLowerCase());
        if (!exists) {
          const initial = (currentUser.name || currentUser.email)[0].toUpperCase();
          const updated = [
            {
              id: 'acc-' + Date.now(),
              email: currentUser.email,
              name: currentUser.name || currentUser.email.split('@')[0],
              initial,
              color: '#3B82F6'
            },
            ...prev
          ];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [currentUser]);

  const activeEmail = (currentUser?.email || accounts[0]?.email || 'secondmail@example.com').toLowerCase();

  const handleSwitchMouseEnter = () => {
    if (switchHoverTimeoutRef.current) clearTimeout(switchHoverTimeoutRef.current);
    setIsSwitchHovered(true);
  };

  const handleSwitchMouseLeave = () => {
    switchHoverTimeoutRef.current = setTimeout(() => {
      setIsSwitchHovered(false);
      setIsAddingAccount(false);
    }, 250);
  };

  const handleSelectAccount = (acc) => {
    login({
      email: acc.email,
      name: acc.name || acc.email.split('@')[0]
    });
    if (showToast) {
      showToast(`Đã chuyển sang tài khoản: ${acc.email}`, 'success');
    }
    onClose?.();
  };

  const handleDeleteAccount = (e, accId) => {
    e.stopPropagation();
    const updated = accounts.filter(a => a.id !== accId);
    setAccounts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleAddAccountSubmit = (e) => {
    e?.preventDefault();
    const clean = newEmailInput.trim().toLowerCase();
    if (!clean || !clean.includes('@')) {
      alert('Vui lòng nhập địa chỉ email hợp lệ!');
      return;
    }

    const initial = clean[0].toUpperCase();
    const newAcc = {
      id: 'acc-' + Date.now(),
      email: clean,
      name: clean.split('@')[0],
      initial,
      color: '#3B82F6'
    };

    const updated = [...accounts, newAcc];
    setAccounts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setNewEmailInput('');
    setIsAddingAccount(false);

    // Immediately switch to the new account
    handleSelectAccount(newAcc);
  };

  const handleLogoutClick = () => {
    logout?.();
    if (showToast) {
      showToast('Đã đăng xuất khỏi tài khoản.', 'info');
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
              <span>Switch account</span>
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
                  const isActive = acc.email.toLowerCase() === activeEmail;
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
                            fontSize: '12px',
                            fontWeight: 600,
                            flexShrink: 0
                          }}
                        >
                          {acc.initial || acc.email[0].toUpperCase()}
                        </div>

                        {/* Email text */}
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#1E293B',
                            fontWeight: isActive ? 600 : 400,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={acc.email}
                        >
                          {acc.email}
                        </span>
                      </div>

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
                  );
                })}
              </div>

              {/* + Add account row */}
              <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                {isAddingAccount ? (
                  <form onSubmit={handleAddAccountSubmit} style={{ display: 'flex', gap: '4px', padding: '4px' }}>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={newEmailInput}
                      onChange={(e) => setNewEmailInput(e.target.value)}
                      autoFocus
                      style={{
                        flex: 1,
                        fontSize: '12px',
                        padding: '4px 8px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '4px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Thêm
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAccount(false)}
                      style={{
                        padding: '4px 6px',
                        backgroundColor: '#F1F5F9',
                        color: '#64748B',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Hủy
                    </button>
                  </form>
                ) : (
                  <div
                    onClick={() => setIsAddingAccount(true)}
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
                    <span>Add account</span>
                  </div>
                )}
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
          <span>Account Settings</span>
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
          <span>My Connections</span>
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
          <span>Log out</span>
        </div>
      </div>
    </div>
  );
}
