/* © Reussitess®971 INPI DSO2026014206 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' })
  const { secteur, pays } = req.body || {}
  const prompt = "Tu es analyste strategique REUSSITESS. Secteur: " + (secteur||"ecommerce") + ". Pays: " + (pays||"Guadeloupe") + ". Taille marche concurrents opportunites menaces strategie entree. 14 pays partenaires REUSSITESS. Boudoum!"
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }) }).then(r => r.json())
    return res.status(200).json({ response: r.choices?.[0]?.message?.content || "Analyse en cours...", module: "Intelligence Strategique" })
  } catch(e) { return res.status(200).json({ response: "Module indisponible. Boudoum!", module: "Intelligence Strategique" }) }
}
