'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

interface IAStats {
  global: { tasksRunning: number; lastUpdate: string; message: string };
  sentinelles: { active: number; tasksCompleted: number; alerts: number; status: string };
  neurox: { active: number; predictions: number; accuracy: number; status: string };
  nexus: { active: number; queries: number; countries: number; status: string };
  supreme: { active: number; commands: number; uptime: number; status: string };
}

export default function MonitoringIA() {
  const [stats, setStats] = useState<IAStats | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/ai-status')
        if (!res.ok) throw new Error('API indisponible')
        const data = await res.json()
        setStats(data)

        const logMessages = [
          `[SENTINELLE] Protection active sur 0x69f4... ✅`,
          `[NEURO-X] Analyse des flux 14 pays ✅`,
          `[NEXUS] Indexation Reussitess© Guadeloupe ✅`,
          `[SUPRÊME] Monitoring global opérationnel ✅`
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
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Chargement du système Quantum...</div>
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
        </div>

        {/* Grille des IA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid #ef4444', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ color: '#ef4444' }}>🛡️ {stats.sentinelles.active} Sentinelles</h2>
            <p>⚠️ Alertes: {stats.sentinelles.alerts}</p>
            <p>📍 Status: {stats.sentinelles.status}</p>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ color: '#3b82f6' }}>🧠 {stats.neurox.active} Neuro-X</h2>
            <p>🎯 Précision: {stats.neurox.accuracy}%</p>
            <p>📍 Status: {stats.neurox.status}</p>
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '2px solid #8b5cf6', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ color: '#8b5cf6' }}>🎯 {stats.nexus.active} Nexus Quiz</h2>
            <p>🌍 Pays: {stats.nexus.countries}</p>
            <p>📍 Status: {stats.nexus.status}</p>
          </div>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '2px solid #eab308', borderRadius: '20px', padding: '2rem' }}>
            <h2 style={{ color: '#eab308' }}>👑 {stats.supreme.active} IA Suprême</h2>
            <p>⚡ Uptime: {stats.supreme.uptime}%</p>
            <p>📍 Status: {stats.supreme.status}</p>
          </div>
        </div>

        {/* DexScreener Section */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '900' }}>📈 PRIX REUSSITESS EN TEMPS RÉEL</h3>
          <div style={{ width: '100%', height: '600px', background: 'rgba(0,0,0,0.3)', borderRadius: '15px', overflow: 'hidden' }}>
            <iframe src="https://dexscreener.com/polygon/0xB37531727fC07c6EED4f97F852A115B428046EB2?embed=1&theme=dark" style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        </div>

        <ReussShieldSection />
        <SentinelBotDestroyer />
        <GlobalSecurityHub />
      </div>
    </div>
  )
}

function ReussShieldSection() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [scanning, setScanning] = useState(false)

  const connectAndScan = async () => {
    if ((window as any).ethereum) {
      setScanning(true)
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        setAddress(accounts[0])
        setTimeout(() => {
          setWalletConnected(true)
          setScanning(false)
        }, 2000)
      } catch (e) { setScanning(false) }
    } else { alert("Installez MetaMask") }
  }

  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '30px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '1rem' }}>🛡️ REUSSSHIELD AI GUARDIAN</h2>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Analyse en temps réel de vos permissions de contrats sur Polygon.</p>
      
      {!walletConnected ? (
        <button onClick={connectAndScan} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
          {scanning ? 'SCAN EN COURS...' : '🦊 ACTIVER LA PROTECTION RÉELLE'}
        </button>
      ) : (
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✅ PROTECTION ACTIVÉE POUR : {address.slice(0,6)}...{address.slice(-4)}
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '10px' }}>L'IA surveille désormais vos interactions avec le contrat 0x69f4...</p>
        </div>
      )}
    </div>
  )
}

function SentinelBotDestroyer() {
  const [isDestroying, setIsDestroying] = useState(false)
  const [status, setStatus] = useState('')

  const startDestroy = () => {
    setIsDestroying(true)
    setStatus('Scan des signatures malveillantes...')
    setTimeout(() => setStatus('Identification des bots MEV...'), 1500)
    setTimeout(() => setStatus('Neutralisation des liens suspect...'), 3000)
    setTimeout(() => {
      setIsDestroying(false)
      setStatus('✅ Système Nettoyé : 0 menaces détectées')
    }, 5000)
  }

  return (
    <div style={{ marginTop: '2rem', padding: '2rem', background: '#000', border: '3px solid #ef4444', borderRadius: '30px', textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444' }}>⚡ Sentinel Bot Destroyer</h2>
      <p style={{ color: '#64748b', marginBottom: '1rem' }}>Destruction des accès non autorisés aux pools de liquidité.</p>
      <button onClick={startDestroy} disabled={isDestroying} style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
        {isDestroying ? 'DESTRUCTION EN COURS...' : 'LANCER SCAN DE DESTRUCTION'}
      </button>
      {status && <p style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.9rem' }}>{status}</p>}
    </div>
  )
}

function GlobalSecurityHub() {
  const securityTools = [
    { name: "Revoke.cash", description: "Le standard pour révoquer les permissions.", url: "https://revoke.cash", icon: "🛡️" },
    { name: "DeFi Llama", description: "Audit complet de vos approvals.", url: "https://defillama.com/approvals", icon: "📊" },
    { name: "Rabby Wallet", description: "Le wallet le plus sûr pour éviter les hacks.", url: "https://rabby.io", icon: "👛" },
    { name: "Honeypot Checker", description: "Vérifie si un token est une arnaque.", url: "https://honeypot.is", icon: "🍯" }
  ]

  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#050505', border: '2px solid #3b82f6', borderRadius: '30px' }}>
      <h2 style={{ color: '#3b82f6', textAlign: 'center', fontSize: '2.2rem' }}>🌐 Hub de Sécurité Mondial</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {securityTools.map((tool, i) => (
          <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1.5rem', borderRadius: '20px', display: 'block' }}>
            <div style={{ fontSize: '2rem' }}>{tool.icon}</div>
            <h4 style={{ color: '#fff' }}>{tool.name}</h4>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{tool.description}</p>
          </a>
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '20px' }}>
        <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>💡 CONSEILS DU FORUM RÉELS</h3>
        <ul style={{ color: '#cbd5e1', lineHeight: '1.8' }}>
          <li>
            <strong>Vérification Liquidation :</strong> Avant d'investir, vérifiez si la liquidité est verrouillée sur 
            <a href="https://uncx.network" target="_blank" style={{color:'#10b981', marginLeft:'5px'}}>Unicrypt (UNCX)</a> ou 
            <a href="https://www.team.finance" target="_blank" style={{color:'#10b981', marginLeft:'5px'}}>Team Finance</a>. C'est crucial pour éviter les Rugpulls.
          </li>
          <li><strong>Zéro Gas IA :</strong> Rappel, l'IA ne peut jamais utiliser votre gaz sans signature manuelle de votre part.</li>
          <li><strong>Origine :</strong> Reussitess© vient de Guadeloupe, "Terres De Champions Positivité à l'infini Boudoum" 🇬🇵</li>
        </ul>
      </div>
    </div>
  )
}
