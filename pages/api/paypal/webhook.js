import { Redis } from '@upstash/redis'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'REUSS-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const event = req.body
  const eventType = event.event_type

  try {
    const redis = Redis.fromEnv()

    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED' || eventType === 'PAYMENT.SALE.COMPLETED') {
      const subscriptionId = event.resource?.id || event.resource?.billing_agreement_id
      const customId = event.resource?.custom_id || event.resource?.subscriber?.custom_id

      if (customId) {
        // Générer code unique
        const code = generateCode()
        
        // Stocker premium + code dans Redis
        await redis.set(`premium:${customId}`, JSON.stringify({
          status: 'active',
          subscriptionId,
          code,
          activatedAt: new Date().toISOString(),
          plan: 'P-9HS41937PC944162RNHPZWMY'
        }), { ex: 35 * 24 * 60 * 60 })
        
        await redis.set(`code:${code}`, JSON.stringify({
          userId: customId,
          subscriptionId,
          createdAt: new Date().toISOString()
        }), { ex: 35 * 24 * 60 * 60 })

        // Envoyer code via Telegram
        const token = process.env.TELEGRAM_BOT_TOKEN
        if (token && customId && !isNaN(customId)) {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: customId,
              parse_mode: 'Markdown',
              text: `👑 *PAIEMENT REÇU — REUSSITESS PREMIUM*\n\nMerci pour ton abonnement !\n\n🔑 *Ton code d'activation :*\n\`${code}\`\n\n➡️ Va sur [reussitess.fr/premium](https://reussitess.fr/premium)\nEntre ton ID Telegram + ce code pour activer tes 10 modules.\n\nBoudoum ! 🇬🇵`
            })
          })
        }

        console.log('Premium activé:', customId, 'Code:', code)
      }
    }

    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED' || eventType === 'BILLING.SUBSCRIPTION.EXPIRED') {
      const customId = event.resource?.custom_id
      if (customId) await redis.del(`premium:${customId}`)
    }

    return res.status(200).json({ received: true })
  } catch(e) {
    console.error('Webhook error:', e)
    return res.status(500).json({ error: e.message })
  }
}
