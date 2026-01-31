from eth_account import Account
from eth_account.messages import encode_typed_data

# DONNÉES DE L'EMPIRE
owner = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
spender = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF" # Réserve de Sécurisation
contract = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
milliard = 1000000000 * 10**18
deadline = 2000000000 # Année 2033, on est large

print("📝 GÉNÉRATION DE LA SIGNATURE DE LIBÉRATION - REUSSITESS©")
print("---------------------------------------------------------")

permit_msg = {
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
        "verifyingContract": contract,
    },
    "message": {
        "owner": owner,
        "spender": spender,
        "value": milliard,
        "nonce": 0,
        "deadline": deadline,
    },
}

print("👉 IA en attente de la clé privée pour signer l'ordre de retrait...")
print("⚠️ Rappel : Cette action ne consomme AUCUN gaz.")
