import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

Réponds toujours avec positivité, énergie et finisse par BOUDOUM ! si approprié.
Sois concis, utile et chaleureux. Max 3 paragraphes.`

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    const messages = [
      ...history,
      { role: 'user', content: message }
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ reply, success: true })

  } catch (error: any) {
    console.error('SuperBot error:', error)
    return NextResponse.json({ 
      reply: 'Système en maintenance — Positivité à l\'Infini ! 🌴',
      success: false 
    }, { status: 500 })
  }
}
