#!/bin/bash

set -e

ENV_FILE="$(dirname "$0")/.env.local"

if [ -f "$ENV_FILE" ]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHANNEL="-1001864566731"
REDIS_URL="${REDIS_URL:-redis://localhost:6379}"

if [ -z "$TOKEN" ]; then
  echo "❌ TELEGRAM_BOT_TOKEN manquant"
  exit 1
fi

send() {
  curl -s -X POST "https://api.telegram.org/bot$TOKEN/sendMessage" \
    -H "Content-Type: application/json" \
    -d "{"chat_id":"$CHANNEL","text":"$1","parse_mode":"Markdown"}"
}

VISITORS=$(python3 - <<PY
import redis
r = redis.from_url("$REDIS_URL", decode_responses=True)
print(r.get("reussitess_visitors") or "0")
PY
)

DATE=$(date '+%d/%m/%Y %H:%M')

MESSAGE="🚀 *REUSSITESS®971 — Rapport Live*

📅 $DATE
👥 Visiteurs total : *$VISITORS*
🌐 Site : https://reussitess.fr
🤖 Bot : @Reussitessbot

🇬🇵 *Boudoum ! Positivité à l'infini !*"

send "$MESSAGE"
echo "✅ Message envoyé au canal"
