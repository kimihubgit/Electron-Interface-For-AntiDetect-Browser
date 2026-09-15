export const INITIAL_MEMBERS = [
  {
    id: 'mem_1',
    name: 'Tôi (Thành viên)',
    email: 'user@antidetect.io',
    role: 'owner',
    avatarColor: '#7C3AED',
    assignedGroups: ['Tất cả nhóm'],
    permissions: {
      canLaunchProfiles: true,
      canCreateProfiles: true,
      canDeleteProfiles: true,
      canExportCookies: true,
      canManageProxies: true,
      canViewProxyPassword: true,
      canManageMembers: true
    },
    status: 'active',
    lastActive: 'Vừa xong',
    isSelf: true
  },
  {
    id: 'mem_2',
    name: 'Nguyễn Văn Hùng',
    email: 'hung.nguyen@adsagency.vn',
    role: 'admin',
    avatarColor: '#2563EB',
    assignedGroups: ['Facebook Ads', 'TikTok Ads'],
    permissions: {
      canLaunchProfiles: true,
      canCreateProfiles: true,
      canDeleteProfiles: true,
      canExportCookies: true,
      canManageProxies: true,
      canViewProxyPassword: true,
      canManageMembers: false
    },
    status: 'active',
    lastActive: '15 phút trước',
    isSelf: false
  },
  {
    id: 'mem_3',
    name: 'Trần Thị Mai',
    email: 'mai.tran@ecommerce.com',
    role: 'operator',
    avatarColor: '#059669',
    assignedGroups: ['E-Commerce'],
    permissions: {
      canLaunchProfiles: true,
      canCreateProfiles: true,
      canDeleteProfiles: false,
      canExportCookies: false,
      canManageProxies: false,
      canViewProxyPassword: false,
      canManageMembers: false
    },
    status: 'active',
    lastActive: '1 giờ trước',
    isSelf: false
  },
  {
    id: 'mem_4',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@growthlab.io',
    role: 'viewer',
    avatarColor: '#D97706',
    assignedGroups: ['Crypto'],
    permissions: {
      canLaunchProfiles: true,
      canCreateProfiles: false,
      canDeleteProfiles: false,
      canExportCookies: false,
      canManageProxies: false,
      canViewProxyPassword: false,
      canManageMembers: false
    },
    status: 'active',
    lastActive: 'Hôm qua',
    isSelf: false
  }
];

export const PERMISSION_DEFINITIONS = [
  { key: 'canLaunchProfiles', label: 'Khởi chạy hồ sơ trình duyệt', category: 'Profiles' },
  { key: 'canCreateProfiles', label: 'Tạo và chỉnh sửa hồ sơ mới', category: 'Profiles' },
  { key: 'canDeleteProfiles', label: 'Xóa hồ sơ vào thùng rác', category: 'Profiles' },
  { key: 'canExportCookies', label: 'Xuất (Export) Cookies & Bookmark', category: 'Bảo mật' },
  { key: 'canManageProxies', label: 'Gán & Đổi Proxy cho hồ sơ', category: 'Proxy' },
  { key: 'canViewProxyPassword', label: 'Xem mật khẩu Proxy dạng văn bản', category: 'Bảo mật' },
  { key: 'canManageMembers', label: 'Mời & Phân quyền thành viên nhóm', category: 'Hệ thống' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'log_1', user: 'Nguyễn Văn Hùng', action: 'Khởi chạy hồ sơ #102 (Facebook BM 250)', target: 'Facebook Ads', time: '11:20:45 Hôm nay', ip: '14.238.10.12' },
  { id: 'log_2', user: 'Tôi', action: 'Cập nhật phân quyền cho thành viên Trần Thị Mai', target: 'Phân quyền', time: '10:05:12 Hôm nay', ip: '118.69.182.44' },
  { id: 'log_3', user: 'Trần Thị Mai', action: 'Đồng bộ 12 cookies hồ sơ Shopee sang đám mây', target: 'E-Commerce', time: '09:40:18 Hôm nay', ip: '27.72.61.90' },
  { id: 'log_4', user: 'Lê Hoàng Nam', action: 'Đăng nhập vào hệ thống ứng dụng từ máy tính mới', target: 'Bảo mật', time: 'Hôm qua, 16:30', ip: '113.190.23.8' }
];

export const AVAILABLE_GROUPS = ['Tất cả nhóm', 'Facebook Ads', 'TikTok Ads', 'E-Commerce', 'Crypto', 'Google Ads'];

export const ROLE_CONFIG = {
  owner: { label: 'Chủ sở hữu', bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  admin: { label: 'Quản trị viên', bg: '#EDE9FE', text: '#7C3AED', border: '#DDD6FE' },
  manager: { label: 'Quản lý nhóm', bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  operator: { label: 'Nhân viên chạy', bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  viewer: { label: 'Chỉ xem', bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' }
};
