export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message } = req.body

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
        max_tokens: 300,
        messages: [{ role: 'user', content: message }]
      })
    })

    const data = await anthropicRes.json()
    
    // Retourner tout pour debug
    return res.json({ 
      status: anthropicRes.status,
      data: data,
      hasKey: !!process.env.ANTHROPIC_API_KEY,
      keyStart: process.env.ANTHROPIC_API_KEY?.substring(0, 10)
    })

  } catch (error) {
    return res.json({ error: error.message })
  }
}
