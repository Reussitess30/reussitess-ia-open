#!/bin/bash

# Configuration Reussitess©
API_KEY="SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"
CONTRAT_2025="0x4b3bFf4b58d22Ad363bb260e22032414d4CfdDB8"
CONTRAT_2026="0xB37531727fC07c6EED4f97F852A115B428046EB2"

echo "---------------------------------------------------------"
echo "🚀 REUSSITESS© - MONITORING MONDIAL"
echo "📍 ORIGINE : GUADELOUPE - TERRES DE CHAMPIONS"
echo "---------------------------------------------------------"

# Commande Python mémorisée exécutée en arrière-plan
python3 -c "
import requests
try:
    # 1. Check Noyau 2026 (Le Milliard)
    url26 = f'https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=81300000&toBlock=latest&address=$CONTRAT_2026&apikey=$API_KEY'
    res26 = requests.get(url26).json()
    if res26['status'] == '1':
        val = int(res26['result'][0]['data'], 16) / 10**18
        print(f'✅ NOYAU 2026 : {val:,.0f} REUSS (OFFRE TOTALE)')
    
    # 2. Check Distributions 2025 (Les 14 Pays)
    url25 = f'https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=65000000&toBlock=67000000&address=$CONTRAT_2025&apikey=$API_KEY'
    res25 = requests.get(url25).json()
    if res25['status'] == '1':
        found = len([log for log in res25['result'] if 990000 <= int(log['data'], 16)/10**18 <= 1010000])
        print(f'🌍 IMPACT 2025 : {found}/14 PAYS CERTIFIÉS')
except Exception as e:
    print(f'❌ Erreur de connexion : {e}')
"

echo "---------------------------------------------------------"
echo "POSITIVITÉ À L'INFINI - BOUDOUM !"
