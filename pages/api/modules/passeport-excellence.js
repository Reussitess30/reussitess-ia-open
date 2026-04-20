/* © Reussitess®971 INPI DSO2026014206 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' })
  const { nom, competences, realisations } = req.body || {}
  const prompt = "Tu es certificateur REUSSITESS. Nom: " + (nom||"Champion") + ". Competences: " + (competences||"leadership") + ". Realisations: " + (realisations||"projets communautaires") + ". Certification competences portfolio numerique recommandations reseau REUSSITESS plan evolution 1 an. Boudoum!"
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", { method: "POST", headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }) }).then(r => r.json())
    return res.status(200).json({ response: r.choices?.[0]?.message?.content || "Passeport en generation...", module: "Passeport Excellence" })
  } catch(e) { return res.status(200).json({ response: "Module indisponible. Boudoum!", module: "Passeport Excellence" }) }
}
