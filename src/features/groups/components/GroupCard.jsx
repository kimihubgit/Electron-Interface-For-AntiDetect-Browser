import React from 'react';
import { FolderTree, Pencil, Trash2, ArrowRight, Layers } from 'lucide-react';
import { useTranslation } from '../../../i18n/I18nContext';

export default function GroupCard({
  group,
  profiles = [],
  onSelectGroup,
  onEditGroup,
  onDeleteGroup
}) {
  const { t } = useTranslation();
  const groupProfiles = profiles.filter(p => p.group === group.name);
  const totalCount = groupProfiles.length;
  const runningCount = groupProfiles.filter(p => p.status === 'running').length;
  const color = group.color || '#7C3AED';

  return (
    <div
      onClick={() => onSelectGroup(group.name)}
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
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                {t('groups.profileCount', { count: totalCount })}
              </span>
            </div>
          </div>

          {/* Right: Action buttons (Edit, Delete) */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => onEditGroup(group, e)}
              title={t('groups.editGroup', 'Chỉnh sửa thông tin nhóm')}
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
                onDeleteGroup(group);
              }}
              title={t('groups.deleteGroup', 'Xóa nhóm')}
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
          {group.name}
        </h3>

        {/* Group Description */}
        <p style={{
          fontSize: '12.5px',
          color: group.desc ? '#6B7280' : '#9CA3AF',
          lineHeight: '1.5',
          margin: 0,
          minHeight: '36px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontStyle: group.desc ? 'normal' : 'italic'
        }}>
          {group.desc || t('groups.noDesc', 'Chưa có mô tả chi tiết cho nhóm này')}
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
              {t('groups.runningCount', { count: runningCount })}
            </span>
          ) : (
            <span>{t('groups.allIdle', { count: totalCount })}</span>
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
          {t('groups.viewProfiles', 'Xem hồ sơ')} <ArrowRight size={13} />
        </span>
      </div>
    </div>
  );
}
