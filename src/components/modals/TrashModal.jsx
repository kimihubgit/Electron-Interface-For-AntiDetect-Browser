import React, { useState, useMemo } from 'react';
import { 
  X, 
  Filter, 
  RotateCcw, 
  Trash2, 
  Globe, 
  Clock, 
  ChevronDown, 
  User, 
  Check, 
  AlertCircle,
  Folder,
  Layers,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';
import { useTranslation } from '../../i18n/I18nContext';

export default function TrashModal() {
  const { t } = useTranslation();
  const { 
    activeTrashModal, 
    setActiveTrashModal, 
    trashProfiles = [], 
    restoreProfile, 
    restoreMultipleProfiles, 
    permanentlyDeleteProfile, 
    permanentlyDeleteMultipleProfiles,
    emptyTrash 
  } = useBrowser();

  // Modal size state
  const [isMaximized, setIsMaximized] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOperator, setSelectedOperator] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');

  // Active filter popover dropdown: null | 'category' | 'operator' | 'branch'
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Selected row IDs for batch actions
  const [selectedIds, setSelectedIds] = useState([]);

  // Extract unique options for filters
  const categories = useMemo(() => {
    const list = trashProfiles.map(p => p.category || p.group || 'Chung').filter(Boolean);
    return ['All', ...new Set(list)];
  }, [trashProfiles]);

  const operators = useMemo(() => {
    const list = trashProfiles.map(p => p.operator || 'Thành viên').filter(Boolean);
    return ['All', ...new Set(list)];
  }, [trashProfiles]);

  const branchVersions = useMemo(() => {
    const list = trashProfiles.map(p => p.branchVersion || `${p.browser || 'Chrome 128'} / ${p.os || 'Windows'}`).filter(Boolean);
    return ['All', ...new Set(list)];
  }, [trashProfiles]);

  // Filtered profiles
  const filteredList = useMemo(() => {
    return trashProfiles.filter(p => {
      const cat = p.category || p.group || 'Chung';
      const op = p.operator || 'Thành viên';
      const bv = p.branchVersion || `${p.browser || 'Chrome 128'} / ${p.os || 'Windows'}`;

      if (selectedCategory !== 'All' && cat !== selectedCategory) return false;
      if (selectedOperator !== 'All' && op !== selectedOperator) return false;
      if (selectedBranch !== 'All' && bv !== selectedBranch) return false;
      return true;
    });
  }, [trashProfiles, selectedCategory, selectedOperator, selectedBranch]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedOperator('All');
    setSelectedBranch('All');
    setActiveDropdown(null);
  };

  const isFilterActive = selectedCategory !== 'All' || selectedOperator !== 'All' || selectedBranch !== 'All';

  // Selection handlers
  const isAllSelected = filteredList.length > 0 && selectedIds.length === filteredList.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map(p => p.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  if (!activeTrashModal) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'fadeInModal 0.15s ease'
      }}
      onClick={() => {
        setActiveTrashModal(false);
        setActiveDropdown(null);
      }}
    >
      {/* Modal Dialog Container matching exact screenshot design */}
      <div 
        style={{
          width: isMaximized ? '99vw' : '96vw',
          maxWidth: isMaximized ? 'none' : '1480px',
          height: isMaximized ? '98vh' : '90vh',
          maxHeight: isMaximized ? 'none' : '940px',
          backgroundColor: '#FFFFFF',
          borderRadius: isMaximized ? '8px' : '14px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
          position: 'relative',
          transition: 'width 0.2s ease, height 0.2s ease, max-width 0.2s ease'
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (activeDropdown && !e.target.closest('.trash-dropdown-btn') && !e.target.closest('.trash-dropdown-menu')) {
            setActiveDropdown(null);
          }
        }}
      >
        {/* Header: Title and Close / Maximize buttons */}
        <div style={{
          height: '52px',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#1E293B' }}>
              {t('trash.title', 'Trash')}
            </span>
            <span style={{ 
              fontSize: '11.5px', 
              color: '#64748B', 
              backgroundColor: '#F1F5F9', 
              padding: '2px 8px', 
              borderRadius: '10px',
              fontWeight: 500
            }}>
              {t('trash.deletedCount', { count: trashProfiles.length })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsMaximized(prev => !prev)}
              title={isMaximized ? "Thu nhỏ kích thước" : "Phóng to toàn màn hình"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={() => setActiveTrashModal(false)}
              title="Đóng (Esc)"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '5px',
                borderRadius: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94A3B8';
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Category, Operator, Branch/Version, Reset) */}
        <div style={{
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          position: 'relative'
        }}>
          {/* Filter 1: Category */}
          <div style={{ position: 'relative' }}>
            <button
              className="trash-dropdown-btn"
              onClick={() => setActiveDropdown(prev => prev === 'category' ? null : 'category')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                border: selectedCategory !== 'All' ? '1px solid var(--apidog-purple)' : '1px dashed #CBD5E1',
                borderRadius: '6px',
                backgroundColor: selectedCategory !== 'All' ? '#F5F3FF' : '#FFFFFF',
                color: selectedCategory !== 'All' ? 'var(--apidog-purple)' : '#475569',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Filter size={13} style={{ color: selectedCategory !== 'All' ? 'var(--apidog-purple)' : '#64748B' }} />
              <span>{selectedCategory === 'All' ? 'Category' : `Category: ${selectedCategory}`}</span>
              <ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>

            {activeDropdown === 'category' && (
              <div 
                className="trash-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '7px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                  minWidth: '160px',
                  zIndex: 20,
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {categories.map(cat => (
                  <div
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveDropdown(null);
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selectedCategory === cat ? '#F5F3FF' : 'transparent',
                      color: selectedCategory === cat ? 'var(--apidog-purple)' : '#334155',
                      fontWeight: selectedCategory === cat ? 600 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (selectedCategory !== cat) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== cat) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{cat === 'All' ? 'Tất cả (All)' : cat}</span>
                    {selectedCategory === cat && <Check size={13} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter 2: Operator */}
          <div style={{ position: 'relative' }}>
            <button
              className="trash-dropdown-btn"
              onClick={() => setActiveDropdown(prev => prev === 'operator' ? null : 'operator')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                border: selectedOperator !== 'All' ? '1px solid var(--apidog-purple)' : '1px dashed #CBD5E1',
                borderRadius: '6px',
                backgroundColor: selectedOperator !== 'All' ? '#F5F3FF' : '#FFFFFF',
                color: selectedOperator !== 'All' ? 'var(--apidog-purple)' : '#475569',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Filter size={13} style={{ color: selectedOperator !== 'All' ? 'var(--apidog-purple)' : '#64748B' }} />
              <span>{selectedOperator === 'All' ? 'Operator' : `Operator: ${selectedOperator}`}</span>
              <ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>

            {activeDropdown === 'operator' && (
              <div 
                className="trash-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '7px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                  minWidth: '150px',
                  zIndex: 20,
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {operators.map(op => (
                  <div
                    key={op}
                    onClick={() => {
                      setSelectedOperator(op);
                      setActiveDropdown(null);
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selectedOperator === op ? '#F5F3FF' : 'transparent',
                      color: selectedOperator === op ? 'var(--apidog-purple)' : '#334155',
                      fontWeight: selectedOperator === op ? 600 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (selectedOperator !== op) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedOperator !== op) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{op === 'All' ? 'Tất cả (All)' : op}</span>
                    {selectedOperator === op && <Check size={13} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filter 3: Branch/Version */}
          <div style={{ position: 'relative' }}>
            <button
              className="trash-dropdown-btn"
              onClick={() => setActiveDropdown(prev => prev === 'branch' ? null : 'branch')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 11px',
                border: selectedBranch !== 'All' ? '1px solid var(--apidog-purple)' : '1px dashed #CBD5E1',
                borderRadius: '6px',
                backgroundColor: selectedBranch !== 'All' ? '#F5F3FF' : '#FFFFFF',
                color: selectedBranch !== 'All' ? 'var(--apidog-purple)' : '#475569',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Filter size={13} style={{ color: selectedBranch !== 'All' ? 'var(--apidog-purple)' : '#64748B' }} />
              <span>{selectedBranch === 'All' ? 'Branch/Version' : `Version: ${selectedBranch}`}</span>
              <ChevronDown size={11} style={{ opacity: 0.6 }} />
            </button>

            {activeDropdown === 'branch' && (
              <div 
                className="trash-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 5px)',
                  left: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '7px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12)',
                  minWidth: '180px',
                  zIndex: 20,
                  padding: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                {branchVersions.map(bv => (
                  <div
                    key={bv}
                    onClick={() => {
                      setSelectedBranch(bv);
                      setActiveDropdown(null);
                    }}
                    style={{
                      padding: '6px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: selectedBranch === bv ? '#F5F3FF' : 'transparent',
                      color: selectedBranch === bv ? 'var(--apidog-purple)' : '#334155',
                      fontWeight: selectedBranch === bv ? 600 : 400
                    }}
                    onMouseEnter={(e) => {
                      if (selectedBranch !== bv) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedBranch !== bv) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{bv === 'All' ? 'Tất cả (All)' : bv}</span>
                    {selectedBranch === bv && <Check size={13} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reset button (Purple text button) */}
          <button
            onClick={handleResetFilters}
            disabled={!isFilterActive}
            style={{
              background: 'none',
              border: 'none',
              color: isFilterActive ? '#7C3AED' : '#94A3B8',
              fontSize: '12.5px',
              fontWeight: 500,
              cursor: isFilterActive ? 'pointer' : 'default',
              padding: '4px 8px',
              borderRadius: '4px',
              transition: 'opacity 0.15s ease'
            }}
          >
            {t('trash.reset', 'Reset')}
          </button>

          {/* Quick Clear All Trash if has items */}
          {trashProfiles.length > 0 && (
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={emptyTrash}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  fontSize: '11.5px',
                  fontWeight: 500,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={12} />
                <span>{t('trash.clearTrash', 'Dọn sạch thùng rác')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Table Header Row (Matching exact layout: Checkbox, Name, Category, Branch/Version, Operator, Time Remaining, Action) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(260px, 2.8fr) 1.3fr 1.6fr 1.2fr 1.4fr 90px',
          alignItems: 'center',
          padding: '11px 24px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #F1F5F9',
          borderBottom: '1px solid #F1F5F9',
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#475569',
          flexShrink: 0
        }}>
          {/* Checkbox column with round outline style like in screenshot */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input 
              type="checkbox"
              checked={isAllSelected}
              onChange={toggleSelectAll}
              disabled={filteredList.length === 0}
              style={{
                width: '15px',
                height: '15px',
                cursor: filteredList.length > 0 ? 'pointer' : 'default',
                borderRadius: '50%',
                accentColor: 'var(--apidog-purple)'
              }}
            />
          </div>

          <div>{t('profiles.name', 'Tên')}</div>
          <div>{t('trash.category', 'Danh mục')}</div>
          <div>{t('trash.branchVersion', 'Phiên bản')}</div>
          <div>{t('trash.operator', 'Người xóa')}</div>
          <div>{t('trash.colRemainingTime', 'Thời gian còn lại')}</div>
          <div style={{ textAlign: 'center' }}>{t('common.actions', 'Thao tác')}</div>
        </div>

        {/* Table Body / Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {filteredList.length === 0 ? (
            /* Empty State matching screenshot basket wireframe */
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              userSelect: 'none'
            }}>
              {/* Basket SVG matching user screenshot */}
              <div style={{ marginBottom: '14px', opacity: 0.75 }}>
                <svg width="68" height="54" viewBox="0 0 68 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Outer basket wireframe */}
                  <path 
                    d="M20 18L13 36H55L48 18H20Z" 
                    stroke="#CBD5E1" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  <path 
                    d="M13 36L18 47C18.5 48 19.5 49 21 49H47C48.5 49 49.5 48 50 47L55 36" 
                    stroke="#CBD5E1" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Top handles */}
                  <path 
                    d="M24 18V12C24 9.8 25.8 8 28 8H40C42.2 8 44 9.8 44 12V18" 
                    stroke="#CBD5E1" 
                    strokeWidth="1.8" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                  {/* Basket perforations / dots */}
                  <circle cx="28" cy="42" r="1.4" fill="#CBD5E1" />
                  <circle cx="34" cy="42" r="1.4" fill="#CBD5E1" />
                  <circle cx="40" cy="42" r="1.4" fill="#CBD5E1" />
                </svg>
              </div>

              <div style={{
                fontSize: '12.5px',
                color: '#94A3B8',
                fontWeight: 400,
                textAlign: 'center'
              }}>
                {t('trash.noItems', 'Thùng rác trống. Không có hồ sơ nào bị xóa.')}
              </div>
            </div>
          ) : (
            /* Populated Rows */
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredList.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px minmax(260px, 2.8fr) 1.3fr 1.6fr 1.2fr 1.4fr 90px',
                      alignItems: 'center',
                      padding: '12px 24px',
                      borderBottom: '1px solid #F8FAFC',
                      fontSize: '13px',
                      color: '#334155',
                      backgroundColor: isSelected ? '#F5F3FF' : (idx % 2 === 1 ? '#FAFBFC' : '#FFFFFF'),
                      transition: 'background-color 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = idx % 2 === 1 ? '#FAFBFC' : '#FFFFFF';
                    }}
                  >
                    {/* Checkbox */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        style={{
                          width: '15px',
                          height: '15px',
                          cursor: 'pointer',
                          borderRadius: '50%',
                          accentColor: 'var(--apidog-purple)'
                        }}
                      />
                    </div>

                    {/* Name Column with Browser Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '5px',
                        backgroundColor: '#EEF2F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Globe size={13} style={{ color: '#475569' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ 
                          fontWeight: 500, 
                          color: '#0F172A',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} title={item.name}>
                          {item.name}
                        </span>
                        {item.proxy?.host && (
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                            Proxy: {item.proxy.host}:{item.proxy.port}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category Column */}
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#F1F5F9',
                        color: '#475569',
                        fontSize: '11px',
                        fontWeight: 500
                      }}>
                        {item.category || item.group || 'Chung'}
                      </span>
                    </div>

                    {/* Branch/Version Column */}
                    <div style={{ color: '#475569', fontSize: '12px' }}>
                      {item.branchVersion || `${item.browser || 'Chrome 128'} / ${item.os || 'Windows'}`}
                    </div>

                    {/* Operator Column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569' }}>
                      <User size={12} style={{ color: '#94A3B8' }} />
                      <span>{item.operator || 'Thành viên'}</span>
                    </div>

                    {/* Time Remaining Column */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: item.daysRemaining <= 7 ? '#DC2626' : '#64748B', fontSize: '12px' }}>
                      <Clock size={12} />
                      <span>{item.daysRemaining ? `${item.daysRemaining} days` : '30 days'}</span>
                    </div>

                    {/* Actions Column: Restore & Delete Permanently */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <button
                        onClick={() => restoreProfile(item.id)}
                        title={t('trash.restore', 'Khôi phục')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          color: '#475569',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#E0E7FF';
                          e.currentTarget.style.color = 'var(--apidog-purple)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#475569';
                        }}
                      >
                        <RotateCcw size={13} />
                      </button>

                      <button
                        onClick={() => permanentlyDeleteProfile(item.id)}
                        title={t('trash.deletePermanently', 'Xóa vĩnh viễn')}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '4px',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
                          e.currentTarget.style.color = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94A3B8';
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Batch Operations Bar when items are selected */}
        {selectedIds.length > 0 && (
          <div style={{
            padding: '12px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            animation: 'fadeInModal 0.15s ease'
          }}>
            <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 500 }}>
              {t('profiles.selected', 'Đã chọn')} <strong style={{ color: 'var(--apidog-purple)' }}>{selectedIds.length}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => {
                  restoreMultipleProfiles(selectedIds);
                  setSelectedIds([]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--apidog-purple)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)'
                }}
              >
                <RotateCcw size={13} />
                <span>{t('trash.restoreAll', 'Khôi phục các mục đã chọn')}</span>
              </button>

              <button
                onClick={() => {
                  permanentlyDeleteMultipleProfiles(selectedIds);
                  setSelectedIds([]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
              >
                <Trash2 size={13} />
                <span>{t('trash.deletePermanently', 'Xóa vĩnh viễn đã chọn')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
