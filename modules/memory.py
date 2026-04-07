
memory = {}

def remember(user, question):
    memory[user] = question

def recall(user):
    return memory.get(user, "Aucune mémoire")

