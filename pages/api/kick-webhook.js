export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true })

  try {
    const event = req.body
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'
    const eventType = event?.event || event?.type || ''
    const data = event?.data || {}

    // ===== MOTS INTERDITS REUSSSHIELD =====
    const BANNED_WORDS = ['spam', 'scam', 'hack', 'arnaque', 'phishing', 'fake', 'virus', 'malware', 'porn', 'xxx']
    
    async function sendKickMessage(msg) {
      try {
        const { Redis } = await import('@upstash/redis')
        const redis = Redis.fromEnv()
        const accessToken = await redis.get('kick:access_token')
        if (!accessToken) return
        await fetch('https://kick.com/api/v2/channels/Reussitess/messages', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: msg.substring(0, 500) })
        })
      } catch(e) {}
    }

    async function sendTelegram(msg) {
      try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
        })
      } catch(e) {}
    }

    async function addReussPoints(username, points, reason) {
      try {
        const { Redis } = await import('@upstash/redis')
        const redis = Redis.fromEnv()
        const key = `kick:reuss:${username}`
        const existing = await redis.get(key)
        const current = existing ? JSON.parse(existing) : { username, points: 0, history: [] }
        current.points += points
        current.history.push({ points, reason, date: new Date().toISOString() })
        current.history = current.history.slice(-20)
        await redis.set(key, JSON.stringify(current), { ex: 365 * 24 * 60 * 60 })
        return current.points
      } catch(e) { return 0 }
    }

    // ===== CHAT MESSAGE =====
    if (eventType === 'chat_message' || data?.content) {
      const msg = data?.content || ''
      const user = data?.sender?.username || 'Anonyme'
      const msgLow = msg.toLowerCase()

      // REUSSSHIELD — détection spam
      const isBanned = BANNED_WORDS.some(w => msgLow.includes(w))
      if (isBanned) {
        await sendKickMessage(`⚠ @${user} Message supprimé par REUSSSHIELD. Respect des règles REUSSITESS ! 🛡`)
        await sendTelegram(`🛡 *REUSSSHIELD Kick*\n⚠ Message suspect de @${user}\nContenu: ${msg.substring(0, 100)}`)
        return res.status(200).json({ ok: true, action: 'moderated' })
      }

      // Commandes bot
      if (msgLow.startsWith('!boudoum')) {
        await sendKickMessage(`BOUDOUM ! 🇬🇵 @${user} — Positivité à l'infini ! REUSSITESS®971 est avec toi ! 🌟`)
      }
      else if (msgLow.startsWith('!reuss')) {
        try {
          const price = await fetch('https://api.dexscreener.com/latest/dex/tokens/' + CONTRACT)
            .then(r => r.json()).then(d => d?.pairs?.[0]?.priceUsd || 'N/A')
          await sendKickMessage(`💎 Token REUSS : $${price} | Polygon | 0xB375...EB2 | reussitess.fr/reuss-live BOUDOUM ! 🇬🇵`)
        } catch(e) { await sendKickMessage('💎 Token REUSS sur Polygon ! reussitess.fr/reuss-live BOUDOUM ! 🇬🇵') }
      }
      else if (msgLow.startsWith('!meteo')) {
        try {
          const m = await fetch('https://api.open-meteo.com/v1/forecast?latitude=16.2411&longitude=-61.5331&current_weather=true')
            .then(r => r.json())
          await sendKickMessage(`🌤 Météo Guadeloupe : ${m.current_weather?.temperature}°C | Vent: ${m.current_weather?.windspeed}km/h BOUDOUM ! 🇬🇵`)
        } catch(e) { await sendKickMessage('🌤 Météo indisponible. reussitess.fr BOUDOUM ! 🇬🇵') }
      }
      else if (msgLow.startsWith('!quiz')) {
        const quizzes = [
          'Quelle est la capitale de la Guadeloupe ? (Répondez !rep)',
          'En quelle année le Gwo Ka a été inscrit au patrimoine UNESCO ?',
          'Comment dit-on "merci" en créole guadeloupéen ?',
          'Quel est le volcan actif de la Guadeloupe ?',
          'Qui a fondé REUSSITESS®971 ?'
        ]
        const q = quizzes[Math.floor(Math.random() * quizzes.length)]
        await sendKickMessage(`🎯 QUIZ REUSSITESS ! @${user} : ${q} 🇬🇵`)
      }
      else if (msgLow.startsWith('!points')) {
        try {
          const { Redis } = await import('@upstash/redis')
          const redis = Redis.fromEnv()
          const data2 = await redis.get(`kick:reuss:${user}`)
          const pts = data2 ? JSON.parse(data2).points : 0
          await sendKickMessage(`💎 @${user} tu as ${pts} points REUSS ! Continue ainsi BOUDOUM ! 🇬🇵`)
        } catch(e) { await sendKickMessage(`💎 @${user} : 0 points REUSS pour l'instant. Abonne-toi pour gagner des points ! 🇬🇵`) }
      }
      else if (msgLow.startsWith('!top')) {
        await sendKickMessage(`🏆 Top REUSSITESS : reussitess.fr/champions | Gagne des points REUSS en t'abonnant ! BOUDOUM ! 🇬🇵`)
      }
      else if (msgLow.startsWith('!help') || msgLow.startsWith('!aide')) {
        await sendKickMessage(`🤖 Commandes REUSSITESS : !boudoum !reuss !meteo !quiz !points !top !aide | Site: reussitess.fr BOUDOUM ! 🇬🇵`)
      }
    }

    // ===== NOUVEL ABONNÉ =====
    else if (eventType === 'subscription' || eventType === 'new_subscription') {
      const user = data?.user?.username || data?.username || 'Champion'
      const totalPoints = await addReussPoints(user, 100, 'subscription')
      await sendKickMessage(`🎉 BIENVENUE @${user} dans la famille REUSSITESS®971 ! Tu gagnes +100 REUSS ! Total: ${totalPoints} pts 🇬🇵 BOUDOUM !`)
      await sendTelegram(`🎉 *Nouvel abonné Kick !*\n👤 @${user}\n💎 +100 REUSS attribués\n📊 Total: ${totalPoints} pts\nBoudoum ! 🇬🇵`)
    }

    // ===== GIFT SUBSCRIPTION =====
    else if (eventType === 'gift_subscription' || eventType === 'gifted_subscriptions') {
      const gifter = data?.gifter?.username || data?.username || 'Champion'
      const count = data?.gifts_count || data?.quantity || 1
      const points = count * 100
      const totalPoints = await addReussPoints(gifter, points, `gift_${count}_subs`)
      await sendKickMessage(`🎁 INCROYABLE ! @${gifter} offre ${count} abonnement(s) ! +${points} REUSS ! Total: ${totalPoints} pts CHAMPION REUSSITESS ! BOUDOUM ! 🇬🇵`)
      await sendTelegram(`🎁 *Gift Sub Kick !*\n👤 @${gifter} offre ${count} sub(s)\n💎 +${points} REUSS\n📊 Total: ${totalPoints} pts\nBoudoum ! 🇬🇵`)
    }

    // ===== NOUVEAU FOLLOWER =====
    else if (eventType === 'follow' || eventType === 'new_follower') {
      const user = data?.user?.username || data?.username || 'Nouveau follower'
      const totalPoints = await addReussPoints(user, 10, 'follow')
      await sendKickMessage(`❤ Merci @${user} pour le follow ! +10 REUSS ! Découvre REUSSITESS®971 : reussitess.fr BOUDOUM ! 🇬🇵`)
    }

    // ===== HOST/RAID =====
    else if (eventType === 'host' || eventType === 'raid') {
      const user = data?.host?.username || data?.username || 'Champion'
      const viewers = data?.viewers || data?.viewer_count || 0
      await sendKickMessage(`🚀 MERCI @${user} pour le host/raid avec ${viewers} viewers ! REUSSITESS®971 accueille tout le monde ! BOUDOUM ! 🇬🇵`)
      await sendTelegram(`🚀 *Host/Raid Kick !*\n👤 @${user}\n👥 ${viewers} viewers\nBoudoum ! 🇬🇵`)
    }

    // ===== STREAM START =====
    else if (eventType === 'stream_start' || eventType === 'livestream_started') {
      await sendTelegram(`🔴 *REUSSITESS est EN DIRECT sur Kick !*\n\n🎮 https://kick.com/Reussitess\n\nViens nous rejoindre ! BOUDOUM ! 🇬🇵`)
    }

    // ===== STREAM END =====
    else if (eventType === 'stream_end' || eventType === 'livestream_ended') {
      await sendTelegram(`⚫ *Stream terminé*\n\nMerci à tous les viewers REUSSITESS !\nRejoins-nous sur : reussitess.fr\nBoudoum ! 🇬🇵`)
    }

    return res.status(200).json({ ok: true })
  } catch(e) {
    console.error('Kick webhook:', e)
    return res.status(200).json({ ok: true })
  }
}
