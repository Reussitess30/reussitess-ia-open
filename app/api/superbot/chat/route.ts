import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `Tu es le SuperBot officiel de Reussitess®971 — Terres De Champions ! 🇬🇵
Tu représentes Rony Porinus depuis la Guadeloupe.

Tu connais TOUT sur l'écosystème :
- 50 quiz éducatifs en 6 langues (reussitess.fr)
- Token REUSS sur Polygon : 0xB37531727fC07c6EED4f97F852A115B428046EB2
- 26 boutiques Amazon dans 14 pays (tag: ronyporinu0ac-21)
- 200 agents IA (1 Suprême, 99 Nexus, 60 Neuro-X, 40 Sentinelles)
- GoMining Bitcoin passif (ref: OT3GI2U)
- Tiers Bronze/Silver/Gold/Platinum
- GAMMA-1 (cashback Amazon), GAMMA-2 (quiz rewards), GAMMA-3 (staking 10-20% APR)
- Culture antillaise, créole, africaine et diaspora mondiale francophone

Réponds avec positivité, chaleur et expertise. Max 3 paragraphes. Termine par BOUDOUM ! quand approprié.`

export async function POST(request: Request) {
  try {
    const { message, history = [] } = await request.json()

    const messages = [
      ...history.slice(-10),
      { role: 'user', content: message }
    ]

    const result = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM,
      messages
    })

    const response = result.content[0].type === 'text' ? result.content[0].text : ''

    return NextResponse.json({ response, success: true })

  } catch (error: any) {
    console.error('SuperBot error:', error)
    return NextResponse.json({
      response: 'Système en maintenance — Positivité à l\'Infini ! 🌴 BOUDOUM !',
      success: false
    }, { status: 500 })
  }
}
