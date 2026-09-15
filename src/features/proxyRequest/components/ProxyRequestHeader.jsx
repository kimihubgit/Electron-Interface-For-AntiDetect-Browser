import React from 'react';
import { Activity, Pause, Play, Trash2, Zap } from 'lucide-react';

export default function ProxyRequestHeader({
  isCapturing,
  onToggleCapture,
  onClearRequests,
  onOpenAddRule
}) {
  return (
    <div
      style={{
        padding: '20px 24px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#EDE9FE',
              color: 'var(--apidog-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(124, 58, 237, 0.12)'
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#111827', margin: 0 }}>
              Hệ Thống Bắt Gói Mạng & Phân Luồng Proxy (Traffic Router)
            </h2>
            <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Đánh chặn và phân tích lưu lượng mạng thời gian thực: Xác định API nào đi thẳng (DIRECT) để tiết kiệm băng thông, API nào qua PROXY và API nào cần CHẶN
            </p>
          </div>
        </div>
      </div>

      {/* Global Toolbar Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onToggleCapture}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isCapturing ? '#059669' : '#DC2626',
            color: '#FFFFFF',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: isCapturing ? '0 2px 5px rgba(5, 150, 105, 0.25)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          {isCapturing ? <Pause size={14} /> : <Play size={14} />}
          {isCapturing ? 'Đang Bắt Gói (Capture ON)' : 'Đã Tạm Dừng (Capture OFF)'}
        </button>

        <button
          onClick={onClearRequests}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 14px', borderRadius: '8px' }}
          title="Xóa danh sách request bắt được"
        >
          <Trash2 size={14} /> Xóa Log
        </button>

        <button
          onClick={onOpenAddRule}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}
        >
          <Zap size={14} /> + Thêm Quy Tắc
        </button>
      </div>
    </div>
  );
}
