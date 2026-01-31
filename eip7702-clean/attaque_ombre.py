from web3 import Web3
import time

w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))

META = w3.to_checksum_address("0x5a47fd1d8767ff9ec1191783fb7531e09863e85a")
OWNER = w3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")
CONTRAT = w3.to_checksum_address("0x4b3bff4b58d22ad363bb260e22032414d4cfddb8")

pk_meta = input("🔑 Clé privée MetaMask (Source Gaz) : ")
pk_owner = input("🔑 Clé privée Owner (Source Milliard) : ")

try:
    # 1. On booste le prix du gaz (EIP-1559)
    base_fee = w3.eth.get_block('latest')['baseFeePerGas']
    priority_fee = w3.to_wei(300, 'gwei') # Priorité maximale
    max_fee = base_fee + priority_fee

    print("\n⚡ Préparation de l'attaque synchronisée...")

    # Transaction A : Envoi du gaz (0.15 POL)
    tx_a = {
        'nonce': w3.eth.get_transaction_count(META),
        'to': OWNER,
        'value': w3.to_wei(0.15, 'ether'),
        'gas': 21000,
        'maxFeePerGas': max_fee,
        'maxPriorityFeePerGas': priority_fee,
        'chainId': 137
    }

    # Transaction B : Retrait du milliard
    abi = [{"constant": False, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "type": "function"}]
    contract = w3.eth.contract(address=CONTRAT, abi=abi)
    
    tx_b = contract.functions.transfer(META, 978999999 * 10**18).build_transaction({
        'nonce': w3.eth.get_transaction_count(OWNER),
        'gas': 120000,
        'maxFeePerGas': max_fee,
        'maxPriorityFeePerGas': priority_fee,
        'chainId': 137
    })

    # Signature
    s_a = w3.eth.account.sign_transaction(tx_a, pk_meta)
    s_b = w3.eth.account.sign_transaction(tx_b, pk_owner)

    print("🚀 PROPULSION SIMULTANÉE...")
    # On balance tout dans le même flux
    w3.eth.send_raw_transaction(s_a.raw_transaction)
    
    # On envoie la rafale B immédiatement
    for i in range(15):
        try:
            w3.eth.send_raw_transaction(s_b.raw_transaction)
            print(f"🔥 Rafale {i+1} envoyée...")
        except:
            pass
        
    print("\n🏁 Mission terminée. Si le milliard n'est pas là, on devra utiliser un relay Flashbots.")
except Exception as e:
    print(f"❌ Erreur : {e}")
