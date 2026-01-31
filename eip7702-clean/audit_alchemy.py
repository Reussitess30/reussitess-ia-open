import os
import requests
import json

# Chargement de l'URL depuis le .env (on nettoie les guillemets éventuels)
with open('.env', 'r') as f:
    env_data = dict(line.strip().split('=', 1) for line in f if '=' in line)

url = env_data.get('ALCHEMY_URL', '').strip('"')
contract = "0x69f42aa645a43a84e1143d416a4c81a88df01549"

# Appel JSON-RPC pour le Total Supply (0x18160ddd)
payload = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_call",
    "params": [{"to": contract, "data": "0x18160ddd"}, "latest"]
}

try:
    response = requests.post(url, json=payload)
    result_hex = response.json()['result']
    total_supply = int(result_hex, 16) / 10**18
    
    print(f"\n✅ RÉPONSE RÉELLE ALCHEMY")
    print(f"📍 Contrat : {contract}")
    print(f"💎 Offre Totale : {total_supply:,.0f} Reussitess©")
    print(f"🌍 Statut : Prêt pour les 14 pays")
    print(f"🏝️ Origine : Guadeloupe - Terres De Champions")
except Exception as e:
    print(f"❌ Erreur de connexion API : {e}")
