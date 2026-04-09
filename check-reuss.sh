#!/bin/bash

# ============================================================================
# 💎 REUSS CHECKER ULTRA - Termux Native (No /tmp)
# Contrat: 0xB37531727fC07c6EED4f97F852A115B428046EB2
# ============================================================================

WALLET=${1:-0x742d35Cc6634C0532925a3b8D9829fF0d96E9D45}
REUSS="0xB37531727fC07c6EED4f97F852A115B428046EB2"
RPC="https://polygon-bor-rpc.publicnode.com"

clear
echo "🇬🇵 REUSS ULTRA CHECKER"
echo "======================"
echo "Wallet: $(echo $WALLET | cut -c1-12)...$(echo $WALLET | cut -c38-42)"
echo "Token : $REUSS"
echo ""

# Temp files LOCAL (pas /tmp)
TMP_REUSS=$(mktemp ./reuss-XXXXXX.json 2>/dev/null || mktemp ./reuss.json)
TMP_MATIC=$(mktemp ./matic-XXXXXX.json 2>/dev/null || mktemp ./matic.json)
TMP_DEX=$(mktemp ./dex-XXXXXX.json 2>/dev/null || mktemp ./dex.json)

# REUSS BALANCE
printf "💎 REUSS : "
curl -s -m 8 -X POST "$RPC" \
  -H "Content-Type: application/json" \
  -d "{"jsonrpc":"2.0","id":1,"method":"eth_call","params":[{"to":"$REUSS","data":"0x70a082310000000000000000${WALLET#0x}"},"latest"]}" \
  > "$TMP_REUSS" 2>/dev/null || echo '{}' > "$TMP_REUSS"

HEX=$(grep -o '"result":"0x[0-9a-f]*"' "$TMP_REUSS" 2>/dev/null | head -1 | cut -d'"' -f4 || echo "0x0")
RAW=$(echo "ibase=16; ${HEX#0x}" | bc 2>/dev/null || echo 0)
BALANCE=$(echo "scale=6; if($RAW>0) $RAW/1000000000000000000 else 0" | bc -l 2>/dev/null || echo 0)
printf "%s
" "$BALANCE"

# MATIC BALANCE
printf "🏺 MATIC : "
curl -s -m 8 -X POST "$RPC" \
  -d "{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["$WALLET","latest"]}" \
  > "$TMP_MATIC" 2>/dev/null || echo '{}' > "$TMP_MATIC"

HEX=$(grep -o '"result":"0x[0-9a-f]*"' "$TMP_MATIC" 2>/dev/null | head -1 | cut -d'"' -f4 || echo "0x0")
RAW=$(echo "ibase=16; ${HEX#0x}" | bc 2>/dev/null || echo 0)
BALANCE=$(echo "scale=6; if($RAW>0) $RAW/1000000000000000000 else 0" | bc -l 2>/dev/null || echo 0)
printf "%s
" "$BALANCE"

# DEXSCREENER
echo ""
echo "📊 QUICKSWAP:"
curl -s -m 8 "https://api.dexscreener.com/latest/dex/tokens/$REUSS" \
  > "$TMP_DEX" 2>/dev/null || echo '{}' > "$TMP_DEX"

PRICE=$(grep -o '"priceUsd":"[^"]*"' "$TMP_DEX" 2>/dev/null | head -1 | cut -d'"' -f4 || echo "N/A")
LIQ=$(grep -o '"liquidity":{"usd":[0-9.]*"' "$TMP_DEX" 2>/dev/null | head -1 | grep -o '[0-9.]*$' || echo "0")
echo "💰 Prix     : $$PRICE"
echo "💧 Liquidity: $$LIQ"

# Cleanup
rm -f ./reuss-*.json ./matic-*.json ./dex-*.json 2>/dev/null

echo ""
echo "🔗 polygonscan.com/token/$REUSS"
