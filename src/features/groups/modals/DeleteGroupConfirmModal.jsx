import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

export default function DeleteGroupConfirmModal({
  group,
  profiles = [],
  onClose,
  onConfirm
}) {
  const { t } = useTranslation();

  if (!group) return null;

  const count = profiles.filter(p => p.group === group.name).length;

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
              {t('groups.deleteTitle', 'Xác Nhận Xóa Nhóm')}
            </h3>
            <p style={{ fontSize: '11.5px', color: '#B91C1C', margin: '2px 0 0 0' }}>
              {t('groups.deleteSubtitle', 'Hành động này sẽ xóa nhóm khỏi danh sách phân loại')}
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px' }}>
          <p style={{ fontSize: '13.5px', color: '#1F2937', lineHeight: '1.6', margin: '0 0 14px 0' }}>
            {t('groups.deletePrompt', { name: group.name })}
          </p>

          {count > 0 ? (
            <div style={{
              padding: '12px 14px',
              borderRadius: '8px',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FCD34D',
              fontSize: '12.5px',
              color: '#92400E',
              lineHeight: '1.5'
            }}>
              ⚠️ {t('groups.deleteWarning', { count })}
            </div>
          ) : (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#F3F4F6',
              fontSize: '12px',
              color: '#4B5563'
            }}>
              {t('groups.noProfiles', 'Nhóm này hiện chưa có hồ sơ nào.')}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px' }}>
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
              type="button"
              onClick={onConfirm}
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
              <span>{t('groups.deleteGroup', 'Xóa nhóm')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
