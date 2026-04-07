
from modules.region_info import get_region_info

def handle_info(region):
    info = get_region_info(region)

    if "encyclopedie" in info:
        return f"📚 ****Encyclopédie REUSSITESS — {region.capitalize()}****\n{info[encyclopedie]}\nBoudoum ! 🇬🇵"

    return f"📰 ****Actualités {region.capitalize()}****\n{info.get("actualites","Pas de données")}\nBoudoum ! 🇬🇵"

