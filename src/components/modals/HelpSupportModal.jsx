import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Keyboard,
  Sparkles,
  BookOpen,
  MessageCircle,
  Send,
  ExternalLink,
  Search,
  CheckCircle2,
  Zap,
  Shield,
  Layers,
  Globe,
  Monitor
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export default function HelpSupportModal({
  isOpen,
  onClose,
  initialTab = 'shortcuts'
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab || 'shortcuts');
  const [shortcutQuery, setShortcutQuery] = useState('');

  if (!isOpen) return null;

  // Shortcuts catalog
  const SHORTCUT_GROUPS = [
    {
      category: 'Quản lý Hồ sơ (Profiles)',
      icon: Globe,
      color: '#7C3AED',
      items: [
        { keys: ['Ctrl', 'N'], desc: 'Tạo hồ sơ mới (Single Profile)' },
        { keys: ['Ctrl', 'B'], desc: 'Tạo hồ sơ hàng loạt (Batch Create)' },
        { keys: ['Space'], desc: 'Khởi chạy hoặc Tắt hồ sơ đang chọn' },
        { keys: ['Ctrl', 'F'], desc: 'Tìm kiếm nhanh hồ sơ theo tên hoặc proxy' },
        { keys: ['Delete'], desc: 'Chuyển các hồ sơ đã chọn vào Thùng rác' }
      ]
    },
    {
      category: 'Đồng bộ hóa & Cửa sổ (Synchronizer)',
      icon: Layers,
      color: '#2563EB',
      items: [
        { keys: ['Ctrl', 'Shift', 'S'], desc: 'Mở trang Đồng bộ hóa đa trình duyệt' },
        { keys: ['Ctrl', 'Alt', 'T'], desc: 'Tự động xếp 4 cửa sổ Chrome dạng lưới 2x2' },
        { keys: ['Ctrl', 'Alt', 'F'], desc: 'Đưa tất cả cửa sổ Chrome lên trên cùng' },
        { keys: ['F5'], desc: 'Làm mới toàn bộ trang trên các cửa sổ đang chạy' }
      ]
    },
    {
      category: 'Điều hướng & Hệ thống (Navigation)',
      icon: Monitor,
      color: '#059669',
      items: [
        { keys: ['Ctrl', '1'], desc: 'Về Trang chủ (Home Workspace)' },
        { keys: ['Ctrl', '2'], desc: 'Mở trang Quản lý Hồ sơ' },
        { keys: ['Ctrl', '3'], desc: 'Mở trang Quản lý Proxy' },
        { keys: ['Ctrl', '4'], desc: 'Mở trang Quản lý Nhóm' },
        { keys: ['Ctrl', ','], desc: 'Mở bảng Cài đặt hệ thống' },
        { keys: ['Ctrl', 'Shift', 'L'], desc: 'Bật/Tắt giao diện Sáng / Tối' }
      ]
    },
    {
      category: 'Thao tác Dữ liệu & Bảng (Selection)',
      icon: Zap,
      color: '#D97706',
      items: [
        { keys: ['Ctrl', 'A'], desc: 'Chọn tất cả hồ sơ hoặc proxy trên trang' },
        { keys: ['Esc'], desc: 'Bỏ chọn tất cả / Đóng cửa sổ popup hiện tại' }
      ]
    }
  ];

  // Filter shortcuts
  const filteredGroups = SHORTCUT_GROUPS.map(group => {
    const matchedItems = group.items.filter(item =>
      item.desc.toLowerCase().includes(shortcutQuery.toLowerCase()) ||
      item.keys.some(k => k.toLowerCase().includes(shortcutQuery.toLowerCase()))
    );
    return { ...group, items: matchedItems };
  }).filter(group => group.items.length > 0);

  // What's New Releases data
  const RELEASES = [
    {
      version: 'v2.4.0',
      date: 'Phiên bản mới nhất (Tháng 9/2026)',
      isLatest: true,
      highlights: [
        {
          tag: 'Tính năng mới',
          tagColor: '#7C3AED',
          title: 'Đồng bộ hóa đa trình duyệt (Multi-Window Synchronizer)',
          desc: 'Cho phép gán 1 Profile làm Cửa sổ chính (Master) và điều khiển đồng loạt các Chrome phụ làm theo. Tích hợp tính năng xếp lưới 2x2/2x3 và độ trễ ngẫu nhiên chống bot.'
        },
        {
          tag: 'Bảo mật',
          tagColor: '#059669',
          title: 'Nâng cấp Dual Token OAuth2 (Access & Refresh Token)',
          desc: 'Hỗ trợ Refresh Token 30 ngày an toàn, cơ chế tự động xoay token ngầm (silent token rotation) và khả năng hoạt động offline mượt mà không bị treo phần mềm.'
        },
        {
          tag: 'Hiệu năng',
          tagColor: '#2563EB',
          title: 'Tối ưu kiểm tra Proxy & Phân trang đa luồng',
          desc: 'Tăng tốc độ ping kiểm tra proxy lên 300%, tối ưu phân trang thông minh và bộ nút chọn/bỏ chọn tất cả trực quan.'
        },
        {
          tag: 'Cải tiến UX',
          tagColor: '#D97706',
          title: 'Terminal Sao lưu Đám mây dạng Footer Console',
          desc: 'Đưa khung dòng lệnh trong trang Sao lưu xuống thanh footer cố định ở đáy trang, giải phóng diện tích cho giao diện tạo sao lưu.'
        }
      ]
    },
    {
      version: 'v2.3.5',
      date: 'Bản phát hành Tháng 8/2026',
      isLatest: false,
      highlights: [
        {
          tag: 'Antidetect',
          tagColor: '#059669',
          title: 'Cập nhật nhân Chromium v128 & WebGL 2.0',
          desc: 'Vượt qua các hệ thống kiểm tra vân tay Cloudflare, Pixelscan, CreepJS với điểm trust score 100%.'
        },
        {
          tag: 'Tính năng',
          tagColor: '#7C3AED',
          title: 'Quản trị nhóm làm việc (Team Workspace)',
          desc: 'Phân quyền hồ sơ theo vai trò Quản trị viên, Quản lý và Thành viên một cách bảo mật.'
        }
      ]
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1200,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '720px',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '85vh',
        overflow: 'hidden',
        animation: 'fadeInModal 0.2s ease-out'
      }}>
        {/* ── 1. MODAL HEADER ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#EDE9FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7C3AED'
            }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Trung tâm Trợ giúp & Hỗ trợ
              </h2>
              <p style={{ fontSize: '12px', margin: '2px 0 0 0', color: '#64748B' }}>
                Phím tắt thao tác nhanh, thông tin cập nhật mới và kênh trợ giúp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#F1F5F9',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E8F0'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
          >
            <X size={16} />
          </button>
        </div>

        {/* ── 2. SUB NAVIGATION TABS ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 24px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC'
        }}>
          <button
            onClick={() => setActiveTab('shortcuts')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'shortcuts' ? '#7C3AED' : '#64748B',
              borderBottom: `2px solid ${activeTab === 'shortcuts' ? '#7C3AED' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <Keyboard size={15} />
            <span>Phím tắt hệ thống</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsNew')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'whatsNew' ? '#7C3AED' : '#64748B',
              borderBottom: `2px solid ${activeTab === 'whatsNew' ? '#7C3AED' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={15} />
            <span>Có gì mới? (v2.4.0)</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'support' ? '#7C3AED' : '#64748B',
              borderBottom: `2px solid ${activeTab === 'support' ? '#7C3AED' : 'transparent'}`,
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={15} />
            <span>Kênh hỗ trợ & Tài liệu</span>
          </button>
        </div>

        {/* ── 3. MODAL CONTENT BODY ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          boxSizing: 'border-box'
        }}>
          {/* TAB 1: KEYBOARD SHORTCUTS */}
          {activeTab === 'shortcuts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Search box for shortcuts */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0 12px',
                height: '36px'
              }}>
                <Search size={14} style={{ color: '#94A3B8', marginRight: '8px' }} />
                <input
                  type="text"
                  placeholder="Tìm phím tắt (VD: Tạo mới, Proxy, Đồng bộ, Chạy...)"
                  value={shortcutQuery}
                  onChange={(e) => setShortcutQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12.5px',
                    color: '#0F172A',
                    width: '100%'
                  }}
                />
                {shortcutQuery && (
                  <button
                    onClick={() => setShortcutQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Shortcut Categories List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {filteredGroups.map(group => {
                  const Icon = group.icon;
                  return (
                    <div
                      key={group.category}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Group Header */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        backgroundColor: '#F8FAFC',
                        borderBottom: '1px solid #E2E8F0'
                      }}>
                        <Icon size={14} style={{ color: group.color }} />
                        <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B' }}>
                          {group.category}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {group.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              borderBottom: idx === group.items.length - 1 ? 'none' : '1px solid #F1F5F9',
                              fontSize: '12.5px'
                            }}
                          >
                            <span style={{ color: '#334155', fontWeight: 500 }}>
                              {item.desc}
                            </span>

                            {/* Shortcut Badges */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {item.keys.map((k, kIdx) => (
                                <React.Fragment key={kIdx}>
                                  <kbd style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    minWidth: '22px',
                                    padding: '2px 7px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    fontFamily: 'system-ui, sans-serif',
                                    color: '#1E293B',
                                    backgroundColor: '#F8FAFC',
                                    border: '1px solid #CBD5E1',
                                    borderBottom: '2px solid #94A3B8',
                                    borderRadius: '5px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                  }}>
                                    {k}
                                  </kbd>
                                  {kIdx < item.keys.length - 1 && (
                                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>+</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {filteredGroups.length === 0 && (
                  <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
                    Không tìm thấy phím tắt phù hợp với từ khóa "{shortcutQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WHAT'S NEW (RELEASE CHANGELOG) */}
          {activeTab === 'whatsNew' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {RELEASES.map(release => (
                <div
                  key={release.version}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Version Title Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                        {release.version}
                      </span>
                      {release.isLatest && (
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: '#DCFCE7',
                          color: '#15803D'
                        }}>
                          MỚI NHẤT
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      {release.date}
                    </span>
                  </div>

                  {/* Highlights List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {release.highlights.map((item, hIdx) => (
                      <div
                        key={hIdx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: `${item.tagColor}15`,
                            color: item.tagColor
                          }}>
                            {item.tag}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                            {item.title}
                          </span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#475569', lineHeight: '1.5' }}>
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SUPPORT & COMMUNITY */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: '#475569' }}>
                Đội ngũ kỹ thuật Antidetect Browser luôn sẵn sàng hỗ trợ bạn 24/7. Vui lòng chọn kênh liên hệ thuận tiện:
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '14px'
              }}>
                {/* Channel 1: Documentation */}
                <div
                  onClick={() => window.open('https://apidog.com/help', '_blank')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7C3AED';
                    e.currentTarget.style.backgroundColor = '#FBF8FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Tài liệu hướng dẫn</span>
                      <ExternalLink size={12} style={{ color: '#94A3B8' }} />
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Xem wiki, cấu hình API và cẩm nang nuôi nick
                    </span>
                  </div>
                </div>

                {/* Channel 2: Telegram Support */}
                <div
                  onClick={() => window.open('https://t.me/antidetect_support', '_blank')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284C7';
                    e.currentTarget.style.backgroundColor = '#F0F9FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Send size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Telegram Hỗ Trợ 24/7</span>
                      <ExternalLink size={12} style={{ color: '#94A3B8' }} />
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Phản hồi kỹ thuật trong vòng 5 phút
                    </span>
                  </div>
                </div>

                {/* Channel 3: Community Discord */}
                <div
                  onClick={() => window.open('https://discord.gg', '_blank')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#6366F1';
                    e.currentTarget.style.backgroundColor = '#EEF2FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#EEF2FF',
                    color: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MessageCircle size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Cộng đồng MMO Discord</span>
                      <ExternalLink size={12} style={{ color: '#94A3B8' }} />
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      Giao lưu cùng hơn 10,000+ thành viên
                    </span>
                  </div>
                </div>

                {/* Channel 4: Email */}
                <div
                  onClick={() => window.open('mailto:support@antidetect.io')}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#059669';
                    e.currentTarget.style.backgroundColor = '#ECFDF5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: '#D1FAE5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Shield size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Email Hỗ Trợ Doanh Nghiệp</span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                      support@antidetect.io
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. MODAL FOOTER ── */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
            Antidetect Browser v2.4.0 • Được bảo vệ bởi bản quyền 2026
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
