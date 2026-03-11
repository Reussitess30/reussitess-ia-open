import { createClient } from 'redis'

export default async function handler(req, res) {
  let client
  try {
    client = createClient({ url: process.env.REDIS_URL })
    await client.connect()
    const count = await client.incr('reussitess_visitors')
    await client.disconnect()
    return res.status(200).json({ count })
  } catch(e) {
    if (client) await client.disconnect().catch(() => {})
    console.error('Redis error:', e.message)
    return res.status(200).json({ count: null })
  }
}
