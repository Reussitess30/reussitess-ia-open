import { Redis } from '@upstash/redis'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { telegramId, code } = req.body
  
  if (!telegramId || !code) return res.status(400).json({ error: 'telegramId et code requis' })

  try {
    const redis = Redis.fromEnv()
    
    // Vérifier le code
    const codeData = await redis.get(`code:${code.toUpperCase()}`)
    if (!codeData) return res.status(400).json({ error: 'Code invalide ou expiré' })
    
    const parsed = typeof codeData === 'string' ? JSON.parse(codeData) : codeData
    
    // Activer pour ce telegramId
    await redis.set(`premium:${telegramId}`, JSON.stringify({
      status: 'active',
      code: code.toUpperCase(),
      telegramId,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
    }), { ex: 31 * 24 * 60 * 60 })

    // Notifier Telegram
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (token && telegramId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId,
          parse_mode: 'Markdown',
          text: `👑 *REUSSITESS PREMIUM ACTIVÉ !*\n\n✅ Accès débloqué pour 31 jours\n\n10 modules disponibles :\n🧬 ADN de Réussite\n💼 Architecte de Fortune\n🎯 Négociateur Caribéen\n🌐 Traducteur de Succès\n🏗️ Bâtisseur d\'Empire\n🛡️ Bouclier Juridique\n🧠 Mindset Champions\n🌱 Entrepreneur Social\n📡 Intelligence Stratégique\n👑 Passeport Excellence\n\nBoudoum ! 🇬🇵`
        })
      })
    }

    return res.status(200).json({ success: true, message: 'Premium activé pour 31 jours !' })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
