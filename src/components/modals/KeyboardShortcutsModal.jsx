import React, { useState, useEffect } from 'react';
import { X, Pin } from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export default function KeyboardShortcutsModal({
  isOpen,
  onClose
}) {
  const { t } = useTranslation();
  const [singleCharEnabled, setSingleCharEnabled] = useState(() => {
    try {
      return localStorage.getItem('antidetect_single_char_shortcuts') !== 'false';
    } catch {
      return true;
    }
  });

  const toggleSingleChar = () => {
    const next = !singleCharEnabled;
    setSingleCharEnabled(next);
    try {
      localStorage.setItem('antidetect_single_char_shortcuts', String(next));
    } catch {}
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 5 Columns configuration inspired by Facebook Keyboard Shortcuts Modal layout
  const columnsData = [
    {
      title: 'Chung (Global)',
      items: [
        { label: 'Bảng phím tắt', keys: ['f1'] },
        { label: 'Bảng phím tắt phụ', keys: ['ctrl', '/'] },
        { label: 'Cài đặt hệ thống', keys: ['ctrl', ','] },
        { label: 'Đổi giao diện Sáng / Tối', keys: ['ctrl', 'shift', 'l'] },
        { label: 'Báo cáo sự cố / Hỗ trợ', keys: ['ctrl', 'alt', 'h'] },
      ],
      disabledTitle: 'Phím tắt tìm kiếm',
      disabledItems: [
        { label: 'Tìm kiếm nhanh hệ thống', keys: ['/'], isSingle: true }
      ]
    },
    {
      title: 'Hồ sơ (Profiles)',
      items: [
        { label: 'Tạo hồ sơ mới', keys: ['ctrl', 'n'] },
        { label: 'Tạo hàng loạt (Batch)', keys: ['ctrl', 'b'] },
        { label: 'Bật / Dừng hồ sơ chọn', keys: ['space'] },
        { label: 'Tìm kiếm hồ sơ', keys: ['ctrl', 'f'] },
        { label: 'Xóa hồ sơ vào Thùng rác', keys: ['delete'] },
        { label: 'Tải lại danh sách profile', keys: ['ctrl', 'r'] }
      ],
      disabledTitle: 'Phím ký tự nhanh',
      disabledItems: [
        { label: 'Hồ sơ kế tiếp', keys: ['j'], isSingle: true },
        { label: 'Hồ sơ trước đó', keys: ['k'], isSingle: true }
      ]
    },
    {
      title: 'Đồng bộ (Synchronizer)',
      items: [
        { label: 'Bật / Dừng đồng bộ', keys: ['ctrl', 'shift', 's'] },
        { label: 'Tự động xếp lưới 2x2', keys: ['ctrl', 'alt', 't'] },
        { label: 'Tự động xếp lưới 2x3', keys: ['ctrl', 'alt', 'g'] },
        { label: 'Đưa Chrome lên trên cùng', keys: ['ctrl', 'alt', 'f'] },
        { label: 'Làm mới tất cả cửa sổ', keys: ['f5'] },
        { label: 'Dừng tất cả hồ sơ đang mở', keys: ['ctrl', 'shift', 'w'] }
      ]
    },
    {
      title: 'Thao tác chọn (Selection)',
      items: [
        { label: 'Chọn tất cả hồ sơ', keys: ['ctrl', 'a'] },
        { label: 'Bỏ chọn tất cả / Đóng', keys: ['esc'] },
        { label: 'Chọn dải hồ sơ', keys: ['shift', 'click'] },
        { label: 'Nhân bản hồ sơ (Clone)', keys: ['ctrl', 'd'] },
        { label: 'Chuyển nhóm hàng loạt', keys: ['ctrl', 'm'] },
        { label: 'Đổi tên hồ sơ', keys: ['f2'] }
      ]
    },
    {
      title: 'Điều hướng (Navigation)',
      items: [
        { label: 'Trang chủ (Overview)', keys: ['ctrl', '1'] },
        { label: 'Trang Hồ sơ (Profiles)', keys: ['ctrl', '2'] },
        { label: 'Trang Proxy & Subnet', keys: ['ctrl', '3'] },
        { label: 'Trang Đồng bộ hóa', keys: ['ctrl', '4'] },
        { label: 'Trang Tiện ích mở rộng', keys: ['ctrl', '5'] },
        { label: 'Lịch sử phiên chạy', keys: ['ctrl', 'h'] }
      ],
      disabledTitle: 'Tác vụ nhanh',
      disabledItems: [
        { label: 'Mở cửa sổ ẩn danh', keys: ['alt', 'n'] }
      ]
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* ── CLEAN LIGHT THEME CONTAINER ── */}
      <div
        style={{
          width: '1180px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out',
          color: '#1E293B',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. HEADER (Centered title + Top-right close button) ── */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FFFFFF',
          flexShrink: 0
        }}>
          <h2 style={{
            fontSize: '17.5px',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '-0.01em'
          }}>
            Tất cả phím tắt Antidetect Browser
          </h2>

          <button
            onClick={onClose}
            title="Đóng (Esc)"
            style={{
              position: 'absolute',
              right: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.12s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E2E8F0';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* ── 2. COLUMNS GRID BODY ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF'
        }}>
          {columnsData.map((col, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Column Category Title */}
              <div style={{
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '14px',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '3px',
                  height: '13px',
                  backgroundColor: '#7C3AED',
                  borderRadius: '2px',
                  display: 'inline-block'
                }} />
                <span>{col.title}</span>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                {col.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}
                  >
                    <span style={{
                      fontSize: '12.5px',
                      color: '#334155',
                      lineHeight: '1.35',
                      fontWeight: 500
                    }}>
                      {item.label}
                    </span>

                    {/* Pill Key Badges (Clean Light Theme) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                      {item.keys.map((key, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: key.length === 1 ? '20px' : 'auto',
                            height: '22px',
                            padding: '0 6px',
                            borderRadius: '11px',
                            backgroundColor: '#F8FAFC',
                            border: '1px solid #CBD5E1',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                            color: '#1E293B',
                            fontSize: '11px',
                            fontWeight: 600,
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            textTransform: 'lowercase'
                          }}>
                            {key}
                          </span>
                          {kIdx < item.keys.length - 1 && (
                            <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: 600 }}>+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Disabled / Single Key Section (if exists) */}
              {col.disabledItems && col.disabledItems.length > 0 && (
                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px dashed #E2E8F0' }}>
                  <div style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#94A3B8',
                    marginBottom: '8px',
                    textTransform: 'capitalize'
                  }}>
                    {col.disabledTitle || 'Khác'}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {col.disabledItems.map((dItem, dIdx) => (
                      <div
                        key={dIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          opacity: singleCharEnabled ? 1 : 0.45,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        <span style={{
                          fontSize: '12px',
                          color: '#64748B',
                          lineHeight: '1.3'
                        }}>
                          {dItem.label}
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                          {dItem.keys.map((k, kIdx) => (
                            <span
                              key={kIdx}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '20px',
                                height: '22px',
                                padding: '0 6px',
                                borderRadius: '11px',
                                backgroundColor: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                color: '#64748B',
                                fontSize: '11px',
                                fontWeight: 600,
                                textTransform: 'lowercase'
                              }}
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 3. FOOTER (Single-character shortcuts toggle + Pin info) ── */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          {/* Left: Single-character shortcuts toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Custom Toggle Switch */}
            <div
              onClick={toggleSingleChar}
              style={{
                width: '40px',
                height: '22px',
                borderRadius: '12px',
                backgroundColor: singleCharEnabled ? '#7C3AED' : '#CBD5E1',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
            >
              <div style={{
                position: 'absolute',
                top: '2px',
                left: singleCharEnabled ? '20px' : '2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
                transition: 'left 0.2s ease'
              }} />
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                Phím tắt một ký tự (Single-character shortcuts)
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                Sử dụng các phím bấm nhanh đơn lẻ (như /, j, k, space) để thực hiện thao tác tức thì.
              </div>
            </div>
          </div>

          {/* Right: Pin shortcut help info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                Ghim trợ giúp phím tắt
              </div>
              <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '1px' }}>
                Nhấn <code style={{ backgroundColor: '#EDE9FE', color: '#7C3AED', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>F1</code> hoặc <code style={{ backgroundColor: '#EDE9FE', color: '#7C3AED', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Ctrl + /</code> bất cứ lúc nào để mở bảng này.
              </div>
            </div>

            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Pin size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
