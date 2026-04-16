f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
import { Redis } from '@upstash/redis'
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };

f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
async function isPremium(userId) {
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  try {
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    const redis = Redis.fromEnv()
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    const keys = await redis.keys(`paypal:*:premium`)
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    for (const key of keys) {
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      const data = await redis.get(key)
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      if (data && data.customId === String(userId)) return true
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    }
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    const direct = await redis.get(`premium:${userId}`)
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    return !!direct
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  } catch(e) { return false }
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
}
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };

f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
export default async function handler(req, res) {
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  if (req.method !== 'POST') return res.status(405).end()
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  const { text, from_lang, to_lang, userId } = req.body
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };

f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  const premium = true  // BYPASS TEST
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  if (!premium) return res.status(403).json({ error: 'Premium requis', upgrade: true })
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };


f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  const GROQ_KEY = process.env.GROQ_API_KEY
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    method: 'POST',
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    body: JSON.stringify({
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      model: 'llama-3.1-8b-instant',
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      max_tokens: 1000,
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      messages: [
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
        { role: 'system', content: `Tu es un expert traducteur en langues créoles caribéennes (guadeloupéen, martiniquais, haïtien, jamaïcain). Tu traduis avec précision en respectant les expressions culturelles locales. Langue source: ${from_lang || 'français'}. Langue cible: ${to_lang || 'créole guadeloupéen'}.` },
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
        { role: 'user', content: `Traduis ce texte: "${text}"\n\nDonne:\n1. La traduction\n2. Prononciation phonétique\n3. Notes culturelles si pertinent` }
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
      ]
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
    })
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  })
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  const data = await response.json()
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
  return res.status(200).json({ result: data.choices?.[0]?.message?.content })
f (!text || text === "undefined") return { error: "Texte vide", code: 400 };
}
