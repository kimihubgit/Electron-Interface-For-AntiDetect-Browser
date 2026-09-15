import React from 'react';
import { Clock } from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '../data/teamConstants';

export default function TeamAuditTab({ auditLogs = INITIAL_AUDIT_LOGS }) {
  return (
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
          {auditLogs.map((log, idx) => (
            <div
              key={log.id}
              style={{
                padding: '12px 16px',
                borderBottom: idx < auditLogs.length - 1 ? '1px solid #F1F5F9' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                    {log.user}{' '}
                    <span style={{ fontWeight: 400, color: '#475569' }}>— {log.action}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '2px',
                      fontSize: '11px',
                      color: '#94A3B8'
                    }}
                  >
                    <span>
                      Khu vực: <strong>{log.target}</strong>
                    </span>
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
  );
}
