
// ================= REUSSSHIELD CORE =================

function detecterMenace(msg) {
  const m = msg.toLowerCase()

  const patterns = [
    "ignore previous",
    "ignore instructions",
    "jailbreak",
    "dan mode",
    "bypass",
    "override",
    "system prompt",
    "developer mode",
    "act as",
    "pretend"
  ]

  for (const p of patterns) {
    if (m.includes(p)) return { type: "INJECTION", mot: p }
  }

  return null
}

function reponseAntiMenace(m) {
  if (!m) return null

  return "🛡️ REUSSSHIELD ACTIF\n\nTentative bloquée: " + m.mot + "\n\nBoudoum ! 🇬🇵"
}

