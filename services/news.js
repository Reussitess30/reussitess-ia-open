export async function getActualitesOutremerComplet() {
  try {
    const feeds = [
      "https://la1ere.francetvinfo.fr/rss",
      "https://outremers360.com/feed",
      "https://www.bondamanjak.com/feed/"
    ]

    const data = await Promise.allSettled(
      feeds.map(url =>
        fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(url))
          .then(r => r.json())
      )
    )

    let items = []
    for (const d of data) {
      if (d.status === "fulfilled" && d.value?.items) {
        items.push(...d.value.items.slice(0, 3))
      }
    }

    return items.slice(0, 8)
      .map((a,i)=>`${i+1}. ${a.title}\n${a.link}`)
      .join("\n\n")

  } catch {
    return "📰 Actu indisponible 🇬🇵"
  }
}
