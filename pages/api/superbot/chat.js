export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { message, context = [] } = req.body

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
            content: `Tu es REUSSITESS AI depuis la Guadeloupe 🇬🇵 - Terres De Champions ! Tu connais : token REUSS sur Polygon, 26 boutiques Amazon 14 pays, 50 quiz 6 langues, 200 agents IA, GoMining Bitcoin. Réponds avec positivité caribéenne. Termine par BOUDOUM ! si approprié.`
          },
          { role: 'user', content: message }
        ]
      })
    })

    const raw = await openaiRes.text()
    const data = JSON.parse(raw)
    
    if (!openaiRes.ok) {
      return res.json({ response: `Erreur API: ${data.error?.message}`, success: false })
    }

    const response = data.choices?.[0]?.message?.content || 'BOUDOUM ! 🌴'
    return res.json({ response, success: true })

  } catch (e) {
    return res.json({ response: `Erreur: ${e.message}`, success: false })
  }
}
