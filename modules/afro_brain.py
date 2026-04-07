
from modules.region_info import get_region_info
from modules.ai_guard import validate_response

def afro_response(query):
    q = query.lower()

    # Détection région
    if "guadeloupe" in q:
        region = "guadeloupe"
    elif "martinique" in q:
        region = "martinique"
    elif "guyane" in q:
        region = "guyane"
    elif "reunion" in q:
        region = "reunion"
    elif "mayotte" in q:
        region = "mayotte"
    else:
        return "An nou ! Pose moi une question claire sur la Caraïbe 🇬🇵"

    info = get_region_info(region)

    # Mode encyclopédie (style humain)
    if "info" in q:
        text = f"📚 ****Encyclopédie REUSSITESS — {region.capitalize()}****\n"

        if "encyclopedie" in info:
            text += info["encyclopedie"]
        else:
            text += f"La {region.capitalize()} est un territoire majeur de la Caraïbe avec une culture riche, un patrimoine fort et une population dynamique. Les données évoluent en temps réel dans REUSSITESS."

        text += "\nBoudoum ! 🇬🇵"
        return validate_response(text)

    return validate_response("Demande-moi info + pays pour activer l’encyclopédie 🌍")

