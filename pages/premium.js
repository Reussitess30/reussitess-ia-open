/* © REUSSITESS®971 — INPI DSO2026012614 — Networking Classe 45 */
import { useState } from 'react'
import Link from 'next/link'

const MODULES = [
  { icon: "🧬", nom: "ADN de Reussite", desc: "Analyse psychologique profonde de ta personnalite caribeenne" },
  { icon: "💼", nom: "Architecte de Fortune", desc: "Plan financier 5 ans DOM-TOM + Girardin + crypto REUSS" },
  { icon: "🎯", nom: "Negociateur Caribeen", desc: "Scripts de negociation adaptes aux codes afro-caribeens" },
  { icon: "🌐", nom: "Traducteur de Succes", desc: "Pitch ton projet caribeen en France, Canada, USA" },
  { icon: "🏗️", nom: "Batisseur d'Empire", desc: "De l'idee a l'entreprise en 90 jours DOM-TOM" },
  { icon: "🛡️", nom: "Bouclier Juridique", desc: "Protection juridique complete droit francais + DOM-TOM" },
  { icon: "🧠", nom: "Mindset Champions", desc: "Transformation mentale — Cesaire, Fanon, Glissant" },
  { icon: "🌱", nom: "Entrepreneur Social", desc: "Impact communautaire + revenus + subventions caribeennes" },
  { icon: "📡", nom: "Intelligence Strategique", desc: "Veille et opportunites dans 14 pays partenaires" },
  { icon: "👑", nom: "Passeport Excellence", desc: "Certification personnelle reconnue reseau REUSSITESS" },
]

export default function Premium() {
  const [loading, setLoading] = useState(false)
  const [telegramId, setTelegramId] = useState('')
  const [step, setStep] = useState('landing')

  async function souscrire() {
    setLoading(true)
    try {
      const r = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: telegramId || 'web' })
      })
      const d = await r.json()
      if (d.url) window.open(d.url, '_blank')
      else alert('Erreur PayPal. Reessaie.')
    } catch(e) { alert('Erreur connexion') }
    setLoading(false)
  }

  const btn = { background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '12px', padding: '1rem 2.5rem', color: '#fff', fontWeight: '900', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', color: '#fff', fontFamily: 'Georgia, serif' }}>
      <div style={{ padding: '15px 20px' }}>
        <Link href="/" style={{ color: '#10b981', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid #333', padding: '6px 16px', borderRadius: '20px' }}>← Accueil</Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '50px', padding: '0.4rem 1.2rem', fontSize: '0.75rem', color: '#10b981' }}>
            EXCLUSIF MONDIAL — AUCUNE APP NE FAIT CELA
          </span>
          <div style={{ fontSize: '4rem', margin: '1rem 0' }}>🥁</div>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: '900', margin: '0 0 1rem' }}>
            Deviens un{' '}
            <span style={{ background: 'linear-gradient(135deg,#10b981,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Champion Caribeen
            </span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '550px', margin: '0 auto 2rem', lineHeight: 1.7 }}>
            10 modules IA crees exclusivement pour la diaspora afro-caribeenne. Introuvables ailleurs.
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(16,185,129,0.4)', borderRadius: '20px', padding: '1.5rem 3rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through', marginBottom: '0.25rem' }}>9,99 EUR/mois</div>
            <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#10b981', lineHeight: 1 }}>4,99 EUR</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>par mois - Sans engagement</div>
            <div style={{ marginTop: '0.5rem', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', padding: '0.3rem 0.8rem', fontSize: '0.75rem', color: '#f59e0b' }}>
            </div>
          </div>
          <br />
          <input
            value={telegramId}
            onChange={e => setTelegramId(e.target.value)}
            placeholder="Ton ID Telegram (optionnel)"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', marginBottom: '1rem', width: '280px' }}
          />
          <br />
          <button onClick={souscrire} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Chargement...' : 'Souscrire 4,99 EUR/mois via PayPal'}
          </button>
          <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.75rem' }}>
            PayPal securise - Annulation a tout moment - Protection INPI DSO2026012614
          </p>
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
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>50 millions d afro-caribeens dans le monde. Tu merires les meilleurs outils. BOUDOUM !</p>
          <button onClick={souscrire} disabled={loading} style={{ ...btn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Chargement...' : 'Devenir Premium — 4,99 EUR/mois'}
          </button>
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', fontSize: '0.72rem', color: '#475569', textAlign: 'left' }}>
            <strong style={{ color: '#64748b' }}>Mentions Legales</strong><br />
            REUSSITESS®971 - Proprietaire : Rony Porinus - Auto-entrepreneur Guadeloupe<br />
            SIRET : 444699979700031 - Protection INPI DSO2026012614 - Networking Classe 45<br />
            Abonnement mensuel resiliable a tout moment depuis votre espace PayPal.<br />
            Droit de retractation 14 jours - Contact : influenceur@reussitess.fr
          </div>
        </div>
      </div>
    </div>
  )
}
