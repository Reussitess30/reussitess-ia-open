import formidable from 'formidable'
import fs from 'fs'
import pdfParse from 'pdf-parse'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  try {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 })
    const [, files] = await form.parse(req)
    const file = files.pdf?.[0]
    if (!file) return res.status(400).json({ error: 'Aucun fichier' })
    
    const buffer = fs.readFileSync(file.filepath)
    const data = await pdfParse(buffer)
    const text = data.text.substring(0, 3000)
    
    res.status(200).json({ 
      success: true, 
      text,
      pages: data.numpages,
      info: data.info?.Title || 'Document PDF'
    })
  } catch(e) {
    res.status(500).json({ error: 'Erreur lecture PDF' })
  }
}
