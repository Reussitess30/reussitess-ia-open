/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const STATIONS = [
  { id: 1, nom: "RCI Guadeloupe", pays: "Guadeloupe 🇬🇵", genre: "Généraliste", emoji: "📻", url: "https://rci.fm/guadeloupe", web: true, desc: "Radio Caraïbes International — Actualités, musique, débats" },
  { id: 2, nom: "Bel Radio", pays: "Guadeloupe 🇬🇵", genre: "Zouk", emoji: "🎵", url: "https://belradio.ice.infomaniak.ch/belradioguadeloupe-mp3-128.mp3", web: false, desc: "Zouk, Kompa, R&B caribéen — La légende musicale des Antilles" },
  { id: 3, nom: "La 1ère Martinique", pays: "Martinique 🇲🇶", genre: "Généraliste", emoji: "📻", url: "https://la1ere.francetvinfo.fr/martinique", web: true, desc: "Radio France Outre-mer Martinique — Infos et culture" },
  { id: 4, nom: "RFI Monde", pays: "Monde 🌍", genre: "International", emoji: "🌍", url: "https://rfimonde.ice.infomaniak.ch/rfimonde-mp3-128.mp3", web: false, desc: "Radio France Internationale — Voix du monde francophone" },
  { id: 5, nom: "Africa Radio", pays: "Afrique 🌍", genre: "Afrobeat", emoji: "🎶", url: "https://africaRadio.ice.infomaniak.ch/africa-radio-mp3-128.mp3", web: false, desc: "Afrobeat, Afropop, Reggae — La voix de l'Afrique" },
  { id: 6, nom: "REUSSITESS FM", pays: "Guadeloupe 🇬🇵", genre: "Entrepreneuriat", emoji: "🤖", url: "#", desc: "🚀 Coming Soon — Radio entrepreneuriale caribéenne 24/7" },
]

export default function Radio() {
  const [playing, setPlaying] = useState(null)
  const [filtre, setFiltre] = useState('Tous')
  const audioRef = useRef(null)

  const genres = ['Tous', 'Généraliste', 'Zouk', 'Afrobeat', 'International', 'Entrepreneuriat']
  const stations = STATIONS.filter(s => filtre === 'Tous' || s.genre === filtre)

  const play = (station) => {
    if (station.url === "#") return
    if (station.web || (!station.url.endsWith(".mp3") && !station.url.includes("infomaniak"))) { window.open(station.url, "_blank"); setPlaying(station); return }
    if (playing?.id === station.id) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    setPlaying(station)
    if (audioRef.current) {
      audioRef.current.src = station.url
      audioRef.current.play().catch(() => {})
    }
  }

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>📻</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>RADIO CARIBÉENNE</h1>
          <p style={{ color: '#94a3b8' }}>Stations afro-caribéennes en direct — Zouk • Gwoka • Afrobeat • Infos</p>
        </div>

        {playing && (
          <div style={{ maxWidth: '600px', margin: '0 auto 2rem', background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(59,130,246,0.2))', border: '1px solid #10b981', borderRadius: '20px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{playing.emoji}</div>
            <h3 style={{ color: '#10b981', fontWeight: '900' }}>🔴 EN DIRECT — {playing.nom}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{playing.pays} • {playing.genre}</p>
            <audio ref={audioRef} controls style={{ width: '100%', marginTop: '1rem', borderRadius: '10px' }} />
            <button onClick={() => { audioRef.current?.pause(); setPlaying(null) }}
              style={{ marginTop: '0.75rem', padding: '0.5rem 1.5rem', background: '#ef4444', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '700' }}>
              ⏹ Stop
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {genres.map(g => (
            <button key={g} onClick={() => setFiltre(g)}
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600',
                background: filtre === g ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : 'rgba(255,255,255,0.05)',
                color: filtre === g ? 'white' : '#94a3b8' }}>
              {g}
            </button>
          ))}
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {stations.map(s => (
            <div key={s.id} style={{ background: playing?.id === s.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)', border: `1px solid ${playing?.id === s.id ? '#10b981' : 'rgba(255,255,255,0.1)'}`, borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{s.emoji}</div>
              <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.3rem' }}>{s.nom}</h3>
              <p style={{ color: '#8b5cf6', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{s.pays}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1rem', lineHeight: '1.5' }}>{s.desc}</p>
              <button onClick={() => play(s)}
                style={{ width: '100%', padding: '0.7rem', background: s.url === '#' ? 'rgba(255,255,255,0.05)' : playing?.id === s.id ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: s.url === '#' ? 'not-allowed' : 'pointer', fontSize: '0.85rem', opacity: s.url === '#' ? 0.5 : 1 }}>
                {s.url === '#' ? '🔜 Bientôt' : playing?.id === s.id ? '⏹ Stop' : '▶ Écouter'}
              </button>
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
