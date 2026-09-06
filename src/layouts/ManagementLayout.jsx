import React from 'react';
import ActivityBar from '../components/navigation/ActivityBar';
import ExplorerPane from '../components/navigation/ExplorerPane';
import BottomStatusBar from '../components/statusbar/BottomStatusBar';

/**
 * Layout for detail-management pages (Profiles, Proxies, Groups, Settings).
 * Structure: ActivityBar | ExplorerPane | [children] | StatusBar
 */
export default function ManagementLayout({ children }) {
  return (
    <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
      <ActivityBar />
      <ExplorerPane />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
        <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
          {children}
        </main>
        <BottomStatusBar />
      </div>
    </div>
  );
}
