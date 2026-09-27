import React, { useState, useMemo, useCallback } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import SyncTopBar from './components/SyncTopBar';
import SyncQuickActionToolbar from './components/SyncQuickActionToolbar';
import SyncStageCanvas from './components/SyncStageCanvas';
import SyncSettingsDrawer from './components/SyncSettingsDrawer';
import SyncFloatingBar from './components/SyncFloatingBar';
import SyncLogPanel from './components/SyncLogPanel';
import {
  Layers,
  Sparkles,
  Info,
  Play,
  RotateCw,
  Plus
} from 'lucide-react';

// Default Demo Profiles for instant testing when fewer than 2 profiles are running
const DEFAULT_DEMO_PROFILES = [
  { id: 'demo-p1', name: 'Profile 01 - Amazon Buyer Prime', status: 'running', proxy: { host: '198.54.120.45', type: 'SOCKS5' }, countryFlag: '🇺🇸', proxyIp: '198.54.120.45:1080', os: 'Windows 11', isSyncEnabled: true, baseLatency: 28 },
  { id: 'demo-p2', name: 'Profile 02 - eBay Seller US #2', status: 'running', proxy: { host: '198.54.120.46', type: 'SOCKS5' }, countryFlag: '🇺🇸', proxyIp: '198.54.120.46:1080', os: 'Windows 11', isSyncEnabled: true, baseLatency: 45 },
  { id: 'demo-p3', name: 'Profile 03 - TikTok Creator UK', status: 'running', proxy: { host: '46.101.12.89', type: 'HTTP' }, countryFlag: '🇬🇧', proxyIp: '46.101.12.89:8080', os: 'macOS Sonoma', isSyncEnabled: true, baseLatency: 62 },
  { id: 'demo-p4', name: 'Profile 04 - Shopee Seller SG', status: 'running', proxy: { host: '128.199.200.15', type: 'SOCKS5' }, countryFlag: '🇸🇬', proxyIp: '128.199.200.15:1080', os: 'Windows 10', isSyncEnabled: true, baseLatency: 35 },
  { id: 'demo-p5', name: 'Profile 05 - Facebook Ads VN', status: 'running', proxy: { host: '118.69.21.32', type: 'HTTP' }, countryFlag: '🇻🇳', proxyIp: '118.69.21.32:8888', os: 'Windows 11', isSyncEnabled: true, baseLatency: 18 }
];

