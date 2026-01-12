'use client'
import { useState, useEffect } from 'react'
import { TrendingUp, ExternalLink } from 'lucide-react'

export default function TokenPriceWidget() {
  const [liquidity, setLiquidity] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://api.etherscan.io/v2/api?chainid=137&module=account&action=tokenbalance&contractaddress=0xB37531727fC07c6EED4f97F852A115B428046EB2&address=0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c&tag=latest&apikey=SBQYXZE71Y18ZE8VC9NZTM7GQ14KX6B695'
        )
        const data = await res.json()
        if (data.status === '1') {
          setLiquidity(parseInt(data.result) / 10**18)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 z-50 animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 animate-pulse" />
        <span className="font-bold text-lg">$REUSS</span>
      </div>
      
      {loading ? (
        <div className="text-sm opacity-75">Chargement...</div>
      ) : (
        <>
          <div className="text-2xl font-bold mb-1">
            {liquidity.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs opacity-75 mb-3">Tokens en Liquidité</div>
          
          <div className="flex gap-2">
            <a
              href="https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all"
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all"
            >
              Chart <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </>
      )}
    </div>
  )
}
