#!/bin/bash

WALLET="0x69f42Aa645A43A84e1143D416a4C81A88DF01549"

echo "🔍 SURVEILLANCE ACTIVE DU WALLET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Adresse: $WALLET"
echo ""
echo "⏳ Vérification toutes les 10 secondes..."
echo "   Appuyez sur Ctrl+C pour arrêter"
echo ""

while true; do
  BALANCE=$(node -e "const { ethers } = require('ethers'); const p = new ethers.JsonRpcProvider('https://polygon-rpc.com'); p.getBalance('$WALLET').then(b => console.log(ethers.formatEther(b)))")
  
  TIMESTAMP=$(date '+%H:%M:%S')
  
  if [ "$BALANCE" != "0.0" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎉 BOUDOUM! POL DÉTECTÉ!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "💰 Nouveau solde: $BALANCE POL"
    echo "⏰ Heure: $TIMESTAMP"
    echo ""
    echo "✅ Vous pouvez maintenant effectuer des transactions!"
    echo ""
    break
  else
    echo -ne "\r⏳ [$TIMESTAMP] Solde: $BALANCE POL - En attente...     "
  fi
  
  sleep 10
done
