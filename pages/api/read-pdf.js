import Busboy from 'busboy'

export const config = { api: { bodyParser: false, sizeLimit: '10mb' } }

async function parsePDF(buffer) {
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const { writeFile, readFile, unlink } = await import('fs/promises')
  const { tmpdir } = await import('os')
  const { join } = await import('path')
  
  const tmpIn = join(tmpdir(), `pdf_${Date.now()}.pdf`)
  await writeFile(tmpIn, buffer)
  
  return new Promise((resolve) => {
    exec(`node -e "const p=require('pdf-parse');const fs=require('fs');p(fs.readFileSync('${tmpIn}')).then(d=>process.stdout.write(JSON.stringify({text:d.text,pages:d.numpages}))).catch(e=>process.stdout.write(JSON.stringify({error:e.message})))"`, 
    { timeout: 15000 }, 
    async (err, stdout) => {
      try { await unlink(tmpIn) } catch(e) {}
      if (err) return resolve({ error: err.message })
      try { resolve(JSON.parse(stdout)) } catch(e) { resolve({ error: 'Parse error' }) }
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const pdfBuffer = await new Promise((resolve, reject) => {
      const busboy = Busboy({ headers: req.headers })
      let buffer = null
      busboy.on('file', (name, file) => {
        const chunks = []
        file.on('data', chunk => chunks.push(chunk))
        file.on('end', () => { buffer = Buffer.concat(chunks) })
      })
      busboy.on('finish', () => resolve(buffer))
      busboy.on('error', reject)
      req.pipe(busboy)
    })

    if (!pdfBuffer || pdfBuffer.length < 50) {
      return res.status(400).json({ error: 'PDF non reçu' })
    }

    const result = await parsePDF(pdfBuffer)
    
    if (result.error || !result.text || result.text.length < 3) {
      return res.status(200).json({ 
        success: false, 
        error: 'Ce PDF utilise un encodage avancé. Copie-colle le texte directement dans le chat.' 
      })
    }

    res.status(200).json({
      success: true,
      text: result.text.substring(0, 5000),
      pages: result.pages || 1
    })

  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
