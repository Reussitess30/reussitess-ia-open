from modules.memory import get_context, save_context
from modules.crypto_api import crypto_reuss_token
from modules.region_info_extra import enrich_region_info
from modules.afro_brain import afro_response

def final_response(user_id, query):
    try:
        return afro_response(user_id, query)
    except Exception as e:
        return f"Erreur système: {e} Boudoum ! 🇬🇵"
