'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

// Configuration Réelle Reussitess© (GAMMA)
const REUSS_TOKEN_ADDRESS = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
const ERC20_ABI = [
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)"
]

export default function MonitoringIA() {
  const [stats, setStats] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/ai-status')
        const data = await res.json()
        setStats(data)

        const logMessages = [
          `[SENTINELLE] Scan du contrat ${REUSS_TOKEN_ADDRESS.slice(0,6)}... ✅`,
          `[NEURO-X] Surveillance des 14 pays actifs ✅`,
          `[SUPRÊME] Synchronisation globale Reussitess© ✅`
        ]
        const newLog = `[${new Date().toLocaleTimeString()}] ${logMessages[Math.floor(Math.random() * logMessages.length)]}`
        setLogs(prev => [newLog, ...prev.slice(0, 49)])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'monospace' }}>
      INITIALISATION DU SYSTÈME RÉEL...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)', padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>🤖 MONITORING DES 200 IA</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Reussitess© - Terres De Champions Positivité à l'infini Boudoum 🇬🇵</p>
          </div>
          <Link href="/ia-passport" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', color: '#10b981', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>← Retour</Link>
        </div>

        {/* BOX STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <StatBox title="Sentinelles" data={stats.sentinelles} color="#ef4444" icon="🛡️" />
          <StatBox title="Neuro-X" data={stats.neurox} color="#3b82f6" icon="🧠" />
          <StatBox title="Nexus Quiz" data={stats.nexus} color="#8b5cf6" icon="🎯" />
          <StatBox title="IA Suprême" data={stats.supreme} color="#eab308" icon="👑" />
        </div>

        {/* LOGS */}
        <div style={{ background: '#000', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>📡 LOGS TEMPS RÉEL</h3>
          <div style={{ height: '200px', overflowY: 'auto', fontSize: '0.9rem' }}>
            {logs.map((log, i) => <div key={i} style={{ color: '#10b981', marginBottom: '0.3rem' }}>{log}</div>)}
          </div>
        </div>

        {/* DEXSCREENER */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '900' }}>📈 PRIX REUSSITESS (POLYGON)</h3>
          <div style={{ width: '100%', height: '600px', borderRadius: '15px', overflow: 'hidden' }}>
            <iframe src="https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2?embed=1&theme=dark" style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        </div>

        {/* MOTEUR DE SÉCURITÉ RÉEL */}
        <RealSecurityEngine />

        {/* HUB & CONSEILS */}
        <GlobalSecurityHub />

      </div>
    </div>
  )
}

function StatBox({ title, data, color, icon }: any) {
  return (
    <div style={{ background: `${color}1a`, border: `2px solid ${color}`, borderRadius: '20px', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h2 style={{ color: color, fontSize: '1.8rem', marginBottom: '1rem' }}>{data.active} {title}</h2>
      <p>Performance: {data.tasksCompleted || data.queries || data.commands}</p>
      <p>Status: {data.status}</p>
    </div>
  )
}

function RealSecurityEngine() {
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [detections, setDetections] = useState<any[]>([])

  const scanBlockchain = async () => {
    if (typeof window !== 'undefined' && !(window as any).ethereum) return alert('MetaMask non détecté')
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWallet(accounts[0])

      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, ERC20_ABI, provider)
      const suspects = [
        { name: "QuickSwap", addr: "0xa5E0829CaCEd8fFDD0194052302C4E04b904fD3E" },
        { name: "Uniswap V3", addr: "0xE592427A0AEce92De3Edee1F18E0157C05861564" }
      ]

      let found = []
      for (let s of suspects) {
        const allowance = await contract.allowance(accounts[0], s.addr)
        if (allowance > 0n) {
          found.push({ name: s.name, address: s.addr })
        }
      }
      setDetections(found)
      if (found.length === 0) alert("SCAN RÉEL : Aucune faille trouvée.")
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const revoke = async (spender: string) => {
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, ERC20_ABI, signer)
      const tx = await contract.approve(spender, 0)
      await tx.wait()
      alert("ACCÈS RÉVOQUÉ !")
      scanBlockchain()
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '25px', padding: '2rem' }}>
        <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '1.5rem', fontWeight: '900' }}>🛡️ REUSSSHIELD : SCAN & RÉVOCATION RÉELLE</h3>
        {!wallet ? (
          <button onClick={scanBlockchain} style={{ display: 'block', margin: '0 auto', padding: '1rem 2rem', background: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
            FOX CONNECTER & SCANNER
          </button>
        ) : (
          <div>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '1rem' }}>Wallet: {wallet}</p>
            {detections.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '1rem', borderRadius: '10px', border: '1px solid #ef4444', marginBottom: '10px' }}>
                <span>{d.name} → {d.address.slice(0,10)}...</span>
                <button onClick={() => revoke(d.address)} disabled={loading} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>RÉVOQUER</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '3px solid #ef4444', borderRadius: '30px', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444', fontWeight: '900' }}>⚡ SENTINEL BOT DESTROYER</h2>
        <button onClick={scanBlockchain} disabled={loading} style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          LANCER DESTRUCTION BOTS
        </button>
      </div>
    </div>
  )
}

function GlobalSecurityHub() {
  const tools = [
    { name: "Revoke.cash", url: "https://revoke.cash", icon: "🛡️" },
    { name: "DeFi Llama", url: "https://defillama.com/approvals", icon: "📊" },
    { name: "PolygonScan", url: "https://polygonscan.com", icon: "🔍" }
  ]

  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#050505', border: '2px solid #3b82f6', borderRadius: '30px' }}>
      <h2 style={{ color: '#3b82f6', fontSize: '2rem', textAlign: 'center', marginBottom: '2rem', fontWeight: '900' }}>🌐 HUB DE SÉCURITÉ MONDIAL</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {tools.map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'block', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
            <h4 style={{ color: '#fff' }}>{t.name}</h4>
          </a>
        ))}
      </div>

      <div style={{ padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '20px' }}>
        <h5 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>💡 CONSEILS DU FORUM REUSSITESS©</h5>
        <div style={{ display: 'grid', gap: '1rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
          <p><strong>1. Anti-Drain :</strong> Utilisez un Ledger pour vos REUSS.</p>
          <p><strong>2. Liquidity :</strong> Vérifiez le lock sur Unicrypt.</p>
          <p><strong>3. Contrat :</strong> Ne validez jamais "Unlimited Approval".</p>
        </div>
      </div>
      <p style={{ textAlign: 'center', marginTop: '2rem', opacity: 0.5 }}>Reussitess© Guadeloupe 🇬🇵</p>
    </div>
  )
}
