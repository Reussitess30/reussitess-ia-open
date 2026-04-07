import redis
import json
from datetime import datetime

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# 🔹 Mémoire complète
def save_brain(user_id, message, response):
    data = {
        "time": str(datetime.now()),
        "message": message,
        "response": response
    }

    # 1. conversation
    r.rpush(f"mem:short:{user_id}", json.dumps(data))

    # 2. long terme (si important)
    if len(message) > 20:
        r.rpush(f"mem:long:{user_id}", json.dumps(data))

    # 3. émotion
    if "merci" in message or "🔥" in message:
        r.set(f"mem:emotion:{user_id}", "positif")

    # 4. intention
    if "apprendre" in message:
        r.set(f"mem:intent:{user_id}", "learning")

    # persistance totale
    r.persist(f"mem:short:{user_id}")
    r.persist(f"mem:long:{user_id}")

# 🔹 Récupération intelligente
def recall_brain(user_id):
    short = r.lrange(f"mem:short:{user_id}", -3, -1)
    long = r.lrange(f"mem:long:{user_id}", -5, -1)
    emotion = r.get(f"mem:emotion:{user_id}")
    intent = r.get(f"mem:intent:{user_id}")

    return {
        "short": short,
        "long": long,
        "emotion": emotion,
        "intent": intent
    }
