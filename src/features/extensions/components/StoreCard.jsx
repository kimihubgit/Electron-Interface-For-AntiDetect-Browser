import React from 'react';
import { Puzzle, Star, ExternalLink, Check, RotateCw, Download } from 'lucide-react';

export default function StoreCard({
  item,
  isInstalled,
  isDownloading,
  onAddFromStore
}) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#CBD5E1';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.02)';
      }}
    >
      {/* Item Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: `${item.iconColor}15`,
            border: `1px solid ${item.iconColor}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Puzzle size={22} color={item.iconColor} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#0F172A',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={item.name}
          >
            {item.name}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '2px',
              fontSize: '11px',
              color: '#64748B'
            }}
          >
            <span>{item.author}</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
              <Star size={10} fill="#F59E0B" />
              {item.rating}
            </span>
            <span>•</span>
            <span>{item.users}</span>
          </div>
        </div>
      </div>

      {/* Item Description */}
      <p
        style={{
          fontSize: '12px',
          color: '#475569',
          lineHeight: '1.45',
          margin: 0,
          minHeight: '36px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {item.description}
      </p>

      {/* Bottom Action: Install / Added */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '10px'
        }}
      >
        <span style={{ fontSize: '11px', color: '#94A3B8' }}>
          Kích thước: {item.size}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.storeUrl && (
            <a
              href={item.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Xem trên Chrome Web Store"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                textDecoration: 'none'
              }}
            >
              <ExternalLink size={13} />
            </a>
          )}

          {isInstalled ? (
            <button
              disabled
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #BBF7D0',
                backgroundColor: '#F0FDF4',
                color: '#16A34A',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'default'
              }}
            >
              <Check size={13} />
              <span>Đã cài đặt</span>
            </button>
          ) : (
            <button
              onClick={() => onAddFromStore(item)}
              disabled={isDownloading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isDownloading ? '#A78BFA' : '#7C3AED',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: isDownloading ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 4px rgba(124, 58, 237, 0.2)',
                transition: 'all 0.15s ease'
              }}
            >
              {isDownloading ? (
                <>
                  <RotateCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  <span>Cài vào Manager</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
