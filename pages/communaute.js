import { useEffect } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

const TOPICS = [
  { id: 1, titre: "💼 Entrepreneuriat Caribéen", desc: "Partage tes projets, questions et succès business aux Antilles" },
  { id: 2, titre: "🌴 Culture & Identité", desc: "Gwoka, créole, traditions — célébrons notre héritage" },
  { id: 3, titre: "💎 Token REUSS & Crypto", desc: "Discussion blockchain, investissement et Web3 caribéen" },
  { id: 4, titre: "🎓 Formation & Bourses", desc: "Partage des opportunités de formation et bourses disponibles" },
  { id: 5, titre: "💼 Emploi & Carrière", desc: "Offres, conseils CV et opportunités professionnelles DOM-TOM" },
  { id: 6, titre: "🚀 Innovation & IA", desc: "Intelligence artificielle, tech et innovation pour la Caraïbe" },
]

function DisqusComments({ topic }) {
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.disqus_config = function() {
      this.page.url = `https://reussitess.fr/communaute#${topic.id}`
      this.page.identifier = `topic-${topic.id}`
      this.page.title = topic.titre
    }
    const d = document
    const s = d.createElement('script')
    s.src = 'https://reussitess971.disqus.com/embed.js'
    s.setAttribute('data-timestamp', +new Date())
    ;(d.head || d.body).appendChild(s)
    return () => { delete window.DISQUS }
  }, [topic.id])

  return <div id="disqus_thread" style={{ marginTop: '1rem' }} />
}

export default function Communaute() {
  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🤝</div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: '900' }}>COMMUNAUTÉ REUSSITESS</h1>
          <p style={{ color: '#94a3b8' }}>Réseau de la diaspora afro-caribéenne — Échanges & Entraide</p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {TOPICS.map(t => (
            <a key={t.id} href={`https://reussitess.fr/communaute/${t.id}`}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '16px', padding: '1.5rem', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>
              <h3 style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem' }}>{t.titre}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>{t.desc}</p>
              <p style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.75rem', fontWeight: '600' }}>Rejoindre la discussion →</p>
            </a>
          ))}
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '2rem' }}>
          <h2 style={{ color: '#10b981', marginBottom: '1rem' }}>💬 Discussion Générale</h2>
          <DisqusComments topic={{ id: 'general', titre: 'Discussion Générale REUSSITESS' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
          <p>REUSSITESS®971 — Guadeloupe 🇬🇵 Boudoum !</p>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour</Link>
        </div>
      </div>
    </Layout>
  )
}
