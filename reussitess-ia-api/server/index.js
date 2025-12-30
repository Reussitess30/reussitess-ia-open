const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../landing')));

// Routes de base
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>REUSSITESS IA API</title>
        <style>
          body { font-family: Arial; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                 color: white; padding: 50px; text-align: center; }
          h1 { font-size: 3em; }
          .button { background: white; color: #667eea; padding: 15px 30px; 
                    border-radius: 10px; text-decoration: none; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>🚀 REUSSITESS IA API</h1>
        <p style="font-size: 1.5em;">65+ Services d'Intelligence Artificielle</p>
        <br><br>
        <a href="/health" class="button">Health Check</a>
        <a href="/api/docs" class="button">Documentation</a>
      </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.get('/api/docs', (req, res) => {
  res.json({
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      services: {
        translation: 'POST /api/v1/translate',
        copywriting: 'POST /api/v1/generate-ad',
        revenue: 'POST /api/v1/analyze-revenue',
        healing: 'POST /api/v1/health-check',
        security: 'POST /api/v1/anonymize'
      }
    },
    pricing: {
      basic: '$49/mois - 100 req/h',
      pro: '$299/mois - 1000 req/h',
      enterprise: '$999/mois - 10k req/h'
    }
  });
});

// Routes API (stubs pour commencer)
app.post('/api/auth/register', (req, res) => {
  const { email, plan = 'basic' } = req.body;
  const apiKey = 'reus_' + Math.random().toString(36).substr(2, 16);
  
  res.json({
    success: true,
    message: 'Compte créé!',
    api_key: apiKey,
    plan: plan,
    trial_days: 14
  });
});

app.post('/api/v1/translate', (req, res) => {
  const { text, target_language } = req.body;
  res.json({
    success: true,
    original: text,
    translated: `[${target_language}] ${text}`,
    service: 'translation'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║   🚀 REUSSITESS IA API - SERVEUR DÉMARRÉ               ║
║                                                          ║
║   🌐 URL: http://localhost:${PORT}                       ║
║   📚 Docs: http://localhost:${PORT}/api/docs            ║
║   ❤️  Health: http://localhost:${PORT}/health            ║
║                                                          ║
║   Status: ${process.env.NODE_ENV || 'development'}      ║
╚══════════════════════════════════════════════════════════╝
  `);
});
