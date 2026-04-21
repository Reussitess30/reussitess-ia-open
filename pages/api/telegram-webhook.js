/* 
 * © REUSSITESS®971 — Tous droits réservés
 * Auteur : Rony Porinus — Guadeloupe 🇬🇵
 * Protection INPI : DSO2026012614
 * Play Store : com.reussitess.twa
 * SHA-256 : 91:37:09:78:62:23:2A:BD:E5:FA:1E:93:B6:BC:5D:2A:5D:DF:8C:87:B2:D5:E2:1D:92:83:C1:07:92:F5:C3:8F
 * Site : https://reussitess.fr
 * Contact : influenceur@reussitess.fr
 * 
 * Reproduction, copie ou distribution interdite sans autorisation écrite.
 * Unauthorized copying, modification or distribution is strictly prohibited.
 */
// Reussitess971 DSO2026012614
/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */

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

    async function sendPhoto(chatId, photoUrl, caption, keyboard = null) {
    const payload = { chat_id: chatId, photo: photoUrl, caption: caption.substring(0, 1024), parse_mode: "Markdown" }
    if (keyboard) payload.reply_markup = keyboard
    await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  }

  async function typing(chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' })
      })
    }

    async function askAI(message, telegramId) {
      const aiRes = await fetch('https://reussitess.fr/api/superbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, langue: "fr", telegramId })
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
          { text: '📰 Actualités', callback_data: 'actualites outremer complet' },
          { text: '🌋 Séismes', callback_data: 'séismes antilles' }
        ],
        [
          { text: '🛍️ Boutiques', callback_data: 'boutiques amazon 14 pays' },
          { text: '💎 Token REUSS', callback_data: 'token REUSS blockchain supply' },
            { text: '📊 REUSS Live', callback_data: 'reuss live' },
            { text: '🏆 Top Holders', callback_data: 'transferts reuss' },
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
                          { text: '🌍 Écosystème REUSSITESS', callback_data: 'écosystème reussitess' }
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
                          { text: '⚖️ Droit DOM-TOM', callback_data: 'aide juridictionnelle dom-tom' },
                    { text: '💰 Finance', callback_data: 'épargne investissement dom-tom' },
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
                          { text: '📊 Observatoire', callback_data: 'observatoire antilles' },
                          { text: '🎓 Bourses', callback_data: 'bourses francophones AUF' },
                          { text: '📅 Calendrier', callback_data: 'calendrier scolaire dom-tom' }
                  ],
                  [
                    { text: '🌊 Météo Marine', callback_data: 'météo marine guadeloupe' },
                    { text: '🏛️ Lieux Culturels', callback_data: 'lieux culturels guadeloupe' },
                    { text: '🧠 Santé Mentale', callback_data: 'santé mentale dom-tom' }
                  ],
                  [
                    { text: '🎓 Éducation', callback_data: 'éducation guadeloupe' },
                    { text: '🗺️ Carnet Route', callback_data: 'carnet de route guadeloupe' },
                    { text: '💼 Métiers', callback_data: 'métiers dom-tom' }
                  ],
                  [
                    { text: '📊 Finance', callback_data: 'analyse financière' },
                    { text: '⚖️ Entreprise', callback_data: 'créer entreprise guadeloupe' },
                    { text: '🗣️ Créole', callback_data: 'dictionnaire créole' }
                  ],
                  [
                    { text: '🌿 Médecine Naturelle', callback_data: 'médecine naturelle caribéenne' },
                    { text: '🌍 Traduction', callback_data: 'traduis bonjour en anglais' },
                    { text: '🏝️ DOM-TOM Info', callback_data: 'dom-tom guadeloupe' }
                  ],
                  [
                    { text: '🧠 Émotion', callback_data: 'je suis fatigué et découragé' },
            { text: '📱 Génère Post', callback_data: 'génère post sur la Guadeloupe' },
            { text: '📚 Négritude', callback_data: 'parle-moi de la négritude' }
          ],
          [
            { text: '🔢 Calculateur IMC', callback_data: 'calculateur imc' },
            { text: '🌟 Horoscope', callback_data: 'horoscope du jour' },
            { text: '🛸 Quantum Nexus', callback_data: 'agents ia' }
          ],
          [
            { text: '⛓️ Blockchain', callback_data: 'dashboard crypto' },
                    { text: '🌋 Séismes Historiques', callback_data: 'séismes historiques caraïbes' },
                    { text: '🗺️ Carnet Route', callback_data: 'carnet de route guadeloupe' }
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
      const langue = 'fr'

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
        '📰 Actualités': 'actualites outremer complet',
        '🌋 Séismes': 'séismes antilles',
        '🛍️ Boutiques': 'boutiques amazon 14 pays',
      '🎵 Musique': 'deezer zouk guadeloupe',
      '🎙️ Podcast': 'podcast guadeloupe',
      '🔐 Crypto': 'crypto securite draineur danger',
        '💎 REUSS': 'token REUSS blockchain supply',
        '🔮 Oracle': 'oracle 971 quel est mon destin',
        '🌊 Météo Marine': 'météo marine guadeloupe',
        '🏛️ Lieux Culturels': 'lieux culturels guadeloupe',
        '🧠 Santé Mentale': 'santé mentale dom-tom',
        '🎓 Éducation': 'éducation guadeloupe',
        '🗺️ Carnet Route': 'carnet de route guadeloupe',
        '💼 Métiers': 'métiers dom-tom',
        '📊 Finance': 'analyse financière',
        '⚖️ Entreprise': 'créer entreprise guadeloupe',
        '🗣️ Créole': 'dictionnaire créole',
      }

    if (text === '/premium') {
      const subRes = await fetch('https://reussitess.fr/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: message.from?.id })
      })
      const subData = await subRes.json()
      if (subData.url) {
        return await sendMsg(chatId, '💎 *REUSSITESS Premium 4,99EUR/mois*\n\n✅ Agents IA spécialisés\n🧠 Mémoire longue\n💰 Crypto expert\n🌍 Visa et Business\n\nClique pour souscrire 👇', {
          inline_keyboard: [[{ text: '💳 Souscrire 4,99EUR/mois', url: subData.url }]]
        })
      }
      return await sendMsg(chatId, '⚠️ Erreur paiement. Reessaie.')
    }
      const msgToSend = TEXT_COMMANDS[text] || text
      await typing(chatId)
      const response = await askAI(msgToSend, message.from?.id)
      const nasaMatch = response.match(/🔗 (https?:\/\/[^\s\n]+\.(jpg|jpeg|png|gif))/i)
      if (nasaMatch) {
        const caption = response.replace(nasaMatch[0], "").trim()
        await sendPhoto(chatId, nasaMatch[1], caption, { inline_keyboard: [[{ text: "🔄 Menu Principal", callback_data: "menu" }]] })
      } else {
        // Ajouter bouton partage
const shareKeyboard = {
  inline_keyboard: [[
    { text: '🔄 Menu Principal', callback_data: 'menu' },
    { text: '📤 Partager le bot', url: 'https://t.me/share/url?url=https://t.me/Reussitessbot&text=Découvre%20REUSSITESS%20AI%20🇬🇵%20le%20bot%20AfroCaraïbéen%20%21%20BOUDOUM%20!' }
  ]]
}
await sendMsg(chatId, response, { inline_keyboard: [[{ text: "🔄 Menu Principal", callback_data: "menu" }]] })
      }
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



      if (data === 'quiz_menu') {
        return await sendMsg(chatId, '🎯 *Quiz REUSSITESS — Choisis ton thème !*\n\nHistoire, Culture, Sciences, Crypto, Afrique, Amazon, Sport...\n\nTape le nom du quiz:\nEx: *quiz Histoire* ou *quiz Afrique*', {
          inline_keyboard: [
            [{ text: '🌍 Quiz Afrique', callback_data: 'quiz_Afrique' }, { text: '📚 Quiz Histoire', callback_data: 'quiz_Histoire' }],
            [{ text: '💰 Quiz Amazon', callback_data: 'quiz_Amazon' }, { text: '🔬 Quiz Sciences', callback_data: 'quiz_Sciences' }],
            [{ text: '🏆 Mon Score', callback_data: 'quiz_score' }]
          ]
        })
      }

      if (data === 'quiz_score') {
        const scoreRes = await fetch('https://reussitess.fr/api/quiz/engine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'score', userId: chatId })
        })
        const scoreData = await scoreRes.json()
        const history = scoreData.quizzes?.slice(0, 3).map(q => `• ${q.title}: ${q.score}/${q.total} (${q.percentage}%)`).join('\n') || 'Aucun quiz joué'
        return await sendMsg(chatId, `🏆 *Ton Score REUSSITESS*\n\n⭐ Total: ${scoreData.totalPoints || 0} pts\n\n${history}\n\nBoudoum ! 🇬🇵`)
      }

      if (data.startsWith('quiz_')) {
        const quizId = data.replace('quiz_', '')
        const quizRes = await fetch('https://reussitess.fr/api/quiz/engine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start', userId: chatId, quizId })
        })
        const quizData = await quizRes.json()
        if (quizData.error) return await sendMsg(chatId, '❌ Quiz non trouvé. Tape *jouer quiz* pour voir les thèmes.')
        const q = quizData.question
        return await sendMsg(chatId, `🎯 *${q.quizTitle}* — Q1/${q.total}\n\n❓ ${q.text}`, {
          inline_keyboard: q.answers.map((a, i) => [{ text: ['A','B','C'][i] + ') ' + a, callback_data: `qans_${['a','b','c'][i]}` }])
        })
      }

      if (data.startsWith('qans_')) {
        const ansMap = { 'qans_a': 0, 'qans_b': 1, 'qans_c': 2 }
        const answerIndex = ansMap[data]
        const quizRes = await fetch('https://reussitess.fr/api/quiz/engine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'answer', userId: chatId, answerIndex })
        })
        const quizData = await quizRes.json()

        if (quizData.action === 'finished') {
          const r = quizData.result
          const medal = r.percentage >= 80 ? '🥇' : r.percentage >= 60 ? '🥈' : '🥉'
          return await sendMsg(chatId, `${quizData.lastQuestion.correct ? '✅' : '❌'} ${quizData.lastQuestion.correctAnswer}\n📖 ${quizData.lastQuestion.explanation}\n\n${medal} *Score: ${r.score}/${r.total} (${r.percentage}%)*\n⭐ +${r.points} pts\n🏆 Total: ${r.totalPoints} pts\n\nBoudoum ! 🇬🇵`, {
            inline_keyboard: [[{ text: '🎯 Rejouer', callback_data: 'quiz_menu' }, { text: '🏠 Menu', callback_data: 'menu' }]]
          })
        }

        if (quizData.action === 'question') {
          const fb = quizData.feedback
          const q = quizData.question
          return await sendMsg(chatId, `${fb.correct ? '✅' : '❌'} ${fb.correctAnswer}\n📖 ${fb.explanation}\n\n❓ Q${q.index+1}/${q.total} — Score: ${q.score}\n\n${q.text}`, {
            inline_keyboard: q.answers.map((a, i) => [{ text: ['A','B','C'][i] + ') ' + a, callback_data: `qans_${['a','b','c'][i]}` }])
          })
        }
      }

      if (data === 'premium_menu') {
        return await sendMsg(chatId, '👑 *REUSSITESS PREMIUM*\n\n🌍 Traducteur Créole IA\n💰 Comparateur Transfert Argent\n📋 Générateur CV + Dossier Admin\n🛂 Assistant Visa 14 pays\n🧠 Coach IA Mémoire Longue\n\n4,99€/mois — Sans engagement', {
          inline_keyboard: [
            [{ text: '🌍 Traducteur Créole', callback_data: 'pm_creole' }, { text: '💰 Transfert Argent', callback_data: 'pm_transfert' }],
            [{ text: '📋 CV + Admin', callback_data: 'pm_cv' }, { text: '🛂 Visa', callback_data: 'pm_visa' }],
            [{ text: '🧠 Coach IA', callback_data: 'pm_coach' }],
            [{ text: '💳 Souscrire 4,99€/mois', callback_data: 'premium' }]
          ]
        })
      }

      if (['pm_creole','pm_transfert','pm_cv','pm_visa','pm_coach'].includes(data)) {
        const demos = {
          pm_creole: '🌍 *Traducteur Créole IA*\n\nExemple:\nFR: "Je t amour beaucoup"\nCréole GWA: "An rinmé w anpil"\nCréole HAI: "Mwen renmen ou anpil"\n\n👑 *Fonctionnalité Premium*\nTraduis en temps réel Français/Anglais vers Créole Guadeloupéen, Martiniquais, Haïtien, Jamaïcain.',
          pm_transfert: '💰 *Comparateur Transfert Argent*\n\nExemple pour 300€ vers Guadeloupe:\n1. Wise: 298,50€ reçus (frais 1,50€)\n2. Remitly: 295€ reçus (frais 5€)\n3. Western Union: 288€ reçus (frais 12€)\n\n👑 *Fonctionnalité Premium*\nÉconomise jusqu à 8% sur chaque transfert.',
          pm_cv: '📋 *Générateur CV + Dossier Admin*\n\nGénère:\n• CV professionnel adapté France/Canada/DOM-TOM\n• Lettre de motivation\n• Dossier CAF/RSA/APL\n• Demande logement social\n\n👑 *Fonctionnalité Premium*',
          pm_visa: '🛂 *Assistant Visa 14 Pays*\n\nCanada, USA, UK, Schengen, Caraïbes...\nDocuments requis, délais, frais\nÉtape par étape selon ta nationalité\n\n👑 *Fonctionnalité Premium*',
          pm_coach: '🧠 *Coach IA Mémoire Longue*\n\nTon IA se souvient de toi:\n• Tes projets et objectifs\n• Ta situation personnelle\n• Tes préférences\n\nComme un mentor 24h/24\n\n👑 *Fonctionnalité Premium*'
        }
        return await sendMsg(chatId, demos[data], {
          inline_keyboard: [[{ text: '💳 Souscrire 4,99€/mois', callback_data: 'premium' }],
          [{ text: '◀️ Menu Premium', callback_data: 'premium_menu' }]]
        })
      }
      
      if (data === 'communauté reussitess forum' || data === 'communaute') {
        return await sendMsg(chatId, '🤝 *COMMUNAUTE REUSSITESS*\n\nRejois le reseau afro-caribeen !\n\n📺 Live Kick - Stream en direct\n💬 Discussions thematiques\n🌴 Entrepreneuriat, Culture, IA, Creole\n\nBOUDOUM 🥁', {
          inline_keyboard: [
            [{ text: '📺 Rejoindre le Live Kick', url: 'https://reussitess.fr/communaute' }],
            [{ text: '◀️ Menu', callback_data: 'menu' }]
          ]
        })
      }

      if (data === 'coach' || data === 'coach de vie') {
        return await sendMsg(chatId, '💪 *COACH DE VIE REUSSITESS*\n\nTon defi quotidien caribeen\n\n🔥 Streak journalier\n💎 Recompenses REUSS tokens\n🎯 Profils : Entrepreneur, Etudiant, Sportif, General\n🌴 Defis inspires de la culture caribeenne\n\nDeviens un Champion - Te a chanpion yo', {
          inline_keyboard: [
            [{ text: '💪 Acceder au Coach de Vie', url: 'https://reussitess.fr/coach' }],
            [{ text: '◀️ Menu', callback_data: 'menu' }]
          ]
        })
      }

      if (data === 'menu') {
        return await sendMsg(chatId, '🌟 *Menu REUSSITESS AI*', { inline_keyboard: MAIN_MENU.inline_keyboard })
      }

      await typing(chatId)
      const response = await askAI(data, callback.message.chat.id)
      const nasaMatch = response.match(/🔗 (https?:\/\/[^\s\n]+\.(jpg|jpeg|png|gif))/i)
      if (nasaMatch) {
        const caption = response.replace(nasaMatch[0], "").trim()
        await sendPhoto(chatId, nasaMatch[1], caption, { inline_keyboard: [[{ text: "🔄 Menu Principal", callback_data: "menu" }]] })
      } else {
        await sendMsg(chatId, response, { inline_keyboard: [[{ text: "🔄 Menu Principal", callback_data: "menu" }]] })
      }
    }

    return res.status(200).json({ ok: true })
  } catch(e) {
    console.error('Telegram webhook:', e.message)
    return res.status(200).json({ ok: true })
  }
}
