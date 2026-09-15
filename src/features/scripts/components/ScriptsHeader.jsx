import React from 'react';
import { FileCode, Plus } from 'lucide-react';

export default function ScriptsHeader({ onCreateScript }) {
  return (
    <div style={{
      padding: '14px 24px',
      backgroundColor: 'var(--apidog-card-bg)',
      borderBottom: '1px solid var(--apidog-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563EB'
        }}>
          <FileCode size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--apidog-text-main)' }}>
              Kho Kịch Bản Mã Nguồn (Code Scripts Library)
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              color: '#2563EB'
            }}>
              PLAYWRIGHT & PUPPETEER
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--apidog-text-muted)', marginTop: '2px' }}>
            Thư viện mã script lập trình độc lập dành cho developers và chuyên gia automation.
          </div>
        </div>
      </div>

      <button
        onClick={onCreateScript}
        style={{
          height: '34px',
          padding: '0 14px',
          backgroundColor: 'var(--apidog-purple)',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '6px',
          fontSize: '12.5px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Plus size={14} />
        <span>Tạo Script Mới</span>
      </button>
    </div>
  );
}
