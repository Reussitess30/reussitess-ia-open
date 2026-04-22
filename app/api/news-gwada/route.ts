import { NextResponse } from 'next/server'

const RSS_SOURCES = [
  {
    name: 'RCI Guadeloupe',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.rci.fm/guadeloupe/feed',
    region: 'Guadeloupe'
  },
  {
    name: 'France-Antilles',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.france-antilles.fr/feed',
    region: 'Antilles'
  },
  {
    name: 'Outre-mer 1ère',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://la1ere.francetvinfo.fr/rss',
    region: 'DOM-TOM'
  },
  {
    name: 'Le Monde Afrique',
    url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.lemonde.fr/afrique/rss_full.xml',
    region: 'Afrique'
  }
]

export async function GET() {
  try {
    const results = await Promise.allSettled(
      RSS_SOURCES.map(source =>
        fetch(source.url, { next: { revalidate: 300 } })
          .then(res => res.json())
          .then(data => ({
            source: source.name,
            region: source.region,
            articles: (data.items || []).slice(0, 5).map((item: any) => ({
              title: item.title,
              description: item.description?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
              link: item.link,
              pubDate: item.pubDate,
              thumbnail: item.thumbnail || null
            }))
          }))
      )
    )

    const news = results
      .filter(r => r.status === 'fulfilled')
      .map((r: any) => r.value)
      .filter(r => r.articles.length > 0)

    const allArticles = news.flatMap(source =>
      source.articles.map((a: any) => ({ ...a, source: source.source, region: source.region }))
    ).sort((a: any, b: any) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return NextResponse.json({
      sources: news.length,
      totalArticles: allArticles.length,
      articles: allArticles.slice(0, 20),
      byRegion: news,
      lastUpdate: new Date().toISOString(),
      coverage: ['Guadeloupe', 'Martinique', 'DOM-TOM', 'Afrique', 'Caraïbes']
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const revalidate = 300
