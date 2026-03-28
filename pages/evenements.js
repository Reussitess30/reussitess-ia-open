import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const EVENEMENTS = [
  { id: 1, nom: "Carnaval de Guadeloupe", date: "2026-03-01", fin: "2026-03-04", pays: "Guadeloupe 🇬🇵", type: "Festival", desc: "Le plus grand carnaval des Antilles françaises. Chars, costumes, gwoka et vidé.", url: "#" },
  { id: 2, nom: "Fête de la Musique DOM-TOM", date: "2026-06-21", fin: "2026-06-21", pays: "DOM-TOM 🌴", type: "Culture", desc: "Concerts gratuits partout en Guadeloupe, Martinique, Réunion et Guyane.", url: "#" },
  { id: 3, nom: "Festival Gwoka", date: "2026-07-14", fin: "2026-07-21", pays: "Guadeloupe 🇬🇵", type: "Patrimoine UNESCO", desc: "Célébration du Gwoka, patrimoine immatériel de l'humanité UNESCO.", url: "#" },
  { id: 4, nom: "Carnaval de Trinidad", date: "2027-02-15", fin: "2027-02-16", pays: "Trinidad 🇹🇹", type: "Festival", desc: "Plus grand carnaval caribéen du monde. Soca, steel pan et costumes époustouflants.", url: "#" },
  { id: 5, nom: "Journée Internationale Afrique", date: "2026-05-25", fin: "2026-05-25", pays: "Monde 🌍", type: "Commémoration", desc: "Journée de l'Afrique — célébration de l'unité africaine.", url: "#" },
  { id: 6, nom: "Commémoration Abolition Esclavage", date: "2026-05-22", fin: "2026-05-22", pays: "Martinique 🇲🇶", type: "Commémoration", desc: "27 avril à Mayotte, 22 mai en Martinique, 27 mai en Guadeloupe.", url: "#" },
  { id: 7, nom: "Abolition Esclavage Guadeloupe", date: "2026-05-27", fin: "2026-05-27", pays: "Guadeloupe 🇬🇵", type: "Commémoration", desc: "Commémoration officielle de l'abolition de l'esclavage en Guadeloupe.", url: "#" },
  { id: 8, nom: "Festival Jazz Guadeloupe", date: "2026-08-10", fin: "2026-08-15", pays: "Guadeloupe 🇬🇵", type: "Festival", desc: "Festival international de jazz et de musiques caribéennes.", url: "#" },
  { id: 9, nom: "Fête de la Réunion", date: "2026-12-20", fin: "2026-12-20", pays: "Réunion 🇷🇪", type: "Commémoration", desc: "Fête de l'abolition de l'esclavage à la Réunion — 20 décembre 1848.", url: "#" },
  { id: 10, nom: "Journée Internationale Diaspora", date: "2026-06-25", fin: "2026-06-25", pays: "Monde 🌍", type: "Culture", desc: "Célébration mondiale de la diaspora africaine et caribéenne.", url: "#" },
  { id: 11, nom: "REUSSITESS Summit", date: "2026-11-01", fin: "2026-11-02", pays: "Guadeloupe 🇬🇵", type: "Business", desc: "Premier sommet entrepreneurial REUSSITESS®971 — Innovation & Excellence Caribéenne.", url: "https://reussitess.fr" },
  { id: 12, nom: "Marché de Noël Créole", date: "2026-12-15", fin: "2026-12-24", pays: "DOM-TOM 🌴", type: "Culture", desc: "Marchés de Noël traditionnels créoles avec artisanat, cuisine et musique.", url: "#" },
]

const TYPES = ['Tous', 'Festival', 'Commémoration', 'Culture', 'Patrimoine UNESCO', 'Business']
const COULEURS = { 'Festival': '#8b5cf6', 'Commémoration': '#ef4444', 'Culture': '#10b981', 'Patrimoine UNESCO': '#f59e0b', 'Business': '#3b82f6' }

export default function Evenements() {
  const [filtre, setFiltre] = useState('Tous')
  const [selected, setSelected] = useState(null)

  const today = new Date()
  const evs = EVENEMENTS
    .filter(e => filtre === 'Tous' || e.type === filtre)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const upcoming = evs.filter(e => new Date(e.date) >= today)
  const past = evs.filter(e => new Date(e.date) < today)

  const formatDate = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const daysLeft = d => Math.ceil((new Date(d) - today) / (1000*60*60*24))

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📅</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            CALENDRIER AFRO-CARIBÉEN
          </h1>
          <p style={{ color: '#94a3b8' }}>Événements culturels, festivals et commémorations de la diaspora</p>
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFiltre(t)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === t ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
                color: filtre === t ? 'white' : '#94a3b8' }}>
              {t}
            </button>
          ))}
        </div>

        {/* Événements à venir */}
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem', fontSize: '1.1rem' }}>🔜 À venir ({upcoming.length})</h2>
          {upcoming.map(e => (
            <div key={e.id} onClick={() => setSelected(selected?.id === e.id ? null : e)}
              style={{ background: selected?.id === e.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected?.id === e.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px', padding: '1.2rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: '1rem', fontWeight: '700' }}>{e.nom}</h3>
                  <p style={{ color: '#10b981', fontSize: '0.8rem', margin: '0.2rem 0' }}>{e.pays} • {formatDate(e.date)}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ background: COULEURS[e.type] || '#10b981', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700' }}>{e.type}</span>
                  <span style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '700' }}>
                    J-{daysLeft(e.date)}
                  </span>
                </div>
              </div>
              {selected?.id === e.id && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{e.desc}</p>
                  {e.date !== e.fin && <p style={{ color: '#475569', fontSize: '0.75rem' }}>📅 Du {formatDate(e.date)} au {formatDate(e.fin)}</p>}
                  {e.url !== '#' && (
                    <a href={e.url} target="_blank" rel="noreferrer"
                      style={{ display: 'inline-block', padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700', marginTop: '0.5rem' }}>
                      🔗 Plus d'infos
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}

          {past.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ color: '#475569', marginBottom: '1rem', fontSize: '1rem' }}>📁 Passés ({past.length})</h2>
              {past.map(e => (
                <div key={e.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.8rem 1rem', marginBottom: '0.5rem', opacity: 0.6 }}>
                  <span style={{ color: '#475569', fontSize: '0.85rem' }}>{e.nom} — {e.pays} — {formatDate(e.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
