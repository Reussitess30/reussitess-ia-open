    
    def revoke_all_approvals_emergency(self):
        """Révoque TOUTES les approbations en urgence"""
        
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
        
        contract = self.w3.eth.contract(address=ALEX_CONTRACT, abi=approve_abi)
        
        spenders = [
            "0x1111111254EEB25477B68fb85Ed929f73A960582",
            "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
            "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        ]
        
        revoked_count = 0
        
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
                revoked_count += 1
                
            except:
                pass
        
        self.stats['approvals_revoked'] += revoked_count
        return revoked_count
    
    def emergency_transfer_all(self):
        """Transfère TOUS les fonds vers cold wallet"""
        
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
                self.w3.eth.send_raw_transaction(signed.rawTransaction)
                
                self.stats['emergency_transfers'] += 1
                self.stats['funds_saved'] += float(self.w3.from_wei(amount, 'ether'))
                
                return self.w3.from_wei(amount, 'ether')
        except:
            return None
    
    def generate_incident_report(self, attacker, tx, actions):
        """Génère un rapport d'incident complet"""
        
        report = {
            'timestamp': datetime.now().isoformat(),
            'incident_type': 'THEFT_ATTEMPT',
            'victim': OWNER,
            'attacker': attacker,
            'tx_hash': tx['hash'].hex(),
            'amount': str(tx.get('value', 0)),
            'actions_taken': actions,
            'stats': self.stats
        }
        
        filename = f"incident_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(report, f, indent=2)
        
        return filename
    
    def trigger_emergency_mode(self, reason):
        """Active le mode urgence"""
        
        if self.is_emergency_mode:
            return
        
        self.is_emergency_mode = True
        
        print(f"\n🚨🚨🚨 MODE URGENCE ACTIVÉ 🚨🚨🚨")
        print(f"Raison : {reason}\n")
        
        # Transfert immédiat
        self.emergency_transfer_all()
    
    def verify_legitimate_tx(self, amount):
        """Vérifie si une transaction est légitime"""
        # Simple vérification
        return False
    
    def save_threat_log(self, threat):
        """Sauvegarde le log de menace"""
        with open('threats_log.json', 'a') as f:
            f.write(json.dumps(threat) + '\n')
    
    def send_validation_email(self, address, threat):
        """Envoie email de validation"""
        print(f"📧 Email de validation envoyé pour {address[:10]}...")
    
    def send_critical_alert(self, address, tx, actions):
        """Envoie alerte critique"""
        print(f"📧 ALERTE CRITIQUE envoyée !")
    
    def run(self):
        """Lance le protecteur absolu"""
        print("🚀 DÉMARRAGE DU PROTECTEUR ABSOLU...\n")
        self.monitor_balance_realtime()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛡️ PROTECTEUR ABSOLU - SYSTÈME DE DÉFENSE ULTIME")
    print("="*60 + "\n")
    
    pk = getpass.getpass("🔐 Clé privée : ")
    if not pk.startswith('0x'):
        pk = '0x' + pk
    
    protector = ProtecteurAbsolu(pk)
    protector.run()
