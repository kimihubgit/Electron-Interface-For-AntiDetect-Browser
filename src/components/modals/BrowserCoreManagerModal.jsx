import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Download,
  Check,
  Star,
  Trash2,
  Folder,
  Search,
  RefreshCw,
  Sliders,
  ExternalLink,
  HardDrive,
  Cpu
} from 'lucide-react';
import {
  getStoredBrowserCores,
  saveStoredBrowserCores
} from '../../services/browserCoreService';

export default function BrowserCoreManagerModal({ isOpen, onClose, onCoreSelected }) {
  const [cores, setCores] = useState(() => getStoredBrowserCores());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'installed' | 'available' | 'chromium' | 'firefox'
  const [downloadingMap, setDownloadingMap] = useState({}); // { [coreId]: progressPercentage }

  // Sync with localStorage
  useEffect(() => {
    setCores(getStoredBrowserCores());
  }, [isOpen]);

  // Total installed size calculation
  const totalInstalledSize = useMemo(() => {
    const installed = cores.filter(c => c.isInstalled);
    const sum = installed.reduce((acc, c) => {
      const mb = parseFloat(c.size) || 0;
      return acc + mb;
    }, 0);
    return sum.toFixed(1);
  }, [cores]);

  // Filtered cores
  const filteredCores = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cores.filter(c => {
      // Search match
      const matchSearch = !q || 
        c.name.toLowerCase().includes(q) || 
        c.version.toLowerCase().includes(q) || 
        c.fullVersion.toLowerCase().includes(q) ||
        c.engine.toLowerCase().includes(q);

      if (!matchSearch) return false;

      // Tab match
      if (filterTab === 'installed') return c.isInstalled;
      if (filterTab === 'available') return !c.isInstalled;
      if (filterTab === 'chromium') return c.engine === 'chromium';
      if (filterTab === 'firefox') return c.engine === 'firefox';
      return true;
    });
  }, [cores, searchQuery, filterTab]);

  // Download simulation
  const handleDownloadCore = (coreId) => {
    if (downloadingMap[coreId] !== undefined) return;

    setDownloadingMap(prev => ({ ...prev, [coreId]: 5 }));

    const interval = setInterval(() => {
      setDownloadingMap(prev => {
        const current = prev[coreId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          
          // Mark core as installed
          const updated = cores.map(c => c.id === coreId ? { ...c, isInstalled: true } : c);
          setCores(updated);
          saveStoredBrowserCores(updated);

          // Clear downloading state
          const nextMap = { ...prev };
          delete nextMap[coreId];
          return nextMap;
        }

        // Random progressive increment
        const next = Math.min(100, current + Math.floor(Math.random() * 18 + 12));
        return { ...prev, [coreId]: next };
      });
    }, 300);
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

  // Uninstall / delete core
  const handleDeleteCore = (coreId, coreName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bản dựng lõi "${coreName}" khỏi ổ đĩa?`)) return;
    const updated = cores.map(c => {
      if (c.id === coreId) {
        return { ...c, isInstalled: false, isDefault: false };
      }
      return c;
    });

    // Ensure at least one installed is default
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
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeInModal 0.18s ease'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleInModal 0.18s ease'
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Trung tâm Quản lý Lõi Trình duyệt</span>
                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                  Core Manager
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                Tải về và quản lý các phiên bản nhân Chromium / Gecko độc lập cho từng hồ sơ
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
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
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── STORAGE STATUS BANNER ── */}
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#475569'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={15} style={{ color: '#64748B' }} />
            <span>
              Tổng dung lượng đã cài đặt: <strong style={{ color: '#0F172A' }}>{totalInstalledSize} MB</strong> ({cores.filter(c => c.isInstalled).length} lõi có sẵn)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontFamily: 'Consolas, monospace', color: '#64748B', fontSize: '11px' }}>
              %appdata%/AntidetectBrowser/cores/
            </span>
          </div>
        </div>

        {/* ── FILTER TABS & SEARCH ROW ── */}
        <div
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[
              { id: 'all', label: `Tất cả (${cores.length})` },
              { id: 'installed', label: `Đã cài đặt (${cores.filter(c => c.isInstalled).length})` },
              { id: 'available', label: `Chưa tải (${cores.filter(c => !c.isInstalled).length})` },
              { id: 'chromium', label: 'Chromium' },
              { id: 'firefox', label: 'Firefox Gecko' }
            ].map(tab => {
              const active = filterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: active ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    backgroundColor: active ? '#EFF6FF' : '#FFFFFF',
                    color: active ? '#2563EB' : '#475569',
                    fontSize: '12px',
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm phiên bản..."
              style={{
                width: '100%',
                height: '32px',
                paddingLeft: '32px',
                paddingRight: '10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* ── CORE LIST ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredCores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: '13px' }}>
              Không tìm thấy phiên bản lõi phù hợp với bộ lọc
            </div>
          ) : (
            filteredCores.map(core => {
              const progress = downloadingMap[core.id];
              const isDownloading = progress !== undefined;

              return (
                <div
                  key={core.id}
                  style={{
                    border: core.isDefault ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    backgroundColor: core.isDefault ? '#FAFCFF' : '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {/* Top info line */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Engine Icon */}
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          backgroundColor: core.engine === 'firefox' ? '#FFF7ED' : '#EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}
                      >
                        {core.engine === 'firefox' ? '🦊' : '🌐'}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A' }}>
                            {core.name}
                          </span>

                          {core.badge && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 700,
                                padding: '1px 7px',
                                borderRadius: '4px',
                                color: core.badgeColor || '#2563EB',
                                backgroundColor: `${core.badgeColor}15` || '#EFF6FF',
                                border: `1px solid ${core.badgeColor}30` || '#BFDBFE'
                              }}
                            >
                              {core.badge}
                            </span>
                          )}

                          {core.isDefault && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#D97706',
                                backgroundColor: '#FEF3C7',
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              <Star size={11} fill="#D97706" />
                              <span>Mặc định</span>
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                          <span>Build: <strong>{core.fullVersion}</strong></span>
                          <span>•</span>
                          <span>Dung lượng: <strong>{core.size}</strong></span>
                          <span>•</span>
                          <span>Ngày phát hành: {core.releaseDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {core.isInstalled ? (
                        <>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#ECFDF5',
                              color: '#059669',
                              fontSize: '11.5px',
                              fontWeight: 600
                            }}
                          >
                            <Check size={13} strokeWidth={2.5} />
                            <span>Đã cài đặt</span>
                          </div>

                          {!core.isDefault && (
                            <button
                              onClick={() => handleSetDefault(core.id)}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                backgroundColor: '#FFFFFF',
                                color: '#334155',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                            >
                              Đặt làm mặc định
                            </button>
                          )}

                          {onCoreSelected && (
                            <button
                              onClick={() => {
                                onCoreSelected(core);
                                onClose();
                              }}
                              style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#2563EB',
                                color: '#FFFFFF',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Chọn lõi này
                            </button>
                          )}

                          {!core.isDefault && (
                            <button
                              onClick={() => handleDeleteCore(core.id, core.name)}
                              title="Gỡ bỏ bản dựng này để giải phóng ổ cứng"
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                border: '1px solid #FECACA',
                                backgroundColor: '#FEF2F2',
                                color: '#EF4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleDownloadCore(core.id)}
                          disabled={isDownloading}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: isDownloading ? '#94A3B8' : '#2563EB',
                            color: '#FFFFFF',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            cursor: isDownloading ? 'not-allowed' : 'pointer',
                            boxShadow: isDownloading ? 'none' : '0 2px 6px rgba(37, 99, 235, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isDownloading ? (
                            <>
                              <RefreshCw size={13} className="spin" />
                              <span>Đang tải: {progress}%</span>
                            </>
                          ) : (
                            <>
                              <Download size={13} />
                              <span>Tải về ({core.size})</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar if downloading */}
                  {isDownloading && (
                    <div style={{ width: '100%', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${progress}%`,
                          height: '100%',
                          backgroundColor: '#2563EB',
                          borderRadius: '4px',
                          transition: 'width 0.25s ease'
                        }}
                      />
                    </div>
                  )}

                  {/* Description note */}
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                    {core.description}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#FAFAFA'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            💡 Mẹo: Các phiên bản lõi sau khi tải về sẽ tự động xuất hiện trong danh sách tạo Profile mới.
          </div>

          <button
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
