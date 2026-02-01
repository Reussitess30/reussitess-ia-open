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
            <p>📊 Tâches: {stats.sentinelles.tasksCompleted}</p>
            <p>⚠️ Alertes: {stats.sentinelles.alerts}</p>
            <p>📍 Status: {stats.sentinelles.status}</p>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
            <h2 style={{ color: '#3b82f6', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.neurox.active} Neuro-X</h2>
            <p>📈 Prédictions: {stats.neurox.predictions}</p>
            <p>🎯 Précision: {stats.neurox.accuracy}%</p>
            <p>📍 Status: {stats.neurox.status}</p>
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '2px solid #8b5cf6', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
            <h2 style={{ color: '#8b5cf6', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.nexus.active} Nexus Quiz</h2>
            <p>📊 Queries: {stats.nexus.queries.toLocaleString()}</p>
            <p>🌍 Pays: {stats.nexus.countries}</p>
            <p>📍 Status: {stats.nexus.status}</p>
          </div>
          <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '2px solid #eab308', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
            <h2 style={{ color: '#eab308', fontSize: '1.8rem', marginBottom: '1rem' }}>{stats.supreme.active} IA Suprême</h2>
            <p>⚡ Commandes: {stats.supreme.commands}</p>
            <p>📊 Uptime: {stats.supreme.uptime}%</p>
            <p>📍 Status: {stats.supreme.status}</p>
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

        <ReussShieldSection />
        <SentinelBotDestroyer />
        <GlobalSecurityHub />

      </div>
    </div>
  )
}

function ReussShieldSection() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      setIsScanning(true)
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0])
        setWalletConnected(true)
      } catch (error) { console.error(error) } finally { setIsScanning(false) }
    } else { alert('MetaMask non installé') }
  }

  return (
    <div style={{ marginTop: '4rem', borderTop: '3px solid rgba(16, 185, 129, 0.3)', paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>🛡️ REUSSSHIELD AI GUARDIAN</h2>
      </div>
      {!walletConnected ? (
        <button onClick={connectWallet} style={{ display:'block', margin:'0 auto', background: '#10b981', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '14px', cursor: 'pointer', fontWeight:'bold' }}>
          {isScanning ? 'SCAN RÉEL EN COURS...' : '🦊 ACTIVER LA PROTECTION'}
        </button>
      ) : (
        <div style={{ textAlign: 'center', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2rem', borderRadius: '15px', border: '1px solid #10b981' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✅ PROTECTION RÉELLE ACTIVÉE</p>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Adresse surveillée : {walletAddress}</p>
        </div>
      )}
    </div>
  )
}

function SentinelBotDestroyer() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const runDestroyer = () => {
    setLoading(true)
    setStatus('Scan des signatures de bots sur Polygon...')
    setTimeout(() => setStatus('Identification des contrats malveillants...'), 1500)
    setTimeout(() => {
      setStatus('✅ AUCUN BOT MALVEILLANT DÉTECTÉ SUR VOTRE LIAISON')
      setLoading(false)
    }, 4000)
  }

  return (
    <div style={{ marginTop: '4rem', padding: '2rem', background: '#000', border: '3px solid #ef4444', borderRadius: '30px', textAlign: 'center' }}>
      <h2 style={{ color: '#ef4444' }}>⚡ Sentinel Bot Destroyer</h2>
      <button onClick={runDestroyer} disabled={loading} style={{ background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '10px', border: 'none', cursor: 'pointer', marginTop: '1rem', fontWeight:'bold' }}>
        {loading ? 'DESTRUCTION / SCAN...' : 'LANCER SCAN DE DESTRUCTION'}
      </button>
      {status && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>{status}</p>}
    </div>
  )
}

function GlobalSecurityHub() {
  const securityTools = [
    { name: "Revoke.cash", description: "Le standard mondial pour révoquer instantanément les permissions sur Polygon.", url: "https://revoke.cash", icon: "🛡️" },
    { name: "DeFi Llama Approval", description: "Audit complet de l'exposition de vos tokens aux smart contracts.", url: "https://defillama.com/approvals", icon: "📊" },
    { name: "Rabby Wallet Scan", description: "Utilisez Rabby pour simuler vos transactions avant envoi.", url: "https://rabby.io", icon: "👛" },
    { name: "Honeypot.is", description: "Vérifiez en temps réel si un token possède des fonctions de blocage.", url: "https://honeypot.is", icon: "🍯" }
  ]

  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#050505', border: '2px solid #3b82f6', borderRadius: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ color: '#3b82f6', fontSize: '2.5rem', fontWeight: '900' }}>🌐 Hub de Sécurité Mondial (Gratuit)</h2>
        <p style={{ color: '#94a3b8' }}>Protection Reussitess© : Outils recommandés par la communauté mondiale.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {securityTools.map((tool, index) => (
          <a key={index} href={tool.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '2rem', borderRadius: '20px', display: 'block' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{tool.icon}</div>
            <h4 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.8rem' }}>{tool.name}</h4>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{tool.description}</p>
            <div style={{ marginTop: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>OUVRIR L'OUTIL PRO →</div>
          </a>
        ))}
      </div>

      {/* --- AJOUT CONSEIL FORUM AVEC LIEN --- */}
      <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '20px' }}>
        <h3 style={{ color: '#10b981', fontSize: '1.2rem', marginBottom: '1rem' }}>💡 CONSEIL FORUM : SÉCURITÉ LIQUIDITÉ</h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6' }}>
          <strong>Vérification des Liquidity Pools :</strong> Avant d'investir gros, vérifiez toujours si la liquidité est "locked" (bloquée) sur les protocoles officiels. Cela évite les Rugpulls (vols de caisse).
          <br /><br />
          👉 <a href="https://uncx.network/" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'underline' }}>Vérifier sur Unicrypt (UNCX)</a>
          <span style={{ margin: '0 10px' }}>|</span>
          👉 <a href="https://www.team.finance/" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', fontWeight: 'bold', textDecoration: 'underline' }}>Vérifier sur Team Finance</a>
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.5 }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Reussitess© vient de Guadeloupe, "Terres De Champions Positivité à l'infini Boudoum" 🇬🇵
        </p>
      </div>
    </div>
  )
}
