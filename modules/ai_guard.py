
def clean_response(text):
    if "indisponible" in text.lower():
        return "Donnée en cours de mise à jour 📡 Boudoum ! 🇬🇵"
    return text

