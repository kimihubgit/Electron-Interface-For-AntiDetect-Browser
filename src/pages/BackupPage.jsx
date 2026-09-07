import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Compass, 
  Star, 
  Clock, 
  Gift, 
  Building2, 
  Globe, 
  X,
  ExternalLink,
  ChevronDown,
  Shield,
  Layers,
  Zap,
  Monitor,
  Fingerprint,
  Trash2,
  Play,
  Search,
  Settings,
  FolderTree,
  FileText
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function BackupPage() {
  const { 
    profiles = [], 
    trashProfiles = [], 
    setActiveProfileModal, 
    setActiveProxyModal, 
    setActiveTab, 
    toggleLaunchProfile, 
    setActiveUpgradeModal, 
    setActiveReferralModal,
    setActiveTrashModal
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
      style={{ display: 'flex', width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}
      onClick={() => {
        if (showMoreMenu) setShowMoreMenu(false);
      }}
    >
      {/* ── LEFT SIDEBAR (My Teams, API Hub, Favorites, Invite) ── */}
      <aside style={{
        width: '230px',
        borderRight: '1px solid #F0F0F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 14px',
        flexShrink: 0
      }}>
        <div>
          {/* My Teams Section */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontWeight: 600,
              color: '#6B7280',
              padding: '0 4px',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} />
                <span>My Teams</span>
                <ChevronDown size={12} />
              </div>
              <button 
                className="btn-icon-titlebar" 
                style={{ width: '22px', height: '22px', color: '#9CA3AF' }}
                title="Tìm kiếm"
              >
                <Search size={13} />
              </button>
            </div>

            {/* Active team: Nhóm cá nhân */}
            <div style={{
              backgroundColor: '#ECEFF4',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1F2937',
              cursor: 'pointer',
              marginBottom: '6px'
            }}>
              Nhóm cá nhân
            </div>

            {/* + New Team button */}
            <button
              onClick={() => setActiveTab('groups')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                color: 'var(--apidog-purple)',
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Quản lý Nhóm</span>
            </button>
          </div>

          {/* Navigation items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div 
              onClick={() => setActiveTab('profiles')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={14} color="#6B7280" />
                <span>Quản lý Profile</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--apidog-purple)', fontWeight: 600 }}>{profiles.length}</span>
            </div>

            <div 
              onClick={() => setActiveTab('proxies')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <Shield size={14} color="#6B7280" />
              <span>Proxy & Mạng</span>
            </div>

            <div 
              onClick={() => setActiveTrashModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#4B5563',
                cursor: 'pointer'
              }}
              className="hover-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={14} color="#6B7280" />
                <span>Thùng rác (Trash)</span>
              </div>
              {trashProfiles.length > 0 && (
                <span style={{ fontSize: '10px', backgroundColor: '#F1F5F9', color: '#64748B', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                  {trashProfiles.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Invite Friends card & Organizations */}
        <div>
          <div style={{
            backgroundColor: '#F5F3FF',
            border: '1px solid #EDE9FE',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
            cursor: 'pointer'
          }}
          onClick={() => setActiveReferralModal('referrals')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--apidog-purple)', fontSize: '12px', fontWeight: 600 }}>
              <Gift size={15} />
              <span>Invite Friends</span>
            </div>
            <span style={{ fontSize: '10px', backgroundColor: '#E0E7FF', color: 'var(--apidog-purple)', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
              Earn $10 Credits
            </span>
          </div>

          <div 
            onClick={() => setActiveTab('settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              color: '#6B7280',
              cursor: 'pointer'
            }}
          >
            <Settings size={14} />
            <span>Cài đặt hệ thống</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px 32px' }}>
        {/* Workspace Title Header */}
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
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Core Chromium: <strong style={{ color: '#10B981' }}>v2.4 Active</strong>
            </span>
          </div>
        </div>

        {/* Yellow/Orange referral banner */}
        {showBanner && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FEF3C7',
            borderRadius: '6px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#92400E',
            marginBottom: '20px'
          }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
              onClick={() => setActiveReferralModal('referrals')}
            >
              <Gift size={14} color="#D97706" />
              <span>Giới thiệu bạn bè để nhận ngay <strong style={{ color: '#D97706' }}>$10 Credits</strong> vào tài khoản ➔</span>
            </div>
            <button 
              onClick={() => setShowBanner(false)}
              style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', opacity: 0.7 }}
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* ── 1. THỐNG KÊ PROFILE & CHỈ SỐ HỆ THỐNG ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {/* Card 1: Tổng số Profile */}
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
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--apidog-purple)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
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
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#F5F3FF',
              color: 'var(--apidog-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={18} />
            </div>
          </div>

          {/* Card 2: Profile Đang chạy */}
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
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10B981'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
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
              width: '38px',
              height: '38px',
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

          {/* Card 3: Sẵn sàng (Idle) */}
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
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#94A3B8'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
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
              width: '38px',
              height: '38px',
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

          {/* Card 4: Proxy Trực tuyến */}
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
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E2E8F0'}
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
              width: '38px',
              height: '38px',
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

        {/* ── 2. THE 4 QUICK ACTION CARDS MATCHING EXACT USER SCREENSHOT ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '26px 20px 24px 20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          marginBottom: '28px',
          position: 'relative'
        }}>
          {/* 4 Cards Grid exactly like user screenshot */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 154px)',
            gap: '16px',
            marginBottom: '16px'
          }}>
            {/* Card 1: New Profile (Blue HTTP-style arrows icon) */}
            <div
              onClick={() => setActiveProfileModal('new')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                padding: '24px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '138px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(37, 99, 235, 0.15)';
                e.currentTarget.style.borderColor = '#2563EB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {/* HTTP Bi-directional arrows icon matching screenshot */}
              <div style={{ marginBottom: '14px', height: '36px', display: 'flex', alignItems: 'center' }}>
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 16H30M30 16L24 10M30 16L24 22" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 24H10M10 24L16 18M10 24L16 30" stroke="#3B82F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', lineHeight: '1.3' }}>
                Tạo Profile mới
              </span>
            </div>

            {/* Card 2: New Proxy (Isometric pink/purple cube matching screenshot) */}
            <div
              onClick={() => setActiveProxyModal(true)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                padding: '24px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '138px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(219, 39, 119, 0.15)';
                e.currentTarget.style.borderColor = '#DB2777';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {/* Isometric 3D Cube Icon matching screenshot */}
              <div style={{ marginBottom: '14px', height: '36px', display: 'flex', alignItems: 'center' }}>
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L32 14V28L20 35L8 28V14L20 7Z" stroke="#EC4899" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 20L32 14M20 20L8 14M20 20V35" stroke="#EC4899" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', lineHeight: '1.3' }}>
                Thêm Proxy mới
              </span>
            </div>

            {/* Card 3: Fingerprint Config (Purple Markdown 'M' icon matching screenshot) */}
            <div
              onClick={() => setActiveTab('settings')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                padding: '24px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '138px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(124, 58, 237, 0.15)';
                e.currentTarget.style.borderColor = 'var(--apidog-purple)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {/* Rounded Markdown 'M' logo matching screenshot */}
              <div style={{ marginBottom: '14px', height: '36px', display: 'flex', alignItems: 'center' }}>
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="7" width="26" height="26" rx="7" stroke="#8B5CF6" strokeWidth="2.4"/>
                  <path d="M14 24V16L17.5 20L21 16V24" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M26 18V24M23.5 21.5L26 24L28.5 21.5" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', lineHeight: '1.3' }}>
                Cấu hình Vân tay
              </span>
            </div>

            {/* Card 4: Quick Launch (Green Lightning icon matching screenshot) */}
            <div
              onClick={() => setActiveTab('profiles')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                padding: '24px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                height: '138px',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.borderColor = '#10B981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              {/* Lightning Bolt icon matching screenshot */}
              <div style={{ marginBottom: '14px', height: '36px', display: 'flex', alignItems: 'center' }}>
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 6L11 21H20L18 34L29 19H20L22 6Z" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1F2937', lineHeight: '1.3' }}>
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
                borderRadius: '4px'
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
      </main>
    </div>
  );
}
