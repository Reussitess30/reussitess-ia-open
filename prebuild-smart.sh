#!/bin/bash
RED='\u001B[0;31m'; GREEN='\u001B[0;32m'; YELLOW='\u001B[1;33m'; NC='\u001B[0m'

echo -e "${YELLOW}🔍 PRÉ-BUILD SMART REUSSITESS${NC}"
echo "===================================="

# 1. Clean + Syntaxe critique
rm -rf .next/cache
echo -e "${YELLOW}Syntaxe chat.js...${NC}"
if ! node -c pages/api/superbot/chat.js 2>/dev/null; then
  echo -e "${RED}❌ Syntaxe chat.js KO${NC}"
  echo "FIX AUTO..."
  sed -i '/signal: AbortSignal/,+1d' pages/api/superbot/chat.js
  sed -i '861i const joRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://legifrss.org/latest&count=5"); const joData = await joRes.json();' pages/api/superbot/chat.js
fi

# 2. Build test STRICT
echo -e "${YELLOW}Build test...${NC}"
if ! npm run build 2>&1 | tee build.log | grep -q "Failed to compile|Syntax Error"; then
  echo -e "${GREEN}🎉 BUILD OK → DEPLOY${NC}"
  git add . && git commit -m "Prebuild smart ✅" && git push && vercel --prod --force
else
  echo -e "${RED}❌ BUILD FAIL${NC}"
  echo "Erreur:"
  tail -15 build.log
  exit 1
fi
