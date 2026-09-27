import React, { useState } from 'react';
import {
  Crown,
  Play,
  Pause,
  Grid,
  RotateCw,
  Maximize2,
  X,
  GripHorizontal,
  ChevronUp,
  ChevronDown,
  Monitor
} from 'lucide-react';

export default function SyncFloatingBar({
  isSyncing,
  setIsSyncing,
  masterProfile,
  followersCount = 0,
  onTileWindows,
  onReloadAll,
  onBringToFront,
  onClose
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 300, e.clientX - dragStart.x)),
      y: Math.max(10, Math.min(window.innerHeight - 100, e.clientY - dragStart.y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        bottom: `${position.y}px`,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        border: '1px solid #334155',
        overflow: 'hidden',
        userSelect: 'none',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Title & Drag Handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          backgroundColor: '#1E293B',
          cursor: isDragging ? 'grabbing' : 'grab',
          borderBottom: isCollapsed ? 'none' : '1px solid #334155',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Crown size={13} style={{ color: '#A855F7' }} />
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#F1F5F9' }}>
            {masterProfile?.name || 'Sync Master'}
          </span>
          <span style={{
            fontSize: '9.5px',
            padding: '1px 5px',
            borderRadius: '4px',
            backgroundColor: isSyncing ? '#166534' : '#475569',
            color: '#FFFFFF',
            fontWeight: 700
          }}>
            {isSyncing ? 'LIVE' : 'PAUSED'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex'
            }}
          >
            {isCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex'
            }}
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {!isCollapsed && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px'
        }}>
          {/* Start / Pause */}
          <button
            onClick={() => setIsSyncing(!isSyncing)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isSyncing ? '#F59E0B' : '#7C3AED',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {isSyncing ? <Pause size={12} /> : <Play size={12} />}
            <span>{isSyncing ? 'Tạm dừng' : 'Bắt đầu'}</span>
          </button>

          {/* Tile */}
          <button
            onClick={() => onTileWindows?.('grid-4')}
            title="Sắp xếp lưới 2x2"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
          >
            <Grid size={13} />
          </button>

          {/* Reload */}
          <button
            onClick={onReloadAll}
            title="Tải lại tất cả (F5)"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
          >
            <RotateCw size={13} />
          </button>

          {/* Bring to Front */}
          <button
            onClick={onBringToFront}
            title="Đưa lên trên cùng"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
              cursor: 'pointer'
            }}
          >
            <Monitor size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
