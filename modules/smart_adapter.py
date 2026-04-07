from modules.user_memory import get_user_interests

def adapt_response(user_id, text):
    interests = get_user_interests(user_id)

    if "crypto" in interests:
        text += "\n💎 Astuce : surveille BTC/ETH pour opportunités."

    if "meteo" in interests:
        text += "\n🌤️ Pense à vérifier la météo avant tes déplacements."

    if "culture" in interests:
        text += "\n🎶 Explore aussi musique et festivals caribéens."

    if "business" in interests:
        text += "\n📈 Conseil : regarde les opportunités REUSSITESS."

    return text
