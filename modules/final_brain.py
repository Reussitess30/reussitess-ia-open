
from modules.afro_brain import afro_response
from modules.persona import afro_tone

def final_response(query):
    base = afro_response(query)
    return afro_tone(base)

