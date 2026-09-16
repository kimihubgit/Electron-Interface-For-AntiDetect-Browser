import React, { useMemo } from 'react';
import {
  Globe,
  Copy,
  Check,
  RotateCw,
  Pencil,
  Radio,
  Trash2,
  FileText,
  User,
  Loader2
} from 'lucide-react';
import CountryFlag from '../../../components/common/CountryFlag';

const ISO_LOCATIONS = {
  HK: { name: 'Hong Kong', city: 'Hong Kong' },
  DE: { name: 'Germany', city: 'Stuttgart' },
  JP: { name: 'Japan', city: 'Tokyo' },
  AM: { name: 'Armenia', city: 'Vanadzor' },
  US: { name: 'United States', city: 'Washington' },
  VN: { name: 'Vietnam', city: 'Ho Chi Minh' },
  SG: { name: 'Singapore', city: 'Singapore' },
  GB: { name: 'United Kingdom', city: 'London' },
  UK: { name: 'United Kingdom', city: 'London' },
  FR: { name: 'France', city: 'Paris' },
  CA: { name: 'Canada', city: 'Toronto' },
  KR: { name: 'South Korea', city: 'Seoul' },
  AU: { name: 'Australia', city: 'Sydney' },
  NL: { name: 'Netherlands', city: 'Amsterdam' },
  RU: { name: 'Russia', city: 'Moscow' },
  IN: { name: 'India', city: 'Mumbai' },
  BR: { name: 'Brazil', city: 'Sao Paulo' },
  TH: { name: 'Thailand', city: 'Bangkok' },
  TW: { name: 'Taiwan', city: 'Taipei' },
  ID: { name: 'Indonesia', city: 'Jakarta' },
  PH: { name: 'Philippines', city: 'Manila' },
  MY: { name: 'Malaysia', city: 'Kuala Lumpur' }
};

