def auto_fix_response(text):
    # Corrige réponses vides
    if not text or len(text.strip()) < 10:
        return "Réponse en amélioration 📡 An nou réessaie ! Boudoum ! 🇬🇵"

    # Corrige incohérences simples
    if "None" in text or "undefined" in text.lower():
        return "Donnée en cours de synchronisation 🔄 Boudoum ! 🇬🇵"

    # Corrige répétitions bug
    if text.count("Boudoum") > 2:
        text = text.replace("Boudoum ! 🇬🇵", "").strip()
        text += "\nBoudoum ! 🇬🇵"

    return text
