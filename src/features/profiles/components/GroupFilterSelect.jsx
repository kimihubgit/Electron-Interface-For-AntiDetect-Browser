import React, { useState, useRef, useEffect } from 'react';
import { Folder, ChevronDown, Plus, Pencil, Trash2, Check } from 'lucide-react';
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
  const dropdownRef = useRef(null);

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

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          height: '32px',
          padding: '0 10px',
          borderRadius: '6px',
          border: '1px solid #CBD5E1',
          backgroundColor: '#FFFFFF',
          fontSize: '12px',
          color: '#334155',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.15s ease',
          userSelect: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#94A3B8';
          e.currentTarget.style.backgroundColor = '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#CBD5E1';
          e.currentTarget.style.backgroundColor = '#FFFFFF';
        }}
      >
        <Folder size={14} style={{ color: currentColor, flexShrink: 0 }} />
        <span style={{
          maxWidth: '120px',
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
          padding: '1px 5px',
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

      {/* Popover Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          zIndex: 1000,
          minWidth: '250px',
          maxHeight: '360px',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '5px',
          animation: 'fadeIn 0.12s ease'
        }}>
          {/* Option: All */}
          <div
            onClick={() => {
              setSelectedGroup('All');
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 9px',
              borderRadius: '5px',
              backgroundColor: selectedGroup === 'All' ? '#F3E8FF' : 'transparent',
              color: selectedGroup === 'All' ? '#7C3AED' : '#334155',
              fontSize: '12px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Folder size={14} style={{ color: '#7C3AED' }} />
              <span>{t('profiles.allGroups', 'Tất cả nhóm')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{safeProfiles.length}</span>
              {selectedGroup === 'All' && <Check size={13} style={{ color: '#7C3AED' }} />}
            </div>
          </div>

          {/* Option: Ungrouped */}
          <div
            onClick={() => {
              setSelectedGroup('Ungrouped');
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '7px 9px',
              borderRadius: '5px',
              backgroundColor: selectedGroup === 'Ungrouped' ? '#F3E8FF' : 'transparent',
              color: selectedGroup === 'Ungrouped' ? '#7C3AED' : '#334155',
              fontSize: '12px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Folder size={14} style={{ color: '#94A3B8' }} />
              <span>{t('profiles.ungrouped', 'Chưa phân nhóm')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>{ungroupedCount}</span>
              {selectedGroup === 'Ungrouped' && <Check size={13} style={{ color: '#7C3AED' }} />}
            </div>
          </div>

          {/* Divider & Header */}
          <div style={{
            height: '1px',
            backgroundColor: '#F1F5F9',
            margin: '4px 0'
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 8px 2px 8px',
            fontSize: '10.5px',
            fontWeight: 700,
            color: '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            <span>{t('groups.customGroups', 'Nhóm tùy chỉnh')}</span>
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
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 4px',
                borderRadius: '3px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EDE9FE'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Plus size={12} /> {t('common.add', 'Thêm')}
            </button>
          </div>

          {/* Custom Groups List */}
          {customGroups.length === 0 ? (
            <div style={{
              padding: '8px 10px',
              fontSize: '11.5px',
              color: '#94A3B8',
              textAlign: 'center'
            }}>
              {t('groups.empty', 'Chưa có nhóm tùy chỉnh nào')}
            </div>
          ) : (
            customGroups.map(g => {
              const isSelected = selectedGroup === g.name;
              const isHovered = hoveredGroupId === g.name;
              const count = safeProfiles.filter(p => p.group === g.name).length;

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
                    padding: '6px 9px',
                    borderRadius: '5px',
                    backgroundColor: isSelected ? '#F3E8FF' : (isHovered ? '#F8FAFC' : 'transparent'),
                    color: isSelected ? '#7C3AED' : '#334155',
                    fontSize: '12px',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, marginRight: '6px' }}>
                    <Folder size={14} style={{ color: g.color || '#7C3AED', flexShrink: 0 }} />
                    <span style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0
                    }}>
                      {g.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {isHovered && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
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
                            padding: '2px',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#7C3AED'; e.currentTarget.style.backgroundColor = '#EDE9FE'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Pencil size={11} />
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
                            padding: '2px',
                            borderRadius: '3px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626'; e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{count}</span>
                    {isSelected && <Check size={13} style={{ color: '#7C3AED' }} />}
                  </div>
                </div>
              );
            })
          )}

          {/* Bottom Action: Create Group */}
          <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #F1F5F9' }}>
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
                gap: '5px',
                width: '100%',
                padding: '6px',
                borderRadius: '5px',
                border: '1px dashed #CBD5E1',
                background: 'transparent',
                color: '#7C3AED',
                fontSize: '11.5px',
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
              <Plus size={12} /> {t('groups.newGroup', 'Tạo nhóm mới')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
