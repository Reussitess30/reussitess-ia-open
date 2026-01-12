import requests

TOKEN = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

def audit_market():
    print("🔍 AUDIT DE DISPONIBILITÉ MONDIALE")
    res = requests.get(f"https://api.dexscreener.com/latest/dex/tokens/{TOKEN}").json()
    
    if res.get('pairs'):
        pair = res['pairs'][0]
        print(f"✅ Prix : ${pair['priceUsd']}")
        print(f"✅ Liquidité : ${pair['liquidity']['usd']}")
        print(f"⚠️ Volume 24h : ${pair['volume']['h24']} (Besoin d'activation)")
        print("\n💡 STRATÉGIE REUSSITESS :")
        print("Pour générer des MATIC, le volume doit dépasser $1,000.")
    else:
        print("❌ Token non encore indexé sur les agrégateurs majeurs.")

audit_market()
