from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))

METAMASK = w3.to_checksum_address("0x5a47fd1d8767ff9ec1191783fb7531e09863e85a")
OWNER_ADDR = w3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")
CONTRAT_REUSS = w3.to_checksum_address("0x4b3bff4b58d22ad363bb260e22032414d4cfddb8")

print(f"\n🏝️ REUSSITESS© - DERNIÈRE POUSSÉE")
pk_owner = input(f"🔑 Clé privée de l'Owner (0x69f4...) : ")

try:
    # On ajuste le gaz pour que ça rentre dans les 0.18 POL disponibles
    gas_limit = 100000 
    gas_price = w3.eth.gas_price
    
    # On vérifie si ton solde permet de payer ce prix
    total_cost = gas_limit * gas_price
    balance = w3.eth.get_balance(OWNER_ADDR)
    
    print(f"💰 Ton solde : {w3.from_wei(balance, 'ether')} POL")
    print(f"⛽ Coût estimé : {w3.from_wei(total_cost, 'ether')} POL")

    abi = [{"constant": False, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "type": "function"}]
    contract = w3.eth.contract(address=CONTRAT_REUSS, abi=abi)
    
    amount = 978999999 * 10**18
    
    tx = contract.functions.transfer(METAMASK, int(amount)).build_transaction({
        'chainId': 137,
        'gas': gas_limit,
        'gasPrice': gas_price,
        'nonce': w3.eth.get_transaction_count(OWNER_ADDR),
    })
    
    signed = w3.eth.account.sign_transaction(tx, pk_owner)
    hash_tx = w3.eth.send_raw_transaction(signed.raw_transaction)
    
    print(f"\n✅ RÉUSSI ! Le milliard arrive sur ton MetaMask !")
    print(f"🔗 Hash : {hash_tx.hex()}")
    print(f"🏝️ Reussitess© : Guadeloupe - Terres De Champions ! Boudoum !")

except Exception as e:
    print(f"\n❌ Erreur : {e}")
