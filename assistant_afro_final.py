import json
import os
import time

# --- Fichiers et clés ---
CACHE_FILE = "cache.json"
AFRO_V2_FILE = "afrocaraibe_train_v2.json"
GROQ_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]

# --- Charger le cache existant ---
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
else:
    cache = {}

# --- Charger la base Afrocaraibeen V2 ---
if os.path.exists(AFRO_V2_FILE):
    with open(AFRO_V2_FILE, "r") as f:
        afro_v2 = json.load(f)
else:
    afro_v2 = {}

# --- Fusion automatique dans le cache ---
def recursive_merge(target, source):
    for key, value in source.items():
        if key not in target:
            target[key] = value
        elif isinstance(value, dict) and isinstance(target[key], dict):
            recursive_merge(target[key], value)

recursive_merge(cache, afro_v2.get("afrocaraibe", {}))

# --- Fonction principale pour interroger GROQ ---
def query_groq(prompt):
    if prompt in cache:
        return cache[prompt]

    # Simulation de l'appel GROQ avec la première clé disponible
    fastest_key = GROQ_KEYS[0]
    
# 1. IA contextuelle
response = reponse_contextuelle(message_normalise)

# 2. fallback sur triggers existants
if not response:
    response = trouver_reponse(message_normalise, data)


    # Mettre à jour le cache
    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    return response

# --- Fonction de test automatique ---
def test_afro_v2():
    print("🎯 Test AfroCaribeen V2 Fusion:")
    for k in afro_v2.get("afrocaraibe", {}).keys():
        print(f"- {k}: {query_groq(k)}")

    # Exemple d'un nouveau prompt
    prompt = "Musique Afro-Caribéenne"
    print(f"\nPrompt test: {prompt}\nRéponse: {query_groq(prompt)}")

if __name__ == "__main__":
    test_afro_v2()


# ===============================
# 🔥 MOTEUR INTELLIGENT REUSSITESS
# ===============================




def trouver_reponse(message_normalise, data):
    import unidecode

    from difflib import get_close_matches

    # Normalisation du message : minuscules, accents retirés

    message_normalise = unidecode.unidecode(message.lower())

    # Dictionnaire de synonymes/fautes courantes

    synonymes = {

        "éco": "économie dom-tom",

        "economique": "économie dom-tom",

        "tourism": "tourisme guadeloupe",

        "tourisme martinique": "tourisme martinique",

        "cours": "académie",

        "musique live": "radio"

    }

    # Correction par synonymes

    message_normalise = synonymes.get(message_normalise, message_normalise)

    # Recherche du trigger le plus proche (tolérance aux fautes)

    triggers = [c["trigger"] for c in data["commands"] if "trigger" in c]

    meilleur_trigger = get_close_matches(message_normalise, triggers, n=1, cutoff=0.6)

    if meilleur_trigger:

        message_normalise = meilleur_trigger[0]

    # Dictionnaire de synonymes et fautes courantes

    synonymes = {

        "éco": "économie dom-tom",

        "economique": "économie dom-tom",

        "tourism": "tourisme guadeloupe",

        "tourisme martinique": "tourisme martinique",

        "cours": "académie",

        "musique live": "radio"

    }

    message_normalise = synonymes.get(message_normalise.lower(), message_normalise.lower())

    # Dictionnaire de synonymes et fautes courantes

    synonymes = {

        "éco": "économie dom-tom",

        "economique": "économie dom-tom",

        "tourism": "tourisme guadeloupe",

        "tourisme martinique": "tourisme martinique",

        "cours": "académie",

        "musique live": "radio"

    }

    message_normalise = synonymes.get(message_normalise.lower(), message_normalise.lower())

    message_normalise = message_normalise.lower()
    triggers_found = []
    responses = []

    for cmd in data.get("commands", []):
        trigger = cmd.get("trigger", "").lower()
        if trigger in message_normalise or any(word in message_normalise for word in trigger.split()):
            triggers_found.append(trigger)
            responses.append(cmd.get("response"))

    # Ajout de réponses automatiques multi-intentions
    if "tourisme" in message_normalise and "tourisme" not in triggers_found:
        responses.append("🌴 Infos tourisme : https://reussitess.fr/tourisme-martinique
Boudoum ! 🇬🇵")
    if "économie" in message_normalise and "économie" not in triggers_found:
        responses.append("📊 Infos économiques : https://reussitess.fr/observatoire-antilles
Boudoum ! 🇬🇵")
    if "musique" in message_normalise and "musique" not in triggers_found:
        responses.append("🎵 Découvre la musique caribéenne : https://reussitess.fr/radio
Boudoum ! 🇬🇵")

    if responses:
        # Fusionner toutes les réponses si plusieurs triggers
        return "

".join(responses)

    # Suggestions si rien ne correspond
    suggestions = [cmd["trigger"] for cmd in data.get("commands", []) if cmd["trigger"].lower()[:3] in message_normalise[:3]]
    suggestion_text = "
".join(suggestions[:5]) if suggestions else "aucune suggestion"
    return f"🤖 Je n'ai pas trouvé cette info. Essaie avec un mot clé simple.
Suggestions : {suggestion_text}
Boudoum ! 🇬🇵"

