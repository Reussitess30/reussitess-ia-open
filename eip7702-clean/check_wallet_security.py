from web3 import Web3
import requests
import os

print("🔍 VÉRIFICATION DE SÉCURITÉ DU WALLET\n")
print("="*70)

# Connexion
alchemy_url = None
with open('.env', 'r') as f:
    for line in f:
        if 'ALCHEMY_URL' in line:
            alchemy_url = line.split('=')[1].strip().strip('"').strip("'")
            break

w3 = Web3(Web3.HTTPProvider(alchemy_url))

# Votre wallet principal
wallet = Web3.to_checksum_address("0x69f42Aa645A43A84e1143D416a4C81A88DF01549")

print(f"📊 Wallet analysé: {wallet}\n")

# 1. Vérifier balance MATIC
matic_balance = w3.eth.get_balance(wallet)
matic = float(w3.from_wei(matic_balance, 'ether'))

print(f"💰 Balance MATIC: {matic:.4f} MATIC")

if matic < 0.01:
    print("⚠️ Balance très basse - Possibilité de drain!")
else:
    print("✅ Balance MATIC OK")

# 2. Vérifier balance REUSS
token = Web3.to_checksum_address("0xB37531727fC07c6EED4f97F852A115B428046EB2")
erc20_abi = [{"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

contract = w3.eth.contract(address=token, abi=erc20_abi)
reuss_balance = contract.functions.balanceOf(wallet).call()
reuss = reuss_balance / 10**18

print(f"💎 Balance REUSS: {reuss:,.0f} REUSS")

if reuss < 500000000:  # Moins de 50% du supply
    print("⚠️ Balance REUSS réduite - Vérifiez les transactions récentes!")
else:
    print("✅ Balance REUSS OK")

# 3. Dernières transactions
print(f"\n📊 Dernières transactions du wallet:")
print("="*70)

# Via API PolygonScan
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
    url = f"https://api.polygonscan.com/api?module=account&action=txlist&address={wallet}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey={polygonscan_key}"
    
    try:
        response = requests.get(url, timeout=10)
        result = response.json()
        
        if result['status'] == '1':
            txs = result['result'][:10]
            
            for i, tx in enumerate(txs, 1):
                from_addr = tx['from']
                to_addr = tx['to']
                value = int(tx['value']) / 10**18
                timestamp = tx['timeStamp']
                
                # Vérifier si c'est une sortie de fonds
                if from_addr.lower() == wallet.lower() and value > 0:
                    print(f"\n⚠️ TX {i}: SORTIE de {value:.4f} MATIC")
                    print(f"   Vers: {to_addr}")
                    print(f"   Hash: {tx['hash'][:20]}...")
                elif to_addr.lower() == wallet.lower() and value > 0:
                    print(f"\n✅ TX {i}: ENTRÉE de {value:.4f} MATIC")
                    print(f"   De: {from_addr}")
    except:
        print("❌ Impossible de récupérer les transactions")
else:
    print("⚠️ Clé PolygonScan manquante")

print("\n" + "="*70)
print("🔐 RECOMMANDATIONS DE SÉCURITÉ")
print("="*70)

print("\nSi vous avez été piégé:")
print("1. 🚨 NE PANIQUEZ PAS")
print("2. ✅ Vérifiez vos balances ci-dessus")
print("3. 🔍 Vérifiez les approbations (approve) actives")
print("4. 💸 Si drain en cours → Transférez vos fonds immédiatement")
print("5. 🔑 Si seed phrase compromise → Nouveau wallet URGENT")

print("\n" + "="*70)
