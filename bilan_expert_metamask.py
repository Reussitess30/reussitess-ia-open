from web3 import Web3
from web3.middleware import ExtraDataToPOAMiddleware

# Connexion Web3 Pure
web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
web3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)

# Ton adresse Maître (Source des 14 millions)
MY_ADDRESS = web3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")

def bilan_metamask():
    print(f"📊 BILAN DES TRANSFERTS DEPUIS LE PORTEFEUILLE MAÎTRE")
    print(f"📍 Source : {MY_ADDRESS}")
    print("="*60)

    # On récupère les dernières transactions de l'adresse
    # Note : Sur Termux, on scanne les derniers blocs où tu as agi
    latest_block = web3.eth.block_number
    start_block = latest_block - 100000 # On élargit le champ

    print(f"🔎 Scan des transactions sortantes (Blockchain Direct)...")
    
    found_distrib = 0
    
    # Pour un bilan de champion, on analyse les transactions sortantes
    for i in range(latest_block, start_block, -2000):
        block = web3.eth.get_block(i, full_transactions=True)
        for tx in block.transactions:
            if tx['from'] == MY_ADDRESS:
                # On vérifie si la valeur correspond à un envoi de jetons ou de MATIC
                # Si c'est un transfert de REUSS, c'est dans 'input'
                if len(tx['input']) > 10: # Transaction avec données (Transfert de jetons)
                    found_distrib += 1
                    dest = tx['to']
                    print(f"✅ Envoi détecté vers : {dest}")
                    print(f"🔗 TX Hash : {tx['hash'].hex()[:20]}...")
        
        if found_distrib >= 14:
            break

    print("-" * 60)
    print(f"🏆 RÉSULTAT : {found_distrib} pays identifiés dans l'historique.")
    print(f"Guadeloupe - Terres De Champions - Boudoum !")
    print("="*60)

if __name__ == "__main__":
    bilan_metamask()
