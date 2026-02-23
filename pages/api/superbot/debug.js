export default async function handler(req, res) {
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const keyStart = process.env.OPENAI_API_KEY?.substring(0, 8) || 'vide'
  const keyLength = process.env.OPENAI_API_KEY?.length || 0

  try {
    const test = await fetch('https://api.openai.com/v1/models', {
      headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
    })
    const data = await test.json()
    return res.json({ hasOpenAI, keyStart, keyLength, openaiStatus: test.status, data: data.error || 'OK' })
  } catch(e) {
    return res.json({ hasOpenAI, keyStart, keyLength, error: e.message })
  }
}
