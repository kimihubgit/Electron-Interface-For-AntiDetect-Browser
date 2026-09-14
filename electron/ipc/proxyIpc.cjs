const { ipcMain, shell } = require('electron');
const net = require('net');
const http = require('http');

function resolveIpGeo(host) {
  return new Promise((resolve) => {
    if (!host || host === '127.0.0.1' || host === 'localhost') {
      return resolve({ country: 'VN', countryName: 'Local' });
    }

    const cleanHost = host.split(':')[0].trim();
    const req = http.get(`http://ip-api.com/json/${encodeURIComponent(cleanHost)}?fields=status,country,countryCode,city`, { timeout: 3500 }, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (data && data.status === 'success') {
            resolve({
              country: data.countryCode || '',
              countryName: data.country || '',
              city: data.city || ''
            });
          } else {
            resolve({});
          }
        } catch {
          resolve({});
        }
      });
    });

    req.on('error', () => resolve({}));
    req.on('timeout', () => {
      req.destroy();
      resolve({});
    });
  });
}

function testProxyConnection(proxy, timeout = 5000) {
  return new Promise((resolve) => {
    if (!proxy || !proxy.host || !proxy.port) {
      return resolve({
        status: 'die',
        latency: 0,
        message: 'Thiếu thông tin Host hoặc Port của proxy'
      });
    }

    const host = String(proxy.host).trim();
    const port = Number(proxy.port);
    const type = (proxy.type || 'SOCKS5').toUpperCase();
    const startTime = Date.now();

    const socket = new net.Socket();
    let isFinished = false;

    const finish = async (result) => {
      if (isFinished) return;
      isFinished = true;
      socket.destroy();

      if (result && result.status === 'live') {
        try {
          const geo = await resolveIpGeo(host);
          if (geo && geo.country) {
            result.country = geo.country;
            result.countryName = geo.countryName;
            result.city = geo.city;
            result.message = `${result.message} | 🌐 ${geo.country}${geo.city ? ` (${geo.city})` : ''}`;
          }
        } catch (e) {
          // Ignore geo lookup error
        }
      }

      resolve(result);
    };

    socket.setTimeout(timeout);

    socket.connect(port, host, () => {
      const tcpLatency = Date.now() - startTime;

      if (type === 'SOCKS5') {
        // SOCKS5 Handshake: Ver 5, 2 Auth Methods (0x00 No Auth, 0x02 User/Pass)
        const greeting = Buffer.from([0x05, 0x02, 0x00, 0x02]);
        socket.write(greeting);

        socket.once('data', (data) => {
          const totalLatency = Date.now() - startTime;
          if (data && data[0] === 0x05) {
            finish({
              status: 'live',
              latency: totalLatency,
              type: 'SOCKS5',
              message: `SOCKS5 kết nối thành công (${totalLatency}ms)`
            });
          } else {
            finish({
              status: 'live',
              latency: tcpLatency,
              type: 'SOCKS5',
              message: `TCP bắt tay thành công (${tcpLatency}ms)`
            });
          }
        });
      } else {
        // HTTP / HTTPS Proxy Handshake: CONNECT request
        const connectReq = `CONNECT 1.1.1.1:443 HTTP/1.1\r\nHost: 1.1.1.1:443\r\nProxy-Connection: keep-alive\r\n\r\n`;
        socket.write(connectReq);

        socket.once('data', (data) => {
          const totalLatency = Date.now() - startTime;
          const respStr = data ? data.toString() : '';
          if (respStr.includes('200')) {
            finish({
              status: 'live',
              latency: totalLatency,
              type: type,
              message: `HTTP Proxy kết nối thành công (${totalLatency}ms)`
            });
          } else {
            finish({
              status: 'live',
              latency: tcpLatency,
              type: type,
              message: `TCP bắt tay thành công (${tcpLatency}ms)`
            });
          }
        });
      }
    });

    socket.on('error', (err) => {
      finish({
        status: 'die',
        latency: 0,
        message: `Không kết nối được: ${err.code || err.message}`
      });
    });

    socket.on('timeout', () => {
      finish({
        status: 'die',
        latency: 0,
        message: `Quá thời gian chờ (Timeout ${timeout / 1000}s)`
      });
    });
  });
}

function registerProxyIpc() {
  ipcMain.handle('test-proxy', async (event, proxy) => {
    return await testProxyConnection(proxy);
  });

  ipcMain.handle('test-all-proxies', async (event, proxiesList) => {
    if (!Array.isArray(proxiesList)) return [];
    const results = await Promise.all(
      proxiesList.map(async (p) => {
        const res = await testProxyConnection(p);
        return { id: p.id, ...res };
      })
    );
    return results;
  });

  // Mở liên kết ngoài bằng trình duyệt mặc định
  ipcMain.handle('open-external-url', async (event, url) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      await shell.openExternal(url);
      return true;
    }
    return false;
  });
}

module.exports = {
  registerProxyIpc,
  testProxyConnection
};
