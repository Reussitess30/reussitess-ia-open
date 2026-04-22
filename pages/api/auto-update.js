/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  // Sécurité - clé admin requise
  const adminKey = req.headers['x-admin-key'] || req.query.key
  if (adminKey !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const updates = {}

    // 1. Météo Guadeloupe
    try {
      const meteo = await fetch('https://api.open-meteo.com/v1/forecast?latitude=16.2411&longitude=-61.5331&current=temperature_2m,wind_speed_10m,weather_code')
      const md = await meteo.json()
      updates.meteo = {
        temperature: md.current?.temperature_2m,
        vent: md.current?.wind_speed_10m,
        code: md.current?.weather_code
      }
    } catch(e) {}

    // 2. Crypto
    try {
      const crypto = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd')
      const cd = await crypto.json()
      updates.crypto = {
        bitcoin: cd.bitcoin?.usd,
        ethereum: cd.ethereum?.usd,
        polygon: cd['matic-network']?.usd
      }
    } catch(e) {}

    // 3. Taux de change
    try {
      const fx = await fetch('https://api.exchangerate-api.com/v4/latest/EUR')
      const fd = await fx.json()
      updates.taux = {
        EUR_USD: fd.rates?.USD,
        EUR_GBP: fd.rates?.GBP,
        EUR_BRL: fd.rates?.BRL,
        EUR_CAD: fd.rates?.CAD,
        EUR_XCD: fd.rates?.XCD
      }
    } catch(e) {}

    // 4. Actualités RFI
    try {
      const rfi = await fetch('https://www.rfi.fr/fr/rss')
      const xml = await rfi.text()
      const titles = [...xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)].slice(1,4).map(m => m[1])
      updates.actualites_rfi = titles
    } catch(e) {}

    // 5. Date mise à jour
    updates.last_update = new Date().toISOString()

    // Mettre à jour le knowledge.json
    const fs = await import('fs/promises')
    const path = await import('path')
    const knowledgePath = path.join(process.cwd(), 'public', 'knowledge.json')
    const knowledge = JSON.parse(await fs.readFile(knowledgePath, 'utf8'))

    // Mettre à jour les triggers existants
    knowledge.commands = knowledge.commands.map(cmd => {
      if (cmd.trigger === 'meteo' && updates.meteo) {
        cmd.response = `🌤 **Météo Guadeloupe — Temps Réel**\n\n🌡 Température : ${updates.meteo.temperature}°C\n💨 Vent : ${updates.meteo.vent} km/h\n\n📅 Mis à jour : ${new Date().toLocaleDateString('fr-FR')}\nBoudoum ! 🇬🇵`
      }
      if (cmd.trigger === 'bitcoin' && updates.crypto) {
        cmd.response = `₿ **Bitcoin — Prix Temps Réel**\n\n💰 Prix : $${updates.crypto.bitcoin?.toLocaleString()}\nΞ Ethereum : $${updates.crypto.ethereum?.toLocaleString()}\n⬡ Polygon : $${updates.crypto.polygon}\n\n📅 Mis à jour : ${new Date().toLocaleTimeString('fr-FR')}\nBoudoum ! 🇬🇵`
      }
      return cmd
    })

    knowledge.auto_update = updates

    await fs.writeFile(knowledgePath, JSON.stringify(knowledge, null, 2))

    return res.status(200).json({ 
      success: true, 
      message: 'Base de données mise à jour !',
      updates 
    })

  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
