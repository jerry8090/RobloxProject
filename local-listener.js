const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 6970;
const SECRET_KEY = '1234';

const ROBLOX_PATH = "C:\\Users\\Jerry\\AppData\\Local\\Roblox\\Versions\\version-765338e04cf54fde\\RobloxPlayerBeta.exe";

let isFrozen = false;

app.get('/kill', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  exec('taskkill /IM RobloxPlayerBeta.exe /F');
  res.send('✅ Kill command sent');
});

app.get('/toggle-freeze', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  const cmd = isFrozen ? 'PsSuspend.exe -r RobloxPlayerBeta.exe' : 'PsSuspend.exe RobloxPlayerBeta.exe';
  exec(cmd, () => {
    isFrozen = !isFrozen;
    res.send(isFrozen ? '🧊 Roblox frozen' : '▶️ Roblox resumed');
  });
});

app.get('/restart', (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  exec('taskkill /IM RobloxPlayerBeta.exe /F', () => {
    setTimeout(() => {
      exec(`start "" "${ROBLOX_PATH}"`);
    }, 1500);
  });
  res.send('🔁 Roblox restarting...');
});

app.listen(PORT, () => {
  console.log(`🖥️ PC Listener running at http://localhost:${PORT}`);
});
