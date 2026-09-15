import React from 'react';
import { Puzzle, ShoppingBag, RotateCw, FolderOpen, Plus } from 'lucide-react';

export default function ExtensionHeader({
  activeView,
  setActiveView,
  extensionsCount,
  storeCount,
  profilesCount,
  isLoading,
  onRefresh,
  onOpenFolder,
  onOpenInstallModal
}) {
  return (
    <div
      style={{
        padding: '16px 28px',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}
    >
      {/* Title & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#F3E8FF',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Puzzle size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Quản Lý Tiện Ích Mở Rộng (Extensions)
            </h1>
            <p style={{ fontSize: '11px', color: '#64748B', margin: '2px 0 0 0' }}>
              Tự động đồng bộ và tải tiện ích vào nhân Chromium của {profilesCount} profiles
            </p>
          </div>
        </div>

        {/* Sub-Tabs: Manager vs Store */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '8px',
            marginLeft: '8px'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveView('manager')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeView === 'manager' ? '#FFFFFF' : 'transparent',
              color: activeView === 'manager' ? '#7C3AED' : '#64748B',
              fontSize: '12px',
              fontWeight: activeView === 'manager' ? 700 : 500,
              cursor: 'pointer',
              boxShadow: activeView === 'manager' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Puzzle size={14} />
            <span>Tiện ích đã cài ({extensionsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('store')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeView === 'store' ? '#FFFFFF' : 'transparent',
              color: activeView === 'store' ? '#7C3AED' : '#64748B',
              fontSize: '12px',
              fontWeight: activeView === 'store' ? 700 : 500,
              cursor: 'pointer',
              boxShadow: activeView === 'store' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <ShoppingBag size={14} />
            <span>Cửa hàng tiện ích ({storeCount})</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#334155',
            fontSize: '12px',
            fontWeight: 500,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Quét lại tiện ích thực tế từ thư mục ổ đĩa"
        >
          <RotateCw size={14} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isLoading ? 'Đang quét...' : 'Làm mới'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenFolder}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title="Mở thư mục lưu trữ tiện ích trên máy tính"
        >
          <FolderOpen size={14} />
          <span>Mở thư mục Extension</span>
        </button>

        <button
          type="button"
          onClick={onOpenInstallModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '6px',
            backgroundColor: '#7C3AED',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={14} />
          <span>Thêm tiện ích thủ công</span>
        </button>
      </div>
    </div>
  );
}
