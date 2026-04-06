#!/usr/bin/env python3
"""
Audit complet du bot REUSSITESS AI
- Inspecte la base de données groq_cache.json
- Vérifie cohérence, logique et réponses par module
- Détecte les failles et données manquantes
- Génère un rapport pour amélioration
"""
import json

DB_FILE = "groq_cache.json"

# Charger la base
with open(DB_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

rapport = []

# Vérification des modules principaux
modules = [
    "festivals_caribeens", "culture_caribeenne", "crypto_update", 
    "meteo_update", "qualite_eau_update", "marrees_update",
    "trafic_update", "tokens", "last_update"
]

rapport.append(f"🟢 Audit complet pour REUSSITESS AI - Base jusqu'à {data.get('last_update', 'non renseignée')}\n")

for module in modules:
    if module in data:
        status = "OK" if data[module] else "⚠️ Vide ou non renseigné"
        rapport.append(f"Module '{module}': {status}")
    else:
        rapport.append(f"Module '{module}': ❌ Absente de la base")

# Vérification cohérence festivals
if "festivals_caribeens" in data:
    for fest in data["festivals_caribeens"]:
        if not fest.get("films_phares") or not fest.get("realisateurs"):
            rapport.append(f"⚠️ Festival '{fest.get('nom', 'inconnu')}' incomplet (films/realisateurs manquants)")

# Vérification culture caribéenne
culture = data.get("culture_caribeenne", {})
if not culture.get("musique") or not culture.get("artistes") or not culture.get("auteurs"):
    rapport.append("⚠️ Module culture_caribeenne incomplet")

# Vérification tokens et crypto
tokens = data.get("tokens", {})
for tname, tdata in tokens.items():
    if not tdata.get("blockchain") or not tdata.get("address"):
        rapport.append(f"⚠️ Token '{tname}' incomplet")

# Afficher le rapport
print("\n".join(rapport))
print("\n✅ Audit terminé. Corrigez les alertes pour que le bot devienne le #1 Afrocaraibeen mondial.")
