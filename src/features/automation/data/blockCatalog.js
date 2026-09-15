import {
  Play,
  Square,
  Clock,
  Download,
  Globe,
  Folder,
  Clipboard,
  Edit3,
  Terminal,
  Trash2,
  Image as ImageIcon,
  Tag,
  Code,
  Bot,
  Shield,
  MousePointer,
  Type,
  Zap
} from 'lucide-react';

// Comprehensive block templates catalog
export const BLOCK_CATALOG = [
  // 1. General Blocks
  {
    id: 'start',
    type: 'start',
    category: 'General',
    title: 'Bắt Đầu',
    badge: 'TRIGGER',
    badgeColor: '#10B981',
    icon: Play,
    color: '#10B981',
    desc: 'Khối bắt đầu khởi chạy quy trình tự động',
    defaultData: {
      concurrency: 4,
      targetDesc: 'Tất cả 12 hồ sơ TikTok Shop'
    }
  },
  {
    id: 'end',
    type: 'end',
    category: 'General',
    title: 'Kết Thúc',
    badge: 'FINISH',
    badgeColor: '#EF4444',
    icon: Square,
    color: '#EF4444',
    desc: 'Dừng quy trình, lưu Cookie và đóng tab an toàn',
    defaultData: {
      closeTab: true,
      syncCookies: true
    }
  },
  {
    id: 'delay',
    type: 'delay',
    category: 'General',
    title: 'Tạm Dừng',
    badge: 'DELAY',
    badgeColor: '#F59E0B',
    icon: Clock,
    color: '#F59E0B',
    desc: 'Tạm dừng luồng trong khoảng thời gian ngẫu nhiên',
    defaultData: {
      seconds: 3,
      randomRange: '2s - 5s'
    }
  },
  {
    id: 'export_data',
    type: 'export_data',
    category: 'General',
    title: 'Xuất Dữ Liệu',
    badge: 'EXPORT',
    badgeColor: '#3B82F6',
    icon: Download,
    color: '#3B82F6',
    desc: 'Lưu dữ liệu kết quả ra file JSON/CSV hoặc API',
    defaultData: {
      format: 'JSON',
      outputFile: 'exports/accounts_data.json'
    }
  },
  {
    id: 'http_request',
    type: 'http_request',
    category: 'General',
    title: 'HTTP Request',
    badge: 'API REST',
    badgeColor: '#06B6D4',
    icon: Globe,
    color: '#06B6D4',
    desc: 'Gửi yêu cầu REST API GET/POST trực tiếp',
    defaultData: {
      method: 'GET',
      url: 'https://api.ipify.org?format=json'
    }
  },
  {
    id: 'group_blocks',
    type: 'group_blocks',
    category: 'General',
    title: 'Nhóm Khối',
    badge: 'GROUP',
    badgeColor: '#8B5CF6',
    icon: Folder,
    color: '#8B5CF6',
    desc: 'Gom các khối lặp lại thành một cụm chức năng',
    defaultData: {
      groupName: 'Cụm Xác Minh Bảo Mật'
    }
  },
  {
    id: 'clipboard',
    type: 'clipboard',
    category: 'General',
    title: 'Bộ Nhớ Tạm',
    badge: 'CLIPBOARD',
    badgeColor: '#6366F1',
    icon: Clipboard,
    color: '#6366F1',
    desc: 'Lưu hoặc đọc dữ liệu từ clipboard hệ thống',
    defaultData: {
      action: 'read',
      variable: 'auth_token'
    }
  },
  {
    id: 'wait_connection',
    type: 'wait_connection',
    category: 'General',
    title: 'Chờ Kết Nối',
    badge: 'NETWORK',
    badgeColor: '#EC4899',
    icon: Clock,
    color: '#EC4899',
    desc: 'Chờ proxy hoặc kết nối mạng sẵn sàng',
    defaultData: {
      maxRetry: 5,
      pingHost: 'google.com'
    }
  },
  {
    id: 'note',
    type: 'note',
    category: 'General',
    title: 'Ghi Chú',
    badge: 'NOTE',
    badgeColor: '#64748B',
    icon: Edit3,
    color: '#64748B',
    desc: 'Ghi chú tài liệu cho kịch bản',
    defaultData: {
      noteText: 'Kiểm tra token phiên trước khi chuyển bước'
    }
  },
  {
    id: 'logger',
    type: 'logger',
    category: 'General',
    title: 'Ghi Log',
    badge: 'CONSOLE',
    badgeColor: '#1E293B',
    icon: Terminal,
    color: '#1E293B',
    desc: 'In thông điệp ra console và lịch sử hệ thống',
    defaultData: {
      logMessage: 'Đang tiến hành đăng ký tài khoản...'
    }
  },
  {
    id: 'ram_cleaner',
    type: 'ram_cleaner',
    category: 'General',
    title: 'Giải Phóng RA...',
    badge: 'OPTIMIZE',
    badgeColor: '#D97706',
    icon: Trash2,
    color: '#D97706',
    desc: 'Dọn dẹp bộ nhớ đệm và RAM trình duyệt',
    defaultData: {
      cleanCache: true,
      cleanHistory: true
    }
  },
  {
    id: 'find_image',
    type: 'find_image',
    category: 'General',
    title: 'Tìm Hình Ảnh',
    badge: 'CV VISION',
    badgeColor: '#14B8A6',
    icon: ImageIcon,
    color: '#14B8A6',
    desc: 'Tìm kiếm nút bấm hoặc hình ảnh trên màn hình',
    defaultData: {
      similarity: 0.85,
      timeoutSec: 10
    }
  },
  {
    id: 'profile_tags',
    type: 'profile_tags',
    category: 'General',
    title: 'Profile Tags',
    badge: 'TAGS',
    badgeColor: '#84CC16',
    icon: Tag,
    color: '#84CC16',
    desc: 'Gán nhãn phân loại trạng thái hồ sơ sau khi chạy',
    defaultData: {
      tag: 'Reg_Thành_Công'
    }
  },
  {
    id: 'finally_execute',
    type: 'finally_execute',
    category: 'General',
    title: 'Finally Execute',
    badge: 'FINALLY',
    badgeColor: '#475569',
    icon: Code,
    color: '#475569',
    desc: 'Khối luôn thực thi bất kể kịch bản thành công hay lỗi',
    defaultData: {
      forceClean: true
    }
  },

  // 2. Browser & AI Agents
  {
    id: 'ai_navigator',
    type: 'ai_navigator',
    category: 'Browser & AI',
    title: 'AI Web Navigator',
    badge: 'AI VISION',
    badgeColor: '#8B5CF6',
    icon: Bot,
    color: '#8B5CF6',
    desc: 'AI thị giác đọc giao diện và tương tác như người thật',
    defaultData: {
      model: 'Gemini 1.5 Pro Vision',
      goal: 'Lướt xem sản phẩm, tìm kiếm từ khóa và lưu vào giỏ hàng',
      maxSteps: 5
    }
  },
  {
    id: 'ai_captcha',
    type: 'ai_captcha',
    category: 'Browser & AI',
    title: 'AI Captcha Solver',
    badge: 'AI SOLVER',
    badgeColor: '#EC4899',
    icon: Shield,
    color: '#EC4899',
    desc: 'Tự động giải Cloudflare Turnstile, hCaptcha, Slide Puzzle',
    defaultData: {
      captchaType: 'Turnstile / Slide Puzzle',
      timeoutSec: 15
    }
  },
  {
    id: 'browser_open',
    type: 'browser_open',
    category: 'Browser & AI',
    title: 'Mở Trang Web',
    badge: 'BROWSER',
    badgeColor: '#3B82F6',
    icon: Globe,
    color: '#3B82F6',
    desc: 'Điều hướng trình duyệt tới đường dẫn mục tiêu',
    defaultData: {
      url: 'https://redbubble.com/signup',
      waitPolicy: 'networkidle'
    }
  },
  {
    id: 'mouse_click',
    type: 'mouse_click',
    category: 'Browser & AI',
    title: 'Click Chuột',
    badge: 'HUMAN CLICK',
    badgeColor: '#F97316',
    icon: MousePointer,
    color: '#F97316',
    desc: 'Mô phỏng click chuột người thật theo tọa độ hoặc selector',
    defaultData: {
      selector: 'button.signup-submit-btn',
      humanSpeed: true
    }
  },
  {
    id: 'human_type',
    type: 'human_type',
    category: 'Browser & AI',
    title: 'Gõ Văn Bản',
    badge: 'HUMAN TYPE',
    badgeColor: '#6366F1',
    icon: Type,
    color: '#6366F1',
    desc: 'Gõ văn bản với độ trễ ngẫu nhiên giữa các phím',
    defaultData: {
      selector: 'input[name="email"]',
      text: 'vkhai2603@gmail.com',
      randomDelay: true
    }
  },
  {
    id: 'condition',
    type: 'condition',
    category: 'Browser & AI',
    title: 'Điều Kiện Rẽ Nhánh',
    badge: 'CONDITION',
    badgeColor: '#10B981',
    icon: Zap,
    color: '#10B981',
    desc: 'Kiểm tra phần tử hoặc biến để chia 2 luồng Đúng/Sai',
    defaultData: {
      condition: 'Có xuất hiện ô Captcha không?',
      selector: '#cf-turnstile-box'
    }
  },
  {
    id: 'js_code',
    type: 'js_code',
    category: 'Browser & AI',
    title: 'Javascript Code',
    badge: 'JS RUNNER',
    badgeColor: '#2563EB',
    icon: Code,
    color: '#2563EB',
    desc: 'Chạy đoạn mã JavaScript tùy biến trực tiếp trong tab',
    defaultData: {
      code: 'console.log("Đang bypass qua token Cloudflare");'
    }
  }
];

