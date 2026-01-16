#!/usr/bin/env python3
"""Vérification de la configuration"""

from web3 import Web3

OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
RPC = "https://polygon-rpc.com"

w3 = Web3(Web3.HTTPProvider(RPC))

print("🔍 VÉRIFICATION DE LA CONFIGURATION\n")
print("="*60)

# Vérifier la connexion RPC
if w3.is_connected():
    print("✅ Connexion RPC : OK")
else:
    print("❌ Connexion RPC : ÉCHEC")

# Vérifier le solde
balance = w3.eth.get_balance(OWNER)
print(f"✅ Solde actuel : {w3.from_wei(balance, 'ether')} POL")

# Vérifier le fichier de protection
import os
if os.path.exists('protection_anti_vol.py'):
    print("✅ Script de protection : Présent")
    
    # Lire le cold wallet configuré
    with open('protection_anti_vol.py', 'r') as f:
        content = f.read()
        if 'VOTRE_COLD_WALLET' in content:
            print("⚠️  Cold Wallet : NON CONFIGURÉ")
            print("   → Éditez protection_anti_vol.py ligne 14")
        else:
            print("✅ Cold Wallet : Configuré")
else:
    print("❌ Script de protection : ABSENT")

print("="*60)
print()
print("🎯 SI TOUT EST ✅ VOUS POUVEZ LANCER :")
print("   python3 protection_anti_vol.py")
print()
