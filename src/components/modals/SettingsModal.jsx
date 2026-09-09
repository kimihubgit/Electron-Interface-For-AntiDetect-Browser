import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Share2, 
  Key, 
  Bell, 
  Palette, 
  Languages, 
  Settings as SettingsIcon, 
  Keyboard, 
  Award, 
  Shield, 
  Boxes, 
  AppWindow, 
  Lock, 
  Zap, 
  Info, 
  LogOut,
  Check
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { applyTheme, applyAccentColor, applyFontSize } from '../../utils/themeManager';

export default function SettingsModal() {
  const { activeSettingsModal, setActiveSettingsModal, showToast } = useBrowser();

  const [activeNav, setActiveNav] = useState(() => {
    if (typeof activeSettingsModal === 'string') return activeSettingsModal;
    return 'account';
  });

  useEffect(() => {
    if (typeof activeSettingsModal === 'string') {
      setActiveNav(activeSettingsModal);
    }
  }, [activeSettingsModal]);

  // Connection states matching screenshot: GitHub not connected, Google connected
  const [githubConnected, setGithubConnected] = useState(() => {
    return localStorage.getItem('conn_github') === 'true';
  });
  const [googleConnected, setGoogleConnected] = useState(() => {
    const val = localStorage.getItem('conn_google');
    return val === null ? true : val === 'true';
  });

  const handleToggleGithub = () => {
    const next = !githubConnected;
    setGithubConnected(next);
    localStorage.setItem('conn_github', String(next));
    if (showToast) {
      showToast(next ? 'Đã liên kết tài khoản GitHub thành công!' : 'Đã ngắt kết nối tài khoản GitHub.', next ? 'success' : 'info');
    }
  };

  const handleToggleGoogle = () => {
    const next = !googleConnected;
    setGoogleConnected(next);
    localStorage.setItem('conn_google', String(next));
    if (showToast) {
      showToast(next ? 'Đã liên kết tài khoản Google thành công!' : 'Đã ngắt kết nối tài khoản Google.', next ? 'success' : 'info');
    }
  };

  // Appearance States matching the user's screenshot
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('app_theme_mode') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('app_accent_color') || '#8257E5';
  });
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem('app_font_size')) || 100;
  });

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  // User Profile State matching screenshot
  const [userName, setUserName] = useState('Võ Văn Khải');
  const [userEmail, setUserEmail] = useState('vkhai2603@gmail.com');
  const [userBio, setUserBio] = useState('-');
  const [userRole, setUserRole] = useState('Backend Developer');
  const [devMode, setDevMode] = useState('Please select the development mode.');

  // Inline edit toggles
  const [editingField, setEditingField] = useState(null);

  if (!activeSettingsModal) return null;

  const backgroundOptions = [
    {
      id: 'dark_oled',
      name: 'Pitch Black',
      sidebarBg: '#18191E',
      canvasBg: '#121316',
      sidebarLine: '#2E313A',
      canvasLine: '#252830'
    },
    {
      id: 'dark_navy',
      name: 'Dark Navy',
      sidebarBg: '#232733',
      canvasBg: '#1A1D26',
      sidebarLine: '#3A4255',
      canvasLine: '#293040'
    },
    {
      id: 'dark_charcoal',
      name: 'Dark Charcoal',
      sidebarBg: '#2D2F33',
      canvasBg: '#232426',
      sidebarLine: '#454850',
      canvasLine: '#33363B'
    },
    {
      id: 'light',
      name: 'Light',
      sidebarBg: '#DFE2E8',
      canvasBg: '#FFFFFF',
      sidebarLine: '#B2B7C2',
      canvasLine: '#E5E7EB'
    },
    {
      id: 'sepia',
      name: 'Sepia / Cream',
      sidebarBg: '#E7DFCF',
      canvasBg: '#F6F1E6',
      sidebarLine: '#C5B9A4',
      canvasLine: '#DFD5C3'
    }
  ];

  const accentColorList = [
    '#8257E5', // 1. Purple (Active in screenshot)
    '#687DF1', // 2. Cornflower Blue
    '#5E79F3', // 3. Royal Blue
    '#8E7550', // 4. Bronze / Gold Olive
    '#41C5EF', // 5. Cyan / Aqua
    '#2CA477', // 6. Emerald Green
    '#EE8314', // 7. Amber Orange
    '#DD5C98', // 8. Magenta / Pink
    '#F1586B', // 9. Coral / Red
    '#827B71', // 10. Taupe / Charcoal Gray
  ];

  const accountNavItems = [
    { id: 'account', label: 'My Account', icon: User },
    { id: 'connections', label: 'My Connections', icon: Share2 },
    { id: 'tokens', label: 'Personal Access Tokens', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const preferencesNavItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Languages },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'proxy', label: 'Proxy', icon: Shield },
    { id: 'extensions', label: 'Extensions', icon: Boxes },
    { id: 'external', label: 'External Programs', icon: AppWindow },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'performance', label: 'Performance Optimization', icon: Zap },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '24px'
    }}>
      <div 
        className="no-scrollbar"
        style={{
          width: '100%',
          maxWidth: '960px',
          height: '680px',
          maxHeight: '92vh',
          backgroundColor: 'var(--apidog-card-bg)',
          borderRadius: '8px',
          border: '1px solid var(--apidog-border)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Left Navigation Sidebar */}
        <aside style={{
          width: '240px',
          backgroundColor: 'var(--apidog-sidebar-bg)',
          borderRight: '1px solid var(--apidog-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          boxSizing: 'border-box'
        }}>
          {/* Scrollable navigation items */}
          <div className="no-scrollbar" style={{
            overflowY: 'auto',
            padding: '16px 12px',
            flexGrow: 1,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {/* Group: ACCOUNT */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--apidog-text-dim)',
                padding: '4px 10px 8px 10px',
                letterSpacing: '0.5px'
              }}>
                ACCOUNT
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {accountNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isActive ? 'var(--apidog-purple-light)' : 'transparent',
                        color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-main)',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon size={15} style={{ color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)' }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group: PREFERENCES */}
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--apidog-text-dim)',
                padding: '4px 10px 8px 10px',
                letterSpacing: '0.5px'
              }}>
                PREFERENCES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {preferencesNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveNav(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: isActive ? 'var(--apidog-purple-light)' : 'transparent',
                        color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-main)',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon size={15} style={{ color: isActive ? 'var(--apidog-purple)' : 'var(--apidog-text-muted)' }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar: Sign Out button */}
          <div style={{
            borderTop: '1px solid var(--apidog-border)',
            padding: '12px 14px'
          }}>
            <button
              onClick={() => {
                setActiveSettingsModal(false);
                alert('Đã đăng xuất khỏi tài khoản.');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'var(--apidog-text-main)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                width: '100%',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={15} style={{ color: 'var(--apidog-text-muted)' }} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--apidog-bg)',
          minWidth: 0,
          height: '100%',
          overflow: 'hidden'
        }}>
          {/* Fixed Header with Title and Close Button (Does not scroll!) */}
          <div style={{
            height: '56px',
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--apidog-border-light)',
            backgroundColor: 'var(--apidog-card-bg)',
            flexShrink: 0
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--apidog-text-main)', margin: 0 }}>
              {{
                account: 'My Account',
                connections: 'My Connections',
                tokens: 'Personal Access Tokens',
                referrals: 'Referrals and Credits',
                notifications: 'Notifications',
                appearance: 'Appearance',
                language: 'Language & Region',
                general: 'General',
                shortcuts: 'Shortcuts',
                certificates: 'Certificates',
                proxy: 'Proxy',
                extensions: 'Extensions',
                external: 'External Programs',
                security: 'Security',
                performance: 'Performance Optimization',
                about: 'About'
              }[activeNav] || 'Settings'}
            </h2>
            <button
              onClick={() => setActiveSettingsModal(false)}
              className="btn-icon"
              title="Đóng cửa sổ"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
                border: 'none',
                background: 'transparent',
                color: 'var(--apidog-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--apidog-border-light)';
                e.currentTarget.style.color = 'var(--apidog-text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--apidog-text-muted)';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="no-scrollbar" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px 36px 28px',
            backgroundColor: 'var(--apidog-bg)',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>

          {/* 1. MY ACCOUNT VIEW (Exact Match with user screenshot) */}
          {activeNav === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Section 1: My Profile */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apidog-text-main)', marginBottom: '12px' }}>
                  My Profile
                </h3>

                <div style={{
                  border: '1px solid var(--apidog-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--apidog-card-bg)',
                  overflow: 'hidden'
                }}>
                  {/* Row 1: Avatar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apidog-border-light)'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Avatar
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      {/* Avatar Image container matching screenshot */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1.5px solid var(--apidog-border)',
                        backgroundColor: '#8B5CF6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}>
                        <img 
                          src="https://api.dicebear.com/7.x/bottts/svg?seed=KhaiVo" 
                          alt="Avatar" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <span>K</span>
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => alert('Chức năng đổi Avatar')}
                    >
                      Edit
                    </button>
                  </div>

                  {/* Row 2: Name */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apidog-border-light)'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Name
                    </span>
                    <div style={{ flex: 1 }}>
                      {editingField === 'name' ? (
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--apidog-purple)',
                            backgroundColor: 'var(--apidog-card-bg)',
                            color: 'var(--apidog-text-main)',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--apidog-text-main)' }}>{userName}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => setEditingField(editingField === 'name' ? null : 'name')}
                    >
                      {editingField === 'name' ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {/* Row 3: Password */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apidog-border-light)'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Password
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: 'var(--apidog-text-muted)' }}>
                      You don't have a password set up yet.
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => alert('Đặt mật khẩu bảo vệ tài khoản')}
                    >
                      Set Password
                    </button>
                  </div>

                  {/* Row 4: Email */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apidog-border-light)'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Email
                    </span>
                    <div style={{ flex: 1 }}>
                      {editingField === 'email' ? (
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--apidog-purple)',
                            backgroundColor: 'var(--apidog-card-bg)',
                            color: 'var(--apidog-text-main)',
                            fontSize: '13px',
                            outline: 'none',
                            width: '240px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--apidog-text-main)' }}>{userEmail}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => setEditingField(editingField === 'email' ? null : 'email')}
                    >
                      {editingField === 'email' ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {/* Row 5: Bio */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Bio
                    </span>
                    <div style={{ flex: 1 }}>
                      {editingField === 'bio' ? (
                        <input
                          type="text"
                          value={userBio}
                          onChange={(e) => setUserBio(e.target.value)}
                          onBlur={() => setEditingField(null)}
                          autoFocus
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--apidog-purple)',
                            backgroundColor: 'var(--apidog-card-bg)',
                            color: 'var(--apidog-text-main)',
                            fontSize: '13px',
                            outline: 'none',
                            width: '240px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--apidog-text-muted)' }}>{userBio}</span>
                      )}
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => setEditingField(editingField === 'bio' ? null : 'bio')}
                    >
                      {editingField === 'bio' ? 'Save' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 2: Improved user experience */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--apidog-text-main)', margin: '0 0 2px 0' }}>
                  Improved user experience
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', display: 'block', marginBottom: '12px' }}>
                  It helps to provide you with better product experience
                </span>

                <div style={{
                  border: '1px solid var(--apidog-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--apidog-card-bg)',
                  overflow: 'hidden'
                }}>
                  {/* Row: Role */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid var(--apidog-border-light)'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Role
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: 'var(--apidog-text-main)' }}>
                      {userRole}
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => {
                        const newRole = prompt('Nhập vai trò của bạn:', userRole);
                        if (newRole) setUserRole(newRole);
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  {/* Row: Development Mode */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                      Development Mode
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: 'var(--apidog-text-muted)' }}>
                      {devMode}
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '4px 14px', borderRadius: '6px' }}
                      onClick={() => {
                        const mode = prompt('Chọn chế độ phát triển (API-First, Code-First...):', devMode);
                        if (mode) setDevMode(mode);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Danger Zone */}
              <div>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--apidog-text-dim)', marginBottom: '8px' }}>
                  Danger Zone
                </h3>

                <div style={{
                  border: '1px solid var(--apidog-border)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--apidog-card-bg)',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ width: '140px', fontSize: '13px', color: 'var(--apidog-text-main)', fontWeight: 500 }}>
                    Delete Account
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', color: 'var(--apidog-text-muted)' }}>
                    Account deletion will permanently remove all personal information.
                  </span>
                  <button
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: '1px solid #EF4444',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
                        alert('Yêu cầu xóa tài khoản đã được tiếp nhận.');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. MY CONNECTIONS VIEW (Matching user's screenshot exactly) */}
          {activeNav === 'connections' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Connected accounts for login
                </p>
              </div>

              <div style={{
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                backgroundColor: '#FFFFFF',
                overflow: 'hidden',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}>
                {/* Row 1: GitHub */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: '1px solid #E5E7EB'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ color: '#181717', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#111827' }}>
                          GitHub
                        </span>
                        {githubConnected ? (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: '#ECFDF5',
                            color: '#10B981'
                          }}>
                            Connected
                          </span>
                        ) : (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: '#FEF2F2',
                            color: '#F87171'
                          }}>
                            Not Connected
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#6B7280', marginTop: '4px' }}>
                        After connecting GitHub, you can login to Apidog with GitHub
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleGithub}
                    style={{
                      padding: '8px 22px',
                      borderRadius: '8px',
                      border: githubConnected ? '1px solid #D1D5DB' : 'none',
                      backgroundColor: githubConnected ? '#FFFFFF' : '#8257E5',
                      color: githubConnected ? '#374151' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (githubConnected) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      else e.currentTarget.style.backgroundColor = '#7045D2';
                    }}
                    onMouseLeave={(e) => {
                      if (githubConnected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      else e.currentTarget.style.backgroundColor = '#8257E5';
                    }}
                  >
                    {githubConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* Row 2: Google */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: 600, color: '#111827' }}>
                          Google
                        </span>
                        {googleConnected ? (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: '#ECFDF5',
                            color: '#10B981'
                          }}>
                            Connected
                          </span>
                        ) : (
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            backgroundColor: '#FEF2F2',
                            color: '#F87171'
                          }}>
                            Not Connected
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#6B7280', marginTop: '4px' }}>
                        After connecting Google, you can login to Apidog with Google
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleGoogle}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      border: googleConnected ? '1px solid #D1D5DB' : 'none',
                      backgroundColor: googleConnected ? '#FFFFFF' : '#8257E5',
                      color: googleConnected ? '#374151' : '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (googleConnected) e.currentTarget.style.backgroundColor = '#F9FAFB';
                      else e.currentTarget.style.backgroundColor = '#7045D2';
                    }}
                    onMouseLeave={(e) => {
                      if (googleConnected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      else e.currentTarget.style.backgroundColor = '#8257E5';
                    }}
                  >
                    {googleConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. APPEARANCE SETTINGS (Exact Match with user screenshot) */}
          {activeNav === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '560px' }}>
              {/* 1. Background Section */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--apidog-text-main)', margin: '0 0 14px 0' }}>
                  Background
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {backgroundOptions.map((opt) => {
                    const isSelected = themeMode === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setThemeMode(opt.id)}
                        title={opt.name}
                        style={{
                          width: '66px',
                          height: '46px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          overflow: 'hidden',
                          boxSizing: 'border-box',
                          border: isSelected ? `2.5px solid ${accentColor}` : '1.5px solid transparent',
                          boxShadow: isSelected ? `0 0 0 1px ${accentColor}, 0 2px 8px rgba(0,0,0,0.15)` : '0 1px 3px rgba(0,0,0,0.06)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {/* Mini Sidebar */}
                        <div style={{
                          width: '24px',
                          backgroundColor: opt.sidebarBg,
                          height: '100%',
                          padding: '6px 3.5px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ width: '8px', height: '1.5px', backgroundColor: opt.sidebarLine, borderRadius: '1px' }} />
                          <div style={{ width: '12px', height: '1.5px', backgroundColor: opt.sidebarLine, borderRadius: '1px' }} />
                        </div>

                        {/* Mini Canvas */}
                        <div style={{
                          flex: 1,
                          backgroundColor: opt.canvasBg,
                          height: '100%',
                          padding: '6px 5px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3.5px',
                          boxSizing: 'border-box'
                        }}>
                          <div style={{ width: '22px', height: '3.5px', backgroundColor: opt.canvasLine, borderRadius: '1px' }} />
                          <div style={{ width: '15px', height: '3.5px', backgroundColor: opt.canvasLine, borderRadius: '1px' }} />
                          <div style={{ width: '18px', height: '3.5px', backgroundColor: opt.canvasLine, borderRadius: '1px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Accent Color Section */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--apidog-text-main)', margin: '0 0 14px 0' }}>
                  Accent Color
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {accentColorList.map((color) => {
                    const isSelected = accentColor.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccentColor(color)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: color,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          transition: 'transform 0.15s ease',
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                          boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.2)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {isSelected && (
                          <Check size={16} color="#FFFFFF" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Font Size Section */}
              <div>
                <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--apidog-text-main)', margin: '0 0 16px 0' }}>
                  Font Size
                </h3>
                
                <div style={{ maxWidth: '480px', width: '100%', position: 'relative', userSelect: 'none' }}>
                  {/* Slider Track with Dots */}
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    {/* Background Bar */}
                    <div style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      height: '4px',
                      backgroundColor: 'var(--apidog-border)',
                      borderRadius: '9999px',
                      zIndex: 1
                    }} />

                    {/* Step Dots Container */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      {[60, 70, 80, 90, 100, 110, 120, 130, 140].map((step) => {
                        const isCurrent = fontSize === step;
                        return (
                          <div
                            key={step}
                            onClick={() => setFontSize(step)}
                            title={`${step}%`}
                            style={{
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            {isCurrent ? (
                              <div style={{
                                width: '14px',
                                height: '14px',
                                borderRadius: '50%',
                                backgroundColor: accentColor,
                                boxShadow: `0 0 0 3px ${accentColor}33`
                              }} />
                            ) : (
                              <div style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--apidog-text-dim)'
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Labels below */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    padding: '0 4px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--apidog-text-muted)'
                  }}>
                    <span onClick={() => setFontSize(60)} style={{ cursor: 'pointer' }}>60%</span>
                    <span onClick={() => setFontSize(80)} style={{ cursor: 'pointer', transform: 'translateX(2px)' }}>80%</span>
                    <span onClick={() => setFontSize(100)} style={{ cursor: 'pointer', color: fontSize === 100 ? 'var(--apidog-text-main)' : 'var(--apidog-text-muted)' }}>100%</span>
                    <span onClick={() => setFontSize(120)} style={{ cursor: 'pointer', transform: 'translateX(-2px)' }}>120%</span>
                    <span onClick={() => setFontSize(140)} style={{ cursor: 'pointer' }}>140%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. GENERAL SETTINGS */}
          {activeNav === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                General Settings
              </h2>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                    Chromium Core Path
                  </label>
                  <input
                    type="text"
                    defaultValue="C:\Program Files\Chromium\chrome.exe"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F3F4F6', paddingTop: '14px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827', display: 'block' }}>Tự động khởi động cùng hệ thống</span>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>Khởi chạy trình quản lý ẩn ở khay hệ thống (System Tray)</span>
                  </div>
                  <input type="checkbox" defaultChecked={true} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          )}

          {/* 4. PROXY SETTINGS */}
          {activeNav === 'proxy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Proxy Settings
              </h2>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: '#374151' }}>
                  Cấu hình proxy mặc định khi khởi tạo profile mới:
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" style={{ fontSize: '12px' }}>SOCKS5 Default</button>
                  <button className="btn btn-secondary" style={{ fontSize: '12px' }}>HTTP Direct</button>
                </div>
              </div>
            </div>
          )}

          {/* 5. ABOUT */}
          {activeNav === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                About Antidetect Browser Manager
              </h2>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-purple)' }}>
                  Apidog Browser Core v2.4.0
                </span>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>
                  Hệ thống giả lập môi trường vân tay phần cứng độc lập, cô lập Cookie và tích hợp Proxy đa kênh.
                </span>
                <div style={{ marginTop: '8px' }}>
                  <span className="badge badge-green">✓ Phiên bản mới nhất</span>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!['account', 'connections', 'appearance', 'general', 'proxy', 'about'].includes(activeNav) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'capitalize' }}>
                {activeNav}
              </h2>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '8px', padding: '28px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                Cấu hình tùy chọn {activeNav} đã sẵn sàng hoạt động cùng tài khoản {userName}.
              </div>
            </div>
          )}
          </div>
        </section>
      </div>
    </div>
  );
}