export const INITIAL_NODES = [
  {
    id: 'node-start',
    type: 'start',
    title: 'Bắt đầu quy trình',
    badge: 'TRIGGER',
    badgeColor: '#10B981',
    color: '#10B981',
    icon: Play,
    x: 60,
    y: 190,
    status: 'idle',
    data: {
      concurrency: 4,
      targetDesc: 'Tất cả 12 hồ sơ trong nhóm Redbubble'
    }
  },
  {
    id: 'node-open',
    type: 'browser_open',
    title: 'Mở Trang Web',
    badge: 'BROWSER',
    badgeColor: '#3B82F6',
    color: '#3B82F6',
    icon: Globe,
    x: 350,
    y: 190,
    status: 'idle',
    data: {
      url: 'https://redbubble.com/signup',
      waitPolicy: 'networkidle'
    }
  },
  {
    id: 'node-captcha',
    type: 'ai_captcha',
    title: 'AI Captcha Solver',
    badge: 'AI SOLVER',
    badgeColor: '#EC4899',
    color: '#EC4899',
    icon: Shield,
    x: 650,
    y: 190,
    status: 'idle',
    data: {
      captchaType: 'Cloudflare Turnstile',
      timeoutSec: 15
    }
  },
  {
    id: 'node-cond',
    type: 'condition',
    title: 'Kiểm Tra Xác Minh',
    badge: 'CONDITION',
    badgeColor: '#10B981',
    color: '#10B981',
    icon: Zap,
    x: 950,
    y: 170,
    status: 'idle',
    data: {
      condition: 'Có xuất hiện ô mã OTP Email?',
      selector: '#otp-input'
    }
  },
  {
    id: 'node-type',
    type: 'human_type',
    title: 'Gõ Phím Người Thật',
    badge: 'HUMAN TYPE',
    badgeColor: '#6366F1',
    color: '#6366F1',
    icon: Type,
    x: 1260,
    y: 100,
    status: 'idle',
    data: {
      selector: 'input[name="password"]',
      text: '••••••••••••'
    }
  },
  {
    id: 'node-js',
    type: 'js_code',
    title: 'Javascript Code',
    badge: 'JS RUNNER',
    badgeColor: '#2563EB',
    color: '#2563EB',
    icon: Code,
    x: 1260,
    y: 310,
    status: 'idle',
    data: {
      code: 'window.fetchMailOtp();'
    }
  },
  {
    id: 'node-end',
    type: 'end',
    title: 'Lưu Cookie & Hoàn Tất',
    badge: 'FINISH',
    badgeColor: '#EF4444',
    color: '#EF4444',
    icon: Square,
    x: 1570,
    y: 200,
    status: 'idle',
    data: {
      closeTab: true,
      syncCookies: true
    }
  }
];

export const INITIAL_EDGES = [
  { id: 'e1', from: 'node-start', to: 'node-open', fromPort: 'default' },
  { id: 'e2', from: 'node-open', to: 'node-captcha', fromPort: 'default' },
  { id: 'e3', from: 'node-captcha', to: 'node-cond', fromPort: 'default' },
  { id: 'e4', from: 'node-cond', to: 'node-type', fromPort: 'true' },
  { id: 'e5', from: 'node-cond', to: 'node-js', fromPort: 'false' },
  { id: 'e6', from: 'node-type', to: 'node-end', fromPort: 'default' },
  { id: 'e7', from: 'node-js', to: 'node-end', fromPort: 'default' }
];
