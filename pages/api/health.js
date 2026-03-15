export default async function handler(req, res) {
  const checks = {}
  
  // Test Groq
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", {
      headers: { "Authorization": "Bearer " + process.env.GROQ_API_KEY }
    })
    checks.groq = r.ok ? "✅ OK" : "❌ DOWN"
  } catch(e) { checks.groq = "❌ " + e.message }

  // Test Alchemy Polygon
  try {
    const r = await fetch(process.env.RPC_URL || 'https://polygon-mainnet.g.alchemy.com/v2/3pTz5vSd3WrsST8MhLEUC', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({jsonrpc:'2.0',method:'eth_blockNumber',params:[],id:1})
    })
    checks.alchemy = r.ok ? "✅ OK" : "❌ DOWN"
  } catch(e) { checks.alchemy = "❌ " + e.message }

  // Test Redis
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = Redis.fromEnv()
    await redis.ping()
    checks.redis = "✅ OK"
  } catch(e) { checks.redis = "❌ " + e.message }

  // Test France Travail
  try {
    const r = await fetch('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search?departement=971&range=0-1', {
      headers: { 'Accept': 'application/json' }
    })
    checks.francetravail = r.status !== 500 ? "✅ OK" : "❌ DOWN"
  } catch(e) { checks.francetravail = "❌ " + e.message }

  const allOk = Object.values(checks).every(v => v.startsWith("✅"))
  
  res.status(allOk ? 200 : 503).json({
    status: allOk ? "🟢 TOUS SYSTÈMES OPÉRATIONNELS" : "🔴 DÉGRADÉ",
    timestamp: new Date().toISOString(),
    checks
  })
}
