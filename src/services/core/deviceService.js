/**
 * Device & Hardware Identification Service
 * Manages unique identifiers for the desktop client (HWID, Machine GUID, Device Name)
 */

export function getOrCreateHwid() {
  let hwid = localStorage.getItem('client_hwid');
  if (!hwid) {
    const genPart = (len) => {
      const chars = '0123456789ABCDEF';
      let res = '';
      for (let i = 0; i < len; i++) {
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return res;
    };
    hwid = `BFEBFBFF${genPart(8)}-${genPart(8)}-${genPart(4)}-${genPart(4)}-${genPart(4)}-${genPart(12)}`;
    localStorage.setItem('client_hwid', hwid);
  }
  return hwid;
}

export function getDeviceName() {
  let devName = localStorage.getItem('client_device_name');
  if (!devName) {
    const isWindows = navigator.userAgent.includes('Windows');
    const isMac = navigator.userAgent.includes('Macintosh');
    const isLinux = navigator.userAgent.includes('Linux');
    const osTag = isWindows ? 'WIN' : isMac ? 'MAC' : isLinux ? 'LINUX' : 'DEV';
    const randSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    devName = `DESKTOP-${osTag}-${randSuffix}`;
    localStorage.setItem('client_device_name', devName);
  }
  return devName;
}

export function getMachineGuid() {
  let guid = localStorage.getItem('antidetect_machine_guid');
  if (!guid) {
    guid = 'WIN-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-B12C';
    localStorage.setItem('antidetect_machine_guid', guid);
  }
  return guid;
}
