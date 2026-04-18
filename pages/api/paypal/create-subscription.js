/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Methode non autorisee' })
  try {
    const { telegramId } = req.body
    const clientId = process.env.PAYPAL_CLIENT_ID
    const secret = process.env.PAYPAL_SECRET
    const planId = process.env.PAYPAL_PLAN_ID
    if (!clientId || !secret || !planId) {
      return res.status(200).json({ url: 'https://reussitess.fr/premium' })
    }
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(clientId+':'+secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    }).then(r => r.json())
    const token = tokenRes.access_token
    if (!token) return res.status(200).json({ url: 'https://reussitess.fr/premium' })
    const sub = await fetch('https://api-m.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer '+token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: planId,
        custom_id: telegramId || 'web',
        application_context: {
          brand_name: 'REUSSITESS971',
          return_url: 'https://reussitess.fr/premium?success=true',
          cancel_url: 'https://reussitess.fr/premium?cancel=true',
          user_action: 'SUBSCRIBE_NOW'
        }
      })
    }).then(r => r.json())
    const approveUrl = sub.links?.find(l => l.rel === 'approve')?.href
    return res.status(200).json({ url: approveUrl || 'https://reussitess.fr/premium', id: sub.id || null })
  } catch(e) {
    return res.status(200).json({ url: 'https://reussitess.fr/premium' })
  }
}
