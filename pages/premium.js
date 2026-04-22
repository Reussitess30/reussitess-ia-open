/* © Reussitess®971 INPI DSO2026014206 PORINUS Rony 2026 */
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const MODULES = [
  { icon: '🧬', nom: 'ADN de Réussite', desc: 'Analyse psychologique profonde de ta personnalité caribéenne' },
  { icon: '💼', nom: 'Architecte de Fortune', desc: 'Plan financier 5 ans DOM-TOM + Girardin + crypto REUSS' },
  { icon: '🎯', nom: 'Négociateur Caribéen', desc: 'Scripts de négociation adaptés aux codes afro-caribéens' },
  { icon: '🌐', nom: 'Traducteur de Succès', desc: 'Pitch ton projet caribéen en France, Canada, USA' },
  { icon: '🏗', nom: "Bâtisseur d'Empire", desc: "De l'idée à l'entreprise en 90 jours DOM-TOM" },
  { icon: '🛡', nom: 'Bouclier Juridique', desc: 'Protection juridique complète droit français + DOM-TOM' },
  { icon: '🧠', nom: 'Mindset Champions', desc: 'Transformation mentale — Césaire, Fanon, Glissant' },
  { icon: '🌱', nom: 'Entrepreneur Social', desc: 'Impact communautaire + revenus + subventions caribéennes' },
  { icon: '📡', nom: 'Intelligence Stratégique', desc: 'Veille et opportunités dans 14 pays partenaires' },
  { icon: '👑', nom: 'Passeport Excellence', desc: 'Certification personnelle reconnue réseau REUSSITESS®' },
]

