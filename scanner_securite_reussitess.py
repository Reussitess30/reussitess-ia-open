# 🌍 Expansion Mondiale Reussitess©
# Mode Global : 14 Pays Prioritaires + Ouverture Monde

PAYS_PRIORITAIRES = [
    "France", "Angleterre", "Italie", "Allemagne", "Suède", 
    "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
    "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
]

def verifier_geofence(pays_actuel):
    if pays_actuel in PAYS_PRIORITAIRES:
        return f"💎 PRIORITÉ OR : {pays_actuel} est un pilier de Reussitess©. Performance maximale."
    else:
        return f"🌍 ACCÈS GLOBAL : {pays_actuel} connecté. Bienvenue dans l'expansion Reussitess©."

if __name__ == "__main__":
    print("🛰️ Initialisation du réseau mondial Reussitess©...")
    # Test sur un pilier et sur le reste du monde
    print(verifier_geofence("France"))
    print(verifier_geofence("Japon"))
