import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'knowledge.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    res.status(200).json(data)
  } catch {
    res.status(200).json({ facts: [], commands: [] })
  }
}