export default function SynchronizerPage() {
  const { profiles = [], batchLaunchProfiles, showToast } = useBrowser();

  // Determine running profiles from store
  const activeRunningProfiles = useMemo(() => {
    const realRunning = profiles.filter(p => p.status === 'running');
    if (realRunning.length >= 2) {
      return realRunning.map((p, idx) => ({
        ...p,
        countryFlag: p.proxy?.country ? '🌐' : '💻',
        proxyIp: p.proxy?.host ? `${p.proxy.host}:${p.proxy.port || '80'}` : 'Direct Network',
        isSyncEnabled: true,
        baseLatency: 25 + (idx * 15)
      }));
    }
    // If user hasn't launched multiple profiles, provide demo set for instant UI exploration
    return DEFAULT_DEMO_PROFILES;
  }, [profiles]);

  // Master Profile state
  const [masterProfile, setMasterProfile] = useState(() => activeRunningProfiles[0] || DEFAULT_DEMO_PROFILES[0]);

  // Sync active followers (all profiles except the master)
  const [followers, setFollowers] = useState(() => {
    return activeRunningProfiles.slice(1);
  });

  // Main Sync Engine State
  const [isSyncing, setIsSyncing] = useState(true);
  const [delayRange, setDelayRange] = useState(45);
  const [currentUrl, setCurrentUrl] = useState('https://www.google.com');

  // Sync Behaviors
  const [syncMouse, setSyncMouse] = useState(true);
  const [syncKeyboard, setSyncKeyboard] = useState(true);
  const [syncScroll, setSyncScroll] = useState(true);
  const [syncTabs, setSyncTabs] = useState(true);

  // Floating Mini Widget
  const [isMiniFloating, setIsMiniFloating] = useState(false);

  // Settings Drawer Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    mouse: { relativeCoords: true, naturalCurve: true, smoothScroll: true },
    keyboard: { enableSpinText: true, humanTypingSpeed: true, syncShortcuts: true },
    antiDetect: { shuffleFollowersOrder: true, jitterPixels: 4 }
  });

  // Action Logs Feed
  const [actionLogs, setActionLogs] = useState([
    { type: 'window', text: 'Khởi tạo hệ thống đồng bộ hóa đa luồng thành công', time: '18:15:00' },
    { type: 'nav', text: 'Đã sẵn sàng kết nối và nhân bản thao tác từ Master Profile', time: '18:15:02' }
  ]);

  const addActionLog = useCallback((logItem) => {
    setActionLogs(prev => [...prev.slice(-49), logItem]);
  }, []);

  // Toggle follower sync enable state
  const handleToggleFollowerSync = useCallback((followerId) => {
    setFollowers(prev => prev.map(f => {
      if (f.id === followerId) {
        const nextState = !f.isSyncEnabled;
        addActionLog({
          type: 'window',
          text: `${nextState ? 'Bật' : 'Tắt'} đồng bộ cho profile "${f.name}"`,
          time: new Date().toLocaleTimeString()
        });
        return { ...f, isSyncEnabled: nextState };
      }
      return f;
    }));
  }, [addActionLog]);

  // Window Arrangement Handlers
  const handleTileWindows = useCallback((layoutType) => {
    const layoutNames = {
      'grid-4': 'Chia lưới 2x2',
      'cascade': 'Xếp tầng so le',
      'grid-6': 'Chia lưới 2x3'
    };
    const title = layoutNames[layoutType] || 'Chia lưới tự động';
    addActionLog({
      type: 'window',
      text: `Sắp xếp ${followers.length + 1} cửa sổ trình duyệt: ${title}`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.(`Đã sắp xếp các cửa sổ theo kiểu: ${title}`, 'success');
  }, [followers.length, addActionLog, showToast]);

  const handleAlignSizes = useCallback(() => {
    addActionLog({
      type: 'window',
      text: 'Đồng bộ kích thước tất cả cửa sổ khớp với Master (1280 × 720)',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đồng bộ kích thước tất cả cửa sổ con theo Master', 'success');
  }, [addActionLog, showToast]);

  const handleBringToFront = useCallback(() => {
    addActionLog({
      type: 'window',
      text: 'Đưa toàn bộ cửa sổ trình duyệt Chrome lên trên cùng màn hình',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đưa tất cả cửa sổ lên trên cùng', 'info');
  }, [addActionLog, showToast]);

  // URL Broadcast
  const handleBroadcastUrl = useCallback((url) => {
    setCurrentUrl(url);
    addActionLog({
      type: 'nav',
      text: `Điều hướng đồng loạt sang URL: ${url}`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.(`Đang mở URL trên tất cả ${followers.filter(f => f.isSyncEnabled).length} cửa sổ...`, 'success');
  }, [followers, addActionLog, showToast]);

  // Tab Operations
  const handleOpenNewTab = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Mở thêm tab mới trên toàn bộ cửa sổ đồng bộ',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã mở thêm tab mới trên tất cả cửa sổ', 'info');
  }, [addActionLog, showToast]);

  const handleCloseTab = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Đóng tab hiện tại trên toàn bộ cửa sổ đồng bộ',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đóng tab hiện tại trên tất cả cửa sổ', 'info');
  }, [addActionLog, showToast]);

  const handleReloadAll = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Làm mới (F5) toàn bộ các trang trên tất cả cửa sổ',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã gửi tín hiệu tải lại trang (F5) cho tất cả cửa sổ', 'info');
  }, [addActionLog, showToast]);

  const handleClearCookies = useCallback(() => {
    addActionLog({
      type: 'window',
      text: 'Dọn sạch Cookie & Cache phiên tạm thời trên tất cả cửa sổ',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã xóa sạch bộ nhớ tạm thời trên tất cả cửa sổ', 'info');
  }, [addActionLog, showToast]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--apidog-bg)',
      position: 'relative'
    }}>
      {/* ── TOP CONTROL BAR ── */}
      <SyncTopBar
        isSyncing={isSyncing}
        setIsSyncing={setIsSyncing}
        masterProfile={masterProfile}
        setMasterProfile={setMasterProfile}
        runningProfiles={activeRunningProfiles}
        delayRange={delayRange}
        setDelayRange={setDelayRange}
        onTileWindows={handleTileWindows}
        onAlignSizes={handleAlignSizes}
        onBringToFront={handleBringToFront}
        isMiniFloating={isMiniFloating}
        setIsMiniFloating={setIsMiniFloating}
        activeFollowersCount={followers.filter(f => f.isSyncEnabled).length}
      />

      {/* ── QUICK ACTION & URL BROADCAST TOOLBAR ── */}
      <SyncQuickActionToolbar
        onBroadcastUrl={handleBroadcastUrl}
        onOpenNewTab={handleOpenNewTab}
        onCloseTab={handleCloseTab}
        onReloadAll={handleReloadAll}
        onClearCookies={handleClearCookies}
        syncMouse={syncMouse}
        setSyncMouse={setSyncMouse}
        syncKeyboard={syncKeyboard}
        setSyncKeyboard={setSyncKeyboard}
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        syncTabs={syncTabs}
        setSyncTabs={setSyncTabs}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
      />

      {/* ── INTERACTIVE WORKSPACE CANVAS (MASTER + SLAVES) ── */}
      <SyncStageCanvas
        isSyncing={isSyncing}
        masterProfile={masterProfile}
        followers={followers}
        onToggleFollowerSync={handleToggleFollowerSync}
        delayRange={delayRange}
        currentUrl={currentUrl}
        onLogAction={addActionLog}
      />

      {/* ── BOTTOM REAL-TIME ACTION LOG PANEL ── */}
      <SyncLogPanel
        logs={actionLogs}
        onClearLogs={() => setActionLogs([])}
      />

      {/* ── ADVANCED SETTINGS DRAWER MODAL ── */}
      <SyncSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={advancedSettings}
        setSettings={setAdvancedSettings}
      />

      {/* ── FLOATING MINI CONTROLLER WIDGET ── */}
      {isMiniFloating && (
        <SyncFloatingBar
          isSyncing={isSyncing}
          setIsSyncing={setIsSyncing}
          masterProfile={masterProfile}
          followersCount={followers.filter(f => f.isSyncEnabled).length}
          onTileWindows={handleTileWindows}
          onReloadAll={handleReloadAll}
          onBringToFront={handleBringToFront}
          onClose={() => setIsMiniFloating(false)}
        />
      )}
    </div>
  );
}
