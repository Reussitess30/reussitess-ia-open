export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true })
  
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'
    
    const event = req.body
    const transfers = event?.event?.activity || []
    
    for (const t of transfers) {
      if (t.contractAddress?.toLowerCase() !== CONTRACT.toLowerCase()) continue
      const value = parseFloat(t.value || 0)
      if (value < 1000) continue // Seuil 1000 REUSS
      
      const msg = `🚨 *REUSS Alert — Transfert Détecté !*\n\n💎 *${value.toFixed(2)} REUSS*\n📤 De: \`${t.fromAddress?.substring(0,10)}...\`\n📥 Vers: \`${t.toAddress?.substring(0,10)}...\`\n\n🔗 [Voir sur PolygonScan](https://polygonscan.com/tx/${t.hash})\n📊 [Dashboard Live](https://reussitess.fr/reuss-live)\n\nBoudoum ! 🇬🇵`
      
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
      })
    }
    
    return res.status(200).json({ ok: true })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
