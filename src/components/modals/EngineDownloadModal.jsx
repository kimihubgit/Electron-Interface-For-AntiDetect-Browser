import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  HardDrive,
  ShieldAlert,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { getEnginesApi } from '../../services/api/profileApi';
import { saveStoredBrowserCores, getStoredBrowserCores } from '../../services/browserCoreService';

const FALLBACK_ENGINES = [
  {
    version: '152',
    name: 'Chromium Core v152 (Khuyên dùng)',
    download_url: 'https://r2.kimidev.net/152.0.7958.0.zip',
    size_mb: 233,
    is_recommended: true
  },
  {
    version: '132',
    name: 'Chromium Core v132 (Stable)',
    download_url: 'http://localhost:8000/api/v1/engines/download/132',
    size_mb: 93.8,
    is_recommended: false
  },
  {
    version: '130',
    name: 'Chromium Core v130',
    download_url: 'http://localhost:8000/api/v1/engines/download/130',
    size_mb: 91.2,
    is_recommended: false
  },
  {
    version: '128',
    name: 'Chromium Core v128',
    download_url: 'http://localhost:8000/api/v1/engines/download/128',
    size_mb: 89.4,
    is_recommended: false
  }
];

export default function EngineDownloadModal({
  isOpen,
  onClose,
  version = '128',
  profile = null,
  onSuccessLaunch = null
}) {
  const [engines, setEngines] = useState(FALLBACK_ENGINES);
  const [installedVersions, setInstalledVersions] = useState(new Set());
  const [downloadingMap, setDownloadingMap] = useState({}); // { [version]: { percent, stage, error, receivedMB, totalMB } }
  const [globalError, setGlobalError] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(false);

  const targetVersion = String(version || profile?.browser_version || '128').replace(/[^0-9]/g, '') || '128';

  // Quét danh sách core từ server và core đã cài trên máy
  const refreshEngineStatus = useCallback(async () => {
    setIsLoadingList(true);
    setGlobalError('');

    // 1. Quét core đã cài đặt trong thư mục hệ thống
    if (window.electronAPI?.getInstalledEngines) {
      try {
        const installed = await window.electronAPI.getInstalledEngines();
        if (Array.isArray(installed)) {
          const vSet = new Set(installed.map(i => String(i.major || i.version)));
          setInstalledVersions(vSet);
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra engine cài đặt:', err);
      }
    }

    // 2. Lấy danh sách core có sẵn từ Backend Server API
    try {
      const res = await getEnginesApi();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setEngines(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshEngineStatus();
    }
  }, [isOpen, refreshEngineStatus]);

  // Lắng nghe tiến trình tải từ Electron IPC theo thời gian thực
  useEffect(() => {
    if (!isOpen) return;

    if (window.electronAPI?.onEngineDownloadProgress) {
      const unsub = window.electronAPI.onEngineDownloadProgress((data) => {
        const vKey = String(data.version);
        setDownloadingMap(prev => ({
          ...prev,
          [vKey]: {
            percent: data.percent || 0,
            stage: data.stage || 'downloading',
            error: data.error || '',
            receivedMB: data.receivedBytes ? (data.receivedBytes / (1024 * 1024)).toFixed(1) : '0',
            totalMB: data.totalBytes ? (data.totalBytes / (1024 * 1024)).toFixed(1) : '90'
          }
        }));

        if (data.stage === 'error') {
          setGlobalError(data.error || 'Tải nhân thất bại');
        }

        if (data.stage === 'completed' || data.percent === 100) {
          setInstalledVersions(prev => new Set([...prev, vKey]));
          
          // Cập nhật LocalStorage
          const currentCores = getStoredBrowserCores();
          const updated = currentCores.map(c => 
            String(c.version) === vKey ? { ...c, isInstalled: true } : c
          );
          saveStoredBrowserCores(updated);

          // Nếu phiên bản vừa tải đúng với phiên bản profile cần -> tự động launch
          if (vKey === targetVersion && onSuccessLaunch) {
            setTimeout(() => {
              onClose();
              onSuccessLaunch(profile);
            }, 1000);
          }
        }
      });
      return unsub;
    }
  }, [isOpen, targetVersion, onSuccessLaunch, profile, onClose]);

  if (!isOpen) return null;

  // Bắt đầu tải một phiên bản cụ thể
  const handleDownloadSpecific = async (engine) => {
    const vKey = String(engine.version);
    setGlobalError('');
    setDownloadingMap(prev => ({
      ...prev,
      [vKey]: { percent: 0, stage: 'downloading', error: '', receivedMB: '0', totalMB: String(engine.size_mb || 90) }
    }));

    if (window.electronAPI?.downloadEngine) {
      try {
        const res = await window.electronAPI.downloadEngine({
          version: vKey,
          downloadUrl: engine.download_url
        });
        if (!res.success) {
          setGlobalError(res.error || `Tải nhân Chrome v${vKey} thất bại.`);
          setDownloadingMap(prev => ({
            ...prev,
            [vKey]: { ...prev[vKey], stage: 'error', error: res.error }
          }));
        }
      } catch (err) {
        const errMsg = err.message || 'Lỗi kết nối máy chủ';
        setGlobalError(errMsg);
        setDownloadingMap(prev => ({
          ...prev,
          [vKey]: { ...prev[vKey], stage: 'error', error: errMsg }
        }));
      }
    } else {
      // Khi test trên trình duyệt web thuần không có Electron
      try {
        const testRes = await fetch(engine.download_url || `http://127.0.0.1:8000/api/v1/engines/download/${vKey}`, { method: 'HEAD' });
        if (!testRes.ok) {
          const errMsg = `Máy chủ báo mã lỗi HTTP ${testRes.status} (${testRes.statusText}). URL không tồn tại!`;
          setGlobalError(errMsg);
          setDownloadingMap(prev => ({
            ...prev,
            [vKey]: { ...prev[vKey], stage: 'error', error: errMsg }
          }));
          return;
        }
        setGlobalError('Cần chạy trên ứng dụng Desktop Electron để tự động giải nén nhân vào hệ thống máy tính.');
      } catch (netErr) {
        const errMsg = `Không thể kết nối Backend (Port 8000): ${netErr.message}`;
        setGlobalError(errMsg);
        setDownloadingMap(prev => ({
          ...prev,
          [vKey]: { ...prev[vKey], stage: 'error', error: errMsg }
        }));
      }
    }
  };

  const isAnyDownloading = Object.values(downloadingMap).some(d => d.stage === 'downloading' || d.stage === 'extracting');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      animation: 'fadeIn 0.15s ease'
    }}>
      <div style={{
        width: '560px',
        maxWidth: '92vw',
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header Thông Báo */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FFFBEB',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#92400E' }}>
                Chưa có nhân trình duyệt!
              </div>
              <div style={{ fontSize: '12.5px', color: '#B45309', marginTop: '2px', lineHeight: 1.4 }}>
                Hệ thống không sử dụng trình duyệt cài sẵn của máy tính để chống lộ danh tính. Bạn cần tải nhân Chromium độc lập về máy để bắt đầu sử dụng.
              </div>
            </div>
          </div>
          {!isAnyDownloading && (
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Thân Modal: Danh sách các phiên bản Core Engine */}
        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
              Danh sách phiên bản có sẵn trên máy chủ ({engines.length})
            </span>
            <button
              onClick={refreshEngineStatus}
              disabled={isLoadingList}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#2563EB',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={isLoadingList ? 'animate-spin' : ''} />
              Làm mới
            </button>
          </div>

          {/* Error Banner */}
          {globalError && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FCA5A5',
              fontSize: '12.5px',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Lỗi tải nhân:</strong> {globalError}
              </div>
            </div>
          )}

          {/* Cards danh sách các phiên bản */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {engines.map((eng) => {
              const vKey = String(eng.version);
              const isInstalled = installedVersions.has(vKey);
              const isTarget = vKey === targetVersion;
              const downloadState = downloadingMap[vKey] || { percent: 0, stage: 'idle' };
              const isDownloading = downloadState.stage === 'downloading' || downloadState.stage === 'extracting';

              return (
                <div
                  key={vKey}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '10px',
                    border: isTarget ? '2px solid #3B82F6' : '1px solid #E2E8F0',
                    backgroundColor: isTarget ? '#F8FAFC' : '#FFFFFF',
                    boxShadow: isTarget ? '0 4px 12px -2px rgba(59, 130, 246, 0.12)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: isInstalled ? '#ECFDF5' : '#EFF6FF',
                        color: isInstalled ? '#10B981' : '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <HardDrive size={16} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                            Chromium Core v{vKey}
                          </span>
                          {eng.is_recommended && (
                            <span style={{
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: '#ECFDF5',
                              color: '#059669',
                              border: '1px solid #A7F3D0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px'
                            }}>
                              <Sparkles size={11} /> Khuyên dùng
                            </span>
                          )}
                          {isTarget && (
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10.5px',
                              fontWeight: 600,
                              backgroundColor: '#EFF6FF',
                              color: '#2563EB',
                              border: '1px solid #BFDBFE'
                            }}>
                              Phiên bản hồ sơ chọn
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                          Dung lượng: ~{eng.size_mb || 90} MB • {eng.full_version || `Chromium ${vKey}.0`}
                        </div>
                      </div>
                    </div>

                    {/* Nút thao tác bên phải */}
                    <div>
                      {isInstalled ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: '#059669',
                          fontSize: '12.5px',
                          fontWeight: 600,
                          backgroundColor: '#F0FDF4',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #BBF7D0'
                        }}>
                          <CheckCircle2 size={15} />
                          <span>Đã tải</span>
                        </div>
                      ) : isDownloading ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#2563EB',
                          fontSize: '12.5px',
                          fontWeight: 600
                        }}>
                          <Loader2 size={15} className="animate-spin" />
                          <span>{downloadState.stage === 'extracting' ? 'Đang giải nén...' : `${downloadState.percent}%`}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDownloadSpecific(eng)}
                          disabled={isAnyDownloading}
                          style={{
                            height: '32px',
                            padding: '0 14px',
                            backgroundColor: isTarget ? '#2563EB' : '#FFFFFF',
                            color: isTarget ? '#FFFFFF' : '#334155',
                            border: isTarget ? 'none' : '1px solid #CBD5E1',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            cursor: isAnyDownloading ? 'not-allowed' : 'pointer',
                            opacity: isAnyDownloading ? 0.6 : 1
                          }}
                        >
                          <Download size={13} />
                          <span>Tải về</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Thanh tiến trình đang tải cho từng card */}
                  {isDownloading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                      <div style={{
                        height: '6px',
                        width: '100%',
                        backgroundColor: '#E2E8F0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${downloadState.percent}%`,
                          backgroundColor: '#2563EB',
                          transition: 'width 0.2s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                        <span>
                          {downloadState.stage === 'extracting' 
                            ? 'Đang giải nén gói nhân vào hệ thống...' 
                            : `Đã nhận: ${downloadState.receivedMB} MB / ~${downloadState.totalMB} MB`}
                        </span>
                        <span>{downloadState.percent}%</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 22px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
            * Sau khi tải xong, profile sẽ tự động mở mà không cần bấm lại nút Launch.
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isAnyDownloading}
            style={{
              height: '34px',
              padding: '0 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              fontSize: '12.5px',
              fontWeight: 500,
              color: '#475569',
              cursor: isAnyDownloading ? 'not-allowed' : 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
