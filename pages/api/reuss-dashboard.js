export default async function handler(req, res) {
  try {
    const alchemyKey = process.env.ALCHEMY_API_KEY
    const CONTRACT = '0xB37531727fC07c6EED4f97F852A115B428046EB2'

    const [metaRes, transfersRes] = await Promise.all([
      fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'alchemy_getTokenMetadata', params: [CONTRACT] })
      }),
      fetch(`https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 2, method: 'alchemy_getAssetTransfers',
          params: [{ contractAddresses: [CONTRACT], category: ['erc20'], maxCount: '0xa', order: 'desc', withMetadata: true }]
        })
      })
    ])

    const meta = (await metaRes.json()).result
    const transfers = (await transfersRes.json()).result?.transfers || []

    return res.status(200).json({
      name: meta.name,
      symbol: meta.symbol,
      decimals: meta.decimals,
      contract: CONTRACT,
      transfers: transfers.map(t => ({
        from: t.from,
        to: t.to,
        value: parseFloat(t.value || 0).toFixed(4),
        hash: t.hash,
        time: t.metadata?.blockTimestamp || null
      }))
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
