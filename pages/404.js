/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Custom404() {
  const router = useRouter()
  const [glitch, setGlitch] = useState(false)
  const [typed, setTyped] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const full = 'ERREUR_404 : CHEMIN_INTROUVABLE'

  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      setTyped(full.slice(0, i))
      i++
      if (i > full.length) clearInterval(t)
    }, 60)
    const g = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 150)
    }, 3000)
    return () => { clearInterval(t); clearInterval(g) }
  }, [])

  return (
    <div style={{ backgroundColor: '#000', color: '#00ff41', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', padding: '2rem', overflow: 'hidden', position: 'relative' }}>
      <Head><title>404 - SYSTEM_PROTECTED | REUSSITESS®971</title></Head>

      {/* Grille fond */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px', pointerEvents: 'none' }} />

      {/* Scan line */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(0,255,65,0.3)', animation: 'scan 4s linear infinite', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '600px' }}>

        {/* 404 glitch */}
        <div style={{
          fontSize: 'clamp(5rem,20vw,10rem)',
          fontWeight: '900',
          color: glitch ? '#ff0040' : '#00ff41',
          textShadow: glitch ? '4px 0 #ff0040, -4px 0 #00ffff' : '0 0 30px rgba(0,255,65,0.5)',
          lineHeight: 1,
          marginBottom: '1rem',
          transition: 'all 0.1s',
          letterSpacing: '-0.05em',
        }}>404</div>

        {/* Typing effect */}
        <div style={{ fontSize: '0.85rem', color: '#00ff41', marginBottom: '0.5rem', minHeight: '1.2rem' }}>
          &gt; {typed}<span style={{ animation: 'blink 1s infinite' }}>_</span>
        </div>

        <div style={{ fontSize: '0.7rem', color: '#004d14', marginBottom: '3rem', lineHeight: 1.8 }}>
          [ST-006] SENTINELLE SITE — ALERTE ACTIVE<br/>
          [NX-001] NEURO-X — ANALYSE EN COURS...<br/>
          [REUSSITESS®971] SYSTEME PROTEGE — BOUDOUM 🥁
        </div>

        {/* Bouton principal */}
        <div
          onClick={() => router.push('/')}
          style={{ border: '1px solid #00ff41', padding: '0.75rem 2rem', cursor: 'pointer', fontSize: '0.85rem', color: '#00ff41', marginBottom: '1rem', display: 'inline-block', transition: 'all 0.2s', letterSpacing: '0.1em' }}
          onMouseEnter={e => { e.target.style.background = '#00ff41'; e.target.style.color = '#000' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#00ff41' }}
        >
          &gt; EXECUTER_PROTOCOLE_NEXUS.exe
        </div>

        <br />

        {/* Liens rapides */}
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{ fontSize: '0.7rem', color: '#004d14', cursor: 'pointer', marginBottom: '1rem', letterSpacing: '0.05em' }}
          onMouseEnter={e => e.target.style.color = '#00ff41'}
          onMouseLeave={e => e.target.style.color = '#004d14'}
        >
          {showMenu ? '▼' : '▶'} AFFICHER_MODULES_DISPONIBLES
        </div>

        {showMenu && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {[
              { label: '🤖 SuperBot', url: '/' },
              { label: '💎 Token REUSS', url: '/investir-reuss' },
              { label: '🏆 Champions', url: '/champions' },
              { label: '🎯 Quiz', url: '/quiz' },
              { label: '💪 Coach', url: '/coach' },
              { label: '📺 Communauté', url: '/communaute' },
              { label: '🧠 Neuro-X', url: '/neuro-x' },
              { label: '🌍 Bibliothèque', url: '/bibliotheque' },
            ].map((l, i) => (
              <span
                key={i}
                onClick={() => router.push(l.url)}
                style={{ border: '1px solid #002208', padding: '0.3rem 0.75rem', fontSize: '0.7rem', cursor: 'pointer', color: '#004d14', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.target.style.borderColor = '#00ff41'; e.target.style.color = '#00ff41' }}
                onMouseLeave={e => { e.target.style.borderColor = '#002208'; e.target.style.color = '#004d14' }}
              >{l.label}</span>
            ))}
          </div>
        )}

        <div style={{ fontSize: '0.6rem', color: '#001a08', letterSpacing: '0.2em', marginTop: '2rem' }}>
          REUSSITESS®971 — GUADELOUPE 🇬🇵 — TERRES DE CHAMPIONS
        </div>
      </div>

      <style>{`
        @keyframes scan { from { top: -2px } to { top: 100vh } }
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </div>
  )
}
