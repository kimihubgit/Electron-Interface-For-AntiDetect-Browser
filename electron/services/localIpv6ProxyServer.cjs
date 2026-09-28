const net = require('net');
const http = require('http');
const os = require('os');

// Lưu trữ các server instance đang lắng nghe
let activeProxyServers = [];
let activeSockets = new Set();
let isRunning = false;
let currentConfig = null;
let totalBytesTransferred = 0;

/**
 * Lấy danh sách địa chỉ IPv4 LAN của máy hiện tại
 */
function getLocalLanIps() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (!iface.internal && iface.family === 'IPv4') {
        ips.push(iface.address);
      }
    }
  }
  return ips.length > 0 ? ips : ['127.0.0.1'];
}

/**
 * Tạo một HTTP/HTTPS Tunnel Proxy Server trên 1 cổng cụ thể
 */
function createHttpProxyServer({ port, bindAddress, user, pass, targetIpv6 }) {
  const server = http.createServer((req, res) => {
    // HTTP thông thường (GET / POST không qua HTTPS)
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname + parsedUrl.search,
      method: req.method,
      headers: req.headers
    };

    if (targetIpv6) {
      options.localAddress = targetIpv6;
    }

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.writeHead(502);
      res.end(`Proxy Gateway Error: ${err.message}`);
    });

    req.pipe(proxyReq);
  });

  // HTTPS CONNECT Tunnel (quan trọng nhất cho Antidetect lướt web HTTPS)
  server.on('connect', (req, clientSocket, head) => {
    activeSockets.add(clientSocket);
    clientSocket.on('close', () => activeSockets.delete(clientSocket));

    // Kiểm tra User/Pass nếu có cấu hình
    if (user && pass) {
      const auth = req.headers['proxy-authorization'];
      const expected = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
      if (!auth || auth !== expected) {
        clientSocket.write('HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm="Nexus Proxy"\r\n\r\n');
        clientSocket.end();
        return;
      }
    }

    const [remoteHost, remotePortStr] = req.url.split(':');
    const remotePort = parseInt(remotePortStr || '443', 10);

    const connectOptions = {
      host: remoteHost,
      port: remotePort
    };

    // Nếu có bind IPv6 cụ thể
    if (targetIpv6) {
      connectOptions.localAddress = targetIpv6;
    }

    const remoteSocket = net.connect(connectOptions, () => {
      activeSockets.add(remoteSocket);
      remoteSocket.on('close', () => activeSockets.delete(remoteSocket));

      clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
      if (head && head.length > 0) {
        remoteSocket.write(head);
      }

      // Pipe dữ liệu 2 chiều
      clientSocket.pipe(remoteSocket);
      remoteSocket.pipe(clientSocket);
    });

    remoteSocket.on('error', () => {
      try {
        clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        clientSocket.end();
      } catch {}
    });

    clientSocket.on('error', () => {
      try {
        remoteSocket.end();
      } catch {}
    });
  });

  return new Promise((resolve) => {
    server.listen(port, bindAddress, () => {
      activeProxyServers.push(server);
      resolve({ port, success: true });
    });

    server.on('error', (err) => {
      console.warn(`[Local Proxy] Lỗi mở cổng ${port}: ${err.message}`);
      resolve({ port, success: false, error: err.message });
    });
  });
}

/**
 * Khởi động danh sách Proxy Server
 */
async function startLocalProxyServer(config = {}) {
  // Nếu đang chạy thì tắt cái cũ trước
  if (isRunning) {
    await stopLocalProxyServer();
  }

  const bindAddress = config.bindAddress === '0.0.0.0' ? '0.0.0.0' : '127.0.0.1';
  const startPort = parseInt(config.startPort || 20000, 10);
  const count = Math.min(200, Math.max(1, parseInt(config.count || 5, 10)));
  const user = config.user || '';
  const pass = config.pass || '';
  const proxiesList = config.proxiesList || [];
  const lanIps = getLocalLanIps();

  // 1. ƯU TIÊN: Kiểm tra nếu Rust Local Daemon đang chạy thì ủy quyền cho Rust
  try {
    const healthCheck = await fetch('http://127.0.0.1:50325/api/v1/health', { signal: AbortSignal.timeout(500) }).then(r => r.json());
    if (healthCheck?.data?.engine?.includes('Rust')) {
      console.log('[Local Proxy Server] Delegating to Rust Native Engine at 127.0.0.1:50325...');
      const rustRes = await fetch('http://127.0.0.1:50325/api/v1/ipv6/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bind_address: bindAddress,
          start_port: startPort,
          count: count,
          user: user,
          pass: pass,
          target_ipv6_list: proxiesList.map(p => p.host).filter(Boolean)
        })
      }).then(r => r.json());

      if (rustRes?.success) {
        isRunning = true;
        currentConfig = {
          ...rustRes.data,
          lanIps,
          engine: 'Rust Native Core'
        };
        return {
          success: true,
          message: `Đã mở thành công ${rustRes.data.opened_ports?.length || count} cổng proxy (Rust Engine)!`,
          config: currentConfig
        };
      }
    }
  } catch {}

  // 2. FALLBACK: Chạy qua Node.js Socket tích hợp nếu chưa chạy Rust
  const openedPorts = [];

  for (let i = 0; i < count; i++) {
    const port = startPort + i;
    const targetIpv6 = proxiesList[i]?.host || null;

    const res = await createHttpProxyServer({
      port,
      bindAddress,
      user,
      pass,
      targetIpv6
    });

    if (res.success) {
      openedPorts.push(port);
    }
  }

  isRunning = true;
  currentConfig = {
    bindAddress,
    startPort,
    count: openedPorts.length,
    openedPorts,
    user,
    pass,
    lanIps,
    engine: 'Built-in Socket Engine',
    startTime: Date.now()
  };

  console.log(`[Local Proxy Server] Đã kích hoạt ${openedPorts.length} cổng proxy trên ${bindAddress} (LAN: ${lanIps.join(', ')})`);

  return {
    success: true,
    message: `Đã mở thành công ${openedPorts.length} cổng proxy!`,
    config: currentConfig
  };
}

/**
 * Dừng toàn bộ các Proxy Server đang chạy
 */
async function stopLocalProxyServer() {
  for (const socket of activeSockets) {
    try {
      socket.destroy();
    } catch {}
  }
  activeSockets.clear();

  for (const server of activeProxyServers) {
    try {
      server.close();
    } catch {}
  }
  activeProxyServers = [];
  isRunning = false;
  currentConfig = null;

  console.log('[Local Proxy Server] Đã đóng toàn bộ cổng proxy.');
  return { success: true, message: 'Đã dừng toàn bộ dịch vụ proxy.' };
}

/**
 * Lấy trạng thái hiện tại
 */
function getLocalProxyStatus() {
  const lanIps = getLocalLanIps();
  return {
    isRunning,
    config: currentConfig,
    activeConnections: activeSockets.size,
    lanIps
  };
}

module.exports = {
  startLocalProxyServer,
  stopLocalProxyServer,
  getLocalProxyStatus,
  getLocalLanIps
};
