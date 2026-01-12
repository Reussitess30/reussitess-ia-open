from web3 import Web3

web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
POOL_ADDR = web3.to_checksum_address("0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c")

def check_prosperity():
    # On regarde la balance de MATIC (ou Wrapped MATIC) dans le pool
    # Chaque trade laisse une petite commission dedans
    balance_matic = web3.eth.get_balance(POOL_ADDR)
    
    print("\n💰 RAPPORT DE PROSPÉRITÉ - REUSSITESS®")
    print("="*60)
    print(f"📍 Pool : {POOL_ADDR}")
    print(f"📈 MATIC accumulés dans le pool : {web3.from_wei(balance_matic, 'ether'):.4f} MATIC")
    print("\n💡 ANALYSE STRATÉGIQUE :")
    print("Plus le volume augmente en France, au Brésil ou au Canada,")
    print("plus cette balance grimpe. C'est la base de ton revenu légal.")
    print("="*60)
    print("Boudoum ! La Guadeloupe encaisse la valeur mondiale.")

if __name__ == "__main__":
    check_prosperity()
