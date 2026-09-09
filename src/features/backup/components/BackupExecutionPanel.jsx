import React, { useState } from 'react';
import { 
  CloudUpload, 
  Lock, 
  Check, 
  Terminal, 
  RotateCw, 
  AlertCircle, 
  CheckCircle2, 
  FileArchive,
  Shield,
  Layers,
  Database
} from 'lucide-react';
import { BACKUP_PROVIDERS } from '../backupConstants';

export default function BackupExecutionPanel({ 
  configs, 
  profiles = [], 
  proxies = [], 
  onExecuteBackup, 
  backupStatus, 
  backupProgress, 
  backupLogs,
  currentRunningProvider,
  onResetStatus
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
  const isSuccess = backupStatus === 'success';

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
      display: 'grid',
      gridTemplateColumns: 'minmax(320px, 420px) 1fr',
      gap: '20px',
      padding: '2px 0'
    }}>
      {/* Left Column: Settings & Triggers */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
            Tạo bản sao lưu mới
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
            Chọn nền tảng đám mây đích và nội dung cần đóng gói.
          </p>
        </div>

        {/* 1. Target Provider Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>
            Nền tảng lưu trữ đích
          </label>
          <select
            value={selectedProviderId}
            onChange={(e) => setSelectedProviderId(e.target.value)}
            disabled={isRunning}
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '7px',
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
            Nội dung sao lưu
          </label>
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={includeProfiles} 
                onChange={(e) => setIncludeProfiles(e.target.checked)} 
                disabled={isRunning}
                style={{ accentColor: 'var(--apidog-purple)' }} 
              />
              <span>Cấu hình {profiles.length || 24} Hồ sơ & Canvas Fingerprint</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={includeCookies} 
                onChange={(e) => setIncludeCookies(e.target.checked)} 
                disabled={isRunning}
                style={{ accentColor: 'var(--apidog-purple)' }} 
              />
              <span>Cookies & Dữ liệu phiên duyệt web (Session Storage)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={includeExtensions} 
                onChange={(e) => setIncludeExtensions(e.target.checked)} 
                disabled={isRunning}
                style={{ accentColor: 'var(--apidog-purple)' }} 
              />
              <span>Tiện ích mở rộng (Extensions & CRX Data)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#1E293B', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={includeProxies} 
                onChange={(e) => setIncludeProxies(e.target.checked)} 
                disabled={isRunning}
                style={{ accentColor: 'var(--apidog-purple)' }} 
              />
              <span>Danh sách {proxies.length || 12} Proxy kết nối</span>
            </label>
          </div>
        </div>

        {/* 3. Encryption */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', fontWeight: 600, color: '#1E293B' }}>
            <input
              type="checkbox"
              checked={encryptWithPassword}
              onChange={(e) => setEncryptWithPassword(e.target.checked)}
              disabled={isRunning}
              style={{ accentColor: 'var(--apidog-purple)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={13} style={{ color: 'var(--apidog-purple)' }} />
              <span>Mã hóa bảo vệ dữ liệu bằng mật khẩu (AES-256)</span>
            </div>
          </label>

          {encryptWithPassword && (
            <input
              type="password"
              placeholder="Nhập mật khẩu mã hóa bản backup..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isRunning}
              style={{
                height: '36px',
                padding: '0 12px',
                borderRadius: '7px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                color: '#0F172A',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            />
          )}
        </div>

        {/* 4. Stats Summary & Start Button */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '14px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
            <span>Ước tính dung lượng nén:</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>~{estimatedMb} MB</span>
          </div>

          <button
            onClick={handleStart}
            disabled={isRunning}
            style={{
              height: '42px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isRunning ? '#94A3B8' : 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: isRunning ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isRunning) e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)';
            }}
            onMouseLeave={(e) => {
              if (!isRunning) e.currentTarget.style.backgroundColor = 'var(--apidog-purple)';
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

      {/* Right Column: Real-time Terminal & Progress */}
      <div style={{
        backgroundColor: '#0F172A',
        borderRadius: '12px',
        padding: '18px 20px',
        color: '#E2E8F0',
        fontFamily: 'var(--font-mono, monospace)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '340px',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.12)'
      }}>
        {/* Terminal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          borderBottom: '1px solid #334155',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            </div>
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 600, marginLeft: '6px' }}>
              Cloud Backup Terminal Console
            </span>
          </div>

          {backupStatus !== 'idle' && (
            <button
              onClick={onResetStatus}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '11px',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              Clear Log
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '5px', color: '#38BDF8' }}>
              <span>Đang tiến hành sao lưu...</span>
              <span>{backupProgress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#334155', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                width: `${backupProgress}%`,
                height: '100%',
                backgroundColor: 'var(--apidog-purple)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        )}

        {/* Log Stream */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          fontSize: '12.5px',
          lineHeight: '1.7',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {backupLogs.length === 0 ? (
            <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'center' }}>
              <Terminal size={18} />
              <span>Sẵn sàng. Nhấn "Bắt đầu Sao lưu ngay" để xuất dữ liệu lên Cloud/Telegram.</span>
            </div>
          ) : (
            backupLogs.map((log, index) => (
              <div key={index} style={{
                color: log.includes('Hoàn tất') ? '#4ADE80' : log.includes('[Khởi động]') ? '#38BDF8' : '#CBD5E1'
              }}>
                {log}
              </div>
            ))
          )}
        </div>

        {isSuccess && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #059669',
            color: '#34D399',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12.5px'
          }}>
            <CheckCircle2 size={16} />
            <span>Sao lưu thành công! File đã được ghi nhận vào lịch sử lưu trữ.</span>
          </div>
        )}
      </div>
    </div>
  );
}
