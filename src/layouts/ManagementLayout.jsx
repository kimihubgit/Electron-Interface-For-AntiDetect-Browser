import React from 'react';
import ActivityBar from '../components/navigation/ActivityBar';
import ExplorerPane from '../components/navigation/ExplorerPane';
import BottomStatusBar from '../components/statusbar/BottomStatusBar';
import { useBrowser } from '../store/BrowserContext';

/**
 * Layout for detail-management pages (Profiles, Proxies, Groups, Settings).
 * Structure: ActivityBar (on gray frame) | Floating White Canvas [ExplorerPane (white) | Main Content | StatusBar]
 */
export default function ManagementLayout({ children }) {
  const { isSidebarCollapsed, activeTab } = useBrowser();

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      minHeight: 0,
      overflow: 'hidden',
      backgroundColor: '#EBEEF2',
      boxSizing: 'border-box'
    }}>
      {/* ActivityBar sits on the gray background frame */}
      <ActivityBar />

      {/* Floating White Canvas containing the white ExplorerPane and Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        padding: '0 8px 8px 6px',
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
          {/* Collapsible White Explorer Sidebar (Hidden in Extensions tab for full-width layout) */}
          {!isSidebarCollapsed && activeTab !== 'extensions' && <ExplorerPane />}

          {/* Main content area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
            <main style={{ flex: 1, minHeight: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
              {children}
            </main>
            <BottomStatusBar />
          </div>
        </div>
      </div>
    </div>
  );
}
