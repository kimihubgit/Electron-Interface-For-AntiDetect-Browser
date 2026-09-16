import React, { useState, useMemo } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import { INITIAL_MEMBERS } from '../../team/data/teamConstants';

/**
 * TransferProfileModal - Popup chuyển giao Profile cho người dùng khác
 * Thiết kế giao diện khớp 100% với hình ảnh mô tả:
 * - Tiêu đề: Transfer {N} profiles
 * - Hộp lưu ý thông tin màu xanh dương nhạt
 * - Mục "Transfer to" với dropdown chọn người nhận
 * - Mục "Transfer options" với 3 tùy chọn checkbox
 * - Nút "Next" màu xanh dương nổi bật toàn màn hình
 */
export default function TransferProfileModal({
  isOpen,
  onClose,
  selectedCount = 1,
  onConfirm
}) {
  const { t } = useTranslation();

  // Người nhận
  const [recipient, setRecipient] = useState('TEST');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');

  // Các tùy chọn chuyển giao
  const [includeName, setIncludeName] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(false);
  const [deleteAfterTransfer, setDeleteAfterTransfer] = useState(false);

  // Danh sách gợi ý người nhận
  const availableRecipients = useMemo(() => {
    try {
      const saved = localStorage.getItem('antidetect_enterprise_members');
      const list = saved ? JSON.parse(saved) : INITIAL_MEMBERS;
      const names = list.map(m => m.name || m.email).filter(Boolean);
      return Array.from(new Set(['TEST', ...names]));
    } catch {
      return ['TEST', 'Nguyễn Văn Hùng', 'Trần Thị Mai', 'Hoàng Tuấn Anh'];
    }
  }, []);

  if (!isOpen) return null;

  const handleSelectRecipient = (name) => {
    setRecipient(name);
    setCustomInput('');
    setIsDropdownOpen(false);
  };

  const handleConfirm = () => {
    const finalRecipient = customInput.trim() || recipient || 'TEST';
    onConfirm?.({
      recipient: finalRecipient,
      includeName,
      includeNotes,
      deleteAfterTransfer
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        animation: 'fadeInModal 0.15s ease'
      }}
      onClick={() => {
        if (isDropdownOpen) setIsDropdownOpen(false);
      }}
    >
      <div
        style={{
          width: '460px',
          maxWidth: '92vw',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: '18px 24px 14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 700,
              color: '#0F172A',
              letterSpacing: '-0.2px'
            }}
          >
            Transfer {selectedCount} profile{selectedCount > 1 ? 's' : ''}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.12s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          {/* Info callout banner */}
          <div
            style={{
              backgroundColor: '#DDF4FF',
              borderRadius: '8px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            {/* Circular Info Icon */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#0095FF',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px'
              }}
            >
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  fontFamily: 'serif',
                  fontStyle: 'italic',
                  lineHeight: 1
                }}
              >
                i
              </span>
            </div>
            <div
              style={{
                fontSize: '12px',
                lineHeight: '1.5',
                color: '#0369A1'
              }}
            >
              Profile transfer will send your selected profile{' '}
              <strong>synchronized cloud data, proxy information, accounts, cookies, and fingerprint parameters, etc.</strong>,{' '}
              but cannot send extension applications, require manual installation by the recipient.
            </div>
          </div>

          {/* Transfer to section */}
          <div style={{ marginBottom: '18px', position: 'relative' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '8px'
              }}
            >
              Transfer to
            </label>

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#94A3B8')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = isDropdownOpen ? '#0095FF' : '#CBD5E1')}
            >
              <span style={{ fontSize: '13.5px', color: '#0F172A', fontWeight: 500 }}>
                {customInput.trim() || recipient || 'TEST'}
              </span>
              <ChevronDown
                size={16}
                style={{
                  color: '#64748B',
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease'
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  zIndex: 20,
                  padding: '6px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}
              >
                {/* Custom input entry */}
                <div style={{ padding: '6px 8px', borderBottom: '1px solid #F1F5F9', marginBottom: '4px' }}>
                  <input
                    type="text"
                    placeholder="Nhập email hoặc tên người nhận..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '12px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '5px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                </div>

                {availableRecipients.map((item) => {
                  const isCurrent = (customInput ? false : recipient === item);
                  return (
                    <div
                      key={item}
                      onClick={() => handleSelectRecipient(item)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '5px',
                        fontSize: '13px',
                        color: isCurrent ? '#0095FF' : '#0F172A',
                        fontWeight: isCurrent ? 600 : 400,
                        backgroundColor: isCurrent ? '#EFF6FF' : 'transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.1s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span>{item}</span>
                      {isCurrent && <Check size={14} style={{ color: '#0095FF' }} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Transfer options section */}
          <div style={{ marginTop: '16px' }}>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#0F172A',
                marginBottom: '12px'
              }}
            >
              Transfer options
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option 1: Profile Name */}
              <div
                onClick={() => setIncludeName(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: includeName ? '1.5px solid #0095FF' : '1.5px solid #CBD5E1',
                    backgroundColor: includeName ? '#0095FF' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {includeName && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '13px', color: '#1E293B' }}>Profile Name</span>
              </div>

              {/* Option 2: Profile Notes */}
              <div
                onClick={() => setIncludeNotes(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: includeNotes ? '1.5px solid #0095FF' : '1.5px solid #CBD5E1',
                    backgroundColor: includeNotes ? '#0095FF' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {includeNotes && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '13px', color: '#1E293B' }}>Profile Notes</span>
              </div>

              {/* Option 3: Permanently delete profiles after transfer */}
              <div
                onClick={() => setDeleteAfterTransfer(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: deleteAfterTransfer ? '1.5px solid #0095FF' : '1.5px solid #CBD5E1',
                    backgroundColor: deleteAfterTransfer ? '#0095FF' : '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {deleteAfterTransfer && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.4' }}>
                  Permanently delete profiles after transfer (this action cannot be undone)
                </span>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleConfirm}
            style={{
              marginTop: '26px',
              width: '100%',
              height: '42px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0095FF',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 149, 255, 0.25)',
              transition: 'background-color 0.15s ease, transform 0.1s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0084E3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0095FF')}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.99)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
