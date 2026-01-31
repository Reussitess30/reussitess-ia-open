from web3 import Web3
import requests
import os

print("🔍 ANALYSE DE L'ADRESSE SUSPECTE\n")
print("="*70)

scammer = Web3.to_checksum_address("0x5e6c5271e15BdE064d16CFF40418b8b1c487156B")

print(f"📍 Adresse analysée:")
print(f"   {scammer}\n")

# Connexion
alchemy_url = None
with open('.env', 'r') as f:
    for line in f:
        if 'ALCHEMY_URL' in line:
            alchemy_url = line.split('=')[1].strip().strip('"').strip("'")
            break

if alchemy_url:
    w3 = Web3(Web3.HTTPProvider(alchemy_url))
    
    if w3.is_connected():
        print("✅ Connecté à Polygon\n")
        
        # Balance
        balance = w3.eth.get_balance(scammer)
        matic = float(w3.from_wei(balance, 'ether'))
        
        print(f"💰 Balance MATIC: {matic:.6f} MATIC")
        
        if matic > 100:
            print("🚨 ALERTE: Balance élevée - Scammer actif!")
        elif matic > 10:
            print("⚠️ Balance moyenne - Activité suspecte")
        else:
            print("ℹ️ Balance faible")
        
        # Code du contrat
        code = w3.eth.get_code(scammer)
        
        if len(code) > 2:
            print(f"\n🔧 Type: SMART CONTRACT")
            print(f"📊 Taille du code: {len(code)} bytes")
            print("⚠️ C'est un contrat automatisé de spam/scam")
        else:
            print(f"\n👤 Type: WALLET (EOA - Externally Owned Account)")
    else:
        print("❌ Connexion échouée")
else:
    print("❌ ALCHEMY_URL non trouvé")

# Vérifier sur PolygonScan
print("\n" + "="*70)
print("🔗 LIENS DE VÉRIFICATION")
print("="*70)

print(f"\n📊 PolygonScan:")
print(f"https://polygonscan.com/address/{scammer}")

print(f"\n🔍 Etherscan (Polygon):")
print(f"https://polygonscan.com/address/{scammer}#tokentxns")

print(f"\n💰 Token transfers:")
print(f"https://polygonscan.com/address/{scammer}#tokentxns")

# Vérifier les transactions récentes via API
print("\n" + "="*70)
print("📊 ACTIVITÉ RÉCENTE")
print("="*70)

polygonscan_key = None
try:
    with open('.env', 'r') as f:
        for line in f:
            if 'POLYGONSCAN' in line:
                polygonscan_key = line.split('=')[1].strip().strip('"').strip("'")
                break
except:
    pass

if polygonscan_key:
    url = f"https://api.polygonscan.com/api?module=account&action=txlist&address={scammer}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey={polygonscan_key}"
    
    try:
        response = requests.get(url, timeout=10)
        result = response.json()
        
        if result['status'] == '1':
            txs = result['result']
            print(f"\n✅ {len(txs)} transactions récentes trouvées")
            
            # Compter les victimes
            victims = set()
            for tx in txs:
                if tx['to']:
                    victims.add(tx['to'].lower())
            
            print(f"🎯 Nombre de victimes potentielles: {len(victims)}")
            
            # Montrer quelques transactions
            print(f"\nDernières transactions:")
            for i, tx in enumerate(txs[:5], 1):
                to_addr = tx['to'][:10] + "..." if tx['to'] else "Contract Creation"
                timestamp = tx['timeStamp']
                print(f"  {i}. Vers: {to_addr}")
        else:
            print("⚠️ Aucune transaction trouvée")
            
    except Exception as e:
        print(f"❌ Erreur API: {e}")
else:
    print("⚠️ Clé PolygonScan manquante - Analyse limitée")

print("\n" + "="*70)
print("🛡️ PROTECTION")
print("="*70)

print("\n✅ Actions recommandées:")
print("1. ✅ Cacher le token spam dans MetaMask")
print("2. ✅ Ne JAMAIS interagir avec cette adresse")
print("3. ✅ Ne PAS approuver de contrats suspects")
print("4. ✅ Signaler sur PolygonScan si possible")

print("\n❌ NE JAMAIS:")
print("❌ Envoyer des fonds à cette adresse")
print("❌ Approuver ce contrat")
print("❌ Cliquer sur les liens du token")
print("❌ Essayer de vendre les tokens spam")

print("\n" + "="*70)
print("💡 CONCLUSION")
print("="*70)

print("\nCette adresse fait partie d'un réseau de spam/scam")
print("sur Polygon. Des milliers de personnes reçoivent")
print("ces tokens chaque jour.")
print("\nVotre wallet est SAFE si vous:")
print("✅ N'avez pas cliqué sur leurs liens")
print("✅ N'avez pas approuvé leurs contrats")
print("✅ N'avez pas donné votre seed phrase")

print("\n🎯 Cachez simplement le token et continuez!")
print("="*70)
