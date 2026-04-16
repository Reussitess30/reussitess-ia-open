export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const secret = req.headers['x-admin-secret']
  if (secret !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const { createClient } = await import('redis')
    const redis = createClient({ url: process.env.REDIS_URL })
    await redis.connect()
    const memKeys = await redis.keys('telegram:*:memory')
    const users = []
    for (const key of memKeys.slice(0, 50)) {
      const data = await redis.get(key)
      if (data) {
        const mem = JSON.parse(data)
        const userId = key.replace('telegram:', '').replace(':memory', '')
        users.push({
          userId,
          totalMessages: mem.stats?.total_messages || mem.messages?.length || 0,
          lastSeen: mem.lastSeen || null,
          topics: Object.keys(mem.topics || {})
        })
      }
    }
    users.sort((a,b) => b.totalMessages - a.totalMessages)
    await redis.disconnect()
    return res.status(200).json({
      totalUsers: memKeys.length,
      activeUsers: users.filter(u => u.totalMessages > 3).length,
      topUsers: users.slice(0, 10),
      updated: new Date().toISOString()
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
