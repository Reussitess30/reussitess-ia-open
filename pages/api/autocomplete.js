import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  const { q } = req.query
  if (!q || q.length < 2) return res.status(200).json([])
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'autocomplete.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const qLow = q.toLowerCase()
    const results = []
    
    for (const [key, suggestions] of Object.entries(data)) {
      if (qLow.includes(key) || key.includes(qLow)) {
        results.push(...suggestions)
      }
    }
    
    res.status(200).json(results.slice(0, 4))
  } catch {
    res.status(200).json([])
  }
}
