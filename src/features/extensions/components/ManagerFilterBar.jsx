import React from 'react';
import { Search, X } from 'lucide-react';

export default function ManagerFilterBar({
  search,
  setSearch,
  status,
  setStatus,
  totalCount,
  enabledCount,
  filteredCount
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1 }}>
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '100%',
            maxWidth: '280px'
          }}
        >
          <Search size={14} color="#64748B" />
          <input
            type="text"
            placeholder="Tìm kiếm tiện ích đã cài..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              backgroundColor: 'transparent'
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
          <button
            onClick={() => setStatus('all')}
            style={{
              padding: '6px 10px',
              border: 'none',
              backgroundColor: status === 'all' ? '#7C3AED' : 'transparent',
              color: status === 'all' ? '#FFFFFF' : '#64748B',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tất cả ({totalCount})
          </button>
          <button
            onClick={() => setStatus('enabled')}
            style={{
              padding: '6px 10px',
              border: 'none',
              backgroundColor: status === 'enabled' ? '#10B981' : 'transparent',
              color: status === 'enabled' ? '#FFFFFF' : '#64748B',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đang bật ({enabledCount})
          </button>
          <button
            onClick={() => setStatus('disabled')}
            style={{
              padding: '6px 10px',
              border: 'none',
              backgroundColor: status === 'disabled' ? '#64748B' : 'transparent',
              color: status === 'disabled' ? '#FFFFFF' : '#64748B',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đã tắt ({totalCount - enabledCount})
          </button>
        </div>
      </div>

      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
        Hiển thị <strong>{filteredCount}</strong> / {totalCount} tiện ích
      </div>
    </div>
  );
}
