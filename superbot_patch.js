
// =================== PATCH SAFE SUPERBOT ===================

async function getRCIGuadeloupe() {
  try {
    const url = "https://api.rss2json.com/v1/api.json?rss_url=" +
      encodeURIComponent("https://rci.fm/guadeloupe/feed")

    const r = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()

    if (!d?.items?.length) {
      return "📻 RCI Guadeloupe indisponible. Boudoum ! 🇬🇵"
    }

    return d.items.slice(0, 5).map((a, i) =>
      `${i + 1}. **${a.title}**\n🔗 ${a.link}`
    ).join("\n\n") + "\n\nBoudoum ! 🇬🇵"

  } catch (e) {
    return "📻 RCI Guadeloupe indisponible. Boudoum ! 🇬🇵"
  }
}

async function getActualitesOutremerComplet() {
  try {
    const feeds = [
      "https://la1ere.francetvinfo.fr/rss",
      "https://outremers360.com/feed",
      "https://www.bondamanjak.com/feed/"
    ]

    const results = await Promise.allSettled(
      feeds.map(url =>
        fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(url))
          .then(r => r.json())
      )
    )

    let articles = []

    for (const r of results) {
      if (r.status === "fulfilled" && r.value?.items) {
        articles.push(...r.value.items.slice(0, 3))
      }
    }

    if (!articles.length) {
      return "📰 Aucun article disponible. Boudoum ! 🇬🇵"
    }

    return articles.slice(0, 8).map((a, i) =>
      `${i + 1}. **${a.title}**\n🔗 ${a.link}`
    ).join("\n\n") + "\n\nBoudoum ! 🇬🇵"

  } catch (e) {
    return "📰 Actualités indisponibles. Boudoum ! 🇬🇵"
  }
}

async function getCryptoPaysDevise(crypto = "bitcoin", devise = "usd") {
  try {
    const id = crypto.toLowerCase()

    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=" +
      id +
      "&vs_currencies=" + devise + ",eur,usd"

    const r = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const d = await r.json()

    if (!d?.[id]) return "💰 Crypto introuvable. Boudoum ! 🇬🇵"

    const p = d[id]

    return `💰 **${crypto.toUpperCase()}**
USD: $${p.usd || "N/A"}
EUR: €${p.eur || "N/A"}

Boudoum ! 🇬🇵`

  } catch (e) {
    return "💰 Crypto indisponible. Boudoum ! 🇬🇵"
  }
}

