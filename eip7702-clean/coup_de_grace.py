from web3 import Web3

# Configuration
RPC = "https://polygon-rpc.com"
w3 = Web3(Web3.HTTPProvider(RPC))

# Données de la Signature que tu viens de générer
V = 28
R = 0xb31ed43998f02e8403105fd48e3d7b9aa5e7c019675e768b173e80e28321291d
S = 0x491d2ec665bc2dd2435f1f1a08240df31c4125938273a012e5aea3303b29c6ee

# Paramètres de l'Empire
OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
RESERVE = "0xbe8777aB450937bf107090F4F5F7c4834Db079cF"
CONTRACT_REUSS = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
VALUE = 1000000000 * 10**18
DEADLINE = 2000000000

print("⚔️ EXÉCUTION DU COUP DE GRÂCE - LIBÉRATION DU MILLIARD")

# 1. Appel du PERMIT (Donne le pouvoir à la Réserve)
# 2. Appel du TRANSFERFROM (Aspiration des fonds)
# Cette étape nécessite que l'adresse RESERVE exécute la transaction.

print(f"📡 Prêt à injecter la signature sur le contrat {CONTRACT_REUSS}")
print("🏁 Destination : Réserve de Sécurisation (0xbe87...)")
