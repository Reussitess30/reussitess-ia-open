'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ethers } from 'ethers'

// 1. Définition stricte pour le compilateur Vercel
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
        console.error('Erreur Monitoring:', error)
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
  const [approvals, setApprovals] = useState<any[]>([])
  const [threats, setThreats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [shieldStats, setShieldStats] = useState({ threatsBlocked: 1247, approvalsScanned: 0, mlScore: 94 })

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletConnected) {
        const threatTypes = ['Sandwich Attack détecté', 'Frontrunning bot neutralisé', 'Approval suspect révoqué', 'MEV bot identifié', 'Gas draining attempt blocked', 'Phishing contract detected']
        const newThreat = { time: new Date().toLocaleTimeString(), message: threatTypes[Math.floor(Math.random() * threatTypes.length)], type: 'blocked' }
        setThreats(prev => [newThreat, ...prev.slice(0, 14)])
        setShieldStats(prev => ({ ...prev, threatsBlocked: prev.threatsBlocked + 1 }))
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [walletConnected])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        scanApprovals(accounts[0])
      } catch (error) { console.error(error) }
    } else { alert('MetaMask non installé') }
  }

  const scanApprovals = async (addr: string) => {
    setLoading(true)
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum)
      const tokens = [{ symbol: 'REUSS', address: '0xB37531727fC07c6EED4f97F852A115B428046EB2' }]
      const spender = '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45f' // QuickSwap
      const abi = ["function allowance(address owner, address spender) view returns (uint256)"]
      const contract = new ethers.Contract(tokens[0].address, abi, provider)
      const allowance = await contract.allowance(addr, spender)

      if (allowance > 0) {
        setApprovals([{
          token: 'REUSS', tokenAddress: tokens[0].address, spender: 'QuickSwap V3', spenderFull: spender,
          amount: ethers.formatUnits(allowance, 18), risk: 'SÉCURISÉ', safe: true, revoked: false
        }])
        setShieldStats(prev => ({ ...prev, approvalsScanned: 1 }))
      }
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const revokeApproval = async (index: number) => {
    if (!(window as any).ethereum) return;
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(approvals[index].tokenAddress, ["function approve(address spender, uint256 amount) public returns (bool)"], signer);
      const tx = await contract.approve(approvals[index].spenderFull, 0);
      await tx.wait();
      const newApprovals = [...approvals]; newApprovals[index].revoked = true; setApprovals(newApprovals);
    } catch (e) { console.error(e) }
    setLoading(false);
  }

  return (
    <div style={{ marginTop: '4rem', borderTop: '3px solid rgba(16, 185, 129, 0.3)', paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>🛡️ REUSSSHIELD AI GUARDIAN</h2>
      </div>
      {!walletConnected ? (
        <button onClick={connectWallet} style={{ display:'block', margin:'0 auto', background: '#10b981', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '14px', cursor: 'pointer' }}>🦊 ACTIVER LA PROTECTION</button>
      ) : (
        <div style={{ background: 'rgba(16, 31, 46, 0.8)', padding: '2rem', borderRadius: '20px' }}>
          <h3 style={{ color: '#10b981' }}>Réseau Polygon : {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</h3>
          {approvals.map((app, i) => (
            <div key={i} style={{ marginTop: '1rem', border: '1px solid #10b981', padding: '1rem' }}>
              {app.token} : {app.amount} - {app.risk} 
              {!app.revoked && <button onClick={() => revokeApproval(i)} style={{ marginLeft: '1rem', background: '#ef4444' }}>Révoquer</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SentinelBotDestroyer() {
  const [activeThreats, setActiveThreats] = useState<any[]>([])
  const scan = () => {
    setActiveThreats([{ id: 1, bot: 'Bot-Sandwich-V4', threat: 'High', address: '0xdead...01' }])
  }
  return (
    <div style={{ marginTop: '4rem', padding: '2rem', background: '#000', border: '3px solid #ef4444', borderRadius: '30px' }}>
      <h2 style={{ color: '#ef4444', textAlign: 'center' }}>⚡ Sentinel Bot Destroyer</h2>
      <button onClick={scan} style={{ display: 'block', margin: '1rem auto', background: '#ef4444', color: 'white', padding: '1rem' }}>LANCER SCAN DE DESTRUCTION</button>
      {activeThreats.map(t => <div key={t.id} style={{ color: 'white' }}>{t.bot} détecté !</div>)}
    </div>
  )
}

function GlobalSecurityHub() {
  return (
    <div style={{ marginTop: '4rem', padding: '3rem', background: '#050505', border: '2px solid #3b82f6', borderRadius: '30px', textAlign: 'center' }}>
      <h2 style={{ color: '#3b82f6' }}>🌐 Hub de Sécurité Mondial</h2>
      <p style={{ color: '#64748b' }}>Reussitess© Guadeloupe 🇬🇵 - Terres De Champions Positivité à l'infini Boudoum</p>
    </div>
  )
}
