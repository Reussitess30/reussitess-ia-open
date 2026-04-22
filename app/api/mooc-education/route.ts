import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [khanRes, courseraRes, bpiRes] = await Promise.allSettled([
      fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.khanacademy.org/computing/rss.xml', { next: { revalidate: 3600 } }),
      fetch('https://api.rss2json.com/v1/api.json?rss_url=https://blog.coursera.org/feed/', { next: { revalidate: 3600 } }),
      fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.bpifrance.fr/rss', { next: { revalidate: 3600 } })
    ])

    const khan = khanRes.status === 'fulfilled' ? await khanRes.value.json() : null
    const coursera = courseraRes.status === 'fulfilled' ? await courseraRes.value.json() : null
    const bpi = bpiRes.status === 'fulfilled' ? await bpiRes.value.json() : null

    return NextResponse.json({
      platforms: {
        khanAcademy: {
          name: 'Khan Academy',
          url: 'https://fr.khanacademy.org',
          description: 'Cours gratuits mathematiques, sciences, informatique',
          articles: (khan?.items || []).slice(0, 3).map((i: any) => ({ title: i.title, link: i.link }))
        },
        coursera: {
          name: 'Coursera',
          url: 'https://www.coursera.org',
          description: 'MOOC certifiants universite mondiale',
          articles: (coursera?.items || []).slice(0, 3).map((i: any) => ({ title: i.title, link: i.link }))
        },
        bpiFrance: {
          name: 'BPI France',
          url: 'https://www.bpifrance.fr',
          description: 'Formation entrepreneurs et start-ups France',
          articles: (bpi?.items || []).slice(0, 3).map((i: any) => ({ title: i.title, link: i.link }))
        },
        domTomSpecific: [
          { name: 'LADOM', url: 'https://www.ladom.fr', description: 'Mobilite et formation DOM-TOM' },
          { name: 'CROUS Antilles', url: 'https://www.crous-antilles-guyane.fr', description: 'Aide etudiants Guadeloupe Martinique Guyane' },
          { name: 'France Travail Guadeloupe', url: 'https://www.francetravail.fr', description: 'Formation professionnelle Guadeloupe' },
          { name: 'Universite des Antilles', url: 'https://www.univ-antilles.fr', description: 'Universite publique Guadeloupe Martinique' }
        ]
      },
      lastUpdate: new Date().toISOString()
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch education data', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const revalidate = 3600
