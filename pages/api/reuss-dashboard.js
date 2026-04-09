export default async function handler(req, res) {
  try {
    const alchemyKey = process.env.ALCHEMY_API_KEY
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'
    const SUPPLY_TOTAL = 999999999

    const [metaRes, transfersRes, supplyRes] = await Promise.all([
      fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'alchemy_getTokenMetadata', params: [CONTRACT] })
      }),
      fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'alchemy_getAssetTransfers',
          params: [{ contractAddresses: [CONTRACT], category: ['erc20'], maxCount: '0x14', order: 'desc', withMetadata: true }]
        })
      }),
      fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'eth_call', params: [{ to: CONTRACT, data: '0x18160ddd' }, 'latest'] })
      })
    ])

    const meta = (await metaRes.json()).result
    const transfers = (await transfersRes.json()).result?.transfers || []
    const supplyHex = (await supplyRes.json()).result || '0x0'
    const supplyCirc = parseInt(supplyHex, 16) / 1e18

    // Prix via DexScreener
    let price = null
    try {
      const priceRes = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT}`)
      const priceData = await priceRes.json()
      price = priceData?.pairs?.[0]?.priceUsd || null
    } catch(e) {}

    // Holders approximatif via transfers uniques
    const uniqueAddresses = new Set()
    transfers.forEach(t => { uniqueAddresses.add(t.to); uniqueAddresses.add(t.from) })

    // Historique 7 jours
    const now = Date.now()
    const history = {}
    transfers.forEach(t => {
      const date = t.metadata?.blockTimestamp?.substring(0, 10) || 'unknown'
      if (!history[date]) history[date] = { count: 0, volume: 0 }
      history[date].count++
      history[date].volume += parseFloat(t.value || 0)
    })

    // Top holders via balances des adresses uniques
    const topAddresses = [...uniqueAddresses].slice(0, 10)
    let topHolders = []
    try {
      const balRes = await fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 4, method: 'alchemy_getTokenBalances', params: [topAddresses[0], [CONTRACT]] })
      })
      const balData = await balRes.json()
      // Fetch balances pour chaque adresse unique
      const balPromises = topAddresses.map(addr =>
        fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 5, method: 'alchemy_getTokenBalances', params: [addr, [CONTRACT]] })
        }).then(r => r.json()).then(d => ({
          address: addr,
          balance: parseInt(d.result?.tokenBalances?.[0]?.tokenBalance || '0x0', 16) / 1e18
        })).catch(() => ({ address: addr, balance: 0 }))
      )
      topHolders = (await Promise.all(balPromises)).sort((a, b) => b.balance - a.balance).slice(0, 5)
    } catch(e) {}

    return res.status(200).json({
      name: meta.name,
      symbol: meta.symbol,
      decimals: meta.decimals,
      contract: CONTRACT,
      supplyTotal: SUPPLY_TOTAL,
      supplyCirc: supplyCirc.toFixed(0),
      price: price ? parseFloat(price).toFixed(8) : null,
      uniqueAddresses: uniqueAddresses.size,
      transfers: transfers.map(t => ({
        from: t.from,
        to: t.to,
        value: parseFloat(t.value || 0).toFixed(4),
        hash: t.hash,
        time: t.metadata?.blockTimestamp || null
      })),
      history: Object.entries(history).sort((a,b) => a[0].localeCompare(b[0])),
      topHolders
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
