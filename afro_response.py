import sys
sys.path.append('./modules')
from crypto_api import crypto_reuss_token
from modules.region_info import get_region_info
from modules.memory import get_context, save_context

def afro_response(user_id, query):
    q = query.lower()
    regions = ["guadeloupe", "martinique", "guyane", "reunion", "mayotte"]
    region = None

    for r in regions:
        if r in q:
            region = r
            break

    if not region:
        last = get_context(user_id)
        if last:
            region = last

    if not region:
        return "An nou ! Précise le pays (Guadeloupe, Martinique...) 🌍 Boudoum ! 🇬🇵"

    save_context(user_id, region)
    info = get_region_info(region)

    if region == "guadeloupe":
        info['encyclopedie'] = (
            "📚 ****Encyclopédie REUSSITESS — Guadeloupe****\n"
            "La Guadeloupe est un archipel français situé dans les Caraïbes.\n"
            "• Histoire : colonie française depuis 1635.\n"
            "• Culture : carnaval, Gwo Ka, festivals locaux.\n"
            "• Économie : tourisme, agriculture.\n"
            "Boudoum ! 🇬🇵"
        )
    elif region == "martinique":
        info['encyclopedie'] = (
            "📚 ****Encyclopédie REUSSITESS — Martinique****\n"
            "La Martinique est une île française des Antilles.\n"
            "• Histoire : colonie depuis 1635.\n"
            "• Culture : musique zouk, festivals.\n"
            "• Économie : tourisme, rhum agricole.\n"
            "Boudoum ! 🇬🇵"
        )

    if "info" in q:
        texte = info.get(
            "encyclopedie",
            f"La {region.capitalize()} est un territoire majeur de la Caraïbe avec une culture riche et une forte identité."
        )
        texte += "\nBoudoum ! 🇬🇵"
        return texte

    if "meteo" in q:
        return f"🌤️ {info.get('meteo', 'Donnée indisponible')} \nBoudoum ! 🇬🇵"

    if "prix reuss token" in q:
        prix = crypto_reuss_token()
        return f"💎 Prix REUSS Token : {prix} \nBoudoum ! 🇬🇵"

    return f"An nou ! Tape 'info {region}' pour plus 📊 Boudoum ! 🇬🇵"
