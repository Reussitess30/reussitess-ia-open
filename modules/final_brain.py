
from modules.afro_brain import afro_response
from modules.ai_guard import clean_response

def final_response(user_id, query):
    return clean_response(afro_response(user_id, query))

