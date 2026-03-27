export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  try {
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)
    
    // Extraction texte basique depuis PDF (sans librairie)
    const text = buffer.toString('latin1')
    const extracted = []
    const regex = /BT[\s\S]*?ET/g
    let match
    while ((match = regex.exec(text)) !== null) {
      const block = match[0]
      const strings = block.match(/\((.*?)\)/g) || []
      strings.forEach(s => {
        const clean = s.slice(1,-1).replace(/\\n/g,' ').replace(/\\/g,'').trim()
        if (clean.length > 2) extracted.push(clean)
      })
    }
    
    const result = extracted.join(' ').substring(0, 3000)
    
    if (!result || result.length < 10) {
      return res.status(200).json({ success: false, error: 'PDF illisible ou crypté' })
    }

    res.status(200).json({ 
      success: true, 
      text: result,
      pages: 1,
      info: 'Document PDF'
    })
  } catch(e) {
    res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
