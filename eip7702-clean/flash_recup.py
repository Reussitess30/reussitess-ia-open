from web3 import Web3
import time

w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))

META = w3.to_checksum_address("0x5a47fd1d8767ff9ec1191783fb7531e09863e85a")
OWNER = w3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")
CONTRAT = w3.to_checksum_address("0x4b3bff4b58d22ad363bb260e22032414d4cfddb8")

pk_meta = input("🔑 Clé privée MetaMask (Source Gaz) : ")
pk_owner = input("🔑 Clé privée Owner (Source Milliard) : ")

try:
    # On calcule le prix maximum possible pour ton solde de 0.18 POL
    # Solde = (GasLimit * GasPrice) + Value
    # On fixe la Value à 0.11 POL pour laisser de la marge
    val_envoyee = w3.to_wei(0.11, 'ether')
    gas_limit_transfert = 21000
    solde_dispo = w3.eth.get_balance(META)
    
    # Calcul du prix du gaz maximum supportable
    max_gas_price = int((solde_dispo - val_envoyee) / gas_limit_transfert)
    
    print(f"\n⚡ Solde dispo: {w3.from_wei(solde_dispo, 'ether')} POL")
    print(f"🚀 Poussée optimisée à {w3.from_wei(max_gas_price, 'gwei')} gwei")

    # 1. Envoi du gaz
    tx1 = {
        'nonce': w3.eth.get_transaction_count(META),
        'to': OWNER,
        'value': val_envoyee,
        'gas': gas_limit_transfert,
        'gasPrice': max_gas_price,
        'chainId': 137
    }
    s1 = w3.eth.account.sign_transaction(tx1, pk_meta)
    w3.eth.send_raw_transaction(s1.raw_transaction)
    
    # 2. Retrait immédiat
    abi = [{"constant": False, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "type": "function"}]
    contract = w3.eth.contract(address=CONTRAT, abi=abi)
    
    # On utilise le même prix du gaz pour l'owner
    tx2 = contract.functions.transfer(META, 978999999 * 10**18).build_transaction({
        'chainId': 137,
        'gas': 100000,
        'gasPrice': max_gas_price,
        'nonce': w3.eth.get_transaction_count(OWNER),
    })
    s2 = w3.eth.account.sign_transaction(tx2, pk_owner)
    
    print("🛰️ Synchronisation des blocs...")
    for i in range(10): # On augmente les tentatives
        try:
            w3.eth.send_raw_transaction(s2.raw_transaction)
            print(f"💰 Rafale {i+1} envoyée !")
        except:
            pass
        time.sleep(0.3)

    print("\n🏁 Mission terminée. Reussitess© Guadeloupe - Vérifie ton solde !")
except Exception as e:
    print(f"❌ Erreur : {e}")
