def get_meteo_data(region):
    # Stub temporaire : retourne des données météo fictives réalistes
    meteo = {
        "guadeloupe": "Plages : Grande Anse, Sainte-Anne | Eau 28-29°C | Soleil ☀️",
        "martinique": "Plages : Les Salines, Anse Noire | Eau 27-28°C | Soleil ☀️",
        "guyane": "Tropicale, forte humidité, 27-30°C",
        "reunion": "Tropicale, saisons pluie/soleil",
        "mayotte": "Température 28,8°C | Vent 23 km/h"
    }
    return meteo.get(region.lower(), "Donnée indisponible")
