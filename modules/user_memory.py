memory = {}

def save_user_interest(user_id, query):
    q = query.lower()

    if user_id not in memory:
        memory[user_id] = {"interests": set()}

    if "crypto" in q:
        memory[user_id]["interests"].add("crypto")

    if "meteo" in q:
        memory[user_id]["interests"].add("meteo")

    if "festival" in q or "culture" in q:
        memory[user_id]["interests"].add("culture")

    if "business" in q or "emploi" in q:
        memory[user_id]["interests"].add("business")

def get_user_interests(user_id):
    return list(memory.get(user_id, {}).get("interests", []))
