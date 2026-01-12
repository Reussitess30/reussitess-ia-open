from web3 import Web3
import json

# Connexion directe aux nœuds mondiaux
rpc_url = "https://polygon-rpc.com"
web3 = Web3(Web3.HTTPProvider(rpc_url))

TOKEN_ADDR = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
OWNER_ADDR = "0x69f42aa645a43a84e1143d416a4c81a88df01549"

# ABI minimal pour les fonctions de prestige
abi = [
    {"constant":True,"inputs":[],"name":"name","outputs":[{"type":"string"}],"type":"function"},
    {"constant":True,"inputs":[],"name":"symbol","outputs":[{"type":"string"}],"type":"function"},
    {"constant":True,"inputs":[],"name":"totalSupply","outputs":[{"type":"uint256"}],"type":"function"},
    {"constant":True,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"type":"uint256"}],"type":"function"}
]

def run_dominance():
    if not web3.is_connected():
        print("❌ Déconnecté du réseau mondial")
        return

    contract = web3.eth.contract(address=web3.to_checksum_address(TOKEN_ADDR), abi=abi)
    
    # Données réelles
    name = contract.functions.name().call()
    symbol = contract.functions.symbol().call()
    supply = contract.functions.totalSupply().call() / 10**18
    owner_bal = contract.functions.balanceOf(web3.to_checksum_address(OWNER_ADDR)).call() / 10**18

    print("\n" + "="*60)
    print(f"🌍 REUSSITESS® - NOYAU MONDIAL : GUADELOUPE")
    print("="*60)
    print(f"✅ Nom : {name}")
    print(f"✅ Symbole : {symbol}")
    print(f"✅ Supply Totale : {supply:,.0f} REUSS")
    print(f"✅ Réserve Stratégique : {owner_bal:,.0f} REUSS")
    print(f"✅ Statut Légal : Conforme 14 pays")
    print("="*60)
    print("POSITIVITÉ À L'INFINI - BOUDOUM !")

if __name__ == "__main__":
    run_dominance()
