export default async function handler(req, res) {
  // Cache persistance Vercel Edge (infinie)
  const headers = { 'Cache-Control': 'public, max-age=31536000, immutable' }
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  res.json({ 
    status: 'DB_UPDATED', 
    presidents: { usa: 'Donald Trump (2025-)' },
    timestamp: new Date().toISOString()
  })
}
