from web3 import Web3
import requests

TOKEN = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
OWNER = "0x69f42Aa645A43A84e1143D416a4C81A88DF01549"
API_KEY = "SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695"

print("🔍 RECHERCHE DE TOUTES LES DÉLÉGATIONS ACTIVES")
print("=" * 70)

# ABI pour Allowance
ABI = [{
    "constant": True,
    "inputs": [
        {"name": "owner", "type": "address"},
        {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
}]

web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
contract = web3.eth.contract(address=TOKEN, abi=ABI)

# Liste des adresses suspectes à vérifier
suspects = [
    "0xC3D2bE63748752bEa418d972a43B9B83b3fb0a22",  # Celle qu'on connaît
    "0x5b62851c97eF87A3Eb97A82E9076BaAAAe",  # De ta transaction
]

# Récupère aussi les transactions Approve récentes
url = f"https://api.polygonscan.com/api?module=logs&action=getLogs&fromBlock=81000000&toBlock=latest&address={TOKEN}&topic0=0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925&topic1=0x00000000000000000000000069f42aa645a43a84e1143d416a4c81a88df01549&apikey={API_KEY}"

print("\n📊 Récupération des événements Approve...")

try:
    res = requests.get(url).json()
    
    if res.get('status') == '1':
        logs = res['result']
        
        print(f"✅ {len(logs)} événements Approve trouvés\n")
        
        delegations = []
        
        for log in logs:
            # Extraire le spender (adresse déléguée)
            spender = "0x" + log['topics'][2][-40:]
            
            # Vérifier l'allowance actuelle
            try:
                allowance = contract.functions.allowance(OWNER, spender).call()
                
                if allowance > 0:
                    delegations.append({
                        'spender': spender,
                        'allowance': allowance,
                        'tx': log['transactionHash']
                    })
            except:
                pass
        
        print("🚨 DÉLÉGATIONS ACTIVES TROUVÉES:")
        print("=" * 70)
        
        if delegations:
            for d in delegations:
                print(f"\n📍 Adresse: {d['spender']}")
                print(f"💰 Montant approuvé: {d['allowance'] / 10**18:,.0f} REUSS")
                print(f"🔗 TX d'origine: {d['tx']}")
                print(f"🔗 https://polygonscan.com/tx/{d['tx']}")
        else:
            print("✅ Aucune délégation active trouvée !")
            print("   (Peut-être déjà révoquées)")
        
    else:
        print(f"❌ Erreur API: {res.get('message')}")
        
except Exception as e:
    print(f"❌ Erreur: {e}")

print("\n" + "=" * 70)
print("💡 PROCHAINES ÉTAPES:")
print("   1. Ajoute du MATIC à ton wallet pour le gas")
print("   2. Va sur https://revoke.cash/")
print("   3. Révoque TOUTES les délégations trouvées ci-dessus")
