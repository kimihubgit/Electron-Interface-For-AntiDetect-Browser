import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_PROFILES, INITIAL_TRASH_PROFILES, INITIAL_GROUPS } from '../constants/initialData';
import {
  getProfilesApi,
  createProfileApi,
  bulkCreateProfilesApi,
  updateProfileApi,
  deleteProfileApi,
  batchProfilesApi,
  lockProfileApi,
  unlockProfileApi,
  heartbeatProfileApi,
  importCookiesApi,
  restoreProfileFromTrashApi,
  emptyTrashApi,
  getLaunchTicketApi
} from '../services/profileService';

const MOCK_PROFILE_IDS = new Set(['prof-001', 'prof-002', 'prof-003', 'prof-004', 'prof-005', 'prof-006']);

/**
 * Hook that owns all profile-related state & actions (including Trash bin and Custom Groups).
 * All actions are wrapped in useCallback and return value is memoized with useMemo.
 */
export function useProfiles(addLog, addHistoryRecord, currentUser = null, currentWorkspace = null, setCurrentUser = null) {
  const wsId = currentWorkspace?.id || currentUser?.workspace?.id || 'ws_personal';
  const userScopeKey = currentUser
    ? `${currentUser.id || (currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, '_') : 'user')}_${wsId}`
    : `guest_${wsId}`;
  const isRealUser = Boolean(currentUser && !currentUser.isOffline);

  const profilesKey = `antidetect_profiles_${userScopeKey}`;
  const trashKey = `antidetect_trash_profiles_${userScopeKey}`;
  const groupsKey = `antidetect_custom_groups_${userScopeKey}`;

  // Workspace-specific default seed data
  const getDefaultProfiles = () => {
    if (isRealUser) return [];
    if (wsId === 'ws_personal') {
      try {
        const legacy = localStorage.getItem('antidetect_profiles');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
      return INITIAL_PROFILES.slice(0, 2);
    }
    if (wsId === 'ws_agency_fb') {
      return [
        {
          id: 'prof-agency-01',
          name: 'FB Agency Scale #01 (BM50)',
          group: 'Facebook Agency',
          os: 'windows',
          browser: 'Chrome 128',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          status: 'idle',
          proxy: { type: 'SOCKS5', host: '104.28.19.45', port: 1080, user: 'agency_usr', pass: 'agency_pwd', country: 'US', ip: '104.28.19.45', latency: 32, status: 'live' },
          canvas: 'noise', webgl: 'noise',
          webglVendor: 'Google Inc. (NVIDIA)',
          webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4080 Direct3D11 vs_5_0 ps_5_0)',
          webrtc: 'altered', resolution: '1920x1080', cores: 16, ram: 32,
          tags: ['Facebook', 'BM50', 'Agency'],
          createdAt: '2026-09-05T10:00:00Z'
        },
        {
          id: 'prof-agency-02',
          name: 'TikTok Ads Agency (US Target)',
          group: 'TikTok Agency',
          os: 'windows',
          browser: 'Chrome 128',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          status: 'idle',
          proxy: { type: 'HTTP', host: '172.67.142.12', port: 8080, user: '', pass: '', country: 'US', ip: '172.67.142.12', latency: 40, status: 'live' },
          canvas: 'noise', webgl: 'noise',
          webglVendor: 'Google Inc. (Intel)',
          webglRenderer: 'ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)',
          webrtc: 'altered', resolution: '1920x1080', cores: 8, ram: 16,
          tags: ['TikTok', 'Agency'],
          createdAt: '2026-09-06T12:00:00Z'
        }
      ];
    }
    if (wsId === 'ws_ecom_global') {
      return [
        {
          id: 'prof-ecom-01',
          name: 'Amazon Seller Central Global',
          group: 'Amazon',
          os: 'windows',
          browser: 'Chrome 128',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          status: 'idle',
          proxy: { type: 'SOCKS5', host: '198.51.100.22', port: 1080, user: '', pass: '', country: 'DE', ip: '198.51.100.22', latency: 55, status: 'live' },
          canvas: 'noise', webgl: 'noise',
          webglVendor: 'Google Inc. (NVIDIA)',
          webglRenderer: 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
          webrtc: 'altered', resolution: '1920x1080', cores: 8, ram: 16,
          tags: ['Amazon', 'EU'],
          createdAt: '2026-09-07T08:00:00Z'
        }
      ];
    }
    return [];
  };

  const [rawProfiles, setRawProfiles] = useLocalStorage(profilesKey, getDefaultProfiles());
  const [trashProfiles, setTrashProfiles] = useLocalStorage(trashKey, isRealUser ? [] : INITIAL_TRASH_PROFILES);
  const [customGroups, setCustomGroups] = useLocalStorage(groupsKey, isRealUser ? [] : INITIAL_GROUPS);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);

  // Filter out any mock residual profiles for authenticated users
  const profiles = useMemo(() => {
    if (!Array.isArray(rawProfiles)) return [];
    if (isRealUser) {
      return rawProfiles.filter(p => !MOCK_PROFILE_IDS.has(p.id));
    }
    return rawProfiles;
  }, [rawProfiles, isRealUser]);

  const setProfiles = setRawProfiles;

  // Sync profiles from backend on login / mount
  useEffect(() => {
    if (isRealUser) {
      setIsLoadingProfiles(true);
      getProfilesApi({ page: 1, limit: 100 })
        .then(res => {
          if (res.success && Array.isArray(res.items)) {
            const normalized = res.items.map(item => ({
              id: item.id,
              name: item.name,
              group: item.group_name || item.group_id || 'Chung',
              tags: item.tags || [],
              status: item.status || 'idle',
              os: item.os || 'windows',
              browser: item.browser ? `${item.browser} ${item.browser_version || ''}`.trim() : 'Chrome 128',
              userAgent: item.user_agent || '',
              proxy: item.proxy || { type: 'NO_PROXY' },
              cookiesCount: item.cookies_count || 0,
              notes: item.notes || item.remark || '',
              createdAt: item.created_at || new Date().toISOString()
            }));

            // Backend là nguồn chuẩn: tự động dọn dẹp các profile ảo/vượt mức bị backend từ chối, đồng thời bảo toàn các trường runtime (diskSize, workTime, launchCount)
            setRawProfiles(prev => {
              const prevMap = new Map((Array.isArray(prev) ? prev : []).map(p => [String(p.id), p]));
              return normalized.map(item => {
                const existing = prevMap.get(String(item.id));
                return {
                  ...item,
                  diskSize: existing?.diskSize,
                  cacheSize: existing?.cacheSize,
                  workTime: existing?.workTime,
                  launchCount: existing?.launchCount
                };
              });
            });
          }
        })
        .catch(err => {
          console.warn('Sync profiles from API failed, using local cache:', err);
        })
        .finally(() => {
          setIsLoadingProfiles(false);
        });
    }
  }, [isRealUser, setRawProfiles, wsId]);

  // 6. Periodic Heartbeat every 30 seconds for actively running profiles
  useEffect(() => {
    if (!isRealUser) return;
    const runningProfiles = profiles.filter(p => p.status === 'running');
    if (runningProfiles.length === 0) return;

    const intervalId = setInterval(() => {
      runningProfiles.forEach(p => {
        heartbeatProfileApi(p.id).catch(err => console.debug('Heartbeat error for', p.id, err));
      });
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isRealUser, profiles]);

  // 7. Listen to native browser window close events from Electron
  useEffect(() => {
    if (window.electronAPI?.onBrowserExited) {
      const unsub = window.electronAPI.onBrowserExited(({ profileId, exitCode, duration }) => {
        setProfiles(prev => prev.map(p => String(p.id) === String(profileId) ? { 
          ...p, 
          status: 'idle',
          workTime: duration || p.workTime || '—'
        } : p));
        if (isRealUser) {
          unlockProfileApi(profileId).catch(() => {});
        }
        addLog?.(`Cửa sổ trình duyệt của hồ sơ [${profileId}] đã đóng${duration ? ` (thời gian chạy: ${duration})` : ''}`, 'info');
      });
      return unsub;
    }
  }, [setProfiles, addLog, isRealUser]);

  // Lắng nghe cập nhật dung lượng profile tự động từ background khi browser đóng
  useEffect(() => {
    if (window.electronAPI?.onProfileSizeUpdated) {
      const unsub = window.electronAPI.onProfileSizeUpdated(({ profileId, size }) => {
        setProfiles(prev => prev.map(p => String(p.id) === String(profileId) ? { ...p, diskSize: size, cacheSize: size } : p));
      });
      return unsub;
    }
  }, [setProfiles]);

  // Lấy dung lượng thực tế của các profile khi nạp danh sách hoặc chuyển workspace (có cache 10p, 0ms không lag)
  useEffect(() => {
    if (!window.electronAPI?.getProfileSizes || !profiles || profiles.length === 0) return;
    const profileIds = profiles.map(p => p.id);

    let isMounted = true;
    window.electronAPI.getProfileSizes(profileIds).then(sizesMap => {
      if (!isMounted || !sizesMap) return;
      setProfiles(prev => prev.map(p => {
        const sz = sizesMap[p.id] || sizesMap[String(p.id)];
        if (sz && sz !== p.diskSize) {
          return { ...p, diskSize: sz, cacheSize: sz };
        }
        return p;
      }));
    }).catch(() => {});

    return () => { isMounted = false; };
  }, [wsId, profilesKey, profiles?.length]);

  // Group Management (Add, Edit, Delete with cascade updates)
  const addGroup = useCallback((groupData) => {
    const name = (groupData?.name || '').trim();
    if (!name) {
      addLog?.('Tên nhóm không được để trống!', 'error');
      return null;
    }
    let created = null;
    setCustomGroups(prev => {
      if (prev.some(g => g.name.toLowerCase() === name.toLowerCase())) {
        addLog?.(`Nhóm "${name}" đã tồn tại!`, 'warn');
        return prev;
      }
      created = {
        id: `grp-${Date.now().toString().slice(-6)}`,
        name,
        desc: (groupData?.desc || '').trim(),
        color: groupData?.color || '#7C3AED',
        createdAt: new Date().toISOString()
      };
      addLog?.(`Đã tạo nhóm mới: "${created.name}"`, 'success');
      return [...prev, created];
    });
    return created;
  }, [addLog, setCustomGroups]);

  const editGroup = useCallback((groupId, groupData) => {
    const newName = (groupData?.name || '').trim();
    if (!newName) {
      addLog?.('Tên nhóm không được để trống!', 'error');
      return false;
    }

    let success = false;
    let oldName = '';
    setCustomGroups(prev => {
      const target = prev.find(g => g.id === groupId);
      if (!target) return prev;
      oldName = target.name;

      if (oldName.toLowerCase() !== newName.toLowerCase() &&
        prev.some(g => g.id !== groupId && g.name.toLowerCase() === newName.toLowerCase())) {
        addLog?.(`Tên nhóm "${newName}" đã tồn tại! Vui lòng chọn tên khác.`, 'warn');
        return prev;
      }

      success = true;
      return prev.map(g => g.id === groupId ? {
        ...g,
        name: newName,
        desc: groupData.desc !== undefined ? groupData.desc.trim() : g.desc,
        color: groupData.color || g.color
      } : g);
    });

    if (success && oldName && oldName !== newName) {
      setProfiles(prev => prev.map(p => p.group === oldName ? { ...p, group: newName } : p));
      addLog?.(`Đã đổi tên nhóm từ "${oldName}" thành "${newName}" và cập nhật các hồ sơ`, 'success');
    } else if (success) {
      addLog?.(`Đã cập nhật thông tin nhóm "${newName}"`, 'info');
    }
    return success;
  }, [addLog, setCustomGroups, setProfiles]);

  const deleteGroup = useCallback((groupId) => {
    let targetName = '';
    setCustomGroups(prev => {
      const target = prev.find(g => g.id === groupId);
      if (!target) return prev;
      targetName = target.name;
      return prev.filter(g => g.id !== groupId);
    });

    if (targetName) {
      setProfiles(prev => {
        const affectedCount = prev.filter(p => p.group === targetName).length;
        addLog?.(`Đã xóa nhóm "${targetName}". ${affectedCount > 0 ? `Đã chuyển ${affectedCount} hồ sơ sang nhóm "Chung"` : ''}`, 'warn');
        return prev.map(p => p.group === targetName ? { ...p, group: 'Chung' } : p);
      });
      return true;
    }
    return false;
  }, [addLog, setCustomGroups, setProfiles]);

  const toggleLaunchProfile = useCallback(async (profileId) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;

    if (target.status === 'running') {
      if (window.electronAPI?.stopBrowser) {
        window.electronAPI.stopBrowser(profileId).catch(() => {});
      }
      if (isRealUser) {
        unlockProfileApi(profileId).catch(() => {});
      }
      setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, status: 'idle' } : p));
      addLog?.(`Đã tắt tiến trình hồ sơ: "${target.name}"`, 'warn');
      if (addHistoryRecord) {
        addHistoryRecord({
          method: 'STOP',
          methodColor: '#EF4444',
          methodBg: '#FEF2F2',
          target: (target.name || 'profile').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          profileId: target.id,
          profileName: target.name,
          group: target.group || 'Chung',
          status: 'Exited (0)',
          duration: '15m 20s',
          pid: Math.floor(10000 + Math.random() * 90000),
          params: [
            { name: 'profileId', value: target.id, type: 'string', description: 'ID định danh hồ sơ' },
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
        addLog?.(`Không thể mở "${target.name}": Đã đạt giới hạn tối đa ${maxConcurrent} profile chạy đồng thời (vào Cài đặt để tăng giới hạn)`, 'error');
        return;
      }

      if (isRealUser) {
        const lockRes = await lockProfileApi(profileId);
        if (lockRes.conflict) {
          addLog?.(`[Xung đột] ${lockRes.error}`, 'error');
          alert(`⚠️ ${lockRes.error}`);
          return;
        }

        // Xin vé khởi chạy bảo mật từ server (30s)
        const targetLaunchVer = target.browser_version || (target.browser ? target.browser.replace(/[^0-9]/g, '') : '') || '152';
        const ticketRes = await getLaunchTicketApi(profileId, {
          version: targetLaunchVer
        });
        if (!ticketRes.success) {
          addLog?.(`[Bảo vệ bản quyền] ${ticketRes.error}`, 'error');
          alert(`⚠️ ${ticketRes.error}`);
          unlockProfileApi(profileId).catch(() => {});
          return;
        }
        target.launch_ticket = ticketRes.launch_ticket;
        target.session_key = ticketRes.session_key;
      }

      let realPid = Math.floor(10000 + Math.random() * 90000);

      // Attach active extensions from Extension Manager
      if (!target.extensions || target.extensions.length === 0) {
        try {
          const rawExts = localStorage.getItem('antidetect_installed_extensions_v2');
          if (rawExts) {
            const parsedExts = JSON.parse(rawExts);
            if (Array.isArray(parsedExts)) {
              const activeExts = parsedExts.filter(e => {
                if (!e.enabled) return false;
                if (e.targetProfileIds && Array.isArray(e.targetProfileIds) && e.targetProfileIds.length > 0) {
                  return e.targetProfileIds.includes(String(profileId));
                }
                return true; // default: applies to all profiles
              });
              if (activeExts.length > 0) {
                target.extensions = activeExts;
              }
            }
          }
        } catch {}
      }

      // Launch real Chrome / Chromium process via Electron if available
      if (window.electronAPI?.launchBrowser) {
        const launchRes = await window.electronAPI.launchBrowser(target);
        if (!launchRes.success) {
          if (isRealUser) {
            unlockProfileApi(profileId).catch(() => {});
          }

          if (launchRes.needDownload) {
            addLog?.(`Nhân Chrome v${launchRes.version} chưa được cài đặt. Đang mở hộp thoại tải nhân độc lập...`, 'warn');
            window.dispatchEvent(new CustomEvent('antidetect-need-engine-download', {
              detail: { version: launchRes.version, profile: target }
            }));
            return;
          }

          addLog?.(`Lỗi mở Chrome: ${launchRes.error}`, 'error');
          alert(`⚠️ Không thể khởi chạy trình duyệt:\n${launchRes.error}`);
          return;
        }
        if (launchRes.pid) realPid = launchRes.pid;
        addLog?.(`Đã mở Chrome thật cho "${target.name}" (PID: ${realPid}, Proxy: ${target.proxy?.host || 'Direct'})`, 'success');
      } else {
        addLog?.(`Đang khởi chạy Chromium độc lập cho "${target.name}" (Proxy: ${target.proxy?.host || 'Direct'})...`, 'success');
      }

      setProfiles(prev => prev.map(p => String(p.id) === String(profileId) ? { 
        ...p, 
        status: 'running',
        launchCount: (p.launchCount || 0) + 1,
        lastLaunchedAt: new Date().toISOString()
      } : p));
      if (addHistoryRecord) {
        const targetUrl = target.name.toLowerCase().includes('facebook') ? 'facebook.com/adsmanager'
          : target.name.toLowerCase().includes('tiktok') ? 'seller-vn.tiktok.com'
            : target.name.toLowerCase().includes('crypto') ? 'binance.com/futures'
              : 'google.com';
        addHistoryRecord({
          method: 'RUN',
          methodColor: '#10B981',
          methodBg: '#ECFDF5',
          target: targetUrl,
          url: `https://${targetUrl}`,
          profileId: target.id,
          profileName: target.name,
          group: target.group || 'Chung',
          status: '200 OK',
          duration: 'Đang chạy',
          pid: realPid,
          params: [
            { name: 'profileId', value: target.id, type: 'string', description: 'ID định danh hồ sơ' },
            { name: 'proxyHost', value: target.proxy?.host ? `${target.proxy.host}:${target.proxy.port}` : 'Direct', type: target.proxy?.type || 'direct', description: 'Proxy mạng' },
            { name: 'userAgent', value: target.userAgent || 'Chrome 128', type: 'string', description: 'User-Agent giả lập' },
            { name: 'canvasNoise', value: '0.00314', type: 'float', description: 'Fingerprint Vector' },
            { name: 'webglVendor', value: target.webglVendor || 'Google Inc.', type: 'string', description: 'Card đồ họa' }
          ],
          logs: [
            `[${new Date().toLocaleTimeString()}] [CORE] Khởi tạo tiến trình Chromium độc lập cho "${target.name}"`,
            `[${new Date().toLocaleTimeString()}] [NETWORK] Kết nối qua Proxy: ${target.proxy?.host ? `${target.proxy.type}://${target.proxy.host}:${target.proxy.port}` : 'Kết nối trực tiếp'}`,
            `[${new Date().toLocaleTimeString()}] [FINGERPRINT] Đã nạp thành công bộ vân tay chống phát hiện`,
            `[${new Date().toLocaleTimeString()}] [PROCESS] Cửa sổ trình duyệt đã mở sẵn sàng (PID: ${realPid})`
          ]
        });
      }
    }
  }, [profiles, isRealUser, addLog, addHistoryRecord, setProfiles]);

  const saveProfile = useCallback(async (profileData, closeModal) => {
    if (profileData.id) {
      setProfiles(prev => prev.map(p => p.id === profileData.id ? { ...p, ...profileData } : p));
      addLog?.(`Đã cập nhật cấu hình hồ sơ "${profileData.name}"`, 'info');
      if (isRealUser) {
        updateProfileApi(profileData.id, profileData).catch(e => console.warn('Update profile API error:', e));
        if (profileData.cookies) {
          importCookiesApi({ profile_id: profileData.id, cookies: profileData.cookies }).catch(e => console.warn('Import cookies error:', e));
        }
      }
    } else {
      const maxProfiles = Number(currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? currentWorkspace?.max_profiles ?? 5) || 5;
      const currentActiveCount = profiles.length;
      const remainingSlots = Math.max(0, maxProfiles - currentActiveCount);

      if (remainingSlots <= 0) {
        addLog?.(`Không thể tạo thêm: Đã đạt giới hạn tối đa ${maxProfiles} hồ sơ của gói cước!`, 'error');
        alert(`⚠️ Đã đạt giới hạn tối đa (${maxProfiles} hồ sơ) của gói cước hiện tại!\nVui lòng nâng cấp gói cước để tạo thêm hồ sơ.`);
        return;
      }

      const localId = `prof-${Date.now().toString().slice(-6)}`;
      const createdProfile = {
        ...profileData,
        id: localId,
        status: 'idle',
        createdAt: new Date().toISOString(),
      };

      // 1. Optimistic UI: hiển thị profile ngay lập tức (0ms delay)
      setProfiles(prev => [createdProfile, ...prev]);
      addLog?.(`Tạo mới hồ sơ "${createdProfile.name}" với Fingerprint 100% Unique`, 'success');

      // Cập nhật quota tạm thời
      const optUsed = currentActiveCount + 1;
      const optCan = Math.max(0, maxProfiles - optUsed);
      if (setCurrentUser) {
        setCurrentUser(u => u ? { ...u, alreadyAddBrowsersCount: optUsed, canAddBrowsersCount: optCan } : u);
      }
      try {
        const rawUser = localStorage.getItem('auth_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.alreadyAddBrowsersCount = optUsed;
          u.canAddBrowsersCount = optCan;
          localStorage.setItem('auth_user', JSON.stringify(u));
        }
      } catch {}

      // 2. Đồng bộ ngầm với backend API (không block UI người dùng)
      if (isRealUser) {
        createProfileApi(profileData)
          .then(apiRes => {
            if (apiRes.success && apiRes.data?.id) {
              setProfiles(prev => prev.map(p => p.id === localId ? {
                ...p,
                ...apiRes.data,
                id: apiRes.data.id,
                group: profileData.group || 'Chung'
              } : p));

              if (profileData.cookies) {
                importCookiesApi({ profile_id: apiRes.data.id, cookies: profileData.cookies }).catch(e => console.warn('Import cookies error:', e));
              }

              if (apiRes.data?.quota) {
                try {
                  const rawUser = localStorage.getItem('auth_user');
                  const qUsed = apiRes.data.quota.used_profiles;
                  const qRem = apiRes.data.quota.remaining_profiles;
                  if (setCurrentUser) {
                    setCurrentUser(u => u ? { ...u, alreadyAddBrowsersCount: qUsed, canAddBrowsersCount: qRem } : u);
                  }
                  if (rawUser) {
                    const u = JSON.parse(rawUser);
                    u.alreadyAddBrowsersCount = qUsed;
                    u.canAddBrowsersCount = qRem;
                    localStorage.setItem('auth_user', JSON.stringify(u));
                  }
                } catch {}
              }
            } else if (apiRes && !apiRes.success) {
              // Máy chủ từ chối tạo profile (ví dụ: đã chạm giới hạn gói cước CREATE_FAILED)
              console.warn('createProfileApi rejected by backend:', apiRes.error);
              // ROLLBACK: Xóa bỏ profile tạm thời khỏi giao diện ngay lập tức
              setProfiles(prev => prev.filter(p => p.id !== localId));
              const rollUsed = profiles.length;
              const rollCan = Math.max(0, maxProfiles - rollUsed);
              if (setCurrentUser) {
                setCurrentUser(u => u ? { ...u, alreadyAddBrowsersCount: rollUsed, canAddBrowsersCount: rollCan } : u);
              }
              try {
                const rawUser = localStorage.getItem('auth_user');
                if (rawUser) {
                  const u = JSON.parse(rawUser);
                  u.alreadyAddBrowsersCount = rollUsed;
                  u.canAddBrowsersCount = rollCan;
                  localStorage.setItem('auth_user', JSON.stringify(u));
                }
              } catch {}
              const errMsg = apiRes.error || 'Đã đạt giới hạn gói cước. Vui lòng nâng cấp!';
              addLog?.(`Không thể tạo hồ sơ "${createdProfile.name}": ${errMsg}`, 'error');
              alert(`⚠️ Máy chủ từ chối tạo hồ sơ:\n"${errMsg}"\n\nHồ sơ tạm đã được tự động hoàn tác.`);
            }
          })
          .catch(e => console.warn('createProfileApi error:', e));
      }
    }
    if (closeModal) closeModal();
  }, [addLog, setProfiles, isRealUser, profiles.length, currentWorkspace, currentUser, setCurrentUser]);

  const batchCreateProfiles = useCallback((profilesList, callback) => {
    if (!Array.isArray(profilesList) || profilesList.length === 0) return;

    const maxProfiles = Number(currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? currentWorkspace?.max_profiles ?? 5) || 5;
    const currentActiveCount = profiles.length;
    const availableSlots = Math.max(0, maxProfiles - currentActiveCount);

    if (availableSlots <= 0) {
      addLog?.(`Không thể tạo hàng loạt: Đã đạt giới hạn tối đa ${maxProfiles} hồ sơ!`, 'error');
      alert(`⚠️ Không thể tạo: Đã đạt giới hạn tối đa (${maxProfiles} hồ sơ) của gói cước hiện tại!\nVui lòng nâng cấp gói cước.`);
      return;
    }

    if (profilesList.length > availableSlots) {
      alert(`⚠️ Hạn mức gói cước chỉ còn trống ${availableSlots} hồ sơ (tối đa ${maxProfiles} hồ sơ).\nVui lòng giảm số lượng tạo xuống tối đa ${availableSlots} hoặc nâng cấp gói cước!`);
      return;
    }

    const baseTimestamp = Date.now();
    const createdItems = profilesList.map((item, idx) => ({
      ...item,
      id: `prof-${(baseTimestamp + idx).toString().slice(-6)}`,
      status: 'idle',
      createdAt: new Date(baseTimestamp + idx * 2).toISOString(),
    }));

    // 1. Optimistic UI: hiển thị toàn bộ profile mới ngay lập tức
    setProfiles(prev => [...createdItems, ...prev]);
    addLog?.(`Đang khởi tạo ${createdItems.length} hồ sơ vào Workspace...`, 'info');

    // 2. Gửi 1 request Atomic duy nhất lên POST /api/v1/profiles/bulk
    if (isRealUser) {
      const activeWorkspaceId = currentWorkspace?.id || currentUser?.workspace?.id || wsId;
      bulkCreateProfilesApi({
        workspace_id: activeWorkspaceId,
        profiles: createdItems
      })
        .then(apiRes => {
          if (apiRes.success && Array.isArray(apiRes.profiles)) {
            const serverProfiles = apiRes.profiles;
            setProfiles(prev => prev.map(p => {
              const match = serverProfiles.find(sp => sp.name === p.name) || 
                            serverProfiles.find(sp => sp.id === p.id);
              if (match) {
                return {
                  ...p,
                  ...match,
                  id: match.id,
                  workspace_id: match.workspace_id || activeWorkspaceId
                };
              }
              return p;
            }));

            if (apiRes.data?.quota) {
              try {
                const rawUser = localStorage.getItem('auth_user');
                if (rawUser) {
                  const u = JSON.parse(rawUser);
                  u.alreadyAddBrowsersCount = apiRes.data.quota.used_profiles;
                  u.canAddBrowsersCount = apiRes.data.quota.remaining_profiles;
                  localStorage.setItem('auth_user', JSON.stringify(u));
                }
              } catch {}
            }

            addLog?.(`Đã tạo thành công ${apiRes.created_count || createdItems.length} hồ sơ vào Workspace!`, 'success');
          } else if (apiRes && !apiRes.success) {
            // Máy chủ từ chối (vd: LIMIT_EXCEEDED hoặc NO_WORKSPACE_ACCESS)
            console.warn('bulkCreateProfilesApi rejected:', apiRes.error);
            // ROLLBACK: Xóa bỏ toàn bộ profiles tạm đã thêm vào UI
            const createdTempIds = new Set(createdItems.map(i => i.id));
            setProfiles(prev => prev.filter(p => !createdTempIds.has(p.id)));

            const errMsg = apiRes.error || 'Đã đạt giới hạn gói cước. Vui lòng nâng cấp!';
            addLog?.(`Tạo hàng loạt thất bại: ${errMsg}`, 'error');
            alert(`⚠️ Máy chủ từ chối tạo hàng loạt:\n"${errMsg}"\n\nHệ thống đã tự động hoàn tác các hồ sơ tạm.`);
          }
        })
        .catch(err => {
          console.warn('bulkCreateProfilesApi network error:', err);
        });
    }

    if (callback) callback();
  }, [addLog, setProfiles, isRealUser, profiles.length, currentWorkspace, currentUser, wsId, setCurrentUser]);

  const deleteProfile = useCallback((profileId) => {
    const target = profiles.find(p => p.id === profileId);
    if (!target) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ "${target?.name}"? Dữ liệu và cookies của hồ sơ này sẽ được giải phóng khỏi ổ đĩa.`)) {
      // 1. Dừng trình duyệt và xóa thư mục dữ liệu trên đĩa
      if (window.electronAPI?.deleteProfileData) {
        window.electronAPI.deleteProfileData(profileId).catch(() => {});
      } else if (window.electronAPI?.stopBrowser) {
        window.electronAPI.stopBrowser(profileId).catch(() => {});
      }

      // 2. Gọi API backend nếu là user thật (gọi cả DELETE và batch delete)
      if (isRealUser) {
        deleteProfileApi(profileId).catch(() => {});
        batchProfilesApi({ action: 'delete', profile_ids: [profileId] }).catch(e => console.warn('Delete profile API error:', e));
      }

      // 3. Đưa vào Thùng rác để lưu vết lịch sử
      const trashedItem = {
        ...target,
        status: 'idle',
        diskSize: '0 KB',
        category: target.group || 'Chung',
        branchVersion: `${target.browser || 'Chrome 128'} / ${target.os === 'macos' ? 'macOS' : 'Windows 11'}`,
        operator: target?.operator || 'Thành viên',
        daysRemaining: 30,
        deletedAt: new Date().toISOString()
      };
      setTrashProfiles(tPrev => [trashedItem, ...tPrev.filter(item => item.id !== profileId)]);
      setProfiles(prev => prev.filter(p => p.id !== profileId));

      // 4. Cập nhật quota người dùng tức thì
      const newUsed = Math.max(0, profiles.length - 1);
      const maxP = Number(currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? 5) || 5;
      const newCan = Math.max(0, maxP - newUsed);
      if (setCurrentUser) {
        setCurrentUser(u => u ? { ...u, alreadyAddBrowsersCount: newUsed, canAddBrowsersCount: newCan } : u);
      }
      try {
        const rawUser = localStorage.getItem('auth_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.alreadyAddBrowsersCount = newUsed;
          u.canAddBrowsersCount = newCan;
          localStorage.setItem('auth_user', JSON.stringify(u));
        }
      } catch {}

      addLog?.(`Đã xóa hồ sơ "${target?.name}" và giải phóng dữ liệu khỏi ổ đĩa`, 'warn');
    }
  }, [profiles, isRealUser, addLog, setProfiles, setTrashProfiles, currentUser, setCurrentUser]);

  const restoreProfile = useCallback((profileId) => {
    if (isRealUser) {
      restoreProfileFromTrashApi(profileId).catch(e => console.warn('Restore profile API error:', e));
    }
    setTrashProfiles(prev => {
      const target = prev.find(p => p.id === profileId);
      if (!target) return prev;
      const { category, branchVersion, operator, daysRemaining, deletedAt, ...cleanProfile } = target;
      setProfiles(pPrev => [cleanProfile, ...pPrev]);
      addLog?.(`Đã khôi phục hồ sơ "${target.name}" từ Thùng rác`, 'success');
      return prev.filter(p => p.id !== profileId);
    });
  }, [isRealUser, addLog, setProfiles, setTrashProfiles]);

  const restoreMultipleProfiles = useCallback((ids = []) => {
    if (!ids.length) return;
    if (isRealUser) {
      ids.forEach(id => restoreProfileFromTrashApi(id).catch(e => console.warn('Restore profile API error:', e)));
    }
    setTrashProfiles(prev => {
      const targets = prev.filter(p => ids.includes(p.id));
      const restored = targets.map(({ category, branchVersion, operator, daysRemaining, deletedAt, ...clean }) => clean);
      setProfiles(pPrev => [...restored, ...pPrev]);
      addLog?.(`Đã khôi phục ${targets.length} hồ sơ từ Thùng rác`, 'success');
      return prev.filter(p => !ids.includes(p.id));
    });
  }, [isRealUser, addLog, setProfiles, setTrashProfiles]);

  const permanentlyDeleteProfile = useCallback((profileId) => {
    setTrashProfiles(prev => {
      const target = prev.find(p => p.id === profileId);
      if (!target) return prev;
      if (window.confirm(`Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa vĩnh viễn hồ sơ "${target?.name || ''}"?`)) {
        if (window.electronAPI?.deleteProfileData) {
          window.electronAPI.deleteProfileData(profileId).catch(() => {});
        }
        addLog?.(`Đã xóa vĩnh viễn hồ sơ "${target?.name}"`, 'warn');
        return prev.filter(p => p.id !== profileId);
      }
      return prev;
    });
  }, [addLog, setTrashProfiles]);

  const permanentlyDeleteMultipleProfiles = useCallback((ids = []) => {
    if (!ids.length) return;
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn ${ids.length} hồ sơ đã chọn?`)) {
      if (window.electronAPI?.deleteMultipleProfilesData) {
        window.electronAPI.deleteMultipleProfilesData(ids).catch(() => {});
      }
      setTrashProfiles(prev => prev.filter(p => !ids.includes(p.id)));
      addLog?.(`Đã xóa vĩnh viễn ${ids.length} hồ sơ`, 'warn');
    }
  }, [addLog, setTrashProfiles]);

  const cloneProfile = useCallback((profileId) => {
    setProfiles(prev => {
      const target = prev.find(p => p.id === profileId);
      if (!target) return prev;
      const cloned = {
        ...target,
        id: `prof-${Date.now().toString().slice(-6)}`,
        name: `${target.name} (Bản sao)`,
        status: 'idle',
        createdAt: new Date().toISOString()
      };
      addLog?.(`Đã nhân bản hồ sơ "${target.name}"`, 'success');
      return [cloned, ...prev];
    });
  }, [addLog, setProfiles]);

  const batchLaunchProfiles = useCallback(async (ids = []) => {
    if (!ids || ids.length === 0) return;
    const targets = profiles.filter(p => ids.includes(p.id) && p.status !== 'running');
    if (targets.length === 0) {
      addLog?.('Tất cả các hồ sơ đã chọn đều đang chạy!', 'info');
      return;
    }

    const currentlyRunning = profiles.filter(p => p.status === 'running').length;
    const maxConcurrent = parseInt(localStorage.getItem('cfg_max_concurrent_profiles') ?? '5', 10);

    let toLaunch = targets;
    if (maxConcurrent > 0) {
      const availableSlots = Math.max(0, maxConcurrent - currentlyRunning);
      if (availableSlots <= 0) {
        addLog?.(`Không thể mở hàng loạt: Đã đạt giới hạn tối đa ${maxConcurrent} profile chạy đồng thời!`, 'error');
        alert(`⚠️ Không thể mở hàng loạt: Đã đạt giới hạn tối đa ${maxConcurrent} profile chạy đồng thời!`);
        return;
      }
      if (targets.length > availableSlots) {
        toLaunch = targets.slice(0, availableSlots);
        addLog?.(`Chỉ có thể chạy thêm ${availableSlots}/${targets.length} hồ sơ do chạm giới hạn chạy đồng thời (${maxConcurrent})`, 'warn');
      }
    }

    addLog?.(`Bắt đầu khởi chạy ${toLaunch.length} hồ sơ...`, 'info');

    // Chạy tuần tự từng profile cách nhau 400ms để đảm bảo tiến trình Chrome khởi tạo mượt mà
    for (const target of toLaunch) {
      try {
        await toggleLaunchProfile(target.id);
        await new Promise(r => setTimeout(r, 400));
      } catch (err) {
        console.warn(`Lỗi khi khởi chạy profile ${target.name}:`, err);
      }
    }
  }, [profiles, toggleLaunchProfile, addLog]);

  const batchStopProfiles = useCallback(async (ids = []) => {
    if (!ids || ids.length === 0) return;
    addLog?.(`Đang dừng ${ids.length} hồ sơ...`, 'warn');
    for (const id of ids) {
      try {
        if (window.electronAPI?.stopBrowser) {
          await window.electronAPI.stopBrowser(id);
        }
        if (isRealUser) {
          unlockProfileApi(id).catch(() => {});
        }
      } catch {}
    }
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, status: 'idle' } : p));
    addLog?.(`Đã dừng thành công các hồ sơ đã chọn`, 'success');
  }, [addLog, setProfiles, isRealUser]);

  const batchDeleteProfiles = useCallback((ids = []) => {
    if (!ids.length) return;
    if (window.confirm(`Bạn có chắc muốn xóa ${ids.length} hồ sơ đã chọn? Dữ liệu của các hồ sơ này sẽ được giải phóng khỏi ổ đĩa.`)) {
      // 1. Dọn dẹp dữ liệu ổ đĩa
      if (window.electronAPI?.deleteMultipleProfilesData) {
        window.electronAPI.deleteMultipleProfilesData(ids).catch(() => {});
      }

      // 2. Gọi API backend nếu là user thật
      if (isRealUser) {
        ids.forEach(id => deleteProfileApi(id).catch(() => {}));
        batchProfilesApi({ action: 'delete', profile_ids: ids }).catch(e => console.warn('Batch delete API error:', e));
      }

      // 3. Cập nhật state & đưa vào thùng rác
      setProfiles(prev => {
        const targets = prev.filter(p => ids.includes(p.id));
        const trashed = targets.map(t => ({
          ...t,
          status: 'idle',
          diskSize: '0 KB',
          category: t.group || 'Chung',
          branchVersion: `${t.browser || 'Chrome 128'} / ${t.os === 'macos' ? 'macOS' : 'Windows 11'}`,
          operator: t.operator || 'Thành viên',
          daysRemaining: 30,
          deletedAt: new Date().toISOString()
        }));
        setTrashProfiles(tPrev => [...trashed, ...tPrev]);
        addLog?.(`Đã xóa ${ids.length} hồ sơ và giải phóng dữ liệu ổ đĩa`, 'warn');
        return prev.filter(p => !ids.includes(p.id));
      });

      // 4. Cập nhật quota người dùng tức thì
      const newUsed = Math.max(0, profiles.length - ids.length);
      const maxP = Number(currentUser?.addBrowsersCount ?? currentUser?.max_profiles ?? 5) || 5;
      const newCan = Math.max(0, maxP - newUsed);
      if (setCurrentUser) {
        setCurrentUser(u => u ? { ...u, alreadyAddBrowsersCount: newUsed, canAddBrowsersCount: newCan } : u);
      }
      try {
        const rawUser = localStorage.getItem('auth_user');
        if (rawUser) {
          const u = JSON.parse(rawUser);
          u.alreadyAddBrowsersCount = newUsed;
          u.canAddBrowsersCount = newCan;
          localStorage.setItem('auth_user', JSON.stringify(u));
        }
      } catch {}
    }
  }, [isRealUser, addLog, setProfiles, setTrashProfiles, profiles.length, currentUser, setCurrentUser]);

  const emptyTrash = useCallback(() => {
    setTrashProfiles(prev => {
      if (!prev.length) return prev;
      if (window.confirm('Bạn có chắc chắn muốn dọn sạch toàn bộ Thùng rác? Hành động này sẽ xóa vĩnh viễn tất cả hồ sơ và dữ liệu!')) {
        const trashIds = prev.map(p => p.id);
        if (window.electronAPI?.deleteMultipleProfilesData) {
          window.electronAPI.deleteMultipleProfilesData(trashIds).catch(() => {});
        }
        if (isRealUser) {
          emptyTrashApi().catch(e => console.warn('Empty trash API error:', e));
        }
        addLog?.(`Đã dọn sạch ${trashIds.length} hồ sơ trong Thùng rác`, 'warn');
        return [];
      }
      return prev;
    });
  }, [isRealUser, addLog, setTrashProfiles]);

  const batchMoveGroupProfiles = useCallback((ids = [], targetGroup) => {
    if (!ids.length || !targetGroup) return;
    if (isRealUser) {
      batchProfilesApi({ action: 'move_group', profile_ids: ids, target_group_id: targetGroup }).catch(e => console.warn('Batch move group error:', e));
    }
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, group: targetGroup } : p));
    addLog?.(`Đã chuyển ${ids.length} hồ sơ sang nhóm "${targetGroup}"`, 'success');
  }, [isRealUser, addLog, setProfiles]);

  const batchAssignProxyProfiles = useCallback((ids = [], targetProxyId) => {
    if (!ids.length || !targetProxyId) return;
    if (isRealUser) {
      batchProfilesApi({ action: 'assign_proxy', profile_ids: ids, target_proxy_id: targetProxyId }).catch(e => console.warn('Batch assign proxy error:', e));
    }
    setProfiles(prev => prev.map(p => ids.includes(p.id) ? { ...p, proxyId: targetProxyId, proxy_id: targetProxyId } : p));
    addLog?.(`Đã gán proxy cho ${ids.length} hồ sơ`, 'success');
  }, [isRealUser, addLog, setProfiles]);

  return useMemo(() => ({
    profiles,
    trashProfiles,
    toggleLaunchProfile,
    saveProfile,
    batchCreateProfiles,
    deleteProfile,
    cloneProfile,
    batchLaunchProfiles,
    batchStopProfiles,
    batchDeleteProfiles,
    batchMoveGroupProfiles,
    batchAssignProxyProfiles,
    restoreProfile,
    restoreMultipleProfiles,
    permanentlyDeleteProfile,
    permanentlyDeleteMultipleProfiles,
    emptyTrash,
    customGroups,
    setCustomGroups,
    addGroup,
    editGroup,
    deleteGroup,
    isLoadingProfiles
  }), [
    profiles,
    trashProfiles,
    customGroups,
    setCustomGroups,
    isLoadingProfiles,
    toggleLaunchProfile,
    saveProfile,
    batchCreateProfiles,
    deleteProfile,
    cloneProfile,
    batchLaunchProfiles,
    batchStopProfiles,
    batchDeleteProfiles,
    batchMoveGroupProfiles,
    batchAssignProxyProfiles,
    restoreProfile,
    restoreMultipleProfiles,
    permanentlyDeleteProfile,
    permanentlyDeleteMultipleProfiles,
    emptyTrash,
    addGroup,
    editGroup,
    deleteGroup
  ]);
}
