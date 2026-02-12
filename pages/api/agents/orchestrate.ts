import type { NextApiRequest, NextApiResponse } from 'next'
import { SupremeAgent } from '../../../lib/ai-agents-system'

// ============================================
// API ROUTE : /api/agents/orchestrate
// Lance le cycle d'orchestration des 200 agents
// PAGES ROUTER VERSION
// ============================================

// Instance globale du Supreme Agent
let supremeAgent: SupremeAgent | null = null

const SOURCE_VERSION = "1.0.0"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { action, agentType, agentId } = req.query
  
  try {
    // Initialize Supreme Agent if not exists
    if (!supremeAgent) {
      supremeAgent = new SupremeAgent()
      await supremeAgent.initialize()
    }
    
    // GET requests
    if (req.method === 'GET') {
      switch (action) {
        case 'orchestrate':
          // Run full orchestration cycle
          const result = await supremeAgent.orchestrate()
          return res.status(200).json({
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
          return res.status(200).json({
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
          return res.status(200).json({
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
          return res.status(400).json({
            success: false,
            error: 'Invalid action. Use: orchestrate, status, or logs',
            availableActions: ['orchestrate', 'status', 'logs']
          })
      }
    }
    
    // POST requests - Manual trigger specific agent
    if (req.method === 'POST') {
      const body = req.body
      const targetAgentType = body.agentType || agentType
      const targetAgentId = body.agentId || agentId
      
      if (!targetAgentType || !targetAgentId) {
        return res.status(400).json({
          success: false,
          error: 'Missing agentType or agentId'
        })
      }
      
      let result
      
      switch (targetAgentType) {
        case 'sentinelle':
          const sentinelle = supremeAgent.sentinelles[Number(targetAgentId) - 1]
          if (!sentinelle) {
            return res.status(404).json({ 
              success: false,
              error: 'Agent not found' 
            })
          }
          result = await sentinelle.run()
          break
          
        case 'neuro-x':
          const neurox = supremeAgent.neuroXAgents[Number(targetAgentId) - 1]
          if (!neurox) {
            return res.status(404).json({ 
              success: false,
              error: 'Agent not found' 
            })
          }
          result = await neurox.run()
          break
          
        case 'nexus':
          const nexus = supremeAgent.nexusAgents[Number(targetAgentId) - 1]
          if (!nexus) {
            return res.status(404).json({ 
              success: false,
              error: 'Agent not found' 
            })
          }
          result = await nexus.run()
          break
          
        default:
          return res.status(400).json({
            success: false,
            error: 'Invalid agent type. Use: sentinelle, neuro-x, or nexus'
          })
      }
      
      return res.status(200).json({
        success: true,
        agentType: targetAgentType,
        agentId: targetAgentId,
        result: result,
        metadata: {
          project: "Reussitess©",
          origin: "Guadeloupe 🇬🇵",
          timestamp: new Date().toISOString()
        }
      })
    }
    
    // Method not allowed
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST'
    })
    
  } catch (error: any) {
    console.error('Agent API error:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
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
