import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import {
  Crown,
  MoreVertical,
  Square,
  Play,
  Globe,
  Monitor,
  ArrowRight,
  Check,
  Radio
} from 'lucide-react';
import ChromeSyncIcon from '../../components/icons/ChromeSyncIcon';
import { getCountryFlag } from '../profiles/utils/profileUtils';
import localDaemonApi from '../../services/localDaemonApi';

export default function SynchronizerPage() {
  const { profiles = [], toggleLaunchProfile, setActiveTab, showToast } = useBrowser();

  // Bắt danh sách Chrome đang chạy thực tế từ Electron IPC
  const [electronRunningList, setElectronRunningList] = useState([]);

  // Trạng thái đồng bộ hóa
  const [isSyncing, setIsSyncing] = useState(false);

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

  // Tự động dừng đồng bộ khi không còn profile nào chạy
  useEffect(() => {
    if (runningProfiles.length === 0 && isSyncing) {
      setIsSyncing(false);
    }
  }, [runningProfiles.length, isSyncing]);

  const masterProfile = useMemo(() => {
    return runningProfiles.find((p) => String(p.id) === String(masterId)) || runningProfiles[0] || null;
  }, [runningProfiles, masterId]);

  // Bật / Tắt đồng bộ hóa
  const handleToggleSync = () => {
    if (runningProfiles.length === 0) {
      showToast?.('Không có profile nào đang chạy để đồng bộ!', 'warning');
      return;
    }

    if (!isSyncing) {
      if (runningProfiles.length === 1) {
        showToast?.('Cần ít nhất 2 profile (1 Master, 1 Profile phụ) để thực hiện đồng bộ!', 'warning');
        return;
      }
      setIsSyncing(true);
      showToast?.(`Đã bắt đầu đồng bộ thao tác từ Master "${masterProfile?.name}"!`, 'success');
      
      const followerIds = runningProfiles.filter((p) => String(p.id) !== String(masterProfile?.id)).map((p) => p.id);

      // Kích hoạt qua Local Daemon (127.0.0.1:50325)
      localDaemonApi.startSync(masterProfile?.id, followerIds);

      if (window.electronAPI?.startSync) {
        window.electronAPI.startSync({
          masterId: masterProfile?.id,
          followerIds
        });
      }
    } else {
      setIsSyncing(false);
      showToast?.('Đã dừng đồng bộ thao tác.');
      localDaemonApi.stopSync();
      if (window.electronAPI?.stopSync) {
        window.electronAPI.stopSync();
      }
    }
  };

  // Menu 3 chấm (Dropdown)
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

  // CSS Grid Template đồng bộ chuẩn ProfileTable
  // Cột: # (44px) | Profile (minmax(240px, 2fr)) | Vai trò (160px) | Nhóm (130px) | Proxy (minmax(200px, 1.5fr)) | Dừng (60px) | Thao tác (60px)
  const gridTemplate = '44px minmax(240px, 2fr) 160px 130px minmax(200px, 1.5fr) 60px 60px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--apidog-bg, #F8FAFC)',
        overflow: 'hidden'
      }}
    >
      {/* ── TOP TOOLBAR / SUBHEADER ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          backgroundColor: 'var(--apidog-card-bg, #FFFFFF)',
          borderBottom: '1px solid var(--apidog-border, #E2E8F0)',
          flexShrink: 0,
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {/* Tiêu đề & Đếm số Chrome đang mở */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChromeSyncIcon size={16} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--apidog-text-main, #0F172A)' }}>
              Danh Sách Chrome Đang Chạy
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: runningProfiles.length > 0 ? '#DCFCE7' : 'var(--apidog-bg, #F1F5F9)',
                color: runningProfiles.length > 0 ? '#15803D' : 'var(--apidog-text-muted, #64748B)',
                fontSize: '11px',
                fontWeight: 600
              }}
            >
              {runningProfiles.length} đang mở
            </span>
          </div>
        </div>

        {/* Khối bên phải: Master Info Badge + Nút Bắt đầu đồng bộ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Master Profile Info Pill */}
          {masterProfile && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '20px',
                backgroundColor: isSyncing ? '#FAF5FF' : '#F5F3FF',
                border: `1px solid ${isSyncing ? 'var(--apidog-purple, #7C3AED)' : '#DDD6FE'}`,
                fontSize: '12px',
                color: 'var(--apidog-purple, #7C3AED)',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              <Crown size={14} fill="#7C3AED" color="#7C3AED" />
              <span>Profile chính:</span>
              <strong style={{ color: 'var(--apidog-text-main, #0F172A)' }}>{masterProfile.name}</strong>
              {isSyncing && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginLeft: '4px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 700
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'inline-block'
                    }}
                  />
                  Đang phát
                </span>
              )}
            </div>
          )}

          {/* Nút Bắt đầu / Dừng đồng bộ */}
          <button
            type="button"
            onClick={handleToggleSync}
            disabled={runningProfiles.length === 0}
            title={
              runningProfiles.length === 0
                ? 'Cần có ít nhất 1 profile đang chạy'
                : isSyncing
                ? 'Nhấn để dừng đồng bộ thao tác'
                : 'Nhấn để bắt đầu đồng bộ thao tác từ Profile chính sang các profile phụ'
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              height: '34px',
              padding: '0 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isSyncing
                ? '#DC2626'
                : runningProfiles.length === 0
                ? '#94A3B8'
                : 'var(--apidog-purple, #7C3AED)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: runningProfiles.length === 0 ? 'not-allowed' : 'pointer',
              boxShadow: isSyncing
                ? '0 2px 8px rgba(220, 38, 38, 0.3)'
                : '0 2px 8px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease',
              opacity: runningProfiles.length === 0 ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (runningProfiles.length > 0) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              if (runningProfiles.length > 0) e.currentTarget.style.opacity = '1';
            }}
          >
            {isSyncing ? (
              <>
                <Square size={12} style={{ fill: '#FFFFFF' }} />
                <span>Dừng đồng bộ</span>
              </>
            ) : (
              <>
                <Play size={12} style={{ fill: '#FFFFFF' }} />
                <span>Bắt đầu đồng bộ</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── BẢNG DANH SÁCH PROFILES ĐANG CHẠY CHUẨN PROFILETABLE ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
        {runningProfiles.length === 0 ? (
          /* Empty State khi chưa có profile nào chạy */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '70px 20px',
              backgroundColor: 'var(--apidog-card-bg, #FFFFFF)',
              borderRadius: '8px',
              border: '1px dashed var(--apidog-border, #CBD5E1)',
              textAlign: 'center',
              marginTop: '10px'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: '#EDE9FE',
                color: 'var(--apidog-purple, #7C3AED)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.12)'
              }}
            >
              <Monitor size={24} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px 0', color: 'var(--apidog-text-main, #0F172A)' }}>
              Không có profile nào đang chạy
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--apidog-text-muted, #64748B)', maxWidth: '420px', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Hãy khởi chạy các trình duyệt Chrome từ trang Quản lý Hồ Sơ. Các profile đang chạy sẽ tự động xuất hiện tại đây để bạn chọn Profile chính (Master).
            </p>
            <button
              onClick={() => setActiveTab('profiles')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '34px',
                padding: '0 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--apidog-purple, #7C3AED)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <Globe size={14} />
              <span>Đi tới Quản lý Hồ Sơ</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          /* Table Container đồng bộ chuẩn giao diện ProfileTable */
          <div
            style={{
              backgroundColor: 'var(--apidog-card-bg, #FFFFFF)',
              borderRadius: '8px',
              border: '1px solid var(--apidog-border, #E2E8F0)',
              overflow: 'visible',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
            }}
          >
            {/* Header Bảng */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: gridTemplate,
                alignItems: 'center',
                height: '42px',
                padding: '0 16px',
                backgroundColor: 'var(--apidog-bg, #F8FAFC)',
                borderBottom: '1px solid var(--apidog-border, #E2E8F0)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--apidog-text-muted, #64748B)',
                boxSizing: 'border-box'
              }}
            >
              <div>#</div>
              <div>Tên Profile</div>
              <div>Vai trò</div>
              <div>Nhóm</div>
              <div>Proxy</div>
              <div style={{ textAlign: 'center' }}>Dừng</div>
              <div style={{ textAlign: 'center' }}>Thao tác</div>
            </div>

            {/* Thân Bảng (Danh sách các hàng) */}
            <div>
              {runningProfiles.map((p, idx) => {
                const isMaster = String(p.id) === String(masterId);
                const isMenuOpen = openMenuId === p.id;

                return (
                  <div
                    key={p.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: gridTemplate,
                      alignItems: 'center',
                      padding: '9px 16px',
                      borderBottom: idx === runningProfiles.length - 1 ? 'none' : '1px solid var(--apidog-border, #E2E8F0)',
                      fontSize: '12.5px',
                      backgroundColor: isMaster
                        ? '#FAF5FF'
                        : (idx % 2 === 1 ? 'var(--apidog-bg, #F8FAFC)' : 'var(--apidog-card-bg, #FFFFFF)'),
                      boxShadow: isMaster ? 'inset 0 0 0 1.5px var(--apidog-purple, #7C3AED)' : 'none',
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isMaster) e.currentTarget.style.backgroundColor = 'var(--apidog-border-light, #F1F5F9)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isMaster) {
                        e.currentTarget.style.backgroundColor = idx % 2 === 1
                          ? 'var(--apidog-bg, #F8FAFC)'
                          : 'var(--apidog-card-bg, #FFFFFF)';
                      }
                    }}
                  >
                    {/* Col 0: STT */}
                    <div style={{ color: '#94A3B8', fontSize: '11.5px', fontWeight: 500 }}>
                      {idx + 1}
                    </div>

                    {/* Col 1: Icon OS, Tên & ID (chuẩn ProfileTableRow) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', paddingRight: '12px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '7px',
                          backgroundColor: '#DCFCE7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '15px'
                        }}
                      >
                        {p.os === 'macos' ? '🍎' : p.os === 'linux' ? '🐧' : '🪟'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: isMaster ? 'var(--apidog-purple, #7C3AED)' : 'var(--apidog-text-main, #0F172A)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '13px'
                          }}
                          title={p.name}
                        >
                          {p.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                            {p.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Vai trò (Master vs Follower) */}
                    <div>
                      {isMaster ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            backgroundColor: isSyncing ? '#DC2626' : 'var(--apidog-purple, #7C3AED)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            boxShadow: isSyncing
                              ? '0 1px 4px rgba(220, 38, 38, 0.35)'
                              : '0 1px 3px rgba(124, 58, 237, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Crown size={12} fill="#FFFFFF" />
                          <span>{isSyncing ? 'MASTER (ĐANG PHÁT)' : 'MASTER (CHÍNH)'}</span>
                        </span>
                      ) : isSyncing ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            backgroundColor: '#DCFCE7',
                            border: '1px solid #BBF7D0',
                            color: '#15803D',
                            fontSize: '11px',
                            fontWeight: 600
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: '#16A34A',
                              display: 'inline-block'
                            }}
                          />
                          <span>Đang nhận tín hiệu</span>
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--apidog-bg, #F1F5F9)',
                            border: '1px solid var(--apidog-border, #E2E8F0)',
                            color: 'var(--apidog-text-muted, #64748B)',
                            fontSize: '11px',
                            fontWeight: 500
                          }}
                        >
                          Profile phụ
                        </span>
                      )}
                    </div>

                    {/* Col 3: Nhóm (Thư mục) */}
                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--apidog-bg, #F8FAFC)',
                          border: '1px solid var(--apidog-border, #E2E8F0)',
                          color: 'var(--apidog-text-main, #334155)',
                          fontSize: '11.5px',
                          fontWeight: 500
                        }}
                      >
                        {p.group || 'Chung'}
                      </span>
                    </div>

                    {/* Col 4: Proxy (chuẩn ProfileTable với cờ quốc gia, latency, tag xanh) */}
                    <div>
                      {p.proxy?.host ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{getCountryFlag(p.proxy.country)}</span>
                            <span
                              style={{
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: 'var(--apidog-text-main, #0F172A)',
                                fontWeight: 500
                              }}
                            >
                              {p.proxy.host}:{p.proxy.port}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px' }}>
                            <span
                              style={{
                                backgroundColor: '#EFF6FF',
                                color: '#2563EB',
                                padding: '0 4px',
                                borderRadius: '3px',
                                fontWeight: 600
                              }}
                            >
                              {p.proxy.type || 'SOCKS5'}
                            </span>
                            <span style={{ color: '#16A34A', fontWeight: 500 }}>
                              ● {p.proxy.latency || 28}ms
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--apidog-text-dim, #94A3B8)', fontSize: '11.5px', fontStyle: 'italic' }}>
                          Direct
                        </span>
                      )}
                    </div>

                    {/* Col 5: Nút Dừng hồ sơ vuông đỏ (chuẩn ProfileTableRow) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        onClick={() => {
                          toggleLaunchProfile?.(p.id);
                          showToast?.(`Đã gửi lệnh dừng "${p.name}"`);
                        }}
                        title="Dừng hồ sơ"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid #FECACA',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
                          e.currentTarget.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEF2F2';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <Square size={11} style={{ fill: '#DC2626' }} />
                      </button>
                    </div>

                    {/* Col 6: Menu 3 chấm dọc MoreVertical (chuẩn ProfileTableRow) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : p.id);
                        }}
                        title="Tùy chọn thao tác khác"
                        style={{
                          background: isMenuOpen ? '#EDE9FE' : 'none',
                          border: 'none',
                          padding: '6px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          color: isMenuOpen ? 'var(--apidog-purple, #7C3AED)' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isMenuOpen) {
                            e.currentTarget.style.backgroundColor = 'var(--apidog-border-light, #F1F5F9)';
                            e.currentTarget.style.color = 'var(--apidog-text-main, #0F172A)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMenuOpen) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }
                        }}
                      >
                        <MoreVertical size={15} />
                      </button>

                      {/* Dropdown Menu dạng Popover nổi (chuẩn ProfileActionMenu) */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 4px)',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
                            padding: '6px 4px',
                            minWidth: '200px',
                            zIndex: 999,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            animation: 'fadeInModal 0.15s ease',
                            textAlign: 'left'
                          }}
                        >
                          {/* Đặt làm Master */}
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
                                padding: '7px 10px',
                                borderRadius: '5px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: 'var(--apidog-purple, #7C3AED)',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                transition: 'background-color 0.12s'
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
                                padding: '7px 10px',
                                fontSize: '12px',
                                color: 'var(--apidog-purple, #7C3AED)',
                                fontWeight: 600
                              }}
                            >
                              <Check size={14} />
                              <span>Đang là Profile chính (Master)</span>
                            </div>
                          )}

                          <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '3px 0' }} />

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
                              padding: '7px 10px',
                              borderRadius: '5px',
                              border: 'none',
                              backgroundColor: 'transparent',
                              color: '#DC2626',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                              textAlign: 'left',
                              width: '100%',
                              transition: 'background-color 0.12s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Square size={12} style={{ fill: '#DC2626' }} />
                            <span>Dừng profile này</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
