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

    best_match = None
    best_score = 0

    for cmd in data.get("commands", []):
        trigger = cmd.get("trigger", "").lower()

        score = sum(1 for word in trigger.split() if word in message)

        if trigger in message:
            score += 5

        if score > best_score:
            best_score = score
            best_match = cmd

    if best_match and best_score >= 1:
        return best_match["response"]

    if "tourisme" in message:
        return "🌴 Infos tourisme : https://reussitess.fr/tourisme-martinique
Boudoum ! 🇬🇵"

    if "économie" in message:
        return "📊 Infos économiques : https://reussitess.fr/observatoire-antilles
Boudoum ! 🇬🇵"

    if "musique" in message:
        return "🎵 Découvre la musique caribéenne : https://reussitess.fr/radio
Boudoum ! 🇬🇵"

    return "🤖 Je n'ai pas encore cette info, essaye avec un mot clé simple.
Boudoum ! 🇬🇵"

