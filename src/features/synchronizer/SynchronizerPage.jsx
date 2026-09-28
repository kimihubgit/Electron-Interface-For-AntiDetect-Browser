import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import {
  Crown,
  MoreHorizontal,
  Square,
  Globe,
  Monitor,
  ArrowRight,
  Layers,
  Check
} from 'lucide-react';

export default function SynchronizerPage() {
  const { profiles = [], toggleLaunchProfile, setActiveTab, showToast } = useBrowser();

  // Bắt danh sách Chrome đang chạy thực tế từ Electron IPC
  const [electronRunningList, setElectronRunningList] = useState([]);

  useEffect(() => {
    if (window.electronAPI?.getRunningProfilesList) {
      window.electronAPI.getRunningProfilesList().then((list) => {
        if (Array.isArray(list)) setElectronRunningList(list);
      });
    }

    if (window.electronAPI?.onRunningProfilesUpdated) {
      const cleanup = window.electronAPI.onRunningProfilesUpdated((list) => {
        if (Array.isArray(list)) setElectronRunningList(list);
      });
      return cleanup;
    }
  }, []);

  // Tổng hợp danh sách Chrome đang chạy
  const runningProfiles = useMemo(() => {
    if (electronRunningList.length > 0) {
      const map = new Map(profiles.map((p) => [String(p.id), p]));
      return electronRunningList.map((item) => {
        const p = map.get(String(item.id)) || {};
        return {
          ...p,
          id: item.id,
          name: item.name || p.name || `Profile #${item.id}`,
          pid: item.pid,
          os: p.os || 'windows',
          group: p.group || 'Chung',
          proxy: p.proxy || {}
        };
      });
    }

    // Fallback nếu đang chạy trong context
    const runningFromContext = profiles.filter((p) => p.status === 'running');
    if (runningFromContext.length > 0) {
      return runningFromContext;
    }

    return [];
  }, [electronRunningList, profiles]);

  // Profile chính (Master)
  const [masterId, setMasterId] = useState(null);

  useEffect(() => {
    if (runningProfiles.length > 0) {
      const exists = runningProfiles.some((p) => String(p.id) === String(masterId));
      if (!exists || !masterId) {
        setMasterId(runningProfiles[0].id);
      }
    } else {
      setMasterId(null);
    }
  }, [runningProfiles, masterId]);

  const masterProfile = useMemo(() => {
    return runningProfiles.find((p) => String(p.id) === String(masterId)) || runningProfiles[0] || null;
  }, [runningProfiles, masterId]);

  // Menu 3 chấm (Kebab dropdown)
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden'
      }}
    >
      {/* ── TOP STATS BAR ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Layers size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              Danh Sách Chrome Đang Chạy
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: runningProfiles.length > 0 ? '#DCFCE7' : '#F1F5F9',
                color: runningProfiles.length > 0 ? '#15803D' : '#64748B',
                fontSize: '11.5px',
                fontWeight: 700
              }}
            >
              {runningProfiles.length} đang mở
            </span>
          </div>
        </div>

        {/* Master Badge Info */}
        {masterProfile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              fontSize: '12px',
              color: '#6D28D9',
              fontWeight: 600
            }}
          >
            <Crown size={14} fill="#7C3AED" color="#7C3AED" />
            <span>Profile chính (Master):</span>
            <strong style={{ color: '#0F172A' }}>{masterProfile.name}</strong>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT: RUNNING PROFILES TABLE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {runningProfiles.length === 0 ? (
          /* Empty State khi chưa có profile nào chạy */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1',
              textAlign: 'center',
              marginTop: '20px'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.12)'
              }}
            >
              <Monitor size={26} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: '#0F172A' }}>
              Hiện tại không có profile nào đang chạy
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '420px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Hãy khởi chạy các trình duyệt Chrome từ trang Quản lý Hồ Sơ. Các profile đang chạy sẽ tự động hiển thị tại đây để bạn chỉ định Profile chính (Master).
            </p>
            <button
              onClick={() => setActiveTab('profiles')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '36px',
                padding: '0 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--apidog-purple)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
              }}
            >
              <Globe size={14} />
              <span>Đi tới Quản lý Hồ Sơ</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Table danh sách các profile đang chạy */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              overflow: 'visible'
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#F8FAFC',
                    color: '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    borderBottom: '1px solid #E2E8F0'
                  }}
                >
                  <th style={{ padding: '10px 16px', width: '40px' }}>#</th>
                  <th style={{ padding: '10px 16px' }}>Tên Profile</th>
                  <th style={{ padding: '10px 16px', width: '170px' }}>Vai trò</th>
                  <th style={{ padding: '10px 16px', width: '140px' }}>Nhóm</th>
                  <th style={{ padding: '10px 16px' }}>Proxy</th>
                  <th style={{ padding: '10px 16px', width: '80px', textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {runningProfiles.map((p, idx) => {
                  const isMaster = String(p.id) === String(masterId);
                  const isMenuOpen = openMenuId === p.id;

                  return (
                    <tr
                      key={p.id || idx}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: isMaster ? '#FAF5FF' : '#FFFFFF',
                        transition: 'background-color 0.12s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isMaster) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isMaster) e.currentTarget.style.backgroundColor = '#FFFFFF';
                      }}
                    >
                      {/* STT */}
                      <td style={{ padding: '12px 16px', color: '#94A3B8', fontSize: '11.5px' }}>
                        {idx + 1}
                      </td>

                      {/* Tên Profile */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>
                            {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: '#10B981',
                                flexShrink: 0
                              }}
                              title="Đang chạy"
                            />
                            <span style={{ fontWeight: 600, color: isMaster ? '#6D28D9' : '#0F172A' }}>
                              {p.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Vai trò (Master / Follower) */}
                      <td style={{ padding: '12px 16px' }}>
                        {isMaster ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              backgroundColor: '#7C3AED',
                              color: '#FFFFFF',
                              fontSize: '11px',
                              fontWeight: 700,
                              boxShadow: '0 1px 3px rgba(124, 58, 237, 0.25)'
                            }}
                          >
                            <Crown size={12} fill="#FFFFFF" />
                            <span>PROFILE CHÍNH (MASTER)</span>
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '3px 9px',
                              borderRadius: '20px',
                              backgroundColor: '#F1F5F9',
                              color: '#64748B',
                              fontSize: '11px',
                              fontWeight: 500
                            }}
                          >
                            Profile phụ
                          </span>
                        )}
                      </td>

                      {/* Nhóm */}
                      <td style={{ padding: '12px 16px', color: '#64748B' }}>
                        {p.group || 'Chung'}
                      </td>

                      {/* Proxy */}
                      <td style={{ padding: '12px 16px', color: '#64748B', fontFamily: p.proxy?.host ? 'monospace' : 'inherit' }}>
                        {p.proxy?.host ? (
                          <span>
                            {p.proxy.type || 'SOCKS5'} {p.proxy.host}:{p.proxy.port || ''}
                          </span>
                        ) : (
                          <span style={{ color: '#94A3B8' }}>Không dùng proxy</span>
                        )}
                      </td>

                      {/* Thao tác (3 chấm dropdown) */}
                      <td style={{ padding: '12px 16px', textAlign: 'center', position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : p.id);
                            }}
                            title="Tùy chọn"
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              border: isMenuOpen ? '1px solid #CBD5E1' : '1px solid transparent',
                              backgroundColor: isMenuOpen ? '#F1F5F9' : 'transparent',
                              color: '#475569',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.12s'
                            }}
                            onMouseEnter={(e) => {
                              if (!isMenuOpen) e.currentTarget.style.backgroundColor = '#F1F5F9';
                            }}
                            onMouseLeave={(e) => {
                              if (!isMenuOpen) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {/* Menu Dropdown Popup */}
                          {isMenuOpen && (
                            <div
                              ref={menuRef}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: 'calc(100% + 4px)',
                                minWidth: '180px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
                                padding: '4px',
                                zIndex: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                animation: 'fadeIn 0.12s ease-out'
                              }}
                            >
                              {/* Set làm Master */}
                              {!isMaster ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMasterId(p.id);
                                    setOpenMenuId(null);
                                    showToast?.(`Đã đặt "${p.name}" làm Profile chính (Master)!`, 'success');
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 10px',
                                    borderRadius: '5px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#6D28D9',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    width: '100%'
                                  }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F3FF')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  <Crown size={14} color="#7C3AED" />
                                  <span>Đặt làm Profile chính (Master)</span>
                                </button>
                              ) : (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 10px',
                                    fontSize: '12px',
                                    color: '#7C3AED',
                                    fontWeight: 600
                                  }}
                                >
                                  <Check size={14} />
                                  <span>Đang là Profile chính</span>
                                </div>
                              )}

                              <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '2px 0' }} />

                              {/* Dừng Profile */}
                              <button
                                type="button"
                                onClick={() => {
                                  toggleLaunchProfile?.(p.id);
                                  setOpenMenuId(null);
                                  showToast?.(`Đã gửi lệnh dừng "${p.name}"`);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 10px',
                                  borderRadius: '5px',
                                  border: 'none',
                                  backgroundColor: 'transparent',
                                  color: '#DC2626',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <Square size={13} />
                                <span>Dừng profile này</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
