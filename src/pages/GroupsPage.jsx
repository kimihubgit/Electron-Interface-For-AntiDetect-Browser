import React from 'react';
import { FolderTree, Plus, Globe, Layers, Folder } from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

export default function GroupsPage() {
  const { profiles, setActiveTab, setSelectedGroup } = useBrowser();

  const groups = [
    { name: 'Facebook Ads', desc: 'Quản lý tài khoản quảng cáo Facebook Agency & BM', color: '#3B82F6' },
    { name: 'TikTok', desc: 'Hồ sơ tài khoản TikTok Shop & Creator Studio', color: '#EC4899' },
    { name: 'Crypto', desc: 'Airdrop farming, Whitelist, Retroactive tasks', color: '#8B5CF6' },
    { name: 'E-Commerce', desc: 'Amazon, Shopee, eBay Seller/Buyer accounts', color: '#F59E0B' },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>Nhóm & Thư Mục Hồ Sơ</h2>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', margin: 0 }}>
            Phân loại hồ sơ trình duyệt theo dự án và mục đích kinh doanh
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {groups.map((g, idx) => {
          const count = profiles.filter(p => p.group === g.name).length;
          return (
            <div
              key={idx}
              onClick={() => {
                setSelectedGroup(g.name);
                setActiveTab('profiles');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--apidog-purple)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: `${g.color}15`,
                    color: g.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FolderTree size={22} />
                  </div>
                  <span className="badge badge-purple">{count} Profile</span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>{g.name}</h3>
                <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>{g.desc}</p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--apidog-purple)' }}>
                  Xem danh sách ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
