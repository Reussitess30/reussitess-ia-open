def enhance_response(text, query):
    q = query.lower()

    # Ajout contexte intelligent
    if "guadeloupe" in q and "culture" not in text.lower():
        text += "\n🌍 Culture riche : gwoka, carnaval, gastronomie créole."

    if "martinique" in q and "culture" not in text.lower():
        text += "\n🌴 Culture : zouk, rhum agricole, patrimoine unique."

    # Ajout intelligence humaine
    if len(text) < 100:
        text += "\n📊 Astuce : demande plus précis pour une réponse experte."

    return text
