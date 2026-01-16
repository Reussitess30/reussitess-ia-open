#!/bin/bash
WALLET="0x69f42aa645a43a84e1143d416a4c81a88df01549"
TOKENS=("0xc2132D05D31c914a87C6611C10748AEb04B58e8F" "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270")

for TOKEN in "${TOKENS[@]}"; do
  curl -s -X POST https://polygon-rpc.com \
    -H "Content-Type: application/json" \
    -d "{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"$TOKEN","data":"0xdd62ed3e000000000000000000000000$WALLET"},"latest"],"id":1}" \
    | grep -q "0x0000000000000000000000000000000000000000" && echo "✅ $TOKEN revoked" || echo "❌ $TOKEN active"
done
