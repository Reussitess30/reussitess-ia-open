#!/bin/bash
WALLET="0x69f42aa645a43a84e1143d416a4c81a88df01549"
CONTRACT="0xB37531727fC07c6EED4f97F852A115B428046EB2"

echo "🔍 RÉCUPÉRATION DU NONCE PERMIT - REUSSITESS©"

# Fonction nonces(owner) -> selector 0x7ecebe89
DATA="0x7ecebe89000000000000000000000000${WALLET#0x}"

RESPONSE=$(curl -s -X POST https://polygon-rpc.com \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$CONTRACT\",\"data\":\"$DATA\"},\"latest\"],\"id\":1}")

NONCE_HEX=$(echo $RESPONSE | grep -oE '0x[0-9a-f]+' | tail -1)

if [ "$NONCE_HEX" == "" ] || [ "$NONCE_HEX" == "0x" ]; then
    echo "✅ Nonce actuel : 0 (Première signature)"
else
    NONCE_DEC=$((NONCE_HEX))
    echo "✅ Nonce actuel : $NONCE_DEC ($NONCE_HEX)"
fi
