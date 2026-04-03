import json

# Fichiers
CACHE_FILE = "cache.json"
TRAIN_FILE = "afrocaraibe_reel_v1.json"

# Charger cache existant
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

# Charger la base Afro-Caribéenne
with open(TRAIN_FILE, "r") as f:
    afro_data = json.load(f)

def query_afro(prompt):
    # Retour du cache si existant
    if prompt in cache:
        return cache[prompt]
    
    # Chercher dans la base Afro-Caribéenne
    for key, section in afro_data["afrocaraibe_reel"].items():
        if prompt.lower() in key.lower():
            response = section
            cache[prompt] = response
            with open(CACHE_FILE, "w") as f:
                json.dump(cache, f, ensure_ascii=False, indent=2)
            return response
    
    # Si rien trouvé
    response = "Désolé, aucune donnée correspondante dans la base Afro-Caribéenne."
    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    return response

# Test
if __name__ == "__main__":
    print(query_afro("Musique"))
    print(query_afro("Cuisine"))
