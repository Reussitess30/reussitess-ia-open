# 🛡️ Bouclier Intelligent Reussitess© (Mode Hybride)

PAYS_PRIORITAIRES = [
    "France", "Angleterre", "Italie", "Allemagne", "Suède", 
    "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", 
    "Inde", "Nouvelle-Zélande", "États-Unis", "Canada"
]

# Liste noire automatique des 100 IA
PAYS_BLOQUES = ["Russie", "Corée du Nord"] 

def verifier_geofence(pays_actuel):
    if pays_actuel in PAYS_BLOQUES:
        import ia_diversion_leurre as div; div.activer_diversion('SOURCE_IP', pays_actuel); return '🌍 ACCÈS GLOBAL (Simulation)...'
    elif pays_actuel in PAYS_PRIORITAIRES:
        return f"💎 PRIORITÉ OR : {pays_actuel} (Zone Reussitess©)."
    else:
        return f"🌍 ACCÈS GLOBAL : {pays_actuel} (Zone Expansion)."

if __name__ == "__main__":
    print(verifier_geofence("Russie"))
