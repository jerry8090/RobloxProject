const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

let launched = false;
let startTime = null;
let warned = true;
const projectPath = __dirname;

setInterval(() => {
  exec('tasklist', (err, stdout) => {
    const running = stdout.toLowerCase().includes('robloxplayerbeta.exe');

    if (running && !launched) {
      console.log("Roblox detected. Timer started.");
      launched = true;
      startTime = new Date();
      warned = false;
    }

    if (running && startTime) {
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000);

      if (elapsed >= 2645 && !warned) {
        warned = true;
        exec(`${projectPath}\node_modules\.bin\electron warning.js`, { cwd: projectPath });
      }

      if (elapsed >= 2700) {
        console.log("1 hour passed. Closing Roblox.");
        exec('taskkill /f /im RobloxPlayerBeta.exe');
        exec('taskkill /f /im electron.exe');
        launched = false;
        startTime = null;
        warned = false;
      }
    }

    if (!running && launched) {
      console.log("Roblox closed. Resetting...");
      exec('taskkill /f /im electron.exe');
      launched = false;
      startTime = null;
      warned = false;
    }
  });
}, 3000);
