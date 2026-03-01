# 💰 Reussitess© : Dashboard de Revenus Mondiaux (Version Corrigée 14 Pays)
# Localisation : Guadeloupe - Terres De Champions - Boudoum !

DEVISES = {
    "France": "EUR", "Belgique": "EUR", "Italie": "EUR", "Allemagne": "EUR", "Espagne": "EUR",
    "Royaume-Uni": "GBP", "Canada": "CAD", "Australie": "AUD", "États-Unis": "USD",
    "Brésil": "BRL", "Singapour": "SGD", "Inde": "INR", "Suède": "SEK", "Nouvelle-Zélande": "NZD"
}

def generer_rapport_financier(pays, montant_local):
    if pays not in DEVISES:
        return f"❌ [ERREUR] {pays} n'est pas autorisé dans les 14 pays cibles."
    
    devise = DEVISES[pays]
    # Taux réels approximatifs au 01/03/2026
    taux = {
        "EUR": 1.0, "USD": 0.92, "CAD": 0.68, "GBP": 1.18, 
        "AUD": 0.60, "BRL": 0.18, "SGD": 0.68, "INR": 0.011, "SEK": 0.088, "NZD": 0.56
    }
    
    montant_eur = montant_local * taux.get(devise, 1.0)
    rapport = f"💸 [REVENU REUSSITESS] Pays: {pays} | Montant: {montant_local} {devise} | TOTAL: {montant_eur:.2f}€"
    
    with open("REVENUS_REUSSITESS.txt", "a", encoding="utf-8") as f:
        f.write(f"{rapport}\n")
    return rapport

if __name__ == "__main__":
    # Test de validation sur tes zones de force réelles
    print(generer_rapport_financier("France", 150))
    print(generer_rapport_financier("Belgique", 200))
    print(generer_rapport_financier("Canada", 100))
