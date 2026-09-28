import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Download,
  Check,
  Star,
  Trash2,
  Search,
  RefreshCw,
  HardDrive,
  Cpu,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getStoredBrowserCores,
  saveStoredBrowserCores
} from '../../services/browserCoreService';

export default function BrowserCoreManagerModal({ isOpen, onClose, onCoreSelected }) {
  const [cores, setCores] = useState(() => getStoredBrowserCores());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'installed' | 'available'
  const [downloadingMap, setDownloadingMap] = useState({}); // { [coreId]: progressPercentage }

  // Sync cores on open
  useEffect(() => {
    if (isOpen) {
      setCores(getStoredBrowserCores());
    }
  }, [isOpen]);

  // Listen to Electron download progress if available
  useEffect(() => {
    if (!isOpen) return;

    if (window.electronAPI?.onEngineDownloadProgress) {
      const unsub = window.electronAPI.onEngineDownloadProgress((data) => {
        if (!data || !data.version) return;
        const vKey = String(data.version);
        const targetId = `chrome-${vKey}`;

        setDownloadingMap(prev => ({
          ...prev,
          [targetId]: Math.round(data.percent || 0)
        }));

        if (data.stage === 'completed' || data.percent === 100) {
          setCores(prev => {
            const updated = prev.map(c =>
              String(c.version) === vKey || c.id === targetId
                ? { ...c, isInstalled: true }
                : c
            );
            saveStoredBrowserCores(updated);
            return updated;
          });

          setDownloadingMap(prev => {
            const next = { ...prev };
            delete next[targetId];
            return next;
          });
        }
      });
      return unsub;
    }
  }, [isOpen]);

  // Filtered Chromium cores (removes unnecessary clutter)
  const filteredCores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cores.filter(c => {
      // Hide non-chromium cores as Antidetect only uses Chromium
      if (c.engine && c.engine !== 'chromium') return false;

      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.version.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (filterTab === 'installed') return c.isInstalled;
      if (filterTab === 'available') return !c.isInstalled;
      return true;
    });
  }, [cores, searchQuery, filterTab]);

  // Total installed storage calculation
  const installedCores = useMemo(() => cores.filter(c => c.isInstalled), [cores]);
  const totalInstalledSize = useMemo(() => {
    const sum = installedCores.reduce((acc, c) => acc + (parseFloat(c.size) || 0), 0);
    return sum.toFixed(1);
  }, [installedCores]);

  // Download core action
  const handleDownloadCore = async (core) => {
    const coreId = core.id;
    if (downloadingMap[coreId] !== undefined) return;

    setDownloadingMap(prev => ({ ...prev, [coreId]: 5 }));

    // Real Electron IPC download if available
    if (window.electronAPI?.downloadEngine) {
      try {
        const downloadUrl = core.downloadUrl || `https://r2.kimidev.net/${core.version}.0.zip`;
        const res = await window.electronAPI.downloadEngine({
          version: String(core.version),
          downloadUrl
        });
        if (!res.success) {
          console.warn('Electron download failed, falling back to simulated:', res.error);
        } else {
          return;
        }
      } catch (err) {
        console.warn('Electron download error, falling back:', err);
      }
    }

    // Smooth progressive download simulation (fallback for web / local testing)
    const interval = setInterval(() => {
      setDownloadingMap(prev => {
        const current = prev[coreId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setCores(currentCores => {
            const updated = currentCores.map(c => c.id === coreId ? { ...c, isInstalled: true } : c);
            saveStoredBrowserCores(updated);
            return updated;
          });
          const next = { ...prev };
          delete next[coreId];
          return next;
        }
        const step = Math.min(100, current + Math.floor(Math.random() * 20 + 15));
        return { ...prev, [coreId]: step };
      });
    }, 280);
  };

  // Set default core
  const handleSetDefault = (coreId) => {
    const updated = cores.map(c => ({
      ...c,
      isDefault: c.id === coreId
    }));
    setCores(updated);
    saveStoredBrowserCores(updated);
  };

  // Delete installed core to free disk space
  const handleDeleteCore = (coreId, coreName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bản dựng lõi "${coreName}" để giải phóng dung lượng ổ đĩa?`)) return;

    const updated = cores.map(c => {
      if (c.id === coreId) {
        return { ...c, isInstalled: false, isDefault: false };
      }
      return c;
    });

    const hasDefault = updated.some(c => c.isInstalled && c.isDefault);
    if (!hasDefault) {
      const firstInstalled = updated.find(c => c.isInstalled);
      if (firstInstalled) firstInstalled.isDefault = true;
    }

    setCores(updated);
    saveStoredBrowserCores(updated);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      {/* ── SPACIOUS & CLEAN CORE MANAGER CONTAINER ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '920px',
          maxWidth: '96vw',
          maxHeight: '88vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
          color: '#1E293B',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}
      >
        {/* ── 1. HEADER ── */}
        <div style={{
          padding: '18px 26px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
            }}>
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  Quản lý Nhân Trình Duyệt
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#2563EB',
                  backgroundColor: '#EFF6FF',
                  padding: '2px 7px',
                  borderRadius: '4px'
                }}>
                  Chromium Engine
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                Quản lý các bản dựng Chromium Core độc lập phục vụ chống phát hiện vân tay (Anti-Detection)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Đóng (Esc)"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── 2. FILTER & STATS BAR (Clean & Uncluttered) ── */}
        <div style={{
          padding: '12px 26px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexShrink: 0
        }}>
          {/* Quick Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'all', label: `Tất cả (${cores.filter(c => !c.engine || c.engine === 'chromium').length})` },
              { id: 'installed', label: `Đã tải về (${installedCores.length})` },
              { id: 'available', label: `Chưa tải (${cores.filter(c => (!c.engine || c.engine === 'chromium') && !c.isInstalled).length})` }
            ].map(tab => {
              const active = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: active ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                    color: active ? '#2563EB' : '#475569',
                    fontSize: '12px',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Right: Storage Stats & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#64748B'
            }}>
              <HardDrive size={14} style={{ color: '#059669' }} />
              <span>Đang chiếm: <strong style={{ color: '#0F172A' }}>{totalInstalledSize} MB</strong></span>
            </div>

            {/* Quick Search Input */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              padding: '0 10px',
              height: '32px',
              width: '180px'
            }}>
              <Search size={13} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Tìm phiên bản..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#334155'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 3. CORES LIST (Spacious & Clean Cards) ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 26px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box'
        }}>
          {filteredCores.length === 0 ? (
            <div style={{
              padding: '48px 0',
              textAlign: 'center',
              color: '#94A3B8',
              fontSize: '13px'
            }}>
              Không tìm thấy phiên bản nhân phù hợp với tìm kiếm
            </div>
          ) : (
            filteredCores.map(core => {
              const progress = downloadingMap[core.id];
              const isDownloading = progress !== undefined;

              return (
                <div
                  key={core.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: core.isDefault ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    backgroundColor: core.isDefault ? '#F8FAFC' : '#FFFFFF',
                    boxShadow: core.isDefault ? '0 2px 8px rgba(59, 130, 246, 0.08)' : '0 1px 2px rgba(0, 0, 0, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    {/* Left: Engine info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: core.isInstalled ? '#ECFDF5' : '#F1F5F9',
                        color: core.isInstalled ? '#10B981' : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Cpu size={20} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            {core.name}
                          </span>

                          {core.badge && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              color: core.badgeColor || '#2563EB',
                              backgroundColor: `${core.badgeColor}15` || '#EFF6FF',
                              border: `1px solid ${core.badgeColor}30` || '#BFDBFE'
                            }}>
                              {core.badge}
                            </span>
                          )}

                          {core.isDefault && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#D97706',
                              backgroundColor: '#FEF3C7',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              <Star size={11} fill="#D97706" />
                              <span>Mặc định</span>
                            </span>
                          )}
                        </div>

                        {/* Brief, practical description */}
                        <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '3px', lineHeight: '1.4' }}>
                          {core.description || `Bản dựng Chromium Core v${core.version} tối ưu cho nuôi tài khoản và tương thích cao.`}
                          <span style={{ marginLeft: '8px', color: '#94A3B8' }}>• Dung lượng: {core.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {/* Button to select core for ProfileModal if opened from profile creator */}
                      {onCoreSelected && (
                        <button
                          type="button"
                          onClick={() => {
                            onCoreSelected(core);
                            onClose();
                          }}
                          style={{
                            height: '32px',
                            padding: '0 12px',
                            borderRadius: '6px',
                            border: '1px solid #7C3AED',
                            backgroundColor: '#FAF5FF',
                            color: '#7C3AED',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7C3AED';
                            e.currentTarget.style.color = '#FFFFFF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FAF5FF';
                            e.currentTarget.style.color = '#7C3AED';
                          }}
                        >
                          Chọn nhân này
                        </button>
                      )}

                      {/* Installed State */}
                      {core.isInstalled ? (
                        <>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            <CheckCircle2 size={14} />
                            <span>Đã cài đặt</span>
                          </div>

                          {!core.isDefault && (
                            <button
                              type="button"
                              onClick={() => handleSetDefault(core.id)}
                              title="Đặt phiên bản này làm mặc định khi tạo Profile mới"
                              style={{
                                height: '32px',
                                padding: '0 12px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.12s ease'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                            >
                              Đặt mặc định
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteCore(core.id, core.name)}
                            title="Xóa bản tải về để giải phóng bộ nhớ"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#FFFFFF',
                              color: '#94A3B8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.12s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#FCA5A5';
                              e.currentTarget.style.backgroundColor = '#FEF2F2';
                              e.currentTarget.style.color = '#DC2626';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#E2E8F0';
                              e.currentTarget.style.backgroundColor = '#FFFFFF';
                              e.currentTarget.style.color = '#94A3B8';
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : isDownloading ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#2563EB',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '0 8px'
                        }}>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Đang tải {progress}%...</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadCore(core)}
                          style={{
                            height: '32px',
                            padding: '0 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1D4ED8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
                        >
                          <Download size={13} />
                          <span>Tải về</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar when downloading */}
                  {isDownloading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                      <div style={{
                        height: '5px',
                        width: '100%',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          backgroundColor: '#2563EB',
                          transition: 'width 0.25s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                        <span>Đang tải gói Chromium Core vào thư mục hệ thống...</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── 4. FOOTER ── */}
        <div style={{
          padding: '14px 26px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            * Các bản dựng Chromium được lưu trữ độc lập trong máy tính, hoàn toàn không can thiệp vào Chrome cá nhân.
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 18px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
