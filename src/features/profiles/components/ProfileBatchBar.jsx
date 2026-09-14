import React from 'react';
import { Play, Square, Trash2, ChevronDown, Zap, LayoutGrid, Folder } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

/**
 * Floating bottom batch actions bar for selected profiles
 */
export default function ProfileBatchBar({
  selectedCount,
  onClearSelection,
  isPlayDropdownOpen,
  setIsPlayDropdownOpen,
  onPlayQuick,
  onPlayAndArrange,
  onOpenMoveGroup,
  onBatchStop,
  onBatchDelete
}) {
  const { t } = useTranslation();

  if (selectedCount === 0) return null;

  return (
    <div style={{
      padding: '12px 24px',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.15)',
      animation: 'fadeInModal 0.18s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600 }}>
          {t('profiles.batchSelected', 'Đã chọn {count} hồ sơ', { count: selectedCount })}
        </span>
        <button
          onClick={onClearSelection}
          style={{
            background: 'none',
            border: 'none',
            color: '#94A3B8',
            fontSize: '12px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {t('profiles.clearSelection', 'Bỏ chọn')}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Batch Play Dropdown with 2 Options: Play nhanh & Play + Sắp Xếp */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlayDropdownOpen(!isPlayDropdownOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803D'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16A34A'}
          >
            <Play size={12} style={{ fill: '#FFFFFF' }} />
            <span>{t('profiles.batchRunSelected', 'Chạy các mục đã chọn')}</span>
            <ChevronDown size={13} style={{ transform: isPlayDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          {/* 2 Options Popover Menu (Pops upward from bottom bar) */}
          {isPlayDropdownOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 'calc(100% + 8px)',
                left: 0,
                width: '240px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 -10px 25px rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.1)',
                padding: '6px',
                zIndex: 100
              }}
            >
              {/* Option 1: Play nhanh */}
              <div
                onClick={onPlayQuick}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>{t('profiles.batchQuickPlay', 'Play nhanh')}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{t('profiles.batchQuickPlayDesc', 'Chạy đồng thời các hồ sơ đã chọn')}</div>
                </div>
              </div>

              {/* Option 2: Play + Sắp Xếp */}
              <div
                onClick={onPlayAndArrange}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.12s ease',
                  marginTop: '2px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#EEF2FF',
                  color: '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <LayoutGrid size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>{t('profiles.batchPlayAndArrange', 'Play + Sắp Xếp')}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>{t('profiles.batchPlayAndArrangeDesc', 'Chạy & tự động chia lưới cửa sổ trên màn hình')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chuyển nhóm Button */}
        <button
          onClick={onOpenMoveGroup}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #475569',
            backgroundColor: '#1E293B',
            color: '#F1F5F9',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.borderColor = '#64748B';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E293B';
            e.currentTarget.style.borderColor = '#475569';
          }}
        >
          <Folder size={13} style={{ color: '#A78BFA' }} />
          <span>{t('profiles.batchMoveGroup', 'Chuyển nhóm')}</span>
        </button>

        {/* Batch Stop */}
        <button
          onClick={onBatchStop}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #475569',
            backgroundColor: '#1E293B',
            color: '#F1F5F9',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Square size={12} />
          <span>{t('profiles.batchStopSelected', 'Dừng các mục đã chọn')}</span>
        </button>

        {/* Batch Delete */}
        <button
          onClick={onBatchDelete}
          title={t('profiles.batchDeleteSelected', 'Xóa các mục đã chọn')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '6px',
            border: '1px solid #EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            color: '#F87171',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
