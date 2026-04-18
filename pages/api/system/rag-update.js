import { Redis } from '@upstash/redis'

const SOURCES = [
  { url: "https://la1ere.francetvinfo.fr/guadeloupe/rss.xml", territoire: "guadeloupe" },
  { url: "https://la1ere.francetvinfo.fr/martinique/rss.xml", territoire: "martinique" },
  { url: "https://la1ere.francetvinfo.fr/reunion/rss.xml", territoire: "reunion" },
  { url: "https://la1ere.francetvinfo.fr/guyane/rss.xml", territoire: "guyane" },
  { url: "https://la1ere.francetvinfo.fr/mayotte/rss.xml", territoire: "mayotte" },
  { url: "https://la1ere.francetvinfo.fr/nouvelle-caledonie/rss.xml", territoire: "nouvelle-caledonie" },
  { url: "https://www.bondamanjak.com/feed/", territoire: "guadeloupe" },
  { url: "https://outremers360.com/feed/", territoire: "outremer" },
  { url: "https://www.zinfos974.com/feed/", territoire: "reunion" },
]

async function extractKeyInfo(title, description) {
  // Détecter type d'info
  const t = (title + " " + description).toLowerCase()
  
  const tags = []
  if (t.includes("élu") || t.includes("président") || t.includes("maire") || t.includes("député") || t.includes("sénateur")) tags.push("politique")
  if (t.includes("cyclone") || t.includes("tempête") || t.includes("séisme") || t.includes("alerte")) tags.push("alerte")
  if (t.includes("décès") || t.includes("mort") || t.includes("décédé")) tags.push("necrologie")
  if (t.includes("artiste") || t.includes("chanteur") || t.includes("musique") || t.includes("concert")) tags.push("culture")
  if (t.includes("économie") || t.includes("emploi") || t.includes("grève") || t.includes("entreprise")) tags.push("economie")
  if (t.includes("sport") || t.includes("champion") || t.includes("victoire") || t.includes("match")) tags.push("sport")
  
  return tags
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).end()
  
  // Sécurité — clé secrète
  const secret = req.headers['x-cron-secret'] || req.query.secret
  if (secret !== process.env.CRON_SECRET && secret !== 'reussitess-rag-2026') {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    const redis = Redis.fromEnv()
    const allItems = []
    
    // Récupérer tous les RSS en parallèle
    const promises = SOURCES.map(async (source) => {
      try {
        const res = await fetch(
          "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(source.url) + "&count=5",
          { signal: AbortSignal.timeout(5000) }
        )
        const data = await res.json()
        if (data.items?.length > 0) {
          for (const item of data.items) {
            const tags = await extractKeyInfo(item.title, item.description || "")
            allItems.push({
              titre: item.title,
              lien: item.link,
              date: item.pubDate,
              territoire: source.territoire,
              tags,
              source: source.url
            })
          }
        }
      } catch(e) {}
    })
    
    await Promise.allSettled(promises)
    
    // Stocker dans Redis par territoire et par tag
    const byTerritoire = {}
    const byTag = {}
    
    for (const item of allItems) {
      // Par territoire
      if (!byTerritoire[item.territoire]) byTerritoire[item.territoire] = []
      byTerritoire[item.territoire].push(item)
      
      // Par tag
      for (const tag of item.tags) {
        if (!byTag[tag]) byTag[tag] = []
        byTag[tag].push(item)
      }
    }
    
    // Sauvegarder dans Redis
    const pipeline = []
    
    for (const [territoire, items] of Object.entries(byTerritoire)) {
      await redis.set(`rag:actu:${territoire}`, JSON.stringify(items.slice(0, 10)), { ex: 3 * 60 * 60 })
    }
    
    for (const [tag, items] of Object.entries(byTag)) {
      await redis.set(`rag:tag:${tag}`, JSON.stringify(items.slice(0, 10)), { ex: 3 * 60 * 60 })
    }
    
    // Stocker résumé global
    await redis.set('rag:global:lastUpdate', new Date().toISOString(), { ex: 24 * 60 * 60 })
    await redis.set('rag:global:allNews', JSON.stringify(allItems.slice(0, 50)), { ex: 3 * 60 * 60 })
    
    console.log(`RAG: ${allItems.length} articles indexés`)
    return res.status(200).json({ 
      success: true, 
      indexed: allItems.length,
      territoires: Object.keys(byTerritoire),
      tags: Object.keys(byTag),
      lastUpdate: new Date().toISOString()
    })
    
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
