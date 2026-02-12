import { NextApiRequest, NextApiResponse } from 'next'
// Importation relative corrigée (3 niveaux)
import { SupremeAgent } from '../../../lib/ai-agents-system'

// ============================================
// API ROUTE : /api/agents/orchestrate
// Projet : Reussitess© - Guadeloupe (Boudoum !)
// ============================================

// Identifiant de version pour le monitoring lié au log (Instruction 2026-02-12)
const SOURCE_VERSION = "2026-02-12-PAGES-API-STABLE";

// Instance globale persistante
let supremeAgent: SupremeAgent | null = null

/**
 * Handler principal pour Next.js Pages API
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query
  
  try {
    // Initialisation du Supreme Agent si nécessaire
    if (!supremeAgent) {
      supremeAgent = new SupremeAgent()
      await supremeAgent.initialize()
      console.log(`[LOG-REUSSITESS] Système v${SOURCE_VERSION} prêt.`);
    }

    // --- GESTION DES REQUÊTES GET ---
    if (req.method === 'GET') {
      switch (action) {
        case 'orchestrate':
          // Orchestration des 200 agents pour les 14 pays
          const result = await supremeAgent.orchestrate()
          return res.status(200).json({
            success: true,
            project: "Reussitess©",
            origin: "Guadeloupe",
            version: SOURCE_VERSION,
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
          return res.status(400).json({ error: 'Action invalide. Utilisez: orchestrate, status, ou logs' })
      }
    }

    // --- GESTION DES REQUÊTES POST ---
    if (req.method === 'POST') {
      const { agentType, agentId } = req.body
      
      let agentResult
      
      switch (agentType) {
        case 'sentinelle':
          const sentinelle = supremeAgent.sentinelles[agentId - 1]
          if (!sentinelle) return res.status(404).json({ error: 'Sentinelle non trouvée' })
          agentResult = await sentinelle.run()
          break
          
        case 'neuro-x':
          const neurox = supremeAgent.neuroXAgents[agentId - 1]
          if (!neurox) return res.status(404).json({ error: 'Neuro-X non trouvé' })
          agentResult = await neurox.run()
          break
          
        case 'nexus':
          const nexus = supremeAgent.nexusAgents[agentId - 1]
          if (!nexus) return res.status(404).json({ error: 'Nexus non trouvé' })
          agentResult = await nexus.run()
          break
          
        default:
          return res.status(400).json({ error: 'Type d\'agent invalide' })
      }
      
      return res.status(200).json({
        success: true,
        agentType,
        agentId,
        result: agentResult,
        version: SOURCE_VERSION
      })
    }

    // Si la méthode n'est ni GET ni POST
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)

  } catch (error: any) {
    console.error('[CRITICAL] Erreur API:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      origin: "Guadeloupe"
    })
  }
}

// ============================================
// HELPERS
// ============================================

async function getAgentsStatus() {
  const fs = require('fs').promises
  const statusPath = '/tmp/reussitess-agents-status.json'
  try {
    const data = await fs.readFile(statusPath, 'utf8')
    return Object.values(JSON.parse(data))
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
    return logs.slice(-limit).reverse()
  } catch (error) {
    return []
  }
}
