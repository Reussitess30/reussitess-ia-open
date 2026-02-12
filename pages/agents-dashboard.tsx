'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// ============================================
// DASHBOARD DES 200 AGENTS IA RÉELS
// ============================================

export default function AgentsDashboard() {
  const [agentsStatus, setAgentsStatus] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orchestrating, setOrchestrating] = useState(false)
  
  useEffect(() => {
    fetchAgentsData()
    const interval = setInterval(fetchAgentsData, 10000) // Update every 10s
    return () => clearInterval(interval)
  }, [])
  
  const fetchAgentsData = async () => {
    try {
      // Fetch agents status
      const statusRes = await fetch('/api/agents/orchestrate?action=status')
      const statusData = await statusRes.json()
      setAgentsStatus(statusData)
      
      // Fetch recent logs
      const logsRes = await fetch('/api/agents/orchestrate?action=logs')
      const logsData = await logsRes.json()
      setLogs(logsData.logs || [])
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching agents data:', error)
      setLoading(false)
    }
  }
  
  const triggerOrchestration = async () => {
    setOrchestrating(true)
    try {
      const res = await fetch('/api/agents/orchestrate?action=orchestrate')
      const data = await res.json()
      console.log('Orchestration result:', data)
      await fetchAgentsData() // Refresh data
    } catch (error) {
      console.error('Orchestration failed:', error)
    } finally {
      setOrchestrating(false)
    }
  }
  
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontFamily: 'monospace', fontSize: '1.5rem' }}>
        ⏳ INITIALISATION DES 200 AGENTS IA...
      </div>
    )
  }
  
  const sentinellesCount = agentsStatus?.agents?.filter((a: any) => a.type === 'sentinelle').length || 0
  const neuroXCount = agentsStatus?.agents?.filter((a: any) => a.type === 'neuro-x').length || 0
  const nexusCount = agentsStatus?.agents?.filter((a: any) => a.type === 'nexus').length || 0
  const supremeCount = agentsStatus?.agents?.filter((a: any) => a.type === 'supreme').length || 0
  
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)', padding: '2rem', color: 'white', fontFamily: 'monospace' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#10b981', marginBottom: '0.5rem' }}>
              🤖 TABLEAU DE BORD DES AGENTS IA
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Monitoring en temps réel des 200 agents autonomes REUSSITESS
            </p>
          </div>
          <Link href="/monitoring-ia" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', color: '#10b981', padding: '1rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Retour Monitoring
          </Link>
        </div>
        
        {/* Status Global */}
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {agentsStatus?.activeAgents || 0} / {agentsStatus?.totalAgents || 200} AGENTS ACTIFS
          </span>
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={triggerOrchestration}
              disabled={orchestrating}
              style={{
                background: orchestrating ? '#666' : 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#fff',
                padding: '1rem 2rem',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: orchestrating ? 'not-allowed' : 'pointer',
                boxShadow: '0 5px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              {orchestrating ? '⏳ ORCHESTRATION EN COURS...' : '🚀 LANCER ORCHESTRATION MANUELLE'}
            </button>
          </div>
        </div>
        
        {/* Stats par type d'agent */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <AgentTypeCard 
            title="Sentinelles"
            count={sentinellesCount}
            total={40}
            color="#ef4444"
            icon="🛡️"
            description="Protection contrat et surveillance blockchain"
          />
          <AgentTypeCard 
            title="Neuro-X"
            count={neuroXCount}
            total={60}
            color="#3b82f6"
            icon="🧠"
            description="Analyse marchés Amazon 14 pays"
          />
          <AgentTypeCard 
            title="Nexus Quiz"
            count={nexusCount}
            total={99}
            color="#8b5cf6"
            icon="🎯"
            description="Gestion communauté et quiz"
          />
          <AgentTypeCard 
            title="IA Suprême"
            count={supremeCount}
            total={1}
            color="#eab308"
            icon="👑"
            description="Orchestration des 199 autres agents"
          />
        </div>
        
        {/* Activité en temps réel */}
        <div style={{ background: '#000', border: '2px solid #10b981', borderRadius: '20px', padding: '2rem', marginBottom: '3rem' }}>
          <h3 style={{ color: '#10b981', fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>📡</span>
            ACTIVITÉ DES AGENTS EN TEMPS RÉEL
          </h3>
          <div style={{ height: '400px', overflowY: 'auto', fontSize: '0.9rem', lineHeight: '1.8' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#64748b', textAlign: 'center', padding: '3rem' }}>
                Aucune activité enregistrée. Lancez une orchestration manuelle.
              </div>
            ) : (
              logs.map((log, i) => (
                <LogEntry key={i} log={log} />
              ))
            )}
          </div>
        </div>
        
        {/* Liste des agents actifs */}
        <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '2px solid #3b82f6', borderRadius: '20px', padding: '2rem' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
            🤖 LISTE DES AGENTS ACTIFS
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {agentsStatus?.agents && agentsStatus.agents.length > 0 ? (
              agentsStatus.agents.map((agent: any, i: number) => (
                <AgentCard key={i} agent={agent} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                Aucun agent actif. Initialisez le système.
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  )
}

// ============================================
// COMPOSANTS
// ============================================

function AgentTypeCard({ title, count, total, color, icon, description }: any) {
  const percentage = (count / total) * 100
  
  return (
    <div style={{ background: `${color}1a`, border: `2px solid ${color}`, borderRadius: '20px', padding: '2rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
      <h2 style={{ color: color, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
        {count} / {total} {title}
      </h2>
      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {description}
      </p>
      {/* Progress bar */}
      <div style={{ background: '#1a1a1a', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
        <div style={{ 
          background: color, 
          width: `${percentage}%`, 
          height: '100%',
          transition: 'width 0.3s'
        }} />
      </div>
      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem', textAlign: 'right' }}>
        {percentage.toFixed(0)}% actifs
      </p>
    </div>
  )
}

function LogEntry({ log }: any) {
  const getColorForAction = (action: string) => {
    if (action.includes('error')) return '#ef4444'
    if (action.includes('complete')) return '#10b981'
    if (action.includes('analysis')) return '#3b82f6'
    return '#8b5cf6'
  }
  
  const color = getColorForAction(log.action)
  const timestamp = new Date(log.timestamp).toLocaleTimeString()
  
  return (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.03)', 
      padding: '0.75rem 1rem', 
      borderRadius: '8px', 
      marginBottom: '0.5rem',
      borderLeft: `3px solid ${color}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
        <span style={{ color: color, fontWeight: 'bold', fontSize: '0.85rem' }}>
          [{log.agent}]
        </span>
        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
          {timestamp}
        </span>
      </div>
      <div style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
        {log.action}
      </div>
      {log.data && (
        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
          {JSON.stringify(log.data).substring(0, 100)}...
        </div>
      )}
    </div>
  )
}

function AgentCard({ agent }: any) {
  const getColorForType = (type: string) => {
    if (type === 'sentinelle') return '#ef4444'
    if (type === 'neuro-x') return '#3b82f6'
    if (type === 'nexus') return '#8b5cf6'
    if (type === 'supreme') return '#eab308'
    return '#64748b'
  }
  
  const color = getColorForType(agent.type)
  const lastAction = new Date(agent.lastAction)
  const minutesAgo = Math.floor((Date.now() - lastAction.getTime()) / 60000)
  
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${color}`,
      borderRadius: '12px',
      padding: '1rem',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: agent.status === 'active' ? '#10b981' : '#ef4444' 
        }} />
        <span style={{ color: color, fontWeight: 'bold', fontSize: '0.9rem' }}>
          {agent.type}
        </span>
      </div>
      <div style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
        ID: {agent.id}
      </div>
      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
        Tasks: {agent.tasksCompleted || 0}
      </div>
      <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
        Last: {minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`}
      </div>
    </div>
  )
}
