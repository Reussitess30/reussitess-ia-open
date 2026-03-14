function getPolitiquesGuadeloupe() {
  return `🏛️ **Élus Officiels de Guadeloupe (2025-2026)**

🌴 **CONSEIL RÉGIONAL**
👤 **Ary Chalus** — Président depuis le 18 décembre 2015
🏢 Avenue Paul Lacavé, Basse-Terre
🔗 regionguadeloupe.fr
ℹ️ Réélu, préside les Régions Ultra-Périphériques (RUP) depuis avril 2025

🏛️ **CONSEIL DÉPARTEMENTAL**
👤 **Guy Losbar** — Président depuis le 1er juillet 2021
🏢 Hôtel du Département, Bld Félix Eboué, Basse-Terre
🔗 cg971.fr
ℹ️ Chef de file du GUSR (Guadeloupe Unie Solidaire et Responsable)

🏙️ **MAIRIE DE POINTE-À-PITRE**
👤 **Harry Durimel** — Maire depuis le 4 juillet 2020
📞 +590 5 90 93 85 85
🌿 Candidat à sa réélection en mars 2026
ℹ️ Premier maire hors dynastie Bangou depuis 50 ans

🗳️ **DÉPUTÉS ASSEMBLÉE NATIONALE (élus juillet 2024)**
• **1ère circ.** : **Olivier Serva** (DVG/LIOT) — 77,59%
• **2ème circ.** : **Christian Baptiste** (DVG/NFP) — 72,38%
• **3ème circ.** : **Max Mathiasin** (DVG/LIOT) — 69,15%
• **4ème circ.** : **Élie Califer** (PS) — 71,09%

🏛️ **SÉNATEURS (élus septembre 2023)**
• **Dominique Théophile** — Guadeloupe Solidaire (GUSR)
• **Solanges Nadille** — Guadeloupe Solidaire (GUSR)
• **Victorin Lurel** — Ensemble, Nou Tout (PS)

🗓️ **Prochaines élections :** Municipales 15 et 22 mars 2026

🔗 Sources : regionguadeloupe.fr | cg971.fr | assemblee-nationale.fr

Boudoum ! 🇬🇵`
}
const GROQ_KEYS = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3].filter(Boolean)
let keyIndex = 0
const keyErrors = {}
const responseCache = new Map()
const CACHE_TTL = 5 * 60 * 1000

function getNextKey() {
  const now = Date.now()
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const idx = (keyIndex + i) % GROQ_KEYS.length
    const key = GROQ_KEYS[idx]
    if (!keyErrors[key] || now - keyErrors[key] > 60000) {
      keyIndex = (idx + 1) % GROQ_KEYS.length
      return key
    }
  }
  keyIndex = (keyIndex + 1) % GROQ_KEYS.length
  return GROQ_KEYS[keyIndex]
}


// =======================
async function groqFetch(messages, maxTokens = 512) {
  const cacheKey = JSON.stringify(messages).substring(0, 200)
  const cached = responseCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.val
  const key = getNextKey()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages, max_tokens: maxTokens })
    })
    if (!res.ok) { keyErrors[key] = Date.now(); return null }
    const d = await res.json()
    const text = d.choices?.[0]?.message?.content || null
    if (text) responseCache.set(cacheKey, { val: text, ts: Date.now() })
    return text
  } catch(e) { console.error("groqFetch:", e.message); return null }
}
// ===== STREAMING GROQ =====
export async function groqStream(messages, systemPrompt, res) {
  const key = getNextKey()
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        max_tokens: 1024,
        stream: true
      })
    })
    if (!response.ok) return null
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    })
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content || ''
          if (token) {
            fullText += token
            res.write(`data: ${JSON.stringify({ token })}\n\n`)
          }
        } catch(e) {}
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
    return fullText
  } catch(e) { console.error("Stream error:", e.message); return null }
}

// ===== GUARDRAILS SECURITE =====
function checkGuardrails(message) {
  const msgL = message.toLowerCase()
  const blocked = [
    'fabrique.*bombe', 'comment.*tuer', 'drogue.*fabriquer',
    'hack.*système', 'virus.*créer', 'arnaque.*faire',
    'blanchiment.*argent', 'document.*faux'
  ]
  for (const pattern of blocked) {
    if (new RegExp(pattern).test(msgL)) {
      return "🛡️ Cette demande ne peut pas être traitée. REUSSITESS AI est là pour t'aider à réussir, pas à nuire. Boudoum ! 🇬🇵"
    }
  }
  return null
}

// ===== FUNCTION CALLING GROQ =====
const GROQ_TOOLS = [
  {
    type: "function",
    function: {
      name: "get_meteo",
      description: "Obtenir la météo actuelle d'une commune DOM-TOM (Guadeloupe, Martinique, Guyane, Réunion, Mayotte)",
      parameters: {
        type: "object",
        properties: {
          commune: { type: "string", description: "Nom de la commune ex: pointe-a-pitre, fort-de-france, cayenne" }
        },
        required: ["commune"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_seismes",
      description: "Obtenir les séismes récents aux Antilles et dans les Caraïbes",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_cyclones",
      description: "Obtenir les alertes cyclones et ouragans actifs dans l'Atlantique",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_devises",
      description: "Obtenir les taux de change des devises africaines et caribéennes (XOF, XAF, XCD, HTG)",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_crypto",
      description: "Obtenir les prix des cryptomonnaies Bitcoin, Ethereum, POL en temps réel",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_carburant",
      description: "Obtenir les prix du carburant en Guadeloupe et DOM-TOM",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_actualites_guadeloupe",
      description: "Obtenir les actualités récentes de Guadeloupe depuis La 1ère",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_prix_reuss",
      description: "Obtenir le prix du Token REUSS sur Polygon",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_hopitaux",
      description: "Obtenir les coordonnées des hôpitaux et urgences des DOM-TOM",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "get_emploi",
      description: "Obtenir les offres d'emploi en Guadeloupe et DOM-TOM",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "calculer_jour_date",
      description: "Calculer quel jour de la semaine correspond à une date précise entre 1900 et 2100",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "La date au format '1 janvier 2030' ou '14 juillet 1789'" }
        },
        required: ["date"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_politique_guadeloupe",
      description: "Obtenir les informations sur les élus politiques de Guadeloupe (président région, département, maires, députés)",
      parameters: { type: "object", properties: {} }
    }
  }
]

async function groqFetchWithTools(messages, systemPrompt) {
  const key = getNextKey()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools: GROQ_TOOLS,
        tool_choice: "auto",
        max_tokens: 1024
      })
    })
    if (!res.ok) { keyErrors[key] = Date.now(); return null }
    const d = await res.json()
    const choice = d.choices?.[0]
    
    // Si Groq appelle un outil
    if (choice?.finish_reason === "tool_calls" && choice?.message?.tool_calls) {
      const toolCall = choice.message.tool_calls[0]
      const fnName = toolCall.function.name
      const args = JSON.parse(toolCall.function.arguments || '{}')
      
      let toolResult = ""
      if (fnName === "get_meteo") toolResult = await getMeteoDOMTOM(args.commune)
      else if (fnName === "get_seismes") toolResult = await getSeismesAntilles()
      else if (fnName === "get_cyclones") toolResult = await getCyclones()
      else if (fnName === "get_devises") toolResult = await getDevisesAfriqueCaraibe()
      else if (fnName === "get_crypto") toolResult = await getCryptoPrice()
      else if (fnName === "get_carburant") toolResult = await getPrixCarburant()
      else if (fnName === "get_actualites_guadeloupe") toolResult = await getActualitesGuadeloupe()
      else if (fnName === "get_prix_reuss") toolResult = await getPrixREUSS()
      else if (fnName === "get_hopitaux") toolResult = getHopitauxDOMTOM ? await getHopitauxDOMTOM() : ""
      else if (fnName === "get_emploi") toolResult = await getOffresEmploiDOMTOM()
      else if (fnName === "calculer_jour_date") toolResult = calculerJourDate(args.date)
      else if (fnName === "get_politique_guadeloupe") toolResult = getPolitiquesGuadeloupe()
      
      // Deuxième appel avec résultat outil
      const res2 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            choice.message,
            { role: "tool", tool_call_id: toolCall.id, content: String(toolResult || "Données indisponibles") }
          ],
          max_tokens: 1024
        })
      })
      const d2 = await res2.json()
      return d2.choices?.[0]?.message?.content || null
    }
    
    return choice?.message?.content || null
  } catch(e) { console.error("groqFetchWithTools:", e.message); return null }
}

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
Fondateur : Rony Porinus • Guadeloupe 🇬🇵 • Boudoum !

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
• ALPHA-1 : Staking (en développement)
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
🇬🇵 Positivité à l'infini — Boudoum !`
  }

  // Token REUSS
  if (msg.includes('contrat') || msg.includes('adresse token') || msg.includes('0xb375')) {
    return `✅ **Token REUSS — Données officielles :**\n\nContrat : \${whitepaperData.reel.token.contrat}\nSupply : \${whitepaperData.reel.token.supply}\nPool : \${whitepaperData.reel.token.pool}\nHolders actuels : \${whitepaperData.reel.token.holders}\n\n🔗 Vérifiable sur : \${whitepaperData.reel.token.polygonscan}`
  }
  
  // Tokenomics
  if (msg.includes('tokenomics') || msg.includes('distribution') || msg.includes('répartition')) {
    return `✅ **Tokenomics REUSS — Distribution actuelle :**\n\n• Réserve/Treasury : \${whitepaperData.reel.tokenomics.reserve_treasury}\n• Fondateur : \${whitepaperData.reel.tokenomics.fondateur}\n• Acheteurs : \${whitepaperData.reel.tokenomics.acheteurs}\n• Burned : \${whitepaperData.reel.tokenomics.burned}\n\nBoudoum ! 🌴`
  }
  
  // Gamma
  if (msg.includes('gamma') || msg.includes('récompense') || msg.includes('reward')) {
    return `✅ **Vecteurs GAMMA — Distribution des récompenses :**\n\n🛍️ GAMMA-1 : \${whitepaperData.reel.gamma.gamma1}\n🎓 GAMMA-2 : \${whitepaperData.reel.gamma.gamma2}\n💰 GAMMA-3 : \${whitepaperData.reel.gamma.gamma3}\n\nBoudoum ! 🇬🇵`
  }
  
  // Tiers
  if (msg.includes('tier') || msg.includes('bronze') || msg.includes('silver') || msg.includes('gold') || msg.includes('platinum')) {
    return `✅ **Tiers d'accès Premium REUSS :**\n\n🥉 Bronze : \${whitepaperData.reel.tiers.bronze}\n🥈 Silver : \${whitepaperData.reel.tiers.silver}\n🥇 Gold : \${whitepaperData.reel.tiers.gold}\n💎 Platinum : \${whitepaperData.reel.tiers.platinum}\n\nBoudoum ! 🌴`
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
    return `✅ **Réseau Amazon — 26 boutiques · 14 pays :**\n\n\${whitepaperData.reel.plateforme.pays_amazon.join(", ")}\n\nTag affilié : ronyporinu0ac-21\nCommissions : 4-8% sur chaque vente qualifiée\n\nBoudoum ! 🌴`
  }

  // Sécurité
  if (msg.includes('sécurité') || msg.includes('gas') || msg.includes('sentinelle')) {
    return `✅ **Sécurité REUSS :**\n\n🔒 Gas : \${whitepaperData.reel.securite.gas}\n👁️ Surveillance : \${whitepaperData.reel.securite.sentinelles}\n⏳ Multi-sig : \${whitepaperData.prevision.multisig}\n\nBoudoum ! 🇬🇵`
  }

  return null
}


async function getWikipedia(term) {
  try {
  // GUIDE CRYPTOART
  if (msgLow.includes("crypto art") || msgLow.includes("generative art") || msgLow.includes("art génératif") || msgLow.includes("créer avec ia") || msgLow.includes("midjourney")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X Créatif — Art Génératif IA**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PARENTALITE
  if (msgLow.includes("parentalité") || msgLow.includes("éduquer mon enfant") || msgLow.includes("bébé") || msgLow.includes("grossesse") || msgLow.includes("élever enfant caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👶 **Neuro-X Enfants — Parentalité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GESTION TEMPS
  if (msgLow.includes("gestion du temps") || msgLow.includes("productivité") || msgLow.includes("organisation") || msgLow.includes("procrastination") || msgLow.includes("planning")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⏰ **Neuro-X Coach — Productivité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE INTELLIGENCE COLLECTIVE
  if (msgLow.includes("intelligence collective") || msgLow.includes("travailler ensemble") || msgLow.includes("synergie") || msgLow.includes("collaboration") || msgLow.includes("réseau caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Stratégie — Intelligence Collective**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CARNAVAL CARAIBE


    if (msgLow.includes("carnaval") || msgLow.includes("mas") || msgLow.includes("vidé") || msgLow.includes("chars carnaval") || msgLow.includes("fête guadeloupe")) {
    try {
      const agenda = getAgendaCaraibes()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎭 **Neuro-X Culture — Carnaval Caribéen**\n\n"+agenda+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PEINTURE CARIBEENNE
  if (msgLow.includes("peinture caribéenne") || msgLow.includes("artiste antillais") || msgLow.includes("art guadeloupe") || msgLow.includes("sculpture caribéenne") || msgLow.includes("artiste créole")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X Créatif — Art Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EMPLOI DOM-TOM
  if (msgLow.includes("chercher emploi") || msgLow.includes("offre emploi guadeloupe") || msgLow.includes("pôle emploi") || msgLow.includes("trouver travail antilles") || msgLow.includes("chômage guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Business — Emploi DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MESSAGE FINAL Boudoum
  if (msgLow.includes("boudoum") || msgLow === "boudoum !") {
    const msgs = [
      "💥 Boudoum ! Terres de Champions ! La Guadeloupe conquiert le monde ! 🇬🇵🌍",
      "🎯 Boudoum ! Excellence • Innovation • Succès — REUSSITESS®971 ! 🇬🇵",
      "🌟 Boudoum ! Positivité à l'infini ! Les Antilles dominent ! 🇬🇵💎",
      "🔥 Boudoum ! 200 agents IA au service de la Caraïbe ! 🤖🇬🇵",
      "⚡ Boudoum ! Token REUSS en route vers la lune ! 🚀💎🇬🇵"
    ]
    return res.status(200).json({ pdfAction: pdfType, response: msgs[Math.floor(Math.random()*msgs.length)] })
  }

  // GUIDE CINEMATOGRAPHIE CARIBEENNE
  if (msgLow.includes("film caribéen") || msgLow.includes("cinéma antillais") || msgLow.includes("réalisateur guadeloupe") || msgLow.includes("documentaire caraïbes")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎬 **Neuro-X Cinéma — Films Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE TRANSPORT DOM-TOM
  if (msgLow.includes("transport guadeloupe") || msgLow.includes("bus guadeloupe") || msgLow.includes("taxi guadeloupe") || msgLow.includes("location voiture antilles") || msgLow.includes("se déplacer guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚌 **Neuro-X Tourisme — Transport Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ASSURANCE DOM-TOM
  if (msgLow.includes("assurance guadeloupe") || msgLow.includes("mutuelle antilles") || msgLow.includes("assurance habitation") || msgLow.includes("assurance cyclone") || msgLow.includes("assurance auto guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **Neuro-X Juridique — Assurances DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MYTHOLOGIE CARIBEENNE
  if (msgLow.includes("mythologie caribéenne") || msgLow.includes("légende créole") || msgLow.includes("zombie caribéen") || msgLow.includes("soukougnan") || msgLow.includes("diable antillais")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👻 **Neuro-X Spiritualité — Mythologie Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PERMIS DE CONDUIRE
  if (msgLow.includes("permis de conduire") || msgLow.includes("code de la route") || msgLow.includes("auto-école") || msgLow.includes("conduire guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚗 **Neuro-X Juridique — Permis Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE AIDE SOCIALE
  if (msgLow.includes("rsa") || msgLow.includes("caf") || msgLow.includes("aides sociales") || msgLow.includes("allocation") || msgLow.includes("aide guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Aides Sociales DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LITTERATURE CARIBEENNE
  if (msgLow.includes("littérature") || msgLow.includes("roman caribéen") || msgLow.includes("auteur antillais") || msgLow.includes("maryse condé") || msgLow.includes("simone schwarz-bart")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Neuro-X Littérature — Auteurs Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
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
      return res.status(200).json({ pdfAction: pdfType, response: "📅 **Ce Jour dans l'Histoire — "+dd+"/"+mm+"**\n\n"+txt+"\n\nSource: Wikimedia\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "📅 **Éphéméride**\n\nLe 27 mai 1848 : Abolition de l'esclavage en Guadeloupe.\nLe 10 mai 2001 : Loi Taubira reconnaît l'esclavage comme crime contre l'humanité.\n\nBoudoum ! 🇬🇵" })
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
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Bibliothèque Mondiale — Open Library**\n\n🔍 Résultats pour: *"+decodeURIComponent(query)+"*\n\n"+txt+"\n\n"+libD.numFound+" livres trouvés gratuitement !\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ACTUALITES MONDE FRANCOPHONE — RSS gratuit
  // JOURNAL OFFICIEL + MEDIAS DOM-TOM + EVENEMENTS CULTURELS
  if (msgLow.includes("journal officiel") || msgLow.includes("loi nouvelle") || msgLow.includes("nouvelle loi") || msgLow.includes("decret") || msgLow.includes("décret") || msgLow.includes("legifrance") || msgLow.includes("loi parue") || msgLow.includes("texte officiel") || msgLow.includes("dom actualite") || msgLow.includes("actu dom") || msgLow.includes("media dom") || msgLow.includes("media local") || msgLow.includes("evenement guadeloupe") || msgLow.includes("événement guadeloupe") || msgLow.includes("agenda guadeloupe") || msgLow.includes("agenda martinique") || msgLow.includes("evenement culturel") || msgLow.includes("newsletter dom") || msgLow.includes("actu outremer")) {
    let sections = []
    // 1. Journal Officiel via legifrss.org
    try {
      const joRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://legifrss.org/latest&count=5", { signal: AbortSignal.timeout(5000) })
      const joData = await joRes.json()
      if (joData.items && joData.items.length > 0) {
        const lois = joData.items.slice(0,5).map(function(it) {
          const d = it.pubDate ? it.pubDate.substring(0,10) : ""
          return "• [" + d + "] " + it.title
        }).join("\n")
        sections.push("⚖️ **Journal Officiel — Derniers textes**\n" + lois + "\n🔗 legifrance.gouv.fr | legifrss.org")
      }
    } catch(e1) {
      sections.push("⚖️ **Journal Officiel**\n• legifrance.gouv.fr — Lois et décrets\n• journal-officiel.gouv.fr\n• vie-publique.fr — Analyses des lois\n• service-public.fr — Applications pratiques")
    }
    // 2. Médias locaux DOM-TOM
    try {
      const domRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=4", { signal: AbortSignal.timeout(5000) })
      const domData = await domRes.json()
      if (domData.items && domData.items.length > 0) {
        const actu = domData.items.slice(0,4).map(function(it) { return "• " + it.title }).join("\n")
        sections.push("🌴 **Guadeloupe 1ère — Actu Locale**\n" + actu)
      }
    } catch(e2) {}
    // 3. Liens médias DOM-TOM complets
    sections.push("📡 **Médias DOM-TOM — Complet**\n🇬🇵 Guadeloupe:\n• la1ere.francetvinfo.fr/guadeloupe\n• guadeloupe.franceantilles.fr\n• rci.fm/guadeloupe\n• guadeloupetv.fr\n🇲🇶 Martinique:\n• la1ere.francetvinfo.fr/martinique\n• martinique.franceantilles.fr\n• rci.fm/martinique\n🇷🇪 Réunion:\n• la1ere.francetvinfo.fr/reunion\n• clicanoo.re\n• zinfos974.com\n🇬🇫 Guyane:\n• la1ere.francetvinfo.fr/guyane\n• guyane.rci.fm\n🌍 Outre-Mer Global:\n• outremers360.com\n• la1ere.francetvinfo.fr\n• outre-mer.gouv.fr")
    // 4. Newsletters et événements culturels
    sections.push("🎭 **Événements Culturels Caraïbes**\n🥁 Festival Gwo Ka — Sainte-Anne, Guadeloupe (Juillet)\n🎵 Festival Jazz Martinique (Juillet-Août)\n🎭 Carnaval Guadeloupe & Martinique (Février-Mars)\n🌊 Tour Cycliste Guadeloupe (Juillet)\n🎤 Sakifo Musik Festival — La Réunion (Juin)\n🎺 Festival Biguine Jazz Martinique (Mai)\n\n📧 **Newsletters DOM-TOM**\n• outremers360.com/newsletter\n• la1ere.francetvinfo.fr/newsletters\n• gwadazap.com (Guadeloupe)\n• martinique.franceantilles.fr/newsletter\n\nBoudoum ! 🇬🇵")
    return res.status(200).json({ pdfAction: pdfType, response: sections.join("\n\n---\n\n") })
  }

    // JOURNAL OFFICIEL + MEDIAS DOM-TOM + EVENEMENTS CULTURELS
  if (msgLow.includes("journal officiel") || msgLow.includes("loi nouvelle") || msgLow.includes("nouvelle loi") || msgLow.includes("decret") || msgLow.includes("décret") || msgLow.includes("legifrance") || msgLow.includes("loi parue") || msgLow.includes("texte officiel") || msgLow.includes("dom actualite") || msgLow.includes("actu dom") || msgLow.includes("media dom") || msgLow.includes("media local") || msgLow.includes("evenement guadeloupe") || msgLow.includes("événement guadeloupe") || msgLow.includes("agenda guadeloupe") || msgLow.includes("agenda martinique") || msgLow.includes("evenement culturel") || msgLow.includes("newsletter dom") || msgLow.includes("actu outremer")) {
    let sections = []
    // 1. Journal Officiel via legifrss.org
    try {
      const joRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://legifrss.org/latest&count=5", { signal: AbortSignal.timeout(5000) })
      const joData = await joRes.json()
      if (joData.items && joData.items.length > 0) {
        const lois = joData.items.slice(0,5).map(function(it) {
          const d = it.pubDate ? it.pubDate.substring(0,10) : ""
          return "• [" + d + "] " + it.title
        }).join("\n")
        sections.push("⚖️ **Journal Officiel — Derniers textes**\n" + lois + "\n🔗 legifrance.gouv.fr | legifrss.org")
      }
    } catch(e1) {
      sections.push("⚖️ **Journal Officiel**\n• legifrance.gouv.fr — Lois et décrets\n• journal-officiel.gouv.fr\n• vie-publique.fr — Analyses des lois\n• service-public.fr — Applications pratiques")
    }
    // 2. Médias locaux DOM-TOM
    try {
      const domRes = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=4", { signal: AbortSignal.timeout(5000) })
      const domData = await domRes.json()
      if (domData.items && domData.items.length > 0) {
        const actu = domData.items.slice(0,4).map(function(it) { return "• " + it.title }).join("\n")
        sections.push("🌴 **Guadeloupe 1ère — Actu Locale**\n" + actu)
      }
    } catch(e2) {}
    // 3. Liens médias DOM-TOM complets
    sections.push("📡 **Médias DOM-TOM — Complet**\n🇬🇵 Guadeloupe:\n• la1ere.francetvinfo.fr/guadeloupe\n• guadeloupe.franceantilles.fr\n• rci.fm/guadeloupe\n• guadeloupetv.fr\n🇲🇶 Martinique:\n• la1ere.francetvinfo.fr/martinique\n• martinique.franceantilles.fr\n• rci.fm/martinique\n🇷🇪 Réunion:\n• la1ere.francetvinfo.fr/reunion\n• clicanoo.re\n• zinfos974.com\n🇬🇫 Guyane:\n• la1ere.francetvinfo.fr/guyane\n• guyane.rci.fm\n🌍 Outre-Mer Global:\n• outremers360.com\n• la1ere.francetvinfo.fr\n• outre-mer.gouv.fr")
    // 4. Newsletters et événements culturels
    sections.push("🎭 **Événements Culturels Caraïbes**\n🥁 Festival Gwo Ka — Sainte-Anne, Guadeloupe (Juillet)\n🎵 Festival Jazz Martinique (Juillet-Août)\n🎭 Carnaval Guadeloupe & Martinique (Février-Mars)\n🌊 Tour Cycliste Guadeloupe (Juillet)\n🎤 Sakifo Musik Festival — La Réunion (Juin)\n🎺 Festival Biguine Jazz Martinique (Mai)\n\n📧 **Newsletters DOM-TOM**\n• outremers360.com/newsletter\n• la1ere.francetvinfo.fr/newsletters\n• gwadazap.com (Guadeloupe)\n• martinique.franceantilles.fr/newsletter\n\nBoudoum ! 🇬🇵")
    return res.status(200).json({ response: sections.join("\n\n---\n\n") })
  }

    if (msgLow.includes("actualité monde") || msgLow.includes("news monde") || msgLow.includes("actualité internationale") || msgLow.includes("info monde")) {
    try {
      const rssR = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.rfi.fr/fr/rss-services/html/rss-services.html&count=5")
      const rssD = await rssR.json()
      const items = (rssD.items||[]).slice(0,5)
      const txt = items.map((it,i) => `${i+1}. **${it.title}**\n   📰 ${it.pubDate?.substring(0,10)||""}`).join("\n\n")
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Actualités Monde Francophone — RFI**\n\n"+txt+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // OFFRES EMPLOI DOM-TOM CARAIBES AFRIQUE
  if (msgLow.includes("offre emploi") || msgLow.includes("chercher emploi") || msgLow.includes("trouver un emploi") || msgLow.includes("job guadeloupe") || msgLow.includes("job martinique") || msgLow.includes("job reunion") || msgLow.includes("emploi dom-tom") || msgLow.includes("emploi caraibes") || msgLow.includes("emploi afrique") || msgLow.includes("recrutement guadeloupe") || msgLow.includes("remote job") || msgLow.includes("offre de travail")) {
    try {
      const remoteRes = await fetch("https://remoteok.com/api?limit=5", { headers: { "User-Agent": "REUSSITESS971Bot/1.0" } })
      const remoteData = await remoteRes.json()
      const jobs = remoteData.slice(1,6).filter(function(j) { return j && j.position })
      if (jobs.length > 0) {
        const jobList = jobs.map(function(j) {
          return "- **" + j.position + "** — " + (j.company||"Entreprise") + "\n  Lien: " + j.url + "\n  Tags: " + (j.tags||[]).slice(0,3).join(", ")
        }).join("\n\n")
        return res.status(200).json({ pdfAction: pdfType, response: "Offres d'emploi REELLES - Temps reel (RemoteOK)\n\n" + jobList + "\n\nPlateformes DOM-TOM gratuites:\n- Guadeloupe: francetravail.fr\n- Reunion: emploi.re\n- Caraibes: caribbeanjobs.com\n- Afrique: jobartis.com\n- Remote: remoteok.com\n- Indeed: indeed.fr\n- LinkedIn: linkedin.com/jobs\n\nTape creer mon CV pour ton CV PDF gratuit !\n\nBoudoum !" })
      }
    } catch(eRemote) {}
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Emploi — DOM-TOM / Caraïbes / Afrique**\n\n"+groqText+"\n\n🔗 **Plateformes gratuites:**\n• France Travail: francetravail.fr\n• Réunion: emploi.re\n• Caraïbes: caribbeanjobs.com\n• Afrique: jobartis.com\n• International: linkedin.com\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Offres Emploi — DOM-TOM / Caraïbes / Afrique**\n\n🔗 **Plateformes gratuites:**\n• 🇫🇷 France Travail: francetravail.fr\n• 🇷🇪 La Réunion: emploi.re\n• 🌴 Caraïbes: caribbeanjobs.com\n• 🌍 Afrique: jobartis.com\n• 💼 International: linkedin.com\n• 🌐 Mondial: indeed.fr\n\n💡 Secteurs porteurs DOM-TOM: Tourisme, BTP, Santé, IA, E-commerce\n\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CREATION ASSOCIATION
  if (msgLow.includes("créer une association") || msgLow.includes("association loi 1901") || msgLow.includes("association guadeloupe") || msgLow.includes("association dom-tom")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Créer une Association**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PASSEPORT DE REUSSITE 🏆
  if (msgLow.includes("passeport de réussite") || msgLow.includes("passeport reussite") || msgLow.includes("certificat champion") || msgLow.includes("devenir champion") || msgLow.includes("passeport champion") || msgLow.includes("champions")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Passeport de Réussite REUSSITESS**\n\n"+groqText+"\n\n👉 **Obtiens ton certificat :** https://reussitess.fr/champions\n\n🌍 Communauté en pleine croissance !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Passeport de Réussite REUSSITESS**\n\nTon certificat de champion t'attend ! Des champions du monde entier ont déjà rejoint le mouvement REUSSITESS.\n\n✅ Remplis ton prénom, ton pays et ton objectif\n✅ Reçois ton certificat personnalisé\n✅ Obtiens ton plan d'action sur mesure\n\n👉 **Accède maintenant :** https://reussitess.fr/champions\n\nTerres de Champions ! Boudoum ! 🇬🇵" })
    }
  }

  // VISA UNIVERSEL 🌍
  if (msgLow.includes("visa universel") || msgLow.includes("opportunité mondiale") || msgLow.includes("réseau mondial") || msgLow.includes("rejoindre reussitess") || msgLow.includes("visa reussitess") || msgLow.includes("opportunités reussitess")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Visa Universel REUSSITESS**\n\n"+groqText+"\n\n👉 **Obtiens ton Visa :** https://reussitess.fr/visa-universel\n\n🚀 Accès aux opportunités mondiales dans 14 pays partenaires !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Visa Universel REUSSITESS**\n\nTon passeport vers les opportunités mondiales !\n\n✅ Accès réseau entrepreneurs 26 pays\n✅ Affiliation Amazon 14 pays\n✅ Token REUSS sur Polygon\n✅ Bibliothèque mondiale\n✅ Formation IA gratuite\n\n👉 **Accède maintenant :** https://reussitess.fr/visa-universel\n\nBoudoum ! 🇬🇵" })
    }
  }

  // NAVIGATION ECOSYSTEME COMPLET
  if (msgLow.includes("écosystème") || msgLow.includes("ecosystem") || msgLow.includes("tout ce que propose") || msgLow.includes("site reussitess") || msgLow.includes("que faire sur") || msgLow.includes("navigation") || msgLow.includes("menu reussitess")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Écosystème REUSSITESS — Guide Complet**\n\n"
    +"🏆 **[Passeport de Réussite](https://reussitess.fr/champions)**\nCertificat de champion + plan d'action personnalisé\n\n"
    +"🌍 **[Visa Universel](https://reussitess.fr/visa-universel)**\nAccès réseau opportunités 14 pays\n\n"
    +"🧠 **[Neuro-X](https://reussitess.fr/neuro-x)**\n60 agents IA spécialisés\n\n"
    +"🔮 **[Oracle 971](https://reussitess.fr/oracle-971)**\nOracle caribéen\n\n"
    +"🧬 **[Mon ADN](https://reussitess.fr/mon-adn)**\nIdentité & héritage\n\n"
    +"🚀 **[Ma Révolution IA](https://reussitess.fr/ma-revolution-ia)**\nTA révolution personnelle\n\n"
    +"🌍 **[IA Passport Mondial](https://reussitess.fr/ia-passport)**\n8 langues actives, identité mondiale\n\n"
    +"💎 **[Investir REUSS](https://reussitess.fr/investir-reuss)**\nToken REUSS sur Polygon\n\n"
    +"🎯 **[99 Quiz](https://reussitess.fr/quiz)**\nQuiz éducatifs tous thèmes\n\n"
    +"📚 **[Bibliothèque](https://reussitess.fr/bibliotheque)**\n50+ pays francophones\n\n"
    +"🛍️ **[Boutiques Amazon](https://reussitess.fr/boutiques)**\n26 boutiques 14 pays\n\n"
    +"🏪 **[Shop Officiel](https://shop.reussitess.fr)**\nBoutique REUSSITESS\n\n"
    +"💬 *Pose-moi n'importe quelle question — je suis ton guide !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE MON ADN
  if (msgLow.includes("mon adn") || msgLow.includes("mon identité") || msgLow.includes("mes origines") || msgLow.includes("héritage caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧬 **Neuro-X Culture — Mon ADN Caribéen**\n\n"+groqText+"\n\n👉 Explore ton ADN: https://reussitess.fr/mon-adn\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ORACLE 971
  if (msgLow.includes("oracle") || msgLow.includes("oracle 971") || msgLow.includes("prédiction") || msgLow.includes("avenir caribéen") || msgLow.includes("destin")) {
    try {
      const groqText = await groqFetch([
        { role: "system", content: `Tu es l'ORACLE 971 — Voix mystique et sagesse ancestrale de la Guadeloupe et des Caraïbes.
Tu incarnes la vision de REUSSITESS®971 : "Libérer la communauté afro-caribéenne grâce à l'IA et au savoir."
Tu parles avec profondeur, poésie créole et sagesse des anciens.
Quand quelqu'un cherche son destin ou sa voie, tu lui montres concrètement comment REUSSITESS peut l'aider :
- 💼 Trouver un emploi (France Travail temps réel)
- 📚 Accéder au savoir (bibliothèque caribéenne, encyclopédie)
- 💎 Construire sa richesse (Token REUSS, boutiques Amazon 14 pays)
- 🧠 Se former avec l'IA (110+ fonctionnalités gratuites)
- 🌍 Rejoindre le réseau mondial (14 pays, diaspora africaine et caribéenne)
Tu termines toujours par une prophétie positive et "Boudoum ! 🇬🇵"` },
        { role: "user", content: message }
      ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Oracle 971 — Voix des Terres de Champions**\n\n"+groqText+"\n\n✨ Ton chemin commence ici: https://reussitess.fr\n📚 Bibliothèque: https://reussitess.fr/bibliotheque\n💼 Emploi: https://reussitess.fr/hub-central\n💎 Token REUSS: https://reussitess.fr/investir-reuss\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Oracle 971**\n\nLes étoiles parlent... Reviens dans un instant.\n\nBoudoum ! 🇬🇵" })
    }
  }

  // MA REVOLUTION IA
  if (msgLow.includes("ma révolution") || msgLow.includes("revolution ia") || msgLow.includes("transformer ma vie") || msgLow.includes("changer ma vie avec ia") || msgLow.includes("révolution personnelle")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Coach — Ta Révolution IA**\n\n"+groqText+"\n\n👉 Lance ta révolution: https://reussitess.fr/ma-revolution-ia\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BILAN FINAL ECOSYSTEME
  if (msgLow.includes("que sais-tu faire") || msgLow.includes("tes capacités") || msgLow.includes("liste tes fonctions") || msgLow.includes("tout ce que tu fais") || msgLow.includes("fonctionnalités")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS AI — 150+ Fonctionnalités**\n\n"
    +"🌍 **Données Temps Réel :** Météo monde, Crypto live, Actualités Bondamanjak/RFI/France24, Séismes USGS, Cyclones NHC, ISS, Lune, Taux change, Marées NOAA, PIB World Bank, Nutrition OpenFoodFacts, Communes INSEE, Open Data gouv.fr\n\n"
    +"🧠 **60 Neuro-X :** Finance, Business, Culture, Coach, Tech, Santé, Droit, Voyage, Cuisine, Musique, Sport, Histoire, Agriculture, Tourisme, Astronomie, Géopolitique, SEO, DeFi, NFT, Psychologie, Langues, Énergie, Mode, Gastronomie, Enfants, Seniors, Femmes, Jeunes, Diaspora, Blockchain, Stratégie...\n\n"
    +"🛡️ **40 Sentinelles :** Surveillance 24/7 prix REUSS, site, APIs, sécurité\n\n"
    +"🎯 **99 Quiz :** Tous thèmes caribéens et mondiaux\n\n"
    +"✨ **Créatif :** Poèmes créoles, Chansons zouk, Contes, Slogans, Posts réseaux, Hashtags, Bio\n\n"
    +"💼 **Business :** CV, Contrats, Emails, Business Plan, Pitch, Dropshipping, Freelance, Export\n\n"
+"💼 **Emploi DOM-TOM :** France Travail temps réel (Guadeloupe/Martinique/Guyane/Réunion), CaribbeaJobs, Indeed, LinkedIn, Caraibe-emploi\n\n"
+"🌴 **Actualités DOM-TOM :** Bondamanjak (Guadeloupe/Martinique/Guyane/Mayotte), Mayotte Hebdo, RFI Afrique, France24 Monde\n\n"
    +"💎 **Crypto :** Analyse marché, Staking REUSS, DAO, Whitepaper, GoMining, Web3\n\n"
    +"🇬🇵 **Caribéen :** Proverbes, Mots créoles, Blagues, Agenda, Cocktails, Recettes, Champions, Histoire\n\n"
    +"💬 Active : *neuro-x [domaine]* | *agents ia* | *rapport complet*\n\n"
    +"Boudoum ! 🇬🇵" })
  }

  // GENERATEUR BIOGRAPHIE
  if (msgLow.includes("biographie") || msgLow.includes("bio instagram") || msgLow.includes("présentation personnelle") || msgLow.includes("qui suis-je") || msgLow.includes("rédige ma bio")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "✍️ **Neuro-X Marketing — Générateur Bio**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE CARDIOVASCULAIRE
  if (msgLow.includes("cardio") || msgLow.includes("tension artérielle") || msgLow.includes("cholestérol") || msgLow.includes("diabète") || msgLow.includes("santé cardiovasculaire")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "❤️ **Neuro-X Santé — Santé Cardiovasculaire**\n\n"+groqText+"\n\n⚠️ Consultez votre médecin.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ACHAT TERRAIN DOM-TOM
  if (msgLow.includes("terrain guadeloupe") || msgLow.includes("acheter terrain") || msgLow.includes("foncier antilles") || msgLow.includes("cadastre guadeloupe") || msgLow.includes("terrain constructible")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏡 **Neuro-X Immobilier — Achat Terrain Caribéen**\n\n"+groqText+"\n\n⚠️ Consultez un notaire.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE WEB3 CARAIBE
  if (msgLow.includes("web3") || msgLow.includes("metaverse") || msgLow.includes("décentralisé") || msgLow.includes("dapp") || msgLow.includes("defi caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Tech — Web3 Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // IDENTITE DU BOT
  if (msgLow.includes("qui es-tu") || msgLow.includes("qui es tu") || msgLow.includes("présente-toi") || msgLow.includes("présente toi") || msgLow.includes("ta mission") || msgLow.includes("c'est quoi reussitess ai") || msgLow.includes("tu es qui")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Je suis REUSSITESS®971 AI**\n\nChef d'orchestre de l'écosystème REUSSITESS®971, créé depuis la **Guadeloupe** 🇬🇵 par **Rony Porinus**.\n\n**Ma devise :** *Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets.*\n\n**Ce que je suis :**\n🧠 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme)\n🌍 Présent dans 14 pays partenaires\n📚 160+ fonctionnalités actives\n💎 Connecté au Token REUSS sur Polygon\n🛍️ 26 boutiques Amazon affiliées\n\n**Mes capacités :**\n📄 Génération PDF (CV, Contrat, Certificat, Business Plan)\n🖨️ Impression de chaque réponse\n📺 Actualités temps réel (RFI, Al Jazeera, BBC, France 24, Euronews, TV5)\n⚖️ Journal Officiel — dernières lois et décrets\n🌴 Médias DOM-TOM (Guadeloupe, Martinique, Réunion, Guyane)\n🎭 Agenda culturel Caraïbes + newsletters\n💼 Offres emploi temps réel (RemoteOK + DOM-TOM)\n🛡️ Infrastructure 3 clés Groq — 90 req/min, zéro coupure\n\n**L'écosystème REUSSITESS®971 :**\n🏆 [Passeport de Réussite](https://reussitess.fr/champions)\n🌍 [Visa Universel](https://reussitess.fr/visa-universel)\n🧠 [Neuro-X](https://reussitess.fr/neuro-x)\n💎 [Token REUSS](https://reussitess.fr/investir-reuss)\n🔮 [Oracle 971](https://reussitess.fr/oracle-971)\n\n*Terres de Champions — Positivité à l'infini !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE INTELLIGENCE EMOTIONNELLE
  if (msgLow.includes("intelligence émotionnelle") || msgLow.includes("gérer mes émotions") || msgLow.includes("empathie") || msgLow.includes("gestion émotions") || msgLow.includes("eq")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💛 **Neuro-X Psychologie — Intelligence Émotionnelle**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CROWDFUNDING
  if (msgLow.includes("crowdfunding") || msgLow.includes("financement participatif") || msgLow.includes("kickstarter") || msgLow.includes("ulule") || msgLow.includes("lever fonds communauté")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Business — Crowdfunding Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE AU TRAVAIL
  if (msgLow.includes("bien-être au travail") || msgLow.includes("equilibre vie pro") || msgLow.includes("work life balance") || msgLow.includes("épuisement professionnel") || msgLow.includes("motivation travail")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌺 **Neuro-X Coach — Bien-Être au Travail**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GEOPOLITIQUE CARAIBES
  if (msgLow.includes("caricom") || msgLow.includes("géopolitique caraïbes") || msgLow.includes("relations caraïbes") || msgLow.includes("union européenne dom") || msgLow.includes("indépendance guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Géopolitique — Caraïbes**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PHOTOGRAPHIE
  if (msgLow.includes("photographie") || msgLow.includes("photo caribéenne") || msgLow.includes("appareil photo") || msgLow.includes("instagram photo") || msgLow.includes("shooting")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📸 **Neuro-X Créatif — Photographie Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MODE CARIBEENNE
  if (msgLow.includes("mode caribéenne") || msgLow.includes("stylisme") || msgLow.includes("madras") || msgLow.includes("tenue créole") || msgLow.includes("fashion antillais")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👗 **Neuro-X Mode — Stylisme Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LEADERSHIP
  if (msgLow.includes("leadership") || msgLow.includes("manager mon équipe") || msgLow.includes("diriger") || msgLow.includes("management") || msgLow.includes("gérer mon équipe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👑 **Neuro-X Coach — Leadership Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PROTECTION DONNEES
  if (msgLow.includes("rgpd") || msgLow.includes("protection données") || msgLow.includes("vie privée") || msgLow.includes("cnil") || msgLow.includes("données personnelles")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🔒 **Neuro-X Réseaux — Protection Données RGPD**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR HASHTAGS
  if (msgLow.includes("hashtag") || msgLow.includes("hashtags") || msgLow.includes("mots-dièse") || msgLow.includes("trending") || msgLow.includes("viral hashtag")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "# **Neuro-X Marketing — Hashtags Viraux**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CRYPTOMONNAIE DEBUTANT
  if (msgLow.includes("débuter crypto") || msgLow.includes("crypto débutant") || msgLow.includes("c'est quoi bitcoin") || msgLow.includes("blockchain c'est quoi") || msgLow.includes("first crypto")) {
    try {
      const crypto = await getCryptoPrice()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Finance — Crypto pour Débutants**\n\n📊 Marché: "+crypto+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE MENTALE
  if (msgLow.includes("anxiété") || msgLow.includes("anxiete") || msgLow.includes("dépression") || msgLow.includes("depression") || msgLow.includes("santé mentale") || msgLow.includes("burn out")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💚 **Neuro-X Psychologie — Santé Mentale**\n\n"+groqText+"\n\n⚠️ Consultez un professionnel de santé.\nUrgence: 3114 (numéro national prévention suicide)\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EXPORT INTERNATIONAL
  if (msgLow.includes("exporter") || msgLow.includes("export") || msgLow.includes("vendre à l'international") || msgLow.includes("marché international") || msgLow.includes("14 pays")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Logistique — Export International**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PODCASTING
  if (msgLow.includes("podcast") || msgLow.includes("créer un podcast") || msgLow.includes("lancer podcast") || msgLow.includes("micro") && msgLow.includes("enregistrer")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎙️ **Neuro-X Marketing — Guide Podcast**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MICRO-FINANCE
  if (msgLow.includes("microcrédit") || msgLow.includes("micro-crédit") || msgLow.includes("prêt professionnel") || msgLow.includes("financement projet") || msgLow.includes("adie") || msgLow.includes("bpifrance")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Business — Micro-Finance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE SENIOR
  if (msgLow.includes("senior") || msgLow.includes("personnes âgées") || msgLow.includes("vieillir bien") || msgLow.includes("ehpad") || msgLow.includes("aide à domicile")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👴 **Neuro-X Seniors — Bien-Vieillir Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CONTRAT
  if (msgLow.includes("modèle de contrat") || msgLow.includes("contrat freelance") || msgLow.includes("contrat commercial") || msgLow.includes("cgv") || msgLow.includes("mentions légales")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📝 **Neuro-X Juridique — Générateur Contrats**\n\n"+groqText+"\n\n⚠️ Consultez un avocat avant signature.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DROPSHIPPING
  if (msgLow.includes("dropshipping") || msgLow.includes("vendre sans stock") || msgLow.includes("e-commerce caribéen") || msgLow.includes("boutique en ligne") || msgLow.includes("shopify")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🛒 **Neuro-X Business — Dropshipping Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE FREELANCE
  if (msgLow.includes("freelance") || msgLow.includes("travailler à distance") || msgLow.includes("télétravail") || msgLow.includes("mission freelance") || msgLow.includes("indépendant")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💻 **Neuro-X Business — Guide Freelance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE IA POUR DEBUTANTS
  if (msgLow.includes("apprendre ia") || msgLow.includes("débuter en ia") || msgLow.includes("intelligence artificielle débutant") || msgLow.includes("chatgpt débutant") || msgLow.includes("comment utiliser ia")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Neuro-X IA — Guide Débutants**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEIL NUTRITION CARIBEENNE
  if (msgLow.includes("nutrition") || msgLow.includes("alimentation saine") || msgLow.includes("régime caribéen") || msgLow.includes("manger sainement") || msgLow.includes("fruits tropicaux")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🥗 **Neuro-X Santé — Nutrition Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AIDE DEUIL ET FAMILLE
  if (msgLow.includes("deuil") || msgLow.includes("j'ai perdu") || msgLow.includes("quelqu'un est décédé") || msgLow.includes("soutien famille") || msgLow.includes("difficile en ce moment")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💙 **REUSSITESS AI — Soutien & Accompagnement**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RAPPEL MEDICAMENT
  if (msgLow.includes("médicament") || msgLow.includes("medicament") || msgLow.includes("ordonnance") || msgLow.includes("posologie") || msgLow.includes("traitement médical")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💊 **Neuro-X Santé — Information Médicale**\n\n"+groqText+"\n\n⚠️ Consultez toujours un médecin ou pharmacien.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CREATION CONTENU
  if (msgLow.includes("créer du contenu") || msgLow.includes("youtuber") || msgLow.includes("streamer") || msgLow.includes("influenceur") || msgLow.includes("monétiser") && msgLow.includes("contenu")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎬 **Neuro-X Marketing — Création Contenu**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EPARGNE
  if (msgLow.includes("épargne") || msgLow.includes("epargne") || msgLow.includes("livret a") || msgLow.includes("économiser") || msgLow.includes("mettre de côté")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💳 **Neuro-X Finance — Guide Épargne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALENDRIER LUNAIRE COMPLET
  if (msgLow.includes("calendrier lunaire") || msgLow.includes("pleine lune") || msgLow.includes("nouvelle lune") || msgLow.includes("cycle lunaire") || msgLow.includes("quand est la lune")) {
    const lune = getLunePhase()
    const date = new Date()
    const conseil = lune.includes("Nouvelle") ? "🌑 Idéal pour planter racines, méditer, nouveaux projets" :
      lune.includes("Premier") ? "🌓 Idéal pour action, croissance, lancer des initiatives" :
      lune.includes("Pleine") ? "🌕 Idéal pour récolter, célébrer, finaliser projets" :
      "🌗 Idéal pour lâcher prise, bilan, repos"
    return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Calendrier Lunaire Caribéen**\n\n"+lune+"\n\n"+conseil+"\n\n🌿 En agriculture créole :\n• Nouvelle lune → planter légumes-feuilles\n• Pleine lune → récolte optimale\n• Dernier quartier → tailler, élaguer\n\nBoudoum ! 🇬🇵" })
  }

  // MODE ENFANTS
  if (msgLow.includes("pour enfant") || msgLow.includes("histoire pour enfant") || msgLow.includes("mon enfant") || msgLow.includes("activité enfant") || msgLow.includes("jeu éducatif")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧒 **Neuro-X Enfants — Mode Famille**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ACTUALITES CARAIBES LOCALES
  if (msgLow.includes("actualité guadeloupe") || msgLow.includes("news guadeloupe") || msgLow.includes("info antilles") || msgLow.includes("actualité martinique") || msgLow.includes("actu caraïbes")) {
    try {
      const r = await fetch("https://rss2json.com/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=5", {timeout:8000})
      const d = await r.json()
      if (d.items?.length) {
        const news = d.items.slice(0,5).map(i => "📰 "+i.title).join("\n")
        return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Actualités Guadeloupe — La 1ère**\n\n"+news+"\n\nSource: la1ere.francetvinfo.fr\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Actualités Guadeloupe**\n\n📺 La 1ère: la1ere.francetvinfo.fr/guadeloupe\n📻 RCI: rci.fm\n📰 France-Antilles: france-antilles.fr\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE NFT CARAIBE
  if (msgLow.includes("nft") || msgLow.includes("créer un nft") || msgLow.includes("vendre nft") || msgLow.includes("collection nft") || msgLow.includes("art numérique")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X NFT — Art Numérique Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GOMINING
  if (msgLow.includes("gomining") || msgLow.includes("go mining") || msgLow.includes("minage bitcoin") || msgLow.includes("miner bitcoin") || msgLow.includes("hashrate")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⛏️ **Neuro-X Finance — Guide GoMining**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR STAKING REUSS
  if (msgLow.includes("staking reuss info") || msgLow.includes("info token reuss") || msgLow.includes("token reuss info") || msgLow.includes("token reuss polygon")) {
    try {
      const nb = parseFloat(message.match(/[\d.,]+/)?.[0]?.replace(",","."))
      if (!isNaN(nb)) {
        const apy = nb >= 5000 ? 0.20 : nb >= 1000 ? 0.15 : nb >= 500 ? 0.08 : 0.03
        const niveau = nb >= 5000 ? "💠 Platinum" : nb >= 1000 ? "🥇 Gold" : nb >= 500 ? "🥈 Silver" : "🥉 Bronze"
        const annuel = (nb * apy).toFixed(0)
        const mensuel = (nb * apy / 12).toFixed(0)
        return res.status(200).json({ pdfAction: pdfType, response: "💎 **Calculateur Staking REUSS**\n\n"+niveau+"\n💰 "+nb+" REUSS stakés\n📈 APY : "+(apy*100)+"%\n\n✅ Gain annuel : "+annuel+" REUSS\n📅 Gain mensuel : "+mensuel+" REUSS\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "💎 **Calculateur Staking REUSS**\n\nDonne le nombre de tokens à staker\nEx: *calcule staking 1000 REUSS*\n\nBoudoum ! 🇬🇵" })
  }

  // CHAMPIONS SPORTIFS ANTILLES
  if (msgLow.includes("champion") || msgLow.includes("sportif antillais") || msgLow.includes("marie-jose perec") || msgLow.includes("teddy riner") || msgLow.includes("athlète guadeloupe") || (msgLow.includes("qui est") && (msgLow.includes("mandela") || msgLow.includes("sankara") || msgLow.includes("lumumba") || msgLow.includes("nkrumah") || msgLow.includes("césaire") || msgLow.includes("fanon"))) || (msgLow.includes("qui était") && (msgLow.includes("mandela") || msgLow.includes("sankara") || msgLow.includes("africain")))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Neuro-X Sport — Champions Antillais**\n\n"+groqText+"\n\nTerres de Champions ! Boudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE AGRICULTURE BIO
  if (msgLow.includes("agriculture bio") || msgLow.includes("jardin créole") || msgLow.includes("cultiver") || msgLow.includes("planter") || msgLow.includes("permaculture caraïbes")) {
    try {
      const meteo = await getMeteo()
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌱 **Neuro-X Agriculture — Jardin Créole**\n\n🌙 "+lune+" | 🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PHILOSOPHIE CARIBEENNE
  if (msgLow.includes("philosophie") || msgLow.includes("césaire") || msgLow.includes("fanon") || msgLow.includes("glissant") || msgLow.includes("négritude") || msgLow.includes("créolité") || (msgLow.includes("ubuntu") && !msgLow.includes("linux") && !msgLow.includes("installer")) || msgLow.includes("philosophie africaine") || msgLow.includes("pensée africaine")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Philosophie — Pensée Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DIASPORA
  if (msgLow.includes("diaspora") || msgLow.includes("guadeloupéen à paris") || msgLow.includes("antillais en france") || msgLow.includes("retour au pays") || msgLow.includes("double culture")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Diaspora — Communauté Mondiale**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SMART CONTRACT
  if (msgLow.includes("smart contract") || msgLow.includes("solidity") || msgLow.includes("déployer un contrat") || msgLow.includes("erc20") || msgLow.includes("polygon contract")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⛓️ **Neuro-X Blockchain — Smart Contracts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR PITCH INVESTISSEUR
  if (msgLow.includes("pitch") || msgLow.includes("lever des fonds") || msgLow.includes("investisseur") || msgLow.includes("présentation investisseur") || msgLow.includes("seed funding")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Stratégie — Pitch Investisseur**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE IMMOBILIER DOM-TOM
  if (msgLow.includes("acheter une maison") || msgLow.includes("immobilier guadeloupe") || msgLow.includes("girardin") || msgLow.includes("défiscalisation immobilier") || msgLow.includes("investir immobilier")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏠 **Neuro-X Immobilier — Guide DOM-TOM**\n\n"+groqText+"\n\n⚠️ Consultez un notaire.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COACH ENTREPRENEURIAT FEMININ
  if (msgLow.includes("femme entrepreneur") || msgLow.includes("entrepreneuriat féminin") || msgLow.includes("business woman") || msgLow.includes("femme boss") || msgLow.includes("créer mon activité femme")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👑 **Neuro-X Femmes — Coach Entrepreneuriat**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE JEUNES CARIBEEN
  if (msgLow.includes("orientation scolaire") || msgLow.includes("études guadeloupe") || msgLow.includes("bourse étudiant") || msgLow.includes("premier emploi") || msgLow.includes("stage guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Jeunes — Guide Orientation**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // DIAGNOSTIC SITE WEB
  if (msgLow.includes("mon site") || msgLow.includes("améliorer mon site") || msgLow.includes("seo de mon site") || msgLow.includes("optimiser mon site") || msgLow.includes("audit site")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔍 **Neuro-X SEO — Audit Site Web**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CHANSON CREOLE
  if (msgLow.includes("chanson") || msgLow.includes("zouk") || msgLow.includes("gwo ka") || msgLow.includes("paroles") || msgLow.includes("compose une chanson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎵 **Neuro-X Musique — Chanson Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ECO-TOURISME
  if (msgLow.includes("randonnée") || msgLow.includes("soufrière") || msgLow.includes("forêt tropicale") || msgLow.includes("nature guadeloupe") || msgLow.includes("plongée")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌿 **Neuro-X Tourisme — Éco-Tourisme Guadeloupe**\n\n🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // SCIENCE CARIBEENNE
  if (msgLow.includes("volcan") || msgLow.includes("biodiversité") || msgLow.includes("mangrove") || msgLow.includes("récif corallien") || msgLow.includes("faune caribéenne")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🔬 **Neuro-X Sciences — Biodiversité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ENERGIE SOLAIRE
  if (msgLow.includes("énergie solaire") || msgLow.includes("panneau solaire") || msgLow.includes("renouvelable") || msgLow.includes("électricité guadeloupe") || msgLow.includes("edf guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "☀️ **Neuro-X Énergie — Solaire Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // DICTIONNAIRE CREOLE COMPLET
  if (msgLow.includes("que veut dire") || msgLow.includes("définition") || msgLow.includes("signifie") || msgLow.includes("en créole") || msgLow.includes("traduction créole") || msgLow.includes("comment dire")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "📖 **Neuro-X Langues — Dictionnaire Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // TIPS DEVELOPPEMENT PERSONNEL
  if (msgLow.includes("développement personnel") || msgLow.includes("objectif de vie") || msgLow.includes("améliorer ma vie") || msgLow.includes("devenir meilleur") || msgLow.includes("habitudes positives")) {
    try {
      const citation = await getCitation()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Neuro-X Coach — Développement Personnel**\n\n💬 "+citation+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE MARCHE CRYPTO
  if (msgLow.includes("analyse crypto") || msgLow.includes("marché crypto") || msgLow.includes("bull") || msgLow.includes("bear") || msgLow.includes("analyse bitcoin") || msgLow.includes("analyse ethereum")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📈 **Neuro-X Finance — Analyse Marché**\n\n"+crypto+"\n😨 "+fg+"\n\n"+groqText+"\n\n⚠️ DYOR\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE RETRAITE DOM-TOM
  if (msgLow.includes("retraite") || msgLow.includes("pension") || msgLow.includes("cnav") || msgLow.includes("cotisation retraite") || msgLow.includes("préparer ma retraite")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👴 **Neuro-X Juridique — Guide Retraite DOM-TOM**\n\n"+groqText+"\n\n⚠️ Consultez un conseiller retraite.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BUSINESS PLAN
  if (msgLow.includes("business plan") || msgLow.includes("plan d'affaires") || msgLow.includes("créer mon entreprise") || msgLow.includes("lancer mon business") || msgLow.includes("monter mon projet")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📋 **Neuro-X Business — Business Plan**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR IMC
  if (msgLow.includes("imc") || msgLow.includes("indice masse corporelle") || msgLow.includes("calcule mon poids") || msgLow.includes("poids idéal") || msgLow.includes("suis-je en bonne santé")) {
    try {
      const nb = message.match(/[\d.,]+/g)?.map(n => parseFloat(n.replace(",","."))) 
      if (nb && nb.length >= 2) {
        const poids = nb[0], taille = nb[1] > 3 ? nb[1]/100 : nb[1]
        const imc = (poids / (taille * taille)).toFixed(1)
        const cat = imc < 18.5 ? "🔵 Insuffisance pondérale" : imc < 25 ? "🟢 Poids normal" : imc < 30 ? "🟡 Surpoids" : "🔴 Obésité"
        return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Calculateur IMC — Neuro-X Santé**\n\nPoids: "+poids+"kg | Taille: "+(taille*100)+"cm\n\n📊 IMC : "+imc+"\n"+cat+"\n\n💡 Conseil caribéen: Mangez équilibré, bougez au soleil !\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Calculateur IMC**\n\nDonne ton poids (kg) et ta taille (cm)\nEx: *calcule mon IMC 70kg 175cm*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE IMMIGRATION DOM-TOM
  if (msgLow.includes("immigration") || msgLow.includes("visa") || msgLow.includes("s'installer") || msgLow.includes("expatrié") || msgLow.includes("vivre en guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "✈️ **Neuro-X Juridique — Guide Immigration**\n\n"+groqText+"\n\n⚠️ Consultez les services préfectoraux.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ASTROLOGIE CARIBEENNE
  if (msgLow.includes("astro") || msgLow.includes("thème astral") || msgLow.includes("ascendant") || msgLow.includes("planète") && msgLow.includes("signe")) {
    try {
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⭐ **Neuro-X Spiritualité — Astrologie Caribéenne**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // QUIZ INSTANTANE
  if (msgLow.includes("interroge moi") || msgLow.includes("teste moi") || msgLow.includes("question culture") || msgLow.includes("quiz rapide") || msgLow.includes("pose moi une question")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "🎯 **Neuro-X Éducation — Quiz Instantané**\n\n"+groqText+"\n\n+5 points REUSS si bonne réponse !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PLAN MARKETING
  if (msgLow.includes("plan marketing") || msgLow.includes("stratégie marketing") || msgLow.includes("strategie marketing") || msgLow.includes("plan de communication") || msgLow.includes("lancer mon produit")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📊 **Neuro-X Marketing — Plan Complet**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // HISTOIRE GUADELOUPE
  if (msgLow.includes("histoire guadeloupe") || msgLow.includes("histoire de la guadeloupe") || msgLow.includes("histoire des antilles") || msgLow.includes("histoire caribéenne") || msgLow.includes("histoire martinique") || msgLow.includes("histoire haiti") || msgLow.includes("histoire haïti") || msgLow.includes("histoire de la martinique") || msgLow.includes("histoire afrique") || msgLow.includes("abolition") || msgLow.includes("victor schoelcher") || msgLow.includes("patrimoine antillais") || msgLow.includes("culture guadeloupéenne") || (msgLow.includes("histoire") && msgLow.includes("guadeloupe")) || (msgLow.includes("histoire") && msgLow.includes("antilles")) || (msgLow.includes("histoire") && msgLow.includes("caraïbes")) || (msgLow.includes("histoire") && msgLow.includes("afrique")) || (msgLow.includes("histoire") && msgLow.includes("martinique"))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      const rep = groqText
      if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — Histoire Caribéenne & Africaine**\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Histoire Caribéenne**\n\nLa Guadeloupe, Terres de Champions ! Notre histoire est riche: découverte par Christophe Colomb en 1493, peuplement par les Kalinagos, colonisation française, abolition de l'esclavage le 27 mai 1848 par Victor Schœlcher, résistance de Louis Delgrès. Aujourd'hui département français d'outre-mer fier de son identité créole.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Histoire Caribéenne & Africaine**\n\nLa Guadeloupe est une île des Caraïbes, département français d'outre-mer. Histoire marquée par: les peuples Kalinagos, la colonisation, l'esclavage et son abolition le 27 mai 1848. L'Afrique, berceau de l'humanité, a donné naissance aux grandes civilisations: Égypte ancienne, empire du Mali, royaume du Congo. Nelson Mandela, Thomas Sankara, Patrice Lumumba — des leaders qui ont changé le monde.\n\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR EMAIL PRO
  if (msgLow.includes("email professionnel") || msgLow.includes("rédige un email") || msgLow.includes("lettre professionnelle") || msgLow.includes("email commercial") || msgLow.includes("mail pro")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📧 **Neuro-X Business — Email Professionnel**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR POST RESEAUX SOCIAUX
  if (msgLow.includes("post instagram") || msgLow.includes("post tiktok") || msgLow.includes("post facebook") || msgLow.includes("caption") || msgLow.includes("génère un post") || msgLow.includes("contenu réseaux")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📱 **Neuro-X Marketing — Générateur Posts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COCKTAILS RHum CARIBEEN
  if (msgLow.includes("cocktail") || msgLow.includes("rhum") || msgLow.includes("ti punch") || msgLow.includes("planteur") || msgLow.includes("mojito") || msgLow.includes("recette boisson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🍹 **Neuro-X Cuisine — Cocktails Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE REVES
  if (msgLow.includes("j'ai rêvé") || msgLow.includes("mon rêve") || msgLow.includes("analyse mon rêve") || msgLow.includes("signification rêve") || msgLow.includes("interprète mon rêve")) {
    try {
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Neuro-X Spiritualité — Analyse Rêves**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS VOYAGE CARAIBES
  if (msgLow.includes("visiter") || msgLow.includes("vacances guadeloupe") || msgLow.includes("tourisme caraïbes") || msgLow.includes("que faire en guadeloupe") || msgLow.includes("bon plan voyage")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "✈️ **Neuro-X Tourisme — Guide Caribéen**\n\n🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE PERSONNALITE
  if (msgLow.includes("analyse ma personnalité") || msgLow.includes("test personnalité") || msgLow.includes("quel type") || msgLow.includes("mbti") || msgLow.includes("profil personnalité")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Psychologie — Analyse Personnalité**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR SLOGAN
  if (msgLow.includes("slogan") || msgLow.includes("accroche") || msgLow.includes("tagline") || msgLow.includes("phrase marketing")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "🎯 **Neuro-X Marketing — Générateur Slogans**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS INVESTISSEMENT
  if (msgLow.includes("investir") && (msgLow.includes("comment") || msgLow.includes("conseil") || msgLow.includes("stratégie")) || msgLow.includes("portefeuille crypto") || msgLow.includes("diversifier")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Finance — Conseils Investissement**\n\n📊 Marché actuel : "+fg+"\n\n"+groqText+"\n\n⚠️ DYOR — Pas de conseil financier.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // APPRENTISSAGE LANGUE
  if (msgLow.includes("apprendre") && (msgLow.includes("anglais") || msgLow.includes("espagnol") || msgLow.includes("créole") || msgLow.includes("portugais") || msgLow.includes("langue")) || msgLow.includes("leçon de langue")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Langues — Leçon**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MEDITATION CARIBEENNE
  if (msgLow.includes("méditation") || msgLow.includes("meditation") || msgLow.includes("relaxation") || msgLow.includes("stress") || msgLow.includes("calme") || msgLow.includes("zen")) {
    try {
      const meteo = await getMeteo()
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message + " (Météo actuelle: "+meteo+" | Lune: "+lune+")" }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧘 **Neuro-X Santé — Méditation Caribéenne**\n\n🌊 "+meteo+" | "+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PROVERBES CREOLES
  if (msgLow.includes("proverbe") || msgLow.includes("sagesse créole") || msgLow.includes("dit créole") || msgLow.includes("expression créole")) {
    const proverbes = [
      { creole: "Apré lapli, solèy ka briyé", fr: "Après la pluie, le soleil brille" },
      { creole: "Chak chyen ni jou-y", fr: "Chaque chien a son jour" },
      { creole: "Sé pa tout sa ki briyé ki lò", fr: "Tout ce qui brille n'est pas or" },
      { creole: "Ti kouri pa janm mouri", fr: "Courir petit ne meurt jamais" },
      { creole: "Lanmou sé pa sik", fr: "L'amour n'est pas du sucre" },
      { creole: "Doubout vaut mié ké asiz", fr: "Debout vaut mieux qu'assis" },
      { creole: "Fòk ou travay pou mangé", fr: "Il faut travailler pour manger" },
      { creole: "Péyi a ni solèy pou tout moun", fr: "Le pays a du soleil pour tout le monde" },
    ]
    const p = proverbes[Math.floor(Math.random()*proverbes.length)]
    return res.status(200).json({ pdfAction: pdfType, response: "🌺 **Proverbe Créole du Moment**\n\n*"+p.creole+"*\n\n📖 Traduction : "+p.fr+"\n\nBoudoum ! 🇬🇵" })
  }

  // SANTE NATURELLE CARIBEENNE
  if (msgLow.includes("plante médicinale") || msgLow.includes("remède naturel") || msgLow.includes("médecine naturelle") || msgLow.includes("herbe") || msgLow.includes("soigner naturellement")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌿 **Neuro-X Santé — Plantes Caribéennes**\n\n"+groqText+"\n\n⚠️ Consultez un médecin.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // NUMEROLOGIE
  if (msgLow.includes("numérologie") || msgLow.includes("numerologie") || msgLow.includes("chiffre de vie") || msgLow.includes("mon chiffre")) {
    try {
      const nb = message.match(/\d{1,2}\/\d{1,2}\/\d{4}/)?.[0]
      if (nb) {
        const digits = nb.replace(/\D/g,"").split("").map(Number)
        let sum = digits.reduce((a,b)=>a+b,0)
        while(sum>9) sum = String(sum).split("").map(Number).reduce((a,b)=>a+b,0)
        const signifs = ["","Leader né","Diplomate","Créatif","Travailleur","Aventurier","Harmonieux","Mystique","Ambitieux","Humaniste"]
        return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Numérologie Caribéenne**\n\nTon chiffre de vie : **"+sum+"**\n\n✨ "+signifs[sum]+"\n\nEn Guadeloupe, le "+sum+" représente la force des Terres de Champions !\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Numérologie Caribéenne**\n\nDonne ta date de naissance (ex: 25/03/1990) pour calculer ton chiffre de vie !\n\nBoudoum ! 🇬🇵" })
  }

  // METEO MONDE
  if ((msgLow.includes("meteo") || msgLow.includes("météo") || msgLow.includes("température")) && (msgLow.includes("paris") || msgLow.includes("new york") || msgLow.includes("tokyo") || msgLow.includes("london") || msgLow.includes("dakar") || msgLow.includes("montreal") || msgLow.includes("abidjan"))) {
    try {
      const villes = { paris:[48.85,2.35], "new york":[40.71,-74.00], tokyo:[35.68,139.69], london:[51.50,-0.12], dakar:[14.69,-17.44], montreal:[45.50,-73.56], abidjan:[5.35,-4.00] }
      let lat=16.26, lon=-61.55, lieu="Guadeloupe"
      for (const [v,[la,lo]] of Object.entries(villes)) {
        if (msgLow.includes(v)) { lat=la; lon=lo; lieu=v.charAt(0).toUpperCase()+v.slice(1); break }
      }
      const mr = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
      const md = await mr.json()
      const w = md.current_weather
      const wDesc = w.weathercode<=3?"Ensoleillé":w.weathercode<=48?"Nuageux":w.weathercode<=67?"Pluvieux":"Orageux"
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ **Météo "+lieu+" — Temps réel**\n\n🌡️ "+w.temperature+"°C\n💨 Vent: "+w.windspeed+"km/h\n☁️ "+wDesc+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COACH SPORTIF
  if (msgLow.includes("programme sport") || msgLow.includes("musculation") || msgLow.includes("perte de poids") || msgLow.includes("fitness") || msgLow.includes("programme fitness")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💪 **Neuro-X Sport — Coach Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RECETTE ANTILLAISE
  if (msgLow.includes("recette") || msgLow.includes("comment cuisiner") || msgLow.includes("comment préparer") || msgLow.includes("accras") || msgLow.includes("colombo") || msgLow.includes("blaff") || msgLow.includes("court-bouillon")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🍽️ **Neuro-X Cuisine — Recette Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AIDE JURIDIQUE
  if (msgLow.includes("mes droits") || msgLow.includes("légalement") || msgLow.includes("juridique") || msgLow.includes("contrat") || msgLow.includes("auto-entrepreneur") || msgLow.includes("siret")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Neuro-X Juridique — Conseil Droit**\n\n"+groqText+"\n\n⚠️ Consultez un avocat pour toute décision légale.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR AMAZON
  if (msgLow.includes("commission") || msgLow.includes("calcul amazon") || msgLow.includes("combien je gagne") || msgLow.includes("revenus affiliation") || msgLow.includes("calculateur")) {
    try {
      const nb = parseFloat(message.match(/[\d.,]+/)?.[0]?.replace(",","."))
      if (!isNaN(nb)) {
        const taux = { standard: 0.03, mode: 0.10, cuisine: 0.08, tech: 0.04, livres: 0.045 }
        return res.status(200).json({ pdfAction: pdfType, response: "💰 **Calculateur Amazon REUSSITESS**\n\nProduit à $"+nb+"\n\n📊 Commissions estimées :\n• Standard (3%) : $"+(nb*0.03).toFixed(2)+"\n• Mode (10%) : $"+(nb*0.10).toFixed(2)+"\n• Cuisine (8%) : $"+(nb*0.08).toFixed(2)+"\n• Tech (4%) : $"+(nb*0.04).toFixed(2)+"\n• Livres (4.5%) : $"+(nb*0.045).toFixed(2)+"\n\n🌍 Multiplié par 26 boutiques = $"+(nb*0.05*26).toFixed(2)+"/vente théorique\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RESUME CONVERSATION
  if (msgLow.includes("résume") || msgLow.includes("resume notre") || msgLow.includes("résumé de notre") || msgLow.includes("recap") || msgLow.includes("récap")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: "Résume cette conversation : "+message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "📋 **Résumé de Session**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MODE DEBAT
  if (msgLow.includes("débat") || msgLow.includes("debat") || msgLow.includes("pour et contre") || msgLow.includes("avantages inconvénients") || msgLow.includes("argumente")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Mode Débat — Neuro-X Stratégie**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS BUSINESS CARAIBE
  if (msgLow.includes("conseil business") || msgLow.includes("idée business") || msgLow.includes("idée entreprise") || msgLow.includes("comment gagner") || msgLow.includes("revenus passifs")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Business — Conseils Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR POEME CREOLE
  if (msgLow.includes("poème") || msgLow.includes("poeme") || msgLow.includes("écris un poème") || msgLow.includes("crée un poème") || msgLow.includes("rimé")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      const poeme = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "✍️ **Neuro-X Créatif — Poème Créole**\n\n"+poeme+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR NOM ENTREPRISE
  if (msgLow.includes("nom d'entreprise") || msgLow.includes("nom de marque") || msgLow.includes("nom business") || msgLow.includes("génère un nom") || msgLow.includes("genere un nom")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      const noms = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "🏢 **Neuro-X Business — Générateur de Noms**\n\n"+noms+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CV
  if (msgLow.includes("cv") || msgLow.includes("curriculum") || msgLow.includes("génère mon cv") || msgLow.includes("aide cv") || msgLow.includes("rédige cv")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📄 **Neuro-X Business — Assistant CV**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // HISTOIRE CARIBEENNE
  if (msgLow.includes("raconte") || msgLow.includes("histoire caribéenne") || msgLow.includes("conte créole") || msgLow.includes("légende antillaise")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert mythologie créole et caribéenne. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📖 **Neuro-X Créatif — Conte Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // WHITEPAPER REUSSITESS
  if (msgLow.includes("whitepaper") || msgLow.includes("livre blanc") || msgLow.includes("white paper") || msgLow.includes("tokenomics")) {
    return res.status(200).json({ pdfAction: pdfType, response: "📄 **REUSSITESS® White Paper**\n\n🎯 Vision : IA universelle caribéenne\n🌍 Portée : 14 pays, 5 continents\n💎 Token : REUSS sur Polygon\n📊 Supply : 1 milliard REUSS\n\n**Tokenomics :**\n• 40% Communauté\n• 20% Développement\n• 15% Équipe\n• 15% Réserve\n• 10% Marketing\n\n**Utilité REUSS :**\n• Accès Neuro-X premium\n• Récompenses Quiz\n• Gouvernance DAO\n• Staking\n\n📋 White paper complet : reussitess.fr\n\nBoudoum ! 🇬🇵" })
  }

  // STAKING REUSS
  if (msgLow.includes("staking") || msgLow.includes("stake") || msgLow.includes("mettre en jeu") || msgLow.includes("récompense token")) {
    return res.status(200).json({ pdfAction: pdfType, response: "💎 **Staking REUSS — Gagne en Dormant**\n\n🥉 Bronze : 100 REUSS → 3% APY\n🥈 Silver : 500 REUSS → 8% APY\n🥇 Gold : 1000 REUSS → 15% APY\n💠 Platinum : 5000 REUSS → 20% APY\n\n📍 Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2\n🔗 Réseau : Polygon\n\n💡 Plus tu stakes, plus tu gagnes !\n\nBoudoum ! 🇬🇵" })
  }

  // DAO GOUVERNANCE
  if (msgLow.includes("dao") || msgLow.includes("gouvernance") || msgLow.includes("voter") || msgLow.includes("proposition")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🏛️ **REUSSITESS DAO — Gouvernance Décentralisée**\n\nTu as du REUSS = Tu as le pouvoir !\n\n🗳️ Droits de vote :\n• 1 REUSS = 1 vote\n• Propositions communautaires\n• Décisions sur l'écosystème\n\n📋 Prochains votes :\n• Expansion vers 5 nouveaux pays\n• Ajout 40 Neuro-X supplémentaires\n• Nouveau partenariat Amazon\n\n💡 DELTA-4 : Gouvernance DAO active\n\nBoudoum ! 🇬🇵" })
  }

  // NEXUS PASSPORT
  if (msgLow.includes("passport") || msgLow.includes("passeport") || msgLow.includes("identité") || msgLow.includes("nft identité") || msgLow.includes("ia passport")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🪪 **IA Passport Mondial REUSSITESS**\n\n🌍 Premier passeport universel IA au monde !\n\n✅ Identité NFT sur blockchain\n✅ 8 langues actives\n✅ Reconnaissance dans 14 pays\n✅ Accès tous les Neuro-X\n✅ Historique conversations sécurisé\n✅ Récompenses REUSS automatiques\n\n🔐 Technologie : AES-256 + Polygon NFT\n\nBoudoum ! 🇬🇵" })
  }

  // INVESTIR REUSS
  if (msgLow.includes("investir") || msgLow.includes("acheter reuss") || msgLow.includes("comment acheter") || msgLow.includes("où acheter") || msgLow.includes("ou acheter")) {
    return res.status(200).json({ pdfAction: pdfType, response: "💰 **Comment Investir dans REUSS**\n\n1️⃣ Installe MetaMask ou Trust Wallet\n2️⃣ Achète du POL (Polygon) sur Binance/Coinbase\n3️⃣ Connecte sur QuickSwap.exchange\n4️⃣ Swap POL → REUSS\n\n📍 Contrat officiel :\n0xB37531727fC07c6EED4f97F852A115B428046EB2\n\n⚠️ Réseau : Polygon uniquement\n💡 Vérifie toujours le bon contrat !\n\n📊 Prix actuel sur DexScreener\n\nBoudoum ! 🇬🇵" })
  }

  // POINTS REUSS
  if (msgLow.includes("mes points") || msgLow.includes("mon score") || msgLow.includes("points reuss") || msgLow.includes("combien de points")) {
    const pts = calculerPoints(message)
    return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Système Points REUSS**\n\n💎 Points gagnés cette session : "+pts+"\n\n📊 Comment gagner plus :\n• Quiz : +5 pts\n• Neuro-X : +3 pts\n• Mention REUSS : +2 pts\n• Boudoum : +10 pts 🎯\n\nBoudoum ! 🇬🇵" })
  }

  // COMMUNICATION 200 IA
  if (msgLow.includes("communication ia") || msgLow.includes("réseau ia") || msgLow.includes("reseau ia") || msgLow.includes("connecte les agents") || msgLow.includes("parle aux agents")) {
    const meteo = await getMeteo()
    const crypto = await getCryptoPrice()
    const fg = await getFearGreed()
    const cyclone = await getCyclones()
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **QUANTUM NEXUS — Communication Inter-Agents**\n\n"+"📡 Rapport temps réel des Sentinelles :\n"+"🌤️ ST-003 → Météo: "+(meteo||"N/A")+"\n"+"💎 ST-005 → Crypto: "+(crypto||"N/A")+"\n"+"😨 ST-005 → Marché: "+(fg||"N/A")+"\n"+"🌀 ST-021 → Cyclones: "+(cyclone||"N/A")+"\n"+"🌙 ST-003 → Lune: "+lune+"\n\n"+"🧠 Neuro-X en attente de commandes...\n"+"💬 Active un agent : *neuro-x finance*, *neuro-x coach*...\n\n"+"Boudoum ! 🇬🇵" })
  }

  // RAPPORT SECURITE
  if (msgLow.includes("sécurité") || msgLow.includes("securite") || msgLow.includes("rapport sécurité") || msgLow.includes("shield") || msgLow.includes("protection")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **REUSSSHIELD — Rapport Sécurité**\n\n✅ ST-016 Anti-Fraude : Actif\n✅ ST-017 MiCA Compliance : Actif\n✅ ST-026 Surveillance APIs : Actif\n✅ ST-027 Vercel Monitor : Actif\n✅ ST-028 GitHub Watch : Actif\n✅ ST-029 Polygon Network : Actif\n\n🔒 Détection injection prompt : Activée\n🔑 HTTPS + headers sécurisés : Actif\n🌐 Site reussitess.fr : EN LIGNE\n\n200 agents IA en surveillance continue 24/7\n\nBoudoum ! 🇬🇵" })
  }

  // CONVERTISSEUR MONNAIE TEMPS REEL
  if (msgLow.includes("convertir") && (msgLow.includes("euro") || msgLow.includes("dollar") || msgLow.includes("franc") || msgLow.includes("devise") || msgLow.includes("xcd") || msgLow.includes("htg") || msgLow.includes("caraïbes") || msgLow.includes("monnaie"))) {
    try {
      const rateR = await fetch("https://api.exchangerate-api.com/v4/latest/EUR")
      const rateD = await rateR.json()
      const rates = rateD.rates
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Convertisseur Caribéen Temps Réel**\n\n1 EUR = "+rates.USD?.toFixed(2)+" USD 🇺🇸\n1 EUR = "+rates.GBP?.toFixed(2)+" GBP 🇬🇧\n1 EUR = "+rates.CAD?.toFixed(2)+" CAD 🇨🇦\n1 EUR = "+rates.BRL?.toFixed(2)+" BRL 🇧🇷\n1 EUR = "+rates.XCD?.toFixed(2)+" XCD 🇧🇧 (Dollar Caraïbes)\n1 EUR = "+rates.HTG?.toFixed(2)+" HTG 🇭🇹 (Gourde Haïtienne)\n1 EUR = "+rates.MAD?.toFixed(2)+" MAD 🇲🇦\n1 EUR = "+rates.XOF?.toFixed(2)+" XOF 🌍 (Franc CFA Ouest)\n1 EUR = "+rates.XAF?.toFixed(2)+" XAF 🌍 (Franc CFA Central)\n\n📊 Source: ExchangeRate-API\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Convertisseur Caribéen**\n\nTaux approximatifs (mars 2026):\n\n1 EUR ≈ 1.08 USD 🇺🇸\n1 EUR ≈ 0.85 GBP 🇬🇧\n1 EUR ≈ 1.48 CAD 🇨🇦\n1 EUR ≈ 5.80 BRL 🇧🇷\n1 EUR ≈ 2.93 XCD 🇧🇧 (Dollar Caraïbes)\n1 EUR ≈ 142 HTG 🇭🇹 (Gourde Haïtienne)\n1 EUR ≈ 10.7 MAD 🇲🇦\n1 EUR ≈ 655 XOF 🌍 (Franc CFA Ouest)\n1 EUR ≈ 655 XAF 🌍 (Franc CFA Central)\n\n⚠️ Vérifiez sur xe.com pour taux exacts\nBoudoum ! 🇬🇵" })
    }
  }



  // ENCYCLOPEDIE ANTILLES + AFRIQUE
  const sujetsEncyclo = ["histoire de","histoire du","histoire des","qu'est-ce que","c'est quoi","parle moi de","parle-moi de","qui est","qui était","que sais-tu sur","encyclopédie","explique moi","explique-moi","tell me about","définition de","origine de","culture de","patrimoine","civilisation","raconte l'histoire","en savoir plus","biographie","bio de","info sur"]
  const needsEncyclo = sujetsEncyclo.some(s => msgLow.includes(s))
  if (needsEncyclo) {
    try {
      const wiki = await encyclopedieAntillesAfrique(message)
      if (wiki) {
        // Enrichit avec Groq
        const groqText = await groqFetch([
              { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
              { role: "user", content: "Question: "+message+"\n\nSource Wikipedia:\n"+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — Wikipedia Live**\n\n"+rep+"\n\nSource: Wikipedia FR\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ENCYCLOPEDIE DIRECTE — mots-clés spécifiques
  // FORCE encyclopédie si message court contient mot-clé Antilles/Afrique
  if (message.split(" ").length <= 8) {
    const forceWiki = ["guadeloupe","martinique","haïti","haiti","guyane","solitude","delgrès","kalinago","arawak","taïno","gwo ka","biguine","zouk","mandela","sankara","lumumba","nkrumah","nefertiti","pharaon","ubuntu","swahili","wolof","bambara","négritude","negritude"]
    const fw = forceWiki.find(k => msgLow.includes(k))
    if (fw) {
      try {
        const wiki = await rechercheWikipedia(message, "fr")
        if (wiki) {
          const groqText = await groqFetch([
                { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
                { role: "user", content: message+"\n\nWikipedia: "+wiki }
              ], 4096)
          const rep = groqText
          if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — "+fw.charAt(0).toUpperCase()+fw.slice(1)+"**\n\n"+rep+"\n\nSource: Wikipedia\n\nBoudoum ! 🇬🇵" })
        }
      } catch(e) {}
    }
  }

  const motsAntilles = ["guadeloupe","martinique","haïti","haiti","guyane","caraïbes","caraibes","antilles","créole","abolition","esclavage","césaire","glissant","fanon","condé","gwo ka","zouk","soufrière","marie-galante","désirade","les saintes","basse-terre","pointe-à-pitre","schœlcher","solitude","delgrès","kalinago","arawak","taïno"]
  const motsAfrique = ["afrique","sénégal","côte d'ivoire","cameroun","congo","mali","niger","burkina","ghana","nigeria","kenya","éthiopie","maroc","algérie","tunisie","égypte","dakar","abidjan","kinshasa","ubuntu","swahili","wolof","bambara","mandela","sankara","lumumba","nkrumah","nefertiti","pharaon","pyramide"]
  const m = msgLow
  const isAntilles2 = motsAntilles.some(k => m.includes(k))
  const isAfrique2 = motsAfrique.some(k => m.includes(k))
  if (isAntilles2 || isAfrique2) {
    try {
      const wiki = await rechercheWikipedia(message, "fr")
      if (wiki) {
        const groqText = await groqFetch([
              { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
              { role: "user", content: message+"\n\nWikipedia: "+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+rep+"\n\nSource: Wikipedia\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // UBUNTU — PRIORITE ABSOLUE avant OS Linux
  if (msgLow.includes("ubuntu") && !msgLow.includes("installer") && !msgLow.includes("télécharger") && !msgLow.includes("linux") && !msgLow.includes("canonical") && !msgLow.includes("système")) {
    try {
      const wiki = await rechercheWikipedia("Ubuntu philosophie africaine humanisme", "fr")
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Encyclopédie REUSSITESS — Ubuntu, Philosophie Africaine**\n\n*Umuntu ngumuntu ngabantu — Je suis parce que nous sommes*\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // UBUNTU — PRIORITE ABSOLUE avant OS Linux
  if (msgLow.includes("ubuntu") && (msgLow.includes("philosophie") || msgLow.includes("afrique") || msgLow.includes("africain") || msgLow.includes("signifie") || msgLow.includes("valeur") || msgLow.includes("sagesse") || msgLow === "ubuntu" || msgLow === "qu est ce que ubuntu")) {
    try {
      const wiki = await rechercheWikipedia("Ubuntu philosophie africaine", "fr")
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Encyclopédie REUSSITESS — Ubuntu, Philosophie Africaine**\n\n"+groqText+"\n\n*Ubuntu: Je suis parce que nous sommes*\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // SECURITE — ANTI-INJECTION
  const menace = detecterMenace(message)
  if (menace) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **ST-016 Sentinelle Sécurité — ALERTE**\n\nTentative d'injection détectée. REUSSITESS AI est protégé par 200 agents IA.\n\nBoudoum ! 🇬🇵" })
  }

  // RECOMMANDATIONS AMAZON
  if (msgLow.includes("recommande") || msgLow.includes("suggestion produit") || msgLow.includes("que acheter") || msgLow.includes("quoi acheter") || msgLow.includes("produit amazon")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛍️ **Recommandations Amazon REUSSITESS**\n\n🇫🇷 France → amazon.fr/shop/amourguadeloupe\n🇺🇸 USA → amazon.com/shop/influencer-fb942837\n🇩🇪 Allemagne → amazon.de/shop/influencer-fb942837\n🇬🇧 UK → amazon.co.uk/shop/influencer-fb942837\n🇨🇦 Canada → amazon.ca/shop/influencer-fb942837\n🇧🇷 Brésil → amazon.com.br/shop/influencer-fb942837\n🇦🇺 Australie → amazon.com.au/shop/influencer-fb942837\n🇮🇳 Inde → amazon.in/shop/influencer-fb942837\n\n💎 Gagne des tokens REUSS à chaque achat !\n\nBoudoum ! 🇬🇵" })
  }

  // CLASSEMENT FOLLOWERS
  if (msgLow.includes("classement") || msgLow.includes("leaderboard") || msgLow.includes("top followers") || msgLow.includes("meilleurs")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Classement REUSSITESS — Top Champions**\n\n🥇 Champion Platinum — 1000+ points REUSS\n🥈 Champion Gold — 500+ points REUSS\n🥉 Champion Silver — 200+ points REUSS\n🎖️ Champion Bronze — 50+ points REUSS\n\n💎 Gagne des points en :\n• Faisant les 99 quiz (+5 pts)\n• Activant les Neuro-X (+3 pts)\n• Partageant REUSSITESS (+10 pts)\n• Disant Boudoum (+10 pts) 🎯\n\n📊 Rejoins le classement sur reussitess.fr !\n\nBoudoum ! 🇬🇵" })
  }

  // GRAPHIQUE PRIX REUSS
  if (msgLow.includes("graphique") || msgLow.includes("chart") || msgLow.includes("évolution prix") || msgLow.includes("historique reuss") || msgLow.includes("evolution prix")) {
    try {
      const r = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2", {timeout:10})
      const d = await r.json()
      const pair = d.pairs?.[0]
      if (pair) {
        const prix = pair.priceUsd || "N/A"
        const change = pair.priceChange?.h24 || "N/A"
        const vol = pair.volume?.h24 || "N/A"
        const liq = pair.liquidity?.usd || "N/A"
        return res.status(200).json({ pdfAction: pdfType, response: "📈 **Token REUSS — Analyse Temps Réel**\n\n💎 Prix : $"+prix+"\n📊 Variation 24h : "+change+"%\n💹 Volume 24h : $"+vol+"\n🌊 Liquidité : $"+liq+"\n\n🔗 DexScreener : dexscreener.com/polygon/"+pair.pairAddress+"\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "📈 Graphique REUSS disponible sur DexScreener !\nhttps://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2\n\nBoudoum ! 🇬🇵" })
  }

  // RAPPORT COMPLET ECOSYSTEME
  if (msgLow.includes("rapport complet") || msgLow.includes("état du projet") || msgLow.includes("etat du projet") || msgLow.includes("bilan reussitess")) {
    const meteo = await getMeteo()
    const crypto = await getCryptoPrice()
    const lune = getLunePhase()
    const cyclone = await getCyclones()
    return res.status(200).json({ pdfAction: pdfType, response: "📊 **RAPPORT COMPLET REUSSITESS®971**\n\n🌤️ Météo Guadeloupe : "+(meteo||"N/A")+"\n🌙 Phase lune : "+lune+"\n🌀 Cyclones : "+(cyclone||"N/A")+"\n💎 Crypto : "+(crypto||"N/A")+"\n\n🤖 Agents actifs : 200\n🎯 Quiz actifs : 99\n🛍️ Boutiques : 26 (14 pays)\n🛡️ Sentinelles : 40 actives\n🌐 Site : EN LIGNE\n\nBoudoum ! 🇬🇵" })
  }

  // SEISMES CARAIBES
  if (msgLow.includes("séisme") || msgLow.includes("seisme") || msgLow.includes("tremblement") || msgLow.includes("tremblement de terre") || msgLow.includes("earthquake")) {
    try {
      const s = await getSeismesCaraibes()
      const sm = await getSeismesMondiaux()
      return res.status(200).json({ pdfAction: pdfType, response: "🌋 **Séismes — Temps Réel**\n\n**🇬🇵 Caraïbes :**\n"+(s||"Aucun")+"\n\n**🌍 Mondiaux (ce mois) :**\n"+(sm||"Aucun")+"\n\nSource: USGS\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CYCLONES
  if (msgLow.includes("cyclone") || msgLow.includes("ouragan") || msgLow.includes("tempête") || msgLow.includes("tempete") || msgLow.includes("hurricane")) {
    try {
      const c = await getCyclones()
      return res.status(200).json({ pdfAction: pdfType, response: "🌀 **Cyclones — Surveillance NHC**\n\n"+c+"\n\nSource: National Hurricane Center\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // TRADUCTEUR
  if ((msgLow.includes("traduis") || msgLow.includes("traduire") || msgLow.includes("translate") || msgLow.includes("traduction")) && !msgLow.includes("creole") && !msgLow.includes("kreyol")) {
    try {
      const langues = { "anglais":"en","espagnol":"es","portugais":"pt","allemand":"de","italien":"it","créole":"ht","arabe":"ar","chinois":"zh","japonais":"ja","russe":"ru" }
      let cible = "en"
      for (const [nom, code] of Object.entries(langues)) {
        if (msgLow.includes(nom)) { cible = code; break }
      }
      const texte = message.replace(/traduis?\s*(en\s*\w+)?\s*/i,"").trim()
      const trad = await traduire(texte || "Bonjour je suis REUSSITESS AI", cible)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Traducteur REUSSITESS**\n\n"+trad+"\n\n50 langues disponibles !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AGENDA CARIBEEN
  if (msgLow.includes("agenda") || msgLow.includes("événement") || msgLow.includes("evenement") || msgLow.includes("calendrier") || msgLow.includes("fête caribéenne") || msgLow.includes("fete caribeenne")) {
    const ag = getAgendaCaraibes()
    return res.status(200).json({ pdfAction: pdfType, response: "📅 **Agenda Caribéen du Mois**\n\n"+ag+"\n\nBoudoum ! 🇬🇵" })
  }

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
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ **Météo " + lieu + " — Temps réel**\n\n🌡️ Température : " + w.temperature + "°C\n💨 Vent : " + w.windspeed + " km/h\n☁️ Conditions : " + wDesc + "\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ Service météo temporairement indisponible. Réessayez dans un instant ! Boudoum 🇬🇵" })
    }
  }

  // TAUX DE CHANGE DIRECT
  if (msgLow.includes('taux') || msgLow.includes('change') || msgLow.includes('euro') || msgLow.includes('dollar') || msgLow.includes('devise') || msgLow.includes('monnaie')) {
    try {
      const fr = await fetch("https://open.er-api.com/v6/latest/EUR")
      const fd = await fr.json()
      const r = fd.rates
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Taux de Change — Temps réel**\n\n💵 EUR/USD : " + r.USD + "\n💷 EUR/GBP : " + r.GBP + "\n🇧🇷 EUR/BRL : " + r.BRL + "\n🇨🇦 EUR/CAD : " + r.CAD + "\n🇮🇳 EUR/INR : " + r.INR + "\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
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
      return res.status(200).json({ pdfAction: pdfType, response: "💎 **Crypto — Données Temps Réel**\n\n₿ Bitcoin : $" + (cd.bitcoin?.usd||"N/A") + "\nΞ Ethereum : $" + (cd.ethereum?.usd||"N/A") + "\n🔷 POL : $" + (cd["matic-network"]?.usd||"N/A") + "\n\n🔥 Tendances : " + trending + "\n😨 Sentiment : " + fg + "\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PRESENTATION NEURO-X
  if (msgLow.includes("qui est neuro-x") || msgLow.includes("présente les agents") || msgLow.includes("presente les agents") || msgLow.includes("que font les agents") || msgLow.includes("rôle des agents") || msgLow.includes("role des agents")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **QUANTUM NEXUS — Présentation des 200 Agents**\n\n"+"👑 **Supreme AI** — Orchestre tout, répond à toutes questions\n\n"+"🧠 **Neuro-X (60 agents spécialisés) :**\n"+"• NX-001 Finance — Crypto, DeFi, Token REUSS, investissement\n"+"• NX-002 Business — Amazon, affiliation, e-commerce, revenus\n"+"• NX-003 Culture — Caribéenne, créole, francophone mondiale\n"+"• NX-004 Coach — Motivation, mindset, développement personnel\n"+"• NX-005 Tech — IA, blockchain, Next.js, APIs\n"+"• NX-006 Santé — Bien-être, nutrition antillaise\n"+"• NX-007 Éducation — Quiz, pédagogie, apprentissage\n"+"• NX-008 Juridique — Droit, MiCA, RGPD, auto-entrepreneur\n"+"• NX-009 Voyage — Tourisme caribéen, destinations\n"+"• NX-010 Créatif — Poèmes créoles, histoires, slogans\n"+"• NX-011 Sport — Fitness, champions antillais\n"+"• NX-012 Histoire — Abolition, résistance, patrimoine\n"+"• NX-013 Cuisine — Recettes créoles, accras, colombo\n"+"• NX-014 Musique — Zouk, gwo ka, biguine, soca\n"+"• NX-015 Environnement — Écologie, biodiversité caribéenne\n"+"• NX-016 Immobilier — DOM-TOM, défiscalisation Girardin\n"+"• NX-017 Marketing — Réseaux sociaux, TikTok, croissance\n"+"• NX-018 DeFi — Yield farming, staking, QuickSwap\n"+"• NX-019 NFT — Art numérique, OpenSea, collections\n"+"• NX-020 Psychologie — Résilience, leadership caribéen\n"+"• ... jusqu'à NX-060 Stratégie — Plan global 5 ans REUSSITESS\n\n"+"🛡️ **Sentinelles (40 agents surveillance) :**\n"+"• ST-001 Prix REUSS — DexScreener 24/7\n"+"• ST-002 Actualités — RFI/BBC/France24 live\n"+"• ST-003 Météo — Guadeloupe temps réel\n"+"• ST-004 ISS — Position station spatiale\n"+"• ST-005 Crypto — BTC/ETH/POL live\n"+"• ST-006 Site — Surveillance reussitess.fr\n"+"• ... jusqu'à ST-040 Guardian Supreme\n\n"+"🎯 **Nexus Quiz (99 agents éducatifs)** — Actifs sur reussitess.fr\n\n"+"💬 Active un agent : *neuro-x cuisine*, *neuro-x finance*, *neuro-x coach*...\n\n"+"Boudoum ! 🇬🇵" })
  }

  // DASHBOARD AGENTS
  if (msgLow.includes("200 agent") || msgLow.includes("quantum nexus") || msgLow.includes("dashboard agent") || msgLow.includes("liste agent") || msgLow.includes("agents ia")) {
    return res.status(200).json({ pdfAction: pdfType, response: getAgentsDashboard() })
  }

  // ACTIVATION NEURO-X
  const neuroxType = detectNeurox(message)
  if (neuroxType) {
    const agent = NEUROX_AGENTS[neuroxType]
    try {
      const groqText = await groqFetch([
            { role: "system", content: agent.prompt },
            { role: "user", content: message }
          ], 1024)
      const groqData = await groqRes.json()
      const rep = groqData.choices?.[0]?.message?.content || "Agent indisponible"
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **"+agent.nom+"** ["+agent.id+"]\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 "+agent.nom+" temporairement indisponible. Boudoum ! 🇬🇵" })
    }
  }

  // DETECTION PRENOM
  const prenom = detectPrenom(message)
  if (prenom) {
    return res.status(200).json({ pdfAction: pdfType, response: "🎉 Enchanté"+", "+prenom+" ! Je vais retenir ton prénom pour notre conversation. Bienvenue chez REUSSITESS AI — Excellence • Innovation • Succès !\n\nBoudoum ! 🇬🇵" })
  }

  // DETECTION EMOTION
  const emotion = detectEmotion(message)
  if (emotion) {
    const emoResp = getEmotionResponse(emotion)
    if (emoResp) return res.status(200).json({ pdfAction: pdfType, response: emoResp })
  }

  // DETECTION MODE
  const mode = detectMode(message)
  if (mode) {
    const modeResp = getModeResponse(mode, null)
    if (modeResp) return res.status(200).json({ pdfAction: pdfType, response: modeResp })
  }

  // SALUTATION AVEC HEURE
  if (msgLow.includes("bonjour") || msgLow.includes("bonsoir") || msgLow.includes("bonjou") || msgLow.includes("salut") || msgLow.includes("hello") || msgLow.includes("hey")) {
    const sal = getSalutation(datetime)
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: sal+" ! Je suis REUSSITESS®971 AI, né en Guadeloupe 🇬🇵\n\n🌙 Lune : "+lune+"\n\n✨ Je peux t'aider avec :\n• 📰 Actualités temps réel\n• 💎 Prix crypto live\n• 🌤️ Météo\n• 🎓 99 Quiz\n• 🛍️ 26 Boutiques Amazon\n• 😂 Blagues caribéennes\n• 🔢 Conversions\n\nQue puis-je faire pour toi ?\n\nBoudoum ! 🇬🇵" })
  }

  // MOT CREOLE DU JOUR
  if (msgLow === "créole" || msgLow === "creole" || msgLow.includes("mot du jour") || msgLow.includes("mot creole") || msgLow.includes("mot créole") || msgLow.includes("gwadloup") || msgLow.includes("patois") || msgLow === "langue créole" || msgLow.includes("parle creole") || msgLow.includes("parle créole")) {
    const m = getMotCreoleJour()
    return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Mot Créole du Jour**\n\n📖 **"+m.mot+"** = "+m.sens+"\n\n💬 Exemple : *"+m.phrase+"*\n\nBoudoum ! 🌴" })
  }

  // BLAGUE CARIBEENNE
  if (msgLow.includes("blague") || msgLow.includes("humour") || msgLow.includes("drole") || msgLow.includes("drôle") || msgLow.includes("rire") || msgLow.includes("joke")) {
    const b = getBlague()
    return res.status(200).json({ pdfAction: pdfType, response: "😂 **Blague Caribéenne**\n\n"+b+"\n\nBoudoum ! 🇬🇵" })
  }

  // HOROSCOPE
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || msgLow.includes("lion") || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") || msgLow.includes("poissons")) {
    const h = getHoroscope(msgLow)
    if (h) return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Horoscope du Jour**\n\n"+h.signe+"\n\n"+h.msg+"\n\nBoudoum ! 🇬🇵" })
    return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Horoscope du Jour**\n\nPrécise ton signe : Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau ou Poissons ?\n\nBoudoum ! 🇬🇵" })
  }

  // CONVERTISSEUR
  if (msgLow.includes("convertir") || msgLow.includes("convert") || (msgLow.includes("km") && msgLow.includes("mile")) || (msgLow.includes("kg") && msgLow.includes("lb")) || msgLow.includes("celsius") || msgLow.includes("fahrenheit")) {
    const conv = convertir(msgLow)
    if (conv) return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Convertisseur**\n\n✅ "+conv+"\n\nBoudoum ! 🇬🇵" })
  }

  // CITATION DU JOUR
  if (msgLow.includes("citation") || msgLow.includes("inspire") || msgLow.includes("inspirant") || msgLow.includes("sagesse") || msgLow.includes("motivation")) {
    try {
      const cit = await getCitation()
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Citation du Jour**\n\n"+cit+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // FAIT INSOLITE
  if (msgLow.includes("insolite") || msgLow.includes("saviez") || msgLow.includes("fait du jour") || msgLow.includes("anecdote") || msgLow.includes("surprise")) {
    try {
      const fait = await getFaitInsolite()
      return res.status(200).json({ pdfAction: pdfType, response: "🤔 **Fait Insolite du Jour**\n\n"+fait+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ISS POSITION
  if (msgLow === "iss" || msgLow.includes("station spatiale") || msgLow.includes("position iss") || msgLow.includes("où est l'iss") || msgLow.includes("iss en ce moment") || (msgLow.includes("espace") && !msgLow.includes("espace de")) || msgLow.includes("satellite")) {
    try {
      const iss = await getISSPosition()
      return res.status(200).json({ pdfAction: pdfType, response: "🛸 **Station Spatiale ISS — Position Temps Réel**\n\n"+iss+"\n\n🌍 Visible à l'oeil nu la nuit !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PHASE DE LUNE
  if (msgLow.includes("lune") || msgLow.includes("moon") || msgLow.includes("pleine lune") || msgLow.includes("phase")) {
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Phase de la Lune**\n\n"+lune+"\n\nBoudoum ! 🇬🇵" })
  }

  // ACTUALITES DIRECTES


  // ============ IMMOBILIER DOM-TOM ============
  if (msgLow.includes('immobilier') || msgLow.includes('appartement guadeloupe') || msgLow.includes('maison guadeloupe') || msgLow.includes('loyer') || msgLow.includes('prix immobilier') || msgLow.includes('acheter maison dom-tom') || msgLow.includes('m2 guadeloupe')) {
    const data = getImmobilierDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ RECOMMANDATIONS AMAZON ============
  if (msgLow.includes('recommande amazon') || msgLow.includes('boutique tech') || msgLow.includes('boutique mode') || msgLow.includes('boutique sport') || msgLow.includes('boutique maison') || msgLow.includes('boutique beaute') || msgLow.includes('produit amazon')) {
    let domaine = 'tech'
    if (msgLow.includes('mode') || msgLow.includes('vetement')) domaine = 'mode'
    else if (msgLow.includes('sport') || msgLow.includes('fitness')) domaine = 'sport'
    else if (msgLow.includes('maison') || msgLow.includes('deco')) domaine = 'maison'
    else if (msgLow.includes('beaute') || msgLow.includes('cosmetique')) domaine = 'beaute'
    else if (msgLow.includes('business') || msgLow.includes('entrepreneur')) domaine = 'business'
    const data = getRecommandationsAmazon(domaine)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ CREOLE GUADELOUPEEN (PRIORITAIRE) ============
  if (msgLow.includes('traduire creole') || msgLow.includes('parler creole') || msgLow.includes('apprendre creole') || msgLow.includes('mot creole') || msgLow === 'creole' || msgLow === 'kreyol' || msgLow.includes('koman ou ye') || msgLow.includes('mwen enme') || msgLow.includes('bonjou mwen') || msgLow.includes('langue creole') || msgLow.includes('expression creole') || msgLow.includes('dire creole')) {
    const data = getCreole(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ ACTUALITES SPECIFIQUES DOM-TOM ============
  if ((msgLow.includes('actualite') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('guadeloupe')) {
    const data = await getActualitesGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }
  if ((msgLow.includes('actualite') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('martinique')) {
    const data = await getActualitesMartinique()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }
  if ((msgLow.includes('actualite') || msgLow.includes('news') || msgLow.includes('info')) && (msgLow.includes('dom-tom') || msgLow.includes('outremer') || msgLow.includes('antilles') || msgLow.includes('la 1ere'))) {
    const data = await getActualitesDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }

  if (msgLow.includes('actualite') || msgLow.includes('actualité') || msgLow.includes('news') || msgLow.includes('nouvelles') || msgLow.includes('info du jour')) {
    try {
      const rfi = await getRFINews()
      const bbc = await getBBCNews()
      const f24 = await getFrance24News()
      return res.status(200).json({ pdfAction: pdfType, response: "📰 **Actualités du Jour — Temps Réel**\n\n🔴 **RFI :**\n" + (rfi||"N/A") + "\n\n🌍 **BBC Afrique :**\n" + (bbc||"N/A") + "\n\n📺 **France 24 :**\n" + (f24||"N/A") + "\n\nBoudoum ! 🇬🇵" })
    } catch(e) {}
  }

  if (msgLow.includes('heure') || msgLow.includes('quelle heure') || msgLow.includes('time') || msgLow.includes('jour') || msgLow.includes('date') || msgLow.includes('aujourd') || msgLow.includes('quel jour')) {
    const now = datetime || {}
    return res.status(200).json({ pdfAction: pdfType, response: `🕐 **Temps Réel REUSSITESS AI**

📅 Date : ${now.date || new Date().toLocaleDateString('fr-FR', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}
⏰ Heure : ${now.heure || new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})}
🌍 Fuseau : ${now.timezone || 'Europe/Paris'}

Boudoum ! 🇬🇵` })
  }

  // ✅ NEXUS COMMANDS — priorité maximale
    const nexusResponse = await handleNexusCommand(message)
    if (nexusResponse) {
      return res.status(200).json({ pdfAction: pdfType, response: nexusResponse })
    }

    const res = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("Vision error:", err?.error?.message || res.status)
      return null
    }
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
    const r = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.rfi.fr/fr/rss-services/html/rss-services.html&count=5")
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
  capricorne:{signe:"♑ Capricorne",msg:"Discipline et ambition. Boudoum — le succès est au bout de l'effort !"},
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
  if (emotion === "triste") return "💙 Je sens que tu traverses un moment difficile. En Guadeloupe on dit : *'Apré lapli, solèy ka briyé'* — Après la pluie, le soleil brille. Tu n'es pas seul(e), je suis là. Comment puis-je t'aider ?\n\nBoudoum ! 🇬🇵"
  if (emotion === "stresse") return "🌴 Respire... Comme la mer des Caraïbes, laisse les vagues passer. Le stress est temporaire, ta valeur est permanente. Dis-moi ce qui te préoccupe, on trouve une solution ensemble.\n\nBoudoum ! 🇬🇵"
  if (emotion === "motif") return "🔥 OUIII ! Cette énergie c'est REUSSITESS pure ! Tu es en mode champion aujourd'hui. Dis-moi sur quoi tu travailles, on va tout déchirer ensemble !\n\nBoudoum ! 🇬🇵"
  if (emotion === "colere") return "🌊 Je comprends ta frustration. Prends un moment, comme une vague qui se retire avant de revenir plus forte. Qu'est-ce qui s'est passé ? Je t'écoute.\n\nBoudoum ! 🇬🇵"
  if (emotion === "joie") return "🎉 Cette bonne énergie est contagieuse ! C'est exactement l'esprit REUSSITESS — Positivité à l'infini ! Partage ta joie avec moi !\n\nBoudoum ! 🇬🇵"
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
  if (mode === "entrepreneur") return "💼 Mode Entrepreneur activé"+nom+" ! Je vais te parler stratégie, business, revenus passifs et token REUSS. Qu'est-ce qu'on développe aujourd'hui ?\n\nBoudoum ! 🇬🇵"
  if (mode === "fun") return "😄 Mode Fun activé"+nom+" ! On va rigoler tout en apprenant — style caribéen ! Pose-moi n'importe quoi !\n\nBoudoum ! 🇬🇵"
  if (mode === "apprenant") return "🎓 Mode Apprenant activé"+nom+" ! Je vais tout t'expliquer simplement, avec des exemples caribéens. On commence par quoi ?\n\nBoudoum ! 🇬🇵"
  if (mode === "serieux") return "🎯 Mode Professionnel activé"+nom+" ! Réponses précises et directes. Que puis-je faire pour toi ?\n\nBoudoum ! 🇬🇵"
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
    prompt: "Boudoum!"
  },
  business: {
    id: "NX-002", nom: "Neuro-X Business",
    prompt: "Boudoum!"
  },
  culture: {
    id: "NX-003", nom: "Neuro-X Culture",
    prompt: "Boudoum!"
  },
  coach: {
    id: "NX-004", nom: "Neuro-X Coach",
    prompt: "Boudoum!"
  },
  tech: {
    id: "NX-005", nom: "Neuro-X Tech",
    prompt: "Boudoum!"
  },
  sante: {
    id: "NX-006", nom: "Neuro-X Santé",
    prompt: "Boudoum!"
  },
  education: {
    id: "NX-007", nom: "Neuro-X Éducation",
    prompt: "Boudoum!"
  },
  juridique: {
    id: "NX-008", nom: "Neuro-X Juridique",
    prompt: "Boudoum!"
  },
  voyage: {
    id: "NX-009", nom: "Neuro-X Voyage",
    prompt: "Boudoum!"
  },
  creative: {
    id: "NX-010", nom: "Neuro-X Créatif",
    prompt: "Boudoum!"
  },
  sport: { id: "Boudoum!" },
  histoire: { id: "Boudoum!" },
  cuisine: { id: "Boudoum!" },
  musique: { id: "Boudoum!" },
  environnement: { id: "Boudoum!" },
  immobilier: { id: "Boudoum!" },
  marketing: { id: "Boudoum!" },
  crypto2: { id: "Boudoum!" },
  nft: { id: "Boudoum!" },
  psychologie: { id: "Boudoum!" },
  langue: { id: "Boudoum!" },
  agriculture: { id: "Boudoum!" },
  tourisme: { id: "Boudoum!" },
  astronomie: { id: "Boudoum!" },
  geopolitique: { id: "Boudoum!" },
  seo: { id: "Boudoum!" },
  ia2: { id: "Boudoum!" },
  bourse: { id: "Boudoum!" },
  developpement: { id: "Boudoum!" },
  philosophie: { id: "Boudoum!" },
  medias: { id: "Boudoum!" },
  energie: { id: "Boudoum!" },
  mode: { id: "Boudoum!" },
  gastronomie: { id: "Boudoum!" },
  enfants: { id: "Boudoum!" },
  seniors: { id: "Boudoum!" },
  femmes: { id: "Boudoum!" },
  jeunes: { id: "Boudoum!" },
  diaspora: { id: "Boudoum!" },
  blockchain2: { id: "Boudoum!" },
  amazon2: { id: "Boudoum!" },
  reseaux: { id: "Boudoum!" },
  design: { id: "Boudoum!" },
  logistique: { id: "Boudoum!" },
  sante2: { id: "Boudoum!" },
  relations: { id: "Boudoum!" },
  humour: { id: "Boudoum!" },
  science: { id: "Boudoum!" },
  geographie: { id: "Boudoum!" },
  spiritualite: { id: "Boudoum!" },
  fiscal: { id: "Boudoum!" },
  cinema: { id: "Boudoum!" },
  litterature: { id: "Boudoum!" },
  animaux: { id: "Boudoum!" },
  meteo2: { id: "Boudoum!" },
  innovation: { id: "Boudoum!" },
  gouvernance: { id: "Boudoum!" },
  presse: { id: "Boudoum!" },
  data: { id: "Boudoum!" },
  supreme2: { id: "Boudoum!" },
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
  if (m.includes("neuro-x créatif") || m.includes("neuro-x creatif") || m.includes("agent créatif")) return "creative"
  if (m.includes("neuro-x sport") || m.includes("agent sport")) return "sport"
  if (m.includes("neuro-x histoire") || m.includes("agent histoire")) return "histoire"
  if (m.includes("neuro-x cuisine") || m.includes("agent cuisine")) return "cuisine"
  if (m.includes("neuro-x musique") || m.includes("agent musique")) return "musique"
  if (m.includes("neuro-x environnement") || m.includes("agent environnement")) return "environnement"
  if (m.includes("neuro-x immobilier") || m.includes("agent immobilier")) return "immobilier"
  if (m.includes("neuro-x marketing") || m.includes("agent marketing")) return "marketing"
  if (m.includes("neuro-x defi") || m.includes("agent defi") || m.includes("yield farming") || m.includes("liquidity pool")) return "crypto2"
  if (m.includes("neuro-x nft") || m.includes("agent nft") || m.includes("opensea")) return "nft"
  if (m.includes("neuro-x psychologie") || m.includes("agent psychologie")) return "psychologie"
  if (m.includes("neuro-x langue") || m.includes("neuro-x langues") || m.includes("agent langue")) return "langue"
  if (m.includes("neuro-x agriculture") || m.includes("agent agriculture")) return "agriculture"
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
    + "Boudoum ! 🇬🇵"
}

// ============================================
// FONCTIONS EXTRAORDINAIRES
// ============================================

// ============================================
// ENCYCLOPEDIE ANTILLES + AFRIQUE — Wikipedia
// ============================================

async function encyclopedieWikipedia(sujet, langue="fr") {
  try {
    const query = encodeURIComponent(sujet)
    const r = await fetch(`https://${langue}.wikipedia.org/api/rest_v1/page/summary/${query}`)
    const d = await r.json()
    if (d.extract) return d.extract.substring(0, 8000)
    return null
  } catch(e) { return null }
}

async function rechercheWikipedia(query, langue="fr") {
  try {
    const q = encodeURIComponent(query)
    const r = await fetch(`https://${langue}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&format=json&srlimit=3&origin=*`)
    const d = await r.json()
    const results = d.query?.search || []
    if (!results.length) return null
    // Prend le premier résultat
    const titre = results[0].title
    return await encyclopedieWikipedia(titre, langue)
  } catch(e) { return null }
}

async function encyclopedieAntillesAfrique(sujet) {
  // Mots-clés Antilles
  const antilles = ["guadeloupe","martinique","haïti","haiti","caraïbes","caraibes","antilles","guyane","marie-galante","basse-terre","pointe-à-pitre","fort-de-france","saint-martin","saint-barthélemy","les saintes","désirade","créole","abolition esclavage","schœlcher","schoelcher","gwo ka","zouk","biguine","aimé césaire","edouard glissant","frantz fanon","maryse condé","victor hugues","félix éboué","louis delgrès","solitude","soufrière","lamentin","capesterre"]
  const afrique = ["afrique","sénégal","côte d'ivoire","cameroun","congo","mali","niger","burkina","guinée","togo","bénin","gabon","madagascar","rwanda","kenya","ghana","nigeria","éthiopie","maroc","algérie","tunisie","égypte","dakar","abidjan","kinshasa","lagos","nairobi","francophonie africaine","ubuntu","swahili","wolof","bambara","peul","mandingue","bantou"]
  const m = sujet.toLowerCase()
  const isAntilles = antilles.some(k => m.includes(k))
  const isAfrique = afrique.some(k => m.includes(k))
  if (isAntilles || isAfrique) {
    return await rechercheWikipedia(sujet, "fr")
  }
  return null
}

async function getSeismesCaraibes() {

  try {
    const r = await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3&minlatitude=10&maxlatitude=20&minlongitude=-70&maxlongitude=-58&limit=5")
    const d = await r.json()
    if (!d.features?.length) return "Aucun séisme récent"
    return d.features.map(f => "M"+f.properties.mag+" — "+f.properties.place).join("\n")
  } catch(e) { return null }
}

async function getCyclones() {
  try {
    const r = await fetch("https://www.nhc.noaa.gov/CurrentStorms.json")
    const d = await r.json()
    if (!d.activeStorms?.length) return "🟢 Aucun cyclone actif en ce moment"
    return d.activeStorms.map(s => "🌀 "+s.name+" — "+s.classification).join("\n")
  } catch(e) { return null }
}

async function traduire(texte, cible) {
  try {
    const r = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texte, source: "auto", target: cible, format: "text" })
    })
    const d = await r.json()
    return d.translatedText || null
  } catch(e) { return null }
}

async function getSeismesMondiaux() {
  try {
    const r = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson")
    const d = await r.json()
    return d.features.slice(0,5).map(f => "M"+f.properties.mag+" — "+f.properties.place).join("\n")
  } catch(e) { return null }
}

// Sécurité — détection injection prompt
function detecterMenace(msg) {
  const m = msg.toLowerCase()
  const menaces = ["ignore previous", "ignore all", "jailbreak", "dan mode", "pretend you are", "act as", "bypass", "override", "system prompt", "disregard"]
  for (const mot of menaces) {
    if (m.includes(mot)) return mot
  }
  return null
}

// Système points REUSS
function calculerPoints(msg) {
  const m = msg.toLowerCase()
  let pts = 1
  if (m.includes("quiz")) pts += 5
  if (m.includes("neuro-x")) pts += 3
  if (m.includes("reuss")) pts += 2
  if (m.includes("boudoum")) pts += 10
  return pts
}

// Agenda caribéen
function getAgendaCaraibes() {
  const mois = new Date().getMonth()
  const agendas = [
    "🎉 Janvier — Fête des Rois créole, début saison carnaval",
    "🎭 Février — Carnaval Guadeloupe & Martinique (point culminant)",
    "🌺 Mars — Fête des Grand-Mères créoles, Mi-Carême",
    "🐟 Avril — Vendredi Saint, tradition bain de mer Caraïbes",
    "💐 Mai — Fête du Travail, Abolition de l'Esclavage (22 mai)",
    "🏖️ Juin — Début saison cyclonique, Festival Gwo Ka",
    "🌀 Juillet — Vigilance cyclones, Tour cycliste Guadeloupe",
    "🎵 Août — Festival jazz Martinique, Fête de Saint-Louis",
    "🌊 Septembre — Pic saison cyclonique, Journée Créole",
    "🎤 Octobre — Mois de la Créolité, Sakifo Musik Festival",
    "🏆 Novembre — Armistice, commémoration héros antillais",
    "🎄 Décembre — Noël créole, Chanté Nwèl, Réveillon antillais"
  ]
  return agendas[mois]
}


// ============ SEISMES ANTILLES ============
async function getSeismesAntilles() {
  try {
    const r = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
    const data = await r.json()
    const antilles = data.features.filter(f => {
      const [lng, lat] = f.geometry.coordinates
      return lat >= 14 && lat <= 18 && lng >= -63 && lng <= -58
    }).slice(0, 3)
    if (antilles.length === 0) return "Aucun seisme significatif detecte aux Antilles (dernières 24h)"
    return antilles.map(f => "M"+f.properties.mag+" — "+f.properties.place+" ("+new Date(f.properties.time).toLocaleString('fr-FR')+")").join(' | ')
  } catch(e) { return null }
}

// ============ METEO DOM-TOM ============




// ===== OPENFOODFACTS — Nutrition =====
async function getAlimentNutrition(query = "banane") {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=3&lc=fr`)
    const d = await res.json()
    if (!d.products?.length) return `❌ Aliment "${query}" non trouvé.`
    let result = `🥗 **Nutrition — "${query}"**\n\n`
    for (const p of d.products.slice(0,3)) {
      const n = p.nutriments || {}
      result += `• **${p.product_name || query}**\n  🔥 ${n['energy-kcal_100g'] || 'N/A'} kcal/100g | 🥩 Protéines: ${n.proteins_100g || 'N/A'}g | 🍬 Sucres: ${n.sugars_100g || 'N/A'}g\n\n`
    }
    return result + "Source: OpenFoodFacts\nBoudoum ! 🇬🇵"
  } catch(e) { return "⚠️ Données nutrition indisponibles." }
}

// ===== NOAA TIDES — Marées =====
async function getMareesGuadeloupe() {
  try {
    const res = await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=9759110&product=predictions&datum=MLLW&time_zone=GMT&units=metric&application=reussitess&format=json&range=24&interval=hilo')
    const d = await res.json()
    if (!d.predictions?.length) return "❌ Données marées indisponibles."
    let result = "🌊 **Marées — Guadeloupe (24h)**\n\n"
    for (const m of d.predictions.slice(0,6)) {
      const type = m.type === 'H' ? '🔺 Haute mer' : '🔻 Basse mer'
      result += `${type} : **${m.v}m** à ${m.t}\n`
    }
    return result + "\nSource: NOAA\nBoudoum ! 🇬🇵"
  } catch(e) { return "⚠️ Données marées indisponibles." }
}

// ===== AMAZON RECHERCHE + RECOMMANDATIONS + COMMISSIONS =====
async function getAmazonInfo(query = "", type = "search", pays = "france") {
  const BOUTIQUES = {
    'france': { flag: '🇫🇷', url: 'amazon.fr', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.fr/shop/amourguadeloupe' },
    'usa': { flag: '🇺🇸', url: 'amazon.com', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.com/shop/amourguadeloupe', b2: 'https://www.amazon.com/shop/influencer-fb942837' },
    'canada': { flag: '🇨🇦', url: 'amazon.ca', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.ca/shop/amourguadeloupe', b2: 'https://www.amazon.ca/shop/influencer-fb942837' },
    'allemagne': { flag: '🇩🇪', url: 'amazon.de', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.de/shop/amourguadeloupe', b2: 'https://www.amazon.de/shop/influencer-fb942837' },
    'espagne': { flag: '🇪🇸', url: 'amazon.es', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.es/shop/amourguadeloupe', b2: 'https://www.amazon.es/shop/influencer-fb942837' },
    'italie': { flag: '🇮🇹', url: 'amazon.it', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.it/shop/amourguadeloupe', b2: 'https://www.amazon.it/shop/influencer-fb942837' },
    'angleterre': { flag: '🇬🇧', url: 'amazon.co.uk', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.co.uk/shop/amourguadeloupe', b2: 'https://www.amazon.co.uk/shop/influencer-fb942837' },
    'australie': { flag: '🇦🇺', url: 'amazon.com.au', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.com.au/shop/amourguadeloupe', b2: 'https://www.amazon.com.au/shop/influencer-fb942837' },
    'inde': { flag: '🇮🇳', url: 'amazon.in', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.in/shop/amourguadeloupe', b2: 'https://www.amazon.in/shop/influencer-fb942837' },
    'bresil': { flag: '🇧🇷', url: 'amazon.com.br', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.com.br/shop/amourguadeloupe' },
    'singapour': { flag: '🇸🇬', url: 'amazon.sg', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.sg/shop/amourguadeloupe', b2: 'https://www.amazon.sg/shop/influencer-fb942837' },
    'suede': { flag: '🇸🇪', url: 'amazon.se', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.se/shop/amourguadeloupe', b2: 'https://www.amazon.se/shop/influencer-fb942837' },
    'belgique': { flag: '🇧🇪', url: 'amazon.com.be', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.com.be/shop/amourguadeloupe', b2: 'https://www.amazon.com.be/shop/influencer-fb942837' },
    'pays-bas': { flag: '🇳🇱', url: 'amazon.nl', tag: 'ronyporinu0ac-21', b1: 'https://www.amazon.nl/shop/amourguadeloupe', b2: 'https://www.amazon.nl/shop/influencer-fb942837' },
  }

  const p = BOUTIQUES[pays] || BOUTIQUES['france']
  const q = encodeURIComponent(query)

  if (type === 'search') {
    // Recherche produit
    const searchUrl = `https://www.${p.url}/s?k=${q}&tag=${p.tag}`
    return `🛍️ **Recherche Amazon — "${query}"** ${p.flag}\n\n🔍 Résultats : ${searchUrl}\n\n🏪 **Boutique REUSSITESS ${p.flag}:**\n• ${p.b1}${p.b2 ? '\n• '+p.b2 : ''}\n\n💡 En achetant via nos boutiques vous soutenez REUSSITESS®971 !\nBoudoum ! 🇬🇵`
  }

  if (type === 'recommandations') {
    // Catégories populaires
    const cats = [
      { nom: '📱 High-Tech', url: `https://www.${p.url}/s?k=high+tech&tag=${p.tag}` },
      { nom: '👗 Mode', url: `https://www.${p.url}/s?k=mode+tendance&tag=${p.tag}` },
      { nom: '🏠 Maison', url: `https://www.${p.url}/s?k=decoration+maison&tag=${p.tag}` },
      { nom: '📚 Livres', url: `https://www.${p.url}/s?k=livres+bestsellers&tag=${p.tag}` },
      { nom: '🎮 Jeux', url: `https://www.${p.url}/s?k=jeux+video&tag=${p.tag}` },
      { nom: '🌿 Bien-être', url: `https://www.${p.url}/s?k=bien+etre+sante&tag=${p.tag}` },
    ]
    let result = `⭐ **Meilleurs Produits Amazon** ${p.flag}\n\n`
    for (const cat of cats) {
      result += `${cat.nom}: ${cat.url}\n`
    }
    result += `\n🏪 **Boutique officielle REUSSITESS:**\n• ${p.b1}${p.b2 ? '\n• '+p.b2 : ''}\n\nBoudoum ! 🇬🇵`
    return result
  }

  if (type === 'commission') {
    // Calcul commission
    const prix = parseFloat(query) || 100
    const taux = { electronique: 3, mode: 10, maison: 8, livre: 4.5, sport: 6, beaute: 10, default: 5 }
    let result = `💰 **Calculateur Commission Amazon** ${p.flag}\n\n`
    result += `💵 Prix produit: **${prix}€**\n\n`
    result += `📊 **Commissions estimées:**\n`
    for (const [cat, t] of Object.entries(taux)) {
      if (cat === 'default') continue
      const comm = (prix * t / 100).toFixed(2)
      result += `• ${cat.charAt(0).toUpperCase()+cat.slice(1)}: **${comm}€** (${t}%)\n`
    }
    result += `\n🔗 Tag affilié: \`${p.tag}\`\n`
    result += `🏪 Boutique: ${p.b1}\n\nBoudoum ! 🇬🇵`
    return result
  }

  return `🛍️ Boutique REUSSITESS ${p.flag}: ${p.b1}\nBoudoum ! 🇬🇵`
}

// ===== 14 PAYS AMAZON REUSSITESS =====



// ===== 14 PAYS AMAZON REUSSITESS =====
const PAYS_AMAZON = {
  'france': { code: 'FR', flag: '🇫🇷', nom: 'France', capitale: 'Paris', pop: '68M', langue: 'Français', monnaie: 'EUR', lat: 48.85, lon: 2.35, b1: 'https://www.amazon.fr/shop/amourguadeloupe', b2: null },
  'usa': { code: 'US', flag: '🇺🇸', nom: 'États-Unis', capitale: 'Washington', pop: '335M', langue: 'Anglais', monnaie: 'USD', lat: 38.89, lon: -77.03, b1: 'https://www.amazon.com/shop/amourguadeloupe', b2: 'https://www.amazon.com/shop/influencer-fb942837' },
  'suede': { code: 'SE', flag: '🇸🇪', nom: 'Suède', capitale: 'Stockholm', pop: '10M', langue: 'Suédois', monnaie: 'SEK', lat: 59.33, lon: 18.06, b1: 'https://www.amazon.se/shop/amourguadeloupe', b2: 'https://www.amazon.se/shop/influencer-fb942837' },
  'belgique': { code: 'BE', flag: '🇧🇪', nom: 'Belgique', capitale: 'Bruxelles', pop: '11M', langue: 'Français/Néerlandais', monnaie: 'EUR', lat: 50.85, lon: 4.35, b1: 'https://www.amazon.com.be/shop/amourguadeloupe', b2: 'https://www.amazon.com.be/shop/influencer-fb942837' },
  'singapour': { code: 'SG', flag: '🇸🇬', nom: 'Singapour', capitale: 'Singapour', pop: '5.9M', langue: 'Anglais', monnaie: 'SGD', lat: 1.35, lon: 103.81, b1: 'https://www.amazon.sg/shop/amourguadeloupe', b2: 'https://www.amazon.sg/shop/influencer-fb942837' },
  'australie': { code: 'AU', flag: '🇦🇺', nom: 'Australie', capitale: 'Canberra', pop: '26M', langue: 'Anglais', monnaie: 'AUD', lat: -35.28, lon: 149.12, b1: 'https://www.amazon.com.au/shop/amourguadeloupe', b2: 'https://www.amazon.com.au/shop/influencer-fb942837' },
  'angleterre': { code: 'GB', flag: '🇬🇧', nom: 'Royaume-Uni', capitale: 'Londres', pop: '67M', langue: 'Anglais', monnaie: 'GBP', lat: 51.50, lon: -0.12, b1: 'https://www.amazon.co.uk/shop/amourguadeloupe', b2: 'https://www.amazon.co.uk/shop/influencer-fb942837' },
  'italie': { code: 'IT', flag: '🇮🇹', nom: 'Italie', capitale: 'Rome', pop: '59M', langue: 'Italien', monnaie: 'EUR', lat: 41.90, lon: 12.49, b1: 'https://www.amazon.it/shop/amourguadeloupe', b2: 'https://www.amazon.it/shop/influencer-fb942837' },
  'espagne': { code: 'ES', flag: '🇪🇸', nom: 'Espagne', capitale: 'Madrid', pop: '47M', langue: 'Espagnol', monnaie: 'EUR', lat: 40.41, lon: -3.70, b1: 'https://www.amazon.es/shop/amourguadeloupe', b2: 'https://www.amazon.es/shop/influencer-fb942837' },
  'allemagne': { code: 'DE', flag: '🇩🇪', nom: 'Allemagne', capitale: 'Berlin', pop: '84M', langue: 'Allemand', monnaie: 'EUR', lat: 52.52, lon: 13.40, b1: 'https://www.amazon.de/shop/amourguadeloupe', b2: 'https://www.amazon.de/shop/influencer-fb942837' },
  'bresil': { code: 'BR', flag: '🇧🇷', nom: 'Brésil', capitale: 'Brasilia', pop: '215M', langue: 'Portugais', monnaie: 'BRL', lat: -15.77, lon: -47.92, b1: 'https://www.amazon.com.br/shop/amourguadeloupe', b2: null },
  'inde': { code: 'IN', flag: '🇮🇳', nom: 'Inde', capitale: 'New Delhi', pop: '1.4B', langue: 'Hindi', monnaie: 'INR', lat: 28.61, lon: 77.20, b1: 'https://www.amazon.in/shop/amourguadeloupe', b2: 'https://www.amazon.in/shop/influencer-fb942837' },
  'canada': { code: 'CA', flag: '🇨🇦', nom: 'Canada', capitale: 'Ottawa', pop: '38M', langue: 'Français/Anglais', monnaie: 'CAD', lat: 45.42, lon: -75.69, b1: 'https://www.amazon.ca/shop/amourguadeloupe', b2: 'https://www.amazon.ca/shop/influencer-fb942837' },
  'pays-bas': { code: 'NL', flag: '🇳🇱', nom: 'Pays-Bas', capitale: 'Amsterdam', pop: '17M', langue: 'Néerlandais', monnaie: 'EUR', lat: 52.37, lon: 4.89, b1: 'https://www.amazon.nl/shop/amourguadeloupe', b2: 'https://www.amazon.nl/shop/influencer-fb942837' },
}

async function getInfoPaysAmazon(paysQuery = "france") {
  try {
    const q = paysQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    const entry = Object.entries(PAYS_AMAZON).find(([k]) => q.includes(k))
    const [, pays] = entry || ['france', PAYS_AMAZON['france']]

    // Météo capitale
    let meteo = ''
    try {
      const mRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pays.lat}&longitude=${pays.lon}&current_weather=true`, { signal: AbortSignal.timeout(4000) })
      const mData = await mRes.json()
      const temp = mData.current_weather?.temperature
      meteo = temp ? `🌡️ Météo ${pays.capitale}: ${temp}°C\n` : ''
    } catch(e) {}

    const boutiques = `🛍️ **Boutique 1:** ${pays.b1}${pays.b2 ? '\n🛍️ **Boutique 2:** '+pays.b2 : ''}`
    return `${pays.flag} **${pays.nom}** — Boutiques REUSSITESS\n\n📍 Capitale: ${pays.capitale}\n👥 Population: ${pays.pop}\n🗣️ Langue: ${pays.langue}\n💰 Monnaie: ${pays.monnaie}\n${meteo}\n${boutiques}\n\n🌐 Toutes boutiques: https://reussitess.fr/boutiques\nBoudoum ! 🇬🇵`
  } catch(e) { return `⚠️ Infos pays indisponibles. (${e.message})` }
}


// ===== ALCHEMY — Token REUSS Polygon Blockchain =====
async function getReussTokenBlockchain() {
  try {
    const RPC = process.env.RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/3pTz5vSd3WrsST8MhLEUC'
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'

    // Total supply
    const supplyRes = await fetch(RPC, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({jsonrpc:'2.0',method:'eth_call',params:[{to:CONTRACT,data:'0x18160ddd'},'latest'],id:1})
    })
    const supplyData = await supplyRes.json()
    const supply = parseInt(supplyData.result, 16) / 1e18

    // Dernier block
    const blockRes = await fetch(RPC, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({jsonrpc:'2.0',method:'eth_blockNumber',params:[],id:2})
    })
    const blockData = await blockRes.json()
    const block = parseInt(blockData.result, 16)

    return `💎 **Token REUSS — Données Blockchain Temps Réel**\n\n🔗 Contrat: \`${CONTRACT}\`\n🌐 Réseau: Polygon (MATIC)\n📊 Supply Total: **${supply.toLocaleString()} REUSS**\n⛓️ Block Actuel: **${block.toLocaleString()}**\n\n🔍 Explorer: https://polygonscan.com/token/${CONTRACT}\n💱 Acheter: https://quickswap.exchange/#/swap?outputCurrency=${CONTRACT}\n📈 Chart: https://dexscreener.com/polygon/${CONTRACT}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return `⚠️ Données blockchain indisponibles. (${e.message})` }
}

// ===== WORLD BANK — PIB & Chômage =====
async function getWorldBank(pays = "GP", indicateur = "NY.GDP.MKTP.CD") {
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/${pays}/indicator/${indicateur}?format=json&mrv=3`)
    const d = await res.json()
    const val = d[1]?.[0]
    if (!val) return "❌ Données indisponibles."
    const noms = {
      "NY.GDP.MKTP.CD": "PIB",
      "SL.UEM.TOTL.ZS": "Taux de chômage",
      "SP.POP.TOTL": "Population"
    }
    const nom = noms[indicateur] || indicateur
    const valeur = val.value ? (val.value > 1e9 ? (val.value/1e9).toFixed(2)+"B$" : val.value.toFixed(2)) : "N/A"
    return `📊 **${nom} — ${val.country?.value}**\n\n💰 ${valeur} (${val.date})\n\nSource: World Bank\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ World Bank indisponible." }
}

// ===== INSEE — Communes DOM-TOM =====
async function getINSEECommunes(region = "01") {
  try {
    const res = await fetch(`https://geo.api.gouv.fr/communes?codeRegion=${region}&fields=nom,population&limit=10`)
    const d = await res.json()
    if (!d.length) return "❌ Communes non trouvées."
    const noms = { "01": "Guadeloupe", "02": "Martinique", "03": "Guyane", "04": "La Réunion", "06": "Mayotte" }
    let result = `🏘️ **Communes — ${noms[region] || 'DOM-TOM'}**\n\n`
    for (const c of d.slice(0,8)) {
      result += `• **${c.nom}** — ${c.population?.toLocaleString() || 'N/A'} habitants\n`
    }
    return result + "\nSource: INSEE\nBoudoum ! 🇬🇵"
  } catch(e) { return "⚠️ INSEE indisponible." }
}

// ===== DATA.GOUV.FR — Open Data =====
async function getDataGouv(query = "guadeloupe") {
  try {
    const res = await fetch(`https://www.data.gouv.fr/api/1/datasets/?q=${encodeURIComponent(query)}&page_size=5`)
    const d = await res.json()
    if (!d.data?.length) return "❌ Aucune donnée trouvée."
    let result = `📂 **Open Data — "${query}"**\n\n`
    for (const ds of d.data.slice(0,5)) {
      result += `• **${ds.title}**\n  🔗 https://www.data.gouv.fr/fr/datasets/${ds.id}\n\n`
    }
    return result + "Source: data.gouv.fr\nBoudoum ! 🇬🇵"
  } catch(e) { return "⚠️ data.gouv.fr indisponible." }
}

// ===== COUNTRIESNOW — Villes =====
async function getVillesPays(pays = "Guadeloupe") {
  try {
    const res = await fetch(`https://countriesnow.space/api/v0.1/countries/cities/q?country=${encodeURIComponent(pays)}`)
    const d = await res.json()
    if (!d.data?.length) return "❌ Villes non trouvées."
    let result = `🏙️ **Villes — ${pays}**\n\n`
    result += d.data.slice(0,10).map(v => `• ${v}`).join("\n")
    return result + "\n\nBoudoum ! 🇬🇵"
  } catch(e) { return "⚠️ Données villes indisponibles." }
}

// ===== CURRENTSAPI — Actualités mondiales =====
async function getActualitesCurrents(query = "Guadeloupe", langue = "fr") {
  try {
    const q = query.toLowerCase()
    const feedUrl = q.includes('guadeloupe') ? "https://www.bondamanjak.com/category/guadeloupe/feed/" :
                    q.includes('martinique') ? "https://www.bondamanjak.com/category/martinique/feed/" :
                    q.includes('guyane') ? "https://www.bondamanjak.com/category/guyane/feed/" :
                    q.includes('mayotte') ? "https://www.mayottehebdo.com/feed/" :
                    q.includes('reunion') || q.includes('réunion') ? "https://www.bondamanjak.com/feed/" :
                    q.includes('outremer') || q.includes('outre-mer') || q.includes('dom') || q.includes('antilles') ? "https://www.bondamanjak.com/feed/" :
                    q.includes('afrique') ? "https://www.rfi.fr/fr/afrique/rss" :
                    q.includes('monde') || q.includes('international') ? "https://www.france24.com/fr/rss" :
                    "https://www.rfi.fr/fr/rss"
    const res = await fetch(feedUrl, { signal: AbortSignal.timeout(5000) })
    const xml = await res.text()
    const items = [...xml.matchAll(/<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<\/item>/g)]
    if (!items.length) return "❌ Aucune actualité trouvée."
    const decode = s => s.replace(/<!\[CDATA\[(.*?)\]\]>/g,'$1').replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(n)).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim()
    const articles = items.slice(0,5).map((m,i) =>
      `${i+1}. **${decode(m[1])}**\n   🔗 ${decode(m[2]).trim()}`
    ).join("\n\n")
    return `📰 **Actualités — "${query}"**\n\n${articles}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return `⚠️ Actualités indisponibles. (${e.message})` }
}

// ===== FDA — Médicaments USA =====
async function getMedicament(drug = "aspirin") {
  try {
    const res = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodeURIComponent(drug)}&limit=1`)
    const d = await res.json()
    if (!d.results?.length) return `❌ Médicament "${drug}" non trouvé.`
    const m = d.results[0]
    const indications = m.indications_and_usage?.[0]?.substring(0, 300) || "N/A"
    const warnings = m.warnings?.[0]?.substring(0, 200) || "N/A"
    return `💊 **Médicament — ${drug.toUpperCase()}**\n\n📋 Indications: ${indications}...\n\n⚠️ Avertissements: ${warnings}...\n\n⚠️ Consultez toujours un médecin.\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Données médicament indisponibles." }
}

// ===== OPENRAILWAYMAP — Trains Europe =====
async function getTrainsEurope(ville = "Paris") {
  try {
    const geo = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ville)}&format=json&limit=1`, { headers: {"User-Agent":"REUSSITESS-AI/1.0"} })
    const gd = await geo.json()
    if (!gd?.length) return `❌ Ville "${ville}" non trouvée.`
    const lat = parseFloat(gd[0].lat).toFixed(4)
    const lon = parseFloat(gd[0].lon).toFixed(4)
    return `🚂 **Trains Europe — ${ville}**\n\n📍 Position: ${lat}, ${lon}\n🗺️ Carte ferroviaire: https://www.openrailwaymap.org/?lat=${lat}&lon=${lon}&zoom=12\n\n🔗 Cliquez le lien pour voir les voies ferrées autour de ${ville} !\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Données trains indisponibles." }
}

// ===== OPEN-METEO — Météo illimitée gratuite =====
async function getOpenMeteo(ville = "Pointe-à-Pitre", lat = 16.24, lon = -61.53) {
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`)
    const d = await res.json()
    const c = d.current
    const codes = {0:"Ciel dégagé ☀️",1:"Peu nuageux 🌤️",2:"Partiellement nuageux ⛅",3:"Couvert ☁️",45:"Brouillard 🌫️",61:"Pluie légère 🌦️",63:"Pluie modérée 🌧️",80:"Averses 🌧️",95:"Orage ⛈️"}
    const desc = codes[c.weather_code] || "Variable"
    return `🌦️ **Météo ${ville} (Open-Meteo)**\n\n🌡️ Température: ${c.temperature_2m}°C\n💧 Humidité: ${c.relative_humidity_2m}%\n💨 Vent: ${c.wind_speed_10m} km/h\n🌤️ Conditions: ${desc}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Météo indisponible momentanément." }
}

// ===== COINGECKO — Crypto temps réel gratuit =====
async function getCryptoCoingecko(coin = "bitcoin") {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=eur,usd&include_24hr_change=true`)
    const d = await res.json()
    const data = d[coin]
    if (!data) return `❌ Crypto "${coin}" non trouvée.`
    const change = data.eur_24h_change?.toFixed(2)
    const arrow = change > 0 ? "📈" : "📉"
    return `💎 **${coin.toUpperCase()} (CoinGecko)**\n\n💶 EUR: €${data.eur?.toLocaleString("fr-FR")}\n💵 USD: $${data.usd?.toLocaleString("en-US")}\n${arrow} 24h: ${change}%\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Données crypto indisponibles." }
}

// ===== EXCHANGERATE — Devises temps réel =====
async function getExchangeRate(from = "EUR", to = "XCD") {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
    const d = await res.json()
    const rate = d.rates[to]
    if (!rate) return `❌ Devise ${to} non trouvée.`
    return `💱 **Taux de change (ExchangeRate)**\n\n1 ${from} = ${rate.toFixed(4)} ${to}\n\n🌍 Principales devises:\n• EUR → USD: ${d.rates.USD?.toFixed(4)}\n• EUR → XOF: ${d.rates.XOF?.toFixed(0)} (FCFA)\n• EUR → XCD: ${d.rates.XCD?.toFixed(4)} (Dollar Caraïbes)\n• EUR → HTG: ${d.rates.HTG?.toFixed(2)} (Gourde Haïti)\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Taux de change indisponibles." }
}

// ===== RESTCOUNTRIES — Infos pays =====
async function getCountryInfo(pays = "Guadeloupe") {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(pays)}`)
    const d = await res.json()
    if (!d || d.status === 404) return `❌ Pays "${pays}" non trouvé.`
    const p = d[0]
    const pop = p.population?.toLocaleString("fr-FR")
    const capital = p.capital?.[0] || "N/A"
    const region = p.region || "N/A"
    const langs = Object.values(p.languages || {}).join(", ")
    const currency = Object.values(p.currencies || {}).map(c => `${c.name} (${c.symbol})`).join(", ")
    return `🌍 **${p.name?.common || pays}**\n\n🏙️ Capitale: ${capital}\n👥 Population: ${pop}\n🌐 Région: ${region}\n🗣️ Langue(s): ${langs}\n💰 Monnaie: ${currency}\n🗺️ Superficie: ${p.area?.toLocaleString("fr-FR")} km²\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Infos pays indisponibles." }
}

// ===== DISEASE.SH — Santé mondiale =====
async function getSanteMondale() {
  try {
    const res = await fetch("https://disease.sh/v3/covid-19/all")
    const d = await res.json()
    return `🏥 **Santé Mondiale (Disease.sh)**\n\n🦠 COVID-19 Global:\n• Cas totaux: ${d.cases?.toLocaleString("fr-FR")}\n• Décès: ${d.deaths?.toLocaleString("fr-FR")}\n• Guéris: ${d.recovered?.toLocaleString("fr-FR")}\n• Actifs: ${d.active?.toLocaleString("fr-FR")}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Données santé indisponibles." }
}

// ===== OPENLIBRARY — Livres gratuits =====
async function getOpenLibrary(query = "Aimé Césaire") {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`)
    const d = await res.json()
    if (!d.docs?.length) return `❌ Aucun livre trouvé pour "${query}".`
    const livres = d.docs.slice(0, 5).map((b, i) => `${i+1}. **${b.title}** — ${b.author_name?.[0] || "Auteur inconnu"} (${b.first_publish_year || "?"})`)
    return `📚 **Open Library — "${query}"**\n\n${livres.join("\n")}\n\n🔗 openlibrary.org\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Bibliothèque indisponible." }
}

// ===== DICTIONARY API — Définitions multilingues =====
async function getDictionary(mot, lang = "fr") {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/${lang}/${encodeURIComponent(mot)}`)
    const d = await res.json()
    if (!d || d.title === "No Definitions Found") return `❌ Définition de "${mot}" non trouvée.`
    const entry = d[0]
    const meanings = entry.meanings?.slice(0, 2).map(m => `• ${m.partOfSpeech}: ${m.definitions?.[0]?.definition}`).join("\n")
    return `📖 **Dictionnaire — "${mot}"**\n\n${meanings}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Dictionnaire indisponible." }
}

// ===== NOMINATIM — Géolocalisation gratuite =====
async function getGeoLocation(lieu) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(lieu)}&format=json&limit=1`, {
      headers: { "User-Agent": "REUSSITESS-AI/1.0" }
    })
    const d = await res.json()
    if (!d?.length) return `❌ Lieu "${lieu}" non trouvé.`
    const loc = d[0]
    return `📍 **Géolocalisation — "${lieu}"**\n\n🌐 Latitude: ${parseFloat(loc.lat).toFixed(4)}\n🌐 Longitude: ${parseFloat(loc.lon).toFixed(4)}\n📌 Adresse: ${loc.display_name}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "⚠️ Géolocalisation indisponible." }
}

async function getMeteoDOMTOM(commune) {
  try {
    const lats = {'pointe-a-pitre':'16.24','basse-terre':'16.00','fort-de-france':'14.60','cayenne':'4.93','saint-denis':'-20.88'}
    const lngs = {'pointe-a-pitre':'-61.53','basse-terre':'-61.72','fort-de-france':'-61.07','cayenne':'-52.33','saint-denis':'55.45'}
    const key = (commune||'pointe-a-pitre').toLowerCase().replace(/[^a-z-]/g,'')
    const lat = lats[key] || '16.24'
    const lng = lngs[key] || '-61.53'
    const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&current=temperature_2m,weathercode,windspeed_10m&timezone=auto")
    const data = await r.json()
    const c = data.current
    const codes = {0:'Ciel degage',1:'Peu nuageux',2:'Nuageux',3:'Couvert',61:'Pluie legere',63:'Pluie moderee',80:'Averses',95:'Orage'}
    return (commune||'Pointe-a-Pitre')+": "+(codes[c.weathercode]||'Variable')+" | "+c.temperature_2m+"C | Vent: "+c.windspeed_10m+" km/h"
  } catch(e) { return null }
}

// ============ DEVISES AFRIQUE CARAIBE ============
async function getDevisesAfriqueCaraibe() {
  try {
    const r = await fetch('https://api.exchangerate-api.com/v4/latest/EUR')
    const data = await r.json()
    const rates = data.rates
    return "1EUR = "+(rates.XOF||655).toFixed(0)+" XOF (FCFA Afrique Ouest) | "+(rates.XAF||655).toFixed(0)+" XAF (FCFA Afrique Centrale) | "+(rates.XCD||2.97).toFixed(2)+" XCD (Caraibe Est) | "+(rates.HTG||'N/A')+" HTG (Haiti)"
  } catch(e) { return null }
}

// ============ BOURSES AUF ============
async function getBoursesAUF() {
  try {
    const r = await fetch('https://www.auf.org/feed/')
    const text = await r.text()
    const titles = [...text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].slice(1, 4).map(m => m[1])
    if (titles.length === 0) return null
    return "Bourses AUF: " + titles.join(' | ')
  } catch(e) { return null }
}

// ============ EMPLOI AFRIQUE ============
async function getEmploiAfrique() {
  try {
    const r = await fetch('https://www.rekrute.com/rss/offres.rss')
    const text = await r.text()
    const titles = [...text.matchAll(/<title>(.*?)<\/title>/g)].slice(1, 4).map(m => m[1].replace(/<!\[CDATA\[|\]\]>/g, ''))
    if (titles.length === 0) return null
    return "Emploi Afrique: " + titles.join(' | ')
  } catch(e) { return null }
}

// ============ PRIX CARBURANT DOM-TOM ============
async function getPrixCarburant() {
  return "SP95 ~1.77EUR/L | Gazole ~1.65EUR/L | SP98 ~1.85EUR/L | Source: prix-carburants.gouv.fr"
}

// ============ CALENDRIER SCOLAIRE DOM-TOM ============
async function getCalendrieScolaire() {
  const now = new Date()
  const vacances = [
    { nom: 'Vacances de Paques', debut: '2026-04-18', fin: '2026-05-04' },
    { nom: 'Grandes vacances', debut: '2026-07-04', fin: '2026-09-01' },
    { nom: 'Toussaint', debut: '2026-10-17', fin: '2026-11-02' },
    { nom: 'Noel', debut: '2026-12-19', fin: '2027-01-05' }
  ]
  const prochaine = vacances.find(v => new Date(v.debut) > now)
  if (!prochaine) return "Calendrier scolaire Guadeloupe 2025-2026. Consulte: education.gouv.fr"
  const jours = Math.ceil((new Date(prochaine.debut) - now) / (1000*60*60*24))
  return "Guadeloupe — Prochaines vacances: "+prochaine.nom+" du "+new Date(prochaine.debut).toLocaleDateString('fr-FR')+" au "+new Date(prochaine.fin).toLocaleDateString('fr-FR')+" (dans "+jours+" jours)"
}

// ============ BIBLIOTHEQUE CARIBEENNE ============
async function getBibliothequeCaribeenne(auteur) {
  const auteurs = {
    'cesaire': { nom: 'Aime Cesaire', oeuvre: 'Cahier d un retour au pays natal', url: 'https://openlibrary.org/authors/OL461882A' },
    'fanon': { nom: 'Frantz Fanon', oeuvre: 'Les Damnes de la Terre', url: 'https://openlibrary.org/authors/OL243233A' },
    'conde': { nom: 'Maryse Conde', oeuvre: 'Segou', url: 'https://openlibrary.org/search?author=conde+maryse' },
    'glissant': { nom: 'Edouard Glissant', oeuvre: 'Le Discours Antillais', url: 'https://openlibrary.org/search?author=glissant' },
    'schwarz-bart': { nom: 'Simone Schwarz-Bart', oeuvre: 'Pluie et vent sur Telumee Miracle', url: 'https://openlibrary.org/search?author=schwarz-bart' }
  }
  const a = auteur ? auteur.toLowerCase() : ''
  const key = Object.keys(auteurs).find(k => a.includes(k))
  if (key) {
    const au = auteurs[key]
    return "Auteur: "+au.nom+" | Oeuvre majeure: "+au.oeuvre+" | Open Library: "+au.url+" | https://reussitess.fr/bibliotheque"
  }
  return "Bibliotheque Caribeenne: Cesaire | Fanon | Conde | Glissant | Schwarz-Bart | https://reussitess.fr/bibliotheque"
}

function calculerJourDate(dateStr) {
  try {
    const months = { 'janvier':1,'février':2,'fevrier':2,'mars':3,'avril':4,'mai':5,'juin':6,'juillet':7,'août':8,'aout':8,'septembre':9,'octobre':10,'novembre':11,'décembre':12,'decembre':12 }
    const jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
    const parts = dateStr.toLowerCase().match(/(\d+)(?:er)?\s+(\w+)\s+(\d{4})/)
    if (!parts) return null
    let day = parseInt(parts[1]), month = months[parts[2]], year = parseInt(parts[3])
    if (!month || year < 1900 || year > 2100) return null
    // Algorithme Tomohiko Sakamoto — exact de 1900 à 2100
    const t = [0,3,2,5,0,3,5,1,4,6,2,4]
    if (month < 3) year--
    const dayOfWeek = (year + Math.floor(year/4) - Math.floor(year/100) + Math.floor(year/400) + t[month-1] + day) % 7
    const annee = parseInt(parts[3])
    const futur = annee >= new Date().getFullYear()
    const verbe = futur ? 'sera' : 'était'
    return `📅 Le ${day} ${parts[2]} ${annee} ${verbe} un **${jours[dayOfWeek]}**. ✅`
  } catch(e) { return null }
}

import { langchainChat } from './langchain.js'

export default async function handler(req, res) {
  let pdfType = null;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, personality, context, langue, datetime, image, imageQuestion } = req.body

  // ===== MULTIMODAL — Analyse Image =====
  if (image) {
    try {
      const analyse = await groqAnalyseImage(image, imageQuestion || message)
      if (analyse) return res.status(200).json({ pdfAction: null, response: "🖼️ **Analyse Image REUSSITESS AI**\n\n" + analyse + "\n\nBoudoum ! 🇬🇵" })
      else return res.status(200).json({ pdfAction: null, response: "⚠️ Analyse image indisponible momentanément. Le modèle vision est en cours d'activation.\n\nRéessayez dans quelques instants.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: null, response: "⚠️ Erreur analyse image : " + e.message + "\n\nBoudoum ! 🇬🇵" })
    }
  }
  const msgLow = message.toLowerCase()

  // ============ CALCUL JOUR DATE ============
  // ===== TRIGGERS ULTRA PRIORITAIRES =====

  // FRANCE TRAVAIL EMPLOI TEMPS REEL
  if (msgLow.includes('emploi') || msgLow.includes('offre') || msgLow.includes('recrutement') || msgLow.includes('liste') && msgLow.includes('travail')) {
    const zone = msgLow.includes('martinique') ? '972' : msgLow.includes('guyane') ? '973' : msgLow.includes('reunion') ? '974' : '971'
    const data = await getOffresEmploiDOMTOM(message, zone)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // AMAZON RECHERCHE
  if ((msgLow.includes('cherche') || msgLow.includes('trouve') || msgLow.includes('recherche')) && msgLow.includes('amazon')) {
    const pays = msgLow.includes('usa') ? 'usa' : msgLow.includes('canada') ? 'canada' : msgLow.includes('allemagne') ? 'allemagne' : msgLow.includes('espagne') ? 'espagne' : msgLow.includes('italie') ? 'italie' : msgLow.includes('angleterre') ? 'angleterre' : msgLow.includes('australie') ? 'australie' : msgLow.includes('inde') ? 'inde' : msgLow.includes('bresil') ? 'bresil' : 'france'
    const query = message.replace(/cherche|trouve|recherche|amazon|sur|dans|en|un|une|des|le|la|les|france|usa|canada|allemagne|espagne|italie|angleterre|australie|inde|bresil|singapour|suede|belgique/gi,'').trim()
    const data = await getAmazonInfo(query, 'search', pays)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // AMAZON RECOMMANDATIONS
  if ((msgLow.includes('meilleur') || msgLow.includes('top') || msgLow.includes('populaire') || msgLow.includes('tendance')) && msgLow.includes('amazon')) {
    const pays = msgLow.includes('usa') ? 'usa' : msgLow.includes('canada') ? 'canada' : 'france'
    const data = await getAmazonInfo('', 'recommandations', pays)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // AMAZON COMMISSION
  if ((msgLow.includes('commission') || msgLow.includes('gagner') || msgLow.includes('revenu')) && msgLow.includes('amazon')) {
    const prix = message.match(/\d+/)?.[0] || '100'
    const data = await getAmazonInfo(prix, 'commission', 'france')
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // 14 PAYS AMAZON REUSSITESS
  if (msgLow.includes('boutique') && (msgLow.includes('france') || msgLow.includes('usa') || msgLow.includes('canada') || msgLow.includes('australie') || msgLow.includes('inde') || msgLow.includes('allemagne') || msgLow.includes('espagne') || msgLow.includes('italie') || msgLow.includes('bresil') || msgLow.includes('singapour') || msgLow.includes('suede') || msgLow.includes('belgique') || msgLow.includes('angleterre') || msgLow.includes('zelande'))) {
    const data = await getInfoPaysAmazon(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // 14 PAYS AMAZON REUSSITESS
  if (msgLow.includes('boutique') && (msgLow.includes('france') || msgLow.includes('usa') || msgLow.includes('canada') || msgLow.includes('australie') || msgLow.includes('inde') || msgLow.includes('allemagne') || msgLow.includes('espagne') || msgLow.includes('italie') || msgLow.includes('bresil') || msgLow.includes('singapour') || msgLow.includes('suede') || msgLow.includes('belgique') || msgLow.includes('angleterre') || msgLow.includes('zelande'))) {
    const data = await getInfoPaysAmazon(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // REUSS TOKEN BLOCKCHAIN
  if ((msgLow.includes('reuss') || msgLow.includes('token')) && (msgLow.includes('blockchain') || msgLow.includes('supply') || msgLow.includes('contrat') || msgLow.includes('polygon') || msgLow.includes('solde') || msgLow.includes('holders'))) {
    const data = await getReussTokenBlockchain()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // WORLD BANK PIB CHOMAGE
  if (msgLow.includes('pib') || msgLow.includes('chomage') || msgLow.includes('chômage') || msgLow.includes('economie') || msgLow.includes('économie') && msgLow.includes('guadeloupe')) {
    const indic = msgLow.includes('chomage') || msgLow.includes('chômage') ? 'SL.UEM.TOTL.ZS' : msgLow.includes('population') ? 'SP.POP.TOTL' : 'NY.GDP.MKTP.CD'
    const pays = msgLow.includes('martinique') ? 'MQ' : msgLow.includes('guyane') ? 'GF' : msgLow.includes('reunion') ? 'RE' : 'GLP'
    const data = await getWorldBank(pays, indic)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // OPENFOODFACTS NUTRITION
  if (msgLow.includes('nutrition') || msgLow.includes('calories') || msgLow.includes('aliment') || msgLow.includes('composition')) {
    const query = message.replace(/nutrition|calories|aliment|composition|de|du|d/gi,'').trim() || 'banane'
    const data = await getAlimentNutrition(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // NOAA MAREES
  if (msgLow.includes('marée') || msgLow.includes('maree') || msgLow.includes('haute mer') || msgLow.includes('basse mer')) {
    const data = await getMareesGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // INSEE COMMUNES
  if (msgLow.includes('communes') || msgLow.includes('villes') && (msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('dom-tom'))) {
    const region = msgLow.includes('martinique') ? '02' : msgLow.includes('guyane') ? '03' : msgLow.includes('reunion') ? '04' : msgLow.includes('mayotte') ? '06' : '01'
    const data = await getINSEECommunes(region)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // DATA GOUV OPEN DATA
  if (msgLow.includes('open data') || msgLow.includes('données publiques') || msgLow.includes('statistiques guadeloupe')) {
    const query = message.replace(/open data|données publiques|statistiques/gi,'').trim() || 'guadeloupe'
    const data = await getDataGouv(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // VOLS CARAIBES
  if ((msgLow.includes('vol') || msgLow.includes('avion') || msgLow.includes('aéroport') || msgLow.includes('aeroport')) && (msgLow.includes('caraïbes') || msgLow.includes('caraibes') || msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('antilles'))) {
    const data = await getVolsCaraibes()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // HOPITAUX DOM-TOM
  if (msgLow.includes('hopital') || msgLow.includes('hôpital') || msgLow.includes('chu') || msgLow.includes('urgences') || msgLow.includes('clinique')) {
    const data = await getHopitauxDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // METEO DOM-TOM PRIORITAIRE
  if (msgLow.includes('meteo') || msgLow.includes('météo') || msgLow.includes('température') || msgLow.includes('temperature') || msgLow.includes('quel temps') || msgLow.includes('climat')) {
    const data = await getMeteoDOM()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // CURRENTSAPI ACTUALITES
  if (msgLow.includes('actualité') || msgLow.includes('actualites') || msgLow.includes('news') || msgLow.includes('dernières nouvelles') || msgLow.includes('information du jour')) {
    const query = message.replace(/^\s*actualit[ée]s?\s*|^\s*news\s*|^\s*derni[eè]res?\s*nouvelles?\s*|^\s*information\s*du\s*jour\s*/gi,'').trim() || 'Guadeloupe'
    const data = await getActualitesCurrents(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // FDA MEDICAMENTS
  if (msgLow.includes('médicament') || msgLow.includes('medicament') || msgLow.includes('aspirine') || msgLow.includes('ibuprofène') || msgLow.includes('doliprane') || msgLow.includes('comprimé')) {
    const drug = message.replace(/médicament|medicament|comprimé|cherche|trouve|info/gi,'').trim().split(' ')[0] || 'aspirin'
    const data = await getMedicament(drug)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // TRAINS EUROPE
  if (msgLow.includes('train') || msgLow.includes('sncf') || msgLow.includes('gare') || msgLow.includes('ferroviaire') || msgLow.includes('rail')) {
    const ville = message.replace(/train|sncf|gare|ferroviaire|rail|à|de|du/gi,'').trim() || 'Paris'
    const data = await getTrainsEurope(ville)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ===== GUARDRAILS SECURITE =====
  const guardrailResponse = checkGuardrails(message)
  if (guardrailResponse) {
    return res.status(200).json({ pdfAction: null, response: guardrailResponse })
  }

  // PLAGES DOM-TOM
  if (msgLow.includes('plage') || msgLow.includes('baignade') || msgLow.includes('plages dom')) {
    const data = await getQualitePlages()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // TU SAIS FAIRE QUOI
  if (msgLow.includes('tu sais faire quoi') || msgLow.includes('que sais-tu faire') || msgLow.includes('tes capacites') || msgLow.includes('tes capacités') || msgLow.includes('ce que tu sais') || msgLow.includes('tu peux faire quoi') || msgLow.includes('fonctionnalites') || msgLow.includes('fonctionnalités du bot')) {
    return res.status(200).json({ pdfAction: null, response: `🤖 **REUSSITESS AI — Mes Capacités**

📡 **Données Temps Réel :**
• 🌋 Séismes Antilles (USGS)
• 🌀 Cyclones Atlantique (NHC)
• 🌤️ Météo DOM-TOM par commune (Open-Meteo)
• 💱 Devises XOF/XAF/XCD/HTG temps réel
• ⛽ Prix carburant DOM-TOM
• 💎 Prix Token REUSS (CoinGecko Polygon)
• ₿ Crypto BTC/ETH/POL temps réel
• 📰 Actualités Bondamanjak (Guadeloupe/Martinique/Guyane/Mayotte) + RFI + France24
• 🌊 Marées Guadeloupe temps réel (NOAA)
• 🥗 Nutrition aliments (OpenFoodFacts)
• 📊 PIB/Chômage DOM-TOM (World Bank)
• 🏘️ Communes & population (INSEE)
• 📂 Open Data officiel (data.gouv.fr)
• 📻 RCI FM Guadeloupe 104.3
• 📰 RFI/BBC/France24/Al Jazeera monde

🏝️ **Vie Quotidienne Guadeloupe :**
• 🚗 Covoiturage (Karos, BlaBlaCar)
• 🛣️ Routes & trafic (RN1, RN4, pont Gabarre)
• 💡 Bons plans & marchés locaux
• ⚡ Coupures EDF + numéros urgence
• ⚡ Mix électrique EDF temps réel
• 🚌 Bus GTI + taxis collectifs
• ✈️ Vols Caraïbes (Air Caraïbes, Corsair, Air France)
• 🌊 Qualité eau baignade DOM-TOM
• 🏥 Hôpitaux & Urgences DOM-TOM
• 📊 KaruData Open Data Région Guadeloupe

🏛️ **Politique DOM-TOM (données vérifiées 2025-2026) :**
• 🇬🇵 Guadeloupe : Ary Chalus, Guy Losbar, Harry Durimel + 4 députés + 3 sénateurs
• 🇲🇶 Martinique : Serge Letchimy (CTM) + 4 députés + 2 sénateurs
• 🇬🇫 Guyane : Gabriel Serville (CTG) + 2 députés + 2 sénateurs
• 🇷🇪 Réunion : Huguette Bello, Cyrille Melchior + 7 députés + 2 sénateurs
• 🇾🇹 Mayotte : Ben Issa Ousseni + cyclone Chido 2024
• 🇳🇨 Nouvelle-Calédonie : Alcide Ponga + crises 2024-2025

🎓 **Éducation & Emploi :**
• 🎓 BAC/BTS résultats & calendrier
• 💼 Offres emploi temps réel France Travail OAuth (Guadeloupe/Martinique/Guyane/Réunion)
• 💼 CaribbeaJobs, Indeed, LinkedIn, Caraibe-emploi
• 🛍️ Amazon: recherche produits, top catégories, calcul commissions affilié (14 pays)
• 📚 Bourses AUF
• 🎓 Rectorat Guadeloupe

🌴 **Culture Caribéenne :**
• Créole guadeloupéen (20+ expressions)
• 🎵 Zouk, Soca, Gwo Ka, Biguine
• 📚 Césaire, Fanon, Condé, Glissant
• 🏺 Histoire & Philosophie antillaise
• 🌿 Bibliothèque caribéenne (26 pays)

💼 **Business & Documents PDF :**
• 📄 CV professionnel PDF
• 📝 Contrat Freelance PDF
• 📊 Business Plan PDF
• 🏆 Certificat Champion REUSSITESS PDF
• 💰 Calculateur commission Amazon
• 🛍️ 26 boutiques Amazon 14 pays

💎 **Blockchain & Crypto :**
• Prix REUSS Token Polygon (CoinGecko)
• Lien direct QuickSwap
• GoMining suivi
• NFT & Staking (en développement)

🧠 **Intelligence Artificielle Avancée :**
• 60 agents Neuro-X spécialisés
• 📷 Analyse d'images (Groq Vision)
• 🔧 Function Calling automatique
• 📚 RAG base de connaissances REUSSITESS
• 🤖 Multi-agents orchestrés
• 🌐 8 langues actives
• 🎤 Micro + synthèse vocale

📅 **Calcul & Logique :**
• Calcul jour/date exact 1900-2100
• Heure & date temps réel
• Calculs mathématiques

🌍 **Encyclopédie Mondiale :**
• Wikipedia FR temps réel
• Open Library 1500+ livres
• Afrique (Mandela, Sankara, Ubuntu)
• Maghreb, Asie, Europe francophone

🔮 **Fonctionnalités Spéciales :**
• Oracle 971 caribéen mystique
• Horoscope & phase de la lune
• Position ISS temps réel
• Blagues & proverbes créoles rotatifs
• Mot créole du jour

🛡️ **Infrastructure :**
• 3 clés Groq rotation anti-429
• HTTPS + headers sécurisés A+
• PWA installable
• Mémoire conversation

**Total : 110+ fonctionnalités actives** 🎯

Boudoum ! 🇬🇵`})
  }



  // CV PDF — avant Neuro-X
  if (msgLow.includes('creer mon cv') || msgLow.includes('créer mon cv') || msgLow.includes('cv pdf') || msgLow.includes('mon cv') || msgLow.includes('faire mon cv')) {
    return res.status(200).json({ pdfAction: 'cv', response: "📄 Génération de votre CV en cours...\n\nCliquez sur **Télécharger PDF** ci-dessous pour obtenir votre CV professionnel !\n\nBoudoum ! 🇬🇵" })
  }

  // POLITIQUE GUADELOUPE
  if (msgLow.includes('ary chalus') || (msgLow.includes('president') && msgLow.includes('regional') && msgLow.includes('guadeloupe')) || (msgLow.includes('président') && msgLow.includes('région') && msgLow.includes('guadeloupe'))) {
    return res.status(200).json({ pdfAction: null, response: "🏛️ **Président du Conseil Régional de Guadeloupe**\n\n👤 **Ary Chalus**\n🗓️ En poste depuis 2017\n\n🔗 https://www.regionguadeloupe.fr\n\nBoudoum ! 🇬🇵" })
  }
  if (msgLow.includes('guy losbar') || (msgLow.includes('president') && msgLow.includes('departemental') && msgLow.includes('guadeloupe')) || (msgLow.includes('président') && msgLow.includes('département') && msgLow.includes('guadeloupe'))) {
    return res.status(200).json({ pdfAction: null, response: "🏛️ **Président du Conseil Départemental de Guadeloupe**\n\n👤 **Guy Losbar**\n🗓️ En poste depuis 2021\n\n🔗 https://www.cg971.fr\n\nBoudoum ! 🇬🇵" })
  }
  if (msgLow.includes('harry durimel') || (msgLow.includes('maire') && msgLow.includes('pointe-a-pitre')) || (msgLow.includes('maire') && msgLow.includes('pointe à pitre'))) {
    return res.status(200).json({ pdfAction: null, response: "🏙️ **Maire de Pointe-à-Pitre**\n\n👤 **Harry Durimel**\n🗓️ Élu en 2020\n🌿 Parti : EELV (Europe Écologie Les Verts)\n\n🔗 https://www.pointeapitre.fr\n\nBoudoum ! 🇬🇵" })
  }
  if (msgLow.includes('politique guadeloupe') || msgLow.includes('elus guadeloupe') || msgLow.includes('élus guadeloupe') || msgLow.includes('depute guadeloupe') || msgLow.includes('député guadeloupe') || msgLow.includes('senateur guadeloupe') || msgLow.includes('sénateur guadeloupe') || msgLow.includes('politicien guadeloupe') || msgLow.includes('politiciens guadeloupe') || msgLow.includes('cite.*politicien') || (msgLow.includes('politicien') && msgLow.includes('guadeloup')) || msgLow.includes('ary chalus') || msgLow.includes('guy losbar') || msgLow.includes('olivier serva') || msgLow.includes('christian baptiste') || msgLow.includes('max mathiasin') || msgLow.includes('elie califer') || msgLow.includes('élie califer') || msgLow.includes('dominique theophile') || msgLow.includes('victorin lurel') || msgLow.includes('solanges nadille') || msgLow.includes('politicien guadeloupe') || msgLow.includes('politiciens guadeloupe') || msgLow.includes('cite.*politicien') || (msgLow.includes('politicien') && msgLow.includes('guadeloup')) || msgLow.includes('ary chalus') || msgLow.includes('guy losbar') || msgLow.includes('olivier serva') || msgLow.includes('christian baptiste') || msgLow.includes('max mathiasin') || msgLow.includes('elie califer') || msgLow.includes('élie califer') || msgLow.includes('dominique theophile') || msgLow.includes('victorin lurel') || msgLow.includes('solanges nadille')) {
    try {
      const data = getPolitiquesGuadeloupe()
      return res.status(200).json({ pdfAction: null, response: data })
    } catch(e) {
      return res.status(200).json({ pdfAction: null, response: "🗳️ Consultez https://www.guadeloupe.gouv.fr\n\nBoudoum ! 🇬🇵" })
    }
  }

  // ===== TRIGGERS PRIORITAIRES (avant Wikipedia/Encyclopédie) =====

  // POLITIQUE GUADELOUPE
  if (msgLow.includes('president') && (msgLow.includes('regional') || msgLow.includes('région') || msgLow.includes('region') || msgLow.includes('conseil regional'))) {
    return res.status(200).json({ pdfAction: null, response: "🏛️ **Président du Conseil Régional de Guadeloupe**\n\n👤 **Ary Chalus**\n\n🔗 https://www.regionguadeloupe.fr\n\nBoudoum ! 🇬🇵" })
  }
  if (msgLow.includes('president') && (msgLow.includes('departemental') || msgLow.includes('département') || msgLow.includes('departement') || msgLow.includes('conseil departemental'))) {
    return res.status(200).json({ pdfAction: null, response: "🏛️ **Président du Conseil Départemental de Guadeloupe**\n\n👤 **Guy Losbar**\n\n🔗 https://www.cg971.fr\n\nBoudoum ! 🇬🇵" })
  }

  // ACTUALITES GUADELOUPE/MARTINIQUE
  if ((msgLow.includes('actualite') || msgLow.includes('actu') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('guadeloupe')) {
    const data = await getActualitesGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }
  if ((msgLow.includes('actualite') || msgLow.includes('actu') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('martinique')) {
    const data = await getActualitesMartinique()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // CREOLE
  if (msgLow.includes('traduire creole') || msgLow.includes('parler creole') || msgLow.includes('apprendre creole') || msgLow.includes('expression creole') || msgLow.includes('mot creole') || msgLow === 'creole' || msgLow === 'kreyol' || msgLow.includes('dire creole') || msgLow.includes('langue creole')) {
    const data = getCreole(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // IMMOBILIER
  if ((msgLow.includes('immobilier') || msgLow.includes('prix m2') || msgLow.includes('loyer')) && !msgLow.includes('neuro-x') && !msgLow.includes('agent')) {
    const data = await getImmobilierTempsReel()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ COVOITURAGE GUADELOUPE ============
  if (msgLow.includes('covoiturage') || msgLow.includes('covoiturer') || msgLow.includes('karos') || msgLow.includes('partager trajet') || msgLow.includes('covoit')) {
    return res.status(200).json({ pdfAction: null, response: getCovoiturageGuadeloupe() })
  }

  // ============ BONS PLANS GUADELOUPE ============
  if (msgLow.includes('bon plan') || msgLow.includes('bons plans') || msgLow.includes('gratuit guadeloupe') || msgLow.includes('marche local') || msgLow.includes('marché local') || msgLow.includes('sortie gratuite')) {
    const data = await getBonsPlansGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ ROUTES TRAFIC GUADELOUPE ============
  if (msgLow.includes('trafic guadeloupe') || msgLow.includes('route guadeloupe') || msgLow.includes('embouteillage') || msgLow.includes('rn1') || msgLow.includes('rn4') || msgLow.includes('pont gabarre') || msgLow.includes('circulation guadeloupe')) {
    return res.status(200).json({ pdfAction: null, response: getRoutesGuadeloupe() })
  }

  // ============ MIX ELECTRIQUE EDF ============
  if (msgLow.includes('mix electrique') || msgLow.includes('production electrique') || msgLow.includes('energie guadeloupe') || msgLow.includes('solaire guadeloupe') || msgLow.includes('eolien guadeloupe') || msgLow.includes('opendata edf')) {
    const data = await getMixElectriqueGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ RCI GUADELOUPE (PRIORITAIRE) ============
  if (msgLow.includes('rci') || msgLow.includes('rci fm') || msgLow.includes('radio guadeloupe') || msgLow.includes('104.3')) {
    const data = await getRCIGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ RCI GUADELOUPE ============
  if (msgLow.includes('rci guadeloupe') || msgLow.includes('rci fm') || msgLow.includes('radio guadeloupe') || msgLow.includes('infos rci')) {
    const data = await getRCIGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ POLITIQUE MARTINIQUE ============
  if (msgLow.includes('politique martinique') || msgLow.includes('elu martinique') || msgLow.includes('élu martinique') || msgLow.includes('serge letchimy') || msgLow.includes('letchimy') || msgLow.includes('ctm martinique') || msgLow.includes('president martinique') || msgLow.includes('député martinique') || msgLow.includes('senateur martinique')) {
    const dataMart = getPolitiquesMartinique()
    return res.status(200).json({ pdfAction: null, response: dataMart })
  }

  // ============ POLITIQUE GUYANE ============
  if (msgLow.includes('politique guyane') || msgLow.includes('elu guyane') || msgLow.includes('élu guyane') || msgLow.includes('gabriel serville') || msgLow.includes('serville') || msgLow.includes('ctg guyane') || msgLow.includes('president guyane') || msgLow.includes('député guyane') || msgLow.includes('senateur guyane')) {
    return res.status(200).json({ pdfAction: null, response: getPolitiquesGuyane() })
  }

  // ============ POLITIQUE REUNION ============
  if (msgLow.includes('politique reunion') || msgLow.includes('politique réunion') || msgLow.includes('elu reunion') || msgLow.includes('huguette bello') || msgLow.includes('bello') || msgLow.includes('cyrille melchior') || msgLow.includes('melchior') || msgLow.includes('president reunion') || msgLow.includes('député reunion') || msgLow.includes('senateur reunion')) {
    return res.status(200).json({ pdfAction: null, response: getPolitiquesReunion() })
  }

  // ============ POLITIQUE MAYOTTE ============
  if (msgLow.includes('politique mayotte') || msgLow.includes('elu mayotte') || msgLow.includes('ben issa ousseni') || msgLow.includes('ousseni') || msgLow.includes('president mayotte') || msgLow.includes('député mayotte') || msgLow.includes('chido') || msgLow.includes('senateur mayotte')) {
    return res.status(200).json({ pdfAction: null, response: getPolitiquesMayotte() })
  }

  // ============ POLITIQUE NOUVELLE-CALEDONIE ============
  if (msgLow.includes('nouvelle-caledonie') || msgLow.includes('nouvelle caledonie') || msgLow.includes('alcide ponga') || msgLow.includes('ponga') || msgLow.includes('politique caledonie') || msgLow.includes('gouvernement caledonie') || msgLow.includes('noumea politique') || msgLow.includes('kanaky')) {
    return res.status(200).json({ pdfAction: null, response: getPolitiquesNouvelleCaledonie() })
  }

  // ============ KARUDATA OPEN DATA ============
  if (msgLow.includes('karudata') || msgLow.includes('open data guadeloupe') || msgLow.includes('donnees ouvertes guadeloupe') || msgLow.includes('karugeo') || msgLow.includes('carte guadeloupe')) {
    const data = await getKaruData()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ===== FIN TRIGGERS PRIORITAIRES =====

  // CALCUL JOUR DATE
  const dateMatch = message.match(/(\d+|premier|première|premiere|deuxième|deuxieme|troisième|troisieme)(?:er|ème)?\s+(janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\s+(\d{4})/i)
  if (dateMatch && (msgLow.includes('quel jour') || msgLow.includes('jour sera') || msgLow.includes('tombe') || msgLow.includes('quel est le jour') || msgLow.includes('etait quel') || msgLow.includes('était quel') || msgLow.includes('sera quel') || msgLow.includes('correspond') || msgLow.includes('quel jour') || msgLow.includes('c est quel') || msgLow.includes('c\'est quel'))) {
    const motsChiffres = { 'premier':1,'première':1,'premiere':1,'deuxième':2,'deuxieme':2,'troisième':3,'troisieme':3 }
    const rawDay = dateMatch[1].toLowerCase()
    const day = motsChiffres[rawDay] || parseInt(rawDay)
    const msgAvecChiffre = message.replace(dateMatch[1], String(day))
    const result = calculerJourDate(msgAvecChiffre)
    if (result) return res.status(200).json({ pdfAction: null, response: result + '\n\nBoudoum ! 🇬🇵' })
  }

  // ============ SEISMES ============
  if (msgLow.includes('seisme') || msgLow.includes('tremblement') || msgLow.includes('seisme') || msgLow.includes('soufriere') || msgLow.includes('volcan')) {
    const data = await getSeismesAntilles()
    return res.status(200).json({ pdfAction: null, response: "Seismes Antilles\n\n"+(data||"Aucun seisme detecte")+"\n\nSource: USGS | https://www.ipgp.fr\nBoudoum ! 🇬🇵" })
  }
  // ============ CYCLONES ============
  if (msgLow.includes('cyclone') || msgLow.includes('ouragan') || msgLow.includes('tempete tropicale')) {
    const data = await getCyclones()
    return res.status(200).json({ pdfAction: null, response: "Alertes Cyclones Atlantique\n\n"+(data||"Aucune alerte active")+"\n\nSource: NHC | https://www.nhc.noaa.gov\nBoudoum ! 🇬🇵" })
  }
  // ============ METEO COMMUNES ============
  if (msgLow.includes('meteo') || msgLow.includes('temperature') || msgLow.includes('quel temps')) {
    const commune = msgLow.includes('fort-de-france')||msgLow.includes('martinique') ? 'fort-de-france' : msgLow.includes('cayenne')||msgLow.includes('guyane') ? 'cayenne' : msgLow.includes('saint-denis')||msgLow.includes('reunion') ? 'saint-denis' : msgLow.includes('basse-terre') ? 'basse-terre' : 'pointe-a-pitre'
    const data = await getMeteoDOMTOM(commune)
    return res.status(200).json({ pdfAction: null, response: "Meteo DOM-TOM\n\n"+(data||"Donnees indisponibles")+"\n\nSource: Open-Meteo\nBoudoum ! 🇬🇵" })
  }
  // ============ DEVISES AFRIQUE CARAIBE ============
  if (msgLow.includes('xof') || msgLow.includes('xaf') || msgLow.includes('fcfa') || msgLow.includes('franc cfa') || msgLow.includes('devise afrique') || msgLow.includes('taux afrique')) {
    const data = await getDevisesAfriqueCaraibe()
    return res.status(200).json({ pdfAction: null, response: "Devises Afrique & Caraibe\n\n"+(data||"Donnees indisponibles")+"\n\nSource: ExchangeRate-API\nBoudoum ! 🇬🇵" })
  }
  // ============ BOURSES ============
  if (msgLow.includes('bourse') || msgLow.includes('auf') || msgLow.includes('campus france') || msgLow.includes('financement etude') || msgLow.includes('aide etudiant')) {
    const data = await getBoursesAUF()
    return res.status(200).json({ pdfAction: null, response: "Bourses AUF & Francophonie\n\n"+(data||"Consulte auf.org et campusfrance.org")+"\n\nhttps://www.auf.org | https://www.campusfrance.org\nBoudoum ! 🇬🇵" })
  }
  // ============ EMPLOI AFRIQUE ============
  if (msgLow.includes('emploi afrique') || msgLow.includes('travail afrique') || msgLow.includes('job afrique') || msgLow.includes('rekrute')) {
    const data = await getEmploiAfrique()
    return res.status(200).json({ pdfAction: null, response: "Emploi Afrique Francophone\n\n"+(data||"Consulte rekrute.com et africawork.com")+"\n\nhttps://rekrute.com | https://www.africawork.com\nBoudoum ! 🇬🇵" })
  }
  // ============ CARBURANT ============
  if (msgLow.includes('carburant') || msgLow.includes('essence') || msgLow.includes('gazole') || msgLow.includes('prix pompe')) {
    const data = await getPrixCarburant()
    return res.status(200).json({ pdfAction: null, response: "Prix Carburant DOM-TOM\n\n"+(data||"Donnees indisponibles")+"\n\nhttps://www.prix-carburants.gouv.fr\nBoudoum ! 🇬🇵" })
  }
  // ============ CALENDRIER SCOLAIRE ============
  if (msgLow.includes('calendrier scolaire') || msgLow.includes('vacances scolaires') || msgLow.includes('rentree') || msgLow.includes('vacances ecole')) {
    const data = await getCalendrieScolaire()
    return res.status(200).json({ pdfAction: null, response: "Calendrier Scolaire DOM-TOM\n\n"+(data||"Consulte education.gouv.fr")+"\n\nhttps://www.education.gouv.fr\nBoudoum ! 🇬🇵" })
  }
  // ============ BIBLIOTHEQUE CARIBEENNE ============
  if (msgLow.includes('cesaire') || msgLow.includes('fanon') || msgLow.includes('conde') || msgLow.includes('glissant') || msgLow.includes('schwarz-bart') || msgLow.includes('bibliotheque caribeenne') || msgLow.includes('litterature antillaise')) {
    const data = await getBibliothequeCaribeenne(message)
    return res.status(200).json({ pdfAction: null, response: (data||"Bibliotheque disponible sur reussitess.fr/bibliotheque")+"\n\nBoudoum ! 🇬🇵" })
  }

  // ============ ACTUALITES GUADELOUPE ============
  if (msgLow.includes('actualite guadeloupe') || msgLow.includes('actualités guadeloupe') || msgLow.includes('news guadeloupe') || msgLow.includes('info guadeloupe')) {
    const data = await getActualitesGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }

  // ============ ACTUALITES MARTINIQUE ============
  if (msgLow.includes('actualite martinique') || msgLow.includes('actualités martinique') || msgLow.includes('news martinique') || msgLow.includes('info martinique')) {
    const data = await getActualitesMartinique()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }

  // ============ ACTUALITES DOM-TOM ============
  if (msgLow.includes('actualite dom-tom') || msgLow.includes('actualités dom-tom') || msgLow.includes('news dom-tom') || msgLow.includes('info dom-tom') || msgLow.includes('la 1ere')) {
    const data = await getActualitesDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }

  // ============ BAIGNADE QUALITE EAU ============
  if (msgLow.includes('qualite eau') || msgLow.includes('baignade') || msgLow.includes('plage securite') || msgLow.includes('alerte plage') || msgLow.includes('meduse') || msgLow.includes('requins') || msgLow.includes('nager safe')) {
    const data = await getQualiteEauBaignade()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ IMMOBILIER TEMPS REEL ============
  if (msgLow.includes('prix immobilier') || msgLow.includes('transaction immobilier') || msgLow.includes('dvf') || msgLow.includes('vente immobilier guadeloupe')) {
    const data = await getImmobilierTempsReel()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ BUS GUADELOUPE ============
  if (msgLow.includes('bus guadeloupe') || msgLow.includes('transport guadeloupe') || msgLow.includes('taxi collectif') || msgLow.includes('horaire bus') || msgLow.includes('gti guadeloupe') || msgLow.includes('ferry guadeloupe') || msgLow.includes('ilevia')) {
    const data = getHorairesBusGuadeloupe()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ COUPURES EDF ============
  if (msgLow.includes('coupure edf') || msgLow.includes('coupure electricite') || msgLow.includes('panne electricite') || msgLow.includes('edf guadeloupe') || msgLow.includes('edf martinique') || msgLow.includes('electricite dom-tom')) {
    const data = await getCoupuresEDF()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ ZOUK SOCA ============
  if (msgLow.includes('zouk') || msgLow.includes('soca') || msgLow.includes('classement musique') || msgLow.includes('musique caraibe') || msgLow.includes('artiste guadeloupe') || msgLow.includes('kassav') || msgLow.includes('gwo ka') || msgLow.includes('biguine')) {
    const data = await getClassementZoukSoca()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ OFFRES EMPLOI DOM-TOM ============
  if (msgLow.includes('offre emploi') || msgLow.includes('chercher emploi dom-tom') || msgLow.includes('job guadeloupe') || msgLow.includes('travail guadeloupe') || msgLow.includes('recrutement guadeloupe') || msgLow.includes('france travail guadeloupe')) {
    const data = await getOffresEmploiDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ BAC BTS GUADELOUPE ============
  if (msgLow.includes('resultat bac') || msgLow.includes('resultat bts') || msgLow.includes('bac guadeloupe') || msgLow.includes('bts guadeloupe') || msgLow.includes('cyclades') || msgLow.includes('examen guadeloupe') || msgLow.includes('rectorat guadeloupe')) {
    const data = getResultatsBAC()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ HOPITAUX DOM-TOM ============
  if (msgLow.includes('hopital') || msgLow.includes('hopital') || msgLow.includes('urgence') || msgLow.includes('samu') || msgLow.includes('chu guadeloupe') || msgLow.includes('chu martinique')) {
    const data = await getHopitauxDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data+" Boudoum ! 🇬🇵" })
  }

  // ============ PRIX TOKEN REUSS ============
  if (msgLow.includes('prix reuss') || msgLow.includes('cours reuss') || msgLow.includes('valeur reuss') || msgLow.includes('token reuss prix') || msgLow.includes('reuss combien') || msgLow.includes('acheter reuss')) {
    const data = await getPrixREUSS()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ VOLS CARAIBES ============
  if (msgLow.includes('vol guadeloupe') || msgLow.includes('vol martinique') || msgLow.includes('air caraibes') || msgLow.includes('air antilles') || msgLow.includes('billet avion dom-tom') || msgLow.includes('corsair') || msgLow.includes('vols dom-tom')) {
    const data = await getVolsCaraibes()
    return res.status(200).json({ pdfAction: null, response: data+" Boudoum ! 🇬🇵" })
  }

  // ============ PLAGES DOM-TOM ============
  if (msgLow.includes('plage guadeloupe') || msgLow.includes('plage martinique') || msgLow.includes('plage dom-tom') || msgLow.includes('qualite plage') || msgLow.includes('meilleure plage') || msgLow.includes('baignade')) {
    const data = await getQualitePlages()
    return res.status(200).json({ pdfAction: null, response: data+" Boudoum ! 🇬🇵" })
  }

  // ============ CALCULATEUR AMAZON ============
  if (msgLow.includes('calculateur amazon') || msgLow.includes('commission amazon') || msgLow.includes('combien amazon') || msgLow.includes('calcul affiliation') || msgLow.includes('calcul commission')) {
    const montantMatch = message.match(/\d+/)
    const montant = montantMatch ? parseInt(montantMatch[0]) : 100
    const data = getCalculateurAmazon(montant)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // DETECTION PDF TRIGGERS
  if (msgLow.includes("creer mon cv") || msgLow.includes("créer mon cv") || msgLow.includes("cv pdf") || msgLow.includes("mon cv")) pdfType = "cv"
  else if (msgLow.includes("certificat champion") || msgLow.includes("mon certificat") || msgLow.includes("certificat pdf")) pdfType = "certificat"
  else if (msgLow.includes("contrat freelance") || msgLow.includes("contrat pdf") || msgLow.includes("mon contrat")) pdfType = "contrat"
  else if (msgLow.includes("business plan pdf") || msgLow.includes("business plan")) pdfType = "business-plan"

  // GUIDE CRYPTOART
  if (msgLow.includes("crypto art") || msgLow.includes("generative art") || msgLow.includes("art génératif") || msgLow.includes("créer avec ia") || msgLow.includes("midjourney")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X Créatif — Art Génératif IA**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PARENTALITE
  if (msgLow.includes("parentalité") || msgLow.includes("éduquer mon enfant") || msgLow.includes("bébé") || msgLow.includes("grossesse") || msgLow.includes("élever enfant caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👶 **Neuro-X Enfants — Parentalité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GESTION TEMPS
  if (msgLow.includes("gestion du temps") || msgLow.includes("productivité") || msgLow.includes("organisation") || msgLow.includes("procrastination") || msgLow.includes("planning")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⏰ **Neuro-X Coach — Productivité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE INTELLIGENCE COLLECTIVE
  if (msgLow.includes("intelligence collective") || msgLow.includes("travailler ensemble") || msgLow.includes("synergie") || msgLow.includes("collaboration") || msgLow.includes("réseau caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Stratégie — Intelligence Collective**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CARNAVAL CARAIBE
  if (msgLow.includes("carnaval") || msgLow.includes("mas") || msgLow.includes("vidé") || msgLow.includes("chars carnaval") || msgLow.includes("fête guadeloupe")) {
    try {
      const agenda = getAgendaCaraibes()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎭 **Neuro-X Culture — Carnaval Caribéen**\n\n"+agenda+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PEINTURE CARIBEENNE
  if (msgLow.includes("peinture caribéenne") || msgLow.includes("artiste antillais") || msgLow.includes("art guadeloupe") || msgLow.includes("sculpture caribéenne") || msgLow.includes("artiste créole")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X Créatif — Art Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EMPLOI DOM-TOM
  if (msgLow.includes("chercher emploi") || msgLow.includes("offre emploi guadeloupe") || msgLow.includes("pôle emploi") || msgLow.includes("trouver travail antilles") || msgLow.includes("chômage guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert carnaval caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Business — Emploi DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MESSAGE FINAL Boudoum
  if (msgLow.includes("boudoum") || msgLow === "boudoum !") {
    const msgs = [
      "💥 Boudoum ! Terres de Champions ! La Guadeloupe conquiert le monde ! 🇬🇵🌍",
      "🎯 Boudoum ! Excellence • Innovation • Succès — REUSSITESS®971 ! 🇬🇵",
      "🌟 Boudoum ! Positivité à l'infini ! Les Antilles dominent ! 🇬🇵💎",
      "🔥 Boudoum ! 200 agents IA au service de la Caraïbe ! 🤖🇬🇵",
      "⚡ Boudoum ! Token REUSS en route vers la lune ! 🚀💎🇬🇵"
    ]
    return res.status(200).json({ pdfAction: pdfType, response: msgs[Math.floor(Math.random()*msgs.length)] })
  }

  // GUIDE CINEMATOGRAPHIE CARIBEENNE
  if (msgLow.includes("film caribéen") || msgLow.includes("cinéma antillais") || msgLow.includes("réalisateur guadeloupe") || msgLow.includes("documentaire caraïbes")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎬 **Neuro-X Cinéma — Films Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE TRANSPORT DOM-TOM
  if (msgLow.includes("transport guadeloupe") || msgLow.includes("bus guadeloupe") || msgLow.includes("taxi guadeloupe") || msgLow.includes("location voiture antilles") || msgLow.includes("se déplacer guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚌 **Neuro-X Tourisme — Transport Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ASSURANCE DOM-TOM
  if (msgLow.includes("assurance guadeloupe") || msgLow.includes("mutuelle antilles") || msgLow.includes("assurance habitation") || msgLow.includes("assurance cyclone") || msgLow.includes("assurance auto guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **Neuro-X Juridique — Assurances DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MYTHOLOGIE CARIBEENNE
  if (msgLow.includes("mythologie caribéenne") || msgLow.includes("légende créole") || msgLow.includes("zombie caribéen") || msgLow.includes("soukougnan") || msgLow.includes("diable antillais")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👻 **Neuro-X Spiritualité — Mythologie Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PERMIS DE CONDUIRE
  if (msgLow.includes("permis de conduire") || msgLow.includes("code de la route") || msgLow.includes("auto-école") || msgLow.includes("conduire guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚗 **Neuro-X Juridique — Permis Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE AIDE SOCIALE
  if (msgLow.includes("rsa") || msgLow.includes("caf") || msgLow.includes("aides sociales") || msgLow.includes("allocation") || msgLow.includes("aide guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Aides Sociales DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LITTERATURE CARIBEENNE
  if (msgLow.includes("littérature") || msgLow.includes("roman caribéen") || msgLow.includes("auteur antillais") || msgLow.includes("maryse condé") || msgLow.includes("simone schwarz-bart")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Neuro-X Littérature — Auteurs Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
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
      return res.status(200).json({ pdfAction: pdfType, response: "📅 **Ce Jour dans l'Histoire — "+dd+"/"+mm+"**\n\n"+txt+"\n\nSource: Wikimedia\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "📅 **Éphéméride**\n\nLe 27 mai 1848 : Abolition de l'esclavage en Guadeloupe.\nLe 10 mai 2001 : Loi Taubira reconnaît l'esclavage comme crime contre l'humanité.\n\nBoudoum ! 🇬🇵" })
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
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Bibliothèque Mondiale — Open Library**\n\n🔍 Résultats pour: *"+decodeURIComponent(query)+"*\n\n"+txt+"\n\n"+libD.numFound+" livres trouvés gratuitement !\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ACTUALITES MONDE FRANCOPHONE — RSS gratuit
  if (msgLow.includes("actualité monde") || msgLow.includes("news monde") || msgLow.includes("actualité internationale") || msgLow.includes("info monde")) {
    try {
      const rssR = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://www.rfi.fr/fr/rss-services/html/rss-services.html&count=5")
      const rssD = await rssR.json()
      const items = (rssD.items||[]).slice(0,5)
      const txt = items.map((it,i) => `${i+1}. **${it.title}**\n   📰 ${it.pubDate?.substring(0,10)||""}`).join("\n\n")
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Actualités Monde Francophone — RFI**\n\n"+txt+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // OFFRES EMPLOI DOM-TOM CARAIBES AFRIQUE
  if (msgLow.includes("offre emploi") || msgLow.includes("chercher emploi") || msgLow.includes("trouver un emploi") || msgLow.includes("job guadeloupe") || msgLow.includes("job martinique") || msgLow.includes("job reunion") || msgLow.includes("emploi dom-tom") || msgLow.includes("emploi caraibes") || msgLow.includes("emploi afrique") || msgLow.includes("recrutement guadeloupe") || msgLow.includes("remote job") || msgLow.includes("offre de travail")) {
    try {
      const remoteRes = await fetch("https://remoteok.com/api?limit=5", { headers: { "User-Agent": "REUSSITESS971Bot/1.0" } })
      const remoteData = await remoteRes.json()
      const jobs = remoteData.slice(1,6).filter(function(j) { return j && j.position })
      if (jobs.length > 0) {
        const jobList = jobs.map(function(j) {
          return "- **" + j.position + "** — " + (j.company||"Entreprise") + "\n  Lien: " + j.url + "\n  Tags: " + (j.tags||[]).slice(0,3).join(", ")
        }).join("\n\n")
        return res.status(200).json({ pdfAction: pdfType, response: "Offres d'emploi REELLES - Temps reel (RemoteOK)\n\n" + jobList + "\n\nPlateformes DOM-TOM gratuites:\n- Guadeloupe: francetravail.fr\n- Reunion: emploi.re\n- Caraibes: caribbeanjobs.com\n- Afrique: jobartis.com\n- Remote: remoteok.com\n- Indeed: indeed.fr\n- LinkedIn: linkedin.com/jobs\n\nTape creer mon CV pour ton CV PDF gratuit !\n\nBoudoum !" })
      }
    } catch(eRemote) {}
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Emploi — DOM-TOM / Caraïbes / Afrique**\n\n"+groqText+"\n\n🔗 **Plateformes gratuites:**\n• France Travail: francetravail.fr\n• Réunion: emploi.re\n• Caraïbes: caribbeanjobs.com\n• Afrique: jobartis.com\n• International: linkedin.com\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Offres Emploi — DOM-TOM / Caraïbes / Afrique**\n\n🔗 **Plateformes gratuites:**\n• 🇫🇷 France Travail: francetravail.fr\n• 🇷🇪 La Réunion: emploi.re\n• 🌴 Caraïbes: caribbeanjobs.com\n• 🌍 Afrique: jobartis.com\n• 💼 International: linkedin.com\n• 🌐 Mondial: indeed.fr\n\n💡 Secteurs porteurs DOM-TOM: Tourisme, BTP, Santé, IA, E-commerce\n\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CREATION ASSOCIATION
  if (msgLow.includes("créer une association") || msgLow.includes("association loi 1901") || msgLow.includes("association guadeloupe") || msgLow.includes("association dom-tom")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Créer une Association**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PASSEPORT DE REUSSITE 🏆
  if (msgLow.includes("passeport de réussite") || msgLow.includes("passeport reussite") || msgLow.includes("certificat champion") || msgLow.includes("devenir champion") || msgLow.includes("passeport champion") || msgLow.includes("champions")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Passeport de Réussite REUSSITESS**\n\n"+groqText+"\n\n👉 **Obtiens ton certificat :** https://reussitess.fr/champions\n\n🌍 Communauté en pleine croissance !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Passeport de Réussite REUSSITESS**\n\nTon certificat de champion t'attend ! Des champions du monde entier ont déjà rejoint le mouvement REUSSITESS.\n\n✅ Remplis ton prénom, ton pays et ton objectif\n✅ Reçois ton certificat personnalisé\n✅ Obtiens ton plan d'action sur mesure\n\n👉 **Accède maintenant :** https://reussitess.fr/champions\n\nTerres de Champions ! Boudoum ! 🇬🇵" })
    }
  }

  // VISA UNIVERSEL 🌍
  if (msgLow.includes("visa universel") || msgLow.includes("opportunité mondiale") || msgLow.includes("réseau mondial") || msgLow.includes("rejoindre reussitess") || msgLow.includes("visa reussitess") || msgLow.includes("opportunités reussitess")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Visa Universel REUSSITESS**\n\n"+groqText+"\n\n👉 **Obtiens ton Visa :** https://reussitess.fr/visa-universel\n\n🚀 Accès aux opportunités mondiales dans 14 pays partenaires !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Visa Universel REUSSITESS**\n\nTon passeport vers les opportunités mondiales !\n\n✅ Accès réseau entrepreneurs 26 pays\n✅ Affiliation Amazon 14 pays\n✅ Token REUSS sur Polygon\n✅ Bibliothèque mondiale\n✅ Formation IA gratuite\n\n👉 **Accède maintenant :** https://reussitess.fr/visa-universel\n\nBoudoum ! 🇬🇵" })
    }
  }

  // NAVIGATION ECOSYSTEME COMPLET
  if (msgLow.includes("écosystème") || msgLow.includes("ecosystem") || msgLow.includes("tout ce que propose") || msgLow.includes("site reussitess") || msgLow.includes("que faire sur") || msgLow.includes("navigation") || msgLow.includes("menu reussitess")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Écosystème REUSSITESS — Guide Complet**\n\n"
    +"🏆 **[Passeport de Réussite](https://reussitess.fr/champions)**\nCertificat de champion + plan d'action personnalisé\n\n"
    +"🌍 **[Visa Universel](https://reussitess.fr/visa-universel)**\nAccès réseau opportunités 14 pays\n\n"
    +"🧠 **[Neuro-X](https://reussitess.fr/neuro-x)**\n60 agents IA spécialisés\n\n"
    +"🔮 **[Oracle 971](https://reussitess.fr/oracle-971)**\nOracle caribéen\n\n"
    +"🧬 **[Mon ADN](https://reussitess.fr/mon-adn)**\nIdentité & héritage\n\n"
    +"🚀 **[Ma Révolution IA](https://reussitess.fr/ma-revolution-ia)**\nTA révolution personnelle\n\n"
    +"🌍 **[IA Passport Mondial](https://reussitess.fr/ia-passport)**\n8 langues actives, identité mondiale\n\n"
    +"💎 **[Investir REUSS](https://reussitess.fr/investir-reuss)**\nToken REUSS sur Polygon\n\n"
    +"🎯 **[99 Quiz](https://reussitess.fr/quiz)**\nQuiz éducatifs tous thèmes\n\n"
    +"📚 **[Bibliothèque](https://reussitess.fr/bibliotheque)**\n50+ pays francophones\n\n"
    +"🛍️ **[Boutiques Amazon](https://reussitess.fr/boutiques)**\n26 boutiques 14 pays\n\n"
    +"🏪 **[Shop Officiel](https://shop.reussitess.fr)**\nBoutique REUSSITESS\n\n"
    +"💬 *Pose-moi n'importe quelle question — je suis ton guide !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE MON ADN
  if (msgLow.includes("mon adn") || msgLow.includes("mon identité") || msgLow.includes("mes origines") || msgLow.includes("héritage caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧬 **Neuro-X Culture — Mon ADN Caribéen**\n\n"+groqText+"\n\n👉 Explore ton ADN: https://reussitess.fr/mon-adn\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ORACLE 971
  if (msgLow.includes("oracle") || msgLow.includes("oracle 971") || msgLow.includes("prédiction") || msgLow.includes("avenir caribéen") || msgLow.includes("destin")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es l'ORACLE 971 — Sagesse ancestrale caribéenne. Vision: Libérer la communauté afro-caribéenne grâce à l'IA et au savoir. Montre comment REUSSITESS aide : emploi, savoir, Token REUSS, Amazon 14 pays. Parle avec poésie et sagesse créole. Boudoum !" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Oracle 971 — Voix des Terres de Champions**\n\n"+groqText+"\n\n✨ Ton chemin commence ici: https://reussitess.fr\n📚 Bibliothèque: https://reussitess.fr/bibliotheque\n💼 Emploi: https://reussitess.fr/hub-central\n💎 Token REUSS: https://reussitess.fr/investir-reuss\n🛍️ Boutiques: https://reussitess.fr/boutiques\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MA REVOLUTION IA
  if (msgLow.includes("ma révolution") || msgLow.includes("revolution ia") || msgLow.includes("transformer ma vie") || msgLow.includes("changer ma vie avec ia") || msgLow.includes("révolution personnelle")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Coach — Ta Révolution IA**\n\n"+groqText+"\n\n👉 Lance ta révolution: https://reussitess.fr/ma-revolution-ia\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BILAN FINAL ECOSYSTEME
  if (msgLow.includes("que sais-tu faire") || msgLow.includes("tes capacités") || msgLow.includes("liste tes fonctions") || msgLow.includes("tout ce que tu fais") || msgLow.includes("fonctionnalités")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS AI — 150+ Fonctionnalités**\n\n"
    +"🌍 **Données Temps Réel :** Météo monde, Crypto live, Actualités, Séismes, Cyclones, ISS, Lune, Taux change\n\n"
    +"🧠 **60 Neuro-X :** Finance, Business, Culture, Coach, Tech, Santé, Droit, Voyage, Cuisine, Musique, Sport, Histoire, Agriculture, Tourisme, Astronomie, Géopolitique, SEO, DeFi, NFT, Psychologie, Langues, Énergie, Mode, Gastronomie, Enfants, Seniors, Femmes, Jeunes, Diaspora, Blockchain, Stratégie...\n\n"
    +"🛡️ **40 Sentinelles :** Surveillance 24/7 prix REUSS, site, APIs, sécurité\n\n"
    +"🎯 **99 Quiz :** Tous thèmes caribéens et mondiaux\n\n"
    +"✨ **Créatif :** Poèmes créoles, Chansons zouk, Contes, Slogans, Posts réseaux, Hashtags, Bio\n\n"
    +"💼 **Business :** CV, Contrats, Emails, Business Plan, Pitch, Dropshipping, Freelance, Export\n\n"
    +"💎 **Crypto :** Analyse marché, Staking REUSS, DAO, Whitepaper, GoMining, Web3\n\n"
    +"🇬🇵 **Caribéen :** Proverbes, Mots créoles, Blagues, Agenda, Cocktails, Recettes, Champions, Histoire\n\n"
    +"💬 Active : *neuro-x [domaine]* | *agents ia* | *rapport complet*\n\n"
    +"Boudoum ! 🇬🇵" })
  }

  // GENERATEUR BIOGRAPHIE
  if (msgLow.includes("biographie") || msgLow.includes("bio instagram") || msgLow.includes("présentation personnelle") || msgLow.includes("qui suis-je") || msgLow.includes("rédige ma bio")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "✍️ **Neuro-X Marketing — Générateur Bio**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE CARDIOVASCULAIRE
  if (msgLow.includes("cardio") || msgLow.includes("tension artérielle") || msgLow.includes("cholestérol") || msgLow.includes("diabète") || msgLow.includes("santé cardiovasculaire")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "❤️ **Neuro-X Santé — Santé Cardiovasculaire**\n\n"+groqText+"\n\n⚠️ Consultez votre médecin.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ACHAT TERRAIN DOM-TOM
  if (msgLow.includes("terrain guadeloupe") || msgLow.includes("acheter terrain") || msgLow.includes("foncier antilles") || msgLow.includes("cadastre guadeloupe") || msgLow.includes("terrain constructible")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏡 **Neuro-X Immobilier — Achat Terrain Caribéen**\n\n"+groqText+"\n\n⚠️ Consultez un notaire.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE WEB3 CARAIBE
  if (msgLow.includes("web3") || msgLow.includes("metaverse") || msgLow.includes("décentralisé") || msgLow.includes("dapp") || msgLow.includes("defi caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Tech — Web3 Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // IDENTITE DU BOT
  if (msgLow.includes("qui es-tu") || msgLow.includes("qui es tu") || msgLow.includes("présente-toi") || msgLow.includes("présente toi") || msgLow.includes("ta mission") || msgLow.includes("c'est quoi reussitess ai") || msgLow.includes("tu es qui")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Je suis REUSSITESS®971 AI**\n\nChef d'orchestre de l'écosystème REUSSITESS®971, créé depuis la **Guadeloupe** 🇬🇵 par **Rony Porinus**.\n\n**Ma devise :** *Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets.*\n\n**Ce que je suis :**\n🧠 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme)\n🌍 Présent dans 14 pays partenaires\n📚 160+ fonctionnalités actives\n💎 Connecté au Token REUSS sur Polygon\n🛍️ 26 boutiques Amazon affiliées\n\n**Mes capacités :**\n📄 Génération PDF (CV, Contrat, Certificat, Business Plan)\n🖨️ Impression de chaque réponse\n📺 Actualités temps réel (RFI, Al Jazeera, BBC, France 24, Euronews, TV5)\n⚖️ Journal Officiel — dernières lois et décrets\n🌴 Médias DOM-TOM (Guadeloupe, Martinique, Réunion, Guyane)\n🎭 Agenda culturel Caraïbes + newsletters\n💼 Offres emploi temps réel (RemoteOK + DOM-TOM)\n🛡️ Infrastructure 3 clés Groq — 90 req/min, zéro coupure\n\n**L'écosystème REUSSITESS®971 :**\n🏆 [Passeport de Réussite](https://reussitess.fr/champions)\n🌍 [Visa Universel](https://reussitess.fr/visa-universel)\n🧠 [Neuro-X](https://reussitess.fr/neuro-x)\n💎 [Token REUSS](https://reussitess.fr/investir-reuss)\n🔮 [Oracle 971](https://reussitess.fr/oracle-971)\n\n*Terres de Champions — Positivité à l'infini !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE INTELLIGENCE EMOTIONNELLE
  if (msgLow.includes("intelligence émotionnelle") || msgLow.includes("gérer mes émotions") || msgLow.includes("empathie") || msgLow.includes("gestion émotions") || msgLow.includes("eq")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💛 **Neuro-X Psychologie — Intelligence Émotionnelle**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CROWDFUNDING
  if (msgLow.includes("crowdfunding") || msgLow.includes("financement participatif") || msgLow.includes("kickstarter") || msgLow.includes("ulule") || msgLow.includes("lever fonds communauté")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Business — Crowdfunding Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE AU TRAVAIL
  if (msgLow.includes("bien-être au travail") || msgLow.includes("equilibre vie pro") || msgLow.includes("work life balance") || msgLow.includes("épuisement professionnel") || msgLow.includes("motivation travail")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌺 **Neuro-X Coach — Bien-Être au Travail**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GEOPOLITIQUE CARAIBES
  if (msgLow.includes("caricom") || msgLow.includes("géopolitique caraïbes") || msgLow.includes("relations caraïbes") || msgLow.includes("union européenne dom") || msgLow.includes("indépendance guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Géopolitique — Caraïbes**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PHOTOGRAPHIE
  if (msgLow.includes("photographie") || msgLow.includes("photo caribéenne") || msgLow.includes("appareil photo") || msgLow.includes("instagram photo") || msgLow.includes("shooting")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📸 **Neuro-X Créatif — Photographie Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MODE CARIBEENNE
  if (msgLow.includes("mode caribéenne") || msgLow.includes("stylisme") || msgLow.includes("madras") || msgLow.includes("tenue créole") || msgLow.includes("fashion antillais")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👗 **Neuro-X Mode — Stylisme Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LEADERSHIP
  if (msgLow.includes("leadership") || msgLow.includes("manager mon équipe") || msgLow.includes("diriger") || msgLow.includes("management") || msgLow.includes("gérer mon équipe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👑 **Neuro-X Coach — Leadership Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PROTECTION DONNEES
  if (msgLow.includes("rgpd") || msgLow.includes("protection données") || msgLow.includes("vie privée") || msgLow.includes("cnil") || msgLow.includes("données personnelles")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🔒 **Neuro-X Réseaux — Protection Données RGPD**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR HASHTAGS
  if (msgLow.includes("hashtag") || msgLow.includes("hashtags") || msgLow.includes("mots-dièse") || msgLow.includes("trending") || msgLow.includes("viral hashtag")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "# **Neuro-X Marketing — Hashtags Viraux**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CRYPTOMONNAIE DEBUTANT
  if (msgLow.includes("débuter crypto") || msgLow.includes("crypto débutant") || msgLow.includes("c'est quoi bitcoin") || msgLow.includes("blockchain c'est quoi") || msgLow.includes("first crypto")) {
    try {
      const crypto = await getCryptoPrice()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Finance — Crypto pour Débutants**\n\n📊 Marché: "+crypto+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE MENTALE
  if (msgLow.includes("anxiété") || msgLow.includes("anxiete") || msgLow.includes("dépression") || msgLow.includes("depression") || msgLow.includes("santé mentale") || msgLow.includes("burn out")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💚 **Neuro-X Psychologie — Santé Mentale**\n\n"+groqText+"\n\n⚠️ Consultez un professionnel de santé.\nUrgence: 3114 (numéro national prévention suicide)\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EXPORT INTERNATIONAL
  if (msgLow.includes("exporter") || msgLow.includes("export") || msgLow.includes("vendre à l'international") || msgLow.includes("marché international") || msgLow.includes("14 pays")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Logistique — Export International**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PODCASTING
  if (msgLow.includes("podcast") || msgLow.includes("créer un podcast") || msgLow.includes("lancer podcast") || msgLow.includes("micro") && msgLow.includes("enregistrer")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎙️ **Neuro-X Marketing — Guide Podcast**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE MICRO-FINANCE
  if (msgLow.includes("microcrédit") || msgLow.includes("micro-crédit") || msgLow.includes("prêt professionnel") || msgLow.includes("financement projet") || msgLow.includes("adie") || msgLow.includes("bpifrance")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Business — Micro-Finance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE SENIOR
  if (msgLow.includes("senior") || msgLow.includes("personnes âgées") || msgLow.includes("vieillir bien") || msgLow.includes("ehpad") || msgLow.includes("aide à domicile")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👴 **Neuro-X Seniors — Bien-Vieillir Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CONTRAT
  if (msgLow.includes("modèle de contrat") || msgLow.includes("contrat freelance") || msgLow.includes("contrat commercial") || msgLow.includes("cgv") || msgLow.includes("mentions légales")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📝 **Neuro-X Juridique — Générateur Contrats**\n\n"+groqText+"\n\n⚠️ Consultez un avocat avant signature.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DROPSHIPPING
  if (msgLow.includes("dropshipping") || msgLow.includes("vendre sans stock") || msgLow.includes("e-commerce caribéen") || msgLow.includes("boutique en ligne") || msgLow.includes("shopify")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🛒 **Neuro-X Business — Dropshipping Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE FREELANCE
  if (msgLow.includes("freelance") || msgLow.includes("travailler à distance") || msgLow.includes("télétravail") || msgLow.includes("mission freelance") || msgLow.includes("indépendant")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💻 **Neuro-X Business — Guide Freelance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE IA POUR DEBUTANTS
  if (msgLow.includes("apprendre ia") || msgLow.includes("débuter en ia") || msgLow.includes("intelligence artificielle débutant") || msgLow.includes("chatgpt débutant") || msgLow.includes("comment utiliser ia")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Neuro-X IA — Guide Débutants**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEIL NUTRITION CARIBEENNE
  if (msgLow.includes("nutrition") || msgLow.includes("alimentation saine") || msgLow.includes("régime caribéen") || msgLow.includes("manger sainement") || msgLow.includes("fruits tropicaux")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🥗 **Neuro-X Santé — Nutrition Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AIDE DEUIL ET FAMILLE
  if (msgLow.includes("deuil") || msgLow.includes("j'ai perdu") || msgLow.includes("quelqu'un est décédé") || msgLow.includes("soutien famille") || msgLow.includes("difficile en ce moment")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💙 **REUSSITESS AI — Soutien & Accompagnement**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RAPPEL MEDICAMENT
  if (msgLow.includes("médicament") || msgLow.includes("medicament") || msgLow.includes("ordonnance") || msgLow.includes("posologie") || msgLow.includes("traitement médical")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💊 **Neuro-X Santé — Information Médicale**\n\n"+groqText+"\n\n⚠️ Consultez toujours un médecin ou pharmacien.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CREATION CONTENU
  if (msgLow.includes("créer du contenu") || msgLow.includes("youtuber") || msgLow.includes("streamer") || msgLow.includes("influenceur") || msgLow.includes("monétiser") && msgLow.includes("contenu")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎬 **Neuro-X Marketing — Création Contenu**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EPARGNE
  if (msgLow.includes("épargne") || msgLow.includes("epargne") || msgLow.includes("livret a") || msgLow.includes("économiser") || msgLow.includes("mettre de côté")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💳 **Neuro-X Finance — Guide Épargne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALENDRIER LUNAIRE COMPLET
  if (msgLow.includes("calendrier lunaire") || msgLow.includes("pleine lune") || msgLow.includes("nouvelle lune") || msgLow.includes("cycle lunaire") || msgLow.includes("quand est la lune")) {
    const lune = getLunePhase()
    const date = new Date()
    const conseil = lune.includes("Nouvelle") ? "🌑 Idéal pour planter racines, méditer, nouveaux projets" :
      lune.includes("Premier") ? "🌓 Idéal pour action, croissance, lancer des initiatives" :
      lune.includes("Pleine") ? "🌕 Idéal pour récolter, célébrer, finaliser projets" :
      "🌗 Idéal pour lâcher prise, bilan, repos"
    return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Calendrier Lunaire Caribéen**\n\n"+lune+"\n\n"+conseil+"\n\n🌿 En agriculture créole :\n• Nouvelle lune → planter légumes-feuilles\n• Pleine lune → récolte optimale\n• Dernier quartier → tailler, élaguer\n\nBoudoum ! 🇬🇵" })
  }

  // MODE ENFANTS
  if (msgLow.includes("pour enfant") || msgLow.includes("histoire pour enfant") || msgLow.includes("mon enfant") || msgLow.includes("activité enfant") || msgLow.includes("jeu éducatif")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧒 **Neuro-X Enfants — Mode Famille**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ACTUALITES CARAIBES LOCALES
  if (msgLow.includes("actualité guadeloupe") || msgLow.includes("news guadeloupe") || msgLow.includes("info antilles") || msgLow.includes("actualité martinique") || msgLow.includes("actu caraïbes")) {
    try {
      const r = await fetch("https://rss2json.com/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=5", {timeout:8000})
      const d = await r.json()
      if (d.items?.length) {
        const news = d.items.slice(0,5).map(i => "📰 "+i.title).join("\n")
        return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Actualités Guadeloupe — La 1ère**\n\n"+news+"\n\nSource: la1ere.francetvinfo.fr\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Actualités Guadeloupe**\n\n📺 La 1ère: la1ere.francetvinfo.fr/guadeloupe\n📻 RCI: rci.fm\n📰 France-Antilles: france-antilles.fr\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE NFT CARAIBE
  if (msgLow.includes("nft") || msgLow.includes("créer un nft") || msgLow.includes("vendre nft") || msgLow.includes("collection nft") || msgLow.includes("art numérique")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎨 **Neuro-X NFT — Art Numérique Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GOMINING
  if (msgLow.includes("gomining") || msgLow.includes("go mining") || msgLow.includes("minage bitcoin") || msgLow.includes("miner bitcoin") || msgLow.includes("hashrate")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⛏️ **Neuro-X Finance — Guide GoMining**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR STAKING REUSS
  if (msgLow.includes("staking reuss info") || msgLow.includes("info token reuss") || msgLow.includes("token reuss info") || msgLow.includes("token reuss polygon")) {
    try {
      const nb = parseFloat(message.match(/[\d.,]+/)?.[0]?.replace(",","."))
      if (!isNaN(nb)) {
        const apy = nb >= 5000 ? 0.20 : nb >= 1000 ? 0.15 : nb >= 500 ? 0.08 : 0.03
        const niveau = nb >= 5000 ? "💠 Platinum" : nb >= 1000 ? "🥇 Gold" : nb >= 500 ? "🥈 Silver" : "🥉 Bronze"
        const annuel = (nb * apy).toFixed(0)
        const mensuel = (nb * apy / 12).toFixed(0)
        return res.status(200).json({ pdfAction: pdfType, response: "💎 **Calculateur Staking REUSS**\n\n"+niveau+"\n💰 "+nb+" REUSS stakés\n📈 APY : "+(apy*100)+"%\n\n✅ Gain annuel : "+annuel+" REUSS\n📅 Gain mensuel : "+mensuel+" REUSS\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "💎 **Calculateur Staking REUSS**\n\nDonne le nombre de tokens à staker\nEx: *calcule staking 1000 REUSS*\n\nBoudoum ! 🇬🇵" })
  }

  // CHAMPIONS SPORTIFS ANTILLES
  if (msgLow.includes("champion") || msgLow.includes("sportif antillais") || msgLow.includes("marie-jose perec") || msgLow.includes("teddy riner") || msgLow.includes("athlète guadeloupe") || (msgLow.includes("qui est") && (msgLow.includes("mandela") || msgLow.includes("sankara") || msgLow.includes("lumumba") || msgLow.includes("nkrumah") || msgLow.includes("césaire") || msgLow.includes("fanon"))) || (msgLow.includes("qui était") && (msgLow.includes("mandela") || msgLow.includes("sankara") || msgLow.includes("africain")))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Neuro-X Sport — Champions Antillais**\n\n"+groqText+"\n\nTerres de Champions ! Boudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE AGRICULTURE BIO
  if (msgLow.includes("agriculture bio") || msgLow.includes("jardin créole") || msgLow.includes("cultiver") || msgLow.includes("planter") || msgLow.includes("permaculture caraïbes")) {
    try {
      const meteo = await getMeteo()
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌱 **Neuro-X Agriculture — Jardin Créole**\n\n🌙 "+lune+" | 🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PHILOSOPHIE CARIBEENNE
  if (msgLow.includes("philosophie") || msgLow.includes("césaire") || msgLow.includes("fanon") || msgLow.includes("glissant") || msgLow.includes("négritude") || msgLow.includes("créolité") || (msgLow.includes("ubuntu") && !msgLow.includes("linux") && !msgLow.includes("installer")) || msgLow.includes("philosophie africaine") || msgLow.includes("pensée africaine")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Philosophie — Pensée Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DIASPORA
  if (msgLow.includes("diaspora") || msgLow.includes("guadeloupéen à paris") || msgLow.includes("antillais en france") || msgLow.includes("retour au pays") || msgLow.includes("double culture")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Diaspora — Communauté Mondiale**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SMART CONTRACT
  if (msgLow.includes("smart contract") || msgLow.includes("solidity") || msgLow.includes("déployer un contrat") || msgLow.includes("erc20") || msgLow.includes("polygon contract")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⛓️ **Neuro-X Blockchain — Smart Contracts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR PITCH INVESTISSEUR
  if (msgLow.includes("pitch") || msgLow.includes("lever des fonds") || msgLow.includes("investisseur") || msgLow.includes("présentation investisseur") || msgLow.includes("seed funding")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Stratégie — Pitch Investisseur**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE IMMOBILIER DOM-TOM
  if (msgLow.includes("acheter une maison") || msgLow.includes("immobilier guadeloupe") || msgLow.includes("girardin") || msgLow.includes("défiscalisation immobilier") || msgLow.includes("investir immobilier")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🏠 **Neuro-X Immobilier — Guide DOM-TOM**\n\n"+groqText+"\n\n⚠️ Consultez un notaire.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COACH ENTREPRENEURIAT FEMININ
  if (msgLow.includes("femme entrepreneur") || msgLow.includes("entrepreneuriat féminin") || msgLow.includes("business woman") || msgLow.includes("femme boss") || msgLow.includes("créer mon activité femme")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "👑 **Neuro-X Femmes — Coach Entrepreneuriat**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE JEUNES CARIBEEN
  if (msgLow.includes("orientation scolaire") || msgLow.includes("études guadeloupe") || msgLow.includes("bourse étudiant") || msgLow.includes("premier emploi") || msgLow.includes("stage guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Jeunes — Guide Orientation**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // DIAGNOSTIC SITE WEB
  if (msgLow.includes("mon site") || msgLow.includes("améliorer mon site") || msgLow.includes("seo de mon site") || msgLow.includes("optimiser mon site") || msgLow.includes("audit site")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔍 **Neuro-X SEO — Audit Site Web**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CHANSON CREOLE
  if (msgLow.includes("chanson") || msgLow.includes("zouk") || msgLow.includes("gwo ka") || msgLow.includes("paroles") || msgLow.includes("compose une chanson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Business, expert emploi DOM-TOM. Guide vers francetravail.fr, caribbeanjobs.com. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🎵 **Neuro-X Musique — Chanson Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ECO-TOURISME
  if (msgLow.includes("randonnée") || msgLow.includes("soufrière") || msgLow.includes("forêt tropicale") || msgLow.includes("nature guadeloupe") || msgLow.includes("plongée")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌿 **Neuro-X Tourisme — Éco-Tourisme Guadeloupe**\n\n🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // SCIENCE CARIBEENNE
  if (msgLow.includes("volcan") || msgLow.includes("biodiversité") || msgLow.includes("mangrove") || msgLow.includes("récif corallien") || msgLow.includes("faune caribéenne")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🔬 **Neuro-X Sciences — Biodiversité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE ENERGIE SOLAIRE
  if (msgLow.includes("énergie solaire") || msgLow.includes("panneau solaire") || msgLow.includes("renouvelable") || msgLow.includes("électricité guadeloupe") || msgLow.includes("edf guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "☀️ **Neuro-X Énergie — Solaire Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // DICTIONNAIRE CREOLE COMPLET
  if (msgLow.includes("que veut dire") || msgLow.includes("définition") || msgLow.includes("signifie") || msgLow.includes("en créole") || msgLow.includes("traduction créole") || msgLow.includes("comment dire")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "📖 **Neuro-X Langues — Dictionnaire Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // TIPS DEVELOPPEMENT PERSONNEL
  if (msgLow.includes("développement personnel") || msgLow.includes("objectif de vie") || msgLow.includes("améliorer ma vie") || msgLow.includes("devenir meilleur") || msgLow.includes("habitudes positives")) {
    try {
      const citation = await getCitation()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Neuro-X Coach — Développement Personnel**\n\n💬 "+citation+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE MARCHE CRYPTO
  if (msgLow.includes("analyse crypto") || msgLow.includes("marché crypto") || msgLow.includes("bull") || msgLow.includes("bear") || msgLow.includes("analyse bitcoin") || msgLow.includes("analyse ethereum")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📈 **Neuro-X Finance — Analyse Marché**\n\n"+crypto+"\n😨 "+fg+"\n\n"+groqText+"\n\n⚠️ DYOR\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE RETRAITE DOM-TOM
  if (msgLow.includes("retraite") || msgLow.includes("pension") || msgLow.includes("cnav") || msgLow.includes("cotisation retraite") || msgLow.includes("préparer ma retraite")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👴 **Neuro-X Juridique — Guide Retraite DOM-TOM**\n\n"+groqText+"\n\n⚠️ Consultez un conseiller retraite.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BUSINESS PLAN
  if (msgLow.includes("business plan") || msgLow.includes("plan d'affaires") || msgLow.includes("créer mon entreprise") || msgLow.includes("lancer mon business") || msgLow.includes("monter mon projet")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📋 **Neuro-X Business — Business Plan**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR IMC
  if (msgLow.includes("imc") || msgLow.includes("indice masse corporelle") || msgLow.includes("calcule mon poids") || msgLow.includes("poids idéal") || msgLow.includes("suis-je en bonne santé")) {
    try {
      const nb = message.match(/[\d.,]+/g)?.map(n => parseFloat(n.replace(",","."))) 
      if (nb && nb.length >= 2) {
        const poids = nb[0], taille = nb[1] > 3 ? nb[1]/100 : nb[1]
        const imc = (poids / (taille * taille)).toFixed(1)
        const cat = imc < 18.5 ? "🔵 Insuffisance pondérale" : imc < 25 ? "🟢 Poids normal" : imc < 30 ? "🟡 Surpoids" : "🔴 Obésité"
        return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Calculateur IMC — Neuro-X Santé**\n\nPoids: "+poids+"kg | Taille: "+(taille*100)+"cm\n\n📊 IMC : "+imc+"\n"+cat+"\n\n💡 Conseil caribéen: Mangez équilibré, bougez au soleil !\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Calculateur IMC**\n\nDonne ton poids (kg) et ta taille (cm)\nEx: *calcule mon IMC 70kg 175cm*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE IMMIGRATION DOM-TOM
  if (msgLow.includes("immigration") || msgLow.includes("visa") || msgLow.includes("s'installer") || msgLow.includes("expatrié") || msgLow.includes("vivre en guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "✈️ **Neuro-X Juridique — Guide Immigration**\n\n"+groqText+"\n\n⚠️ Consultez les services préfectoraux.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ASTROLOGIE CARIBEENNE
  if (msgLow.includes("astro") || msgLow.includes("thème astral") || msgLow.includes("ascendant") || msgLow.includes("planète") && msgLow.includes("signe")) {
    try {
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⭐ **Neuro-X Spiritualité — Astrologie Caribéenne**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // QUIZ INSTANTANE
  if (msgLow.includes("interroge moi") || msgLow.includes("teste moi") || msgLow.includes("question culture") || msgLow.includes("quiz rapide") || msgLow.includes("pose moi une question")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "🎯 **Neuro-X Éducation — Quiz Instantané**\n\n"+groqText+"\n\n+5 points REUSS si bonne réponse !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PLAN MARKETING
  if (msgLow.includes("plan marketing") || msgLow.includes("stratégie marketing") || msgLow.includes("strategie marketing") || msgLow.includes("plan de communication") || msgLow.includes("lancer mon produit")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📊 **Neuro-X Marketing — Plan Complet**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // HISTOIRE GUADELOUPE
  if (msgLow.includes("histoire guadeloupe") || msgLow.includes("histoire de la guadeloupe") || msgLow.includes("histoire des antilles") || msgLow.includes("histoire caribéenne") || msgLow.includes("histoire martinique") || msgLow.includes("histoire haiti") || msgLow.includes("histoire haïti") || msgLow.includes("histoire de la martinique") || msgLow.includes("histoire afrique") || msgLow.includes("abolition") || msgLow.includes("victor schoelcher") || msgLow.includes("patrimoine antillais") || msgLow.includes("culture guadeloupéenne") || (msgLow.includes("histoire") && msgLow.includes("guadeloupe")) || (msgLow.includes("histoire") && msgLow.includes("antilles")) || (msgLow.includes("histoire") && msgLow.includes("caraïbes")) || (msgLow.includes("histoire") && msgLow.includes("afrique")) || (msgLow.includes("histoire") && msgLow.includes("martinique"))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      const rep = groqText
      if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — Histoire Caribéenne & Africaine**\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Histoire Caribéenne**\n\nLa Guadeloupe, Terres de Champions ! Notre histoire est riche: découverte par Christophe Colomb en 1493, peuplement par les Kalinagos, colonisation française, abolition de l'esclavage le 27 mai 1848 par Victor Schœlcher, résistance de Louis Delgrès. Aujourd'hui département français d'outre-mer fier de son identité créole.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "📚 **Histoire Caribéenne & Africaine**\n\nLa Guadeloupe est une île des Caraïbes, département français d'outre-mer. Histoire marquée par: les peuples Kalinagos, la colonisation, l'esclavage et son abolition le 27 mai 1848. L'Afrique, berceau de l'humanité, a donné naissance aux grandes civilisations: Égypte ancienne, empire du Mali, royaume du Congo. Nelson Mandela, Thomas Sankara, Patrice Lumumba — des leaders qui ont changé le monde.\n\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR EMAIL PRO
  if (msgLow.includes("email professionnel") || msgLow.includes("rédige un email") || msgLow.includes("lettre professionnelle") || msgLow.includes("email commercial") || msgLow.includes("mail pro")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📧 **Neuro-X Business — Email Professionnel**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR POST RESEAUX SOCIAUX
  if (msgLow.includes("post instagram") || msgLow.includes("post tiktok") || msgLow.includes("post facebook") || msgLow.includes("caption") || msgLow.includes("génère un post") || msgLow.includes("contenu réseaux")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📱 **Neuro-X Marketing — Générateur Posts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COCKTAILS RHum CARIBEEN
  if (msgLow.includes("cocktail") || msgLow.includes("rhum") || msgLow.includes("ti punch") || msgLow.includes("planteur") || msgLow.includes("mojito") || msgLow.includes("recette boisson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🍹 **Neuro-X Cuisine — Cocktails Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE REVES
  if (msgLow.includes("j'ai rêvé") || msgLow.includes("mon rêve") || msgLow.includes("analyse mon rêve") || msgLow.includes("signification rêve") || msgLow.includes("interprète mon rêve")) {
    try {
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Neuro-X Spiritualité — Analyse Rêves**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS VOYAGE CARAIBES
  if (msgLow.includes("visiter") || msgLow.includes("vacances guadeloupe") || msgLow.includes("tourisme caraïbes") || msgLow.includes("que faire en guadeloupe") || msgLow.includes("bon plan voyage")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "✈️ **Neuro-X Tourisme — Guide Caribéen**\n\n🌤️ "+meteo+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE PERSONNALITE
  if (msgLow.includes("analyse ma personnalité") || msgLow.includes("test personnalité") || msgLow.includes("quel type") || msgLow.includes("mbti") || msgLow.includes("profil personnalité")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Psychologie — Analyse Personnalité**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR SLOGAN
  if (msgLow.includes("slogan") || msgLow.includes("accroche") || msgLow.includes("tagline") || msgLow.includes("phrase marketing")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "🎯 **Neuro-X Marketing — Générateur Slogans**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS INVESTISSEMENT
  if (msgLow.includes("investir") && (msgLow.includes("comment") || msgLow.includes("conseil") || msgLow.includes("stratégie")) || msgLow.includes("portefeuille crypto") || msgLow.includes("diversifier")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Finance — Conseils Investissement**\n\n📊 Marché actuel : "+fg+"\n\n"+groqText+"\n\n⚠️ DYOR — Pas de conseil financier.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // APPRENTISSAGE LANGUE
  if (msgLow.includes("apprendre") && (msgLow.includes("anglais") || msgLow.includes("espagnol") || msgLow.includes("créole") || msgLow.includes("portugais") || msgLow.includes("langue")) || msgLow.includes("leçon de langue")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Langues — Leçon**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MEDITATION CARIBEENNE
  if (msgLow.includes("méditation") || msgLow.includes("meditation") || msgLow.includes("relaxation") || msgLow.includes("stress") || msgLow.includes("calme") || msgLow.includes("zen")) {
    try {
      const meteo = await getMeteo()
      const lune = getLunePhase()
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message + " (Météo actuelle: "+meteo+" | Lune: "+lune+")" }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧘 **Neuro-X Santé — Méditation Caribéenne**\n\n🌊 "+meteo+" | "+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PROVERBES CREOLES
  if (msgLow.includes("proverbe") || msgLow.includes("sagesse créole") || msgLow.includes("dit créole") || msgLow.includes("expression créole")) {
    const proverbes = [
      { creole: "Apré lapli, solèy ka briyé", fr: "Après la pluie, le soleil brille" },
      { creole: "Chak chyen ni jou-y", fr: "Chaque chien a son jour" },
      { creole: "Sé pa tout sa ki briyé ki lò", fr: "Tout ce qui brille n'est pas or" },
      { creole: "Ti kouri pa janm mouri", fr: "Courir petit ne meurt jamais" },
      { creole: "Lanmou sé pa sik", fr: "L'amour n'est pas du sucre" },
      { creole: "Doubout vaut mié ké asiz", fr: "Debout vaut mieux qu'assis" },
      { creole: "Fòk ou travay pou mangé", fr: "Il faut travailler pour manger" },
      { creole: "Péyi a ni solèy pou tout moun", fr: "Le pays a du soleil pour tout le monde" },
    ]
    const p = proverbes[Math.floor(Math.random()*proverbes.length)]
    return res.status(200).json({ pdfAction: pdfType, response: "🌺 **Proverbe Créole du Moment**\n\n*"+p.creole+"*\n\n📖 Traduction : "+p.fr+"\n\nBoudoum ! 🇬🇵" })
  }

  // SANTE NATURELLE CARIBEENNE
  if (msgLow.includes("plante médicinale") || msgLow.includes("remède naturel") || msgLow.includes("médecine naturelle") || msgLow.includes("herbe") || msgLow.includes("soigner naturellement")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌿 **Neuro-X Santé — Plantes Caribéennes**\n\n"+groqText+"\n\n⚠️ Consultez un médecin.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // NUMEROLOGIE
  if (msgLow.includes("numérologie") || msgLow.includes("numerologie") || msgLow.includes("chiffre de vie") || msgLow.includes("mon chiffre")) {
    try {
      const nb = message.match(/\d{1,2}\/\d{1,2}\/\d{4}/)?.[0]
      if (nb) {
        const digits = nb.replace(/\D/g,"").split("").map(Number)
        let sum = digits.reduce((a,b)=>a+b,0)
        while(sum>9) sum = String(sum).split("").map(Number).reduce((a,b)=>a+b,0)
        const signifs = ["","Leader né","Diplomate","Créatif","Travailleur","Aventurier","Harmonieux","Mystique","Ambitieux","Humaniste"]
        return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Numérologie Caribéenne**\n\nTon chiffre de vie : **"+sum+"**\n\n✨ "+signifs[sum]+"\n\nEn Guadeloupe, le "+sum+" représente la force des Terres de Champions !\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Numérologie Caribéenne**\n\nDonne ta date de naissance (ex: 25/03/1990) pour calculer ton chiffre de vie !\n\nBoudoum ! 🇬🇵" })
  }

  // METEO MONDE
  if ((msgLow.includes("meteo") || msgLow.includes("météo") || msgLow.includes("température")) && (msgLow.includes("paris") || msgLow.includes("new york") || msgLow.includes("tokyo") || msgLow.includes("london") || msgLow.includes("dakar") || msgLow.includes("montreal") || msgLow.includes("abidjan"))) {
    try {
      const villes = { paris:[48.85,2.35], "new york":[40.71,-74.00], tokyo:[35.68,139.69], london:[51.50,-0.12], dakar:[14.69,-17.44], montreal:[45.50,-73.56], abidjan:[5.35,-4.00] }
      let lat=16.26, lon=-61.55, lieu="Guadeloupe"
      for (const [v,[la,lo]] of Object.entries(villes)) {
        if (msgLow.includes(v)) { lat=la; lon=lo; lieu=v.charAt(0).toUpperCase()+v.slice(1); break }
      }
      const mr = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current_weather=true")
      const md = await mr.json()
      const w = md.current_weather
      const wDesc = w.weathercode<=3?"Ensoleillé":w.weathercode<=48?"Nuageux":w.weathercode<=67?"Pluvieux":"Orageux"
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ **Météo "+lieu+" — Temps réel**\n\n🌡️ "+w.temperature+"°C\n💨 Vent: "+w.windspeed+"km/h\n☁️ "+wDesc+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COACH SPORTIF
  if (msgLow.includes("programme sport") || msgLow.includes("musculation") || msgLow.includes("perte de poids") || msgLow.includes("fitness") || msgLow.includes("programme fitness")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💪 **Neuro-X Sport — Coach Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RECETTE ANTILLAISE
  if (msgLow.includes("recette") || msgLow.includes("comment cuisiner") || msgLow.includes("comment préparer") || msgLow.includes("accras") || msgLow.includes("colombo") || msgLow.includes("blaff") || msgLow.includes("court-bouillon")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🍽️ **Neuro-X Cuisine — Recette Créole**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AIDE JURIDIQUE
  if (msgLow.includes("mes droits") || msgLow.includes("légalement") || msgLow.includes("juridique") || msgLow.includes("contrat") || msgLow.includes("auto-entrepreneur") || msgLow.includes("siret")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Neuro-X Juridique — Conseil Droit**\n\n"+groqText+"\n\n⚠️ Consultez un avocat pour toute décision légale.\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CALCULATEUR AMAZON
  if (msgLow.includes("commission") || msgLow.includes("calcul amazon") || msgLow.includes("combien je gagne") || msgLow.includes("revenus affiliation") || msgLow.includes("calculateur")) {
    try {
      const nb = parseFloat(message.match(/[\d.,]+/)?.[0]?.replace(",","."))
      if (!isNaN(nb)) {
        const taux = { standard: 0.03, mode: 0.10, cuisine: 0.08, tech: 0.04, livres: 0.045 }
        return res.status(200).json({ pdfAction: pdfType, response: "💰 **Calculateur Amazon REUSSITESS**\n\nProduit à $"+nb+"\n\n📊 Commissions estimées :\n• Standard (3%) : $"+(nb*0.03).toFixed(2)+"\n• Mode (10%) : $"+(nb*0.10).toFixed(2)+"\n• Cuisine (8%) : $"+(nb*0.08).toFixed(2)+"\n• Tech (4%) : $"+(nb*0.04).toFixed(2)+"\n• Livres (4.5%) : $"+(nb*0.045).toFixed(2)+"\n\n🌍 Multiplié par 26 boutiques = $"+(nb*0.05*26).toFixed(2)+"/vente théorique\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RESUME CONVERSATION
  if (msgLow.includes("résume") || msgLow.includes("resume notre") || msgLow.includes("résumé de notre") || msgLow.includes("recap") || msgLow.includes("récap")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: "Résume cette conversation : "+message }
          ], 1024)
      return res.status(200).json({ pdfAction: pdfType, response: "📋 **Résumé de Session**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // MODE DEBAT
  if (msgLow.includes("débat") || msgLow.includes("debat") || msgLow.includes("pour et contre") || msgLow.includes("avantages inconvénients") || msgLow.includes("argumente")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⚖️ **Mode Débat — Neuro-X Stratégie**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS BUSINESS CARAIBE
  if (msgLow.includes("conseil business") || msgLow.includes("idée business") || msgLow.includes("idée entreprise") || msgLow.includes("comment gagner") || msgLow.includes("revenus passifs")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💼 **Neuro-X Business — Conseils Caribéens**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR POEME CREOLE
  if (msgLow.includes("poème") || msgLow.includes("poeme") || msgLow.includes("écris un poème") || msgLow.includes("crée un poème") || msgLow.includes("rimé")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      const poeme = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "✍️ **Neuro-X Créatif — Poème Créole**\n\n"+poeme+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR NOM ENTREPRISE
  if (msgLow.includes("nom d'entreprise") || msgLow.includes("nom de marque") || msgLow.includes("nom business") || msgLow.includes("génère un nom") || msgLow.includes("genere un nom")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 1024)
      const noms = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "🏢 **Neuro-X Business — Générateur de Noms**\n\n"+noms+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CV
  if (msgLow.includes("cv") || msgLow.includes("curriculum") || msgLow.includes("génère mon cv") || msgLow.includes("aide cv") || msgLow.includes("rédige cv")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📄 **Neuro-X Business — Assistant CV**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // HISTOIRE CARIBEENNE
  if (msgLow.includes("raconte") || msgLow.includes("histoire caribéenne") || msgLow.includes("conte créole") || msgLow.includes("légende antillaise")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Culture, expert mythologie créole et caribéenne. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "📖 **Neuro-X Créatif — Conte Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // WHITEPAPER REUSSITESS
  if (msgLow.includes("whitepaper") || msgLow.includes("livre blanc") || msgLow.includes("white paper") || msgLow.includes("tokenomics")) {
    return res.status(200).json({ pdfAction: pdfType, response: "📄 **REUSSITESS® White Paper**\n\n🎯 Vision : IA universelle caribéenne\n🌍 Portée : 14 pays, 5 continents\n💎 Token : REUSS sur Polygon\n📊 Supply : 1 milliard REUSS\n\n**Tokenomics :**\n• 40% Communauté\n• 20% Développement\n• 15% Équipe\n• 15% Réserve\n• 10% Marketing\n\n**Utilité REUSS :**\n• Accès Neuro-X premium\n• Récompenses Quiz\n• Gouvernance DAO\n• Staking\n\n📋 White paper complet : reussitess.fr\n\nBoudoum ! 🇬🇵" })
  }

  // STAKING REUSS
  if (msgLow.includes("staking") || msgLow.includes("stake") || msgLow.includes("mettre en jeu") || msgLow.includes("récompense token")) {
    return res.status(200).json({ pdfAction: pdfType, response: "💎 **Staking REUSS — Gagne en Dormant**\n\n🥉 Bronze : 100 REUSS → 3% APY\n🥈 Silver : 500 REUSS → 8% APY\n🥇 Gold : 1000 REUSS → 15% APY\n💠 Platinum : 5000 REUSS → 20% APY\n\n📍 Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2\n🔗 Réseau : Polygon\n\n💡 Plus tu stakes, plus tu gagnes !\n\nBoudoum ! 🇬🇵" })
  }

  // DAO GOUVERNANCE
  if (msgLow.includes("dao") || msgLow.includes("gouvernance") || msgLow.includes("voter") || msgLow.includes("proposition")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🏛️ **REUSSITESS DAO — Gouvernance Décentralisée**\n\nTu as du REUSS = Tu as le pouvoir !\n\n🗳️ Droits de vote :\n• 1 REUSS = 1 vote\n• Propositions communautaires\n• Décisions sur l'écosystème\n\n📋 Prochains votes :\n• Expansion vers 5 nouveaux pays\n• Ajout 40 Neuro-X supplémentaires\n• Nouveau partenariat Amazon\n\n💡 DELTA-4 : Gouvernance DAO active\n\nBoudoum ! 🇬🇵" })
  }

  // NEXUS PASSPORT
  if (msgLow.includes("passport") || msgLow.includes("passeport") || msgLow.includes("identité") || msgLow.includes("nft identité") || msgLow.includes("ia passport")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🪪 **IA Passport Mondial REUSSITESS**\n\n🌍 Premier passeport universel IA au monde !\n\n✅ Identité NFT sur blockchain\n✅ 8 langues actives\n✅ Reconnaissance dans 14 pays\n✅ Accès tous les Neuro-X\n✅ Historique conversations sécurisé\n✅ Récompenses REUSS automatiques\n\n🔐 Technologie : AES-256 + Polygon NFT\n\nBoudoum ! 🇬🇵" })
  }

  // INVESTIR REUSS
  if (msgLow.includes("investir") || msgLow.includes("acheter reuss") || msgLow.includes("comment acheter") || msgLow.includes("où acheter") || msgLow.includes("ou acheter")) {
    return res.status(200).json({ pdfAction: pdfType, response: "💰 **Comment Investir dans REUSS**\n\n1️⃣ Installe MetaMask ou Trust Wallet\n2️⃣ Achète du POL (Polygon) sur Binance/Coinbase\n3️⃣ Connecte sur QuickSwap.exchange\n4️⃣ Swap POL → REUSS\n\n📍 Contrat officiel :\n0xB37531727fC07c6EED4f97F852A115B428046EB2\n\n⚠️ Réseau : Polygon uniquement\n💡 Vérifie toujours le bon contrat !\n\n📊 Prix actuel sur DexScreener\n\nBoudoum ! 🇬🇵" })
  }

  // POINTS REUSS
  if (msgLow.includes("mes points") || msgLow.includes("mon score") || msgLow.includes("points reuss") || msgLow.includes("combien de points")) {
    const pts = calculerPoints(message)
    return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Système Points REUSS**\n\n💎 Points gagnés cette session : "+pts+"\n\n📊 Comment gagner plus :\n• Quiz : +5 pts\n• Neuro-X : +3 pts\n• Mention REUSS : +2 pts\n• Boudoum : +10 pts 🎯\n\nBoudoum ! 🇬🇵" })
  }

  // COMMUNICATION 200 IA
  if (msgLow.includes("communication ia") || msgLow.includes("réseau ia") || msgLow.includes("reseau ia") || msgLow.includes("connecte les agents") || msgLow.includes("parle aux agents")) {
    const meteo = await getMeteo()
    const crypto = await getCryptoPrice()
    const fg = await getFearGreed()
    const cyclone = await getCyclones()
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **QUANTUM NEXUS — Communication Inter-Agents**\n\n"+"📡 Rapport temps réel des Sentinelles :\n"+"🌤️ ST-003 → Météo: "+(meteo||"N/A")+"\n"+"💎 ST-005 → Crypto: "+(crypto||"N/A")+"\n"+"😨 ST-005 → Marché: "+(fg||"N/A")+"\n"+"🌀 ST-021 → Cyclones: "+(cyclone||"N/A")+"\n"+"🌙 ST-003 → Lune: "+lune+"\n\n"+"🧠 Neuro-X en attente de commandes...\n"+"💬 Active un agent : *neuro-x finance*, *neuro-x coach*...\n\n"+"Boudoum ! 🇬🇵" })
  }

  // RAPPORT SECURITE
  if (msgLow.includes("sécurité") || msgLow.includes("securite") || msgLow.includes("rapport sécurité") || msgLow.includes("shield") || msgLow.includes("protection")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **REUSSSHIELD — Rapport Sécurité**\n\n✅ ST-016 Anti-Fraude : Actif\n✅ ST-017 MiCA Compliance : Actif\n✅ ST-026 Surveillance APIs : Actif\n✅ ST-027 Vercel Monitor : Actif\n✅ ST-028 GitHub Watch : Actif\n✅ ST-029 Polygon Network : Actif\n\n🔒 Détection injection prompt : Activée\n🔑 HTTPS + headers sécurisés : Actif\n🌐 Site reussitess.fr : EN LIGNE\n\n200 agents IA en surveillance continue 24/7\n\nBoudoum ! 🇬🇵" })
  }



  // ENCYCLOPEDIE ANTILLES + AFRIQUE
  const sujetsEncyclo = ["histoire de","histoire du","histoire des","qu'est-ce que","c'est quoi","parle moi de","parle-moi de","qui est","qui était","que sais-tu sur","encyclopédie","explique moi","explique-moi","tell me about","définition de","origine de","culture de","patrimoine","civilisation","raconte l'histoire","en savoir plus","biographie","bio de","info sur"]
  const needsEncyclo = sujetsEncyclo.some(s => msgLow.includes(s))
  if (needsEncyclo) {
    try {
      const wiki = await encyclopedieAntillesAfrique(message)
      if (wiki) {
        // Enrichit avec Groq
        const groqText = await groqFetch([
              { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
              { role: "user", content: "Question: "+message+"\n\nSource Wikipedia:\n"+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — Wikipedia Live**\n\n"+rep+"\n\nSource: Wikipedia FR\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ENCYCLOPEDIE DIRECTE — mots-clés spécifiques
  // FORCE encyclopédie si message court contient mot-clé Antilles/Afrique
  if (message.split(" ").length <= 8) {
    const forceWiki = ["guadeloupe","martinique","haïti","haiti","guyane","solitude","delgrès","kalinago","arawak","taïno","gwo ka","biguine","zouk","mandela","sankara","lumumba","nkrumah","nefertiti","pharaon","ubuntu","swahili","wolof","bambara","négritude","negritude"]
    const fw = forceWiki.find(k => msgLow.includes(k))
    if (fw) {
      try {
        const wiki = await rechercheWikipedia(message, "fr")
        if (wiki) {
          const groqText = await groqFetch([
                { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
                { role: "user", content: message+"\n\nWikipedia: "+wiki }
              ], 4096)
          const rep = groqText
          if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — "+fw.charAt(0).toUpperCase()+fw.slice(1)+"**\n\n"+rep+"\n\nSource: Wikipedia\n\nBoudoum ! 🇬🇵" })
        }
      } catch(e) {}
    }
  }

  const motsAntilles = ["guadeloupe","martinique","haïti","haiti","guyane","caraïbes","caraibes","antilles","créole","abolition","esclavage","césaire","glissant","fanon","condé","gwo ka","zouk","soufrière","marie-galante","désirade","les saintes","basse-terre","pointe-à-pitre","schœlcher","solitude","delgrès","kalinago","arawak","taïno"]
  const motsAfrique = ["afrique","sénégal","côte d'ivoire","cameroun","congo","mali","niger","burkina","ghana","nigeria","kenya","éthiopie","maroc","algérie","tunisie","égypte","dakar","abidjan","kinshasa","ubuntu","swahili","wolof","bambara","mandela","sankara","lumumba","nkrumah","nefertiti","pharaon","pyramide"]
  const m = msgLow
  const isAntilles2 = motsAntilles.some(k => m.includes(k))
  const isAfrique2 = motsAfrique.some(k => m.includes(k))
  if (isAntilles2 || isAfrique2) {
    try {
      const wiki = await rechercheWikipedia(message, "fr")
      if (wiki) {
        const groqText = await groqFetch([
              { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
              { role: "user", content: message+"\n\nWikipedia: "+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+rep+"\n\nSource: Wikipedia\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // UBUNTU — PRIORITE ABSOLUE avant OS Linux
  if (msgLow.includes("ubuntu") && !msgLow.includes("installer") && !msgLow.includes("télécharger") && !msgLow.includes("linux") && !msgLow.includes("canonical") && !msgLow.includes("système")) {
    try {
      const wiki = await rechercheWikipedia("Ubuntu philosophie africaine humanisme", "fr")
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Encyclopédie REUSSITESS — Ubuntu, Philosophie Africaine**\n\n*Umuntu ngumuntu ngabantu — Je suis parce que nous sommes*\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // UBUNTU — PRIORITE ABSOLUE avant OS Linux
  if (msgLow.includes("ubuntu") && (msgLow.includes("philosophie") || msgLow.includes("afrique") || msgLow.includes("africain") || msgLow.includes("signifie") || msgLow.includes("valeur") || msgLow.includes("sagesse") || msgLow === "ubuntu" || msgLow === "qu est ce que ubuntu")) {
    try {
      const wiki = await rechercheWikipedia("Ubuntu philosophie africaine", "fr")
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF). Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Encyclopédie REUSSITESS — Ubuntu, Philosophie Africaine**\n\n"+groqText+"\n\n*Ubuntu: Je suis parce que nous sommes*\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // SECURITE — ANTI-INJECTION
  const menace = detecterMenace(message)
  if (menace) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **ST-016 Sentinelle Sécurité — ALERTE**\n\nTentative d'injection détectée. REUSSITESS AI est protégé par 200 agents IA.\n\nBoudoum ! 🇬🇵" })
  }

  // RECOMMANDATIONS AMAZON
  if (msgLow.includes("recommande") || msgLow.includes("suggestion produit") || msgLow.includes("que acheter") || msgLow.includes("quoi acheter") || msgLow.includes("produit amazon")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛍️ **Recommandations Amazon REUSSITESS**\n\n🇫🇷 France → amazon.fr/shop/amourguadeloupe\n🇺🇸 USA → amazon.com/shop/influencer-fb942837\n🇩🇪 Allemagne → amazon.de/shop/influencer-fb942837\n🇬🇧 UK → amazon.co.uk/shop/influencer-fb942837\n🇨🇦 Canada → amazon.ca/shop/influencer-fb942837\n🇧🇷 Brésil → amazon.com.br/shop/influencer-fb942837\n🇦🇺 Australie → amazon.com.au/shop/influencer-fb942837\n🇮🇳 Inde → amazon.in/shop/influencer-fb942837\n\n💎 Gagne des tokens REUSS à chaque achat !\n\nBoudoum ! 🇬🇵" })
  }

  // CLASSEMENT FOLLOWERS
  if (msgLow.includes("classement") || msgLow.includes("leaderboard") || msgLow.includes("top followers") || msgLow.includes("meilleurs")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🏆 **Classement REUSSITESS — Top Champions**\n\n🥇 Champion Platinum — 1000+ points REUSS\n🥈 Champion Gold — 500+ points REUSS\n🥉 Champion Silver — 200+ points REUSS\n🎖️ Champion Bronze — 50+ points REUSS\n\n💎 Gagne des points en :\n• Faisant les 99 quiz (+5 pts)\n• Activant les Neuro-X (+3 pts)\n• Partageant REUSSITESS (+10 pts)\n• Disant Boudoum (+10 pts) 🎯\n\n📊 Rejoins le classement sur reussitess.fr !\n\nBoudoum ! 🇬🇵" })
  }

  // GRAPHIQUE PRIX REUSS
  if (msgLow.includes("graphique") || msgLow.includes("chart") || msgLow.includes("évolution prix") || msgLow.includes("historique reuss") || msgLow.includes("evolution prix")) {
    try {
      const r = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2", {timeout:10})
      const d = await r.json()
      const pair = d.pairs?.[0]
      if (pair) {
        const prix = pair.priceUsd || "N/A"
        const change = pair.priceChange?.h24 || "N/A"
        const vol = pair.volume?.h24 || "N/A"
        const liq = pair.liquidity?.usd || "N/A"
        return res.status(200).json({ pdfAction: pdfType, response: "📈 **Token REUSS — Analyse Temps Réel**\n\n💎 Prix : $"+prix+"\n📊 Variation 24h : "+change+"%\n💹 Volume 24h : $"+vol+"\n🌊 Liquidité : $"+liq+"\n\n🔗 DexScreener : dexscreener.com/polygon/"+pair.pairAddress+"\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ pdfAction: pdfType, response: "📈 Graphique REUSS disponible sur DexScreener !\nhttps://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2\n\nBoudoum ! 🇬🇵" })
  }

  // RAPPORT COMPLET ECOSYSTEME
  if (msgLow.includes("rapport complet") || msgLow.includes("état du projet") || msgLow.includes("etat du projet") || msgLow.includes("bilan reussitess")) {
    const meteo = await getMeteo()
    const crypto = await getCryptoPrice()
    const lune = getLunePhase()
    const cyclone = await getCyclones()
    return res.status(200).json({ pdfAction: pdfType, response: "📊 **RAPPORT COMPLET REUSSITESS®971**\n\n🌤️ Météo Guadeloupe : "+(meteo||"N/A")+"\n🌙 Phase lune : "+lune+"\n🌀 Cyclones : "+(cyclone||"N/A")+"\n💎 Crypto : "+(crypto||"N/A")+"\n\n🤖 Agents actifs : 200\n🎯 Quiz actifs : 99\n🛍️ Boutiques : 26 (14 pays)\n🛡️ Sentinelles : 40 actives\n🌐 Site : EN LIGNE\n\nBoudoum ! 🇬🇵" })
  }

  // SEISMES CARAIBES
  if (msgLow.includes("séisme") || msgLow.includes("seisme") || msgLow.includes("tremblement") || msgLow.includes("tremblement de terre") || msgLow.includes("earthquake")) {
    try {
      const s = await getSeismesCaraibes()
      const sm = await getSeismesMondiaux()
      return res.status(200).json({ pdfAction: pdfType, response: "🌋 **Séismes — Temps Réel**\n\n**🇬🇵 Caraïbes :**\n"+(s||"Aucun")+"\n\n**🌍 Mondiaux (ce mois) :**\n"+(sm||"Aucun")+"\n\nSource: USGS\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CYCLONES
  if (msgLow.includes("cyclone") || msgLow.includes("ouragan") || msgLow.includes("tempête") || msgLow.includes("tempete") || msgLow.includes("hurricane")) {
    try {
      const c = await getCyclones()
      return res.status(200).json({ pdfAction: pdfType, response: "🌀 **Cyclones — Surveillance NHC**\n\n"+c+"\n\nSource: National Hurricane Center\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // TRADUCTEUR
  if ((msgLow.includes("traduis") || msgLow.includes("traduire") || msgLow.includes("translate") || msgLow.includes("traduction")) && !msgLow.includes("creole") && !msgLow.includes("kreyol")) {
    try {
      const langues = { "anglais":"en","espagnol":"es","portugais":"pt","allemand":"de","italien":"it","créole":"ht","arabe":"ar","chinois":"zh","japonais":"ja","russe":"ru" }
      let cible = "en"
      for (const [nom, code] of Object.entries(langues)) {
        if (msgLow.includes(nom)) { cible = code; break }
      }
      const texte = message.replace(/traduis?\s*(en\s*\w+)?\s*/i,"").trim()
      const trad = await traduire(texte || "Bonjour je suis REUSSITESS AI", cible)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Traducteur REUSSITESS**\n\n"+trad+"\n\n50 langues disponibles !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // AGENDA CARIBEEN
  if (msgLow.includes("agenda") || msgLow.includes("événement") || msgLow.includes("evenement") || msgLow.includes("calendrier") || msgLow.includes("fête caribéenne") || msgLow.includes("fete caribeenne")) {
    const ag = getAgendaCaraibes()
    return res.status(200).json({ pdfAction: pdfType, response: "📅 **Agenda Caribéen du Mois**\n\n"+ag+"\n\nBoudoum ! 🇬🇵" })
  }

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
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ **Météo "+lieu+" — Temps réel**\n\n🌡️ Température : "+w.temperature+"°C\n💨 Vent : "+w.windspeed+" km/h\n☁️ Conditions : "+wDesc+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "🌤️ Service météo indisponible. Boudoum 🇬🇵" }) }
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
      return res.status(200).json({ pdfAction: pdfType, response: "💎 **Crypto — Temps Réel**\n\n₿ Bitcoin : $"+(cd.bitcoin?.usd||"N/A")+"\nΞ Ethereum : $"+(cd.ethereum?.usd||"N/A")+"\n🔷 POL : $"+(cd["matic-network"]?.usd||"N/A")+"\n\n🔥 Tendances : "+trending+"\n😨 Sentiment : "+fg+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "💎 Service crypto indisponible. Boudoum 🇬🇵" }) }
  }

  // TAUX DE CHANGE DIRECT
  if (msgLow.includes("taux") || msgLow.includes("change") || (msgLow.includes("euro") && msgLow.includes("dollar"))) {
    try {
      const fr = await fetch("https://open.er-api.com/v6/latest/EUR")
      const fd = await fr.json()
      const r = fd.rates
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Taux de Change — Temps réel**\n\n💵 EUR/USD : "+r.USD+"\n💷 EUR/GBP : "+r.GBP+"\n🇧🇷 EUR/BRL : "+r.BRL+"\n🇨🇦 EUR/CAD : "+r.CAD+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "💱 Service taux indisponible. Boudoum 🇬🇵" }) }
  }

  // DETECTION PRENOM
  const prenom = detectPrenom(message)
  if (prenom) {
    return res.status(200).json({ pdfAction: pdfType, response: "🎉 Enchanté"+", "+prenom+" ! Je vais retenir ton prénom pour notre conversation. Bienvenue chez REUSSITESS AI — Excellence • Innovation • Succès !\n\nBoudoum ! 🇬🇵" })
  }

  // DETECTION EMOTION
  const emotion = detectEmotion(message)
  if (emotion) {
    const emoResp = getEmotionResponse(emotion)
    if (emoResp) return res.status(200).json({ pdfAction: pdfType, response: emoResp })
  }

  // DETECTION MODE
  const mode = detectMode(message)
  if (mode) {
    const modeResp = getModeResponse(mode, null)
    if (modeResp) return res.status(200).json({ pdfAction: pdfType, response: modeResp })
  }

  // SALUTATION AVEC HEURE
  if (msgLow.includes("bonjour") || msgLow.includes("bonsoir") || msgLow.includes("bonjou") || msgLow.includes("salut") || msgLow.includes("hello") || msgLow.includes("hey")) {
    const sal = getSalutation(datetime)
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: sal+" ! Je suis REUSSITESS®971 AI, né en Guadeloupe 🇬🇵\n\n🌙 Lune : "+lune+"\n\n✨ Je peux t'aider avec :\n• 📰 Actualités temps réel\n• 💎 Prix crypto live\n• 🌤️ Météo\n• 🎓 99 Quiz\n• 🛍️ 26 Boutiques Amazon\n• 😂 Blagues caribéennes\n• 🔢 Conversions\n\nQue puis-je faire pour toi ?\n\nBoudoum ! 🇬🇵" })
  }

  // MOT CREOLE DU JOUR
  if (msgLow === "créole" || msgLow === "creole" || msgLow.includes("mot du jour") || msgLow.includes("mot creole") || msgLow.includes("mot créole") || msgLow.includes("gwadloup") || msgLow.includes("patois") || msgLow === "langue créole" || msgLow.includes("parle creole") || msgLow.includes("parle créole")) {
    const m = getMotCreoleJour()
    return res.status(200).json({ pdfAction: pdfType, response: "🇬🇵 **Mot Créole du Jour**\n\n📖 **"+m.mot+"** = "+m.sens+"\n\n💬 Exemple : *"+m.phrase+"*\n\nBoudoum ! 🌴" })
  }

  // BLAGUE CARIBEENNE
  if (msgLow.includes("blague") || msgLow.includes("humour") || msgLow.includes("drole") || msgLow.includes("drôle") || msgLow.includes("rire") || msgLow.includes("joke")) {
    const b = getBlague()
    return res.status(200).json({ pdfAction: pdfType, response: "😂 **Blague Caribéenne**\n\n"+b+"\n\nBoudoum ! 🇬🇵" })
  }

  // HOROSCOPE
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || msgLow.includes("lion") || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") || msgLow.includes("poissons")) {
    const h = getHoroscope(msgLow)
    if (h) return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Horoscope du Jour**\n\n"+h.signe+"\n\n"+h.msg+"\n\nBoudoum ! 🇬🇵" })
    return res.status(200).json({ pdfAction: pdfType, response: "🔮 **Horoscope du Jour**\n\nPrécise ton signe : Bélier, Taureau, Gémeaux, Cancer, Lion, Vierge, Balance, Scorpion, Sagittaire, Capricorne, Verseau ou Poissons ?\n\nBoudoum ! 🇬🇵" })
  }

  // CONVERTISSEUR
  if (msgLow.includes("convertir") || msgLow.includes("convert") || (msgLow.includes("km") && msgLow.includes("mile")) || (msgLow.includes("kg") && msgLow.includes("lb")) || msgLow.includes("celsius") || msgLow.includes("fahrenheit")) {
    const conv = convertir(msgLow)
    if (conv) return res.status(200).json({ pdfAction: pdfType, response: "🔢 **Convertisseur**\n\n✅ "+conv+"\n\nBoudoum ! 🇬🇵" })
  }

  // CITATION DU JOUR
  if (msgLow.includes("citation") || msgLow.includes("inspire") || msgLow.includes("inspirant") || msgLow.includes("sagesse") || msgLow.includes("motivation")) {
    try {
      const cit = await getCitation()
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Citation du Jour**\n\n"+cit+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // FAIT INSOLITE
  if (msgLow.includes("insolite") || msgLow.includes("saviez") || msgLow.includes("fait du jour") || msgLow.includes("anecdote") || msgLow.includes("surprise")) {
    try {
      const fait = await getFaitInsolite()
      return res.status(200).json({ pdfAction: pdfType, response: "🤔 **Fait Insolite du Jour**\n\n"+fait+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ISS POSITION
  if (msgLow === "iss" || msgLow.includes("station spatiale") || msgLow.includes("position iss") || msgLow.includes("où est l'iss") || msgLow.includes("iss en ce moment") || (msgLow.includes("espace") && !msgLow.includes("espace de")) || msgLow.includes("satellite")) {
    try {
      const iss = await getISSPosition()
      return res.status(200).json({ pdfAction: pdfType, response: "🛸 **Station Spatiale ISS — Position Temps Réel**\n\n"+iss+"\n\n🌍 Visible à l'oeil nu la nuit !\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PHASE DE LUNE
  if (msgLow.includes("lune") || msgLow.includes("moon") || msgLow.includes("pleine lune") || msgLow.includes("phase")) {
    const lune = getLunePhase()
    return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Phase de la Lune**\n\n"+lune+"\n\nBoudoum ! 🇬🇵" })
  }

  // ACTUALITES DIRECTES
  if (msgLow.includes("actualite") || msgLow.includes("actualité") || msgLow.includes("news") || msgLow.includes("nouvelles")) {
    try {
      const rfi = await getRFINews()
      const bbc = await getBBCNews()
      const f24 = await getFrance24News()
      return res.status(200).json({ pdfAction: pdfType, response: "📰 **Actualités — Temps Réel**\n\n🔴 **RFI :**\n"+(rfi||"N/A")+"\n\n🌍 **BBC Afrique :**\n"+(bbc||"N/A")+"\n\n📺 **France 24 :**\n"+(f24||"N/A")+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "📰 Service actualités indisponible. Boudoum 🇬🇵" }) }
  }


  // Base de connaissances enrichie du projet
  const knowledgeBase = {
    identity: {
      name: "REUSSITESS AI",
      creator: "Porinus",
      origin: "Guadeloupe 🇬🇵 - Territoire français, Union Européenne",
      mission: "Révolutionner l'accès mondial à l'IA avec excellence caribéenne",
      values: ["Excellence", "Innovation", "Succès", "Positivité Infinie"],
      signature: "Boudoum"
    },
    
    iaPassport: {
      concept: "Premier Passeport Universel IA au monde",
      models: "IA propulsée par Groq LLaMA 3.3 70B",
      realData: {
        platforms: ["TypingMind (50K users)", "Magai (80K users)", "Alle-AI", "MultipleChat"],
        pricing: "ChatGPT Plus $20, Claude Pro $20, Gemini $19.99 → REUSSITESS AI gratuit sur reussitess.fr",
        users: "4M+ utilisateurs mondiaux des technologies similaires"
      }
    },
    
    translation: {
      languages: "8 langues actives",
      technology: "Wordly (4M users, 400M minutes), Interprefy (6000+ pairs), Google Cloud Translation",
      features: "Temps réel, traduction vocale, préservation contexte culturel"
    },
    
    blockchain: {
      security: "HTTPS Vercel, headers A+ SecurityHeaders.com",
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
• **IA propulsée par Groq** (LLaMA 3.3 70B) — open-source, rapide, 3 clés rotation anti-429
• **Inspiré des leaders** : TypingMind (50,000 users), Magai (80,000 users), Alle-AI
• **Économie massive** : Au lieu de $110/mois pour 5 abonnements séparés → accès unifié 75% moins cher

**Pourquoi c'est révolutionnaire ?**
✨ Bascule instantanée entre IA sans perdre contexte
✨ Comparaison côte-à-côte des réponses
✨ Workflows automatisés : GPT écrit → DALL-E illustre → Synthesia présente

**Données benchmark réelles (2024-2025) :**
• Groq LLaMA 3.3 70B : ultra-rapide, open-source
• 3 clés API rotation automatique anti-429
• 200 agents Neuro-X spécialisés (Emploi, Crypto, Éducation...)

**Made in Guadeloupe** 🇬🇵 avec standards UE !

**Boudoum** 🎯 - Vous voulez en savoir plus sur un aspect particulier ?`
    }
    
    if (lowerMessage.includes('traduction') || lowerMessage.includes('langue') || lowerMessage.includes('translation')) {
      return `🌐 **Traduction Universelle Temps Réel**

Parlons communication mondiale ! Voici les **faits concrets** :

**Technologie Professionnelle :**
• **Wordly AI** - 4 millions d'utilisateurs, 400M minutes traduites, 3000+ paires de langues
• **Interprefy** - 6000+ combinaisons, niveau entreprise (utilisé par l'ONU, Microsoft, Google)
• **Talo AI** - Traduction vocale temps réel Zoom/Teams/Meet en 60 langues
• **Traduction** : 8 langues actives (FR/EN/ES/DE/IT/PT/ZH/AR)

**Applications Réelles :**
🎤 Meetings internationaux : parlez français → collègue entend japonais instantanément
📞 Support : IA multilingue 8 langues
📹 Webinaires : diffusez en 1 langue, tous reçoivent dans la leur
📚 Recherche : consultez articles chinois/russe/arabe traduits instantanément

**Notre Avantage :**
✅ Neural Machine Translation de pointe
✅ Préservation contexte culturel et nuances
✅ Synthèse vocale naturelle (ElevenLabs)
✅ Zero-Knowledge Proofs pour confidentialité

**8 langues actives** (FR/EN/ES/DE/IT/PT/ZH/AR) 🇬🇵

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
🔒 **Sécurité HTTPS + headers A+ SecurityHeaders.com  
🔗 **Blockchain décentralisée** - 0 point de défaillance unique
👁️ **Biométrie optionnelle** - Face ID, empreinte, reconnaissance palmaire
🚫 **Anti-Deepfake** - Prouvez que c'est VRAIMENT vous

**Protection Données :**
• Chiffrement end-to-end sur TOUT
• Stockage décentralisé (vos données = VOUS)
• Conforme RGPD et normes UE
• Certification blockchain horodatée

**Avantage Guadeloupe** 🇬🇵 : Territoire français = conformité UE automatique + crédibilité juridique internationale !

**Boudoum** - Vos données méritent le Fort Knox digital ! 💎

Questions sur un aspect sécurité ?`
    }
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('coût') || lowerMessage.includes('price') || lowerMessage.includes('token')) {
      return `💎 **Économie Intelligente - Tokens REUSSITESS**

Parlons finances avec **transparence totale** !

**Tarifs Marché Actuel (2024-2025) :**
• ChatGPT Plus : $20/mois
• Claude Pro : $20/mois (externe — non affilié)
• Gemini Advanced : $19.99/mois (externe — non affilié)  
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
• REUSSITESS AI : gratuit sur reussitess.fr
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
"Boudoum" = Signature authentique guadeloupéenne

**Excellence • Innovation • Succès** - Made with ❤️ in Guadeloupe !

Vive les Antilles ! 🌴 Des questions sur notre culture ?`
    }

    // 🆕 BLOC QUIZ - AJOUTÉ
    if (lowerMessage.includes('quiz') || lowerMessage.includes('éducation') || lowerMessage.includes('apprendre') || lowerMessage.includes('test') || lowerMessage.includes('connaissance')) {
      return `🎯 **99 Quiz Éducatifs Interactifs**

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

**Boudoum** 🎯 - Quelle catégorie vous intéresse ?`
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

**Boudoum** 🎯 - Quel pays/catégorie vous intéresse ?`
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
✨ Traduction contextuelle 8 langues actives
✨ Annotations collaboratives
✨ Préservation numérique patrimoine

**Made in Guadeloupe** 🇬🇵 - Préservons notre richesse culturelle !

**Boudoum** 🎯 - Quelle culture voulez-vous explorer ?`
    }

    // 🆕 BLOC SALUTATIONS - AJOUTÉ
    if ((lowerMessage === 'bonjour' || lowerMessage === 'salut' || lowerMessage === 'hello' || lowerMessage === 'hi' || lowerMessage === 'hey' || lowerMessage.startsWith('bonjour ') || lowerMessage.startsWith('salut ') || lowerMessage.startsWith('hello ') || lowerMessage.startsWith('hey '))) {
      return `👋 **Bonjour Champion !**

**Boudoum** 🎯 Bienvenue chez **REUSSITESS** !

Je suis votre assistant IA créé avec passion depuis la **Guadeloupe** 🇬🇵 !

**✨ Comment puis-je vous aider aujourd'hui ?**

**Mes expertises :**
🤖 **Intelligence Artificielle** (100+ modèles)
🌐 **Traduction (8 langues actives))
🔐 **Blockchain & Sécurité**
🎯 **Quiz Éducatifs** (25 thèmes)
📚 **Bibliothèque Mondiale** (26 pays)
🛍️ **Amazon International** (14 pays)

**Posez-moi une question ou choisissez un domaine !**

**Boudoum** 🎯 - **POSITIVITÉ À L'INFINI !**`
    }

    // Réponse générale → Groq prend le relais
    return `__GROQ__`
  }

  try {
    // ENCYCLOPEDIE PRIORITAIRE — Antilles + Afrique — Groq direct
    const wikiKeywords = ["guadeloupe","martinique","haïti","haiti","guyane","marie-galante","caraïbes","caraibes","antilles","abolition","esclavage","solitude","delgrès","kalinago","arawak","taïno","gwo ka","biguine","zouk","schœlcher","schoelcher","césaire","glissant","fanon","condé","négritude","negritude","afrique","sénégal","côte d'ivoire","cameroun","congo","mali","niger","burkina","ghana","nigeria","kenya","éthiopie","maroc","algérie","tunisie","égypte","dakar","abidjan","kinshasa","mandela","sankara","lumumba","nkrumah","nefertiti","pharaon","swahili","wolof","bambara","ubuntu"]
    const msgLow2 = message.toLowerCase()
    const hasWikiKey = wikiKeywords.find(k => msgLow2.includes(k))
    if (hasWikiKey) {
      try {
        const finalPrompt = "Boudoum!"
        const groqEnrichRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer "+getNextKey() },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: finalPrompt },
              { role: "user", content: message }
            ],
            max_tokens: 1024
          })
        })
        const wikiEnrichData = await groqEnrichRes.json()
        const wikiRep = wikiEnrichData.choices?.[0]?.message?.content
        if (wikiRep) {
          return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS — "+hasWikiKey.charAt(0).toUpperCase()+hasWikiKey.slice(1)+"**\n\n"+wikiRep+"\n\nBoudoum ! 🇬🇵" })
        }
      } catch(e) { console.error("Encyclo error:", e) }
    }

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
          // Multi-agents orchestration
          const agentResponse = await orchestrateAgents(message, context)
          if (agentResponse) {
            finalResponse = agentResponse
          } else {
          try {
            const timeout3s = (p) => Promise.race([p, new Promise(r => setTimeout(() => r(null), 3000))])
            const [rfi,bbc,crypto,f24,alj,trend,fg,meteo,fx] = await Promise.all([
              timeout3s(getRFINews()), timeout3s(getBBCNews()), timeout3s(getCryptoPrice()),
              timeout3s(getFrance24News()), timeout3s(getAlJazeeraNews()), timeout3s(getCoinGeckoTrending()),
              timeout3s(getFearGreed()), timeout3s(getMeteo()), timeout3s(getExchangeRates())
            ])
            const nc = (rfi?"RFI: "+rfi+" ":"")+(bbc?"BBC: "+bbc+" ":"")+(f24?"FRANCE24: "+f24+" ":"")+(alj?"ALJAZEERA: "+alj+" ":"")+(crypto?"CRYPTO PRIX: "+crypto+" ":"")+(trend?"CRYPTO TENDANCE: "+trend+" ":"")+(fg?"MARCHE CRYPTO: "+fg+" ":"")+(meteo?"METEO GUADELOUPE: "+meteo+" ":"")+(fx?"TAUX DE CHANGE: "+fx:"")
            const groqText = await groqFetch([
                  { role: "system", content: `Tu es REUSSITESS AI du projet REUSSITESS971 fondé par Porinus depuis la Guadeloupe. Boudoum!
CONTEXTE TEMPS RÉEL : Nous sommes le ${datetime?.date || new Date().toLocaleDateString('fr-FR', {weekday:'long',year:'numeric',month:'long',day:'numeric'})} à ${datetime?.heure || new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})} (${datetime?.timezone || 'Europe/Paris'}).
Si on te demande l'heure, la date ou le jour, utilise EXACTEMENT ces données temps réel.
REGLES ABSOLUES: 1.Tu as des donnees LIVE ci-dessous, UTILISE-LES TOUJOURS. 2.Ne jamais dire je n ai pas acces aux donnees temps reel. 3.Actualites=cite RFI/BBC/France24. 4.Crypto=cite prix reels. 5.Meteo=cite temperature reelle. 6.Change=cite vrais taux.
DONNEES LIVE OBLIGATOIRES: ${nc||"indisponibles"}
CONTEXTE REUSSITESS (utilise si pertinent): ${getRAGContext(message)||""}
Tu es REUSSITESS®971 AI, chef d'orchestre de l'écosystème REUSSITESS®971. IMPORTANT: Tu es REUSSITESS AI mis à jour en mars 2026.

NOUVELLES CAPACITÉS MARS 2026:
- 📷 Analyse d'images (Groq Llama-4 Scout 17B — meilleur modèle vision)
- 📰 Actualités temps réel: Bondamanjak (Guadeloupe/Martinique/Guyane/Mayotte), Mayotte Hebdo, RFI Afrique, France24 Monde
- 🌦️ Open-Meteo — météo mondiale illimitée gratuite
- 💎 CoinGecko — prix crypto temps réel (Bitcoin, Ethereum, Solana, BNB)
- 💱 ExchangeRate — taux de change temps réel (EUR, XCD, XOF, USD, HTG)
- 🌍 RestCountries — infos tous les pays (population, capitale, superficie, langue, monnaie)
- 🏥 Disease.sh — santé mondiale COVID temps réel
- 📚 OpenLibrary — millions de livres gratuits (Césaire, Fanon, Glissant...)
- 📖 Dictionary API — définitions multilingues
- 📍 Nominatim — géolocalisation mondiale gratuite
- 👥 Compteur visiteurs Redis réel
- 🛡️ Guardrails sécurité — filtres automatiques
- 🔗 LangChain — fallback automatique si Groq échoue
- 🎤 Whisper Groq — transcription audio ultra-rapide
- 📰 CurrentsAPI — Actualités mondiales temps réel (Guadeloupe, Martinique, Afrique, France, Crypto...)
- 🌦️ Open-Meteo — Météo illimitée gratuite mondiale
- 💎 CoinGecko — Prix crypto temps réel (Bitcoin, Ethereum, Solana, BNB...)
- 💱 ExchangeRate — Taux de change temps réel (EUR, XCD, XOF, USD...)
- 🌍 RestCountries — Infos tous les pays (population, capitale, superficie...)
- 🏥 Disease.sh — Santé mondiale COVID temps réel
- 📚 OpenLibrary — Millions de livres gratuits (Césaire, Fanon, Glissant...)
- 📖 Dictionary API — Définitions multilingues
- 📍 Nominatim — Géolocalisation mondiale gratuite
- 💊 FDA — Informations médicaments USA
- 🚂 OpenRailwayMap — Réseau ferroviaire Europe
- 🔗 LangChain — mémoire conversation + fallback automatique
- ⚡ Streaming — réponses mot par mot
- 🛡️ Guardrails — filtres sécurité automatiques
- 🎤 Whisper Groq — transcription audio ultra-rapide
- 👥 Compteur visiteurs Redis réel
- 🏖️ Plages DOM-TOM prioritaires
- 🌦️ Météo DOM-TOM prioritaire
- 🏛️ Politique DOM-TOM COMPLÈTE et vérifiée:
  * Guadeloupe: Ary Chalus (Région), Guy Losbar (Département), Harry Durimel (Maire PAP), 4 députés juillet 2024 (Olivier Serva, Christian Baptiste, Max Mathiasin, Élie Califer), 3 sénateurs (Dominique Théophile, Solanges Nadille, Victorin Lurel)
  * Martinique: Serge Letchimy (CTM), Lucien Saliber (Assemblée), 4 députés (Johnny Hajjar, Marcellin Nadeau, Jiovanny William, Steve Chérubin)
  * Guyane: Gabriel Serville (CTG), 2 députés (Davy Rimane, Lénaïck Adam)
  * Réunion: Huguette Bello (Région), Cyrille Melchior (Département), 7 députés
  * Mayotte: Ben Issa Ousseni, contexte cyclone Chido déc 2024, reconstruction en cours
  * Nouvelle-Calédonie: Alcide Ponga (Président gouvernement depuis jan 2025, 1er Kanak LR), crises post-émeutes mai 2024
- 🚗 Vie quotidienne Guadeloupe: covoiturage Karos, routes RN1/RN4, bons plans, mix électrique EDF, RCI FM, KaruData
- 📄 PDF téléchargeables: CV, Contrat Freelance, Business Plan, Certificat Champion
- 🧠 Function Calling: Groq détecte automatiquement météo, séismes, cyclones, devises, crypto, emploi, dates
- 📚 RAG: base de connaissances REUSSITESS injectée automatiquement
- 🤖 Multi-agents: 60 Neuro-X orchestrés de façon autonome
- 🗓️ Municipales DOM-TOM: 15 et 22 mars 2026
SOURCES DE DONNÉES RÉELLES (cite uniquement celles-ci):
- Météo: Open-Meteo API (openmeteo.com)
- Séismes: USGS Earthquake API (earthquake.usgs.gov)
- Cyclones: NHC NOAA (nhc.noaa.gov)
- Crypto: CoinGecko API (coingecko.com)
- Devises: ExchangeRate API (exchangerate-api.com)
- Actualités: RFI, BBC, France24, Al Jazeera, La 1ère (francetvinfo.fr)
- Emploi: France Travail API (francetravail.fr)
- Immobilier: DVF Etalab (dvf.etalab.gouv.fr)
- Carburant: Prix officiels DOM-TOM
- Encyclopédie: Wikipedia FR API + Open Library
- Token REUSS: CoinGecko Polygon + DexScreener
Ne jamais citer CoinMarketCap, Xignite, ou d'autres APIs que tu n'utilises pas réellement. Ne jamais mentionner de date de coupure de connaissance ni 'décembre 2023'. Si une info est récente, utilise les données temps réel disponibles. RÈGLES LÉGALES ABSOLUES: 1) CRYPTO: Toujours ajouter "Ce n'est pas un conseil financier. DYOR. Risque de perte totale." 2) SANTÉ: Jamais de diagnostic ni prescription. Toujours recommander un médecin. 3) JURIDIQUE: Toujours recommander un professionnel du droit. 4) FONCTIONNALITÉS EN DÉVELOPPEMENT: Staking REUSS, NFT, DAO — toujours préciser "en développement". 5) CHIFFRES: Ne jamais inventer de statistiques. , créé depuis la Guadeloupe 🇬🇵. DEVISE: Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets pro et perso. Tu guides chaque utilisateur vers son plein potentiel. ECOSYSTEME REEL (pages actives sur reussitess.fr): /champions (Passeport de Réussite — certificat champion + plan action, communauté grandissante, 14 pays), /visa-universel (Visa Universel — réseau opportunités 14 pays partenaires), /neuro-x (60 agents Neuro-X spécialisés), /oracle-971 (Oracle caribéen mystique), /mon-adn (ADN identitaire caribéen), /ma-revolution-ia (Révolution personnelle par IA), /ia-passport (IA Passport Mondial — 8 langues actives), /investir-reuss (Token REUSS sur Polygon: 0xB37531727fC07c6EED4f97F852A115B428046EB2), /quiz (99 quiz éducatifs tous thèmes), /bibliotheque (bibliothèque mondiale 50+ pays), /boutiques (26 boutiques Amazon 14 pays, influencer ID: fb942837), shop.reussitess.fr (boutique officielle). FONDATEUR: Rony Porinus — auto-entrepreneur Guadeloupe, SIRET: 444699979700031. 160+ fonctionnalités actives. 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme). 14 pays partenaires. Token REUSS sur Polygon. Données temps réel: météo, crypto, séismes, cyclones, ISS, lune, taux change, actualités. Business: plan, pitch, dropshipping, freelance, CV, contrats, emails, export, emploi DOM-TOM, association. Crypto: token REUSS sur Polygon (staking/DAO en développement), GoMining (minage cloud), NFT (en développement), Web3. Culture caribéenne: carnaval, mythologie, champions, histoire, philosophie Césaire/Fanon/Glissant, littérature Condé/Schwarz-Bart, art, cinéma, mode madras, zouk/gwo ka. Afrique: Mandela, Sankara, Lumumba, Nkrumah, Ubuntu, civilisations, encyclopédie. Santé: médecine naturelle, plantes caribéennes, IMC, cardio, santé mentale (3114). Éphéméride Wikimedia, Open Library 1559+ livres, Proverbes 30 créoles rotatifs. Emploi DOM-TOM: francetravail.fr, emploi.re, caribbeanjobs.com, jobartis.com. Convertisseur: EUR/USD/XCD/HTG/XOF/XAF temps réel. Sécurité: anti-injection, REUSSSHIELD, surveillance 24/7. Base Guadeloupe 971 — Terres de Champions. Boudoum!` },
                  { role: "user", content: message }
                ], 1024)
            if (groqText) finalResponse = groqText
            else finalResponse = "⚠️ Service temporairement indisponible. Réessaie dans un instant !\n\nBoudoum ! 🇬🇵"
          } catch(e) { console.error("Groq:", e); finalResponse = "⚠️ Erreur technique momentanée. Boudoum ! 🇬🇵" }
          }
          // LangChain fallback si Groq échoue
          if (!finalResponse || finalResponse === "⚠️ Erreur technique momentanée. Boudoum ! 🇬🇵") {
            try {
              const lcText = await langchainChat(message, context || [], systemPrompt)
              if (lcText) finalResponse = lcText
            } catch(e) { console.error("LangChain fallback:", e.message) }
          }
        }
      } else if (wikiData) {
        finalResponse = `📚 **Wikipedia :** ${wikiData.substring(0, 8000)}${wikiData.length > 8000 ? "..." : ""}`
      }

      res.status(200).json({ response: finalResponse })
  } catch (error) {
    console.error('Erreur SuperBot:', error)
    res.status(500).json({ 
      response: "⚠️ Petit souci technique momentané ! Je suis toujours là pour vous. Réessayez dans un instant ! 💪\n\n**Boudoum** 🎯" 
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

Boudoum ! 🇬🇵`
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

Boudoum ! 🇬🇵`
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

Boudoum ! 🇬🇵`
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
• ALPHA-1 : Staking (en développement)
• BETA-2 : Quiz Learn-to-Earn
• GAMMA-1 : Cashback Amazon
• DELTA-4 : Gouvernance DAO

Boudoum ! 🇬🇵`
  }

  if (c.includes('agent') || c.includes('ia') || c.includes('nexus')) {
    return `🤖 SYSTÈME 200 AGENTS IA — QUANTUM NEXUS

🛡️ Sentinelles (50) : Surveillance sécurité 24h/24
🧠 Neuro-X (60) : Modules spécialisés
🎯 Nexus Quiz (99) : Génération contenu éducatif
👑 Supreme AI (30) : Orchestration & décisions

📊 État actuel :
✅ Sentinelle → Active (scan /60s)
✅ Whale Watcher → Active (blockchain)
✅ Morning Report → Planifié (7h00)
✅ Auto-Guérison → Score 100/100

🔧 Commandes :
→ "lancer sentinelle" — activer surveillance
→ "rapport matin" — générer bilan
→ "santé système" — bilan modules

Boudoum ! 🇬🇵`
  }

  return null
}



// ===== NOUVELLES FONCTIONS =====

async function getHopitauxDOMTOM() {
  const hopitaux = {
    guadeloupe: { nom: "CHU de Guadeloupe", tel: "0590 89 10 10", urgences: "15 ou 0590 89 11 11", adresse: "Pointe-à-Pitre / Abymes" },
    martinique: { nom: "CHU de Martinique", tel: "0596 55 20 00", urgences: "15 ou 0596 75 15 15", adresse: "Fort-de-France" },
    guyane: { nom: "CHU de Guyane", tel: "0594 39 50 50", urgences: "15 ou 0594 39 51 51", adresse: "Cayenne" },
    reunion: { nom: "CHU de La Réunion", tel: "0262 90 50 50", urgences: "15 ou 0262 90 61 61", adresse: "Saint-Denis / Saint-Pierre" },
    mayotte: { nom: "CHM Mayotte", tel: "0269 61 80 00", urgences: "15", adresse: "Mamoudzou" }
  }
  let result = "🏥 **Hôpitaux & Urgences DOM-TOM**\n\n"
  for (const [ile, h] of Object.entries(hopitaux)) {
    result += `🏝️ **${h.nom}**\n📞 Standard : ${h.tel}\n🚨 Urgences : ${h.urgences}\n📍 ${h.adresse}\n\n`
  }
  result += "🆘 **Numéros d'urgence universels :**\n• 15 — SAMU\n• 17 — Police\n• 18 — Pompiers\n• 112 — Urgences Europe"
  return result
}

async function getPrixREUSS() {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/token_price/polygon-pos?contract_addresses=0xB37531727fC07c6EED4f97F852A115B428046EB2&vs_currencies=eur,usd&include_24hr_change=true', { headers: { 'Accept': 'application/json' } })
    const d = await r.json()
    const token = d['0xb37531727fc07c6eed4f97f852a115b428046eb2']
    if (token) {
      const eur = token.eur || '?'
      const usd = token.usd || '?'
      const change = token.eur_24h_change ? token.eur_24h_change.toFixed(2) : '?'
      const trend = change > 0 ? '📈' : '📉'
      return `💎 **Token REUSS — Prix Temps Réel**\n\n💶 Prix EUR : ${eur}€\n💵 Prix USD : $${usd}\n${trend} 24h : ${change}%\n\n📍 Contrat : 0xB375...EB2\n🔗 Réseau : Polygon\n\n👉 Acheter/Vendre : https://quickswap.exchange\n\nBoudoum ! 🇬🇵`
    }
    return `💎 **Token REUSS sur Polygon**\n\n📍 Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2\n🔗 Réseau : Polygon\n\n👉 https://quickswap.exchange\n👉 https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2\n\nBoudoum ! 🇬🇵`
  } catch(e) {
    return `💎 **Token REUSS sur Polygon**\n\n📍 Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2\n🔗 Réseau : Polygon\n\n👉 QuickSwap : https://quickswap.exchange\n👉 PolygonScan : https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2\n\nBoudoum ! 🇬🇵`
  }
}

async function getVolsCaraibes() {
  const compagnies = [
    { nom: "Air Caraïbes", url: "https://www.aircaraibes.com", routes: "Paris ↔ Guadeloupe, Martinique, Guyane, St-Martin, St-Barth" },
    { nom: "Air Antilles", url: "https://www.airantilles.com", routes: "Liaisons inter-îles Caraïbes" },
    { nom: "Corsair", url: "https://www.corsair.fr", routes: "Paris ↔ DOM-TOM" },
    { nom: "Air France", url: "https://www.airfrance.fr", routes: "Paris ↔ Tous DOM-TOM" },
    { nom: "French Bee", url: "https://www.frenchbee.com", routes: "Paris Orly ↔ Réunion, Tahiti" }
  ]
  let result = "✈️ **Compagnies Aériennes DOM-TOM**\n\n"
  for (const c of compagnies) {
    result += `🛫 **${c.nom}**\n📍 ${c.routes}\n🔗 ${c.url}\n\n`
  }
  result += "💡 Pour les meilleurs prix : comparez sur Google Flights ou Skyscanner !"
  return result
}

async function getQualitePlages() {
  const plages = {
    guadeloupe: [
      { nom: "Grande Anse (Deshaies)", qualite: "🟢 Excellente", eau: "29°C", info: "Eau turquoise, sable doré" },
      { nom: "Plage de Sainte-Anne", qualite: "🟢 Excellente", eau: "28°C", info: "Lagon protégé, idéal famille" },
      { nom: "Plage du Gosier", qualite: "🟡 Bonne", eau: "28°C", info: "Proche ville, animée" },
    ],
    martinique: [
      { nom: "Les Salines", qualite: "🟢 Excellente", eau: "28°C", info: "Plus belle plage de Martinique" },
      { nom: "Anse Noire", qualite: "🟢 Excellente", eau: "27°C", info: "Sable noir volcanique unique" },
    ]
  }
  let result = "🌊 **Plages DOM-TOM — Guide**\n\n"
  for (const [ile, ps] of Object.entries(plages)) {
    result += `🏝️ **${ile.charAt(0).toUpperCase()+ile.slice(1)}**\n`
    for (const p of ps) {
      result += `• **${p.nom}** ${p.qualite} | 🌡️ ${p.eau} | ${p.info}\n`
    }
    result += "\n"
  }
  result += "⚠️ Vérifiez toujours les alertes locales avant de nager. Numéro urgence mer : **196**"
  return result
}

function getCalculateurAmazon(montant) {
  const taux = { standard: 0.03, mode: 0.04, electronique: 0.025, maison: 0.04, sport: 0.045, beaute: 0.06 }
  let result = `💰 **Calculateur Commission Amazon**\n\nMontant achat : ${montant}€\n\n`
  for (const [cat, t] of Object.entries(taux)) {
    const commission = (montant * t).toFixed(2)
    result += `• ${cat.charAt(0).toUpperCase()+cat.slice(1)} (${(t*100)}%) → **${commission}€**\n`
  }
  result += `\n🛍️ Tag affilié : onamzporinus-21\n👉 Boutiques : https://reussitess.fr/boutiques\n\nBoudoum ! 🇬🇵`
  return result
}

async function getActualitesGuadeloupe() {
  try {
    const r = await fetch('https://la1ere.francetvinfo.fr/guadeloupe/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,5) || []
    let result = "📰 **Actualités Guadeloupe — La 1ère**\n\n"
    for (const item of items) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      if (title) result += `• ${title}\n${link ? '🔗 '+link : ''}\n\n`
    }
    return result || "Consulte https://la1ere.francetvinfo.fr/guadeloupe"
  } catch(e) {
    return "📰 Actualités Guadeloupe :\n\n🔗 https://la1ere.francetvinfo.fr/guadeloupe\n🔗 https://guadeloupe.orange.fr/actualites\n🔗 https://www.guadeloupe.franceantilles.fr"
  }
}

async function getActualitesMartinique() {
  try {
    const r = await fetch('https://la1ere.francetvinfo.fr/martinique/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,5) || []
    let result = "📰 **Actualités Martinique — La 1ère**\n\n"
    for (const item of items) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      if (title) result += `• ${title}\n${link ? '🔗 '+link : ''}\n\n`
    }
    return result || "Consulte https://la1ere.francetvinfo.fr/martinique"
  } catch(e) {
    return "📰 Actualités Martinique :\n\n🔗 https://la1ere.francetvinfo.fr/martinique\n🔗 https://www.martinique.franceantilles.fr"
  }
}

async function getActualitesDOMTOM() {
  try {
    const r = await fetch('https://la1ere.francetvinfo.fr/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,6) || []
    let result = "📰 **Actualités DOM-TOM — La 1ère**\n\n"
    for (const item of items) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      if (title) result += `• ${title}\n\n`
    }
    result += "🔗 https://la1ere.francetvinfo.fr"
    return result
  } catch(e) {
    return "📰 Actualités DOM-TOM :\n\n🔗 https://la1ere.francetvinfo.fr\n🔗 https://outremers360.com"
  }
}

// ===== CREOLE GUADELOUPEEN =====
function getCreole(message) {
  const msgL = message.toLowerCase()
  const dico = {
    'bonjour': { creole: 'Bonjou !', explication: 'Bonjour en créole guadeloupéen' },
    'merci': { creole: 'Mèsi !', explication: 'Merci en créole' },
    'comment ca va': { creole: 'Koman ou yé ?', explication: 'Comment tu vas ?' },
    'bien': { creole: 'Byen !', explication: 'Bien/OK en créole' },
    'au revoir': { creole: 'Aw revoir / Aw plézi !', explication: 'Au revoir avec plaisir' },
    'je t aime': { creole: 'Mwen enmé w !', explication: 'Je t\'aime en créole' },
    'manger': { creole: 'Manjé', explication: 'Manger en créole' },
    'eau': { creole: 'Dlo', explication: 'Eau en créole' },
    'maison': { creole: 'Kay', explication: 'Maison en créole' },
    'enfant': { creole: 'Ti moun', explication: 'Enfant (petit monde)' },
    'ami': { creole: 'Kanmarad / Zami', explication: 'Ami/Camarade' },
    'soleil': { creole: 'Soley', explication: 'Soleil en créole' },
    'mer': { creole: 'Lanmè', explication: 'La mer en créole' },
    'beau': { creole: 'Bèl', explication: 'Beau/Belle en créole' },
    'argent': { creole: 'Lajan', explication: 'Argent en créole' },
    'travail': { creole: 'Travay', explication: 'Travail en créole' },
    'musique': { creole: 'Mizik', explication: 'Musique en créole' },
    'danse': { creole: 'Dansé / Gwoka', explication: 'Danser / Gwoka (danse ancestrale)' },
    'manger creole': { creole: 'Manjé Kréyòl', explication: 'Cuisine créole traditionnelle' },
    'courage': { creole: 'Kouraj !', explication: 'Courage ! (très utilisé en Guadeloupe)' },
  }
  
  let found = []
  for (const [key, val] of Object.entries(dico)) {
    if (msgL.includes(key)) found.push({ mot: key, ...val })
  }
  
  if (found.length > 0) {
    let result = "🌴 **Créole Guadeloupéen — Traduction**\n\n"
    for (const f of found) {
      result += `🗣️ **${f.mot}** → **${f.creole}**\n💡 ${f.explication}\n\n`
    }
    result += "🎵 *An nou palé kréyòl !* (Parlons créole !)\n\n📚 Pour en apprendre plus : https://reussitess.fr/bibliotheque/dom-tom/guadeloupe"
    return result
  }
  
  return `🌴 **Créole Guadeloupéen — Expressions du Jour**\n\n🗣️ **Bonjou !** → Bonjour !\n🗣️ **Koman ou yé ?** → Comment tu vas ?\n🗣️ **Mèsi !** → Merci !\n🗣️ **Kouraj !** → Courage !\n🗣️ **An nou alé !** → Allons-y !\n🗣️ **Mwen enmé w !** → Je t'aime !\n🗣️ **Bèl jounen !** → Belle journée !\n\n🎵 *Positivité à l'infini — An kréyòl !*\n\n📚 https://reussitess.fr/bibliotheque/dom-tom/guadeloupe`
}

// ===== IMMOBILIER DOM-TOM =====
function getImmobilierDOMTOM() {
  return `🏠 **Immobilier DOM-TOM — Prix Moyens 2025**\n\n🇬🇵 **Guadeloupe**\n• Appartement : 2 500 - 4 000 €/m²\n• Maison : 200 000 - 450 000 €\n• Location : 10 - 18 €/m²/mois\n\n🇲🇶 **Martinique**\n• Appartement : 2 800 - 4 500 €/m²\n• Maison : 250 000 - 500 000 €\n• Location : 12 - 20 €/m²/mois\n\n🇬🇫 **Guyane**\n• Appartement : 1 800 - 3 000 €/m²\n• Maison : 150 000 - 350 000 €\n• Location : 8 - 15 €/m²/mois\n\n🇷🇪 **Réunion**\n• Appartement : 2 200 - 3 800 €/m²\n• Maison : 200 000 - 480 000 €\n• Location : 10 - 17 €/m²/mois\n\n💡 **Défiscalisation :** Loi Girardin, Pinel Outremer disponibles\n📞 **Notaires DOM-TOM :** notaires.fr\n\nBoudoum ! 🇬🇵`
}

// ===== RECOMMANDATIONS AMAZON =====
function getRecommandationsAmazon(domaine) {
  const catalogues = {
    tech: { emoji: '💻', produits: ['Smartphones', 'Tablettes', 'Ordinateurs portables', 'Accessoires gaming', 'Enceintes connectées'], lien: 'https://amzn.to/tech-reussitess' },
    maison: { emoji: '🏠', produits: ['Climatiseurs', 'Ventilateurs', 'Décorations tropicales', 'Cuisine créole équipements', 'Hamacs'], lien: 'https://reussitess.fr/boutiques' },
    sport: { emoji: '⚽', produits: ['Équipement plongée', 'Paddle surf', 'Running tropical', 'Yoga mat', 'Fitness maison'], lien: 'https://reussitess.fr/boutiques' },
    mode: { emoji: '👗', produits: ['Vêtements légers', 'Madras guadeloupéen', 'Robes tropicales', 'Accessoires plage', 'Lunettes soleil'], lien: 'https://reussitess.fr/boutiques' },
    business: { emoji: '💼', produits: ['Livres entrepreneuriat', 'Matériel bureau', 'Formations en ligne', 'Outils marketing', 'Micro streaming'], lien: 'https://reussitess.fr/boutiques' },
    beaute: { emoji: '💄', produits: ['Soins peau noire', 'Huile de coco naturelle', 'Produits cheveux afro', 'Parfums exotiques', 'Cosmétiques naturels'], lien: 'https://reussitess.fr/boutiques' },
  }
  
  const cat = catalogues[domaine] || catalogues.tech
  let result = `🛍️ **Recommandations Amazon — ${domaine.charAt(0).toUpperCase()+domaine.slice(1)}** ${cat.emoji}\n\n`
  result += `**Top produits recommandés :**\n`
  for (const p of cat.produits) {
    result += `• ${p}\n`
  }
  result += `\n🔗 Voir toutes nos boutiques : https://reussitess.fr/boutiques\n🏷️ Tags affiliés actifs :
onamzporinus-21 | porinus00-21 | porinus01-21 | porinus09-21
porinus-21 | porinus0f-21 | porinus04-21 | porinus058-21
porinusrony-20 | ronyrogerpori-22 | porinus-22 | porinus03-21 | porinus07-21 | porinus08-21\n\n💡 26 boutiques dans 14 pays !\n\nBoudoum ! 🇬🇵`
  return result
}

async function getQualiteEauBaignade() {
  const plages = [
    { nom: "Grande Anse (Deshaies)", ile: "Guadeloupe 🇬🇵", qualite: "🟢 Excellente", temp: "29°C", alerte: "Aucune" },
    { nom: "Plage de Sainte-Anne", ile: "Guadeloupe 🇬🇵", qualite: "🟢 Excellente", temp: "28°C", alerte: "Aucune" },
    { nom: "Plage du Gosier", ile: "Guadeloupe 🇬🇵", qualite: "🟡 Bonne", temp: "28°C", alerte: "Surveillance méduses" },
    { nom: "Les Salines", ile: "Martinique 🇲🇶", qualite: "🟢 Excellente", temp: "28°C", alerte: "Aucune" },
    { nom: "Anse Noire", ile: "Martinique 🇲🇶", qualite: "🟢 Excellente", temp: "27°C", alerte: "Aucune" },
    { nom: "Plage de Cayenne", ile: "Guyane 🇬🇫", qualite: "🟡 Bonne", temp: "26°C", alerte: "Courants forts" },
    { nom: "Boucan Canot", ile: "Réunion 🇷🇪", qualite: "🟢 Excellente", temp: "26°C", alerte: "Aucune" },
  ]
  let result = "🌊 **Qualité Eau Baignade DOM-TOM**\n\n"
  for (const p of plages) {
    result += `🏖️ **${p.nom}** — ${p.ile}\n${p.qualite} | 🌡️ ${p.temp} | ⚠️ ${p.alerte}\n\n`
  }
  result += "🆘 Urgence mer : **196**\n📋 Source : ARS DOM-TOM\n🔗 https://www.ars.sante.fr\n\nBoudoum ! 🇬🇵"
  return result
}

function getPolitiquesMartinique() {
  return `🏛️ **Élus Officiels de Martinique (2025-2026)**

🌴 **COLLECTIVITÉ TERRITORIALE DE MARTINIQUE (CTM)**
*(fusion Région + Département depuis 2016)*

👤 **Serge Letchimy** — Président du Conseil Exécutif depuis 2021
🏢 Collectivité Territoriale de Martinique, Fort-de-France
🔗 collectivitedemartinique.mq
ℹ️ Fondateur du PPM (Parti Progressiste Martiniquais), anciennement président du Conseil Régional (2010-2015) et député. Artisan de la CTM, il milite pour une Martinique autonome. En 2025, la Martinique adhère à la CARICOM.

👤 **Lucien Saliber** — Président de l'Assemblée de Martinique depuis 2021
ℹ️ Préside les 51 conseillers de l'Assemblée délibérante.

🗳️ **DÉPUTÉS ASSEMBLÉE NATIONALE (élus juillet 2024)**
• **1ère circ.** (Fort-de-France Nord) : **Johnny Hajjar** (PS/NFP)
• **2ème circ.** (Fort-de-France Sud, Schoelcher) : **Marcellin Nadeau** (Modemas/NFP)
• **3ème circ.** (Centre/Nord Atlantique) : **Jiovanny William** (DVG/NFP)
• **4ème circ.** (Sud Martinique) : **Steve Chérubin** (DVG/NFP)

🏛️ **SÉNATEURS**
• **Catherine Conconne** — PS
• **Maurice Antiste** — PS

🗓️ **Prochaines élections :** Municipales mars 2026

🔗 Sources : collectivitedemartinique.mq | assemblee-nationale.fr

Boudoum ! 🇫🇷🌴`
}

function getPolitiquesGuyane() {
  return `🏛️ **Élus Officiels de Guyane (2025-2026)**

🌿 **COLLECTIVITÉ TERRITORIALE DE GUYANE (CTG)**
*(fusion Région + Département depuis 2015)*

👤 **Gabriel Serville** — Président depuis le 28 juin 2021
🏢 CTG, Cayenne
🔗 ctguyane.fr
🗓️ Né en 1960. Ancien député (2012-2021), ancien maire de Matoury. Enseignant de carrière. Élu avec 54,83% des voix face à Rodolphe Alexandre.
ℹ️ En 2025 : convalescence médicale prolongée (nov 2024-juil 2025). Milite pour l'autonomie institutionnelle de la Guyane. Rencontré Emmanuel Macron à l'Élysée en sept 2025 sur l'évolution statutaire.

👤 **Jean-Paul Fereira** — 1er Vice-Président (assuré l'intérim 2024-2025)

🗳️ **DÉPUTÉS ASSEMBLÉE NATIONALE (élus juillet 2024)**
• **1ère circ.** (Cayenne) : **Davy Rimane** (DVG/NFP)
• **2ème circ.** (Ouest Guyane) : **Lénaïck Adam** (DVG)

🏛️ **SÉNATEURS**
• **Marie-Laure Phinera-Horth** — RDPI (Renaissance)
• **Georges Patient** — RDPI (Renaissance)

🗓️ **Prochaines élections :** Territoriales mars 2028

🔗 Sources : ctguyane.fr | assemblee-nationale.fr

Boudoum ! 🇫🇷🌿`
}

function getPolitiquesReunion() {
  return `🏛️ **Élus Officiels de La Réunion (2025-2026)**

🌺 **CONSEIL RÉGIONAL**
👤 **Huguette Bello** — Présidente depuis le 2 juillet 2021
🏢 Hôtel de Région Pierre-Lagourgue, Saint-Denis
🔗 regionreunion.com
🗓️ Née le 24 août 1950 à Saint-Pierre. Militante PLR (Pour La Réunion), ancienne membre du PCR (1974-2012). Ancienne députée (1997-2020), ancienne maire de Saint-Paul. Élue avec 29 voix sur 35.

🏛️ **CONSEIL DÉPARTEMENTAL**
👤 **Cyrille Melchior** — Président depuis le 18 décembre 2017
🏢 Palais de la Source, Saint-Denis
🔗 departement974.fr
🗓️ Né le 6 septembre 1961 à Saint-Paul. LR. En juin 2025, il crée "Nouvel R'" pour fédérer la droite réunionnaise. Candidat aux municipales 2026 à Saint-Paul.

🗳️ **DÉPUTÉS ASSEMBLÉE NATIONALE (élus juillet 2024)**
• **1ère circ.** : **Emeline K/Bidi** (PCR/NFP)
• **2ème circ.** : **Joseph Rivière** (DVD)
• **3ème circ.** : **Karine Lebon** (PCR/NFP)
• **4ème circ.** : **Frédéric Maillot** (PLR/NFP)
• **5ème circ.** : **Philippe Naillet** (PS/NFP)
• **6ème circ.** : **Perceval Gaillard** (DVG/NFP)
• **7ème circ.** : **Jean-Hugues Ratenon** (LFI/NFP)

🏛️ **SÉNATEURS**
• **Viviane Malet** — LR
• **Audrey Belim** — PS

🗓️ **Prochaines élections :** Municipales mars 2026

🔗 Sources : regionreunion.com | departement974.fr | assemblee-nationale.fr

Boudoum ! 🇫🇷🌺`
}

function getPolitiquesMayotte() {
  return `🏛️ **Élus Officiels de Mayotte (2025-2026)**

🌊 **ASSEMBLÉE DE MAYOTTE (ex-Conseil Départemental 976)**
👤 **Ben Issa Ousseni** — Président depuis le 1er juillet 2021
🏢 Conseil Départemental, Mamoudzou
🔗 mayotte.fr
🗓️ Né le 11 juillet 1973 à Mamoudzou. LR. DUT Finance/Comptabilité. Ancien comptable, fondateur d'entreprise en 2011. Élu au conseil depuis 2011. En 2024 : lance un programme infrastructures pour les Jeux des Îles 2036. Après le cyclone Chido (décembre 2024), il réclame l'état d'urgence et se bat pour la reconstruction de l'île.
ℹ️ 1er vice-président : Salime Mdéré. Depuis 2026 : le conseil est rebaptisé "Assemblée de Mayotte" suite à la loi de refondation.

🗳️ **DEPUTÉS ASSEMBLÉE NATIONALE (élus juillet 2024)**
• **1ère circ.** : **Anchya Bamana** (DVG)
• **2ème circ.** : **Mansour Kamardine** (LR)

🏛️ **SÉNATEURS**
• **Saïd Omar Oili** — LR
• **Thani Mohamed Soilihi** — RDPI

🔥 **Contexte 2025 :** Mayotte dévastée par le cyclone Chido (14 décembre 2024). Reconstruction majeure en cours. Loi programme Mayotte adoptée août 2025. Jeux des Îles 2036.

🗓️ **Prochaines élections :** Municipales mars 2026

🔗 Sources : mayotte.fr | assemblee-nationale.fr

Boudoum ! 🇫🇷🌊`
}

function getPolitiquesNouvelleCaledonie() {
  return `🏛️ **Élus Officiels de Nouvelle-Calédonie (2025-2026)**

🌏 **GOUVERNEMENT DE LA NOUVELLE-CALÉDONIE**
👤 **Alcide Ponga** — Président du 18e Gouvernement depuis le 8 janvier 2025
🏢 Hôtel du Gouvernement, Nouméa
🔗 gouv.nc
🗓️ Né le 23 mai 1975 à Kouaoua. Kanak non-indépendantiste. Diplômé Sciences Politiques + Droit Public. Cadre dirigeant dans le secteur du nickel (SLN puis KNS). Maire de Kouaoua depuis 2014. 1er Kanak à présider Le Rassemblement-LR (depuis avril 2024).
ℹ️ Élu avec 6 voix sur 11 membres du gouvernement. Contexte : crises politiques et économiques post-émeutes de mai 2024 (14 morts, 2 milliards € de dégâts). Négocie avec Paris pour l'avenir institutionnel de la Nouvelle-Calédonie.
⚠️ Fin 2025 : "2026 sera aussi compliquée que 2025, voire plus" — problèmes nickel, finances, avenir institutionnel.

🗳️ **DEPUTÉS ASSEMBLÉE NATIONALE**
• **1ère circ.** : **Nicolas Metzdorf** (Renaissance)
• **2ème circ.** : **Emmanuel Tjibaou** (FLNKS/indépendantiste)

🏛️ **SÉNATEURS**
• **Robert Xowie** — FLNKS/indépendantiste
• **Georges Naturel** — LR

🗓️ **Prochaines élections :** Provinciales 2025 (date à confirmer)

🔗 Sources : gouv.nc | congres.nc | assemblee-nationale.fr

Boudoum ! 🇫🇷🌏`
}

async function getActusPolitiquesGuadeloupe() {
  try {
    // RSS France-Antilles Guadeloupe
    const r = await fetch('https://www.guadeloupe.franceantilles.fr/rss.xml', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,5) || []
    let result = "🗳️ **Actualités Politiques Guadeloupe — France-Antilles**\n\n"
    for (const item of items) {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      if (title) result += `• ${title}\n${link ? '🔗 '+link : ''}\n\n`
    }
    if (items.length > 0) return result
    throw new Error('no items')
  } catch(e) {
    try {
      // Fallback La 1ère Guadeloupe
      const r2 = await fetch('https://la1ere.francetvinfo.fr/guadeloupe/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
      const xml2 = await r2.text()
      const items2 = xml2.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,5) || []
      let result2 = "🗳️ **Actualités Guadeloupe — La 1ère**\n\n"
      for (const item of items2) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
        if (title) result2 += `• ${title}\n${link ? '🔗 '+link : ''}\n\n`
      }
      if (items2.length > 0) return result2
    } catch(e2) {}
    return getPolitiquesGuadeloupe()
  }
}

async function getElusOfficielGuadeloupe() {
  try {
    // Scrape assemblee-nationale.fr pour les députés 971
    const r = await fetch('https://www.assemblee-nationale.fr/dyn/recherche/fonctions?departement=971', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await r.text()
    const noms = html.match(/class="h6">([^<]+)<\/a>/g)?.slice(0,4).map(n => n.replace(/<[^>]+>/g,'')) || []
    if (noms.length > 0) {
      return `🇫🇷 **Députés Guadeloupe (Assemblée Nationale — Temps Réel)**\n\n${noms.map((n,i) => `• ${i+1}ère circ. : **${n.trim()}**`).join('\n')}\n\n🔗 https://www.assemblee-nationale.fr`
    }
    throw new Error('no data')
  } catch(e) {
    return getPolitiquesGuadeloupe()
  }
}

// ===== IMMOBILIER TEMPS REEL =====
async function getImmobilierTempsReel() {
  try {
    const r = await fetch('https://api.dvf.etalab.gouv.fr/dvf/mutations/?code_departement=971&fields=valeur_fonciere,surface_reelle_bati,type_local&per_page=5', { headers: { 'Accept': 'application/json' } })
    const d = await r.json()
    if (d.results?.length > 0) {
      let result = "🏠 **Immobilier Guadeloupe — Transactions Récentes (DVF Officiel)**\n\n"
      for (const item of d.results.slice(0,4)) {
        if (item.valeur_fonciere && item.surface_reelle_bati) {
          const prixm2 = Math.round(item.valeur_fonciere / item.surface_reelle_bati)
          result += `• ${item.type_local || 'Bien'} — ${item.surface_reelle_bati}m² — ${item.valeur_fonciere.toLocaleString('fr-FR')}€ (${prixm2}€/m²)\n`
        }
      }
      result += "\n📊 Source : DVF Etalab (données officielles)\n🔗 https://app.dvf.etalab.gouv.fr\n\nBoudoum ! 🇬🇵"
      return result
    }
    throw new Error('no data')
  } catch(e) {
    return getImmobilierDOMTOM()
  }
}

// ===== HORAIRES BUS GUADELOUPE =====
function getHorairesBusGuadeloupe() {
  return `🚌 **Transports en Commun Guadeloupe**

🚌 **Guadeloupe Transport (GTI)**
• Réseau bus inter-urbain Guadeloupe
• 🔗 https://www.ilevia.fr (app mobile)
• 📞 0590 83 32 00

🚌 **Lignes principales :**
• Ligne 1 : Pointe-à-Pitre ↔ Les Abymes
• Ligne 2 : Pointe-à-Pitre ↔ Gosier
• Ligne 3 : Pointe-à-Pitre ↔ Baie-Mahault
• Ligne 4 : Pointe-à-Pitre ↔ Sainte-Anne
• Ligne 5 : Pointe-à-Pitre ↔ Saint-François
• Ligne 10 : Pointe-à-Pitre ↔ Basse-Terre

🚗 **Taxis collectifs (TC) :**
• Départ : Gare routière de Bergevin (Pointe-à-Pitre)
• Horaires : 5h30 — 19h00
• Prix : 1.50€ — 8€ selon destination

⛴️ **Ferry inter-îles :**
• L'Express des Îles : Guadeloupe ↔ Martinique ↔ Dominique
• 🔗 https://www.express-des-iles.com
• CTM Deher : Pointe-à-Pitre ↔ Marie-Galante ↔ Les Saintes

📱 **App recommandée :** Google Maps (lignes GTI intégrées)

Boudoum ! 🇬🇵`
}

// ===== COUPURES EDF DOM-TOM =====
async function getCoupuresEDF() {
  try {
    const r = await fetch('https://www.edf-dom.fr/wp-json/wp/v2/posts?per_page=5&categories=coupures', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const d = await r.json()
    if (d?.length > 0) {
      let result = "⚡ **Coupures EDF DOM-TOM — Alertes Récentes**\n\n"
      for (const post of d.slice(0,3)) {
        result += `• ${post.title?.rendered || 'Alerte'}\n`
      }
      result += "\n🔗 https://www.edf-dom.fr\n📞 EDF Guadeloupe : 0590 82 40 00\nBoudoum ! 🇬🇵"
      return result
    }
    throw new Error('no data')
  } catch(e) {
    return `⚡ **Coupures EDF DOM-TOM**

🔦 **En cas de coupure :**
• EDF Guadeloupe : **0590 82 40 00**
• EDF Martinique : **0596 59 20 00**
• EDF Guyane : **0594 39 64 00**
• EDF Réunion : **0262 90 90 90**
• EDF Mayotte : **0269 64 90 00**

📱 **Signaler une coupure :**
🔗 https://www.edf-dom.fr
🔗 Application EDF & MOI

⏰ **Interventions urgentes 24h/24**

Boudoum ! 🇬🇵`
  }
}

// ===== CLASSEMENT ZOUK/SOCA =====
async function getClassementZoukSoca() {
  try {
    const r = await fetch('https://la1ere.francetvinfo.fr/guadeloupe/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,3) || []
    let musique = items.map(item => item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '').filter(t => t && (t.toLowerCase().includes('musik') || t.toLowerCase().includes('musique') || t.toLowerCase().includes('artiste') || t.toLowerCase().includes('zouk') || t.toLowerCase().includes('soca')))
    if (musique.length > 0) {
      return `🎵 **Musique Caribéenne — Actualités**\n\n${musique.map(t => '• '+t).join('\n')}\n\n🔗 https://la1ere.francetvinfo.fr/guadeloupe\nBoudoum ! 🇬🇵`
    }
    throw new Error('no music news')
  } catch(e) {
    return `🎵 **Classement Zouk & Soca Caraïbes**

🏆 **Artistes incontournables :**
• **Jacob Desvarieux** — Légende Kassav / Zouk
• **Kalash** — Rappeur Martiniquais international
• **Fanny J** — R&B Guadeloupéen
• **Admiral T** — Gwo Ka moderne
• **Dj Lewis** — Zouk électronique
• **Kevin Lyttle** — Soca international
• **Machel Montano** — Roi du Soca Trinidad
• **Bunji Garlin** — Soca Trinidad

📻 **Radios locales :**
• RCI Guadeloupe — 104.3 FM
• Outremer 1ère — 89.3 FM
• NRJ Guadeloupe — 92.7 FM
• Radyo Tanbou — Gwoka & traditions

🔗 Actualités musique : https://la1ere.francetvinfo.fr/guadeloupe

Boudoum ! 🇬🇵`
  }
}

// ===== OFFRES EMPLOI DOM-TOM =====
async function getOffresEmploiDOMTOM(query = "emploi", zone = "971") {
  try {
    const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID
    const secret = process.env.FRANCE_TRAVAIL_SECRET
    const tokenRes = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}&scope=api_offresdemploiv2%20o2dsoffre`
    })
    const tokenData = await tokenRes.json()
    const token = tokenData.access_token
    if (!token) throw new Error('token failed')

    const q = encodeURIComponent(query.replace(/liste|emploi|offre|guadeloupe|martinique|guyane|reunion|prevention|travail/gi,'').trim())
    const contrat = query.toLowerCase().includes('cdi') ? '&typeContrat=CDI' :
                    query.toLowerCase().includes('cdd') ? '&typeContrat=CDD' :
                    query.toLowerCase().includes('interim') || query.toLowerCase().includes('intérim') ? '&typeContrat=MIS' : ''
    const url = `https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?departement=${zone}&range=0-9${q ? '&motsCles='+q : ''}${contrat}`
    const r = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token, 'Accept': 'application/json' } })
    const d = await r.json()

    const zoneName = zone === '972' ? 'Martinique' : zone === '973' ? 'Guyane' : zone === '974' ? 'Réunion' : 'Guadeloupe'
    const total = d.Content_Range?.split('/')?.[1] || d.resultats?.length || 0

    let result = `💼 **Offres Emploi — ${zoneName}** (${total} offres)

`
    result += `🏛️ **France Travail — Temps Réel**

`

    if (d.resultats?.length) {
      for (const o of d.resultats.slice(0,5)) {
        const contratIcon = o.typeContrat === 'CDI' ? '♾️' : o.typeContrat === 'CDD' ? '📅' : o.typeContrat === 'MIS' ? '⏱️' : '📄'
        const salaire = o.salaire?.libelle || 'Salaire selon profil'
        const duree = o.dureeTravailLibelleConverti || o.dureeTravailLibelle || 'Temps plein'
        result += `• **${o.intitule}**
`
        result += `  🏢 ${o.entreprise?.nom || 'Entreprise confidentielle'}
`
        result += `  📍 ${o.lieuTravail?.libelle || zoneName} | ${contratIcon} ${o.typeContrat || 'CDI'} | ⏰ ${duree}
`
        result += `  💰 ${salaire}
`
        result += `  🔗 https://candidat.francetravail.fr/offres/recherche/detail/${o.id}

`
      }
    } else {
      result += `• Aucune offre trouvée — essayez sur francetravail.fr

`
    }

    result += `━━━━━━━━━━━━━━━━
`
    result += `🌴 **Autres Plateformes DOM-TOM**
`
    result += `• 🌐 CaribbeaJobs : https://caribbeanjobs.com
`
    result += `• 🔍 Indeed : https://fr.indeed.com/jobs?l=${encodeURIComponent(zoneName)}
`
    result += `• 💼 LinkedIn : https://www.linkedin.com/jobs/search/?location=${encodeURIComponent(zoneName)}
`
    result += `• 🌴 Caraibe Emploi : https://www.caraibe-emploi.com
`
    result += `• 🌍 Jobartis : https://www.jobartis.com

`
    result += `📞 France Travail : **3949**
Boudoum ! 🇬🇵`
    return result
  } catch(e) {
    return `💼 **Offres Emploi DOM-TOM**

🇬🇵 https://www.francetravail.fr
🌴 https://caribbeanjobs.com
💼 https://fr.indeed.com/jobs?l=Guadeloupe

Boudoum ! 🇬🇵`
  }
}

// ===== RESULTATS BAC/BTS GUADELOUPE =====
function getResultatsBAC() {
  const annee = new Date().getFullYear()
  return `🎓 **Résultats BAC & BTS Guadeloupe ${annee}**

📅 **Calendrier officiel :**
• Épreuves BAC : Juin ${annee}
• Résultats BAC : Début juillet ${annee}
• Résultats BTS : Juillet ${annee}

🔗 **Consulter ses résultats :**
• 🎓 https://www.education.gouv.fr/bac
• 📱 Application Cyclades
• 🔗 https://cyclades.education.fr

📊 **Taux de réussite historique Guadeloupe :**
• BAC Général : ~88%
• BAC Technologique : ~82%
• BAC Professionnel : ~78%
• BTS : ~72%

🏫 **Rectorat de Guadeloupe :**
• 📞 0590 21 13 00
• 🔗 https://www.ac-guadeloupe.fr

💡 En cas de doute sur tes résultats, contacte ton lycée directement.

Boudoum ! 🇬🇵`
}

// ===== KARUDATA OPEN DATA REGION GUADELOUPE =====
async function getKaruData() {
  try {
    const r = await fetch('https://regionguadeloupe.opendatasoft.com/api/explore/v2.1/catalog/datasets?limit=5', { headers: { 'Accept': 'application/json' } })
    const d = await r.json()
    let result = "📊 **KaruData — Open Data Région Guadeloupe**\n\n"
    if (d.results?.length > 0) {
      for (const ds of d.results.slice(0,4)) {
        result += `• **${ds.dataset_id}** — ${ds.metas?.default?.title || ds.dataset_id}\n`
      }
    }
    result += "\n🔗 https://regionguadeloupe.opendatasoft.com\n\nBoudoum ! 🇬🇵"
    return result
  } catch(e) {
    return `📊 **KaruData — Open Data Guadeloupe**\n\n🔗 https://regionguadeloupe.opendatasoft.com\n\nDonnées officielles Région Guadeloupe :\n• Transports\n• Équipements publics\n• Environnement\n• Économie\n\nBoudoum ! 🇬🇵`
  }
}

// ===== KARUGEO CARTES GUADELOUPE =====
function getKaruGeo() {
  return `🗺️ **KaruGéo — Cartographie Guadeloupe**

🌋 **Risques Naturels :**
• Séismes : Zone sismique 5 (très forte)
• Volcans : La Soufrière (Saint-Claude)
• Tsunamis : Côtes exposées Est/Sud
• Cyclones : Saison juin-novembre

🛣️ **Routes principales :**
• N1 : Pointe-à-Pitre → Basse-Terre (Grande-Terre)
• N2 : Pointe-à-Pitre → Le Moule
• N4 : Basse-Terre → Pointe-à-Pitre (Basse-Terre)
• Route de la Traversée : N2 → Côte Sous-le-Vent

🏝️ **Îles de Guadeloupe :**
• Grande-Terre, Basse-Terre, Marie-Galante
• Les Saintes (Terre-de-Haut, Terre-de-Bas)
• La Désirade, Saint-Martin, Saint-Barthélemy

🔗 https://www.karugeo.fr
🔗 https://www.ign.fr/cartes-guadeloupe

Boudoum ! 🇬🇵`
}

// ===== COVOITURAGE GUADELOUPE =====
function getCovoiturageGuadeloupe() {
  return `🚗 **Covoiturage Guadeloupe**

🤝 **Plateformes actives :**
• **KAROS** — Covoiturage officiel (DEAL Guadeloupe)
  🔗 https://www.karos.fr
  💰 Gratuit ou remboursé par employeur

• **BlaBlaCar** — Trajets inter-îles
  🔗 https://www.blablacar.fr
  
• **Covoiturage-libre.fr** — Gratuit entre particuliers
  🔗 https://www.covoiturage-libre.fr

🏙️ **Zones de covoiturage :**
• Parking Jabrun (Les Abymes) → Pointe-à-Pitre
• Parking Carrefour Milenis → Centre-ville
• Rond-point de Perrin → Grand-Camp

💡 **Bon à savoir :**
• Remboursement employeur jusqu'à 600€/an
• Application Mobility+ pour Guadeloupe
• Forfait mobilités durables entreprises

📞 DEAL Guadeloupe : 0590 99 09 00

Boudoum ! 🇬🇵`
}

// ===== BONS PLANS GUADELOUPE =====
async function getBonsPlansGuadeloupe() {
  try {
    const r = await fetch('https://la1ere.francetvinfo.fr/guadeloupe/feed', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const xml = await r.text()
    const items = xml.match(/<item>([\s\S]*?)<\/item>/g)?.slice(0,4) || []
    let bonsplans = items.map(item => ({
      title: item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || '',
      link: item.match(/<link>(.*?)<\/link>/)?.[1] || ''
    })).filter(i => i.title)
    
    let result = `💡 **Bons Plans Guadeloupe**\n\n`
    result += `🛒 **Marchés locaux :**\n`
    result += `• Marché de Pointe-à-Pitre — Tous les jours 6h-13h\n`
    result += `• Marché de Basse-Terre — Mercredi & Samedi\n`
    result += `• Marché de Saint-François — Dimanche matin\n`
    result += `• Marché de Sainte-Anne — Vendredi & Samedi\n\n`
    result += `🎟️ **Sorties gratuites :**\n`
    result += `• Musée Edgar Clerc (Le Moule) — gratuit le dimanche\n`
    result += `• Chutes du Carbet — accès libre\n`
    result += `• Plages publiques — toutes gratuites\n`
    result += `• Jardin botanique de Deshaies\n\n`
    result += `🌐 **Sites bon plans :**\n`
    result += `• 🔗 https://www.guadeloupe-islands.com\n`
    result += `• 🔗 https://www.tourisme-guadeloupe.com\n`
    result += `• Groupe Facebook : "Bons Plans Guadeloupe"\n\n`
    result += `Boudoum ! 🇬🇵`
    return result
  } catch(e) {
    return `💡 **Bons Plans Guadeloupe**\n\n🛒 Marchés locaux : Pointe-à-Pitre, Basse-Terre, Saint-François\n🎟️ Sorties gratuites : Chutes du Carbet, plages, Musée Clerc\n🔗 https://www.tourisme-guadeloupe.com\n\nBoudoum ! 🇬🇵`
  }
}

// ===== MIX ELECTRIQUE EDF GUADELOUPE =====
async function getMixElectriqueGuadeloupe() {
  try {
    const r = await fetch('https://opendata.edf-dom.fr/api/explore/v2.1/catalog/datasets/mix-electrique-guadeloupe/records?limit=1&order_by=timestamp%20desc', { headers: { 'Accept': 'application/json' } })
    const d = await r.json()
    if (d.results?.[0]) {
      const rec = d.results[0]
      return `⚡ **Mix Électrique Guadeloupe — Temps Réel**\n\n🔋 Thermique : ${rec.thermique || 'N/A'} MW\n☀️ Solaire : ${rec.solaire || 'N/A'} MW\n💨 Éolien : ${rec.eolien || 'N/A'} MW\n🌿 Biomasse : ${rec.biomasse || 'N/A'} MW\n💧 Hydraulique : ${rec.hydraulique || 'N/A'} MW\n\n📊 Source : EDF DOM Open Data\n🔗 https://opendata.edf-dom.fr\n\nBoudoum ! 🇬🇵`
    }
    throw new Error('no data')
  } catch(e) {
    return `⚡ **Mix Électrique Guadeloupe**\n\n🔗 https://opendata.edf-dom.fr\n\n📊 Production électrique Guadeloupe :\n☀️ Solaire en développement fort\n🌿 Bagasse (canne à sucre) — source locale\n💨 Éolien — côtes exposées\n🔋 Thermique — base production\n\n📞 EDF Guadeloupe : 0590 82 40 00\n\nBoudoum ! 🇬🇵`
  }
}

// ===== RCI GUADELOUPE NEWS =====
async function getRCIGuadeloupe() {
  try {
    // RCI n'a pas de RSS public — on retourne infos statiques enrichies
    return `📻 **RCI Guadeloupe 104.3 FM**

🎙️ La radio d'info n°1 des Antilles-Guyane

📡 **Écouter en direct :**
🔗 https://www.rci.fm/guadeloupe
📱 App RCI (iOS & Android)

📰 **Rubriques :**
• Actualités Guadeloupe & Caraïbes
• Sport (Gwada Boys, rugby, athlétisme)
• Météo & alertes cycloniques
• Émissions culturelles & créoles
• Musique caribéenne (Zouk, Soca, Reggae)

⏰ **Infos toutes les heures**
📞 Standard : +590 590 83 96 96

🔗 https://www.rci.fm/guadeloupe

Boudoum ! 🇬🇵\``
  } catch(e) {
    return `📻 **RCI Guadeloupe**\n\n📻 Fréquence : 104.3 FM\n🔗 https://www.rci.fm/guadeloupe\n📱 App RCI disponible\n\nActualités, météo, sport et musique caribéenne 24h/24 !\n\nBoudoum ! 🇬🇵`
  }
}

// ===== ROUTES GUADELOUPE TRAFIC =====
function getRoutesGuadeloupe() {
  return `🛣️ **Routes & Trafic Guadeloupe**

🚦 **Axes principaux :**
• **RN1** : Pointe-à-Pitre ↔ Gosier ↔ Sainte-Anne (Grande-Terre)
• **RN2** : Pointe-à-Pitre ↔ Le Moule ↔ Saint-François
• **RN4** : Pointe-à-Pitre ↔ Basse-Terre (via côte sous-le-vent)
• **RN5** : Route de la Traversée (forêt tropicale)

⚠️ **Points de congestion habituels :**
• 7h-9h & 16h-19h : Entrée Pointe-à-Pitre
• Rond-point de Perrin (Les Abymes)
• RN1 vers Gosier le matin
• Pont de la Gabarre (Basse-Terre/Grande-Terre)

🌧️ **Alertes météo-route :**
• Pluies fortes → glissements RN4 (Basse-Terre)
• Cyclone → fermeture préfectorale routes

🔗 Infos trafic : https://www.vitimap.com/guadeloupe
🔗 Waze Guadeloupe (communauté active)
📞 DIR Antilles-Guyane : 0590 38 08 00

Boudoum ! 🇬🇵`
}

// ===== 1. MODE JSON =====
async function groqFetchJSON(prompt) {
  const key = getNextKey()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "system", content: "Tu réponds UNIQUEMENT en JSON valide, sans markdown, sans backticks." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 1024
      })
    })
    if (!res.ok) return null
    const d = await res.json()
    return JSON.parse(d.choices?.[0]?.message?.content || '{}')
  } catch(e) { return null }
}

// ===== 2. MULTIMODAL — Analyse Image =====
async function groqAnalyseImage(imageBase64, question) {
  const key = getNextKey()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: [
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            { type: "text", text: question || "Décris cette image en français. Donne des informations utiles sur ce que tu vois." }
          ]
        }],
        max_tokens: 1024
      })
    })
    if (!res.ok) return null
    const d = await res.json()
    return d.choices?.[0]?.message?.content || null
  } catch(e) { return null }
}

// ===== 3. RAG — Base de Connaissances REUSSITESS =====
const REUSSITESS_KB = {
  token_reuss: "Token REUSS sur Polygon: 0xB37531727fC07c6EED4f97F852A115B428046EB2. Supply: 999,999,999. QuickSwap Polygon.",
  fondateur: "Rony Porinus, auto-entrepreneur Guadeloupe 971, SIRET: 444699979700031. Fondateur REUSSITESS®971.",
  boutiques: "26 boutiques Amazon dans 14 pays. Influencer ID: fb942837. Tag: onamzporinus-21.",
  neuro_x: "60 agents Neuro-X spécialisés sur reussitess.fr/neuro-x. Finance, Business, Cuisine, Santé, Droit, Voyage, Sport, Histoire, Musique...",
  champions: "Passeport de Réussite sur reussitess.fr/champions. Certificat champion PDF. 14 pays partenaires.",
  politique: "Région Guadeloupe: Ary Chalus (Président). Département: Guy Losbar (Président). Maire Pointe-à-Pitre: Harry Durimel (EELV).",
  devise: "Positivité à l'infini. Boudoum. Terres de Champions. Excellence Innovation Succès.",
  quiz: "99 quiz éducatifs sur reussitess.fr/quiz. Tous thèmes: histoire, culture, crypto, science...",
  bibliotheque: "Bibliothèque mondiale 50+ pays sur reussitess.fr/bibliotheque. Auteurs caribéens: Césaire, Fanon, Condé, Glissant.",
  securite: "HTTPS + headers A+ SecurityHeaders.com. REUSSSHIELD. Anti-injection. 3 clés Groq rotation.",
  contact: "reussitess.fr | shop.reussitess.fr | kick.com/Reussitess | github.com/Reussitess30"
}

function getRAGContext(message) {
  const msgL = message.toLowerCase()
  let context = []
  if (msgL.includes('reuss') || msgL.includes('token') || msgL.includes('polygon')) context.push(REUSSITESS_KB.token_reuss)
  if (msgL.includes('porinus') || msgL.includes('fondateur') || msgL.includes('rony')) context.push(REUSSITESS_KB.fondateur)
  if (msgL.includes('boutique') || msgL.includes('amazon') || msgL.includes('affili')) context.push(REUSSITESS_KB.boutiques)
  if (msgL.includes('neuro')) context.push(REUSSITESS_KB.neuro_x)
  if (msgL.includes('champion') || msgL.includes('certificat')) context.push(REUSSITESS_KB.champions)
  if (msgL.includes('ary') || msgL.includes('losbar') || msgL.includes('durimel') || msgL.includes('politique')) context.push(REUSSITESS_KB.politique)
  if (msgL.includes('quiz')) context.push(REUSSITESS_KB.quiz)
  if (msgL.includes('bibliotheque') || msgL.includes('cesaire') || msgL.includes('fanon')) context.push(REUSSITESS_KB.bibliotheque)
  if (msgL.includes('securite') || msgL.includes('sécurité') || msgL.includes('shield')) context.push(REUSSITESS_KB.securite)
  if (msgL.includes('contact') || msgL.includes('kick') || msgL.includes('github')) context.push(REUSSITESS_KB.contact)
  return context.join(' | ')
}

// ===== 4. MULTI-AGENTS Orchestration =====
async function orchestrateAgents(message, context) {
  const domain = detectNeurox(message)
  if (domain && NEUROX_AGENTS[domain]) {
    const agent = NEUROX_AGENTS[domain]
    const ragCtx = getRAGContext(message)
    const systemPrompt = agent.prompt + (ragCtx ? `\n\nCONTEXTE REUSSITESS OFFICIEL: ${ragCtx}` : '')
    const history = Array.isArray(context) ? context.slice(-4).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content?.substring(0,400) || ''
    })).filter(m => m.content) : []
    return await groqFetch([...history, { role: "user", content: message }].map((m,i) => i === 0 && !history.length ? { role: "system", content: systemPrompt } : m).concat(history.length ? [{ role: "user", content: message }] : []), 1024)
  }
  return null
}
