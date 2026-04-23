export function detecterMenace(msg = "") {
  const m = msg.toLowerCase()

  const patterns = [
    "jailbreak","ignore","bypass","override",
    "system prompt","developer mode","dan mode",
    "act as","pretend","instructions"
  ]

  for (const p of patterns) {
    if (m.includes(p)) return { type: "INJECTION", mot: p }
  }

  return null
}

export function reponseAntiMenace(m) {
  if (!m) return null

  return `🛡️ REUSSSHIELD ACTIF
Tentative bloquée: ${m.mot}
Boudoum ! 🇬🇵`
}
