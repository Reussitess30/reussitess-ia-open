from web3 import Web3
import requests
import os

print("🔍 VÉRIFICATION DES TOKENS SPAM REÇUS\n")
print("="*70)

wallet = "0x5e6c5271e15BdE064d16CFF40418b8b1c487156B"

print(f"📍 Wallet: {wallet}\n")

# Lire clé PolygonScan
polygonscan_key = None
try:
    with open('.env', 'r') as f:
        for line in f:
            if 'POLYGONSCAN' in line:
                polygonscan_key = line.split('=')[1].strip().strip('"').strip("'")
                break
except:
    pass

if not polygonscan_key:
    print("⚠️ Clé PolygonScan manquante")
    exit()

# Récupérer tous les tokens reçus
url = f"https://api.polygonscan.com/api?module=account&action=tokentx&address={wallet}&page=1&offset=100&sort=desc&apikey={polygonscan_key}"

try:
    response = requests.get(url, timeout=10)
    result = response.json()
    
    if result['status'] == '1':
        txs = result['result']
        
        print(f"✅ {len(txs)} transactions de tokens trouvées\n")
        
        # Filtrer les transactions entrantes (IN)
        received_tokens = {}
        
        for tx in txs:
            if tx['to'].lower() == wallet.lower():  # Transaction entrante
                token_symbol = tx['tokenSymbol']
                token_name = tx['tokenName']
                amount = int(tx['value']) / (10 ** int(tx['tokenDecimal']))
                
                if token_symbol not in received_tokens:
                    received_tokens[token_symbol] = {
                        'name': token_name,
                        'amount': 0,
                        'contract': tx['contractAddress'],
                        'count': 0
                    }
                
                received_tokens[token_symbol]['amount'] += amount
                received_tokens[token_symbol]['count'] += 1
        
        print("📊 TOKENS REÇUS:")
        print("="*70)
        
        for symbol, data in received_tokens.items():
            # Détecter les spam
            is_spam = False
            reasons = []
            
            if 't.me' in data['name'].lower() or 'http' in data['name'].lower():
                is_spam = True
                reasons.append("Lien dans le nom")
            
            if data['amount'] in [888, 777, 1000, 10000]:
                is_spam = True
                reasons.append("Montant suspect")
            
            if '999999' in data['contract'] or '888888' in data['contract']:
                is_spam = True
                reasons.append("Adresse suspecte")
            
            status = "🚨 SPAM" if is_spam else "✅ LÉGITIME"
            
            print(f"\n{status} {symbol}")
            print(f"  Nom: {data['name'][:50]}")
            print(f"  Montant: {data['amount']:,.0f}")
            print(f"  Reçu: {data['count']} fois")
            print(f"  Contrat: {data['contract'][:20]}...")
            
            if is_spam:
                print(f"  Raisons: {', '.join(reasons)}")
                print(f"  👉 ACTION: Cacher ce token dans MetaMask")
        
        # Compter les spam
        spam_count = sum(1 for s, d in received_tokens.items() 
                        if 't.me' in d['name'].lower() or 'http' in d['name'].lower())
        
        print("\n" + "="*70)
        print(f"📊 RÉSUMÉ:")
        print(f"  Total tokens: {len(received_tokens)}")
        print(f"  Spam détectés: {spam_count}")
        print(f"  Légitimes: {len(received_tokens) - spam_count}")
        
    else:
        print("❌ Aucune transaction trouvée")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "="*70)
print("✅ RECOMMANDATIONS")
print("="*70)
print("\n1. Cachez tous les tokens SPAM dans MetaMask")
print("2. Ne les touchez JAMAIS")
print("3. Continuez normalement avec vos vrais tokens")
print("4. C'est normal de recevoir du spam sur Polygon")
