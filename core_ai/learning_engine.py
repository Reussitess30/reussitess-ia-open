from modules.auto_learning import save_learning, get_learning

def learn_and_improve(query, response):
    # Si réponse faible → on mémorise quand même
    if len(response) > 20:
        save_learning(query, response)

def try_learned_response(query):
    learned = get_learning(query)
    if learned:
        return learned
    return None
