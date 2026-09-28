import React, { useState, useRef, useEffect } from 'react';
import { Folder, ChevronDown, Plus, Pencil, Trash2, Check, Search, X } from 'lucide-react';
import { useBrowser } from '../../../store/BrowserContext';
import { useTranslation } from '../../../i18n/I18nContext';

export default function GroupFilterSelect() {
  const { t } = useTranslation();
  const {
    profiles = [],
    customGroups = [],
    selectedGroup = 'All',
    setSelectedGroup,
    setActiveGroupModal,
    setDeleteConfirmGroup
  } = useBrowser();

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredGroupId, setHoveredGroupId] = useState(null);
  const [filterSearch, setFilterSearch] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setFilterSearch('');
    }
  }, [isOpen]);

  const safeProfiles = Array.isArray(profiles) ? profiles.filter(Boolean) : [];
  const ungroupedCount = safeProfiles.filter(p => !p.group || p.group === 'Ungrouped' || p.group === 'Chưa phân nhóm').length;

  // Selected item label and color
  let currentLabel = t('profiles.allGroups', 'Tất cả nhóm');
  let currentColor = '#7C3AED';

  if (selectedGroup === 'Ungrouped') {
    currentLabel = t('profiles.ungrouped', 'Chưa phân nhóm');
    currentColor = '#64748B';
  } else if (selectedGroup !== 'All') {
    const matched = customGroups.find(g => g.name === selectedGroup);
    currentLabel = matched?.name || selectedGroup;
    currentColor = matched?.color || '#7C3AED';
  }

  // Count for current selection
  const currentCount = selectedGroup === 'All'
    ? safeProfiles.length
    : selectedGroup === 'Ungrouped'
      ? ungroupedCount
      : safeProfiles.filter(p => p.group === selectedGroup).length;

  // Filter custom groups by search
  const filteredCustomGroups = customGroups.filter(g => 
    !filterSearch.trim() || g.name.toLowerCase().includes(filterSearch.toLowerCase().trim())
  );

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          height: '32px',
          padding: '0 12px',
          borderRadius: '6px',
          border: isOpen ? '1px solid #7C3AED' : '1px solid #CBD5E1',
          backgroundColor: '#FFFFFF',
          fontSize: '12.5px',
          color: '#334155',
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(124, 58, 237, 0.12)' : 'none',
          transition: 'all 0.15s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#94A3B8';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.borderColor = '#CBD5E1';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }
        }}
      >
        <Folder size={15} style={{ color: currentColor, flexShrink: 0 }} />
        <span style={{
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontWeight: 600
        }}>
          {currentLabel}
        </span>
        <span style={{
          fontSize: '11px',
          color: '#64748B',
          background: '#F1F5F9',
          padding: '1.5px 6px',
          borderRadius: '4px',
          fontWeight: 600
        }}>
          {currentCount}
        </span>
        <ChevronDown
          size={13}
          style={{
            color: '#94A3B8',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s ease',
            flexShrink: 0
          }}
        />
      </button>

      {/* Popover Dropdown - Enhanced, Spacious & Clear */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 1000,
          width: '360px',
          maxHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 14px 35px -4px rgba(15, 23, 42, 0.18), 0 6px 14px -3px rgba(0, 0, 0, 0.08)',
          padding: '8px',
          animation: 'fadeIn 0.12s ease-out'
        }}>
          {/* Quick Search inside Groups if there are multiple groups */}
          {customGroups.length >= 3 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F8FAFC',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              padding: '0 10px',
              height: '32px',
              marginBottom: '6px',
              flexShrink: 0
            }}>
              <Search size={13} style={{ color: '#94A3B8', marginRight: '6px', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t('groups.searchPlaceholder', 'Tìm kiếm nhóm...')}
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '12px',
                  width: '100%',
                  backgroundColor: 'transparent',
                  color: '#334155'
                }}
              />
              {filterSearch && (
                <button
                  type="button"
                  onClick={() => setFilterSearch('')}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}

          {/* Scrollable Items Container */}
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Option: All */}
            {(!filterSearch || 'tất cả nhóm'.includes(filterSearch.toLowerCase()) || 'all'.includes(filterSearch.toLowerCase())) && (
              <div
                onClick={() => {
                  setSelectedGroup('All');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  backgroundColor: selectedGroup === 'All' ? '#F3E8FF' : 'transparent',
                  color: selectedGroup === 'All' ? '#7C3AED' : '#1E293B',
                  fontSize: '13px',
                  fontWeight: selectedGroup === 'All' ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedGroup !== 'All') e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (selectedGroup !== 'All') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Folder size={14} style={{ color: '#7C3AED' }} />
                  </div>
                  <span>{t('profiles.allGroups', 'Tất cả nhóm')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    color: selectedGroup === 'All' ? '#7C3AED' : '#64748B',
                    fontWeight: 600,
                    backgroundColor: selectedGroup === 'All' ? '#EDE9FE' : '#F1F5F9',
                    padding: '2px 7px',
                    borderRadius: '5px'
                  }}>
                    {safeProfiles.length}
                  </span>
                  {selectedGroup === 'All' && <Check size={14} style={{ color: '#7C3AED' }} />}
                </div>
              </div>
            )}

            {/* Option: Ungrouped */}
            {(!filterSearch || 'chưa phân nhóm'.includes(filterSearch.toLowerCase()) || 'ungrouped'.includes(filterSearch.toLowerCase())) && (
              <div
                onClick={() => {
                  setSelectedGroup('Ungrouped');
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  backgroundColor: selectedGroup === 'Ungrouped' ? '#F3E8FF' : 'transparent',
                  color: selectedGroup === 'Ungrouped' ? '#7C3AED' : '#1E293B',
                  fontSize: '13px',
                  fontWeight: selectedGroup === 'Ungrouped' ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedGroup !== 'Ungrouped') e.currentTarget.style.backgroundColor = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  if (selectedGroup !== 'Ungrouped') e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    backgroundColor: '#F1F5F9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Folder size={14} style={{ color: '#64748B' }} />
                  </div>
                  <span>{t('profiles.ungrouped', 'Chưa phân nhóm')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11.5px',
                    color: selectedGroup === 'Ungrouped' ? '#7C3AED' : '#64748B',
                    fontWeight: 600,
                    backgroundColor: selectedGroup === 'Ungrouped' ? '#EDE9FE' : '#F1F5F9',
                    padding: '2px 7px',
                    borderRadius: '5px'
                  }}>
                    {ungroupedCount}
                  </span>
                  {selectedGroup === 'Ungrouped' && <Check size={14} style={{ color: '#7C3AED' }} />}
                </div>
              </div>
            )}

            {/* Divider & Header */}
            <div style={{
              height: '1px',
              backgroundColor: '#F1F5F9',
              margin: '6px 4px'
            }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 8px 4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <span>{t('groups.customGroups', 'Nhóm tùy chỉnh')} ({customGroups.length})</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (setActiveGroupModal) setActiveGroupModal({ mode: 'create' });
                  setIsOpen(false);
                }}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#7C3AED',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  transition: 'background 0.12s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDE9FE'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Plus size={13} /> {t('common.add', 'Thêm')}
              </button>
            </div>

            {/* Custom Groups List */}
            {filteredCustomGroups.length === 0 ? (
              <div style={{
                padding: '12px 10px',
                fontSize: '12px',
                color: '#94A3B8',
                textAlign: 'center'
              }}>
                {filterSearch ? 'Không tìm thấy nhóm phù hợp' : t('groups.empty', 'Chưa có nhóm tùy chỉnh nào')}
              </div>
            ) : (
              filteredCustomGroups.map(g => {
                const isSelected = selectedGroup === g.name;
                const isHovered = hoveredGroupId === g.name;
                const count = safeProfiles.filter(p => p.group === g.name).length;
                const groupColor = g.color || '#7C3AED';

                return (
                  <div
                    key={g.id || g.name}
                    onClick={() => {
                      setSelectedGroup(g.name);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHoveredGroupId(g.name)}
                    onMouseLeave={() => setHoveredGroupId(null)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: isSelected ? '#F3E8FF' : (isHovered ? '#F8FAFC' : 'transparent'),
                      color: isSelected ? '#7C3AED' : '#1E293B',
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1, marginRight: '8px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        backgroundColor: `${groupColor}1A`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Folder size={14} style={{ color: groupColor }} />
                      </div>
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0
                      }}>
                        {g.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {/* Action buttons on hover */}
                      {isHovered && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (setActiveGroupModal) setActiveGroupModal({ mode: 'edit', group: g });
                              setIsOpen(false);
                            }}
                            title={t('common.edit', 'Sửa nhóm')}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: '3px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#7C3AED'; e.currentTarget.style.backgroundColor = '#EDE9FE'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (setDeleteConfirmGroup) setDeleteConfirmGroup(g);
                              setIsOpen(false);
                            }}
                            title={t('common.delete', 'Xóa nhóm')}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#64748B',
                              cursor: 'pointer',
                              padding: '3px',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}

                      <span style={{
                        fontSize: '11.5px',
                        color: isSelected ? '#7C3AED' : '#64748B',
                        fontWeight: 600,
                        backgroundColor: isSelected ? '#EDE9FE' : '#F1F5F9',
                        padding: '2px 7px',
                        borderRadius: '5px'
                      }}>
                        {count}
                      </span>
                      {isSelected && <Check size={14} style={{ color: '#7C3AED' }} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Action: Create New Group */}
          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #F1F5F9', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                if (setActiveGroupModal) setActiveGroupModal({ mode: 'create' });
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px dashed #CBD5E1',
                background: 'transparent',
                color: '#7C3AED',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7C3AED';
                e.currentTarget.style.backgroundColor = '#FAF5FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Plus size={14} /> {t('groups.newGroup', 'Tạo nhóm mới')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
