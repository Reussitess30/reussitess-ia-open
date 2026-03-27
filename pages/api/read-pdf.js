export const config = { api: { bodyParser: { sizeLimit: '10mb' } } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  try {
    // Accepte base64 ou buffer direct
    const { pdf, filename } = req.body
    
    if (!pdf) return res.status(400).json({ error: 'Aucun fichier PDF' })
    
    const buffer = Buffer.from(pdf, 'base64')
    
    // Extraction texte depuis PDF sans librairie externe
    const text = buffer.toString('latin1')
    const extracted = []
    
    // Méthode 1 — blocs BT/ET
    const btRegex = /BT([\s\S]*?)ET/g
    let match
    while ((match = btRegex.exec(text)) !== null) {
      const strings = match[1].match(/\(([^)]*)\)/g) || []
      strings.forEach(s => {
        const clean = s.slice(1,-1).replace(/\\n/g,' ').replace(/\\r/g,' ').replace(/\\/g,'').trim()
        if (clean.length > 2 && /[a-zA-ZÀ-ÿ]/.test(clean)) extracted.push(clean)
      })
    }
    
    // Méthode 2 — strings entre parenthèses si méthode 1 vide
    if (extracted.length < 5) {
      const allStrings = text.match(/\(([^)]{3,100})\)/g) || []
      allStrings.forEach(s => {
        const clean = s.slice(1,-1).trim()
        if (/[a-zA-ZÀ-ÿ]{3,}/.test(clean)) extracted.push(clean)
      })
    }
    
    const result = extracted.join(' ').replace(/\s+/g,' ').trim().substring(0, 5000)
    
    if (!result || result.length < 20) {
      return res.status(200).json({ 
        success: false, 
        error: 'PDF illisible — essaie un PDF avec texte sélectionnable (pas scanné)' 
      })
    }

    res.status(200).json({ 
      success: true, 
      text: result,
      pages: Math.max(1, (text.match(/\/Page\b/g) || []).length),
      filename: filename || 'document.pdf'
    })
  } catch(e) {
    res.status(500).json({ error: 'Erreur: ' + e.message })
  }
}
