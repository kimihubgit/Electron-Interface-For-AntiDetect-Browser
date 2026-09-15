import React from 'react';
import { Users } from 'lucide-react';
import TeamMemberRow from './TeamMemberRow';

export default function TeamMemberTable({
  members,
  selectedMemberIds,
  onSelectAll,
  onSelectOne,
  onEdit,
  onToggleStatus,
  onDelete
}) {
  const isAllSelected = members.length > 0 && selectedMemberIds.length === members.length;

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'auto', backgroundColor: '#FFFFFF' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
        <thead>
          <tr
            style={{
              backgroundColor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <th style={{ width: '38px', padding: '9px 12px', textAlign: 'center' }}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={onSelectAll}
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
          {members.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
                <Users size={36} style={{ margin: '0 auto 8px auto', color: '#CBD5E1', display: 'block' }} />
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>Không tìm thấy thành viên nào</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Thử đổi bộ lọc tìm kiếm hoặc mời thành viên mới.</div>
              </td>
            </tr>
          ) : (
            members.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                isSelected={selectedMemberIds.includes(member.id)}
                onSelect={onSelectOne}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
