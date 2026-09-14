const { registerWindowIpc } = require('./windowIpc.cjs');
const { registerProxyIpc } = require('./proxyIpc.cjs');
const { registerUpdateIpc } = require('./updateIpc.cjs');
const { registerEngineIpc } = require('./engineIpc.cjs');
const { registerBrowserIpc } = require('./browserIpc.cjs');
const { registerSystemIpc } = require('./systemIpc.cjs');
const { registerExtensionIpc } = require('./extensionIpc.cjs');
const { registerMiniDockIpc } = require('../miniDock.cjs');

function registerAllIpcHandlers() {
  registerWindowIpc();
  registerProxyIpc();
  registerUpdateIpc();
  registerEngineIpc();
  registerBrowserIpc();
  registerSystemIpc();
  registerExtensionIpc();
  registerMiniDockIpc();
}

module.exports = {
  registerAllIpcHandlers
};
