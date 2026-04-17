/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

type Defi = { defi: string; categorie: string; emoji: string; motivation: string; reuss_reward: number; date: string }
type Profil = 'entrepreneur' | 'etudiant' | 'sportif' | 'general'

export default function CoachDeVie() {
  const [profil, setProfil] = useState<Profil>('general')
  const [defi, setDefi] = useState<Defi | null>(null)
  const [loading, setLoading] = useState(false)
  const [accompli, setAccompli] = useState(false)
  const [streak, setStreak] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)

  const profils: { id: Profil; label: string; icon: string }[] = [
    { id: 'entrepreneur', label: 'Entrepreneur', icon: '💼' },
    { id: 'etudiant', label: 'Étudiant', icon: '🎓' },
    { id: 'sportif', label: 'Sportif', icon: '🏃' },
    { id: 'general', label: 'Général', icon: '🌴' },
  ]

  const profilBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${active ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: '12px', padding: '0.6rem 1.2rem', color: '#fff',
    cursor: 'pointer', fontWeight: active ? '700' : '400',
    fontSize: '0.9rem', transition: 'all 0.2s'
  })

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    background: disabled ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#10b981,#059669)',
    border: 'none', borderRadius: '14px', padding: '1rem 2rem',
    color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '800', fontSize: '1.1rem', width: '100%',
    opacity: disabled ? 0.6 : 1, transition: 'all 0.2s'
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfil = localStorage.getItem('coach_profil') as Profil || 'general'
      const savedStreak = parseInt(localStorage.getItem('coach_streak') || '0')
      const savedTokens = parseInt(localStorage.getItem('coach_tokens') || '0')
      const savedDate = localStorage.getItem('coach_last_date') || ''
      const today = new Date().toISOString().split('T')[0]
      const savedAccompli = savedDate === today && localStorage.getItem('coach_accompli') === 'true'
      setProfil(savedProfil)
      setStreak(savedStreak)
      setTotalTokens(savedTokens)
      setAccompli(savedAccompli)
      fetchDefi(savedProfil)
    }
  }, [])

  const fetchDefi = async (p: Profil) => {
    setLoading(true)
    try {
      const r = await fetch(`/api/superbot/coach?profil=${p}`)
      const data = await r.json()
      setDefi(data)
    } catch {}
    setLoading(false)
  }

  const changeProfil = (p: Profil) => {
    setProfil(p)
    localStorage.setItem('coach_profil', p)
    fetchDefi(p)
  }

  const accomplirDefi = () => {
    const today = new Date().toISOString().split('T')[0]
    const lastDate = localStorage.getItem('coach_last_date') || ''
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const newStreak = lastDate === yesterday ? streak + 1 : 1
    const newTokens = totalTokens + (defi?.reuss_reward || 10)
    setStreak(newStreak)
    setTotalTokens(newTokens)
    setAccompli(true)
    localStorage.setItem('coach_last_date', today)
    localStorage.setItem('coach_accompli', 'true')
    localStorage.setItem('coach_streak', String(newStreak))
    localStorage.setItem('coach_tokens', String(newTokens))
  }

  const s: Record<string, React.CSSProperties> = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1a1a2e)', padding: '2rem 1rem', fontFamily: 'sans-serif' },
    center: { textAlign: 'center', marginBottom: '2rem' },
    title: { color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900', margin: '0 0 0.5rem' },
    sub: { color: '#94a3b8', fontSize: '1rem' },
    card: { maxWidth: '700px', margin: '0 auto 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '2rem' },
    profilRow: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' },
    defiBox: { background: 'rgba(16,185,129,0.08)', border: '2px solid rgba(16,185,129,0.4)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' },
    defiText: { color: '#e2e8f0', fontSize: '1.2rem', fontWeight: '700', lineHeight: '1.6', marginBottom: '0.5rem' },
    catBadge: { display: 'inline-block', background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', borderRadius: '8px', padding: '0.25rem 0.75rem', color: '#10b981', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem' },
    motiv: { color: '#94a3b8', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: '1.5' },
    statsRow: { display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' },
    stat: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1rem 1.5rem', textAlign: 'center' },
    statNum: { color: '#10b981', fontSize: '2rem', fontWeight: '900', display: 'block' },
    statLabel: { color: '#64748b', fontSize: '0.75rem' },
  }

  return (
    <Layout>
      <div style={s.page}>
        <div style={s.center}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>💪</div>
          <h1 style={s.title}>COACH DE VIE REUSSITESS</h1>
          <p style={s.sub}>Ton défi quotidien caribéen — Deviens un Champion 🏆</p>
        </div>

        <div style={s.statsRow}>
          <div style={s.stat}><span style={s.statNum}>🔥 {streak}</span><span style={s.statLabel}>Jours de streak</span></div>
          <div style={s.stat}><span style={s.statNum}>💎 {totalTokens}</span><span style={s.statLabel}>REUSS gagnés</span></div>
          <div style={s.stat}><span style={s.statNum}>{accompli ? '✅' : '⏳'}</span><span style={s.statLabel}>Aujourd'hui</span></div>
        </div>

        <div style={s.profilRow}>
          {profils.map(p => (
            <button key={p.id} style={profilBtn(profil === p.id)} onClick={() => changeProfil(p.id)}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>

        <div style={s.card}>
          {loading ? (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Chargement du défi... ⏳</p>
          ) : defi ? (
            <>
              <div style={s.defiBox}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{defi.emoji}</div>
                <span style={s.catBadge}>{defi.categorie}</span>
                <p style={s.defiText}>{defi.defi}</p>
                <p style={s.motiv}>{defi.motivation}</p>
              </div>
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '12px', padding: '0.75rem', textAlign: 'center', marginBottom: '1.5rem', color: '#fbbf24', fontWeight: '700' }}>
                🏆 Récompense : +{defi.reuss_reward} REUSS tokens
              </div>
              <button style={btnStyle(accompli)} onClick={accomplirDefi} disabled={accompli}>
                {accompli ? '✅ Défi accompli ! BOUDOUM ! 🥁' : '⚡ Marquer comme accompli'}
              </button>
            </>
          ) : (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Erreur de chargement. Réessaie.</p>
          )}
        </div>

        <div style={{ textAlign: 'center', color: '#475569', fontSize: '0.8rem', marginTop: '2rem' }}>
          <p>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
