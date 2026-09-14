import React, { useState } from 'react';
import { Check, Plus, Sparkles, Layers, ChevronRight, X } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function WorkspaceMenuPopover({
  workspaces: propWorkspaces,
  currentWorkspace: propCurrentWorkspace,
  onSelectWorkspace: propOnSelectWorkspace,
  onCreateWorkspace: propOnCreateWorkspace,
  onOpenUpgrade: propOnOpenUpgrade,
  onClose = () => {},
  align = 'left'
}) {
  const browser = useBrowser() || {};
  const rawWorkspaces = propWorkspaces || browser.workspaces || [];
  const workspaces = Array.isArray(rawWorkspaces)
    ? rawWorkspaces.filter(w => w && typeof w === 'object' && w.id)
    : [];
  const currentWorkspace = propCurrentWorkspace || browser.currentWorkspace;
  const switchWorkspace = browser.switchWorkspace;
  const openWorkspaceTab = browser.openWorkspaceTab || browser.switchWorkspace;
  const createWorkspace = browser.createWorkspace;
  const setActiveTab = browser.setActiveTab;
  const setActiveUpgradeModal = browser.setActiveUpgradeModal;
  const currentUser = browser.currentUser;

  const [isCreating, setIsCreating] = useState(false);
  const [newWsName, setNewWsName] = useState('');

  const handleSelectWorkspace = (ws) => {
    if (propOnSelectWorkspace) {
      propOnSelectWorkspace(ws);
    } else if (openWorkspaceTab) {
      openWorkspaceTab(ws);
    } else if (switchWorkspace) {
      switchWorkspace(ws);
    }
    // Switch immediately to the workspace/profiles tab!
    if (setActiveTab) {
      setActiveTab('profiles');
    }
    onClose();
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newWsName.trim()) return;
    if (propOnCreateWorkspace) {
      propOnCreateWorkspace({ name: newWsName.trim() });
    } else if (createWorkspace) {
      createWorkspace({ name: newWsName.trim() });
    }
    // Switch immediately to the workspace/profiles tab!
    if (setActiveTab) {
      setActiveTab('profiles');
    }
    setNewWsName('');
    setIsCreating(false);
    onClose();
  };

  const handleOpenUpgrade = () => {
    if (propOnOpenUpgrade) {
      propOnOpenUpgrade();
    } else if (setActiveUpgradeModal) {
      setActiveUpgradeModal(true);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        [align === 'right' ? 'right' : 'left']: 0,
        width: '320px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 16px 36px -6px rgba(15, 23, 42, 0.16), 0 6px 16px -4px rgba(0, 0, 0, 0.08)',
        padding: '10px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        userSelect: 'none',
        animation: 'fadeIn 0.12s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── HEADER ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 8px 8px 8px',
        borderBottom: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} style={{ color: '#0284C7' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Không gian làm việc
          </span>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 600,
          color: '#64748B',
          backgroundColor: '#F8FAFC',
          padding: '1px 6px',
          borderRadius: '4px',
          border: '1px solid #E2E8F0'
        }}>
          {workspaces.length}
        </span>
      </div>

      {/* ── CREATE FORM (IF OPEN) ── */}
      {isCreating ? (
        <form onSubmit={handleCreateSubmit} style={{ padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>Tạo Workspace Mới</span>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px' }}
            >
              <X size={14} />
            </button>
          </div>

          <input
            type="text"
            value={newWsName}
            onChange={(e) => setNewWsName(e.target.value)}
            placeholder="Tên workspace (VD: FB Ads Agency)"
            autoFocus
            style={{
              height: '32px',
              padding: '0 8px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '12.5px',
              outline: 'none'
            }}
          />

          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              style={{
                flex: 1,
                height: '30px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                flex: 1.5,
                height: '30px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Tạo & Chuyển ngay
            </button>
          </div>
        </form>
      ) : (
        /* ── WORKSPACES LIST ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '250px', overflowY: 'auto', padding: '4px 0' }}>
          {workspaces.map((ws) => {
            if (!ws || typeof ws !== 'object' || !ws.id) return null;
            const isActive = currentWorkspace?.id === ws.id;
            const wsName = ws.name || 'Workspace';

            return (
              <div
                key={ws.id}
                onClick={() => handleSelectWorkspace(ws)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: '7px',
                  backgroundColor: isActive ? '#F0F9FF' : 'transparent',
                  border: isActive ? '1px solid #BAE6FD' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {/* Left: Icon & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                  {/* Initial Avatar */}
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '7px',
                    backgroundColor: ws.color || '#3B82F6',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {wsName[0]?.toUpperCase() || 'W'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? '#0369A1' : '#1E293B',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {wsName}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>
                        {ws.role === 'owner' || !ws.role ? 'Chủ sở hữu' : (ws.role_name || 'Thành viên')}
                      </span>
                      {ws.is_default && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '0 4px',
                          borderRadius: '3px'
                        }}>
                          Mặc định
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Active Checkmark */}
                {isActive && (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginLeft: '8px'
                  }}>
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── FOOTER ACTIONS ── */}
      <div style={{
        borderTop: '1px solid #F1F5F9',
        paddingTop: '6px',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px'
      }}>
        {/* Nút Tạo Workspace */}
        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 8px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus size={14} style={{ color: '#0284C7' }} />
            <span>Tạo Không gian làm việc mới</span>
          </button>
        )}

        {/* Nút Nâng cấp gói */}
        <button
          type="button"
          onClick={handleOpenUpgrade}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 8px',
            borderRadius: '6px',
            border: 'none',
            background: '#FDF4FF',
            color: '#7C3AED',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.12s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3E8FF'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FDF4FF'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} style={{ color: '#9333EA' }} />
            <span>Nâng cấp gói tài khoản ({currentUser?.packageName || 'Free Starter'})</span>
          </div>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
