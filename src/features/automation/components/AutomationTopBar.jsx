import React from 'react';
import { ArrowLeft, PanelLeft, Home, Code, FileText, Search, RotateCw, Play } from 'lucide-react';

export default function AutomationTopBar({
  isSidebarOpen,
  setIsSidebarOpen,
  canvasSearchQuery,
  setCanvasSearchQuery,
  isExecuting,
  onRunWorkflow,
  onBack,
  onHome
}) {
  return (
    <div
      style={{
        height: '44px',
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
        zIndex: 20
      }}
    >
      {/* Left: Back button, Sidebar toggle, Home, Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: 'transparent',
            fontSize: '13px',
            fontWeight: 500,
            color: '#374151',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={15} />
          <span>Quay lại</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          title="Bật/tắt thư viện khối"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            background: isSidebarOpen ? '#F3F4F6' : '#FFFFFF',
            color: '#4B5563',
            cursor: 'pointer'
          }}
        >
          <PanelLeft size={15} />
        </button>

        <button
          onClick={onHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            border: 'none',
            borderRadius: '6px',
            background: 'transparent',
            color: '#6B7280',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Home size={15} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#2563EB',
            padding: '4px 8px',
            borderBottom: '2px solid #2563EB',
            cursor: 'pointer'
          }}
        >
          <Code size={14} />
          <span>Editor</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B7280',
            padding: '4px 8px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
        >
          <FileText size={14} />
          <span>Input</span>
        </div>
      </div>

      {/* Right: Search box & Run button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Tìm khối"
            value={canvasSearchQuery}
            onChange={(e) => setCanvasSearchQuery(e.target.value)}
            style={{
              width: '180px',
              height: '30px',
              paddingLeft: '30px',
              paddingRight: '10px',
              fontSize: '12px',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#F9FAFB',
              outline: 'none',
              color: '#1F2937'
            }}
          />
        </div>

        <button
          onClick={onRunWorkflow}
          disabled={isExecuting}
          style={{
            height: '32px',
            padding: '0 16px',
            borderRadius: '6px',
            backgroundColor: isExecuting ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '12.5px',
            fontWeight: 600,
            cursor: isExecuting ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}
        >
          {isExecuting ? (
            <>
              <RotateCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
              <span>Đang thực thi...</span>
            </>
          ) : (
            <>
              <Play size={13} fill="#FFFFFF" />
              <span>Chạy quy trình</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
