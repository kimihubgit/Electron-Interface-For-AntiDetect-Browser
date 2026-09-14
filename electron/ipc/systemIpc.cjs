const { ipcMain } = require('electron');
const os = require('os');

let lastCpuTimes = null;

function calculateCpuUsage() {
  const cpus = os.cpus();
  if (!cpus || cpus.length === 0) return 15;
  let total = 0;
  let idle = 0;
  for (const c of cpus) {
    for (const t in c.times) total += c.times[t];
    idle += c.times.idle;
  }
  if (!lastCpuTimes) {
    lastCpuTimes = { total, idle };
    return Math.floor(12 + Math.random() * 8);
  }
  const dTotal = total - lastCpuTimes.total;
  const dIdle = idle - lastCpuTimes.idle;
  lastCpuTimes = { total, idle };
  if (dTotal <= 0) return 15;
  const pct = Math.round(100 - (100 * dIdle / dTotal));
  return Math.max(1, Math.min(100, pct));
}

function registerSystemIpc() {
  ipcMain.handle('get-system-stats', async () => {
    try {
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      const memPercent = Math.round((usedMem / totalMem) * 100);

      const cpus = os.cpus();
      const cpuModel = cpus[0]?.model ? cpus[0].model.replace(/\s+/g, ' ').trim() : 'Processor';
      const cpuCores = cpus.length;
      const cpuPercent = calculateCpuUsage();

      return {
        success: true,
        data: {
          totalMemGB: (totalMem / (1024 ** 3)).toFixed(1),
          usedMemGB: (usedMem / (1024 ** 3)).toFixed(1),
          freeMemGB: (freeMem / (1024 ** 3)).toFixed(1),
          memPercent,
          cpuModel,
          cpuCores,
          cpuPercent,
          platform: os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'macOS' : 'Linux',
          arch: os.arch()
        }
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
}

module.exports = {
  registerSystemIpc
};
