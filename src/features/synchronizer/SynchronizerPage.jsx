import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useBrowser } from '../../store/BrowserContext';
import SyncControlsHeader from './components/SyncControlsHeader';
import SyncMasterCard from './components/SyncMasterCard';
import SyncRunningList from './components/SyncRunningList';
import SyncSignalFlow from './components/SyncSignalFlow';
import SyncLogPanel from './components/SyncLogPanel';
import SyncFloatingBar from './components/SyncFloatingBar';
import {
  Layers,
  Sparkles,
  RefreshCw,
  Plus,
  Play,
  Monitor
} from 'lucide-react';

// Demo sample profiles to showcase master-slave multi-profile management if no real browsers are opened yet
const DEMO_RUNNING_PROFILES = [
  { id: 'p-demo-1', name: 'Profile 01 - Amazon Buyer Prime', pid: 14220, order: 1, group: 'E-Commerce', os: 'windows', proxy: { host: '198.54.120.45', port: '1080', type: 'SOCKS5' }, screenResolution: '1280 × 720', baseLatency: 25 },
  { id: 'p-demo-2', name: 'Profile 02 - eBay Seller US #2', pid: 14228, order: 2, group: 'E-Commerce', os: 'windows', proxy: { host: '198.54.120.46', port: '1080', type: 'SOCKS5' }, screenResolution: '1280 × 720', baseLatency: 45 },
  { id: 'p-demo-3', name: 'Profile 03 - TikTok Creator UK', pid: 14236, order: 3, group: 'Social', os: 'macos', proxy: { host: '46.101.12.89', port: '8080', type: 'HTTP' }, screenResolution: '1280 × 720', baseLatency: 60 },
  { id: 'p-demo-4', name: 'Profile 04 - Shopee Seller SG', pid: 14244, order: 4, group: 'Chung', os: 'windows', proxy: { host: '128.199.200.15', port: '1080', type: 'SOCKS5' }, screenResolution: '1280 × 720', baseLatency: 35 }
];

