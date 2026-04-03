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
    response = f"GROQ réponse pour '{prompt}' avec {fastest_key}"

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
