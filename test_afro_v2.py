import json

with open("afrocaraibe_train_v2.json", "r") as f:
    afro_v2 = json.load(f)

# Exemple d'accès à la musique et à la blockchain
print(afro_v2["afrocaraibe"]["culture"]["musique"])
print(afro_v2["afrocaraibe"]["technologie"]["blockchain"])
