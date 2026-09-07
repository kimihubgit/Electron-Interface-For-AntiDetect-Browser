import React from 'react';

/**
 * Semi-transparent marquee box drawn when dragging mouse over profiles
 */
export default function DragSelectionBox({ dragBox }) {
  if (!dragBox) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${dragBox.left}px`,
        top: `${dragBox.top}px`,
        width: `${dragBox.width}px`,
        height: `${dragBox.height}px`,
        backgroundColor: 'rgba(99, 102, 241, 0.14)',
        border: '1.5px solid #6366F1',
        borderRadius: '4px',
        boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.25), 0 4px 12px rgba(99, 102, 241, 0.1)',
        pointerEvents: 'none',
        zIndex: 999999
      }}
    />
  );
}
