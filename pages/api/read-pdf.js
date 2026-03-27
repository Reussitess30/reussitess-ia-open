export const config = { api: { bodyParser: false, sizeLimit: '10mb' } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    const bodyStr = body.toString('latin1')
    
    // Extraire le contenu PDF du multipart
    const boundaryMatch = req.headers['content-type']?.match(/boundary=(.+)/)
    if (!boundaryMatch) return res.status(400).json({ error: 'Pas de boundary' })
    
    const boundary = boundaryMatch[1]
    const parts = bodyStr.split('--' + boundary)
    let pdfBuffer = null
    
    for (const part of parts) {
      if (part.includes('filename=') && part.includes('.pdf')) {
        const headerEnd = part.indexOf('\r\n\r\n')
        if (headerEnd !== -1) {
          const content = part.substring(headerEnd + 4).replace(/\r\n$/, '').replace(/--$/, '')
          pdfBuffer = Buffer.from(content, 'latin1')
          break
        }
      }
    }
    
    if (!pdfBuffer) return res.status(400).json({ error: 'PDF non trouvé' })
    
    const text = pdfBuffer.toString('latin1')
    const extracted = []
    
    const btRegex = /BT([\s\S]*?)ET/g
    let match
    while ((match = btRegex.exec(text)) !== null) {
      const strings = match[1].match(/\(([^)]*)\)/g) || []
      strings.forEach(s => {
        const clean = s.slice(1,-1).replace(/\\n/g,' ').replace(/\\r/g,' ').replace(/\\/g,'').trim()
        if (clean.length > 2 && /[a-zA-ZÀ-ÿ]/.test(clean)) extracted.push(clean)
      })
    }

    if (extracted.length < 5) {
      const allStrings = text.match(/\(([^)]{3,100})\)/g) || []
      allStrings.forEach(s => {
        const clean = s.slice(1,-1).trim()
        if (/[a-zA-ZÀ-ÿ]{3,}/.test(clean)) extracted.push(clean)
      })
    }

    const result = extracted.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)

    if (!result || result.length < 20) {
      return res.status(200).json({ success: false, error: 'PDF illisible — utilise un PDF avec texte sélectionnable' })
    }

    res.status(200).json({ 
      success: true, 
      text: result,
      pages: Math.max(1, (text.match(/\/Page\b/g) || []).length)
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
