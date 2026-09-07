import React, { useState } from 'react';
import { 
  Globe, 
  Play, 
  Monitor, 
  Shield, 
  Gift, 
  X, 
  ChevronDown, 
  FolderTree, 
  Trash2, 
  Settings 
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function HomePage() {
  const { 
    profiles = [], 
    setActiveProfileModal, 
    setActiveProxyModal, 
    setActiveTab, 
    setActiveTrashModal,
    setActiveReferralModal
  } = useBrowser();

  const [showBanner, setShowBanner] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Stats calculation
  const totalCount = profiles.length;
  const runningCount = profiles.filter(p => p.status === 'running').length;
  const idleCount = totalCount - runningCount;
  const proxyCount = profiles.filter(p => p.proxy?.host).length;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%', 
        height: '100%', 
        minHeight: 0, 
        overflowY: 'auto', 
        backgroundColor: '#FFFFFF',
        padding: '28px 40px 48px 40px',
        boxSizing: 'border-box'
      }}
      onClick={() => {
        if (showMoreMenu) setShowMoreMenu(false);
      }}
    >
      {/* ── 1. WORKSPACE HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Không gian làm việc Antidetect
          </h1>
          <span style={{
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '12px'
          }}>
            Team Owner
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Core Chromium: <strong style={{ color: '#10B981' }}>v2.4 Active</strong>
          </span>
        </div>
      </div>

      {/* ── 2. REFERRAL BANNER ── */}
      {showBanner && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FEF3C7',
          borderRadius: '8px',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12.5px',
          color: '#92400E',
          marginBottom: '24px'
        }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => setActiveReferralModal('referrals')}
          >
            <Gift size={15} color="#D97706" />
            <span>Giới thiệu bạn bè để nhận ngay <strong style={{ color: '#D97706' }}>$10 Credits</strong> vào tài khoản ➔</span>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', opacity: 0.7, padding: '2px' }}
            title="Đóng thông báo"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── 3. PROFILE STATISTICS CARDS ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        {/* Stat 1: Total Profiles */}
        <div 
          onClick={() => setActiveTab('profiles')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--apidog-purple)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Tổng Profile
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
              {totalCount}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#F5F3FF',
            color: 'var(--apidog-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={19} />
          </div>
        </div>

        {/* Stat 2: Running Profiles */}
        <div 
          onClick={() => setActiveTab('profiles')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10B981';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
              Đang hoạt động
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#065F46', marginTop: '2px' }}>
              {runningCount}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#DCFCE7',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Play size={18} style={{ fill: '#16A34A' }} />
          </div>
        </div>

        {/* Stat 3: Idle Profiles */}
        <div 
          onClick={() => setActiveTab('profiles')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#94A3B8';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Sẵn sàng (Idle)
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#1E293B', marginTop: '2px' }}>
              {idleCount}
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Monitor size={18} />
          </div>
        </div>

        {/* Stat 4: Configured Proxies */}
        <div 
          onClick={() => setActiveTab('proxies')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            padding: '14px 18px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563EB';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E2E8F0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', color: '#1D4ED8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Proxy Đã gán
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#1E3A8A', marginTop: '2px' }}>
              {proxyCount} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>/ {totalCount}</span>
            </div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={18} />
          </div>
        </div>
      </div>

      {/* ── 4. THE 4 BIG PROMINENT ACTION BOXES (EXACT MATCH USER SCREENSHOT) ── */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '20px auto 40px auto',
        width: '100%',
        maxWidth: '860px'
      }}>
        {/* Grid of 4 Big Cards (Exact Match to Reference Screenshot) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 180px)',
          gap: '18px',
          justifyContent: 'center',
          marginBottom: '22px'
        }}>
          {/* Box 1: New HTTP Endpoint / New Profile */}
          <div
            onClick={() => setActiveProfileModal('new')}
            title="New HTTP Endpoint - Tạo profile trình duyệt mới"
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
            {/* Soft Sky Blue HTTP bidirectional arrows icon (#7FAEFB) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10h26m0 0l-5-5m5 5l-5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="22" y="23.5" textAnchor="middle" fill="#7FAEFB" fontSize="10.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">HTTP</text>
                <path d="M35 30H9m0 0l5-5m-5 5l5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              Tạo Profile mới
            </span>
          </div>

          {/* Box 2: New Schema / New Proxy */}
          <div
            onClick={() => setActiveProxyModal(true)}
            title="New Schema - Thêm & cấu hình Proxy mới"
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
            {/* Soft Orchid/Pink isometric 3D cube icon (#EB75CE) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6L36 14V30L22 38L8 30V14L22 6Z" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 22L36 14M22 22L8 14M22 22V38" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              Thêm Proxy mới
            </span>
          </div>

          {/* Box 3: New Markdown / Fingerprint Engine */}
          <div
            onClick={() => setActiveTab('settings')}
            title="New Markdown - Cấu hình hệ thống & vân tay"
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
            {/* Soft Periwinkle Purple document with dog-ear & letter M (#9399F6) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6H25L33 14V33C33 35 31.4 36.6 29.4 36.6H13C11 36.6 9.4 35 9.4 33V9.6C9.4 7.6 11 6 13 6Z" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 6V14H33" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.5 28.5V20L21.2 24.8L26.9 20V28.5" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              Cấu hình Vân tay
            </span>
          </div>

          {/* Box 4: Quick Request / Quick Launch */}
          <div
            onClick={() => setActiveTab('profiles')}
            title="Quick Request - Khởi chạy trình duyệt nhanh"
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
            {/* Soft Pastel Mint/Green outline lightning bolt (#74C793) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.5 6L13.5 23H22.5L18.5 37L31.5 19H22.5L24.5 6Z" stroke="#74C793" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              Khởi chạy nhanh
            </span>
          </div>
        </div>

        {/* More ▾ Button with Dropdown (matching screenshot) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(prev => !prev);
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
            onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
          >
            <span>More</span>
            <ChevronDown size={12} />
          </button>

          {/* Dropdown Menu */}
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
                onClick={() => {
                  setActiveTab('groups');
                  setShowMoreMenu(false);
                }}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <FolderTree size={14} color="#6366F1" />
                <span>Quản lý Nhóm</span>
              </div>

              <div
                onClick={() => {
                  setActiveTrashModal(true);
                  setShowMoreMenu(false);
                }}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={14} color="#DC2626" />
                <span>Mở Thùng rác (Trash)</span>
              </div>

              <div
                onClick={() => {
                  setActiveTab('settings');
                  setShowMoreMenu(false);
                }}
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
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Settings size={14} color="#475569" />
                <span>Cài đặt hệ thống</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
