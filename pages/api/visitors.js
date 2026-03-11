export default async function handler(req, res) {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const response = await fetch(`${process.env.KV_REST_API_URL}/incr/reussitess_visitors`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
      })
      const data = await response.json()
      return res.status(200).json({ count: data.result })
    }
    return res.status(200).json({ count: null })
  } catch(e) {
    return res.status(200).json({ count: null })
  }
}
