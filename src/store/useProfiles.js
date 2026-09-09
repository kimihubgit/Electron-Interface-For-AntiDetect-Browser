import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROFILES, INITIAL_TRASH_PROFILES, INITIAL_GROUPS } from '../constants/initialData';

/**
 * Hook that owns all profile-related state & actions (including Trash bin and Custom Groups).
 */
export function useProfiles(addLog, addHistoryRecord) {
  const [profiles, setProfiles] = useLocalStorage('antidetect_profiles', INITIAL_PROFILES);
  const [trashProfiles, setTrashProfiles] = useLocalStorage('antidetect_trash_profiles', INITIAL_TRASH_PROFILES);
  const [customGroups, setCustomGroups] = useLocalStorage('antidetect_custom_groups', INITIAL_GROUPS);

  // Group Management (Add, Edit, Delete with cascade updates)
  const addGroup = (groupData) => {
    const name = (groupData?.name || '').trim();
    if (!name) {
      addLog('Tên nhóm không được để trống!', 'error');
      return null;
    }
    if (customGroups.some(g => g.name.toLowerCase() === name.toLowerCase())) {
      addLog(`Nhóm "${name}" đã tồn tại!`, 'warn');
      return null;
    }
    const newGroup = {
      id: `grp-${Date.now().toString().slice(-6)}`,
      name,
      desc: (groupData?.desc || '').trim(),
      color: groupData?.color || '#7C3AED',
      createdAt: new Date().toISOString()
    };
    setCustomGroups(prev => [...prev, newGroup]);
    addLog(`Đã tạo nhóm mới: "${newGroup.name}"`, 'success');
    return newGroup;
  };

  const editGroup = (groupId, groupData) => {
    const target = customGroups.find(g => g.id === groupId);
    if (!target) return false;
    const oldName = target.name;
    const newName = (groupData?.name || '').trim();
    if (!newName) {
      addLog('Tên nhóm không được để trống!', 'error');
      return false;
    }
    if (oldName.toLowerCase() !== newName.toLowerCase() &&
        customGroups.some(g => g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())) {
      addLog(`Tên nhóm "${newName}" đã tồn tại! Vui lòng chọn tên khác.`, 'warn');
      return false;
    }

    setCustomGroups(prev => prev.map(g => g.id === groupId ? {
      ...g,
      name: newName,
      desc: groupData.desc !== undefined ? groupData.desc.trim() : g.desc,
      color: groupData.color || g.color
    } : g));

    // Cascade name update to profiles
    if (oldName !== newName) {
      setProfiles(prev => prev.map(p => p.group === oldName ? { ...p, group: newName } : p));
      addLog(`Đã đổi tên nhóm từ "${oldName}" thành "${newName}" và cập nhật các hồ sơ`, 'success');
    } else {
      addLog(`Đã cập nhật thông tin nhóm "${newName}"`, 'info');
    }
    return true;
  };

  const deleteGroup = (groupId) => {
    const target = customGroups.find(g => g.id === groupId);
    if (!target) return false;

    const affectedProfiles = profiles.filter(p => p.group === target.name);
    if (affectedProfiles.length > 0) {
      // Safely reassign profiles belonging to the deleted group to 'Chung'
      setProfiles(prev => prev.map(p => p.group === target.name ? { ...p, group: 'Chung' } : p));
    }

    setCustomGroups(prev => prev.filter(g => g.id !== groupId));
    addLog(`Đã xóa nhóm "${target.name}". ${affectedProfiles.length > 0 ? `Đã chuyển ${affectedProfiles.length} hồ sơ sang nhóm "Chung"` : ''}`, 'warn');
    return true;
  };

  const toggleLaunchProfile = (profileId) => {
    setProfiles(prev => prev.map(p => {
      if (p.id === profileId) {
        if (p.status === 'running') {
          addLog(`Đã tắt tiến trình hồ sơ: "${p.name}"`, 'warn');
          if (addHistoryRecord) {
            addHistoryRecord({
              method: 'STOP',
              methodColor: '#EF4444',
              methodBg: '#FEF2F2',
              target: (p.name || 'profile').toLowerCase().replace(/[^a-z0-9]/g, '-'),
              profileId: p.id,
              profileName: p.name,
              group: p.group || 'Chung',
              status: 'Exited (0)',
              duration: '15m 20s',
              pid: Math.floor(10000 + Math.random() * 90000),
              params: [
                { name: 'profileId', value: p.id, type: 'string', description: 'ID định danh hồ sơ' },
                { name: 'status', value: 'idle (stopped)', type: 'string', description: 'Trạng thái tiến trình' }
              ],
              logs: [
                `[${new Date().toLocaleTimeString()}] [STOP] Tiến trình đã được tắt bởi người dùng`,
                `[${new Date().toLocaleTimeString()}] [STORAGE] Đã lưu cache và cập nhật session vault`
              ]
            });
          }
        } else {
          const currentlyRunning = profiles.filter(item => item.status === 'running').length;
          const maxConcurrent = parseInt(localStorage.getItem('cfg_max_concurrent_profiles') ?? '5', 10);
          if (maxConcurrent > 0 && currentlyRunning >= maxConcurrent) {
            addLog(`Không thể mở "${p.name}": Đã đạt giới hạn tối đa ${maxConcurrent} profile chạy đồng thời (vào Cài đặt để tăng giới hạn)`, 'error');
            return p;
          }

          addLog(`Đang khởi chạy Chromium độc lập cho "${p.name}" (Proxy: ${p.proxy?.host || 'Direct'})...`, 'success');
          if (addHistoryRecord) {
            const targetUrl = p.name.toLowerCase().includes('facebook') ? 'facebook.com/adsmanager' 
              : p.name.toLowerCase().includes('tiktok') ? 'seller-vn.tiktok.com'
              : p.name.toLowerCase().includes('crypto') ? 'binance.com/futures'
              : 'gogole.com';
            addHistoryRecord({
              method: 'RUN',
              methodColor: '#10B981',
              methodBg: '#ECFDF5',
              target: targetUrl,
              url: `https://${targetUrl}`,
              profileId: p.id,
              profileName: p.name,
              group: p.group || 'Chung',
              status: '200 OK',
              duration: 'Đang chạy',
              pid: Math.floor(10000 + Math.random() * 90000),
              params: [
                { name: 'profileId', value: p.id, type: 'string', description: 'ID định danh hồ sơ' },
                { name: 'proxyHost', value: p.proxy?.host ? `${p.proxy.host}:${p.proxy.port}` : 'Direct', type: p.proxy?.type || 'direct', description: 'Proxy mạng' },
                { name: 'userAgent', value: p.userAgent || 'Chrome 128', type: 'string', description: 'User-Agent giả lập' },
                { name: 'canvasNoise', value: '0.00314', type: 'float', description: 'Fingerprint Vector' },
                { name: 'webglVendor', value: p.webglVendor || 'Google Inc.', type: 'string', description: 'Card đồ họa' }
              ],
              logs: [
                `[${new Date().toLocaleTimeString()}] [CORE] Khởi tạo tiến trình Chromium độc lập cho "${p.name}"`,
                `[${new Date().toLocaleTimeString()}] [NETWORK] Kết nối qua Proxy: ${p.proxy?.host ? `${p.proxy.type}://${p.proxy.host}:${p.proxy.port}` : 'Kết nối trực tiếp'}`,
                `[${new Date().toLocaleTimeString()}] [FINGERPRINT] Đã nạp thành công bộ vân tay chống phát hiện`,
                `[${new Date().toLocaleTimeString()}] [PROCESS] Cửa sổ trình duyệt đã mở sẵn sàng`
              ]
            });
          }
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
    const currentlyRunning = profiles.filter(p => p.status === 'running').length;
    const maxConcurrent = parseInt(localStorage.getItem('cfg_max_concurrent_profiles') ?? '5', 10);
    
    let toLaunch = ids;
    if (maxConcurrent > 0) {
      const availableSlots = Math.max(0, maxConcurrent - currentlyRunning);
      if (availableSlots <= 0) {
        addLog(`Không thể mở hàng loạt: Đã đạt giới hạn tối đa ${maxConcurrent} profile chạy đồng thời!`, 'error');
        return;
      }
      if (ids.length > availableSlots) {
        toLaunch = ids.slice(0, availableSlots);
        addLog(`Chỉ có thể chạy thêm ${availableSlots}/${ids.length} hồ sơ do chạm giới hạn chạy đồng thời (${maxConcurrent})`, 'warn');
      }
    }

    setProfiles(prev => prev.map(p => toLaunch.includes(p.id) ? { ...p, status: 'running' } : p));
    addLog(`Đã khởi chạy hàng loạt ${toLaunch.length} hồ sơ`, 'success');
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
    emptyTrash,
    customGroups,
    setCustomGroups,
    addGroup,
    editGroup,
    deleteGroup
  };
}

