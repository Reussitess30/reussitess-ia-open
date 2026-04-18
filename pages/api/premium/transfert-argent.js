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
  const { montant, destination, devise_origine } = req.body

  try {
    const GROQ_KEY = process.env.GROQ_API_KEY
    
    // Taux temps réel
    const ratesRes = await fetch(`https://api.exchangerate-api.com/v4/latest/${devise_origine || 'EUR'}`)
    const rates = await ratesRes.json()

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_KEY },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: 'Tu es un expert financier spécialisé dans les transferts d argent vers les Caraïbes et l Afrique. Tu compares les services de transfert et conseilles la meilleure option.' },
          { role: 'user', content: `Je veux envoyer ${montant}${devise_origine || 'EUR'} vers ${destination}.\n\nTaux actuels: ${JSON.stringify(rates.rates).substring(0, 200)}\n\nCompare: Western Union, Wise, Remitly, WorldRemit, PayPal, Crypto (USDC).\nDonne le classement du moins cher au plus cher avec frais estimés et montant reçu.` }
        ]
      })
    })
    const data = await response.json()
    return res.status(200).json({ result: data.choices?.[0]?.message?.content })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
