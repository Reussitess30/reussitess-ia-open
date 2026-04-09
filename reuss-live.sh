#!/bin/bash
clear
echo "🇬🇵 REUSS LIVE DASHBOARD $(date +'%H:%M:%S')"
echo "====================================="

WALLET=${1:-0x742d35Cc6634C0532925a3b8D9829fF0d96E9D45}
echo "💎 Wallet: ${WALLET:0:10}..."

# 1. TON BALANCE REUSS
echo -e "
💎 TON REUSS:"
curl -s -X POST https://polygon-bor-rpc.publicnode.com \
  -H "Content-Type: application/json" \
  -d "{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"0xB37531727fC07c6EED4f97F852A115B428046EB2","data":"0x70a082310000000000000000${WALLET#0x}"},"latest"]}" | \
jq -r '.result' | tail -c 33 | xxd -r -p | rev | cut -c1-32 | rev | xargs printf '%d
' 0x | awk '{printf "%.4f REUSS
", $1/1e18}'

# 2. PRIX/POOL DEXScreener
echo -e "
📊 MARCHÉ QuickSwap:"
curl -s "https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2" | \
jq -r '.pairs[0] // empty | "💰 Prix: $" + (.priceUsd // "N/A") + "
💧 Liquidity: $" + (.liquidity.usd|tostring // "0") + "
📈 Vol 24h: $" + (.volume.h24|tostring // "0")' || echo "❌ Pas de pool détecté"

# 3. POLYGON natif
echo -e "
🏺 MATIC:"
curl -s -X POST https://polygon-bor-rpc.publicnode.com \
  -d "{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["${WALLET}","latest"]}" | \
jq -r '.result' | xargs printf '%d
' 0x | awk '{printf "%.6f MATIC
", $1/1e18}'
