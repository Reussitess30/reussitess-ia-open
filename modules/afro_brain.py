from modules.region_info import get_region_info
from modules.memory import save_context, get_context

def afro_response(user_id, query):
    q = query.lower()

    regions = ["guadeloupe", "martinique", "guyane", "reunion", "mayotte"]
    region = None

    # Détection directe
    for r in regions:
        if r in q:
            region = r
            break

    # Mémoire
    if not region:
        last = get_context(user_id)
        if last:
            region = last

    if not region:
        return "An nou ! Précise le pays (Guadeloupe, Martinique...) 🌍 Boudoum ! 🇬🇵"

    save_context(user_id, region)
    info = get_region_info(region)

    if "info" in q:
        texte = f"📚 ****Encyclopédie REUSSITESS — {region.capitalize()}****\n"

        if "encyclopedie" in info:
            texte += info["encyclopedie"]
        else:
            texte += f"La {region.capitalize()} est un territoire majeur de la Caraïbe avec une culture riche et une forte identité."

        texte += "\nBoudoum ! 🇬🇵"
        return texte

    if "meteo" in q:
        return f"🌤️ {info.get('meteo', 'Donnée indisponible')}\nBoudoum ! 🇬🇵"

    return f"An nou ! Tape 'info {region}' pour plus 📊 Boudoum ! 🇬🇵"
