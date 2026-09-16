import React, { useRef, useMemo } from 'react';
import {
  Upload,
  X,
  ChevronDown,
  Info
} from 'lucide-react';
import { useModalShortcuts } from '../../../hooks/useModalShortcuts';

export default function ProxyBulkModal({
  isOpen,
  onClose,
  bulkType,
  setBulkType,
  bulkIpVersion,
  setBulkIpVersion,
  bulkText,
  setBulkText,
  onSubmit,
  showToast
}) {
  const bulkFileInputRef = useRef(null);
  useModalShortcuts(isOpen, onClose);

  const bulkLineCount = useMemo(() => {
    return bulkText.split('\n').map((l) => l.trim()).filter(Boolean).length;
  }, [bulkText]);

  if (!isOpen) return null;

  const handlePasteBulk = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        showToast?.('Clipboard trống!');
        return;
      }
      setBulkText((prev) => (prev ? `${prev}\n${text.trim()}` : text.trim()));
      showToast?.('Đã dán danh sách proxy từ clipboard!');
    } catch (err) {
      showToast?.('Không thể đọc clipboard: ' + (err.message || ''));
    }
  };

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result || '';
      setBulkText(content.trim());
      showToast?.(`Đã nạp file "${file.name}"!`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '600px',
          maxWidth: '94vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          animation: 'fadeInModal 0.15s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '15px 20px',
            borderBottom: '1px solid #F1F5F9',
            backgroundColor: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                backgroundColor: '#EDE9FE',
                color: 'var(--apidog-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Upload size={17} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                Nhập Proxy Hàng Loạt
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Thêm nhiều proxy cùng lúc từ văn bản hoặc tệp tin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Protocol & IP Version Selection + Choose file */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Giao thức mặc định
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 28px 0 10px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#0F172A',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none'
                    }}
                  >
                    <option value="SOCKS5">SOCKS5</option>
                    <option value="HTTP">HTTP</option>
                    <option value="HTTPS">HTTPS</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Loại IP
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={bulkIpVersion}
                    onChange={(e) => setBulkIpVersion(e.target.value)}
                    style={{
                      width: '100%',
                      height: '38px',
                      padding: '0 28px 0 10px',
                      borderRadius: '4px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#F8FAFC',
                      color: '#0F172A',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      WebkitAppearance: 'none'
                    }}
                  >
                    <option value="IPv4">IPv4</option>
                    <option value="IPv6">IPv6</option>
                  </select>
                  <ChevronDown
                    size={14}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748B' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'transparent', marginBottom: '6px' }}>
                  Tệp
                </label>
                <input
                  type="file"
                  ref={bulkFileInputRef}
                  accept=".txt,.csv"
                  onChange={handleBulkFileChange}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => bulkFileInputRef.current?.click()}
                  title="Chọn tệp proxy (.txt, .csv)"
                  style={{
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '4px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F8FAFC';
                    e.currentTarget.style.borderColor = '#94A3B8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }}
                >
                  <Upload size={14} />
                  <span>Chọn tệp</span>
                </button>
              </div>
            </div>

            {/* Format Instructions Banner */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '4px',
                padding: '10px 14px',
                fontSize: '11.5px',
                color: '#475569'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>
                <Info size={14} style={{ color: 'var(--apidog-purple)' }} />
                <span>Định dạng hỗ trợ (Mỗi dòng 1 proxy):</span>
              </div>
              <div style={{ fontFamily: 'monospace', color: '#64748B', display: 'flex', flexDirection: 'column', gap: '2px', marginLeft: '20px' }}>
                <div>• IP:Port:User:Pass (vd: 154.21.32.88:1080:user1:pass1)</div>
                <div>• IP:Port (vd: 113.161.44.12:8080)</div>
                <div>• User:Pass@IP:Port (vd: user1:pass1@198.51.100.45:9050)</div>
                <div>• SOCKS5/HTTP Link (vd: socks5://user:pass@154.21.32.88:1080)</div>
                <div>• IPv6 Subnet (vd: [2402:800:6000:a1b2::1]:1080:user:pass)</div>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                  Danh sách Proxy ({bulkLineCount} dòng)
                </label>
                <button
                  type="button"
                  onClick={handlePasteBulk}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--apidog-purple)',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Dán từ clipboard
                </button>
              </div>

              <textarea
                rows={7}
                placeholder={`154.21.32.88:1080:user_phuc:pass_123\n113.161.44.12:8080\nsocks5://user:pass@198.51.100.45:9050\n[2402:800:6000:a1b2::1]:1080:user:pass`}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  fontFamily: 'monospace',
                  lineHeight: '1.5',
                  boxSizing: 'border-box',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '14px 22px',
              borderTop: '1px solid #F1F5F9',
              backgroundColor: '#F8FAFC',
              gap: '8px'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                height: '34px',
                padding: '0 16px',
                borderRadius: '4px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={!bulkText.trim()}
              style={{
                height: '34px',
                padding: '0 18px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: bulkText.trim() ? 'var(--apidog-purple)' : '#CBD5E1',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: bulkText.trim() ? 'pointer' : 'not-allowed',
                boxShadow: bulkText.trim() ? '0 1px 3px rgba(124, 58, 237, 0.25)' : 'none',
                transition: 'all 0.15s'
              }}
            >
              Nhập {bulkLineCount > 0 ? `${bulkLineCount} proxy` : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
