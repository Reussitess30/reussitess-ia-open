
// ============================================
// LIVRE BLANC REUSSITESS® — DONNÉES OFFICIELLES
// ============================================
const whitepaperData = {
  // RÉEL ET OPÉRATIONNEL ✅
  reel: {
    token: {
      nom: "REUSSITESS Token",
      symbole: "REUSS",
      standard: "ERC-20 + ERC20Burnable",
      blockchain: "Polygon (POS)",
      contrat: "0xB37531727fC07c6EED4f97F852A115B428046EB2",
      supply: "999 999 999 REUSS (1 brûlé symboliquement)",
      pool: "QuickSwap V3 — REUSS/POL",
      reserve: "0xbe8777aB450937bf107090F4F5F7c4834Db079cF",
      holders: "20 personnes (phase amorçage)",
      polygonscan: "polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2"
    },
    plateforme: {
      site: "reussitess.fr",
      quiz: "50 catégories en 6 langues (FR, EN, ES, PT, Créole, AR)",
      languebot: "LanguageBot — lecture vocale 6 langues",
      amazon: "26 boutiques dans 14 pays — tag: ronyporinu0ac-21",
      pays_amazon: ["USA", "France", "Allemagne", "Italie", "Espagne", "Canada", "UK", "Australie", "Belgique", "Inde", "Pays-Bas", "Suède", "Singapour", "Brésil"],
      gomining: "gomining.com/?ref=OT3GI2U — Minage Bitcoin cloud (revenus variables selon marché)",
      agents_ia: "200 agents IA (1 Suprême, 99 Nexus, 60 Neuro-X, 40 Sentinelles)",
      fondateur: "Rony Porinus — Guadeloupe, France",
    },
    tokenomics: {
      reserve_treasury: "~978 000 000 REUSS (97.9%)",
      fondateur: "~26 000 000 REUSS (2.6%)",
      acheteurs: "~7 500 000 REUSS (0.75%)",
      burned: "1 REUSS (symbolique — philosophie excellence infinie)"
    },
    gamma: {
      gamma1: "Récompenses communautaires REUSS financées par les revenus de l'écosystème",
      gamma2: "Quiz rewards : 1 000 à 50 000 REUSS selon niveau",
      gamma3: "Staking : APR 10-20% pour holders stakés"
    },
    tiers: {
      bronze: "Récompenses 3% — fonctions de base",
      silver: "Récompenses 8% — NEURO-X standard",
      gold: "Récompenses 15% — NEURO-X avancé + priorité",
      platinum: "Récompenses 20% — accès complet + gouvernance"
    },
    securite: {
      gas: "REQUIRE_OWNER_APPROVAL: true — aucun agent IA ne peut utiliser le gas sans validation humaine",
      sentinelles: "40 Sentinelles IA surveillent contrat, pool, réserve et boutiques"
    }
  },
  // EN PRÉVISION — PAS ENCORE RÉALISÉ ⏳
  prevision: {
    t1_2026: {
      holders_objectif: "1 000 holders",
      tvl_objectif: "$20 000",
      prix_objectif: "$0.0001",
      volume_objectif: "$1 000/jour",
      revenus_objectif: "5 000€/mois"
    },
    t2_t3_2026: {
      holders_objectif: "10 000 holders",
      tvl_objectif: "$100 000",
      prix_objectif: "$0.001",
      revenus_objectif: "15 000€/mois"
    },
    t4_2026: {
      holders_objectif: "100 000 holders",
      tvl_objectif: "$1 000 000",
      prix_objectif: "$0.01",
      listing: "CoinGecko, CoinMarketCap, CEX tier 2",
      revenus_objectif: "50 000€/mois",
      equipe: "5 à 10 personnes"
    },
    conformite: {
      psan: "Enregistrement AMF en cours",
      mica: "Whitepaper MiCA-compliant en préparation",
      kyc_aml: "Procédures KYC/AML pour gros volumes — à venir",
      budget: "45 000€ setup + 75 000€/an récurrent"
    },
    multisig: "Migration ownership vers wallet multi-signature 3/5 — recommandée"
  }
}

