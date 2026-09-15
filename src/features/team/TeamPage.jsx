import React, { useState, useEffect, useMemo } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';

import { INITIAL_MEMBERS, INITIAL_AUDIT_LOGS } from './data/teamConstants';
import TeamHeader from './components/TeamHeader';
import TeamFilterBar from './components/TeamFilterBar';
import TeamMemberTable from './components/TeamMemberTable';
import TeamFloatingBar from './components/TeamFloatingBar';
import TeamRolesTab from './tabs/TeamRolesTab';
import TeamGroupsTab from './tabs/TeamGroupsTab';
import TeamAuditTab from './tabs/TeamAuditTab';
import InviteMemberModal from './modals/InviteMemberModal';
import DeleteMemberModal from './modals/DeleteMemberModal';

export default function TeamPage() {
  const { t } = useTranslation();
  const { showToast, setActiveUpgradeModal, currentPlan = 'Pro' } = useBrowser();

  // Sub-tab: 'members' | 'roles' | 'groups' | 'audit'
  const [activeSubTab, setActiveSubTab] = useState('members');

  // Members state from localStorage
  const [members, setMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('antidetect_enterprise_members');
      return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const maxMembersQuota = 5;

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

  // Form Invite / Edit
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
        const groupMatch = m.assignedGroups?.some(g => g.toLowerCase().includes(q));
        return nameMatch || emailMatch || groupMatch;
      }
      return true;
    });
  }, [members, roleFilter, statusFilter, searchTerm]);

  // Checkbox handlers
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
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, status: newStatus } : m)));
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
      setMembers(prev =>
        prev.map(m =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formData.name.trim(),
                role: formData.role,
                assignedGroups: formData.assignedGroups,
                permissions: formData.permissions
              }
            : m
        )
      );
      showToast?.(`Cập nhật thông tin "${formData.name}" thành công!`, 'success');
    } else {
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
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* 1. Header & Tabs */}
      <TeamHeader
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        membersCount={members.length}
        maxMembersQuota={maxMembersQuota}
        currentPlan={currentPlan}
        copiedLink={copiedLink}
        onCopyInviteLink={handleCopyInviteLink}
        onOpenInviteModal={handleOpenInviteModal}
      />

      {/* 2. Members Tab View */}
      {activeSubTab === 'members' && (
        <>
          <TeamFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredMembers.length}
            totalCount={members.length}
          />

          <TeamMemberTable
            members={filteredMembers}
            selectedMemberIds={selectedMemberIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            onEdit={handleOpenEditModal}
            onToggleStatus={handleToggleStatus}
            onDelete={setDeleteConfirmMember}
          />

          <TeamFloatingBar
            selectedCount={selectedMemberIds.length}
            onLockSelected={() => {
              setMembers(prev =>
                prev.map(m =>
                  selectedMemberIds.includes(m.id) && !m.isSelf ? { ...m, status: 'suspended' } : m
                )
              );
              showToast?.(`Đã tạm khóa ${selectedMemberIds.length} thành viên`, 'info');
              setSelectedMemberIds([]);
            }}
            onDeleteSelected={() => {
              if (window.confirm(`Xóa ${selectedMemberIds.length} thành viên đã chọn?`)) {
                setMembers(prev => prev.filter(m => !selectedMemberIds.includes(m.id) || m.isSelf));
                showToast?.(`Đã xóa ${selectedMemberIds.length} thành viên khỏi nhóm`, 'success');
                setSelectedMemberIds([]);
              }
            }}
            onClearSelection={() => setSelectedMemberIds([])}
          />
        </>
      )}

      {/* 3. Roles Tab */}
      {activeSubTab === 'roles' && <TeamRolesTab />}

      {/* 4. Groups Tab */}
      {activeSubTab === 'groups' && <TeamGroupsTab members={members} />}

      {/* 5. Audit Tab */}
      {activeSubTab === 'audit' && <TeamAuditTab auditLogs={INITIAL_AUDIT_LOGS} />}

      {/* 6. Invite / Edit Modal */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        editingMember={editingMember}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSaveMember}
      />

      {/* 7. Confirm Delete Modal */}
      <DeleteMemberModal
        member={deleteConfirmMember}
        onClose={() => setDeleteConfirmMember(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
