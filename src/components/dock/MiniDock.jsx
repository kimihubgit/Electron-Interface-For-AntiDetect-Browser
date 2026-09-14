import React, { useState, useEffect, useRef } from 'react';
import { Settings, SlidersHorizontal, Layers, X, Power, Maximize2, RotateCcw } from 'lucide-react';

export default function MiniDock() {
  const [runningProfiles, setRunningProfiles] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredProfile, setHoveredProfile] = useState(null);
  const menuRef = useRef(null);

  // Load and listen to running profiles
  useEffect(() => {
    // Initial fetch
    if (window.electronAPI?.getRunningProfilesList) {
      window.electronAPI.getRunningProfilesList().then(list => {
        if (Array.isArray(list)) setRunningProfiles(list);
      });
    }

    // Realtime event listener
    if (window.electronAPI?.onRunningProfilesUpdated) {
      const cleanup = window.electronAPI.onRunningProfilesUpdated((list) => {
        if (Array.isArray(list)) setRunningProfiles(list);
      });
      return cleanup;
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleRestoreMain = () => {
    if (window.electronAPI?.restoreMainWindow) {
      window.electronAPI.restoreMainWindow();
    }
  };

  const handleStopProfile = (e, profileId) => {
    e.stopPropagation();
    if (window.electronAPI?.stopBrowser) {
      window.electronAPI.stopBrowser(profileId);
    }
  };

  const handleStopAll = () => {
    setShowMenu(false);
    if (window.electronAPI?.stopAllBrowsers) {
      window.electronAPI.stopAllBrowsers();
    }
  };

  const handleQuitApp = () => {
    setShowMenu(false);
    if (window.electronAPI?.quitAppCompletely) {
      window.electronAPI.quitAppCompletely();
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 6px',
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.06)',
        userSelect: 'none',
        WebkitAppRegion: 'drag', // Cho phép kéo thả thanh Dock tự do trên màn hình
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ── TOP: LOGO / RESTORE MAIN WINDOW BUTTON ── */}
      <div
        title="Bấm để mở lại giao diện chính"
        onClick={handleRestoreMain}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #38BDF8 0%, #3B82F6 50%, #6366F1 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
          WebkitAppRegion: 'no-drag',
          transition: 'all 0.15s ease',
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
        }}
      >
        {/* Stylized P1 Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '22px' }}>
          <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1px', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            P1
          </span>
        </div>
        {/* "ALL" pill badge */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '6px',
          padding: '1px 6px',
          fontSize: '9px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '0.5px',
          marginTop: '1px'
        }}>
          ALL
        </div>
      </div>

      {/* Top Divider */}
      <div style={{ width: '32px', height: '1px', backgroundColor: '#E2E8F0', margin: '10px 0 8px 0', flexShrink: 0 }} />

      {/* ── MIDDLE: RUNNING PROFILES LIST ── */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
          WebkitAppRegion: 'no-drag'
        }}
      >
        {runningProfiles.length === 0 ? (
          <div
            title="Chưa có profile nào đang chạy"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.45,
              padding: '12px 0'
            }}
          >
            {/* Chromium silhouette icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="12" cy="12" r="4" fill="#94A3B8" />
            </svg>
            <span style={{ fontSize: '9px', fontWeight: 600, color: '#94A3B8', marginTop: '4px' }}>
              0 active
            </span>
          </div>
        ) : (
          runningProfiles.map((item, idx) => {
            const isHovered = hoveredProfile === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredProfile(item.id)}
                onMouseLeave={() => setHoveredProfile(null)}
                title={`${item.name} (PID: ${item.pid || 'Active'})\nNhấp vào để xem, hoặc nhấp dấu × để tắt`}
                style={{
                  width: '46px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: isHovered ? '#EFF6FF' : '#F8FAFC',
                  border: `1.5px solid ${isHovered ? '#3B82F6' : '#E2E8F0'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
              >
                {/* Chrome Icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#CBD5E1" strokeWidth="1.5" fill="#FFFFFF" />
                  <circle cx="12" cy="12" r="4.5" fill="#4285F4" />
                  <path d="M12 2C15.866 2 19.14 4.19 20.78 7.39L12 12V2Z" fill="#EA4335" />
                  <path d="M20.78 7.39C21.56 8.75 22 10.32 22 12C22 16.03 19.64 19.51 16.24 21.14L12 12L20.78 7.39Z" fill="#FBBC05" />
                  <path d="M16.24 21.14C14.97 21.75 13.53 22 12 22C7.03 22 3 17.97 3 13C3 10.95 3.69 9.06 4.85 7.55L12 12L16.24 21.14Z" fill="#34A853" />
                </svg>

                {/* Profile Number Label */}
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: isHovered ? '#1D4ED8' : '#334155',
                    marginTop: '2px'
                  }}
                >
                  #{item.order || idx + 1}
                </span>

                {/* Close Button on Hover */}
                {isHovered && (
                  <div
                    onClick={(e) => handleStopProfile(e, item.id)}
                    title="Đóng profile này"
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={10} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Divider */}
      <div style={{ width: '32px', height: '1px', backgroundColor: '#E2E8F0', margin: '8px 0', flexShrink: 0 }} />

      {/* ── BOTTOM ACTIONS: ARRANGE & SETTINGS ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          WebkitAppRegion: 'no-drag',
          flexShrink: 0
        }}
      >
        {/* Arrange Windows Button */}
        <button
          onClick={handleRestoreMain}
          title="Sắp xếp cửa sổ / Mở cửa sổ chính"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F1F5F9';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <SlidersHorizontal size={18} />
        </button>

        {/* Settings Menu Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          title="Tùy chọn & Thoát ứng dụng"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: showMenu ? '#EDE9FE' : 'transparent',
            color: showMenu ? '#7C3AED' : '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!showMenu) {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }
          }}
          onMouseLeave={(e) => {
            if (!showMenu) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }
          }}
        >
          <Settings size={18} />
        </button>
      </div>

      {/* ── SETTINGS POPOVER MENU ── */}
      {showMenu && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '60px',
            width: '180px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            zIndex: 9999,
            WebkitAppRegion: 'no-drag'
          }}
        >
          <button
            onClick={handleRestoreMain}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Maximize2 size={14} color="#3B82F6" />
            <span>Mở cửa sổ chính</span>
          </button>

          {runningProfiles.length > 0 && (
            <button
              onClick={handleStopAll}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '12px',
                fontWeight: 600,
                color: '#D97706',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF3C7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <RotateCcw size={14} color="#D97706" />
              <span>Dừng tất cả profiles</span>
            </button>
          )}

          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '4px 0' }} />

          <button
            onClick={handleQuitApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: '#EF4444',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Power size={14} color="#EF4444" />
            <span>Thoát hoàn toàn</span>
          </button>
        </div>
      )}
    </div>
  );
}
