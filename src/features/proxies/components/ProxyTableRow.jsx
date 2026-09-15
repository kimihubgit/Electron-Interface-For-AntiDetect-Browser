import React from 'react';
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

      {/* 3. Outbound IP */}
      <td style={{ padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Globe Icon hoặc Spinner khi testing */}
          <div
            style={{
              position: 'relative',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: isTesting ? '#EFF6FF' : isLive ? '#EFF6FF' : isDie ? '#FEF2F2' : '#F1F5F9',
              color: isTesting ? '#2563EB' : isLive ? '#2563EB' : isDie ? '#EF4444' : '#94A3B8',
              border: isTesting ? '1px solid #93C5FD' : isLive ? '1px solid #BFDBFE' : isDie ? '1px solid #FECACA' : '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {isTesting ? (
              <Loader2 size={15} className="spin-anim" style={{ color: '#2563EB' }} />
            ) : (
              <>
                <Globe size={15} />
                {isDie && (
                  /* Gạch chéo màu đỏ xuyên qua quả địa cầu */
                  <div
                    style={{
                      position: 'absolute',
                      width: '18px',
                      height: '2px',
                      backgroundColor: '#EF4444',
                      transform: 'rotate(-45deg)',
                      borderRadius: '1px'
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isTesting ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#2563EB' }}>Đang kiểm tra...</span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: '#DBEAFE',
                      color: '#1D4ED8',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Loader2 size={9} className="spin-anim" /> PINGING
                  </span>
                </div>
              ) : isLive ? (
                <>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>
                    {p.outboundIp || p.host}
                  </span>
                  {p.country && (
                    <CountryFlag code={p.country} width={15} height={10} />
                  )}
                </>
              ) : isDie ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#DC2626' }}>
                    Mất kết nối
                  </span>
                  <span
                    style={{
                      fontSize: '9.5px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      fontWeight: 700
                    }}
                  >
                    DIE
                  </span>
                </div>
              ) : (
                <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748B' }}>--</span>
              )}
            </div>
            {/* Dòng dưới: Vị trí địa lý và Tốc độ ping (ms) */}
            <div style={{ fontSize: '11px', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {isTesting ? (
                <span style={{ color: '#60A5FA', fontStyle: 'italic' }}>Đang đo tốc độ ping (latency)...</span>
              ) : isLive ? (
                <>
                  <span style={{ color: '#94A3B8' }}>
                    {p.country ? `${p.country} | ${p.city || p.region || '--'}` : '-- | --'}
                  </span>
                  {p.latency != null && (
                    <>
                      <span style={{ color: '#CBD5E1' }}>•</span>
                      <span style={{ color: '#059669', fontWeight: 600 }}>{p.latency}ms</span>
                    </>
                  )}
                </>
              ) : isDie ? (
                <span style={{ color: '#EF4444' }}>Không thể kết nối máy chủ</span>
              ) : (
                <span style={{ color: '#94A3B8' }}>-- | --</span>
              )}
            </div>
          </div>
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
