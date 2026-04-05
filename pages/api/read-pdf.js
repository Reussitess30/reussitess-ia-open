import Busboy from 'busboy'

export const config = { api: { bodyParser: false, sizeLimit: '10mb' } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const pdfBuffer = await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers })
      let buffer = null
      busboy.on('file', (name, file) => {
        const chunks = []
        file.on('data', chunk => chunks.push(chunk))
        file.on('end', () => { buffer = Buffer.concat(chunks) })
      })
      busboy.on('finish', () => resolve(buffer))
      busboy.on('error', reject)
      req.pipe(busboy)
    })

    if (!pdfBuffer || pdfBuffer.length < 50) {
      return res.status(400).json({ error: 'PDF non reçu' })
    }

    const pdfParse = (await import('pdf-parse')).default
    const data = await pdfParse(pdfBuffer)
    const text = data.text?.trim().substring(0, 5000) || ''

    if (!text || text.length < 3) {
      return res.status(200).json({ 
        success: false, 
        error: 'Ce PDF utilise un encodage avancé. Copie-colle le texte directement dans le chat.' 
      })
    }

    res.status(200).json({
      success: true,
      text: text,
      pages: data.numpages || 1
    })

  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
