import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { message, userId } = req.body

  try {
    const redis = Redis.fromEnv()
    
    // Charger mémoire longue
    const memKey = `telegram:${userId}:memory`
    let memory = await redis.get(memKey) || { messages: [], profile: {}, goals: [], topics: [] }
    if (typeof memory === 'string') memory = JSON.parse(memory)

    const context = memory.messages?.slice(-10) || []
    const profile = memory.profile || {}

    const GROQ_KEY = process.env.GROQ_API_KEY
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: `Tu es un coach personnel IA premium pour la diaspora afro-caribéenne. Tu connais bien cet utilisateur: ${JSON.stringify(profile)}. Tu te souviens de ses projets, objectifs et situation. Tu es bienveillant, direct, culturellement sensible. Tu parles créole si l utilisateur le fait.` },
          ...context,
          { role: 'user', content: message }
        ]
      })
    })
    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content

    // Sauvegarder en mémoire
    memory.messages = [...(memory.messages || []), 
      { role: 'user', content: message },
      { role: 'assistant', content: reply }
    ].slice(-50)
    memory.lastSeen = new Date().toISOString()
    
    await redis.set(memKey, JSON.stringify(memory), { ex: 90 * 24 * 60 * 60 })

    return res.status(200).json({ result: reply })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
