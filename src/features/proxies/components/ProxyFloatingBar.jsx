import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshCw,
  Copy,
  Download,
  ChevronDown,
  FileText,
  Link2,
  Radio,
  Trash2
} from 'lucide-react';

export default function ProxyFloatingBar({
  selectedProxyIds = [],
  totalCount = 0,
  onSelectAllVisible,
  isAllSelected,
  onPingSelected,
  isAnySelectedTesting,
  onCopySelected,
  onExportProxies,
  onQuickAssign,
  onDeleteSelected
}) {
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(e.target)) {
        setIsExportDropdownOpen(false);
      }
    };
    if (isExportDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExportDropdownOpen]);

  if (selectedProxyIds.length === 0) return null;

  return (
    <div
      style={{
        flexShrink: 0,
        height: '48px',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 90,
        borderTop: '1px solid #1E293B',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.2)',
        animation: 'slideUp 0.18s ease-out'
      }}
    >
      {/* Left: Selected count info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#334155',
              fontWeight: 700,
              color: '#38BDF8'
            }}
          >
            {selectedProxyIds.length}
          </span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9' }}>
            proxy đang được chọn
          </span>
          {!isAllSelected && (
            <button
              onClick={onSelectAllVisible}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '2px 4px'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
            >
              Chọn tất cả ({totalCount})
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Action 1: Ping */}
        <button
          onClick={onPingSelected}
          disabled={isAnySelectedTesting}
          title="Kiểm tra ping và trạng thái kết nối các proxy đã chọn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #2563EB',
            backgroundColor: '#1D4ED8',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isAnySelectedTesting ? 'not-allowed' : 'pointer',
            opacity: isAnySelectedTesting ? 0.85 : 1,
            transition: 'all 0.12s'
          }}
          onMouseEnter={(e) => {
            if (!isAnySelectedTesting) e.currentTarget.style.backgroundColor = '#2563EB';
          }}
          onMouseLeave={(e) => {
            if (!isAnySelectedTesting) e.currentTarget.style.backgroundColor = '#1D4ED8';
          }}
        >
          <RefreshCw size={12} className={isAnySelectedTesting ? 'spin-anim' : ''} />
          <span>{isAnySelectedTesting ? 'Đang ping...' : `Ping (${selectedProxyIds.length})`}</span>
        </button>

        {/* Action 2: Copy to clipboard */}
        <button
          onClick={onCopySelected}
          title="Sao chép danh sách proxy (host:port:user:pass) vào Clipboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #475569',
            backgroundColor: '#1E293B',
            color: '#F1F5F9',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.12s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
        >
          <Copy size={12} />
          <span>Sao chép ({selectedProxyIds.length})</span>
        </button>

        {/* Action 3: Export Proxies Dropdown */}
        <div style={{ position: 'relative' }} ref={exportDropdownRef}>
          <button
            type="button"
            onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            title="Xuất proxy đã chọn ra tệp .TXT, .CSV hoặc URL"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #059669',
              backgroundColor: '#047857',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.12s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
          >
            <Download size={12} />
            <span>Xuất Proxy ({selectedProxyIds.length})</span>
            <ChevronDown
              size={11}
              style={{
                transform: isExportDropdownOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s'
              }}
            />
          </button>

          {isExportDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '4px',
                boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                minWidth: '250px',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'fadeInModal 0.12s ease'
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #1E293B',
                  fontSize: '11px',
                  color: '#94A3B8',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}
              >
                Định dạng xuất file ({selectedProxyIds.length} proxy)
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExportProxies('txt');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '9px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.12s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FileText size={14} style={{ color: '#60A5FA', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Tệp văn bản .TXT</div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Định dạng host:port:user:pass</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExportProxies('csv');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '9px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderTop: '1px solid #1E293B',
                  transition: 'background-color 0.12s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <FileText size={14} style={{ color: '#34D399', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Bảng tính .CSV (Excel)</div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>Đầy đủ cột IP, Port, Type, Ping, Quốc gia...</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExportDropdownOpen(false);
                  onExportProxies('url');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '9px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderTop: '1px solid #1E293B',
                  transition: 'background-color 0.12s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1E293B')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Link2 size={14} style={{ color: '#F472B6', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600 }}>Định dạng URL Link</div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>protocol://user:pass@host:port</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Action 4: Assign to Profile */}
        <button
          type="button"
          onClick={onQuickAssign}
          title="Gán proxy vào hồ sơ profile trình duyệt"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #7C3AED',
            backgroundColor: '#6D28D9',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.12s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7C3AED')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6D28D9')}
        >
          <Radio size={12} />
          <span>Gán hồ sơ</span>
        </button>

        {/* Action 5: Delete all selected */}
        <button
          onClick={onDeleteSelected}
          title="Xóa toàn bộ các proxy đã chọn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 12px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.12s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
        >
          <Trash2 size={12} />
          <span>Xóa ({selectedProxyIds.length})</span>
        </button>
      </div>
    </div>
  );
}
