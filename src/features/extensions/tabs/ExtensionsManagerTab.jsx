import React from 'react';
import { Puzzle, ShoppingBag } from 'lucide-react';
import SkeletonLoader from '../../../components/common/SkeletonLoader';
import ManagerFilterBar from '../components/ManagerFilterBar';
import ExtensionCard from '../components/ExtensionCard';

export default function ExtensionsManagerTab({
  extensions,
  filteredExtensions,
  profilesCount,
  isLoading,
  search,
  setSearch,
  status,
  setStatus,
  onToggle,
  onOpenFolder,
  onOpenAssignModal,
  onOpenUpdateModal,
  onDelete,
  onNavigateToStore
}) {
  const enabledCount = extensions.filter(e => e.enabled).length;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#F8FAFC',
        padding: '20px 28px'
      }}
    >
      {/* Toolbar */}
      <ManagerFilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        totalCount={extensions.length}
        enabledCount={enabledCount}
        filteredCount={filteredExtensions.length}
      />

      {/* Grid of Installed Extensions */}
      {isLoading ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
          <SkeletonLoader type="lines" count={4} />
        </div>
      ) : filteredExtensions.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px dashed #CBD5E1'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: '#94A3B8'
            }}
          >
            <Puzzle size={24} />
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px 0' }}>
            Không tìm thấy tiện ích nào
          </h3>
          <p
            style={{
              fontSize: '12px',
              color: '#64748B',
              margin: '0 0 16px 0',
              textAlign: 'center',
              maxWidth: '360px'
            }}
          >
            {search
              ? 'Không tìm thấy tiện ích nào phù hợp với từ khóa tìm kiếm.'
              : 'Chưa có tiện ích mở rộng nào. Bạn có thể cài đặt từ Cửa hàng hoặc tệp máy tính.'}
          </p>
          <button
            onClick={onNavigateToStore}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '6px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={14} />
            <span>Khám phá Cửa hàng Tiện ích</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '14px'
          }}
        >
          {filteredExtensions.map((ext) => (
            <ExtensionCard
              key={ext.id}
              ext={ext}
              profilesCount={profilesCount}
              onToggle={onToggle}
              onOpenFolder={onOpenFolder}
              onOpenAssignModal={onOpenAssignModal}
              onOpenUpdateModal={onOpenUpdateModal}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
