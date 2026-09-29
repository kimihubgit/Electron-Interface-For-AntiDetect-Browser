import React, { useState, useEffect } from 'react';
import {
  CloudUpload,
  X,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  HardDrive,
  RotateCw,
  Layers,
  Shield,
  ArrowRight,
  Database,
  AlertCircle
} from 'lucide-react';
import { BACKUP_PROVIDERS } from '../backupConstants';

export default function BackupModal({
  isOpen,
  initialProviderId,
  configs = {},
  profiles = [],
  proxies = [],
  onExecuteBackup,
  backupStatus = 'idle',
  backupProgress = 0,
  currentRunningProvider,
  onClose,
  onViewHistory
}) {
  const configuredProviders = BACKUP_PROVIDERS.filter((p) => configs[p.id]?.isConfigured);
  const defaultProviderId = initialProviderId || configuredProviders[0]?.id || BACKUP_PROVIDERS[0]?.id;

  const [selectedProviderId, setSelectedProviderId] = useState(defaultProviderId);
  const [includeProfiles, setIncludeProfiles] = useState(true);
  const [includeCookies, setIncludeCookies] = useState(true);
  const [includeExtensions, setIncludeExtensions] = useState(true);
  const [includeProxies, setIncludeProxies] = useState(true);
  const [encryptWithPassword, setEncryptWithPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialProviderId) {
      setSelectedProviderId(initialProviderId);
    }
  }, [initialProviderId]);

  if (!isOpen) return null;

  const isRunning = backupStatus === 'running';
  const isSuccess = backupStatus === 'success';

  const selectedProvider = BACKUP_PROVIDERS.find((p) => p.id === selectedProviderId);
  const isProviderConfigured = !!configs[selectedProviderId]?.isConfigured;
  const estimatedMb = (profiles.length * 0.55 + 1.2).toFixed(1);

  const handleStart = () => {
    onExecuteBackup(
      selectedProviderId,
      {
        includeProfiles,
        includeCookies,
        includeExtensions,
        includeProxies,
        encryptWithPassword,
        password
      },
      profiles
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isRunning) onClose();
      }}
    >
      <div
        style={{
          width: '560px',
          maxWidth: '95vw',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
          border: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeInModal 0.2s ease'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 22px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)'
            }}>
              <CloudUpload size={20} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
                Tiến hành sao lưu dữ liệu
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Đóng gói hồ sơ, cookies và cấu hình lưu trữ an toàn lên đám mây
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isRunning}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isRunning) {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#334155';
              }
            }}
            onMouseLeave={(e) => {
              if (!isRunning) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{
          padding: '20px 22px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          {isSuccess ? (
            /* Success State */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px 10px',
              gap: '14px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
              }}>
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>
                  Sao lưu hoàn tất thành công!
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B', maxWidth: '420px', lineHeight: '1.5' }}>
                  Dữ liệu đã được nén và tải lên an toàn tới kho lưu trữ <strong>{currentRunningProvider || selectedProvider?.name}</strong>.
                </p>
              </div>

              <div style={{
                width: '100%',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '12px',
                color: '#475569',
                marginTop: '6px'
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Hồ sơ</div>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>{profiles.length || 24}</strong>
                </div>
                <div style={{ width: '1px', backgroundColor: '#E2E8F0' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Proxy</div>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>{proxies.length || 12}</strong>
                </div>
                <div style={{ width: '1px', backgroundColor: '#E2E8F0' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Mã hóa</div>
                  <strong style={{ color: encryptWithPassword ? '#10B981' : '#64748B', fontSize: '13px' }}>
                    {encryptWithPassword ? 'AES-256' : 'Không'}
                  </strong>
                </div>
                <div style={{ width: '1px', backgroundColor: '#E2E8F0' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Trạng thái</div>
                  <strong style={{ color: '#10B981', fontSize: '13px' }}>Đã đồng bộ</strong>
                </div>
              </div>
            </div>
          ) : (
            /* Configure & Execute State */
            <>
              {/* 1. Target Provider Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={14} style={{ color: '#7C3AED' }} />
                    <span>Nền tảng đám mây đích</span>
                  </label>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: isProviderConfigured ? '#10B981' : '#F59E0B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isProviderConfigured ? '#10B981' : '#F59E0B'
                    }} />
                    {isProviderConfigured ? 'Đã kết nối' : 'Chưa cấu hình tài khoản'}
                  </span>
                </div>

                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  disabled={isRunning}
                  style={{
                    height: '40px',
                    padding: '0 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    fontSize: '13px',
                    color: '#0F172A',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {BACKUP_PROVIDERS.map((p) => {
                    const isCfg = configs[p.id]?.isConfigured;
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} {isCfg ? '✓ (Đã kết nối)' : '— (Chưa cấu hình)'}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 2. Content to back up */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={14} style={{ color: '#7C3AED' }} />
                    <span>Dữ liệu đưa vào gói sao lưu</span>
                  </label>
                  <span style={{
                    fontSize: '11.5px',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#F1F5F9',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    <HardDrive size={12} style={{ color: '#7C3AED' }} />
                    <span>Ước tính: ~{estimatedMb} MB</span>
                  </span>
                </div>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  padding: '12px 14px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeProfiles}
                      onChange={(e) => setIncludeProfiles(e.target.checked)}
                      disabled={isRunning}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>{profiles.length || 24} Hồ sơ & Canvas</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeCookies}
                      onChange={(e) => setIncludeCookies(e.target.checked)}
                      disabled={isRunning}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>Cookies & Session</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeExtensions}
                      onChange={(e) => setIncludeExtensions(e.target.checked)}
                      disabled={isRunning}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>Tiện ích mở rộng</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeProxies}
                      onChange={(e) => setIncludeProxies(e.target.checked)}
                      disabled={isRunning}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>{proxies.length || 12} Proxy kết nối</span>
                  </label>
                </div>
              </div>

              {/* 3. Security & Encryption */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
                  <input
                    type="checkbox"
                    checked={encryptWithPassword}
                    onChange={(e) => setEncryptWithPassword(e.target.checked)}
                    disabled={isRunning}
                    style={{ accentColor: '#7C3AED' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Shield size={14} style={{ color: '#7C3AED' }} />
                    <span>Mã hóa bảo vệ dữ liệu bằng mật khẩu (AES-256)</span>
                  </div>
                </label>

                {encryptWithPassword && (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Nhập mật khẩu bảo vệ file sao lưu..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isRunning}
                      style={{
                        width: '100%',
                        height: '36px',
                        padding: '0 36px 0 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '12.5px',
                        color: '#0F172A',
                        outline: 'none',
                        backgroundColor: '#FFFFFF'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Live Progress bar if running */}
              {isRunning && (
                <div style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#F5F3FF',
                  border: '1px solid #DDD6FE',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 600, color: '#6D28D9' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <RotateCw size={13} className="spin" />
                      <span>Đang sao lưu lên {currentRunningProvider || selectedProvider?.name}...</span>
                    </span>
                    <span>{backupProgress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: '#EDE9FE',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${backupProgress}%`,
                      height: '100%',
                      backgroundColor: '#7C3AED',
                      borderRadius: '9999px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              {backupStatus === 'error' && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#B91C1C',
                  fontSize: '12.5px'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>Sao lưu thất bại. Vui lòng kiểm tra lại kết nối và cấu hình tài khoản host.</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSuccess ? 'space-between' : 'flex-end',
          gap: '10px'
        }}>
          {isSuccess ? (
            <>
              <button
                type="button"
                onClick={onViewHistory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <span>Xem lịch sử sao lưu</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '8px 18px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
              >
                Hoàn tất
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                disabled={isRunning}
                style={{
                  padding: '8px 16px',
                  borderRadius: '7px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isRunning) e.currentTarget.style.backgroundColor = '#F1F5F9';
                }}
                onMouseLeave={(e) => {
                  if (!isRunning) e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={handleStart}
                disabled={isRunning}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: isRunning ? '#94A3B8' : '#7C3AED',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: isRunning ? 'not-allowed' : 'pointer',
                  boxShadow: isRunning ? 'none' : '0 2px 6px rgba(124, 58, 237, 0.25)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isRunning) e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)';
                }}
                onMouseLeave={(e) => {
                  if (!isRunning) e.currentTarget.style.backgroundColor = '#7C3AED';
                }}
              >
                {isRunning ? (
                  <>
                    <RotateCw size={14} className="spin" />
                    <span>Đang sao lưu...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload size={15} />
                    <span>Bắt đầu sao lưu</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
