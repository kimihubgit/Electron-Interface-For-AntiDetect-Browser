import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROFILES, INITIAL_TRASH_PROFILES } from '../constants/initialData';

/**
 * Hook that owns all profile-related state & actions (including Trash bin).
 */
export function useProfiles(addLog) {
  const [profiles, setProfiles] = useLocalStorage('antidetect_profiles', INITIAL_PROFILES);
  const [trashProfiles, setTrashProfiles] = useLocalStorage('antidetect_trash_profiles', INITIAL_TRASH_PROFILES);

  const toggleLaunchProfile = (profileId) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        if (p.status === 'running') {
          addLog(`Đã tắt tiến trình hồ sơ: "${p.name}"`, 'warn');
          return { ...p, status: 'idle' };
        } else {
          addLog(`Đang khởi chạy Chromium độc lập cho "${p.name}" (Proxy: ${p.proxy?.host || 'Direct'})...`, 'success');
          return { ...p, status: 'running' };
        }
      }
      return p;
    }));
  };

  const saveProfile = (profileData, closeModal) => {
    if (profileData.id) {
      setProfiles(prev => prev.map(p => p.id === profileData.id ? { ...p, ...profileData } : p));
      addLog(`Đã cập nhật cấu hình hồ sơ "${profileData.name}"`, 'info');
    } else {
      const newProf = {
        ...profileData,
        id: `prof-${Date.now().toString().slice(-6)}`,
        status: 'idle',
        createdAt: new Date().toISOString(),
      };
      setProfiles(prev => [newProf, ...prev]);
      addLog(`Tạo mới hồ sơ "${newProf.name}" với Fingerprint 100% Unique`, 'success');
    }
    closeModal();
  };

  const deleteProfile = (profileId) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;
    if (window.confirm(`Bạn có chắc chắn muốn chuyển hồ sơ "${target?.name}" vào Thùng rác?`)) {
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      const trashedItem = {
        ...target,
        category: target.group || 'Chung',
        branchVersion: `${target.browser || 'Chrome 128'} / ${target.os === 'macos' ? 'macOS' : 'Windows 11'}`,
        operator: 'Admin',
        daysRemaining: 30,
        deletedAt: new Date().toISOString()
      };
      setTrashProfiles(prev => [trashedItem, ...prev.filter(item => item.id !== profileId)]);
      addLog(`Đã chuyển hồ sơ "${target?.name}" vào Thùng rác`, 'warn');
    }
  };

  const restoreProfile = (profileId) => {
    const target = trashProfiles.find(p => p.id === profileId);
    if (!target) return;
    setTrashProfiles(prev => prev.filter(p => p.id !== profileId));
    // Remove trash-specific fields before restoring
    const { category, branchVersion, operator, daysRemaining, deletedAt, ...cleanProfile } = target;
    setProfiles(prev => [cleanProfile, ...prev]);
    addLog(`Đã khôi phục hồ sơ "${target.name}" từ Thùng rác`, 'success');
  };

  const restoreMultipleProfiles = (ids = []) => {
    if (!ids.length) return;
    const targets = trashProfiles.filter(p => ids.includes(p.id));
    setTrashProfiles(prev => prev.filter(p => !ids.includes(p.id)));
    const restored = targets.map(({ category, branchVersion, operator, daysRemaining, deletedAt, ...clean }) => clean);
    setProfiles(prev => [...restored, ...prev]);
    addLog(`Đã khôi phục ${targets.length} hồ sơ từ Thùng rác`, 'success');
  };

  const permanentlyDeleteProfile = (profileId) => {
    const target = trashProfiles.find(p => p.id === profileId);
    if (window.confirm(`Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ "${target?.name || ''}"?`)) {
      setTrashProfiles(prev => prev.filter(p => p.id !== profileId));
      addLog(`Đã xóa vĩnh viễn hồ sơ "${target?.name}"`, 'warn');
    }
  };

  const permanentlyDeleteMultipleProfiles = (ids = []) => {
    if (!ids.length) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${ids.length} hồ sơ đã chọn?`)) {
      setTrashProfiles(prev => prev.filter(p => !ids.includes(p.id)));
      addLog(`Đã xóa vĩnh viễn ${ids.length} hồ sơ`, 'warn');
    }
  };

  const cloneProfile = (profileId) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;
    const cloned = {
      ...target,
      id: `prof-${Date.now().toString().slice(-6)}`,
      name: `${target.name} (Bản sao)`,
      status: 'idle',
      createdAt: new Date().toISOString()
    };
    setProfiles(prev => [cloned, ...prev]);
    addLog(`Đã nhân bản hồ sơ "${target.name}"`, 'success');
  };

  const batchLaunchProfiles = (ids = []) => {
    if (!ids.length) return;
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'running' } : p));
    addLog(`Đã khởi chạy hàng loạt ${ids.length} hồ sơ`, 'success');
  };

  const batchStopProfiles = (ids = []) => {
    if (!ids.length) return;
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'idle' } : p));
    addLog(`Đã dừng hàng loạt ${ids.length} hồ sơ`, 'warn');
  };

  const batchDeleteProfiles = (ids = []) => {
    if (!ids.length) return;
    if (window.confirm(`Bạn có chắc muốn chuyển ${ids.length} hồ sơ đã chọn vào Thùng rác?`)) {
      const targets = profiles.filter(p => ids.includes(p.id));
      setProfiles(prev => prev.filter(p => !ids.includes(p.id)));
      const trashed = targets.map(t => ({
        ...t,
        category: t.group || 'Chung',
        branchVersion: `${t.browser || 'Chrome 128'} / ${t.os === 'macos' ? 'macOS' : 'Windows 11'}`,
        operator: 'Admin',
        daysRemaining: 30,
        deletedAt: new Date().toISOString()
      }));
      setTrashProfiles(prev => [...trashed, ...prev]);
      addLog(`Đã chuyển ${ids.length} hồ sơ vào Thùng rác`, 'warn');
    }
  };

  const emptyTrash = () => {
    if (!trashProfiles.length) return;
    if (window.confirm('Bạn có chắc chắn muốn dọn sạch toàn bộ Thùng rác? Hành động này sẽ xóa vĩnh viễn tất cả hồ sơ!')) {
      const count = trashProfiles.length;
      setTrashProfiles([]);
      addLog(`Đã dọn sạch ${count} hồ sơ trong Thùng rác`, 'warn');
    }
  };

  const batchMoveGroupProfiles = (ids = [], targetGroup) => {
    if (!ids.length || !targetGroup) return;
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, group: targetGroup } : p));
    addLog(`Đã chuyển ${ids.length} hồ sơ sang nhóm "${targetGroup}"`, 'success');
  };

  return { 
    profiles, 
    trashProfiles,
    toggleLaunchProfile, 
    saveProfile, 
    deleteProfile,
    cloneProfile,
    batchLaunchProfiles,
    batchStopProfiles,
    batchDeleteProfiles,
    batchMoveGroupProfiles,
    restoreProfile,
    restoreMultipleProfiles,
    permanentlyDeleteProfile,
    permanentlyDeleteMultipleProfiles,
    emptyTrash
  };
}

