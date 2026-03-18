export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true })
  
  try {
    const { message } = req.body
    if (!message) return res.status(200).json({ ok: true })
    
    const chatId = message.chat.id
    const text = message.text || ''
    const token = process.env.TELEGRAM_BOT_TOKEN

    async function sendMsg(msg) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg.substring(0,4096), parse_mode: 'Markdown' })
      })
    }

    // Commandes spéciales
    if (text === '/start') {
      return await sendMsg(`🌟 *Bienvenue sur REUSSITESS AI* 🇬🇵

Né en Guadeloupe — Terres de Champions !

*Commandes disponibles :*
/meteo — Météo DOM-TOM
/bitcoin — Prix Bitcoin
/emploi — Offres emploi Guadeloupe
/actualites — Actualités DOM-TOM
/boutiques — 26 boutiques Amazon
/seismes — Séismes Antilles
/cyclones — Cyclones Atlantique
/reussshield — État système
/oracle — Oracle 971
/token — Token REUSS
/champions — Passeport de Réussite
/visa — Visa Universel
/quiz — Quiz caribéens
/bibliotheque — Bibliothèque mondiale

Ou pose-moi *n'importe quelle question* !

Boudoum ! 🇬🇵`)
    }

    const COMMANDS = {
      '/meteo': 'météo Guadeloupe',
      '/bitcoin': 'prix bitcoin',
      '/emploi': 'liste emploi Guadeloupe',
      '/actualites': 'actualités Guadeloupe',
      '/boutiques': 'boutiques amazon 14 pays',
      '/seismes': 'séismes antilles',
      '/cyclones': 'cyclones atlantique',
      '/reussshield': 'reussshield',
      '/oracle': 'oracle 971 quel est mon destin',
      '/token': 'token REUSS blockchain supply',
      '/champions': 'passeport de réussite reussitess',
      '/visa': 'visa universel reussitess',
      '/quiz': 'quiz caribéen',
      '/bibliotheque': 'bibliothèque caribéenne',
      '/marées': 'marées Guadeloupe',
      '/devises': 'taux de change euro dollar',
      '/dashboard': 'dashboard stats',
    }

    const msgToSend = COMMANDS[text] || text
    if (!msgToSend) return res.status(200).json({ ok: true })

    // Envoyer indicateur de frappe
    await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, action: 'typing' })
    })

    // Appeler REUSSITESS AI
    const aiRes = await fetch('https://reussitess.fr/api/superbot/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msgToSend, langue: 'fr' })
    })
    const aiData = await aiRes.json()
    let response = aiData.response || 'Boudoum ! 🇬🇵'

    // Nettoyer markdown pour Telegram
    response = response
      .replace(/\*\*(.+?)\*\*/g, '*$1*')
      .replace(/#{1,3}\s/g, '*')
      .substring(0, 4096)

    await sendMsg(response)
    return res.status(200).json({ ok: true })

  } catch(e) {
    console.error('Telegram webhook:', e.message)
    return res.status(200).json({ ok: true })
  }
}
