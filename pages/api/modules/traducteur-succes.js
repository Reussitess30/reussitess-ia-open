/* © Reussitess®971 INPI DSO2026014206 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' })
  const { projet, marche, identite } = req.body || {}
  const prompt = "Tu es expert pitch interculturel REUSSITESS. Projet: " + (projet||"startup IA") + ". Marche cible: " + (marche||"France") + ". Identite: " + (identite||"Guadeloupe") + ". Genere pitch France, pitch Canada, pitch USA. Identite culturelle comme force. Boudoum!"
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }) }).then(r => r.json())
    return res.status(200).json({ response: r.choices?.[0]?.message?.content || "Pitch en generation...", module: "Traducteur Succes" })
  } catch(e) { return res.status(200).json({ response: "Module indisponible. Boudoum!", module: "Traducteur Succes" }) }
}
