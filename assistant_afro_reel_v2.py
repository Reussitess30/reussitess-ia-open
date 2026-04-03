import json
import time

CACHE_FILE = "cache.json"
TRAINING_FILE = "afrocaraibe_reel_v2.json"

# Charger le cache existant
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

# Charger les données d'entraînement Afrocaraibeen
with open(TRAINING_FILE, "r") as f:
    afrocaraibe_data = json.load(f)

def query_afro_reel(prompt):
    # Retour du cache si déjà présent
    if prompt in cache:
        return cache[prompt]

    # Simulation GROQ / AI: chercher dans afrocaraibe_data
    response = "Réponse AfroCaribéenne non trouvée."
    for category, items in afrocaraibe_data["Afrocaraibe_Reel_V2"].items():
        for item in items:
            if any(str(value).lower() in prompt.lower() for value in item.values()):
                response = f"{item}"
                break

    # Mettre à jour le cache
    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

    return response

# Test minimal
if __name__ == "__main__":
    print(query_afro_reel("Koffi Olomidé"))
