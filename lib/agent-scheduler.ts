// ============================================
// CRON JOBS SYSTEM - AUTO-RUN AGENTS
// ============================================

// Ce fichier configure l'exécution automatique des agents
// Deploy sur Vercel Cron Jobs ou utiliser node-cron localement

// ============================================
// VERCEL CRON CONFIG (vercel.json)
// ============================================

/*
{
  "crons": [
    {
      "path": "/api/agents/orchestrate?action=orchestrate",
      "schedule": "0 * * * *"
    }
  ]
}
*/

// Cela exécutera l'orchestration toutes les heures automatiquement

// ============================================
// ALTERNATIVE: Node-Cron (si self-hosted)
// ============================================

import cron from 'node-cron'

export function startAgentScheduler() {
  console.log('🚀 Starting AI Agent Scheduler...')
  
  // Run Supreme orchestration every hour
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Hourly orchestration cycle starting...')
    try {
      const response = await fetch('http://localhost:3000/api/agents/orchestrate?action=orchestrate')
      const result = await response.json()
      console.log('✅ Orchestration complete:', result)
    } catch (error) {
      console.error('❌ Orchestration failed:', error)
    }
  })
  
  // Run Sentinelles patrol every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('🛡️ Sentinelle patrol starting...')
    // Trigger 5 random sentinelles
    for (let i = 0; i < 5; i++) {
      const randomId = Math.floor(Math.random() * 40) + 1
      try {
        await fetch('http://localhost:3000/api/agents/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentType: 'sentinelle',
            agentId: randomId
          })
        })
      } catch (error) {
        console.error(`Sentinelle ${randomId} failed:`, error)
      }
    }
  })
  
  // Run Neuro-X market analysis every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('🧠 Neuro-X market analysis starting...')
    // Trigger 10 neuro-x agents
    for (let i = 0; i < 10; i++) {
      const randomId = Math.floor(Math.random() * 60) + 1
      try {
        await fetch('http://localhost:3000/api/agents/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentType: 'neuro-x',
            agentId: randomId
          })
        })
      } catch (error) {
        console.error(`Neuro-X ${randomId} failed:`, error)
      }
    }
  })
  
  // Run Nexus quiz management every 12 hours
  cron.schedule('0 */12 * * *', async () => {
    console.log('🎯 Nexus quiz management starting...')
    // Trigger 5 nexus agents
    for (let i = 0; i < 5; i++) {
      const randomId = Math.floor(Math.random() * 99) + 1
      try {
        await fetch('http://localhost:3000/api/agents/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentType: 'nexus',
            agentId: randomId
          })
        })
      } catch (error) {
        console.error(`Nexus ${randomId} failed:`, error)
      }
    }
  })
  
  console.log('✅ AI Agent Scheduler running!')
  console.log('📅 Schedule:')
  console.log('   - Orchestration: Every hour')
  console.log('   - Sentinelles: Every 30 minutes')
  console.log('   - Neuro-X: Every 6 hours')
  console.log('   - Nexus: Every 12 hours')
}

// ============================================
// MANUAL TRIGGER (pour tester)
// ============================================

export async function triggerImmediateOrchestration() {
  console.log('🚀 Triggering immediate orchestration...')
  
  try {
    const response = await fetch('/api/agents/orchestrate?action=orchestrate')
    const result = await response.json()
    console.log('✅ Result:', result)
    return result
  } catch (error) {
    console.error('❌ Failed:', error)
    throw error
  }
}

// ============================================
// HEALTHCHECK
// ============================================

export async function checkAgentsHealth() {
  try {
    const response = await fetch('/api/agents/orchestrate?action=status')
    const data = await response.json()
    
    const health = {
      totalAgents: data.totalAgents || 0,
      activeAgents: data.activeAgents || 0,
      healthPercentage: (data.activeAgents / data.totalAgents) * 100,
      status: data.activeAgents >= 190 ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString()
    }
    
    console.log('💚 Agent Health:', health)
    return health
  } catch (error) {
    console.error('❌ Health check failed:', error)
    return {
      status: 'critical',
      error: error
    }
  }
}
