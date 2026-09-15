import React from 'react';
import { Search, X } from 'lucide-react';

export default function TeamFilterBar({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '10px'
      }}
    >
      {/* Left: Search input + Role filter + Status filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Search Box */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '9px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8'
            }}
          />
          <input
            type="text"
            placeholder="Tìm theo tên, email, nhóm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: '30px',
              padding: '0 28px 0 30px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              fontSize: '12px',
              outline: 'none',
              backgroundColor: '#FFFFFF',
              boxSizing: 'border-box'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            height: '30px',
            padding: '0 8px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            color: '#334155',
            backgroundColor: '#FFFFFF',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Tất cả vai trò</option>
          <option value="owner">Chủ sở hữu (Owner)</option>
          <option value="admin">Thành viên (Member)</option>
          <option value="manager">Quản lý nhóm (Manager)</option>
          <option value="operator">Nhân viên chạy (Operator)</option>
          <option value="viewer">Chỉ xem (Viewer)</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            height: '30px',
            padding: '0 8px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            fontSize: '12px',
            color: '#334155',
            backgroundColor: '#FFFFFF',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="suspended">Đã tạm khóa</option>
        </select>
      </div>

      {/* Right: Showing count */}
      <span style={{ fontSize: '12px', color: '#64748B' }}>
        Hiển thị <strong>{filteredCount}</strong> / {totalCount} thành viên
      </span>
    </div>
  );
}
