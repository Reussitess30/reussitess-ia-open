import { Redis } from '@upstash/redis'

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'REUSS-'
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

async function sendEmail(to, code) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'REUSSITESS Premium <premium@reussitess.fr>',
        to: [to],
        subject: '👑 Ton code d activation REUSSITESS Premium',
        html: `
          <div style="background:#04060f;color:#fff;padding:40px;font-family:Georgia,serif;max-width:600px;margin:0 auto">
            <div style="text-align:center;margin-bottom:30px">
              <h1 style="color:#10b981;font-size:2rem">👑 REUSSITESS Premium</h1>
              <p style="color:#94a3b8">Bienvenue dans le cercle des Champions</p>
            </div>
            <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:16px;padding:30px;text-align:center;margin-bottom:30px">
              <p style="color:#94a3b8;margin-bottom:10px">Ton code d activation :</p>
              <div style="font-size:2rem;font-weight:900;color:#10b981;letter-spacing:0.2em;font-family:monospace">${code}</div>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:20px">
              <p style="color:#e2e8f0;font-weight:700;margin-bottom:10px">Comment activer :</p>
              <ol style="color:#94a3b8;line-height:2">
                <li>Va sur <a href="https://reussitess.fr/premium" style="color:#10b981">reussitess.fr/premium</a></li>
                <li>Entre ton ID Telegram</li>
                <li>Entre ce code : <strong style="color:#10b981">${code}</strong></li>
                <li>Clique sur Activer</li>
              </ol>
            </div>
            <div style="background:rgba(255,255,255,0.03);border-radius:12px;padding:20px;margin-bottom:20px">
              <p style="color:#e2e8f0;font-weight:700;margin-bottom:10px">Tes 10 modules :</p>
              <p style="color:#94a3b8;line-height:2">🧬 ADN de Reussite | 💼 Architecte de Fortune | 🎯 Negociateur Caribeen | 🌐 Traducteur de Succes | 🏗️ Batisseur d Empire | 🛡️ Bouclier Juridique | 🧠 Mindset Champions | 🌱 Entrepreneur Social | 📡 Intelligence Strategique | 👑 Passeport Excellence</p>
            </div>
            <div style="text-align:center;color:#475569;font-size:0.8rem">
              <p>REUSSITESS®971 — Terres de Champions 🇬🇵</p>
              <p>INPI DSO2026012614 — influenceur@reussitess.fr</p>
            </div>
          </div>
        `
      })
    })
    return res.ok
  } catch(e) {
    console.error('Email error:', e)
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const event = req.body
  const eventType = event.event_type
  try {
    const redis = Redis.fromEnv()
    if (eventType === 'BILLING.SUBSCRIPTION.ACTIVATED' || eventType === 'PAYMENT.SALE.COMPLETED') {
      const subscriptionId = event.resource?.id
      const customId = event.resource?.custom_id || event.resource?.subscriber?.custom_id
      const payerEmail = event.resource?.subscriber?.email_address || event.resource?.payer?.email_address

      if (customId) {
        const code = generateCode()
        await redis.set("premium:" + customId, JSON.stringify({
          status: 'active', subscriptionId, code,
          activatedAt: new Date().toISOString()
        }), { ex: 35*24*60*60 })
        await redis.set("code:" + code, JSON.stringify({
          userId: customId, subscriptionId, createdAt: new Date().toISOString()
        }), { ex: 35*24*60*60 })

        // Envoyer Telegram
        const token = process.env.TELEGRAM_BOT_TOKEN
        if (token && !isNaN(customId)) {
          await fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: customId, parse_mode: 'Markdown',
              text: "👑 *PAIEMENT RECU — REUSSITESS PREMIUM*\n\n🔑 Ton code : `" + code + "`\n\nVa sur reussitess.fr/premium, entre ton ID + ce code.\n\nBoudoum ! 🇬🇵"
            })
          })
        }

        // Envoyer Email
        if (payerEmail) {
          await sendEmail(payerEmail, code)
        }

        console.log('Premium:', customId, 'Code:', code, 'Email:', payerEmail)
      }
    }
    if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') {
      const customId = event.resource?.custom_id
      if (customId) await redis.del("premium:" + customId)
    }
    return res.status(200).json({ received: true })
  } catch(e) {
    console.error('Webhook error:', e)
    return res.status(500).json({ error: e.message })
  }
}
