const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const SECRET_KEY = '1234';
const LOCAL_PC_URL = 'https://40f127a3c9a8.ngrok-free.app'; // <- update this if ngrok changes

console.log("✅ Using LOCAL_PC_URL:", LOCAL_PC_URL);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

// 🔁 Restart
app.get('/restart', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/restart?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

// ❄️ Freeze/Unfreeze
app.get('/toggle-freeze', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/toggle-freeze?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

// 🔪 Kill Roblox
app.get('/kill', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/kill?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

// ⏱ Session
app.get('/session', async (req, res) => {
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/session`);
    res.send(`🕒 Session Time: ${result.data}`);
  } catch {
    res.send("🕒 Session Time: Not available");
  }
});

// 🟢 Status
app.get('/status', async (req, res) => {
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/status`);
    res.json(result.data);
  } catch {
    res.json({ running: false, frozen: false });
  }
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Render Control Panel running at http://${HOST}:${PORT}`);
});
