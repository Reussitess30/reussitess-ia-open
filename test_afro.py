import json

with open("afrocaraibe_train.json", "r") as f:
    afro = json.load(f)

print(afro["afrocaraibe"]["culture"]["musique"])
print(afro["afrocaraibe"]["technologie"]["blockchain"])
