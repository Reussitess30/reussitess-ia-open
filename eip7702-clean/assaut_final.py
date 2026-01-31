from web3 import Web3
import sys

# 🌍 CONFIGURATION REUSSITESS©
RPC = "https://polygon-rpc.com"
w3 = Web3(Web3.HTTPProvider(RPC))

OWNER = w3.to_checksum_address("0x69f42aa645a43a84e1143d416a4c81a88df01549")
RESERVE = w3.to_checksum_address("0xbe8777aB450937bf107090F4F5F7c4834Db079cF")
CONTRACT = w3.to_checksum_address("0xB37531727fC07c6EED4f97F852A115B428046EB2")

# Signature V, R, S avec formatage STRICT bytes32
V = 28
R_HEX = "0xb31ed43998f02e8403105fd48e3d7b9aa5e7c019675e768b173e80e28321291d"
S_HEX = "0x491d2ec665bc2dd2435f1f1a08240df31c4125938273a012e5aea3303b29c6ee"

VALUE = 1000000000 * 10**18
DEADLINE = 2000000000

ABI = [
    {"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"value","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
]

reuss = w3.eth.contract(address=CONTRACT, abi=ABI)

print("🏝️ REUSSITESS© - LIBÉRATION (CORRECTION BYTES32)")
pk = input("🔑 Clé privée de la RÉSERVE (0xbe87...) : ").strip()

if not pk.startswith('0x'): pk = '0x' + pk

try:
    acc = w3.eth.account.from_key(pk)
    print(f"✅ Exécuteur prêt : {acc.address}")
except:
    print("❌ Erreur de clé."); sys.exit()

def execute():
    nonce = w3.eth.get_transaction_count(RESERVE)
    gp = w3.eth.gas_price
    
    # Conversion explicite en bytes32 pour éviter l'erreur Argument 6/7
    r_bytes = w3.to_bytes(hexstr=R_HEX)
    s_bytes = w3.to_bytes(hexstr=S_HEX)
    
    print("🚀 Envoi du tunnel d'extraction...")
    
    # Construction du Permit
    tx1 = reuss.functions.permit(OWNER, RESERVE, VALUE, DEADLINE, V, r_bytes, s_bytes).build_transaction({
        'from': RESERVE, 'nonce': nonce, 'gas': 200000, 'gasPrice': int(gp * 1.5), 'chainId': 137
    })
    
    # Construction du TransferFrom
    tx2 = reuss.functions.transferFrom(OWNER, RESERVE, VALUE).build_transaction({
        'from': RESERVE, 'nonce': nonce + 1, 'gas': 200000, 'gasPrice': int(gp * 2), 'chainId': 137
    })

    s1 = w3.eth.account.sign_transaction(tx1, pk)
    s2 = w3.eth.account.sign_transaction(tx2, pk)
    
    w3.eth.send_raw_transaction(s1.raw_transaction)
    h2 = w3.eth.send_raw_transaction(s2.raw_transaction)
    
    print(f"✅ BOUDOUM ! Le milliard est en sécurité sur la Réserve.")
    print(f"🔗 Hash : {h2.hex()}")

execute()
