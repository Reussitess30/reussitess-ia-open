export const config = { api: { bodyParser: false, sizeLimit: '10mb' } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const body = Buffer.concat(chunks)
    
    const contentType = req.headers['content-type'] || ''
    const boundaryMatch = contentType.match(/boundary=(.+)/)
    if (!boundaryMatch) return res.status(400).json({ error: 'Format invalide' })
    
    const boundary = '--' + boundaryMatch[1]
    const parts = body.toString('binary').split(boundary)
    let pdfBuffer = null
    
    for (const part of parts) {
      if (part.includes('filename=') && part.includes('.pdf')) {
        const headerEnd = part.indexOf('\r\n\r\n')
        if (headerEnd !== -1) {
          const raw = part.substring(headerEnd + 4)
          const clean = raw.replace(/\r\n--.*$/s, '').replace(/\r\n$/, '')
          pdfBuffer = Buffer.from(clean, 'binary')
          break
        }
      }
    }
    
    if (!pdfBuffer || pdfBuffer.length < 100) {
      return res.status(400).json({ error: 'PDF non reçu' })
    }

    // Extraction texte UTF-8 propre
    const extracted = []
    let pos = 0
    const buf = pdfBuffer
    
    while (pos < buf.length - 4) {
      // Cherche BT (début bloc texte)
      if (buf[pos] === 0x42 && buf[pos+1] === 0x54) {
        let end = pos + 2
        while (end < buf.length - 2) {
          if (buf[end] === 0x45 && buf[end+1] === 0x54) break
          end++
        }
        const block = buf.slice(pos+2, end).toString('utf8', 0, end-pos)
        const strings = block.match(/\(([^)]{1,200})\)/g) || []
        strings.forEach(s => {
          const clean = s.slice(1,-1)
            .replace(/\\n/g,' ').replace(/\\r/g,' ')
            .replace(/\\t/g,' ').replace(/\\\\/g,'\\')
            .replace(/\\([0-7]{3})/g, (m, oct) => String.fromCharCode(parseInt(oct, 8)))
            .trim()
          if (clean.length > 2 && /[a-zA-ZÀ-ÿ\u00C0-\u024F]/.test(clean)) {
            extracted.push(clean)
          }
        })
        pos = end + 2
      } else {
        pos++
      }
    }

    const result = extracted.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)

    if (!result || result.length < 20) {
      return res.status(200).json({ 
        success: false, 
        error: 'PDF illisible — utilise un PDF avec texte sélectionnable (pas scanné ni protégé)' 
      })
    }

    res.status(200).json({ 
      success: true, 
      text: result,
      pages: Math.max(1, (pdfBuffer.toString('binary').match(/\/Page\b/g) || []).length)
    })
  } catch(e) {
    res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
