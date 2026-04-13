// ===== REUSSITESS — SERVICE MÉMOIRE =====

let _redisClient = null

export async function getRedisClient() {
  if (_redisClient) return _redisClient
  try {
    const { createClient } = await import('redis')
    _redisClient = createClient({ url: process.env.REDIS_URL })
    _redisClient.on('error', () => { _redisClient = null })
    await _redisClient.connect()
    return _redisClient
  } catch(e) { return null }
}

export async function saveConversation(userId, message, response) {
  try {
    const redis = await getRedisClient()
    if (!redis) return
    const key = `conv:${userId}`
    const existing = await redis.get(key)
    const history = existing ? JSON.parse(existing) : []
    history.push({ user: message.substring(0, 200), bot: response.substring(0, 300), ts: new Date().toISOString() })
    await redis.set(key, JSON.stringify(history.slice(-20)), { EX: 30 * 24 * 60 * 60 })
  } catch(e) {}
}

export async function getConversation(userId) {
  try {
    const redis = await getRedisClient()
    if (!redis) return []
    const data = await redis.get(`conv:${userId}`)
    return data ? JSON.parse(data) : []
  } catch(e) { return [] }
}

export async function saveUserProfile(userId, update) {
  try {
    const redis = await getRedisClient()
    if (!redis) return
    const existing = await redis.get(`profile:${userId}`)
    const profile = existing ? JSON.parse(existing) : { langue: 'fr', visites: 0, badges: [], interets: [] }
    const newProfile = { ...profile, ...update, lastSeen: new Date().toISOString() }
    newProfile.visites = (profile.visites || 0) + 1
    await redis.set(`profile:${userId}`, JSON.stringify(newProfile), { EX: 90 * 24 * 60 * 60 })
    return newProfile
  } catch(e) { return null }
}

export async function getUserProfile(userId) {
  try {
    const redis = await getRedisClient()
    if (!redis) return { langue: 'fr', visites: 0, badges: [] }
    const data = await redis.get(`profile:${userId}`)
    return data ? JSON.parse(data) : { langue: 'fr', visites: 0, badges: [] }
  } catch(e) { return { langue: 'fr', visites: 0, badges: [] } }
}

export async function saveSatisfaction(userId, message, response) {
  try {
    const redis = await getRedisClient()
    if (!redis) return
    const key = `satisfaction:${new Date().toISOString().substring(0,10)}`
    const existing = await redis.get(key)
    const data = existing ? JSON.parse(existing) : { total: 0, count: 0 }
    data.total += response.length > 100 ? 1 : 0.5
    data.count++
    await redis.set(key, JSON.stringify(data), { EX: 30 * 24 * 60 * 60 })
  } catch(e) {}
}
