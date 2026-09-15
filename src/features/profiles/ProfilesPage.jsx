import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Globe, Plus } from 'lucide-react';
import { useBrowser } from '../../store/BrowserContext';

// Feature components & hooks
import ProfileHeader from './components/ProfileHeader';
import ProfileTable from './components/ProfileTable';
import ProfileGrid from './components/ProfileGrid';
import ProfileBatchBar from './components/ProfileBatchBar';
import MoveGroupModal from './components/MoveGroupModal';
import DragSelectionBox from './components/DragSelectionBox';
import EngineDownloadModal from '../../components/modals/EngineDownloadModal';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useProfileFilters } from './hooks/useProfileFilters';
import { useProfileDragSelect } from './hooks/useProfileDragSelect';

/**
 * Main Profiles Page - Orchestrator Component
 * Clean Feature-Driven architecture: coordinates subcomponents and domain hooks
 */
export default function ProfilesPage() {
  const {
    profiles = [],
    isLoadingProfiles,
    toggleLaunchProfile,
    startingProfileIds = [],
    saveProfile,
    deleteProfile,
    cloneProfile,
    batchLaunchProfiles,
    batchStopProfiles,
    batchDeleteProfiles,
    batchMoveGroupProfiles,
    setActiveProfileModal,
    selectedGroup,
    customGroups = [],
    addLog
  } = useBrowser();

  // Search, filter, sorting, view mode, and stats calculations
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    osFilter,
    setOsFilter,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    runningCount,
    filteredProfiles,
    allGroups
  } = useProfileFilters(profiles, selectedGroup, customGroups);

  // Selection states
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const isAllSelected = filteredProfiles.length > 0 && selectedProfiles.length === filteredProfiles.length;

  const handleSelectAll = useCallback((e) => {
    if (e.target.checked) {
      setSelectedProfiles(filteredProfiles.map(p => p.id));
    } else {
      setSelectedProfiles([]);
    }
  }, [filteredProfiles]);

  const handleToggleSelect = useCallback((id) => {
    setSelectedProfiles(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  }, []);

  // Drag-to-select hook
  const contentContainerRef = useRef(null);
  const { dragBox, handleContainerMouseDown } = useProfileDragSelect({
    contentContainerRef,
    selectedProfiles,
    setSelectedProfiles
  });

  // Batch actions states (Play options & Move group)
  const [isPlayDropdownOpen, setIsPlayDropdownOpen] = useState(false);
  const [isMoveGroupModalOpen, setIsMoveGroupModalOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState('Chung');
  const [customGroupInput, setCustomGroupInput] = useState('');

  // Active action dropdown menu for individual profile row/card
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Running profiles chronological ordered list (pinned to top)
  const [runningOrder, setRunningOrder] = useState([]);
  const [isPinnedHovered, setIsPinnedHovered] = useState(false);

  // Sync runningOrder whenever profiles change
  useEffect(() => {
    const currentRunningIds = profiles.filter(p => p.status === 'running').map(p => p.id);
    setRunningOrder(prev => {
      const retained = prev.filter(id => currentRunningIds.includes(id));
      const newlyStarted = currentRunningIds.filter(id => !prev.includes(id));
      const next = [...retained, ...newlyStarted];
      if (next.length === prev.length && next.every((val, idx) => val === prev[idx])) {
        return prev;
      }
      return next;
    });
  }, [profiles]);

  // On-demand kernel download modal state
  const [downloadModalData, setDownloadModalData] = useState(null); // { version, profile }

  useEffect(() => {
    const handleNeedDownload = (e) => {
      if (e.detail) {
        setDownloadModalData(e.detail);
      }
    };
    window.addEventListener('antidetect-need-engine-download', handleNeedDownload);
    return () => window.removeEventListener('antidetect-need-engine-download', handleNeedDownload);
  }, []);

  // Pinned running profiles in chronological launched order
  const runningProfiles = useMemo(() => {
    const runningMap = new Map(profiles.filter(p => p.status === 'running').map(p => [p.id, p]));
    const result = [];
    for (const id of runningOrder) {
      const p = runningMap.get(id);
      if (p) {
        result.push(p);
        runningMap.delete(id);
      }
    }
    for (const p of runningMap.values()) {
      result.push(p);
    }
    return result;
  }, [profiles, runningOrder]);

  // Batch Action Handlers
  const handlePlayQuick = useCallback(() => {
    setIsPlayDropdownOpen(false);
    if (!selectedProfiles.length) return;
    batchLaunchProfiles(selectedProfiles);
    addLog?.(`Khởi chạy nhanh ${selectedProfiles.length} hồ sơ đã chọn`, 'success');
  }, [selectedProfiles, batchLaunchProfiles, addLog]);

  const handlePlayAndArrange = useCallback(() => {
    setIsPlayDropdownOpen(false);
    if (!selectedProfiles.length) return;
    batchLaunchProfiles(selectedProfiles);
    addLog?.(`Đang khởi chạy và tự động sắp xếp ${selectedProfiles.length} cửa sổ trình duyệt theo dạng lưới (Grid)...`, 'success');
    alert(`⚡ Đã khởi chạy và tự động sắp xếp ${selectedProfiles.length} cửa sổ trình duyệt theo dạng lưới trên màn hình thành công!`);
  }, [selectedProfiles, batchLaunchProfiles, addLog]);

  const handleConfirmMoveGroup = useCallback(() => {
    const chosen = customGroupInput.trim() || targetGroup;
    if (!chosen || !selectedProfiles.length) return;
    batchMoveGroupProfiles(selectedProfiles, chosen);
    setIsMoveGroupModalOpen(false);
    setCustomGroupInput('');
    addLog?.(`Đã chuyển ${selectedProfiles.length} hồ sơ đã chọn sang nhóm "${chosen}"`, 'success');
  }, [customGroupInput, targetGroup, selectedProfiles, batchMoveGroupProfiles, addLog]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF'
      }}
      onClick={() => {
        if (activeMenuId) setActiveMenuId(null);
        if (isPlayDropdownOpen) setIsPlayDropdownOpen(false);
      }}
    >
      {/* ── TOP HEADER: FILTER TOOLBAR ── */}
      <ProfileHeader
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        osFilter={osFilter}
        setOsFilter={setOsFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        runningCount={runningCount}
        onStopAll={() => batchStopProfiles(profiles.map(p => p.id))}
        onLaunchAll={() => batchLaunchProfiles(profiles.map(p => p.id))}
        onOpenNewProfile={() => setActiveProfileModal('new')}
        onOpenBatchProfile={() => setActiveProfileModal('batch')}
      />

      {/* ── MAIN CONTENT: TABLE VIEW OR GRID VIEW ── */}
      <div
        ref={contentContainerRef}
        onMouseDown={handleContainerMouseDown}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          userSelect: dragBox ? 'none' : 'auto'
        }}
      >
        {isLoadingProfiles ? (
          <div style={{ padding: '24px 20px', backgroundColor: '#FFFFFF', flex: 1 }}>
            <SkeletonLoader type="lines" count={4} />
          </div>
        ) : filteredProfiles.length === 0 ? (
          /* Empty Search / No Profiles Result */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 20px',
            color: '#64748B'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              color: '#94A3B8'
            }}>
              <Globe size={30} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', marginBottom: '4px' }}>
              {searchTerm ? 'Không tìm thấy hồ sơ nào' : 'Chưa có hồ sơ trong danh mục này'}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '16px', maxWidth: '340px', textAlign: 'center' }}>
              {searchTerm
                ? 'Thử kiểm tra lại từ khóa hoặc xóa các bộ lọc để tìm lại'
                : 'Tạo hồ sơ mới để bắt đầu quản lý vân tay và môi trường duyệt web riêng biệt'}
            </div>
            {searchTerm ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setOsFilter('all');
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--apidog-purple)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Xóa bộ lọc
              </button>
            ) : (
              <button
                onClick={() => setActiveProfileModal('new')}
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--apidog-purple)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Tạo hồ sơ đầu tiên
              </button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          /* ── TABLE VIEW ── */
          <ProfileTable
            filteredProfiles={filteredProfiles}
            selectedProfiles={selectedProfiles}
            handleToggleSelect={handleToggleSelect}
            isAllSelected={isAllSelected}
            handleSelectAll={handleSelectAll}
            runningProfiles={runningProfiles}
            isPinnedHovered={isPinnedHovered}
            setIsPinnedHovered={setIsPinnedHovered}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            toggleLaunchProfile={toggleLaunchProfile}
            startingProfileIds={startingProfileIds}
            setActiveProfileModal={setActiveProfileModal}
            deleteProfile={deleteProfile}
            saveProfile={saveProfile}
            cloneProfile={cloneProfile}
            addLog={addLog}
            batchStopProfiles={batchStopProfiles}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        ) : (
          /* ── GRID CARD VIEW ── */
          <ProfileGrid
            filteredProfiles={filteredProfiles}
            selectedProfiles={selectedProfiles}
            handleToggleSelect={handleToggleSelect}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            toggleLaunchProfile={toggleLaunchProfile}
            startingProfileIds={startingProfileIds}
            setActiveProfileModal={setActiveProfileModal}
            deleteProfile={deleteProfile}
            saveProfile={saveProfile}
            cloneProfile={cloneProfile}
            addLog={addLog}
          />
        )}
      </div>

      {/* ── MODAL: CHUYỂN NHÓM HỒ SƠ ── */}
      <MoveGroupModal
        isOpen={isMoveGroupModalOpen}
        onClose={() => setIsMoveGroupModalOpen(false)}
        selectedCount={selectedProfiles.length}
        allGroups={allGroups}
        targetGroup={targetGroup}
        setTargetGroup={setTargetGroup}
        customGroupInput={customGroupInput}
        setCustomGroupInput={setCustomGroupInput}
        onConfirm={handleConfirmMoveGroup}
      />

      {/* ── FLOATING BATCH ACTIONS BAR ── */}
      <ProfileBatchBar
        selectedCount={selectedProfiles.length}
        onClearSelection={() => setSelectedProfiles([])}
        isPlayDropdownOpen={isPlayDropdownOpen}
        setIsPlayDropdownOpen={setIsPlayDropdownOpen}
        onPlayQuick={handlePlayQuick}
        onPlayAndArrange={handlePlayAndArrange}
        onOpenMoveGroup={() => {
          setTargetGroup('Chung');
          setCustomGroupInput('');
          setIsMoveGroupModalOpen(true);
        }}
        onBatchStop={() => {
          batchStopProfiles(selectedProfiles);
          setSelectedProfiles([]);
        }}
        onBatchDelete={() => {
          batchDeleteProfiles(selectedProfiles);
          setSelectedProfiles([]);
        }}
      />

      {/* ── ON-DEMAND ENGINE DOWNLOAD MODAL ── */}
      {downloadModalData && (
        <EngineDownloadModal
          isOpen={!!downloadModalData}
          onClose={() => setDownloadModalData(null)}
          version={downloadModalData.version}
          profile={downloadModalData.profile}
          onSuccessLaunch={(p) => {
            if (p?.id) toggleLaunchProfile(p.id);
          }}
        />
      )}

      {/* ── DRAG SELECTION MARQUEE BOX ── */}
      <DragSelectionBox dragBox={dragBox} />
    </div>
  );
}
