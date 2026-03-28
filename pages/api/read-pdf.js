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

    const text = pdfBuffer.toString('latin1')
    const blocks = []

    // Extraction Tj
    const tjReg = /\(([^)]*)\)\s*Tj/g
    let m
    while ((m = tjReg.exec(text)) !== null) {
      const raw = m[1]
        .replace(/\\n/g,' ').replace(/\\r/g,' ')
        .replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o,8)))
        .replace(/\\/g,'').trim()
      if (raw.length > 0) blocks.push(raw)
    }

    // Extraction TJ array
    const tjArrReg = /\[([^\]]*)\]\s*TJ/g
    while ((m = tjArrReg.exec(text)) !== null) {
      const strs = m[1].match(/\(([^)]*)\)/g) || []
      strs.forEach(s => {
        const raw = s.slice(1,-1).replace(/\\/g,'').trim()
        if (raw.length > 0) blocks.push(raw)
      })
    }

    const result = blocks.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)

    if (!result || result.length < 3) {
      return res.status(200).json({ success: false, error: 'PDF illisible — utilise un PDF avec texte sélectionnable' })
    }

    res.status(200).json({
      success: true,
      text: result,
      pages: Math.max(1, (text.match(/\/Type\s*\/Page\b/g) || []).length)
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
