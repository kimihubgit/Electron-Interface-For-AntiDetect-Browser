import React from 'react';
import { ChevronDown, FolderTree, Trash2, Settings } from 'lucide-react';

export default function HomeQuickActionCards({
  onNewProfile,
  onNewProxy,
  onOpenSettings,
  onQuickLaunch,
  showMoreMenu,
  setShowMoreMenu,
  onOpenGroups,
  onOpenTrash,
  t
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px auto 40px auto',
        width: '100%',
        maxWidth: '860px'
      }}
    >
      {/* Grid of 4 Big Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 180px)',
          gap: '18px',
          justifyContent: 'center',
          marginBottom: '22px'
        }}
      >
        {/* Box 1: New HTTP Endpoint / New Profile */}
        <div
          onClick={onNewProfile}
          title={`New HTTP Endpoint - ${t('home.boxNewProfileDesc')}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EFF1F5',
            height: '235px',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '52px 14px 26px 14px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(127, 174, 251, 0.25)';
            e.currentTarget.style.borderColor = '#7FAEFB';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#EFF1F5';
          }}
        >
          <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 10h26m0 0l-5-5m5 5l-5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <text x="22" y="23.5" textAnchor="middle" fill="#7FAEFB" fontSize="10.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">HTTP</text>
              <path d="M35 30H9m0 0l5-5m-5 5l5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
            {t('home.boxNewProfile')}
          </span>
        </div>

        {/* Box 2: New Schema / New Proxy */}
        <div
          onClick={onNewProxy}
          title={`New Schema - ${t('home.boxNewProxyDesc')}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EFF1F5',
            height: '235px',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '52px 14px 26px 14px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(235, 117, 206, 0.25)';
            e.currentTarget.style.borderColor = '#EB75CE';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#EFF1F5';
          }}
        >
          <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 6L36 14V30L22 38L8 30V14L22 6Z" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 22L36 14M22 22L8 14M22 22V38" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
            {t('home.boxNewProxy')}
          </span>
        </div>

        {/* Box 3: New Markdown / Fingerprint Engine */}
        <div
          onClick={onOpenSettings}
          title={`New Markdown - ${t('home.boxFingerprintDesc')}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EFF1F5',
            height: '235px',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '52px 14px 26px 14px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(147, 153, 246, 0.25)';
            e.currentTarget.style.borderColor = '#9399F6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#EFF1F5';
          }}
        >
          <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 6H25L33 14V33C33 35 31.4 36.6 29.4 36.6H13C11 36.6 9.4 35 9.4 33V9.6C9.4 7.6 11 6 13 6Z" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25 6V14H33" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.5 28.5V20L21.2 24.8L26.9 20V28.5" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
            {t('home.boxFingerprint')}
          </span>
        </div>

        {/* Box 4: Quick Request / Quick Launch */}
        <div
          onClick={onQuickLaunch}
          title={`Quick Request - ${t('home.boxQuickLaunchDesc')}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #EFF1F5',
            height: '235px',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '52px 14px 26px 14px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(116, 199, 147, 0.25)';
            e.currentTarget.style.borderColor = '#74C793';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
            e.currentTarget.style.borderColor = '#EFF1F5';
          }}
        >
          <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="40" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24.5 6L13.5 23H22.5L18.5 37L31.5 19H22.5L24.5 6Z" stroke="#74C793" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
            {t('home.boxQuickLaunch')}
          </span>
        </div>
      </div>

      {/* More ▾ Button with Dropdown */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMoreMenu((prev) => !prev);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '12px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#0F172A')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
        >
          <span>{t('home.more')}</span>
          <ChevronDown size={12} />
        </button>

        {showMoreMenu && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12)',
              minWidth: '180px',
              zIndex: 200,
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              animation: 'fadeInModal 0.15s ease'
            }}
          >
            <div
              onClick={onOpenGroups}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FolderTree size={14} color="#6366F1" />
              <span>{t('home.manageGroups')}</span>
            </div>

            <div
              onClick={onOpenTrash}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Trash2 size={14} color="#DC2626" />
              <span>{t('home.openTrash')}</span>
            </div>

            <div
              onClick={onOpenSettings}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#334155',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Settings size={14} color="#475569" />
              <span>{t('home.systemSettings')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
