import React from 'react';
import { FolderTree, Plus } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

export default function GroupsHeader({ totalCount, onOpenCreateModal }) {
  const { t } = useTranslation();

  return (
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
              {t('groups.title', 'Quản Lý Nhóm Hồ Sơ')}
            </h2>
            <span style={{
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11.5px',
              fontWeight: 700,
              backgroundColor: '#EDE9FE',
              color: '#7C3AED'
            }}>
              {t('groups.totalGroups', { count: totalCount })}
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#6B7280', margin: '3px 0 0 0' }}>
            {t('groups.subtitle', 'Tổ chức và phân loại hồ sơ trình duyệt theo từng chiến dịch, mục đích chạy')}
          </p>
        </div>
      </div>

      {/* Action Button: Add Group */}
      <button
        onClick={onOpenCreateModal}
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
        <span>{t('groups.newGroup', 'Thêm nhóm mới')}</span>
      </button>
    </div>
  );
}
