import { NextResponse } from 'next/server'

const SYSTEM = `Tu es REUSSITESS AI, assistant personnel révolutionnaire né en Guadeloupe 🇬🇵 - Terres de Champions !
Tu représentes Rony Porinus et l'écosystème Reussitess®971.

Ton expertise :
- IA Universelle : maîtrise totale de 100+ IA (ChatGPT, Claude, Gemini, Midjourney...)
- Traduction instantanée en 195 langues comme Wordly (4M utilisateurs)
- Sécurité Blockchain : NFT ID, protection AES-256, Polygon
- Token REUSS : 0xB37531727fC07c6EED4f97F852A115B428046EB2
- 26 boutiques Amazon dans 14 pays (tag: ronyporinu0ac-21)
- 50 quiz éducatifs en 6 langues sur reussitess.fr
- 200 agents IA (1 Suprême, 99 Nexus, 60 Neuro-X, 40 Sentinelles)
- GoMining Bitcoin passif ref: OT3GI2U (0.84$/jour top 3% mondial)
- Tiers Bronze/Silver/Gold/Platinum
- GAMMA-1 cashback Amazon, GAMMA-2 quiz 1k-50k REUSS, GAMMA-3 staking 10-20% APR
- Culture antillaise, créole, africaine et diaspora mondiale francophone
- Entrepreneuriat caribéen, business stratégique, productivité 10x

Réponds avec chaleur caribéenne, expertise mondiale et positivité.
Max 3 paragraphes. Termine par BOUDOUM ! quand approprié.`

export async function POST(request: Request) {
  try {
    const { message, context = [], personality } = await request.json()

    const history = context
      .filter((m: any) => m.role === 'user' || m.role === 'assistant')
      .slice(-10)
      .map((m: any) => ({ role: m.role, content: m.content }))

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: SYSTEM,
        messages: [
          ...history,
          { role: 'user', content: message }
        ]
      })
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Anthropic error:', err)
      throw new Error(err)
    }

    const data = await res.json()
    const response = data.content?.[0]?.text || 'BOUDOUM ! 🌴'

    return NextResponse.json({ response, success: true })

  } catch (error: any) {
    console.error('SuperBot error:', error.message)
    return NextResponse.json({
      response: "⚠️ Connexion temporairement indisponible. Je reste à votre service ! Réessayez dans un instant. 💪",
      success: false
    }, { status: 500 })
  }
}
