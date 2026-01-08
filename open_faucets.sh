#!/bin/bash

echo "🚰 FAUCETS POLYGON - GUIDE RAPIDE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Votre adresse (copiez-la):"
echo "0x69f42Aa645A43A84e1143D416a4C81A88DF01549"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 LIENS DES FAUCETS:"
echo ""
echo "1️⃣ Alchemy (Le plus simple):"
echo "   https://www.alchemy.com/faucets/polygon-pos"
echo ""
echo "2️⃣ Polygon Officiel:"
echo "   https://faucet.polygon.technology/"
echo ""
echo "3️⃣ QuickNode:"
echo "   https://faucet.quicknode.com/polygon"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 POUR OUVRIR UN LIEN DEPUIS TERMUX:"
echo "   termux-open-url https://www.alchemy.com/faucets/polygon-pos"
echo ""

# Demander si l'utilisateur veut ouvrir un lien
read -p "Voulez-vous ouvrir le faucet Alchemy? (o/n): " choice

if [ "$choice" = "o" ] || [ "$choice" = "O" ]; then
  if command -v termux-open-url &> /dev/null; then
    termux-open-url "https://www.alchemy.com/faucets/polygon-pos"
    echo "✅ Faucet ouvert dans votre navigateur!"
  else
    echo "⚠️  Copiez ce lien dans votre navigateur:"
    echo "https://www.alchemy.com/faucets/polygon-pos"
  fi
fi