export default function ProxyTableRow({
  proxy: p,
  isSelected,
  onToggleSelect,
  isTesting,
  copiedId,
  onCopy,
  showNoteText,
  ipQueryChannel,
  assignedProfiles = [],
  onOpenEdit,
  onOpenAssign,
  onCheckSingle,
  onDeleteSingle,
  onOpenNote
}) {
  const isLive = p.status === 'live';
  const isDie = p.status === 'die';
  const assignedProfilesCount = assignedProfiles.length;
  const proxyUrl = `${(p.type || 'socks5').toLowerCase()}://${p.host}:${p.port}`;
  const ipTypeDisplay = (p.ipVersion || 'IPV4').toUpperCase();
  const noteContent = p.name || p.notes || '';

  const countryCode = (p.country || 'WW').toUpperCase();
  const rawCity = p.city || p.region || '';
  const fallbackCity = ISO_LOCATIONS[countryCode]?.city || ISO_LOCATIONS[countryCode]?.name || '';
  const cityName = rawCity || fallbackCity || (countryCode !== 'WW' ? countryCode : '');
  const locationText = countryCode !== 'WW'
    ? (cityName ? `${countryCode}/${cityName}` : countryCode)
    : (rawCity || 'Unknown');

  const ipDisplay = p.outboundIp || p.host || '--';

  const timeAgoText = useMemo(() => {
    if (p.lastCheckedText) return p.lastCheckedText;
    if (!p.lastChecked) return 'Just now';
    if (typeof p.lastChecked === 'string') return p.lastChecked;
    const diffSec = Math.max(0, Math.floor((Date.now() - p.lastChecked) / 1000));
    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
    const days = Math.floor(diffSec / 86400);
    return `${days} Day${days > 1 ? 's' : ''} ago`;
  }, [p.lastChecked, p.lastCheckedText]);

  return (
    <tr
      style={{
        borderBottom: '1px solid #F1F5F9',
        backgroundColor: isTesting
          ? '#F0F7FF'
          : isSelected
          ? '#F5F3FF'
          : '#FFFFFF',
        transition: 'background-color 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!isSelected && !isTesting) e.currentTarget.style.backgroundColor = '#FAFAFC';
      }}
      onMouseLeave={(e) => {
        if (!isSelected && !isTesting) e.currentTarget.style.backgroundColor = '#FFFFFF';
      }}
    >
      {/* 1. Checkbox */}
      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(p.id)}
          style={{ cursor: 'pointer' }}
        />
      </td>

      {/* 2. Proxy Info */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F172A',
              letterSpacing: '-0.1px'
            }}
          >
            {proxyUrl}
          </span>
          <button
            onClick={() => onCopy(proxyUrl, `pi-${p.id}`)}
            title="Sao chép Proxy"
            style={{
              background: 'none',
              border: 'none',
              color: copiedId === `pi-${p.id}` ? '#10B981' : '#94A3B8',
              cursor: 'pointer',
              padding: '2px',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {copiedId === `pi-${p.id}` ? <Check size={12} /> : <Copy size={12} />}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
          <span style={{ fontWeight: 500 }}>{ipTypeDisplay}</span>
          <span style={{ color: '#CBD5E1' }}>|</span>
          <span style={{ color: p.user ? '#64748B' : '#94A3B8' }}>{p.user || p.name || '--'}</span>
        </div>
      </td>

      {/* 3. Outbound IP - Circular Flag & Location & Outbound IP */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Circular Flag (Lá cờ hình tròn to) */}
          <div
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F8FAFC',
              boxShadow: isDie
                ? '0 1px 3px rgba(239, 68, 68, 0.2), 0 0 0 1px rgba(239, 68, 68, 0.4)'
                : '0 1px 3px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.08)'
            }}
          >
            {isTesting ? (
              <Loader2 size={16} className="spin-anim" style={{ color: '#0284C7' }} />
            ) : (
              <CountryFlag
                code={countryCode}
                width={32}
                height={32}
                borderRadius="50%"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: isDie ? 'grayscale(50%) opacity(0.7)' : 'none'
                }}
              />
            )}
          </div>

          {/* Location & Outbound IP with Timestamp */}
          {isTesting ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0284C7', lineHeight: '1.2' }}>
                Đang kiểm tra...
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                <span style={{ fontWeight: 500, color: '#1E293B' }}>{ipDisplay}</span>
                <span style={{ color: '#CBD5E1' }}>|</span>
                <span style={{ color: '#0284C7' }}>Ping...</span>
              </div>
            </div>
          ) : isDie ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626', lineHeight: '1.2' }}>
                {countryCode !== 'WW' ? locationText : 'Mất kết nối'}
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px', lineHeight: '1.2' }}>
                <span style={{ fontWeight: 500, color: '#64748B' }}>{ipDisplay}</span>
                <span style={{ color: '#CBD5E1' }}>|</span>
                <span style={{ color: '#EF4444', fontWeight: 500 }}>Mất kết nối</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#0F172A',
                  letterSpacing: '-0.1px',
                  lineHeight: '1.2'
                }}
              >
                {locationText}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  lineHeight: '1.2'
                }}
              >
                <span style={{ fontWeight: 500, color: '#1E293B' }}>{ipDisplay}</span>
                <span style={{ color: '#CBD5E1' }}>|</span>
                <span style={{ color: '#64748B' }}>{timeAgoText}</span>
              </div>
            </div>
          )}
        </div>
      </td>

      {/* 4. Notes */}
      <td style={{ padding: '12px 14px' }}>
        {showNoteText ? (
          <div
            onClick={() => onOpenNote(p)}
            title="Nhấp để sửa ghi chú"
            style={{
              fontSize: '12px',
              color: noteContent ? '#334155' : '#94A3B8',
              cursor: 'pointer',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {noteContent || '--'}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onOpenNote(p)}
            title={noteContent ? `Ghi chú: ${noteContent} (Nhấp để sửa)` : 'Thêm ghi chú'}
            style={{
              background: 'none',
              border: 'none',
              color: noteContent ? '#7C3AED' : '#94A3B8',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#7C3AED')}
            onMouseLeave={(e) => (e.currentTarget.style.color = noteContent ? '#7C3AED' : '#94A3B8')}
          >
            <FileText size={16} />
          </button>
        )}
      </td>

      {/* 5. IP Query Channel */}
      <td style={{ padding: '12px 14px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 9px',
            borderRadius: '6px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#475569',
            fontSize: '11.5px',
            fontWeight: 500
          }}
        >
          <User size={12} style={{ color: '#64748B' }} />
          <span>{p.queryChannel || ipQueryChannel || 'IPRust.io'}</span>
        </div>
      </td>

      {/* 6. Related Profiles */}
      <td style={{ padding: '12px 14px' }}>
        {assignedProfilesCount > 0 ? (
          <button
            type="button"
            onClick={() => onOpenAssign(p)}
            title="Nhấp để xem/gán thêm hồ sơ"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {assignedProfilesCount} hồ sơ
          </button>
        ) : (
          <span style={{ color: '#94A3B8', fontSize: '13px' }}>--</span>
        )}
      </td>

      {/* 7. Action: Edit, Assign/Radio, Refresh, Delete */}
      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          {/* Icon 1: Edit */}
          <button
            type="button"
            onClick={(e) => onOpenEdit(p, e)}
            title="Chỉnh sửa Proxy"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.12s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#0F172A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Pencil size={14} />
          </button>

          {/* Icon 2: Assign / Radio */}
          <button
            type="button"
            onClick={() => onOpenAssign(p)}
            title="Gán proxy vào hồ sơ trình duyệt"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.12s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F1F5F9';
              e.currentTarget.style.color = '#7C3AED';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Radio size={14} />
          </button>

          {/* Icon 3: Refresh / Ping */}
          <button
            type="button"
            onClick={(e) => onCheckSingle(p, e)}
            disabled={isTesting}
            title="Kiểm tra ping Proxy"
            style={{
              background: 'none',
              border: 'none',
              color: isTesting ? '#2563EB' : '#64748B',
              cursor: isTesting ? 'not-allowed' : 'pointer',
              padding: '5px',
              borderRadius: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.12s'
            }}
            onMouseEnter={(e) => {
              if (!isTesting) {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.color = '#0284C7';
              }
            }}
            onMouseLeave={(e) => {
              if (!isTesting) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748B';
              }
            }}
          >
            <RotateCw size={14} className={isTesting ? 'spin-anim' : ''} />
          </button>

          {/* Icon 4: Delete */}
          <button
            type="button"
            onClick={() => onDeleteSingle(p)}
            title="Xóa Proxy"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 0.12s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2';
              e.currentTarget.style.color = '#DC2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
