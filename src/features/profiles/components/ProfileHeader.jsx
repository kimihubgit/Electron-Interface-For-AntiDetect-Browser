import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  Play,
  Square,
  Plus,
  List,
  LayoutGrid,
  ChevronDown,
  Layers,
  Upload,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

/**
 * Search, filtering, view mode switcher, and new profile action toolbar
 */
export default function ProfileHeader({
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
  runningCount = 0,
  onStopAll,
  onLaunchAll,
  onOpenNewProfile,
  onOpenBatchProfile
}) {
  const { t } = useTranslation();
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
  const addDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target)) {
        setIsAddDropdownOpen(false);
      }
    };
    if (isAddDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddDropdownOpen]);

  return (
    <>
      {/* ── ADVANCED CONTROL & FILTER TOOLBAR ── */}
      <div style={{
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--apidog-border)',
        backgroundColor: 'var(--apidog-card-bg)',
        flexShrink: 0
      }}>
        {/* Left Side: Search & Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Smart Search Bar with Clear Button */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--apidog-bg)',
            borderRadius: '6px',
            border: '1px solid var(--apidog-border)',
            padding: '0 10px',
            height: '32px',
            width: '260px',
            transition: 'border-color 0.15s ease'
          }}>
            <Search size={14} style={{ color: 'var(--apidog-text-muted)', marginRight: '6px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder={t('profiles.searchPlaceholderHeader', 'Tìm theo tên, Proxy, Tag...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12.5px',
                width: '100%',
                backgroundColor: 'transparent',
                color: 'var(--apidog-text-main)'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: 'var(--apidog-text-muted)', cursor: 'pointer', padding: '2px' }}
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
            <option value="all">{t('profiles.osAll', 'Hệ điều hành (Tất cả)')}</option>
            <option value="windows">{t('profiles.osWindows', '🪟 Windows')}</option>
            <option value="macos">{t('profiles.osMacos', '🍎 macOS')}</option>
            <option value="linux">{t('profiles.osLinux', '🐧 Linux')}</option>
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
            <option value="latest">{t('profiles.sortLatest', 'Mới tạo nhất')}</option>
            <option value="oldest">{t('profiles.sortOldest', 'Cũ nhất')}</option>
            <option value="name-asc">{t('profiles.sortNameAsc', 'Tên (A → Z)')}</option>
            <option value="name-desc">{t('profiles.sortNameDesc', 'Tên (Z → A)')}</option>
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
              title={t('profiles.viewTableTitle', 'Chế độ xem Bảng chi tiết')}
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
              title={t('profiles.viewGridTitle', 'Chế độ xem Lưới Card')}
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
              title={t('profiles.stopAllTooltip', 'Dừng tất cả các hồ sơ đang mở')}
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
              <span>{t('profiles.stopAllBtn', 'Dừng tất cả ({count})', { count: runningCount })}</span>
            </button>
          ) : (
            <button
              onClick={onLaunchAll}
              title={t('profiles.launchAllTooltip', 'Khởi chạy đồng loạt tất cả hồ sơ')}
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
              <span>{t('profiles.launchAllBtn', 'Chạy tất cả')}</span>
            </button>
          )}

          {/* + New Profile Split Button with Chevron Down */}
          <div ref={addDropdownRef} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onOpenNewProfile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 12px 0 14px',
                borderTopLeftRadius: '6px',
                borderBottomLeftRadius: '6px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
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
              title={t('profiles.addProfileBtn', 'Thêm Hồ Sơ')}
            >
              <Plus size={15} />
              <span>{t('profiles.addProfileBtn', 'Thêm Hồ Sơ')}</span>
            </button>

            {/* Vertical Divider */}
            <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />

            {/* Dropdown Chevron Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddDropdownOpen(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '32px',
                width: '24px',
                borderTopRightRadius: '6px',
                borderBottomRightRadius: '6px',
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
                border: 'none',
                backgroundColor: isAddDropdownOpen ? 'var(--apidog-purple-hover)' : 'var(--apidog-purple)',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(124, 58, 237, 0.25)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--apidog-purple-hover)'}
              onMouseLeave={(e) => {
                if (!isAddDropdownOpen) e.currentTarget.style.backgroundColor = 'var(--apidog-purple)';
              }}
              title="Tùy chọn tạo hồ sơ"
            >
              <ChevronDown
                size={12}
                style={{
                  transform: isAddDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.18s ease'
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isAddDropdownOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
                  padding: '5px',
                  zIndex: 1000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  animation: 'fadeIn 0.12s ease-out'
                }}
              >
                {/* Option 1: Tạo hồ sơ đơn */}
                <div
                  onClick={() => {
                    setIsAddDropdownOpen(false);
                    onOpenNewProfile?.();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: '#EDE9FE',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Plus size={14} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Tạo hồ sơ đơn</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Tạo 1 trình duyệt tùy biến vân tay</span>
                  </div>
                </div>

                {/* Option 2: Tạo hàng loạt */}
                <div
                  onClick={() => {
                    setIsAddDropdownOpen(false);
                    onOpenBatchProfile?.();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: '#E0F2FE',
                    color: '#0284C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Layers size={14} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Tạo hồ sơ hàng loạt</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Sinh nhanh 10, 50, 100 profiles</span>
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#F1F5F9', margin: '3px 0' }} />

                {/* Option 3: Nhập từ file Cookie */}
                <div
                  onClick={() => {
                    setIsAddDropdownOpen(false);
                    alert('📥 Nhập hồ sơ từ file JSON / Cookie:\nChọn tệp sao lưu dữ liệu (.json) để nhập vào trình duyệt.');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.12s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    backgroundColor: '#DCFCE7',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Upload size={14} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>Nhập Cookie / File</span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Khôi phục từ tệp sao lưu JSON</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
