import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROFILES } from '../constants/initialData';

/**
 * Hook that owns all profile-related state & actions.
 */
export function useProfiles(addLog) {
  const [profiles, setProfiles] = useLocalStorage('antidetect_profiles', INITIAL_PROFILES);

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
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ "${target?.name}"?`)) {
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      addLog(`Đã xóa hồ sơ "${target?.name}"`, 'warn');
    }
  };

  return { profiles, toggleLaunchProfile, saveProfile, deleteProfile };
}
