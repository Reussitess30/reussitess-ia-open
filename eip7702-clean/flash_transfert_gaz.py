from web3 import Web3
import time

w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))

# On laisse Web3 calculer lui-même le checksum correct
METAMASK = w3.to_checksum_address("0x5a47fd1d8767ff9ec1191783fb7531e09863e85a")
OWNER_ADDR = w3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")
CONTRAT_REUSS = w3.to_checksum_address("0x4b3bff4b58d22ad363bb260e22032414d4cfddb8")

print(f"\n🏝️ REUSSITESS© - RÉCUPÉRATION CHAMPION")
pk_metamask = input(f"🔑 Clé privée MetaMask : ")
pk_owner = input(f"🔑 Clé privée Owner (0x69f4...) : ")

try:
    print("\n🚀 ÉTAPE 1 : Envoi du gaz vers l'Owner...")
    # On vérifie le solde de gaz avant
    balance = w3.eth.get_balance(METAMASK)
    if balance < w3.to_wei(0.1, 'ether'):
        print("❌ Erreur : Pas assez de POL sur ton MetaMask.")
    else:
        tx_gas = {
            'nonce': w3.eth.get_transaction_count(METAMASK),
            'to': OWNER_ADDR,
            'value': w3.to_wei(0.1, 'ether'),
            'gas': 21000,
            'gasPrice': w3.eth.gas_price,
            'chainId': 137
        }
        signed_gas = w3.eth.account.sign_transaction(tx_gas, pk_metamask)
        w3.eth.send_raw_transaction(signed_gas.raw_transaction)
        print("⏳ Gaz envoyé ! Attente de 10 secondes...")
        time.sleep(10)

        print("\n💰 ÉTAPE 2 : Libération du milliard vers MetaMask...")
        abi = [{"constant": False, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "type": "function"}]
        contract = w3.eth.contract(address=CONTRAT_REUSS, abi=abi)
        
        # Montant du milliard détecté
        amount = 978999999 * 10**18
        
        tx_reuss = contract.functions.transfer(METAMASK, int(amount)).build_transaction({
            'chainId': 137,
            'gas': 150000,
            'gasPrice': w3.eth.gas_price,
            'nonce': w3.eth.get_transaction_count(OWNER_ADDR),
        })
        
        signed_reuss = w3.eth.account.sign_transaction(tx_reuss, pk_owner)
        hash_final = w3.eth.send_raw_transaction(signed_reuss.raw_transaction)
        
        print(f"\n✅ VICTOIRE ! Le milliard est à toi !")
        print(f"🔗 Transaction Hash : {hash_final.hex()}")
        print(f"🏝️ Reussitess© : Terres De Champions Positivité à l'infini Boudoum !")

except Exception as e:
    print(f"\n❌ Erreur technique : {e}")
