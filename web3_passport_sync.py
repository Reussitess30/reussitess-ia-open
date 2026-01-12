from web3 import Web3
import requests
import json
import time

# Connexion au noyau Polygon
web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
TOKEN_ADDR = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

# ABI Minimal pour les données de prestige
abi = [
    {"constant":True,"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"type":"function"},
    {"constant":True,"inputs":[],"name":"decimals","outputs":[{"type":"uint8"}],"type":"function"}
]

def fetch_core_data():
    print("📡 Synchronisation avec le réseau mondial...")
    contract = web3.eth.contract(address=web3.to_checksum_address(TOKEN_ADDR), abi=abi)
    
    # Données On-Chain
    decimals = contract.functions.decimals().call()
    supply = contract.functions.totalSupply().call() / (10 ** decimals)
    
    # Données Marché (DexScreener)
    market = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{TOKEN_ADDR}").json()
    price = market['pairs'][0]['priceUsd'] if market.get('pairs') else "0.000006416"
    liquidity = market['pairs'][0]['liquidity']['usd'] if market.get('pairs') else "N/A"

    passport_feed = {
        "gateway": "Guadeloupe-Core-1",
        "timestamp": int(time.time()),
        "token": "REUSSITESS",
        "origin": "Terres De Champions",
        "market_stats": {
            "price_usd": price,
            "total_supply": f"{supply:,.0f}",
            "liquidity_usd": liquidity
        },
        "motto": "Positivité à l'infini Boudoum",
        "legal_status": "Verified - 14 Countries"
    }

    with open('ia_passport_live.json', 'w') as f:
        json.dump(passport_feed, f, indent=4)
    
    print("\n✅ FLUX IA-PASSPORT GÉNÉRÉ")
    print(f"📍 Prix: ${price}")
    print(f"📍 Supply: {supply:,.0f} REUSS")
    print(f"📍 Origine: Guadeloupe (Noyau du Monde)")

if __name__ == "__main__":
    fetch_core_data()
