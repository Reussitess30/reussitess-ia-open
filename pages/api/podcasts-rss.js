/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  const sources = [
    { name: 'La 1ère Guadeloupe', url: 'https://la1ere.francetvinfo.fr/guadeloupe/rss.xml', emoji: '🇬🇵' },
    { name: 'RFI Afrique', url: 'https://www.rfi.fr/fr/rss', emoji: '🌍' },
    { name: 'La 1ère Martinique', url: 'https://la1ere.francetvinfo.fr/martinique/rss.xml', emoji: '🇲🇶' },
    { name: 'La 1ère Réunion', url: 'https://la1ere.francetvinfo.fr/reunion/rss.xml', emoji: '🇷🇪' },
  ]

  const episodes = []
  for (const src of sources) {
    try {
      const r = await fetch(src.url, { signal: AbortSignal.timeout(3000) })
      const xml = await r.text()
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
      items.slice(0, 3).forEach(item => {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
        const enclosure = item.match(/enclosure[^>]*url="([^"]*\.mp3[^"]*)"/)?.[1] || ''
        if (title) episodes.push({ source: src.name, emoji: src.emoji, title: title.trim().substring(0,100), link, date, audio: enclosure })
      })
    } catch(e) {}
  }

  res.setHeader('Cache-Control', 's-maxage=1800')
  res.status(200).json({ episodes })
}
