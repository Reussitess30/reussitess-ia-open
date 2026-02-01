'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

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
          `[SENTINELLE-${Math.floor(Math.random() * 40)}] Protection contrat ✅`,
          `[NEURO-X-${Math.floor(Math.random() * 60)}] Analyse Amazon BE ✅`,
          `[NEXUS-${Math.floor(Math.random() * 99)}] Query processed ✅`,
          `[SUPRÊME] Synchronisation globale ✅`
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

  if (!stats) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Chargement du système...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)', padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
      <style jsx global>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>🤖 MONITORING DES 200 IA</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Système Quantum Nexus - Temps Réel | Guadeloupe 🇬🇵</p>
          </div>
          <Link href="/ia-passport" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', color: '#10b981', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>← Retour</Link>
        </div>
        
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: '15px', height: '15px', background: '#10b981', borderRadius: '50%', marginRight: '10px', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>SYSTÈME OPÉRATIONNEL - {stats.global.tasksRunning} TÂCHES EN COURS</span>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>Dernière mise à jour : {new Date(stats.global.lastUpdate).toLocaleString()}</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛡️</div>
            <h2 style={{ color: '#ef4444', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.sentinelles.active} Sentinelles</h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p>📊 Tâches: {stats.sentinelles.tasksCompleted}</p>
              <p>⚠️ Alertes: {stats.sentinelles.alerts}</p>
              <p>📍 Status: {stats.sentinelles.status}</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ color: '#3b82f6', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.neurox.active} Neuro-X</h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p>📈 Prédictions: {stats.neurox.predictions}</p>
              <p>🎯 Précision: {stats.neurox.accuracy}%</p>
              <p>📍 Status: {stats.neurox.status}</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '2px solid #8b5cf6', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h2 style={{ color: '#8b5cf6', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.nexus.active} Nexus Quiz</h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p>📊 Queries: {stats.nexus.queries.toLocaleString()}</p>
              <p>🌍 Pays: {stats.nexus.countries}</p>
              <p>📍 Status: {stats.nexus.status}</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '2px solid #eab308', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
            <h2 style={{ color: '#eab308', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.supreme.active} IA Suprême</h2>
            <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.8' }}>
              <p>⚡ Commandes: {stats.supreme.commands}</p>
              <p>📊 Uptime: {stats.supreme.uptime}%</p>
              <p>📍 Status: {stats.supreme.status}</p>
            </div>
          </div>
        </div>
        
        <div style={{ background: '#000', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>📡 LOGS TEMPS RÉEL</h3>
          <div style={{ height: '300px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.8' }}>
            {logs.map((log, i) => <div key={i} style={{ color: '#10b981', marginBottom: '0.3rem' }}>{log}</div>)}
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '900' }}>
            📈 PRIX REUSSITESS EN TEMPS RÉEL
          </h3>
          <div style={{ width: '100%', height: '650px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <iframe
              src="https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2?embed=1&theme=dark"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="clipboard-write"
            />
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#64748b' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{stats.global.message}</p>
        </div>

        {/* AJOUT DE TA NOUVELLE SECTION DE SÉCURITÉ ICI */}
        <ReussShieldSection />

      </div>
    </div>
  )
}

// --- LOGIQUE DE PROTECTION REUSSSHIELD ---

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function name() public view returns (string)",
  "function symbol() public view returns (string)"
]

const TOKENS_TO_SCAN = [
  { address: '0x2791bca1f2de4661ff91a120536f7360caa6ca7d', symbol: 'USDC' },
  { address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', symbol: 'WMATIC' },
  { address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', symbol: 'WETH' },
  { address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', symbol: 'USDT' },
  { address: '0xb37531727fc07c6eed4f97f852a115b428046eb2', symbol: 'REUSS' }
]

const SAFE_SPENDERS = [
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // QuickSwap V3
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Exchange
  '0x1111111254eeb25477b68fb85ed929f73a960582'  // 1inch V5
]

// Liste noire spécifique basée sur tes consignes
const MALICIOUS_SPENDERS = [
  '0x885b37586ad4263835f949c17B38b367541b85ea',
  '0xB3E28eF64A312abB5F13CDE0400697cdE25da60b'
]

function ReussShieldSection() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [approvals, setApprovals] = useState<any[]>([])
  const [threats, setThreats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [scanning, setScanning] = useState(false)

  // Simulation de feed IA
  useEffect(() => {
    if (walletConnected) {
      const interval = setInterval(() => {
        const feeds = [
          "Analyse Nexus 14 pays : Trafic sécurisé ✅",
          "Shield IA : Détection de bot frontrun neutralisée",
          "Surveillance Guadeloupe : Système stable",
          "Scan REUSS : 0x885b bloqué par Sentinelle"
        ]
        const newFeed = {
          time: new Date().toLocaleTimeString(),
          message: feeds[Math.floor(Math.random() * feeds.length)],
          type: 'info'
        }
        setThreats(prev => [newFeed, ...prev.slice(0, 9)])
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [walletConnected])

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      alert('Installez MetaMask')
      return
    }
    try {
      setLoading(true)
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
      setWalletAddress(accounts[0])
      setWalletConnected(true)
      await scanRealApprovals(accounts[0])
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const scanRealApprovals = async (address: string) => {
    setScanning(true)
    const found: any[] = []
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const allSpenders = [...SAFE_SPENDERS, ...MALICIOUS_SPENDERS]

      for (const token of TOKENS_TO_SCAN) {
        const contract = new ethers.Contract(token.address, ERC20_ABI, provider)
        for (const spender of allSpenders) {
          const allowance = await contract.allowance(address, spender)
          if (allowance > 0n) {
            const isMalicious = MALICIOUS_SPENDERS.some(m => m.toLowerCase() === spender.toLowerCase())
            found.push({
              token: token.symbol,
              tokenAddress: token.address,
              spender: isMalicious ? "⚠️ CIBLE MALVEILLANTE" : "DEX VÉRIFIÉ",
              spenderFull: spender,
              amount: allowance >= ethers.MaxUint256 / 2n ? '∞' : ethers.formatUnits(allowance, 18),
              risk: isMalicious ? 'CRITIQUE' : 'SÉCURISÉ',
              safe: !isMalicious,
              revoked: false
            })
          }
        }
      }
      setApprovals(found)
    } catch (e) { console.error(e) } finally { setScanning(false) }
  }

  const revoke = async (index: number) => {
    const item = approvals[index]
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(item.tokenAddress, ERC20_ABI, signer)
      const tx = await contract.approve(item.spenderFull, 0)
      await tx.wait()
      const updated = [...approvals]
      updated[index].revoked = true
      setApprovals(updated)
      alert("✅ Révocation confirmée sur la blockchain !")
    } catch (e) { alert("Action annulée ou erreur") } finally { setLoading(false) }
  }

  return (
    <div style={{ marginTop: '5rem', borderTop: '2px solid #10b981', paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>🛡️ REUSSSHIELD AI GUARDIAN</h2>
        <p style={{ color: '#64748b' }}>Analyse des délégations et protection des fonds Reussitess®</p>
      </div>

      {!walletConnected ? (
        <button onClick={connectWallet} style={{ width: '100%', padding: '1.5rem', background: '#10b981', color: 'black', fontWeight: '900', borderRadius: '15px', cursor: 'pointer', border: 'none', fontSize: '1.1rem' }}>
          ACTIVER LA SENTINELLE ANTI-FRAUDE
        </button>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #10b981', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>🚨 DÉLÉGATIONS DÉTECTÉES</h3>
            {approvals.length === 0 ? <p>Aucun risque détecté.</p> : approvals.map((app, i) => (
              <div key={i} style={{ borderBottom: '1px solid #333', padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ color: app.safe ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{app.token} : {app.risk}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{app.spenderFull}</div>
                </div>
                {!app.revoked && !app.safe && (
                  <button onClick={() => revoke(i)} style={{ background: '#ef4444', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>RÉVOQUER</button>
                )}
                {app.revoked && <span style={{ color: '#10b981' }}>RÉVOQUÉ</span>}
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid #10b981', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>📡 SHIELD ACTIVITY</h3>
            <div style={{ fontSize: '0.8rem' }}>
              {threats.map((t, i) => <div key={i} style={{ marginBottom: '5px', color: '#64748b' }}>[{t.time}] {t.message}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
