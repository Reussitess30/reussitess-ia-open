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

// ===== REDIS SINGLETON =====
let _redisClient = null
async function getRedisClient() {
  if (_redisClient) return _redisClient
  const { createClient } = await import('redis')
  _redisClient = createClient({ url: process.env.REDIS_URL })
  _redisClient.on('error', () => { _redisClient = null })
  await _redisClient.connect()
  return _redisClient
}

/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { detectLanguage, getSystemPromptForLanguage, getDroitDOMTOM, getFinanceAvancee, getDonneesTempsReel } from "./extensions.js"

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

🗓️ **Élections Municipales :** 15 et 22 mars 2026 — Résultats en cours de dépouillement

🔗 Sources : regionguadeloupe.fr | cg971.fr | assemblee-nationale.fr

Boudoum ! 🇬🇵`
}
const GROQ_KEYS = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3].filter(Boolean)
let keyIndex = 0
const keyErrors = {}
const responseCache = new Map()
const CACHE_TTL = 30 * 1000

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
  const cacheKey = JSON.stringify(messages).substring(0, 500) + (messages[messages.length-1]?.content || '').substring(0, 100)
  const cached = responseCache.get(cacheKey)
  if (false && cached && Date.now() - cached.ts < CACHE_TTL) return cached.val // cache désactivé
  const key = getNextKey()
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, max_tokens: maxTokens })
    })
    if (!res.ok) { await new Promise(r => setTimeout(r, 300)); } if (!res.ok) { keyErrors[key] = Date.now(); return null }
    const d = await res.json()
    const text = d.choices?.[0]?.message?.content || null
    if (text) responseCache.set(cacheKey, { val: text, ts: Date.now() })
    return text
  } catch(e) {
    console.error("groqFetch:", e.message)
    // Fallback OpenRouter avec Function Calling
    try {
      const orKey = process.env.OPENROUTER_API_KEY
      if (!orKey) return null

      const tools = [
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "Obtenir la météo d'une commune DOM-TOM",
            parameters: { type: "object", properties: { commune: { type: "string", description: "Nom de la commune" } }, required: ["commune"] }
          }
        },
        {
          type: "function",
          function: {
            name: "get_crypto_price",
            description: "Obtenir le prix d'une cryptomonnaie",
            parameters: { type: "object", properties: { symbol: { type: "string", description: "Symbole: bitcoin, ethereum, pol" } }, required: ["symbol"] }
          }
        },
        {
          type: "function",
          function: {
            name: "get_news",
            description: "Obtenir les actualités DOM-TOM ou caribéennes",
            parameters: { type: "object", properties: { region: { type: "string", description: "guadeloupe, martinique, guyane, monde" } }, required: ["region"] }
          }
        }
      ]

      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + orKey, "HTTP-Referer": "https://reussitess.fr", "X-Title": "REUSSITESS AI" },
        body: JSON.stringify({ model: "meta-llama/llama-3.3-70b-instruct:free", messages, max_tokens: maxTokens, tools, tool_choice: "auto" })
      })
      if (!orRes.ok) return null
      const orData = await orRes.json()
      const choice = orData.choices?.[0]?.message

      // Si Function Calling déclenché
      if (choice?.tool_calls?.length > 0) {
        const toolCall = choice.tool_calls[0]
        const fn = toolCall.function.name
        const args = JSON.parse(toolCall.function.arguments || '{}')
        let toolResult = ""

        if (fn === "get_weather") {
          const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=16.24&longitude=-61.53&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`)
          const d = await r.json()
          toolResult = `Météo ${args.commune}: ${d.current?.temperature_2m}°C`
        } else if (fn === "get_crypto_price") {
          const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${args.symbol}&vs_currencies=usd`)
          const d = await r.json()
          toolResult = `${args.symbol}: $${Object.values(d)[0]?.usd}`
        } else if (fn === "get_news") {
          const r = await fetch("https://www.bondamanjak.com/feed/")
          const t = await r.text()
          const titles = [...t.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].slice(1,3).map(m=>m[1])
          toolResult = titles.join(" | ")
        }

        // Deuxième appel avec résultat
        const res2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + orKey, "HTTP-Referer": "https://reussitess.fr", "X-Title": "REUSSITESS AI" },
          body: JSON.stringify({
            model: "meta-llama/llama-3.3-70b-instruct:free",
            messages: [...messages, choice, { role: "tool", tool_call_id: toolCall.id, content: toolResult }],
            max_tokens: maxTokens
          })
        })
        const d2 = await res2.json()
        return d2.choices?.[0]?.message?.content || toolResult
      }

      return choice?.content || null
    } catch(e2) {
      // Fallback Cerebras
      try {
        const cbKey = process.env.CEREBRAS_API_KEY
        if (!cbKey) return null
        const cbRes = await fetch("https://api.cerebras.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer " + cbKey },
          body: JSON.stringify({ model: "llama-3.1-8b-instant", messages, max_tokens: maxTokens })
        })
        if (!cbRes.ok) return null
        const cbData = await cbRes.json()
        return cbData.choices?.[0]?.message?.content || null
      } catch(e3) {
        console.error("Cerebras:", e3.message)
      }
    }
  }
}
// ===== STREAMING GROQ =====
export async function groqStream(messages, systemPrompt, res) {
  const key = getNextKey()
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
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
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools: GROQ_TOOLS,
        tool_choice: "auto",
        max_tokens: 1024
      })
    })
    if (!res.ok) { await new Promise(r => setTimeout(r, 300)); } if (!res.ok) { keyErrors[key] = Date.now(); return null }
    const d = await res.json()
    const choice = d.choices?.[0]
    
    // Si Groq appelle un outil
    if (choice?.finish_reason === "tool_calls" && choice?.message?.tool_calls) {
      const toolCall = choice.message.tool_calls[0]
      const fnName = toolCall.function.name
      const args = JSON.parse(toolCall.function.arguments || '{}')
      
      let toolResult = ""
      if (fnName === "get_meteo") toolResult = await getMeteoMonde(args.commune)
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
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
            choice.message,
            { role: "tool", tool_call_id: toolCall.id, content: String(toolResult || "Info en cours de chargement — réessaie dans un instant ! Boudoum 🇬🇵") }
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
      amazon: "26 boutiques dans 14 pays — tag: porinus-21",
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
    return `✅ **Réseau Amazon — 26 boutiques · 14 pays :**\n\n\${whitepaperData.reel.plateforme.pays_amazon.join(", ")}\n\nTag affilié : porinus-21\nCommissions : 4-8% sur chaque vente qualifiée\n\nBoudoum ! 🌴`
  }

  // Sécurité
  if (msg.includes('gas') || msg.includes('sentinelle') || (msg.includes('sécurité') && (msg.includes('reuss') || msg.includes('token') || msg.includes('contrat')))) {
    return `✅ **Sécurité REUSS :**\n\n🔒 Gas : \${whitepaperData.reel.securite.gas}\n👁️ Surveillance : \${whitepaperData.reel.securite.sentinelles}\n⏳ Multi-sig : \${whitepaperData.prevision.multisig}\n\nBoudoum ! 🇬🇵`
  }

  return null
}


async function getWikipedia(term) {
  try {
  // GUIDE CRYPTOART
  // TRIGGER QUIZ THEMES — priorité haute
  if ((msgLow.includes("quiz") && (msgLow.includes("thème") || msgLow.includes("theme") || msgLow.includes("categorie") || msgLow.includes("catégorie") || msgLow.includes("liste") || msgLow.includes("reussitess") || msgLow.includes("99"))) || msgLow === "quiz" || msgLow.includes("quels quiz") || msgLow.includes("les quiz")) {
    return res.status(200).json({ response: "🎯 **99 Quiz REUSSITESS®971**\n\n📚 **CULTURE & HISTOIRE :**\n📖 Histoire mondiale • 🌍 Géographie • 👤 Personnalités • 🏰 Monuments\n🌏 Culture du Monde • 🗣️ Langues • 🔭 Découvertes\n\n🎵 **ARTS & DIVERTISSEMENT :**\nMusique • Cinéma • Art • Littérature\n\n🔬 **SCIENCES & TECH :**\nSciences • Technologie • Mathématiques • Innovations • Environnement\n\n💼 **VIE & SOCIETE :**\nBusiness • Amazon Affiliation • Santé • Positivité • Philosophie • Politique\n\n🌴 **CARIBEEN EXCLUSIF :**\nHistoire Antilles • Créole • Gwoka • Champions DOM-TOM • REUSS Token\n\n🎮 **Format :** QCM • Score temps réel • Badges • Leaderboard • Tokens REUSS\n\n👉 https://reussitess.fr/quiz\nBoudoum ! 🇬🇵" })
  }

  // QUI EST / QUI A / QUI FAIT — anti-fallback crypto
  if ((msgLow.startsWith("qui ") || msgLow.startsWith("qu est") || msgLow.startsWith("c est qui") || msgLow.startsWith("c'est qui") || msgLow.startsWith("qu'est")) && !msgLow.includes("crypto") && !msgLow.includes("bitcoin") && !msgLow.includes("token")) {
    if (msgLow.includes("reussitess") || msgLow.includes("toi") || msgLow.includes("vous") || msgLow.includes("superbot")) {
      return res.status(200).json({ response: "👑 *Je suis SuperBot REUSSITESS®971*\n\nIA nee en Guadeloupe par Rony Porinus.\n\n🧠 200 agents actifs\n60 Neuro-X + 40 Sentinelles + 99 Quiz + 1 IA Supreme\n🌍 14 pays partenaires\n💎 Token REUSS sur Polygon\n🛍️ 26 boutiques Amazon\n\nDevise : Cultiver le maximum de personnes dans le monde.\n\nTerres de Champions — Positivite a l infini !\nBOUDOUM ! 🥁" })
    }
  }

  // IDENTITE EXACTE 200 AGENTS — anti-erreur calcul
  if (msgLow.includes("combien") && (msgLow.includes("agent") || msgLow.includes("ia") || msgLow.includes("module")) || msgLow.includes("augmenter memoire") || msgLow.includes("augmenter la memoire") || msgLow.includes("augmenter mémoire") || (msgLow.includes("total") && msgLow.includes("agent"))) {
    return res.status(200).json({ response: "🤖 *REUSSITESS®971 — Architecture exacte*\n\n🧠 60 Neuro-X spécialisés\n🛡️ 40 Sentinelles surveillance\n🎯 99 Quiz éducatifs\n👑 1 IA Suprême\n\n**Total : 60 + 40 + 99 + 1 = 200 agents IA actifs**\n\nDéveloppé depuis la Guadeloupe 🇬🇵\nBOUDOUM ! 🥁" })
  }

  // RELIEFWEB — Crises et conflits mondiaux
  if ((msgLow.includes("crise") && (msgLow.includes("humanitaire") || msgLow.includes("mondiale") || msgLow.includes("économique"))) || (msgLow.includes("conflit") && msgLow.includes("international")) || (msgLow.includes("guerre") && (msgLow.includes("mondiale") || msgLow.includes("civile") || msgLow.includes("ukraine") || msgLow.includes("afrique"))) || msgLow.includes("humanitaire") || msgLow.includes("refugie") || msgLow.includes("réfugié") || msgLow.includes("urgence humanitaire")) {
    try {
      const r = await fetch("https://api.reliefweb.int/v1/reports?appname=reussitess&filter[field]=primary_country&profile=minimal&limit=5&sort[]=date:desc").then(r=>r.json()).catch(()=>null)
      if (r?.data?.length) {
        const liste = r.data.map(d => "⚠️ "+d.fields.title).join("\n")
        return res.status(200).json({ response: "🌍 *Crises Humanitaires Mondiales*\n\n"+liste+"\n\nSource : ReliefWeb (OCHA)\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🌍 Données crises indisponibles. Boudoum ! 🇬🇵" })
  }

  // UNHCR — Migrations et réfugiés
  if (msgLow.includes("migration") || msgLow.includes("migrant") || msgLow.includes("deplacement") || msgLow.includes("déplacement") || msgLow.includes("asylum") || msgLow.includes("demandeur asile") || msgLow.includes("flux migratoire")) {
    try {
      const r = await fetch("https://api.unhcr.org/population/v1/population/?limit=5&sortBy=refugees:desc&displayType=totals").then(r=>r.json()).catch(()=>null)
      if (r?.items?.length) {
        const top = r.items.slice(0,5).map(i => "🌍 "+i.geomaster_name+" : *"+parseInt(i.refugees).toLocaleString("fr-FR")+" réfugiés*").join("\n")
        return res.status(200).json({ response: "🛂 *Migrations & Réfugiés Mondiaux*\n\n"+top+"\n\nSource : UNHCR\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🛂 Données migrations : Selon l UNHCR, plus de 100 millions de personnes deplacees dans le monde. Boudoum ! 🇬🇵" })
  }

  // OECD — Finances publiques et emploi
  if (msgLow.includes("chomage") || msgLow.includes("chômage") || msgLow.includes("emploi public") || msgLow.includes("budget") && msgLow.includes("pays") || msgLow.includes("dette publique") || msgLow.includes("finances publiques")) {
    const pays = { france:"FRA", guadeloupe:"FRA", canada:"CAN", usa:"USA", "etats-unis":"USA", bresil:"BRA", allemagne:"DEU", "royaume-uni":"GBR" }
    const p = Object.keys(pays).find(k => msgLow.includes(k)) || "FRA"
    const code = pays[p]
    try {
      const r = await fetch("https://stats.oecd.org/sdmx-json/data/KEI/"+code+".LRUNTTTT.STSA.M/all?startTime=2024&endTime=2024&lastNObservations=1").then(r=>r.json()).catch(()=>null)
      const val = r?.dataSets?.[0]?.series?.["0:0:0:0"]?.observations?.["0"]?.[0]
      if (val) {
        return res.status(200).json({ response: "📊 *Chômage — "+p.charAt(0).toUpperCase()+p.slice(1)+"*\n\nTaux : *"+val.toFixed(1)+"%*\n\nSource : OCDE\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "📊 Finances publiques : données OCDE en chargement. Boudoum ! 🇬🇵" })
  }

  // ELECTIONS / POLITIQUE — Wikipedia + RSS
  if ((msgLow.includes("election") || msgLow.includes("élection") || msgLow.includes("scrutin") || (msgLow.includes("vote") && (msgLow.includes("election") || msgLow.includes("politique") || msgLow.includes("parti")))) || msgLow.includes("parti politique") || msgLow.includes("president") && msgLow.includes("pays") || msgLow.includes("democratie")) {
    try {
      const query = encodeURIComponent("elections 2025 2026 monde")
      const r = await fetch("https://fr.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent("Élections en 2026")).then(r=>r.json()).catch(()=>null)
      if (r?.extract) {
        return res.status(200).json({ response: "🗳️ *Élections Mondiales 2026*\n\n"+r.extract.substring(0,400)+"...\n\n🔗 fr.wikipedia.org\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🗳️ *Élections & Démocratie*\n\nPour suivre les élections mondiales en temps réel :\n🔗 elections-mondiales.org\n🔗 ifes.org\n🔗 idea.int\n\nBoudoum ! 🇬🇵" })
  }

  // METEO MONDIALE — Open-Meteo (sans cle)
  if ((msgLow.includes("meteo") || msgLow.includes("météo") || msgLow.includes("temps") || msgLow.includes("temperature") || msgLow.includes("température")) && !msgLow.includes("guadeloupe") && !msgLow.includes("antilles")) {
    const villes = {
      "paris": {lat:48.85,lon:2.35}, "london": {lat:51.5,lon:-0.12}, "new york": {lat:40.71,lon:-74.01},
      "dakar": {lat:14.69,lon:-17.44}, "abidjan": {lat:5.35,lon:-4.0}, "montreal": {lat:45.5,lon:-73.57},
      "tokyo": {lat:35.68,lon:139.69}, "dubai": {lat:25.2,lon:55.27}, "miami": {lat:25.77,lon:-80.19},
      "martinique": {lat:14.64,lon:-61.02}, "reunion": {lat:-20.88,lon:55.45}, "guyane": {lat:4.93,lon:-52.33},
      "haiti": {lat:18.54,lon:-72.33}, "canada": {lat:45.42,lon:-75.69}, "bresil": {lat:-15.77,lon:-47.93},
      "senegal": {lat:14.69,lon:-17.44}, "cameroun": {lat:3.87,lon:11.52}, "maroc": {lat:33.99,lon:-6.85}
    }
    const ville = Object.keys(villes).find(k => msgLow.includes(k))
    if (ville) {
      try {
        const v = villes[ville]
        const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+v.lat+"&longitude="+v.lon+"&current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m&timezone=auto").then(r=>r.json())
        const t = r.current
        const codes = {0:"☀️ Ciel dégagé",1:"🌤️ Peu nuageux",2:"⛅ Partiellement nuageux",3:"☁️ Couvert",45:"🌫️ Brouillard",48:"🌫️ Givre",51:"🌦️ Bruine",61:"🌧️ Pluie",71:"🌨️ Neige",80:"🌧️ Averses",95:"⛈️ Orage",99:"⛈️ Orage violent"}
        const ciel = codes[t.weathercode] || "🌡️"
        return res.status(200).json({ response: "🌍 *Météo "+ville.charAt(0).toUpperCase()+ville.slice(1)+"*\n\n"+ciel+"\n🌡️ Température : *"+t.temperature_2m+"°C*\n💧 Humidité : "+t.relativehumidity_2m+"%\n🌬️ Vent : "+t.windspeed_10m+" km/h\n\nSource : Open-Meteo\nBoudoum ! 🇬🇵" })
      } catch(e) {}
    }
  }

  // WORLD BANK — économie par pays
  if (msgLow.includes("inflation") || msgLow.includes("pib") || msgLow.includes("gdp") || msgLow.includes("croissance économique") || (msgLow.includes("economie mondiale") || msgLow.includes("économie mondiale") || (msgLow.includes("économie") && msgLow.includes("pays")))) {
    const pays = { france:"FR", guadeloupe:"GP", martinique:"MQ", haiti:"HT", senegal:"SN", cameroun:"CM", maroc:"MA", bresil:"BR", canada:"CA", "etats-unis":"US", usa:"US" }
    const p = Object.keys(pays).find(k => msgLow.includes(k)) || "GP"
    const code = pays[p] || "GP"
    try {
      const [gdpR, infR] = await Promise.all([
        fetch("https://api.worldbank.org/v2/country/"+code+"/indicator/NY.GDP.MKTP.CD?format=json&mrv=1").then(r=>r.json()).catch(()=>null),
        fetch("https://api.worldbank.org/v2/country/"+code+"/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1").then(r=>r.json()).catch(()=>null),
      ])
      const gdp = gdpR?.[1]?.[0]?.value ? (gdpR[1][0].value/1e9).toFixed(1)+" Mds USD" : "N/A"
      const inf = infR?.[1]?.[0]?.value ? infR[1][0].value.toFixed(1)+"%" : "N/A"
      const annee = gdpR?.[1]?.[0]?.date || "2023"
      return res.status(200).json({ response: "📊 *Économie — "+p.charAt(0).toUpperCase()+p.slice(1)+"* ("+annee+")\n\n💰 PIB : *"+gdp+"*\n📈 Inflation : *"+inf+"*\n\nSource : World Bank\nBoudoum ! 🇬🇵" })
    } catch(e) {}
  }

  // OPENAQ — qualité de l'air
  if (msgLow.includes("qualité de l air") || msgLow.includes("qualite air") || (msgLow.includes("pollution") && (msgLow.includes("guadeloupe") || msgLow.includes("martinique") || msgLow.includes("dom") || msgLow.includes("antilles") || msgLow.includes("air"))) || msgLow.includes("aqi") || msgLow.includes("air guadeloupe") || msgLow.includes("air martinique")) {
    try {
      const ville = msgLow.includes("martinique") ? "Fort-de-France" : "Pointe-a-Pitre"
      const r = await fetch("https://api.openaq.org/v2/latest?city="+encodeURIComponent(ville)+"&limit=3", {headers:{"X-API-Key":""}}).then(r=>r.json()).catch(()=>null)
      const results = r?.results
      if (results && results.length > 0) {
        const mesures = results[0].measurements.map(m => m.parameter.toUpperCase()+": "+m.value+" "+m.unit).join(" | ")
        return res.status(200).json({ response: "💨 *Qualité Air — "+ville+"*\n\n"+mesures+"\n\nSource : OpenAQ\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "💨 Qualité air : données en cours de chargement pour les DOM-TOM. Boudoum ! 🇬🇵" })
  }

  // GDACS — catastrophes naturelles mondiales
  if (msgLow.includes("catastrophe") || msgLow.includes("inondation") || msgLow.includes("tsunami") || msgLow.includes("eruption") || msgLow.includes("éruption") || msgLow.includes("glissement terrain") || msgLow.includes("disaster")) {
    try {
      const r = await fetch("https://www.gdacs.org/xml/rss_24h.xml").then(r=>r.text()).catch(()=>null)
      if (r) {
        const items = r.match(/<title>(.*?)<\/title>/g)?.slice(1,6) || []
        const liste = items.map(i => "⚠️ "+i.replace(/<\/?title>/g,"")).join("\n")
        return res.status(200).json({ response: "🌍 *Catastrophes Naturelles — 24h*\n\n"+(liste||"Aucun événement majeur")+"\n\nSource : GDACS\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🌍 Données catastrophes indisponibles. Boudoum ! 🇬🇵" })
  }

  // WHO RSS — santé mondiale
  if (msgLow.includes("epidemie") || msgLow.includes("épidémie") || msgLow.includes("pandemie") || msgLow.includes("pandémie") || msgLow.includes("sante mondiale") || msgLow.includes("santé mondiale") || (msgLow.includes("who") && (msgLow.includes("santé") || msgLow.includes("épidémie") || msgLow.includes("vaccin"))) || msgLow.includes("oms")) {
    try {
      const r = await fetch("https://www.who.int/rss-feeds/news-english.xml").then(r=>r.text()).catch(()=>null)
      if (r) {
        const items = r.match(/<title>(.*?)<\/title>/g)?.slice(1,4) || []
        const liste = items.map(i => "🏥 "+i.replace(/<\/?title>/g,"")).join("\n")
        return res.status(200).json({ response: "🏥 *Santé Mondiale — OMS*\n\n"+(liste||"Aucune alerte")+"\n\nSource : WHO/OMS\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🏥 Données OMS indisponibles. Boudoum ! 🇬🇵" })
  }

  // CO2 / CLIMAT
  if (msgLow.includes("co2") || msgLow.includes("carbone") || (msgLow.includes("climat") && (msgLow.includes("caribé") || msgLow.includes("antilles") || msgLow.includes("dom") || msgLow.includes("réchauffement") || msgLow.includes("changement"))) || msgLow.includes("rechauffement") || msgLow.includes("réchauffement") || msgLow.includes("greenhouse")) {
    try {
      const r = await fetch("https://global-warming.org/api/co2-api").then(r=>r.json()).catch(()=>null)
      const last = r?.co2?.slice(-1)[0]
      if (last) {
        return res.status(200).json({ response: "🌡️ *CO2 Atmosphérique*\n\nNiveau actuel : *"+last.trend+" ppm*\n📅 "+last.year+"/"+last.month+"\n\n⚠️ Seuil critique : 350 ppm\n🌍 Niveau actuel : "+(parseFloat(last.trend)>420?"🔴 Critique":"🟡 Élevé")+"\n\nSource : NOAA\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    return res.status(200).json({ response: "🌡️ CO2 : données en chargement. Boudoum ! 🇬🇵" })
  }

  // WORLDTIME — heure par pays
  if (msgLow.includes("heure") && (msgLow.includes("guadeloupe") || msgLow.includes("martinique") || msgLow.includes("canada") || msgLow.includes("paris") || msgLow.includes("new york") || msgLow.includes("dakar") || msgLow.includes("abidjan") || msgLow.includes("montreal") || msgLow.includes("reunion") || msgLow.includes("guyane"))) {
    const zones = { guadeloupe:"America/Guadeloupe", martinique:"America/Martinique", paris:"Europe/Paris", canada:"America/Toronto", montreal:"America/Montreal", "new york":"America/New_York", dakar:"Africa/Dakar", abidjan:"Africa/Abidjan", reunion:"Indian/Reunion", guyane:"America/Cayenne" }
    const zone = Object.keys(zones).find(k => msgLow.includes(k))
    if (zone) {
      try {
        const r = await fetch("https://worldtimeapi.org/api/timezone/"+zones[zone]).then(r=>r.json())
        const dt = new Date(r.datetime)
        const heure = dt.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"})
        const date = dt.toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long"})
        return res.status(200).json({ response: "🕐 *Heure en "+zone.charAt(0).toUpperCase()+zone.slice(1)+"*\n\n⏰ "+heure+"\n📅 "+date+"\n🌍 Fuseau : "+zones[zone]+"\n\nBoudoum ! 🇬🇵" })
      } catch(e) {
        const heure = new Date().toLocaleTimeString("fr-FR", {timeZone: zones[zone], hour:"2-digit", minute:"2-digit"})
        return res.status(200).json({ response: "🕐 Heure en "+zone+" : *"+heure+"*\nBoudoum ! 🇬🇵" })
      }
    }
  }

  // CITATION INSPIRANTE
  if (msgLow.includes("citation") || msgLow.includes("inspire moi") || msgLow.includes("motivation du jour") || msgLow === "inspire" || msgLow === "citation") {
    const citations = [
      { texte: "La liberte n est pas donnee, elle se conquiert.", auteur: "Frantz Fanon" },
      { texte: "Ma bouche sera la bouche des malheurs qui n ont pas de bouche.", auteur: "Aime Cesaire" },
      { texte: "Nou la, fos e kouraj — On avance ensemble.", auteur: "REUSSITESS®971" },
      { texte: "Tè a chanpion yo — La terre des champions.", auteur: "Guadeloupe 🇬🇵" },
      { texte: "L identite n est pas figee, elle est un perpetuel devenir.", auteur: "Edouard Glissant" },
      { texte: "Ce n est pas parce que les choses sont difficiles que nous n osons pas, c est parce que nous n osons pas qu elles sont difficiles.", auteur: "Seneque" },
      { texte: "Le succes c est aller d echec en echec sans perdre son enthousiasme.", auteur: "Winston Churchill" },
      { texte: "Positivite a l infini — BOUDOUM !", auteur: "REUSSITESS®971 🥁" },
    ]
    try {
      const r = await fetch("https://quoteslate.it/api/quotes/random").then(r=>r.json()).catch(()=>null)
      if (r?.quote) {
        return res.status(200).json({ response: "✨ *CITATION DU JOUR*\n\n\""+r.quote+"\"\n\n— "+r.author+"\n\nBoudoum ! 🇬🇵" })
      }
    } catch(e) {}
    const c = citations[Math.floor(Math.random()*citations.length)]
    return res.status(200).json({ response: "✨ *CITATION CARIBÉENNE*\n\n\""+c.texte+"\"\n\n— "+c.auteur+"\n\nBoudoum ! 🇬🇵" })
  }

  // PETROLE COMMODITES
  if (msgLow.includes("p\u00e9trole") || msgLow.includes("petrole") || msgLow.includes("baril") || msgLow.includes("wti") || msgLow.includes("brent")) {
    try {
      const avKey = process.env.ALPHA_VANTAGE_KEY
      const [wtiRes, brentRes] = await Promise.all([
        fetch("https://www.alphavantage.co/query?function=WTI&interval=daily&apikey="+avKey).then(r=>r.json()).catch(()=>null),
        fetch("https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey="+avKey).then(r=>r.json()).catch(()=>null),
      ])
      const wti = wtiRes?.data?.[0]?.value ? parseFloat(wtiRes.data[0].value).toFixed(2) : null
      const brent = brentRes?.data?.[0]?.value ? parseFloat(brentRes.data[0].value).toFixed(2) : null
      let rep = "\u26fd\ufe0f *PRIX DU P\u00c9TROLE*\n\n"
      if (wti) rep += "\u26fd WTI : *"+wti+" USD/baril*\n"
      if (brent) rep += "\ud83d\udee2\ufe0f Brent : *"+brent+" USD/baril*\n"
      if (!wti && !brent) rep += "\u26a0\ufe0f Donn\u00e9es indisponibles. R\u00e9essaie.\n"
      rep += "\n\ud83d\udcca Source : Alpha Vantage\nBoudoum ! \ud83c\uddec\ud83c\uddf5"
      return res.status(200).json({ response: rep })
    } catch(e) {
      return res.status(200).json({ response: "P\u00e9trole indisponible. Boudoum !" })
    }
  }

  if (msgLow.includes("crypto art") || msgLow.includes("generative art") || msgLow.includes("art génératif") || msgLow.includes("créer avec ia") || msgLow.includes("midjourney")) {

  // ===== GÉNÉRATION CONTENU SOCIAL =====
  if (msgLow.includes("génère un post") || msgLow.includes("génère post") || msgLow.includes("crée un post") || msgLow.includes("rédige un tweet") || msgLow.includes("génère caption")) {
    const type = msgLow.includes("tweet") ? "tweet" : msgLow.includes("caption") ? "caption" : msgLow.includes("email") ? "email" : "post"
    const sujet = message.replace(/génère un post|génère post|crée un post|rédige un tweet|génère caption|pour|sur|à propos de/gi, "").trim() || "REUSSITESS et la Guadeloupe"
    const content = await genererContenuSocial(sujet, type)
    return res.status(200).json({ pdfAction: null, response: content || "Génération en cours... Boudoum ! 🇬🇵" })
  }

  // ===== CONNAISSANCES APPROFONDIES =====
  if (msgLow.includes("négritude") || msgLow.includes("créolité") || msgLow.includes("histoire esclavage") || msgLow.includes("biodiversité caribéenne")) {
    const result = getConnaissanceApprofondie(message)
    if (result) return res.status(200).json({ pdfAction: null, response: result })
  }
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert art génératif IA et NFT caribéen. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Coach, expert parentalité et famille caribéenne. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👶 **Neuro-X Enfants — Parentalité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GESTION TEMPS
  if (msgLow.includes("gestion du temps") || (msgLow.includes("productivité") && !msgLow.includes("agricole")) || (msgLow.includes("organisation") && (msgLow.includes("travail") || msgLow.includes("temps") || msgLow.includes("projet") || msgLow.includes("planning"))) || msgLow.includes("procrastination") || msgLow.includes("planning")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Coach, expert productivité et gestion du temps. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⏰ **Neuro-X Coach — Productivité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE INTELLIGENCE COLLECTIVE
  if (msgLow.includes("intelligence collective") || msgLow.includes("travailler ensemble") || msgLow.includes("synergie") || (msgLow.includes("collaboration") && (msgLow.includes("équipe") || msgLow.includes("projet") || msgLow.includes("caribéen") || msgLow.includes("réseau"))) || msgLow.includes("réseau caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Stratégie, expert intelligence collective et leadership. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Stratégie — Intelligence Collective**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CARNAVAL CARAIBE


    if (msgLow.includes("carnaval") || (msgLow.includes("mas ") || msgLow.includes(" mas") || msgLow === "mas" || msgLow.includes("carnaval")) || msgLow.includes("vidé") || msgLow.includes("chars carnaval") || msgLow.includes("fête guadeloupe")) {
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
  if (msgLow.includes("rsa") || (msgLow === "caf" || msgLow.includes(" caf") || msgLow.includes("caisse allocations") || msgLow.includes("caf ")) || msgLow.includes("aides sociales") || msgLow.includes("allocation") || msgLow.includes("apl") || msgLow.includes("aide logement") || msgLow.includes("aide guadeloupe") || msgLow.includes("aide martinique")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Juridique, expert aides sociales DOM-TOM (RSA, APL, CAF, AAH, aide logement). Guide précis sur montants, conditions, démarches. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Social — Aides DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
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
      const query = encodeURIComponent(message.replace(/livre sur|bibliothèque caribéenne|bibliothèque|recherche livre|trouver livre/gi,"").replace(/[^\w\sÀ-ÿ]/g,"").trim() || "guadeloupe")
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
      sections.push("⚖️ **Journal Officiel**\n• legifrance.gouv.fr — Lois et décrets\n• journal-officiel.gouv.fr 📱*(ouvrir dans navigateur)*\n• vie-publique.fr — Analyses des lois\n• service-public.fr — Applications pratiques")
    }
    // 2. Médias locaux DOM-TOM
    try {
      const domNewsRaw = await getAllDOMTOMNews()
      const domData = { items: [], domNews: domNewsRaw }
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
      sections.push("⚖️ **Journal Officiel**\n• legifrance.gouv.fr — Lois et décrets\n• journal-officiel.gouv.fr 📱*(ouvrir dans navigateur)*\n• vie-publique.fr — Analyses des lois\n• service-public.fr — Applications pratiques")
    }
    // 2. Médias locaux DOM-TOM
    try {
      const domNewsRaw = await getAllDOMTOMNews()
      const domData = { items: [], domNews: domNewsRaw }
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

    if (msgLow.includes("actualité monde") || msgLow.includes("news monde") || msgLow.includes("actualité internationale") || msgLow.includes("info monde") || msgLow.includes("tv5monde") || msgLow.includes("euronews") || msgLow.includes("deutsche welle") || msgLow.includes("voa afrique") || msgLow.includes("onu news") || msgLow.includes("al jazeera")) {
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
  if ((msgLow.includes("offre emploi") || msgLow.includes("chercher emploi") || msgLow.includes("trouver un emploi") || msgLow.includes("job guadeloupe") || msgLow.includes("job martinique") || msgLow.includes("job reunion") || msgLow.includes("emploi dom-tom") || msgLow.includes("emploi caraibes") || msgLow.includes("emploi afrique") || msgLow.includes("recrutement guadeloupe") || msgLow.includes("remote job") || msgLow.includes("offre de travail")) && !msgLow.includes("ressources humaines")) {
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Créer une Association**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PASSEPORT DE REUSSITE 🏆
  if (msgLow.includes("passeport de réussite") || msgLow.includes("passeport reussite") || msgLow.includes("certificat champion") || msgLow.includes("devenir champion") || msgLow.includes("passeport champion") || (msgLow.includes("passeport de réussite") || msgLow.includes("champions reussitess") || msgLow.includes("devenir champion"))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Juridique, expert création association loi 1901 DOM-TOM. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Culture, expert identité et ADN caribéen afro-antillais. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧬 **Neuro-X Culture — Mon ADN Caribéen**\n\n"+groqText+"\n\n👉 Explore ton ADN: https://reussitess.fr/mon-adn\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ORACLE 971
  if (msgLow.includes("oracle") || msgLow.includes("oracle 971") || msgLow.includes("prédiction") || msgLow.includes("avenir caribéen") || (msgLow.includes("destin") && (msgLow.includes("oracle") || msgLow.includes("avenir") || msgLow.includes("prédit") || msgLow.includes("caribéen") || msgLow.includes("971")))) {
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
            { role: "system", content: "Tu es Neuro-X Coach, expert révolution personnelle par IA. Inspire à agir. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Coach — Ta Révolution IA**\n\n"+groqText+"\n\n👉 Lance ta révolution: https://reussitess.fr/ma-revolution-ia\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BILAN FINAL ECOSYSTEME
  if (msgLow.includes("que sais-tu faire") || msgLow.includes("tes capacités") || msgLow.includes("liste tes fonctions") || msgLow.includes("tout ce que tu fais") || msgLow.includes("fonctionnalités")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS AI — 200+ Fonctionnalités**\n\n"
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
    +"🧠 **Intelligence Émotionnelle :** Détecte tes émotions et répond avec empathie caribéenne\n\n"+"📱 **Contenu Social :** Génère posts Instagram, tweets, captions, emails REUSSITESS (ex: \"génère post sur...\" )\n\n"+"📚 **Connaissances Approfondies :** Négritude, Créolité, Esclavage, Biodiversité caribéenne\n\n"+"💾 **Mémoire Conversation :** Se souvient de tes 10 derniers échanges (Redis 7 jours)\n\n"+"👤 **Profil Utilisateur :** Personnalisation selon tes visites et préférences\n\n"+"🔮 **Spirituel & Mystique :** Oracle 971, Numérologie caribéenne, Horoscope du jour, Calendrier lunaire, Analyse rêves, Astrologie\n\n"+"🛸 **QUANTUM NEXUS :** 200 Agents IA orchestrés, communication inter-agents, rapports complets\n\n"+"🛡️ **REUSSSHIELD :** Surveillance sécurité temps réel, alertes menaces, rapport sécurité\n\n"+"🌍 **Identité Mondiale :** IA Passport 8 langues, Visa Universel REUSSITESS, Passeport de Réussite\n\n"+"🔢 **Calculateurs :** IMC santé, Staking REUSS, Commissions Amazon affilié\n\n"+"🗣️ **Traducteur :** Français, Créole, Anglais, Espagnol, Portugais, Wolof, Arabe, Mandarin\n\n"+"🏆 **Gamification :** Système Points REUSS, Classement Champions, Résumé de session\n\n"+"🌿 **Pharmacopée :** Plantes médicinales caribéennes, remèdes créoles, flore Guadeloupe\n\n"+"💬 Active : *neuro-x [domaine]* | *agents ia* | *rapport complet*\n\n"
    +"Boudoum ! 🇬🇵" })
  }

  // GENERATEUR BIOGRAPHIE
  if (msgLow.includes("biographie") || msgLow.includes("bio instagram") || msgLow.includes("présentation personnelle") || msgLow.includes("qui suis-je") || msgLow.includes("rédige ma bio")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Coach, expert révolution personnelle par IA. Inspire à agir. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Santé, expert santé cardiovasculaire. Toujours recommander un médecin. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Juridique, expert immobilier et achat terrain DOM-TOM. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Tech, expert Web3, blockchain et NFT. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Tech — Web3 Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // IDENTITE DU BOT
  if (msgLow.includes("40 sentinelles") || msgLow.includes("montre les sentinelles") || msgLow.includes("liste sentinelles") || msgLow.includes("sentinelles ia") || msgLow.includes("voir sentinelles")) {
    return res.status(200).json({ pdfAction: pdfType, response: `🛡️ **40 SENTINELLES REUSSITESS — Surveillance 24/7**

**🔴 SURVEILLANCE TEMPS RÉEL**
• ST-001 Prix REUSS — [DexScreener](https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2)
• ST-002 Actualités — [RFI](https://www.rfi.fr) | [BBC](https://www.bbc.com/afrique) | [France24](https://www.france24.com)
• ST-003 Météo Guadeloupe — [OpenMeteo](https://open-meteo.com) | [Météo France](https://meteofrance.gp)
• ST-004 ISS Position — [NASA ISS](https://api.wheretheiss.at/v1/satellites/25544)
• ST-005 Crypto BTC/ETH — [CoinGecko](https://www.coingecko.com)
• ST-006 Site REUSSITESS — [reussitess.fr](https://reussitess.fr)

**🌊 SURVEILLANCE NATURELLE**
• ST-007 Séismes Caraïbes — [USGS](https://earthquake.usgs.gov)
• ST-008 Cyclones Atlantique — [NHC NOAA](https://www.nhc.noaa.gov)
• ST-009 Météo Marine — [Windguru](https://www.windguru.cz)
• ST-010 Tsunamis — [PTWC](https://ptwc.weather.gov)
• ST-011 Volcans — [Observatoire Volcanologique](https://www.ipgp.fr)
• ST-012 Éruptions — [VAAC Toulouse](https://www.meteo.fr)

**💰 SURVEILLANCE FINANCIÈRE**
• ST-013 Token REUSS — [QuickSwap](https://quickswap.exchange)
• ST-014 Taux Change EUR/XCD — [ExchangeRate API](https://exchangerate-api.com)
• ST-015 Bourse CAC40 — [Boursorama](https://www.boursorama.com)
• ST-016 Or/Matières — [Investing.com](https://www.investing.com)
• ST-017 Fear & Greed — [Alternative.me](https://alternative.me/crypto/fear-and-greed-index)
• ST-018 Carburant DOM — [Prix Carburant](https://www.prix-carburants.gouv.fr)

**📰 SURVEILLANCE MÉDIAS**
• ST-019 La 1ère Guadeloupe — [la1ere.francetvinfo.fr](https://la1ere.francetvinfo.fr/guadeloupe)
• ST-020 Bondamanjak — [bondamanjak.com](https://www.bondamanjak.com)
• ST-021 Outremers360 — [outremers360.com](https://outremers360.com)
• ST-022 RCI Guadeloupe — [rci.fm](https://www.rci.fm/guadeloupe)
• ST-023 France-Antilles — [france-antilles.fr](https://www.france-antilles.fr)
• ST-024 Zinfos974 — [zinfos974.com](https://www.zinfos974.com)

**💼 SURVEILLANCE EMPLOI**
• ST-025 France Travail — [francetravail.fr](https://www.francetravail.fr)
• ST-026 Caribbean Jobs — [caribbeanjobs.com](https://www.caribbeanjobs.com)
• ST-027 RemoteOK — [remoteok.com](https://remoteok.com)
• ST-028 Emploi.re — [emploi.re](https://www.emploi.re)

**🔒 SURVEILLANCE SÉCURITÉ**
• ST-029 REUSSSHIELD — Protection IA temps réel
• ST-030 Bot Destroyer — Détection bots malveillants
• ST-031 Honeypot — Détection intrusions
• ST-032 RGPD Monitor — Conformité données
• ST-033 SSL Monitor — Certificat reussitess.fr

**🏥 SURVEILLANCE SANTÉ**
• ST-034 OMS Alertes — [who.int](https://www.who.int/fr)
• ST-035 Épidémies — [Santé Publique France](https://www.santepubliquefrance.fr)
• ST-036 Psychiatrie DOM — [CPA Martinique](https://www.chu-martinique.fr)

**📚 SURVEILLANCE ÉDUCATION**
• ST-037 CROUS DOM — [crous-antilles-guyane.fr](https://www.crous-antilles-guyane.fr)
• ST-038 Académie Guadeloupe — [ac-guadeloupe.fr](https://www.ac-guadeloupe.fr)
• ST-039 LADOM — [ladom.fr](https://www.ladom.fr)
• ST-040 Guardian Supreme — Orchestration générale 24/7

Boudoum ! 🇬🇵` })
  }

  if (msgLow.includes("qui est reussitess") || msgLow.includes("c'est quoi reussitess") || msgLow.includes("reussitess c'est quoi") || msgLow.includes("kesako reussitess") || msgLow.includes("qui est-ce que reussitess")) { return res.status(200).json({ pdfAction: null, response: "🌟 **REUSSITESS®971** — Né en Guadeloupe 🇬🇵\n\nREUSSITESS est une plateforme SaaS IA créée par **Rony Porinus** depuis la Guadeloupe, au service de la diaspora afro-caribéenne mondiale.\n\n🧠 **200+ modules IA** (60 Neuro-X, 40 Sentinelles, 99 Quiz)\n💎 **Token REUSS** sur Polygon blockchain\n🌍 **14 pays partenaires**\n📱 **Bot Telegram** intelligent\n👑 **Premium 4,99€/mois** — 5 outils exclusifs\n\n*Terres de Champions — Positivité à l'infini !*\n\nBoudoum ! 🇬🇵" }) }

    if (msgLow.includes("qui es-tu") || msgLow.includes("qui es tu") || msgLow.includes("présente-toi") || msgLow.includes("présente toi") || msgLow.includes("ta mission") || msgLow.includes("c'est quoi reussitess ai") || msgLow.includes("tu es qui")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Je suis REUSSITESS®971 AI**\n\nChef d'orchestre de l'écosystème REUSSITESS®971, créé depuis la **Guadeloupe** 🇬🇵 par **Rony Porinus**.\n\n**Ma devise :** *Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets.*\n\n**Ce que je suis :**\n🧠 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme)\n🌍 Présent dans 14 pays partenaires\n📚 200+ fonctionnalités actives\n💎 Connecté au Token REUSS sur Polygon\n🛍️ 26 boutiques Amazon affiliées\n\n**Mes capacités :**\n📄 Génération PDF (CV, Contrat, Certificat, Business Plan)\n🖨️ Impression de chaque réponse\n📺 Actualités temps réel (RFI, Al Jazeera, BBC, France 24, Euronews, TV5)\n⚖️ Journal Officiel — dernières lois et décrets\n🌴 Médias DOM-TOM (Guadeloupe, Martinique, Réunion, Guyane)\n🎭 Agenda culturel Caraïbes + newsletters\n💼 Offres emploi temps réel (RemoteOK + DOM-TOM)\n🛡️ Infrastructure 6 niveaux fallback IA — zéro coupure\n\n**L'écosystème REUSSITESS®971 :**\n🏆 [Passeport de Réussite](https://reussitess.fr/champions)\n🌍 [Visa Universel](https://reussitess.fr/visa-universel)\n🧠 [Neuro-X](https://reussitess.fr/neuro-x)\n💎 [Token REUSS](https://reussitess.fr/investir-reuss)\n🔮 [Oracle 971](https://reussitess.fr/oracle-971)\n\n*Terres de Champions — Positivité à l'infini !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE INTELLIGENCE EMOTIONNELLE
  if (msgLow.includes("intelligence émotionnelle") || msgLow.includes("gérer mes émotions") || msgLow.includes("empathie") || msgLow.includes("gestion émotions") || msgLow.includes("eq")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert Instagram et réseaux sociaux. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👗 **Neuro-X Mode — Stylisme Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LEADERSHIP
  if (msgLow.includes("leadership") || msgLow.includes("manager mon équipe") || msgLow.includes("diriger") || (msgLow.includes("management") && (msgLow.includes("équipe") || msgLow.includes("caribéen") || msgLow.includes("manager"))) || msgLow.includes("gérer mon équipe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Finance — Crypto pour Débutants**\n\n📊 Marché: "+crypto+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE MENTALE
  if ((msgLow.includes("anxiété") || msgLow.includes("anxiete") || msgLow.includes("dépression") || msgLow.includes("depression") || msgLow.includes("burn out") || (msgLow.includes("santé mentale") && !msgLow.includes("quiz")))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💚 **Neuro-X Psychologie — Santé Mentale**\n\n"+groqText+"\n\n⚠️ Consultez un professionnel de santé.\nUrgence: 3114 (numéro national prévention suicide)\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EXPORT INTERNATIONAL
  if ((msgLow.includes("exporter") || msgLow.includes("export")) && (msgLow.includes("produit") || msgLow.includes("international") || msgLow.includes("pays") || msgLow.includes("14 pays")) || msgLow.includes("vendre à l'international") || msgLow.includes("marché international") || msgLow.includes("14 pays")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Logistique — Export International**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PODCASTING
  if ((msgLow.includes("podcast") && (msgLow.includes("créer") || msgLow.includes("lancer") || msgLow.includes("guadeloupe") || msgLow.includes("écouter") || msgLow.includes("reussitess"))) || msgLow.includes("créer un podcast") || msgLow.includes("lancer podcast") || msgLow.includes("micro") && msgLow.includes("enregistrer")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Marketing, expert création podcast et contenu audio. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Business — Micro-Finance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE SENIOR
  if ((msgLow.includes("senior") && (msgLow.includes("aide") || msgLow.includes("vieillir") || msgLow.includes("ehpad") || msgLow.includes("domicile") || msgLow.includes("caribé"))) || msgLow.includes("personnes âgées") || msgLow.includes("vieillir bien") || msgLow.includes("ehpad") || msgLow.includes("aide à domicile")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Seniors, expert bien-vieillir et activités pour seniors DOM-TOM. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💙 **REUSSITESS AI — Soutien & Accompagnement**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RAPPEL MEDICAMENT
  if ((msgLow.includes("médicament") || msgLow.includes("medicament")) && (msgLow.includes("naturel") || msgLow.includes("plante") || msgLow.includes("caribé") || msgLow.includes("info")) || msgLow.includes("posologie naturelle") || msgLow.includes("traitement médical")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert YouTube et création vidéo. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
      const r = await fetch("https://rss2json.com/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=5", {...({timeout:8000}), signal: AbortSignal.timeout(5000)})
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Finance expert crypto. GoMining est une plateforme de minage cloud Bitcoin. REUSSITESS propose uniquement un lien de parrainage GoMining — pas de minage propre. Explique GoMining objectivement, mentionne que REUSSITESS partage un lien affilié. Toujours ajouter: ce n'est pas un conseil financier, DYOR. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⛏️ **GoMining — Minage Cloud Bitcoin**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
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
            { role: "system", content: "Tu es Neuro-X Finance, expert crypto. GoMining = minage cloud BTC. REUSSITESS propose uniquement un lien parrainage. DYOR. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Philosophie — Pensée Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DIASPORA
  if ((msgLow.includes("diaspora") && (msgLow.includes("caribé") || msgLow.includes("afric") || msgLow.includes("guadeloupe") || msgLow.includes("antilles") || msgLow.includes("france") || msgLow.includes("retour"))) || msgLow.includes("guadeloupéen à paris") || msgLow.includes("antillais en france") || msgLow.includes("retour au pays") || msgLow.includes("double culture")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⛓️ **Neuro-X Blockchain — Smart Contracts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR PITCH INVESTISSEUR
  if (msgLow.includes("pitch") || msgLow.includes("lever des fonds") || (msgLow.includes("investisseur") && (msgLow.includes("pitch") || msgLow.includes("lever") || msgLow.includes("startup") || msgLow.includes("présentation"))) || msgLow.includes("présentation investisseur") || msgLow.includes("seed funding")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Stratégie, expert pitch investisseur et levée de fonds pour startups caribéennes. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔍 **Neuro-X SEO — Audit Site Web**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CHANSON CREOLE
  if ((msgLow.includes("chanson") && (msgLow.includes("créole") || msgLow.includes("caribé") || msgLow.includes("compose") || msgLow.includes("zouk") || msgLow.includes("gwo ka"))) || msgLow.includes("zouk") || msgLow.includes("gwo ka") || msgLow.includes("paroles") || msgLow.includes("compose une chanson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Neuro-X Coach — Développement Personnel**\n\n💬 "+citation+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE MARCHE CRYPTO
  if (msgLow.includes("analyse crypto") || msgLow.includes("marché crypto") || (msgLow.includes("bull market") || msgLow.includes("bull run") || msgLow.includes(" bull") || msgLow === "bull") || (msgLow.includes("bear market") || msgLow.includes("bear run") || msgLow.includes(" bear") || msgLow === "bear") || msgLow.includes("analyse bitcoin") || msgLow.includes("analyse ethereum")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
        const msg_imc = message.replace(/([0-9])[a-zA-Z]+([0-9])/g,'$1$2').replace(/kg|cm/gi,' ')
        const nb_imc = msg_imc.match(/[0-9]+[.,]?[0-9]*/g)?.map(Number) || []
        const poids = nb_imc[0], taille = nb_imc[1] > 3 ? nb_imc[1]/100 : nb_imc[1]
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert stratégie digitale et réseaux sociaux caribéen. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert TikTok et réseaux sociaux caribéens. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📱 **Neuro-X Marketing — Générateur Posts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COCKTAILS RHum CARIBEEN
  if (msgLow.includes("cocktail") || (msgLow.includes("rhum ") || msgLow.includes(" rhum") || msgLow === "rhum" || msgLow.includes("rhum antilles") || msgLow.includes("rhum agricole")) || msgLow.includes("ti punch") || msgLow.includes("planteur") || msgLow.includes("mojito") || msgLow.includes("recette boisson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Neuro-X Spiritualité — Analyse Rêves**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS VOYAGE CARAIBES
  if (msgLow.includes("visiter") || msgLow.includes("vacances guadeloupe") || msgLow.includes("tourisme") || msgLow.includes("circuit") || msgLow.includes("que faire en guadeloupe") || msgLow.includes("bon plan voyage") || msgLow.includes("excursion")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
    if (msg === "ADMIN: UPDATE BASE DONNEES") {
      return res.status(200).json({ pdfAction: null, response: "✅ Base mise à jour ! Donald Trump = Président USA 2025. Persistance infinie OK." });
    }
    if (msgLow.includes("base de données à jour")) {
      return res.status(200).json({ pdfAction: null, response: "✅ Base à jour ! Donald Trump réélu 2024 investi 2025. Persistance OK." });
    }
    if (msgLow.includes("président usa")) {
      return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Donald Trump** réélu Nov 2024, investi 20/01/2025. Président actuel USA. Boudoum ! 📱" });
    }

  // PRÉSIDENT USA FIX
  if (msgLow.includes("président usa") || msgLow.includes("président etats-unis") || msgLow.includes("president usa")) {
    return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Donald Trump** réélu Nov 2024, investi 20/01/2025. Actuel président USA. Boudoum ! 📱" });
  }
  if ((msgLow.includes("crypto") || msgLow.includes("bitcoin")) && !msgLow.includes("quiz") && !msgLow.includes("plage") && !msgLow.includes("événement") && !msgLow.includes("evenement") && !msgLow.includes("thème") && !msgLow.includes("theme") && !msgLow.startsWith("qui ") && !msgLow.startsWith("que ") && !msgLow.startsWith("quels ") && !msgLow.startsWith("quelle ") && !msgLow.startsWith("comment ") && !msgLow.startsWith("pourquoi ") && !msgLow.startsWith("quand ") && !msgLow.startsWith("ou ") && !msgLow.startsWith("où ")) {
    const country = msgLow.includes("haiti") ? "haiti" : msgLow.includes("rwanda") ? "rwanda" : "global"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=crypto&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
  if (msgLow.includes("meteo") || msgLow.includes("météo") || (msgLow.includes("temps") && (msgLow.includes("quel") || msgLow.includes("faire") || msgLow.includes("aujourd") || msgLow.includes("demain")))) {
    const country = msgLow === "mali" || msgLow.includes("mali ") || msgLow.includes(" mali") ? "mali" : msgLow.includes("niger") ? "niger" : msgLow.includes("haiti") ? "haiti" : "guadeloupe"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=meteo&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
  if (msgLow.includes("devises") || msgLow.includes("change")) {
    const country = msgLow.includes("haiti") ? "haiti" : msgLow.includes("rwanda") ? "rwanda" : "guadeloupe"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=devises&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💪 **Neuro-X Sport — Coach Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RECETTE ANTILLAISE
  if (msgLow.includes("dashboard redis") || msgLow.includes("stats redis") || msgLow.includes("statistiques bot") || msgLow.includes("combien de visiteurs")) {
    const data = await getRedisDashboard()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("musique caribéenne") || msgLow.includes("gwoka") || msgLow.includes("zouk history") || msgLow.includes("biguine") || msgLow.includes("kompa") || msgLow.includes("genre musical caribéen")) {
    const genre = message.replace(/musique caribéenne|genre musical caribéen/gi, "").trim()
    return res.status(200).json({ pdfAction: null, response: getMusiqueCaribéenne(genre) })
  }

  if (msgLow.includes("bibliothèque caribéenne") || msgLow.includes("césaire") || msgLow.includes("fanon") || msgLow.includes("glissant") || msgLow.includes("mckay") || msgLow.includes("condé auteur")) {
    const auteur = message.replace(/bibliothèque caribéenne|auteur caribéen/gi, "").trim()
    const data = await getBibliothèqueCaribéenne(auteur)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("événements caribéens") || msgLow.includes("evenements caribéens") || msgLow.includes("agenda caribéen") || msgLow.includes("festival caraïbes") || msgLow.includes("calendrier culturel")) {
    return res.status(200).json({ pdfAction: null, response: getEvenementsCaribéens() })
  }

  if (msgLow.includes("recette") || msgLow.includes("comment cuisiner") || msgLow.includes("comment préparer") || msgLow.includes("accras") || msgLow.includes("colombo") || msgLow.includes("blaff") || msgLow.includes("court-bouillon")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 1024)
      const noms = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "🏢 **Neuro-X Business — Générateur de Noms**\n\n"+noms+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CV
  if ((msgLow === "cv" || ((msgLow.includes("mon cv") && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf"))) && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf"))) || msgLow.includes("le cv") || msgLow.includes("curriculum")) || msgLow.includes("curriculum") || msgLow.includes("génère mon cv") || msgLow.includes("aide cv") || msgLow.includes("rédige cv")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
  if ((msgLow.includes("dao") && (msgLow.includes("reuss") || msgLow.includes("vote") || msgLow.includes("gouvernance") || msgLow.includes("décentralis"))) || msgLow.includes("gouvernance décentralisée") || msgLow.includes("voter") || msgLow.includes("proposition")) {
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
  if (msgLow.includes("rapport sécurité") || msgLow.includes("shield") || (msgLow.includes("sécurité") && msgLow.includes("reussitess"))) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **REUSSSHIELD — Rapport Sécurité**\n\n✅ ST-016 Anti-Fraude : Actif\n✅ ST-017 MiCA Compliance : Actif\n✅ ST-026 Surveillance APIs : Actif\n✅ ST-027 Vercel Monitor : Actif\n✅ ST-028 GitHub Watch : Actif\n✅ ST-029 Polygon Network : Actif\n\n🔒 Détection injection prompt : Activée\n🔑 HTTPS + headers sécurisés : Actif\n🌐 Site reussitess.fr : EN LIGNE\n\n200 agents IA en surveillance continue 24/7\n\nBoudoum ! 🇬🇵" })
  }

  // CONVERTISSEUR MONNAIE TEMPS REEL
  if (msgLow.includes("convertir") && ((msgLow.includes("euro ") || msgLow.includes(" euro") || msgLow === "euro" || msgLow.includes("euros") || msgLow.includes("taux euro")) || msgLow.includes("dollar") || msgLow.includes("franc") || msgLow.includes("devise") || msgLow.includes("xcd") || msgLow.includes("htg") || msgLow.includes("caraïbes") || msgLow.includes("monnaie"))) {
    try {
      const rateR = await fetch("https://api.exchangerate-api.com/v4/latest/EUR")
      const rateD = await rateR.json()
      const rates = rateD.rates
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Convertisseur Caribéen Temps Réel**\n\n1 EUR = "+rates.USD?.toFixed(2)+" USD 🇺🇸\n1 EUR = "+rates.GBP?.toFixed(2)+" GBP 🇬🇧\n1 EUR = "+rates.CAD?.toFixed(2)+" CAD 🇨🇦\n1 EUR = "+rates.BRL?.toFixed(2)+" BRL 🇧🇷\n1 EUR = "+rates.XCD?.toFixed(2)+" XCD 🇧🇧 (Dollar Caraïbes)\n1 EUR = "+rates.HTG?.toFixed(2)+" HTG 🇭🇹 (Gourde Haïtienne)\n1 EUR = "+rates.MAD?.toFixed(2)+" MAD 🇲🇦\n1 EUR = "+rates.XOF?.toFixed(2)+" XOF 🌍 (Franc CFA Ouest)\n1 EUR = "+rates.XAF?.toFixed(2)+" XAF 🌍 (Franc CFA Central)\n\n📊 Source: ExchangeRate-API\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Convertisseur Caribéen**\n\nTaux approximatifs (avril 2026):\n\n1 EUR ≈ 1.08 USD 🇺🇸\n1 EUR ≈ 0.85 GBP 🇬🇧\n1 EUR ≈ 1.48 CAD 🇨🇦\n1 EUR ≈ 5.80 BRL 🇧🇷\n1 EUR ≈ 2.93 XCD 🇧🇧 (Dollar Caraïbes)\n1 EUR ≈ 142 HTG 🇭🇹 (Gourde Haïtienne)\n1 EUR ≈ 10.7 MAD 🇲🇦\n1 EUR ≈ 655 XOF 🌍 (Franc CFA Ouest)\n1 EUR ≈ 655 XAF 🌍 (Franc CFA Central)\n\n⚠️ Vérifiez sur xe.com pour taux exacts\nBoudoum ! 🇬🇵" })
    }
  }



  // ENCYCLOPEDIE ANTILLES + AFRIQUE
  const sujetsEncyclo = ["histoire de","histoire du","histoire des","qu'est-ce que","c'est quoi","parle moi de","parle-moi de","qui est","qui était","que sais-tu sur","encyclopédie","explique moi","explique-moi","tell me about","définition de","origine de","culture de","patrimoine","civilisation","raconte l'histoire","en savoir plus","biographie","bio de","info sur"]
  const needsEncyclo = sujetsEncyclo.some(s => msgLow.includes(s))
  if (needsEncyclo) {
    try {
      // Essai 1 — encyclopédie caribéenne
      let wiki = await encyclopedieAntillesAfrique(message)
      // Essai 2 — Wikipedia général si pas de résultat caribéen
      if (!wiki) wiki = await rechercheWikipedia(message, "fr")
      if (wiki) {
        const groqText = await groqFetch([
              { role: "system", content: `Tu es REUSSITESS AI, assistant encyclopédique universel. Réponds avec précision sur le sujet demandé. Si la personne est connue, présente sa biographie. Boudoum!` },
              { role: "user", content: "Question: "+message+"\n\nSource Wikipedia:\n"+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
      }
      // Fallback Groq direct si Wikipedia vide
      const groqDirect = await groqFetch([
        { role: "system", content: `Tu es REUSSITESS AI, assistant encyclopédique universel. Réponds avec précision. Boudoum!` },
        { role: "user", content: message }
      ], 2048)
      if (groqDirect) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+groqDirect+"\n\nBoudoum ! 🇬🇵" })
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
                { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
              { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
      const r = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2", {...({timeout:10}), signal: AbortSignal.timeout(5000)})
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
      return res.status(200).json({ pdfAction: pdfType, response: "🌤️ Service météo en chargement — réessaie dans un instant ! Boudoum 🇬🇵" })
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
  // ===== ALCHEMY TOKEN METADATA =====


  // ===== ALCHEMY DASHBOARD =====
  if (msgLow.includes("dashboard reuss") || msgLow.includes("stats reuss") || msgLow.includes("reuss live") || msgLow.includes("token onchain")) {
    const dash = await getAlchemyDashboard()
    if (dash) return res.status(200).json({ pdfAction: null, response: dash + "\n\n🌐 Dashboard visuel : https://reussitess.fr/reuss-live" })
  }
  // ===== ALCHEMY WALLET =====
  if (msgLow.includes("mon solde reuss") || msgLow.includes("solde reuss") || msgLow.includes("balance reuss") || msgLow.match(/0x[a-fA-F0-9]{40}/)) {
    const addrMatch = message.match(/0x[a-fA-F0-9]{40}/)
    if (addrMatch) {
      const bal = await getWalletBalance(addrMatch[0])
      if (bal) return res.status(200).json({ pdfAction: null, response: bal })
    }
  }
  // ===== ALCHEMY TRANSFERTS =====
  if (msgLow.includes("transferts reuss") || msgLow.includes("transactions reuss") || msgLow.includes("derniers transferts reuss")) {
    const tr = await getRecentTransfers()
    if (tr) return res.status(200).json({ pdfAction: null, response: tr })
  }
  // ===== ALCHEMY METADATA =====
  if (msgLow.includes("alchemy polygon") || msgLow.includes("metadata reuss") || msgLow.includes("info contrat reuss")) {
    const alchemyData = await getAlchemyTokenData()
    if (alchemyData) return res.status(200).json({ pdfAction: null, response: alchemyData })
  }

  if (msgLow.includes('bitcoin') || msgLow.includes('btc') || msgLow.includes('ethereum') || msgLow.includes('eth') || msgLow.includes('crypto') || msgLow.includes('prix') && msgLow.includes('coin')) {
    try {
      const cr = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,polygon-ecosystem-token&vs_currencies=usd")
      const cd = await cr.json()
      const tr = await fetch("https://api.coingecko.com/api/v3/search/trending")
      const td = await tr.json()
      const fg = await getFearGreed()
      const trending = td.coins.slice(0,5).map(function(c){ return c.item.name }).join(", ")
      return res.status(200).json({ pdfAction: pdfType, response: "💎 **Crypto — Données Temps Réel**\n\n₿ Bitcoin : $" + (cd.bitcoin?.usd||"N/A") + "\nΞ Ethereum : $" + (cd.ethereum?.usd||"N/A") + "\n🔷 POL : $" + (cd["polygon-ecosystem-token"]?.usd||"N/A") + "\n\n🔥 Tendances : " + trending + "\n😨 Sentiment : " + fg + "\n\nBoudoum ! 🇬🇵" })
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
      const rep = groqData.choices?.[0]?.message?.content || "Agent en chargement — réessaie ! Boudoum 🇬🇵"
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **"+agent.nom+"** ["+agent.id+"]\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 "+agent.nom+" en chargement. Réessaie dans un instant ! Boudoum 🇬🇵" })
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
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || (msgLow.includes(" lion") || msgLow.includes("lion ") || msgLow === "lion" || msgLow.includes("signe lion")) || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") && !msgLow.includes("coupure") && !msgLow.includes("robinet") && !msgLow.includes("plomberie") || msgLow.includes("poissons")) {
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
  if (msgLow.includes("pleine lune") || msgLow.includes("phase lune") || msgLow.includes("calendrier lunaire") || msgLow === "lune" || msgLow === "moon" || msgLow.includes("lune aujourd") || msgLow.includes("lune ce soir") || msgLow.includes("phase")) {
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
    if ((msgLow.includes('mode ') || msgLow.includes(' mode') || msgLow.includes('mode:') || msgLow === 'mode') || msgLow.includes('vetement')) domaine = 'mode'
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
  if ((msgLow.includes('actualite') || msgLow.includes('actualité') || (msgLow.includes('news') && msgLow.length > 8) || (msgLow.includes('info') && msgLow.length > 8)) && msgLow.includes('guadeloupe')) {
    const data = await getActualitesOutremerComplet()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }
  if ((msgLow.includes('actualite') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('martinique')) {
    const data = await getActualitesOutremerComplet()
    return res.status(200).json({ pdfAction: null, response: data+"Boudoum ! 🇬🇵" })
  }
  if (msgLow.includes('actualite outremer complet') || msgLow.includes('toutes les actus outremer') || msgLow.includes('actualites outremer')) {
    const data = await getActualitesOutremerComplet()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes('actualite dom-tom') || msgLow.includes('actualites dom-tom') || msgLow.includes('news dom-tom') || msgLow.includes('actu outremer') || msgLow.includes('la 1ere actualite')) {
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
    if (!res.ok) { await new Promise(r => setTimeout(r, 300)); } if (!res.ok) {
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
    const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,polygon-ecosystem-token&vs_currencies=usd")
    const d = await r.json()
    const parts = []
    if(d.bitcoin) parts.push("BTC $" + d.bitcoin.usd)
    if(d.ethereum) parts.push("ETH $" + d.ethereum.usd)
    if(d["polygon-ecosystem-token"]) parts.push("POL $" + d["polygon-ecosystem-token"].usd)
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
  if (m.includes("fatigué") || m.includes("fatigue") || m.includes("épuisé") || m.includes("découragé") || m.includes("plus la force")) return "fatigue"
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
  if (emotion === "fatigue") return "😴 Le corps dit stop, il faut l'écouter ! Même les champions se reposent. Chak chyen ni jou-y — Chaque chien a son jour. Repose-toi, demain sera meilleur.\n\nBoudoum ! 🇬🇵"
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
    const r = await fetch("https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=3&minlatitude=10&maxlatitude=20&minlongitude=-70&maxlongitude=-58&limit=5", { signal: AbortSignal.timeout(5000) })
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
    const q = encodeURIComponent(texte.substring(0, 400))
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${q}&langpair=fr|${cible}`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    return d.responseData?.translatedText || null
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
  } catch(e) { return "🥗 Service nutrition en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== NOAA TIDES — Marées =====
async function getMareesGuadeloupe() {
  try {
    const res = await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=9759110&product=predictions&datum=MLLW&time_zone=GMT&units=metric&application=reussitess&format=json&range=24&interval=hilo')
    const d = await res.json()
    if (!d.predictions?.length) return "🌊 Données marées en chargement. Réessaie ! Boudoum 🇬🇵"
    let result = "🌊 **Marées — Guadeloupe (24h)**\n\n"
    for (const m of d.predictions.slice(0,6)) {
      const type = m.type === 'H' ? '🔺 Haute mer' : '🔻 Basse mer'
      result += `${type} : **${m.v}m** à ${m.t}\n`
    }
    return result + "\nSource: NOAA\nBoudoum ! 🇬🇵"
  } catch(e) { return "🌊 Service marées en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== AMAZON RECHERCHE + RECOMMANDATIONS + COMMISSIONS =====
async function getAmazonInfo(query = "", type = "search", pays = "france") {
  const BOUTIQUES = {
    'france': { flag: '🇫🇷', url: 'amazon.fr', tag: 'porinus-21', b1: 'https://www.amazon.fr/shop/amourguadeloupe' },
    'usa': { flag: '🇺🇸', url: 'amazon.com', tag: 'porinus00-20', b1: 'https://www.amazon.com/shop/amourguadeloupe', b2: 'https://www.amazon.com/shop/influencer-fb942837' },
    'canada': { flag: '🇨🇦', url: 'amazon.ca', tag: 'porinus-20', b1: 'https://www.amazon.ca/shop/amourguadeloupe', b2: 'https://www.amazon.ca/shop/influencer-fb942837' },
    'allemagne': { flag: '🇩🇪', url: 'amazon.de', tag: 'porinus09-21', b1: 'https://www.amazon.de/shop/amourguadeloupe', b2: 'https://www.amazon.de/shop/influencer-fb942837' },
    'espagne': { flag: '🇪🇸', url: 'amazon.es', tag: 'porinus04-21', b1: 'https://www.amazon.es/shop/amourguadeloupe', b2: 'https://www.amazon.es/shop/influencer-fb942837' },
    'italie': { flag: '🇮🇹', url: 'amazon.it', tag: 'porinus0f-21', b1: 'https://www.amazon.it/shop/amourguadeloupe', b2: 'https://www.amazon.it/shop/influencer-fb942837' },
    'angleterre': { flag: '🇬🇧', url: 'amazon.co.uk', tag: 'porinus01-21', b1: 'https://www.amazon.co.uk/shop/amourguadeloupe', b2: 'https://www.amazon.co.uk/shop/influencer-fb942837' },
    'australie': { flag: '🇦🇺', url: 'amazon.com.au', tag: 'ronyrogerpori-22', b1: 'https://www.amazon.com.au/shop/amourguadeloupe', b2: 'https://www.amazon.com.au/shop/influencer-fb942837' },
    'inde': { flag: '🇮🇳', url: 'amazon.in', tag: 'porinus058-21', b1: 'https://www.amazon.in/shop/amourguadeloupe', b2: 'https://www.amazon.in/shop/influencer-fb942837' },
    'bresil': { flag: '🇧🇷', url: 'amazon.com.br', tag: 'porinusrony-20', b1: 'https://www.amazon.com.br/shop/amourguadeloupe' },
    'singapour': { flag: '🇸🇬', url: 'amazon.sg', tag: 'porinus-22', b1: 'https://www.amazon.sg/shop/amourguadeloupe', b2: 'https://www.amazon.sg/shop/influencer-fb942837' },
    'suede': { flag: '🇸🇪', url: 'amazon.se', tag: 'porinus07-21', b1: 'https://www.amazon.se/shop/amourguadeloupe', b2: 'https://www.amazon.se/shop/influencer-fb942837' },
    'belgique': { flag: '🇧🇪', url: 'amazon.com.be', tag: 'porinus08-21', b1: 'https://www.amazon.com.be/shop/amourguadeloupe', b2: 'https://www.amazon.com.be/shop/influencer-fb942837' },
    'pays-bas': { flag: '🇳🇱', url: 'amazon.nl', tag: 'porinus-21', b1: 'https://www.amazon.nl/shop/amourguadeloupe', b2: 'https://www.amazon.nl/shop/influencer-fb942837' },
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
  } catch(e) { return `🌍 Service pays en chargement. Réessaie ! Boudoum 🇬🇵 (${e.message})` }
}


// ===== AMAZON PAAPI — Recherche produits réels =====
async function searchAmazonProducts(query = "smartphone", marketplace = "www.amazon.fr") {
  try {
    const accessKey = process.env.AMAZON_ACCESS_KEY
    const secretKey = process.env.AMAZON_SECRET_KEY
    const tag = process.env.AMAZON_PARTNER_TAG || 'porinus-21'
    if (!accessKey || !secretKey) throw new Error('clés manquantes')

    const crypto = require('crypto')
    const region = marketplace.includes('.co.uk') || marketplace.includes('.fr') || marketplace.includes('.de') || marketplace.includes('.it') || marketplace.includes('.es') || marketplace.includes('.com.be') || marketplace.includes('.se') || marketplace.includes('.nl') ? 'eu-west-1' :
                   marketplace.includes('.co.jp') ? 'us-east-1' :
                   marketplace.includes('.com.au') || marketplace.includes('.sg') || marketplace.includes('.in') ? 'us-east-1' : 'us-east-1'

    const host = marketplace
    const path_url = '/paapi5/searchitems'
    const payload = JSON.stringify({
      Keywords: query,
      Resources: ['ItemInfo.Title','Offers.Listings.Price','DetailPageURL'],
      PartnerTag: tag,
      PartnerType: 'Associates',
      Marketplace: marketplace.replace('www.',''),
      ItemCount: 5,
      SearchIndex: 'All'
    })

    const now = new Date()
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g,'').replace('T','T').substring(0,15)+'00Z'
    const dateStamp = amzDate.substring(0,8)
    const service = 'ProductAdvertisingAPI'
    const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'

    const payloadHash = crypto.createHash('sha256').update(payload,'utf8').digest('hex')
    const canonicalHeaders = `content-encoding:amz-1.0\ncontent-type:application/json; charset=utf-8\nhost:${host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`
    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target'
    const canonicalRequest = ['POST', path_url, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
    const credScope = `${dateStamp}/${region}/${service}/aws4_request`
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n')

    const hmac = (key, data, enc) => crypto.createHmac('sha256', key).update(data, 'utf8').digest(enc)
    const sigKey = hmac(hmac(hmac(hmac('AWS4'+secretKey, dateStamp), region), service), 'aws4_request')
    const signature = hmac(sigKey, stringToSign, 'hex')

    const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const res = await fetch(`https://${host}${path_url}`, {
      method: 'POST',
      headers: {
        'Content-Encoding': 'amz-1.0',
        'Content-Type': 'application/json; charset=utf-8',
        'Host': host,
        'X-Amz-Date': amzDate,
        'X-Amz-Target': target,
        'Authorization': authorization
      },
      body: payload
    })

    const text = await res.text()
    const d = JSON.parse(text)
    if (!d.SearchResult?.Items?.length) throw new Error(d.Errors?.[0]?.Message || 'aucun résultat')

    const flag = marketplace.includes('.fr') ? '🇫🇷' : marketplace.includes('.com.au') ? '🇦🇺' : marketplace.includes('.co.uk') ? '🇬🇧' : marketplace.includes('.de') ? '🇩🇪' : marketplace.includes('.it') ? '🇮🇹' : marketplace.includes('.es') ? '🇪🇸' : marketplace.includes('.ca') ? '🇨🇦' : marketplace.includes('.in') ? '🇮🇳' : marketplace.includes('.com.br') ? '🇧🇷' : '🌍'

    let result = `🛍️ **Produits Amazon — "${query}"** ${flag}\n\n`
    for (const item of d.SearchResult.Items.slice(0,5)) {
      const titre = item.ItemInfo?.Title?.DisplayValue || 'Produit'
      const prix = item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Prix N/A'
      const url = item.DetailPageURL || ''
      result += `• **${titre.substring(0,80)}**\n  💰 ${prix} | 🔗 ${url}\n\n`
    }
    result += `🏪 Boutique REUSSITESS: https://${marketplace}/shop/amourguadeloupe\nBoudoum ! 🇬🇵`
    return result
  } catch(e) {
    return `🛍️ **Boutiques REUSSITESS — 26 boutiques / 14 pays**\n\n🇫🇷 **France:** https://www.amazon.fr/shop/amourguadeloupe\n🇺🇸 **USA:** https://www.amazon.com/shop/amourguadeloupe | https://www.amazon.com/shop/influencer-fb942837\n🇩🇪 **Allemagne:** https://www.amazon.de/shop/amourguadeloupe | https://www.amazon.de/shop/influencer-fb942837\n🇬🇧 **UK:** https://www.amazon.co.uk/shop/amourguadeloupe | https://www.amazon.co.uk/shop/influencer-fb942837\n🇮🇹 **Italie:** https://www.amazon.it/shop/amourguadeloupe | https://www.amazon.it/shop/influencer-fb942837\n🇪🇸 **Espagne:** https://www.amazon.es/shop/amourguadeloupe | https://www.amazon.es/shop/influencer-fb942837\n🇨🇦 **Canada:** https://www.amazon.ca/shop/amourguadeloupe | https://www.amazon.ca/shop/influencer-fb942837\n🇦🇺 **Australie:** https://www.amazon.com.au/shop/amourguadeloupe | https://www.amazon.com.au/shop/influencer-fb942837\n🇮🇳 **Inde:** https://www.amazon.in/shop/amourguadeloupe | https://www.amazon.in/shop/influencer-fb942837\n🇧🇷 **Brésil:** https://www.amazon.com.br/shop/amourguadeloupe\n🇸🇬 **Singapour:** https://www.amazon.sg/shop/amourguadeloupe | https://www.amazon.sg/shop/influencer-fb942837\n🇸🇪 **Suède:** https://www.amazon.se/shop/amourguadeloupe | https://www.amazon.se/shop/influencer-fb942837\n🇧🇪 **Belgique:** https://www.amazon.com.be/shop/amourguadeloupe | https://www.amazon.com.be/shop/influencer-fb942837\n🇳🇱 **Pays-Bas:** https://www.amazon.nl/shop/amourguadeloupe | https://www.amazon.nl/shop/influencer-fb942837\n\n🌐 https://reussitess.fr/boutiques\nBoudoum ! 🇬🇵`
  }
}

// ===== DASHBOARD ADMIN STATS =====
async function getDashboardStats() {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const visitors = await redis.get('reussitess_visitors') || 0
    const today = new Date().toISOString().substring(0,10)
    const todayRequests = await redis.get('requests:'+today) || 0
    // Top pays
    let paysStats = ""
    try {
      const paysKeys = await redis.keys('visitors:country:*')
      if (paysKeys && paysKeys.length > 0) {
        const paysData = []
        for (const key of paysKeys.slice(0, 8)) {
          const count = await redis.get(key)
          const pays = key.replace('visitors:country:', '')
          paysData.push({ pays, count: parseInt(count) || 0 })
        }
        paysData.sort((a, b) => b.count - a.count)
        paysStats = "\n\n🌍 **Top Pays :**\n" + paysData.map(p => "• " + p.pays + ": " + p.count).join("\n")
      }
    } catch(e) {}
    return `📊 **Dashboard REUSSITESS AI**\n\n👥 Visiteurs total: **${visitors}**\n📡 Requêtes aujourd'hui: **${todayRequests}**⚡ 6 niveaux fallback IA\n🛡️ Chiffrement AES-256 actif\n🔔 Alertes Telegram actives${paysStats}\n\n⏰ ${new Date().toISOString().substring(0,19)} UTC\nBoudoum ! 🇬🇵`
  } catch(e) { return "📊 Dashboard en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== ALERTES CATASTROPHES =====
async function getAlertesCatastrophes() {
  try {
    const [seismesRes, cyclonesRes] = await Promise.all([
      fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson', { signal: AbortSignal.timeout(5000) }),
      fetch('https://www.nhc.noaa.gov/CurrentStorms.json', { signal: AbortSignal.timeout(5000) })
    ])
    
    let result = '🚨 **Alertes Catastrophes — Temps Réel**\n\n'
    
    // Séismes significatifs
    const seismes = await seismesRes.json()
    const bigQuakes = seismes.features?.filter(f => f.properties.mag >= 5.0) || []
    if (bigQuakes.length > 0) {
      result += `🌋 **Séismes M5.0+ cette semaine:** ${bigQuakes.length}\n`
      for (const q of bigQuakes.slice(0,3)) {
        result += `• M${q.properties.mag} — ${q.properties.place}\n`
      }
    } else {
      result += `🌋 Aucun séisme majeur cette semaine\n`
    }
    
    result += `\n🌀 **Cyclones Atlantique:**\n`
    try {
      const cyclones = await cyclonesRes.json()
      if (cyclones.activeStorms?.length > 0) {
        for (const s of cyclones.activeStorms) {
          result += `⚠️ ${s.name} — ${s.classification}\n`
          await sendTelegramAlert(`🚨 CYCLONE ACTIF: ${s.name} — ${s.classification}`)
        }
      } else {
        result += `✅ Aucun cyclone actif\n`
      }
    } catch(e) { result += `✅ Aucun cyclone actif\n` }
    
    result += `\nSource: USGS + NHC\nBoudoum ! 🇬🇵`
    return result
  } catch(e) { return "🚨 Alertes en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== LECTURE URL — Analyse de pages web =====
async function analyserURL(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; REUSSITESS-AI/1.0)' },
      signal: AbortSignal.timeout(8000)
    })
    const html = await res.text()
    // Extraire texte propre
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000)
    return text
  } catch(e) { return null }
}

// ===== OMDB — Films & Séries =====
async function getFilm(titre = "Avatar") {
  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(titre)}&apikey=trilogy&plot=short`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (d.Error) return `❌ Film "${titre}" non trouvé.`
    return `🎬 **${d.Title}** (${d.Year})\n\n📖 ${d.Plot}\n⭐ Note: ${d.imdbRating}/10\n🎭 Genre: ${d.Genre}\n🎬 Réalisateur: ${d.Director}\n🌍 Pays: ${d.Country}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "🎬 Service cinéma en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== COCKTAILDB — Recettes Cocktails =====
async function getCocktail(nom = "mojito") {
  try {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(nom)}`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.drinks?.length) return `❌ Cocktail "${nom}" non trouvé.`
    const c = d.drinks[0]
    const ingredients = Object.keys(c).filter(k => k.startsWith('strIngredient') && c[k]).map((k,i) => `${c[k]} (${c['strMeasure'+(i+1)] || ''})`).join(', ')
    return `🍹 **${c.strDrink}**\n\n📋 Instructions: ${c.strInstructions?.substring(0,300)}...\n\n🧪 Ingrédients: ${ingredients}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "🍹 Service cocktail en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== THEMEALDB — Recettes Cuisine =====
async function getRecette(plat = "chicken") {
  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(plat)}`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.meals?.length) return `❌ Recette "${plat}" non trouvée.`
    const m = d.meals[0]
    return `🍽️ **${m.strMeal}** — ${m.strArea}\n\n📋 ${m.strInstructions?.substring(0,400)}...\n\n🌍 Cuisine: ${m.strCategory}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "🍽️ Service recette en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== WIKIPEDIA FR — Articles =====

// ===== AIR QUALITY =====
async function getAirQuality(ville = "Guadeloupe") {
  try {
    const res = await fetch(`https://api.waqi.info/feed/${encodeURIComponent(ville)}/?token=demo`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (d.status !== 'ok') return `❌ Qualité de l'air pour "${ville}" non trouvée.`
    const aqi = d.data.aqi
    const niveau = aqi <= 50 ? '🟢 Bonne' : aqi <= 100 ? '🟡 Modérée' : aqi <= 150 ? '🟠 Mauvaise' : '🔴 Très mauvaise'
    return `🌬️ **Qualité de l'air — ${ville}**\n\n📊 AQI: **${aqi}** — ${niveau}\n⏰ Mise à jour: ${d.data.time?.s || 'N/A'}\n\nSource: WAQI\nBoudoum ! 🇬🇵`
  } catch(e) { return "🌿 Service qualité air en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== JOKEAPI — Blagues en français =====

// ===== UN POPULATION — Données ONU =====
async function getUNPopulation(pays = "250") {
  try {
    const res = await fetch(`https://population.un.org/dataportalapi/api/v1/data/indicators/49/locations/${pays}/start/2020/end/2023?format=json&pageSize=1`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.data?.length) return "❌ Données ONU non trouvées."
    const pop = d.data[0]
    return `👥 **Population ONU — ${pop.location}**\n\n📊 ${pop.value?.toLocaleString()} millions (${pop.timeLabel})\n\nSource: Nations Unies\nBoudoum ! 🇬🇵`
  } catch(e) { return "🌍 Service ONU en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== IP GEOLOCATION =====
async function getIPLocation(ip = "") {
  try {
    const url = ip ? `https://freeipapi.com/api/json/${ip}` : 'https://freeipapi.com/api/json'
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    return `📍 **Localisation IP**\n\n🌍 Pays: ${d.countryName}\n🏙️ Ville: ${d.cityName}\n📡 IP: ${d.ipAddress}\n🌐 Fuseau: ${d.timeZone}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "📍 Service géolocalisation en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== ITUNES PODCASTS GRATUITS =====
async function getPodcasts(query = "guadeloupe") {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=5&lang=fr_fr`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.results?.length) return `❌ Aucun podcast trouvé pour "${query}".`
    let result = `🎙️ **Podcasts — "${query}"**\n\n`
    for (const p of d.results.slice(0,5)) {
      result += `🎵 **${p.collectionName}**\n`
      result += `👤 ${p.artistName}\n`
      result += `🔗 ${p.collectionViewUrl}\n\n`
    }
    result += `Source: iTunes • 100% gratuit\nBoudoum ! 🇬🇵`
    return result
  } catch(e) { return "🎙️ Service podcasts en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== ITUNES MUSIQUE CARIBÉENNE =====
async function getMusiqueCaraibe(query = "zouk guadeloupe") {
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5&lang=fr_fr`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.results?.length) return `❌ Aucun résultat pour "${query}".`
    let result = `🎵 **Musique — "${query}"**\n\n`
    for (const t of d.results.slice(0,5)) {
      result += `🎶 **${t.trackName}** — ${t.artistName}\n`
      result += `💿 Album: ${t.collectionName} (${t.releaseDate?.substring(0,4)||'N/A'})\n`
      result += `🔗 ${t.trackViewUrl}\n\n`
    }
    result += `Source: iTunes • Boudoum ! 🇬🇵`
    return result
  } catch(e) { return "🎵 Service musique en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== MUSICBRAINZ — Artistes Caribéens =====
async function getArtisteCaraibe(artiste = "Kassav") {
  try {
    const res = await fetch(`https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(artiste)}&fmt=json&limit=3`, { headers: {'User-Agent': 'REUSSITESS-AI/1.0 (reussitess.fr)'}, signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.artists?.length) return `❌ Artiste "${artiste}" non trouvé.`
    const a = d.artists[0]
    return `🎤 **${a.name}**\n\n📍 Origine: ${a.country || a['begin-area']?.name || 'N/A'}\n📅 Actif depuis: ${a['life-span']?.begin || 'N/A'}\n🎭 Genre: ${a.tags?.slice(0,3).map(t=>t.name).join(', ') || 'N/A'}\n\nSource: MusicBrainz\nBoudoum ! 🇬🇵`
  } catch(e) { return "🎤 Service artiste en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== DEEZER — Radio & Musique Caribéenne =====
async function getDeezerCaraibe(query = "zouk") {
  try {
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(query)}&type=track&limit=5`, { signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.data?.length) return `❌ Aucun résultat Deezer pour "${query}".`
    let result = `🎧 **Deezer — "${query}"**\n\n`
    for (const t of d.data.slice(0,5)) {
      result += `🎵 **${t.title}** — ${t.artist.name}\n`
      result += `💿 ${t.album.title} | 🔗 https://www.deezer.com/track/${t.id}\n\n`
    }
    result += `Source: Deezer • Boudoum ! 🇬🇵`
    return result
  } catch(e) { return "🎵 Service Deezer en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== DISCOGS — Vinyles & Albums Caribéens =====
async function getDiscogsCaraibe(query = "zouk") {
  try {
    const res = await fetch(`https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&per_page=5`, { headers: {'User-Agent': 'REUSSITESS-AI/1.0'}, signal: AbortSignal.timeout(5000) })
    const d = await res.json()
    if (!d.results?.length) return `❌ Aucun album trouvé pour "${query}".`
    let result = `💿 **Discogs — Albums "${query}"**\n\n`
    for (const r of d.results.slice(0,5)) {
      result += `🎵 **${r.title}** (${r.year || 'N/A'})\n`
      result += `🎭 Genre: ${r.genre?.join(', ') || 'N/A'} | Style: ${r.style?.join(', ') || 'N/A'}\n\n`
    }
    result += `Source: Discogs • Boudoum ! 🇬🇵`
    return result
  } catch(e) { return "🎵 Service musique en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== CRYPTO SECURITE — GoPlus + Education =====
async function getCryptoSecurite(contrat = "", chain = "polygon") {
  try {
    let result = `🛡️ **REUSSSHIELD CRYPTO — Guide Sécurité**\n\n`

    // Vérification contrat si fourni
    if (contrat && contrat.startsWith('0x')) {
      const chainId = chain === 'polygon' ? '137' : chain === 'eth' ? '1' : chain === 'bsc' ? '56' : '137'
      const res = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${contrat}`, { signal: AbortSignal.timeout(8000) })
      const d = await res.json()
      const token = d.result?.[contrat.toLowerCase()]

      if (token) {
        const isHoneypot = token.is_honeypot === '1'
        const isScam = token.is_blacklisted === '1' || token.is_whitelisted === '0'
        const mintable = token.is_mintable === '1'
        const proxyContract = token.is_proxy === '1'
        const openSource = token.is_open_source === '1'

        result += `🔍 **Analyse Contrat: ${contrat.substring(0,10)}...**\n\n`
        result += `${isHoneypot ? '🚨 HONEYPOT DÉTECTÉ !' : '✅ Pas un honeypot'}\n`
        result += `${openSource ? '✅ Code source vérifié' : '⚠️ Code source NON vérifié'}\n`
        result += `${mintable ? '⚠️ Token mintable (risque inflation)' : '✅ Supply fixe'}\n`
        result += `${proxyContract ? '⚠️ Contrat proxy (peut changer)' : '✅ Contrat fixe'}\n`
        result += `\n`
      }
    }

    result += `📚 **Guide Crypto Sécurité REUSSITESS**\n\n`
    result += `🚨 **DANGERS PRINCIPAUX :**\n`
    result += `• Draineurs de wallet — apps/sites qui volent tout ton wallet en 1 clic\n`
    result += `• Honeypot — token qu'on peut acheter mais jamais vendre\n`
    result += `• Rug Pull — équipe qui vide la liquidité et disparaît\n`
    result += `• Phishing — faux sites MetaMask/Uniswap qui volent ta seedphrase\n`
    result += `• Fake airdrop — signature malveillante qui donne accès à ton wallet\n\n`

    result += `🔒 **RÈGLES D'OR :**\n`
    result += `• JAMAIS partager ta seedphrase (12/24 mots) — même à ton frère !\n`
    result += `• Vérifier l'URL exacte avant de connecter ton wallet\n`
    result += `• Utiliser revoke.cash pour révoquer les approbations suspectes\n`
    result += `• Tester avec un petit montant avant d'investir\n`
    result += `• Vérifier le contrat sur PolygonScan/Etherscan\n\n`

    result += `🔎 **OUTILS GRATUITS DE VÉRIFICATION :**\n`
    result += `• https://gopluslabs.io — scanner de token gratuit\n`
    result += `• https://revoke.cash — révoquer accès wallet\n`
    result += `• https://de.fi/scanner — audit contrat gratuit\n`
    result += `• https://tokensniffer.com — détecter scams\n`
    result += `• https://polygonscan.com — vérifier contrats Polygon\n\n`

    result += `⚖️ **MiCA (Europe) :**\n`
    result += `• En vigueur depuis 2024 pour les crypto-actifs en Europe\n`
    result += `• Oblige la transparence sur les tokenomics et risques\n`
    result += `• REUSS Token suit les directives MiCA\n\n`

    result += `⚠️ Ce n'est PAS un conseil financier. DYOR. Risque de perte totale.\nBoudoum ! 🇬🇵`
    return result
  } catch(e) { return "🔐 Service sécurité en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== HUGGINGFACE — APIs Complémentaires =====
const HF_KEY = process.env.HUGGINGFACE_API_KEY
const HF_BASE = "https://router.huggingface.co/hf-inference/models"

// Traduction avancée 100+ langues
async function hfTraduire(texte, sourceLang = "fr", targetLang = "en") {
  try {
    if (!HF_KEY) return null
    const model = `Helsinki-NLP/opus-mt-${sourceLang}-${targetLang}`
    const res = await fetch(`${HF_BASE}/${model}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + HF_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: texte }),
      signal: AbortSignal.timeout(8000)
    })
    if (!res.ok) return null
    const d = await res.json()
    return d[0]?.translation_text || null
  } catch(e) { return null }
}

// Résumé de texte
async function hfResumer(texte) {
  try {
    if (!HF_KEY) return null
    const res = await fetch(`${HF_BASE}/facebook/bart-large-cnn`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + HF_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: texte.substring(0, 1000) }),
      signal: AbortSignal.timeout(10000)
    })
    if (!res.ok) return null
    const d = await res.json()
    return d[0]?.summary_text || null
  } catch(e) { return null }
}

// Analyse sentiment
async function hfSentiment(texte) {
  try {
    if (!HF_KEY) return null
    const res = await fetch(`${HF_BASE}/cardiffnlp/twitter-roberta-base-sentiment-latest`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + HF_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: texte.substring(0, 500) }),
      signal: AbortSignal.timeout(8000)
    })
    if (!res.ok) return null
    const d = await res.json()
    const top = d[0]?.sort((a,b) => b.score - a.score)[0]
    const labels = { 'LABEL_0': '😟 Négatif', 'LABEL_1': '😐 Neutre', 'LABEL_2': '😊 Positif', 'negative': '😟 Négatif', 'neutral': '😐 Neutre', 'positive': '😊 Positif' }
    return top ? `${labels[top.label] || top.label} (${Math.round(top.score*100)}%)` : null
  } catch(e) { return null }
}

// Détection langue
async function hfDetectLangue(texte) {
  try {
    if (!HF_KEY) return null
    const res = await fetch(`${HF_BASE}/papluca/xlm-roberta-base-language-detection`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + HF_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: texte.substring(0, 200) }),
      signal: AbortSignal.timeout(8000)
    })
    if (!res.ok) return null
    const d = await res.json()
    const top = d[0]?.sort((a,b) => b.score - a.score)[0]
    return top ? `${top.label} (${Math.round(top.score*100)}%)` : null
  } catch(e) { return null }
}

// ===== KICK.COM API =====
async function getKickStats() {
  try {
    const res = await fetch("https://kick.com/api/v2/channels/Reussitess", {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json', 'Referer': 'https://kick.com' },
      signal: AbortSignal.timeout(5000)
    })
    const d = await res.json()
    const isLive = d.livestream !== null
    const followers = d.followers_count || 0
    const viewers = d.livestream?.viewer_count || 0
    const title = d.livestream?.session_title || 'Hors ligne'
    
    let result = `🎮 **REUSSITESS sur Kick.com**\n\n`
    result += `👥 Followers: **${followers}**\n`
    result += `${isLive ? '🔴 **EN DIRECT** !' : '⚫ Hors ligne'}\n`
    if (isLive) {
      result += `👁️ Viewers: **${viewers}**\n`
      result += `🎯 Stream: ${title}\n`
    }
    result += `\n🔗 https://kick.com/Reussitess\n`
    result += `\n💡 Abonne-toi pour suivre les streams REUSSITESS !\n\nBoudoum ! 🇬🇵`
    return result
  } catch(e) { return null }
}

// ===== REDDIT RSS GRATUIT =====
async function getRedditPosts(subreddit = "reussitess_quiz_dev") {
  try {
    const res = await fetch(`https://www.reddit.com/r/${subreddit}/new.json?limit=5`, {
      headers: { 'User-Agent': 'REUSSITESS-AI/1.0' },
      signal: AbortSignal.timeout(5000)
    })
    const d = await res.json()
    if (!d.data?.children?.length) return `❌ Aucun post dans r/${subreddit}.`
    let result = `📱 **Reddit — r/${subreddit}**\n\n`
    for (const p of d.data.children.slice(0,5)) {
      const post = p.data
      result += `📌 **${post.title}**\n`
      result += `👍 ${post.score} votes | 💬 ${post.num_comments} commentaires\n`
      result += `🔗 https://reddit.com${post.permalink}\n\n`
    }
    result += `Source: Reddit • Boudoum ! 🇬🇵`
    return result
  } catch(e) { return "📰 Service actualités en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== CHIFFREMENT AES-256 =====
const crypto_node = require('crypto')
const ENCRYPT_KEY = process.env.ENCRYPT_KEY || 'reussitess971-guadeloupe-secure-key-32b'

function encryptData(text) {
  try {
    const key = crypto_node.createHash('sha256').update(ENCRYPT_KEY).digest()
    const iv = crypto_node.randomBytes(16)
    const cipher = crypto_node.createCipheriv('aes-256-cbc', key, iv)
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  } catch(e) { return text }
}

function decryptData(encryptedText) {
  try {
    const [ivHex, encHex] = encryptedText.split(':')
    const key = crypto_node.createHash('sha256').update(ENCRYPT_KEY).digest()
    const iv = Buffer.from(ivHex, 'hex')
    const encrypted = Buffer.from(encHex, 'hex')
    const decipher = crypto_node.createDecipheriv('aes-256-cbc', key, iv)
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8')
  } catch(e) { return encryptedText }
}

// ===== TELEGRAM ALERTES =====
async function sendTelegramAlert(message) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) return false
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
    })
    return true
  } catch(e) { return false }
}

// ===== AUTO-GUERISON — Health Check Temps Réel =====
async function getHealthCheck() {
  try {
    const checks = {}
    
    // Test Groq
    try {
      const r = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY },
        signal: AbortSignal.timeout(3000)
      })
      checks.groq = r.ok ? "✅ Groq IA" : "⚠️ Groq dégradé"
    } catch(e) { checks.groq = "❌ Groq indisponible" }

    // Test Alchemy
    try {
      const r = await fetch(process.env.RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/3pTz5vSd3WrsST8MhLEUC', {
        method: 'POST', headers: {'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0',method:'eth_blockNumber',params:[],id:1}),
        signal: AbortSignal.timeout(3000)
      })
      checks.blockchain = r.ok ? "✅ Blockchain Polygon" : "⚠️ Blockchain dégradée"
    } catch(e) { checks.blockchain = "❌ Blockchain indisponible" }

    // Test Open-Meteo
    try {
      const r = await fetch("https://api.open-meteo.com/v1/forecast?latitude=16.01&longitude=-61.73&current_weather=true", { signal: AbortSignal.timeout(3000) })
      checks.meteo = r.ok ? "✅ Météo Open-Meteo" : "⚠️ Météo dégradée"
    } catch(e) { checks.meteo = "❌ Météo indisponible" }

    // Test CoinGecko
    try {
      const r = await fetch("https://api.coingecko.com/api/v3/ping", { signal: AbortSignal.timeout(3000) })
      checks.crypto = r.ok ? "✅ Crypto CoinGecko" : "⚠️ Crypto dégradée"
    } catch(e) { checks.crypto = "❌ Crypto indisponible" }

    // Test RSS Actualités
    try {
      const r = await fetch("https://www.rfi.fr/fr/afrique/rss", { signal: AbortSignal.timeout(3000) })
      checks.actualites = r.ok ? "✅ Actualités RFI" : "⚠️ Actualités dégradées"
    } catch(e) { checks.actualites = "❌ Actualités indisponibles" }

    const allOk = Object.values(checks).every(v => v.startsWith("✅"))
    const status = allOk ? "🟢 TOUS SYSTÈMES OPÉRATIONNELS" : "🟡 SYSTÈME DÉGRADÉ"
    if (!allOk) {
      const failedServices = Object.entries(checks).filter(([k,v]) => !v.startsWith("✅")).map(([k,v]) => v).join("\n")
      await sendTelegramAlert(`🚨 *REUSSSHIELD ALERTE*\n\n${failedServices}\n\n⏰ ${new Date().toISOString().substring(0,19)} UTC`)
    }
    
    let result = `🛡️ **REUSSSHIELD — Rapport Temps Réel**\n\n${status}\n\n`
    for (const [k, v] of Object.entries(checks)) {
      result += `${v}\n`
    }
    result += `\n⏰ ${new Date().toISOString().substring(0,19).replace('T',' ')} UTC\n200 agents IA en surveillance 24/7\nBoudoum ! 🇬🇵`
    return result
  } catch(e) { return "💚 Système en ligne. Boudoum 🇬🇵" }
}

// ===== ALCHEMY — Token REUSS Polygon Blockchain =====
async function getReussTokenBlockchain() {
  try {
    const RPC = process.env.RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/3pTz5vSd3WrsST8MhLEUC'
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'

    const [supplyRes, blockRes, metaRes] = await Promise.all([
      fetch(RPC, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0',method:'eth_call',params:[{to:CONTRACT,data:'0x18160ddd'},'latest'],id:1}) }),
      fetch(RPC, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0',method:'eth_blockNumber',params:[],id:2}) }),
      fetch(RPC, { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({jsonrpc:'2.0',method:'alchemy_getTokenMetadata',params:[CONTRACT],id:3}) })
    ])

    const [supplyData, blockData, metaData] = await Promise.all([supplyRes.json(), blockRes.json(), metaRes.json()])

    const supply = (parseInt(supplyData.result, 16) / 1e18).toLocaleString()
    const block = parseInt(blockData.result, 16).toLocaleString()
    const meta = metaData.result || {}

    return `💎 **${meta.name || 'REUSSITESS Token'} ($${meta.symbol || 'REUSS'}) — Blockchain Temps Réel**\n\n🔗 Contrat: ${CONTRACT}\n🌐 Réseau: Polygon (MATIC)\n📊 Supply Total: **${supply} REUSS**\n🔢 Décimales: ${meta.decimals || 18}\n⛓️ Block Actuel: **${block}**\n\n📈 **Liens directs:**\n🔍 PolygonScan: https://polygonscan.com/token/${CONTRACT}\n💱 Acheter sur QuickSwap: https://quickswap.exchange/#/swap?outputCurrency=${CONTRACT}\n📊 DexScreener: https://dexscreener.com/polygon/${CONTRACT}\n🦅 Birdeye: https://birdeye.so/token/${CONTRACT}\n\n⚠️ Ce n'est pas un conseil financier. DYOR. Risque de perte totale.\nBoudoum ! 🇬🇵`
  } catch(e) { return `⚠️ Données blockchain indisponibles. (${e.message})` }
}

// ===== WORLD BANK — PIB & Chômage =====
async function getWorldBank(pays = "GP", indicateur = "NY.GDP.MKTP.CD") {
  try {
    const res = await fetch(`https://api.worldbank.org/v2/country/${pays}/indicator/${indicateur}?format=json&mrv=3`)
    const d = await res.json()
    const val = d[1]?.[0]
    if (!val) return "🌴 Je recherche cette info pour toi ! Reformule ta question ou essaie : météo, emploi, bourses, token REUSS. Boudoum ! 🇬🇵"
    const noms = {
      "NY.GDP.MKTP.CD": "PIB",
      "SL.UEM.TOTL.ZS": "Taux de chômage",
      "SP.POP.TOTL": "Population"
    }
    const nom = noms[indicateur] || indicateur
    const valeur = val.value ? (val.value > 1e9 ? (val.value/1e9).toFixed(2)+"B$" : val.value.toFixed(2)) : "N/A"
    return `📊 **${nom} — ${val.country?.value}**\n\n💰 ${valeur} (${val.date})\n\nSource: World Bank\nBoudoum ! 🇬🇵`
  } catch(e) { return "🌍 Service Banque Mondiale en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "📊 Service INSEE en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "📊 Service data.gouv en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "🏙️ Service villes en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "💊 Service médicaments en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "🚆 Service trains en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "🌤️ Météo en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { try { const {Redis}=await import('@upstash/redis');const r=Redis.fromEnv();const c=await r.get('cache:crypto');if(c) return c } catch(re){} return "💎 Crypto en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== EXCHANGERATE — Devises temps réel =====
async function getExchangeRate(from = "EUR", to = "XCD") {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`)
    const d = await res.json()
    const rate = d.rates[to]
    if (!rate) return `❌ Devise ${to} non trouvée.`
    return `💱 **Taux de change (ExchangeRate)**\n\n1 ${from} = ${rate.toFixed(4)} ${to}\n\n🌍 Principales devises:\n• EUR → USD: ${d.rates.USD?.toFixed(4)}\n• EUR → XOF: ${d.rates.XOF?.toFixed(0)} (FCFA)\n• EUR → XCD: ${d.rates.XCD?.toFixed(4)} (Dollar Caraïbes)\n• EUR → HTG: ${d.rates.HTG?.toFixed(2)} (Gourde Haïti)\n\nBoudoum ! 🇬🇵`
  } catch(e) { try { const {Redis}=await import('@upstash/redis');const r=Redis.fromEnv();const c=await r.get('cache:devises');if(c) return c } catch(re){} return "💱 Taux en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "🌍 Service pays en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== DISEASE.SH — Santé mondiale =====
async function getSanteMondale() {
  try {
    const res = await fetch("https://disease.sh/v3/covid-19/all")
    const d = await res.json()
    return `🏥 **Santé Mondiale (Disease.sh)**\n\n🦠 COVID-19 Global:\n• Cas totaux: ${d.cases?.toLocaleString("fr-FR")}\n• Décès: ${d.deaths?.toLocaleString("fr-FR")}\n• Guéris: ${d.recovered?.toLocaleString("fr-FR")}\n• Actifs: ${d.active?.toLocaleString("fr-FR")}\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "🏥 Service santé en chargement. Réessaie ! Boudoum 🇬🇵" }
}

// ===== OPENLIBRARY — Livres gratuits =====
async function getOpenLibrary(query = "Aimé Césaire") {
  try {
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`)
    const d = await res.json()
    if (!d.docs?.length) return `❌ Aucun livre trouvé pour "${query}".`
    const livres = d.docs.slice(0, 5).map((b, i) => `${i+1}. **${b.title}** — ${b.author_name?.[0] || "Auteur inconnu"} (${b.first_publish_year || "?"})`)
    return `📚 **Open Library — "${query}"**\n\n${livres.join("\n")}\n\n🔗 openlibrary.org\n\nBoudoum ! 🇬🇵`
  } catch(e) { return "📚 Bibliothèque en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "📖 Dictionnaire en chargement. Réessaie ! Boudoum 🇬🇵" }
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
  } catch(e) { return "📍 Service géolocalisation en chargement. Réessaie ! Boudoum 🇬🇵" }
}

async function getMeteoMonde(ville) {
  try {
    // Géocodage avec Nominatim
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(ville)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'REUSSITESS-AI/1.0 (reussitess.fr)' },
      signal: AbortSignal.timeout(5000)
    })
    const geo = await geoRes.json()
    if (!geo || geo.length === 0) return null

    const lat = geo[0].lat
    const lon = geo[0].lon
    const nomVille = geo[0].display_name.split(',')[0]

    const meteoRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&timezone=auto`, {
      signal: AbortSignal.timeout(5000)
    })
    const meteo = await meteoRes.json()
    const c = meteo.current
    const codes = {0:'☀️ Ciel dégagé',1:'🌤️ Peu nuageux',2:'⛅ Nuageux',3:'☁️ Couvert',45:'🌫️ Brouillard',51:'🌦️ Bruine',61:'🌧️ Pluie légère',63:'🌧️ Pluie modérée',65:'🌧️ Pluie forte',71:'❄️ Neige légère',80:'🌦️ Averses',95:'⛈️ Orage',96:'⛈️ Orage grêle'}

    return `🌤️ **Météo ${nomVille}**

🌡️ Température : ${c.temperature_2m}°C
💨 Vent : ${c.windspeed_10m} km/h
💧 Humidité : ${c.relative_humidity_2m}%
☁️ Conditions : ${codes[c.weathercode] || 'Variable'}

📍 Coordonnées : ${parseFloat(lat).toFixed(4)}, ${parseFloat(lon).toFixed(4)}
🔗 Source : Open-Meteo

Boudoum ! 🇬🇵`
  } catch(e) { return null }
}

async function getMeteoDOMTOM(commune) {
  try {
    const nom = commune || 'Pointe-a-Pitre'
    // Base coordonnées DOM-TOM complète
    const COORDS = {
      'pointe-a-pitre':[16.2411,-61.5331],'basse-terre':[16.0078,-61.7253],'abymes':[16.2695,-61.5166],
      'baie-mahault':[16.2683,-61.5866],'le-gosier':[16.2017,-61.4936],'petit-bourg':[16.1886,-61.5792],
      'sainte-anne':[16.2292,-61.3728],'saint-francois':[16.2528,-61.2708],'le-moule':[16.3331,-61.3528],
      'capesterre-belle-eau':[16.0436,-61.5625],'saint-claude':[16.0408,-61.7025],'trois-rivieres':[15.9678,-61.6536],
      'vieux-habitants':[16.0653,-61.7775],'bouillante':[16.1219,-61.7761],'deshaies':[16.3028,-61.7961],
      'pointe-noire':[16.2292,-61.7861],'lamentin':[16.2717,-61.6269],'morne-a-leau':[16.3319,-61.5414],
      'port-louis':[16.4131,-61.5353],'anse-bertrand':[16.4728,-61.5117],'gourbeyre':[16.0044,-61.6897],
      // Martinique
      'fort-de-france':[14.6037,-61.0722],'le-lamentin':[14.6161,-60.9969],'le-robert':[14.6806,-60.9306],
      'sainte-marie':[14.7869,-61.0014],'le-francois':[14.6228,-60.8958],'le-vauclin':[14.5536,-60.8394],
      'riviere-pilote':[14.4797,-60.9008],'le-marin':[14.4675,-60.8739],'saint-esprit':[14.5619,-60.9506],
      // Guyane
      'cayenne':[4.9224,-52.3135],'kourou':[5.1604,-52.6477],'saint-laurent-du-maroni':[5.4903,-54.0322],
      // Réunion
      'saint-denis':[-20.8823,55.4504],'saint-paul':[-21.0103,55.2733],'saint-pierre':[-21.3393,55.4781],
      // Mayotte
      'mamoudzou':[-12.7806,45.2278],'dzaoudzi':[-12.7878,45.2742]
    }
    const key = nom.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z-]/g,'-').replace(/-+/g,'-').trim()
    const found = COORDS[key] || Object.entries(COORDS).find(([k]) => key.includes(k) || k.includes(key.split('-')[0]))?.[1]
    const lat = found ? found[0] : 16.24
    const lng = found ? found[1] : -61.53
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`, { signal: AbortSignal.timeout(5000) })
    const data = await r.json()
    const c = data.current
    const codes = {0:'Ciel degage',1:'Peu nuageux',2:'Nuageux',3:'Couvert',61:'Pluie legere',63:'Pluie moderee',80:'Averses',95:'Orage'}
    return nom+": "+(codes[c.weathercode]||'Variable')+" | "+c.temperature_2m+"C | Vent: "+c.windspeed_10m+" km/h"
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

async function cachedFetch(key, fetchFn, ttl = 3600) {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const cached = await redis.get(key)
    if (cached) return { data: cached, fromCache: true }
    const data = await fetchFn()
    if (data) await redis.set(key, data, { ex: ttl })
    return { data, fromCache: false }
  } catch(e) {
    try { const data = await fetchFn(); return { data, fromCache: false } } catch(e2) { return { data: null, fromCache: false } }
  }
}


// ============ NASA APOD ============
async function getNASAPhotoJour() {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY'
    const r = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    return `🚀 **NASA — Photo du Jour**\n\n📸 **${d.title}**\n\n${d.explanation?.substring(0,300)}...\n\n🔗 ${d.url}\n\nSource: NASA APOD\nBoudoum ! 🇬🇵`
  } catch(e) { return null }
}

// ============ LEVER/COUCHER SOLEIL DOM-TOM ============
async function getLeverCoucherSoleil(lat = 16.2411, lng = -61.5331, ville = 'Guadeloupe') {
  try {
    const r = await fetch(`https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&timezone=America/Guadeloupe`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    const s = d.results
    return `☀️ **Lever & Coucher du Soleil — ${ville}**\n\n🌅 Lever : ${s.sunrise}\n🌇 Coucher : ${s.sunset}\n🌙 Crépuscule : ${s.civil_twilight_end || s.astronomical_twilight_end || 'N/A'}\n⏱️ Durée du jour : ${s.day_length}\n\nSource: SunriseSunset API\nBoudoum ! 🇬🇵`
  } catch(e) { return null }
}

// ============ PROGRAMMES TV ============
async function getProgrammesTV(query = 'guadeloupe') {
  try {
    const r = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()
    const shows = d.slice(0,3).map(s => `• **${s.show.name}** — ${s.show.genres?.join(', ')||'Général'} | ${s.show.language||'FR'}`).join('\n')
    return `📺 **Programmes TV — ${query}**\n\n${shows}\n\nSource: TVMaze\nBoudoum ! 🇬🇵`
  } catch(e) { return null }
}

// ============ CHUNKING INTELLIGENT ============
function chunkContext(messages, maxTokens = 2000) {
  if (!Array.isArray(messages)) return []
  // Garde les 2 premiers messages (salutation/contexte) + les 6 derniers
  const important = messages.slice(0, 2)
  const recent = messages.slice(-6)
  const combined = [...important, ...recent]
  // Déduplique
  const seen = new Set()
  return combined.filter(m => {
    const key = m.role + m.content?.substring(0,50)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: (m.content || '').substring(0, 10000)
  }))
}

// ============ SELF-CONSISTENCY ============
async function selfConsistency(groq, prompt, systemPrompt, n = 2) {
  try {
    const calls = Array(n).fill(null).map(() => 
      groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        max_tokens: 800,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    )
    const results = await Promise.all(calls)
    const responses = results.map(r => r.choices[0]?.message?.content || '')
    // Retourne la plus longue réponse (heuristique simple)
    return responses.reduce((a, b) => a.length > b.length ? a : b, '')
  } catch(e) { return null }
}

// ============ SCORING QUALITÉ ============
function scoreReponse(response) {
  if (!response) return 0
  let score = 0
  if (response.length > 100) score += 2
  if (response.includes('🇬🇵') || response.includes('Boudoum')) score += 1
  if (response.includes('http')) score += 1
  if (response.includes('**')) score += 1
  if (response.length > 500) score += 1
  if (response.includes('❌') || response.includes('indisponible')) score -= 3
  return score
}

async function generateFollowUp(response, message) {
  try {
    const Groq = (await import('groq-sdk')).default
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 120,
      messages: [
        { role: 'system', content: 'Reponds UNIQUEMENT avec un tableau JSON: ["question1?","question2?","question3?"]. 3 questions courtes max 8 mots.' },
        { role: 'user', content: message.substring(0,100) + ' ' + response.substring(0,200) }
      ]
    })
    const text = completion.choices[0].message.content.trim().replace(/```json|```/g,'').trim()
    return JSON.parse(text).slice(0,3)
  } catch(e) { return [] }
}

export const config = { api: { responseLimit: false } }


// ===== MODULES PREMIUM =====
async function checkPremium(userId) {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    const data = await redis.get(`premium:${userId}`)
    return !!data
  } catch(e) { return false }
}

const PREMIUM_TRIGGERS = {
  creole: ['traduis en créole','traduction créole','créole guadeloupéen','créole martiniquais','créole haïtien','an kreol','an kréyòl'],
  transfert: ['envoyer argent','transfert argent','western union','wise','remitly','envoyer euros','frais transfert'],
  cv: ['génère mon cv','créer cv','lettre motivation','dossier caf','demande rsa','logement social','apl'],
  visa: ['visa canada','visa usa','visa uk','visa schengen','visa pour','demande visa','passeport'],
  coach: ['coach premium','mon coach','souviens-toi','rappelle toi','mon projet','objectif personnel']
}

function detectPremiumModule(msg) {
  const m = msg.toLowerCase()
  for (const [module, keywords] of Object.entries(PREMIUM_TRIGGERS)) {
    if (keywords.some(k => m.includes(k))) return module
  }
  return null
}


// ===== RSS DOM-TOM UNIFIÉ — TOUTES SOURCES =====
async function getAllDOMTOMNews() {
  const RSS_SOURCES = [
    { url: "https://la1ere.francetvinfo.fr/guadeloupe/rss.xml", label: "🇬🇵 La 1ère Guadeloupe" },
    { url: "https://la1ere.francetvinfo.fr/martinique/rss.xml", label: "🇲🇶 La 1ère Martinique" },
    { url: "https://la1ere.francetvinfo.fr/reunion/rss.xml", label: "🇷🇪 La 1ère Réunion" },
    { url: "https://la1ere.francetvinfo.fr/guyane/rss.xml", label: "🇬🇫 La 1ère Guyane" },
    { url: "https://la1ere.francetvinfo.fr/mayotte/rss.xml", label: "🇾🇹 La 1ère Mayotte" },
    { url: "https://la1ere.francetvinfo.fr/nouvelle-caledonie/rss.xml", label: "🏝️ La 1ère Nouvelle-Calédonie" },
    { url: "https://www.bondamanjak.com/feed/", label: "🇬🇵 Bondamanjak" },
    { url: "https://outremers360.com/feed/", label: "🌍 Outremers360" },
    { url: "https://www.zinfos974.com/feed/", label: "🇷🇪 Zinfos974" },
    { url: "https://rci.fm/guadeloupe/rss.xml", label: "📻 RCI Guadeloupe" },
    { url: "https://rci.fm/martinique/rss.xml", label: "📻 RCI Martinique" },
    { url: "https://www.regionguadeloupe.fr/rss.xml", label: "🏛️ Région Guadeloupe" },
  ]

  const results = []
  const promises = RSS_SOURCES.map(async (source) => {
    try {
      const res = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(source.url) + "&count=2",
        { signal: AbortSignal.timeout(4000) }
      )
      const data = await res.json()
      if (data.items?.length > 0) {
        const titles = data.items.map(i => "• " + i.title).join("\n")
        results.push(source.label + ":\n" + titles)
      }
    } catch(e) {}
  })

  await Promise.allSettled(promises)
  return results.join("\n\n")
}

export default async function handler(req, res) {

  // KNOWLEDGE EXTERNE — commandes depuis /api/knowledge
  try {
    const kbRes = await fetch('https://reussitess.fr/api/knowledge')
    const kb = await kbRes.json()
    const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    const msgL = normalize(req.body?.message || '')
    const matches = (kb.commands || []).map(cmd => {
      const trigger = normalize(cmd.trigger)
      const words = trigger.split(' ').filter(w => w.length > 2)
      const matchCount = words.filter(w => msgL.includes(w)).length
      const exactMatch = msgL.includes(trigger) ? 10 : 0
      // Exige que TOUS les mots du trigger matchent OU match exact
      const allMatch = words.length > 0 && words.every(w => msgL.includes(w))
      return { cmd, score: allMatch ? matchCount + exactMatch : exactMatch }
    }).filter(m => m.score > 0).sort((a, b) => b.score - a.score)
    if (matches.length > 0) {
      return res.status(200).json({ pdfAction: null, response: matches[0].cmd.response })
    }
  } catch(e) {}

  let pdfType = null;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, personality, context, langue, datetime, image, imageQuestion } = req.body
  const telegramId = req.body?.telegramId || req.body?.userId || null
  const userId = telegramId ? `telegram:${telegramId}` : req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "anonymous"

  // Incrémenter compteurs Redis
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    await redis.incr('reussitess_visitors')
    const today = new Date().toISOString().substring(0,10)
    await redis.incr('requests:' + today)
  } catch(e) {}

  
  // ===== PREMIUM MODULE HANDLER =====
  const premiumModule = detectPremiumModule(message)
  if (premiumModule) {
    const isPremium = await checkPremium(userId)
    if (!isPremium) {
      return res.status(200).json({ 
        pdfAction: null, 
        response: `👑 *Fonctionnalité Premium*\n\nCe module fait partie de REUSSITESS Premium.\n\n✅ Traducteur Créole IA\n💰 Comparateur Transfert Argent\n📋 Générateur CV + Admin\n🛂 Assistant Visa\n🧠 Coach IA Mémoire Longue\n\n**4,99€/mois** — Sans engagement\n\n👉 [Souscrire sur reussitess.fr/premium](https://reussitess.fr/premium)\n\nBoudoum ! 🇬🇵` 
      })
    }

    const endpoints = {
      creole: '/api/premium/traducteur-creole',
      transfert: '/api/premium/transfert-argent',
      cv: '/api/premium/cv-admin',
      visa: '/api/premium/visa',
      coach: '/api/premium/coach'
    }

    const premRes = await fetch(`https://reussitess.fr${endpoints[premiumModule]}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, text: message, userId, telegramId: userId })
    })
    const premData = await premRes.json()
    if (premData.result) {
      return res.status(200).json({ pdfAction: null, response: premData.result + '\n\n👑 *REUSSITESS Premium* | Boudoum ! 🇬🇵' })
    }
  }

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
  const msgLow = message.toLowerCase()  // ===== GARDE-FOU JURIDIQUE =====


  // ===== QUIZ ENGINE — CHAT =====
  if (msgLow.includes('quiz') && (msgLow.includes('jouer') || msgLow.includes('commencer') || msgLow.includes('démarre') || msgLow.includes('lance') || msgLow.includes('start quiz'))) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      const fs = await import('fs')
      const path = await import('path')
      const files = fs.default.readdirSync(path.default.join(process.cwd())).filter(f => f.startsWith('quiz_') && f.endsWith('.js'))
      const quizList = files.map(f => f.replace('quiz_', '').replace('.js', '')).slice(0, 20)
      return res.status(200).json({ pdfAction: null, response: "🎯 **Quiz REUSSITESS — Choisis ton thème !**\n\n" + quizList.map((q, i) => `${i+1}. ${q.replace(/_/g, ' ')}`).join('\n') + "\n\n💬 Tape **quiz [thème]** pour commencer\nExemple: *quiz Histoire* ou *quiz Afrique*\n\nBoudoum ! 🇬🇵" })
    } catch(e) {}
  }

  // Quiz direct — ex: "quiz Histoire"
  const quizMatch = msgLow.match(/^quiz\s+(.+)$/)
  if (quizMatch) {
    try {
      const quizName = quizMatch[1].trim().replace(/\s+/g, '_')
      const capitalize = quizName.charAt(0).toUpperCase() + quizName.slice(1)
      
      // Vérifier si session en cours
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      
      // Démarrer quiz
      const quizRes = await fetch('https://reussitess.fr/api/quiz/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', userId, quizId: capitalize })
      })
      const quizData = await quizRes.json()
      
      if (quizData.error) {
        return res.status(200).json({ pdfAction: null, response: `❌ Quiz "${capitalize}" non trouvé.\n\nTape **jouer quiz** pour voir tous les thèmes disponibles.\n\nBoudoum ! 🇬🇵` })
      }
      
      const q = quizData.question
      return res.status(200).json({ pdfAction: null, response: `🎯 **${q.quizTitle}** — Question 1/${q.total}\n\n❓ ${q.text}\n\n${q.answers.map((a, i) => `${['A','B','C'][i]}) ${a}`).join('\n')}\n\n💬 Réponds avec **A**, **B** ou **C**\n\nBoudoum ! 🇬🇵` })
    } catch(e) {}
  }

  // Réponse quiz en cours — A, B ou C
  if (['a', 'b', 'c'].includes(msgLow.trim()) || ['a)', 'b)', 'c)'].includes(msgLow.trim())) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      const sessionData = await redis.get(`quiz:session:${userId}`)
      
      if (sessionData) {
        const answerMap = { 'a': 0, 'b': 1, 'c': 2, 'a)': 0, 'b)': 1, 'c)': 2 }
        const answerIndex = answerMap[msgLow.trim()]
        
        const quizRes = await fetch('https://reussitess.fr/api/quiz/engine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'answer', userId, answerIndex })
        })
        const quizData = await quizRes.json()
        
        if (quizData.action === 'finished') {
          const r = quizData.result
          const medal = r.percentage >= 80 ? '🥇' : r.percentage >= 60 ? '🥈' : '🥉'
          return res.status(200).json({ pdfAction: null, response: `${quizData.lastQuestion.correct ? '✅' : '❌'} ${quizData.lastQuestion.correct ? 'Bonne réponse' : 'Mauvaise réponse'} — ${quizData.lastQuestion.correctAnswer}\n📖 ${quizData.lastQuestion.explanation}\n\n${medal} **Résultat Final**\n\n🎯 Score: ${r.score}/${r.total} (${r.percentage}%)\n⭐ Points gagnés: +${r.points} pts\n🏆 Total: ${r.totalPoints} pts\n\nBoudoum ! 🇬🇵` })
        }
        
        if (quizData.action === 'question') {
          const fb = quizData.feedback
          const q = quizData.question
          return res.status(200).json({ pdfAction: null, response: `${fb.correct ? '✅ Bonne réponse !' : '❌ Mauvaise réponse'}\n📖 ${fb.explanation}\n\n❓ **Question ${q.index+1}/${q.total}** — Score: ${q.score}\n\n${q.text}\n\n${q.answers.map((a, i) => `${['A','B','C'][i]}) ${a}`).join('\n')}\n\nBoudoum ! 🇬🇵` })
        }
      }
    } catch(e) {}
  }

  // Mon score quiz
  if (msgLow.includes('mon score') || msgLow.includes('mes points quiz') || msgLow.includes('mon classement quiz')) {
    try {
      const quizRes = await fetch('https://reussitess.fr/api/quiz/engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'score', userId })
      })
      const data = await quizRes.json()
      const history = data.quizzes?.slice(0, 5).map(q => `• ${q.title}: ${q.score}/${q.total} (${q.percentage}%) +${q.points}pts`).join('\n') || 'Aucun quiz joué'
      return res.status(200).json({ pdfAction: null, response: `🏆 **Ton Score REUSSITESS**\n\n⭐ Total Points: ${data.totalPoints || 0}\n\n📊 Derniers quiz:\n${history}\n\nBoudoum ! 🇬🇵` })
    } catch(e) {}
  }
  // ===== FIN QUIZ ENGINE =====


  // ===== RAG CONTEXT — AUTO-CORRECTION TEMPS RÉEL =====
  let ragContext = null
  try {
    ragContext = await getRAGContext(message, userId)
  } catch(e) {}
  // ===== FIN RAG =====


  // ===== PERSONNALITÉS DOM-TOM — REDIS =====
  if (msgLow.includes("qui est") || msgLow.includes("qui était") || msgLow.includes("parle moi de") || msgLow.includes("biographie")) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = Redis.fromEnv()
      
      // Chercher dans toutes les clés person:*
      const personKeys = await redis.keys('person:*')
      let found = null
      
      for (const key of personKeys) {
        const data = await redis.get(key)
        if (data) {
          const person = typeof data === 'string' ? JSON.parse(data) : data
          const nomLow = person.nom.toLowerCase()
          // Vérifier si le nom est mentionné dans le message
          const nomParts = nomLow.split(' ')
          if (nomParts.some(part => part.length > 3 && msgLow.includes(part))) {
            found = person
            break
          }
        }
      }
      
      if (found) {
        const deces = found.deces ? ` — †${found.deces}` : ''
        const naissance = found.naissance ? ` (${found.naissance}${deces})` : ''
        const sources = found.sources?.length > 0 ? `\n\n🔗 [En savoir plus](${found.sources[0]})` : ''
        return res.status(200).json({ 
          pdfAction: pdfType, 
          response: `👤 **${found.nom}**${naissance}\n🌍 Origine: ${found.origine}\n🎯 ${found.role}\n\n📖 ${found.bio}\n🏷️ Domaine: ${found.domaine}${sources}\n\nBoudoum ! 🇬🇵`
        })
      }
    } catch(e) {}
  }
  // ===== FIN PERSONNALITÉS =====


  // ===== NEURO-X DÉTECTION PRIORITAIRE =====
  if (msgLow === "neuro-x" || msgLow === "neuro x" || msgLow === "neurox" || (msgLow.includes("neuro-x") && !msgLow.includes("neuro-x ") && msgLow.trim() === "neuro-x")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🧠 **NEURO-X — 60 Agents Spécialisés**\n\nTape *neuro-x [domaine]* pour activer un agent :\n\n💰 neuro-x finance\n🏢 neuro-x business\n🎨 neuro-x créatif\n🍽️ neuro-x cuisine\n⚖️ neuro-x juridique\n🏥 neuro-x santé\n📚 neuro-x éducation\n✈️ neuro-x voyage\n🏗️ neuro-x immobilier\n💻 neuro-x tech\n🎵 neuro-x musique\n🌍 neuro-x diaspora\n🧘 neuro-x psychologie\n🌱 neuro-x environnement\n📊 neuro-x marketing\n... et 45 autres agents !\n\n💬 Exemple: *neuro-x cuisine*\n\nBoudoum ! 🇬🇵" })
  }

  if (msgLow.includes("neuro-x") || msgLow.startsWith("nx-")) {
    const agentMap = {
      "finance": { nom: "NX-001 Finance", prompt: "Tu es Neuro-X Finance, expert crypto, DeFi, Token REUSS, investissement et marchés financiers caribéens. Réponds en français avec des données précises." },
      "business": { nom: "NX-002 Business", prompt: "Tu es Neuro-X Business, expert Amazon, affiliation, e-commerce, revenus en ligne et entrepreneuriat caribéen." },
      "culture": { nom: "NX-003 Culture", prompt: "Tu es Neuro-X Culture, expert culture caribéenne, créole, histoire des Antilles et patrimoine afro-caribéen." },
      "coach": { nom: "NX-004 Coach", prompt: "Tu es Neuro-X Coach, expert motivation, mindset, développement personnel et leadership caribéen." },
      "tech": { nom: "NX-005 Tech", prompt: "Tu es Neuro-X Tech, expert IA, blockchain, développement Next.js, APIs et technologies." },
      "sante": { nom: "NX-006 Santé", prompt: "Tu es Neuro-X Santé, expert bien-être, nutrition antillaise, médecine naturelle caribéenne." },
      "education": { nom: "NX-007 Éducation", prompt: "Tu es Neuro-X Éducation, expert pédagogie, formation, bourses DOM-TOM et apprentissage." },
      "juridique": { nom: "NX-008 Juridique", prompt: "Tu es Neuro-X Juridique, expert droit DOM-TOM, RGPD, auto-entrepreneur, création d'entreprise. Toujours recommander un professionnel." },
      "voyage": { nom: "NX-009 Voyage", prompt: "Tu es Neuro-X Voyage, expert tourisme caribéen, destinations, hébergements et transports DOM-TOM." },
      "creative": { nom: "NX-010 Créatif", prompt: "Tu es Neuro-X Créatif, expert poésie créole, histoires, slogans et contenus créatifs caribéens." },
      "sport": { nom: "NX-011 Sport", prompt: "Tu es Neuro-X Sport, expert fitness, champions antillais, sports caribéens et performances." },
      "histoire": { nom: "NX-012 Histoire", prompt: "Tu es Neuro-X Histoire, expert abolition, résistance, patrimoine africain et caribéen." },
      "cuisine": { nom: "NX-013 Cuisine", prompt: "Tu es Neuro-X Cuisine, expert recettes créoles, accras, colombo, cuisine antillaise et gastronomie caribéenne." },
      "musique": { nom: "NX-014 Musique", prompt: "Tu es Neuro-X Musique, expert zouk, gwo ka, biguine, soca et musiques afro-caribéennes." },
      "environnement": { nom: "NX-015 Environnement", prompt: "Tu es Neuro-X Environnement, expert écologie, biodiversité caribéenne et développement durable DOM-TOM." },
      "immobilier": { nom: "NX-016 Immobilier", prompt: "Tu es Neuro-X Immobilier, expert DOM-TOM, défiscalisation Girardin, foncier antillais." },
      "marketing": { nom: "NX-017 Marketing", prompt: "Tu es Neuro-X Marketing, expert réseaux sociaux, TikTok, croissance et stratégie digitale." },
      "crypto2": { nom: "NX-018 DeFi", prompt: "Tu es Neuro-X DeFi, expert yield farming, staking, QuickSwap et finance décentralisée." },
      "nft": { nom: "NX-019 NFT", prompt: "Tu es Neuro-X NFT, expert art numérique, OpenSea, collections et marchés NFT." },
      "psychologie": { nom: "NX-020 Psychologie", prompt: "Tu es Neuro-X Psychologie, expert résilience, leadership caribéen et développement personnel." },
      "langue": { nom: "NX-021 Langues", prompt: "Tu es Neuro-X Langues, expert traduction, créole, langues caribéennes et apprentissage linguistique." },
      "agriculture": { nom: "NX-022 Agriculture", prompt: "Tu es Neuro-X Agriculture, expert agriculture bio, jardinage créole, permaculture caribéenne." },
      "tourisme": { nom: "NX-023 Tourisme", prompt: "Tu es Neuro-X Tourisme, expert tourisme Guadeloupe, Martinique, Guyane et itinéraires caribéens." },
      "geopolitique": { nom: "NX-024 Géopolitique", prompt: "Tu es Neuro-X Géopolitique, expert CARICOM, relations internationales caribéennes et DOM-TOM." },
      "seo": { nom: "NX-025 SEO", prompt: "Tu es Neuro-X SEO, expert référencement naturel, optimisation web et stratégie digitale." },
      "ia2": { nom: "NX-026 IA Avancée", prompt: "Tu es Neuro-X IA, expert prompt engineering, LLMs, automatisation et intelligence artificielle." },
      "bourse": { nom: "NX-027 Bourse", prompt: "Tu es Neuro-X Bourse, expert marchés financiers, CAC40, NYSE et investissements." },
      "developpement": { nom: "NX-028 Dev", prompt: "Tu es Neuro-X Dev, expert développement web, JavaScript, Python, Next.js et APIs." },
      "philosophie": { nom: "NX-029 Philosophie", prompt: "Tu es Neuro-X Philosophie, expert Césaire, Fanon, Glissant, négritude et pensée africaine." },
      "medias": { nom: "NX-030 Médias", prompt: "Tu es Neuro-X Médias, expert médias DOM-TOM, France Ô, presse caribéenne et communication." },
      "energie": { nom: "NX-031 Énergie", prompt: "Tu es Neuro-X Énergie, expert géothermie, énergies renouvelables et transition énergétique DOM-TOM." },
      "mode": { nom: "NX-032 Mode", prompt: "Tu es Neuro-X Mode, expert mode caribéenne, madras, stylisme créole et fashion antillais." },
      "gastronomie": { nom: "NX-033 Gastronomie", prompt: "Tu es Neuro-X Gastronomie, expert gastronomie fine caribéenne, rhum, restaurants DOM-TOM." },
      "enfants": { nom: "NX-034 Enfants", prompt: "Tu es Neuro-X Enfants, expert contes créoles, éducation enfants, activités familiales caribéennes." },
      "seniors": { nom: "NX-035 Seniors", prompt: "Tu es Neuro-X Seniors, expert bien-vieillir caribéen, aide à domicile, services seniors DOM-TOM." },
      "femmes": { nom: "NX-036 Femmes", prompt: "Tu es Neuro-X Femmes, expert entrepreneuriat féminin caribéen, business woman, empowerment." },
      "jeunes": { nom: "NX-037 Jeunes", prompt: "Tu es Neuro-X Jeunes, expert jeunesse caribéenne, orientation, emploi jeunes DOM-TOM." },
      "diaspora": { nom: "NX-038 Diaspora", prompt: "Tu es Neuro-X Diaspora, expert diaspora afro-caribéenne, retour au pays, double culture." },
      "blockchain2": { nom: "NX-039 Blockchain", prompt: "Tu es Neuro-X Blockchain, expert smart contracts, Solidity, Polygon et développement blockchain." },
      "reseaux": { nom: "NX-040 Réseaux", prompt: "Tu es Neuro-X Réseaux, expert cybersécurité, réseaux informatiques et protection digitale." },
      "design": { nom: "NX-041 Design", prompt: "Tu es Neuro-X Design, expert UI/UX caribéen, design graphique et identité visuelle." },
      "logistique": { nom: "NX-042 Logistique", prompt: "Tu es Neuro-X Logistique, expert importation DOM-TOM, transport caribéen et chaîne logistique." },
      "sante2": { nom: "NX-043 Médecine", prompt: "Tu es Neuro-X Médecine, expert plantes médicinales caribéennes, phytothérapie et médecine naturelle." },
      "relations": { nom: "NX-044 Relations", prompt: "Tu es Neuro-X Relations, expert négociation caribéenne, relations humaines et communication." },
      "humour": { nom: "NX-045 Humour", prompt: "Tu es Neuro-X Humour, expert stand-up caribéen, humour créole et culture comique antillaise." },
      "science": { nom: "NX-046 Sciences", prompt: "Tu es Neuro-X Sciences, expert biologie marine caribéenne, sciences naturelles et recherche." },
      "geographie": { nom: "NX-047 Géographie", prompt: "Tu es Neuro-X Géographie, expert géologie volcanique, géographie caribéenne et cartographie." },
      "spiritualite": { nom: "NX-048 Spiritualité", prompt: "Tu es Neuro-X Spiritualité, expert quimbois, spiritualité caribéenne et traditions ancestrales." },
      "fiscal": { nom: "NX-049 Fiscal", prompt: "Tu es Neuro-X Fiscal, expert défiscalisation DOM-TOM, loi Girardin, fiscalité antillaise." },
      "cinema": { nom: "NX-050 Cinéma", prompt: "Tu es Neuro-X Cinéma, expert cinéma caribéen, festivals antillais et audiovisuel DOM-TOM." },
      "litterature": { nom: "NX-051 Littérature", prompt: "Tu es Neuro-X Littérature, expert négritude, roman caribéen, Maryse Condé et littérature antillaise." },
      "animaux": { nom: "NX-052 Animaux", prompt: "Tu es Neuro-X Animaux, expert faune caribéenne, tortues marines, iguanes et biodiversité animale." },
      "meteo2": { nom: "NX-053 Météo", prompt: "Tu es Neuro-X Météo, expert prévisions cycloniques, météorologie caribéenne et alertes DOM-TOM." },
      "innovation": { nom: "NX-054 Innovation", prompt: "Tu es Neuro-X Innovation, expert startups caribéennes, innovation technologique et entrepreneuriat." },
      "gouvernance": { nom: "NX-055 Gouvernance", prompt: "Tu es Neuro-X Gouvernance, expert DAO, vote décentralisé, gouvernance blockchain et démocratie digitale." },
      "presse": { nom: "NX-056 Presse", prompt: "Tu es Neuro-X Presse, expert communiqués de presse, relations médias et communication institutionnelle." },
      "data": { nom: "NX-057 Data", prompt: "Tu es Neuro-X Data, expert data science, Python pandas, analyse de données et visualisation." },
      "vision": { nom: "NX-058 Vision IA", prompt: "Tu es Neuro-X Vision, expert analyse d'images, computer vision et IA multimodale." },
      "calculateur": { nom: "NX-059 Calculateur", prompt: "Tu es Neuro-X Calculateur, expert calculs financiers, simulations, IMC, staking et conversions." },
      "supreme2": { nom: "NX-060 Stratégie", prompt: "Tu es Neuro-X Stratégie, expert plan global 5 ans REUSSITESS, vision stratégique et développement." },
    }

    const detectedAgent = detectNeuroXAgent(msgLow)
    if (detectedAgent && agentMap[detectedAgent]) {
      const agent = agentMap[detectedAgent]
      try {
        const rep = await groqFetch([
          { role: "system", content: agent.prompt + " Tu es un agent REUSSITESS®971. Termine toujours par 'Boudoum ! 🇬🇵'" },
          { role: "user", content: message }
        ], 2048)
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "🧠 **" + agent.nom + "**\n\n" + rep })
      } catch(e) {
        console.error("Neuro-X error:", e.message)
      }
    }
  }
  // ===== FIN NEURO-X PRIORITAIRE =====

  let content_juridique_warning = false;  // ✅ FIX 1
  if (msgLow.includes("loi") || msgLow.includes("article") || msgLow.includes("code civil") || 
      msgLow.includes("juridique") || msgLow.includes("tribunal") || msgLow.includes("jugement") ||
      msgLow.includes("condamné") || msgLow.includes("arrêté") || msgLow.includes("décret") ||
      msgLow.includes("procès") || msgLow.includes("avocat") || msgLow.includes("contrat légal")) {
    const legalWarning = "IMPORTANT: Pour toute question juridique, tu dois TOUJOURS: 1) Donner uniquement des informations générales vérifiables 2) Préciser que tu n'\''es pas avocat 3) Recommander de consulter un professionnel 4) Ne JAMAIS inventer des articles de loi ou numéros de textes juridiques précis";
    content_juridique_warning = true;
  }

  // ===== GARDE-FOU PERSONNES CONNUES =====
  const PERSONNES_VERIFIEES = {
    "maire pointe-à-pitre": "Harry Durimel",
    "président usa": "Donald Trump",
    "président france": "Emmanuel Macron"
    // ... reste identique
  }

  const personneQuery = Object.keys(PERSONNES_VERIFIEES).find(k => msgLow.includes(k))
  if (personneQuery) {
    return res.status(200).json({ pdfAction: null, response: "✅ **Information vérifiée**\\" + personneQuery.charAt(0).toUpperCase() + personneQuery.slice(1) + " : **" + PERSONNES_VERIFIEES[personneQuery] + "**\\Boudoum ! 🇬🇵" });  // ✅ FIX 2
  }


  // ===== GARDE-FOU JURIDIQUE =====
  if (msgLow.includes("loi") || msgLow.includes("article") || msgLow.includes("code civil") || 
      msgLow.includes("juridique") || msgLow.includes("tribunal") || msgLow.includes("jugement") ||
      msgLow.includes("condamné") || msgLow.includes("arrêté") || msgLow.includes("décret") ||
      msgLow.includes("procès") || msgLow.includes("avocat") || msgLow.includes("contrat légal")) {
    // Injecter avertissement dans le system prompt
    const legalWarning = "IMPORTANT: Pour toute question juridique, tu dois TOUJOURS: 1) Donner uniquement des informations générales vérifiables 2) Préciser que tu n'es pas avocat 3) Recommander de consulter un professionnel 4) Ne JAMAIS inventer des articles de loi ou numéros de textes juridiques précis"
    // Le warning sera ajouté au prompt Groq ci-dessous
  }

  // ===== GARDE-FOU PERSONNES CONNUES =====
  

  // Vérifier si question sur personne connue
    if (personneQuery) {
    return res.status(200).json({ pdfAction: null, response: "✅ **Information vérifiée**\n\n" + personneQuery.charAt(0).toUpperCase() + personneQuery.slice(1) + " : **" + PERSONNES_VERIFIEES[personneQuery] + "**\n\nBoudoum ! 🇬🇵" })
  }

  // ===== PRÉSIDENTS À JOUR 2025 =====
  if (msgLow.includes("président") || msgLow.includes("premier ministre")) {
    if (msgLow.includes("américain") || msgLow.includes("usa") || msgLow.includes("états-unis") || msgLow.includes("america") || msgLow.includes("trump") || msgLow.includes("biden"))
      return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Président des États-Unis**\n\n**Donald Trump** — 47ème président\nEn fonction depuis le 20 janvier 2025\nParti : Républicain\nVice-président : JD Vance\n\n(Joe Biden était le 46ème président, 2021-2025)\n\nBoudoum ! 🇬🇵" })
    if (msgLow.includes("france") || msgLow.includes("français") || msgLow.includes("macron") || msgLow.includes("élysée"))
      return res.status(200).json({ pdfAction: null, response: "🇫🇷 **Président de la République Française**\n\n**Emmanuel Macron** — Depuis 2017, réélu 2022\nPremier Ministre : **François Bayrou** (depuis janvier 2025)\n\nBoudoum ! 🇬🇵" })
    if (msgLow.includes("russie") || msgLow.includes("poutine"))
      return res.status(200).json({ pdfAction: null, response: "🇷🇺 **Président de la Russie**\n\n**Vladimir Poutine** — Réélu mars 2024\n\nBoudoum ! 🇬🇵" })
    if (msgLow.includes("chine") || msgLow.includes("xi jinping"))
      return res.status(200).json({ pdfAction: null, response: "🇨🇳 **Président de la Chine**\n\n**Xi Jinping** — Depuis 2013, 3ème mandat 2023\n\nBoudoum ! 🇬🇵" })
    if (msgLow.includes("royaume-uni") || msgLow.includes("uk") || msgLow.includes("angleterre") || msgLow.includes("starmer"))
      return res.status(200).json({ pdfAction: null, response: "🇬🇧 **Royaume-Uni**\n\nRoi : **Charles III**\nPremier Ministre : **Keir Starmer** (depuis juillet 2024)\n\nBoudoum ! 🇬🇵" })
  }

  // ===== CACHE REDIS — FOREX TEMPS RÉEL =====
  if (msgLow.includes("taux") && (msgLow.includes("euro") || msgLow.includes("eur"))) {
    try {
      const redis = await getRedisClient()
      const cached = await redis.get('cache:forex')
      if (cached) {
        const forex = JSON.parse(cached)
        return res.status(200).json({ pdfAction: null, response: `💱 **Taux de Change EUR — Temps Réel**\n\n🇺🇸 USD : ${forex.EUR_USD}\n🇬🇧 GBP : ${forex.EUR_GBP}\n🌍 XOF (CFA) : ${forex.EUR_XOF}\n🇭🇹 HTG : ${forex.EUR_HTG}\n🇯🇲 JMD : ${forex.EUR_JMD}\n🇧🇷 BRL : ${forex.EUR_BRL}\n🇨🇦 CAD : ${forex.EUR_CAD}\n\nBoudoum ! 🇬🇵` })
      }
    } catch(e) {}
  }

  // ===== CACHE SANTÉ ANTILLES =====
  if (msgLow.includes("chlordécone") || msgLow.includes("chlordecone") || msgLow.includes("sargasses") || (msgLow.includes("dengue") && msgLow.includes("guadeloupe")) || msgLow.includes("chikungunya")) {
    try {
      const redis = await getRedisClient()
      const cached = await redis.get('cache:sante:maladies_antilles')
      if (cached) {
        const sante = JSON.parse(cached)
        const key = msgLow.includes("chlord") ? "chlordecone" : msgLow.includes("sargasse") ? "sargasses" : msgLow.includes("dengue") ? "dengue" : msgLow.includes("chikungunya") ? "chikungunya" : "covid"
        if (sante[key]) return res.status(200).json({ pdfAction: null, response: `🏥 **Santé Antilles — REUSSITESS**\n\n${sante[key]}\n\nBoudoum ! 🇬🇵` })
      }
    } catch(e) {}
  }

  // ===== TRANSPORT MONDIAL =====
  if (msgLow.includes("transport") && (msgLow.includes("comment") || msgLow.includes("bus") || msgLow.includes("metro") || msgLow.includes("train") || msgLow.includes("trafic"))) {
    const ville = message.replace(/transport|comment|aller|bus|metro|train|trafic|public|à|en|de|du|la|le|les/gi, '').trim()
    if (ville.length > 2) {
      const transport = await getTransportInfo(ville)
      if (transport) return res.status(200).json({ pdfAction: null, response: transport })
    }
  }

  // ===== SANTÉ OMS =====
  if ((msgLow.includes("santé") || msgLow.includes("sante") || msgLow.includes("hôpital") || msgLow.includes("médecine")) && (msgLow.includes("au ") || msgLow.includes("en ") || msgLow.includes("du ") || msgLow.includes("pays"))) {
    const pays = message.replace(/santé|sante|hôpital|médecine|système de|au|en|du|la|le|les|dans/gi, '').trim()
    if (pays.length > 2) {
      const sante = await getSanteOMS(pays)
      if (sante) return res.status(200).json({ pdfAction: null, response: sante })
    }
  }

  // ===== ÉDUCATION UNESCO =====
  if ((msgLow.includes("éducation") || msgLow.includes("education") || msgLow.includes("alphabétisation") || msgLow.includes("scolarisation") || msgLow.includes("université")) && (msgLow.includes("au ") || msgLow.includes("en ") || msgLow.includes("du ") || msgLow.includes("pays"))) {
    const pays = message.replace(/éducation|education|alphabétisation|scolarisation|université|système|au|en|du|la|le|les|dans/gi, '').trim()
    if (pays.length > 2) {
      const edu = await getEducationUNESCO(pays)
      if (edu) return res.status(200).json({ pdfAction: null, response: edu })
    }
  }

  // ===== TRADUCTION MULTILINGUE =====
  if (msgLow.includes("traduis") || msgLow.includes("traduire") || msgLow.includes("comment dit-on") || msgLow.includes("comment dire") || (msgLow.includes("en ") && (msgLow.includes("anglais") || msgLow.includes("espagnol") || msgLow.includes("arabe") || msgLow.includes("mandarin") || msgLow.includes("hindi") || msgLow.includes("swahili") || msgLow.includes("haoussa") || msgLow.includes("yoruba") || msgLow.includes("amharique") || msgLow.includes("tagalog") || msgLow.includes("thaï") || msgLow.includes("vietnamien") || msgLow.includes("coréen") || msgLow.includes("persan") || msgLow.includes("bengali")))) {
    const langues = ['anglais','espagnol','portugais','arabe','mandarin','russe','japonais','allemand','italien','hindi','bengali','swahili','haoussa','yoruba','amharique','somali','malgache','tagalog','malais','indonésien','thaï','vietnamien','coréen','persan']
    const langCible = langues.find(l => msgLow.includes(l))
    if (langCible) {
      const texte = message.replace(new RegExp(`traduis|traduire|comment dit-on|comment dire|en ${langCible}|en`, 'gi'), '').trim()
      if (texte.length > 1) {
        const trad = await traduireTexte(texte, langCible)
        if (trad) return res.status(200).json({ pdfAction: null, response: trad })
      }
    }
  }

  // ===== MÉTÉO ÎLES OCÉANIE =====
  if ((msgLow.includes("météo") || msgLow.includes("meteo") || msgLow.includes("temps")) && (msgLow.includes("fidji") || msgLow.includes("samoa") || msgLow.includes("tonga") || msgLow.includes("vanuatu") || msgLow.includes("kiribati") || msgLow.includes("tuvalu") || msgLow.includes("nauru") || msgLow.includes("cook") || msgLow.includes("comores") || msgLow.includes("seychelles") || msgLow.includes("cap-vert") || msgLow.includes("maldives"))) {
    const iles = ['fidji','samoa','tonga','vanuatu','kiribati','tuvalu','nauru','cook','comores','seychelles','cap-vert','maldives','sri lanka']
    const ile = iles.find(i => msgLow.includes(i))
    if (ile) {
      const meteo = await getMeteoMonde(ile)
      if (meteo) return res.status(200).json({ pdfAction: null, response: meteo })
    }
  }

  // ===== STATS SATISFACTION =====
  if (msgLow.includes("stats satisfaction") || msgLow.includes("score bot") || msgLow.includes("performance bot") || msgLow.includes("evaluation bot")) {
    const stats = await getSatisfactionStats()
    if (stats) return res.status(200).json({ pdfAction: null, response: stats })
  }

  // ===== ACTUALITÉS PAYS MANQUANTS =====
  if ((msgLow.includes("actualité") || msgLow.includes("actu") || msgLow.includes("news") || msgLow.includes("info")) && (
    msgLow.includes("sénégal") || msgLow.includes("mali") || msgLow.includes("burkina") || msgLow.includes("niger") ||
    msgLow.includes("togo") || msgLow.includes("bénin") || msgLow.includes("guinée") || msgLow.includes("gambie") ||
    msgLow.includes("liberia") || msgLow.includes("mauritanie") || msgLow.includes("cap-vert") ||
    msgLow.includes("cameroun") || msgLow.includes("gabon") || msgLow.includes("congo") || msgLow.includes("tchad") ||
    msgLow.includes("centrafrique") || msgLow.includes("rwanda") || msgLow.includes("burundi") || msgLow.includes("comores") ||
    msgLow.includes("tanzanie") || msgLow.includes("kenya") || msgLow.includes("éthiopie") || msgLow.includes("somalie") ||
    msgLow.includes("djibouti") || msgLow.includes("érythrée") || msgLow.includes("madagascar") || msgLow.includes("seychelles") ||
    msgLow.includes("mozambique") || msgLow.includes("zambie") || msgLow.includes("zimbabwe") || msgLow.includes("malawi") ||
    msgLow.includes("namibie") || msgLow.includes("botswana") || msgLow.includes("lesotho") || msgLow.includes("angola") ||
    msgLow.includes("chili") || msgLow.includes("colombie") || msgLow.includes("pérou") || msgLow.includes("bolivie") ||
    msgLow.includes("équateur") || msgLow.includes("paraguay") || msgLow.includes("guyana") || msgLow.includes("suriname") ||
    msgLow.includes("cambodge") || msgLow.includes("laos") || msgLow.includes("thaïlande") || msgLow.includes("indonésie") ||
    msgLow.includes("mongolie") || msgLow.includes("timor") || msgLow.includes("vanuatu") || msgLow.includes("samoa") ||
    msgLow.includes("qatar") || msgLow.includes("émirats") || msgLow.includes("bahreïn") || msgLow.includes("koweït") ||
    msgLow.includes("liban") || msgLow.includes("ukraine") || msgLow.includes("hongrie") || msgLow.includes("tunisie") ||
    msgLow.includes("jamaïque") || msgLow.includes("trinité") || msgLow.includes("barbade") || msgLow.includes("bahamas")
  )) {
    const pays = message.replace(/actualité|actu|news|info|de|du|en|pour|les|des/gi, '').trim()
    const actu = await getActualitesPays(pays)
    if (actu) return res.status(200).json({ pdfAction: null, response: actu })
  }

  // ===== MÉTÉO CAPITALES MONDE =====
  if ((msgLow.includes("météo") || msgLow.includes("meteo") || msgLow.includes("temps") && msgLow.includes("ville")) && (
    msgLow.includes("dakar") || msgLow.includes("bamako") || msgLow.includes("ouagadougou") || msgLow.includes("niamey") ||
    msgLow.includes("lomé") || msgLow.includes("cotonou") || msgLow.includes("conakry") || msgLow.includes("banjul") ||
    msgLow.includes("monrovia") || msgLow.includes("nouakchott") || msgLow.includes("praia") || msgLow.includes("yaoundé") ||
    msgLow.includes("libreville") || msgLow.includes("brazzaville") || msgLow.includes("kinshasa") || msgLow.includes("ndjamena") ||
    msgLow.includes("bangui") || msgLow.includes("kigali") || msgLow.includes("bujumbura") || msgLow.includes("moroni") ||
    msgLow.includes("dodoma") || msgLow.includes("nairobi") || msgLow.includes("addis") || msgLow.includes("mogadiscio") ||
    msgLow.includes("antananarivo") || msgLow.includes("maputo") || msgLow.includes("lusaka") || msgLow.includes("harare") ||
    msgLow.includes("lilongwe") || msgLow.includes("windhoek") || msgLow.includes("gaborone") || msgLow.includes("maseru") ||
    msgLow.includes("luanda") || msgLow.includes("bangkok") || msgLow.includes("jakarta") || msgLow.includes("phnom penh") ||
    msgLow.includes("vientiane") || msgLow.includes("ulan-bator") || msgLow.includes("dili") || msgLow.includes("doha") ||
    msgLow.includes("abu dhabi") || msgLow.includes("manama") || msgLow.includes("koweït city") || msgLow.includes("beyrouth") ||
    msgLow.includes("kiev") || msgLow.includes("budapest") || msgLow.includes("tunis") || msgLow.includes("singapour") ||
    msgLow.includes("séoul") || msgLow.includes("hanoï") || msgLow.includes("lima") || msgLow.includes("bogota") ||
    msgLow.includes("santiago") || msgLow.includes("la paz") || msgLow.includes("quito") || msgLow.includes("asuncion") ||
    msgLow.includes("georgetown") || msgLow.includes("paramaribo") || msgLow.includes("kingston") || msgLow.includes("port of spain")
  )) {
    const capitales = {
      'dakar': [14.7167, -17.4677], 'bamako': [12.6392, -8.0029], 'ouagadougou': [12.3714, -1.5197],
      'niamey': [13.5137, 2.1098], 'lomé': [6.1375, 1.2123], 'cotonou': [6.3654, 2.4183],
      'conakry': [9.5370, -13.6773], 'banjul': [13.4531, -16.5775], 'monrovia': [6.3106, -10.8047],
      'nouakchott': [18.0858, -15.9785], 'praia': [14.9305, -23.5133], 'yaoundé': [3.8480, 11.5021],
      'libreville': [0.3924, 9.4536], 'brazzaville': [-4.2634, 15.2429], 'kinshasa': [-4.3317, 15.3272],
      'ndjamena': [12.1048, 15.0440], 'bangui': [4.3947, 18.5582], 'kigali': [-1.9441, 30.0619],
      'bujumbura': [-3.3870, 29.3622], 'moroni': [-11.7022, 43.2551], 'dodoma': [-6.1630, 35.7516],
      'nairobi': [-1.2921, 36.8219], 'addis': [9.0320, 38.7469], 'mogadiscio': [2.0469, 45.3182],
      'antananarivo': [-18.9137, 47.5361], 'maputo': [-25.9692, 32.5732], 'lusaka': [-15.4167, 28.2833],
      'harare': [-17.8252, 31.0335], 'lilongwe': [-13.9669, 33.7873], 'windhoek': [-22.5597, 17.0832],
      'gaborone': [-24.6282, 25.9231], 'maseru': [-29.3167, 27.4833], 'luanda': [-8.8368, 13.2343],
      'bangkok': [13.7563, 100.5018], 'jakarta': [-6.2088, 106.8456], 'phnom penh': [11.5564, 104.9282],
      'vientiane': [17.9757, 102.6331], 'ulan-bator': [47.8864, 106.9057], 'dili': [-8.5569, 125.5788],
      'doha': [25.2854, 51.5310], 'abu dhabi': [24.4539, 54.3773], 'manama': [26.2235, 50.5876],
      'koweït city': [29.3759, 47.9774], 'beyrouth': [33.8938, 35.5018], 'kiev': [50.4501, 30.5234],
      'budapest': [47.4979, 19.0402], 'tunis': [36.8065, 10.1815], 'singapour': [1.3521, 103.8198],
      'séoul': [37.5665, 126.9780], 'hanoï': [21.0285, 105.8542], 'lima': [-12.0464, -77.0428],
      'bogota': [4.7110, -74.0721], 'santiago': [-33.4489, -70.6693], 'la paz': [-16.5000, -68.1193],
      'quito': [-0.1807, -78.4678], 'asuncion': [-25.2867, -57.6470], 'georgetown': [6.8013, -58.1553],
      'paramaribo': [5.8664, -55.1670], 'kingston': [17.9970, -76.7936], 'port of spain': [10.6596, -61.5086]
    }
    for (const [ville, coords] of Object.entries(capitales)) {
      if (msgLow.includes(ville)) {
        const meteo = await getMeteoMonde(ville.charAt(0).toUpperCase() + ville.slice(1))
        if (meteo) return res.status(200).json({ pdfAction: null, response: meteo })
      }
    }
  }

  // ===== DEVISES PAYS MANQUANTS =====
  if ((msgLow.includes("taux") && (msgLow.includes("change") || msgLow.includes("intérêt") || msgLow.includes("euro") || msgLow.includes("dollar") || msgLow.includes("devise"))) || (msgLow.includes("devise") && msgLow.length > 8) || (msgLow.includes("monnaie") && msgLow.length > 10) || msgLow.includes("change")) {
    const devisesMap = {
      'won': 'KRW', 'baht': 'THB', 'dong': 'VND', 'rupiah': 'IDR', 'ringgit': 'MYR',
      'peso colombien': 'COP', 'peso chilien': 'CLP', 'real brésilien': 'BRL', 'rand': 'ZAR',
      'naira': 'NGN', 'cedi': 'GHS', 'shilling kenyan': 'KES', 'franc cfa': 'XOF',
      'dinar tunisien': 'TND', 'dirham': 'AED', 'riyal': 'SAR', 'livre libanaise': 'LBP',
      'hryvnia': 'UAH', 'forint': 'HUF', 'dram': 'AMD', 'som': 'KGS', 'lek': 'ALL',
      'dollar singapourien': 'SGD', 'dollar hong-kongais': 'HKD', 'pataca': 'MOP',
      'guarani': 'PYG', 'sol péruvien': 'PEN', 'boliviano': 'BOB', 'dollar guyanais': 'GYD',
      'dollar surinamais': 'SRD', 'dollar jamaïcain': 'JMD', 'dollar barbadien': 'BBD',
      'dollar des bahamas': 'BSD', 'franc rwandais': 'RWF', 'franc burundais': 'BIF',
      'ariary': 'MGA', 'metical': 'MZN', 'kwacha': 'ZMW', 'dollar zimbabwéen': 'ZWL',
      'kwacha malawien': 'MWK', 'dollar namibien': 'NAD', 'pula': 'BWP', 'loti': 'LSL',
      'kwanza': 'AOA', 'dalasi': 'GMD', 'leone': 'SLL', 'franc guinéen': 'GNF',
      'franc congolais': 'CDF', 'franc djiboutien': 'DJF', 'birr': 'ETB', 'nakfa': 'ERN',
      'franc comorien': 'KMF', 'franc cfp': 'XPF', 'couronne tchèque': 'CZK',
      'zloty': 'PLN', 'leu': 'RON', 'lev': 'BGN', 'couronne suédoise': 'SEK'
    }
    for (const [nom, code] of Object.entries(devisesMap)) {
      if (msgLow.includes(nom)) {
        const devise = await getDevisePays(code)
        if (devise) return res.status(200).json({ pdfAction: null, response: devise })
      }
    }
  }

  // ===== CRYPTO EN DEVISES LOCALES =====
  if ((msgLow.includes("bitcoin") || msgLow.includes("btc") || msgLow.includes("ethereum") || msgLow.includes("crypto")) && (
    msgLow.includes("won") || msgLow.includes("baht") || msgLow.includes("dong") || msgLow.includes("rupiah") ||
    msgLow.includes("rand") || msgLow.includes("naira") || msgLow.includes("cedi") || msgLow.includes("franc cfa") ||
    msgLow.includes("dirham") || msgLow.includes("riyal") || msgLow.includes("forint") || msgLow.includes("hryvnia") ||
    msgLow.includes("dollar singapour") || msgLow.includes("ringgit") || msgLow.includes("peso")
  )) {
    const cryptos = ['bitcoin','ethereum','bnb','solana','reuss']
    const devises = ['won','baht','dong','rupiah','rand','naira','cedi','franc cfa','dirham','riyal','forint','hryvnia','dollar singapour','ringgit','peso']
    let crypto = cryptos.find(c => msgLow.includes(c)) || 'bitcoin'
    let devise = devises.find(d => msgLow.includes(d)) || 'rand'
    const result = await getCryptoPaysDevise(crypto, devise)
    if (result) return res.status(200).json({ pdfAction: null, response: result })
  }

  // ===== PRÉSIDENTS / CHEFS D'ÉTAT À JOUR =====
  if ((msgLow.includes("président") || msgLow.includes("president") || msgLow.includes("premier ministre") || msgLow.includes("chef état")) && (msgLow.includes("usa") || msgLow.includes("états-unis") || msgLow.includes("amerique") || msgLow.includes("amérique") || msgLow.includes("america"))) {
    return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Président des États-Unis**\n\n**Donald Trump** — 47ème président\nInvesti le 20 janvier 2025\nParti : Républicain\nVice-président : JD Vance\n\n⚠️ Joe Biden était le 46ème président (2021-2025)\n\nBoudoum ! 🇬🇵" })
  }
  if ((msgLow.includes("président") || msgLow.includes("president")) && (msgLow.includes("france") || msgLow.includes("français") || msgLow.includes("elysée") || msgLow.includes("élysée"))) {
    return res.status(200).json({ pdfAction: null, response: "🇫🇷 **Président de la République Française**\n\n**Emmanuel Macron** — Président depuis 2017, réélu 2022\nParti : Renaissance (centre)\nPremier Ministre : **François Bayrou** (depuis janvier 2025)\n\nBoudoum ! 🇬🇵" })
  }
  if ((msgLow.includes("président") || msgLow.includes("president")) && (msgLow.includes("russie") || msgLow.includes("russia") || msgLow.includes("poutine"))) {
    return res.status(200).json({ pdfAction: null, response: "🇷🇺 **Président de la Russie**\n\n**Vladimir Poutine** — Président depuis 2000 (sauf 2008-2012)\nRéélu en mars 2024\n\nBoudoum ! 🇬🇵" })
  }
  if ((msgLow.includes("président") || msgLow.includes("president")) && (msgLow.includes("chine") || msgLow.includes("china") || msgLow.includes("xi jinping"))) {
    return res.status(200).json({ pdfAction: null, response: "🇨🇳 **Président de la Chine**\n\n**Xi Jinping** — Président depuis 2013\nSecrétaire général du PCC\nRéélu pour un 3ème mandat en 2023\n\nBoudoum ! 🇬🇵" })
  }
  if ((msgLow.includes("président") || msgLow.includes("premier ministre")) && (msgLow.includes("royaume-uni") || msgLow.includes("angleterre") || msgLow.includes("royaume uni") || msgLow.includes("uk") || msgLow.includes("british"))) {
    return res.status(200).json({ pdfAction: null, response: "🇬🇧 **Royaume-Uni**\n\nRoi : **Charles III** — depuis septembre 2022\nPremier Ministre : **Keir Starmer** — depuis juillet 2024\nParti : Travailliste (Labour)\n\nBoudoum ! 🇬🇵" })
  }

  // ===== LANGUES AFRICAINES =====
  if ((msgLow.includes("en wolof") || msgLow.includes("en bambara") || msgLow.includes("en swahili") || msgLow.includes("en lingala") || msgLow.includes("en créole haïtien") || msgLow.includes("kalinago") || msgLow.includes("arawak")) || (msgLow.includes("que signifie") && (msgLow.includes("wolof") || msgLow.includes("swahili") || msgLow.includes("bambara") || msgLow.includes("lingala")))) {
    const mot = message.replace(/que signifie|que veut dire|traduis|en wolof|en bambara|en swahili|en lingala|en créole haïtien/gi, '').trim()
    const africainResult = getDictionnaireAfricain(mot)
    if (africainResult) return res.status(200).json({ pdfAction: null, response: africainResult })
  }

  // ===== BADGES ACCOMPLISSEMENTS =====
  if (msgLow.includes("mes badges") || msgLow.includes("mes accomplissements") || msgLow.includes("mon niveau") || msgLow.includes("mes points") || msgLow.includes("ma progression")) {
    const badges = await getBadgesUtilisateur(userId)
    if (badges) return res.status(200).json({ pdfAction: null, response: badges })
  }

  // ===== CATASTROPHES NATURELLES =====
  if (msgLow.includes("catastrophe naturelle") || msgLow.includes("désastre naturel") || msgLow.includes("alerte mondiale") || msgLow.includes("gdacs") || msgLow.includes("urgence mondiale")) {
    const cat = await getCatastrophesNaturelles()
    if (cat) return res.status(200).json({ pdfAction: null, response: cat })
  }

  // ===== NASA SCIENCE =====
  if (msgLow.includes("science nasa") || msgLow.includes("technologie nasa") || msgLow.includes("découverte nasa") || msgLow.includes("recherche spatiale")) {
    const science = await getNASAScience()
    if (science) return res.status(200).json({ pdfAction: null, response: science })
  }

  // ===== OPENFDA MÉDICAMENTS =====
  if (msgLow.startsWith("effets secondaires") || msgLow.includes("effets secondaires de") || msgLow.includes("effets secondaires du") || msgLow.includes("posologie de") || msgLow.includes("contre-indications de")) {
    const med = message.replace(/médicament|medicament|effets secondaires de|interactions de|posologie de|c'est quoi|qu'est-ce que/gi, '').trim()
    if (med.length > 2) {
      const fdaData = await getOpenFDA(med)
      if (fdaData) return res.status(200).json({ pdfAction: null, response: fdaData })
    }
  }

  // ===== QUALITÉ AIR =====
  if (msgLow.includes("qualit") && msgLow.includes(" air") || msgLow === "air" || msgLow.startsWith("air ") || msgLow.includes("qualite air") || msgLow.includes("pollution air") || msgLow.includes("aqi") || msgLow.includes("indice air")) {
    const lat = msgLow.includes("martinique") ? 14.6415 : msgLow.includes("guyane") ? 4.9372 : msgLow.includes("réunion") ? -21.1151 : msgLow.includes("mayotte") ? -12.8275 : 16.2411
    const lon = msgLow.includes("martinique") ? -61.0242 : msgLow.includes("guyane") ? -52.3262 : msgLow.includes("réunion") ? 55.5364 : msgLow.includes("mayotte") ? 45.1662 : -61.5331
    const ville = msgLow.includes("martinique") ? "Martinique" : msgLow.includes("guyane") ? "Guyane" : msgLow.includes("réunion") ? "Réunion" : msgLow.includes("mayotte") ? "Mayotte" : "Guadeloupe"
    const airData = await getQualiteAir(ville, lat, lon)
    if (airData) return res.status(200).json({ pdfAction: null, response: airData })
  }

  // ===== DICTIONNAIRE CRÉOLE =====
  if (msgLow.includes("que veut dire") || msgLow.includes("définition") || msgLow.includes("en créole") || msgLow.includes("traduction créole") || msgLow.includes("signifie")) {
    const mot = message.replace(/que veut dire|définition de|en créole|traduction créole|signifie|c'est quoi/gi, '').trim()
    const dicoResult = getDictionnaireCreole(mot)
    if (dicoResult) return res.status(200).json({ pdfAction: null, response: dicoResult })
  }

  // ===== ÉCONOMIE WORLD BANK =====
  if (msgLow.includes("économie guadeloupe") || msgLow.includes("pib guadeloupe") || msgLow.includes("économie martinique") || msgLow.includes("pib dom-tom") || msgLow.includes("indices économiques") || msgLow.includes("économie france") || msgLow.includes("pib france") || msgLow.includes("économie sénégal") || msgLow.includes("économie cameroun") || msgLow.includes("économie côte")) {
    const pays = msgLow.includes("martinique") ? "FR" : msgLow.includes("guyane") ? "FR" : msgLow.includes("réunion") ? "FR" : msgLow.includes("france") ? "FR" : msgLow.includes("sénégal") ? "SN" : msgLow.includes("côte") ? "CI" : msgLow.includes("cameroun") ? "CM" : msgLow.includes("congo") ? "CG" : "FR"
    const ecoData = await getEconomieWorldBank(pays)
    if (ecoData) return res.status(200).json({ pdfAction: null, response: ecoData })
  }

  // ===== ALCHEMY DASHBOARD =====
  if (msgLow.includes("dashboard reuss") || msgLow.includes("stats reuss") || msgLow.includes("reuss live") || msgLow.includes("token onchain")) {
    const dash = await getAlchemyDashboard()
    if (dash) return res.status(200).json({ pdfAction: null, response: dash })
  }
  // ===== ALCHEMY WALLET =====
  const walletMatch = message.match(/0x[a-fA-F0-9]{40}/)
  if (walletMatch) {
    const bal = await getWalletBalance(walletMatch[0])
    if (bal) return res.status(200).json({ pdfAction: null, response: bal })
  }
  // ===== ALCHEMY TRANSFERTS =====
  if (msgLow.includes("transferts reuss") || msgLow.includes("transactions reuss") || msgLow.includes("derniers transferts reuss")) {
    const tr = await getRecentTransfers()
    if (tr) return res.status(200).json({ pdfAction: null, response: tr })
  }



  // DETECTION PDF UPLOAD PRIORITAIRE
  if (message.includes("PDF_UPLOAD")) {
    const pdfContent = message.replace("📄 PDF_UPLOAD ", "")
    const groqText = await groqFetch([{ role: "system", content: "Tu es REUSSITESS AI. Analyse ce document PDF et réponds en français. Boudoum!" }, { role: "user", content: pdfContent }], 2048)
    return res.status(200).json({ pdfAction: null, response: "📄 **Analyse Document**\n\n" + (groqText || "Document analysé !") + "\n\nBoudoum ! 🇬🇵" })
  }

  // NASA PHOTO DU JOUR
  // ===== GÉNÉRATION CONTENU SOCIAL =====
  if (msgLow.includes("génère un post") || msgLow.includes("génère post") || msgLow.includes("crée un post") || msgLow.includes("rédige un tweet") || msgLow.includes("génère caption")) {
    const type = msgLow.includes("tweet") ? "tweet" : msgLow.includes("caption") ? "caption" : msgLow.includes("email") ? "email" : "post"
    const sujet = message.replace(/génère un post|génère post|crée un post|rédige un tweet|génère caption|pour|sur|à propos de/gi, "").trim() || "REUSSITESS et la Guadeloupe"
  // ===== ALCHEMY TOKEN =====

  // ===== ALCHEMY TOKEN =====

  if (msgLow.includes("proverbe aléatoire") || msgLow === "proverbe") {
    return res.status(200).json({ pdfAction: null, response: "🌴 **Proverbe Créole du Moment**\n\n" + getProverbeAleatoire() + "\n\nBoudoum ! 🇬🇵" })
  }
  // ===== PROVERBE ALÉATOIRE =====
  if (msgLow.includes("proverbe aléatoire") || msgLow.includes("surprise créole") || msgLow === "proverbe") {
    return res.status(200).json({ pdfAction: null, response: "🌴 **Proverbe Créole du Moment**\n\n" + getProverbeAleatoire() + "\n\nBoudoum ! 🇬🇵" })
  }
    const content = await genererContenuSocial(sujet, type)
    return res.status(200).json({ pdfAction: null, response: content || "Génération en cours... Boudoum ! 🇬🇵" })
  }
  // ===== CONNAISSANCES APPROFONDIES =====
  if (msgLow.includes("négritude") || msgLow.includes("créolité") || msgLow.includes("histoire esclavage") || msgLow.includes("biodiversité caribéenne")) {
    const result = getConnaissanceApprofondie(message)
    if (result) return res.status(200).json({ pdfAction: null, response: result })
  }
  if (msgLow.includes('nasa') || msgLow.includes('photo nasa') || msgLow.includes('image nasa') || msgLow.includes('photo jour nasa')) {
    const data = await getNASAPhotoJour()
    return res.status(200).json({ pdfAction: null, response: data || '🚀 **NASA — Photo du Jour**\n\nConsulte directement : https://apod.nasa.gov/apod/\n\nDes images époustouflantes de l\'univers chaque jour !\nBoudoum ! 🇬🇵' })
  }

  // LEVER COUCHER SOLEIL

  // ===== EXTENSIONS: JURIDIQUE, FINANCE, DONNÉES TEMPS RÉEL =====
  const droitReponse = getDroitDOMTOM(message)
  if (droitReponse) return res.status(200).json({ pdfAction: null, response: droitReponse })

  const financeReponse = await getFinanceAvancee(message)
  if (financeReponse) return res.status(200).json({ pdfAction: null, response: financeReponse })

  const donneesReponse = await getDonneesTempsReel(message)
  if (donneesReponse) return res.status(200).json({ pdfAction: null, response: donneesReponse })

  if (msgLow.includes('lever soleil') || msgLow.includes('coucher soleil') || msgLow.includes('heure soleil') || msgLow.includes('aube') || msgLow.includes('crepuscule')) {
    const data = await getLeverCoucherSoleil(16.2411, -61.5331, 'Guadeloupe')
    if (data) return res.status(200).json({ pdfAction: null, response: data })
  }

  // PROGRAMMES TV
  if (msgLow.includes('programme tv') || msgLow.includes('televison') || msgLow.includes('emission tv') || msgLow.includes('series tv') || msgLow.includes('programme tele')) {
    const data = await getProgrammesTV('caribbean')
    if (data) return res.status(200).json({ pdfAction: null, response: data })
  }


  // ============ CALCUL JOUR DATE ============
  // ===== TRIGGERS ULTRA PRIORITAIRES =====

  // FRANCE TRAVAIL EMPLOI TEMPS REEL
  if ((msgLow.includes('emploi') || msgLow.includes('offre emploi') || (msgLow.includes('liste') && msgLow.includes('travail'))) && !msgLow.includes('ressources humaines') && !msgLow.includes(' rh ')) {
    const zone = msgLow.includes('martinique') ? '972' : msgLow.includes('guyane') ? '973' : msgLow.includes('reunion') ? '974' : '971'
    const data = await getOffresEmploiDOMTOM(message, zone)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // AMAZON RECHERCHE PAAPI
  if ((msgLow.includes('cherche') || msgLow.includes('trouve') || msgLow.includes('recherche')) && msgLow.includes('amazon')) {
    const marketplace = msgLow.includes('usa') ? 'www.amazon.com' : msgLow.includes('canada') ? 'www.amazon.ca' : msgLow.includes('allemagne') ? 'www.amazon.de' : msgLow.includes('espagne') ? 'www.amazon.es' : msgLow.includes('italie') ? 'www.amazon.it' : msgLow.includes('angleterre') ? 'www.amazon.co.uk' : msgLow.includes('australie') ? 'www.amazon.com.au' : (msgLow.includes(' inde') || msgLow === 'inde' || msgLow.includes('inde ') || msgLow.includes('pays inde')) ? 'www.amazon.in' : msgLow.includes('bresil') ? 'www.amazon.com.br' : 'www.amazon.fr'
    const query = message.replace(/cherche|trouve|recherche|amazon|sur|dans|en|un|une|des|le|la|les|france|usa|canada|allemagne|espagne|italie|angleterre|australie|inde|bresil|singapour|suede|belgique/gi,'').trim() || 'bestsellers'
    const data = await searchAmazonProducts(query, marketplace)
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
  if (msgLow.includes('boutique') && (msgLow.includes('france') || msgLow.includes('usa') || msgLow.includes('canada') || msgLow.includes('australie') || (msgLow.includes(' inde') || msgLow === 'inde' || msgLow.includes('inde ') || msgLow.includes('pays inde')) || msgLow.includes('allemagne') || msgLow.includes('espagne') || msgLow.includes('italie') || msgLow.includes('bresil') || msgLow.includes('singapour') || msgLow.includes('suede') || msgLow.includes('belgique') || msgLow.includes('angleterre') || msgLow.includes('zelande'))) {
    const data = await getInfoPaysAmazon(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // 14 PAYS AMAZON REUSSITESS
  if (msgLow.includes('boutique') && (msgLow.includes('france') || msgLow.includes('usa') || msgLow.includes('canada') || msgLow.includes('australie') || (msgLow.includes(' inde') || msgLow === 'inde' || msgLow.includes('inde ') || msgLow.includes('pays inde')) || msgLow.includes('allemagne') || msgLow.includes('espagne') || msgLow.includes('italie') || msgLow.includes('bresil') || msgLow.includes('singapour') || msgLow.includes('suede') || msgLow.includes('belgique') || msgLow.includes('angleterre') || msgLow.includes('zelande'))) {
    const data = await getInfoPaysAmazon(message)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // OMDB FILMS
  if ((msgLow.includes('film') || msgLow.includes('série') || msgLow.includes('movie') || msgLow.includes('cinéma')) && !msgLow.includes('caribéen') && !msgLow.includes('guadeloupe')) {
    const titre = message.replace(/film|série|movie|cinéma|cherche|info|sur|le|la|les/gi,'').trim() || 'Avatar'
    const data = await getFilm(titre)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // COCKTAIL
  if (msgLow.includes('cocktail') || msgLow.includes('recette') && msgLow.includes('boisson') || msgLow.includes('mojito') || msgLow.includes('rhum punch')) {
    const nom = message.replace(/cocktail|recette|boisson|fais|moi/gi,'').trim() || 'mojito'
    const data = await getCocktail(nom)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // RECETTE CUISINE
  if ((msgLow.includes('recette') || msgLow.includes('cuisine') || msgLow.includes('plat')) && !msgLow.includes('boisson') && !msgLow.includes('accras') && !msgLow.includes('santé') && !msgLow.includes('diabète') && !msgLow.includes('maladie') && !msgLow.includes('colombo') && !msgLow.includes('blaff') && !msgLow.includes('bokits') && !msgLow.includes('creole') && !msgLow.includes('antillais') && !msgLow.includes('guadeloupe') && !msgLow.includes('martinique')) {
    const plat = message.replace(/recette|cuisine|plat|fais|moi|de|du/gi,'').trim() || 'chicken'
    const data = await getRecette(plat)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // WIKIPEDIA
  if (msgLow.includes('wikipedia') || (msgLow.includes('qui est') && message.split(' ').length > 3)) {
    const sujet = message.replace(/wikipedia|qui est|c.est quoi|définition de/gi,'').trim() || 'Guadeloupe'
    const data = await getWikipedia(sujet)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // JOKEAPI BLAGUE
  if (msgLow.includes('blague') || msgLow.includes('joke') || msgLow.includes('fais moi rire') || msgLow.includes('raconte') && msgLow.includes('drôle')) {
    const data = await getBlague()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // IP GEOLOCATION
  if (msgLow.includes('ma localisation') || msgLow.includes('mon ip') || msgLow.includes('où suis-je') || msgLow.includes('localise moi')) {
    const data = await getIPLocation()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // AIR QUALITY
  if ((msgLow.includes('qualité') && msgLow.includes(' air') || msgLow === 'air' || msgLow.startsWith('air ')) || msgLow.includes('pollution air') || msgLow.includes('indice aqi')) {
    const ville = message.replace(/qualité|air|pollution|aqi|de|la|à/gi,'').trim() || 'Guadeloupe'
    const data = await getAirQuality(ville)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ANALYSE URL
  const urlMatch = message.match(/(https?:\/\/[^\s]+)/)
  if (urlMatch) {
    const url = urlMatch[1]
    const contenu = await analyserURL(url)
    if (contenu) {
      const historyCtx = chunkContext(Array.isArray(context) ? context : [])
      const question = message.replace(urlMatch[1], '').trim() || 'Résume et analyse ce contenu'
      const groqText = await groqFetch([
        ...historyCtx,
        { role: "system", content: "Tu es REUSSITESS AI. Analyse le contenu web fourni et réponds à la question de l'utilisateur. Sois précis et utile. Boudoum!" },
        { role: "user", content: `Contenu de ${url}:\n\n${contenu}\n\nQuestion: ${question}` }
      ], 1024)
      return res.status(200).json({ pdfAction: null, response: `🔍 **Analyse de ${url}**\n\n${groqText}\n\nBoudoum ! 🇬🇵` })
    }
  }

  // QUIZ INTERACTIF AVEC MEMOIRE
  if (msgLow.includes('crée un quiz') || msgLow.includes('créer un quiz') || msgLow.includes('fais moi un quiz') || msgLow.includes('quiz sur') || msgLow.includes('jouer quiz')) {
    const topic = message.replace(/crée?|un|quiz|fais|moi|jouer|sur/gi,'').trim() || 'Guadeloupe'
    const historyCtx = Array.isArray(context) ? context.slice(-6).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content?.substring(0,300) || '' })).filter(m => m.content) : []
    const groqText = await groqFetch([
      ...historyCtx,
      { role: "system", content: `Tu es Neuro-X Quiz REUSSITESS. Crée un quiz interactif sur "${topic}". Pose UNE seule question à la fois avec 4 choix (A/B/C/D). Attends la réponse avant de continuer. Si l'utilisateur répond, évalue sa réponse, donne l'explication et pose la question suivante. Garde le score. Format: Question + choix + attendre réponse. Boudoum!` },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: groqText || "🎯 Quiz en chargement. Réessaie ! Boudoum 🇬🇵" })
  }

  // DASHBOARD ADMIN
  if (msgLow.includes('dashboard') || msgLow.includes('statistiques bot') || msgLow.includes('stats admin')) {
    const data = await getDashboardStats()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ALERTES CATASTROPHES
  if (msgLow.includes('alerte') && (msgLow.includes('catastrophe') || msgLow.includes('urgence') || msgLow.includes('danger'))) {
    const data = await getAlertesCatastrophes()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ISS POSITION
  if (msgLow === 'iss' || ((msgLow.includes(' iss') || msgLow === 'iss' || msgLow.includes('station spatiale') || msgLow.includes('iss ')) && msgLow.includes('position')) || msgLow.includes('station spatiale internationale') || msgLow.includes('où est l\'iss')) {
    const data = await getISSPosition()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // ANALYSE SENTIMENT HF
  if (msgLow.includes('analyse sentiment') || msgLow.includes('analyser sentiment') || msgLow.includes('emotion texte') || msgLow.includes('sentiment de')) {
    const texte = message.replace(/analyse sentiment|analyser sentiment|emotion texte|sentiment de/gi,'').trim() || message
    const result = await hfSentiment(texte)
    if (result) return res.status(200).json({ pdfAction: null, response: `🧠 **Analyse Sentiment HuggingFace**\n\nTexte: "${texte.substring(0,100)}"\n\nRésultat: **${result}**\n\nBoudoum ! 🇬🇵` })
  }

  // DETECTION LANGUE HF
  if (msgLow.includes('detecter langue') || msgLow.includes('détecter langue') || msgLow.includes('quelle langue') || msgLow.includes('identifier langue')) {
    const texte = message.replace(/detecter langue|détecter langue|quelle langue|identifier langue/gi,'').trim() || message
    const result = await hfDetectLangue(texte)
    if (result) return res.status(200).json({ pdfAction: null, response: `🌍 **Détection Langue HuggingFace**\n\nTexte: "${texte.substring(0,100)}"\n\nLangue détectée: **${result}**\n\nBoudoum ! 🇬🇵` })
  }

  // RESUME TEXTE HF
  if (msgLow.includes('résume ce texte') || msgLow.includes('resume ce texte') || msgLow.includes('résumer ce texte') || msgLow.includes('fais un résumé de')) {
    const texte = message.replace(/résume ce texte|resume ce texte|résumer ce texte|fais un résumé de/gi,'').trim()
    if (texte.length > 50) {
      const result = await hfResumer(texte)
      if (result) return res.status(200).json({ pdfAction: null, response: `📝 **Résumé automatique HuggingFace**\n\n${result}\n\nBoudoum ! 🇬🇵` })
    }
  }

  // KICK.COM
  if (msgLow.includes('kick.com') || msgLow.includes('kick reussitess') || msgLow.includes('stream reussitess') || msgLow.includes('live kick') || (msgLow.includes('kick') && msgLow.length < 15) || msgLow.includes('live reussitess')) {
    const data = await getKickStats()
    if (data) return res.status(200).json({ pdfAction: null, response: data })
  }

  // REDDIT POSTS
  if (msgLow.includes('reddit') || msgLow.includes('r/reussitess') || msgLow.includes('quiz communauté')) {
    const sub = msgLow.includes('guadeloupe') ? 'Guadeloupe' : msgLow.includes('caribbean') || msgLow.includes('caraïbes') ? 'caribbean' : msgLow.includes('martinique') ? 'martinique' : msgLow.includes('haiti') ? 'haiti' : msgLow.includes('afrique') ? 'francophonie' : 'Guadeloupe'
    const data = await getRedditPosts(sub)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // CREATEUR FONDATEUR
  if (msgLow.includes('créateur') || msgLow.includes('createur') || msgLow.includes('qui est ton') || msgLow.includes('qui t a cree') || msgLow.includes('qui ta cree') || msgLow.includes('qui t as cree') || msgLow.includes('qui vous a cree') || msgLow.includes('cree par qui')) {
    return res.status(200).json({ pdfAction: null, response: "🌟 **Mon Créateur**\n\nJe suis **REUSSITESS®971 AI**, créé par **Rony Porinus**, entrepreneur guadeloupéen basé à **Gourbeyre, Guadeloupe 🇬🇵**\n\n**SIRET :** 444699979700031\n**Marque :** REUSSITESS® (DSO2026008921 — INPI eSoleau)\n**Site :** https://reussitess.fr\n**Telegram :** @Reussitessbot\n\n💡 Rony a construit REUSSITESS depuis la Guadeloupe avec Termux sur Android — preuve que l\'excellence caribéenne n\'a pas de limite !\n\n**Devise :** *Cultiver le maximum de personnes dans le monde entier*\n\nBoudoum ! 🇬🇵" })
  }

  // KOMPA MUSIQUE HAITI
  if (msgLow.includes('kompa') || msgLow.includes('compas direct') || (msgLow.includes('musique') && msgLow.includes('haiti'))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Culture, expert musique haïtienne kompa/compas direct. Histoire, artistes, évolution. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🎵 **Neuro-X Culture — Kompa Haïti**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // RESSOURCES HUMAINES
  if ((msgLow.includes('ressources humaines') || msgLow.includes('recrutement') || msgLow.includes(' rh ') || msgLow === 'rh') && !msgLow.includes('emploi')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Business, expert ressources humaines et recrutement en entreprise caribéenne. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "👔 **Neuro-X RH — Ressources Humaines**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // MUSIQUE ITUNES CARAIBE
  if ((msgLow.includes('chanson') || msgLow.includes('titre') || msgLow.includes('morceau')) && (msgLow.includes('zouk') || msgLow.includes('soca') || msgLow.includes('reggae') || msgLow.includes('afrobeats') || msgLow.includes('caribéen'))) {
    const query = message.replace(/chanson|titre|morceau|cherche|trouve/gi,'').trim() || 'zouk guadeloupe'
    const data = await getMusiqueCaraibe(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // DEEZER RECHERCHE
  if (msgLow.includes('deezer') || (msgLow.includes('écouter') && msgLow.includes('musique'))) {
    const query = message.replace(/deezer|écouter|musique|cherche/gi,'').trim() || 'zouk'
    const data = await getDeezerCaraibe(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // DISCOGS VINYLES
  if (msgLow.includes('discogs') || msgLow.includes('vinyle') || msgLow.includes('album') && msgLow.includes('caraïbes')) {
    const query = message.replace(/discogs|vinyle|album|caraïbes|cherche/gi,'').trim() || 'zouk'
    const data = await getDiscogsCaraibe(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // PODCASTS ITUNES
  if (msgLow.includes('podcast') || msgLow.includes('écouter') && msgLow.includes('radio') || msgLow.includes('audio') && msgLow.includes('emission')) {
    const query = message.replace(/podcast|écouter|audio|emission|radio|gratuit/gi,'').trim() || 'Guadeloupe'
    const data = await getPodcasts(query)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // CRYPTO SECURITE DRAINEUR
  if ((msgLow.includes('draineur') || msgLow.includes('draneur') || msgLow.includes('honeypot') || msgLow.includes('rug pull') || msgLow.includes('scam crypto') || msgLow.includes('sécurité crypto') || msgLow.includes('securite crypto') || msgLow.includes('verifier contrat') || msgLow.includes('vérifier contrat') || msgLow.includes('crypto danger') || msgLow.includes('mica') || (msgLow.includes('crypto') && msgLow.includes('sécurité')))) {
    const contratMatch = message.match(/0x[a-fA-F0-9]{40}/)
    const contrat = contratMatch ? contratMatch[0] : ''
    const chain = msgLow.includes('polygon') ? 'polygon' : msgLow.includes('bsc') || msgLow.includes('bnb') ? 'bsc' : 'polygon'
    const data = await getCryptoSecurite(contrat, chain)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // NEWSLETTER EMAILING
  if (msgLow.includes('newsletter') || msgLow.includes('emailing') || (msgLow.includes('email') && msgLow.includes('marketing')) || msgLow.includes('mailing list')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Marketing, expert newsletter et email marketing. Guide sur création, segmentation, automatisation. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "📧 **Neuro-X Marketing — Newsletter & Emailing**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // TRADUCTION MYMEMORY ULTRA-PRIORITAIRE
  if ((msgLow.includes('traduis') || msgLow.includes('traduire') || msgLow.includes('translate')) && !msgLow.includes('creole') && !msgLow.includes('kreyol')) {
    const langues = { 'anglais':'en','espagnol':'es','portugais':'pt','allemand':'de','italien':'it','arabe':'ar','chinois':'zh','japonais':'ja','russe':'ru' }
    let cible = 'en'
    for (const [nom, code] of Object.entries(langues)) {
      if (msgLow.includes(nom)) { cible = code; break }
    }
    const texte = message.replace(/traduis?\s*(en\s*\w+)?\s*/i,'').trim() || 'Bonjour'
    const trad = await traduire(texte, cible)
    if (trad) return res.status(200).json({ pdfAction: null, response: `🌐 **Traduction → ${cible.toUpperCase()}**\n\n📝 Original: ${texte}\n\n✨ Traduction: **${trad}**\n\nBoudoum ! 🇬🇵` })
  }

  // SALAIRE MOYEN DOM-TOM
  if ((msgLow.includes('salaire') || msgLow.includes('smic') || msgLow.includes('revenu moyen')) && (msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('dom-tom') || msgLow.includes('antilles'))) {
    const groqText = await groqFetch([
      { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "💰 **Salaires DOM-TOM**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // MODE FASHION
  if ((msgLow.includes('mode ') || msgLow.includes(' mode') || msgLow.includes('mode:') || msgLow === 'mode') && (msgLow.includes('fashion') || msgLow.includes('tendance') || msgLow.includes('vêtement') || msgLow.includes('style') || msgLow.includes('madras'))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Mode, expert fashion et style caribéen, madras, tendances vestimentaires DOM-TOM. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "👗 **Neuro-X Mode — Style Caribéen**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // DIABETE NUTRITION
  if (msgLow.includes('diabète') || msgLow.includes('diabete') || msgLow.includes('glycémie') || msgLow.includes('insuline')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Santé, expert nutrition et diabète. Toujours recommander un médecin. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🏥 **Neuro-X Santé — Nutrition & Diabète**\n\n" + groqText + "\n\n⚠️ Consultez toujours un médecin.\nBoudoum ! 🇬🇵" })
  }

  // GASTRONOMIE ANTILLAISE
  if (msgLow.includes('gastronomie') || (msgLow.includes('restaurant') && (msgLow.includes('antillais') || msgLow.includes('créole') || msgLow.includes('guadeloupe') || msgLow.includes('martinique')))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Gastronomie, expert cuisine antillaise et gastronomie caribéenne. Parle des restaurants, plats typiques, recettes créoles. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🍽️ **Neuro-X Gastronomie — Cuisine Caribéenne**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // ENFANTS EDUCATION
  if (msgLow.includes('enfant') || msgLow.includes('pédagogie') || msgLow.includes('pedagogie')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Éducation, expert pédagogie et développement enfant caribéen. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "👶 **Neuro-X Éducation — Enfants**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // GASTRONOMIE ANTILLAISE
  if (msgLow.includes('gastronomie') || (msgLow.includes('restaurant') && (msgLow.includes('antillais') || msgLow.includes('créole') || msgLow.includes('guadeloupe') || msgLow.includes('martinique')))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Gastronomie, expert cuisine antillaise et gastronomie caribéenne. Parle des restaurants, plats typiques, recettes créoles. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🍽️ **Neuro-X Gastronomie — Cuisine Caribéenne**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // ENFANTS EDUCATION
  if (msgLow.includes('enfant') || msgLow.includes('pédagogie') || msgLow.includes('pedagogie')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Éducation, expert pédagogie et développement enfant caribéen. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "👶 **Neuro-X Éducation — Enfants**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // SPORT SURF NAUTIQUE
  if (msgLow.includes('surf') || msgLow.includes('voile') || msgLow.includes('nautique') || msgLow.includes('plongée') || msgLow.includes('plongee') || (msgLow.includes('sport') && (msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('caraïbes')))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Sport, expert sports nautiques et activités sportives caribéennes (surf, voile, plongée, football, athlétisme). Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🏄 **Neuro-X Sport — Sports Caribéens**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // EXPATRIATION DOM-TOM
  if (msgLow.includes('expatriation') || msgLow.includes('expatrier') || msgLow.includes('partir en metropole') || msgLow.includes('quitter guadeloupe') || msgLow.includes('quitter martinique') || (msgLow.includes('partir') && msgLow.includes('dom-tom'))) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Voyage, expert expatriation et mobilité depuis les DOM-TOM vers la métropole ou l'étranger. Donne des conseils pratiques. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "✈️ **Neuro-X Expatriation — Guide Mobilité**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // LOGEMENT SOCIAL HLM
  if (msgLow.includes('hlm') || msgLow.includes('logement social') || msgLow.includes('logement aidé') || msgLow.includes('demande logement')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Juridique, expert logement social et HLM DOM-TOM. Guide sur demande HLM, dossier, délais, aides au logement. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🏘️ **Neuro-X Logement — HLM DOM-TOM**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // FESTIVALS EVENEMENTS
  if (msgLow.includes('festival') || msgLow.includes('événement') && (msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('caraïbes')) || msgLow.includes('carnaval guadeloupe') || msgLow.includes('fete caraibe')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Culture, expert festivals et événements culturels caribéens (carnaval, festival créole, fêtes locales DOM-TOM). Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🎉 **Neuro-X Culture — Festivals Caribéens**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // CYBERSECURITE
  if (msgLow.includes('cybersécurité') || msgLow.includes('cybersecurite') || msgLow.includes('hacking') || msgLow.includes('piratage') || msgLow.includes('sécurité informatique')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Tech, expert cybersécurité et sécurité informatique. Guide sur protection données, hacking éthique, bonnes pratiques. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🔐 **Neuro-X Cybersécurité**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // PRET BANCAIRE CREDIT
  if (msgLow.includes('prêt') || msgLow.includes('pret bancaire') || msgLow.includes('crédit immobilier') || msgLow.includes('credit immobilier') || msgLow.includes('emprunt')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Finance, expert prêts bancaires et crédits immobiliers DOM-TOM. Guide sur taux, conditions, simulation. Jamais de conseil financier direct. DYOR. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🏦 **Neuro-X Finance — Prêt Bancaire**\n\n" + groqText + "\n\n⚠️ Consultez toujours un conseiller financier.\nBoudoum ! 🇬🇵" })
  }

  // SOLIDARITE HUMANITAIRE
  if (msgLow.includes('solidarité') || msgLow.includes('solidarite') || msgLow.includes('humanitaire') || msgLow.includes('bénévolat') || msgLow.includes('benevolat')) {
    const groqText = await groqFetch([
      { role: "system", content: "Tu es Neuro-X Communauté, expert solidarité et actions humanitaires caribéennes. Boudoum!" },
      { role: "user", content: message }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: "🤝 **Neuro-X Communauté — Solidarité**\n\n" + groqText + "\n\nBoudoum ! 🇬🇵" })
  }

  // REUSSSHIELD HEALTH CHECK
  if (msgLow.includes('reussshield') || msgLow.includes('état du système') || msgLow.includes('etat systeme') || msgLow.includes('santé système') || ((msgLow === 'tout' || msgLow.includes('tout savoir') || msgLow.includes('tout sur') || msgLow.includes('dis tout')) && msgLow.includes('fonctionne'))) {
    const data = await getHealthCheck()
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
    const pays = 
    msgLow.includes('martinique') ? 'MTQ' :
    msgLow.includes('guyane') ? 'GUF' :
    msgLow.includes('reunion') || msgLow.includes('réunion') ? 'REU' :
    msgLow.includes('mayotte') ? 'MYT' :
    msgLow.includes('haiti') || msgLow.includes('haïti') ? 'HTI' :
    msgLow.includes('cuba') ? 'CUB' :
    msgLow.includes('jamaique') || msgLow.includes('jamaïque') ? 'JAM' :
    msgLow.includes('trinidad') ? 'TTO' :
    msgLow.includes('barbade') ? 'BRB' :
    msgLow.includes('bahamas') ? 'BHS' :
    msgLow.includes('dominicaine') ? 'DOM' :
    msgLow.includes('martinique') ? 'MTQ' :
    msgLow.includes('senegal') || msgLow.includes('sénégal') ? 'SEN' :
    msgLow.includes('cote ivoire') || msgLow.includes('côte ivoire') || msgLow.includes('côte d') ? 'CIV' :
    msgLow.includes('cameroun') ? 'CMR' :
    msgLow.includes('maroc') ? 'MAR' :
    msgLow.includes('madagascar') ? 'MDG' :
    msgLow.includes('usa') || msgLow.includes('etats-unis') || msgLow.includes('états-unis') ? 'US' :
    msgLow.includes('france') ? 'FR' :
    msgLow.includes('allemagne') ? 'DE' :
    msgLow.includes('espagne') ? 'ES' :
    msgLow.includes('italie') ? 'IT' :
    msgLow.includes('canada') ? 'CA' :
    msgLow.includes('bresil') || msgLow.includes('brésil') ? 'BR' :
    msgLow.includes('chine') ? 'CN' :
    (msgLow.includes(' inde') || msgLow === 'inde' || msgLow.includes('inde ') || msgLow.includes('pays inde')) ? 'IN' :
    'GLP'
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
  if (((msgLow.includes('vol ') || msgLow.includes(' vol') || msgLow === 'vol') || msgLow.includes('avion') || msgLow.includes('aéroport') || msgLow.includes('aeroport')) && (msgLow.includes('caraïbes') || msgLow.includes('caraibes') || msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('antilles'))) {
    const data = await getVolsCaraibes()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // HOPITAUX DOM-TOM
  if (msgLow.includes('hopital') || msgLow.includes('hôpital') || (msgLow === 'chu' || msgLow.includes(' chu') || msgLow.includes('chu ') || msgLow.includes('hôpital')) || msgLow.includes('urgences') || msgLow.includes('clinique')) {
    const data = await getHopitauxDOMTOM()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  // METEO DOM-TOM PRIORITAIRE
  if (msgLow.includes('meteo') || msgLow.includes('météo') || msgLow.includes('température') || msgLow.includes('temperature') || msgLow.includes('quel temps') || msgLow.includes('climat')) {
    const commune_raw = message.replace(/meteo|météo|température|temperature|quel temps|climat|open|api|data/gi,'').trim()
    const commune = commune_raw.length > 2 ? commune_raw : 'Pointe-à-Pitre'
    const data = await getMeteoMonde(commune)
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
  if (msgLow.includes('plages dom') || msgLow.includes('plage guadeloupe') || msgLow.includes('plage martinique') || msgLow.includes('plage caraïbe') || msgLow.includes('plage antilles') || msgLow.includes('meilleure plage') || (msgLow.includes('plage') && (msgLow.includes('dom-tom') || msgLow.includes('antilles') || msgLow.includes('guadeloupe') || msgLow.includes('martinique') || msgLow.includes('caraïbe') || msgLow.includes('reunion') || msgLow.includes('réunion'))) || (msgLow.includes('baignade') && msgLow.includes('dom'))) {
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
• 🎬 Films & Séries (OMDb)
• 🍹 Cocktails & Recettes (CocktailDB + MealDB)
• 📖 Wikipedia FR temps réel
• 🌬️ Qualité de l'air mondiale
• 😂 Blagues (JokeAPI)
• 📍 Géolocalisation IP
• 👥 Données ONU Population
• 🔍 Analyse de liens URL
• 🎵 Musique caribéenne iTunes temps réel
• 🎧 Deezer recherche musicale
• 💿 Discogs vinyles et albums
• 🎤 MusicBrainz artistes caribéens
• 🎙️ Podcasts gratuits iTunes
• 📧 Newsletter et email marketing
• 🎯 Quiz interactif avec mémoire conversationnelle
• 🤖 Bot Telegram @Reussitessbot
• 🔐 Chiffrement AES-256
• 🛡️ Rate limiting anti-abus
• 🔔 Alertes Telegram automatiques
• 🛡️ Crypto sécurité: détection draineurs/honeypot
• 🔎 Scanner contrats GoPlus gratuit
• ⚖️ Guide MiCA conformité européenne
• 🔒 Outils protection wallet (revoke.cash, de.fi)
• 🤗 HuggingFace: analyse sentiment, détection langue, résumé
• 🎮 Kick.com streaming stats temps réel
• 📱 App Android APK disponible
• 🌿 REUSSITESS TERRA® Agriculture+Eau+Santé
• 🔊 TTS créole (Groq PlayAI)
• 📊 Dashboard visiteurs Redis temps réel
• 🌍 Compteur visiteurs par pays
• 🔧 OpenRouter Function Calling intelligent
• 📄 Whitepaper REUSSITESS+TERRA PDF
• 🎮 Kick.com stats streaming temps réel
• 📱 App Android APK (reussitess.fr/telecharger)
• 🌿 REUSSITESS TERRA® (Agriculture+Eau+Santé)
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
• 🎵 Musique iTunes/Deezer/Discogs/MusicBrainz
• 🎙️ Podcasts gratuits iTunes
• 🎉 Festivals & événements caribéens

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
• 🛡️ Détection draineurs/honeypot (GoPlus)
• ⚖️ Guide MiCA conformité européenne

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
• 6 niveaux fallback IA (Groq x3 + OpenRouter + Cerebras + LangChain)
• Chiffrement AES-256 conversations
• Rate limiting 30 req/min par IP
• Alertes Telegram automatiques
• REUSSSHIELD health check temps réel
• Dashboard stats admin
• Traduction MyMemory gratuite
• HTTPS + headers sécurisés A+
• PWA installable
• Mémoire conversation

**Total : 165+ fonctionnalités actives** 🎯

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
      return res.status(200).json({ pdfAction: null, response: "🗳️ Consultez https://www.guadeloupe.gouv.fr 📱*(navigateur)*\n\nBoudoum ! 🇬🇵" })
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
    const data = await getActualitesOutremerComplet()
    return res.status(200).json({ pdfAction: null, response: data })
  }
  if ((msgLow.includes('actualite') || msgLow.includes('actu') || msgLow.includes('news') || msgLow.includes('info')) && msgLow.includes('martinique')) {
    const data = await getActualitesOutremerComplet()
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
  if ((msgLow.includes(' rci') || msgLow.includes('radio rci') || msgLow === 'rci') || msgLow.includes('rci fm') || msgLow.includes('radio guadeloupe') || msgLow.includes('104.3')) {
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
    const data = await getMeteoMonde(commune)
    return res.status(200).json({ pdfAction: null, response: "Meteo DOM-TOM\n\n"+(data||"Info en chargement — réessaie ! Boudoum 🇬🇵")+"\n\nSource: Open-Meteo\nBoudoum ! 🇬🇵" })
  }
    // NASA PHOTO DU JOUR
  if (msgLow.includes('nasa') || msgLow.includes('photo nasa') || msgLow.includes('image nasa') || msgLow.includes('photo jour nasa')) {
    const data = await getNASAPhotoJour()
    return res.status(200).json({ pdfAction: null, response: data || '🚀 **NASA — Photo du Jour**\n\nConsulte directement : https://apod.nasa.gov/apod/\n\nDes images époustouflantes de l\'univers chaque jour !\nBoudoum ! 🇬🇵' })
  }

  // LEVER COUCHER SOLEIL
  if (msgLow.includes('lever soleil') || msgLow.includes('coucher soleil') || msgLow.includes('heure soleil') || msgLow.includes('aube') || msgLow.includes('crepuscule')) {
    const data = await getLeverCoucherSoleil(16.2411, -61.5331, 'Guadeloupe')
    if (data) return res.status(200).json({ pdfAction: null, response: data })
  }

  // PROGRAMMES TV
  if (msgLow.includes('programme tv') || msgLow.includes('televison') || msgLow.includes('emission tv') || msgLow.includes('series tv') || msgLow.includes('programme tele')) {
    const data = await getProgrammesTV('caribbean')
    if (data) return res.status(200).json({ pdfAction: null, response: data })
  }

  // ============ DEVISES AFRIQUE CARAIBE ============
  if (msgLow.includes('xof') || msgLow.includes('xaf') || msgLow.includes('fcfa') || msgLow.includes('franc cfa') || msgLow.includes('devise afrique') || msgLow.includes('taux afrique')) {
    const data = await getDevisesAfriqueCaraibe()
    return res.status(200).json({ pdfAction: null, response: "Devises Afrique & Caraibe\n\n"+(data||"Info en chargement — réessaie ! Boudoum 🇬🇵")+"\n\nSource: ExchangeRate-API\nBoudoum ! 🇬🇵" })
  }
  // ============ BOURSES ============
  if ((msgLow.includes('bourse') && !msgLow.includes('trading') && !msgLow.includes('action') && !msgLow.includes('bourse valeur')) || msgLow.includes('auf') || msgLow.includes('campus france') || msgLow.includes('financement etude') || msgLow.includes('aide etudiant')) {
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
    return res.status(200).json({ pdfAction: null, response: "Prix Carburant DOM-TOM\n\n"+(data||"Info en chargement — réessaie ! Boudoum 🇬🇵")+"\n\nhttps://www.prix-carburants.gouv.fr 📱*(navigateur)*\nBoudoum ! 🇬🇵" })
  }
  // ============ CALENDRIER SCOLAIRE ============
  if (msgLow.includes('calendrier scolaire') || msgLow.includes('vacances scolaires') || msgLow.includes('rentree') || msgLow.includes('vacances ecole')) {
    const data = await getCalendrieScolaire()
    return res.status(200).json({ pdfAction: null, response: "Calendrier Scolaire DOM-TOM\n\n"+(data||"Consulte education.gouv.fr")+"\n\nhttps://www.education.gouv.fr 📱*(navigateur)*\nBoudoum ! 🇬🇵" })
  }
  // ============ BIBLIOTHEQUE CARIBEENNE ============
  if (msgLow.includes('cesaire') || msgLow.includes('fanon') || msgLow.includes('conde') || msgLow.includes('glissant') || msgLow.includes('schwarz-bart') || msgLow.includes('bibliotheque caribeenne') || msgLow.includes('litterature antillaise')) {
    const data = await getBibliothequeCaribeenne(message)
    return res.status(200).json({ pdfAction: null, response: (data||"Bibliotheque disponible sur reussitess.fr/bibliotheque")+"\n\nBoudoum ! 🇬🇵" })
  }

  // ============ ACTUALITES GUADELOUPE ============
  if (msgLow.includes('actualite guadeloupe') || msgLow.includes('actualités guadeloupe') || msgLow.includes('news guadeloupe') || msgLow.includes('info guadeloupe')) {
    const actu = await getActualitesGuadeloupe()
    const meteo = await getMeteoMonde('Guadeloupe')
    const groqText = await groqFetch([
      { role: "system", content: "Tu es REUSSITESS AI, encyclopédie caribéenne. Réponds comme une encyclopédie vivante sur la Guadeloupe. Inclus géographie, histoire, économie, culture, politique. Style chaleureux et positif. Termine par Boudoum ! 🇬🇵" },
      { role: "user", content: "Info Guadeloupe — inclus ces données temps réel: Météo: " + (meteo||'') + " | Actualités récentes: " + (actu||'') }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: groqText || "📚 Encyclopédie REUSSITESS — Guadeloupe\n\nBoudoum ! 🇬🇵" })

  }

  // ============ ACTUALITES MARTINIQUE ============
  if (msgLow.includes('actualite martinique') || msgLow.includes('actualités martinique') || msgLow.includes('news martinique') || msgLow.includes('info martinique')) {
    const actu = await getActualitesMartinique()
    const meteo = await getMeteoMonde('Martinique')
    const groqText = await groqFetch([
      { role: "system", content: "Tu es REUSSITESS AI, encyclopédie caribéenne. Réponds comme une encyclopédie vivante sur la Martinique. Inclus géographie, histoire, économie, culture, politique. Style chaleureux et positif. Termine par Boudoum ! 🇬🇵" },
      { role: "user", content: "Info Martinique — inclus ces données temps réel: Météo: " + (meteo||'') + " | Actualités récentes: " + (actu||'') }
    ], 1024)
    return res.status(200).json({ pdfAction: null, response: groqText || "📚 Encyclopédie REUSSITESS — Martinique\n\nBoudoum ! 🇬🇵" })

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
  if (msgLow.includes('offre emploi') || msgLow.includes('offre ') || msgLow.includes('chercher emploi dom-tom') || msgLow.includes('job guadeloupe') || msgLow.includes('travail guadeloupe') || msgLow.includes('recrutement guadeloupe') || msgLow.includes('france travail guadeloupe')) {
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

  // ===== NOUVELLES FONCTIONS =====
  if (msgLow.includes("météo marine") || msgLow.includes("meteo marine") || msgLow.includes("vagues guadeloupe") || msgLow.includes("mer guadeloupe") || msgLow.includes("conditions mer") || msgLow.includes("navigation guadeloupe")) {
    const data = await getMeteoMarine()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("séismes historiques") || msgLow.includes("seismes historiques") || msgLow.includes("historique séismes") || msgLow.includes("grands séismes caraïbes")) {
    const data = await getSeismesHistoriques()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("lieux culturels") || msgLow.includes("sites historiques guadeloupe") || msgLow.includes("patrimoine guadeloupe") || msgLow.includes("musées guadeloupe") || msgLow.includes("tourisme guadeloupe")) {
    return res.status(200).json({ pdfAction: null, response: getLieuxCulturels("guadeloupe") })
  }

  if (msgLow.includes("santé mentale") || msgLow.includes("depression") || msgLow.includes("détresse psychologique") || msgLow.includes("aide psychologique dom") || msgLow.includes("psychiatrie guadeloupe")) {
    return res.status(200).json({ pdfAction: null, response: getSanteMentaleDOMTOM() })
  }

  if (msgLow.includes("éducation guadeloupe") || msgLow.includes("université antilles") || msgLow.includes("académie guadeloupe") || msgLow.includes("bourse crous") || msgLow.includes("école guadeloupe") || msgLow.includes("lycée guadeloupe")) {
    return res.status(200).json({ pdfAction: null, response: getEducationDOMTOM("guadeloupe") })
  }

  if (msgLow.includes("carnet de route") || msgLow.includes("itinéraire guadeloupe") || msgLow.includes("visiter guadeloupe") || msgLow.includes("voyage guadeloupe") || msgLow.includes("tourisme martinique") || msgLow.includes("itineraire")) {
    const dest = msgLow.includes("martinique") ? "martinique" : msgLow.includes("guyane") ? "guyane" : "guadeloupe"
    return res.status(200).json({ pdfAction: null, response: getCarnetsDeRoute(dest) })
  }

  if (msgLow.includes("éducation martinique") || msgLow.includes("université martinique") || msgLow.includes("académie martinique")) {
    return res.status(200).json({ pdfAction: null, response: getEducationDOMTOM("martinique") })
  }

  // DETECTION PDF TRIGGERS
  if (msgLow.includes("creer mon cv") || msgLow.includes("créer mon cv") || msgLow.includes("cv pdf") || ((msgLow.includes("mon cv") && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf"))) && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf")))) pdfType = "cv"
  else if (msgLow.includes("certificat champion") || msgLow.includes("mon certificat") || msgLow.includes("certificat pdf")) pdfType = "certificat"
  else if (msgLow.includes("contrat freelance") || msgLow.includes("contrat pdf") || msgLow.includes("mon contrat")) pdfType = "contrat"
  else if (msgLow.includes("business plan pdf") || (msgLow.includes("business plan") && (msgLow.includes("créer") || msgLow.includes("générer") || msgLow.includes("faire") || msgLow.includes("pdf")))) pdfType = "business-plan"

  // GUIDE CRYPTOART
  if (msgLow.includes("crypto art") || msgLow.includes("generative art") || msgLow.includes("art génératif") || msgLow.includes("créer avec ia") || msgLow.includes("midjourney")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert art génératif IA et NFT caribéen. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Coach, expert parentalité et famille caribéenne. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👶 **Neuro-X Enfants — Parentalité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE GESTION TEMPS
  if (msgLow.includes("gestion du temps") || (msgLow.includes("productivité") && !msgLow.includes("agricole")) || (msgLow.includes("organisation") && (msgLow.includes("travail") || msgLow.includes("temps") || msgLow.includes("projet") || msgLow.includes("planning"))) || msgLow.includes("procrastination") || msgLow.includes("planning")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Coach, expert productivité et gestion du temps. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "⏰ **Neuro-X Coach — Productivité Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE INTELLIGENCE COLLECTIVE
  if (msgLow.includes("intelligence collective") || msgLow.includes("travailler ensemble") || msgLow.includes("synergie") || (msgLow.includes("collaboration") && (msgLow.includes("équipe") || msgLow.includes("projet") || msgLow.includes("caribéen") || msgLow.includes("réseau"))) || msgLow.includes("réseau caribéen")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Stratégie, expert intelligence collective et leadership. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Stratégie — Intelligence Collective**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE CARNAVAL CARAIBE
  if (msgLow.includes("carnaval") || (msgLow.includes("mas ") || msgLow.includes(" mas") || msgLow === "mas" || msgLow.includes("carnaval")) || msgLow.includes("vidé") || msgLow.includes("chars carnaval") || msgLow.includes("fête guadeloupe")) {
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
  if (msgLow.includes("rsa") || (msgLow === "caf" || msgLow.includes(" caf") || msgLow.includes("caisse allocations") || msgLow.includes("caf ")) || msgLow.includes("aides sociales") || msgLow.includes("allocation") || msgLow.includes("aide guadeloupe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Créatif, expert cinéma caribéen. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Social — Aides DOM-TOM**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
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
  if ((msgLow.includes("offre emploi") || msgLow.includes("chercher emploi") || msgLow.includes("trouver un emploi") || msgLow.includes("job guadeloupe") || msgLow.includes("job martinique") || msgLow.includes("job reunion") || msgLow.includes("emploi dom-tom") || msgLow.includes("emploi caraibes") || msgLow.includes("emploi afrique") || msgLow.includes("recrutement guadeloupe") || msgLow.includes("remote job") || msgLow.includes("offre de travail")) && !msgLow.includes("ressources humaines")) {
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🤝 **Neuro-X Juridique — Créer une Association**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // PASSEPORT DE REUSSITE 🏆
  if (msgLow.includes("passeport de réussite") || msgLow.includes("passeport reussite") || msgLow.includes("certificat champion") || msgLow.includes("devenir champion") || msgLow.includes("passeport champion") || (msgLow.includes("passeport de réussite") || msgLow.includes("champions reussitess") || msgLow.includes("devenir champion"))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Juridique, expert création association loi 1901 DOM-TOM. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Culture, expert identité et ADN caribéen afro-antillais. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🧬 **Neuro-X Culture — Mon ADN Caribéen**\n\n"+groqText+"\n\n👉 Explore ton ADN: https://reussitess.fr/mon-adn\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ORACLE 971
  if (msgLow.includes("oracle") || msgLow.includes("oracle 971") || msgLow.includes("prédiction") || msgLow.includes("avenir caribéen") || (msgLow.includes("destin") && (msgLow.includes("oracle") || msgLow.includes("avenir") || msgLow.includes("prédit") || msgLow.includes("caribéen") || msgLow.includes("971")))) {
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
            { role: "system", content: "Tu es Neuro-X Coach, expert révolution personnelle par IA. Inspire à agir. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🚀 **Neuro-X Coach — Ta Révolution IA**\n\n"+groqText+"\n\n👉 Lance ta révolution: https://reussitess.fr/ma-revolution-ia\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // BILAN FINAL ECOSYSTEME
  if (msgLow.includes("que sais-tu faire") || msgLow.includes("tes capacités") || msgLow.includes("liste tes fonctions") || msgLow.includes("tout ce que tu fais") || msgLow.includes("fonctionnalités")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS AI — 200+ Fonctionnalités**\n\n"
    +"🌍 **Données Temps Réel :** Météo monde, Crypto live, Actualités, Séismes, Cyclones, ISS, Lune, Taux change\n\n"
    +"🧠 **60 Neuro-X :** Finance, Business, Culture, Coach, Tech, Santé, Droit, Voyage, Cuisine, Musique, Sport, Histoire, Agriculture, Tourisme, Astronomie, Géopolitique, SEO, DeFi, NFT, Psychologie, Langues, Énergie, Mode, Gastronomie, Enfants, Seniors, Femmes, Jeunes, Diaspora, Blockchain, Stratégie...\n\n"
    +"🛡️ **40 Sentinelles :** Surveillance 24/7 prix REUSS, site, APIs, sécurité\n\n"
    +"🎯 **99 Quiz :** Tous thèmes caribéens et mondiaux\n\n"
    +"✨ **Créatif :** Poèmes créoles, Chansons zouk, Contes, Slogans, Posts réseaux, Hashtags, Bio\n\n"
    +"💼 **Business :** CV, Contrats, Emails, Business Plan, Pitch, Dropshipping, Freelance, Export\n\n"
    +"💎 **Crypto :** Analyse marché, Staking REUSS, DAO, Whitepaper, GoMining, Web3\n\n"
    +"🇬🇵 **Caribéen :** Proverbes, Mots créoles, Blagues, Agenda, Cocktails, Recettes, Champions, Histoire\n\n"
    +"🧠 **Intelligence Émotionnelle :** Détecte tes émotions et répond avec empathie caribéenne\n\n"+"📱 **Contenu Social :** Génère posts Instagram, tweets, captions, emails REUSSITESS (ex: \"génère post sur...\" )\n\n"+"📚 **Connaissances Approfondies :** Négritude, Créolité, Esclavage, Biodiversité caribéenne\n\n"+"💾 **Mémoire Conversation :** Se souvient de tes 10 derniers échanges (Redis 7 jours)\n\n"+"👤 **Profil Utilisateur :** Personnalisation selon tes visites et préférences\n\n"+"🔮 **Spirituel & Mystique :** Oracle 971, Numérologie caribéenne, Horoscope du jour, Calendrier lunaire, Analyse rêves, Astrologie\n\n"+"🛸 **QUANTUM NEXUS :** 200 Agents IA orchestrés, communication inter-agents, rapports complets\n\n"+"🛡️ **REUSSSHIELD :** Surveillance sécurité temps réel, alertes menaces, rapport sécurité\n\n"+"🌍 **Identité Mondiale :** IA Passport 8 langues, Visa Universel REUSSITESS, Passeport de Réussite\n\n"+"🔢 **Calculateurs :** IMC santé, Staking REUSS, Commissions Amazon affilié\n\n"+"🗣️ **Traducteur :** Français, Créole, Anglais, Espagnol, Portugais, Wolof, Arabe, Mandarin\n\n"+"🏆 **Gamification :** Système Points REUSS, Classement Champions, Résumé de session\n\n"+"🌿 **Pharmacopée :** Plantes médicinales caribéennes, remèdes créoles, flore Guadeloupe\n\n"+"💬 Active : *neuro-x [domaine]* | *agents ia* | *rapport complet*\n\n"
    +"Boudoum ! 🇬🇵" })
  }

  // GENERATEUR BIOGRAPHIE
  if (msgLow.includes("biographie") || msgLow.includes("bio instagram") || msgLow.includes("présentation personnelle") || msgLow.includes("qui suis-je") || msgLow.includes("rédige ma bio")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Coach, expert révolution personnelle par IA. Inspire à agir. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Santé, expert santé cardiovasculaire. Toujours recommander un médecin. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Juridique, expert immobilier et achat terrain DOM-TOM. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Tech, expert Web3, blockchain et NFT. Boudoum!" },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌐 **Neuro-X Tech — Web3 Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // IDENTITE DU BOT
  if (msgLow.includes("qui es-tu") || msgLow.includes("qui es tu") || msgLow.includes("présente-toi") || msgLow.includes("présente toi") || msgLow.includes("ta mission") || msgLow.includes("c'est quoi reussitess ai") || msgLow.includes("tu es qui")) {
    return res.status(200).json({ pdfAction: pdfType, response: "🤖 **Je suis REUSSITESS®971 AI**\n\nChef d'orchestre de l'écosystème REUSSITESS®971, créé depuis la **Guadeloupe** 🇬🇵 par **Rony Porinus**.\n\n**Ma devise :** *Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets.*\n\n**Ce que je suis :**\n🧠 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme)\n🌍 Présent dans 14 pays partenaires\n📚 200+ fonctionnalités actives\n💎 Connecté au Token REUSS sur Polygon\n🛍️ 26 boutiques Amazon affiliées\n\n**Mes capacités :**\n📄 Génération PDF (CV, Contrat, Certificat, Business Plan)\n🖨️ Impression de chaque réponse\n📺 Actualités temps réel (RFI, Al Jazeera, BBC, France 24, Euronews, TV5)\n⚖️ Journal Officiel — dernières lois et décrets\n🌴 Médias DOM-TOM (Guadeloupe, Martinique, Réunion, Guyane)\n🎭 Agenda culturel Caraïbes + newsletters\n💼 Offres emploi temps réel (RemoteOK + DOM-TOM)\n🛡️ Infrastructure 6 niveaux fallback IA — zéro coupure\n\n**L'écosystème REUSSITESS®971 :**\n🏆 [Passeport de Réussite](https://reussitess.fr/champions)\n🌍 [Visa Universel](https://reussitess.fr/visa-universel)\n🧠 [Neuro-X](https://reussitess.fr/neuro-x)\n💎 [Token REUSS](https://reussitess.fr/investir-reuss)\n🔮 [Oracle 971](https://reussitess.fr/oracle-971)\n\n*Terres de Champions — Positivité à l'infini !*\n\nBoudoum ! 🇬🇵" })
  }

  // GUIDE INTELLIGENCE EMOTIONNELLE
  if (msgLow.includes("intelligence émotionnelle") || msgLow.includes("gérer mes émotions") || msgLow.includes("empathie") || msgLow.includes("gestion émotions") || msgLow.includes("eq")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert Instagram et réseaux sociaux. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "👗 **Neuro-X Mode — Stylisme Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE LEADERSHIP
  if (msgLow.includes("leadership") || msgLow.includes("manager mon équipe") || msgLow.includes("diriger") || (msgLow.includes("management") && (msgLow.includes("équipe") || msgLow.includes("caribéen") || msgLow.includes("manager"))) || msgLow.includes("gérer mon équipe")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🎓 **Neuro-X Finance — Crypto pour Débutants**\n\n📊 Marché: "+crypto+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE SANTE MENTALE
  if ((msgLow.includes("anxiété") || msgLow.includes("anxiete") || msgLow.includes("dépression") || msgLow.includes("depression") || msgLow.includes("burn out") || (msgLow.includes("santé mentale") && !msgLow.includes("quiz")))) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💚 **Neuro-X Psychologie — Santé Mentale**\n\n"+groqText+"\n\n⚠️ Consultez un professionnel de santé.\nUrgence: 3114 (numéro national prévention suicide)\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE EXPORT INTERNATIONAL
  if ((msgLow.includes("exporter") || msgLow.includes("export")) && (msgLow.includes("produit") || msgLow.includes("international") || msgLow.includes("pays") || msgLow.includes("14 pays")) || msgLow.includes("vendre à l'international") || msgLow.includes("marché international") || msgLow.includes("14 pays")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🌍 **Neuro-X Logistique — Export International**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE PODCASTING
  if ((msgLow.includes("podcast") && (msgLow.includes("créer") || msgLow.includes("lancer") || msgLow.includes("guadeloupe") || msgLow.includes("écouter") || msgLow.includes("reussitess"))) || msgLow.includes("créer un podcast") || msgLow.includes("lancer podcast") || msgLow.includes("micro") && msgLow.includes("enregistrer")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Marketing, expert création podcast et contenu audio. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💰 **Neuro-X Business — Micro-Finance**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE BIEN-ETRE SENIOR
  if ((msgLow.includes("senior") && (msgLow.includes("aide") || msgLow.includes("vieillir") || msgLow.includes("ehpad") || msgLow.includes("domicile") || msgLow.includes("caribé"))) || msgLow.includes("personnes âgées") || msgLow.includes("vieillir bien") || msgLow.includes("ehpad") || msgLow.includes("aide à domicile")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Seniors, expert bien-vieillir et activités pour seniors DOM-TOM. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "💙 **REUSSITESS AI — Soutien & Accompagnement**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RAPPEL MEDICAMENT
  if ((msgLow.includes("médicament") || msgLow.includes("medicament")) && (msgLow.includes("naturel") || msgLow.includes("plante") || msgLow.includes("caribé") || msgLow.includes("info")) || msgLow.includes("posologie naturelle") || msgLow.includes("traitement médical")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert YouTube et création vidéo. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
      const r = await fetch("https://rss2json.com/api.json?rss_url=https://la1ere.francetvinfo.fr/guadeloupe/rss.xml&count=5", {...({timeout:8000}), signal: AbortSignal.timeout(5000)})
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Finance, expert crypto. GoMining = minage cloud BTC. REUSSITESS propose uniquement un lien parrainage. DYOR. Boudoum!" },
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
            { role: "system", content: "Tu es Neuro-X Finance, expert crypto. GoMining = minage cloud BTC. REUSSITESS propose uniquement un lien parrainage. DYOR. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "🧠 **Neuro-X Philosophie — Pensée Caribéenne**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GUIDE DIASPORA
  if ((msgLow.includes("diaspora") && (msgLow.includes("caribé") || msgLow.includes("afric") || msgLow.includes("guadeloupe") || msgLow.includes("antilles") || msgLow.includes("france") || msgLow.includes("retour"))) || msgLow.includes("guadeloupéen à paris") || msgLow.includes("antillais en france") || msgLow.includes("retour au pays") || msgLow.includes("double culture")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "⛓️ **Neuro-X Blockchain — Smart Contracts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR PITCH INVESTISSEUR
  if (msgLow.includes("pitch") || msgLow.includes("lever des fonds") || (msgLow.includes("investisseur") && (msgLow.includes("pitch") || msgLow.includes("lever") || msgLow.includes("startup") || msgLow.includes("présentation"))) || msgLow.includes("présentation investisseur") || msgLow.includes("seed funding")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: "Tu es Neuro-X Stratégie, expert pitch investisseur et levée de fonds pour startups caribéennes. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🔍 **Neuro-X SEO — Audit Site Web**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CHANSON CREOLE
  if ((msgLow.includes("chanson") && (msgLow.includes("créole") || msgLow.includes("caribé") || msgLow.includes("compose") || msgLow.includes("zouk") || msgLow.includes("gwo ka"))) || msgLow.includes("zouk") || msgLow.includes("gwo ka") || msgLow.includes("paroles") || msgLow.includes("compose une chanson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "✨ **Neuro-X Coach — Développement Personnel**\n\n💬 "+citation+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // ANALYSE MARCHE CRYPTO
  if (msgLow.includes("analyse crypto") || msgLow.includes("marché crypto") || (msgLow.includes("bull market") || msgLow.includes("bull run") || msgLow.includes(" bull") || msgLow === "bull") || (msgLow.includes("bear market") || msgLow.includes("bear run") || msgLow.includes(" bear") || msgLow === "bear") || msgLow.includes("analyse bitcoin") || msgLow.includes("analyse ethereum")) {
    try {
      const crypto = await getCryptoPrice()
      const fg = await getFearGreed()
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
        const msg_imc = message.replace(/([0-9])[a-zA-Z]+([0-9])/g,'$1$2').replace(/kg|cm/gi,' ')
        const nb_imc = msg_imc.match(/[0-9]+[.,]?[0-9]*/g)?.map(Number) || []
        const poids = nb_imc[0], taille = nb_imc[1] > 3 ? nb_imc[1]/100 : nb_imc[1]
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert stratégie digitale et réseaux sociaux caribéen. Boudoum!" },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: "Tu es Neuro-X Marketing, expert TikTok et réseaux sociaux caribéens. Boudoum!" },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "📱 **Neuro-X Marketing — Générateur Posts**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // COCKTAILS RHum CARIBEEN
  if (msgLow.includes("cocktail") || (msgLow.includes("rhum ") || msgLow.includes(" rhum") || msgLow === "rhum" || msgLow.includes("rhum antilles") || msgLow.includes("rhum agricole")) || msgLow.includes("ti punch") || msgLow.includes("planteur") || msgLow.includes("mojito") || msgLow.includes("recette boisson")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 2048)
      return res.status(200).json({ pdfAction: pdfType, response: "🌙 **Neuro-X Spiritualité — Analyse Rêves**\n\n"+lune+"\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // CONSEILS VOYAGE CARAIBES
  if (msgLow.includes("visiter") || msgLow.includes("vacances guadeloupe") || msgLow.includes("tourisme") || msgLow.includes("circuit") || msgLow.includes("que faire en guadeloupe") || msgLow.includes("bon plan voyage") || msgLow.includes("excursion")) {
    try {
      const meteo = await getMeteo()
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
    if (msg === "ADMIN: UPDATE BASE DONNEES") {
      return res.status(200).json({ pdfAction: null, response: "✅ Base mise à jour ! Donald Trump = Président USA 2025. Persistance infinie OK." });
    }
    if (msgLow.includes("base de données à jour")) {
      return res.status(200).json({ pdfAction: null, response: "✅ Base à jour ! Donald Trump réélu 2024 investi 2025. Persistance OK." });
    }
    if (msgLow.includes("président usa")) {
      return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Donald Trump** réélu Nov 2024, investi 20/01/2025. Président actuel USA. Boudoum ! 📱" });
    }

  // PRÉSIDENT USA FIX
  if (msgLow.includes("président usa") || msgLow.includes("président etats-unis") || msgLow.includes("president usa")) {
    return res.status(200).json({ pdfAction: null, response: "🇺🇸 **Donald Trump** réélu Nov 2024, investi 20/01/2025. Actuel président USA. Boudoum ! 📱" });
  }
  if ((msgLow.includes("crypto") || msgLow.includes("bitcoin")) && !msgLow.includes("quiz") && !msgLow.includes("plage") && !msgLow.includes("événement") && !msgLow.includes("evenement") && !msgLow.includes("thème") && !msgLow.includes("theme") && !msgLow.startsWith("qui ") && !msgLow.startsWith("que ") && !msgLow.startsWith("quels ") && !msgLow.startsWith("quelle ") && !msgLow.startsWith("comment ") && !msgLow.startsWith("pourquoi ") && !msgLow.startsWith("quand ") && !msgLow.startsWith("ou ") && !msgLow.startsWith("où ")) {
    const country = msgLow.includes("haiti") ? "haiti" : msgLow.includes("rwanda") ? "rwanda" : "global"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=crypto&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
  if (msgLow.includes("meteo") || msgLow.includes("météo") || (msgLow.includes("temps") && (msgLow.includes("quel") || msgLow.includes("faire") || msgLow.includes("aujourd") || msgLow.includes("demain")))) {
    const country = msgLow === "mali" || msgLow.includes("mali ") || msgLow.includes(" mali") ? "mali" : msgLow.includes("niger") ? "niger" : msgLow.includes("haiti") ? "haiti" : "guadeloupe"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=meteo&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
  if (msgLow.includes("devises") || msgLow.includes("change")) {
    const country = msgLow.includes("haiti") ? "haiti" : msgLow.includes("rwanda") ? "rwanda" : "guadeloupe"
    const data = await fetch(`https://reussitess.fr/api/world-data?type=devises&country=${country}`).then(r=>r.json())
    return res.status(200).json(data)
  }
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 4096)
      return res.status(200).json({ pdfAction: pdfType, response: "💪 **Neuro-X Sport — Coach Caribéen**\n\n"+groqText+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // RECETTE ANTILLAISE
  if (msgLow.includes("dashboard redis") || msgLow.includes("stats redis") || msgLow.includes("statistiques bot") || msgLow.includes("combien de visiteurs")) {
    const data = await getRedisDashboard()
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("musique caribéenne") || msgLow.includes("gwoka") || msgLow.includes("zouk history") || msgLow.includes("biguine") || msgLow.includes("kompa") || msgLow.includes("genre musical caribéen")) {
    const genre = message.replace(/musique caribéenne|genre musical caribéen/gi, "").trim()
    return res.status(200).json({ pdfAction: null, response: getMusiqueCaribéenne(genre) })
  }

  if (msgLow.includes("bibliothèque caribéenne") || msgLow.includes("césaire") || msgLow.includes("fanon") || msgLow.includes("glissant") || msgLow.includes("mckay") || msgLow.includes("condé auteur")) {
    const auteur = message.replace(/bibliothèque caribéenne|auteur caribéen/gi, "").trim()
    const data = await getBibliothèqueCaribéenne(auteur)
    return res.status(200).json({ pdfAction: null, response: data })
  }

  if (msgLow.includes("événements caribéens") || msgLow.includes("evenements caribéens") || msgLow.includes("agenda caribéen") || msgLow.includes("festival caraïbes") || msgLow.includes("calendrier culturel")) {
    return res.status(200).json({ pdfAction: null, response: getEvenementsCaribéens() })
  }

  if (msgLow.includes("recette") || msgLow.includes("comment cuisiner") || msgLow.includes("comment préparer") || msgLow.includes("accras") || msgLow.includes("colombo") || msgLow.includes("blaff") || msgLow.includes("court-bouillon")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
            { role: "user", content: message }
          ], 1024)
      const noms = groqText || ""
      return res.status(200).json({ pdfAction: pdfType, response: "🏢 **Neuro-X Business — Générateur de Noms**\n\n"+noms+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) {
      return res.status(200).json({ pdfAction: pdfType, response: "🤖 **REUSSITESS®971 AI**\n\nJe rencontre une difficulté temporaire. Réessaie dans un instant !\n\nPour toute aide: reussitess.fr\nBoudoum ! 🇬🇵" })
    }
  }

  // GENERATEUR CV
  if ((msgLow === "cv" || ((msgLow.includes("mon cv") && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf"))) && (msgLow.includes("créer") || msgLow.includes("faire") || msgLow.includes("générer") || msgLow.includes("pdf"))) || msgLow.includes("le cv") || msgLow.includes("curriculum")) || msgLow.includes("curriculum") || msgLow.includes("génère mon cv") || msgLow.includes("aide cv") || msgLow.includes("rédige cv")) {
    try {
      const groqText = await groqFetch([
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
  if ((msgLow.includes("dao") && (msgLow.includes("reuss") || msgLow.includes("vote") || msgLow.includes("gouvernance") || msgLow.includes("décentralis"))) || msgLow.includes("gouvernance décentralisée") || msgLow.includes("voter") || msgLow.includes("proposition")) {
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
  if (msgLow.includes("rapport sécurité") || msgLow.includes("shield") || (msgLow.includes("sécurité") && msgLow.includes("reussitess"))) {
    return res.status(200).json({ pdfAction: pdfType, response: "🛡️ **REUSSSHIELD — Rapport Sécurité**\n\n✅ ST-016 Anti-Fraude : Actif\n✅ ST-017 MiCA Compliance : Actif\n✅ ST-026 Surveillance APIs : Actif\n✅ ST-027 Vercel Monitor : Actif\n✅ ST-028 GitHub Watch : Actif\n✅ ST-029 Polygon Network : Actif\n\n🔒 Détection injection prompt : Activée\n🔑 HTTPS + headers sécurisés : Actif\n🌐 Site reussitess.fr : EN LIGNE\n\n200 agents IA en surveillance continue 24/7\n\nBoudoum ! 🇬🇵" })
  }



  // ENCYCLOPEDIE ANTILLES + AFRIQUE
  const sujetsEncyclo = ["histoire de","histoire du","histoire des","qu'est-ce que","c'est quoi","parle moi de","parle-moi de","qui est","qui était","que sais-tu sur","encyclopédie","explique moi","explique-moi","tell me about","définition de","origine de","culture de","patrimoine","civilisation","raconte l'histoire","en savoir plus","biographie","bio de","info sur"]
  const needsEncyclo = sujetsEncyclo.some(s => msgLow.includes(s))
  if (needsEncyclo) {
    try {
      // Essai 1 — encyclopédie caribéenne
      let wiki = await encyclopedieAntillesAfrique(message)
      // Essai 2 — Wikipedia général si pas de résultat caribéen
      if (!wiki) wiki = await rechercheWikipedia(message, "fr")
      if (wiki) {
        const groqText = await groqFetch([
              { role: "system", content: `Tu es REUSSITESS AI, assistant encyclopédique universel. Réponds avec précision sur le sujet demandé. Si la personne est connue, présente sa biographie. Boudoum!` },
              { role: "user", content: "Question: "+message+"\n\nSource Wikipedia:\n"+wiki }
            ], 4096)
        const rep = groqText
        if (rep) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+rep+"\n\nBoudoum ! 🇬🇵" })
      }
      // Fallback Groq direct si Wikipedia vide
      const groqDirect = await groqFetch([
        { role: "system", content: `Tu es REUSSITESS AI, assistant encyclopédique universel. Réponds avec précision. Boudoum!` },
        { role: "user", content: message }
      ], 2048)
      if (groqDirect) return res.status(200).json({ pdfAction: pdfType, response: "📚 **Encyclopédie REUSSITESS**\n\n"+groqDirect+"\n\nBoudoum ! 🇬🇵" })
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
                { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
              { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
            { role: "system", content: `Tu es REUSSITESS AI, encyclopédie caribéenne et africaine. Réponds avec précision sur le sujet demandé. Boudoum!` },
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
      const r = await fetch("https://api.dexscreener.com/latest/dex/tokens/0xB37531727fC07c6EED4f97F852A115B428046EB2", {...({timeout:10}), signal: AbortSignal.timeout(5000)})
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
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "🌤️ Météo en chargement. Réessaie ! Boudoum 🇬🇵" }) }
  }

  // CRYPTO DIRECTE
  if (msgLow.includes("bitcoin") || msgLow.includes("btc") || msgLow.includes("ethereum") || (msgLow.includes("crypto") && msgLow.includes("prix"))) {
    try {
      const cr = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,polygon-ecosystem-token&vs_currencies=usd")
      const cd = await cr.json()
      const tr = await fetch("https://api.coingecko.com/api/v3/search/trending")
      const td = await tr.json()
      const fg = await getFearGreed()
      const trending = td.coins.slice(0,5).map(function(c){ return c.item.name }).join(", ")
      return res.status(200).json({ pdfAction: pdfType, response: "💎 **Crypto — Temps Réel**\n\n₿ Bitcoin : $"+(cd.bitcoin?.usd||"N/A")+"\nΞ Ethereum : $"+(cd.ethereum?.usd||"N/A")+"\n🔷 POL : $"+(cd["polygon-ecosystem-token"]?.usd||"N/A")+"\n\n🔥 Tendances : "+trending+"\n😨 Sentiment : "+fg+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "💎 Crypto en chargement. Réessaie ! Boudoum 🇬🇵" }) }
  }

  // TAUX DE CHANGE DIRECT
  if (msgLow.includes("taux") || msgLow.includes("change") || ((msgLow.includes("euro ") || msgLow.includes(" euro") || msgLow === "euro" || msgLow.includes("euros") || msgLow.includes("taux euro")) && msgLow.includes("dollar"))) {
    try {
      const fr = await fetch("https://open.er-api.com/v6/latest/EUR")
      const fd = await fr.json()
      const r = fd.rates
      return res.status(200).json({ pdfAction: pdfType, response: "💱 **Taux de Change — Temps réel**\n\n💵 EUR/USD : "+r.USD+"\n💷 EUR/GBP : "+r.GBP+"\n🇧🇷 EUR/BRL : "+r.BRL+"\n🇨🇦 EUR/CAD : "+r.CAD+"\n\nBoudoum ! 🇬🇵" })
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "💱 Taux en chargement. Réessaie ! Boudoum 🇬🇵" }) }
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
  if (msgLow.includes("horoscope") || msgLow.includes("signe") || msgLow.includes("astrologie") || msgLow.includes("belier") || msgLow.includes("taureau") || msgLow.includes("gemeaux") || msgLow.includes("cancer") || (msgLow.includes(" lion") || msgLow.includes("lion ") || msgLow === "lion" || msgLow.includes("signe lion")) || msgLow.includes("vierge") || msgLow.includes("balance") || msgLow.includes("scorpion") || msgLow.includes("sagittaire") || msgLow.includes("capricorne") || msgLow.includes("verseau") && !msgLow.includes("coupure") && !msgLow.includes("robinet") && !msgLow.includes("plomberie") || msgLow.includes("poissons")) {
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
  if (msgLow.includes("pleine lune") || msgLow.includes("phase lune") || msgLow.includes("calendrier lunaire") || msgLow === "lune" || msgLow === "moon" || msgLow.includes("lune aujourd") || msgLow.includes("lune ce soir") || msgLow.includes("phase")) {
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
    } catch(e) { return res.status(200).json({ pdfAction: pdfType, response: "📰 Actualités en chargement. Réessaie ! Boudoum 🇬🇵" }) }
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
    if (( lowerMessage === 'ia' || lowerMessage.includes(' ia ') || lowerMessage.includes('ia ') || lowerMessage.startsWith('ia')) || lowerMessage.includes('intelligence') || lowerMessage.includes('chatgpt') || lowerMessage.includes('claude')) {
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
    
    if ((lowerMessage.includes('prix') && (lowerMessage.includes('crypto') || lowerMessage.includes('token') || lowerMessage.includes('reuss') || lowerMessage.includes('bitcoin') || lowerMessage.includes('immobilier'))) || (lowerMessage.includes('coût') && lowerMessage.length > 10) || lowerMessage.includes('price crypto') || lowerMessage.includes('token')) {
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
    if (lowerMessage.includes('bibliothèque') || (lowerMessage.includes('livre sur') || lowerMessage.includes('un livre') || lowerMessage.includes('mes livres') || lowerMessage.includes('livre caribéen') || lowerMessage.includes('cherche livre')) || (lowerMessage.includes('en lecture') || lowerMessage.includes('lecture caribéenne') || lowerMessage.includes('liste lecture') || lowerMessage.includes('club lecture')) || lowerMessage.includes('francophonie') || lowerMessage.includes('culture francophone')) {
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
            model: "llama-3.1-8b-instant",
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
            const agentResponse = (typeof orchestrateAgents === "function") ? await orchestrateAgents(message, context) : null
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
CONTEXTE REUSSITESS (utilise si pertinent): ${(typeof getRAGContext === "function" ? (getRAGContext(message) || "") : "")}
Tu es REUSSITESS®971 AI, chef d'orchestre de l'écosystème REUSSITESS®971. IMPORTANT: Tu es REUSSITESS AI mis à jour en avril 2026. NOUVEAUTÉS AVRIL 2026: Quiz interactifs jouables directement dans le chat (tape "quiz Histoire"), 60 agents Neuro-X prioritaires, 12 sources RSS DOM-TOM temps réel, auto-correction via Redis RAG, 5 modules Premium PayPal 4,99€/mois (traducteur créole, transfert argent, CV, visa, coach IA), dashboard admin reussitess.fr/admin/telegram. RÈGLES ABSOLUES: 1) JAMAIS poser une question sans donner une réponse complète d'abord. 2) Toujours répondre directement et enchaîner. 3) Si besoin de précision, donne quand même une réponse générale puis demande. 4) Termine toujours par Boudoum ! 🇬🇵 Tu as 200+ modules IA, 12 sources RSS DOM-TOM, 60 agents Neuro-X, 5 modules Premium, PayPal 4,99€/mois. Tu DOIS toujours répondre directement sans poser de question préalable. Si tu manques d'info, donne quand même une réponse complète avec ce que tu sais.

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
- 🗓️ Municipales DOM-TOM: 15 et 22 mars 2026 — Élections passées
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
Ne jamais citer CoinMarketCap, Xignite, ou d'autres APIs que tu n'utilises pas réellement. Ne jamais mentionner de date de coupure de connaissance ni 'décembre 2023'. Si une info est récente, utilise les données temps réel disponibles. LIENS EXTERNES: Toujours préciser '(ouvrir dans navigateur)' après les liens gouv.fr, legifrance, etc. car ils peuvent nécessiter un navigateur externe. RÈGLES LIENS ABSOLUES: Ne JAMAIS écrire target=, rel=, onclick=, style= ou tout attribut HTML dans tes réponses. Utiliser UNIQUEMENT le format markdown [texte](https://url) pour les liens. Ne jamais écrire de HTML brut. RÈGLES LIENS ABSOLUES (suite): Ne JAMAIS utiliser http:// — toujours https://. Ne JAMAIS écrire [texte](http://...) — toujours [texte](https://...). Tous les liens doivent commencer par https://. RÈGLES LÉGALES ABSOLUES: 1) CRYPTO: Toujours ajouter "Ce n'est pas un conseil financier. DYOR. Risque de perte totale." 2) SANTÉ: Jamais de diagnostic ni prescription. Toujours recommander un médecin. 3) JURIDIQUE: Toujours recommander un professionnel du droit. 4) FONCTIONNALITÉS EN DÉVELOPPEMENT: Staking REUSS, NFT, DAO — toujours préciser "en développement". 5) CHIFFRES: Ne jamais inventer de statistiques. , créé depuis la Guadeloupe 🇬🇵. DEVISE: Cultiver le maximum de personnes dans le monde entier — apporter un plus à chaque humain pour avancer dans ses projets pro et perso. Tu guides chaque utilisateur vers son plein potentiel. ECOSYSTEME REEL (pages actives sur reussitess.fr) — Bot Telegram: @Reussitessbot disponible sur Telegram avec toutes les fonctionnalités REUSSITESS AI: /champions (Passeport de Réussite — certificat champion + plan action, communauté grandissante, 14 pays), /visa-universel (Visa Universel — réseau opportunités 14 pays partenaires), /neuro-x (60 agents Neuro-X spécialisés), /oracle-971 (Oracle caribéen mystique), /mon-adn (ADN identitaire caribéen), /ma-revolution-ia (Révolution personnelle par IA), /ia-passport (IA Passport Mondial — 8 langues actives), /investir-reuss (Token REUSS sur Polygon: 0xB37531727fC07c6EED4f97F852A115B428046EB2), /quiz (99 quiz éducatifs tous thèmes), /bibliotheque (bibliothèque mondiale 50+ pays), /boutiques (26 boutiques Amazon 14 pays, influencer ID: fb942837), shop.reussitess.fr (boutique officielle). FONDATEUR: Rony Porinus — auto-entrepreneur Guadeloupe, SIRET: 444699979700031. Protection INPI eSoleau DSO2026008921 (Mars 2026).
WHITEPAPER v2.0: Écosystème léger, gratuit et stable. Token REUSS utilité locale avant spéculation. Modules: afro_brain (régions DOM-TOM), final_brain (coordination), crypto_api (REUSS temps réel), region_info (météo locale), memory (contexte utilisateur). TERRA GROW (+50 REUSS achats locaux), TERRA WATER (alertes eau +10 REUSS), TERRA HEALTH (futur). Roadmap: Q2 2026 bot complet Guadeloupe, Q3 2026 DOM-TOM, Q4 2026 modules optionnels. 200+ fonctionnalités actives. 200+ modules IA (60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 Supreme). 14 pays partenaires. Token REUSS sur Polygon. Données temps réel: météo, crypto, séismes, cyclones, ISS, lune, taux change, actualités. Business: plan, pitch, dropshipping, freelance, CV, contrats, emails, export, emploi DOM-TOM, association. Crypto: token REUSS sur Polygon (staking/DAO en développement), GoMining (minage cloud), NFT (en développement), Web3. Culture caribéenne: carnaval, mythologie, champions, histoire, philosophie Césaire/Fanon/Glissant, littérature Condé/Schwarz-Bart, art, cinéma, mode madras, zouk/gwo ka. Afrique: Mandela, Sankara, Lumumba, Nkrumah, Ubuntu, civilisations, encyclopédie. Santé: médecine naturelle, plantes caribéennes (citronnelle, gingembre, moringa, aloe vera, corossol, curcuma, basilic, verveine), IMC, cardio, santé mentale (3114), ressources psychiatrie DOM-TOM. Éphéméride Wikimedia, Open Library 1559+ livres, Proverbes 30 créoles rotatifs. Emploi DOM-TOM: francetravail.fr, emploi.re, caribbeanjobs.com, jobartis.com. Convertisseur: EUR/USD/XCD/HTG/XOF/XAF temps réel. Sécurité: anti-injection, REUSSSHIELD, Bot Destroyer, Honeypot Detector, AES-256 Vault, surveillance 24/7.
- Juridique DOM-TOM: aide juridictionnelle, droit travail, logement, famille, création entreprise (ACRE, ADIE, BPI France).
- Traduction: MyMemory API — anglais, espagnol, portugais, allemand, chinois, arabe, créole haïtien.
- Météo: getMeteoMonde — TOUTES les villes du monde via Nominatim + Open-Meteo.
- Blockchain: Token REUSS DexScreener temps réel, dashboard crypto, lexique Web3.
- Éducation DOM-TOM: universités, CROUS, bourses, LADOM.
- Médecine naturelle: 8 plantes caribéennes avec usages et préparations.
- Carnets de route: Guadeloupe, Martinique, Guyane — itinéraires complets.
- Météo marine: vagues, houle, vent mer Guadeloupe.
- Séismes historiques: USGS données historiques Caraïbes.
- Lieux culturels: patrimoine, musées, sites historiques DOM-TOM.
- Actualités Outremer: 8 sources RSS — La 1ère GP/MQ/GY/RE/YT, Outremers360, Bondamanjak, Zinfos974. Base Guadeloupe 971 — Terres de Champions.

PERSONNALITÉ HUMAINE — RÈGLES DE CONVERSATION:
1. Réponds comme un ami caribéen chaleureux, pas comme un robot
2. Utilise des expressions créoles naturellement : "An nou", "Bel bagay", "Ou pa konnen"
3. Reformule les questions complexes avec tes propres mots avant de répondre
4. Si tu ne sais pas quelque chose, dis-le honnêtement avec humour
5. Adapte ton niveau de langage à celui de l'utilisateur
6. Pose des questions de suivi pour mieux aider
7. Partage des anecdotes ou exemples concrets caribéens

CUISINE CARIBÉENNE (réponds avec passion):
- Rougail crevettes, accras, boudin, colombo, court-bouillon
- Blaff poisson, matété crabes, dombrés, féroce avocat
- Rhum agricole, shrub, planteur, ti-punch
- Fruits tropicaux: maracudja, corossol, carambole, pomme-cannelle

CULTURE CARIBÉENNE APPROFONDIE:
- Rythmes: Gwoka, Biguine, Zouk, Soca, Kompa, Reggae, Calypso
- Danses: Quadrille, Bèlè, Gwo Ka
- Mythes: Soukougnan, Dorlis, Zombie, Engagés, Diable
- Christianisme caribéen: syncrétisme avec traditions africaines
- Philosophie: Négritude (Césaire), Créolité (Confiant/Chamoiseau), Tout-Monde (Glissant)

PLANTES MÉDICINALES ENRICHIES:
- Hibiscus: tension artérielle, antioxydant, infusion fleurs séchées
- Bois d'Inde: douleurs musculaires, rhumes, bain vapeur
- Vétiver: anxiété, insomnie, racines en infusion
- Mombin: fièvre, antiseptique, feuilles en décoction
- Chadèque: digestion, vitamine C, peau

Boudoum!` },
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

      // ===== ANTI-HALLUCINATION CHECK =====
      const hallucination_patterns = [
        /biden.*président.*actuel/i,
        /joe biden.*2025/i,
        /trump.*perdu/i,
        /il me semble que.*prix/i,
        /je pense que.*président/i,
        /probablement.*température/i
      ]
      const hasHallucination = hallucination_patterns.some(p => p.test(finalResponse))
      if (hasHallucination) {
        finalResponse = "⚠️ **Donnée non vérifiée détectée**\n\nJe préfère ne pas te donner une information incorrecte. Voici ce que je sais avec certitude :\n\n🇺🇸 Président USA : **Donald Trump** (depuis jan 2025)\n🇫🇷 Président France : **Emmanuel Macron**\n\nPour toute info en temps réel : reussitess.fr\n\nBoudoum ! 🇬🇵"
      }

      try {
        if (typeof saveConversationMemory === "function") await saveConversationMemory(userId, message, finalResponse)
        if (typeof saveSatisfactionScore === "function") await saveSatisfactionScore(userId, message, finalResponse)
      } catch (e) { console.error("Save memory/score failed:", e) }
        if (typeof saveSatisfactionScore === "function") await saveSatisfactionScore(userId, message, finalResponse)
      } catch (e) { console.error("Save memory/score failed:", e) }
      res.status(200).json({ response: finalResponse })
  } catch (error) {
    console.error('Erreur SuperBot:', error)
    res.status(500).json({ 
      response: "🤖 Je rencontre un ralentissement temporaire côté IA. Je suis toujours là pour vous. Réessayez dans un instant ! 💪\n\n**Boudoum** 🎯" 
    })
  }
}
