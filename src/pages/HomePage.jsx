import React, { useState, useEffect, useCallback } from 'react';
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
  Settings,
  Sparkles,
  Layers,
  Cpu,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';
import WorkspaceMenuPopover from '../components/workspace/WorkspaceMenuPopover';

export default function HomePage() {
  const { t } = useTranslation();
  const { 
    profiles = [], 
    setActiveProfileModal, 
    setActiveProxyModal, 
    setActiveTab, 
    setActiveTrashModal,
    setActiveReferralModal,
    currentWorkspace,
    setActiveUpgradeModal
  } = useBrowser();

  const [showBanner, setShowBanner] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showHomeWorkspaceMenu, setShowHomeWorkspaceMenu] = useState(false);

  // System Hardware Stats (CPU & RAM) - Polling định kỳ 30s tránh lag giao diện
  const [systemStats, setSystemStats] = useState({
    cpuPercent: 14,
    cpuModel: 'Intel / AMD Processor',
    cpuCores: 8,
    totalMemGB: '16.0',
    usedMemGB: '6.2',
    freeMemGB: '9.8',
    memPercent: 38,
    platform: 'Windows'
  });
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [lastStatsUpdated, setLastStatsUpdated] = useState(new Date());

  const fetchSystemStats = useCallback(async () => {
    if (window.electronAPI?.getSystemStats) {
      try {
        setIsRefreshingStats(true);
        const res = await window.electronAPI.getSystemStats();
        if (res.success && res.data) {
          setSystemStats(res.data);
          setLastStatsUpdated(new Date());
        }
      } catch (e) {
        console.warn('Failed to fetch system stats:', e);
      } finally {
        setIsRefreshingStats(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchSystemStats();
    // 30s interval nhẹ nhàng, tạm dừng khi tab bị ẩn để chống lag 100%
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchSystemStats();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemStats]);

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
        padding: '24px 36px 48px 36px',
        boxSizing: 'border-box'
      }}
      onClick={() => {
        if (showMoreMenu) setShowMoreMenu(false);
        if (showHomeWorkspaceMenu) setShowHomeWorkspaceMenu(false);
      }}
    >
      {/* ── 1. WORKSPACE HEADER & STATUS BAR ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '16px 20px',
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        marginBottom: '20px'
      }}>
        {/* Left: Workspace details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: currentWorkspace?.color || '#7C3AED',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            {(currentWorkspace?.name || 'W').charAt(0).toUpperCase()}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                {currentWorkspace?.name || 'Workspace Mặc Định'}
              </h1>

              {/* Plan Badge */}
              <span style={{
                backgroundColor: currentWorkspace?.plan_id === 'plan_enterprise' ? '#EFF6FF' :
                                 currentWorkspace?.plan_id === 'plan_pro' ? '#F5F3FF' :
                                 currentWorkspace?.plan_id === 'plan_basic' ? '#ECFDF5' : '#F1F5F9',
                color: currentWorkspace?.plan_id === 'plan_enterprise' ? '#1D4ED8' :
                       currentWorkspace?.plan_id === 'plan_pro' ? '#6D28D9' :
                       currentWorkspace?.plan_id === 'plan_basic' ? '#047857' : '#475569',
                border: '1px solid',
                borderColor: currentWorkspace?.plan_id === 'plan_enterprise' ? '#BFDBFE' :
                             currentWorkspace?.plan_id === 'plan_pro' ? '#DDD6FE' :
                             currentWorkspace?.plan_id === 'plan_basic' ? '#A7F3D0' : '#CBD5E1',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} />
                {currentWorkspace?.plan_name || 'Free Starter'}
              </span>

              {/* Role Badge */}
              <span style={{
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '6px'
              }}>
                {currentWorkspace?.role_name || (currentWorkspace?.role === 'owner' ? 'Chủ sở hữu' : 'Thành viên')}
              </span>
            </div>

            {/* Profile Quota Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <div style={{
                width: '140px',
                height: '6px',
                backgroundColor: '#E2E8F0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, Math.round((totalCount / (currentWorkspace?.max_profiles || 100)) * 100))}%`,
                  height: '100%',
                  backgroundColor: currentWorkspace?.color || '#7C3AED',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>
                {totalCount} / {currentWorkspace?.max_profiles || '5'} Profiles ({Math.round((totalCount / (currentWorkspace?.max_profiles || 5)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Switch Workspace dropdown & Upgrade button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHomeWorkspaceMenu(!showHomeWorkspaceMenu);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <Layers size={14} style={{ color: '#64748B' }} />
              <span>Chuyển Workspace</span>
              <ChevronDown size={13} style={{ color: '#94A3B8' }} />
            </button>

            {showHomeWorkspaceMenu && (
              <WorkspaceMenuPopover
                onClose={() => setShowHomeWorkspaceMenu(false)}
                align="right"
              />
            )}
          </div>

          <button
            onClick={() => setActiveUpgradeModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple, #7C3AED)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
          >
            <Sparkles size={14} />
            <span>Nâng cấp Gói</span>
          </button>
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
            <span>{t('home.referralBanner', 'Giới thiệu bạn bè để nhận ngay {amount} Credits vào tài khoản ➔', { amount: '$10' })}</span>
          </div>
          <button 
            onClick={() => setShowBanner(false)}
            style={{ background: 'none', border: 'none', color: '#92400E', cursor: 'pointer', opacity: 0.7, padding: '2px' }}
            title={t('home.closeBanner', 'Đóng thông báo')}
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
              {t('home.statTotal', 'Tổng Profile')}
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
              {t('home.statRunning', 'Đang hoạt động')}
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
              {t('home.statIdle', 'Sẵn sàng (Idle)')}
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
              {t('home.statProxy', 'Proxy Đã gán')}
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

      {/* ── 3.1. SYSTEM HARDWARE & PERFORMANCE STATS (CPU & RAM) ── */}
      <div style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px 20px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#4F46E5" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
              Tài Nguyên Hệ Thống (Hardware Monitor)
            </span>
            <span style={{
              fontSize: '11px',
              backgroundColor: '#EEF2FF',
              color: '#4F46E5',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: 600
            }}>
              Cập nhật định kỳ 30s
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '11.5px', color: '#64748B' }}>
              Lần cập nhật: {lastStatsUpdated.toLocaleTimeString()}
            </span>
            <button
              onClick={fetchSystemStats}
              disabled={isRefreshingStats}
              title="Làm mới thông số tài nguyên"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#3B82F6',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={12} className={isRefreshingStats ? 'animate-spin' : ''} />
              <span>{isRefreshingStats ? 'Đang đọc...' : 'Làm mới'}</span>
            </button>
          </div>
        </div>

        {/* 2 Column Cards for CPU and RAM */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px'
        }}>
          {/* CPU Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Cpu size={17} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      CPU Usage
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: systemStats.cpuPercent > 80 ? '#FEF2F2' : '#ECFDF5',
                      color: systemStats.cpuPercent > 80 ? '#DC2626' : '#059669'
                    }}>
                      {systemStats.cpuPercent > 80 ? 'Tải cao' : 'Ổn định'}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                    {systemStats.cpuCores} Cores • {systemStats.cpuModel}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: systemStats.cpuPercent > 80 ? '#EF4444' : systemStats.cpuPercent > 50 ? '#F59E0B' : '#10B981'
                }}>
                  {systemStats.cpuPercent}%
                </span>
              </div>
            </div>

            {/* CPU Bar */}
            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: '#F1F5F9',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${systemStats.cpuPercent}%`,
                backgroundColor: systemStats.cpuPercent > 80 ? '#EF4444' : systemStats.cpuPercent > 50 ? '#F59E0B' : '#10B981',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

          {/* RAM Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                  color: '#6366F1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Activity size={17} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      Bộ Nhớ RAM
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                      backgroundColor: systemStats.memPercent > 85 ? '#FEF2F2' : '#EEF2FF',
                      color: systemStats.memPercent > 85 ? '#DC2626' : '#4F46E5'
                    }}>
                      {systemStats.usedMemGB} GB / {systemStats.totalMemGB} GB
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                    Khả dụng: {systemStats.freeMemGB} GB trống • Nền tảng: {systemStats.platform}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: systemStats.memPercent > 85 ? '#EF4444' : systemStats.memPercent > 70 ? '#F59E0B' : '#6366F1'
                }}>
                  {systemStats.memPercent}%
                </span>
              </div>
            </div>

            {/* RAM Bar */}
            <div style={{
              height: '6px',
              width: '100%',
              backgroundColor: '#F1F5F9',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${systemStats.memPercent}%`,
                backgroundColor: systemStats.memPercent > 85 ? '#EF4444' : systemStats.memPercent > 70 ? '#F59E0B' : '#6366F1',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }} />
            </div>
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
            {/* Soft Sky Blue HTTP bidirectional arrows icon (#7FAEFB) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="44" height="40" viewBox="0 0 44 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 10h26m0 0l-5-5m5 5l-5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="22" y="23.5" textAnchor="middle" fill="#7FAEFB" fontSize="10.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">HTTP</text>
                <path d="M35 30H9m0 0l5-5m-5 5l5 5" stroke="#7FAEFB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              {t('home.boxNewProfile')}
            </span>
          </div>

          {/* Box 2: New Schema / New Proxy */}
          <div
            onClick={() => setActiveProxyModal(true)}
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
            {/* Soft Orchid/Pink isometric 3D cube icon (#EB75CE) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 6L36 14V30L22 38L8 30V14L22 6Z" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 22L36 14M22 22L8 14M22 22V38" stroke="#EB75CE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              {t('home.boxNewProxy')}
            </span>
          </div>

          {/* Box 3: New Markdown / Fingerprint Engine */}
          <div
            onClick={() => setActiveTab('settings')}
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
            {/* Soft Periwinkle Purple document with dog-ear & letter M (#9399F6) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6H25L33 14V33C33 35 31.4 36.6 29.4 36.6H13C11 36.6 9.4 35 9.4 33V9.6C9.4 7.6 11 6 13 6Z" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M25 6V14H33" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.5 28.5V20L21.2 24.8L26.9 20V28.5" stroke="#9399F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              {t('home.boxFingerprint')}
            </span>
          </div>

          {/* Box 4: Quick Request / Quick Launch */}
          <div
            onClick={() => setActiveTab('profiles')}
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
            {/* Soft Pastel Mint/Green outline lightning bolt (#74C793) */}
            <div style={{ height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.5 6L13.5 23H22.5L18.5 37L31.5 19H22.5L24.5 6Z" stroke="#74C793" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#262626', lineHeight: '1.3' }}>
              {t('home.boxQuickLaunch')}
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
            <span>{t('home.more')}</span>
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
                <span>{t('home.manageGroups')}</span>
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
                <span>{t('home.openTrash')}</span>
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
                <span>{t('home.systemSettings')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
