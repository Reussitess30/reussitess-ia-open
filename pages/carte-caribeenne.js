/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const LIEUX = [
  { id: 1, nom: "Mémorial ACTe", pays: "Guadeloupe 🇬🇵", type: "Musée", lat: 16.2411, lng: -61.5331, desc: "Centre caribéen d'expressions et de mémoire de la traite et de l'esclavage", url: "https://memorial-acte.fr" },
  { id: 2, nom: "Habitation Clément", pays: "Martinique 🇲🇶", type: "Patrimoine", lat: 14.6037, lng: -61.0722, desc: "Domaine historique et culturel martiniquais", url: "https://www.habitation-clement.fr" },
  { id: 3, nom: "Musée Schoelcher", pays: "Guadeloupe 🇬🇵", type: "Musée", lat: 16.0078, lng: -61.7253, desc: "Dédié à Victor Schoelcher, abolitionniste de l'esclavage", url: "#" },
  { id: 4, nom: "Parc National de la Guadeloupe", pays: "Guadeloupe 🇬🇵", type: "Nature", lat: 16.1719, lng: -61.7083, desc: "Forêt tropicale et La Soufrière, volcan actif", url: "https://www.guadeloupe-parcnational.fr" },
  { id: 5, nom: "Citadelle Laferrière", pays: "Haïti 🇭🇹", type: "Patrimoine UNESCO", lat: 19.5755, lng: -72.2414, desc: "Forteresse symbole de la révolution haïtienne et de la liberté", url: "#" },
  { id: 6, nom: "Île de Gorée", pays: "Sénégal 🇸🇳", type: "Patrimoine UNESCO", lat: 14.6693, lng: -17.3994, desc: "Symbole de la traite négrière, site de mémoire mondial", url: "#" },
  { id: 7, nom: "Maison des Esclaves", pays: "Sénégal 🇸🇳", type: "Musée", lat: 14.6693, lng: -17.3994, desc: "La Porte du Voyage Sans Retour — mémoire de l'esclavage", url: "#" },
  { id: 8, nom: "Robben Island", pays: "Afrique du Sud 🇿🇦", type: "Patrimoine UNESCO", lat: -33.8065, lng: 18.3665, desc: "Prison de Nelson Mandela — symbole de la lutte contre l'apartheid", url: "#" },
  { id: 9, nom: "Jazz à la Villette", pays: "France 🇫🇷", type: "Festival", lat: 48.8937, lng: 2.3930, desc: "Festival de jazz afro-caribéen à Paris", url: "https://jazzalavillette.com" },
  { id: 10, nom: "Carnaval de Trinidad", pays: "Trinidad 🇹🇹", type: "Festival", lat: 10.6918, lng: -61.2225, desc: "Plus grand carnaval caribéen du monde", url: "#" },
  { id: 11, nom: "Bob Marley Museum", pays: "Jamaïque 🇯🇲", type: "Musée", lat: 17.9971, lng: -76.7936, desc: "Maison natale de Bob Marley à Kingston", url: "#" },
  { id: 12, nom: "Fort-de-France", pays: "Martinique 🇲🇶", type: "Ville historique", lat: 14.6037, lng: -61.0722, desc: "Capitale de la Martinique, terre de Césaire et Fanon", url: "#" },
  { id: 13, nom: "Pointe-à-Pitre", pays: "Guadeloupe 🇬🇵", type: "Ville historique", lat: 16.2411, lng: -61.5331, desc: "Capitale économique de la Guadeloupe — Terres de Champions", url: "https://reussitess.fr" },
  { id: 14, nom: "Cayenne", pays: "Guyane 🇬🇫", type: "Ville historique", lat: 4.9224, lng: -52.3135, desc: "Capitale de la Guyane française", url: "#" },
  { id: 15, nom: "Saint-Denis", pays: "Réunion 🇷🇪", type: "Ville historique", lat: -20.8823, lng: 55.4504, desc: "Capitale de l'île de la Réunion", url: "#" },
]

const TYPES = ['Tous', 'Musée', 'Patrimoine', 'Patrimoine UNESCO', 'Festival', 'Nature', 'Ville historique']
const COULEURS = { 'Musée': '#10b981', 'Patrimoine': '#f59e0b', 'Patrimoine UNESCO': '#ef4444', 'Festival': '#8b5cf6', 'Nature': '#22c55e', 'Ville historique': '#3b82f6' }

export default function CarteCaribéenne() {
  const [filtre, setFiltre] = useState('Tous')
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  const lieux = LIEUX.filter(l => 
    (filtre === 'Tous' || l.type === filtre) &&
    (search === '' || l.nom.toLowerCase().includes(search.toLowerCase()) || l.pays.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🗺</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900', marginBottom: '0.5rem' }}>
            CARTE AFRO-CARIBÉENNE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Lieux historiques, culturels et patrimoniaux de la diaspora
          </p>
          <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !
          </p>
        </div>

        {/* Recherche */}
        <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          <input
            type="text"
            placeholder="🔍 Rechercher un lieu, un pays..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '15px', border: '2px solid rgba(16,185,129,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Filtres */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFiltre(t)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === t ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.05)',
                color: filtre === t ? 'white' : '#94a3b8' }}>
              {t} {filtre === t && `(${lieux.length})`}
            </button>
          ))}
        </div>

        {/* Grille des lieux */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {lieux.map(l => (
            <div key={l.id} onClick={() => setSelected(selected?.id === l.id ? null : l)}
              style={{ background: selected?.id === l.id ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected?.id === l.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '16px', padding: '1.2rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ color: '#e2e8f0', fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>{l.nom}</h3>
                <span style={{ background: COULEURS[l.type] || '#10b981', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                  {l.type}
                </span>
              </div>
              <p style={{ color: '#10b981', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{l.pays}</p>
              {selected?.id === l.id && (
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '0.75rem' }}>{l.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {l.url !== '#' && (
                      <a href={l.url} target="_blank" rel="noreferrer"
                        style={{ padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700' }}>
                        🔗 Visiter
                      </a>
                    )}
                    <a href={`https://www.google.com/maps?q=${l.lat},${l.lng}`} target="_blank" rel="noreferrer"
                      style={{ padding: '0.4rem 0.8rem', background: 'rgba(59,130,246,0.2)', color: '#3b82f6', borderRadius: '10px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: '700', border: '1px solid rgba(59,130,246,0.3)' }}>
                      🗺 Google Maps
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {lieux.length === 0 && (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '2rem' }}>Aucun lieu trouvé pour "{search}"</p>
        )}

        {/* Stats */}
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>{LIEUX.length} lieux référencés • Afrique • Caraïbes • Diaspora mondiale</p>
          <p style={{ marginTop: '0.5rem' }}>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '600' }}>← Retour à l'accueil</Link>
        </div>
      </div>
    </Layout>
  )
}
