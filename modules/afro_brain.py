
from modules.region_info import get_region_info

def afro_response(query):
    q = query.lower()

    # Détection région propre
    regions = ["guadeloupe", "martinique", "guyane", "reunion", "mayotte"]
    region = None

    for r in regions:
        if r in q:
            region = r
            break

    if not region:
        return "An nou ! Pose une question claire sur la Caraïbe 🌍 Boudoum ! 🇬🇵"

    info = get_region_info(region)

    # MODE INFO = encyclopédie intelligente
    if "info" in q:

        texte = f"📚 ****Encyclopédie REUSSITESS — {region.capitalize()}****\n"

        # Si encyclopédie existe → prioritaire
        if "encyclopedie" in info:
            texte += info["encyclopedie"]

        # Sinon fallback intelligent (PAS VIDE)
        else:
            texte += (
                f"La {region.capitalize()} est un territoire clé de la Caraïbe. "
                f"Elle possède un patrimoine riche, une culture forte et une population dynamique. "
                f"Les données évoluent en temps réel dans REUSSITESS pour rester toujours à jour."
            )

        texte += "\nBoudoum ! 🇬🇵"
        return texte

    # AUTRES CAS → réponse utile
    return f"An nou ! Tape info {region} pour voir les données complètes 📊 Boudoum ! 🇬🇵"

