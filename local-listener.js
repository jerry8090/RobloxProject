const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 6970;
const SECRET_KEY = '1234';

const ROBLOX_PATH = "C:\\\\Users\\\\Jerry\\\\AppData\\\\Local\\\\Roblox\\\\Versions\\\\version-765338e04cf54fde\\\\RobloxPlayerBeta.exe";

let isFrozen = false;
let robloxRunning = false;
let startTime = null;
let currentDuration = 'Not running';

// 🔁 Check Roblox every 1 second
function updateRobloxStatus() {
  exec('tasklist', (err, stdout) => {
    if (err) return;

    const isRunning = stdout.toLowerCase().includes('robloxplayerbeta.exe');

    if (isRunning && !robloxRunning) {
      robloxRunning = true;
      startTime = new Date(); // 🟢 Start session
    }

    if (!isRunning && robloxRunning) {
      robloxRunning = false;
      startTime = null; // 🔴 Stop session
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

setInterval(updateRobloxStatus, 1000);

// ⏱ Session API
app.get('/session', (req, res) => {
  if (!startTime) {
    return res.send("Not running");
  }

  const now = new Date();
  const elapsed = now - startTime;
  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  res.send(`${mins}m ${secs}s`);
});


// 🟢 Status API
app.get('/status', (req, res) => {
  res.json({ running: robloxRunning, frozen: isFrozen });
});

// 🔪 Kill Roblox
app.get('/kill', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  isFrozen = false;
  exec('taskkill /IM RobloxPlayerBeta.exe /F');
  res.send('✅ Kill command sent');
});

// ❄️ Toggle Freeze
app.get('/toggle-freeze', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  const cmd = isFrozen ? 'PsSuspend.exe -r RobloxPlayerBeta.exe' : 'PsSuspend.exe RobloxPlayerBeta.exe';
  exec(cmd, () => {
    isFrozen = !isFrozen;
    res.send(isFrozen ? '🧊 Roblox frozen' : '▶️ Roblox resumed');
  });
});

// 🔁 Restart Roblox
app.get('/restart', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  isFrozen = false;
  exec('taskkill /IM RobloxPlayerBeta.exe /F', () => {
    setTimeout(() => {
      exec(`start "" "${ROBLOX_PATH}"`);
      startTime = new Date(); // ✅ Restart timer
    }, 1500);
  });
  res.send('🔁 Roblox restarting...');
});

// ▶️ Start server
app.listen(PORT, () => {
  console.log(`🖥️ Local PC Listener running on http://localhost:${PORT}`);
});
