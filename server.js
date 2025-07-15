const express = require('express');
const path = require('path');
const axios = require('axios'); // You'll need this
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const SECRET_KEY = '1234';
const LOCAL_PC_URL = 'http://<192.168.100.22>:6970'; // ← Replace with your PC's local IP

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

// Forward command to your PC listener
app.get('/kill', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/kill?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch (err) {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

app.get('/toggle-freeze', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/toggle-freeze?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

app.get('/restart', async (req, res) => {
  if (req.query.key !== SECRET_KEY) return res.status(403).send('❌ Invalid key');
  try {
    const result = await axios.get(`${LOCAL_PC_URL}/restart?key=${SECRET_KEY}`);
    res.send(result.data);
  } catch {
    res.status(500).send('🚫 Failed to reach PC');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`✅ Render Control Panel running at http://${HOST}:${PORT}`);
});
