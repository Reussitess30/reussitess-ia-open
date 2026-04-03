import json
import time
import random  # Pour simuler l'erreur GROQ

CACHE_FILE = "cache.json"
GROQ_KEYS = ["ta_cle_1_de_Vercel", "ta_cle_2_de_Vercel", "ta_cle_3_de_Vercel"]

# Charger le cache existant
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

def query_groq(prompt, retries=2, delay=1):
    # Retour du cache si déjà présent
    if prompt in cache:
        return cache[prompt]

    for attempt in range(retries + 1):
        try:
            # Simuler un appel GROQ avec risque d'erreur aléatoire
            fastest_key = GROQ_KEYS[0]  # à remplacer par logique réelle
            # --- Ici tu mettrais l'appel réel à GROQ ---
            if random.random() < 0.2:  # 20% de chance d'erreur simulée
                raise ConnectionError("Erreur temporaire GROQ")
            response = f"GROQ réponse pour {prompt} avec {fastest_key}"

            # Mettre à jour le cache
            cache[prompt] = response
            with open(CACHE_FILE, "w") as f:
                json.dump(cache, f)
            return response

        except Exception as e:
            print(f"⚠️ Tentative {attempt + 1} échouée: {e}")
            if attempt < retries:
                time.sleep(delay)  # attendre avant de réessayer
            else:
                return f"⚠️ Service temporairement indisponible après {retries + 1} tentatives. Réessaie plus tard !"

# Test
if __name__ == "__main__":
    print(query_groq("Bonjour assistant !"))
