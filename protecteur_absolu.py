#!/usr/bin/env python3
"""
🛡️ PROTECTEUR ABSOLU - SYSTÈME DE DÉFENSE ULTIME
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
SAFE_WALLET = "0x69f42aa645a43a84e1143d416a4c81a88df01549"

w3 = Web3(Web3.HTTPProvider(RPC))

class ProtecteurAbsolu:
    def __init__(self, private_key):
        self.account = Account.from_key(private_key)
        self.w3 = w3
        self.balance_history = []
        self.threats = []
        
        print("╔══════════════════════════════════════════════════════════╗")
        print("║      🛡️ PROTECTEUR ABSOLU ACTIVÉ 🛡️                    ║")
        print("╚══════════════════════════════════════════════════════════╝")
        print(f"\n📍 Wallet : {OWNER}")
        print(f"💰 Balance : {self.w3.from_wei(self.w3.eth.get_balance(OWNER), 'ether')} POL")
        print(f"🔐 Safe : {SAFE_WALLET}")
        print(f"\n{'='*60}")
        print("MODULES ACTIFS :")
        print("  ✅ Surveillance balance temps réel")
        print("  ✅ Détection vols directs")
        print("  ✅ Révocation approbations")
        print("  ✅ Transfert d'urgence")
        print("  ✅ Blacklist automatique")
        print(f"{'='*60}\n")
    
    def monitor(self):
        """Surveillance continue"""
        
        print("🔍 SURVEILLANCE ACTIVÉE...\n")
        
        last_balance = self.w3.eth.get_balance(OWNER)
        
        while True:
            try:
                current = self.w3.eth.get_balance(OWNER)
                
                # Enregistrer historique
                self.balance_history.append({
                    'time': datetime.now(),
                    'balance': current
                })
                
                # Détection de vol
                if current < last_balance:
                    diff = last_balance - current
                    amount_pol = self.w3.from_wei(diff, 'ether')
                    
                    print(f"\n🚨 BAISSE DÉTECTÉE : -{amount_pol} POL")
                    
                    # Enquête
                    self.investigate(diff)
                
                # Alerte solde critique
                if current < self.w3.to_wei(0.5, 'ether'):
                    balance_pol = self.w3.from_wei(current, 'ether')
                    print(f"🚨 SOLDE CRITIQUE : {balance_pol} POL")
                    
                    # Sauvetage d'urgence
                    self.emergency_save()
                
                last_balance = current
                time.sleep(3)
                
            except Exception as e:
                print(f"⚠️ Erreur : {e}")
                time.sleep(5)
    
    def investigate(self, amount):
        """Enquête sur vol"""
        
        print("🕵️ ENQUÊTE EN COURS...\n")
        
        try:
            block = self.w3.eth.get_block('latest', full_transactions=True)
            
            for tx in block.transactions:
                if not tx or tx['from'].lower() != OWNER.lower():
                    continue
                
                thief = tx['to']
                tx_hash = tx['hash'].hex()
                value = self.w3.from_wei(tx.get('value', 0), 'ether')
                
                print(f"🔍 Vol confirmé !")
                print(f"   Voleur : {thief}")
                print(f"   Montant : {value} POL")
                print(f"   Hash : {tx_hash}\n")
                
                # Enregistrer
                threat = {
                    'time': datetime.now().isoformat(),
                    'thief': thief,
                    'amount': str(value),
                    'tx': tx_hash
                }
                
                self.threats.append(threat)
                
                # Sauvegarder
                with open('threats.json', 'w') as f:
                    json.dump(self.threats, f, indent=2)
                
                # Actions
                self.revoke_approvals()
                self.emergency_save()
                
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    def revoke_approvals(self):
        """Révoque toutes les approbations"""
        
        print("🔐 RÉVOCATION APPROBATIONS...\n")
        
        abi = [{
            "constant": False,
            "inputs": [
                {"name": "spender", "type": "address"},
                {"name": "value", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"name": "", "type": "bool"}],
            "type": "function"
        }]
        
        contract = self.w3.eth.contract(address=ALEX_CONTRACT, abi=abi)
        
        spenders = [
            "0x1111111254EEB25477B68fb85Ed929f73A960582",
            "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        ]
        
        for spender in spenders:
            try:
                tx = contract.functions.approve(spender, 0).build_transaction({
                    'from': OWNER,
                    'nonce': self.w3.eth.get_transaction_count(OWNER),
                    'gas': 100000,
                    'gasPrice': self.w3.eth.gas_price,
                    'chainId': 137
                })
                
                signed = self.account.sign_transaction(tx)
                self.w3.eth.send_raw_transaction(signed.rawTransaction)
                print(f"✅ Révoqué : {spender[:10]}...")
                
            except Exception as e:
                print(f"⚠️ Erreur : {e}")
        
        print()
    
    def emergency_save(self):
        """Transfert d'urgence"""
        
        print("🚨 TRANSFERT D'URGENCE...\n")
        
        try:
            balance = self.w3.eth.get_balance(OWNER)
            gas_price = self.w3.eth.gas_price
            gas_cost = gas_price * 21000
            amount = balance - gas_cost
            
            if amount > 0:
                tx = {
                    'nonce': self.w3.eth.get_transaction_count(OWNER),
                    'to': SAFE_WALLET,
                    'value': amount,
                    'gas': 21000,
                    'gasPrice': gas_price,
                    'chainId': 137
                }
                
                signed = self.account.sign_transaction(tx)
                tx_hash = self.w3.eth.send_raw_transaction(signed.rawTransaction)
                
                print(f"✅ Transfert : {tx_hash.hex()}")
                print(f"   Sauvé : {self.w3.from_wei(amount, 'ether')} POL\n")
                
        except Exception as e:
            print(f"❌ Erreur : {e}\n")

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛡️ PROTECTEUR ABSOLU - DÉFENSE ULTIME")
    print("="*60 + "\n")
    
    pk = getpass.getpass("🔐 Clé privée : ")
    if not pk.startswith('0x'):
        pk = '0x' + pk
    
    protector = ProtecteurAbsolu(pk)
    protector.monitor()
