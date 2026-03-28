import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const COURS = [
  { id: 1, titre: "Créole Guadeloupéen — Débutant", emoji: "🗣️", niveau: "Débutant", duree: "4h", desc: "Apprends les bases du créole guadeloupéen — salutations, expressions quotidiennes, prononciation.", gratuit: true, lecons: ["Bonjour en créole", "Les chiffres", "La famille", "Les couleurs", "Expressions courantes"] },
  { id: 2, titre: "Histoire Afro-Caribéenne", emoji: "📚", niveau: "Intermédiaire", duree: "6h", desc: "De l'Afrique précoloniale à la Guadeloupe moderne — Toussaint, Césaire, Fanon, Mandela.", gratuit: true, lecons: ["Civilisations africaines", "La traite négrière", "Résistances et révoltes", "Abolition 1848", "Indépendances africaines"] },
  { id: 3, titre: "Entrepreneuriat Caribéen", emoji: "💼", niveau: "Intermédiaire", duree: "8h", desc: "Crée et développe ton business aux Antilles — plan, financement, digital, Amazon.", gratuit: true, lecons: ["Idée & Validation", "Business plan", "Auto-entrepreneur", "Marketing digital", "Amazon Affiliation"] },
  { id: 4, titre: "IA & Technologie pour tous", emoji: "🤖", niveau: "Débutant", duree: "5h", desc: "Comprendre et utiliser l'intelligence artificielle pour ton quotidien et ton business.", gratuit: true, lecons: ["C'est quoi l'IA", "ChatGPT & REUSSITESS AI", "Créer avec l'IA", "IA et emploi", "Automatiser son business"] },
  { id: 5, titre: "Gwoka & Culture Caribéenne", emoji: "🥁", niveau: "Débutant", duree: "3h", desc: "Le Gwoka, patrimoine UNESCO — histoire, rythmes, signification culturelle.", gratuit: true, lecons: ["Histoire du Gwoka", "Les 7 rythmes", "Instruments", "Carnaval & Ka", "Préservation"] },
  { id: 6, titre: "Blockchain & Token REUSS", emoji: "💎", niveau: "Avancé", duree: "6h", desc: "Comprendre la blockchain, Polygon, le token REUSS et l'économie décentralisée.", gratuit: true, lecons: ["C'est quoi la blockchain", "Polygon & Ethereum", "Token REUSS", "Wallet & Sécurité", "DeFi & Staking"] },
]

const NIVEAUX = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé']

export default function Academie() {
  const [filtre, setFiltre] = useState('Tous')
  const [selected, setSelected] = useState(null)
  const [leconActive, setLeconActive] = useState(0)

  const cours = COURS.filter(c => filtre === 'Tous' || c.niveau === filtre)

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎓</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>ACADÉMIE REUSSITESS</h1>
          <p style={{ color: '#94a3b8' }}>Cours gratuits — Créole • Culture • Business • IA • Blockchain</p>
          <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.3rem' }}>🇬🇵 Né en Guadeloupe — Pour la diaspora mondiale</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {NIVEAUX.map(n => (
            <button key={n} onClick={() => setFiltre(n)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === n ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
                color: filtre === n ? 'white' : '#94a3b8' }}>
              {n}
            </button>
          ))}
        </div>

        {selected ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}>← Retour aux cours</button>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
              <h2 style={{ color: '#fff', fontWeight: '900', marginBottom: '0.5rem' }}>{selected.titre}</h2>
              <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{selected.desc}</p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem' }}>⏱️ {selected.duree}</span>
                <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem' }}>📊 {selected.niveau}</span>
                <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.3rem 0.8rem', borderRadius: '10px', fontSize: '0.8rem' }}>✅ Gratuit</span>
              </div>
              <h3 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>📋 Programme</h3>
              {selected.lecons.map((l, i) => (
                <div key={i} onClick={() => setLeconActive(i)}
                  style={{ padding: '0.8rem 1rem', background: leconActive === i ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${leconActive === i ? '#10b981' : 'rgba(255,255,255,0.05)'}`, borderRadius: '10px', marginBottom: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ background: leconActive === i ? '#10b981' : 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{l}</span>
                  {leconActive === i && <span style={{ marginLeft: 'auto', color: '#10b981', fontSize: '0.8rem' }}>▶ En cours</span>}
                </div>
              ))}
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'rgba(16,185,129,0.08)', borderRadius: '15px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ color: '#10b981', fontWeight: '700', marginBottom: '0.5rem' }}>🤖 Cours IA — Leçon {leconActive + 1}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Pose tes questions sur "{selected.lecons[leconActive]}" directement au bot REUSSITESS AI !</p>
                <Link href="/" style={{ display: 'inline-block', marginTop: '0.75rem', padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '700' }}>
                  🤖 Demander au bot
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
            {cours.map(c => (
              <div key={c.id} onClick={() => { setSelected(c); setLeconActive(0) }}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{c.emoji}</div>
                <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}>{c.titre}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: '1.5' }}>{c.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem' }}>{c.niveau}</span>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem' }}>⏱️ {c.duree}</span>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.7rem' }}>✅ Gratuit</span>
                </div>
                <button style={{ width: '100%', padding: '0.6rem', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem' }}>
                  🎓 Commencer le cours
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>{COURS.length} cours gratuits • REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
