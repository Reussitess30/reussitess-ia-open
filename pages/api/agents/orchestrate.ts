import type { NextApiRequest, NextApiResponse } from 'next'
import { SupremeAgent } from '@/lib/ai-agents-system'

// Instance globale du Supreme Agent
let supremeAgent: SupremeAgent | null = null

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query as { action?: string }
  
  try {
    // Initialize Supreme Agent if not exists
    if (!supremeAgent) {
      supremeAgent = new SupremeAgent()
      await supremeAgent.initialize()
    }
    
    switch (action) {
      case 'orchestrate':
        const result = await supremeAgent.orchestrate()
        return res.status(200).json({
          success: true,
          ...result,
          timestamp: new Date().toISOString()
        })
        
      case 'status':
        const status = await getAgentsStatus()
        return res.status(200).json({
          success: true,
          agents: status,
          totalAgents: 200,
          activeAgents: status.filter((a: any) => a.status === 'active').length
        })
        
      case 'logs':
        const logs = await getRecentLogs()
        return res.status(200).json({
          success: true,
          logs: logs,
          count: logs.length
        })
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Use: orchestrate, status, or logs'
        })
    }
  } catch (error: any) {
    console.error('Agent API error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// Helper functions (IDENTIQUES)
async function getAgentsStatus() {
  const fs = require('fs').promises
  const statusPath =
