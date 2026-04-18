/* 
 * © REUSSITESS®971 — Tous droits réservés
 * Auteur : Rony Porinus — Guadeloupe 🇬🇵
 * Protection INPI : DSO2026012614
 * Play Store : com.reussitess.twa
 * SHA-256 : 91:37:09:78:62:23:2A:BD:E5:FA:1E:93:B6:BC:5D:2A:5D:DF:8C:87:B2:D5:E2:1D:92:83:C1:07:92:F5:C3:8F
 * Site : https://reussitess.fr
 * Contact : influenceur@reussitess.fr
 * 
 * Reproduction, copie ou distribution interdite sans autorisation écrite.
 * Unauthorized copying, modification or distribution is strictly prohibited.
 */
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
