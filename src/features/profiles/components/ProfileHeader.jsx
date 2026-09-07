import React from 'react';
import {
  Search,
  X,
  Play,
  Square,
  Plus,
  Layers,
  Monitor,
  Shield,
  List,
  LayoutGrid
} from 'lucide-react';

/**
 * Top stats ribbon + search, filtering, view mode switcher, and new profile action toolbar
 */
export default function ProfileHeader({
  showStatsRibbon,
  totalCount,
  runningCount,
  idleCount,
  proxyCount,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  osFilter,
  setOsFilter,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onStopAll,
  onLaunchAll,
  onOpenNewProfile
}) {
  return (
    <>
      {/* ── TOP STATS & QUICK METRICS RIBBON ── */}
      {showStatsRibbon && (
        <div style={{
          padding: '14px 24px 10px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          borderBottom: '1px solid #F1F5F9',
          backgroundColor: '#FAFCFF',
          flexShrink: 0
        }}>
          {/* Stat 1: Total Profiles */}
          <div
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: statusFilter === 'all' ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tổng số Profile
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {totalCount}
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', backgroundColor: '#F1F5F9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={16} />
            </div>
          </div>

          {/* Stat 2: Running Profiles */}
          <div
            onClick={() => setStatusFilter(prev => prev === 'running' ? 'all' : 'running')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: statusFilter === 'running' ? '#ECFDF5' : '#FFFFFF',
              border: statusFilter === 'running' ? '1px solid #10B981' : '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Đang hoạt động
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#065F46', marginTop: '2px' }}>
                {runningCount}
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={15} style={{ fill: '#16A34A' }} />
            </div>
          </div>

          {/* Stat 3: Idle Profiles */}
          <div
            onClick={() => setStatusFilter(prev => prev === 'idle' ? 'all' : 'idle')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: statusFilter === 'idle' ? '#F5F3FF' : '#FFFFFF',
              border: statusFilter === 'idle' ? '1px solid var(--apidog-purple)' : '1px solid #E2E8F0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#6D28D9', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Sẵn sàng (Idle)
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#5B21B6', marginTop: '2px' }}>
                {idleCount}
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', backgroundColor: '#EDE9FE', color: 'var(--apidog-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Monitor size={16} />
            </div>
          </div>

          {/* Stat 4: Proxies Configured */}
          <div style={{
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Proxy Đã gán
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {proxyCount} / {totalCount}
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '7px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} />
            </div>
          </div>
        </div>
      )}

      {/* ── ADVANCED CONTROL & FILTER TOOLBAR ── */}
      <div style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        flexShrink: 0
      }}>
        {/* Left Side: Search & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Smart Search Bar with Clear Button */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            padding: '0 10px',
            height: '32px',
            width: '260px',
            transition: 'border-color 0.15s ease'
          }}>
            <Search size={14} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Tìm theo tên, Proxy, Tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
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
                <X size={13} />
              </button>
            )}
          </div>

          {/* OS Filter Dropdown */}
          <select
            value={osFilter}
            onChange={(e) => setOsFilter(e.target.value)}
            style={{
              height: '32px',
              padding: '0 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">Hệ điều hành (Tất cả)</option>
            <option value="windows">🪟 Windows</option>
            <option value="macos">🍎 macOS</option>
            <option value="linux">🐧 Linux</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              height: '32px',
              padding: '0 10px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              fontSize: '12px',
              color: '#334155',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="latest">Mới tạo nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="name-asc">Tên (A → Z)</option>
            <option value="name-desc">Tên (Z → A)</option>
          </select>
        </div>

        {/* Right Side: View Mode, Trash, Batch Global & New Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Mode Toggle: Table / Grid */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            borderRadius: '6px',
            padding: '2px',
            gap: '2px'
          }}>
            <button
              onClick={() => setViewMode('table')}
              title="Chế độ xem Bảng chi tiết"
              style={{
                border: 'none',
                padding: '5px 7px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? 'var(--apidog-purple)' : '#64748B',
                boxShadow: viewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              title="Chế độ xem Lưới Card"
              style={{
                border: 'none',
                padding: '5px 7px',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'grid' ? 'var(--apidog-purple)' : '#64748B',
                boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Quick Launch All / Stop All buttons */}
          {runningCount > 0 ? (
            <button
              onClick={onStopAll}
              title="Dừng tất cả các hồ sơ đang mở"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #FECACA',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Square size={12} />
              <span>Dừng tất cả ({runningCount})</span>
            </button>
          ) : (
            <button
              onClick={onLaunchAll}
              title="Khởi chạy đồng loạt tất cả hồ sơ"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                height: '32px',
                padding: '0 12px',
                borderRadius: '6px',
                border: '1px solid #BBF7D0',
                backgroundColor: '#F0FDF4',
                color: '#15803D',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Play size={12} style={{ fill: '#15803D' }} />
              <span>Chạy tất cả</span>
            </button>
          )}

          {/* + New Profile Button */}
          <button
            onClick={onOpenNewProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 15px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--apidog-purple)',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple)'}
          >
            <Plus size={15} />
            <span>Thêm Hồ Sơ</span>
          </button>
        </div>
      </div>
    </>
  );
}
