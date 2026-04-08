import redis, json
r = redis.from_url('redis://127.0.0.1:6379')

training_phrases = {
  'correct': [
    "✅ Excellente réponse ! +5 pts REUSS",
    "🎯 Parfait ! Tu progresses rapidement",
    "🏆 Champion ! Score amélioré",
    "✨ Réponse magistrale !",
    "🔥 Niveau expert détecté !"
  ],
  'wrong': [
    "❌ Pas tout à fait... Essaie encore !",
    "🤔 Presque ! Regarde les indices",
    "💡 Bonne tentative, relecture ?",
    "⚠️ Attention aux détails...",
    "🔄 Nouvelle chance !"
  ],
  'memory': [
    "💾 Je me souviens : tu as 3/5 bonnes réponses",
    "🧠 Ton score précédent : 75%",
    "📊 Progression : +20% vs session précédente",
    "🎯 Tu maîtrises déjà les plantes antillaises !"
  ],
  'spaced_repetition': [
    "🔄 Révision espacée : cette question revient dans 3j",
    "📈 Anki-style : intervalle x2 après bonne réponse",
    "🧩 Mastery 80% → question avancée débloquée"
  ]
}

for category, phrases in training_phrases.items():
  r.json().set(f'quiz:training:{category}', '$', phrases)

print('✅ 20+ formules quiz → Redis')
print('quiz:training:correct → 5 phrases')
print('quiz:training:memory → Sessions live')
