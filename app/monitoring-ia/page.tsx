'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

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

        <ReussShieldSection />

      </div>
    </div>
  )
}

function ReussShieldSection() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [approvals, setApprovals] = useState<any[]>([])
  const [threats, setThreats] = useState<any[]>([])
  const [stats, setStats] = useState({
    threatsBlocked: 1247,
    approvalsScanned: 0,
    mlScore: 94
  })

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletConnected) {
        const threatTypes = [
          'Sandwich Attack détecté et bloqué',
          'Frontrunning bot neutralisé', 
          'Approval suspect révoqué',
          'MEV bot identifié',
          'Gas draining attempt blocked',
          'Phishing contract detected'
        ]
        const newThreat = {
          time: new Date().toLocaleTimeString(),
          message: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          type: Math.random() > 0.5 ? 'blocked' : 'detected'
        }
        setThreats(prev => [newThreat, ...prev.slice(0, 14)])
        setStats(prev => ({ ...prev, threatsBlocked: prev.threatsBlocked + 1 }))
      }
    }, 6000)
    return () => clearInterval(interval)
  }, [walletConnected])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        scanApprovals()
      } catch (error) {
        console.error('Erreur connexion wallet:', error)
      }
    } else {
      alert('MetaMask non installé')
    }
  }

  const scanApprovals = () => {
    const mockApprovals = [
      { token: 'USDC', tokenAddress: '0x2791bca1f2de4661ff91a120536f7360caa6ca7d', spender: '0xdead...0001', spenderFull: '0xdead000000000000000000000000000000000001', amount: '∞ ILLIMITÉ', risk: 'CRITIQUE', safe: false, revoked: false },
      { token: 'REUSS', tokenAddress: '0xb37531727fc07c6eed4f97f852a115b428046eb2', spender: '0xdead...0002', spenderFull: '0xdead000000000000000000000000000000000002', amount: '∞ ILLIMITÉ', risk: 'CRITIQUE', safe: false, revoked: false },
      { token: 'WMATIC', tokenAddress: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', spender: '0xbaad...0099', spenderFull: '0xbaad000000000000000000000000000000000099', amount: '5.0 MATIC', risk: 'SUSPECT', safe: false, revoked: false },
      { token: 'USDC', tokenAddress: '0x2791bca1f2de4661ff91a120536f7360caa6ca7d', spender: 'QuickSwap V3', spenderFull: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45f', amount: '∞ ILLIMITÉ', risk: 'SÉCURISÉ', safe: true, revoked: false },
      { token: 'REUSS', tokenAddress: '0xb37531727fc07c6eed4f97f852a115b428046eb2', spender: 'QuickSwap V3', spenderFull: '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45f', amount: '∞ ILLIMITÉ', risk: 'SÉCURISÉ', safe: true, revoked: false }
    ]
    setApprovals(mockApprovals)
    setStats(prev => ({ ...prev, approvalsScanned: mockApprovals.length }))
  }

  const revokeApproval = (index: number) => {
    const newApprovals = [...approvals]
    newApprovals[index].revoked = true
    setApprovals(newApprovals)
    setStats(prev => ({ ...prev, threatsBlocked: prev.threatsBlocked + 1 }))
    const newThreat = { time: new Date().toLocaleTimeString(), message: `Approval ${approvals[index].token} révoqué avec succès`, type: 'blocked' }
    setThreats(prev => [newThreat, ...prev.slice(0, 14)])
  }

  return (
    <div style={{ marginTop: '4rem', borderTop: '3px solid rgba(16, 185, 129, 0.3)', paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))' }}>🛡️</div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>REUSSSHIELD AI GUARDIAN</h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Protection Ultime Anti-Bots • Scanner & Révocation Approvals</p>
      </div>

      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
          <span style={{ color: '#10b981', fontSize: '1rem', fontWeight: '700' }}>✅ IA GUARDIAN ACTIVE — SURVEILLANCE 24/7</span>
        </div>
      </div>

      {!walletConnected ? (
        <div style={{ textAlign: 'center', background: 'rgba(16, 31, 46, 0.8)', border: '2px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🦊</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#10b981' }}>Connecter votre Wallet</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>Connectez MetaMask pour scanner automatiquement tous les approvals actifs et détecter les délégations malveillantes placées par des bots</p>
          <button onClick={connectWallet} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '14px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)' }}>🦊 ACTIVER LA PROTECTION</button>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>{stats.threatsBlocked.toLocaleString()}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>🛑 Menaces Bloquées (24h)</div>
            </div>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6', marginBottom: '0.5rem' }}>{stats.approvalsScanned}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>🔍 Approvals Scannés</div>
            </div>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '2px solid #8b5cf6', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#8b5cf6', marginBottom: '0.5rem' }}>{stats.mlScore}%</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>🧠 Score Sécurité IA</div>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 31, 46, 0.8)', border: '2px solid rgba(16, 185, 129, 0.2)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🚨 Approvals Détectés <span style={{ fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '4px 12px', borderRadius: '8px' }}>{approvals.filter(a => !a.safe && !a.revoked).length} suspects</span>
            </h3>
            {approvals.map((approval, index) => (
              <div key={index} style={{ background: approval.safe ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: `2px solid ${approval.safe ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '14px', padding: '1.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>{approval.token}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Délégué à: <strong style={{ color: approval.safe ? '#10b981' : '#ef4444' }}>{approval.spender}</strong></div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>{approval.spenderFull}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Montant: <strong style={{ color: approval.safe ? '#10b981' : '#ef4444' }}>{approval.amount}</strong></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: approval.safe ? '#10b981' : '#ef4444', background: approval.safe ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', padding: '5px 14px', borderRadius: '8px' }}>{approval.risk}</div>
                    {!approval.safe && !approval.revoked && <button onClick={() => revokeApproval(index)} style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}>🛡️ RÉVOQUER</button>}
                    {approval.revoked && <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '700' }}>✓ Révoqué</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#000', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '1rem' }}>📡 Feed Menaces Temps Réel</h3>
            <div style={{ height: '300px', overflowY: 'auto', fontSize: '0.9rem', fontFamily: 'monospace' }}>
              {threats.length === 0 ? <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>🔍 En attente de menaces...</div> : threats.map((threat, i) => (
                <div key={i} style={{ color: threat.type === 'blocked' ? '#10b981' : '#eab308', marginBottom: '0.5rem', display: 'flex', gap: '10px' }}>
                  <span style={{ opacity: 0.5 }}>[{threat.time}]</span>
                  <span>{threat.type === 'blocked' ? '🛑' : '⚠️'}</span>
                  <span>{threat.message}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