function getWhitepaperResponse(message) {
  const msg = message.toLowerCase()
  

  // PRÉSENTATION COMPLÈTE DU PROJET
  if (msg.includes('présente') || msg.includes('presente') || msg.includes('ensemble') || msg.includes('projet') || msg.includes('reussitess971') || msg.includes('tout ce que') || msg.includes('cest quoi')) {
    return `🌍 **REUSSITESS®971 — Écosystème Complet**
Fondateur : Rony Porinus • Guadeloupe 🇬🇵 • BOUDOUM !

━━━━━━━━━━━━━━━━━━━━━━━━━
💎 **TOKEN REUSS** — Blockchain Polygon
• Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2
• Supply : 999 999 999 REUSS
• DEX : QuickSwap V3
• 🔗 polygonscan.com/token/0xB375...46EB2
• 🔗 dexscreener.com — chart live

━━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ **RÉSEAU AMAZON** — 26 boutiques • 14 pays
• 🇫🇷 amazon.fr/shop/amourguadeloupe
• 🇺🇸 amazon.com/shop/amourguadeloupe
• 🇩🇪 amazon.de/shop/amourguadeloupe
• 🇬🇧 amazon.co.uk/shop/amourguadeloupe
• 🇨🇦 amazon.ca/shop/amourguadeloupe
• 🇮🇹 amazon.it/shop/amourguadeloupe
• 🇪🇸 amazon.es/shop/amourguadeloupe
• 🇧🇪 amazon.com.be/shop/influencer-fb942837
• 🇦🇺 amzlink.to/az05kTTrYJ06L
• 🇧🇷 amzlink.to/az0ymmoCLHvyA
• + Inde • Singapour • Suède • Pays-Bas

━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 **QUIZ LEARN-TO-EARN** — 100+ thèmes
• Crypto • IA • Amazon • Caraïbes • Business
• Culture Monde • Droit • Finance • Science...
• Récompenses : 1 000 à 50 000 REUSS/quiz
• 🔗 reussitess-global-nexus-jfgk.vercel.app/quiz

━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 **200 AGENTS IA — QUANTUM NEXUS**
• 50 Sentinelles — surveillance 24h/24
• 80 Neuro-X — analyse & données
• 99 Nexus Quiz — contenu éducatif
• 30 Supreme AI — orchestration

━━━━━━━━━━━━━━━━━━━━━━━━━
📊 **VECTEURS ÉCONOMIQUES**
• ALPHA-1 : Staking (APY 10-20%)
• BETA-2 : Quiz Learn-to-Earn
• GAMMA-1 : Cashback Amazon
• DELTA-4 : Gouvernance DAO

━━━━━━━━━━━━━━━━━━━━━━━━━
⛏️ **GOMINING** — Bitcoin passif
• Lien : gomining.com/?ref=OT3GI2U
• Rendement : Variable selon prix Bitcoin • Minage cloud

━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 **SITE OFFICIEL**
• reussitess-global-nexus-jfgk.vercel.app
• Whitepaper • Passeport IA • Hub International

━━━━━━━━━━━━━━━━━━━━━━━━━
💼 **TIERS D'ACCÈS**
🥉 Bronze 3% • 🥈 Silver 8% • 🥇 Gold 15% • 💎 Platinum 20%

**EXCELLENCE • INNOVATION • SUCCÈS**
🇬🇵 Positivité à l'infini — BOUDOUM !`
  }

  // Token REUSS
  if (msg.includes('contrat') || msg.includes('adresse token') || msg.includes('0xb375')) {
    return `✅ **Token REUSS — Données officielles :**\n\nContrat : \${whitepaperData.reel.token.contrat}\nSupply : \${whitepaperData.reel.token.supply}\nPool : \${whitepaperData.reel.token.pool}\nHolders actuels : \${whitepaperData.reel.token.holders}\n\n🔗 Vérifiable sur : \${whitepaperData.reel.token.polygonscan}`
  }
  
  // Tokenomics
  if (msg.includes('tokenomics') || msg.includes('distribution') || msg.includes('répartition')) {
    return `✅ **Tokenomics REUSS — Distribution actuelle :**\n\n• Réserve/Treasury : \${whitepaperData.reel.tokenomics.reserve_treasury}\n• Fondateur : \${whitepaperData.reel.tokenomics.fondateur}\n• Acheteurs : \${whitepaperData.reel.tokenomics.acheteurs}\n• Burned : \${whitepaperData.reel.tokenomics.burned}\n\nBOUDOUM ! 🌴`
  }
  
  // Gamma
  if (msg.includes('gamma') || msg.includes('récompense') || msg.includes('reward')) {
    return `✅ **Vecteurs GAMMA — Distribution des récompenses :**\n\n🛍️ GAMMA-1 : \${whitepaperData.reel.gamma.gamma1}\n🎓 GAMMA-2 : \${whitepaperData.reel.gamma.gamma2}\n💰 GAMMA-3 : \${whitepaperData.reel.gamma.gamma3}\n\nBOUDOUM ! 🇬🇵`
  }
  
  // Tiers
  if (msg.includes('tier') || msg.includes('bronze') || msg.includes('silver') || msg.includes('gold') || msg.includes('platinum')) {
    return `✅ **Tiers d'accès Premium REUSS :**\n\n🥉 Bronze : \${whitepaperData.reel.tiers.bronze}\n🥈 Silver : \${whitepaperData.reel.tiers.silver}\n🥇 Gold : \${whitepaperData.reel.tiers.gold}\n💎 Platinum : \${whitepaperData.reel.tiers.platinum}\n\nBOUDOUM ! 🌴`
  }
  
  // Roadmap
  if (msg.includes('roadmap') || msg.includes('objectif') || msg.includes('prévision') || msg.includes('2026')) {
    return `⏳ **Roadmap 2026 — Objectifs prévisionnels (pas encore réalisés) :**\n\n📅 T1 2026 : \${whitepaperData.prevision.t1_2026.holders_objectif} holders · TVL \${whitepaperData.prevision.t1_2026.tvl_objectif} · \${whitepaperData.prevision.t1_2026.revenus_objectif}\n📅 T2-T3 2026 : \${whitepaperData.prevision.t2_t3_2026.holders_objectif} · TVL \${whitepaperData.prevision.t2_t3_2026.tvl_objectif}\n📅 T4 2026 : \${whitepaperData.prevision.t4_2026.holders_objectif} · Listing \${whitepaperData.prevision.t4_2026.listing}\n\n⚠️ Ces chiffres sont des objectifs, pas des garanties.`
  }

  // Conformité
  if (msg.includes('conformité') || msg.includes('amf') || msg.includes('mica') || msg.includes('kyc') || msg.includes('juridique')) {
    return `⏳ **Conformité juridique — En cours :**\n\n• PSAN : \${whitepaperData.prevision.conformite.psan}\n• MiCA : \${whitepaperData.prevision.conformite.mica}\n• KYC/AML : \${whitepaperData.prevision.conformite.kyc_aml}\n• Budget estimé : \${whitepaperData.prevision.conformite.budget}\n\n⚠️ Ces démarches sont en cours de mise en place.`
  }

  // Amazon
  if (msg.includes('amazon') || msg.includes('boutique') || msg.includes('affilié')) {
    return `✅ **Réseau Amazon — 26 boutiques · 14 pays :**\n\n\${whitepaperData.reel.plateforme.pays_amazon.join(", ")}\n\nTag affilié : ronyporinu0ac-21\nCommissions : 4-8% sur chaque vente qualifiée\n\nBOUDOUM ! 🌴`
  }

  // Sécurité
  if (msg.includes('sécurité') || msg.includes('gas') || msg.includes('sentinelle')) {
    return `✅ **Sécurité REUSS :**\n\n🔒 Gas : \${whitepaperData.reel.securite.gas}\n👁️ Surveillance : \${whitepaperData.reel.securite.sentinelles}\n⏳ Multi-sig : \${whitepaperData.prevision.multisig}\n\nBOUDOUM ! 🇬🇵`
  }

  return null
}


