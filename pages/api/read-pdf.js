export const config = { api: { bodyParser: false, sizeLimit: '10mb' } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    
    const contentType = req.headers['content-type'] || ''
    const boundaryMatch = contentType.match(/boundary=([^\s;]+)/)
    if (!boundaryMatch) return res.status(400).json({ error: 'Format invalide' })
    
    const boundary = Buffer.from('\r\n--' + boundaryMatch[1])
    let pdfBuffer = null
    let searchPos = 0
    
    while (searchPos < body.length) {
      const idx = body.indexOf(boundary, searchPos)
      if (idx === -1) break
      const partStart = idx + boundary.length
      const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), partStart)
      if (headerEnd === -1) break
      const header = body.slice(partStart, headerEnd).toString()
      if (header.includes('.pdf') || header.includes('application/pdf')) {
        const nextBoundary = body.indexOf(boundary, headerEnd)
        pdfBuffer = body.slice(headerEnd + 4, nextBoundary === -1 ? body.length : nextBoundary)
        break
      }
      searchPos = partStart
    }

    if (!pdfBuffer || pdfBuffer.length < 100) {
      return res.status(400).json({ error: 'PDF non reçu correctement' })
    }

    // Extraction basique mais propre — cherche les streams de texte
    const str = pdfBuffer.toString('utf8', 0, Math.min(pdfBuffer.length, 500000))
    const textBlocks = []
    
    // Cherche les opérateurs Tj et TJ (texte PDF)
    const tjRegex = /\(([^)\\]|\\.)*\)\s*Tj/g
    const tjArrayRegex = /\[([^\]]*)\]\s*TJ/g
    
    let m
    while ((m = tjRegex.exec(str)) !== null) {
      const raw = m[0].replace(/\)\s*Tj$/, '').replace(/^\(/, '')
        .replace(/\\n/g,' ').replace(/\\r/g,' ').replace(/\\\\/g,'\\')
        .replace(/\\([0-7]{3})/g, (_, o) => String.fromCharCode(parseInt(o,8)))
        .trim()
      if (raw.length > 1) textBlocks.push(raw)
    }
    
    while ((m = tjArrayRegex.exec(str)) !== null) {
      const inner = m[1]
      const strings = inner.match(/\(([^)]*)\)/g) || []
      strings.forEach(s => {
        const raw = s.slice(1,-1).replace(/\\n/g,' ').replace(/\\\\/g,'\\').trim()
        if (raw.length > 1) textBlocks.push(raw)
      })
    }

    const result = textBlocks.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)

    if (!result || result.length < 10) {
      return res.status(200).json({ 
        success: false, 
        error: 'PDF illisible — utilise un PDF avec texte sélectionnable' 
      })
    }

    res.status(200).json({ 
      success: true, 
      text: result,
      pages: (str.match(/\/Type\s*\/Page\b/g) || []).length || 1
    })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
