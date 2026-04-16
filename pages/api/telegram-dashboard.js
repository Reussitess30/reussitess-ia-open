export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  
  // TON SECRET (remplace)
  const secret = req.headers['x-admin-secret'] || req.query.secret
  if (secret !== process.env.ADMIN_SECRET && secret !== 'DSO2026012614') 
    return res.status(401).json({ error: 'Unauthorized' })

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    await redis.connect()

    // COMPTEUR GLOBAL (force création si absent)
    const globalStats = await redis.hgetall('global:stats')
    if (Object.keys(globalStats).length === 0) {
      await redis.hset('global:stats', { total_messages: 0, total_users: 0, premium_users: 0 })
    }

    const dailyKey = `daily:${new Date().toDateString()}`
    const dailyStats = await redis.hgetall(dailyKey)

    const memKeys = await redis.keys('telegram:*:memory')
    const totalUsers = memKeys.length

    await redis.disconnect()

    res.status(200).json({
      global: {
        total_messages: parseInt(globalStats.total_messages || 0),
        total_users: parseInt(globalStats.total_users || 0),
        premium_users: parseInt(globalStats.premium_users || 0),
        today_messages: parseInt(dailyStats.messages || 0),
        redis_keys: totalUsers
      }
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
