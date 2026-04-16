export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { nationalite, destination, type_visa, situation } = req.body

  const GROQ_KEY = process.env.GROQ_API_KEY
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: 'Tu es un expert en immigration et visas pour la diaspora caribéenne et africaine. Tu connais les procédures pour Canada, USA, UK, Schengen, et les 14 pays caribéens. Tu donnes des informations précises, les documents requis, les délais et les frais.' },
        { role: 'user', content: `Nationalité: ${nationalite}\nDestination: ${destination}\nType visa: ${type_visa || 'tourisme'}\nSituation: ${situation || 'standard'}\n\nGuide complet étape par étape: documents requis, formulaires, frais, délais, conseils pour maximiser les chances d approbation.` }
      ]
    })
  })
  const data = await response.json()
  return res.status(200).json({ result: data.choices?.[0]?.message?.content })
}
