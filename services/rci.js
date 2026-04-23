export async function getRCIGuadeloupe() {
  try {
    const r = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=" +
      encodeURIComponent("https://rci.fm/guadeloupe/feed")
    )

    const d = await r.json()
    if (!d?.items?.length) return "📻 RCI indisponible 🇬🇵"

    return d.items.slice(0,5)
      .map((a,i)=>`${i+1}. ${a.title}\n${a.link}`)
      .join("\n\n")

  } catch {
    return "📻 RCI indisponible 🇬🇵"
  }
}
