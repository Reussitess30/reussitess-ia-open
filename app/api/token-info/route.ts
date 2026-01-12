import { NextResponse } from 'next/server'

export async function GET() {
  const tokenData = {
    name: "REUSSITESS Token",
    symbol: "REUSS",
    decimals: 18,
    totalSupply: "1000000000",
    contract: "0xB37531727fC07c6EED4f97F852A115B428046EB2",
    chain: "Polygon",
    chainId: 137,
    pool: "0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c",
    website: "https://www.reussitess.fr",
    description: "REUSSITESS Token - Ecosystem token for multi-country operations with AI integration",
    links: {
      website: "https://www.reussitess.fr",
      polygonscan: "https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2",
      dexscreener: "https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2",
      dextools: "https://www.dextools.io/app/polygon/pair-explorer/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c"
    }
  }
  
  return NextResponse.json(tokenData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, s-maxage=300'
    }
  })
}

export async function HEAD() {
  return new Response(null, { status: 200 })
}
