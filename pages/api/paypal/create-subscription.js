export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { telegramId } = req.body

  try {
    const auth = await fetch('https://api.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    })
    const { access_token } = await auth.json()
    if (!access_token) return res.status(500).json({ error: 'Auth PayPal echouee' })

    const sub = await fetch('https://api.paypal.com/v1/billing/subscriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + access_token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan_id: process.env.PAYPAL_PLAN_ID || 'P-9HS41937PC944162RNHPZWMY',
        custom_id: String(telegramId || 'web'),
        application_context: {
          brand_name: 'REUSSITESS',
          locale: 'fr-FR',
          return_url: 'https://reussitess.fr/premium-success',
          cancel_url: 'https://reussitess.fr/premium'
        }
      })
    })
    const data = await sub.json()
    const approvalUrl = data.links?.find(l => l.rel === 'approve')?.href
    if (!approvalUrl) return res.status(500).json({ error: 'Lien PayPal non genere', detail: data })
    return res.status(200).json({ url: approvalUrl, id: data.id })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
