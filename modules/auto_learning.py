learning_db = {}

def save_learning(question, answer):
    q = question.lower()
    learning_db[q] = answer

def get_learning(question):
    return learning_db.get(question.lower())
