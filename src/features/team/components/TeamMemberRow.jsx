import React from 'react';
import { Crown, ShieldCheck, UserCheck, Zap, Eye, Edit3, Lock, Unlock, Trash2 } from 'lucide-react';

export function RoleBadge({ role }) {
  switch (role) {
    case 'owner':
      return (
        <span
          style={{
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
          }}
        >
          <Crown size={12} color="#D97706" />
          Chủ sở hữu
        </span>
      );
    case 'admin':
    case 'member':
      return (
        <span
          style={{
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
          }}
        >
          <ShieldCheck size={12} color="#7C3AED" />
          Thành viên
        </span>
      );
    case 'manager':
      return (
        <span
          style={{
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
          }}
        >
          <UserCheck size={12} color="#2563EB" />
          Quản lý nhóm
        </span>
      );
    case 'operator':
      return (
        <span
          style={{
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
          }}
        >
          <Zap size={12} color="#059669" />
          Nhân viên chạy
        </span>
      );
    default:
      return (
        <span
          style={{
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
          }}
        >
          <Eye size={12} color="#64748B" />
          Chỉ xem
        </span>
      );
  }
}

export default function TeamMemberRow({
  member,
  isSelected,
  onSelect,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  return (
    <tr
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
          onChange={() => onSelect(member.id)}
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
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '4px',
                    backgroundColor: '#EDE9FE',
                    color: '#6D28D9'
                  }}
                >
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
        <RoleBadge role={member.role} />
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
            <span style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
              Chưa gán nhóm
            </span>
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
            onClick={() => onEdit(member)}
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
          >
            <Edit3 size={13} />
          </button>

          {/* Lock / Unlock Button */}
          {!member.isSelf && (
            <button
              onClick={() => onToggleStatus(member.id)}
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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              {member.status === 'active' ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
          )}

          {/* Delete Button */}
          {!member.isSelf && (
            <button
              onClick={() => onDelete(member)}
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
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
