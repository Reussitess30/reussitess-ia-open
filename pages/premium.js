import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Premium() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function subscribe() {
    setLoading(true)
    const res = await fetch('/api/paypal/create-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: 'web' })
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else setLoading(false)
  }

  const modules = [
    {
      icon: '🌍',
      title: 'Traducteur Créole IA',
      desc: 'Traduis instantanément entre Français, Anglais et les créoles Guadeloupéen, Martiniquais, Haïtien, Jamaïcain. Avec prononciation et notes culturelles.',
      exemple: '"An rinmé w anpil" = Je t'aime beaucoup (créole GWA)'
    },
    {
      icon: '💰',
      title: 'Comparateur Transfert Argent',
      desc: 'Envoie de l'argent aux Caraïbes et en Afrique au meilleur prix. Compare Wise, Western Union, Remitly, PayPal en temps réel. Économise jusqu'à 8% par transfert.',
      exemple: '300€ vers Guadeloupe → Wise: 298,50€ reçus vs WU: 288€'
    },
    {
      icon: '📋',
      title: 'Générateur CV + Dossier Admin',
      desc: 'CV professionnel adapté France, Canada, DOM-TOM. Lettre de motivation. Dossier CAF, RSA, APL, logement social — toutes les démarches expliquées étape par étape.',
      exemple: 'CV valorisant l'expérience caribéenne pour le marché français'
    },
    {
      icon: '🛂',
      title: 'Assistant Visa 14 Pays',
      desc: 'Guide complet pour visa Canada, USA, UK, Schengen et tous les pays caribéens. Documents requis, formulaires, délais, frais selon ta nationalité.',
      exemple: 'Visa Canada depuis Guadeloupe → liste complète des documents'
    },
    {
      icon: '🧠',
      title: 'Coach IA Mémoire Longue',
      desc: 'Une IA qui se souvient de toi, tes projets, ta situation. Comme un mentor personnel disponible 24h/24, culturellement adapté à la diaspora afro-caribéenne.',
      exemple: 'L'IA se souvient de ton projet business depuis 3 mois'
    }
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a0a', color:'#fff', fontFamily:'monospace' }}>
      
      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)', padding:'60px 20px', textAlign:'center', borderBottom:'1px solid #222' }}>
        <div style={{ fontSize:'3rem', marginBottom:'10px' }}>👑</div>
        <h1 style={{ color:'#ffd700', fontSize:'2.5rem', margin:'0 0 10px' }}>REUSSITESS Premium</h1>
        <p style={{ color:'#888', fontSize:'1.1rem', maxWidth:'600px', margin:'0 auto 30px' }}>
          L'IA indispensable de la diaspora afro-caribéenne. 5 outils exclusifs que personne d'autre ne propose.
        </p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'20px', flexWrap:'wrap' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'2.5rem', fontWeight:'900', color:'#00c853' }}>4,99€</div>
            <div style={{ color:'#888', fontSize:'0.8rem' }}>/mois • Sans engagement</div>
          </div>
          <button
            onClick={subscribe}
            disabled={loading}
            style={{ background:'linear-gradient(135deg, #ffd700, #ff8c00)', color:'#000', padding:'15px 40px', borderRadius:'50px', border:'none', fontSize:'1.2rem', fontWeight:'900', cursor:'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '⏳ Chargement...' : '💳 Souscrire maintenant'}
          </button>
        </div>
      </div>

      {/* 5 MODULES */}
      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'60px 20px' }}>
        <h2 style={{ textAlign:'center', color:'#ffd700', marginBottom:'40px' }}>🚀 Tes 5 Outils Exclusifs</h2>
        <div style={{ display:'grid', gap:'20px' }}>
          {modules.map((m, i) => (
            <div key={i} style={{ background:'#111', border:'1px solid #333', borderRadius:'16px', padding:'25px', display:'flex', gap:'20px', alignItems:'flex-start' }}>
              <div style={{ fontSize:'2.5rem', flexShrink:0 }}>{m.icon}</div>
              <div>
                <h3 style={{ color:'#ffd700', margin:'0 0 8px' }}>{m.title}</h3>
                <p style={{ color:'#ccc', margin:'0 0 10px', lineHeight:'1.6' }}>{m.desc}</p>
                <div style={{ background:'#1a1a1a', borderLeft:'3px solid #00c853', padding:'8px 12px', borderRadius:'4px', color:'#888', fontSize:'0.85rem' }}>
                  💡 {m.exemple}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BAS */}
        <div style={{ textAlign:'center', marginTop:'60px', padding:'40px', background:'linear-gradient(135deg, #111, #1a1a2e)', borderRadius:'20px', border:'1px solid #333' }}>
          <div style={{ fontSize:'2rem', marginBottom:'10px' }}>🇬🇵</div>
          <h2 style={{ color:'#ffd700' }}>Rejoins la diaspora qui réussit</h2>
          <p style={{ color:'#888', marginBottom:'25px' }}>50 millions d'afro-caribéens dans le monde. Tu mérites les meilleurs outils.</p>
          <button
            onClick={subscribe}
            disabled={loading}
            style={{ background:'linear-gradient(135deg, #ffd700, #ff8c00)', color:'#000', padding:'15px 50px', borderRadius:'50px', border:'none', fontSize:'1.2rem', fontWeight:'900', cursor:'pointer' }}
          >
            {loading ? '⏳...' : '💳 Commencer 4,99€/mois'}
          </button>
          <p style={{ color:'#555', fontSize:'0.8rem', marginTop:'15px' }}>Sans engagement • Annulation à tout moment • PayPal sécurisé</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign:'center', padding:'20px', borderTop:'1px solid #111', color:'#555', fontSize:'0.8rem' }}>
        © 2026 REUSSITESS®971 — PORINUS Rony — INPI DSO2026012614
      </div>
    </div>
  )
}
