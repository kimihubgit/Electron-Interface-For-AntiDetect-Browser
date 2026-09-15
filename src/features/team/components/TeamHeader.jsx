import React from 'react';
import { Users, KeyRound, Layers, Clock, UserPlus, Copy, Check } from 'lucide-react';

export default function TeamHeader({
  activeSubTab,
  setActiveSubTab,
  membersCount,
  maxMembersQuota,
  currentPlan = 'Pro',
  copiedLink,
  onCopyInviteLink,
  onOpenInviteModal
}) {
  return (
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
            <span>Danh sách thành viên ({membersCount})</span>
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
          <strong style={{ color: membersCount >= maxMembersQuota ? '#DC2626' : '#7C3AED' }}>
            {membersCount}/{maxMembersQuota}
          </strong>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>({currentPlan})</span>
        </div>

        {/* Copy invite link button */}
        <button
          onClick={onCopyInviteLink}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          {copiedLink ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>{copiedLink ? 'Đã sao chép' : 'Link mời nhanh'}</span>
        </button>

        {/* + Mời thành viên */}
        <button
          onClick={onOpenInviteModal}
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6D28D9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7C3AED')}
        >
          <UserPlus size={14} />
          <span>Mời thành viên</span>
        </button>
      </div>
    </div>
  );
}
