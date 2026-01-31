import requests

TOKEN_A = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

print("🔍 VÉRIFICATION RAPIDE TOKEN A\n")
print("="*70)

# Essayer DexScreener API
print("📊 Tentative récupération données DEXScreener...\n")

url = f"https://api.dexscreener.com/latest/dex/tokens/{TOKEN_A}"

try:
    response = requests.get(url, timeout=10)
    if response.status_code == 200:
        data = response.json()
        
        if data.get('pairs'):
            print("✅ POOL(S) TROUVÉ(S) !\n")
            
            for pair in data['pairs']:
                print(f"DEX: {pair.get('dexId', 'Unknown')}")
                print(f"Pair: {pair.get('baseToken', {}).get('symbol')}/{pair.get('quoteToken', {}).get('symbol')}")
                print(f"Prix: ${pair.get('priceUsd', '0')}")
                print(f"Liquidité: ${pair.get('liquidity', {}).get('usd', '0'):,.2f}")
                print(f"Volume 24h: ${pair.get('volume', {}).get('h24', 0):,.2f}")
                print(f"Transactions 24h: {pair.get('txns', {}).get('h24', {}).get('buys', 0)} achats, {pair.get('txns', {}).get('h24', {}).get('sells', 0)} ventes")
                print(f"Créé: {pair.get('pairCreatedAt', 'Unknown')}")
                print(f"URL: {pair.get('url', 'N/A')}")
                print("-"*70)
        else:
            print("❌ Aucun pool trouvé sur DEXScreener")
    else:
        print(f"⚠️ Erreur API: Status {response.status_code}")
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "="*70)
print("🔗 Vérifiez manuellement aussi:")
print(f"https://dexscreener.com/polygon/{TOKEN_A}")
print("="*70)
