import React from 'react';
import { Search, X } from 'lucide-react';
import StoreCard from '../components/StoreCard';

export default function ExtensionsStoreTab({
  filteredStoreExtensions,
  storeSearch,
  setStoreSearch,
  installedExtIds,
  downloadingStoreIds,
  onAddFromStore
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#FFFFFF',
        padding: '24px 28px'
      }}
    >
      {/* Store Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          marginBottom: '20px',
          backgroundColor: '#F8FAFC',
          padding: '16px 20px',
          borderRadius: '10px',
          border: '1px solid #E2E8F0'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 14px',
              width: '100%',
              maxWidth: '360px'
            }}
          >
            <Search size={15} color="#7C3AED" />
            <input
              type="text"
              placeholder="Tìm kiếm tiện ích Web3, Proxy, Captcha, Cookie..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
                width: '100%',
                backgroundColor: 'transparent'
              }}
            />
            {storeSearch && (
              <button
                onClick={() => setStoreSearch('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Tìm thấy <strong>{filteredStoreExtensions.length}</strong> tiện ích phổ biến
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredStoreExtensions.map((item) => {
          const isInstalled = installedExtIds.has(item.extId) || installedExtIds.has(item.name.toLowerCase());
          return (
            <StoreCard
              key={item.id}
              item={item}
              isInstalled={isInstalled}
              isDownloading={downloadingStoreIds.has(item.id)}
              onAddFromStore={onAddFromStore}
            />
          );
        })}
      </div>
    </div>
  );
}
