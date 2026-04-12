import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function KickLive() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const r = await fetch('/api/superbot/chat', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'kick stream reussitess' })
        })
        const d = await r.json()
        setStats(d.response)
      } catch(e) {} finally { setLoading(false) }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head><title>REUSSITESS — Kick Live Dashboard</title></Head>
      <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', fontFamily: 'monospace', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#53FC18', fontSize: '2rem', margin: 0 }}>🎮 REUSSITESS — Kick Live</h1>
          <p style={{ color: '#888', margin: '0.5rem 0' }}>Dashboard streaming temps réel</p>
          <a href="https://kick.com/Reussitess" target="_blank" rel="noreferrer"
            style={{ color: '#53FC18', fontWeight: 'bold' }}>👉 kick.com/Reussitess</a>
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto 2rem', background: '#111', border: '1px solid #53FC18', borderRadius: '12px', padding: '1.5rem', whiteSpace: 'pre-wrap' }}>
          {loading ? '⏳ Connexion à Kick...' : stats || '⚫ Stream hors ligne'}
        </div>

        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ color: '#53FC18', margin: '0 0 1rem' }}>🤖 Commandes Bot Kick</h2>
          {[
            ['!boudoum', 'Cri de guerre REUSSITESS 🇬🇵'],
            ['!reuss', 'Prix Token REUSS en direct 💎'],
            ['!meteo', 'Météo Guadeloupe 🌤️'],
            ['!quiz', 'Question caribéenne aléatoire 🎯'],
            ['!points', 'Voir tes points REUSS 🏆'],
            ['!top', 'Top champions REUSSITESS 👑'],
            ['!aide', 'Liste des commandes 📋'],
          ].map(([cmd, desc]) => (
            <div key={cmd} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <span style={{ color: '#53FC18', fontWeight: 'bold', minWidth: '100px' }}>{cmd}</span>
              <span style={{ color: '#888' }}>{desc}</span>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: '700px', margin: '2rem auto', background: '#111', border: '1px solid #a78bfa', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ color: '#a78bfa', margin: '0 0 1rem' }}>💎 Système Points REUSS</h2>
          {[
            ['❤️ Follow', '+10 REUSS'],
            ['🎉 Abonnement', '+100 REUSS'],
            ['🎁 Gift Sub (x1)', '+100 REUSS'],
            ['🎁 Gift Sub (x5)', '+500 REUSS'],
            ['🚀 Host/Raid', 'Bonus spécial'],
          ].map(([action, points]) => (
            <div key={action} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', padding: '0.5rem', background: '#0d0d0d', borderRadius: '8px' }}>
              <span>{action}</span>
              <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{points}</span>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#53FC18', marginTop: '2rem' }}>
          Boudoum ! 🇬🇵 — <a href="/" style={{ color: '#a78bfa' }}>REUSSITESS®971</a>
        </p>
      </div>
    </>
  )
}