export default function Premium() {
  const [step, setStep] = useState('landing')
  const [telegramId, setTelegramId] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const souscrire = async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramId || 'web' })
      })
      const d = await r.json()
      if (d.url) window.open(d.url, '_blank')
      else setError('Erreur PayPal. Réessaie.')
    } catch { setError('Erreur de connexion') }
    setLoading(false)
  }

  const activer = async () => {
    if (!telegramId || !code) { setError('Remplis tous les champs'); return }
    setLoading(true); setError('')
    try {
      const r = await fetch('/api/premium/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, code })
      })
      const d = await r.json()
      if (d.success) setStep('success')
      else setError(d.error || 'Code invalide')
    } catch { setError('Erreur de connexion') }
    setLoading(false)
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem', boxSizing: 'border-box' }
  const btnGreen = { background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '12px', padding: '0.9rem', color: '#fff', fontWeight: '800', width: '100%', cursor: 'pointer', fontSize: '1rem' }
  const btnBlue = { background: 'linear-gradient(135deg,#0070f3,#0055cc)', border: 'none', borderRadius: '12px', padding: '0.9rem', color: '#fff', fontWeight: '800', width: '100%', cursor: 'pointer', fontSize: '1rem' }
  const btnDisabled = { ...btnGreen, background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }

  return (
    <>
      <Head>
        <title>REUSSITESS Premium — 10 Modules Uniques | 4,99€/mois</title>
        <meta name="description" content="10 modules IA uniques au monde pour la diaspora caribéenne. BOUDOUM !" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#04060f', color: '#fff', fontFamily: 'Georgia, serif' }}>
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 20% 20%, rgba(16,185,129,0.07) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {step === 'landing' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '50px', padding: '0.4rem 1.2rem', fontSize: '0.75rem', color: '#10b981', letterSpacing: '0.1em' }}>
                EXCLUSIF MONDIAL — AUCUNE APP NE FAIT CELA
              </span>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🥁</div>
              <h1 style={{ fontSize: 'clamp(2rem,6vw,4rem)', fontWeight: '900', lineHeight: 1.1, margin: '0 0 1rem' }}>
                Deviens un{' '}
                <span style={{ background: 'linear-gradient(135deg,#10b981,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Champion Caribéen
                </span>
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
                10 modules IA créés exclusivement pour la diaspora afro-caribéenne.
              </p>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(16,185,129,0.4)', borderRadius: '20px', padding: '1.5rem 3rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through', marginBottom: '0.25rem' }}>9,99€/mois</div>
                <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#10b981', lineHeight: 1 }}>4,99€</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>par mois • Sans engagement</div>
                <div style={{ marginTop: '0.75rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: '#f59e0b' }}>
                  
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setStep('activation')} style={{ ...btnGreen, width: 'auto', padding: '1rem 2.5rem', fontSize: '1.1rem', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}>
                  🚀 S'abonner maintenant
                </button>
              </div>
            </div>

            <h2 style={{ textAlign: 'center', color: '#e2e8f0', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800' }}>10 Modules Uniques au Monde</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.75rem', marginBottom: '3rem' }}>
              {MODULES.map((m, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '1.25rem', display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{m.icon}</span>
                  <div>
                    <div style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{m.nom}</div>
                    <div style={{ color: '#64748b', fontSize: '0.78rem', lineHeight: 1.5 }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '24px', padding: '3rem 2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🇬🇵</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.75rem' }}>Rejoins les Champions</h3>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Annule à tout moment. BOUDOUM !</p>
              <button onClick={() => setStep('activation')} style={{ ...btnGreen, width: 'auto', padding: '1.1rem 3rem', fontSize: '1.1rem', boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}>
                👑 Devenir Premium — 4,99€/mois
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link href="/" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.85rem' }}>← Retour à l'accueil</Link>
            </div>
          </div>
        )}

        {step === 'activation' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '4rem 1.5rem', position: 'relative' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>👑</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>Activation Premium</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>2 étapes simples pour accéder à tes 10 modules</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem' }}>
              <div style={{ color: '#10b981', fontWeight: '800', marginBottom: '1rem', fontSize: '0.9rem' }}>ÉTAPE 1 — Payer via PayPal</div>
              <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Ton ID Telegram (pour recevoir ton code)</label>
              <input value={telegramId} onChange={e => setTelegramId(e.target.value)} placeholder="Ex: 123456789" style={inputStyle} />
              <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '1rem' }}>
                Trouve ton ID : écris <strong style={{ color: '#94a3b8' }}>/start</strong> à <strong style={{ color: '#94a3b8' }}>@userinfobot</strong> sur Telegram
              </p>
              <button onClick={souscrire} disabled={loading || !telegramId} style={loading || !telegramId ? btnDisabled : btnBlue}>
                {loading ? '⏳ Connexion...' : '💳 Payer 4,99€ via PayPal'}
              </button>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ color: '#f59e0b', fontWeight: '800', marginBottom: '1rem', fontSize: '0.9rem' }}>ÉTAPE 2 — Entrer ton code d'activation</div>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>Après paiement, tu reçois un code sur Telegram et par email. Entre-le ici :</p>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="REUSS-XXXXXXXX" style={{ ...inputStyle, letterSpacing: '0.1em', fontFamily: 'monospace' }} />
              {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>⚠ {error}</p>}
              <button onClick={activer} disabled={loading || !code || !telegramId} style={loading || !code || !telegramId ? btnDisabled : btnGreen}>
                {loading ? '⏳ Activation...' : '🚀 Activer mon accès Premium'}
              </button>
            </div>
            <button onClick={() => setStep('landing')} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '1.5rem', display: 'block', margin: '1.5rem auto 0', fontSize: '0.85rem' }}>
              ← Retour
            </button>
          </div>
        )}

        {step === 'success' && (
          <div style={{ maxWidth: '500px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '1rem', background: 'linear-gradient(135deg,#10b981,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Bienvenue Champion !
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: 1.7 }}>
              Ton accès Premium est activé. Tu as reçu un message de confirmation sur Telegram.
            </p>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ color: '#10b981', fontWeight: '800', marginBottom: '0.5rem' }}>✅ 10 Modules déverrouillés</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>Accès illimité pendant 31 jours</div>
            </div>
            <Link href="/modules-reussitess" style={{ display: 'block', background: 'linear-gradient(135deg,#10b981,#059669)', borderRadius: '14px', padding: '1rem 2rem', color: '#fff', fontWeight: '900', textDecoration: 'none', fontSize: '1.1rem', boxShadow: '0 0 40px rgba(16,185,129,0.4)', marginBottom: '1rem' }}>
              👑 Accéder à mes modules
            </Link>
            <p style={{ color: '#1e293b', fontSize: '0.75rem' }}>REUSSITESS®971 — Terres de Champions 🇬🇵</p>
          </div>
        )}
      </div>
    </>
  )
}
