import React, { useState } from 'react';

export default function Ipv6SubnetTab({
  generatedIpv6List = [],
  generateIpv6Batch,
  addGeneratedIpv6ToPool,
  showToast
}) {
  const [ipv6Config, setIpv6Config] = useState({
    prefix: '2402:800:6000:a1b2::/64',
    count: 20,
    startPort: 20000,
    userPrefix: 'ipv6_user',
    customPass: 'secure_pass123'
  });

  return (
    <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto' }}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
          Trình Tạo Proxy IPv6 Subnet /64 Tự Động
        </h3>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
          Nhập dải prefix IPv6 (ví dụ: từ VPS Viettel, OVH, Hetzner) để hệ thống tự động sinh hàng nghìn địa chỉ IPv6 tĩnh kèm Port và Auth riêng biệt.
        </p>
      </div>

      <div style={{ maxWidth: '640px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              IPv6 Prefix Subnet
            </label>
            <input
              type="text"
              value={ipv6Config.prefix}
              onChange={(e) => setIpv6Config({ ...ipv6Config, prefix: e.target.value })}
              placeholder="2402:800:6000:a1b2::/64"
              style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Số lượng Proxy muốn sinh
            </label>
            <input
              type="number"
              value={ipv6Config.count}
              onChange={(e) => setIpv6Config({ ...ipv6Config, count: Number(e.target.value) })}
              min={1}
              max={500}
              style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Cổng Port bắt đầu (Start Port)
            </label>
            <input
              type="number"
              value={ipv6Config.startPort}
              onChange={(e) => setIpv6Config({ ...ipv6Config, startPort: Number(e.target.value) })}
              style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px', fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
              Tài khoản / Mật khẩu Auth
            </label>
            <input
              type="text"
              value={ipv6Config.customPass}
              onChange={(e) => setIpv6Config({ ...ipv6Config, customPass: e.target.value })}
              placeholder="Mật khẩu proxy"
              style={{ width: '100%', height: '30px', padding: '0 8px', borderRadius: '5px', border: '1px solid #CBD5E1', fontSize: '12px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => generateIpv6Batch(ipv6Config)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ⚡ Tạo {ipv6Config.count} Proxy IPv6
          </button>

          {generatedIpv6List.length > 0 && (
            <button
              onClick={() => {
                addGeneratedIpv6ToPool();
                showToast?.(`Đã thêm ${generatedIpv6List.length} proxy IPv6 vào kho chính!`);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#059669',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              + Nhập toàn bộ vào kho Proxy chính
            </button>
          )}
        </div>
      </div>

      {/* Generated list preview */}
      {generatedIpv6List.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#1E293B' }}>
            Danh sách đã sinh ({generatedIpv6List.length} proxy):
          </div>
          <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', color: '#475569', textAlign: 'left' }}>
                  <th style={{ padding: '6px 10px' }}>IPv6 Host</th>
                  <th style={{ padding: '6px 10px' }}>Port</th>
                  <th style={{ padding: '6px 10px' }}>User</th>
                  <th style={{ padding: '6px 10px' }}>Password</th>
                </tr>
              </thead>
              <tbody>
                {generatedIpv6List.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{p.host}</td>
                    <td style={{ padding: '6px 10px', fontFamily: 'monospace' }}>{p.port}</td>
                    <td style={{ padding: '6px 10px' }}>{p.user}</td>
                    <td style={{ padding: '6px 10px' }}>{p.pass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
