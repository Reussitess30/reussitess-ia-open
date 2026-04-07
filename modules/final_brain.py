from modules.afro_brain import afro_response
from modules.auto_fix import auto_fix_response
from modules.auto_guard import safe_execute
from modules.quality_control import detect_weakness
from modules.enhancer import enhance_response
from modules.user_memory import save_user_interest
from modules.smart_adapter import adapt_response

def final_response(user_id, query):
    # Sauvegarde comportement utilisateur
    save_user_interest(user_id, query)

    raw = safe_execute(afro_response, user_id, query)

    issues = detect_weakness(raw)

    if issues:
        raw = enhance_response(raw, query)

    # Adaptation intelligente
    raw = adapt_response(user_id, raw)

    clean = auto_fix_response(raw)

    return clean
