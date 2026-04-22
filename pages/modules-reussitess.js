import Link from 'next/link'

export default function ModulesReussitess() {
  const modules = [
    { icon: '🧬', nom: 'ADN de Réussite', cmd: 'adn de réussite' },
    { icon: '💼', nom: 'Architecte de Fortune', cmd: 'architecte de fortune' },
    { icon: '🎯', nom: 'Négociateur Caribéen', cmd: 'négociateur caribéen' },
    { icon: '🌐', nom: 'Traducteur de Succès', cmd: 'traducteur de succès' },
    { icon: '🏗', nom: "Bâtisseur d'Empire", cmd: "bâtisseur d'empire" },
    { icon: '🛡', nom: 'Bouclier Juridique', cmd: 'bouclier juridique' },
    { icon: '🧠', nom: 'Mindset Champions', cmd: 'mindset champions' },
    { icon: '🌱', nom: 'Entrepreneur Social', cmd: 'entrepreneur social' },
    { icon: '📡', nom: 'Intelligence Stratégique', cmd: 'intelligence stratégique' },
    { icon: '👑', nom: 'Passeport Excellence', cmd: 'passeport excellence' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', color: '#fff', fontFamily: 'Georgia, serif', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👑</div>
          <h1 style={{ color: '#10b981', fontSize: '2rem', fontWeight: '900' }}>Mes 10 Modules Premium</h1>
          <p style={{ color: '#64748b' }}>Accès illimité — REUSSITESS® Networking Classe 45</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {modules.map((m, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', padding: '1.5rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.icon}</div>
              <div style={{ color: '#e2e8f0', fontWeight: '700', marginBottom: '0.5rem' }}>{m.nom}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Tape dans le chat : <strong style={{ color: '#10b981' }}>{m.cmd}</strong></div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/" style={{ color: '#10b981', textDecoration: 'none' }}>← Retour accueil</Link>
        </div>
      </div>
    </div>
  )
}
