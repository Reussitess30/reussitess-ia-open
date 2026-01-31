import eth_account
from eth_account.messages import encode_typed_data

# L'Empire Reussitess©
owner = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
receiver = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF" # Réserve de Sécurisation
verifying_contract = "0xB37531727fC07c6EED4f97F852A115B428046EB2"

print("🎯 PRÉPARATION DE LA SIGNATURE D'EXTRACTION (GAZ=0)")

# Construction du message EIP-712 pour le PERMIT
# Cela va dire au contrat : "Donne tout le pouvoir à la Réserve"
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
        "verifyingContract": verifying_contract,
    },
    "message": {
        "owner": owner,
        "spender": receiver,
        "value": 10**27, # Ton milliard
        "nonce": 0,      # À vérifier avec ton dernier scan
        "deadline": 9999999999,
    },
}

print("✅ Signature prête à être générée pour libérer l'Empire.")
