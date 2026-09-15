import React from 'react';
import { Layers } from 'lucide-react';
import { AVAILABLE_GROUPS } from '../data/teamConstants';

export default function TeamGroupsTab({ members }) {
  return (
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px'
          }}
        >
          {AVAILABLE_GROUPS.filter(g => g !== 'Tất cả nhóm').map((grpName) => {
            const assignedMembers = members.filter(
              m =>
                (m.assignedGroups && m.assignedGroups.includes(grpName)) ||
                (m.assignedGroups && m.assignedGroups.includes('Tất cả nhóm'))
            );
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Layers size={14} />
                    </div>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>
                      {grpName}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 7px',
                      borderRadius: '12px',
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 600
                    }}
                  >
                    {assignedMembers.length} người
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '12px'
                  }}
                >
                  {assignedMembers.length === 0 ? (
                    <span style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                      Chưa có thành viên nào
                    </span>
                  ) : (
                    assignedMembers.map(m => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: m.avatarColor,
                              color: '#FFF',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700
                            }}
                          >
                            {m.name.charAt(0)}
                          </div>
                          <span style={{ color: '#1E293B', fontWeight: 500 }}>{m.name}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>{m.role}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
