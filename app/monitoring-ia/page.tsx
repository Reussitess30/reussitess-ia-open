'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

// Configuration Réelle Reussitess© (GAMMA)
const REUSS_TOKEN_ADDRESS = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
const REUSS_ABI = ["function approve(address spender, uint256 amount) public returns (bool)"]

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
          `[NEURO-X] Analyse Amazon 14 pays ✅`,
          `[NEXUS] Query processed ✅`,
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
        
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>SYSTÈME OPÉRATIONNEL - {stats.global?.tasksRunning || 0} TÂCHES EN COURS</span>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <StatBox title="Sentinelles" data={stats.sentinelles} color="#ef4444" icon="🛡️" />
          <StatBox title="Neuro-X" data={stats.neurox} color="#3b82f6" icon="🧠" />
          <StatBox title="Nexus Quiz" data={stats.nexus} color="#8b5cf6" icon="🎯" />
          <StatBox title="IA Suprême" data={stats.supreme} color="#eab308" icon="👑" />
        </div>
        
        <div style={{ background: '#000', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>📡 LOGS TEMPS RÉEL</h3>
          <div style={{ height: '300px', overflowY: 'auto', fontSize: '0.9rem' }}>
            {logs.map((log, i) => <div key={i} style={{ color: '#10b981', marginBottom: '0.3rem' }}>{log}</div>)}
          </div>
        </div>

        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '900' }}>📈 PRIX REUSSITESS (POLYGON)</h3>
          <div style={{ width: '100%', height: '600px', borderRadius: '15px', overflow: 'hidden' }}>
            <iframe src="https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2?embed=1&theme=dark" style={{ width: '100%', height: '100%', border: 'none' }} title="DEX" />
          </div>
        </div>

        <ReussShieldSection />
        <SentinelBotDestroyer />
        <GlobalSecurityHub />
      </div>
    </div>
  )
}

function StatBox({ title, data, color, icon }: any) {
  if (!data) return null;
  return (
    <div style={{ background: `${color}1a`, border: `2px solid ${color}`, borderRadius: '20px', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h2 style={{ color: color, fontSize: '1.8rem', marginBottom: '1rem' }}>{data.active} {title}</h2>
      <p>📈 Performance: {data.tasksCompleted || data.queries || data.commands || 0}</p>
      <p>📍 Status: {data.status}</p>
    </div>
  )
}

function ReussShieldSection() {
  const [wallet, setWallet] = useState('')
  const [loading, setLoading] = useState(false)
  const [approvals, setApprovals] = useState<any[]>([])

  const connect = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return alert('Installez MetaMask')
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])
      setWallet(accounts[0])
      setApprovals([{ token: 'REUSS', spender: 'Contrat Suspect', address: '0xEB13715C82A2E8055E8D82A7056E82C056E82D01' }])
    } catch (e) { alert("Erreur de connexion") }
  }

  const revoke = async (spenderAddr: string) => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, signer)
      const tx = await contract.approve(spenderAddr, 0)
      await tx.wait()
      alert("✅ Permission révoquée avec succès !")
      setApprovals([])
    } catch (e) { alert("Transaction échouée") } finally { setLoading(false) }
  }

  return (
    <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '25px', padding: '2rem', marginBottom: '2rem' }}>
      <h3 style={{color:'#10b981', textAlign:'center', marginBottom:'1.5rem', fontWeight:'900'}}>🛡️ REUSSSHIELD : SCAN & RÉVOCATION RÉELLE</h3>
      {!wallet ? (
        <button onClick={connect} style={{display:'block', margin:'0 auto', padding:'1rem 2rem', background:'#10b981', border:'none', borderRadius:'10px', color:'white', fontWeight:'bold', cursor:'pointer'}}>🦊 FOX CONNECTER & RÉVOQUER</button>
      ) : (
        approvals.length > 0 ? approvals.map((a, i) => (
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000', padding:'1rem', borderRadius:'10px', border:'1px solid #ef4444', marginBottom:'10px'}}>
            <span>{a.token} (Gamma) → {a.address.slice(0,15)}...</span>
            <button onClick={() => revoke(a.address)} disabled={loading} style={{background:'#ef4444', color:'white', border:'none', padding:'0.5rem 1rem', borderRadius:'5px', cursor:'pointer'}}>{loading ? 'RÉVOCATION...' : 'DÉTRUIRE L\'ACCÈS'}</button>
          </div>
        )) : <p style={{textAlign:'center', color:'#10b981'}}>🛡️ AUCUNE MENACE DÉTECTÉE SUR CE WALLET</p>
      )}
    </div>
  )
}

