import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Prix MATIC/Polygon via CoinGecko gratuit sans clé
    const [maticRes, reussPoolRes] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true'),
      fetch('https://api.dexscreener.com/latest/dex/pairs/polygon/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c')
    ])

    const maticData = maticRes.status === 'fulfilled' ? await maticRes.value.json() : null
    const reussData = reussPoolRes.status === 'fulfilled' ? await reussPoolRes.value.json() : null

    const reussPair = reussData?.pairs?.[0] || null

    return NextResponse.json({
      matic: {
        usd: maticData?.['matic-network']?.usd || null,
        eur: maticData?.['matic-network']?.eur || null,
        change24h: maticData?.['matic-network']?.usd_24h_change || null,
        marketCap: maticData?.['matic-network']?.usd_market_cap || null
      },
      reuss: {
        priceUsd: reussPair?.priceUsd || null,
        priceNative: reussPair?.priceNative || null,
        volume24h: reussPair?.volume?.h24 || null,
        liquidity: reussPair?.liquidity?.usd || null,
        change24h: reussPair?.priceChange?.h24 || null,
        change6h: reussPair?.priceChange?.h6 || null,
        txns24h: reussPair?.txns?.h24 || null,
        dexUrl: 'https://dexscreener.com/polygon/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c'
      },
      lastUpdate: new Date().toISOString(),
      network: 'Polygon',
      source: 'CoinGecko + DexScreener'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch crypto prices', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const revalidate = 30
