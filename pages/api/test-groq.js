export default async function handler(req, res) {
  const key = process.env.GROQ_API_KEY
  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages: [{ role: "user", content: "Combien de jours dans une semaine?" }], max_tokens: 50 })
    })
    const d = await r.json()
    res.status(200).json({ ok: r.ok, status: r.status, rep: d.choices?.[0]?.message?.content, error: d.error })
  } catch(e) {
    res.status(200).json({ error: e.message })
  }
}
