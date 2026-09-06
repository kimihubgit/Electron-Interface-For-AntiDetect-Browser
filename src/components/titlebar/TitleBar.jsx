import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  MoreHorizontal, 
  Rocket, 
  RotateCw, 
  Settings, 
  Gift, 
  Bell, 
  Pin, 
  Minus, 
  Square, 
  X,
  Shield,
  Globe,
  LogOut,
  Archive
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function TitleBar() {
  const { activeTab, setActiveTab, setActiveUpgradeModal } = useBrowser();
  const [isPinned, setIsPinned] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState('notification'); // 'notification' | 'todo'
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) {
      window.electronAPI.maximize();
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.close) {
      window.electronAPI.close();
    } else {
      window.close();
    }
  };

  const handleTogglePin = () => {
    if (window.electronAPI?.togglePin) {
      window.electronAPI.togglePin();
      setIsPinned(!isPinned);
    }
  };

  return (
    <div style={{
      height: '38px',
      backgroundColor: '#F8F9FA',
      borderBottom: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: '12px',
      paddingRight: '0px',
      userSelect: 'none',
      WebkitAppRegion: 'drag', // Allows moving the window
      fontSize: '12px',
      position: 'relative',
      zIndex: 100
    }}>
      {/* Left section: Logo + Tabs (Home tab, Active Profile tab, +, ...) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', WebkitAppRegion: 'no-drag' }}>
        {/* Apidog Flower/Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginRight: '8px',
          color: 'var(--apidog-purple)',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Shield size={12} />
          </div>
          <span style={{ fontSize: '12px', color: '#1F2937', fontWeight: 700, letterSpacing: '-0.3px' }}>
            Apidog <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: '11px' }}>Browser</span>
          </span>
        </div>

        {/* Home Tab (like [🏠 Home] in screenshot) */}
        <div 
          onClick={() => setActiveTab('workspace')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: activeTab === 'workspace' ? '#FFFFFF' : 'transparent',
            boxShadow: activeTab === 'workspace' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            border: activeTab === 'workspace' ? '1px solid #E5E7EB' : '1px solid transparent',
            color: activeTab === 'workspace' ? '#111827' : '#6B7280',
            fontWeight: activeTab === 'workspace' ? 600 : 500,
            cursor: 'pointer',
            height: '26px'
          }}
        >
          <Home size={13} style={{ color: activeTab === 'workspace' ? 'var(--apidog-purple)' : '#6B7280' }} />
          <span>Home</span>
        </div>

        {/* Active Profile Tab (with Close 'X' button) */}
        <div 
          onClick={() => setActiveTab('profiles')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: activeTab === 'profiles' ? '#FFFFFF' : 'transparent',
            boxShadow: activeTab === 'profiles' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            border: activeTab === 'profiles' ? '1px solid #E5E7EB' : '1px solid transparent',
            color: activeTab === 'profiles' ? '#111827' : '#6B7280',
            fontWeight: activeTab === 'profiles' ? 600 : 500,
            cursor: 'pointer',
            height: '26px'
          }}
        >
          <Globe size={13} style={{ color: 'var(--apidog-blue)' }} />
          <span>Quản lý Profiles</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveTab('workspace');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: '1px',
              borderRadius: '3px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '2px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            title="Đóng tab"
          >
            <X size={12} />
          </button>
        </div>

        {/* More dots button */}
        <button 
          className="btn-icon-subtle" 
          style={{ width: '24px', height: '24px', WebkitAppRegion: 'no-drag' }}
          title="Tùy chọn khác"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Center Drag Area (empty flexible space for dragging window) */}
      <div style={{ flex: 1, height: '100%' }} />

      {/* Right section: Exactly as in user screenshot! */}
      {/* [Upgrade] [Refresh] [Settings] [Gift] [Bell] [Avatar] | [Pin] [—] [▢] [✕] */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', WebkitAppRegion: 'no-drag' }}>
        {/* Purple Upgrade Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveUpgradeModal(true);
          }}
          style={{
            WebkitAppRegion: 'no-drag',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#F3E8FF',
            color: 'var(--apidog-purple)',
            border: '1px solid #E9D5FF',
            padding: '3px 10px',
            borderRadius: '14px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: '8px'
          }}
        >
          <Rocket size={12} />
          <span>Upgrade</span>
        </button>

        {/* Action icons */}
        <button className="btn-icon-titlebar" title="Đồng bộ">
          <RotateCw size={13} />
        </button>
        <button className="btn-icon-titlebar" title="Cài đặt">
          <Settings size={13} />
        </button>
        <button className="btn-icon-titlebar" title="Ưu đãi & Quà tặng">
          <Gift size={13} />
        </button>
        {/* Notification Button & Popover */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon-titlebar" 
            title="Thông báo"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotifications(!showNotifications);
              setShowAvatarMenu(false);
            }}
            style={{
              backgroundColor: showNotifications ? '#E5E7EB' : 'transparent',
              color: showNotifications ? '#111827' : '#6B7280'
            }}
          >
            <Bell size={13} />
          </button>

          {showNotifications && (
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '32px',
                right: '-40px',
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
                padding: '14px 16px 22px 16px',
                zIndex: 1200,
                cursor: 'default',
                animation: 'fadeIn 0.15s ease-out'
              }}
            >
              {/* Header Tabs */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #F3F4F6',
                paddingBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setNotificationTab('notification')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: notificationTab === 'notification' ? '#F3E8FF' : 'transparent',
                      color: notificationTab === 'notification' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: notificationTab === 'notification' ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    Notification
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotificationTab('todo')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: notificationTab === 'todo' ? '#F3E8FF' : 'transparent',
                      color: notificationTab === 'todo' ? '#7C3AED' : '#6B7280',
                      fontSize: '12px',
                      fontWeight: notificationTab === 'todo' ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    To do
                  </button>
                </div>

                <button
                  type="button"
                  className="btn-icon-subtle"
                  style={{ width: '26px', height: '26px', color: '#6B7280' }}
                  title="Dọn sạch thông báo"
                >
                  <Archive size={15} />
                </button>
              </div>

              {/* Empty state illustration matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '32px', paddingBottom: '12px' }}>
                <div style={{ position: 'relative', width: '130px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Soft base shadow */}
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    width: '100px',
                    height: '22px',
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9'
                  }} />

                  {/* Document sheet */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    width: '74px',
                    height: '70px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '5px',
                    border: '1.5px solid #E2E8F0',
                    padding: '8px 7px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 1,
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                  }}>
                    <div style={{ width: '100%', height: '24px', backgroundColor: '#E2E8F0', borderRadius: '3px' }} />
                    <div style={{ width: '88%', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px' }} />
                    <div style={{ width: '60%', height: '4px', backgroundColor: '#CBD5E1', borderRadius: '2px' }} />
                  </div>

                  {/* Speech Bubble with shapes */}
                  <div style={{
                    position: 'absolute',
                    top: '0px',
                    right: '10px',
                    backgroundColor: '#CBD5E1',
                    borderRadius: '16px',
                    borderBottomLeftRadius: '2px',
                    padding: '3px 7px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    zIndex: 3,
                    color: '#FFFFFF'
                  }}>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>▲</span>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>■</span>
                    <span style={{ fontSize: '6px', lineHeight: 1 }}>●</span>
                  </div>

                  {/* Tray container */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    width: '98px',
                    height: '44px',
                    backgroundColor: '#CBD5E1',
                    borderRadius: '8px',
                    zIndex: 2,
                    clipPath: 'polygon(0% 28%, 18% 28%, 26% 62%, 74% 62%, 82% 28%, 100% 28%, 100% 100%, 0% 100%)'
                  }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#DDE3EA' }} />
                  </div>
                </div>

                <span style={{
                  marginTop: '16px',
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 400,
                  textAlign: 'center'
                }}>
                  You have viewed all notifications.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with dropdown */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowAvatarMenu(!showAvatarMenu);
              setShowNotifications(false);
            }}
            title="Tài khoản cá nhân"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#8B5CF6',
              border: showAvatarMenu ? '2px solid #7C3AED' : '2px solid #C4B5FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              margin: '0 8px',
              cursor: 'pointer',
              boxShadow: showAvatarMenu ? '0 0 0 2px rgba(124, 58, 237, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            K
          </div>

          {showAvatarMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                top: '32px',
                right: '4px',
                width: '165px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
                padding: '4px',
                zIndex: 1200,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                cursor: 'default',
                animation: 'fadeIn 0.12s ease-out'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowAvatarMenu(false);
                  setActiveTab('settings');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={15} style={{ color: '#4B5563' }} />
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAvatarMenu(false);
                  alert('Bạn đã đăng xuất khỏi tài khoản.');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'transparent',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <LogOut size={15} style={{ color: '#4B5563' }} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* Click outside overlay */}
        {(showNotifications || showAvatarMenu) && (
          <div
            onClick={() => {
              setShowNotifications(false);
              setShowAvatarMenu(false);
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1050,
              backgroundColor: 'transparent'
            }}
          />
        )}

        {/* Thin vertical separator */}
        <div style={{ width: '1px', height: '16px', backgroundColor: '#D1D5DB', margin: '0 4px' }} />

        {/* Window Controls: Pin, Minimize, Maximize, Close */}
        <button 
          onClick={handleTogglePin}
          className="btn-window-control" 
          title={isPinned ? "Bỏ ghim cửa sổ" : "Ghim cửa sổ trên cùng"}
          style={{ color: isPinned ? 'var(--apidog-purple)' : '#6B7280' }}
        >
          <Pin size={12} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
        </button>

        <button 
          onClick={handleMinimize}
          className="btn-window-control" 
          title="Thu nhỏ"
        >
          <Minus size={13} />
        </button>

        <button 
          onClick={handleMaximize}
          className="btn-window-control" 
          title="Phóng to"
        >
          <Square size={11} />
        </button>

        <button 
          onClick={handleClose}
          className="btn-window-control btn-window-close" 
          title="Đóng ứng dụng"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
