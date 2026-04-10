/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'Text requis' })

  try {
    const key = process.env.GROQ_API_KEY
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'playai-tts',
        input: text,
        voice: 'Fritz-PlayAI',
        response_format: 'wav'
      })
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(500).json({ error: err })
    }

    const audioBuffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/wav')
    res.setHeader('Content-Length', audioBuffer.byteLength)
    res.send(Buffer.from(audioBuffer))
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
