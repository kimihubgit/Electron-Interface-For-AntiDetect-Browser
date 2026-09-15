export const COUNTRY_OPTIONS = [
  { code: 'US', label: 'Hoa Kỳ (US)' },
  { code: 'VN', label: 'Việt Nam (VN)' },
  { code: 'SG', label: 'Singapore (SG)' },
  { code: 'JP', label: 'Nhật Bản (JP)' },
  { code: 'DE', label: 'Đức (DE)' },
  { code: 'GB', label: 'Vương Quốc Anh (GB)' },
  { code: 'KR', label: 'Hàn Quốc (KR)' },
  { code: 'TH', label: 'Thái Lan (TH)' }
];

export const parseProxyFlexible = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  let str = raw.trim();
  let detectedType = null;
  let detectedIpVersion = 'IPv4';

  if (/^socks5:\/\//i.test(str)) {
    detectedType = 'SOCKS5';
    str = str.replace(/^socks5:\/\//i, '');
  } else if (/^socks4:\/\//i.test(str)) {
    detectedType = 'SOCKS4';
    str = str.replace(/^socks4:\/\//i, '');
  } else if (/^https:\/\//i.test(str)) {
    detectedType = 'HTTPS';
    str = str.replace(/^https:\/\//i, '');
  } else if (/^http:\/\//i.test(str)) {
    detectedType = 'HTTP';
    str = str.replace(/^http:\/\//i, '');
  }

  let host = '', port = 1080, user = '', pass = '';

  // Handle IPv6 bracket notation [2402:...]:1080
  if (str.startsWith('[')) {
    detectedIpVersion = 'IPv6';
    const closeIdx = str.indexOf(']');
    if (closeIdx !== -1) {
      host = str.substring(1, closeIdx);
      const rest = str.substring(closeIdx + 1);
      if (rest.startsWith(':')) {
        const parts = rest.substring(1).split(':');
        port = Number(parts[0]) || 1080;
        if (parts.length >= 3) {
          user = parts[1];
          pass = parts.slice(2).join(':');
        }
      }
    }
  } else if (str.includes('@')) {
    const [auth, hostPort] = str.split('@');
    const authParts = auth.split(':');
    user = authParts[0] || '';
    pass = authParts.slice(1).join(':') || '';

    const hpParts = hostPort.split(':');
    host = hpParts[0];
    port = Number(hpParts[1]) || 1080;
  } else {
    const parts = str.split(':');
    if (parts.length === 2) {
      host = parts[0];
      port = Number(parts[1]) || 1080;
    } else if (parts.length >= 4) {
      host = parts[0];
      port = Number(parts[1]) || 1080;
      user = parts[2];
      pass = parts.slice(3).join(':');
    } else {
      host = parts[0];
    }
  }

  if (host.includes(':')) {
    detectedIpVersion = 'IPv6';
  }

  return { host, port, user, pass, type: detectedType, ipVersion: detectedIpVersion };
};
