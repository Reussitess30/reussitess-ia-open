#!/usr/bin/env python3
import logging
from telegram import Bot
from datetime import datetime

# Configuration
TOKEN = "<TON_TELEGRAM_BOT_TOKEN>"  # Remplace par le token réel
CHAT_ID = "<TON_CHAT_ID>"           # Remplace par ton ID Telegram
QUESTIONS = [
    "Qualité de l'eau pour baignade en Guadeloupe aujourd'hui",
    "Coupures EDF prévues cette semaine en Martinique",
    "Horaires GTI et taxis collectifs à Pointe-à-Pitre",
    "Prix Bitcoin, Ethereum et REUSS Token temps réel",
    "Festivals de cinéma caribéen et films phares",
    "Musique caribéenne populaire du moment",
    "Actualités DOM-TOM",
    "PIB et chômage DOM-TOM",
    "Séismes Antilles et cyclones Atlantique",
    "Applications disponibles sur Reussitess.fr",
    "Top CV et business PDF disponibles",
]

logging.basicConfig(
    filename='audit_bot_reel.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

bot = Bot(token=TOKEN)

def send_question(question):
    try:
        logging.info(f"Envoi de la question: {question}")
        message = bot.send_message(chat_id=CHAT_ID, text=question)
        logging.info(f"Question envoyée: {question}")
        return True
    except Exception as e:
        logging.error(f"Erreur lors de l'envoi de la question: {e}")
        return False

def main():
    logging.info("=== Démarrage de l'audit REUSSITESS BOT ===")
    report = []
    for q in QUESTIONS:
        success = send_question(q)
        report.append((q, "Envoyée" if success else "Erreur"))
    logging.info("=== Audit terminé ===")
    for q, status in report:
        print(f"{q} : {status}")

if __name__ == "__main__":
    main()
