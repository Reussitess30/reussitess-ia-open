/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
export default async function handler(req, res) {
  const sources = [
    { name: 'IEDOM', url: 'https://www.iedom.fr/rss.xml', emoji: '🏦' },
    { name: 'INSEE DOM', url: 'https://www.insee.fr/fr/flux/pages/rss.xml', emoji: '📊' },
    { name: 'AFD', url: 'https://www.afd.fr/fr/rss.xml', emoji: '🌍' },
    { name: 'Outre-mer la 1ère', url: 'https://la1ere.francetvinfo.fr/rss', emoji: '📺' },
    { name: 'Caribbean Dev Bank', url: 'https://www.caribank.org/rss.xml', emoji: '🌴' },
  ]

  const articles = []

  for (const source of sources) {
    try {
      const r = await fetch(source.url, {
        headers: { 'User-Agent': 'REUSSITESS-Bot/1.0' },
        signal: AbortSignal.timeout(3000)
      })
      const xml = await r.text()
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []
      for (const item of items.slice(0, 2)) {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
        const date = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
        const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || item.match(/<description>(.*?)<\/description>/)?.[1] || '').replace(/<[^>]*>/g,'').substring(0,150)
        if (title) articles.push({ source: source.name, emoji: source.emoji, title: title.trim().substring(0,100), link: link.trim(), date: date.trim(), desc })
      }
    } catch(e) {}
  }

  res.setHeader('Cache-Control', 's-maxage=1800')
  res.status(200).json({ success: true, articles: articles.slice(0,10), timestamp: new Date().toISOString() })
}
