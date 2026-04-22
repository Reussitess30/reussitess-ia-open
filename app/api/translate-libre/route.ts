import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text, source = 'fr', target } = await request.json()

    if (!text || !target) {
      return NextResponse.json({ error: 'text et target requis' }, { status: 400 })
    }

    const supportedLangs: Record<string, string> = {
      'en': 'Anglais',
      'es': 'Espagnol',
      'pt': 'Portugais',
      'de': 'Allemand',
      'it': 'Italien',
      'nl': 'Neerlandais',
      'ar': 'Arabe',
      'zh': 'Chinois',
      'hi': 'Hindi',
      'sw': 'Swahili',
      'yo': 'Yoruba',
      'ha': 'Haoussa',
      'fr': 'Francais',
      'ht': 'Creole Haitien'
    }

    const [res1, res2] = await Promise.allSettled([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`),
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}&de=influenceur@reussitess.fr`)
    ])

    const data1 = res1.status === 'fulfilled' ? await res1.value.json() : null
    const data2 = res2.status === 'fulfilled' ? await res2.value.json() : null

    const translation = data1?.responseData?.translatedText ||
                       data2?.responseData?.translatedText ||
                       null

    return NextResponse.json({
      original: text,
      translation,
      source: supportedLangs[source] || source,
      target: supportedLangs[target] || target,
      quality: data1?.responseData?.match || null,
      supportedLanguages: supportedLangs,
      lastUpdate: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
