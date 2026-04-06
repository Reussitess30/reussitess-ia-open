def get_region_info(region):
    from datetime import date
    info = {}
    if region.lower() == "guadeloupe":
        info['plages'] = "Grande Anse, Sainte-Anne, Gosier"
        info['coupures_edf'] = "Vérifier KaruData pour les coupures"
        info['festivals'] = "CinéFest, Festival du Film Francophone"
        info['actualites'] = "Bondamanjak, France24, RFI"
        info['derniere_mise_a_jour'] = date.today().isoformat()
    elif region.lower() == "martinique":
        info['plages'] = "Les Salines, Anse Noire"
        info['coupures_edf'] = "Vérifier EDF Martinique"
        info['festivals'] = "FICM, Cinémart"
        info['actualites'] = "Bondamanjak, RFI, France24"
        info['derniere_mise_a_jour'] = date.today().isoformat()
    else:
        info['message'] = "Région non reconnue"
    return info
