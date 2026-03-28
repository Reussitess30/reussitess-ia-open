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

    if (!pdfBuffer || pdfBuffer.length < 100) {
      return res.status(400).json({ error: 'PDF non reçu' })
    }

    // Extraction texte via opérateurs Tj/TJ
    const str = pdfBuffer.toString('binary')
    const blocks = []

    const tjReg = /\(([^)\\]|\\.){1,300}\)\s*Tj/g
    const tjArrReg = /\[([^\]]{1,500})\]\s*TJ/g
    let m

    while ((m = tjReg.exec(str)) !== null) {
      const raw = m[0].replace(/\)\s*Tj$/, '').slice(1)
        .replace(/\\n/g,' ').replace(/\\r/g,' ')
        .replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o,8)))
        .replace(/\\/g,'').trim()
      if (raw.length > 1 && /[a-zA-ZÀ-ÿ]/.test(raw)) blocks.push(raw)
    }

    while ((m = tjArrReg.exec(str)) !== null) {
      const strs = m[1].match(/\(([^)]*)\)/g) || []
      strs.forEach(s => {
        const raw = s.slice(1,-1).replace(/\\/g,'').trim()
        if (raw.length > 1 && /[a-zA-ZÀ-ÿ]/.test(raw)) blocks.push(raw)
      })
    }

    const text = blocks.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)

    if (!text || text.length < 20) {
      return res.status(200).json({ success: false, error: 'PDF illisible — utilise un PDF avec texte sélectionnable' })
    }

    res.status(200).json({
      success: true,
      text,
      pages: Math.max(1, (str.match(/\/Type\s*\/Page\b/g) || []).length)
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
