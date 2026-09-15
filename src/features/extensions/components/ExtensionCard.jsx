import React from 'react';
import { Puzzle, Layers, RotateCw, FolderOpen, Trash2 } from 'lucide-react';

export default function ExtensionCard({
  ext,
  profilesCount,
  onToggle,
  onOpenFolder,
  onOpenAssignModal,
  onOpenUpdateModal,
  onDelete
}) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        padding: '14px 16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '12px',
        transition: 'all 0.15s ease',
        boxSizing: 'border-box'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#CBD5E1';
        e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
      }}
    >
      {/* Top Row: Icon, Name, Version, Toggle */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: `${ext.iconColor || '#7C3AED'}15`,
              border: `1px solid ${ext.iconColor || '#7C3AED'}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden'
            }}
          >
            {ext.iconDataUrl ? (
              <img
                src={ext.iconDataUrl}
                alt={ext.name}
                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
              />
            ) : (
              <Puzzle size={20} color={ext.iconColor || '#7C3AED'} />
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={ext.name}
              >
                {ext.name}
              </h3>
              <span style={{ fontSize: '10px', color: '#94A3B8', flexShrink: 0 }}>
                v{ext.version}
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: '#64748B',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {ext.author || 'Chrome Extension'} •{' '}
              {ext.sourceType === 'file'
                ? 'Tệp cục bộ'
                : ext.sourceType === 'folder'
                ? 'Thư mục Unpacked'
                : 'Web Store'}
            </span>
          </div>
        </div>

        {/* Switch Toggle */}
        <div
          onClick={() => onToggle(ext.id)}
          style={{
            width: '36px',
            height: '20px',
            borderRadius: '10px',
            backgroundColor: ext.enabled ? '#10B981' : '#CBD5E1',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxSizing: 'border-box',
            flexShrink: 0
          }}
          title={ext.enabled ? 'Đang kích hoạt (Bấm để tắt)' : 'Đã tắt (Bấm để bật)'}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              transform: ext.enabled ? 'translateX(16px)' : 'translateX(0px)',
              transition: 'transform 0.2s'
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: '11.5px',
          color: '#475569',
          lineHeight: '1.45',
          margin: 0,
          minHeight: '34px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {ext.description}
      </p>

      {/* Profile Assignment Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748B',
          backgroundColor: '#F8FAFC',
          padding: '7px 10px',
          borderRadius: '6px'
        }}
      >
        <button
          type="button"
          onClick={() => onOpenAssignModal(ext)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            border: 'none',
            background: 'transparent',
            color: '#7C3AED',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0
          }}
          title="Bấm để cấu hình profile áp dụng"
        >
          <Layers size={12} />
          <span>
            {!ext.targetProfileIds || ext.targetProfileIds.length === 0
              ? `Tất cả (${profilesCount}) profiles`
              : `${ext.targetProfileIds.length} profiles chỉ định`}
          </span>
        </button>
        <span>{ext.size || '2.0 MB'}</span>
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '8px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => onOpenUpdateModal(ext)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <RotateCw size={11} />
            <span>Cập nhật</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenFolder(ext)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <FolderOpen size={11} />
            <span>Thư mục</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            onClick={() => onDelete(ext.id, ext.name)}
            title="Gỡ bỏ tiện ích này"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: '1px solid #FEE2E2',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
