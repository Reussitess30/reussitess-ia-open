#!/bin/bash
echo "🔥 AUTO-EMPIRE SETUP..."

# 1. Cherche token projet
TOKEN=$(grep -r "BOT_TOKEN|telegram.*token" . --include="*.js" --include="*.json" --include="*.env*" | head -1 | sed -n 's/.*(BOT_TOKEN["'']?s*=s*["'']?)????([0-9A-Za-z:_-]+).*/\u0002/p' | head -1)

if [ -z "$TOKEN" ]; then
  echo "❌ Token non trouvé → Vercel scan..."
  TOKEN=$(vercel env ls | grep BOT_TOKEN | head -1 | awk '{print $2}')
fi

if [ -n "$TOKEN" ]; then
  echo "✅ TOKEN: ${TOKEN:0:20}..."
  cat > .env << EOV
BOT_TOKEN=$TOKEN
CHANNEL_ID=@Reussitessbot
KICK_CLIENT_ID=01KNVQCJF66D4397YQFDTYZCNE
REUSS_CONTRACT=0xB37531727fC07c6EED4f97F852A115B428046EB2
EOV
  
  # PM2 relance
  npx pm2 delete all 2>/dev/null
  npx pm2 start empire-sync.js --name sync
  npx pm2 start monitor-empire.js --name monitor
  npx pm2 save
  
  echo "🏆 EMPIRE AUTO-OK ! Logs:"
  npx pm2 logs sync --lines 5
else
  echo "❌ AUCUN TOKEN → Vérif manuelle:"
  ls -la *.env* | head -3
  vercel env ls | grep -i token
fi
