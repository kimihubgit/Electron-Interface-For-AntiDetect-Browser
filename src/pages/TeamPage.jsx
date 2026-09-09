import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Crown,
  ShieldCheck,
  UserCheck,
  Check,
  Copy,
  Trash2,
  Edit3,
  X,
  Mail
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

// Danh sách thành viên mẫu mặc định
const INITIAL_MEMBERS = [
  {
    id: 'mem_1',
    name: 'Kimi Admin',
    email: 'admin@kimidev.com',
    role: 'owner', // 'owner' | 'admin' | 'member'
    avatarColor: '#7C3AED',
    assignedGroups: ['all'],
    status: 'active',
    lastActive: 'Đang trực tuyến',
    isSelf: true
  },
  {
    id: 'mem_2',
    name: 'Nguyễn Văn Hùng',
    email: 'hung.nguyen@adsagency.vn',
    role: 'admin',
    avatarColor: '#2563EB',
    assignedGroups: ['Facebook Ads', 'TikTok'],
    status: 'active',
    lastActive: '15 phút trước',
    isSelf: false
  },
  {
    id: 'mem_3',
    name: 'Trần Thị Mai',
    email: 'mai.tran@ecommerce.com',
    role: 'member',
    avatarColor: '#059669',
    assignedGroups: ['E-Commerce'],
    status: 'active',
    lastActive: '1 giờ trước',
    isSelf: false
  },
  {
    id: 'mem_4',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@growthlab.io',
    role: 'member',
    avatarColor: '#D97706',
    assignedGroups: ['TikTok', 'Crypto'],
    status: 'active',
    lastActive: 'Hôm qua',
    isSelf: false
  }
];

