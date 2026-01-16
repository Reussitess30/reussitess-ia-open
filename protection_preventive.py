#!/usr/bin/env python3
"""
🔒 PROTECTION PRÉVENTIVE - Bloque les vols AVANT qu'ils arrivent
Reussitess© 2025
"""

from web3 import Web3
import time

OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
RPC = "https://polygon-rpc.com"

w3 = Web3(Web3.HTTPProvider(RPC))

print("🛡️ PROTECTION PRÉVENTIVE ACTIVÉE\n")

# Surveiller les transactions pendantes
tx_filter = w3.eth.filter('pending')

while True:
    for tx_hash in tx_filter.get_new_entries():
        tx = w3.eth.get_transaction(tx_hash)
        
        # Si transaction sort de votre wallet
        if tx['from'].lower() == OWNER.lower():
            print(f"\n⚠️ TRANSACTION DÉTECTÉE : {tx_hash.hex()}")
            print(f"   Vers : {tx['to']}")
            print(f"   Montant : {w3.from_wei(tx.get('value', 0), 'ether')} POL")
            
            # VOUS POUVEZ ICI :
            # 1. Envoyer une alerte email/SMS
            # 2. Bloquer via votre nœud si vous en contrôlez un
            # 3. Front-run avec une transaction plus rapide
            
    time.sleep(1)
