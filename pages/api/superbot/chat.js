const localData = {
  guadeloupe: "🇬🇵 La Guadeloupe est une île des Caraïbes, département français d'outre-mer. Terres De Champions ! Rony Porinus y a fondé Reussitess®971 pour la diaspora mondiale francophone. BOUDOUM ! 🌴",
  reuss: "💎 REUSS est le token utilitaire officiel de Reussitess®971 sur Polygon. Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2. Gagnez des REUSS en faisant des quiz, cashback Amazon et staking 10-20% APR !",
  quiz: "🎓 50 quiz éducatifs en 6 langues sur reussitess.fr ! Gagnez 1 000 à 50 000 REUSS selon le niveau. BOUDOUM !",
  amazon: "🛍️ 26 boutiques Amazon dans 14 pays ! USA, France, Belgique, Allemagne, Italie, Espagne, Canada, UK, Australie, Inde, Pays-Bas, Suède, Singapour et Brésil. Tag : ronyporinu0ac-21",
  gomining: "⛏️ GoMining Bitcoin passif ! Lien : gomining.com/?ref=OT3GI2U. Rony génère 0.84$/jour — top 3% mondial !",
  staking: "💰 Stakez vos REUSS pour 10-20% APR via GAMMA-3 ! 1 REUSS staké = 1 vote dans la gouvernance.",
  ia: "🤖 200 agents IA : 1 Suprême, 99 Nexus, 60 Neuro-X, 40 Sentinelles — architecture hiérarchique sur 14 pays !",
  boudoum: "🌴 BOUDOUM ! Cri de guerre de Reussitess®971 — Positivité à l'Infini depuis la Guadeloupe 🇬🇵",
}

function getLocalResponse(message) {
  const msg = message.toLowerCase()
  if (msg.includes('guadeloupe') || msg.includes('971') || msg.includes('antill')) return localData.guadeloupe
  if (msg.includes('staking') || msg.includes('stake') || msg.includes('apr')) return localData.staking
  if (msg.includes('reuss') || msg.includes('token') || msg.includes('polygon')) return localData.reuss
  if (msg.includes('quiz') || msg.includes('éducati')) return localData.quiz
  if (msg.includes('amazon') || msg.includes('boutique') || msg.includes('cashback')) return localData.amazon
  if (msg.includes('gomining') || msg.includes('bitcoin') || msg.includes('minage')) return localData.gomining
  if (msg.includes('boudoum') || msg.includes('champion') || msg.includes('positivit')) return localData.boudoum
  if (msg.includes('ia') || msg.includes('agent') || msg.includes('intelligence')) return localData.ia
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message, context = [] } = req.body
  const localResponse = getLocalResponse(message)

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content: `Tu es REUSSITESS AI depuis la Guadeloupe 🇬🇵 - Terres De Champions !
Tu connais : token REUSS sur Polygon, 26 boutiques Amazon 14 pays, 50 quiz 6 langues, 200 agents IA, GoMining Bitcoin, tiers Bronze/Silver/Gold/Platinum, GAMMA-1/2/3.
Réponds avec positivité caribéenne. Max 3 paragraphes. Termine par BOUDOUM ! si approprié.`
          },
          ...context.slice(-8).filter(m => m.role === 'user' || m.role === 'assistant'),
          { role: 'user', content: message }
        ]
      })
    })

    if (openaiRes.ok) {
      const data = await openaiRes.json()
      const aiResponse = data.choices?.[0]?.message?.content || ''
      const finalResponse = localResponse
        ? `${localResponse}\n\n${aiResponse}`
        : aiResponse
      return res.json({ response: finalResponse, success: true })
    }
  } catch (e) {
    console.error('OpenAI error:', e.message)
  }

  if (localResponse) return res.json({ response: localResponse, success: true })

  return res.json({
    response: "⚠️ Connexion temporairement indisponible. Je reste à votre service ! Réessayez dans un instant. 💪",
    success: false
  })
}
