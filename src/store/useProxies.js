import { useState, useCallback, useMemo, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  INITIAL_PROXIES, 
  INITIAL_ROTATING_PROXIES, 
  INITIAL_DCOM_DEVICES 
} from '../constants/initialData';
import { testProxyConnection, testAllProxies } from '../features/profiles/utils/proxyUtils';

/**
 * Hook that owns all proxy-related state & actions:
 * - Static Proxy Pool & Bulk Import
 * - Rotating Proxies (API Change IP & Round-Robin)
 * - DCOM 4G/5G Dongles (Airplane Mode Reset & Local Forwarding)
 * - IPv6 Subnet /64 Generator
 * Stabilized with useCallback, useMemo, and concurrency/race-condition guards.
 */
const MOCK_PROXY_IDS = new Set(['px-001', 'px-002', 'px-003', 'px-004', 'px-005', 'px-006']);

export function useProxies(addLog, currentUser = null) {
  const userScopeKey = currentUser
    ? (currentUser.workspace?.id || currentUser.id || (currentUser.email ? currentUser.email.replace(/[^a-zA-Z0-9]/g, '_') : 'user'))
    : 'guest';
  const isRealUser = Boolean(currentUser && !currentUser.isOffline);

  const proxiesKey = isRealUser ? `antidetect_proxies_${userScopeKey}` : 'antidetect_proxies';
  const rotatingKey = isRealUser ? `antidetect_rotating_proxies_${userScopeKey}` : 'antidetect_rotating_proxies';
  const dcomKey = isRealUser ? `antidetect_dcom_devices_${userScopeKey}` : 'antidetect_dcom_devices';

  const [rawProxies, setRawProxies] = useLocalStorage(proxiesKey, isRealUser ? [] : INITIAL_PROXIES);
  const [rotatingProxies, setRotatingProxies] = useLocalStorage(rotatingKey, isRealUser ? [] : INITIAL_ROTATING_PROXIES);
  const [dcomDevices, setDcomDevices] = useLocalStorage(dcomKey, isRealUser ? [] : INITIAL_DCOM_DEVICES);
  const [generatedIpv6List, setGeneratedIpv6List] = useState([]);

  const proxies = useMemo(() => {
    if (!Array.isArray(rawProxies)) return [];
    if (isRealUser) {
      return rawProxies.filter(p => !MOCK_PROXY_IDS.has(p.id));
    }
    return rawProxies;
  }, [rawProxies, isRealUser]);

  const setProxies = setRawProxies;

  const safeProxies = useMemo(() => {
    return isRealUser ? (Array.isArray(proxies) ? proxies : []) : (Array.isArray(proxies) && proxies.length > 0 ? proxies : INITIAL_PROXIES);
  }, [isRealUser, proxies]);

  const proxiesRef = useRef(safeProxies);
  proxiesRef.current = safeProxies;

  // Race-condition guard: tracks currently checking proxy IDs
  const activeCheckingRef = useRef(new Set());
  const isCheckingAllRef = useRef(false);

  // 1. Static Proxy actions
  const addProxy = useCallback((proxyData, closeModal) => {
    const newPx = {
      ...proxyData,
      id: proxyData.id || `px-${Date.now().toString().slice(-4)}`,
      status: proxyData.status || 'unknown',
      usedCount: proxyData.usedCount || 0,
      latency: proxyData.latency !== undefined ? proxyData.latency : null,
      outboundIp: proxyData.outboundIp || null
    };
    setProxies(prev => [newPx, ...prev]);
    addLog?.(`Thêm Proxy mới: ${newPx.type}://${newPx.host}:${newPx.port}`, 'success');
    if (closeModal) closeModal();
  }, [addLog, setProxies]);

  const bulkImportProxies = useCallback((rawText, defaultType = 'SOCKS5', defaultCountry = '', defaultIpVersion = 'IPv4') => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const newItems = [];

    lines.forEach((line, idx) => {
      let host = '', port = 1080, user = '', pass = '', type = defaultType;
      let cleanLine = line;

      // Detect protocol prefix if present
      if (/^socks5:\/\//i.test(cleanLine)) {
        type = 'SOCKS5';
        cleanLine = cleanLine.replace(/^socks5:\/\//i, '');
      } else if (/^https:\/\//i.test(cleanLine)) {
        type = 'HTTPS';
        cleanLine = cleanLine.replace(/^https:\/\//i, '');
      } else if (/^http:\/\//i.test(cleanLine)) {
        type = 'HTTP';
        cleanLine = cleanLine.replace(/^http:\/\//i, '');
      }

      // Detect IPv6 bracket notation [2402:...]:1080
      if (cleanLine.startsWith('[')) {
        const closeIdx = cleanLine.indexOf(']');
        if (closeIdx !== -1) {
          host = cleanLine.substring(1, closeIdx);
          const rest = cleanLine.substring(closeIdx + 1);
          if (rest.startsWith(':')) {
            const parts = rest.substring(1).split(':');
            port = Number(parts[0]) || 1080;
            if (parts.length >= 3) {
              user = parts[1];
              pass = parts.slice(2).join(':');
            }
          }
        }
      } else if (cleanLine.includes('@')) {
        const [auth, hostPort] = cleanLine.split('@');
        const [u, p] = auth.split(':');
        const [h, prt] = hostPort.split(':');
        host = h; port = Number(prt) || 1080; user = u || ''; pass = p || '';
      } else {
        const parts = cleanLine.split(':');
        host = parts[0];
        port = Number(parts[1]) || 1080;
        if (parts.length >= 4) {
          user = parts[2];
          pass = parts[3];
        }
      }

      if (host) {
        newItems.push({
          id: `px-${Date.now()}-${idx}`,
          type,
          host,
          port,
          user,
          pass,
          ipVersion: host.includes(':') ? 'IPv6' : defaultIpVersion,
          country: defaultCountry,
          latency: null,
          status: 'unknown',
          usedCount: 0,
          outboundIp: null
        });
      }
    });

    if (newItems.length > 0) {
      setProxies(prev => [...newItems, ...prev]);
      addLog?.(`Đã nhập thành công ${newItems.length} proxy mới vào kho (hãy bấm 'Kiểm tra' để lấy ping và quốc gia)`, 'success');
      return newItems.length;
    }
    return 0;
  }, [addLog, setProxies]);

  const editProxy = useCallback((proxyId, updatedData) => {
    setProxies(prev => prev.map(p => p.id === proxyId ? { ...p, ...updatedData } : p));
    addLog?.(`Đã cập nhật thông tin Proxy ${updatedData.host || ''}:${updatedData.port || ''}`, 'info');
  }, [addLog, setProxies]);

  const deleteProxy = useCallback((proxyId) => {
    setProxies(prev => prev.filter(p => p.id !== proxyId));
    addLog?.('Đã xóa proxy khỏi danh sách', 'warn');
  }, [addLog, setProxies]);

  const deleteMultipleProxies = useCallback((ids = []) => {
    if (!ids.length) return;
    setProxies(prev => prev.filter(p => !ids.includes(p.id)));
    addLog?.(`Đã xóa ${ids.length} proxy khỏi danh sách`, 'warn');
  }, [addLog, setProxies]);

  const checkProxy = useCallback(async (proxyId) => {
    // Avoid race conditions if this proxy is already being pinged
    if (activeCheckingRef.current.has(proxyId)) return;
    activeCheckingRef.current.add(proxyId);

    try {
      const allCurrent = proxiesRef.current || [];
      const target = allCurrent.find(p => p.id === proxyId);
      if (!target) return;

      const res = await testProxyConnection(target);
      const latency = res?.latency || 0;
      const status = res?.status === 'live' ? 'live' : 'die';
      const detectedCountry = res?.country || target.country || '';
      const detectedCity = res?.city || target.city || '';
      const detectedIp = res?.outboundIp || res?.ip || target.outboundIp || target.host;

      // Update this proxy immediately in state
      setProxies(prev => (prev || []).map(p => p.id === proxyId ? {
        ...p,
        latency,
        status,
        ...(detectedCountry ? { country: detectedCountry } : {}),
        ...(detectedCity ? { city: detectedCity } : {}),
        ...(detectedIp ? { outboundIp: detectedIp } : {}),
        lastCheckedText: 'Just now'
      } : p));
      addLog?.(`Kiểm tra proxy ${target.host}:${target.port}: ${status === 'live' ? `Live (${latency}ms)${detectedCountry ? ` [${detectedCountry}]` : ''}` : 'Die / Mất kết nối'}`, status === 'live' ? 'success' : 'error');
      return { status, latency, country: detectedCountry, message: res?.message };
    } finally {
      activeCheckingRef.current.delete(proxyId);
    }
  }, [addLog, setProxies]);

  const checkAllProxies = useCallback(async (targetIds = null, onProgress = null) => {
    if (isCheckingAllRef.current) return;
    isCheckingAllRef.current = true;

    try {
      const allCurrent = proxiesRef.current || [];
      const proxiesToTest = Array.isArray(targetIds) && targetIds.length > 0
        ? allCurrent.filter(p => targetIds.includes(p.id))
        : allCurrent;

      if (proxiesToTest.length === 0) return;

      addLog?.(`Bắt đầu kiểm tra kết nối (Ping) ${proxiesToTest.length} proxy...`, 'info');

      // Worker pool với 8 luồng song song: proxy nào ping xong thì hiển thị kết quả ngay lập tức
      const CONCURRENCY_LIMIT = 8;
      let currentIndex = 0;

      const worker = async () => {
        while (currentIndex < proxiesToTest.length) {
          const idx = currentIndex++;
          const target = proxiesToTest[idx];
          if (!target || !target.id) continue;

          activeCheckingRef.current.add(target.id);
          try {
            const res = await testProxyConnection(target);
            const latency = res?.latency || 0;
            const status = res?.status === 'live' ? 'live' : 'die';
            const detectedCountry = res?.country || target.country || '';
            const detectedCity = res?.city || target.city || '';
            const detectedIp = res?.outboundIp || res?.ip || target.outboundIp || target.host;

            // CẬP NHẬT NGAY LẬP TỨC CHO TỪNG PROXY MÀ KHÔNG CẦN CHỜ CÁC PROXY KHÁC
            setProxies(prev => (prev || []).map(p => p.id === target.id ? {
              ...p,
              latency,
              status,
              ...(detectedCountry ? { country: detectedCountry } : {}),
              ...(detectedCity ? { city: detectedCity } : {}),
              ...(detectedIp ? { outboundIp: detectedIp } : {}),
              lastCheckedText: 'Just now'
            } : p));

            // Bắn callback báo hoàn tất cho giao diện lập tức gỡ trạng thái xoay loading của proxy này
            onProgress?.(target.id, { status, latency, country: detectedCountry });
          } catch (err) {
            console.error(`Lỗi ping proxy ${target.id}:`, err);
            setProxies(prev => (prev || []).map(p => p.id === target.id ? {
              ...p,
              status: 'die',
              latency: 0
            } : p));
            onProgress?.(target.id, { status: 'die', latency: 0 });
          } finally {
            activeCheckingRef.current.delete(target.id);
          }
        }
      };

      const workerCount = Math.min(CONCURRENCY_LIMIT, proxiesToTest.length);
      await Promise.all(Array.from({ length: workerCount }, () => worker()));

      addLog?.(`Đã hoàn thành kiểm tra kết nối ${proxiesToTest.length} proxy`, 'success');
    } finally {
      isCheckingAllRef.current = false;
    }
  }, [addLog, setProxies]);

  // 2. Rotating Proxy actions
  const addRotatingProxy = useCallback((config) => {
    const newRot = {
      ...config,
      id: `rot-${Date.now().toString().slice(-4)}`,
      currentIp: `14.${Math.floor(100 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 90)}.${Math.floor(10 + Math.random() * 90)}`,
      status: 'active',
      remainingCooldown: 0,
      profilesUsing: 0,
      lastRotated: 'Vừa tạo'
    };
    setRotatingProxies(prev => [newRot, ...prev]);
    addLog?.(`Đã thêm cấu hình Xoay Proxy: ${config.name}`, 'success');
  }, [addLog, setRotatingProxies]);

  const deleteRotatingProxy = useCallback((id) => {
    setRotatingProxies(prev => prev.filter(r => r.id !== id));
    addLog?.('Đã xóa cấu hình xoay proxy', 'warn');
  }, [addLog, setRotatingProxies]);

  const triggerRotateProxy = useCallback((id) => {
    const randomIp = `${Math.floor(14 + Math.random() * 180)}.${Math.floor(50 + Math.random() * 150)}.${Math.floor(10 + Math.random() * 200)}.${Math.floor(2 + Math.random() * 250)}`;
    setRotatingProxies(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          currentIp: randomIp,
          lastRotated: 'Vừa xong',
          remainingCooldown: r.cooldown || 60
        };
      }
      return r;
    }));
    addLog?.(`Đã kích hoạt đổi IP thành công! IP mới: ${randomIp}`, 'success');
  }, [addLog, setRotatingProxies]);

  // 3. DCOM 4G/5G actions
  const addDcomDevice = useCallback((device) => {
    const newDcom = {
      ...device,
      id: `dcom-${Date.now().toString().slice(-4)}`,
      status: 'connected',
      signalStrength: 90,
      lastRotated: 'Vừa kết nối',
      profilesUsing: 0
    };
    setDcomDevices(prev => [...prev, newDcom]);
    addLog?.(`Đã thêm thiết bị DCOM mới: ${device.name}`, 'success');
  }, [addLog, setDcomDevices]);

  const deleteDcomDevice = useCallback((id) => {
    setDcomDevices(prev => prev.filter(d => d.id !== id));
    addLog?.('Đã ngắt kết nối thiết bị DCOM', 'warn');
  }, [addLog, setDcomDevices]);

  const triggerDcomRotate = useCallback((id) => {
    const newWan = `171.${Math.floor(200 + Math.random() * 55)}.${Math.floor(10 + Math.random() * 100)}.${Math.floor(10 + Math.random() * 200)}`;
    setDcomDevices(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          wanIp: newWan,
          lastRotated: 'Vừa xong',
          status: 'connected'
        };
      }
      return d;
    }));
    addLog?.(`DCOM reset chế độ máy bay thành công! Nhận IP mạng mới: ${newWan}`, 'success');
  }, [addLog, setDcomDevices]);

  // 4. IPv6 Generator actions
  const generateIpv6Batch = useCallback(({ prefix = '2402:800:6000:a1b2::/64', count = 50, startPort = 20000, userPrefix = 'ipv6_user', customPass = 'secure_pass' }) => {
    const list = [];
    const basePrefix = prefix.replace('/64', '').replace('/48', '').replace(/::$/, '');
    for (let i = 0; i < count; i++) {
      const hex1 = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
      const hex2 = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
      const hex3 = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
      const hex4 = Math.floor(Math.random() * 65535).toString(16).padStart(4, '0');
      const fullIpv6 = `${basePrefix}:${hex1}:${hex2}:${hex3}:${hex4}`;
      const port = startPort + i;
      list.push({
        id: `gen-ipv6-${i}`,
        type: 'SOCKS5',
        host: fullIpv6,
        port,
        user: `${userPrefix}_${i + 1}`,
        pass: customPass,
        country: 'VN',
        latency: Math.floor(18 + Math.random() * 30),
        status: 'live'
      });
    }
    setGeneratedIpv6List(list);
    addLog?.(`Sinh thành công ${list.length} Proxy IPv6 từ dải subnet ${prefix}`, 'success');
    return list;
  }, [addLog]);

  const addGeneratedIpv6ToPool = useCallback(() => {
    setGeneratedIpv6List(currentList => {
      if (currentList.length === 0) return currentList;
      setProxies(prev => [...currentList.map(p => ({ ...p, usedCount: 0 })), ...prev]);
      addLog?.(`Đã nhập toàn bộ ${currentList.length} Proxy IPv6 vào kho Proxy tĩnh`, 'success');
      return currentList;
    });
  }, [addLog, setProxies]);

  const safeRotatingProxies = isRealUser ? (Array.isArray(rotatingProxies) ? rotatingProxies : []) : (Array.isArray(rotatingProxies) && rotatingProxies.length > 0 ? rotatingProxies : INITIAL_ROTATING_PROXIES);
  const safeDcomDevices = isRealUser ? (Array.isArray(dcomDevices) ? dcomDevices : []) : (Array.isArray(dcomDevices) && dcomDevices.length > 0 ? dcomDevices : INITIAL_DCOM_DEVICES);

  return useMemo(() => ({
    proxies: safeProxies,
    addProxy,
    bulkImportProxies,
    editProxy,
    deleteProxy,
    deleteMultipleProxies,
    checkProxy,
    checkAllProxies,
    rotatingProxies: safeRotatingProxies,
    addRotatingProxy,
    deleteRotatingProxy,
    triggerRotateProxy,
    dcomDevices: safeDcomDevices,
    addDcomDevice,
    deleteDcomDevice,
    triggerDcomRotate,
    generatedIpv6List: Array.isArray(generatedIpv6List) ? generatedIpv6List : [],
    setGeneratedIpv6List,
    generateIpv6Batch,
    addGeneratedIpv6ToPool
  }), [
    safeProxies,
    safeRotatingProxies,
    safeDcomDevices,
    generatedIpv6List,
    addProxy,
    bulkImportProxies,
    editProxy,
    deleteProxy,
    deleteMultipleProxies,
    checkProxy,
    checkAllProxies,
    addRotatingProxy,
    deleteRotatingProxy,
    triggerRotateProxy,
    addDcomDevice,
    deleteDcomDevice,
    triggerDcomRotate,
    generateIpv6Batch,
    addGeneratedIpv6ToPool
  ]);
}
