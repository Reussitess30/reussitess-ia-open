import json
import time
import os

CACHE_FILE = "cache.json"
AFRO_V2_FILE = "afrocaraibe_train_v2.json"
GROQ_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]

# --- Charger le cache existant ---
if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
else:
    cache = {}

# --- Charger la nouvelle base Afrocaraibeen V2 ---
if os.path.exists(AFRO_V2_FILE):
    with open(AFRO_V2_FILE, "r") as f:
        afro_v2 = json.load(f)
else:
    afro_v2 = {}

# --- Fusion automatique dans le cache ---
# On ne supprime rien dans le cache existant
for key, value in afro_v2.get("afrocaraibe", {}).items():
    if key not in cache:
        cache[key] = value
    elif isinstance(value, dict):
        # Fusion récursive pour les sous-dictionnaires
        for subkey, subval in value.items():
            if subkey not in cache[key]:
                cache[key][subkey] = subval

# --- Fonction principale pour interroger GROQ ---
def query_groq(prompt):
    # Retour du cache si déjà présent
    if prompt in cache:
        return cache[prompt]

    # Simulation d'appel GROQ avec la clé la plus rapide
    fastest_key = GROQ_KEYS[0]  # Ici on peut ajouter un vrai test de latence
    response = f"GROQ réponse pour {prompt} avec {fastest_key}"

    # Mettre à jour le cache
    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    return response

# --- Test du script ---
if __name__ == "__main__":
    print("🎯 Test cache AfroCaribeen V2 :")
    for k in afro_v2.get("afrocaraibe", {}).keys():
        print(f"- {k}: {query_groq(k)}")

    # Exemple d'un prompt nouveau
    prompt = "Musique Afro-Caribéenne"
    print(f"\nPrompt test: {prompt}\nRéponse: {query_groq(prompt)}")
