const { exec } = require('child_process');

let robloxRunning = false;
let startTime = null;
let currentDuration = 'Not running';

function checkRoblox() {
  exec('tasklist', (err, stdout) => {
    if (err) return;

    const isRunning = stdout.toLowerCase().includes('robloxplayerbeta.exe');

    if (isRunning && !robloxRunning) {
      robloxRunning = true;
      startTime = new Date();
    }

    if (!isRunning && robloxRunning) {
      robloxRunning = false;
      startTime = null;
      currentDuration = 'Not running';
    }

    if (robloxRunning && startTime) {
      const now = new Date();
      const elapsed = now - startTime;
      const mins = Math.floor(elapsed / 60000);
      const secs = Math.floor((elapsed % 60000) / 1000);
      currentDuration = `${mins}m ${secs}s`;

    }
  });
}

setInterval(checkRoblox, 1000);

function getCurrentSession() {
  return currentDuration;
}

module.exports = { getCurrentSession };