/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { audio, langue } = req.body
  if (!audio) return res.status(400).json({ error: 'No audio' })

  const keys = [process.env.GROQ_API_KEY, process.env.GROQ_API_KEY_2, process.env.GROQ_API_KEY_3].filter(Boolean)
  const key = keys[Math.floor(Math.random() * keys.length)]

  try {
    // Convertir base64 en blob
    const buffer = Buffer.from(audio, 'base64')
    const blob = new Blob([buffer], { type: 'audio/webm' })
    
    const formData = new FormData()
    formData.append('file', blob, 'audio.webm')
    formData.append('model', 'whisper-large-v3-turbo')
    formData.append('language', langue || 'fr')
    formData.append('response_format', 'json')

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key },
      body: formData
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(200).json({ text: null, error: err?.error?.message })
    }

    const data = await response.json()
    return res.status(200).json({ text: data.text || null })
  } catch(e) {
    console.error('Whisper error:', e.message)
    return res.status(200).json({ text: null, error: e.message })
  }
}
