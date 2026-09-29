const { registerWindowIpc } = require('./windowIpc.cjs');
const { registerProxyIpc } = require('./proxyIpc.cjs');
const { registerUpdateIpc } = require('./updateIpc.cjs');
const { registerEngineIpc } = require('./engineIpc.cjs');
const { registerBrowserIpc } = require('./browserIpc.cjs');
const { registerSystemIpc } = require('./systemIpc.cjs');
const { registerExtensionIpc } = require('./extensionIpc.cjs');
const { registerMiniDockIpc } = require('../miniDock.cjs');
const { registerBackupIpc } = require('./backupIpc.cjs');

function registerAllIpcHandlers() {
  registerWindowIpc();
  registerProxyIpc();
  registerUpdateIpc();
  registerEngineIpc();
  registerBrowserIpc();
  registerSystemIpc();
  registerExtensionIpc();
  registerMiniDockIpc();
  registerBackupIpc();
}

module.exports = {
  registerAllIpcHandlers
};
