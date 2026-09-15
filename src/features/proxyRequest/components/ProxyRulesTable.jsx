import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ProxyRulesTable({
  rules,
  setRules,
  onOpenAddRule
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          padding: '12px 18px',
          borderRadius: '10px',
          border: '1px solid #E2E8F0'
        }}
      >
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Danh Sách Quy Tắc Phân Luồng (Routing Table)</h4>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '3px 0 0 0' }}>
            Mọi request từ trình duyệt sẽ được kiểm tra theo danh sách này theo thứ tự từ trên xuống dưới.
          </p>
        </div>
        <button
          onClick={onOpenAddRule}
          className="btn btn-primary"
          style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '6px' }}
        >
          + Thêm Quy Tắc Mới
        </button>
      </div>

      {/* Rules Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#6B7280', fontSize: '11.5px', fontWeight: 600 }}>
              <th style={{ padding: '10px 16px' }}>Trạng Thái</th>
              <th style={{ padding: '10px 16px' }}>Mẫu Nhận Diện (Pattern Wildcard)</th>
              <th style={{ padding: '10px 16px' }}>Tuyến Đường</th>
              <th style={{ padding: '10px 16px' }}>Loại & Ghi Chú</th>
              <th style={{ padding: '10px 16px', textAlign: 'right' }}>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td style={{ padding: '10px 16px' }}>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: val } : r)));
                    }}
                    style={{ cursor: 'pointer', accentColor: '#7C3AED' }}
                  />
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                  {rule.pattern}
                </td>
                <td style={{ padding: '10px 16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: rule.action === 'DIRECT' ? '#ECFDF5' : rule.action === 'PROXY' ? '#EFF6FF' : '#FEF2F2',
                      color: rule.action === 'DIRECT' ? '#059669' : rule.action === 'PROXY' ? '#2563EB' : '#DC2626',
                      border: `1px solid ${rule.action === 'DIRECT' ? '#A7F3D0' : rule.action === 'PROXY' ? '#BFDBFE' : '#FECACA'}`
                    }}
                  >
                    {rule.action}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', color: '#4B5563' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>[{rule.type}]</span> {rule.notes}
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}
                    className="btn-icon"
                    style={{ color: '#EF4444' }}
                    title="Xóa quy tắc này"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
