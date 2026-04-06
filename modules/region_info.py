from datetime import date

def get_region_info(region):
    region = region.lower()
    info = {}
    
    if region == "guadeloupe":
        info['actualites'] = [
            "Bondamanjak, France-Antilles, RCI",
            "Numéro urgence mer : 196"
        ]
        info['meteo'] = "Plages : Grande Anse, Sainte-Anne, Gosier | Eau 28-29°C | Soleil ☀️"
        info['festivals'] = "CinéFest, Festival du Film Francophone"
        info['pib_chomage'] = "PIB et chômage DOM-TOM : Guadeloupe 17,2%"
        info['champions'] = "Sportifs locaux : athlétisme, football, cyclisme"
        info['patrimoine'] = "Sites : Fort Delgrès, Parc National de la Guadeloupe"
        info['sante'] = "Centres médicaux : Pointe-à-Pitre, Basse-Terre"
        info['derniere_mise_a_jour'] = date.today().isoformat()

    elif region == "martinique":
        info['actualites'] = [
            "Bondamanjak, France-Antilles, RCI",
            "Numéro urgence mer : 196"
        ]
        info['meteo'] = "Plages : Les Salines, Anse Noire | Eau 27-28°C | Soleil ☀️"
        info['festivals'] = "FICM, Cinémart, Festival de musique martiniquaise"
        info['pib_chomage'] = "PIB et chômage DOM-TOM : Martinique 15,8%"
        info['champions'] = "Sportifs locaux : athlétisme, football, cyclisme"
        info['patrimoine'] = "Sites : La Savane, Montagne Pelée, Habitation Clément"
        info['sante'] = "Centres médicaux : Fort-de-France, Trinité"
        info['derniere_mise_a_jour'] = date.today().isoformat()

    elif region == "guyane":
        info['actualites'] = ["Bondamanjak, France-Guyane"]
        info['meteo'] = "Tropicale, forte humidité, 27-30°C"
        info['festivals'] = "Carnaval, Fêtes traditionnelles"
        info['pib_chomage'] = "Guyane 20,1%"
        info['champions'] = "Sportifs : athlétisme, football"
        info['patrimoine'] = "Sites : Îles du Salut, Cayenne historique"
        info['sante'] = "Hôpitaux Cayenne, Saint-Laurent"
        info['derniere_mise_a_jour'] = date.today().isoformat()

    elif region == "reunion":
        info['actualites'] = ["France-Réunion, Zinfos974"]
        info['meteo'] = "Tropicale, saisons pluie/soleil"
        info['festivals'] = "Fête de la Musique, Fête de la Bière, Chanson Réunionnaise"
        info['pib_chomage'] = "Réunion 17,6%"
        info['champions'] = "Sportifs : cyclisme, tennis, football"
        info['patrimoine'] = "Musée Lémirant, Musée Saint-Pierre"
        info['sante'] = "Centres médicaux Saint-Denis, Saint-Pierre"
        info['derniere_mise_a_jour'] = date.today().isoformat()

    elif region == "mayotte":
        info['actualites'] = ["Bondamanjak, Open-Meteo"]
        info['meteo'] = "Température 28,8°C | Vent 23 km/h"
        info['festivals'] = "Fêtes locales et culture traditionnelle"
        info['pib_chomage'] = "Mayotte : informations locales"
        info['champions'] = "Sportifs locaux et scolaires"
        info['patrimoine'] = "Sites naturels et culturels"
        info['sante'] = "Centres médicaux Mamoudzou, Dzaoudzi"
        info['derniere_mise_a_jour'] = date.today().isoformat()

    else:
        info['message'] = "Région non reconnue"
    
    return info
