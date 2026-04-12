export default async function handler(req, res) {
  const { username } = req.query
  if (!username) return res.status(400).json({ error: 'username requis' })

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const data = await redis.get(`kick:reuss:${username}`)
    if (!data) return res.status(200).json({ username, points: 0, history: [] })
    return res.status(200).json(JSON.parse(data))
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
