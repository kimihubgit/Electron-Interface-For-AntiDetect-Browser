import React from 'react';
import { Search, X, Trash2 } from 'lucide-react';

export default function ProxyFilterBar({
  searchTerm,
  setSearchTerm,
  protocolFilter,
  setProtocolFilter,
  statusFilter,
  setStatusFilter,
  totalCount,
  liveCount,
  dieCount,
  handleDeleteDieProxies
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        gap: '12px',
        flexWrap: 'wrap'
      }}
    >
      {/* Left: Search input & Protocol Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '280px' }}>
        {/* Search input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            padding: '0 8px',
            height: '28px',
            width: '240px'
          }}
        >
          <Search size={13} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Tìm theo Host, Port, Quốc gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              backgroundColor: 'transparent',
              color: '#1E293B'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Protocol Filter */}
        <select
          value={protocolFilter}
          onChange={(e) => setProtocolFilter(e.target.value)}
          style={{
            height: '28px',
            padding: '0 8px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFFFFF',
            fontSize: '11.5px',
            color: '#334155',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="ALL">Tất cả giao thức</option>
          <option value="SOCKS5">SOCKS5</option>
          <option value="HTTP">HTTP</option>
          <option value="HTTPS">HTTPS</option>
        </select>
      </div>

      {/* Right: Status Filter (Live/Die/All) & Delete Die button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Status Filter Segmented Button */}
        <div style={{ display: 'flex', backgroundColor: '#E2E8F0', borderRadius: '4px', padding: '2px', gap: '2px' }}>
          <button
            onClick={() => setStatusFilter('ALL')}
            style={{
              padding: '3px 9px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11.5px',
              fontWeight: statusFilter === 'ALL' ? 600 : 500,
              backgroundColor: statusFilter === 'ALL' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'ALL' ? '#1E293B' : '#64748B',
              cursor: 'pointer',
              boxShadow: statusFilter === 'ALL' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.12s'
            }}
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setStatusFilter('live')}
            style={{
              padding: '3px 9px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11.5px',
              fontWeight: statusFilter === 'live' ? 600 : 500,
              backgroundColor: statusFilter === 'live' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'live' ? '#059669' : '#64748B',
              cursor: 'pointer',
              boxShadow: statusFilter === 'live' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.12s'
            }}
          >
            ● Hoạt động ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter('die')}
            style={{
              padding: '3px 9px',
              border: 'none',
              borderRadius: '3px',
              fontSize: '11.5px',
              fontWeight: statusFilter === 'die' ? 600 : 500,
              backgroundColor: statusFilter === 'die' ? '#FFFFFF' : 'transparent',
              color: statusFilter === 'die' ? '#DC2626' : '#64748B',
              cursor: 'pointer',
              boxShadow: statusFilter === 'die' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.12s'
            }}
          >
            ● Lỗi / Chết ({dieCount})
          </button>
        </div>

        {/* Nút Xóa Proxy Die */}
        <button
          onClick={handleDeleteDieProxies}
          disabled={dieCount === 0}
          title={dieCount > 0 ? `Xóa toàn bộ ${dieCount} proxy Die khỏi danh sách` : 'Không có proxy Die'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid #FECACA',
            backgroundColor: dieCount > 0 ? '#FEF2F2' : '#F8FAFC',
            color: dieCount > 0 ? '#DC2626' : '#94A3B8',
            fontSize: '11.5px',
            fontWeight: 500,
            cursor: dieCount > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.12s'
          }}
          onMouseEnter={(e) => {
            if (dieCount > 0) e.currentTarget.style.backgroundColor = '#FEE2E2';
          }}
          onMouseLeave={(e) => {
            if (dieCount > 0) e.currentTarget.style.backgroundColor = '#FEF2F2';
          }}
        >
          <Trash2 size={12} />
          <span>Xóa Die ({dieCount})</span>
        </button>
      </div>
    </div>
  );
}
