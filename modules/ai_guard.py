
def validate_response(text):
    if not text or len(text) < 10:
        return "Réponse en amélioration, reviens bientôt 💡"
    return text

