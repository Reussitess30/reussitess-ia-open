import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { query, territoire } = req.body

  try {
    const redis = Redis.fromEnv()
    const results = []

    // Chercher par territoire si mentionné
    if (territoire) {
      const data = await redis.get(`rag:actu:${territoire}`)
      if (data) results.push(...(typeof data === 'string' ? JSON.parse(data) : data))
    }

    // Chercher dans toutes les news globales
    const global = await redis.get('rag:global:allNews')
    const allNews = global ? (typeof global === 'string' ? JSON.parse(global) : global) : []
    
    // Filtrer par mots-clés de la query
    const queryLow = query.toLowerCase()
    const relevant = allNews.filter(item => 
      item.titre.toLowerCase().includes(queryLow) ||
      item.territoire.includes(queryLow) ||
      item.tags.some(t => queryLow.includes(t))
    )

    const lastUpdate = await redis.get('rag:global:lastUpdate')

    return res.status(200).json({
      results: relevant.slice(0, 5),
      lastUpdate,
      total: allNews.length
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
