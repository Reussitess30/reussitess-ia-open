#!/usr/bin/env python3
"""
📱 SYSTÈME D'ALERTES SMS
Reussitess© 2025
Envoie des alertes vers +590690822482
"""

from twilio.rest import Client
from datetime import datetime

class SMSAlerter:
    def __init__(self):
        # Configuration Twilio (GRATUIT avec crédit de départ)
        self.account_sid = "VOTRE_TWILIO_SID"  # À configurer
        self.auth_token = "VOTRE_TWILIO_TOKEN"  # À configurer
        self.from_number = "+12345678900"  # Numéro Twilio (gratuit)
        self.to_number = "+590690822482"  # Votre numéro
        
        try:
            self.client = Client(self.account_sid, self.auth_token)
            print(f"📱 SMS configurés vers : {self.to_number}")
        except:
            print("⚠️ Twilio non configuré - Alertes en console uniquement")
            self.client = None
    
    def send_alert(self, title, message, severity="WARNING"):
        """Envoie une alerte par SMS"""
        
        icons = {
            "INFO": "ℹ️",
            "WARNING": "⚠️",
            "CRITICAL": "🚨",
            "SUCCESS": "✅"
        }
        icon = icons.get(severity, "📢")
        
        # SMS court (160 caractères max)
        sms_text = f"{icon} {title}\n{message[:130]}"
        
        # Afficher dans la console
        print(f"\n📱 SMS ENVOYÉ :")
        print(f"   {sms_text}\n")
        
        # Envoyer via Twilio si configuré
        if self.client:
            try:
                self.client.messages.create(
                    body=sms_text,
                    from_=self.from_number,
                    to=self.to_number
                )
                print("✅ SMS envoyé avec succès")
                return True
            except Exception as e:
                print(f"❌ Erreur SMS : {e}")
                return False
        return False
    
    def alert_theft(self, thief_address, amount_pol, tx_hash):
        """Alerte SMS pour vol"""
        
        message = f"VOL DÉTECTÉ !\n{amount_pol} POL volé\nVoleur: {thief_address[:10]}...\nTX: polygonscan.com/tx/{tx_hash[:10]}"
        
        self.send_alert("ALERTE VOL", message, "CRITICAL")
    
    def alert_low_balance(self, balance):
        """Alerte solde bas"""
        
        message = f"Solde bas: {balance} POL\nAction requise !"
        
        self.send_alert("Solde Bas", message, "WARNING")
    
    def alert_suspicious_tx(self, to_address, amount):
        """Alerte transaction suspecte"""
        
        message = f"TX suspecte vers {to_address[:10]}...\nMontant: {amount} POL"
        
        self.send_alert("TX Suspecte", message, "WARNING")
    
    def alert_system_start(self):
        """Notification de démarrage"""
        
        message = f"Protection activée\nWallet 0x69f4...\nSurveillance 24/7"
        
        self.send_alert("Sécurité ON", message, "SUCCESS")

if __name__ == "__main__":
    # Test
    print("\n📱 TEST SYSTÈME SMS\n")
    alerter = SMSAlerter()
    alerter.alert_system_start()
