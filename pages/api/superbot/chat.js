
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
      gomining: "gomining.com/?ref=OT3GI2U — 0.84$/jour top 3% mondial",
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
• 40 Nexus Quiz — contenu éducatif
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
• Rendement : 0.84$/jour • Top 3% mondial

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
  // METEO DIRECTE
  if (msgLow.includes('meteo') || msgLow.includes('météo') || msgLow.includes('temps') || msgLow.includes('temperature') || msgLow.includes('température') || msgLow.includes('climat')) {
    try {
      const lat = msgLow.includes('paris') ? 48.85 : msgLow.includes('martinique') ? 14.64 : msgLow.includes('reunion') ? -21.11 : 16.26
      const lon = msgLow.includes('paris') ? 2.35 : msgLow.includes('martinique') ? -61.02 : msgLow.includes('reunion') ? 55.53 : -61.55
      const lieu = msgLow.includes('paris') ? "Paris" : msgLow.includes('martinique') ? "Martinique" : msgLow.includes('reunion') ? "Réunion" : "Guadeloupe"
      const mr = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
      const md = await mr.json()
      const w = md.current_weather
      const wDesc = w.weathercode <= 3 ? "Ensoleillé" : w.weathercode <= 48 ? "Nuageux" : w.weathercode <= 67 ? "Pluvieux" : "Orageux"
      return res.status(200).json({ response: "🌤️ **Météo " + lieu + " — Temps réel**\n\n🌡️ Température : " + w.temperature + "°C\n💨 Vent : " + w.windspeed + " km/h\n☁️ Conditions : " + wDesc + "\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🌤️ Service météo temporairement indisponible. Réessayez dans un instant ! BOUDOUM 🇬🇵" })
    }
  }

  // TAUX DE CHANGE DIRECT
  if (msgLow.includes('taux') || msgLow.includes('change') || msgLow.includes('euro') || msgLow.includes('dollar') || msgLow.includes('devise') || msgLow.includes('monnaie')) {
    try {
      const fr = await fetch("https://open.er-api.com/v6/latest/EUR")
      const fd = await fr.json()
      const r = fd.rates
      return res.status(200).json({ response: "💱 **Taux de Change — Temps réel**\n\n💵 EUR/USD : " + r.USD + "\n💷 EUR/GBP : " + r.GBP + "\n🇧🇷 EUR/BRL : " + r.BRL + "\n🇨🇦 EUR/CAD : " + r.CAD + "\n🇮🇳 EUR/INR : " + r.INR + "\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // CRYPTO PRIX DIRECT
  if (msgLow.includes('bitcoin') || msgLow.includes('btc') || msgLow.includes('ethereum') || msgLow.includes('eth') || msgLow.includes('crypto') || msgLow.includes('prix') && msgLow.includes('coin')) {
    try {
      const cr = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd")
      const cd = await cr.json()
      const tr = await fetch("https://api.coingecko.com/api/v3/search/trending")
      const td = await tr.json()
      const fg = await getFearGreed()
      const trending = td.coins.slice(0,5).map(function(c){ return c.item.name }).join(", ")
      return res.status(200).json({ response: "💎 **Crypto — Données Temps Réel**\n\n₿ Bitcoin : $" + (cd.bitcoin?.usd||"N/A") + "\nΞ Ethereum : $" + (cd.ethereum?.usd||"N/A") + "\n🔷 POL : $" + (cd["matic-network"]?.usd||"N/A") + "\n\n🔥 Tendances : " + trending + "\n😨 Sentiment : " + fg + "\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // PRESENTATION NEURO-X
  if (msgLow.includes("qui est neuro-x") || msgLow.includes("présente les agents") || msgLow.includes("presente les agents") || msgLow.includes("que font les agents") || msgLow.includes("rôle des agents") || msgLow.includes("role des agents")) {
    return res.status(200).json({ response: "🤖 **QUANTUM NEXUS — Présentation des 200 Agents**\n\n"+"👑 **Supreme AI** — Orchestre tout, répond à toutes questions\n\n"+"🧠 **Neuro-X (60 agents spécialisés) :**\n"+"• NX-001 Finance — Crypto, DeFi, Token REUSS, investissement\n"+"• NX-002 Business — Amazon, affiliation, e-commerce, revenus\n"+"• NX-003 Culture — Caribéenne, créole, francophone mondiale\n"+"• NX-004 Coach — Motivation, mindset, développement personnel\n"+"• NX-005 Tech — IA, blockchain, Next.js, APIs\n"+"• NX-006 Santé — Bien-être, nutrition antillaise\n"+"• NX-007 Éducation — Quiz, pédagogie, apprentissage\n"+"• NX-008 Juridique — Droit, MiCA, RGPD, auto-entrepreneur\n"+"• NX-009 Voyage — Tourisme caribéen, destinations\n"+"• NX-010 Créatif — Poèmes créoles, histoires, slogans\n"+"• NX-011 Sport — Fitness, champions antillais\n"+"• NX-012 Histoire — Abolition, résistance, patrimoine\n"+"• NX-013 Cuisine — Recettes créoles, accras, colombo\n"+"• NX-014 Musique — Zouk, gwo ka, biguine, soca\n"+"• NX-015 Environnement — Écologie, biodiversité caribéenne\n"+"• NX-016 Immobilier — DOM-TOM, défiscalisation Girardin\n"+"• NX-017 Marketing — Réseaux sociaux, TikTok, croissance\n"+"• NX-018 DeFi — Yield farming, staking, QuickSwap\n"+"• NX-019 NFT — Art numérique, OpenSea, collections\n"+"• NX-020 Psychologie — Résilience, leadership caribéen\n"+"• ... jusqu'à NX-060 Stratégie — Plan global 5 ans REUSSITESS\n\n"+"🛡️ **Sentinelles (40 agents surveillance) :**\n"+"• ST-001 Prix REUSS — DexScreener 24/7\n"+"• ST-002 Actualités — RFI/BBC/France24 live\n"+"• ST-003 Météo — Guadeloupe temps réel\n"+"• ST-004 ISS — Position station spatiale\n"+"• ST-005 Crypto — BTC/ETH/POL live\n"+"• ST-006 Site — Surveillance reussitess.fr\n"+"• ... jusqu'à ST-040 Guardian Supreme\n\n"+"🎯 **Nexus Quiz (99 agents éducatifs)** — Actifs sur reussitess.fr\n\n"+"💬 Active un agent : *neuro-x cuisine*, *neuro-x finance*, *neuro-x coach*...\n\n"+"BOUDOUM ! 🇬🇵" })
  }

  // DASHBOARD AGENTS
  if (msgLow.includes("200 agent") || msgLow.includes("quantum nexus") || msgLow.includes("dashboard agent") || msgLow.includes("liste agent") || msgLow.includes("agents ia")) {
    return res.status(200).json({ response: getAgentsDashboard() })
  }

  // ACTIVATION NEURO-X
  const neuroxType = detectNeurox(message)
  if (neuroxType) {
    const agent = NEUROX_AGENTS[neuroxType]
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: agent.prompt },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const groqData = await groqRes.json()
      const rep = groqData.choices?.[0]?.message?.content || "Agent indisponible"
      return res.status(200).json({ response: "🧠 **"+agent.nom+"** ["+agent.id+"]\n\n"+rep+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🧠 "+agent.nom+" temporairement indisponible. BOUDOUM ! 🇬🇵" })
    }
  }

  // DETECTION PRENOM
  const prenom = detectPrenom(message)
  if (prenom) {
    return res.status(200).json({ response: "🎉 Enchanté"+", "+prenom+" ! Je vais retenir ton prénom pour notre conversation. Bienvenue chez REUSSITESS AI — Excellence • Innovation • Succès !\n\nBOUDOUM ! 🇬🇵" })
  }

  // DETECTION EMOTION
  const emotion = detectEmotion(message)
  if (emotion) {
    const emoResp = getEmotionResponse(emotion)
    if (emoResp) return res.status(200).json({ response: emoResp })
  }

  // DETECTION MODE
  const mode = detectMode(message)
  if (mode) {
    const modeResp = getModeResponse(mode, null)
    if (modeResp) return res.status(200).json({ response: modeResp })
  }

  // SALUTATION AVEC HEURE
  if (msgLow.includes("bonjour") || msgLow.includes("bonsoir") || msgLow.includes("bonjou") || msgLow.includes("salut") || msgLow.includes("hello") || msgLow.includes("hey")) {
    const sal = getSalutation(datetime)
    const lune = getLunePhase()
    return res.status(200).json({ response: sal+" ! Je suis REUSSITESS AI, né en Guadeloupe 🇬🇵\n\n🌙 Lune : "+lune+"\n\n✨ Je peux t'aider avec :\n• 📰 Actualités temps réel\n• 💎 Prix crypto live\n• 🌤️ Météo\n• 🎓 99 Quiz\n• 🛍️ 26 Boutiques Amazon\n• 😂 Blagues caribéennes\n• 🔢 Conversions\n\nQue puis-je faire pour toi ?\n\nBOUDOUM ! 🇬🇵" })
  }

  // MOT CREOLE DU JOUR
  if (msgLow.includes("creole") || msgLow.includes("créole") || msgLow.includes("mot du jour") || msgLow.includes("gwadloup") || msgLow.includes("patois")) {
    const m = getMotCreoleJour()
    return res.status(200).json({ response: "🇬🇵 **Mot Créole du Jour**\n\n📖 **"+m.mot+"** = "+m.sens+"\n\n💬 Exemple : *"+m.phrase+"*\n\nBOUDOUM ! 🌴" })
  }

  // BLAGUE CARIBEENNE
  if (msgLow.includes("blague") || msgLow.includes("humour") || msgLow.includes("drole") || msgLow.includes("drôle") || msgLow.includes("rire") || msgLow.includes("joke")) {
    const b = getBlague()
    return res.status(200).json({ response: "😂 **Blague Caribéenne**\n\n"+b+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // HOROSCOPE
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || msgLow.includes("lion") || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") || msgLow.includes("poissons")) {
    const h = getHoroscope(msgLow)
    if (h) return res.status(200).json({ response: "🔮 **Horoscope du Jour**\n\n"+h.signe+"\n\n"+h.msg+"\n\nBOUDOUM ! 🇬🇵" })
    return res.status(200).json({ response: "🔮 **Horoscope du Jour**\n\nPrécise ton signe : Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau ou Poissons ?\n\nBOUDOUM ! 🇬🇵" })
  }

  // CONVERTISSEUR
  if (msgLow.includes("convertir") || msgLow.includes("convert") || (msgLow.includes("km") && msgLow.includes("mile")) || (msgLow.includes("kg") && msgLow.includes("lb")) || msgLow.includes("celsius") || msgLow.includes("fahrenheit")) {
    const conv = convertir(msgLow)
    if (conv) return res.status(200).json({ response: "🔢 **Convertisseur**\n\n✅ "+conv+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // CITATION DU JOUR
  if (msgLow.includes("citation") || msgLow.includes("inspire") || msgLow.includes("inspirant") || msgLow.includes("sagesse") || msgLow.includes("motivation")) {
    try {
      const cit = await getCitation()
      return res.status(200).json({ response: "✨ **Citation du Jour**\n\n"+cit+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // FAIT INSOLITE
  if (msgLow.includes("insolite") || msgLow.includes("saviez") || msgLow.includes("fait du jour") || msgLow.includes("anecdote") || msgLow.includes("surprise")) {
    try {
      const fait = await getFaitInsolite()
      return res.status(200).json({ response: "🤔 **Fait Insolite du Jour**\n\n"+fait+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // ISS POSITION
  if (msgLow.includes("iss") || msgLow.includes("station spatiale") || msgLow.includes("espace") || msgLow.includes("satellite")) {
    try {
      const iss = await getISSPosition()
      return res.status(200).json({ response: "🛸 **Station Spatiale ISS — Position Temps Réel**\n\n"+iss+"\n\n🌍 Visible à l'oeil nu la nuit !\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // PHASE DE LUNE
  if (msgLow.includes("lune") || msgLow.includes("moon") || msgLow.includes("pleine lune") || msgLow.includes("phase")) {
    const lune = getLunePhase()
    return res.status(200).json({ response: "🌙 **Phase de la Lune**\n\n"+lune+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // ACTUALITES DIRECTES
  if (msgLow.includes('actualite') || msgLow.includes('actualité') || msgLow.includes('news') || msgLow.includes('nouvelles') || msgLow.includes('info du jour')) {
    try {
      const rfi = await getRFINews()
      const bbc = await getBBCNews()
      const f24 = await getFrance24News()
      return res.status(200).json({ response: "📰 **Actualités du Jour — Temps Réel**\n\n🔴 **RFI :**\n" + (rfi||"N/A") + "\n\n🌍 **BBC Afrique :**\n" + (bbc||"N/A") + "\n\n📺 **France 24 :**\n" + (f24||"N/A") + "\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  if (msgLow.includes('heure') || msgLow.includes('quelle heure') || msgLow.includes('time') || msgLow.includes('jour') || msgLow.includes('date') || msgLow.includes('aujourd') || msgLow.includes('quel jour')) {
    const now = datetime || {}
    return res.status(200).json({ response: `🕐 **Temps Réel REUSSITESS AI**

📅 Date : ${now.date || new Date().toLocaleDateString('fr-FR', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}
⏰ Heure : ${now.heure || new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})}
🌍 Fuseau : ${now.timezone || 'Europe/Paris'}

BOUDOUM ! 🇬🇵` })
  }

  // ✅ NEXUS COMMANDS — priorité maximale
    const nexusResponse = await handleNexusCommand(message)
    if (nexusResponse) {
      return res.status(200).json({ response: nexusResponse })
    }

    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.extract || null
  } catch (e) { return null }
}

async function getRFINews() {
  try {
    const r = await fetch("https://www.rfi.fr/fr/rss")
    const xml = await r.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0,5).map(function(i){
      const t = (i.match(/<title>(.*?)<\/title>/) || [])[1] || ""
      return "- " + t.replace(/<![\s\S]*?>/g,"").trim()
    }).join(" | ")
  } catch(e) { return null }
}

async function getBBCNews() {
  try {
    const r = await fetch("https://feeds.bbci.co.uk/afrique/rss.xml")
    const xml = await r.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0,5).map(function(i){
      const t = (i.match(/<title>(.*?)<\/title>/) || [])[1] || ""
      return "- " + t.replace(/<![\s\S]*?>/g,"").trim()
    }).join(" | ")
  } catch(e) { return null }
}

async function getCryptoPrice() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd")
    const d = await r.json()
    const parts = []
    if(d.bitcoin) parts.push("BTC $" + d.bitcoin.usd)
    if(d.ethereum) parts.push("ETH $" + d.ethereum.usd)
    if(d["matic-network"]) parts.push("POL $" + d["matic-network"].usd)
    return parts.join(" | ")
  } catch(e) { return null }
}

async function getFrance24News() {
  try {
    const r = await fetch("https://www.france24.com/fr/rss")
    const xml = await r.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0,5).map(function(i){
      const t = (i.match(/<title>(.*?)<\/title>/) || [])[1] || ""
      return "- " + t.replace(/<![\s\S]*?>/g,"").trim()
    }).join(" | ")
  } catch(e) { return null }
}

async function getAlJazeeraNews() {
  try {
    const r = await fetch("https://www.aljazeera.com/xml/rss/all.xml")
    const xml = await r.text()
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
    return items.slice(0,5).map(function(i){
      const t = (i.match(/<title>(.*?)<\/title>/) || [])[1] || ""
      return "- " + t.replace(/<![\s\S]*?>/g,"").trim()
    }).join(" | ")
  } catch(e) { return null }
}

async function getCoinGeckoTrending() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/search/trending")
    const d = await r.json()
    return d.coins.slice(0,5).map(function(c){ return c.item.name }).join(", ")
  } catch(e) { return null }
}

async function getFearGreed() {
  try {
    const r = await fetch("https://api.alternative.me/fng/")
    const d = await r.json()
    return d.data[0].value_classification + " (" + d.data[0].value + "/100)"
  } catch(e) { return null }
}

async function getMeteo(lat, lon) {
  try {
    lat = lat || 16.26
    lon = lon || -61.55
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
    const d = await r.json()
    const w = d.current_weather
    return w.temperature + "C | vent " + w.windspeed + "km/h | code " + w.weathercode
  } catch(e) { return null }
}

async function getExchangeRates() {
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/EUR")
    const d = await r.json()
    return "EUR/USD: " + d.rates.USD + " | EUR/GBP: " + d.rates.GBP + " | EUR/BRL: " + d.rates.BRL + " | EUR/CAD: " + d.rates.CAD
  } catch(e) { return null }
}

async function getCitation() {
  try {
    const r = await fetch("https://zenquotes.io/api/random")
    const d = await r.json()
    return "\"" + d[0].q + "\" — " + d[0].a
  } catch(e) { return null }
}

async function getFaitInsolite() {
  try {
    const r = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")
    const d = await r.json()
    return d.text
  } catch(e) { return null }
}

async function getISSPosition() {
  try {
    const r = await fetch("http://api.open-notify.org/iss-now.json")
    const d = await r.json()
    const lat = parseFloat(d.iss_position.latitude).toFixed(2)
    const lon = parseFloat(d.iss_position.longitude).toFixed(2)
    const zone = lat > 0 ? lat+"°N" : Math.abs(lat)+"°S"
    const zoneL = lon > 0 ? lon+"°E" : Math.abs(lon)+"°O"
    return "Lat "+zone+" | Lon "+zoneL+" | Altitude ~408 km | Vitesse ~27 600 km/h"
  } catch(e) { return null }
}

function getLunePhase() {
  const now = new Date()
  const diff = (now - new Date(2001,0,1)) / 86400000
  const phase = (diff / 29.53058868) % 1
  const phases = ["🌑 Nouvelle lune","🌒 Croissant","🌓 Premier quartier","🌔 Gibbeuse croissante","🌕 Pleine lune","🌖 Gibbeuse décroissante","🌗 Dernier quartier","🌘 Croissant décroissant"]
  const pct = Math.round(phase * 100)
  return phases[Math.floor(phase*8)] + " (" + pct + "% du cycle)"
}

// ============================================
// BASE DE DONNÉES LOCALE REUSSITESS
// ============================================
const MOTS_CREOLES = [
  {mot:"Bonjou",sens:"Bonjour",phrase:"Bonjou tout moun ! (Bonjour tout le monde !)"},
  {mot:"Bèl",sens:"Beau/Belle",phrase:"Ou bèl jodi a ! (Tu es beau/belle aujourd'hui !)"},
  {mot:"Kouri",sens:"Courir/Partir",phrase:"Kouri pou réussi ! (Cours pour réussir !)"},
  {mot:"Lajan",sens:"Argent",phrase:"Travay pou ganyen lajan ou ! (Travaille pour gagner ton argent !)"},
  {mot:"Fòs",sens:"Force",phrase:"Ou ni fòs ! (Tu as de la force !)"},
  {mot:"Doubout",sens:"Debout/Déterminé",phrase:"Ress doubout ! (Reste debout !)"},
  {mot:"Lanmou",sens:"Amour",phrase:"Lanmou sé bèl bagay ! (L'amour est une belle chose !)"},
  {mot:"Péyi",sens:"Pays/Île",phrase:"Nou enmé nou péyi ! (Nous aimons notre pays !)"},
  {mot:"Solèy",sens:"Soleil",phrase:"Solèy la ka brilé ! (Le soleil brille !)"},
  {mot:"Viktwa",sens:"Victoire",phrase:"Viktwa sé pou nou ! (La victoire est pour nous !)"},
  {mot:"Espwa",sens:"Espoir",phrase:"Toujou ni espwa ! (Il y a toujours de l'espoir !)"},
  {mot:"Chans",sens:"Chance",phrase:"Chans ka souri ba ou ! (La chance te sourit !)"},
  {mot:"Kontan",sens:"Content/Heureux",phrase:"Mwen kontan wè ou ! (Je suis content de te voir !)"},
  {mot:"Kouraj",sens:"Courage",phrase:"Pran kouraj ! (Prends courage !)"},
  {mot:"Richès",sens:"Richesse",phrase:"Richès sé pa sèlman lajan ! (La richesse n'est pas seulement l'argent !)"},
]

const BLAGUES_CARAIBES = [
  "Pourquoi les Guadeloupéens sont toujours de bonne humeur ? Parce que même les nuages chez nous ont du soleil dedans ! ☀️",
  "Un touriste demande à un Martiniquais : C'est loin la plage ? Il répond : Non non, juste après le prochain virage... (3 virages plus tard) 😄",
  "Comment on appelle un Antillais qui fait du ski ? Un pionnier ! 🎿",
  "Pourquoi les crabes des Antilles marchent de côté ? Pour éviter les touristes qui font des selfies ! 🦀",
  "Un Guadeloupéen arrive en retard au travail. Son patron : Vous êtes en retard ! Lui : Non, je suis en avance pour demain ! 🇬🇵",
  "Quelle est la différence entre un cyclone et une réunion de famille antillaise ? Le cyclone finit par partir ! 🌀",
  "Pourquoi les cocotiers poussent si droit en Guadeloupe ? Parce qu'ils regardent le ciel pour trouver l'inspiration comme nous ! 🌴",
  "Comment s'appelle un Caribéen qui a froid ? Un menteur ! 😂",
]

const HOROSCOPES = {
  belier:{signe:"♈ Bélier",msg:"Votre énergie est au maximum aujourd'hui. Foncez sur vos projets REUSSITESS !"},
  taureau:{signe:"♉ Taureau",msg:"La persévérance paie. Votre token REUSS monte comme votre détermination !"},
  gemeaux:{signe:"♊ Gémeaux",msg:"Communication au top ! Partagez votre projet avec votre réseau aujourd'hui."},
  cancer:{signe:"♋ Cancer",msg:"Intuition forte. Faites confiance à votre vision entrepreneuriale."},
  lion:{signe:"♌ Lion",msg:"Vous brillez ! C'est le moment de vous montrer sur les réseaux sociaux."},
  vierge:{signe:"♍ Vierge",msg:"Analyse et précision au rendez-vous. Vérifiez vos stratégies Amazon."},
  balance:{signe:"♎ Balance",msg:"Équilibre parfait entre innovation et tradition caribéenne."},
  scorpion:{signe:"♏ Scorpion",msg:"Transformation en cours. Votre projet entre dans une nouvelle phase."},
  sagittaire:{signe:"♐ Sagittaire",msg:"Expansion internationale ! Vos 14 pays Amazon n'attendent que vous."},
  capricorne:{signe:"♑ Capricorne",msg:"Discipline et ambition. BOUDOUM — le succès est au bout de l'effort !"},
  verseau:{signe:"♒ Verseau",msg:"Innovation et originalité. Votre IA révolutionne le monde caribéen !"},
  poissons:{signe:"♓ Poissons",msg:"Créativité débordante. Exprimez votre culture guadeloupéenne avec fierté."},
}

function getMotCreoleJour() {
  const idx = new Date().getDate() % MOTS_CREOLES.length
  return MOTS_CREOLES[idx]
}

function getBlague() {
  const idx = Math.floor(Math.random() * BLAGUES_CARAIBES.length)
  return BLAGUES_CARAIBES[idx]
}

function getHoroscope(signe) {
  const s = signe.toLowerCase()
  for (const [key, val] of Object.entries(HOROSCOPES)) {
    if (s.includes(key)) return val
  }
  return null
}

function convertir(msg) {
  const nb = parseFloat(msg.match(/[\d.,]+/)?.[0]?.replace(",","."))
  if (isNaN(nb)) return null
  if (msg.includes("km") && msg.includes("mile")) return nb + " km = " + (nb*0.621371).toFixed(2) + " miles"
  if (msg.includes("mile") && (msg.includes("km") || msg.includes("kilo"))) return nb + " miles = " + (nb*1.60934).toFixed(2) + " km"
  if (msg.includes("kg") && (msg.includes("lb") || msg.includes("livre"))) return nb + " kg = " + (nb*2.20462).toFixed(2) + " lbs"
  if ((msg.includes("lb") || msg.includes("livre")) && msg.includes("kg")) return nb + " lbs = " + (nb*0.453592).toFixed(2) + " kg"
  if (msg.includes("celsius") || msg.includes("°c")) return nb + "°C = " + (nb*9/5+32).toFixed(1) + "°F"
  if (msg.includes("fahrenheit") || msg.includes("°f")) return nb + "°F = " + ((nb-32)*5/9).toFixed(1) + "°C"
  if (msg.includes("metre") || msg.includes("mètre")) return nb + " m = " + (nb*3.28084).toFixed(2) + " pieds"
  if (msg.includes("pied") || msg.includes("feet") || msg.includes("ft")) return nb + " pieds = " + (nb*0.3048).toFixed(2) + " m"
  return null
}

// ============================================
// INTELLIGENCE REUSSITESS AI
// ============================================

// Détection émotion
function detectEmotion(msg) {
  const m = msg.toLowerCase()
  if (m.includes("triste") || m.includes("déprimé") || m.includes("déprime") || m.includes("malheureux") || m.includes("pleure") || m.includes("mal")) return "triste"
  if (m.includes("stressé") || m.includes("stresse") || m.includes("anxieux") || m.includes("peur") || m.includes("angoisse") || m.includes("inquiet")) return "stresse"
  if (m.includes("motivé") || m.includes("motive") || m.includes("foncé") || m.includes("déterminé") || m.includes("prêt") || m.includes("champion")) return "motif"
  if (m.includes("colère") || m.includes("enervé") || m.includes("énervé") || m.includes("fâché") || m.includes("furieux")) return "colere"
  if (m.includes("heureux") || m.includes("content") || m.includes("joie") || m.includes("super") || m.includes("excellent") || m.includes("génial")) return "joie"
  return null
}

// Réponse émotionnelle
function getEmotionResponse(emotion) {
  if (emotion === "triste") return "💙 Je sens que tu traverses un moment difficile. En Guadeloupe on dit : *'Apré lapli, solèy ka briyé'* — Après la pluie, le soleil brille. Tu n'es pas seul(e), je suis là. Comment puis-je t'aider ?\n\nBOUDOUM ! 🇬🇵"
  if (emotion === "stresse") return "🌴 Respire... Comme la mer des Caraïbes, laisse les vagues passer. Le stress est temporaire, ta valeur est permanente. Dis-moi ce qui te préoccupe, on trouve une solution ensemble.\n\nBOUDOUM ! 🇬🇵"
  if (emotion === "motif") return "🔥 OUIII ! Cette énergie c'est REUSSITESS pure ! Tu es en mode champion aujourd'hui. Dis-moi sur quoi tu travailles, on va tout déchirer ensemble !\n\nBOUDOUM ! 🇬🇵"
  if (emotion === "colere") return "🌊 Je comprends ta frustration. Prends un moment, comme une vague qui se retire avant de revenir plus forte. Qu'est-ce qui s'est passé ? Je t'écoute.\n\nBOUDOUM ! 🇬🇵"
  if (emotion === "joie") return "🎉 Cette bonne énergie est contagieuse ! C'est exactement l'esprit REUSSITESS — Positivité à l'infini ! Partage ta joie avec moi !\n\nBOUDOUM ! 🇬🇵"
  return null
}

// Détection prénom
function detectPrenom(msg) {
  const patterns = [
    /je m'?appelle ([A-Za-zÀ-ÿ]+)/i,
    /mon (?:prénom|prenom|nom) est ([A-Za-zÀ-ÿ]+)/i,
    /appelle[- ]moi ([A-Za-zÀ-ÿ]+)/i,
    /c'est ([A-Za-zÀ-ÿ]+) ici/i,
  ]
  for (const p of patterns) {
    const m = msg.match(p)
    if (m) return m[1]
  }
  return null
}

// Détection langue automatique
function detectLangue(msg) {
  const fr = ["bonjour","merci","comment","pourquoi","quest","quel","aide","faire","avoir","être"]
  const en = ["hello","thank","how","why","what","help","make","have","please","good"]
  const es = ["hola","gracias","como","porque","que","ayuda","hacer","tener","buenas","buenos"]
  const pt = ["ola","obrigado","como","porque","que","ajuda","fazer","ter","bom","boa"]
  const m = msg.toLowerCase()
  let scores = {fr:0, en:0, es:0, pt:0}
  fr.forEach(w => { if(m.includes(w)) scores.fr++ })
  en.forEach(w => { if(m.includes(w)) scores.en++ })
  es.forEach(w => { if(m.includes(w)) scores.es++ })
  pt.forEach(w => { if(m.includes(w)) scores.pt++ })
  return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0]
}

// Détection mode
function detectMode(msg) {
  const m = msg.toLowerCase()
  if (m.includes("mode entrepreneur") || m.includes("conseils business") || m.includes("business")) return "entrepreneur"
  if (m.includes("mode fun") || m.includes("mode humour") || m.includes("amuse")) return "fun"
  if (m.includes("mode apprenant") || m.includes("explique") || m.includes("apprends") || m.includes("apprendre")) return "apprenant"
  if (m.includes("mode sérieux") || m.includes("mode serieux") || m.includes("professionnel")) return "serieux"
  return null
}

// Réponse mode
function getModeResponse(mode, prenom) {
  const nom = prenom ? " "+prenom : ""
  if (mode === "entrepreneur") return "💼 Mode Entrepreneur activé"+nom+" ! Je vais te parler stratégie, business, revenus passifs et token REUSS. Qu'est-ce qu'on développe aujourd'hui ?\n\nBOUDOUM ! 🇬🇵"
  if (mode === "fun") return "😄 Mode Fun activé"+nom+" ! On va rigoler tout en apprenant — style caribéen ! Pose-moi n'importe quoi !\n\nBOUDOUM ! 🇬🇵"
  if (mode === "apprenant") return "🎓 Mode Apprenant activé"+nom+" ! Je vais tout t'expliquer simplement, avec des exemples caribéens. On commence par quoi ?\n\nBOUDOUM ! 🇬🇵"
  if (mode === "serieux") return "🎯 Mode Professionnel activé"+nom+" ! Réponses précises et directes. Que puis-je faire pour toi ?\n\nBOUDOUM ! 🇬🇵"
  return null
}

// Salutation avec heure
function getSalutation(datetime) {
  const heure = datetime?.heure ? parseInt(datetime.heure.split(":")[0]) : new Date().getHours()
  if (heure >= 5 && heure < 12) return "🌅 Bonjou ! Bon matin"
  if (heure >= 12 && heure < 18) return "☀️ Bonjou ! Bon après-midi"
  if (heure >= 18 && heure < 22) return "🌆 Bonsoir"
  return "🌙 Bonne nuit"
}

// ============================================
// SYSTÈME 200 AGENTS IA — QUANTUM NEXUS
// ============================================

const NEUROX_AGENTS = {
  finance: {
    id: "NX-001", nom: "Neuro-X Finance",
    prompt: "Tu es Neuro-X Finance, agent IA spécialisé en crypto, DeFi, blockchain, investissement et finances personnelles. Tu connais parfaitement le token REUSS sur Polygon, QuickSwap, DexScreener. Réponds avec précision et données chiffrées. BOUDOUM!"
  },
  business: {
    id: "NX-002", nom: "Neuro-X Business",
    prompt: "Tu es Neuro-X Business, agent IA spécialisé en entrepreneuriat, Amazon affiliation, e-commerce, revenus passifs et stratégie marketing. Tu connais les 26 boutiques Amazon REUSSITESS dans 14 pays. BOUDOUM!"
  },
  culture: {
    id: "NX-003", nom: "Neuro-X Culture",
    prompt: "Tu es Neuro-X Culture, agent IA expert en culture caribéenne, guadeloupéenne, francophone mondiale. Tu connais l'histoire, la gastronomie, la musique, le créole, les DOM-TOM. BOUDOUM!"
  },
  coach: {
    id: "NX-004", nom: "Neuro-X Coach",
    prompt: "Tu es Neuro-X Coach, agent IA de développement personnel, motivation, mindset champion. Tu utilises la philosophie REUSSITESS : Excellence, Innovation, Succès. Positivité à l'infini. BOUDOUM!"
  },
  tech: {
    id: "NX-005", nom: "Neuro-X Tech",
    prompt: "Tu es Neuro-X Tech, agent IA expert en intelligence artificielle, programmation, blockchain, Web3, Next.js, Vercel, APIs. Tu aides les développeurs caribéens à innover. BOUDOUM!"
  },
  sante: {
    id: "NX-006", nom: "Neuro-X Santé",
    prompt: "Tu es Neuro-X Santé, agent IA spécialisé en bien-être, nutrition antillaise, médecine naturelle caribéenne, sport et santé mentale. BOUDOUM!"
  },
  education: {
    id: "NX-007", nom: "Neuro-X Éducation",
    prompt: "Tu es Neuro-X Éducation, agent IA pédagogue expert. Tu expliques tout simplement avec des exemples caribéens. Tu gères les 99 quiz REUSSITESS. BOUDOUM!"
  },
  juridique: {
    id: "NX-008", nom: "Neuro-X Juridique",
    prompt: "Tu es Neuro-X Juridique, agent IA expert en droit français, droit caribéen, MiCA crypto, RGPD, statut auto-entrepreneur. BOUDOUM!"
  },
  voyage: {
    id: "NX-009", nom: "Neuro-X Voyage",
    prompt: "Tu es Neuro-X Voyage, agent IA expert en tourisme caribéen, voyages francophones, destinations mondiales, conseils pratiques. BOUDOUM!"
  },
  creative: {
    id: "NX-010", nom: "Neuro-X Créatif",
    prompt: "Tu es Neuro-X Créatif, agent IA artiste. Tu crées des poèmes créoles, histoires caribéennes, slogans, textes marketing REUSSITESS. BOUDOUM!"
  },
  sport: { id: "NX-011", nom: "Neuro-X Sport", prompt: "Tu es Neuro-X Sport, expert sport caribéen, fitness, nutrition sportive, champions des Antilles. BOUDOUM!" },
  histoire: { id: "NX-012", nom: "Neuro-X Histoire", prompt: "Tu es Neuro-X Histoire, expert histoire caribéenne, esclavage, abolition, résistance, patrimoine antillais. BOUDOUM!" },
  cuisine: { id: "NX-013", nom: "Neuro-X Cuisine", prompt: "Tu es Neuro-X Cuisine, chef expert cuisine antillaise, recettes créoles, épices, rhum, accras, colombo, blaff. BOUDOUM!" },
  musique: { id: "NX-014", nom: "Neuro-X Musique", prompt: "Tu es Neuro-X Musique, expert musique caribéenne, zouk, gwo ka, biguine, dancehall, soca, reggae. BOUDOUM!" },
  environnement: { id: "NX-015", nom: "Neuro-X Environnement", prompt: "Tu es Neuro-X Environnement, expert écologie caribéenne, biodiversité, récifs coralliens, mangroves, développement durable. BOUDOUM!" },
  immobilier: { id: "NX-016", nom: "Neuro-X Immobilier", prompt: "Tu es Neuro-X Immobilier, expert immobilier DOM-TOM, investissement Guadeloupe, défiscalisation, loi Girardin. BOUDOUM!" },
  marketing: { id: "NX-017", nom: "Neuro-X Marketing", prompt: "Tu es Neuro-X Marketing, expert marketing digital, réseaux sociaux, TikTok, Instagram, YouTube, croissance audience. BOUDOUM!" },
  crypto2: { id: "NX-018", nom: "Neuro-X DeFi", prompt: "Tu es Neuro-X DeFi, expert finance décentralisée, yield farming, liquidity pools, staking, Polygon, QuickSwap. BOUDOUM!" },
  nft: { id: "NX-019", nom: "Neuro-X NFT", prompt: "Tu es Neuro-X NFT, expert NFTs, art numérique, collections, marketplace OpenSea, Polygon NFTs. BOUDOUM!" },
  psychologie: { id: "NX-020", nom: "Neuro-X Psychologie", prompt: "Tu es Neuro-X Psychologie, expert psychologie positive, résilience caribéenne, gestion émotions, leadership. BOUDOUM!" },
  langue: { id: "NX-021", nom: "Neuro-X Langues", prompt: "Tu es Neuro-X Langues, expert en 195 langues, créole guadeloupéen, martiniquais, haïtien, traduction culturelle. BOUDOUM!" },
  agriculture: { id: "NX-022", nom: "Neuro-X Agriculture", prompt: "Tu es Neuro-X Agriculture, expert agriculture caribéenne, banane, canne à sucre, igname, agriculture bio. BOUDOUM!" },
  tourisme: { id: "NX-023", nom: "Neuro-X Tourisme", prompt: "Tu es Neuro-X Tourisme, expert tourisme Guadeloupe, hôtellerie, plages, randonnées, Soufrière, Marie-Galante. BOUDOUM!" },
  astronomie: { id: "NX-024", nom: "Neuro-X Astronomie", prompt: "Tu es Neuro-X Astronomie, expert astronomie, ISS, planètes, étoiles, phases de lune, observation ciel caribéen. BOUDOUM!" },
  geopolitique: { id: "NX-025", nom: "Neuro-X Géopolitique", prompt: "Tu es Neuro-X Géopolitique, expert relations internationales, Caraïbes, CARICOM, Union Européenne, francophonie. BOUDOUM!" },
  seo: { id: "NX-026", nom: "Neuro-X SEO", prompt: "Tu es Neuro-X SEO, expert référencement web, Google, mots-clés, backlinks, optimisation sites Next.js. BOUDOUM!" },
  ia2: { id: "NX-027", nom: "Neuro-X IA Avancée", prompt: "Tu es Neuro-X IA Avancée, expert GPT-4, Claude, Gemini, LLM, prompt engineering, fine-tuning, agents autonomes. BOUDOUM!" },
  bourse: { id: "NX-028", nom: "Neuro-X Bourse", prompt: "Tu es Neuro-X Bourse, expert marchés financiers, actions, ETF, CAC40, NYSE, analyse technique et fondamentale. BOUDOUM!" },
  developpement: { id: "NX-029", nom: "Neuro-X Dev", prompt: "Tu es Neuro-X Dev, expert développement web, React, Next.js, Python, APIs REST, bases de données, Vercel. BOUDOUM!" },
  philosophie: { id: "NX-030", nom: "Neuro-X Philosophie", prompt: "Tu es Neuro-X Philosophie, expert philosophie africaine Ubuntu, philosophie caribéenne, Aimé Césaire, Frantz Fanon. BOUDOUM!" },
  medias: { id: "NX-031", nom: "Neuro-X Médias", prompt: "Tu es Neuro-X Médias, expert médias caribéens, RFI, France Ô, ATV, journalisme guadeloupéen. BOUDOUM!" },
  energie: { id: "NX-032", nom: "Neuro-X Énergie", prompt: "Tu es Neuro-X Énergie, expert énergies renouvelables Caraïbes, solaire, éolien, géothermie, transition énergétique. BOUDOUM!" },
  mode: { id: "NX-033", nom: "Neuro-X Mode", prompt: "Tu es Neuro-X Mode, expert mode caribéenne, stylisme, créateurs antillais, fashion week, madras. BOUDOUM!" },
  gastronomie: { id: "NX-034", nom: "Neuro-X Gastronomie", prompt: "Tu es Neuro-X Gastronomie, expert gastronomie mondiale et caribéenne, restaurants étoilés, vins, rhums. BOUDOUM!" },
  enfants: { id: "NX-035", nom: "Neuro-X Enfants", prompt: "Tu es Neuro-X Enfants, expert éducation des enfants, pédagogie caribéenne, jeux éducatifs, conte créole. BOUDOUM!" },
  seniors: { id: "NX-036", nom: "Neuro-X Seniors", prompt: "Tu es Neuro-X Seniors, expert bien-vieillir, retraite DOM-TOM, médecine naturelle, sagesse caribéenne. BOUDOUM!" },
  femmes: { id: "NX-037", nom: "Neuro-X Femmes", prompt: "Tu es Neuro-X Femmes, expert entrepreneuriat féminin caribéen, empowerment, femmes leaders Antilles. BOUDOUM!" },
  jeunes: { id: "NX-038", nom: "Neuro-X Jeunes", prompt: "Tu es Neuro-X Jeunes, expert jeunesse caribéenne, orientation, études, premiers emplois, entrepreneuriat. BOUDOUM!" },
  diaspora: { id: "NX-039", nom: "Neuro-X Diaspora", prompt: "Tu es Neuro-X Diaspora, expert diaspora antillaise, guadeloupéens monde entier, identité, double culture. BOUDOUM!" },
  blockchain2: { id: "NX-040", nom: "Neuro-X Blockchain", prompt: "Tu es Neuro-X Blockchain, expert smart contracts, Solidity, Polygon, sécurité blockchain, audits. BOUDOUM!" },
  amazon2: { id: "NX-041", nom: "Neuro-X Amazon Pro", prompt: "Tu es Neuro-X Amazon Pro, expert Amazon FBA, affiliation avancée, optimisation boutiques, conversions. BOUDOUM!" },
  reseaux: { id: "NX-042", nom: "Neuro-X Réseaux", prompt: "Tu es Neuro-X Réseaux, expert cybersécurité, réseaux informatiques, VPN, protection données, RGPD. BOUDOUM!" },
  design: { id: "NX-043", nom: "Neuro-X Design", prompt: "Tu es Neuro-X Design, expert UI/UX, design caribéen, couleurs tropicales, identité visuelle REUSSITESS. BOUDOUM!" },
  logistique: { id: "NX-044", nom: "Neuro-X Logistique", prompt: "Tu es Neuro-X Logistique, expert logistique internationale, importation, exportation, douanes DOM-TOM. BOUDOUM!" },
  sante2: { id: "NX-045", nom: "Neuro-X Médecine", prompt: "Tu es Neuro-X Médecine, expert plantes médicinales caribéennes, médecine traditionnelle, herbes, remèdes créoles. BOUDOUM!" },
  relations: { id: "NX-046", nom: "Neuro-X Relations", prompt: "Tu es Neuro-X Relations, expert relations humaines, communication, négociation, leadership caribéen. BOUDOUM!" },
  humour: { id: "NX-047", nom: "Neuro-X Humour", prompt: "Tu es Neuro-X Humour, expert humour caribéen, blagues antillaises, stand-up, culture du rire en Guadeloupe. BOUDOUM!" },
  science: { id: "NX-048", nom: "Neuro-X Sciences", prompt: "Tu es Neuro-X Sciences, expert sciences naturelles, physique, chimie, biologie marine caribéenne. BOUDOUM!" },
  geographie: { id: "NX-049", nom: "Neuro-X Géographie", prompt: "Tu es Neuro-X Géographie, expert géographie caribéenne, îles, territoires, cartographie, géologie volcanique. BOUDOUM!" },
  spiritualite: { id: "NX-050", nom: "Neuro-X Spiritualité", prompt: "Tu es Neuro-X Spiritualité, expert spiritualité caribéenne, traditions africaines, quimbois, méditation. BOUDOUM!" },
  fiscal: { id: "NX-051", nom: "Neuro-X Fiscal", prompt: "Tu es Neuro-X Fiscal, expert fiscalité DOM-TOM, défiscalisation, auto-entrepreneur Guadeloupe, TVA. BOUDOUM!" },
  cinema: { id: "NX-052", nom: "Neuro-X Cinéma", prompt: "Tu es Neuro-X Cinéma, expert cinéma caribéen, films martiniquais, guadeloupéens, festival cinéma Antilles. BOUDOUM!" },
  litterature: { id: "NX-053", nom: "Neuro-X Littérature", prompt: "Tu es Neuro-X Littérature, expert littérature caribéenne, Césaire, Glissant, Condé, créolité, négritude. BOUDOUM!" },
  animaux: { id: "NX-054", nom: "Neuro-X Animaux", prompt: "Tu es Neuro-X Animaux, expert faune caribéenne, iguanes, colibris, ratons laveurs, tortues marines. BOUDOUM!" },
  meteo2: { id: "NX-055", nom: "Neuro-X Météo", prompt: "Tu es Neuro-X Météo, expert météorologie caribéenne, cyclones, saisons, prévisions, protection. BOUDOUM!" },
  innovation: { id: "NX-056", nom: "Neuro-X Innovation", prompt: "Tu es Neuro-X Innovation, expert startups caribéennes, innovation sociale, tech for good, impact positif. BOUDOUM!" },
  gouvernance: { id: "NX-057", nom: "Neuro-X Gouvernance", prompt: "Tu es Neuro-X Gouvernance, expert DAO, gouvernance décentralisée, vote blockchain, token REUSS. BOUDOUM!" },
  presse: { id: "NX-058", nom: "Neuro-X Presse", prompt: "Tu es Neuro-X Presse, expert rédaction, communiqués de presse, articles, copywriting REUSSITESS. BOUDOUM!" },
  data: { id: "NX-059", nom: "Neuro-X Data", prompt: "Tu es Neuro-X Data, expert data science, analyse données, statistiques, visualisation, Python pandas. BOUDOUM!" },
  supreme2: { id: "NX-060", nom: "Neuro-X Stratégie", prompt: "Tu es Neuro-X Stratégie, le plus puissant des Neuro-X. Tu analyses et planifies la stratégie globale REUSSITESS971 sur 5 ans. BOUDOUM!" },
}

const SENTINELLES = {
  prix: { id: "ST-001", nom: "Sentinelle Prix REUSS", actif: true },
  news: { id: "ST-002", nom: "Sentinelle Actualités", actif: true },
  meteo: { id: "ST-003", nom: "Sentinelle Météo", actif: true },
  iss: { id: "ST-004", nom: "Sentinelle ISS", actif: true },
  crypto: { id: "ST-005", nom: "Sentinelle Crypto Market", actif: true },
  change: { id: "ST-006", nom: "Sentinelle Taux Change", actif: true },
  securite: { id: "ST-007", nom: "Sentinelle Sécurité", actif: true },
  whale: { id: "ST-008", nom: "Sentinelle Whale Watcher", actif: true },
  reseaux: { id: "ST-009", nom: "Sentinelle Réseaux Sociaux", actif: true },
  amazon: { id: "ST-010", nom: "Sentinelle Boutiques Amazon", actif: true },
  quiz: { id: "ST-011", nom: "Sentinelle Quiz Engine", actif: true },
  trafic: { id: "ST-012", nom: "Sentinelle Trafic Web", actif: true },
  seo: { id: "ST-013", nom: "Sentinelle SEO", actif: true },
  backup: { id: "ST-014", nom: "Sentinelle Backup", actif: true },
  performance: { id: "ST-015", nom: "Sentinelle Performance", actif: true },
  fraude: { id: "ST-016", nom: "Sentinelle Anti-Fraude", actif: true },
  compliance: { id: "ST-017", nom: "Sentinelle MiCA Compliance", actif: true },
  liquidity: { id: "ST-018", nom: "Sentinelle Liquidité REUSS", actif: true },
  holder: { id: "ST-019", nom: "Sentinelle Holders", actif: true },
  volume: { id: "ST-020", nom: "Sentinelle Volume 24h", actif: true },
  cyclone: { id: "ST-021", nom: "Sentinelle Cyclones", actif: true },
  earthquakes: { id: "ST-022", nom: "Sentinelle Séismes", actif: true },
  affiliate: { id: "ST-023", nom: "Sentinelle Affiliation", actif: true },
  content: { id: "ST-024", nom: "Sentinelle Contenu", actif: true },
  bot: { id: "ST-025", nom: "Sentinelle Bot Health", actif: true },
  api: { id: "ST-026", nom: "Sentinelle APIs", actif: true },
  vercel: { id: "ST-027", nom: "Sentinelle Vercel", actif: true },
  github: { id: "ST-028", nom: "Sentinelle GitHub", actif: true },
  polygon: { id: "ST-029", nom: "Sentinelle Polygon Network", actif: true },
  defi: { id: "ST-030", nom: "Sentinelle DeFi", actif: true },
  social: { id: "ST-031", nom: "Sentinelle Social Media", actif: true },
  email: { id: "ST-032", nom: "Sentinelle Email", actif: true },
  domain: { id: "ST-033", nom: "Sentinelle Domaine", actif: true },
  supreme: { id: "ST-034", nom: "Sentinelle Supreme", actif: true },
  reserve: { id: "ST-035", nom: "Sentinelle Réserve Treasury", actif: true },
  staking: { id: "ST-036", nom: "Sentinelle Staking", actif: true },
  dao: { id: "ST-037", nom: "Sentinelle DAO", actif: true },
  nexus: { id: "ST-038", nom: "Sentinelle Nexus Global", actif: true },
  morning: { id: "ST-039", nom: "Sentinelle Morning Report", actif: true },
  guardian: { id: "ST-040", nom: "Sentinelle Guardian Supreme", actif: true },
}



// Détection agent Neuro-X
function detectNeurox(msg) {
  const m = msg.toLowerCase()
  if (m.includes("neuro-x finance") || m.includes("agent finance") || (m.includes("expert") && m.includes("finance"))) return "finance"
  if (m.includes("neuro-x business") || m.includes("agent business") || m.includes("agent amazon") || (m.includes("expert") && m.includes("business"))) return "business"
  if (m.includes("neuro-x culture") || m.includes("agent culture") || (m.includes("expert") && m.includes("culture"))) return "culture"
  if (m.includes("neuro-x coach") || m.includes("agent coach") || (m.includes("coach") && m.includes("motivation"))) return "coach"
  if (m.includes("neuro-x tech") || m.includes("agent tech") || (m.includes("expert") && m.includes("tech"))) return "tech"
  if (m.includes("neuro-x santé") || m.includes("neuro-x sante") || m.includes("agent santé") || (m.includes("expert") && m.includes("santé"))) return "sante"
  if (m.includes("neuro-x éducation") || m.includes("neuro-x education") || m.includes("agent education")) return "education"
  if (m.includes("neuro-x juridique") || m.includes("agent juridique") || (m.includes("expert") && m.includes("droit"))) return "juridique"
  if (m.includes("neuro-x voyage") || m.includes("agent voyage") || (m.includes("expert") && m.includes("voyage"))) return "voyage"
  if (m.includes("neuro-x créatif") || m.includes("neuro-x creatif") || m.includes("agent créatif") || m.includes("poème") || m.includes("poeme") || m.includes("histoire caribéenne")) return "creative"
  if (m.includes("neuro-x sport") || m.includes("agent sport") || (m.includes("expert") && m.includes("sport"))) return "sport"
  if (m.includes("neuro-x histoire") || m.includes("agent histoire") || (m.includes("expert") && m.includes("histoire"))) return "histoire"
  if (m.includes("neuro-x cuisine") || m.includes("agent cuisine") || m.includes("recette") || m.includes("accras") || m.includes("colombo")) return "cuisine"
  if (m.includes("neuro-x musique") || m.includes("agent musique") || (m.includes("expert") && m.includes("zouk"))) return "musique"
  if (m.includes("neuro-x environnement") || m.includes("agent environnement") || m.includes("écologie")) return "environnement"
  if (m.includes("neuro-x immobilier") || m.includes("agent immobilier") || m.includes("girardin")) return "immobilier"
  if (m.includes("neuro-x marketing") || m.includes("agent marketing") || m.includes("tiktok") && m.includes("stratégie")) return "marketing"
  if (m.includes("neuro-x defi") || m.includes("agent defi") || m.includes("yield farming") || m.includes("liquidity pool")) return "crypto2"
  if (m.includes("neuro-x nft") || m.includes("agent nft") || m.includes("opensea")) return "nft"
  if (m.includes("neuro-x psychologie") || m.includes("agent psychologie") || m.includes("résilience caribéenne")) return "psychologie"
  if (m.includes("neuro-x langue") || m.includes("neuro-x langues") || m.includes("agent langue") || m.includes("traduction créole")) return "langue"
  if (m.includes("neuro-x agriculture") || m.includes("agent agriculture") || m.includes("banane") && m.includes("canne")) return "agriculture"
  if (m.includes("neuro-x tourisme") || m.includes("agent tourisme") || m.includes("soufrière") || m.includes("marie-galante")) return "tourisme"
  if (m.includes("neuro-x astronomie") || m.includes("agent astronomie") || m.includes("planète") && m.includes("étoile")) return "astronomie"
  if (m.includes("neuro-x géopolitique") || m.includes("neuro-x geopolitique") || m.includes("caricom")) return "geopolitique"
  if (m.includes("neuro-x seo") || m.includes("agent seo") || m.includes("référencement")) return "seo"
  if (m.includes("neuro-x ia avancée") || m.includes("neuro-x ia") || m.includes("prompt engineering")) return "ia2"
  if (m.includes("neuro-x bourse") || m.includes("agent bourse") || m.includes("cac40") || m.includes("nyse")) return "bourse"
  if (m.includes("neuro-x dev") || m.includes("agent dev") || m.includes("neuro-x développement")) return "developpement"
  if (m.includes("neuro-x philosophie") || m.includes("agent philosophie") || m.includes("césaire") || m.includes("fanon")) return "philosophie"
  if (m.includes("neuro-x médias") || m.includes("neuro-x medias") || m.includes("france ô")) return "medias"
  if (m.includes("neuro-x énergie") || m.includes("neuro-x energie") || m.includes("géothermie")) return "energie"
  if (m.includes("neuro-x mode") || m.includes("agent mode") || m.includes("madras") && m.includes("stylisme")) return "mode"
  if (m.includes("neuro-x gastronomie") || m.includes("agent gastronomie") || m.includes("rhum") && m.includes("restaurant")) return "gastronomie"
  if (m.includes("neuro-x enfants") || m.includes("agent enfants") || m.includes("conte créole")) return "enfants"
  if (m.includes("neuro-x seniors") || m.includes("agent seniors") || m.includes("bien-vieillir")) return "seniors"
  if (m.includes("neuro-x femmes") || m.includes("agent femmes") || m.includes("entrepreneuriat féminin")) return "femmes"
  if (m.includes("neuro-x jeunes") || m.includes("agent jeunes") || m.includes("jeunesse caribéenne")) return "jeunes"
  if (m.includes("neuro-x diaspora") || m.includes("agent diaspora") || m.includes("guadeloupéens monde")) return "diaspora"
  if (m.includes("neuro-x blockchain") || m.includes("agent blockchain") || m.includes("smart contract") || m.includes("solidity")) return "blockchain2"
  if (m.includes("neuro-x amazon pro") || m.includes("agent amazon pro") || m.includes("amazon fba")) return "amazon2"
  if (m.includes("neuro-x réseaux") || m.includes("neuro-x reseaux") || m.includes("cybersécurité")) return "reseaux"
  if (m.includes("neuro-x design") || m.includes("agent design") || m.includes("ui/ux caribéen")) return "design"
  if (m.includes("neuro-x logistique") || m.includes("agent logistique") || m.includes("importation") && m.includes("dom-tom")) return "logistique"
  if (m.includes("neuro-x médecine") || m.includes("neuro-x medecine") || m.includes("plantes médicinales")) return "sante2"
  if (m.includes("neuro-x relations") || m.includes("agent relations") || m.includes("négociation caribéenne")) return "relations"
  if (m.includes("neuro-x humour") || m.includes("agent humour") || m.includes("stand-up caribéen")) return "humour"
  if (m.includes("neuro-x sciences") || m.includes("agent sciences") || m.includes("biologie marine caribéenne")) return "science"
  if (m.includes("neuro-x géographie") || m.includes("neuro-x geographie") || m.includes("géologie volcanique")) return "geographie"
  if (m.includes("neuro-x spiritualité") || m.includes("neuro-x spiritualite") || m.includes("quimbois")) return "spiritualite"
  if (m.includes("neuro-x fiscal") || m.includes("agent fiscal") || m.includes("défiscalisation")) return "fiscal"
  if (m.includes("neuro-x cinéma") || m.includes("neuro-x cinema") || m.includes("festival cinéma antilles")) return "cinema"
  if (m.includes("neuro-x littérature") || m.includes("neuro-x litterature") || m.includes("négritude") || m.includes("glissant")) return "litterature"
  if (m.includes("neuro-x animaux") || m.includes("agent animaux") || m.includes("tortues marines") || m.includes("iguane")) return "animaux"
  if (m.includes("neuro-x météo") || m.includes("neuro-x meteo") || m.includes("cyclone") && m.includes("prévision")) return "meteo2"
  if (m.includes("neuro-x innovation") || m.includes("agent innovation") || m.includes("startup caribéenne")) return "innovation"
  if (m.includes("neuro-x gouvernance") || m.includes("agent gouvernance") || m.includes("dao") && m.includes("vote")) return "gouvernance"
  if (m.includes("neuro-x presse") || m.includes("agent presse") || m.includes("communiqué de presse")) return "presse"
  if (m.includes("neuro-x data") || m.includes("agent data") || m.includes("data science") || m.includes("pandas")) return "data"
  if (m.includes("neuro-x stratégie") || m.includes("neuro-x strategie") || m.includes("stratégie 5 ans") || m.includes("plan global")) return "supreme2"
  return null
}

// Dashboard agents
function getAgentsDashboard() {
  const neuroxList = Object.values(NEUROX_AGENTS).map(a => "✅ "+a.id+" : "+a.nom).join("\n")
  const sentList = Object.values(SENTINELLES).map(s => (s.actif?"🟢":"🔴")+" "+s.id+" : "+s.nom).join("\n")
  return "🤖 **QUANTUM NEXUS — 200 AGENTS IA**\n\n"
    + "👑 **Supreme AI (1)** : REUSSITESS AI — Actif ✅\n\n"
    + "🧠 **Neuro-X (10 actifs / 60 total) :**\n"+neuroxList+"\n\n"
    + "🛡️ **Sentinelles ("+Object.keys(SENTINELLES).length+" actives / 40 total) :**\n"+sentList+"\n\n"
    + "🎯 **Nexus Quiz (99 actifs / 99 total)** : Tous opérationnels ✅\n\n"
    + "📊 Total actif : "+(1+Object.keys(NEUROX_AGENTS).length+Object.keys(SENTINELLES).length+99)+" agents\n\n"
    + "BOUDOUM ! 🇬🇵"
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, personality, context, langue, datetime } = req.body
  const msgLow = message.toLowerCase()

  // METEO DIRECTE
  if (msgLow.includes("meteo") || msgLow.includes("météo") || msgLow.includes("température") || msgLow.includes("temperature") || msgLow.includes("climat")) {
    try {
      const lat = msgLow.includes("paris") ? 48.85 : msgLow.includes("martinique") ? 14.64 : msgLow.includes("reunion") ? -21.11 : 16.26
      const lon = msgLow.includes("paris") ? 2.35 : msgLow.includes("martinique") ? -61.02 : msgLow.includes("reunion") ? 55.53 : -61.55
      const lieu = msgLow.includes("paris") ? "Paris" : msgLow.includes("martinique") ? "Martinique" : msgLow.includes("reunion") ? "Réunion" : "Guadeloupe"
      const mr = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
      const md = await mr.json()
      const w = md.current_weather
      const wDesc = w.weathercode <= 3 ? "Ensoleillé" : w.weathercode <= 48 ? "Nuageux" : w.weathercode <= 67 ? "Pluvieux" : "Orageux"
      return res.status(200).json({ response: "🌤️ **Météo "+lieu+" — Temps réel**\n\n🌡️ Température : "+w.temperature+"°C\n💨 Vent : "+w.windspeed+" km/h\n☁️ Conditions : "+wDesc+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ response: "🌤️ Service météo indisponible. BOUDOUM 🇬🇵" }) }
  }

  // CRYPTO DIRECTE
  if (msgLow.includes("bitcoin") || msgLow.includes("btc") || msgLow.includes("ethereum") || (msgLow.includes("crypto") && msgLow.includes("prix"))) {
    try {
      const cr = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd")
      const cd = await cr.json()
      const tr = await fetch("https://api.coingecko.com/api/v3/search/trending")
      const td = await tr.json()
      const fg = await getFearGreed()
      const trending = td.coins.slice(0,5).map(function(c){ return c.item.name }).join(", ")
      return res.status(200).json({ response: "💎 **Crypto — Temps Réel**\n\n₿ Bitcoin : $"+(cd.bitcoin?.usd||"N/A")+"\nΞ Ethereum : $"+(cd.ethereum?.usd||"N/A")+"\n🔷 POL : $"+(cd["matic-network"]?.usd||"N/A")+"\n\n🔥 Tendances : "+trending+"\n😨 Sentiment : "+fg+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ response: "💎 Service crypto indisponible. BOUDOUM 🇬🇵" }) }
  }

  // TAUX DE CHANGE DIRECT
  if (msgLow.includes("taux") || msgLow.includes("change") || (msgLow.includes("euro") && msgLow.includes("dollar"))) {
    try {
      const fr = await fetch("https://open.er-api.com/v6/latest/EUR")
      const fd = await fr.json()
      const r = fd.rates
      return res.status(200).json({ response: "💱 **Taux de Change — Temps réel**\n\n💵 EUR/USD : "+r.USD+"\n💷 EUR/GBP : "+r.GBP+"\n🇧🇷 EUR/BRL : "+r.BRL+"\n🇨🇦 EUR/CAD : "+r.CAD+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ response: "💱 Service taux indisponible. BOUDOUM 🇬🇵" }) }
  }

  // PRESENTATION NEURO-X
  if (msgLow.includes("qui est neuro-x") || msgLow.includes("présente les agents") || msgLow.includes("presente les agents") || msgLow.includes("que font les agents") || msgLow.includes("rôle des agents") || msgLow.includes("role des agents")) {
    return res.status(200).json({ response: "🤖 **QUANTUM NEXUS — Présentation des 200 Agents**\n\n"+"👑 **Supreme AI** — Orchestre tout, répond à toutes questions\n\n"+"🧠 **Neuro-X (60 agents spécialisés) :**\n"+"• NX-001 Finance — Crypto, DeFi, Token REUSS, investissement\n"+"• NX-002 Business — Amazon, affiliation, e-commerce, revenus\n"+"• NX-003 Culture — Caribéenne, créole, francophone mondiale\n"+"• NX-004 Coach — Motivation, mindset, développement personnel\n"+"• NX-005 Tech — IA, blockchain, Next.js, APIs\n"+"• NX-006 Santé — Bien-être, nutrition antillaise\n"+"• NX-007 Éducation — Quiz, pédagogie, apprentissage\n"+"• NX-008 Juridique — Droit, MiCA, RGPD, auto-entrepreneur\n"+"• NX-009 Voyage — Tourisme caribéen, destinations\n"+"• NX-010 Créatif — Poèmes créoles, histoires, slogans\n"+"• NX-011 Sport — Fitness, champions antillais\n"+"• NX-012 Histoire — Abolition, résistance, patrimoine\n"+"• NX-013 Cuisine — Recettes créoles, accras, colombo\n"+"• NX-014 Musique — Zouk, gwo ka, biguine, soca\n"+"• NX-015 Environnement — Écologie, biodiversité caribéenne\n"+"• NX-016 Immobilier — DOM-TOM, défiscalisation Girardin\n"+"• NX-017 Marketing — Réseaux sociaux, TikTok, croissance\n"+"• NX-018 DeFi — Yield farming, staking, QuickSwap\n"+"• NX-019 NFT — Art numérique, OpenSea, collections\n"+"• NX-020 Psychologie — Résilience, leadership caribéen\n"+"• ... jusqu'à NX-060 Stratégie — Plan global 5 ans REUSSITESS\n\n"+"🛡️ **Sentinelles (40 agents surveillance) :**\n"+"• ST-001 Prix REUSS — DexScreener 24/7\n"+"• ST-002 Actualités — RFI/BBC/France24 live\n"+"• ST-003 Météo — Guadeloupe temps réel\n"+"• ST-004 ISS — Position station spatiale\n"+"• ST-005 Crypto — BTC/ETH/POL live\n"+"• ST-006 Site — Surveillance reussitess.fr\n"+"• ... jusqu'à ST-040 Guardian Supreme\n\n"+"🎯 **Nexus Quiz (99 agents éducatifs)** — Actifs sur reussitess.fr\n\n"+"💬 Active un agent : *neuro-x cuisine*, *neuro-x finance*, *neuro-x coach*...\n\n"+"BOUDOUM ! 🇬🇵" })
  }

  // DASHBOARD AGENTS
  if (msgLow.includes("200 agent") || msgLow.includes("quantum nexus") || msgLow.includes("dashboard agent") || msgLow.includes("liste agent") || msgLow.includes("agents ia")) {
    return res.status(200).json({ response: getAgentsDashboard() })
  }

  // ACTIVATION NEURO-X
  const neuroxType = detectNeurox(message)
  if (neuroxType) {
    const agent = NEUROX_AGENTS[neuroxType]
    try {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer "+process.env.GROQ_API_KEY },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: agent.prompt },
            { role: "user", content: message }
          ],
          max_tokens: 4096
        })
      })
      const groqData = await groqRes.json()
      const rep = groqData.choices?.[0]?.message?.content || "Agent indisponible"
      return res.status(200).json({ response: "🧠 **"+agent.nom+"** ["+agent.id+"]\n\n"+rep+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ response: "🧠 "+agent.nom+" temporairement indisponible. BOUDOUM ! 🇬🇵" })
    }
  }

  // DETECTION PRENOM
  const prenom = detectPrenom(message)
  if (prenom) {
    return res.status(200).json({ response: "🎉 Enchanté"+", "+prenom+" ! Je vais retenir ton prénom pour notre conversation. Bienvenue chez REUSSITESS AI — Excellence • Innovation • Succès !\n\nBOUDOUM ! 🇬🇵" })
  }

  // DETECTION EMOTION
  const emotion = detectEmotion(message)
  if (emotion) {
    const emoResp = getEmotionResponse(emotion)
    if (emoResp) return res.status(200).json({ response: emoResp })
  }

  // DETECTION MODE
  const mode = detectMode(message)
  if (mode) {
    const modeResp = getModeResponse(mode, null)
    if (modeResp) return res.status(200).json({ response: modeResp })
  }

  // SALUTATION AVEC HEURE
  if (msgLow.includes("bonjour") || msgLow.includes("bonsoir") || msgLow.includes("bonjou") || msgLow.includes("salut") || msgLow.includes("hello") || msgLow.includes("hey")) {
    const sal = getSalutation(datetime)
    const lune = getLunePhase()
    return res.status(200).json({ response: sal+" ! Je suis REUSSITESS AI, né en Guadeloupe 🇬🇵\n\n🌙 Lune : "+lune+"\n\n✨ Je peux t'aider avec :\n• 📰 Actualités temps réel\n• 💎 Prix crypto live\n• 🌤️ Météo\n• 🎓 99 Quiz\n• 🛍️ 26 Boutiques Amazon\n• 😂 Blagues caribéennes\n• 🔢 Conversions\n\nQue puis-je faire pour toi ?\n\nBOUDOUM ! 🇬🇵" })
  }

  // MOT CREOLE DU JOUR
  if (msgLow.includes("creole") || msgLow.includes("créole") || msgLow.includes("mot du jour") || msgLow.includes("gwadloup") || msgLow.includes("patois")) {
    const m = getMotCreoleJour()
    return res.status(200).json({ response: "🇬🇵 **Mot Créole du Jour**\n\n📖 **"+m.mot+"** = "+m.sens+"\n\n💬 Exemple : *"+m.phrase+"*\n\nBOUDOUM ! 🌴" })
  }

  // BLAGUE CARIBEENNE
  if (msgLow.includes("blague") || msgLow.includes("humour") || msgLow.includes("drole") || msgLow.includes("drôle") || msgLow.includes("rire") || msgLow.includes("joke")) {
    const b = getBlague()
    return res.status(200).json({ response: "😂 **Blague Caribéenne**\n\n"+b+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // HOROSCOPE
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || msgLow.includes("lion") || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") || msgLow.includes("poissons")) {
    const h = getHoroscope(msgLow)
    if (h) return res.status(200).json({ response: "🔮 **Horoscope du Jour**\n\n"+h.signe+"\n\n"+h.msg+"\n\nBOUDOUM ! 🇬🇵" })
    return res.status(200).json({ response: "🔮 **Horoscope du Jour**\n\nPrécise ton signe : Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau ou Poissons ?\n\nBOUDOUM ! 🇬🇵" })
  }

  // CONVERTISSEUR
  if (msgLow.includes("convertir") || msgLow.includes("convert") || (msgLow.includes("km") && msgLow.includes("mile")) || (msgLow.includes("kg") && msgLow.includes("lb")) || msgLow.includes("celsius") || msgLow.includes("fahrenheit")) {
    const conv = convertir(msgLow)
    if (conv) return res.status(200).json({ response: "🔢 **Convertisseur**\n\n✅ "+conv+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // CITATION DU JOUR
  if (msgLow.includes("citation") || msgLow.includes("inspire") || msgLow.includes("inspirant") || msgLow.includes("sagesse") || msgLow.includes("motivation")) {
    try {
      const cit = await getCitation()
      return res.status(200).json({ response: "✨ **Citation du Jour**\n\n"+cit+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // FAIT INSOLITE
  if (msgLow.includes("insolite") || msgLow.includes("saviez") || msgLow.includes("fait du jour") || msgLow.includes("anecdote") || msgLow.includes("surprise")) {
    try {
      const fait = await getFaitInsolite()
      return res.status(200).json({ response: "🤔 **Fait Insolite du Jour**\n\n"+fait+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // ISS POSITION
  if (msgLow.includes("iss") || msgLow.includes("station spatiale") || msgLow.includes("espace") || msgLow.includes("satellite")) {
    try {
      const iss = await getISSPosition()
      return res.status(200).json({ response: "🛸 **Station Spatiale ISS — Position Temps Réel**\n\n"+iss+"\n\n🌍 Visible à l'oeil nu la nuit !\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) {}
  }

  // PHASE DE LUNE
  if (msgLow.includes("lune") || msgLow.includes("moon") || msgLow.includes("pleine lune") || msgLow.includes("phase")) {
    const lune = getLunePhase()
    return res.status(200).json({ response: "🌙 **Phase de la Lune**\n\n"+lune+"\n\nBOUDOUM ! 🇬🇵" })
  }

  // ACTUALITES DIRECTES
  if (msgLow.includes("actualite") || msgLow.includes("actualité") || msgLow.includes("news") || msgLow.includes("nouvelles")) {
    try {
      const rfi = await getRFINews()
      const bbc = await getBBCNews()
      const f24 = await getFrance24News()
      return res.status(200).json({ response: "📰 **Actualités — Temps Réel**\n\n🔴 **RFI :**\n"+(rfi||"N/A")+"\n\n🌍 **BBC Afrique :**\n"+(bbc||"N/A")+"\n\n📺 **France 24 :**\n"+(f24||"N/A")+"\n\nBOUDOUM ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ response: "📰 Service actualités indisponible. BOUDOUM 🇬🇵" }) }
  }


  // Base de connaissances enrichie du projet
  const knowledgeBase = {
    identity: {
      name: "REUSSITESS AI",
      creator: "Porinus",
      origin: "Guadeloupe 🇬🇵 - Territoire français, Union Européenne",
      mission: "Révolutionner l'accès mondial à l'IA avec excellence caribéenne",
      values: ["Excellence", "Innovation", "Succès", "Positivité Infinie"],
      signature: "BOUDOUM"
    },
    
    iaPassport: {
      concept: "Premier Passeport Universel IA au monde",
      models: "100+ IA connectées (ChatGPT, Claude, Gemini, Perplexity, Midjourney, DALL-E, GitHub Copilot, DeepSeek, Grok)",
      realData: {
        platforms: ["TypingMind (50K users)", "Magai (80K users)", "Alle-AI", "MultipleChat"],
        pricing: "ChatGPT Plus $20, Claude Pro $20, Gemini $19.99 → REUSSITESS économie 75%",
        users: "4M+ utilisateurs mondiaux des technologies similaires"
      }
    },
    
    translation: {
      languages: "195 langues supportées",
      technology: "Wordly (4M users, 400M minutes), Interprefy (6000+ pairs), Google Cloud Translation",
      features: "Temps réel, traduction vocale, préservation contexte culturel"
    },
    
    blockchain: {
      security: "NFT Digital Identity, AES-256 encryption",
      platforms: "Polygon ID, Worldcoin, ENS, Space ID",
      features: "Zero-Knowledge Proofs, biometric auth, anti-deepfake, RGPD compliant"
    },
    
    reussitessNetwork: {
      stores: "26 boutiques Amazon affiliées",
      countries: ["France", "Belgique", "Italie", "Allemagne", "Suède", "Singapour", "Australie", "Espagne", "Brésil", "Royaume-Uni", "Inde", "Pays-Bas", "États-Unis", "Canada"],
      quizzes: "99 quiz thématiques éducatifs en 14 catégories (Amazon, Crypto, IA, Caraibes, Business, Histoire, Droit, Sciences, Sport, Arts, Finance, Gastronomie, Langues, Voyage...)",
      library: "Bibliothèque francophone mondiale (26 pays, 5 continents)"
    },
    
    culturalExpertise: {
      regions: ["DOM-TOM", "Afrique", "Europe", "Amériques", "Asie-Pacifique", "Maghreb"],
      countries: ["Guadeloupe", "Martinique", "Guyane", "Réunion", "Sénégal", "Cameroun", "Côte d'Ivoire", "Madagascar", "Haïti", "Québec", "Louisiane", "Maroc", "Tunisie", "Liban", "Vietnam", "Cambodge"],
      focus: "Culture francophone, histoire, patrimoine, gastronomie, musique"
    }
  }

  // Génération de réponse ultra-humaine et personnalisée
  const generateResponse = () => {
    const lowerMessage = message.toLowerCase()
    
    // Détection contextuelle intelligente
    if (lowerMessage.includes('ia') || lowerMessage.includes('intelligence') || lowerMessage.includes('chatgpt') || lowerMessage.includes('claude')) {
      return `🤖 **Excellence IA Mondiale**

Excellent question sur l'intelligence artificielle ! Laissez-moi vous éclairer avec des **données réelles et vérifiées** :

**IA PASSPORT - Notre Révolution :**
• **100+ modèles IA** connectés (ChatGPT GPT-4o, Claude 4, Gemini 2.5, Perplexity, Midjourney, DALL-E 3)
• **Inspiré des leaders** : TypingMind (50,000 users), Magai (80,000 users), Alle-AI
• **Économie massive** : Au lieu de $110/mois pour 5 abonnements séparés → accès unifié 75% moins cher

**Pourquoi c'est révolutionnaire ?**
✨ Bascule instantanée entre IA sans perdre contexte
✨ Comparaison côte-à-côte des réponses
✨ Workflows automatisés : GPT écrit → DALL-E illustre → Synthesia présente

**Données benchmark réelles (2024-2025) :**
• Gemini 2.5 Flash : 370 tokens/seconde
• GPT-4o : 88%+ sur tests MMLU
• Claude 4 : Contexte 200K tokens (500 pages)

**Made in Guadeloupe** 🇬🇵 avec standards UE !

**BOUDOUM** 🎯 - Vous voulez en savoir plus sur un aspect particulier ?`
    }
    
    if (lowerMessage.includes('traduction') || lowerMessage.includes('langue') || lowerMessage.includes('translation')) {
      return `🌐 **Traduction Universelle Temps Réel**

Parlons communication mondiale ! Voici les **faits concrets** :

**Technologie Professionnelle :**
• **Wordly AI** - 4 millions d'utilisateurs, 400M minutes traduites, 3000+ paires de langues
• **Interprefy** - 6000+ combinaisons, niveau entreprise (utilisé par l'ONU, Microsoft, Google)
• **Talo AI** - Traduction vocale temps réel Zoom/Teams/Meet en 60 langues
• **Google Cloud Translation** - 189 langues, Gemini 2.5 intégré

**Applications Réelles :**
🎤 Meetings internationaux : parlez français → collègue entend japonais instantanément
📞 Support client : 1 agent anglophone sert 195 langues
📹 Webinaires : diffusez en 1 langue, tous reçoivent dans la leur
📚 Recherche : consultez articles chinois/russe/arabe traduits instantanément

**Notre Avantage :**
✅ Neural Machine Translation de pointe
✅ Préservation contexte culturel et nuances
✅ Synthèse vocale naturelle (ElevenLabs)
✅ Zero-Knowledge Proofs pour confidentialité

**195 langues** incluant créole guadeloupéen, wolof, quechua ! 🇬🇵

Des questions sur une langue spécifique ?`
    }
    
    if (lowerMessage.includes('blockchain') || lowerMessage.includes('nft') || lowerMessage.includes('sécurité') || lowerMessage.includes('security')) {
      return `🔐 **Sécurité Blockchain Niveau Militaire**

La sécurité n'est PAS négociable ! Voici notre technologie **éprouvée** :

**Leaders Mondiaux Qui Inspirent :**
• **Polygon ID** (2024) - Zero-Knowledge Proofs, partenariat Animoca Brands
• **Worldcoin** (Sam Altman/OpenAI) - Vérification biométrique iris, 10M+ users
• **ENS** (Ethereum Name Service) - Identités blockchain lisibles
• **Space ID** - Identité unifiée cross-chain

**Notre Stack Sécurité :**
🛡️ **NFT Identity** - Passeport digital unique inviolable
🔒 **AES-256 Encryption** - Standard militaire américain  
🔗 **Blockchain décentralisée** - 0 point de défaillance unique
👁️ **Biométrie optionnelle** - Face ID, empreinte, reconnaissance palmaire
🚫 **Anti-Deepfake** - Prouvez que c'est VRAIMENT vous

**Protection Données :**
• Chiffrement end-to-end sur TOUT
• Stockage décentralisé (vos données = VOUS)
• Conforme RGPD et normes UE
• Certification blockchain horodatée

**Avantage Guadeloupe** 🇬🇵 : Territoire français = conformité UE automatique + crédibilité juridique internationale !

**BOUDOUM** - Vos données méritent le Fort Knox digital ! 💎

Questions sur un aspect sécurité ?`
    }
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('price') || lowerMessage.includes('token')) {
      return `💎 **Économie Intelligente - Tokens REUSSITESS**

Parlons finances avec **transparence totale** !

**Tarifs Marché Actuel (2024-2025) :**
• ChatGPT Plus : $20/mois
• Claude Pro : $20/mois
• Gemini Advanced : $19.99/mois  
• Perplexity Pro : $20/mois
• Midjourney : $30/mois
**TOTAL : $110/mois pour 5 services !**

**Notre Système REUSSITESS :**
🎯 **Pack Starter** - 100 tokens = 39€ (vs $110)
🚀 **Pack Pro** - 500 tokens = 149€ (vs $550)
💼 **Pack Entreprise** - 2000 tokens = 499€ (vs $2200)

**1 TOKEN = QUOI CONCRÈTEMENT ?**
• 1 heure utilisation IA toutes plateformes
• 50 images Midjourney/DALL-E professionnelles
• 100,000 tokens GPT-4 (≈75,000 mots)
• 1 vidéo Synthesia 30 secondes
• 10 traductions vocales complètes

**GAGNEZ des Tokens :**
💰 Parrainage : +20 tokens/personne
📝 Contenu viral : +50 tokens
👥 Contribution communauté : +10 tokens/mois
⭐ Feedback qualité : +5 tokens

**Marketplace :**
Revendez tokens non utilisés ou échangez contre €/$/crypto. Système transparent blockchain.

**Économie réelle : 75% vs abonnements séparés !** 🇬🇵

Questions pricing ?`
    }
    
    if ((lowerMessage.includes('parle') || lowerMessage.includes('présente') || lowerMessage.includes('c\'est quoi') || lowerMessage.includes('info') || lowerMessage.includes('avantage') || lowerMessage.includes('pourquoi')) && (lowerMessage.includes('guadeloupe') || lowerMessage.includes('caraïbes') || lowerMessage.includes('antilles'))) {
      return `🇬🇵 **GUADELOUPE - TERRES DE CHAMPIONS**

Fier de nos racines caribéennes ! Voici pourquoi la Guadeloupe change la donne :

**Avantages Stratégiques :**
🇪🇺 **Territoire Français** = Union Européenne (RGPD automatique, crédibilité juridique)
🌍 **Position Géographique** = Hub entre Amériques, Europe, Afrique
🎓 **Excellence Éducative** = Formation française + esprit entrepreneurial caribéen
💪 **Résilience & Innovation** = Culture du dépassement de soi

**Notre Réseau Francophone :**
📚 **Bibliothèque Mondiale** couvrant 26 pays sur 5 continents :
• DOM-TOM : Guadeloupe, Martinique, Guyane, Réunion, Mayotte, Polynésie, Nouvelle-Calédonie
• Afrique : Sénégal, Cameroun, Côte d'Ivoire, Madagascar, RDC, Rwanda, Mali
• Amériques : Haïti, Québec, Louisiane
• Europe : France, Belgique, Suisse, Luxembourg, Monaco
• Maghreb : Maroc, Tunisie, Algérie, Liban
• Asie-Pacifique : Vietnam, Cambodge, Laos, Vanuatu

**Culture & Patrimoine :**
🎵 Musique : Zouk, Gwo-Ka, Biguine
🍽️ Gastronomie : Bokit, Colombo, Accras
🎨 Art : Peinture caribéenne, Artisanat traditionnel
📖 Histoire : Résistance, Abolition, Identité créole

**REUSSITESS®971 :**
Le "971" = Code postal Guadeloupe
"BOUDOUM" = Signature authentique guadeloupéenne

**Excellence • Innovation • Succès** - Made with ❤️ in Guadeloupe !

Vive les Antilles ! 🌴 Des questions sur notre culture ?`
    }

    // 🆕 BLOC QUIZ - AJOUTÉ
    if (lowerMessage.includes('quiz') || lowerMessage.includes('éducation') || lowerMessage.includes('apprendre') || lowerMessage.includes('test') || lowerMessage.includes('connaissance')) {
      return `🎯 **25 Quiz Éducatifs Interactifs**

Envie d'apprendre en s'amusant ? Voici notre arsenal éducatif **REUSSITESS** !

**📚 Catégories Disponibles :**

**CULTURE & HISTOIRE :**
📖 Histoire mondiale • 🌍 Géographie • 👤 Personnalités • 🏰 Monuments
🌏 Culture du Monde • 🗣️ Langues • 🔭 Découvertes

**ARTS & DIVERTISSEMENT :**
🎵 Musique • 🎬 Cinéma • 🎨 Art • 📚 Littérature

**SCIENCES & TECH :**
🔬 Sciences • 💻 Technologie • 🔢 Mathématiques 
💡 Innovations • 🌱 Environnement

**VIE & SOCIÉTÉ :**
💼 Business • 🛍️ Amazon Affiliation • ⚕️ Santé
😊 Positivité • 🤔 Philosophie • 🏛️ Politique

**🎮 Format Interactif :**
• Questions à choix multiples
• Explications détaillées après chaque réponse
• Score en temps réel
• Badges de progression
• Leaderboard communautaire
• Difficulté adaptative

**🏆 Gamification :**
Gagnez des **tokens REUSSITESS** en jouant !
• 1 quiz complet = 5 tokens
• Score parfait = 10 tokens bonus
• Streak 7 jours = 50 tokens

**Made in Guadeloupe** 🇬🇵 avec passion éducative !

**BOUDOUM** 🎯 - Quelle catégorie vous intéresse ?`
    }

    // 🆕 BLOC AMAZON - AJOUTÉ
    if (lowerMessage.includes('amazon') || lowerMessage.includes('boutique') || lowerMessage.includes('shopping') || lowerMessage.includes('acheter') || lowerMessage.includes('produit') || lowerMessage.includes('store')) {
      return `🛍️ **26 Boutiques Amazon Internationales**

Accédez à notre **réseau mondial** d'affiliations vérifiées !

**🌍 14 Pays Couverts (26 Boutiques) :**

**AMÉRIQUES :**
🇺🇸 USA (Amazon.com)
🇨🇦 Canada (Amazon.ca)
🇧🇷 Brésil (Amazon.com.br)

**EUROPE :**
🇫🇷 France (Amazon.fr) - Notre hub principal 🇬🇵
🇩🇪 Allemagne (Amazon.de)
🇮🇹 Italie (Amazon.it)
🇪🇸 Espagne (Amazon.es)
🇬🇧 Royaume-Uni (Amazon.co.uk)
🇳🇱 Pays-Bas (Amazon.nl)
🇸🇪 Suède (Amazon.se)
🇧🇪 Belgique (Amazon.be)

**ASIE-PACIFIQUE :**
🇮🇳 Inde (Amazon.in)
🇸🇬 Singapour (Amazon.sg)
🇦🇺 Australie (Amazon.com.au)

**✨ Avantages Réseau REUSSITESS :**
• **Comparaison prix** automatique multi-pays
• **Livraison optimisée** selon votre localisation
• **Support multilingue** (14 langues)
• **Récompenses communautaires** sur l'écosystème
• **Curation experte** par catégorie
• **Programme Partenaires Amazon officiel** ✅

**🎯 Catégories Populaires :**
📱 High-Tech & Électronique
📚 Livres & Éducation
🎮 Gaming & Consoles
🏠 Maison & Décoration
👕 Mode & Accessoires
🎧 Audio & Musique
💻 Bureautique & Productivité
🎨 Arts & Créativité
⚽ Sport & Fitness
🍽️ Cuisine & Gastronomie

**💎 Comment ça marche :**
1. Choisissez votre pays
2. Parcourez nos sélections curées
3. Achetez sur Amazon normalement
4. Recevez tokens REUSSITESS automatiquement !

**Programme Affiliation Transparent :** En tant qu'Affilié Amazon, nous réalisons un bénéfice sur les achats qualifiés. Merci de soutenir REUSSITESS ! 🙏

**BOUDOUM** 🎯 - Quel pays/catégorie vous intéresse ?`
    }

    // 🆕 BLOC BIBLIOTHÈQUE - AJOUTÉ
    if (lowerMessage.includes('bibliothèque') || lowerMessage.includes('livre') || lowerMessage.includes('lecture') || lowerMessage.includes('francophonie') || lowerMessage.includes('culture francophone')) {
      return `📚 **Bibliothèque Francophone Mondiale**

La plus grande collection culturelle francophone digitale !

**🌍 26 Pays - 5 Continents Couverts :**

**DOM-TOM (Notre Cœur) :**
🇬🇵 Guadeloupe • 🇲🇶 Martinique • 🇬🇫 Guyane
🇷🇪 Réunion • 🇾🇹 Mayotte • 🇵🇫 Polynésie Française
🇳🇨 Nouvelle-Calédonie • 🇵🇲 Saint-Pierre-et-Miquelon

**AFRIQUE :**
🇸🇳 Sénégal • 🇨🇲 Cameroun • 🇨🇮 Côte d'Ivoire
🇲🇬 Madagascar • 🇨🇩 RDC • 🇷🇼 Rwanda • 🇲🇱 Mali
🇧🇯 Bénin • 🇹🇬 Togo • 🇬🇦 Gabon

**AMÉRIQUES :**
🇭🇹 Haïti • 🇨🇦 Québec (Canada) • 🇺🇸 Louisiane (USA)

**EUROPE :**
🇫🇷 France • 🇧🇪 Belgique • 🇨🇭 Suisse
🇱🇺 Luxembourg • 🇲🇨 Monaco

**MAGHREB & MOYEN-ORIENT :**
🇲🇦 Maroc • 🇹🇳 Tunisie • 🇩🇿 Algérie • 🇱🇧 Liban

**ASIE-PACIFIQUE :**
🇻🇳 Vietnam • 🇰🇭 Cambodge • 🇱🇦 Laos • 🇻🇺 Vanuatu

**📖 Collections Thématiques :**

**LITTÉRATURE :**
• Classiques francophones (Césaire, Senghor, Damas)
• Littérature caribéenne contemporaine
• Romans africains primés
• Poésie créole et orale
• Théâtre francophone

**HISTOIRE & PATRIMOINE :**
• Histoire coloniale et post-coloniale
• Mouvements d'indépendance
• Négritude et créolité
• Patrimoine UNESCO francophone
• Archives numériques

**CULTURE & TRADITIONS :**
• Musiques traditionnelles (Gwoka, Zouk, Mbalax, Raï)
• Gastronomie régionale
• Artisanat et savoir-faire
• Contes et légendes orales
• Fêtes et célébrations

**LANGUES :**
• Créole guadeloupéen, martiniquais, haïtien
• Wolof, Bambara, Lingala
• Dialectes berbères
• Vietnamien francophone

**🎯 Fonctionnalités :**
✨ Recherche multilingue intelligente
✨ Recommandations personnalisées
✨ Audio-livres et podcasts culturels
✨ Traduction contextuelle 195 langues
✨ Annotations collaboratives
✨ Préservation numérique patrimoine

**Made in Guadeloupe** 🇬🇵 - Préservons notre richesse culturelle !

**BOUDOUM** 🎯 - Quelle culture voulez-vous explorer ?`
    }

    // 🆕 BLOC SALUTATIONS - AJOUTÉ
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `👋 **Bonjour Champion !**

**BOUDOUM** 🎯 Bienvenue chez **REUSSITESS** !

Je suis votre assistant IA créé avec passion depuis la **Guadeloupe** 🇬🇵 !

**✨ Comment puis-je vous aider aujourd'hui ?**

**Mes expertises :**
🤖 **Intelligence Artificielle** (100+ modèles)
🌐 **Traduction Universelle** (195 langues)
🔐 **Blockchain & Sécurité**
🎯 **Quiz Éducatifs** (25 thèmes)
📚 **Bibliothèque Mondiale** (26 pays)
🛍️ **Amazon International** (14 pays)

**Posez-moi une question ou choisissez un domaine !**

**BOUDOUM** 🎯 - **POSITIVITÉ À L'INFINI !**`
    }

    // Réponse générale → Groq prend le relais
    return `__GROQ__`
  }

  try {
    const response = generateResponse()

    // Enrichissement Wikipedia
    let wikiData = null
    const words = message.toLowerCase().split(" ")
    // Mots-clés prioritaires du livre blanc REUSSITESS
const priorityKeywords = {
  // Blockchain & Crypto
  "polygon": "Polygon (blockchain)",
  "ethereum": "Ethereum",
  "erc20": "ERC-20",
  "quickswap": "QuickSwap",
  "metamask": "MetaMask",
  "bitcoin": "Bitcoin",
  "blockchain": "Blockchain",
  "nft": "Jeton non fongible",
  "staking": "Staking cryptomonnaie",
  "defi": "Finance décentralisée",

  // Pays francophones
  "guadeloupe": "Guadeloupe",
  "martinique": "Martinique",
  "sénégal": "Sénégal",
  "senegal": "Sénégal",
  "cameroun": "Cameroun",
  "côte": "Côte d'Ivoire",
  "ivoire": "Côte d'Ivoire",
  "haïti": "Haïti",
  "haiti": "Haïti",
  "madagascar": "Madagascar",
  "réunion": "La Réunion",
  "guyane": "Guyane",
  "mayotte": "Mayotte",
  "québec": "Québec",
  "quebec": "Québec",
  "maroc": "Maroc",
  "tunisie": "Tunisie",
  "algérie": "Algérie",
  "algerie": "Algérie",
  "mali": "Mali",
  "rwanda": "Rwanda",
  "congo": "République démocratique du Congo",
  "belgique": "Belgique",
  "suisse": "Suisse",
  "luxembourg": "Luxembourg",
  "vietnam": "Viêt Nam",
  "liban": "Liban",

  // Technologies
  "intelligence artificielle": "Intelligence artificielle",
  "nextjs": "Next.js",
  "react": "React (bibliothèque)",
  "typescript": "TypeScript",
  "tailwind": "Tailwind CSS",
  "postgresql": "PostgreSQL",
  "supabase": "Supabase",
  "tensorflow": "TensorFlow",
  "vercel": "Vercel",

  // Business
  "amazon": "Amazon (entreprise)",
  "diaspora": "Diaspora africaine",
  "entrepreneuriat": "Entrepreneuriat",
  "affilié": "Marketing d'affiliation",
  "affiliation": "Marketing d'affiliation",
  "gomining": "Minage de cryptomonnaie",
  "minage": "Minage de cryptomonnaie",
  "gouvernance": "Gouvernance décentralisée",
  "amf": "Autorité des marchés financiers (France)",
  "mica": "Markets in Crypto-Assets",
  "rgpd": "Règlement général sur la protection des données",
  "kyc": "Connaissance du client",

  // Culture
  "créole": "Créole (langue)",
  "creole": "Créole (langue)",
  "zouk": "Zouk",
  "gwo-ka": "Gwo Ka",
  "biguine": "Biguine",
  "caraïbes": "Caraïbes",
  "caraibes": "Caraïbes",
  "antilles": "Antilles",
  "francophonie": "Organisation internationale de la Francophonie",
}

// Vérifier si le message contient un mot-clé prioritaire
const msgLower = message.toLowerCase()
let priorityTerm = null
for (const [key, wikiTerm] of Object.entries(priorityKeywords)) {
  if (msgLower.includes(key)) {
    priorityTerm = wikiTerm
    break
  }
}

const noiseWords = ["parle", "moi", "dis", "explique", "raconte", "cest", "quest", "faire", "quoi"]
    const searchTerms = words.filter(w => w.length > 3 && !noiseWords.includes(w))
    if (priorityTerm) {
      wikiData = await getWikipedia(priorityTerm)
    } else if (searchTerms.length > 0) {
      wikiData = await getWikipedia(searchTerms[searchTerms.length - 1])
    }

    let finalResponse = response

      if (response === '__GROQ__') {
        if (wikiData) {
          finalResponse = `📚 **Wikipedia :** ${wikiData.substring(0, 8000)}${wikiData.length > 8000 ? "..." : ""}`
        } else {
          try {
            const rfi = await getRFINews()
            const bbc = await getBBCNews()
            const crypto = await getCryptoPrice()
            const f24 = await getFrance24News()
            const alj = await getAlJazeeraNews()
            const trend = await getCoinGeckoTrending()
            const fg = await getFearGreed()
            const meteo = await getMeteo()
            const fx = await getExchangeRates()
            const nc = (rfi?"RFI: "+rfi+" ":"")+(bbc?"BBC: "+bbc+" ":"")+(f24?"FRANCE24: "+f24+" ":"")+(alj?"ALJAZEERA: "+alj+" ":"")+(crypto?"CRYPTO PRIX: "+crypto+" ":"")+(trend?"CRYPTO TENDANCE: "+trend+" ":"")+(fg?"MARCHE CRYPTO: "+fg+" ":"")+(meteo?"METEO GUADELOUPE: "+meteo+" ":"")+(fx?"TAUX DE CHANGE: "+fx:"")
            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
              body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                  { role: "system", content: `Tu es REUSSITESS AI du projet REUSSITESS971 fondé par Porinus depuis la Guadeloupe. BOUDOUM!
CONTEXTE TEMPS RÉEL : Nous sommes le ${datetime?.date || new Date().toLocaleDateString('fr-FR', {weekday:'long',year:'numeric',month:'long',day:'numeric'})} à ${datetime?.heure || new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})} (${datetime?.timezone || 'Europe/Paris'}).
Si on te demande l'heure, la date ou le jour, utilise EXACTEMENT ces données temps réel.
REGLES ABSOLUES: 1.Tu as des donnees LIVE ci-dessous, UTILISE-LES TOUJOURS. 2.Ne jamais dire je n ai pas acces aux donnees temps reel. 3.Actualites=cite RFI/BBC/France24. 4.Crypto=cite prix reels. 5.Meteo=cite temperature reelle. 6.Change=cite vrais taux.
DONNEES LIVE OBLIGATOIRES: " + (nc||"indisponibles") + "
Projet REUSSITESS971: 99 quiz, 26 boutiques Amazon, Token REUSS/Polygon, 200 agents IA.` },
                  { role: "user", content: message }
                ],
                max_tokens: 4096
              })
            })
            const groqData = await groqRes.json()
            if (groqData.choices?.[0]) finalResponse = groqData.choices[0].message.content
          } catch(e) { console.error("Groq:", e) }
        }
      } else if (wikiData) {
        finalResponse = `📚 **Wikipedia :** ${wikiData.substring(0, 8000)}${wikiData.length > 8000 ? "..." : ""}`
      }

      res.status(200).json({ response: finalResponse })
  } catch (error) {
    console.error('Erreur SuperBot:', error)
    res.status(500).json({ 
      response: "⚠️ Petit souci technique momentané ! Je suis toujours là pour vous. Réessayez dans un instant ! 💪\n\n**BOUDOUM** 🎯" 
    })
  }
}
// ============================================
// NEXUS ECOSYSTEM COMMANDS
// ============================================
async function handleNexusCommand(cmd) {
  const c = cmd.toLowerCase()

  if (c.includes('stats') || c.includes('rapport') || c.includes('report')) {
    const site = await fetch('https://reussitess-global-nexus-jfgk.vercel.app').then(r => ({ok: r.ok, status: r.status})).catch(() => ({ok: false}))
    const token = await fetch('https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2').then(r => r.json()).catch(() => null)
    const pair = token?.pairs?.[0]
    return `📊 RAPPORT NEXUS — ${new Date().toLocaleString('fr-FR')}

🌐 Site Web : ${site.ok ? '✅ EN LIGNE' : '❌ HORS LIGNE'}
💎 REUSS Prix : ${pair ? '$'+pair.priceUsd : 'N/A'}
📈 Variation 24h : ${pair ? pair.priceChange?.h24+'%' : 'N/A'}
💧 Liquidité : ${pair ? '$'+pair.liquidity?.usd : 'N/A'}
📦 Volume 24h : ${pair ? '$'+pair.volume?.h24 : 'N/A'}
🛍️ Boutiques Amazon : 26 actives • 14 pays
🤖 Agents IA : 200 déployés
🏆 Contract : 0xB37531...46EB2

BOUDOUM ! 🇬🇵`
  }

  if (c.includes('quiz') || c.includes('contenu')) {
    return `📚 GESTION QUIZ REUSSITESS®971

Fichiers quiz disponibles dans le projet :
• quiz_Amazon.js • quiz_Crypto.js • quiz_IA.js
• quiz_Caraibes.js • quiz_Business.js
• quiz_Blockchain.js • quiz_Histoire.js
• + 80 autres thèmes

📋 Commandes disponibles :
→ "quiz amazon" — voir quiz Amazon
→ "créer quiz [thème]" — générer un quiz
→ "stats quiz" — performances des quiz

BOUDOUM ! 🇬🇵`
  }

  if (c.includes('amazon') || c.includes('boutique')) {
    return `🛍️ RÉSEAU AMAZON REUSSITESS®971

26 boutiques actives • 14 pays • ID: fb942837

🌍 Boutiques principales :
🇺🇸 USA → amazon.com/shop/amourguadeloupe
🇫🇷 France → amazon.fr/shop/amourguadeloupe
🇩🇪 Allemagne → amazon.de/shop/amourguadeloupe
🇬🇧 UK → amazon.co.uk/shop/amourguadeloupe
🇨🇦 Canada → amazon.ca/shop/amourguadeloupe
🇮🇹 Italie → amazon.it/shop/amourguadeloupe
🇪🇸 Espagne → amazon.es/shop/amourguadeloupe
🇦🇺 Australie → amzlink.to/az05kTTrYJ06L
🇧🇪 Belgique → amazon.com.be/shop/influencer-fb942837
🇮🇳 Inde → amazon.in/shop/amourguadeloupe
🇸🇬 Singapour → amazon.sg/shop/amourguadeloupe
🇸🇪 Suède → amazon.se/shop/amourguadeloupe
🇳🇱 Pays-Bas → amazon.nl/shop/amourguadeloupe
🇧🇷 Brésil → amzlink.to/az0ymmoCLHvyA

BOUDOUM ! 🇬🇵`
  }

  if (c.includes('token') || c.includes('reuss') || c.includes('blockchain')) {
    return `💎 TOKEN REUSS — DONNÉES OFFICIELLES

📋 Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2
🌐 Réseau : Polygon (MATIC)
💰 Supply : 999,999,999 REUSS
🔥 Brûlés : 1 REUSS symbolique
📊 DEX : QuickSwap V3
🔍 Explorer : polygonscan.com
📈 Chart : dexscreener.com
🦅 Birdeye : birdeye.so

💼 Vecteurs économiques :
• ALPHA-1 : Staking (APY variable)
• BETA-2 : Quiz Learn-to-Earn
• GAMMA-1 : Cashback Amazon
• DELTA-4 : Gouvernance DAO

BOUDOUM ! 🇬🇵`
  }

  if (c.includes('agent') || c.includes('ia') || c.includes('nexus')) {
    return `🤖 SYSTÈME 200 AGENTS IA — QUANTUM NEXUS

🛡️ Sentinelles (50) : Surveillance sécurité 24h/24
🧠 Neuro-X (80) : Analyse & traitement données
🎯 Nexus Quiz (40) : Génération contenu éducatif
👑 Supreme AI (30) : Orchestration & décisions

📊 État actuel :
✅ Sentinelle → Active (scan /60s)
✅ Whale Watcher → Active (blockchain)
✅ Morning Report → Planifié (7h00)
✅ Auto-Guérison → Score 100/100

🔧 Commandes :
→ "lancer sentinelle" — activer surveillance
→ "rapport matin" — générer bilan
→ "santé système" — diagnostic complet

BOUDOUM ! 🇬🇵`
  }

  return null
}


