
memory = {}

def save_context(user_id, question):
    memory[user_id] = question

def get_context(user_id):
    return memory.get(user_id, None)

