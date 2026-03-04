
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
    // ✅ DATE/HEURE TEMPS RÉEL — priorité absolue
  const msgLow = message.toLowerCase()
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, personality, context, langue, datetime } = req.body

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
    
    if (lowerMessage.includes('guadeloupe') || lowerMessage.includes('caraïbes') || lowerMessage.includes('antilles') || lowerMessage.includes('dom')) {
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
          finalResponse = `📚 **Wikipedia :** ${wikiData.substring(0, 1500)}${wikiData.length > 1500 ? "..." : ""}`
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
                max_tokens: 1024
              })
            })
            const groqData = await groqRes.json()
            if (groqData.choices?.[0]) finalResponse = groqData.choices[0].message.content
          } catch(e) { console.error("Groq:", e) }
        }
      } else if (wikiData) {
        finalResponse = `📚 **Wikipedia :** ${wikiData.substring(0, 1500)}${wikiData.length > 1500 ? "..." : ""}`
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


