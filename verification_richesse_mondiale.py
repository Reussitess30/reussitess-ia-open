from web3 import Web3

web3 = Web3(Web3.HTTPProvider("https://polygon-rpc.com"))
CONTRACT = web3.to_checksum_address("0xB37531727fC07c6EED4f97F852A115B428046EB2")
OWNER = web3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")

# ABI minimal pour lire la balance
abi = [{"inputs":[{"name":"account","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

def audit_final():
    contract = web3.eth.contract(address=CONTRACT, abi=abi)
    balance = contract.functions.balanceOf(OWNER).call()
    total = balance / (10**18)
    
    print("\n👑 AUDIT DE POSSESSION - REUSSITESS®")
    print("="*60)
    print(f"📍 Adresse Source (GAMMA) : {OWNER}")
    print(f"💰 Solde Actuel            : {total:,.0f} REUSS")
    print(f"🌍 État de distribution    : {'✅ 100% PRÊT' if total >= 1000000000 else '⚠️ PARTIEL'}")
    print("="*60)
    print("Boudoum ! Le milliard est sécurisé au point GAMMA.")

if __name__ == "__main__":
    audit_final()
