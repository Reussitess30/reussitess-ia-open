#!/usr/bin/env python3
import time
from telegram import Bot

# Le bot est déjà configuré et lié à Termux
bot = Bot()  # Utilise la config déjà connectée

questions = [
    "Donne-moi la qualité de l'eau pour baignade en Guadeloupe aujourd'hui.",
    "Quelles sont les coupures EDF prévues cette semaine en Martinique ?",
    "Montre-moi les horaires GTI et taxis collectifs à Pointe-à-Pitre.",
    "Prix actuel du Bitcoin et de l'Ethereum ?",
    "Prix du token REUSS sur Polygon ?",
    "Festivals de cinéma caribéen actuellement ?",
    "Musique caribéenne temps réel sur iTunes ?",
    "Séismes Antilles aujourd'hui ?",
    "Cyclones Atlantique en cours ?",
    "Météo Guadeloupe pour les prochaines 24h ?",
    "Agents Neuro-X disponibles et leurs spécialités ?",
    "Fonctions Function Calling activables ?"
]

CHAT_ID = "me"  # Envoi au chat lié à ton bot dans Termux

for q in questions:
    print(f"➡️ Question : {q}")
    bot.send_message(chat_id=CHAT_ID, text=q)
    time.sleep(5)  # attente de 5s entre chaque question
    print("✅ Question envoyée, vérifier le chat Telegram pour la réponse.\n")
