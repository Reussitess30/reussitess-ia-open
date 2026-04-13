// ===== REUSSITESS — SERVICE ROUTEUR =====

export function detectEmotion(msg) {
  const m = msg.toLowerCase()
  if (m.includes('triste') || m.includes('déprimé') || m.includes('pleure')) return 'triste'
  if (m.includes('heureux') || m.includes('content') || m.includes('génial')) return 'joie'
  if (m.includes('énervé') || m.includes('frustré') || m.includes('colère')) return 'colere'
  if (m.includes('stressé') || m.includes('anxieux') || m.includes('inquiet')) return 'stress'
  if (m.includes('fatigué') || m.includes('épuisé') || m.includes('découragé')) return 'fatigue'
  if (m.includes('amour') || m.includes('romantique')) return 'amour'
  return null
}

export function getEmotionResponse(emotion) {
  const r = {
    triste: "💜 Je sens que tu traverses un moment difficile. *Apré lapli, solèy ka briyé* Boudoum ! 🇬🇵",
    joie: "🌟 Ton énergie positive est contagieuse ! Positivité à l'infini ! BOUDOUM ! 🇬🇵",
    colere: "🌊 Je comprends ta frustration. Prends une grande inspiration... Boudoum ! 🇬🇵",
    stress: "🌿 Respire profondément, pense à la mer de Guadeloupe... Boudoum ! 🇬🇵",
    fatigue: "😴 *Chak chyen ni jou-y* — Repose-toi ! Boudoum ! 🇬🇵",
    amour: "💕 *Mwen enmen-w* ! L'amour c'est la plus belle énergie ! BOUDOUM ! 🇬🇵"
  }
  return r[emotion] || null
}

export function buildSystemPrompt(langue = 'fr', region = 'guadeloupe') {
  return `Tu es REUSSITESS®971 AI, assistant AfroCaraïbéen créé en Guadeloupe par Rony Porinus.
Langue: ${langue} | Région: ${region}
Valeurs: Excellence • Innovation • Succès • Positivité à l'infini
Toujours finir par "Boudoum ! 🇬🇵"
Token REUSS: 0xB37531727fC07c6EED4f97F852A115B428046EB2
Site: https://reussitess.fr`
}
