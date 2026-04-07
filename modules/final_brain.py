from modules.afro_brain import afro_response
from modules.auto_fix import auto_fix_response
from modules.auto_guard import safe_execute

def final_response(user_id, query):
    raw = safe_execute(afro_response, user_id, query)
    clean = auto_fix_response(raw)
    return clean
