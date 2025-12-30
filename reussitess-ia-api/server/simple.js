const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  
  // Servir la landing page
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, '../public/index.html'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
      }
    });
    return;
  }
  
  // API JSON
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString()
    }));
  } 
  else if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        api_key: 'reus_' + Math.random().toString(36).substr(2, 16),
        plan: data.plan || 'basic',
        trial_days: 14
      }));
    });
  }
  else {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: '🚀 REUSSITESS IA API',
      endpoints: ['/', '/health', '/api/auth/register']
    }));
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║   🚀 SERVEUR ACTIF                  ║
║   🌐 http://localhost:${PORT}        ║
╚══════════════════════════════════════╝
  `);
});
