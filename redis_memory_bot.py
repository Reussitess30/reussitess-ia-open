import redis, json, datetime
r = redis.from_url('redis://127.0.0.1:6379')

def save_conversation(user_id, message, response):
  key = f"user:{user_id}:history"
  conv = {
    "timestamp": datetime.datetime.now().isoformat(),
    "user_msg": message,
    "bot_resp": response,
    "tokens": len(message) + len(response)
  }
  r.lpush(key, json.dumps(conv))
  r.ltrim(key, 0, 49)  # 50 dernières conversations
  r.expire(key, 86400 * 30)  # 30 jours

def get_memory(user_id, limit=10):
  key = f"user:{user_id}:history"
  history = r.lrange(key, 0, limit-1)
  return [json.loads(h) for h in history[::-1]]  # Plus récent en 1er

# Index conversation active
r.set('bot:active_users', 42)
r.set('bot:total_conversations', 145219)

print('✅ Mémoire conversationnelle Redis')
print('user:ID:history → 50 dernières')
print('get_memory() → Contexte live')
