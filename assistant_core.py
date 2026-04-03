import json
import time
import random

CACHE_FILE = "cache.json"
GROQ_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]
MAX_RETRIES = 3
RETRY_DELAY = 1  # secondes

# Charger le cache une seule fois
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

# Stats clés pour rotation automatique
key_stats = {key: {"success": 0, "fail": 0, "avg_time": 0.0} for key in GROQ_KEYS}

def _call_groq(prompt, key):
    """Remplacer cette fonction par l'appel réel à GROQ."""
    delay = random.uniform(0.2, 1.0)
    time.sleep(delay)
    if random.random() < 0.2:
        raise Exception("Service temporairement indisponible")
    return f"GROQ réponse pour '{prompt}' avec {key}"

def query_groq(prompt):
    """Fonction universelle, durable et finale pour GROQ."""
    if prompt in cache:
        return cache[prompt]

    for attempt in range(1, MAX_RETRIES + 1):
        # Choix automatique de la meilleure clé
        fastest_key = min(
            GROQ_KEYS,
            key=lambda k: key_stats[k]["avg_time"] if key_stats[k]["success"] > 0 else float('inf')
        )
        start = time.time()
        try:
            response = _call_groq(prompt, fastest_key)
            elapsed = time.time() - start
            # Mettre à jour stats
            n = key_stats[fastest_key]["success"]
            key_stats[fastest_key]["success"] += 1
            key_stats[fastest_key]["avg_time"] = (key_stats[fastest_key]["avg_time'] * n + elapsed) / (n + 1)
            # Mettre à jour cache
            cache[prompt] = response
            with open(CACHE_FILE, "w") as f:
                json.dump(cache, f, indent=2, ensure_ascii=False)
            return response
        except Exception as e:
            key_stats[fastest_key]["fail"] += 1
            print(f"[Attempt {attempt}] Erreur avec {fastest_key}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            else:
                return f"⚠️ GROQ indisponible après {MAX_RETRIES} tentatives."

# Test simple
if __name__ == "__main__":
    prompts = ["Bonjour assistant !", "Comment améliorer la vitesse ?", "Test durable"]
    for p in prompts:
        print(query_groq(p))
