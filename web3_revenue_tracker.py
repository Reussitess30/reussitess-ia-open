from web3 import Web3

# Connexion Noyau
web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
POOL_ADDR = "0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c"
TOKEN_ADDR = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

# ABI pour interroger les réserves du pool
abi_pool = [
    {"constant":True,"inputs":[],"name":"getReserves","outputs":[{"name":"_reserve0","type":"uint112"},{"name":"_reserve1","type":"uint112"},{"name":"_blockTimestampLast","type":"uint32"}],"type":"function"}
]

def check_yield():
    pool = web3.eth.contract(address=web3.to_checksum_address(POOL_ADDR), abi=abi_pool)
    reserves = pool.functions.getReserves().call()
    
    print("📈 ANALYSE DE RENDEMENT REUSSITESS®")
    print("="*50)
    print(f"💧 Réserve REUSS: {reserves[0] / 10**18:,.2f}")
    print(f"💰 Réserve MATIC: {reserves[1] / 10**18:,.2f}")
    print("\n💡 NOTE: Chaque swap génère 0.3% de revenus.")
    print("Ces revenus augmentent la valeur de tes LP Tokens.")
    print("="*50)
    print("Guadeloupe: Noyau de la Finance Positive. Boudoum!")

if __name__ == "__main__":
    check_yield()