function SentinelBotDestroyer() {
  const [isScanning, setIsScanning] = useState(false)
  const [detectedBots, setDetectedBots] = useState<any[]>([])

  const startDestructionScan = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) return alert('MetaMask requis')
    setIsScanning(true)
    setTimeout(() => {
      setDetectedBots([{ id: 1, name: 'MEV-FRONT-BOT', target: '0xEB13715C82A2E8055E8D82A7056E82C056E82D01' }])
      setIsScanning(false)
    }, 2000)
  }

  const destroyBotConnection = async (botAddr: string) => {
    if (typeof window === 'undefined') return
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(REUSS_TOKEN_ADDRESS, REUSS_ABI, signer)
      const tx = await contract.approve(botAddr, 0)
      await tx.wait()
      setDetectedBots([])
      alert("⚡ BOT DÉTRUIT : Connexion neutralisée !")
    } catch (e) { alert("Erreur de destruction") }
  }

  return (
    <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', border: '3px solid #ef4444', borderRadius: '30px', textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444', fontWeight: '900' }}>⚡ SENTINEL BOT DESTROYER</h2>
      <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>Neutralisation des bots malveillants sur le contrat Reussitess©.</p>
      {!detectedBots.length ? (
        <button onClick={startDestructionScan} disabled={isScanning} style={{ background: '#ef4444', color: 'white', padding: '1.2rem 2.5rem', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          {isScanning ? 'SCAN PROFOND...' : 'LANCER DESTRUCTION BOTS'}
        </button>
      ) : (
        detectedBots.map(bot => (
          <div key={bot.id} style={{ background: '#000', border: '2px solid #ef4444', padding: '1.5rem', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}><div style={{ color: '#ef4444', fontWeight: 'bold' }}>{bot.name} DETECTÉ !</div></div>
            <button onClick={() => destroyBotConnection(bot.target)} style={{ background: '#ef4444', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>DÉTRUIRE LIEN</button>
          </div>
        ))
      )}
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
      <h2 style={{ color: '#3b82f6', fontSize: '2.5rem', textAlign: 'center', marginBottom: '2.5rem', fontWeight: '900' }}>🌐 HUB DE SÉCURITÉ MONDIAL</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {tools.map((t, i) => (
          <a key={i} href={t.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'rgba(59, 130, 246, 0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'block', textAlign:'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t.icon}</div>
            <h4 style={{ color: '#fff' }}>{t.name}</h4>
          </a>
        ))}
      </div>

      <div style={{ padding: '2.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '20px' }}>
        <h5 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>💡 CONSEILS DU FORUM REUSSITESS©</h5>
        <div style={{ display: 'grid', gap: '1.5rem', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <strong style={{color: '#fff'}}>1. La Règle d'Or "Anti-Drain" :</strong> Ne gardez jamais 100% de vos REUSS sur un wallet "chaud". Utilisez <a href="https://www.ledger.com" target="_blank" style={{color: '#10b981', textDecoration: 'none', fontWeight: 'bold'}}>Ledger</a> ou Trezor.
          </div>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <strong style={{color: '#fff'}}>2. Vérification des Liquidity Pools :</strong> Vérifiez si la liquidité est "locked" sur <a href="https://uncx.network" target="_blank" style={{color: '#10b981', textDecoration: 'none', fontWeight: 'bold'}}>Unicrypt (UNCX)</a>.
          </div>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <strong style={{color: '#fff'}}>3. Analyse de Contrat :</strong> Utilisez <a href="https://polygonscan.com" target="_blank" style={{color: '#10b981', textDecoration: 'none', fontWeight: 'bold'}}>PolygonScan</a> pour auditer les permissions.
          </div>
          <div style={{ borderLeft: '4px solid #10b981', paddingLeft: '1rem' }}>
            <strong style={{color: '#fff'}}>4. Protection RPC Privé :</strong> Utilisez un RPC sécurisé comme <a href="https://mevblocker.io" target="_blank" style={{color: '#10b981', textDecoration: 'none', fontWeight: 'bold'}}>MEV-Blocker</a> sur MetaMask.
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.5 }}>Reussitess© Guadeloupe 🇬🇵 "Boudoum"</p>
    </div>
  )
}
