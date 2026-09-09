import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Folder, 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

const PRESET_COLORS = [
  { label: 'Tím APIDog', value: '#7C3AED' },
  { label: 'Xanh dương', value: '#3B82F6' },
  { label: 'Cyan nước biển', value: '#06B6D4' },
  { label: 'Xanh lá ngọc', value: '#10B981' },
  { label: 'Cam hổ phách', value: '#F59E0B' },
  { label: 'Hồng neon', value: '#EC4899' },
  { label: 'Đỏ san hô', value: '#EF4444' },
  { label: 'Chàm Indigo', value: '#6366F1' },
];

export default function GroupsPage() {
  const { 
    profiles = [], 
    customGroups = [], 
    addGroup, 
    editGroup, 
    deleteGroup, 
    setActiveTab, 
    setSelectedGroup,
    activeGroupModal,
    setActiveGroupModal
  } = useBrowser();

  const [deleteConfirmGroup, setDeleteConfirmGroup] = useState(null);

  // Form state for Create / Edit Modal
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    color: '#7C3AED'
  });
  const [formError, setFormError] = useState('');

  // Sync modal state when activeGroupModal changes
  useEffect(() => {
    if (activeGroupModal) {
      if (activeGroupModal.mode === 'edit' && activeGroupModal.group) {
        setFormData({
          name: activeGroupModal.group.name || '',
          desc: activeGroupModal.group.desc || '',
          color: activeGroupModal.group.color || '#7C3AED'
        });
      } else {
        setFormData({
          name: '',
          desc: '',
          color: '#7C3AED'
        });
      }
      setFormError('');
    }
  }, [activeGroupModal]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setActiveGroupModal({ mode: 'create' });
  };

  // Open Edit Modal
  const handleOpenEditModal = (group, e) => {
    e?.stopPropagation();
    setActiveGroupModal({ mode: 'edit', group });
  };

  // Close Modal
  const handleCloseModal = () => {
    setActiveGroupModal(null);
    setFormError('');
  };

  // Submit Form
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) {
      setFormError('Vui lòng nhập tên nhóm!');
      return;
    }

    if (activeGroupModal?.mode === 'create') {
      const result = addGroup({
        name,
        desc: formData.desc.trim(),
        color: formData.color
      });
      if (!result) {
        setFormError(`Nhóm "${name}" đã tồn tại. Vui lòng chọn tên khác!`);
        return;
      }
    } else if (activeGroupModal?.mode === 'edit' && activeGroupModal.group) {
      const success = editGroup(activeGroupModal.group.id, {
        name,
        desc: formData.desc.trim(),
        color: formData.color
      });
      if (!success) {
        setFormError(`Tên nhóm "${name}" bị trùng hoặc không hợp lệ!`);
        return;
      }
    }

    handleCloseModal();
  };

  // Delete Group
  const handleConfirmDelete = () => {
    if (!deleteConfirmGroup) return;
    deleteGroup(deleteConfirmGroup.id);
    setDeleteConfirmGroup(null);
  };

  return (
    <div style={{
      padding: '24px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: '100%',
      overflowY: 'auto',
      backgroundColor: '#FAFAFA',
      boxSizing: 'border-box'
    }}>
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER (Clean, No Search, No Stats Ribbon)
         ───────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        padding: '18px 24px',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#EDE9FE',
            color: '#7C3AED',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FolderTree size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: 0 }}>
                Quản Lý Nhóm Hồ Sơ
              </h2>
              <span style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11.5px',
                fontWeight: 700,
                backgroundColor: '#EDE9FE',
                color: '#7C3AED'
              }}>
                {customGroups.length} nhóm
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0 0' }}>
              Tổ chức và phân loại hồ sơ trình duyệt theo từng chiến dịch, mục đích chạy
            </p>
          </div>
        </div>

        {/* Action Button: Add Group */}
        <button
          onClick={handleOpenCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            height: '38px',
            padding: '0 18px',
            borderRadius: '8px',
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)',
            transition: 'background-color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6D28D9'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#7C3AED'}
        >
          <Plus size={16} />
          <span>Thêm nhóm mới</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. GROUPS GRID (Displays total profiles clearly on each card)
         ───────────────────────────────────────────────────────────── */}
      {customGroups.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px dashed #D1D5DB',
          padding: '60px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: '#F3F4F6',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FolderTree size={28} />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#374151' }}>
            Chưa có nhóm hồ sơ nào
          </div>
          <div style={{ fontSize: '13px', color: '#6B7280', maxWidth: '360px' }}>
            Tạo nhóm đầu tiên để dễ dàng phân loại và quản lý các profile tài khoản.
          </div>
          <button
            onClick={handleOpenCreateModal}
            style={{
              marginTop: '10px',
              padding: '9px 20px',
              borderRadius: '8px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            + Thêm nhóm ngay
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {customGroups.map((g) => {
            const groupProfiles = profiles.filter(p => p.group === g.name);
            const totalCount = groupProfiles.length;
            const runningCount = groupProfiles.filter(p => p.status === 'running').length;
            const color = g.color || '#7C3AED';

            return (
              <div
                key={g.id || g.name}
                onClick={() => {
                  setSelectedGroup(g.name);
                  setActiveTab('profiles');
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '22px',
                  borderRadius: '12px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 6px 20px ${color}20`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Card Header: Icon, Total Profile Count Badge, Action Buttons */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px'
                  }}>
                    {/* Left: Icon & Total count badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: `${color}15`,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FolderTree size={22} />
                      </div>

                      {/* Prominent total profile display */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: `${color}15`,
                          color: color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <Layers size={13} />
                          Tổng: {totalCount} profile
                        </span>
                      </div>
                    </div>

                    {/* Right: Action buttons (Edit, Delete) */}
                    <div 
                      style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleOpenEditModal(g, e)}
                        title="Chỉnh sửa thông tin nhóm"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#F9FAFB',
                          color: '#4B5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#EDE9FE';
                          e.currentTarget.style.color = '#7C3AED';
                          e.currentTarget.style.borderColor = '#C4B5FD';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.color = '#4B5563';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }}
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmGroup(g);
                        }}
                        title="Xóa nhóm"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: '#F9FAFB',
                          color: '#EF4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#FEE2E2';
                          e.currentTarget.style.borderColor = '#FCA5A5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#F9FAFB';
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Group Name */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      display: 'inline-block'
                    }} />
                    {g.name}
                  </h3>

                  {/* Group Description */}
                  <p style={{
                    fontSize: '12.5px',
                    color: g.desc ? '#6B7280' : '#9CA3AF',
                    lineHeight: '1.5',
                    margin: 0,
                    minHeight: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontStyle: g.desc ? 'normal' : 'italic'
                  }}>
                    {g.desc || 'Chưa có mô tả chi tiết cho nhóm này'}
                  </p>
                </div>

                {/* Bottom Bar: Running Status & Enter link */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {runningCount > 0 ? (
                      <span style={{ color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                        {runningCount} profile đang mở
                      </span>
                    ) : (
                      <span>Tất cả đang nghỉ ({totalCount})</span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    Xem hồ sơ <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Quick "+ Thêm nhóm mới" Card */}
          <div
            onClick={handleOpenCreateModal}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '2px dashed #E5E7EB',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              minHeight: '180px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#7C3AED';
              e.currentTarget.style.backgroundColor = '#FAF5FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={24} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#374151' }}>
                Tạo thêm nhóm mới
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>
                Phân loại theo chiến dịch, tài khoản...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. CREATE / EDIT MODAL
         ───────────────────────────────────────────────────────────── */}
      {activeGroupModal && (
        <div style={{
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
          padding: '16px'
        }}>
          <div 
            style={{
              width: '460px',
              maxWidth: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              border: '1px solid #E5E7EB',
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F9FAFB'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: `${formData.color}18`,
                  color: formData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activeGroupModal.mode === 'create' ? <Plus size={18} /> : <Pencil size={17} />}
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: 700, color: '#111827', margin: 0 }}>
                    {activeGroupModal.mode === 'create' ? 'Tạo Nhóm Hồ Sơ Mới' : 'Chỉnh Sửa Nhóm Hồ Sơ'}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: '#6B7280', margin: '2px 0 0 0' }}>
                    {activeGroupModal.mode === 'create' 
                      ? 'Thiết lập tên và màu sắc nhận diện cho nhóm mới' 
                      : `Đang sửa thông tin nhóm: "${activeGroupModal.group?.name}"`
                    }
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} style={{ padding: '22px' }}>
              {formError && (
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertTriangle size={15} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Tên nhóm */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  Tên nhóm <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Facebook Ads BM, TikTok Shop VN, Crypto..."
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    if (formError) setFormError('');
                  }}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    height: '38px',
                    padding: '0 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              {/* Mô tả nhóm */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  Mô tả nhóm <span style={{ fontSize: '11.5px', fontWeight: 400, color: '#9CA3AF' }}>(Không bắt buộc)</span>
                </label>
                <textarea
                  placeholder="Mô tả mục đích, danh sách tài khoản hoặc ghi chú quản lý..."
                  value={formData.desc}
                  onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '13px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    boxSizing: 'border-box',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              {/* Màu sắc nhận diện */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                  Màu sắc nhận diện
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(c => {
                    const isSelected = formData.color.toLowerCase() === c.value.toLowerCase();
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                        title={c.label}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: c.value,
                          border: isSelected ? '2px solid #111827' : '2px solid transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: '#FFFFFF',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {isSelected && <Check size={16} strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Box */}
              <div style={{
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: `${formData.color}18`,
                  color: formData.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FolderTree size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600 }}>XEM TRƯỚC HIỂN THỊ</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
                    {formData.name.trim() || 'Tên nhóm hiển thị'}
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    backgroundColor: `${formData.color}15`,
                    color: formData.color
                  }}>
                    Tổng: 0 profile
                  </span>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#7C3AED',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(124, 58, 237, 0.25)'
                  }}
                >
                  <Check size={16} />
                  <span>{activeGroupModal.mode === 'create' ? 'Tạo nhóm mới' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DELETE CONFIRMATION MODAL
         ───────────────────────────────────────────────────────────── */}
      {deleteConfirmGroup && (
        <div style={{
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
          padding: '16px'
        }}>
          <div style={{
            width: '440px',
            maxWidth: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            animation: 'fadeIn 0.15s ease'
          }}>
            {/* Header */}
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#FEF2F2'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                  Xác Nhận Xóa Nhóm
                </h3>
                <p style={{ fontSize: '11.5px', color: '#B91C1C', margin: '2px 0 0 0' }}>
                  Hành động này sẽ xóa nhóm khỏi danh sách phân loại
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '22px' }}>
              <p style={{ fontSize: '13.5px', color: '#1F2937', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                Bạn có chắc chắn muốn xóa nhóm <strong style={{ color: '#7C3AED' }}>"{deleteConfirmGroup.name}"</strong>?
              </p>

              {(() => {
                const count = profiles.filter(p => p.group === deleteConfirmGroup.name).length;
                if (count > 0) {
                  return (
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FCD34D',
                      fontSize: '12.5px',
                      color: '#92400E',
                      lineHeight: '1.5'
                    }}>
                      ⚠️ <strong>An toàn dữ liệu:</strong> Nhóm này đang chứa <strong>{count} hồ sơ</strong>. 
                      Khi xóa, toàn bộ {count} hồ sơ này sẽ được tự động chuyển sang nhóm <strong>"Chung"</strong>. 
                      Hồ sơ, proxy, cookies và cấu hình vân tay của bạn được bảo toàn 100%.
                    </div>
                  );
                } else {
                  return (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#F3F4F6',
                      fontSize: '12px',
                      color: '#4B5563'
                    }}>
                      Nhóm này hiện chưa có hồ sơ nào.
                    </div>
                  );
                }
              })()}

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmGroup(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  <Trash2 size={15} />
                  <span>Xóa nhóm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