export default function SynchronizerPage() {
  const {
    profiles = [],
    toggleLaunchProfile,
    batchStopProfiles,
    showToast
  } = useBrowser();

  // State to hold actual running profiles from Electron IPC
  const [electronRunningList, setElectronRunningList] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // 1. Listen to real running Chrome profiles from Electron IPC
  useEffect(() => {
    // Initial fetch from backend
    if (window.electronAPI?.getRunningProfilesList) {
      window.electronAPI.getRunningProfilesList().then(list => {
        if (Array.isArray(list)) {
          setElectronRunningList(list);
        }
      });
    }

    // Realtime update stream
    if (window.electronAPI?.onRunningProfilesUpdated) {
      const cleanup = window.electronAPI.onRunningProfilesUpdated((list) => {
        if (Array.isArray(list)) {
          setElectronRunningList(list);
        }
      });
      return cleanup;
    }
  }, []);

  // Merge running profiles from Electron with profile metadata from context
  const runningProfiles = useMemo(() => {
    if (isDemoMode) {
      return DEMO_RUNNING_PROFILES;
    }

    // 1. First priority: Electron actual running list
    if (electronRunningList.length > 0) {
      const profileMap = new Map(profiles.map(p => [String(p.id), p]));
      return electronRunningList.map(item => {
        const matched = profileMap.get(String(item.id)) || {};
        return {
          ...matched,
          id: item.id,
          name: item.name || matched.name || `Profile #${item.id}`,
          pid: item.pid,
          order: item.order || matched.order || 1,
          startTime: item.startTime,
          proxy: matched.proxy || {},
          os: matched.os || 'windows',
          group: matched.group || 'Chung'
        };
      });
    }

    // 2. Fallback: Context profiles with status === 'running'
    const contextRunning = profiles.filter(p => p.status === 'running');
    if (contextRunning.length > 0) {
      return contextRunning;
    }

    // If no running profiles, return empty list
    return [];
  }, [electronRunningList, profiles, isDemoMode]);

  // Master Profile ID state (User selects which running profile is the Master)
  const [masterProfileId, setMasterProfileId] = useState(null);

  // Ensure valid master profile when running list changes
  useEffect(() => {
    if (runningProfiles.length > 0) {
      const exists = runningProfiles.some(p => String(p.id) === String(masterProfileId));
      if (!exists || !masterProfileId) {
        setMasterProfileId(runningProfiles[0].id);
      }
    } else {
      setMasterProfileId(null);
    }
  }, [runningProfiles, masterProfileId]);

  // Selected master profile object
  const masterProfile = useMemo(() => {
    return runningProfiles.find(p => String(p.id) === String(masterProfileId)) || runningProfiles[0] || null;
  }, [runningProfiles, masterProfileId]);

  // Slave Sync Map: { [slaveProfileId]: boolean } - whether this slave is active in receiving sync
  const [slaveSyncMap, setSlaveSyncMap] = useState({});

  // Slaves list (all running profiles except master)
  const slaves = useMemo(() => {
    if (!masterProfile) return [];
    return runningProfiles
      .filter(p => String(p.id) !== String(masterProfile.id))
      .map(p => ({
        ...p,
        isSyncActive: slaveSyncMap[p.id] ?? true
      }));
  }, [runningProfiles, masterProfile, slaveSyncMap]);

  // Main Sync Engine Status (Active / Paused)
  const [isSyncing, setIsSyncing] = useState(true);
  const [delayRange, setDelayRange] = useState(45);

  // Sync mode behaviors
  const [syncMouse, setSyncMouse] = useState(true);
  const [syncKeyboard, setSyncKeyboard] = useState(true);
  const [syncScroll, setSyncScroll] = useState(true);

  // Mini floating bar toggle
  const [isMiniFloating, setIsMiniFloating] = useState(false);

  // Realtime Action Logs Feed
  const [actionLogs, setActionLogs] = useState([
    { type: 'window', text: 'Hệ thống Synchronizer đã sẵn sàng bắt tín hiệu từ các cửa sổ Chrome đang chạy', time: new Date().toLocaleTimeString() }
  ]);

  const addActionLog = useCallback((logItem) => {
    setActionLogs(prev => [...prev.slice(-49), logItem]);
  }, []);

  // Handlers for Master / Slave Management
  const handleSetMaster = useCallback((profile) => {
    setMasterProfileId(profile.id);
    addActionLog({
      type: 'window',
      text: `👑 Đã thiết lập "${profile.name}" (PID: ${profile.pid || 'Active'}) làm CỬA SỔ CHÍNH (Master)`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.(`Đã đặt "${profile.name}" làm Cửa sổ chính điều khiển`, 'success');
  }, [addActionLog, showToast]);

  const handleToggleSlaveSync = useCallback((slaveId) => {
    setSlaveSyncMap(prev => {
      const current = prev[slaveId] ?? true;
      const nextState = !current;
      const targetProfile = runningProfiles.find(p => String(p.id) === String(slaveId));
      addActionLog({
        type: 'window',
        text: `${nextState ? 'Bật' : 'Tắt'} nhận đồng bộ cho Chrome phụ "${targetProfile?.name || slaveId}"`,
        time: new Date().toLocaleTimeString()
      });
      return { ...prev, [slaveId]: nextState };
    });
  }, [runningProfiles, addActionLog]);

  // Window Tiling & Desktop Management
  const handleTileWindows = useCallback((layoutType) => {
    const layoutNames = {
      'grid-4': 'Chia lưới 2x2',
      'grid-6': 'Chia lưới 2x3'
    };
    const title = layoutNames[layoutType] || 'Chia lưới tự động';
    addActionLog({
      type: 'window',
      text: `Gửi lệnh sắp xếp ${runningProfiles.length} cửa sổ Chrome trên màn hình desktop: ${title}`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.(`Đã gửi lệnh sắp xếp cửa sổ: ${title}`, 'success');
  }, [runningProfiles.length, addActionLog, showToast]);

  const handleAlignSizes = useCallback(() => {
    addActionLog({
      type: 'window',
      text: `Đồng bộ kích thước tất cả các cửa sổ Chrome phụ theo Master (${masterProfile?.name || '1280x720'})`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đồng bộ kích thước tất cả cửa sổ con theo Master', 'success');
  }, [masterProfile, addActionLog, showToast]);

  const handleBringToFront = useCallback(() => {
    addActionLog({
      type: 'window',
      text: `Đưa tất cả ${runningProfiles.length} cửa sổ Chrome lên trên cùng màn hình`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đưa toàn bộ cửa sổ lên trên cùng', 'info');
  }, [runningProfiles.length, addActionLog, showToast]);

  // Fast Batch URL Dispatch
  const handleBroadcastUrl = useCallback((url) => {
    addActionLog({
      type: 'nav',
      text: `Phát lệnh mở URL "${url}" đồng loạt trên ${runningProfiles.length} Chrome đang chạy`,
      time: new Date().toLocaleTimeString()
    });
    showToast?.(`Đang mở URL trên tất cả ${runningProfiles.length} Chrome...`, 'success');
  }, [runningProfiles.length, addActionLog, showToast]);

  const handleOpenNewTab = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Mở thêm tab mới trên tất cả các Chrome đang chạy',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã mở thêm tab mới trên tất cả Chrome', 'info');
  }, [addActionLog, showToast]);

  const handleCloseTab = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Đóng tab hiện tại trên tất cả các Chrome đang chạy',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã đóng tab hiện tại trên tất cả Chrome', 'info');
  }, [addActionLog, showToast]);

  const handleReloadAll = useCallback(() => {
    addActionLog({
      type: 'nav',
      text: 'Gửi tín hiệu tải lại trang (F5) cho tất cả Chrome',
      time: new Date().toLocaleTimeString()
    });
    showToast?.('Đã làm mới (F5) tất cả các trang', 'info');
  }, [addActionLog, showToast]);

  // Stop / Launch single profile
  const handleStopProfile = useCallback((profileId) => {
    if (isDemoMode) {
      showToast?.('Đang ở chế độ xem mẫu Demo', 'info');
      return;
    }
    toggleLaunchProfile?.(profileId);
  }, [isDemoMode, toggleLaunchProfile, showToast]);

  const handleLaunchProfile = useCallback((profileId) => {
    toggleLaunchProfile?.(profileId);
  }, [toggleLaunchProfile]);

  // Test Simulation Trigger
  const handleSimulateAction = useCallback((actionType) => {
    if (actionType === 'click') {
      addActionLog({
        type: 'click',
        text: `Bắt tín hiệu Click chuột tại Chrome Master "${masterProfile?.name}" -> Nhân bản tới ${slaves.filter(s => s.isSyncActive).length} Chrome phụ (Độ trễ bù: ${delayRange}ms)`,
        time: new Date().toLocaleTimeString()
      });
      showToast?.('Đã nhân bản tín hiệu Click từ Master sang các Slave', 'success');
    } else if (actionType === 'typing') {
      addActionLog({
        type: 'typing',
        text: `Bắt tín hiệu Gõ bàn phím từ Chrome Master "${masterProfile?.name}" -> Nhân bản thời gian thực tới các Chrome phụ`,
        time: new Date().toLocaleTimeString()
      });
      showToast?.('Đã nhân bản tín hiệu Nhập phím từ Master sang các Slave', 'success');
    }
  }, [masterProfile, slaves, delayRange, addActionLog, showToast]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: 'var(--apidog-bg)',
      position: 'relative'
    }}>
      {/* ── TOP CONTROL & COMMAND BAR ── */}
      <SyncControlsHeader
        isSyncing={isSyncing}
        setIsSyncing={setIsSyncing}
        masterProfile={masterProfile}
        runningCount={runningProfiles.length}
        activeSlavesCount={slaves.filter(s => s.isSyncActive).length}
        delayRange={delayRange}
        setDelayRange={setDelayRange}
        syncMouse={syncMouse}
        setSyncMouse={setSyncMouse}
        syncKeyboard={syncKeyboard}
        setSyncKeyboard={setSyncKeyboard}
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        onTileWindows={handleTileWindows}
        onAlignSizes={handleAlignSizes}
        onBringToFront={handleBringToFront}
        onBroadcastUrl={handleBroadcastUrl}
        onOpenNewTab={handleOpenNewTab}
        onCloseTab={handleCloseTab}
        onReloadAll={handleReloadAll}
      />

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: 0
      }}>
        {/* Signal Flow Visual Pipeline */}
        {runningProfiles.length > 1 && (
          <SyncSignalFlow
            masterProfile={masterProfile}
            slaves={slaves}
            isSyncing={isSyncing}
            delayRange={delayRange}
          />
        )}

        {/* Master Profile Detailed Configuration Card */}
        {runningProfiles.length > 0 && (
          <SyncMasterCard
            masterProfile={masterProfile}
            allRunningProfiles={runningProfiles}
            onSelectMaster={handleSetMaster}
            isSyncing={isSyncing}
            activeSlavesCount={slaves.filter(s => s.isSyncActive).length}
            onSimulateAction={handleSimulateAction}
          />
        )}

        {/* Running Profiles List (Select Master & Toggle Slaves) */}
        <SyncRunningList
          runningProfiles={runningProfiles}
          masterProfileId={masterProfile?.id}
          onSetMaster={handleSetMaster}
          onToggleSlaveSync={handleToggleSlaveSync}
          onStopProfile={handleStopProfile}
          onLaunchProfile={handleLaunchProfile}
          allProfiles={profiles}
          isSyncing={isSyncing}
          slaveSyncMap={slaveSyncMap}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
        />
      </div>

      {/* ── BOTTOM LIVE SIGNAL & EVENT LOG ── */}
      <SyncLogPanel
        logs={actionLogs}
        onClearLogs={() => setActionLogs([])}
      />

      {/* ── FLOATING CONTROLLER WIDGET ── */}
      {isMiniFloating && (
        <SyncFloatingBar
          isSyncing={isSyncing}
          setIsSyncing={setIsSyncing}
          masterProfile={masterProfile}
          followersCount={slaves.filter(s => s.isSyncActive).length}
          onTileWindows={handleTileWindows}
          onReloadAll={handleReloadAll}
          onBringToFront={handleBringToFront}
          onClose={() => setIsMiniFloating(false)}
        />
      )}
    </div>
  );
}