export default function TeamPage() {
  const { showToast } = useBrowser();

  // Danh sách thành viên lưu trong localStorage
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_simple_team_members');
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  // Modals
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Danh sách nhóm hồ sơ có sẵn
  const availableGroups = ['Facebook Ads', 'TikTok', 'Crypto', 'E-Commerce'];

  // Đồng bộ localStorage
  useEffect(() => {
    localStorage.setItem('antidetect_simple_team_members', JSON.stringify(members));
  }, [members]);

  // Bật/Tắt trạng thái thành viên
  const handleToggleStatus = (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    if (member.isSelf) {
      if (showToast) showToast('Không thể khóa tài khoản chính của bạn!', 'error');
      return;
    }
    const newStatus = member.status === 'active' ? 'suspended' : 'active';
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
    if (showToast) {
      showToast(
        newStatus === 'active'
          ? `Đã kích hoạt lại: ${member.name}`
          : `Đã tạm khóa tài khoản: ${member.name}`,
        'info'
      );
    }
  };

  // Xóa thành viên
  const handleDeleteMember = (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    if (member.isSelf) {
      if (showToast) showToast('Không thể xóa chính bạn khỏi nhóm!', 'error');
      return;
    }
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}" khỏi nhóm?`)) {
      return;
    }
    setMembers(prev => prev.filter(m => m.id !== id));
    if (showToast) showToast(`Đã xóa thành viên "${member.name}" khỏi nhóm!`, 'success');
  };

  // Sao chép link mời
  const handleCopyInviteLink = () => {
    const link = 'https://app.kimidev.com/team-invite?org=my-team&token=km_8f29c4';
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    if (showToast) showToast('Đã sao chép đường dẫn mời thành viên!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render Role Badge
  const renderRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            border: '1px solid #FDE68A'
          }}>
            <Crown size={12} style={{ color: '#D97706' }} />
            Chủ sở hữu
          </span>
        );
      case 'admin':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: '#EDE9FE',
            color: '#6D28D9',
            border: '1px solid #DDD6FE'
          }}>
            <ShieldCheck size={12} style={{ color: '#7C3AED' }} />
            Quản trị viên
          </span>
        );
      default:
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE'
          }}>
            <UserCheck size={12} style={{ color: '#2563EB' }} />
            Thành viên
          </span>
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* ── HEADER ĐƠN GIẢN ── */}
      <div style={{
        padding: '20px 24px 16px 24px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Thành Viên Nhóm
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Quản lý và mời thành viên tham gia làm việc chung trong dự án
              </p>
            </div>
          </div>
        </div>

        {/* Nút mời thành viên & Sao chép link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleCopyInviteLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {copiedLink ? <Check size={14} style={{ color: '#10B981' }} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Đã chép link' : 'Sao chép link mời'}</span>
          </button>

          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: '6px',
              backgroundColor: '#7C3AED',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(124, 58, 237, 0.25)'
            }}
          >
            <UserPlus size={15} />
            <span>Mời thành viên</span>
          </button>
        </div>
      </div>

      {/* ── BẢNG DANH SÁCH THÀNH VIÊN GỌN GÀNG ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                <th style={{ padding: '12px 16px' }}>Thành viên</th>
                <th style={{ padding: '12px 14px' }}>Vai trò</th>
                <th style={{ padding: '12px 14px' }}>Nhóm hồ sơ được gán</th>
                <th style={{ padding: '12px 14px' }}>Trạng thái</th>
                <th style={{ padding: '12px 14px' }}>Hoạt động</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '12.5px' }}>
              {members.map((member, idx) => (
                <tr
                  key={member.id}
                  style={{
                    borderBottom: idx === members.length - 1 ? 'none' : '1px solid #F1F5F9',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  {/* Tên & Email */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor: member.avatarColor,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '12px',
                        flexShrink: 0
                      }}>
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>
                            {member.name}
                          </span>
                          {member.isSelf && (
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              border: '1px solid #FDE68A'
                            }}>
                              Bạn
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Vai trò */}
                  <td style={{ padding: '12px 14px' }}>
                    {renderRoleBadge(member.role)}
                  </td>

                  {/* Nhóm được gán */}
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {member.assignedGroups.includes('all') ? (
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: '#EDE9FE',
                          color: '#7C3AED'
                        }}>
                          Tất cả nhóm
                        </span>
                      ) : (
                        member.assignedGroups.map(grp => (
                          <span
                            key={grp}
                            style={{
                              padding: '2px 7px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 500,
                              backgroundColor: '#F1F5F9',
                              color: '#334155',
                              border: '1px solid #E2E8F0'
                            }}
                          >
                            {grp}
                          </span>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Trạng thái Bật / Tạm dừng */}
                  <td style={{ padding: '12px 14px' }}>
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      disabled={member.isSelf}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: member.isSelf ? 'default' : 'pointer',
                        backgroundColor: member.status === 'active' ? '#ECFDF5' : '#FEE2E2',
                        color: member.status === 'active' ? '#047857' : '#B91C1C'
                      }}
                    >
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: member.status === 'active' ? '#10B981' : '#EF4444'
                      }} />
                      {member.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </button>
                  </td>

                  {/* Thời gian hoạt động */}
                  <td style={{ padding: '12px 14px', fontSize: '11.5px', color: '#64748B' }}>
                    {member.lastActive}
                  </td>

                  {/* Thao tác Sửa / Xóa */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => setEditingMember(member)}
                        title="Chỉnh sửa"
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          color: '#475569',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px'
                        }}
                      >
                        <Edit3 size={12} />
                        <span>Sửa</span>
                      </button>

                      {!member.isSelf && (
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          title="Xóa thành viên"
                          style={{
                            padding: '5px 8px',
                            borderRadius: '4px',
                            border: '1px solid #FEE2E2',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px'
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {members.length === 0 && (
            <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
              <Users size={28} style={{ margin: '0 auto 8px auto', color: '#94A3B8' }} />
              <p style={{ fontWeight: 600, color: '#0F172A', margin: 0 }}>Chưa có thành viên nào</p>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL MỜI THÀNH VIÊN ĐƠN GIẢN ── */}
      {showInviteModal && (
        <InviteMemberModal
          availableGroups={availableGroups}
          onClose={() => setShowInviteModal(false)}
          onInvite={(data) => {
            const newMem = {
              id: `mem_${Date.now()}`,
              name: data.name || data.email.split('@')[0],
              email: data.email,
              role: data.role,
              avatarColor: ['#7C3AED', '#2563EB', '#059669', '#D97706'][Math.floor(Math.random() * 4)],
              assignedGroups: data.assignedGroups,
              status: 'active',
              lastActive: 'Vừa được mời',
              isSelf: false
            };
            setMembers(prev => [...prev, newMem]);
            setShowInviteModal(false);
            if (showToast) showToast(`Đã thêm thành viên ${newMem.name} vào nhóm!`, 'success');
          }}
        />
      )}

      {/* ── MODAL CHỈNH SỬA THÀNH VIÊN ── */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          availableGroups={availableGroups}
          onClose={() => setEditingMember(null)}
          onSave={(updated) => {
            setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
            setEditingMember(null);
            if (showToast) showToast(`Đã cập nhật thông tin: ${updated.name}`, 'success');
          }}
        />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// MODAL: MỜI THÀNH VIÊN GỌN GÀNG
// -------------------------------------------------------------
function InviteMemberModal({ availableGroups, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [assignedGroups, setAssignedGroups] = useState(['Facebook Ads']);

  const handleToggleGroup = (grp) => {
    if (assignedGroups.includes(grp)) {
      setAssignedGroups(prev => prev.filter(g => g !== grp));
    } else {
      setAssignedGroups(prev => [...prev, grp]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      alert('Vui lòng nhập email hợp lệ!');
      return;
    }
    if (assignedGroups.length === 0) {
      alert('Vui lòng chọn ít nhất một nhóm hồ sơ!');
      return;
    }
    onInvite({ email, name, role, assignedGroups });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '460px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Mời thành viên vào nhóm
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Email thành viên <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhanvien@gmail.com"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Tên thành viên (Tùy chọn)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Vai trò
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box'
              }}
            >
              <option value="member">Thành viên (Chỉ mở & làm việc trên profile)</option>
              <option value="admin">Quản trị viên (Toàn quyền quản lý)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Nhóm hồ sơ được phép truy cập
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {availableGroups.map(grp => {
                const isChecked = assignedGroups.includes(grp);
                return (
                  <label
                    key={grp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '5px',
                      border: `1px solid ${isChecked ? '#7C3AED' : '#E2E8F0'}`,
                      backgroundColor: isChecked ? '#F5F3FF' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: isChecked ? '#7C3AED' : '#334155'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleGroup(grp)}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>{grp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Mail size={13} />
              <span>Gửi lời mời</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MODAL: SỬA THÀNH VIÊN GỌN GÀNG
// -------------------------------------------------------------
function EditMemberModal({ member, availableGroups, onClose, onSave }) {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [assignedGroups, setAssignedGroups] = useState(member.assignedGroups);
  const [status, setStatus] = useState(member.status);

  const handleToggleGroup = (grp) => {
    if (assignedGroups.includes(grp)) {
      setAssignedGroups(prev => prev.filter(g => g !== grp));
    } else {
      setAssignedGroups(prev => [...prev, grp]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...member,
      name,
      role,
      assignedGroups,
      status
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.65)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Sửa thành viên
            </h3>
            <span style={{ fontSize: '11px', color: '#64748B' }}>{member.email}</span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
              Tên thành viên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Vai trò
              </label>
              <select
                value={role}
                disabled={member.isSelf}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="owner">Chủ sở hữu</option>
                <option value="admin">Quản trị viên</option>
                <option value="member">Thành viên</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Trạng thái
              </label>
              <select
                value={status}
                disabled={member.isSelf}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="active">Hoạt động</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Nhóm hồ sơ được gán
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {availableGroups.map(grp => {
                const isChecked = assignedGroups.includes('all') || assignedGroups.includes(grp);
                return (
                  <label
                    key={grp}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '5px',
                      border: `1px solid ${isChecked ? '#7C3AED' : '#E2E8F0'}`,
                      backgroundColor: isChecked ? '#F5F3FF' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: isChecked ? '#7C3AED' : '#334155'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleGroup(grp)}
                      style={{ accentColor: '#7C3AED' }}
                    />
                    <span>{grp}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '7px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: '7px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
