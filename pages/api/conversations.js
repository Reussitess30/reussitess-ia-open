import fs from 'fs'
import path from 'path'

const DB_PATH = '/tmp/conversations.json'

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  } catch { return {} }
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data))
}

export default function handler(req, res) {
  const db = loadDB()
  
  if (req.method === 'POST') {
    const { sessionId, messages } = req.body
    if (!sessionId || !messages) return res.status(400).end()
    db[sessionId] = { messages, updatedAt: new Date().toISOString() }
    saveDB(db)
    return res.status(200).json({ success: true })
  }
  
  if (req.method === 'GET') {
    const { sessionId } = req.query
    if (sessionId) return res.status(200).json(db[sessionId] || null)
    const list = Object.entries(db).map(([id, d]) => ({ id, updatedAt: d.updatedAt, preview: d.messages?.[1]?.content?.substring(0,50) || '' }))
    return res.status(200).json(list.slice(-20))
  }

  if (req.method === 'DELETE') {
    const { sessionId } = req.body
    if (sessionId) delete db[sessionId]
    saveDB(db)
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
