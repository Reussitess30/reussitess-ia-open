import { NextResponse } from 'next/server'
import { SupremeAgent } from '@/lib/ai-agents-system'

// ============================================
// API ROUTE : /api/agents/orchestrate
// Lance le cycle d'orchestration des 200 agents
// ============================================

// Instance globale du Supreme Agent
let supremeAgent: SupremeAgent | null = null

const SOURCE_VERSION = "1.0.0"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action') || 'status'
  
  try {
    // Initialize Supreme Agent if not exists
    if (!supremeAgent) {
      supremeAgent = new SupremeAgent()
      await supremeAgent.initialize()
    }
    
    switch (action) {
      case 'orchestrate':
        // Run full orchestration cycle
        const result = await supremeAgent.orchestrate()
        return NextResponse.json({
          ...result,
          metadata: {
            project: "Reussitess©",
            origin: "Guadeloupe 🇬🇵",
            version: SOURCE_VERSION,
            timestamp: new Date().toISOString()
          }
        })
        
      case 'status':
        // Get current status of all agents
        const status = await getAgentsStatus()
        return NextResponse.json({
          success: true,
          agents: status,
          totalAgents: 200,
          activeAgents: status.filter((a: any) => a.status === 'active').length,
          metadata: {
            project: "Reussitess©",
            origin: "Guadeloupe 🇬🇵",
            version: SOURCE_VERSION,
            timestamp: new Date().toISOString()
          }
        })
        
      case 'logs':
        // Get recent activity logs
        const logs = await getRecentLogs()
        return NextResponse.json({
          success: true,
          logs: logs,
          count: logs.length,
          metadata: {
            project: "Reussitess©",
            origin: "Guadeloupe 🇬🇵",
            version: SOURCE_VERSION,
            timestamp: new Date().toISOString()
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: orchestrate, status, or logs',
          availableActions: ['orchestrate', 'status', 'logs']
        }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Agent API error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function getAgentsStatus() {
  const fs = require('fs').promises
  const statusPath = '/tmp/reussitess-agents-status.json'
  
  try {
    const data = await fs.readFile(statusPath, 'utf8')
    const status = JSON.parse(data)
    return Object.values(status)
  } catch (error) {
    return []
  }
}

async function getRecentLogs(limit: number = 50) {
  const fs = require('fs').promises
  const logsPath = '/tmp/reussitess-agent-logs.json'
  
  try {
    const data = await fs.readFile(logsPath, 'utf8')
    const logs = JSON.parse(data)
    return logs.slice(-limit).reverse() // Most recent first
  } catch (error) {
    return []
  }
}

// ============================================
// POST: Manual trigger specific agent type
// ============================================

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { agentType, agentId } = body
    
    if (!supremeAgent) {
      supremeAgent = new SupremeAgent()
      await supremeAgent.initialize()
    }
    
    let result
    
    switch (agentType) {
      case 'sentinelle':
        const sentinelle = supremeAgent.sentinelles[agentId - 1]
        if (!sentinelle) {
          return NextResponse.json({ 
            success: false,
            error: 'Agent not found' 
          }, { status: 404 })
        }
        result = await sentinelle.run()
        break
        
      case 'neuro-x':
        const neurox = supremeAgent.neuroXAgents[agentId - 1]
        if (!neurox) {
          return NextResponse.json({ 
            success: false,
            error: 'Agent not found' 
          }, { status: 404 })
        }
        result = await neurox.run()
        break
        
      case 'nexus':
        const nexus = supremeAgent.nexusAgents[agentId - 1]
        if (!nexus) {
          return NextResponse.json({ 
            success: false,
            error: 'Agent not found' 
          }, { status: 404 })
        }
        result = await nexus.run()
        break
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid agent type. Use: sentinelle, neuro-x, or nexus'
        }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      agentType: agentType,
      agentId: agentId,
      result: result,
      metadata: {
        project: "Reussitess©",
        origin: "Guadeloupe 🇬🇵",
        timestamp: new Date().toISOString()
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
