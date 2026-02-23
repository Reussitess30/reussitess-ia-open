// Données locales de base (fallback)
const localData = {
  guadeloupe: "🇬🇵 La Guadeloupe est une île des Caraïbes, département français d'outre-mer. Terres De Champions ! Rony Porinus y a fondé Reussitess®971 pour la diaspora mondiale francophone. BOUDOUM ! 🌴",
  reuss: "💎 REUSS est le token utilitaire officiel de Reussitess®971 sur Polygon. Contrat : 0xB37531727fC07c6EED4f97F852A115B428046EB2. Gagnez des REUSS en faisant des quiz, cashback Amazon et staking 10-20% APR !",
  quiz: "🎓 50 quiz éducatifs en 6 langues sur reussitess.fr ! Gagnez 1 000 à 50 000 REUSS selon le niveau. Français, Anglais, Espagnol, Portugais, Créole et Arabe. BOUDOUM !",
  amazon: "🛍️ 26 boutiques Amazon dans 14 pays ! USA, France, Belgique, Allemagne, Italie, Espagne, Canada, UK, Australie, Inde, Pays-Bas, Suède, Singapour et Brésil. Tag affilié : ronyporinu0ac-21",
  gomining: "⛏️ GoMining permet de miner du Bitcoin passivement ! Lien parrainage : gomining.com/?ref=OT3GI2U. Rony génère 0.84$/jour — top 3% mondial !",
  boudoum: "🌴 BOUDOUM ! C'est le cri de guerre de Reussitess®971 — Terres De Champions ! Positivité à l'Infini depuis la Guadeloupe 🇬🇵",
}

function getLocalResponse(message) {
  const msg = message.toLowerCase()
  if (msg.includes('guadeloupe') || msg.includes('971') || msg.includes('antill')) return localData.guadeloupe
  if (msg.includes('reuss') || msg.includes('token') || msg.includes('polygon')) return localData.reuss
  if (msg.includes('quiz') || msg.includes('éducati') || msg.includes('apprend')) return localData.quiz
  if (msg.includes('amazon') || msg.includes('boutique') || msg.includes('cashback')) return localData.amazon
  if (msg.includes('gomining') || msg.includes('bitcoin') || msg.includes('minage')) return localData.gomining
  if (msg.includes('boudoum') || msg.includes('champion') || msg.includes('positivit')) return localData.boudoum
  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message, context = [] } = req.body

  // 1. Essayer données locales d'abord
  const localResponse = getLocalResponse(message)

  // 2. Essayer Claude
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: `Tu es REUSSITESS AI depuis la Guadeloupe 🇬🇵 - Terres De Champions !
Tu connais : token REUSS sur Polygon, 26 boutiques Amazon 14 pays, 50 quiz 6 langues, 200 agents IA, GoMining Bitcoin, tiers Bronze/Silver/Gold/Platinum, GAMMA-1/2/3.
Réponds avec positivité caribéenne. Max 3 paragraphes. Termine par BOUDOUM ! si approprié.`,
        messages: [
          ...context.slice(-8).filter(m => m.role === 'user' || m.role === 'assistant'),
          { role: 'user', content: message }
        ]
      })
    })

    if (anthropicRes.ok) {
      const data = await anthropicRes.json()
      const claudeResponse = data.content?.[0]?.text || ''
      
      // Combiner local + Claude si les deux existent
      const finalResponse = localResponse 
        ? `${localResponse}\n\n${claudeResponse}`
        : claudeResponse

      return res.json({ response: finalResponse, success: true })
    }
  } catch (e) {
    console.error('Claude error:', e)
  }

  // 3. Fallback local seul si Claude échoue
  if (localResponse) {
    return res.json({ response: localResponse, success: true })
  }

  return res.json({ 
    response: "⚠️ Connexion temporairement indisponible. Je reste à votre service ! Réessayez dans un instant. 💪",
    success: false 
  })
}
