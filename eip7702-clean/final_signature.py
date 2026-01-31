from eth_account import Account
import json

# Configuration de l'Empire
OWNER_ADDRESS = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
SPENDER_RESERVE = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF"
CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
VALUE = 1000000000 * 10**18 # 1 Milliard
NONCE = 0
DEADLINE = 2000000000 # 2033

print("🏝️ REUSSITESS© - GÉNÉRATEUR DE SIGNATURE DE LIBÉRATION")
priv_key = input("🔑 Entre la clé privée de l'adresse 0x69f4... : ")

permit_data = {
    "types": {
        "EIP712Domain": [
            {"name": "name", "type": "string"},
            {"name": "version", "type": "string"},
            {"name": "chainId", "type": "uint256"},
            {"name": "verifyingContract", "type": "address"},
        ],
        "Permit": [
            {"name": "owner", "type": "address"},
            {"name": "spender", "type": "address"},
            {"name": "value", "type": "uint256"},
            {"name": "nonce", "type": "uint256"},
            {"name": "deadline", "type": "uint256"},
        ],
    },
    "primaryType": "Permit",
    "domain": {
        "name": "REUSSITESS Token",
        "version": "1",
        "chainId": 137,
        "verifyingContract": CONTRACT,
    },
    "message": {
        "owner": OWNER_ADDRESS,
        "spender": SPENDER_RESERVE,
        "value": VALUE,
        "nonce": NONCE,
        "deadline": DEADLINE,
    },
}

# Signature du message
signed = Account.sign_typed_data(priv_key, full_message=permit_data)

print("\n📦 COMPOSANTS DE LA SIGNATURE (À CONSERVER) :")
print(f"V : {signed.v}")
print(f"R : {hex(signed.r)}")
print(f"S : {hex(signed.s)}")
print(f"Hash : {signed.signature.hex()}")
print("\n✅ Signature générée. Le bot est aveugle, il ne voit rien passer.")
