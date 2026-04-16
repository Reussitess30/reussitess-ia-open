import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { userId, subscriptionId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId requis' })

  try {
    const redis = Redis.fromEnv()
    
    // Vérifier subscription PayPal
    const auth = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })
    const { access_token } = await auth.json()

    let status = 'manual'
    if (subscriptionId && access_token) {
      const subRes = await fetch(`https://api.paypal.com/v1/billing/subscriptions/${subscriptionId}`, {
        headers: { 'Authorization': 'Bearer ' + access_token }
      })
      const sub = await subRes.json()
      status = sub.status
    }

    if (status === 'ACTIVE' || status === 'manual') {
      await redis.set(`premium:${userId}`, JSON.stringify({
        userId,
        subscriptionId: subscriptionId || 'manual',
        activatedAt: new Date().toISOString(),
        status: 'active',
        plan: 'premium_499'
      }), { ex: 35 * 24 * 60 * 60 })

      return res.status(200).json({ success: true, message: 'Premium activé 👑' })
    }

    return res.status(402).json({ error: 'Paiement non confirmé', paypalStatus: status })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
