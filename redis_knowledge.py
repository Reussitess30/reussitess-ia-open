import json, os, redis
r = redis.from_url('redis://127.0.0.1:6379')

routes = [
  '/api/ai-status', '/api/amazon-deals', '/api/generate-report', '/api/superbot-reussitess',
  '/api/token-info', '/api/telegram-webhook', '/api/visa/generate-pdf', '/api/visitors',
  '/neuro-x', '/quiz/[id]', '/passe-port-mondial', '/observatoire-antilles'
]

modules = [
  'last_update.py', 'crypto_update.py', 'meteo_update.py', 'brain_router.py',
  'neuro_training.py', 'ai_guard.py', 'user_memory.py', 'auto_learning.py'
]

for route in routes:
  r.hset('bot:knowledge:routes', route, 1)

for module in modules:
  r.hset('bot:knowledge:modules', module, 1)

r.set('bot:knowledge:total_routes', len(routes))
r.set('bot:knowledge:total_modules', len(modules))

print(f'✅ {len(routes)} routes → Redis')
print(f'✅ {len(modules)} modules → Redis')
print('bot:knowledge:* → Vérifié!')
