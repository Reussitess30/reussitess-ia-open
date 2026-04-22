import { NextResponse } from 'next/server'

const REUSS_CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'
const POOL_ADDRESS = '0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c'

export async function GET() {
  try {
    const [poolRes, gasRes] = await Promise.allSettled([
      fetch(`https://api.dexscreener.com/latest/dex/pairs/polygon/${POOL_ADDRESS}`),
      fetch('https://gasstation.polygon.technology/v2')
    ])

    const pool = poolRes.status === 'fulfilled' ? await poolRes.value.json() : null
    const gas = gasRes.status === 'fulfilled' ? await gasRes.value.json() : null
    const pair = pool?.pairs?.[0] || null

    return NextResponse.json({
      reuss: {
        contract: REUSS_CONTRACT,
        pool: POOL_ADDRESS,
        network: 'Polygon',
        priceUsd: pair?.priceUsd || null,
        liquidity: pair?.liquidity?.usd || null,
        volume24h: pair?.volume?.h24 || null,
        fdv: pair?.fdv || null,
        txns24h: pair?.txns?.h24 || null
      },
      gas: {
        safeLow: gas?.safeLow?.maxFee || null,
        standard: gas?.standard?.maxFee || null,
        fast: gas?.fast?.maxFee || null,
        unit: 'Gwei'
      },
      web3Resources: {
        quickswap: `https://dapp.quickswap.exchange/swap/best/ETH/${REUSS_CONTRACT}?chainId=137`,
        polygonscan: `https://polygonscan.com/token/${REUSS_CONTRACT}`,
        dexscreener: `https://dexscreener.com/polygon/${POOL_ADDRESS}`,
        dextools: `https://www.dextools.io/app/polygon/pair-explorer/${POOL_ADDRESS}`
      },
      education: {
        dao: 'Organisation Autonome Decentralisee - gouvernance communautaire par vote token',
        nft: 'Jeton Non Fongible - actif numerique unique sur blockchain',
        staking: 'Immobilisation de tokens pour generer des recompenses',
        defi: 'Finance Decentralisee - services financiers sans intermediaire',
        web3: 'Internet decentralise base sur blockchain'
      },
      lastUpdate: new Date().toISOString()
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch Web3 data', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    )
  }
}

export const runtime = 'nodejs'
export const revalidate = 30
