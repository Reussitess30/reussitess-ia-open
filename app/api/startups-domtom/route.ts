import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [bpiRes, adieRes] = await Promise.allSettled([
      fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.bpifrance.fr/rss', { next: { revalidate: 3600 } }),
      fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.adie.org/feed/', { next: { revalidate: 3600 } })
    ])

    const bpi = bpiRes.status === 'fulfilled' ? await bpiRes.value.json() : null
    const adie = adieRes.status === 'fulfilled' ? await adieRes.value.json() : null

    return NextResponse.json({
      ressources: {
        financement: [
          { name: 'BPI France', url: 'https://www.bpifrance.fr', desc: 'Prets et garanties entrepreneurs', articles: (bpi?.items || []).slice(0, 3).map((i: any) => ({ title: i.title, link: i.link })) },
          { name: 'ADIE', url: 'https://www.adie.org', desc: 'Microcredit entrepreneurs DOM-TOM', articles: (adie?.items || []).slice(0, 3).map((i: any) => ({ title: i.title, link: i.link })) },
          { name: 'ACRE', url: 'https://www.urssaf.fr', desc: 'Exoneration charges createurs entreprise' },
          { name: 'AFD Guadeloupe', url: 'https://www.afd.fr', desc: 'Financement developpement Outre-mer' }
        ],
        accompagnement: [
          { name: 'Region Guadeloupe', url: 'https://www.regionguadeloupe.fr', desc: 'Aides regionales entrepreneurs' },
          { name: 'CCI Guadeloupe', url: 'https://www.guadeloupe.cci.fr', desc: 'Chambre de Commerce et Industrie' },
          { name: 'Initiative Guadeloupe', url: 'https://www.initiative-guadeloupe.com', desc: 'Reseau entrepreneurs Guadeloupe' },
          { name: 'Guadeloupe Expansion', url: 'https://www.guadeloupe-expansion.com', desc: 'Agence developpement economique Guadeloupe' }
        ],
        statuts: [
          { nom: 'Auto-entrepreneur', avantages: 'Simple, charges reduites, ideal demarrage' },
          { nom: 'SARL', avantages: 'Protection patrimoine, credibilite partenaires' },
          { nom: 'SAS', avantages: 'Flexible, levee fonds, plusieurs associes' },
          { nom: 'EURL', avantages: 'Associe unique, responsabilite limitee' }
        ],
        aidesDOMTOM: [
          'Defiscalisation Girardin - reduction impots investissement DOM',
          'ZFA Zone Franche Active - exonerations fiscales Guadeloupe',
          'RSTA Revenu Supplementaire Temporaire Activite',
          'Pret Croissance Outre-mer BPI France',
          'Fonds FEDER Europe Guadeloupe',
          'Aide REACT-EU relance economique DOM'
        ]
      },
      lastUpdate: new Date().toISOString()
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch startup data', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const revalidate = 3600
