import React from 'react';

/**
 * Layout for the full-width Home/Workspace page.
 * No sidebar, no status bar – just the content.
 */
export default function WorkspaceLayout({ children }) {
  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      height: '100%',
      overflow: 'hidden',
      display: 'flex',
      backgroundColor: '#EBEEF2',
      padding: '4px 8px 8px 8px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        border: '1px solid #DCE0E6',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        overflow: 'hidden'
      }}>
        {children}
      </div>
    </div>
  );
}
