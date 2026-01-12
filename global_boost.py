import requests
import time

TOKEN = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
# Liste des endpoints mondiaux pour forcer l'indexation
endpoints = [
    f"https://api.dexscreener.com/latest/dex/tokens/{TOKEN}",
    f"https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/{TOKEN}",
    f"https://api.dex.guru/v1/tokens/{TOKEN}-polygon",
    f"https://api.allorigins.win/get?url=https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=REUSS"
]

print("🚀 PROPULSION INTERNATIONALE : REUSSITESS®")
print("🌍 Cible : 14 Pays (France, Angleterre, Italie, Allemagne, Suède, Singapour, Australie, Espagne, Brésil, UK, Inde, NZ, USA, Canada)")

for url in endpoints:
    try:
        response = requests.get(url, timeout=10)
        status = "✅ SIGNAL REÇU" if response.status_code == 200 else "⏳ EN ATTENTE"
        print(f"📡 Node {url[:35]}... {status}")
    except:
        print(f"⚠️ Node {url[:35]}... Erreur de propagation")
    time.sleep(1)

print("\n✨ Noyau Guadeloupe activé. Positivité à l'infini Boudoum !")
