import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

export default function QuickAddGroupCard({ onOpenCreateModal }) {
  const { t } = useTranslation();

  return (
    <div
      onClick={onOpenCreateModal}
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
          {t('groups.newGroup', 'Tạo thêm nhóm mới')}
        </div>
        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>
          {t('groups.subtitle', 'Phân loại theo chiến dịch, tài khoản...')}
        </div>
      </div>
    </div>
  );
}
