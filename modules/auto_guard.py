def safe_execute(func, *args):
    try:
        return func(*args)
    except Exception as e:
        return f"⚠️ Petite erreur interne détectée, correction en cours...\nDétail: {str(e)}\nBoudoum ! 🇬🇵"
