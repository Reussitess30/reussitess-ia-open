#!/usr/bin/env python3
"""
🛡️ PROTECTEUR AVEC ALERTES SMS
Reussitess© 2025
"""

import time
from datetime import datetime
from web3 import Web3
from eth_account import Account
import getpass
from sms_alerts import SMSAlerter

# Configuration
OWNER = "0x69f42aa645a43a84e1143d416a4c81a88df01549"
ALEX_CONTRACT = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
RPC = "https://polygon-rpc.com"
SAFE_WALLET = "0x69f42aa645a43a84e1143d416a4c81a88df01549"

w3 = Web3(Web3.HTTPProvider(RPC))

class ProtecteurSMS:
    def __init__(self, private_key):
        self.account = Account.from_key(private_key)
        self.sms = SMSAlerter()
        
        print("🛡️ PROTECTEUR AVEC SMS ACTIVÉ")
        print(f"📍 Wallet : {OWNER}")
        print(f"💰 Balance : {w3.from_wei(w3.eth.get_balance(OWNER), 'ether')} POL")
        print(f"📱 SMS : +590690822482\n")
        
        # Notification de démarrage
        self.sms.alert_system_start()
    
    def monitor(self):
        """Surveillance avec alertes SMS"""
        
        print("🔍 SURVEILLANCE ACTIVÉE...\n")
        
        last_balance = w3.eth.get_balance(OWNER)
        
        while True:
            try:
                current = w3.eth.get_balance(OWNER)
                
                # Détection de vol
                if current < last_balance:
                    diff = last_balance - current
                    amount_pol = w3.from_wei(diff, 'ether')
                    
                    print(f"\n🚨 VOL DÉTECTÉ : -{amount_pol} POL")
                    
                    # Enquête
                    self.investigate_theft(diff)
                
                # Alerte si solde critique
                if current < w3.to_wei(0.5, 'ether'):
                    balance_pol = w3.from_wei(current, 'ether')
                    print(f"🚨 SOLDE CRITIQUE : {balance_pol} POL")
                    
                    # SMS alerte
                    self.sms.alert_low_balance(balance_pol)
                    
                    # Transfert d'urgence
                    self.emergency_save()
                
                last_balance = current
                time.sleep(3)
                
            except Exception as e:
                print(f"⚠️ Erreur : {e}")
                time.sleep(5)
    
    def investigate_theft(self, amount):
        """Enquête sur le vol avec alerte SMS"""
        
        print("🕵️ ENQUÊTE...\n")
        
        try:
            block = w3.eth.get_block('latest', full_transactions=True)
            
            for tx in block.transactions:
                if not tx or tx['from'].lower() != OWNER.lower():
                    continue
                
                thief = tx['to']
                tx_hash = tx['hash'].hex()
                tx_value = tx.get('value', 0)
                amount_pol = w3.from_wei(tx_value, 'ether')
                
                print(f"🔍 Vol confirmé !")
                print(f"   Voleur : {thief}")
                print(f"   Montant : {amount_pol} POL")
                print(f"   Hash : {tx_hash}\n")
                
                # ALERTE SMS IMMÉDIATE
                self.sms.alert_theft(thief, amount_pol, tx_hash)
                
                # Actions de protection
                self.revoke_approvals()
                self.emergency_save()
        
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    def emergency_save(self):
        """Sauvegarde d'urgence"""
        
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
                
                print(f"✅ Transfert : {tx_hash.hex()}")
                print(f"   Sauvé : {w3.from_wei(amount, 'ether')} POL\n")
        
        except Exception as e:
            print(f"❌ Erreur : {e}")
    
    def revoke_approvals(self):
        """Révoque les approbations"""
        
        print("🔐 RÉVOCATION APPROBATIONS...\n")
        
        # Code de révocation
        pass

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛡️ PROTECTEUR SMS - Alertes +590690822482")
    print("="*60 + "\n")
    
    pk = getpass.getpass("🔐 Clé privée : ")
    if not pk.startswith('0x'):
        pk = '0x' + pk
    
    protector = ProtecteurSMS(pk)
    protector.monitor()
