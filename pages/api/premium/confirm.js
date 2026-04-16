import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { subscriptionId, telegramId } = req.body

  try {
    const redis = Redis.fromEnv()

    // Activer premium
    await redis.set(`premium:${telegramId}`, JSON.stringify({
      subscriptionId,
      telegramId,
      activatedAt: new Date().toISOString(),
      status: 'active'
    }), { ex: 35 * 24 * 60 * 60 })

    // Notifier via Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (token && telegramId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId,
          parse_mode: 'Markdown',
          text: '👑 *BIENVENUE PREMIUM REUSSITESS !*\n\n✅ Ton abonnement est actif !\n\nTes 5 outils exclusifs sont débloqués:\n🌍 Traducteur Créole\n💰 Comparateur Transfert\n📋 CV + Admin\n🛂 Visa\n🧠 Coach IA\n\nTape /premium pour accéder. Boudoum ! 🇬🇵'
        })
      })
    }

    return res.status(200).json({ success: true })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
