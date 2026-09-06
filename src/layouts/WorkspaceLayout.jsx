import React from 'react';

/**
 * Layout for the full-width Home/Workspace page.
 * No sidebar, no status bar – just the content.
 */
export default function WorkspaceLayout({ children }) {
  return (
    <div style={{ flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', display: 'flex' }}>
      {children}
    </div>
  );
}
