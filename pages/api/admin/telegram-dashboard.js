import { Redis } from '@upstash/redis'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Reuss971@2026'

export default async function handler(req, res) {
  const auth = req.headers['x-admin-password'] || req.query.pwd
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const redis = Redis.fromEnv()
  const today = new Date().toISOString().substring(0, 10)

  const [visitors, requestsToday, allKeys] = await Promise.all([
    redis.get('reussitess_visitors'),
    redis.get(`requests:${today}`),
    redis.keys('telegram:*')
  ])

  const users = []
  for (const key of allKeys) {
    try {
      const data = await redis.get(key)
      if (data) {
        const d = typeof data === 'string' ? JSON.parse(data) : data
        const uid = key.replace('telegram:', '').replace(':memory', '')
        users.push({
          id: uid,
          messages: d.messages?.length || 0,
          topics: d.topics?.slice(0, 3) || [],
          lastSeen: d.lastSeen || null
        })
      }
    } catch(e) {}
  }

  return res.status(200).json({
    stats: {
      visitors: visitors || 0,
      requestsToday: requestsToday || 0,
      telegramUsers: allKeys.length
    },
    users
  })
}
