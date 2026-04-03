import json

CACHE_FILE = "cache.json"
TRAINING_FILE = "afrocaraibe_reel_massif_v1.json"

# Charger cache existant
try:
    with open(CACHE_FILE, "r") as f:
        cache = json.load(f)
except FileNotFoundError:
    cache = {}

# Charger données Afrocaraibeen réelles
with open(TRAINING_FILE, "r") as f:
    afro_data = json.load(f)

def query_afro_massif(prompt):
    if prompt in cache:
        return cache[prompt]

    response = "Aucune info Afrocaraibeen correspondante."
    for category, items in afro_data["Afrocaraibe_Reel_Massif_V1"].items():
        for item in items:
            if any(str(value).lower() in prompt.lower() for value in item.values()):
                response = f"{item}"
                break

    cache[prompt] = response
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

    return response

# Test
if __name__ == "__main__":
    print(query_afro_massif("Sean Paul"))
