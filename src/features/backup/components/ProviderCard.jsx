import React from 'react';
import { 
  Cloud, 
  Send, 
  Server, 
  Database, 
  HardDrive, 
  CheckCircle2, 
  AlertCircle, 
  Settings2, 
  Play, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ProviderCard({ 
  provider, 
  config, 
  onConfigure, 
  onTest, 
  onQuickBackup,
  isTesting = false
}) {
  const isConfigured = !!config?.isConfigured;

  // Custom provider icon renderer
  const renderProviderIcon = () => {
    switch (provider.iconType) {
      case 'telegram':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Send size={22} style={{ transform: 'translateX(-1px) translateY(1px)' }} />
          </div>
        );
      case 'google_drive':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <HardDrive size={22} />
          </div>
        );
      case 'bizfly':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Server size={22} />
          </div>
        );
      case 'cloudfly':
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Cloud size={22} />
          </div>
        );
      case 'cloudflare':
      case 'aws':
      case 'digitalocean':
      case 'wasabi':
      case 'minio':
      default:
        return (
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: provider.color || '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Database size={22} />
          </div>
        );
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: isConfigured ? '1.5px solid #CBD5E1' : '1px solid #E2E8F0',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.18s ease',
        boxShadow: isConfigured ? '0 4px 12px rgba(15, 23, 42, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--apidog-purple)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isConfigured ? '#CBD5E1' : '#E2E8F0';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = isConfigured ? '0 4px 12px rgba(15, 23, 42, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.03)';
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {renderProviderIcon()}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  {provider.name}
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B' }}>{provider.category}</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: '9999px',
            backgroundColor: isConfigured ? '#ECFDF5' : '#F1F5F9',
            color: isConfigured ? '#10B981' : '#94A3B8'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isConfigured ? '#10B981' : '#CBD5E1'
            }} />
            <span>{isConfigured ? 'Đã kết nối' : 'Chưa cấu hình'}</span>
          </div>
        </div>

        {/* Tag & Description */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '10.5px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            backgroundColor: provider.tagBg,
            color: provider.tagColor
          }}>
            {provider.tag}
          </span>
          {config?.lastSynced && (
            <span style={{
              fontSize: '10.5px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#F8FAFC',
              color: '#64748B',
              border: '1px solid #E2E8F0'
            }}>
              Lần cuối: {config.lastSynced}
            </span>
          )}
        </div>

        <p style={{
          fontSize: '12px',
          color: '#475569',
          lineHeight: '1.45',
          margin: '0 0 16px 0',
          minHeight: '34px'
        }}>
          {provider.description}
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingTop: '14px',
        borderTop: '1px solid #F1F5F9'
      }}>
        <button
          onClick={() => onConfigure(provider)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            height: '32px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8FAFC';
            e.currentTarget.style.borderColor = 'var(--apidog-purple)';
            e.currentTarget.style.color = 'var(--apidog-purple)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#FFFFFF';
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.color = '#334155';
          }}
        >
          <Settings2 size={14} />
          <span>{isConfigured ? 'Sửa cấu hình' : 'Cấu hình ngay'}</span>
        </button>

        {isConfigured && (
          <>
            <button
              onClick={() => onTest(provider.id)}
              disabled={isTesting}
              title="Kiểm tra kết nối tới server"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#F8FAFC',
                color: '#64748B',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EDE9FE';
                e.currentTarget.style.color = 'var(--apidog-purple)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.color = '#64748B';
              }}
            >
              <ShieldCheck size={15} />
            </button>

            <button
              onClick={() => onQuickBackup(provider.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '0 10px',
                height: '32px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--apidog-purple)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple)'}
            >
              <Play size={13} fill="#FFFFFF" />
              <span>Sao lưu</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
