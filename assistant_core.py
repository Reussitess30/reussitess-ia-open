import json
import time

CACHE_FILE = "cache.json"
GROQ_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]

# Charger le cache existant
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

def query_groq(prompt):
    # Retour du cache si déjà présent
    if prompt in cache:
        return cache[prompt]

    # Simuler appel GROQ avec la clé la plus rapide
    fastest_key = GROQ_KEYS[0]
    response = f"GROQ réponse pour {prompt} avec {fastest_key}"

    # Mettre à jour le cache
    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

    return response

# Test
if __name__ == "__main__":
    print(query_groq("Bonjour assistant !"))
