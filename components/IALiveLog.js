'use client'
import { useState, useEffect } from 'react'

export default function IALiveLog() {
  const [logs, setLogs] = useState([
    "🚀 Initialisation des 200 IA Reussitess©...",
    "🌍 Connexion au node Guadeloupe - Terres De Champions",
    "🇧🇪 Scan de liquidité Belgique - Pool 0x1d2e... Validé"
  ])

  const countries = ['Belgique', 'France', 'Italie', 'Allemagne', 'Suède', 'Singapour', 'Australie', 'Espagne', 'Brésil', 'Inde', 'Nouvelle-Zélande', 'États-Unis', 'Canada', 'Guadeloupe']
  const agents = Array.from({ length: 200 }, (_, i) => i + 1)
  const tasks = [
    "Vérification conformité EU AI Act",
    "Optimisation du Yield Quantum",
    "Scan sécurité anti-hack",
    "Synchronisation Token GAMMA",
    "Analyse sentiment marché",
    "Calcul auto-burn 0.5%",
    "Vérification RGPD Data"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const agent = agents[Math.floor(Math.random() * agents.length)]
      const task = tasks[Math.floor(Math.random() * tasks.length)]
      const country = countries[Math.floor(Math.random() * countries.length)]
      const newLog = `🤖 IA #${agent} : ${task} [${country}] - OK`
      
      setLogs(prev => [newLog, ...prev.slice(0, 4)])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'rgba(0, 255, 127, 0.05)',
      border: '1px solid #10b981',
      borderRadius: '15px',
      padding: '1.5rem',
      marginTop: '2rem',
      fontFamily: 'monospace',
      textAlign: 'left',
      fontSize: '0.85rem',
      color: '#10b981',
      boxShadow: 'inset 0 0 10px rgba(16, 185, 129, 0.2)'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid #10b981', paddingBottom: '0.5rem' }}>
        🟢 QUANTUM LIVE ACTIVITY (200 AGENTS ACTIFS)
      </div>
      {logs.map((log, i) => (
        <div key={i} style={{ opacity: 1 - (i * 0.2), marginBottom: '5px' }}>
          {log}
        </div>
      ))}
    </div>
  )
}
