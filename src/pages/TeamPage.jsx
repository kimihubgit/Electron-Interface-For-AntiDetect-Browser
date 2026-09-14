import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Crown,
  ShieldCheck,
  UserCheck,
  Zap,
  Eye,
  Check,
  Copy,
  Trash2,
  Edit3,
  X,
  Mail,
  Search,
  Filter,
  Shield,
  Clock,
  Layers,
  FileText,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  Sliders,
  MoreVertical,
  KeyRound,
  DownloadCloud
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';
import { useTranslation } from '../i18n/I18nContext';

// Danh sách thành viên mẫu mặc định
const INITIAL_MEMBERS = [
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

// Danh sách quyền hạn chuẩn trong hệ thống Antidetect RBAC
const PERMISSION_DEFINITIONS = [
  { key: 'canLaunchProfiles', label: 'Khởi chạy hồ sơ trình duyệt', category: 'Profiles' },
  { key: 'canCreateProfiles', label: 'Tạo và chỉnh sửa hồ sơ mới', category: 'Profiles' },
  { key: 'canDeleteProfiles', label: 'Xóa hồ sơ vào thùng rác', category: 'Profiles' },
  { key: 'canExportCookies', label: 'Xuất (Export) Cookies & Bookmark', category: 'Bảo mật' },
  { key: 'canManageProxies', label: 'Gán & Đổi Proxy cho hồ sơ', category: 'Proxy' },
  { key: 'canViewProxyPassword', label: 'Xem mật khẩu Proxy dạng văn bản', category: 'Bảo mật' },
  { key: 'canManageMembers', label: 'Mời & Phân quyền thành viên nhóm', category: 'Hệ thống' }
];

// Nhật ký kiểm toán mẫu
const INITIAL_AUDIT_LOGS = [
  { id: 'log_1', user: 'Nguyễn Văn Hùng', action: 'Khởi chạy hồ sơ #102 (Facebook BM 250)', target: 'Facebook Ads', time: '11:20:45 Hôm nay', ip: '14.238.10.12' },
  { id: 'log_2', user: 'Tôi', action: 'Cập nhật phân quyền cho thành viên Trần Thị Mai', target: 'Phân quyền', time: '10:05:12 Hôm nay', ip: '118.69.182.44' },
  { id: 'log_3', user: 'Trần Thị Mai', action: 'Đồng bộ 12 cookies hồ sơ Shopee sang đám mây', target: 'E-Commerce', time: '09:40:18 Hôm nay', ip: '27.72.61.90' },
  { id: 'log_4', user: 'Lê Hoàng Nam', action: 'Đăng nhập vào hệ thống ứng dụng từ máy tính mới', target: 'Bảo mật', time: 'Hôm qua, 16:30', ip: '113.190.23.8' }
];

export default function TeamPage() {
  const { t } = useTranslation();
  const { showToast, setActiveUpgradeModal, currentPlan = 'Pro' } = useBrowser();

  // ── SUB-TAB NAVIGATION (Matching Proxies & Profiles Pages) ──
  // 'members' | 'roles' | 'groups' | 'audit'
  const [activeSubTab, setActiveSubTab] = useState('members');

  // Danh sách thành viên lưu trong localStorage
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_enterprise_members');
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  // Hạn mức thành viên theo gói
  const maxMembersQuota = 5; // Gói Pro hiện tại

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selection states
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form Invite/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'operator',
    assignedGroups: ['Facebook Ads'],
    permissions: {
      canLaunchProfiles: true,
      canCreateProfiles: true,
      canDeleteProfiles: false,
      canExportCookies: false,
      canManageProxies: false,
      canViewProxyPassword: false,
      canManageMembers: false
    }
  });

  const availableGroups = ['Tất cả nhóm', 'Facebook Ads', 'TikTok Ads', 'E-Commerce', 'Crypto', 'Google Ads'];

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('antidetect_enterprise_members', JSON.stringify(members));
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (roleFilter !== 'ALL' && m.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const nameMatch = m.name.toLowerCase().includes(q);
        const emailMatch = m.email.toLowerCase().includes(q);
        const groupMatch = m.assignedGroups.some(g => g.toLowerCase().includes(q));
        return nameMatch || emailMatch || groupMatch;
      }
      return true;
    });
  }, [members, roleFilter, statusFilter, searchTerm]);

  // Checkbox handlers
  const isAllSelected = filteredMembers.length > 0 && selectedMemberIds.length === filteredMembers.length;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMemberIds(filteredMembers.map(m => m.id));
    } else {
      setSelectedMemberIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedMemberIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Toggle status (Active / Suspended)
  const handleToggleStatus = (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    if (member.isSelf) {
      showToast?.('Không thể khóa tài khoản chính của bạn!', 'error');
      return;
    }
    const newStatus = member.status === 'active' ? 'suspended' : 'active';
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    showToast?.(
      newStatus === 'active'
        ? `Đã kích hoạt lại tài khoản: ${member.name}`
        : `Đã tạm khóa tài khoản: ${member.name}`,
      'info'
    );
  };

  // Delete Member
  const handleConfirmDelete = () => {
    if (!deleteConfirmMember) return;
    setMembers(prev => prev.filter(m => m.id !== deleteConfirmMember.id));
    setSelectedMemberIds(prev => prev.filter(id => id !== deleteConfirmMember.id));
    showToast?.(`Đã xóa thành viên "${deleteConfirmMember.name}" khỏi nhóm`, 'success');
    setDeleteConfirmMember(null);
  };

  // Copy link invite
  const handleCopyInviteLink = () => {
    const inviteUrl = 'https://nexus.antidetect.com/join/team-invite?token=nexus_org_9921b';
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    showToast?.('Đã sao chép đường link mời tham gia nhóm!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Open Add Modal
  const handleOpenInviteModal = () => {
    if (members.length >= maxMembersQuota) {
      showToast?.(`Bạn đã dùng hết hạn mức ${maxMembersQuota} thành viên. Vui lòng nâng cấp gói!`, 'warn');
      if (setActiveUpgradeModal) setActiveUpgradeModal(true);
      return;
    }
    setFormData({
      name: '',
      email: '',
      role: 'operator',
      assignedGroups: ['Facebook Ads'],
      permissions: {
        canLaunchProfiles: true,
        canCreateProfiles: true,
        canDeleteProfiles: false,
        canExportCookies: false,
        canManageProxies: false,
        canViewProxyPassword: false,
        canManageMembers: false
      }
    });
    setEditingMember(null);
    setShowInviteModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      assignedGroups: member.assignedGroups || [],
      permissions: { ...member.permissions }
    });
    setShowInviteModal(true);
  };

  // Save Member (Create / Update)
  const handleSaveMember = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast?.('Vui lòng nhập đầy đủ tên và email thành viên!', 'error');
      return;
    }

    if (editingMember) {
      // Update
      setMembers(prev => prev.map(m => m.id === editingMember.id ? {
        ...m,
        name: formData.name.trim(),
        role: formData.role,
        assignedGroups: formData.assignedGroups,
        permissions: formData.permissions
      } : m));
      showToast?.(`Cập nhật thông tin "${formData.name}" thành công!`, 'success');
    } else {
      // Create new
      const colors = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#DB2777', '#0891B2'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newMember = {
        id: `mem_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
        avatarColor: randomColor,
        assignedGroups: formData.assignedGroups.length > 0 ? formData.assignedGroups : ['Tất cả nhóm'],
        permissions: formData.permissions,
        status: 'active',
        lastActive: 'Mới được mời',
        isSelf: false
      };
      setMembers(prev => [newMember, ...prev]);
      showToast?.(`Đã gửi lời mời thành viên đến ${newMember.email}`, 'success');
    }

    setShowInviteModal(false);
  };

  // Render Role Badge
  const renderRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: 700,
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            border: '1px solid #FDE68A'
          }}>
            <Crown size={12} color="#D97706" />
            Chủ sở hữu
          </span>
        );
      case 'admin':
      case 'member':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: 600,
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            border: '1px solid #DDD6FE'
          }}>
            <ShieldCheck size={12} color="#7C3AED" />
            Thành viên
          </span>
        );
      case 'manager':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: 600,
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE'
          }}>
            <UserCheck size={12} color="#2563EB" />
            Quản lý nhóm
          </span>
        );
      case 'operator':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: 600,
            backgroundColor: '#ECFDF5',
            color: '#047857',
            border: '1px solid #A7F3D0'
          }}>
            <Zap size={12} color="#059669" />
            Nhân viên chạy
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11.5px',
            fontWeight: 500,
            backgroundColor: '#F1F5F9',
            color: '#475569',
            border: '1px solid #E2E8F0'
          }}>
            <Eye size={12} color="#64748B" />
            Chỉ xem
          </span>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundColor: '#FFFFFF',
        color: '#1E293B',
        fontFamily: 'inherit',
        userSelect: 'none',
        overflow: 'hidden'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. TOP INTEGRATED HEADER & SUB-TABS (Matches Proxies / Profiles)
         ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          minHeight: '48px',
          flexShrink: 0,
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Left Side: Module Title + Sub-Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#EDE9FE',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Users size={16} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>
              Thành viên & Phân quyền
            </span>
          </div>

          <span style={{ color: '#E2E8F0', height: '16px', width: '1px', backgroundColor: '#CBD5E1' }} />

          {/* Sub-Tabs Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => setActiveSubTab('members')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'members' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'members' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'members' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Users size={13} />
              <span>Danh sách thành viên ({members.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('roles')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'roles' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'roles' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'roles' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <KeyRound size={13} />
              <span>Ma trận phân quyền (RBAC)</span>
            </button>

            <button
              onClick={() => setActiveSubTab('groups')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'groups' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'groups' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'groups' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={13} />
              <span>Phân chia nhóm hồ sơ</span>
            </button>

            <button
              onClick={() => setActiveSubTab('audit')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeSubTab === 'audit' ? '#F1F5F9' : 'transparent',
                color: activeSubTab === 'audit' ? '#7C3AED' : '#64748B',
                fontSize: '12px',
                fontWeight: activeSubTab === 'audit' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Clock size={13} />
              <span>Nhật ký hoạt động (Audit)</span>
            </button>
          </div>
        </div>

        {/* Right Side: Quota Badge & Main Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Quota indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
              color: '#475569'
            }}
          >
            <span>Hạn mức:</span>
            <strong style={{ color: members.length >= maxMembersQuota ? '#DC2626' : '#7C3AED' }}>
              {members.length}/{maxMembersQuota}
            </strong>
            <span style={{ fontSize: '11px', color: '#94A3B8' }}>({currentPlan})</span>
          </div>

          {/* Copy invite link button */}
          <button
            onClick={handleCopyInviteLink}
            title="Sao chép đường dẫn mời thành viên"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 11px',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            {copiedLink ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
            <span>{copiedLink ? 'Đã sao chép' : 'Link mời nhanh'}</span>
          </button>

          {/* + Mời thành viên */}
          <button
            onClick={handleOpenInviteModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(124, 58, 237, 0.25)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
          >
            <UserPlus size={14} />
            <span>Mời thành viên</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. SUB-TAB 1: MEMBERS LIST (MAIN TABLE VIEW)
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'members' && (
        <>
          {/* Filters Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            {/* Left: Search input + Role filter + Status filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Search Box */}
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, nhóm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    height: '30px',
                    padding: '0 28px 0 30px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={{
                  height: '30px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  color: '#334155',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="owner">Chủ sở hữu (Owner)</option>
                <option value="admin">Thành viên (Member)</option>
                <option value="manager">Quản lý nhóm (Manager)</option>
                <option value="operator">Nhân viên chạy (Operator)</option>
                <option value="viewer">Chỉ xem (Viewer)</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  height: '30px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  color: '#334155',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="suspended">Đã tạm khóa</option>
              </select>
            </div>

            {/* Right: Showing count */}
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Hiển thị <strong>{filteredMembers.length}</strong> / {members.length} thành viên
            </span>
          </div>

          {/* Members Table */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto', backgroundColor: '#FFFFFF' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                  <th style={{ width: '38px', padding: '9px 12px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                    Thành viên
                  </th>
                  <th style={{ width: '150px', padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                    Vai trò
                  </th>
                  <th style={{ padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                    Nhóm hồ sơ được gán
                  </th>
                  <th style={{ width: '140px', padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                    Trạng thái
                  </th>
                  <th style={{ width: '130px', padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                    Hoạt động cuối
                  </th>
                  <th style={{ width: '100px', padding: '9px 12px', fontSize: '11px', fontWeight: 600, color: '#475569', textAlign: 'center', textTransform: 'uppercase' }}>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
                      <Users size={36} style={{ margin: '0 auto 8px auto', color: '#CBD5E1', display: 'block' }} />
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>Không tìm thấy thành viên nào</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>Thử đổi bộ lọc tìm kiếm hoặc mời thành viên mới.</div>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member) => {
                    const isSelected = selectedMemberIds.includes(member.id);
                    return (
                      <tr
                        key={member.id}
                        style={{
                          borderBottom: '1px solid #F1F5F9',
                          backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                          transition: 'background-color 0.1s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#FAFAFA';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(member.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>

                        {/* Member Name + Avatar + Email */}
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: member.avatarColor || '#7C3AED',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: 700,
                                flexShrink: 0
                              }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                                  {member.name}
                                </span>
                                {member.isSelf && (
                                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 5px', borderRadius: '4px', backgroundColor: '#EDE9FE', color: '#6D28D9' }}>
                                    Tôi
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                                {member.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td style={{ padding: '10px 12px' }}>
                          {renderRoleBadge(member.role)}
                        </td>

                        {/* Assigned Groups */}
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {member.assignedGroups && member.assignedGroups.length > 0 ? (
                              member.assignedGroups.map((grp, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: '11px',
                                    padding: '2px 7px',
                                    borderRadius: '4px',
                                    backgroundColor: grp === 'Tất cả nhóm' ? '#EFF6FF' : '#F1F5F9',
                                    color: grp === 'Tất cả nhóm' ? '#1D4ED8' : '#334155',
                                    fontWeight: grp === 'Tất cả nhóm' ? 600 : 500,
                                    border: '1px solid #E2E8F0'
                                  }}
                                >
                                  {grp}
                                </span>
                              ))
                            ) : (
                              <span style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>Chưa gán nhóm</span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '10px 12px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '11.5px',
                              fontWeight: 500,
                              color: member.status === 'active' ? '#15803D' : '#B91C1C'
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: member.status === 'active' ? '#16A34A' : '#EF4444'
                              }}
                            />
                            {member.status === 'active' ? 'Đang hoạt động' : 'Đã tạm khóa'}
                          </span>
                        </td>

                        {/* Last Active */}
                        <td style={{ padding: '10px 12px', fontSize: '12px', color: '#64748B' }}>
                          {member.lastActive}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            {/* Edit Role Button */}
                            <button
                              onClick={() => handleOpenEditModal(member)}
                              title="Chỉnh sửa vai trò & phân quyền"
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '5px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#FFFFFF',
                                color: '#475569',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                            >
                              <Edit3 size={13} />
                            </button>

                            {/* Lock / Unlock Button */}
                            {!member.isSelf && (
                              <button
                                onClick={() => handleToggleStatus(member.id)}
                                title={member.status === 'active' ? 'Tạm khóa tài khoản' : 'Mở khóa tài khoản'}
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '5px',
                                  border: '1px solid #E2E8F0',
                                  backgroundColor: '#FFFFFF',
                                  color: member.status === 'active' ? '#D97706' : '#16A34A',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F1F5F9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                              >
                                {member.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
                              </button>
                            )}

                            {/* Delete Button */}
                            {!member.isSelf && (
                              <button
                                onClick={() => setDeleteConfirmMember(member)}
                                title="Xóa thành viên khỏi nhóm"
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '5px',
                                  border: '1px solid #FEE2E2',
                                  backgroundColor: '#FFFFFF',
                                  color: '#DC2626',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── FLOATING DARK BATCH BAR (Matches Profiles & Proxies) ── */}
          {selectedMemberIds.length > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100,
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '10px',
                padding: '8px 16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7C3AED' }} />
                <span>Đã chọn <strong>{selectedMemberIds.length}</strong> thành viên</span>
              </div>

              <div style={{ height: '14px', width: '1px', backgroundColor: '#334155' }} />

              {/* Action: Lock selected */}
              <button
                onClick={() => {
                  setMembers(prev => prev.map(m => selectedMemberIds.includes(m.id) && !m.isSelf ? { ...m, status: 'suspended' } : m));
                  showToast?.(`Đã tạm khóa ${selectedMemberIds.length} thành viên`, 'info');
                  setSelectedMemberIds([]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#FDE68A',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Lock size={13} />
                <span>Khóa tài khoản</span>
              </button>

              {/* Action: Delete selected */}
              <button
                onClick={() => {
                  if (window.confirm(`Xóa ${selectedMemberIds.length} thành viên đã chọn?`)) {
                    setMembers(prev => prev.filter(m => !selectedMemberIds.includes(m.id) || m.isSelf));
                    showToast?.(`Đã xóa ${selectedMemberIds.length} thành viên khỏi nhóm`, 'success');
                    setSelectedMemberIds([]);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#FCA5A5',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={13} />
                <span>Xóa đã chọn</span>
              </button>

              {/* Clear selection */}
              <button
                onClick={() => setSelectedMemberIds([])}
                style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: '#334155',
                  border: 'none',
                  color: '#CBD5E1',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Bỏ chọn
              </button>
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. SUB-TAB 2: ROLES & RBAC PERMISSION MATRIX
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'roles' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                Ma trận phân quyền vai trò (Role-Based Access Control)
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                Quy định các hành vi được phép thực hiện đối với hồ sơ, proxy và dữ liệu nhạy cảm của từng vị trí trong nhóm.
              </p>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569', width: '300px' }}>
                      Quyền hạn / Chức năng
                    </th>
                    <th style={{ padding: '12px 14px', fontWeight: 600, color: '#D97706', textAlign: 'center' }}>
                      Chủ sở hữu
                    </th>
                    <th style={{ padding: '12px 14px', fontWeight: 600, color: '#7C3AED', textAlign: 'center' }}>
                      Quản trị viên
                    </th>
                    <th style={{ padding: '12px 14px', fontWeight: 600, color: '#2563EB', textAlign: 'center' }}>
                      Quản lý nhóm
                    </th>
                    <th style={{ padding: '12px 14px', fontWeight: 600, color: '#059669', textAlign: 'center' }}>
                      Nhân viên chạy
                    </th>
                    <th style={{ padding: '12px 14px', fontWeight: 600, color: '#64748B', textAlign: 'center' }}>
                      Chỉ xem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_DEFINITIONS.map((perm, idx) => (
                    <tr key={perm.key} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                      <td style={{ padding: '10px 16px', color: '#1E293B', fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10.5px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                            {perm.category}
                          </span>
                          <span>{perm.label}</span>
                        </div>
                      </td>

                      {/* Owner: Full Access */}
                      <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                        <CheckCircle2 size={16} color="#16A34A" style={{ margin: '0 auto' }} />
                      </td>

                      {/* Admin */}
                      <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                        {perm.key === 'canManageMembers' ? (
                          <span style={{ color: '#CBD5E1' }}>—</span>
                        ) : (
                          <CheckCircle2 size={16} color="#16A34A" style={{ margin: '0 auto' }} />
                        )}
                      </td>

                      {/* Manager */}
                      <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                        {['canLaunchProfiles', 'canCreateProfiles', 'canManageProxies'].includes(perm.key) ? (
                          <CheckCircle2 size={16} color="#16A34A" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#CBD5E1' }}>—</span>
                        )}
                      </td>

                      {/* Operator */}
                      <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                        {['canLaunchProfiles', 'canCreateProfiles'].includes(perm.key) ? (
                          <CheckCircle2 size={16} color="#16A34A" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#CBD5E1' }}>—</span>
                        )}
                      </td>

                      {/* Viewer */}
                      <td style={{ textAlign: 'center', padding: '10px 14px' }}>
                        {perm.key === 'canLaunchProfiles' ? (
                          <CheckCircle2 size={16} color="#16A34A" style={{ margin: '0 auto' }} />
                        ) : (
                          <span style={{ color: '#CBD5E1' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. SUB-TAB 3: GROUP ACCESS SHARING
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'groups' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                Phân quyền truy cập theo từng Nhóm hồ sơ
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                Cách ly an toàn: Nhân viên chỉ nhìn thấy và chạy các profile thuộc nhóm được chỉ định.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minWidth(300px, 1fr))', gap: '16px' }}>
              {availableGroups.filter(g => g !== 'Tất cả nhóm').map((grpName) => {
                const assignedMembers = members.filter(m => m.assignedGroups.includes(grpName) || m.assignedGroups.includes('Tất cả nhóm'));
                return (
                  <div
                    key={grpName}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={14} />
                        </div>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{grpName}</span>
                      </div>
                      <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '12px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
                        {assignedMembers.length} người
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                      {assignedMembers.map(m => (
                        <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: m.avatarColor, color: '#FFF', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                              {m.name.charAt(0)}
                            </div>
                            <span style={{ color: '#1E293B', fontWeight: 500 }}>{m.name}</span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. SUB-TAB 4: AUDIT LOGS TIMELINE
         ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'audit' && (
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <div style={{ marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                Nhật ký kiểm toán & Giám sát hoạt động
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                Ghi nhận chi tiết mọi thao tác nhạy cảm của các thành viên trong tổ chức.
              </p>
            </div>

            <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
              {INITIAL_AUDIT_LOGS.map((log, idx) => (
                <div
                  key={log.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: idx < INITIAL_AUDIT_LOGS.length - 1 ? '1px solid #F1F5F9' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Clock size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                        {log.user}{' '}
                        <span style={{ fontWeight: 400, color: '#475569' }}>— {log.action}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '11px', color: '#94A3B8' }}>
                        <span>Khu vực: <strong>{log.target}</strong></span>
                        <span>•</span>
                        <span>IP: {log.ip}</span>
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 500 }}>
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. MODAL: MỜI & CHỈNH SỬA THÀNH VIÊN
         ───────────────────────────────────────────────────────────── */}
      {showInviteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowInviteModal(false);
          }}
        >
          <div
            style={{
              width: '460px',
              maxWidth: '92vw',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '6px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={16} />
                </div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  {editingMember ? 'Chỉnh sửa phân quyền thành viên' : 'Mời thành viên mới vào nhóm'}
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveMember} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Họ và tên <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Hoàng Văn Nam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Địa chỉ Email <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="name@agency.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={Boolean(editingMember)}
                  required
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: editingMember ? '#F8FAFC' : '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Role */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                  Vai trò (Role)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  disabled={editingMember?.isSelf}
                  style={{
                    width: '100%',
                    height: '34px',
                    padding: '0 10px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    color: '#0F172A',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="admin">Thành viên (Member) — Toàn quyền thao tác</option>
                  <option value="manager">Quản lý nhóm (Manager) — Quản lý hồ sơ & Proxy được gán</option>
                  <option value="operator">Nhân viên chạy (Operator) — Mở và sử dụng hồ sơ</option>
                  <option value="viewer">Chỉ xem (Viewer) — Chỉ xem danh sách hồ sơ</option>
                </select>
              </div>

              {/* Assigned Groups Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Cho phép truy cập nhóm hồ sơ:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {availableGroups.map((grp) => {
                    const isChecked = formData.assignedGroups.includes(grp);
                    return (
                      <label
                        key={grp}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '4px 9px',
                          borderRadius: '6px',
                          border: isChecked ? '1px solid #7C3AED' : '1px solid #E2E8F0',
                          backgroundColor: isChecked ? '#EDE9FE' : '#F8FAFC',
                          color: isChecked ? '#6D28D9' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (grp === 'Tất cả nhóm') {
                              setFormData({
                                ...formData,
                                assignedGroups: e.target.checked ? ['Tất cả nhóm'] : []
                              });
                            } else {
                              const withoutAll = formData.assignedGroups.filter(x => x !== 'Tất cả nhóm');
                              const updated = e.target.checked ? [...withoutAll, grp] : withoutAll.filter(x => x !== grp);
                              setFormData({ ...formData, assignedGroups: updated });
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        {isChecked && <Check size={12} color="#7C3AED" />}
                        <span>{grp}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Specific Permissions */}
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
                  Cài đặt bảo mật nhạy cảm:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.permissions?.canExportCookies)}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canExportCookies: e.target.checked }
                      })}
                    />
                    <span>Cho phép xuất (Export) Cookies tài khoản</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.permissions?.canViewProxyPassword)}
                      onChange={(e) => setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, canViewProxyPassword: e.target.checked }
                      })}
                    />
                    <span>Cho phép xem mật khẩu Proxy thô</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '6px',
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
                  style={{
                    padding: '7px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingMember ? 'Lưu thay đổi' : 'Gửi lời mời'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. CONFIRM DELETE MODAL
         ───────────────────────────────────────────────────────────── */}
      {deleteConfirmMember && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(3px)'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmMember(null);
          }}
        >
          <div
            style={{
              width: '360px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 20px 30px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={18} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#0F172A', fontWeight: 700 }}>Xóa thành viên</h4>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Thao tác này không thể hoàn tác</span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.45' }}>
              Bạn có chắc chắn muốn xóa thành viên <strong>{deleteConfirmMember.name}</strong> ({deleteConfirmMember.email}) khỏi tổ chức?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => setDeleteConfirmMember(null)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
