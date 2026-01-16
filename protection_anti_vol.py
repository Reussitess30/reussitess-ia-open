#!/usr/bin/env python3
"""
🛡️ PROTECTION ANTI-VOL + RÉCUPÉRATION AUTOMATIQUE
Reussitess© 2025
"""

import time
import json
from datetime import datetime
from web3 import Web3
from eth_account import Account
import getpass

# Configuration
OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
ALEX_CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
RPC = "https://polygon-rpc.com"
SAFE_WALLET = "0x69f42aa645a43a84e1143d416a4c81a88df01549"  # CHANGEZ-MOI !

# Connexion
w3 = Web3(Web3.HTTPProvider(RPC))

class ProtectionShield:
    def __init__(self, private_key):
        self.account = Account.from_key(private_key)
        self.blocked = set()
        
        print("🛡️ BOUCLIER ACTIVÉ")
        print(f"📍 Adresse : {self.account.address}")
        print(f"💰 Balance : {w3.from_wei(w3.eth.get_balance(OWNER), 'ether')} POL\n")
    
    def monitor(self):
        """Surveillance continue du solde"""
        print("🔍 SURVEILLANCE ACTIVÉE...\n")
        
        last_balance = w3.eth.get_balance(OWNER)
        
        while True:
            try:
                current = w3.eth.get_balance(OWNER)
                
                # Détection de vol
                if current < last_balance:
                    diff = last_balance - current
                    print(f"\n🚨 BAISSE DÉTECTÉE : -{w3.from_wei(diff, 'ether')} POL")
                    self.investigate_theft(diff)
                
                # Alerte si solde critique
                if current < w3.to_wei(0.5, 'ether'):
                    print(f"🚨 SOLDE CRITIQUE : {w3.from_wei(current, 'ether')} POL")
                    self.emergency_save()
                
                last_balance = current
                time.sleep(3)
                
            except Exception as e:
                print(f"⚠️ Erreur : {e}")
                time.sleep(5)
    
    def investigate_theft(self, amount):
        """Enquête sur le vol"""
        print("🕵️ ENQUÊTE EN COURS...\n")
        
        block = w3.eth.get_block('latest', full_transactions=True)
        
        for tx in block.transactions:
            if tx['from'].lower() == OWNER.lower():
                thief = tx['to']
                print(f"🔍 Vol confirmé !")
                print(f"   Voleur : {thief}")
                print(f"   Montant : {w3.from_wei(tx.get('value', 0), 'ether')} POL")
                print(f"   Hash : {tx['hash'].hex()}\n")
                
                # Actions
                self.blocked.add(thief.lower())
                self.save_report(thief, tx)
                self.revoke_approvals()
                self.emergency_save()
    
    def emergency_save(self):
        """Sauvegarde d'urgence vers cold wallet"""
        print("🚨 TRANSFERT D'URGENCE...\n")
        
        try:
            balance = w3.eth.get_balance(OWNER)
            gas_price = w3.eth.gas_price
            gas_cost = gas_price * 21000
            amount = balance - gas_cost
            
            if amount > 0:
                tx = {
                    'nonce': w3.eth.get_transaction_count(OWNER),
                    'to': SAFE_WALLET,
                    'value': amount,
                    'gas': 21000,
                    'gasPrice': gas_price,
                    'chainId': 137
                }
                
                signed = self.account.sign_transaction(tx)
                tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
                
                print(f"✅ Transfert envoyé : {tx_hash.hex()}")
                print(f"   Montant sauvé : {w3.from_wei(amount, 'ether')} POL\n")
                
                receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
                if receipt['status'] == 1:
                    print("✅ FONDS SAUVEGARDÉS !\n")
                    
        except Exception as e:
            print(f"❌ Erreur : {e}\n")
    
    def revoke_approvals(self):
        """Révoque les approbations"""
        print("🔐 RÉVOCATION DES APPROBATIONS...\n")
        
        approve_abi = [{
            "constant": False,
            "inputs": [
                {"name": "spender", "type": "address"},
                {"name": "value", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function"
        }]
        
        contract = w3.eth.contract(address=ALEX_CONTRACT, abi=approve_abi)
        
        spenders = [
            "0x1111111254EEB25477B68fb85Ed929f73A960582",
            "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        ]
        
        for spender in spenders:
            try:
                tx = contract.functions.approve(spender, 0).build_transaction({
                    'from': OWNER,
                    'nonce': w3.eth.get_transaction_count(OWNER),
                    'gas': 100000,
                    'gasPrice': w3.eth.gas_price,
                    'chainId': 137
                })
                
                signed = self.account.sign_transaction(tx)
                tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
                print(f"✅ Révoqué : {spender[:10]}...")
                
            except Exception as e:
                print(f"⚠️ Erreur : {e}")
        print()
    
    def save_report(self, thief, tx):
        """Sauvegarde le rapport de vol"""
        report = {
            "timestamp": datetime.now().isoformat(),
            "victim": OWNER,
            "thief": thief,
            "tx_hash": tx['hash'].hex(),
            "amount": str(tx.get('value', 0)),
            "polygonscan": f"https://polygonscan.com/tx/{tx['hash'].hex()}"
        }
        
        filename = f"vol_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Rapport : {filename}\n")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛡️ SYSTÈME DE PROTECTION REUSSITESS©")
    print("="*60 + "\n")
    
    pk = getpass.getpass("🔐 Clé privée : ")
    if not pk.startswith('0x'):
        pk = '0x' + pk
    
    shield = ProtectionShield(pk)
    shield.monitor()
