import React from 'react';
import { Zap, X, RotateCw, Check } from 'lucide-react';

export default function AutomationNodeCard({
  node,
  isSelected,
  zoomLevel,
  panOffset,
  isLocked,
  onMouseDown,
  onDoubleClick,
  onDeleteNode,
  onStartWire,
  onEndWire
}) {
  const IconComp = node.icon || Zap;
  const isRunning = node.status === 'running';
  const isDone = node.status === 'success';

  const cardWidth = 240;
  const isCondition = node.type === 'condition';

  return (
    <div
      onMouseDown={(e) => onMouseDown(e, node)}
      onDoubleClick={() => onDoubleClick(node)}
      style={{
        position: 'absolute',
        left: `${node.x * zoomLevel + panOffset.x}px`,
        top: `${node.y * zoomLevel + panOffset.y}px`,
        width: `${cardWidth * zoomLevel}px`,
        backgroundColor: '#FFFFFF',
        borderRadius: `${12 * zoomLevel}px`,
        border: isSelected
          ? '2px solid #2563EB'
          : isRunning
          ? '2px solid #F59E0B'
          : isDone
          ? '1.5px solid #10B981'
          : '1.5px solid #E2E8F0',
        boxShadow: isSelected
          ? '0 10px 25px -4px rgba(37, 99, 235, 0.25)'
          : isRunning
          ? '0 0 20px rgba(245, 158, 11, 0.35)'
          : '0 4px 14px rgba(0, 0, 0, 0.05)',
        padding: `${12 * zoomLevel}px ${14 * zoomLevel}px`,
        cursor: isLocked ? 'default' : 'grab',
        zIndex: isSelected ? 10 : 5,
        overflow: 'visible',
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease'
      }}
    >
      {/* Left Input Port */}
      <div
        title="Cổng nhận (Input)"
        onMouseUp={(e) => onEndWire(e, node.id)}
        style={{
          position: 'absolute',
          left: `${-7 * zoomLevel}px`,
          top: `${55 * zoomLevel}px`,
          transform: 'translateY(-50%)',
          width: `${13 * zoomLevel}px`,
          height: `${13 * zoomLevel}px`,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          border: '2px solid #64748B',
          boxShadow: '0 0 4px rgba(0,0,0,0.15)',
          cursor: 'crosshair',
          zIndex: 20
        }}
      />

      {/* 1. Header: Icon box + Title + Badge + Delete button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: `${8 * zoomLevel}px`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * zoomLevel}px` }}>
          <div
            style={{
              width: `${30 * zoomLevel}px`,
              height: `${30 * zoomLevel}px`,
              borderRadius: `${8 * zoomLevel}px`,
              backgroundColor: `${node.color}15`,
              color: node.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconComp size={16 * zoomLevel} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: `${12.5 * zoomLevel}px`,
                fontWeight: 700,
                color: '#0F172A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: `${120 * zoomLevel}px`
              }}
            >
              {node.title}
            </span>
            <span style={{ fontSize: `${10 * zoomLevel}px`, color: '#64748B' }}>
              {node.type}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * zoomLevel}px` }}>
          {/* Badge */}
          <span
            style={{
              fontSize: `${9 * zoomLevel}px`,
              fontWeight: 700,
              padding: `${2 * zoomLevel}px ${6 * zoomLevel}px`,
              borderRadius: '10px',
              backgroundColor: `${node.badgeColor || node.color}15`,
              color: node.badgeColor || node.color
            }}
          >
            {node.badge || 'NODE'}
          </span>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(node.id);
            }}
            title="Xóa khối"
            style={{
              width: `${18 * zoomLevel}px`,
              height: `${18 * zoomLevel}px`,
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            <X size={12 * zoomLevel} />
          </button>
        </div>
      </div>

      {/* 2. Body Panel (Parameters & Config Preview) */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: `${8 * zoomLevel}px`,
          padding: `${7 * zoomLevel}px ${9 * zoomLevel}px`,
          border: '1px solid #F1F5F9',
          marginBottom: `${8 * zoomLevel}px`
        }}
      >
        {node.data?.url && (
          <div
            style={{
              fontSize: `${10.5 * zoomLevel}px`,
              color: '#475569',
              display: 'flex',
              gap: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <span style={{ color: '#94A3B8' }}>URL:</span>
            <strong style={{ color: '#2563EB', textDecoration: 'underline' }}>{node.data.url}</strong>
          </div>
        )}

        {node.data?.selector && (
          <div
            style={{
              fontSize: `${10.5 * zoomLevel}px`,
              color: '#475569',
              display: 'flex',
              gap: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <span style={{ color: '#94A3B8' }}>Selector:</span>
            <code>{node.data.selector}</code>
          </div>
        )}

        {node.data?.goal && (
          <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569', fontStyle: 'italic', lineHeight: 1.3 }}>
            "{node.data.goal}"
          </div>
        )}

        {node.data?.condition && (
          <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#059669', fontWeight: 600 }}>
            {node.data.condition}
          </div>
        )}

        {node.data?.code && (
          <div
            style={{
              fontSize: `${10 * zoomLevel}px`,
              fontFamily: 'monospace',
              color: '#1E293B',
              backgroundColor: '#FFFFFF',
              padding: '2px 4px',
              borderRadius: '4px'
            }}
          >
            {node.data.code}
          </div>
        )}

        {node.data?.targetDesc && (
          <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569' }}>
            {node.data.targetDesc}
          </div>
        )}

        {node.data?.seconds && (
          <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569' }}>
            Chờ ngẫu nhiên: <strong>{node.data.seconds}s</strong>
          </div>
        )}
      </div>

      {/* 3. Bottom Row: Status & Ports */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: `${2 * zoomLevel}px`
        }}
      >
        {isRunning ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#D97706', fontWeight: 600 }}>
            <RotateCw size={11 * zoomLevel} style={{ animation: 'spin 1s linear infinite' }} /> Đang thực thi...
          </span>
        ) : isDone ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#10B981', fontWeight: 600 }}>
            <Check size={11 * zoomLevel} /> Hoàn tất
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#64748B' }}>
            <span style={{ width: `${6 * zoomLevel}px`, height: `${6 * zoomLevel}px`, borderRadius: '50%', backgroundColor: '#94A3B8' }} /> Sẵn sàng
          </span>
        )}

        {isCondition && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
            <span style={{ fontSize: `${9 * zoomLevel}px`, fontWeight: 600, color: '#10B981' }}>● Đúng</span>
            <span style={{ fontSize: `${9 * zoomLevel}px`, fontWeight: 600, color: '#EF4444' }}>● Sai</span>
          </div>
        )}
      </div>

      {/* Right Output Port(s) */}
      {isCondition ? (
        <>
          {/* True Port */}
          <div
            title="Kéo dây nhánh Đúng (True)"
            onMouseDown={(e) => onStartWire(e, node.id, 'true')}
            style={{
              position: 'absolute',
              right: `${-7 * zoomLevel}px`,
              top: `${70 * zoomLevel}px`,
              width: `${13 * zoomLevel}px`,
              height: `${13 * zoomLevel}px`,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 4px rgba(0,0,0,0.15)',
              cursor: 'crosshair',
              zIndex: 20
            }}
          />
          {/* False Port */}
          <div
            title="Kéo dây nhánh Sai (False)"
            onMouseDown={(e) => onStartWire(e, node.id, 'false')}
            style={{
              position: 'absolute',
              right: `${-7 * zoomLevel}px`,
              top: `${115 * zoomLevel}px`,
              width: `${13 * zoomLevel}px`,
              height: `${13 * zoomLevel}px`,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              border: '2px solid #FFFFFF',
              boxShadow: '0 0 4px rgba(0,0,0,0.15)',
              cursor: 'crosshair',
              zIndex: 20
            }}
          />
        </>
      ) : (
        <div
          title="Kéo dây kết nối (Output)"
          onMouseDown={(e) => onStartWire(e, node.id, 'default')}
          style={{
            position: 'absolute',
            right: `${-7 * zoomLevel}px`,
            top: `${55 * zoomLevel}px`,
            transform: 'translateY(-50%)',
            width: `${13 * zoomLevel}px`,
            height: `${13 * zoomLevel}px`,
            borderRadius: '50%',
            backgroundColor: node.color || '#2563EB',
            border: '2px solid #FFFFFF',
            boxShadow: '0 0 4px rgba(0,0,0,0.15)',
            cursor: 'crosshair',
            zIndex: 20
          }}
        />
      )}
    </div>
  );
}
