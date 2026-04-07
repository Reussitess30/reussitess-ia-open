from modules.afro_brain import afro_response
from modules.auto_fix import auto_fix_response
from modules.auto_guard import safe_execute
from modules.quality_control import detect_weakness
from modules.enhancer import enhance_response

def final_response(user_id, query):
    raw = safe_execute(afro_response, user_id, query)

    issues = detect_weakness(raw)

    if issues:
        raw = enhance_response(raw, query)

    clean = auto_fix_response(raw)

    return clean
