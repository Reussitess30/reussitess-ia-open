#!/bin/bash

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "     🎯 TRANSFERT COMPLET DES TOKENS REUSSITESS"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Ce script va:"
echo "  1. Envoyer 0.01 POL à l'adresse 1"
echo "  2. Transférer 1 milliard de REUSS vers l'adresse 2"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
read -p "Prêt à commencer? (Entrée pour continuer) "

echo ""
echo "🚀 ÉTAPE 1/2: Envoi de POL..."
echo ""
node send_pol_to_address1.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Étape 1 réussie!"
  echo ""
  read -p "Appuyez sur Entrée pour l'étape 2..."
  echo ""
  echo "🚀 ÉTAPE 2/2: Transfert des tokens..."
  echo ""
  node transfer_all_tokens.js
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "     🎉 TRANSFERT COMPLET RÉUSSI! BOUDOUM!"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "✅ Tous vos tokens REUSSITESS sont maintenant sur l'adresse 2"
    echo "✅ Vous avez le contrôle total"
    echo "✅ Vous pouvez utiliser MetaMask normalement"
    echo ""
  fi
fi
