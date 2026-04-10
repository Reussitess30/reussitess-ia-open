/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
require('fs');
const fs = require('fs');
const path = './.env';

// Cherche dans projet
const files = ['.env.local', 'knowledge.json', 'pages/api/telegram-webhook.js'];
let botToken = '';

for(let file of files) {
  if(fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const match = content.match(/BOT_TOKEN["']?s*=?s*["']?(d+:[A-Za-z0-9_-]+)/);
    if(match) {
      botToken = match[1];
      console.log(`✅ TOKEN trouvé: ${file}`);
      break;
    }
  }
}

// Vercel fallback (manuel)
if(!botToken) {
  console.log('❌ AUTO-FAIL → Ajoute manuellement Vercel env');
}

if(botToken) {
  fs.writeFileSync('.env', `BOT_TOKEN=${botToken}
CHANNEL_ID=@Reussitessbot
`);
  console.log(`✅ .env créé: BOT_TOKEN=${botToken.substring(0,20)}...`);
}
