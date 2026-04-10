#!/bin/bash
source .env
cd ~/reussitess-global-nexus && 
git pull && 
vercel --prod && 
curl "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
  -d "chat_id=${CHANNEL_ID}" \
  -d "text=🚀 EMPIRE DEPLOY c4774d0f https://reussitess.fr"
