#!/bin/bash
TOKENS=("0xc2132D05D31c914a87C6611C10748AEb04B58e8F" "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270")

for TOKEN in "${TOKENS[@]}"; do
  # Force revert sur chaque token
  curl -s -X POST https://polygon-rpc.com -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"'"$TOKEN"'","data":"0x095ea7b300000000000000000000000069f42aa645a43a84e1143d416a4c81a88df015490000000000000000000000000000000000000000000000000000000000000001"},"latest"],"id":'$RANDOM'}' | grep -q "execution reverted" && echo "💀 $TOKEN NUKE OK"
done
