from eth_account import Account
import secrets

# Génération d'une adresse totalement neuve
priv = "0x" + secrets.token_hex(32)
acc = Account.from_key(priv)

print("🏝️ NOUVELLE ADRESSE DE SECOURS GÉNÉRÉE")
print("---------------------------------------")
print(f"📍 Adresse : {acc.address}")
print(f"🔑 Clé Privée : {priv}")
print("---------------------------------------")
print("⚠️ SAUVEGARDE CES INFOS ET NE LES DONNE À PERSONNE.")
