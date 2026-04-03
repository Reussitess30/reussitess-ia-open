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
response = reponse_contextuelle(message)

# 2. fallback sur triggers existants
if not response:
    response = trouver_reponse(message, data)


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




def trouver_reponse(message, data):
    message = message.lower()
    triggers_found = []
    responses = []

    for cmd in data.get("commands", []):
        trigger = cmd.get("trigger", "").lower()
        if trigger in message or any(word in message for word in trigger.split()):
            triggers_found.append(trigger)
            responses.append(cmd.get("response"))

    # Ajout de réponses automatiques multi-intentions
    if "tourisme" in message and "tourisme" not in triggers_found:
        responses.append("🌴 Infos tourisme : https://reussitess.fr/tourisme-martinique
Boudoum ! 🇬🇵")
    if "économie" in message and "économie" not in triggers_found:
        responses.append("📊 Infos économiques : https://reussitess.fr/observatoire-antilles
Boudoum ! 🇬🇵")
    if "musique" in message and "musique" not in triggers_found:
        responses.append("🎵 Découvre la musique caribéenne : https://reussitess.fr/radio
Boudoum ! 🇬🇵")

    if responses:
        # Fusionner toutes les réponses si plusieurs triggers
        return "

".join(responses)

    # Suggestions si rien ne correspond
    suggestions = [cmd["trigger"] for cmd in data.get("commands", []) if cmd["trigger"].lower()[:3] in message[:3]]
    suggestion_text = "
".join(suggestions[:5]) if suggestions else "aucune suggestion"
    return f"🤖 Je n'ai pas trouvé cette info. Essaie avec un mot clé simple.
Suggestions : {suggestion_text}
Boudoum ! 🇬🇵"

