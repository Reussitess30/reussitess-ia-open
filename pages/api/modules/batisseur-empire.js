/* © Reussitess®971 INPI DSO2026014206 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' })
  const { idee, budget, territoire } = req.body || {}
  const prompt = "Tu es coach entrepreneuriat DOM-TOM REUSSITESS. Plan 90 jours. Idee: " + (idee||"boutique en ligne") + ". Budget: " + (budget||"1000") + " euros. Territoire: " + (territoire||"Guadeloupe") + ". Semaines 1-4 validation, 5-8 lancement, 9-12 premiers clients. Statut juridique financement marketing. Boudoum!"
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }) }).then(r => r.json())
    return res.status(200).json({ response: r.choices?.[0]?.message?.content || "Plan en generation...", module: "Batisseur Empire" })
  } catch(e) { return res.status(200).json({ response: "Module indisponible. Boudoum!", module: "Batisseur Empire" }) }
}
