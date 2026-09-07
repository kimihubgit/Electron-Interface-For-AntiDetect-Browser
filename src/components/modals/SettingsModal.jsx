import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function SettingsModal() {
  const { activeSettingsModal, setActiveSettingsModal } = useBrowser();

  const [activeNav, setActiveNav] = useState('account'); // 'account' | 'connections' | 'tokens' | 'referrals' | 'notifications' | 'appearance' | 'language' | 'general' | 'shortcuts' | 'certificates' | 'proxy' | 'extensions' | 'external' | 'security' | 'performance' | 'about'

  // User Profile State matching screenshot
  const [userName, setUserName] = useState('Võ Văn Khải');
  const [userEmail, setUserEmail] = useState('vkhai2603@gmail.com');
  const [userBio, setUserBio] = useState('-');
  const [userRole, setUserRole] = useState('Backend Developer');
  const [devMode, setDevMode] = useState('Please select the development mode.');

  // Inline edit toggles
  const [editingField, setEditingField] = useState(null);

  if (!activeSettingsModal) return null;

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
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          overflow: 'hidden',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Left Navigation Sidebar */}
        <aside style={{
          width: '240px',
          backgroundColor: '#FAFBFD',
          borderRight: '1px solid #E5E7EB',
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
                color: '#6B7280',
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
                        backgroundColor: isActive ? '#F3E8FF' : 'transparent',
                        color: isActive ? 'var(--apidog-purple)' : '#374151',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon size={15} style={{ color: isActive ? 'var(--apidog-purple)' : '#6B7280' }} />
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
                color: '#6B7280',
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
                        backgroundColor: isActive ? '#F3E8FF' : 'transparent',
                        color: isActive ? 'var(--apidog-purple)' : '#374151',
                        fontSize: '13px',
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <Icon size={15} style={{ color: isActive ? 'var(--apidog-purple)' : '#6B7280' }} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Sidebar: Sign Out button */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
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
                color: '#374151',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                width: '100%',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={15} style={{ color: '#6B7280' }} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <section style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
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
            borderBottom: '1px solid #F1F3F5',
            backgroundColor: '#FFFFFF',
            flexShrink: 0
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
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
                color: '#6B7280',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F3F4F6';
                e.currentTarget.style.color = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6B7280';
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
            backgroundColor: '#FFFFFF',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>

          {/* 1. MY ACCOUNT VIEW (Exact Match with user screenshot) */}
          {activeNav === 'account' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Section 1: My Profile */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>
                  My Profile
                </h3>

                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}>
                  {/* Row 1: Avatar */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                      Avatar
                    </span>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      {/* Avatar Image container matching screenshot */}
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '1.5px solid #E5E7EB',
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
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
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
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: '#111827' }}>{userName}</span>
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
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                      Password
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: '#6B7280' }}>
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
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
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
                            fontSize: '13px',
                            outline: 'none',
                            width: '240px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: '#111827' }}>{userEmail}</span>
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
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
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
                            fontSize: '13px',
                            outline: 'none',
                            width: '240px'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>{userBio}</span>
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
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px 0' }}>
                  Improved user experience
                </h3>
                <span style={{ fontSize: '12px', color: '#6B7280', display: 'block', marginBottom: '12px' }}>
                  It helps to provide you with better product experience
                </span>

                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}>
                  {/* Row: Role */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid #F3F4F6'
                  }}>
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                      Role
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: '#111827' }}>
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
                    <span style={{ width: '140px', fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                      Development Mode
                    </span>
                    <div style={{ flex: 1, fontSize: '13px', color: '#6B7280' }}>
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
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', marginBottom: '8px' }}>
                  Danger Zone
                </h3>

                <div style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ width: '140px', fontSize: '13px', color: '#111827', fontWeight: 500 }}>
                    Delete Account
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', color: '#6B7280' }}>
                    Account deletion will permanently remove all personal information.
                  </span>
                  <button
                    style={{
                      padding: '5px 14px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      color: '#DC2626',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
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

          {/* 2. GENERAL SETTINGS */}
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

          {/* 3. PROXY SETTINGS */}
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

          {/* 4. ABOUT */}
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
          {!['account', 'general', 'proxy', 'about'].includes(activeNav) && (
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
