export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { type, profil, pays_cible, situation } = req.body

  const GROQ_KEY = process.env.GROQ_API_KEY
  
  const prompts = {
    cv: `Tu es un expert RH caribéen. Crée un CV professionnel complet pour: ${JSON.stringify(profil)}. Cible: marché ${pays_cible || 'France/Guadeloupe'}. Format moderne, valorise l expérience caribéenne.`,
    lettre: `Tu es expert en candidatures. Rédige une lettre de motivation percutante pour: ${JSON.stringify(profil)}. Poste visé: ${situation}. Marché: ${pays_cible}.`,
    caf: `Tu es expert en aides sociales DOM-TOM. Explique étape par étape comment faire une demande ${situation} (CAF, RSA, APL, etc.) pour quelqu un en situation: ${JSON.stringify(profil)}. Inclus les documents requis et les délais.`,
    logement: `Tu es expert en logement social DOM-TOM. Guide complet pour demande HLM/logement social pour: ${JSON.stringify(profil)} à ${pays_cible}. Documents, délais, conseils pratiques.`
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [
        { role: 'system', content: 'Tu es un assistant expert en emploi et démarches administratives pour la diaspora afro-caribéenne.' },
        { role: 'user', content: prompts[type] || prompts.cv }
      ]
    })
  })
  const data = await response.json()
  return res.status(200).json({ result: data.choices?.[0]?.message?.content })
}
