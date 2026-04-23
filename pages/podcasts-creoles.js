/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const PODCASTS = [
  { id: 1, nom: "Guadeloupe la 1ère", desc: "Émissions et podcasts officiels de Guadeloupe la 1ère — actualités, culture, société", emoji: "🎙", url: "https://la1ere.francetvinfo.fr/guadeloupe/programmes", pays: "Guadeloupe 🇬🇵", tags: ["Actualités", "Culture"] },
  { id: 2, nom: "RCI Guadeloupe Podcasts", desc: "Radio Caraïbes International — émissions, débats et magazines guadeloupéens", emoji: "📻", url: "https://rci.fm/guadeloupe/podcasts", pays: "Guadeloupe 🇬🇵", tags: ["Actualités", "Musique"] },
  { id: 3, nom: "Martinique la 1ère", desc: "Podcasts et émissions de Martinique la 1ère — culture, politique, société martiniquaise", emoji: "🎵", url: "https://la1ere.francetvinfo.fr/martinique/programmes", pays: "Martinique 🇲🇶", tags: ["Actualités", "Culture"] },
  { id: 4, nom: "RCI Martinique", desc: "Radio Caraïbes International Martinique — émissions créoles et actualités", emoji: "🥁", url: "https://rci.fm/martinique/podcasts", pays: "Martinique 🇲🇶", tags: ["Culture", "Musique"] },
  { id: 5, nom: "Guyane la 1ère", desc: "Podcasts de Guyane la 1ère — actualités amazoniennes, culture guyanaise", emoji: "🌿", url: "https://la1ere.francetvinfo.fr/guyane/programmes", pays: "Guyane 🇬🇫", tags: ["Actualités", "Culture"] },
  { id: 6, nom: "Réunion la 1ère", desc: "Émissions et podcasts de La Réunion — culture réunionnaise, maloya, actualités", emoji: "🌋", url: "https://la1ere.francetvinfo.fr/reunion/programmes", pays: "Réunion 🇷🇪", tags: ["Actualités", "Culture"] },
  { id: 7, nom: "RFI Afrique Podcasts", desc: "Podcasts RFI dédiés à l'Afrique et à la diaspora africaine mondiale", emoji: "🌍", url: "https://www.rfi.fr/fr/podcasts", pays: "Afrique 🌍", tags: ["Diaspora", "Actualités"] },
  { id: 8, nom: "Outremers 360 Radio", desc: "Le média des Outre-mer — podcasts, émissions et débats sur tous les territoires", emoji: "🗣", url: "https://outremers360.com/podcasts", pays: "DOM-TOM 🌴", tags: ["Actualités", "Diaspora"] },
  { id: 9, nom: "Bondamanjak Podcast", desc: "Le média caribéen indépendant — société, culture et politique antillaise", emoji: "💬", url: "https://www.bondamanjak.com", pays: "Caraïbes 🌴", tags: ["Culture", "Société"] },
  { id: 10, nom: "Gwoka UNESCO", desc: "Le Gwoka, patrimoine immatériel de l'UNESCO — histoire, rythmes et spiritualité", emoji: "🥁", url: "https://la1ere.francetvinfo.fr/guadeloupe/programmes", pays: "Guadeloupe 🇬🇵", tags: ["Culture", "Musique"] },
  { id: 11, nom: "Zouk & Caribéen", desc: "Histoire du zouk, biguine, soca et musiques caribéennes — artistes et interviews", emoji: "🎶", url: "https://rci.fm/guadeloupe", pays: "Caraïbes 🌴", tags: ["Musique", "Culture"] },
  { id: 12, nom: "Créole Talk", desc: "Apprendre et préserver la langue créole — guadeloupéen, martiniquais, haïtien", emoji: "🗣", url: "https://reussitess.fr/neuro-x", pays: "Caraïbes 🌴", tags: ["Langue", "Culture"] },
]

export default function PodcastsCreoles() {
  const [filtre, setFiltre] = useState('Tous')
  const tags = ['Tous', 'Actualités', 'Culture', 'Musique', 'Diaspora', 'Langue', 'Société']
  const filtered = PODCASTS.filter(p => filtre === 'Tous' || p.tags.includes(filtre))

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🎙</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>PODCASTS CARIBÉENS</h1>
          <p style={{ color: '#94a3b8' }}>Voix de la diaspora afro-caribéenne — {PODCASTS.length} sources</p>
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

        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {filtered.map(p => (
            <div key={p.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{p.emoji}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.3rem' }}>{p.nom}</h3>
              <p style={{ color: '#10b981', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{p.pays}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: '1.5' }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {p.tags.map(t => <span key={t} style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem' }}>{t}</span>)}
              </div>
              <a href={p.url} target="_blank" rel="noreferrer"
                style={{ display: 'inline-block', padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700' }}>
                🎙 Écouter
              </a>
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
