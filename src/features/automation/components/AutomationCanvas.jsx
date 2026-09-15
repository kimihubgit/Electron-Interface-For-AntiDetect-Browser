import React from 'react';
import { Plus, Minus, Maximize2, Lock, Unlock, Star } from 'lucide-react';
import AutomationNodeCard from './AutomationNodeCard';

export default function AutomationCanvas({
  canvasRef,
  nodes,
  edges,
  selectedNodeId,
  isExecuting,
  activeStepId,
  zoomLevel,
  setZoomLevel,
  panOffset,
  setPanOffset,
  isPanning,
  isLocked,
  setIsLocked,
  connectingState,
  onCanvasMouseDown,
  onCanvasWheel,
  onCanvasDragOver,
  onCanvasDrop,
  onNodeMouseDown,
  onNodeDoubleClick,
  onDeleteNode,
  onDeleteEdge,
  onStartWire,
  onEndWire
}) {
  return (
    <div
      ref={canvasRef}
      onMouseDown={onCanvasMouseDown}
      onWheel={onCanvasWheel}
      onDragOver={onCanvasDragOver}
      onDrop={onCanvasDrop}
      style={{
        flex: 1,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#FAFAFA',
        backgroundImage: 'radial-gradient(#D1D5DB 1.3px, transparent 1.3px)',
        backgroundSize: `${24 * zoomLevel}px ${24 * zoomLevel}px`,
        backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
        cursor: isPanning ? 'grabbing' : 'default'
      }}
    >
      {/* SVG Connecting Bezier Wires */}
      <svg
        id="canvas-svg-layer"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        {/* Existing Edges */}
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          const nodeWidth = 240;
          const isCond = fromNode.type === 'condition';

          const startX = (fromNode.x + nodeWidth) * zoomLevel + panOffset.x;
          const startY = isCond
            ? (edge.fromPort === 'false' ? fromNode.y + 115 : fromNode.y + 70) * zoomLevel + panOffset.y
            : (fromNode.y + 55) * zoomLevel + panOffset.y;

          const endX = toNode.x * zoomLevel + panOffset.x;
          const endY = (toNode.y + 55) * zoomLevel + panOffset.y;

          const deltaX = Math.max(45, (endX - startX) * 0.5);
          const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

          const isEdgeActive = isExecuting && (activeStepId === fromNode.id || activeStepId === toNode.id);

          return (
            <g key={edge.id} style={{ pointerEvents: 'auto' }}>
              {/* Transparent hover path */}
              <path
                d={pathD}
                fill="none"
                stroke="transparent"
                strokeWidth="14"
                style={{ cursor: 'pointer' }}
                onClick={() => onDeleteEdge(edge.id)}
              />
              {/* Visible wire */}
              <path
                d={pathD}
                fill="none"
                stroke={isEdgeActive ? '#10B981' : edge.fromPort === 'false' ? '#EF4444' : '#64748B'}
                strokeWidth={isEdgeActive ? 2.8 : 1.8}
                strokeDasharray={isEdgeActive ? '5, 5' : 'none'}
                className={isEdgeActive ? 'wire-running' : ''}
              />
              {/* Flow dot at midpoint */}
              <circle
                cx={(startX + endX) / 2}
                cy={(startY + endY) / 2}
                r={3}
                fill={isEdgeActive ? '#10B981' : '#64748B'}
              />
            </g>
          );
        })}

        {/* Connecting wire while dragging */}
        {connectingState &&
          (() => {
            const startX = connectingState.startX * zoomLevel + panOffset.x;
            const startY = connectingState.startY * zoomLevel + panOffset.y;
            const endX = connectingState.currentX * zoomLevel + panOffset.x;
            const endY = connectingState.currentY * zoomLevel + panOffset.y;
            const deltaX = Math.max(35, Math.abs(endX - startX) * 0.5);
            const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

            return (
              <path
                d={pathD}
                fill="none"
                stroke="#2563EB"
                strokeWidth="2.2"
                strokeDasharray="4, 4"
              />
            );
          })()}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <AutomationNodeCard
          key={node.id}
          node={node}
          isSelected={selectedNodeId === node.id}
          zoomLevel={zoomLevel}
          panOffset={panOffset}
          isLocked={isLocked}
          onMouseDown={onNodeMouseDown}
          onDoubleClick={onNodeDoubleClick}
          onDeleteNode={onDeleteNode}
          onStartWire={onStartWire}
          onEndWire={onEndWire}
        />
      ))}

      {/* Floating Zoom & Canvas Toolbar */}
      <div
        style={{
          position: 'absolute',
          left: '16px',
          bottom: '24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15
        }}
      >
        <button
          onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.1))}
          title="Phóng to"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: '#374151',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Plus size={15} />
        </button>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

        <button
          onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
          title="Thu nhỏ"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: '#374151',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Minus size={15} />
        </button>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

        <button
          onClick={() => {
            setZoomLevel(0.85);
            setPanOffset({ x: 50, y: 35 });
          }}
          title="Căn vừa màn hình"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: '#374151',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F3F4F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Maximize2 size={13} />
        </button>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

        <button
          onClick={() => setIsLocked((l) => !l)}
          title={isLocked ? 'Mở khóa bảng vẽ' : 'Khóa bảng vẽ'}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            backgroundColor: isLocked ? '#FEE2E2' : 'transparent',
            color: isLocked ? '#EF4444' : '#374151',
            cursor: 'pointer'
          }}
        >
          {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
        </button>

        <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

        <button
          title="Lưu yêu thích"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            background: 'transparent',
            color: '#F59E0B',
            cursor: 'pointer'
          }}
        >
          <Star size={13} fill="#F59E0B" />
        </button>
      </div>

      {/* Minimap Preview (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          right: '16px',
          bottom: '16px',
          width: '160px',
          height: '95px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(4px)',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 15
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B' }}>
            Bản đồ ({nodes.length} khối)
          </span>
          <span style={{ fontSize: '9px', color: '#94A3B8' }}>{Math.round(zoomLevel * 100)}%</span>
        </div>

        <div
          style={{
            flex: 1,
            backgroundColor: '#F8FAFC',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {nodes.map((n) => (
            <div
              key={`mini-${n.id}`}
              style={{
                position: 'absolute',
                left: `${(n.x / 1800) * 100}%`,
                top: `${(n.y / 650) * 100}%`,
                width: '12px',
                height: '6px',
                borderRadius: '2px',
                backgroundColor:
                  n.status === 'running'
                    ? '#F59E0B'
                    : n.status === 'success'
                    ? '#10B981'
                    : n.color || '#3B82F6'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
