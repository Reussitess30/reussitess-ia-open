
def budget_tracker(revenus, depenses):
    solde = revenus - depenses
    return {
        "revenus": revenus,
        "depenses": depenses,
        "solde": solde
    }

