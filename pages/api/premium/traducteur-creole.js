import { Redis } from '@upstash/redis'

async function isPremium(userId) {
  try {
    const redis = Redis.fromEnv()
    const keys = await redis.keys(`paypal:*:premium`)
    for (const key of keys) {
      const data = await redis.get(key)
      if (data && data.customId === String(userId)) return true
    }
    const direct = await redis.get(`premium:${userId}`)
    return !!direct
  } catch(e) { return false }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { text, from_lang, to_lang, userId } = req.body

  const premium = await isPremium(userId)
  if (!premium) return res.status(403).json({ error: 'Premium requis', upgrade: true })

  const GROQ_KEY = process.env.GROQ_API_KEY
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1000,
      messages: [
        { role: 'system', content: `Tu es un expert traducteur en langues créoles caribéennes (guadeloupéen, martiniquais, haïtien, jamaïcain). Tu traduis avec précision en respectant les expressions culturelles locales. Langue source: ${from_lang || 'français'}. Langue cible: ${to_lang || 'créole guadeloupéen'}.` },
        { role: 'user', content: `Traduis ce texte: "${text}"\n\nDonne:\n1. La traduction\n2. Prononciation phonétique\n3. Notes culturelles si pertinent` }
      ]
    })
  })
  const data = await response.json()
  return res.status(200).json({ result: data.choices?.[0]?.message?.content })
}
