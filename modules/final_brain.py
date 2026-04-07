from modules.afro_brain import afro_response

def final_response(user_id, query):
    try:
        return afro_response(user_id, query)
    except Exception as e:
        return f"Erreur système: {e} Boudoum ! 🇬🇵"
