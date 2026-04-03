import json
import time
import random
import os

CACHE_FILE = "cache.json"
# Utilisation des variables d'environnement pour la sécurité
GROQ_KEYS = [
    os.getenv("GROQ_KEY_1", "ta_cle_1"),
    os.getenv("GROQ_KEY_2", "ta_cle_2"),
    os.getenv("GROQ_KEY_3", "ta_cle_3")
]
MAX_RETRIES = 3
RETRY_DELAY = 1

# 1. Chargement du cache (UTF-8 pour l'excellence de la Guadeloupe)
try:
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            cache = json.load(f)
    else:
        cache = {}
except (json.JSONDecodeError):
    cache = {}

# 2. Stats initiales
key_stats = {key: {"success": 0, "fail": 0, "avg_time": 0.0} for key in GROQ_KEYS}

def _call_groq(prompt, key):
    """Simulateur d'appel réel"""
    delay = random.uniform(0.1, 0.5)
    time.sleep(delay)
    if random.random() < 0.05: # 5% de risque d'erreur
        raise Exception("Service temporairement indisponible")
    return f"Réponse pour '{prompt}' via {key[:8]}"

def query_groq(prompt):
    # Retour immédiat si en cache
    if prompt in cache:
        return cache[prompt]

    for attempt in range(1, MAX_RETRIES + 1):
        # CORRECTIF LOGIQUE : On priorise les clés jamais utilisées (inf), 
        # sinon on prend la plus rapide.
        fastest_key = min(
            GROQ_KEYS,
            key=lambda k: key_stats[k]["avg_time"] if key_stats[k]["success"] > 0 else -1.0
        )
        
        start = time.time()
        try:
            response = _call_groq(prompt, fastest_key)
            elapsed = time.time() - start
            
            # Mise à jour des stats
            stats = key_stats[fastest_key]
            n = stats["success"]
            stats["avg_time"] = (stats["avg_time"] * n + elapsed) / (n + 1)
            stats["success"] += 1
            
            # Sauvegarde physique du cache
            cache[prompt] = response
            with open(CACHE_FILE, "w", encoding="utf-8") as f:
                json.dump(cache, f, indent=2, ensure_ascii=False)
            
            return response
            
        except Exception as e:
            key_stats[fastest_key]["fail"] += 1
            print(f"[Attempt {attempt}] Erreur avec {fastest_key[:8]}: {e}")
            if attempt < MAX_RETRIES:
                time.sleep(RETRY_DELAY)
            else:
                return f"⚠️ Échec après {MAX_RETRIES} tentatives pour les 14 pays."

if __name__ == "__main__":
    # Test de l'Assistant AfroCaribéen V2
    print(query_groq("Lancement Reussitess© !"))
