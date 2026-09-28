const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { createLocalDaemonServer, stopLocalDaemonServer, DAEMON_PORT, DAEMON_HOST } = require('./localDaemonServer.cjs');

let rustDaemonProcess = null;

/**
 * Khởi động Local Core Daemon (Ưu tiên Rust binary .exe, fallback Node server)
 */
function startLocalDaemon(getRunningProfilesFn, launchBrowserFn, stopBrowserFn) {
  // Tìm binary Rust đã biên dịch
  const possibleRustPaths = [
    path.join(__dirname, '../bin/local-daemon.exe'),
    path.join(__dirname, '../../crates/local-daemon/target/release/local-daemon.exe'),
    path.join(__dirname, '../../crates/local-daemon/target/debug/local-daemon.exe')
  ];

  const rustExe = possibleRustPaths.find(p => fs.existsSync(p));

  if (rustExe) {
    console.log(`[Daemon Manager] Found Rust Native Daemon: ${rustExe}`);
    try {
      rustDaemonProcess = spawn(rustExe, [], {
        detached: false,
        stdio: 'inherit'
      });

      rustDaemonProcess.on('error', (err) => {
        console.error('[Daemon Manager] Failed to start Rust Daemon, falling back to built-in server:', err);
        createLocalDaemonServer(getRunningProfilesFn, launchBrowserFn, stopBrowserFn);
      });

      rustDaemonProcess.on('exit', (code) => {
        console.log(`[Daemon Manager] Rust Daemon exited with code ${code}`);
      });
      return;
    } catch (err) {
      console.warn('[Daemon Manager] Error launching Rust Daemon, fallback to built-in:', err);
    }
  }

  // Fallback: Chạy HTTP Daemon Server tích hợp trong Electron
  console.log('[Daemon Manager] Running Built-in Local Daemon at http://' + DAEMON_HOST + ':' + DAEMON_PORT);
  createLocalDaemonServer(getRunningProfilesFn, launchBrowserFn, stopBrowserFn);
}

function stopLocalDaemon() {
  if (rustDaemonProcess) {
    try {
      rustDaemonProcess.kill();
    } catch {}
    rustDaemonProcess = null;
  }
  stopLocalDaemonServer();
}

module.exports = {
  startLocalDaemon,
  stopLocalDaemon,
  DAEMON_PORT,
  DAEMON_HOST
};
