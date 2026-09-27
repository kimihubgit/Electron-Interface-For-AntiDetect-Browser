import React, { useState } from 'react';
import { 
  CloudUpload, 
  Lock, 
  Check, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  FileArchive,
  Shield,
  Layers,
  Database,
  HardDrive
} from 'lucide-react';
import { BACKUP_PROVIDERS } from '../backupConstants';

export default function BackupExecutionPanel({ 
  configs, 
  profiles = [], 
  proxies = [], 
  onExecuteBackup, 
  backupStatus, 
  backupProgress, 
  currentRunningProvider
}) {
  const configuredProviders = BACKUP_PROVIDERS.filter((p) => configs[p.id]?.isConfigured);
  const defaultProviderId = configuredProviders[0]?.id || 'cloudflare_r2';

  const [selectedProviderId, setSelectedProviderId] = useState(defaultProviderId);
  const [includeProfiles, setIncludeProfiles] = useState(true);
  const [includeCookies, setIncludeCookies] = useState(true);
  const [includeExtensions, setIncludeExtensions] = useState(true);
  const [includeProxies, setIncludeProxies] = useState(true);
  const [encryptWithPassword, setEncryptWithPassword] = useState(false);
  const [password, setPassword] = useState('');

  const isRunning = backupStatus === 'running';

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

  const selectedProvider = BACKUP_PROVIDERS.find((p) => p.id === selectedProviderId);
  const estimatedMb = (profiles.length * 0.55 + 1.2).toFixed(1);

  return (
    <div style={{
      maxWidth: '960px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Introduction Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>
            Khởi tạo bản sao lưu dữ liệu (Cloud Backup)
          </h2>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B' }}>
            Đóng gói và mã hóa hồ sơ trình duyệt, cookies và tiện ích lên dịch vụ đám mây an toàn.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          borderRadius: '8px',
          backgroundColor: '#F1F5F9',
          fontSize: '12px',
          color: '#475569'
        }}>
          <HardDrive size={15} style={{ color: '#7C3AED' }} />
          <span>Dung lượng ước tính: <strong>~{estimatedMb} MB</strong></span>
        </div>
      </div>

      {/* 2-Columns Form Setup */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '20px'
      }}>
        {/* Column 1: Target Provider & Content To Include */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <Layers size={16} style={{ color: '#7C3AED' }} />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              1. Nền tảng lưu trữ & Dữ liệu
            </h3>
          </div>

          {/* 1. Target Provider Select */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
              Nền tảng đám mây đích
            </label>
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              disabled={isRunning}
              style={{
                height: '38px',
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
                    {p.name} {isCfg ? '✓ (Đã kết nối)' : '(Chưa cấu hình)'}
                  </option>
                );
              })}
            </select>
          </div>

          {/* 2. What to back up (Checkboxes) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
              Thành phần đưa vào gói sao lưu
            </label>
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
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
                <span>Cấu hình {profiles.length || 24} Hồ sơ & Canvas Fingerprint</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeCookies} 
                  onChange={(e) => setIncludeCookies(e.target.checked)} 
                  disabled={isRunning}
                  style={{ accentColor: '#7C3AED' }} 
                />
                <span>Cookies & Dữ liệu phiên duyệt web (Session Storage)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeExtensions} 
                  onChange={(e) => setIncludeExtensions(e.target.checked)} 
                  disabled={isRunning}
                  style={{ accentColor: '#7C3AED' }} 
                />
                <span>Tiện ích mở rộng (Extensions & CRX Data)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={includeProxies} 
                  onChange={(e) => setIncludeProxies(e.target.checked)} 
                  disabled={isRunning}
                  style={{ accentColor: '#7C3AED' }} 
                />
                <span>Danh sách {proxies.length || 12} Proxy kết nối</span>
              </label>
            </div>
          </div>
        </div>

        {/* Column 2: Security & Start Execution */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
            <Shield size={16} style={{ color: '#7C3AED' }} />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
              2. Bảo mật & Tiến hành
            </h3>
          </div>

          {/* Encryption Option */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
              <input
                type="checkbox"
                checked={encryptWithPassword}
                onChange={(e) => setEncryptWithPassword(e.target.checked)}
                disabled={isRunning}
                style={{ accentColor: '#7C3AED' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Lock size={13} style={{ color: '#7C3AED' }} />
                <span>Mã hóa bảo vệ dữ liệu bằng mật khẩu (AES-256)</span>
              </div>
            </label>

            {encryptWithPassword && (
              <input
                type="password"
                placeholder="Nhập mật khẩu bảo vệ bản sao lưu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isRunning}
                style={{
                  height: '38px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              />
            )}
            <p style={{ margin: 0, fontSize: '11.5px', color: '#94A3B8' }}>
              Dữ liệu được nén thành file chuẩn .zip và tải trực tiếp lên kho lưu trữ đã kết nối.
            </p>
          </div>

          {/* Summary & Start Button */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#64748B'
            }}>
              <span>Đích đến: <strong>{selectedProvider?.name || 'Cloud'}</strong></span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>● Sẵn sàng đồng bộ</span>
            </div>

            <button
              onClick={handleStart}
              disabled={isRunning}
              style={{
                height: '42px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isRunning ? '#94A3B8' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isRunning ? 'none' : '0 2px 8px rgba(124, 58, 237, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              {isRunning ? (
                <>
                  <RotateCw size={16} className="spin" />
                  <span>Đang tải lên {currentRunningProvider}... ({backupProgress}%)</span>
                </>
              ) : (
                <>
                  <CloudUpload size={17} />
                  <span>Bắt đầu Sao lưu ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
