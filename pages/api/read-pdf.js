import pdfParse from 'pdf-parse'

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
    
    const boundary = Buffer.from('--' + boundaryMatch[1])
    const parts = []
    let start = 0
    
    for (let i = 0; i < body.length - boundary.length; i++) {
      if (body.slice(i, i + boundary.length).equals(boundary)) {
        if (start > 0) parts.push(body.slice(start, i))
        start = i + boundary.length
      }
    }
    
    let pdfBuffer = null
    for (const part of parts) {
      const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'))
      if (headerEnd === -1) continue
      const header = part.slice(0, headerEnd).toString()
      if (header.includes('.pdf') || header.includes('application/pdf')) {
        pdfBuffer = part.slice(headerEnd + 4)
        // Enlever le \r\n final
        if (pdfBuffer.slice(-2).toString() === '\r\n') {
          pdfBuffer = pdfBuffer.slice(0, -2)
        }
        break
      }
    }
    
    if (!pdfBuffer || pdfBuffer.length < 100) {
      return res.status(400).json({ error: 'PDF non reçu' })
    }

    const data = await pdfParse(pdfBuffer)
    const text = data.text.replace(/\s+/g, ' ').trim().substring(0, 5000)

    if (!text || text.length < 20) {
      return res.status(200).json({ success: false, error: 'PDF illisible' })
    }

    res.status(200).json({ 
      success: true, 
      text,
      pages: data.numpages
    })
  } catch(e) {
    res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
