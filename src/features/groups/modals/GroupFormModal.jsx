import React, { useState, useEffect } from 'react';
import { Plus, Pencil, X, AlertTriangle, Check, FolderTree } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';
import { PRESET_COLORS } from '../data/groupConstants';
import { useModalShortcuts } from '../../../hooks/useModalShortcuts';

export default function GroupFormModal({
  activeGroupModal,
  onClose,
  onSubmit
}) {
  const { t } = useTranslation();
  useModalShortcuts(!!activeGroupModal, onClose);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    color: '#7C3AED'
  });
  const [formError, setFormError] = useState('');

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

  if (!activeGroupModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    if (!name) {
      setFormError('Vui lòng nhập tên nhóm!');
      return;
    }

    const err = onSubmit({
      name,
      desc: formData.desc.trim(),
      color: formData.color,
      mode: activeGroupModal.mode,
      group: activeGroupModal.group
    });

    if (err) {
      setFormError(err);
    }
  };

  return (
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
                {activeGroupModal.mode === 'create' ? t('groups.newGroup', 'Tạo Nhóm Hồ Sơ Mới') : t('groups.editGroup', 'Chỉnh Sửa Nhóm Hồ Sơ')}
              </h3>
              <p style={{ fontSize: '11.5px', color: '#6B7280', margin: '2px 0 0 0' }}>
                {activeGroupModal.mode === 'create' 
                  ? t('groups.createNewDesc', 'Thiết lập tên và màu sắc nhận diện cho nhóm mới') 
                  : t('groups.editingDesc', { name: activeGroupModal.group?.name })
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
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
        <form onSubmit={handleSubmit} style={{ padding: '22px' }}>
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
              {t('groups.groupName', 'Tên nhóm')} <span style={{ color: '#EF4444' }}>*</span>
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
              {t('groups.groupDesc', 'Mô tả')} <span style={{ fontSize: '11.5px', fontWeight: 400, color: '#9CA3AF' }}>({t('common.optional', 'Không bắt buộc')})</span>
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
              {t('groups.groupColor', 'Màu đại diện')}
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
              <div style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: 600 }}>{t('groups.previewTitle', 'XEM TRƯỚC HIỂN THỊ')}</div>
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
                {t('groups.profileCount', { count: 0 })}
              </span>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
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
              {t('common.cancel', 'Hủy bỏ')}
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
              <span>{activeGroupModal.mode === 'create' ? t('groups.newGroup', 'Tạo nhóm mới') : t('groups.saveChanges', 'Lưu thay đổi')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
