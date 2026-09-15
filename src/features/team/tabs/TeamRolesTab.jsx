import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PERMISSION_DEFINITIONS } from '../data/teamConstants';

export default function TeamRolesTab() {
  return (
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
                <tr
                  key={perm.key}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
                  }}
                >
                  <td style={{ padding: '10px 16px', color: '#1E293B', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#F1F5F9',
                          color: '#64748B'
                        }}
                      >
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
  );
}
