import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const PODCASTS = [
  { id: 1, nom: "REUSSITESS Radio", desc: "Entrepreneuriat, IA et innovation caribéenne", emoji: "🤖", url: "https://reussitess.fr", pays: "Guadeloupe 🇬🇵", tags: ["Business", "IA"] },
  { id: 2, nom: "Gwoka Session", desc: "Histoire et culture du Gwoka, patrimoine UNESCO", emoji: "🥁", url: "https://la1ere.francetvinfo.fr/guadeloupe/rss.xml", pays: "Guadeloupe 🇬🇵", tags: ["Culture", "Musique"] },
  { id: 3, nom: "Caraïbes Business", desc: "Actualité économique et entrepreneuriale des Antilles", emoji: "💼", url: "https://la1ere.francetvinfo.fr/rss.xml", pays: "DOM-TOM 🌴", tags: ["Business", "Économie"] },
  { id: 4, nom: "Diasporas Africa", desc: "Voix de la diaspora africaine en France et dans le monde", emoji: "🌍", url: "https://www.rfi.fr/fr/rss", pays: "Afrique 🌍", tags: ["Diaspora", "Culture"] },
  { id: 5, nom: "Créole Talk", desc: "Langue et culture créole — apprendre et préserver", emoji: "🗣️", url: "#", pays: "Caraïbes 🌴", tags: ["Langue", "Culture"] },
  { id: 6, nom: "RFI Afrique", desc: "Actualités africaines et caribéennes en temps réel", emoji: "📻", url: "https://www.rfi.fr/fr/rss", pays: "Afrique 🌍", tags: ["Actualités"] },
]

export default function PodcastsCreoles() {
  const [filtre, setFiltre] = useState('Tous')
  const tags = ['Tous', 'Business', 'Culture', 'Musique', 'Diaspora', 'Actualités', 'Langue']

  const filtered = PODCASTS.filter(p => filtre === 'Tous' || p.tags.includes(filtre))

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎙️</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>PODCASTS CARIBÉENS</h1>
          <p style={{ color: '#94a3b8' }}>Voix de la diaspora afro-caribéenne</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {tags.map(t => (
            <button key={t} onClick={() => setFiltre(t)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === t ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
                color: filtre === t ? 'white' : '#94a3b8' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.3rem' }}>{p.nom}</h3>
              <p style={{ color: '#10b981', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{p.pays}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {p.tags.map(t => <span key={t} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem' }}>{t}</span>)}
              </div>
              {p.url !== '#' && (
                <a href={p.url} target="_blank" rel="noreferrer"
                  style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700' }}>
                  🎙️ Écouter
                </a>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
