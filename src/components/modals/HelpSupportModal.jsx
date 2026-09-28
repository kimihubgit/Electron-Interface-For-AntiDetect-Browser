import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  ExternalLink,
  Shield,
  Layers,
  Globe,
  Zap,
  HelpCircle,
  MessageCircle,
  Send,
  CheckCircle2,
  ChevronRight,
  Info,
  Server,
  Terminal,
  FileCode
} from 'lucide-react';
import { useTranslation } from '../../i18n/I18nContext';

export default function HelpSupportModal({
  isOpen,
  onClose
}) {
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState('gettingStarted');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Documentation sections & topics (ONLY documentation & guides)
  const DOC_TOPICS = [
    {
      id: 'gettingStarted',
      category: 'Khởi đầu',
      title: 'Bắt đầu nhanh với Antidetect Browser',
      icon: BookOpen,
      badge: 'Cơ bản',
      badgeColor: '#10B981',
      badgeBg: '#ECFDF5',
      summary: 'Quy trình tạo hồ sơ trình duyệt, gắn proxy và khởi chạy cửa sổ đầu tiên.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              1. Tạo và cấu hình Profile đầu tiên
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Để bắt đầu, hãy nhấn nút <strong>"+ Tạo Profile"</strong> ở góc trên bên phải trang Quản lý Hồ sơ.
              Mỗi hồ sơ tương ứng với một phiên trình duyệt độc lập hoàn toàn, sở hữu kho lưu trữ Cookie, LocalStorage và dấu vân tay thiết bị riêng biệt.
            </p>
          </div>

          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B', margin: '0 0 6px 0' }}>
              Các bước cấu hình nhanh:
            </h4>
            <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#475569', lineHeight: '1.7' }}>
              <li><strong>Đặt tên Profile:</strong> Đặt tên dễ nhớ theo mục đích tài khoản (ví dụ: FB-Ads-01, TikTok-Shop-VN).</li>
              <li><strong>Chọn Nhóm:</strong> Phân loại vào nhóm hồ sơ để quản lý và lọc nhanh.</li>
              <li><strong>Thiết lập Proxy:</strong> Chọn proxy có sẵn trong Kho hoặc nhập trực tiếp theo định dạng <code>host:port:user:pass</code>.</li>
              <li><strong>Tùy chọn Fingerprint:</strong> Bạn có thể giữ mặc định để hệ thống tự động sinh cấu hình phần cứng tự nhiên nhất hoặc tùy chỉnh hệ điều hành (Windows, macOS, Linux).</li>
            </ol>
          </div>

          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              2. Nhập Cookie (Cookies Import)
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Antidetect Browser hỗ trợ tự động giải nén và nạp Cookie ở cả định dạng <strong>JSON</strong> và <strong>Netscape</strong>.
              Bạn chỉ cần dán đoạn cookie vào mục Cookie khi tạo hoặc chỉnh sửa profile, hệ thống sẽ tự động gán vào trình duyệt mà không cần đăng nhập lại tài khoản.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'proxyManagement',
      category: 'Mạng & Proxy',
      title: 'Cấu hình Proxy & IPv6 LAN Subnet',
      icon: Globe,
      badge: 'Mạng',
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF',
      summary: 'Hướng dẫn thiết lập Proxy HTTP, SOCKS5, DCOM xoay IP và IPv6 LAN Server.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              1. Các giao thức Proxy được hỗ trợ
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Hệ thống tích hợp lõi Local Core Daemon (Rust) hỗ trợ truyền tải lưu lượng tốc độ cao qua các giao thức:
            </p>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '12.5px', color: '#475569', lineHeight: '1.7' }}>
              <li><strong>HTTP / HTTPS:</strong> Proxy web phổ thông, hỗ trợ xác thực tài khoản/mật khẩu.</li>
              <li><strong>SOCKS5:</strong> Truyền tải an toàn tầng socket, tương thích cao với tất cả các nền tảng mạng xã hội và web3.</li>
              <li><strong>Proxy xoay IP (Rotating / DCOM):</strong> Hỗ trợ link kích hoạt đổi IP tự động qua API đổi IP.</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#1E40AF', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={15} /> Máy chủ Proxy IPv6 LAN Subnet nội bộ
            </h4>
            <p style={{ fontSize: '12.5px', color: '#1E3A8A', lineHeight: '1.6', margin: 0 }}>
              Tại tab <strong>Proxy &rarr; IPv6 Subnet</strong>, bạn có thể bật máy chủ chuyển tiếp proxy cục bộ (Port 8085).
              Máy chủ này cho phép các thiết bị khác trong cùng mạng LAN kết nối sử dụng dải IP IPv6 mà không cần cài đặt phần mềm phụ trợ.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'synchronizer',
      category: 'Đồng bộ hóa',
      title: 'Đồng bộ thao tác đa trình duyệt (Synchronizer)',
      icon: Layers,
      badge: 'Nâng cao',
      badgeColor: '#7C3AED',
      badgeBg: '#EDE9FE',
      summary: 'Điều khiển đồng loạt nhiều cửa sổ Chrome với 1 cửa sổ Master duy nhất.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              1. Cơ chế hoạt động của Synchronizer
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Tính năng Đồng bộ hóa cho phép bạn chỉ định 1 cửa sổ làm <strong>Cửa sổ Chính (Master)</strong>.
              Mọi thao tác chuột (click, cuộn trang, di chuột) và gõ phím trên cửa sổ Master sẽ được nhân bản tức thì sang các <strong>Cửa sổ Phụ (Followers)</strong> thông qua giao thức Chrome DevTools Protocol (CDP).
            </p>
          </div>

          <div style={{
            backgroundColor: '#FAF5FF',
            border: '1px solid #E9D5FF',
            borderRadius: '8px',
            padding: '14px 16px'
          }}>
            <h4 style={{ fontSize: '13.5px', fontWeight: 600, color: '#6B21A8', margin: '0 0 6px 0' }}>
              Các tính năng an toàn chống phát hiện:
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: '#581C87', lineHeight: '1.7' }}>
              <li><strong>Độ trễ ngẫu nhiên (Random Delay):</strong> Tự động chèn độ trễ từ 50ms - 250ms giữa các click chuột ở từng cửa sổ để tránh bị nhận diện hành vi máy móc (botting).</li>
              <li><strong>Tự động xếp lưới (Grid Tiling):</strong> Nhấn <code>Ctrl + Alt + T</code> hoặc chọn menu Xếp lưới 2x2 / 2x3 để hệ thống tự động căn chỉnh kích thước các cửa sổ vừa vặn trên màn hình.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'fingerprint',
      category: 'Bảo mật',
      title: 'Công nghệ chống nhận diện Fingerprint',
      icon: Shield,
      badge: 'Cốt lõi',
      badgeColor: '#D97706',
      badgeBg: '#FEF3C7',
      summary: 'Cách Antidetect giả lập Canvas, WebGL, AudioContext, Fonts và WebRTC an toàn.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              Nguyên lý bảo vệ Fingerprint
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
              Khác với việc chặn hoặc giả lập sơ sài khiến các trang kiểm tra (như Pixelscan, CreepJS, BrowserLeaks) đánh cắp cờ đỏ (red flag),
              Antidetect Browser can thiệp ở tầng thấp bằng cách thêm nhiễu vi mô (noise injection) tự nhiên vào các API nhạy cảm:
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Canvas & WebGL 2.0</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.5' }}>
                Thêm độ lệch màu vi mô pixel, giữ nguyên chỉ số Hash không đổi trong suốt vòng đời của từng profile.
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>WebRTC & Real IP</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.5' }}>
                Khóa hoàn toàn rò rỉ địa chỉ IP thật, tự động gán địa chỉ IP Public tương ứng với Proxy đã chỉ định.
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Timezone & GeoLocation</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.5' }}>
                Tự động đồng bộ múi giờ, kinh độ, vĩ độ và ngôn ngữ trình duyệt theo đúng vị trí địa lý của Proxy.
              </div>
            </div>

            <div style={{ padding: '12px', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: '#F8FAFC' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Audio & Hardware Concurrency</div>
              <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: '1.5' }}>
                Tùy biến số nhân CPU, bộ nhớ RAM, card đồ họa GPU giả lập khớp hoàn hảo với User-Agent.
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      category: 'Hỗ trợ & Lỗi',
      title: 'Câu hỏi thường gặp & Khắc phục sự cố',
      icon: HelpCircle,
      badge: 'Khắc phục',
      badgeColor: '#EF4444',
      badgeBg: '#FEF2F2',
      summary: 'Các lỗi kết nối proxy, lỗi tải profile và hướng xử lý nhanh.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Q: Trình duyệt mở lên bị báo "Không thể kết nối Internet" (Proxy Error)?
            </h4>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
              Kiểm tra lại Proxy của bạn tại tab Proxy. Bấm nút <strong>"Kiểm tra Proxy"</strong> để xác minh xem server proxy còn sống hay đã hết hạn băng thông / đổi IP.
            </p>
          </div>

          <div style={{ padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Q: Lỡ xóa nhầm Profile thì có lấy lại được không?
            </h4>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
              Hệ thống có cơ chế <strong>Thùng rác (Trash Bin)</strong>. Profile khi bấm xóa sẽ được đưa vào Thùng rác trong 30 ngày. Bạn chỉ cần nhấn icon Thùng rác ở góc trên bảng để khôi phục nguyên vẹn.
            </p>
          </div>

          <div style={{ padding: '12px 14px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              Q: Làm sao để chuyển Profile sang máy tính khác hoặc người dùng khác?
            </h4>
            <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: '1.5' }}>
              Chọn các profile cần chuyển &rarr; Bấm nút <strong>"Chuyển giao (Transfer)"</strong> trên thanh thao tác hàng loạt &rarr; Nhập email hoặc tài khoản người nhận.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'supportChannels',
      category: 'Hỗ trợ & Lỗi',
      title: 'Kênh liên hệ hỗ trợ kỹ thuật 24/7',
      icon: MessageCircle,
      badge: 'Liên hệ',
      badgeColor: '#0284C7',
      badgeBg: '#E0F2FE',
      summary: 'Các kênh Telegram, Discord và Email trực tiếp từ đội ngũ kỹ thuật.',
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 6px 0' }}>
            Nếu bạn gặp khó khăn trong quá trình cài đặt hoặc vận hành, vui lòng liên hệ trực tiếp với chúng tôi:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Telegram */}
            <div
              onClick={() => window.open('https://t.me/antidetect_support', '_blank')}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.backgroundColor = '#F0F9FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Telegram Support <ExternalLink size={11} style={{ color: '#94A3B8' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Phản hồi trong vòng 5 phút</div>
              </div>
            </div>

            {/* Discord */}
            <div
              onClick={() => window.open('https://discord.gg', '_blank')}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.backgroundColor = '#EEF2FF'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
            >
              <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Cộng đồng Discord <ExternalLink size={11} style={{ color: '#94A3B8' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>10,000+ thành viên MMO</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Filter topics by search
  const filteredTopics = DOC_TOPICS.filter(t =>
    !searchQuery.trim() ||
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentTopic = DOC_TOPICS.find(t => t.id === selectedTopic) || DOC_TOPICS[0];

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
      {/* ── MODAL CONTAINER (Dedicated to Documentation & User Guide) ── */}
      <div
        style={{
          width: '980px',
          maxWidth: '96vw',
          height: '640px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. HEADER (Title, Search & Close) ── */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0F172A' }}>
                Tài liệu & Hướng dẫn sử dụng
              </h2>
              <p style={{ fontSize: '12px', margin: '2px 0 0 0', color: '#64748B' }}>
                Cẩm nang tính năng, cấu hình Proxy, Fingerprint và giải đáp thắc mắc
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              padding: '0 10px',
              height: '32px',
              width: '240px'
            }}>
              <Search size={13} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Tìm kiếm tài liệu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#334155'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              title="Đóng (Esc)"
              style={{
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
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── 2. TWO-COLUMN DOCS BODY (Left Topics Nav | Right Reading Pane) ── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          {/* Left Column: Topics Navigation */}
          <div style={{
            width: '280px',
            borderRight: '1px solid #F1F5F9',
            backgroundColor: '#F8FAFC',
            overflowY: 'auto',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '4px 10px 6px 10px'
            }}>
              Danh mục hướng dẫn ({filteredTopics.length})
            </div>

            {filteredTopics.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              const IconComp = topic.icon;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '9px 10px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    border: isSelected ? '1px solid #E2E8F0' : '1px solid transparent',
                    boxShadow: isSelected ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    backgroundColor: topic.badgeBg,
                    color: topic.badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '1px'
                  }}>
                    <IconComp size={15} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '12.5px',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#7C3AED' : '#1E293B',
                      lineHeight: '1.3'
                    }}>
                      {topic.title}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#64748B',
                      marginTop: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {topic.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Reading Article */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '28px 36px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Article Header */}
            <div style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: currentTopic.badgeColor,
                  backgroundColor: currentTopic.badgeBg,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {currentTopic.badge}
                </span>
                <span style={{ fontSize: '11.5px', color: '#94A3B8' }}>•</span>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  {currentTopic.category}
                </span>
              </div>

              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                {currentTopic.title}
              </h1>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: '1.5' }}>
                {currentTopic.summary}
              </p>
            </div>

            {/* Article Dynamic Content */}
            <div style={{ flex: 1 }}>
              {currentTopic.content}
            </div>
          </div>
        </div>

        {/* ── 3. FOOTER ── */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #F1F5F9',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Tài liệu hướng dẫn Antidetect Browser • Cập nhật định kỳ 2026
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: '12.5px',
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
