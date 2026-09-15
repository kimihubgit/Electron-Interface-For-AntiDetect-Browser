import React from 'react';
import { Sparkles, Layers, ChevronDown } from 'lucide-react';
import WorkspaceMenuPopover from '../../../components/workspace/WorkspaceMenuPopover';

export default function HomeWorkspaceHeader({
  currentWorkspace,
  totalCount,
  showHomeWorkspaceMenu,
  setShowHomeWorkspaceMenu,
  onOpenUpgradeModal
}) {
  return (
    <div
      style={{
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
      }}
    >
      {/* Left: Workspace details */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div
          style={{
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
          }}
        >
          {(currentWorkspace?.name || 'W').charAt(0).toUpperCase()}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              {currentWorkspace?.name || 'Workspace Mặc Định'}
            </h1>

            {/* Plan Badge */}
            <span
              style={{
                backgroundColor:
                  currentWorkspace?.plan_id === 'plan_enterprise'
                    ? '#EFF6FF'
                    : currentWorkspace?.plan_id === 'plan_pro'
                    ? '#F5F3FF'
                    : currentWorkspace?.plan_id === 'plan_basic'
                    ? '#ECFDF5'
                    : '#F1F5F9',
                color:
                  currentWorkspace?.plan_id === 'plan_enterprise'
                    ? '#1D4ED8'
                    : currentWorkspace?.plan_id === 'plan_pro'
                    ? '#6D28D9'
                    : currentWorkspace?.plan_id === 'plan_basic'
                    ? '#047857'
                    : '#475569',
                border: '1px solid',
                borderColor:
                  currentWorkspace?.plan_id === 'plan_enterprise'
                    ? '#BFDBFE'
                    : currentWorkspace?.plan_id === 'plan_pro'
                    ? '#DDD6FE'
                    : currentWorkspace?.plan_id === 'plan_basic'
                    ? '#A7F3D0'
                    : '#CBD5E1',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sparkles size={11} />
              {currentWorkspace?.plan_name || 'Free Starter'}
            </span>

            {/* Role Badge */}
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: '6px'
              }}
            >
              {currentWorkspace?.role_name || (currentWorkspace?.role === 'owner' ? 'Chủ sở hữu' : 'Thành viên')}
            </span>
          </div>

          {/* Profile Quota Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
            <div
              style={{
                width: '140px',
                height: '6px',
                backgroundColor: '#E2E8F0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, Math.round((totalCount / (currentWorkspace?.max_profiles || 100)) * 100))}%`,
                  height: '100%',
                  backgroundColor: currentWorkspace?.color || '#7C3AED',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease'
                }}
              />
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
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
          onClick={onOpenUpgradeModal}
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
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
        >
          <Sparkles size={14} />
          <span>Nâng cấp Gói</span>
        </button>
      </div>
    </div>
  );
}
