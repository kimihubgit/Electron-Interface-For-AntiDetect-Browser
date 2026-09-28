import React from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Wrench, 
  CheckCircle2
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

export default function ScriptsPage() {
  const { setActiveTab } = useBrowser();

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        padding: '32px 24px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.06), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
          padding: '40px 36px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Glowing Halo Icon */}
        <div
          style={{
            position: 'relative',
            marginBottom: '20px'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(99, 102, 241, 0) 70%)',
              filter: 'blur(8px)',
              zIndex: 0
            }}
          />
          <div
            style={{
              position: 'relative',
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(124, 58, 237, 0.35)',
              zIndex: 1
            }}
          >
            <Wrench size={34} />
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: '#EDE9FE',
            color: '#7C3AED',
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '14px',
            letterSpacing: '0.02em'
          }}
        >
          <Sparkles size={13} />
          <span>HỆ THỐNG ĐANG NÂNG CẤP</span>
        </div>

        {/* Title */}
        <h2
          style={{
            margin: '0 0 10px 0',
            fontSize: '22px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em'
          }}
        >
          Tính năng này đang được nâng cấp
        </h2>

        {/* Description */}
        <p
          style={{
            margin: '0 0 28px 0',
            fontSize: '13.5px',
            color: '#64748B',
            lineHeight: 1.6,
            maxWidth: '460px'
          }}
        >
          Phân hệ Quản lý & Thực thi Kịch bản Tự động hóa (Automation Scripting Core - Playwright & Puppeteer) đang được tối ưu hóa kiến trúc đa luồng và nâng cấp lên phiên bản hoàn toàn mới.
        </p>

        {/* Roadmap Cards */}
        <div
          style={{
            width: '100%',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '16px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'left'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Nội dung đang chuẩn bị ra mắt:
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }}>
              <CheckCircle2 size={15} />
            </div>
            <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              <strong style={{ color: '#0F172A' }}>Engine Playwright & CDP Siêu Tốc:</strong> Tối ưu khả năng chạy đồng thời hàng trăm luồng mà không gây quá tải CPU/RAM.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }}>
              <CheckCircle2 size={15} />
            </div>
            <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              <strong style={{ color: '#0F172A' }}>Trình Ghi Thao Tác (Visual Recorder):</strong> Tự động ghi lại hành vi click, gõ phím trên trình duyệt và trích xuất thành script.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{ color: '#16A34A', marginTop: '2px', flexShrink: 0 }}>
              <CheckCircle2 size={15} />
            </div>
            <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.4 }}>
              <strong style={{ color: '#0F172A' }}>Kho Kịch Bản Cloud:</strong> Tải sẵn hàng trăm mẫu kịch bản nuôi tài khoản Facebook, TikTok, Google, Discord.
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => setActiveTab('profiles')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'var(--apidog-purple)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 3px 8px rgba(124, 58, 237, 0.25)',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--apidog-purple)')}
        >
          <ArrowLeft size={15} />
          <span>Quay lại Quản lý Hồ Sơ</span>
        </button>
      </div>
    </div>
  );
}
