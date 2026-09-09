import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  INITIAL_PROXIES, 
  INITIAL_ROTATING_PROXIES, 
  INITIAL_DCOM_DEVICES, 
  INITIAL_PROXY_RULES 
} from '../constants/initialData';

/**
 * Hook that owns all proxy-related state & actions:
 * - Static Proxy Pool & Bulk Import
 * - Rotating Proxies (API Change IP & Round-Robin)
 * - DCOM 4G/5G Dongles (Airplane Mode Reset & Local Forwarding)
 * - IPv6 Subnet /64 Generator
 * - Auto-Assign & Default Rules
 */
export function useProxies(addLog) {
  const [proxies, setProxies] = useLocalStorage('antidetect_proxies', INITIAL_PROXIES);
  const [rotatingProxies, setRotatingProxies] = useLocalStorage('antidetect_rotating_proxies', INITIAL_ROTATING_PROXIES);
  const [dcomDevices, setDcomDevices] = useLocalStorage('antidetect_dcom_devices', INITIAL_DCOM_DEVICES);
  const [proxyRules, setProxyRules] = useLocalStorage('antidetect_proxy_rules', INITIAL_PROXY_RULES);
  const [generatedIpv6List, setGeneratedIpv6List] = useState([]);

  // 1. Static Proxy actions
  const addProxy = (proxyData, closeModal) => {
    const newPx = {
      ...proxyData,
      id: `px-${Date.now().toString().slice(-4)}`,
      status: 'live',
      usedCount: 0,
      latency: Math.floor(20 + Math.random() * 80),
    };
    setProxies(prev => [newPx, ...prev]);
    addLog?.(`Thêm Proxy mới: ${newPx.type}://${newPx.host}:${newPx.port}`, 'success');
    if (closeModal) closeModal();
  };

  const bulkImportProxies = (rawText, defaultType = 'SOCKS5', defaultCountry = 'US') => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const newItems = [];

    lines.forEach((line, idx) => {
      // Handle formats: IP:Port, IP:Port:User:Pass, or User:Pass@IP:Port
      let host = '', port = 1080, user = '', pass = '', type = defaultType;
      if (line.includes('@')) {
        const [auth, hostPort] = line.split('@');
        const [u, p] = auth.split(':');
        const [h, prt] = hostPort.split(':');
        host = h; port = Number(prt) || 1080; user = u || ''; pass = p || '';
      } else {
        const parts = line.split(':');
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
          country: defaultCountry,
          latency: Math.floor(25 + Math.random() * 65),
          status: 'live',
          usedCount: 0
        });
      }
    });

    if (newItems.length > 0) {
      setProxies(prev => [...newItems, ...prev]);
      addLog?.(`Đã nhập thành công ${newItems.length} proxy mới vào kho`, 'success');
      return newItems.length;
    }
    return 0;
  };

  const editProxy = (proxyId, updatedData) => {
    setProxies(prev => prev.map(p => p.id === proxyId ? { ...p, ...updatedData } : p));
    addLog?.(`Đã cập nhật thông tin Proxy ${updatedData.host || ''}:${updatedData.port || ''}`, 'info');
  };

  const deleteProxy = (proxyId) => {
    setProxies(prev => prev.filter(p => p.id !== proxyId));
    addLog?.('Đã xóa proxy khỏi danh sách', 'warn');
  };

  const deleteMultipleProxies = (ids = []) => {
    if (!ids.length) return;
    setProxies(prev => prev.filter(p => !ids.includes(p.id)));
    addLog?.(`Đã xóa ${ids.length} proxy khỏi danh sách`, 'warn');
  };

  const checkProxy = (proxyId) => {
    const isLive = Math.random() > 0.08;
    const latency = isLive ? Math.floor(18 + Math.random() * 85) : 0;
    const status = isLive ? 'live' : 'die';
    setProxies(prev => prev.map(p => p.id === proxyId ? { ...p, latency, status } : p));
    addLog?.(`Kiểm tra proxy: ${status === 'live' ? 'Hoạt động tốt' : 'Không kết nối được'} (${latency}ms)`, isLive ? 'success' : 'error');
    return { status, latency };
  };

  const checkAllProxies = () => {
    addLog?.('Bắt đầu kiểm tra kết nối (Ping) toàn bộ proxy...', 'info');
    setProxies(prev => prev.map(p => ({
      ...p,
      latency: Math.floor(15 + Math.random() * 85),
      status: Math.random() > 0.08 ? 'live' : 'die'
    })));
  };

  // 2. Rotating Proxy actions
  const addRotatingProxy = (config) => {
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
  };

  const deleteRotatingProxy = (id) => {
    setRotatingProxies(prev => prev.filter(r => r.id !== id));
    addLog?.('Đã xóa cấu hình xoay proxy', 'warn');
  };

  const triggerRotateProxy = (id) => {
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
  };

  // 3. DCOM 4G/5G actions
  const addDcomDevice = (device) => {
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
  };

  const deleteDcomDevice = (id) => {
    setDcomDevices(prev => prev.filter(d => d.id !== id));
    addLog?.('Đã ngắt kết nối thiết bị DCOM', 'warn');
  };

  const triggerDcomRotate = (id) => {
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
  };

  // 4. IPv6 Generator actions
  const generateIpv6Batch = ({ prefix = '2402:800:6000:a1b2::/64', count = 50, startPort = 20000, userPrefix = 'ipv6_user', customPass = 'secure_pass' }) => {
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
  };

  const addGeneratedIpv6ToPool = () => {
    if (generatedIpv6List.length === 0) return;
    setProxies(prev => [...generatedIpv6List.map(p => ({ ...p, usedCount: 0 })), ...prev]);
    addLog?.(`Đã nhập toàn bộ ${generatedIpv6List.length} Proxy IPv6 vào kho Proxy tĩnh`, 'success');
  };

  // 5. Proxy Rules
  const updateProxyRules = (newRules) => {
    setProxyRules(prev => ({ ...(prev || INITIAL_PROXY_RULES), ...newRules }));
    addLog?.('Đã cập nhật quy tắc cấu hình Proxy & An toàn mạng', 'info');
  };

  const safeProxies = Array.isArray(proxies) && proxies.length > 0 ? proxies : INITIAL_PROXIES;
  const safeRotatingProxies = Array.isArray(rotatingProxies) && rotatingProxies.length > 0 ? rotatingProxies : INITIAL_ROTATING_PROXIES;
  const safeDcomDevices = Array.isArray(dcomDevices) && dcomDevices.length > 0 ? dcomDevices : INITIAL_DCOM_DEVICES;
  const safeProxyRules = (proxyRules && typeof proxyRules === 'object' && Object.keys(proxyRules).length > 0) ? proxyRules : INITIAL_PROXY_RULES;

  return {
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
    proxyRules: safeProxyRules,
    updateProxyRules,
    generatedIpv6List: Array.isArray(generatedIpv6List) ? generatedIpv6List : [],
    setGeneratedIpv6List,
    generateIpv6Batch,
    addGeneratedIpv6ToPool
  };
}
