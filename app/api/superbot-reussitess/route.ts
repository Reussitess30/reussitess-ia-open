import { NextResponse } from 'next/server'

const GROQ_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter(Boolean)

let currentKeyIndex = 0

const SYSTEM_PROMPT = `Tu es le SuperBot officiel de Reussitess®971 — Terres De Champions !
Tu représentes Rony Porinus depuis la Guadeloupe 🇬🇵.
Tu connais TOUT sur :
- Les 50 quiz éducatifs en 6 langues sur reussitess.fr
- Le token REUSS sur Polygon (contrat 0xB37531727fC07c6EED4f97F852A115B428046EB2)
- Les 26 boutiques Amazon dans 14 pays (tag: ronyporinu0ac-21)
- Les 200 agents IA (1 Suprême, 99 Nexus, 60 Neuro-X, 40 Sentinelles)
- GoMining Bitcoin passif (ref: OT3GI2U)
- Les tiers Bronze/Silver/Gold/Platinum
- Les vecteurs GAMMA-1 (Amazon), GAMMA-2 (Quiz), GAMMA-3 (Staking)
- La culture antillaise, créole, africaine et la diaspora mondiale

NOUVELLES CAPACITÉS (APIs actives) :
- Prix REUSS temps réel via /api/crypto-price (CoinGecko + DexScreener Polygon)
- Prix MATIC/Polygon en direct avec variation 24h et market cap
- Liquidité et volume pool QuickSwap REUSS en temps réel
- Actualités Guadeloupe, Martinique, DOM-TOM et Afrique via /api/news-gwada
- Sources : RCI Guadeloupe, France-Antilles, Outre-mer 1ère, Le Monde Afrique
- Tu peux donner le prix actuel du token REUSS et de MATIC sur Polygon

Réponds toujours avec positivité, énergie et finis par BOUDOUM ! si approprié.
Sois concis, utile et chaleureux. Max 3 paragraphes.`

async function callGroq(message: string, history: any[]) {
  for (let i = 0; i < GROQ_KEYS.length; i++) {
    const keyIndex = (currentKeyIndex + i) % GROQ_KEYS.length
    const apiKey = GROQ_KEYS[keyIndex]

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      }),
    })

    const data = await response.json()

    if (data.error?.code === 'rate_limit_exceeded') {
      console.log(`Clé Groq ${keyIndex + 1} rate limitée, essai clé suivante...`)
      continue
    }

    if (data.choices?.[0]) {
      currentKeyIndex = (keyIndex + 1) % GROQ_KEYS.length
      return data.choices[0].message.content
    }

    throw new Error(JSON.stringify(data.error))
  }

  throw new Error('toutes_groq_saturées')
}

async function callOpenRouter(message: string, history: any[]) {
  console.log('Fallback OpenRouter activé')
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message }
      ],
      max_tokens: 500,
    }),
  })

  const data = await response.json()
  console.log('OpenRouter response:', JSON.stringify(data))

  if (data.choices?.[0]) {
    return data.choices[0].message.content
  }

  throw new Error(JSON.stringify(data.error))
}

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    let reply: string

    try {
      reply = await callGroq(message, history)
    } catch (err: any) {
      if (err.message === 'toutes_groq_saturées') {
        reply = await callOpenRouter(message, history)
      } else {
        throw err
      }
    }

    return NextResponse.json({ reply, success: true })

  } catch (error: any) {
    console.error('SuperBot error:', error.message)
    return NextResponse.json({
      reply: "Système en maintenance — Positivité à l'Infini ! 🌴",
      success: false
    }, { status: 500 })
  }
}
