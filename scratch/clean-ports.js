const { execSync } = require('child_process');

try {
  const stdout = execSync('netstat -ano').toString();
  const lines = stdout.split('\n');
  const matching = lines.filter(l => l.includes(':3000 ') || l.includes(':3001 '));
  const pids = new Set();
  matching.forEach(l => {
    const parts = l.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && !isNaN(pid) && pid !== '0') {
      pids.add(pid);
    }
  });

  console.log('Found PIDs on 3000/3001:', Array.from(pids));
  pids.forEach(pid => {
    try {
      execSync(`taskkill /F /PID ${pid}`);
      console.log(`Killed PID ${pid}`);
    } catch (e) {
      // Ignored
    }
  });
} catch (err) {
  console.log('Error checking ports:', err.message);
}
