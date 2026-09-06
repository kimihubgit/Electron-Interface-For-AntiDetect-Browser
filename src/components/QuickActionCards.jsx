import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  ChevronDown, 
  X, 
  Fingerprint,
  UploadCloud,
  CheckCircle,
  Cpu,
  Monitor
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function ApidogHomeCards() {
  const { setActiveProfileModal, setActiveProxyModal, setActiveTab } = useBrowser();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const cards = [
    {
      id: 'new-profile',
      title: 'Tạo Profile mới',
      tag: 'BROWSER',
      icon: (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#EFF6FF',
          color: '#2563EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #DBEAFE'
        }}>
          <Monitor size={22} style={{ strokeWidth: 2.2 }} />
        </div>
      ),
      color: '#2563EB',
      onClick: () => setActiveProfileModal('new'),
    },
    {
      id: 'new-proxy',
      title: 'Thêm Proxy mới',
      tag: 'PROXY',
      icon: (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#FDF2F8',
          color: '#DB2777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #FCE7F3'
        }}>
          <Shield size={22} style={{ strokeWidth: 2.2 }} />
        </div>
      ),
      color: '#DB2777',
      onClick: () => setActiveProxyModal(true),
    },
    {
      id: 'fingerprint-config',
      title: 'Cấu hình Vân tay',
      tag: 'FINGERPRINT',
      icon: (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#F5F3FF',
          color: '#7C3AED',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #EDE9FE'
        }}>
          <Fingerprint size={22} style={{ strokeWidth: 2.2 }} />
        </div>
      ),
      color: '#7C3AED',
      onClick: () => setActiveTab('settings'),
    },
    {
      id: 'quick-launch',
      title: 'Khởi chạy nhanh',
      tag: 'LAUNCH',
      icon: (
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          backgroundColor: '#ECFDF5',
          color: '#10B981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #D1FAE5'
        }}>
          <Zap size={22} style={{ strokeWidth: 2.2 }} />
        </div>
      ),
      color: '#10B981',
      onClick: () => setActiveTab('profiles'),
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '36px 20px 24px 20px',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* 4 Cards Grid exactly like Apidog's visual layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 150px)',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={card.onClick}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--apidog-border)',
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '136px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
              e.currentTarget.style.borderColor = card.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              e.currentTarget.style.borderColor = 'var(--apidog-border)';
            }}
          >
            <div style={{ marginBottom: '14px', height: '36px', display: 'flex', alignItems: 'center' }}>
              {card.icon}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apidog-text-main)', lineHeight: '1.3' }}>
              {card.title}
            </span>
          </div>
        ))}
      </div>

      {/* "Thêm ▾" Dropdown Link */}
      <div style={{ position: 'relative', marginBottom: '18px' }}>
        <button
          onClick={() => setShowMoreMenu(prev => !prev)}
          style={{
            fontSize: '12px',
            color: 'var(--apidog-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--apidog-purple)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--apidog-text-muted)'}
        >
          <span>Thêm tính năng</span>
          <ChevronDown size={13} />
        </button>

        {showMoreMenu && (
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--apidog-border)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            width: '220px',
            padding: '6px 0',
            zIndex: 50,
            fontSize: '12px'
          }}>
            <div 
              onClick={() => { setShowMoreMenu(false); setActiveProfileModal('new'); }}
              style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              className="hover-item"
            >
              <UploadCloud size={14} color="#7C3AED" />
              <span>Nhập profile từ Excel / CSV</span>
            </div>
            <div 
              onClick={() => { setShowMoreMenu(false); setActiveProxyModal(true); }}
              style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              className="hover-item"
            >
              <CheckCircle size={14} color="#10B981" />
              <span>Kiểm tra Proxy hàng loạt</span>
            </div>
            <div 
              onClick={() => { setShowMoreMenu(false); setActiveTab('settings'); }}
              style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              className="hover-item"
            >
              <Cpu size={14} color="#2563EB" />
              <span>Kho User-Agent & Canvas Engine</span>
            </div>
          </div>
        )}
      </div>

      {/* Purple Tooltip Banner with arrow (Apidog aesthetic) */}
      {showBanner && (
        <div style={{
          backgroundColor: '#7C3AED',
          color: '#FFFFFF',
          padding: '9px 18px',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px',
          fontWeight: 500,
          boxShadow: '0 8px 18px -4px rgba(124, 58, 237, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative'
        }}>
          {/* Top Triangle Arrow */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderBottom: '6px solid #7C3AED'
          }} />

          <span>Hỗ trợ tự động giả lập Canvas Noise, WebGL 3D, AudioContext, GeoIP & WebRTC 100% Unique.</span>
          
          <button
            onClick={() => setShowBanner(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              opacity: 0.85,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '2px'
            }}
            title="Đóng"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
