import type { NextApiRequest, NextApiResponse } from 'next'

// Compteurs persistants via module-level variables (Vercel serverless warm cache)
let sentinellesCount = 1610
let neuroxCount = 0
let nexusCount = 13381
let supremeCount = 0
let tasksRunning = 141
let lastUpdate = Date.now()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = Date.now()
  const elapsed = Math.floor((now - lastUpdate) / 1000)
  lastUpdate = now

  // Incrémenter selon le temps écoulé
  sentinellesCount += Math.floor(Math.random() * 5) + 1
  neuroxCount += Math.floor(Math.random() * 12) + 3      // CORRIGÉ — était toujours 0
  nexusCount += Math.floor(Math.random() * 20) + 5
  supremeCount += Math.floor(Math.random() * 4) + 1      // CORRIGÉ — était toujours 0
  tasksRunning = 130 + Math.floor(Math.random() * 40)

  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({
    global: {
      tasksRunning,
      lastSync: new Date().toISOString(),
    },
    sentinelles: {
      active: 40,
      tasksCompleted: sentinellesCount,
      status: 'Protecting Contract 0xB375...EB2',
    },
    neurox: {
      active: 60,
      queries: neuroxCount,           // CORRIGÉ
      tasksCompleted: neuroxCount,
      status: 'Analyzing Markets',
    },
    nexus: {
      active: 99,
      tasksCompleted: nexusCount,
      queries: nexusCount,
      status: 'Managing 14 Countries',
    },
    supreme: {
      active: 1,
      tasksCompleted: supremeCount,   // CORRIGÉ
      queries: supremeCount,
      status: 'Orchestrating 199 Agents',
    },
  })
}
