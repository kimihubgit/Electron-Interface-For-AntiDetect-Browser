/**
 * Proxy Utilities for Antidetect Browser Desktop App
 * Bridges frontend UI with Electron Main Process native TCP / SOCKS5 / HTTP socket testers
 */

/**
 * Kiểm tra kết nối và đo ping (latency) của một proxy
 * @param {Object} proxy - { host, port, type, user, pass }
 * @returns {Promise<{ status: 'live'|'die', latency: number, message: string }>}
 */
export async function testProxyConnection(proxy) {
  if (!proxy || !proxy.host || !proxy.port) {
    return {
      status: 'die',
      latency: 0,
      message: 'Thiếu địa chỉ Host hoặc Port'
    };
  }

  // 1. Nếu đang chạy trong Tauri Desktop App (Backend Rust):
  if (typeof window !== 'undefined' && (window.__TAURI_INTERNALS__ || window.__TAURI__)) {
    try {
      const invoke = window.__TAURI_INTERNALS__?.invoke || window.__TAURI__?.core?.invoke;
      if (invoke) {
        const res = await invoke('test_proxy', {
          proxy: {
            id: proxy.id || null,
            host: proxy.host,
            port: Number(proxy.port),
            protocol: proxy.type || proxy.protocol || 'HTTP',
            username: proxy.user || proxy.username || null,
            password: proxy.pass || proxy.password || null
          },
          timeoutMs: 4000
        });
        return {
          status: res.success ? 'live' : 'die',
          latency: res.ping || 0,
          message: res.success ? `Kết nối tốt (${res.ping}ms - Rust)` : (res.error || 'Thất bại')
        };
      }
    } catch (rustErr) {
      console.warn('Tauri Rust Invoke error:', rustErr);
    }
  }

  // 2. Nếu đang chạy trong Electron Desktop App (Backend Node.js):
  if (window.electronAPI?.testProxy) {
    try {
      const result = await window.electronAPI.testProxy(proxy);
      return result;
    } catch (err) {
      return {
        status: 'die',
        latency: 0,
        message: `Lỗi IPC Node.js: ${err.message}`
      };
    }
  }

  // 3. Môi trường Browser Dev: giả lập đo ping với độ trễ ngẫu nhiên thực tế
  const devDelay = Math.floor(120 + Math.random() * 320);
  await new Promise(r => setTimeout(r, devDelay));
  const isLive = Math.random() > 0.08;
  const latency = isLive ? Math.floor(18 + Math.random() * 75) : 0;
  const devCountries = ['VN', 'US', 'SG', 'JP', 'DE', 'GB'];
  const detectedCountry = isLive ? devCountries[Math.floor(Math.random() * devCountries.length)] : '';
  return {
    status: isLive ? 'live' : 'die',
    latency,
    country: detectedCountry,
    message: isLive ? `Kết nối tốt (${latency}ms) | 🌐 ${detectedCountry}` : 'Không thể kết nối (Timeout)'
  };
}

/**
 * Kiểm tra kết nối hàng loạt cho danh sách proxy
 * @param {Array} proxiesList 
 * @returns {Promise<Array>}
 */
export async function testAllProxies(proxiesList = []) {
  if (!Array.isArray(proxiesList) || proxiesList.length === 0) return [];

  // 1. Tauri Rust batch test
  if (typeof window !== 'undefined' && (window.__TAURI_INTERNALS__ || window.__TAURI__)) {
    try {
      const invoke = window.__TAURI_INTERNALS__?.invoke || window.__TAURI__?.core?.invoke;
      if (invoke) {
        const payload = proxiesList.map(p => ({
          id: p.id || null,
          host: p.host,
          port: Number(p.port),
          protocol: p.type || p.protocol || 'HTTP',
          username: p.user || p.username || null,
          password: p.pass || p.password || null
        }));
        const results = await invoke('test_all_proxies', { proxies: payload });
        return results.map(r => ({
          id: r.id,
          status: r.success ? 'live' : 'die',
          latency: r.ping || 0,
          message: r.success ? `Live (${r.ping}ms)` : (r.error || 'Die')
        }));
      }
    } catch (err) {
      console.warn('Tauri batch error:', err);
    }
  }

  // 2. Electron Node.js batch test
  if (window.electronAPI?.testAllProxies) {
    try {
      return await window.electronAPI.testAllProxies(proxiesList);
    } catch (err) {
      console.error('Lỗi testAllProxies Node.js:', err);
    }
  }

  // 3. Fallback
  return await Promise.all(
    proxiesList.map(async (p) => {
      const res = await testProxyConnection(p);
      return { id: p.id, ...res };
    })
  );
}

/**
 * Định dạng chuỗi proxy chuẩn
 */
export function formatProxyString(proxy, includeProtocol = false) {
  if (!proxy || !proxy.host) return '';
  const base = `${proxy.host}:${proxy.port}`;
  const auth = proxy.user ? `:${proxy.user}:${proxy.pass || ''}` : '';
  const proto = includeProtocol ? `${proxy.type || 'SOCKS5'}://` : '';
  return `${proto}${base}${auth}`;
}

/**
 * Phân tích chuỗi proxy đầu vào
 * Hỗ trợ các định dạng:
 * - host:port
 * - host:port:user:pass
 * - user:pass@host:port
 */
export function parseProxyString(rawLine, defaultType = 'SOCKS5', defaultCountry = '') {
  const line = String(rawLine || '').trim();
  if (!line) return null;

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

  if (!host) return null;

  return {
    type,
    host,
    port,
    user,
    pass,
    country: defaultCountry
  };
}
