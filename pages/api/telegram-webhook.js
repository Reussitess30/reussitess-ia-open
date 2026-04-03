export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true })
  
  try {
    const body = req.body
    const token = process.env.TELEGRAM_BOT_TOKEN

    async function sendMsg(chatId, msg, keyboard = null) {
      const payload = {
        chat_id: chatId,
        text: msg.substring(0, 4096),
        parse_mode: 'Markdown'
      }
      if (keyboard) payload.reply_markup = keyboard
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
    }

    async function typing(chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' })
      })
    }

    async function askAI(message) {
      const aiRes = await fetch('https://reussitess.fr/api/superbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, langue: 'fr' })
      })
      const d = await aiRes.json()
      return (d.response || 'Boudoum ! 🇬🇵')
        .replace(/\*\*(.+?)\*\*/g, '*$1*')
        .replace(/#{1,3}\s/g, '')
        .substring(0, 4096)
    }

    // Menu principal inline
    const MAIN_MENU = {
      inline_keyboard: [
        [
          { text: '🌤️ Météo', callback_data: 'météo Guadeloupe' },
          { text: '₿ Bitcoin', callback_data: 'prix bitcoin' },
          { text: '💱 Devises', callback_data: 'taux de change euro dollar' }
        ],
        [
          { text: '💼 Emploi', callback_data: 'liste emploi Guadeloupe' },
          { text: '📰 Actualités', callback_data: 'actualités Guadeloupe' },
          { text: '🌋 Séismes', callback_data: 'séismes antilles' }
        ],
        [
          { text: '🛍️ Boutiques', callback_data: 'boutiques amazon 14 pays' },
          { text: '💎 Token REUSS', callback_data: 'token REUSS blockchain supply' },
          { text: '🔮 Oracle', callback_data: 'oracle 971 quel est mon destin' }
        ],
        [
          { text: '🏆 Champions', callback_data: 'passeport de réussite' },
          { text: '🛡️ Shield', callback_data: 'reussshield' },
          { text: '🌊 Marées', callback_data: 'marées Guadeloupe' }
        ],
        [
          { text: '📚 Bibliothèque', callback_data: 'bibliothèque caribéenne' },
          { text: '🎯 Quiz', callback_data: 'quiz caribéen' },
          { text: '🥗 Nutrition', callback_data: 'nutrition banane' }
        ],
        [
          { text: '🌙 Lune', callback_data: 'phase de la lune' },
          { text: '🛸 ISS', callback_data: 'position ISS station spatiale' },
          { text: '⛽ Carburant', callback_data: 'prix carburant guadeloupe' }
        ],
        [
          { text: '🎵 Zouk', callback_data: 'deezer zouk guadeloupe' },
          { text: '🎙️ Podcast', callback_data: 'podcast guadeloupe' },
          { text: '🌀 Cyclones', callback_data: 'cyclones atlantique' }
        ],
        [
          { text: '🔐 Crypto Sécurité', callback_data: 'crypto securite draineur danger' },
          { text: '😂 Blague', callback_data: 'raconte moi une blague' },
          { text: '📊 Dashboard', callback_data: 'dashboard stats' }
                        ],
                        [
                          { text: '🎶 Musique Afro-Caribéenne', callback_data: 'musique afro-caribéenne' },
                          { text: '🥁 Gwoka & Festivals', callback_data: 'festival gwoka' },
                          { text: '📅 Événements', callback_data: 'événements' }
                        ],
                        [
                          { text: '🌍 Écosystème REUSSITESS', callback_data: 'écosystème reussitess' }
                        ],
                        [
                          { text: '🎓 Académie', callback_data: 'académie cours gratuits' },
                          { text: '🛒 Marketplace', callback_data: 'marketplace caribéen produits' },
                          { text: '📻 Radio', callback_data: 'radio caribéenne live' }
                        ],
                        [
                          { text: '🤝 Communauté', callback_data: 'communauté reussitess forum' },
                          { text: '🎙️ Podcasts', callback_data: 'podcast caribéen' },
                          { text: '🗺️ Carte', callback_data: 'carte caribéenne lieux historiques' }
                        ],
                        [
                          { text: '🗺️ Carte Caribéenne', callback_data: 'carte caribéenne lieux historiques' },
                          { text: '📅 Événements', callback_data: 'événements afro-caribéens' },
                          { text: '🎙️ Podcasts', callback_data: 'podcast caribéen' }
                        ],
                        [
                          { text: '🚀 NASA', callback_data: 'photo nasa du jour' },
                          { text: '☀️ Lever Soleil', callback_data: 'lever soleil guadeloupe' },
                          { text: '📺 TV', callback_data: 'programme tv caribbean' },
                          { text: '📊 Observatoire', callback_data: 'observatoire antilles' }
                        ],
                        [
                          { text: '🚀 NASA Photo', callback_data: 'photo nasa du jour' },
                          { text: '☀️ Lever Soleil', callback_data: 'lever soleil guadeloupe' },
                          { text: '📺 Programmes TV', callback_data: 'programme tv caribbean' }
                        ],
                        [
                          { text: '📊 Observatoire', callback_data: 'observatoire antilles' },
                          { text: '🎓 Bourses', callback_data: 'bourses francophones AUF' },
                          { text: '📅 Calendrier', callback_data: 'calendrier scolaire dom-tom' }
        ]
      ]
    }

    // Menu persistant en bas
    const PERSISTENT_MENU = {
      keyboard: [
        ['🌤️ Météo', '₿ Bitcoin', '💱 Devises'],
        ['💼 Emploi', '📰 Actualités', '🌋 Séismes'],
        ['🛍️ Boutiques', '💎 REUSS', '🔮 Oracle'],
        ['🏠 Menu Principal']
      ],
      resize_keyboard: true,
      persistent: true
    }

    // Gestion message normal
    if (body.message) {
      const message = body.message
      const chatId = message.chat.id
      const text = message.text || ''
      const firstName = message.from?.first_name || 'Champion'

      // Détecter langue
      const langue = text.match(/[a-zA-ZÀ-ÿ]/) ? 'fr' : 'fr'

      if (text === '/start') {
        await sendMsg(chatId, `🌟 *Bienvenue ${firstName} sur REUSSITESS AI* 🇬🇵

Né en Guadeloupe — Terres de Champions !

Je suis ton assistant IA caribéen avec *120+ fonctionnalités* :
• 📡 Données temps réel
• 💼 Emploi DOM-TOM
• 🛍️ 26 boutiques Amazon
• 💎 Token REUSS Polygon
• 📰 Actualités DOM-TOM
• 🌋 Séismes & Cyclones
• 🔮 Oracle 971

Utilise les boutons ci-dessous ou pose-moi *n'importe quelle question* !

Boudoum ! 🇬🇵`, { inline_keyboard: MAIN_MENU.inline_keyboard })
        
        // Activer menu persistant
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: '⬇️ Menu rapide toujours disponible',
            reply_markup: PERSISTENT_MENU
          })
        })
        return res.status(200).json({ ok: true })
      }

      if (text === '/menu' || text === '🏠 Menu Principal') {
        return await sendMsg(chatId, '🌟 *Menu REUSSITESS AI*', { inline_keyboard: MAIN_MENU.inline_keyboard })
      }

      // Commandes texte du menu persistant
      const TEXT_COMMANDS = {
        '🌤️ Météo': 'météo Guadeloupe',
        '₿ Bitcoin': 'prix bitcoin',
        '💱 Devises': 'taux de change euro dollar',
        '💼 Emploi': 'liste emploi Guadeloupe',
        '📰 Actualités': 'actualités Guadeloupe',
        '🌋 Séismes': 'séismes antilles',
        '🛍️ Boutiques': 'boutiques amazon 14 pays',
      '🎵 Musique': 'deezer zouk guadeloupe',
      '🎙️ Podcast': 'podcast guadeloupe',
      '🔐 Crypto': 'crypto securite draineur danger',
        '💎 REUSS': 'token REUSS blockchain supply',
        '🔮 Oracle': 'oracle 971 quel est mon destin',
      }

      const msgToSend = TEXT_COMMANDS[text] || text
      await typing(chatId)
      const response = await askAI(msgToSend)
      await sendMsg(chatId, response, { inline_keyboard: [[{ text: '🔄 Menu Principal', callback_data: 'menu' }]] })
    }

    // Gestion callback (boutons inline)
    if (body.callback_query) {
      const callback = body.callback_query
      const chatId = callback.message.chat.id
      const data = callback.data

      // Répondre au callback
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: callback.id, text: '⏳ Chargement...' })
      })

      if (data === 'menu') {
        return await sendMsg(chatId, '🌟 *Menu REUSSITESS AI*', { inline_keyboard: MAIN_MENU.inline_keyboard })
      }

      await typing(chatId)
      const response = await askAI(data)
      await sendMsg(chatId, response, { inline_keyboard: [[{ text: '🔄 Menu Principal', callback_data: 'menu' }]] })
    }

    return res.status(200).json({ ok: true })
  } catch(e) {
    console.error('Telegram webhook:', e.message)
    return res.status(200).json({ ok: true })
  }
}