async function getWikipedia(term) {
  try {
  // GUIDE CRYPTOART
  if (msgLow.includes("crypto art") || msgLow.includes("generative art") || msgLow.includes("art génératif") || msgLow.includes("créer avec ia") || msgLow.includes("midjourney")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🎨 **Neuro-X Créatif — Art Génératif IA**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE PARENTALITE
  if (msgLow.includes("parentalité") || msgLow.includes("éduquer mon enfant") || msgLow.includes("bébé") || msgLow.includes("grossesse") || msgLow.includes("élever enfant caribéen")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "👶 **Neuro-X Enfants — Parentalité Caribéenne**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE GESTION TEMPS
  if (msgLow.includes("gestion du temps") || msgLow.includes("productivité") || msgLow.includes("organisation") || msgLow.includes("procrastination") || msgLow.includes("planning")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "⏰ **Neuro-X Coach — Productivité Caribéenne**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE INTELLIGENCE COLLECTIVE
  if (msgLow.includes("intelligence collective") || msgLow.includes("travailler ensemble") || msgLow.includes("synergie") || msgLow.includes("collaboration") || msgLow.includes("réseau caribéen")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🤝 **Neuro-X Stratégie — Intelligence Collective**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE CARNAVAL CARAIBE
  if (msgLow.includes("carnaval") || msgLow.includes("mas") || msgLow.includes("vidé") || msgLow.includes("chars carnaval") || msgLow.includes("fête guadeloupe")) {
    try {
      const agenda = getAgendaCaraibes()
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🎭 **Neuro-X Culture — Carnaval Caribéen**\n\n"+agenda+"\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE PEINTURE CARIBEENNE
  if (msgLow.includes("peinture caribéenne") || msgLow.includes("artiste antillais") || msgLow.includes("art guadeloupe") || msgLow.includes("sculpture caribéenne") || msgLow.includes("artiste créole")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🎨 **Neuro-X Créatif — Art Caribéen**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE EMPLOI DOM-TOM
  if (msgLow.includes("chercher emploi") || msgLow.includes("offre emploi guadeloupe") || msgLow.includes("pôle emploi") || msgLow.includes("trouver travail antilles") || msgLow.includes("chômage guadeloupe")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "💼 **Neuro-X Business — Emploi DOM-TOM**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // MESSAGE FINAL BOUDOUM
  if (msgLow.includes("boudoum") || msgLow === "boudoum !") {
    const msgs = [
      "💥 BOUDOUM ! Terres de Champions ! La Guadeloupe conquiert le monde ! 🇬🇵🌍",
      "🎯 BOUDOUM ! Excellence • Innovation • Succès — REUSSITESS®971 ! 🇬🇵",
      "🌟 BOUDOUM ! Positivité à l'infini ! Les Antilles dominent ! 🇬🇵💎",
      "🔥 BOUDOUM ! 200 agents IA au service de la Caraïbe ! 🤖🇬🇵",
      "⚡ BOUDOUM ! Token REUSS en route vers la lune ! 🚀💎🇬🇵"
    ]
    return res.status(200).json({ response: msgs[Math.floor(Math.random()*msgs.length)] })
  }

  // GUIDE CINEMATOGRAPHIE CARIBEENNE
  if (msgLow.includes("film caribéen") || msgLow.includes("cinéma antillais") || msgLow.includes("réalisateur guadeloupe") || msgLow.includes("documentaire caraïbes")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🎬 **Neuro-X Cinéma — Films Caribéens**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE TRANSPORT DOM-TOM
  if (msgLow.includes("transport guadeloupe") || msgLow.includes("bus guadeloupe") || msgLow.includes("taxi guadeloupe") || msgLow.includes("location voiture antilles") || msgLow.includes("se déplacer guadeloupe")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🚌 **Neuro-X Tourisme — Transport Caribéen**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE ASSURANCE DOM-TOM
  if (msgLow.includes("assurance guadeloupe") || msgLow.includes("mutuelle antilles") || msgLow.includes("assurance habitation") || msgLow.includes("assurance cyclone") || msgLow.includes("assurance auto guadeloupe")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🛡️ **Neuro-X Juridique — Assurances DOM-TOM**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE MYTHOLOGIE CARIBEENNE
  if (msgLow.includes("mythologie caribéenne") || msgLow.includes("légende créole") || msgLow.includes("zombie caribéen") || msgLow.includes("soukougnan") || msgLow.includes("diable antillais")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "👻 **Neuro-X Spiritualité — Mythologie Caribéenne**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE PERMIS DE CONDUIRE
  if (msgLow.includes("permis de conduire") || msgLow.includes("code de la route") || msgLow.includes("auto-école") || msgLow.includes("conduire guadeloupe")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🚗 **Neuro-X Juridique — Permis Caribéen**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE AIDE SOCIALE
  if (msgLow.includes("rsa") || msgLow.includes("caf") || msgLow.includes("aides sociales") || msgLow.includes("allocation") || msgLow.includes("aide guadeloupe")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 2048
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "🤝 **Neuro-X Juridique — Aides Sociales DOM-TOM**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // GUIDE LITTERATURE CARIBEENNE
  if (msgLow.includes("littérature") || msgLow.includes("roman caribéen") || msgLow.includes("auteur antillais") || msgLow.includes("maryse condé") || msgLow.includes("simone schwarz-bart")) {
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. BOUDOUM!" },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const d = await groqRes.json()
      return res.status(200).json({ response: "📚 **Neuro-X Littérature — Auteurs Caribéens**\n\n"+d.choices?.[0]?.message?.content+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // EVENEMENT HISTORIQUE DU JOUR — Wikimedia gratuit
  if (msgLow.includes("événement du jour") || msgLow.includes("évènement du jour") || msgLow.includes("ce jour dans l'histoire") || msgLow.includes("éphéméride") || msgLow.includes("aujourd'hui dans l'histoire")) {
    try {
      const now = new Date()
      const mm = String(now.getMonth()+1).padStart(2,"0")
      const dd = String(now.getDate()).padStart(2,"0")
      const wikiR = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/fr/onthisday/events/${mm}/${dd}`)
      const wikiD = await wikiR.json()
      const events = wikiD.events || []
      const picks = events.sort(() => Math.random()-0.5).slice(0,5)
      const txt = picks.map((e,i) => `${i+1}. **${e.year || ""}** — ${e.text}`).join("\n")
      return res.status(200).json({ response: "📅 **Ce Jour dans l'Histoire — "+dd+"/"+mm+"**\n\n"+txt+"\n\nSource: Wikimedia\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "📅 **Éphéméride**\n\nLe 27 mai 1848 : Abolition de l'esclavage en Guadeloupe.\nLe 10 mai 2001 : Loi Taubira reconnaît l'esclavage comme crime contre l'humanité.\n\nBOUDOUM ! 🇬🇵" })
    }
  }

  // BIBLIOTHEQUE MONDIALE — Open Library gratuit
  if (msgLow.includes("livre sur") || msgLow.includes("bibliothèque") || msgLow.includes("recherche livre") || msgLow.includes("trouver livre") || msgLow.includes("open library")) {
    try {
      const query = encodeURIComponent(message.replace(/livre sur|bibliothèque|recherche livre|trouver livre/gi,"").trim() || "guadeloupe")
      const libR = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=5&language=fre`)
      const libD = await libR.json()
      const books = (libD.docs || []).slice(0,5)
      const txt = books.map((b,i) => `${i+1}. 📖 **${b.title}** — ${(b.author_name||["Auteur inconnu"])[0]} (${b.first_publish_year||"?"})\n   🔗 openlibrary.org/works/${b.key}`).join("\n\n")
      return res.status(200).json({ response: "📚 **Bibliothèque Mondiale — Open Library**\n\n🔍 Résultats pour: *"+decodeURIComponent(query)+"*\n\n"+txt+"\n\n"+libD.numFound+" livres trouvés gratuitement !\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // ACTUALITES MONDE FRANCOPHONE — RSS gratuit
  if (msgLow.includes("actualité monde") || msgLow.includes("news monde") || msgLow.includes("actualité internationale") || msgLow.includes("info monde")) {
    try {
      const rssR = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.rfi.fr/fr/rss-services/html/rss-services.html&count=5")
      const rssD = await rssR.json()
      const items = (rssD.items||[]).slice(0,5)
      const txt = items.map((it,i) => `${i+1}. **${it.title}**\n   📰 ${it.pubDate?.substring(0,10)||""}`).join("\n\n")
      return res.status(200).json({ response: "🌍 **Actualités Monde Francophone — RFI**\n\n"+txt+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBOUDOUM ! 🇬🇵" })
    }
  }

  // OFFRES EMPLOI DOM-TOM CARAIBES AFRIQUE
  if (msgLow.includes("offre emploi") || msgLow.includes("chercher emploi") || msgLow.includes("trouver un emploi") || msgLow.includes("job guadeloupe") || msgLow.includes("job martinique") || msgLow.includes("job réunion") || msgLow.includes("emploi dom-tom") || msgLow.includes("emploi caraïbes") || msgLow.includes("emploi afrique") || msgLow.includes("recrutement guadeloupe") || msgLow.includes("remote job") || msgLow.includes("offre de travail")) {
    try {
      const remoteRes = await fetch("https://remoteok.com/api?limit=5", { headers: { "User-Agent": "REUSSITESS971Bot/1.0" } })
      const remoteData = await remoteRes.json()
      const jobs = remoteData.slice(1,6).filter(j => j && j.position)
      if (jobs.length > 0) {
        const jobList = jobs.map(j => "- **"+j.position+"** | "+(j.company||'Entreprise')+"\n  Lien: "+j.url+"\n  Tags: "+(j.tags||[]).slice(0,3).join(', ')).join("\n\n")
        return res.status(200).json({ response: "Offres d'emploi REELLES - Temps reel (RemoteOK)\n\n"+jobList+"\n\nPlateformes DOM-TOM gratuites :\nGuadeloupe: francetravail.fr\nReunion: emploi.re\nCaraibes: caribbeanjobs.com\nAfrique: jobartis.com\nRemote: remoteok.com\nIndeed: indeed.fr\nLinkedIn: linkedin.com/jobs\n\nTape 'creer mon CV' pour ton CV PDF gratuit !\n\nBOUDOUM !" })
      }
    } catch(eR) {}
    return res.status(200).json({ response: "Emploi DOM-TOM - Plateformes gratuites\n\nGuadeloupe: francetravail.fr\nReunion: emploi.re\nCaraibes: caribbeanjobs.com\nAfrique: jobartis.com\nRemote: remoteok.com\nIndeed: indeed.fr\nLinkedIn: linkedin.com/jobs\n\nTape 'creer mon CV' pour ton CV PDF gratuit !\n\nBOUDOUM !" })
  }
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        })
      });
    } catch(e) {}
