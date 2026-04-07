from modules.region_info import get_region_info
from modules.memory import get_context, save_context
from modules.crypto_api import crypto_reuss_token

def afro_response(user_id, query):
    q = query.lower()
    regions = ["guadeloupe", "martinique", "guyane", "reunion", "mayotte"]

    region = None

    # Détection région
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
        return "An nou ! Précise le pays 🌍 Boudoum ! 🇬🇵"

    save_context(user_id, region)

    info = get_region_info(region)

    # INFO
    if "info" in q:
        texte = info.get(
            "encyclopedie",
            f"La {region.capitalize()} est un territoire majeur de la Caraïbe."
        )
        return texte + "\nBoudoum ! 🇬🇵"

    # METEO
    if "meteo" in q:
        return f"🌤️ {info.get('meteo', 'Donnée indisponible')}\nBoudoum ! 🇬🇵"

    # CRYPTO
    if "prix reuss token" in q:
        prix = crypto_reuss_token()
        return f"💎 {prix}\nBoudoum ! 🇬🇵"

    return f"An nou ! Tape 'info {region}' 📊 Boudoum ! 🇬🇵"
