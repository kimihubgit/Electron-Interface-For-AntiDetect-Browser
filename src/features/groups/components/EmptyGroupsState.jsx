import React from 'react';
import { FolderTree } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

export default function EmptyGroupsState({ onOpenCreateModal }) {
  const { t } = useTranslation();

  return (
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
        {t('groups.noGroups', 'Chưa có nhóm hồ sơ nào')}
      </div>
      <div style={{ fontSize: '13px', color: '#6B7280', maxWidth: '360px' }}>
        {t('groups.emptyGroup', 'Tạo nhóm đầu tiên để dễ dàng phân loại và quản lý các profile tài khoản.')}
      </div>
      <button
        onClick={onOpenCreateModal}
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
        + {t('groups.newGroup', 'Thêm nhóm mới')}
      </button>
    </div>
  );
}
