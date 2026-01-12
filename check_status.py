import requests

API_KEY = "SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"
GUID = "1nh7uffeenbkanmrevjffaerp6qsnbfzyjgghzlmd7q62xxc8b"

url = "https://api.polygonscan.com/api"

params = {
    "apikey": API_KEY,
    "module": "contract",
    "action": "checkverifystatus",
    "guid": GUID
}

print("🔍 Vérification du statut de la soumission...")
response = requests.get(url, params=params)
result = response.json()

print(f"\n📊 Réponse complète: {result}")

status = result.get('status')
message = result.get('result', '')

if status == '1':
    print("\n✅ SUCCÈS ! Le contrat est vérifié sur PolygonScan !")
    print(f"🔗 https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2#code")
elif 'Pending' in str(message):
    print("\n⏳ Vérification en cours... Réessaye dans 30 secondes")
elif 'already verified' in str(message).lower():
    print("\n✅ Le contrat est déjà vérifié !")
    print(f"🔗 https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2#code")
else:
    print(f"\n❌ Erreur: {message}")
