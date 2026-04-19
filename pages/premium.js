/*
 * © REUSSITESS®971 — Tous droits réservés — INPI DSO2026012614
 */
import { useState } from 'react'

export default function Premium() {
  const [loading, setLoading] = useState(false)

  async function subscribe() {
    setLoading(true)
    try {
      const r = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: 'web' })
      })
      const d = await r.json()
      if (d.url) window.open(d.url, '_blank')
      else alert('Erreur paiement, réessaie')
    } catch(e) { alert('Erreur connexion') }
    setLoading(false)
  }

  const modules = [
    { icon: "🌍", titre: "Traducteur Créole IA", rare: false,
      desc: "Traduis entre Français, Anglais et les créoles Guadeloupéen, Martiniquais, Haïtien, Jamaïcain. Prononciation phonétique et notes culturelles.",
      exemple: "An rinmé w anpil = Je t'aime (créole GWA)" },
    { icon: "💰", titre: "Comparateur Transfert Argent", rare: false,
      desc: "Envoie de l'argent aux Caraïbes et en Afrique au meilleur prix. Compare Wise, Western Union, Remitly, PayPal en temps réel. Économise jusqu'à 8% par transfert.",
      exemple: "300€ vers Guadeloupe: Wise 298,50€ vs WU 288€" },
    { icon: "📋", titre: "Générateur CV + Dossier Admin", rare: false,
      desc: "CV professionnel France, Canada, DOM-TOM. Lettre de motivation. Dossier CAF, RSA, APL, logement social — étape par étape.",
      exemple: "CV valorisant l'expérience caribéenne pour le marché français" },
    { icon: "🛂", titre: "Assistant Visa 14 Pays", rare: false,
      desc: "Guide complet visa Canada, USA, UK, Schengen et Caraïbes. Documents, formulaires, délais, frais selon ta nationalité.",
      exemple: "Visa Canada depuis Guadeloupe — liste complète documents" },
    { icon: "🧠", titre: "Coach IA Mémoire Longue", rare: false,
      desc: "Une IA qui se souvient de toi, tes projets, ta situation. Mentor personnel 24h/24 adapté à la diaspora afro-caribéenne.",
      exemple: "L'IA se souvient de ton projet business depuis 3 mois" },
    { icon: "🌿", titre: "Pharmacopée Caribéenne IA", rare: true,
      desc: "200+ plantes médicinales caribéennes avec usages traditionnels, préparations, contre-indications. Connaissance ancestrale numérisée.",
      exemple: "Bois bandé, Siguine, Vétiver — remèdes créoles authentiques" },
    { icon: "📜", titre: "Généalogiste ADN Caribéen", rare: true,
      desc: "Reconstitue ton arbre généalogique caribéen et africain. Identifie tes origines et tes ancêtres parmi 500+ personnalités DOM-TOM.",
      exemple: "Retrouve tes liens avec l'histoire de la Guadeloupe" },
    { icon: "🔮", titre: "Oracle 971 Premium", rare: true,
      desc: "Version avancée de l'Oracle caribéen — numérologie personnalisée, calendrier lunaire créole, analyse de rêves, guidance quimbois.",
      exemple: "Analyse complète de ta date de naissance créole" },
    { icon: "📊", titre: "Analyste Crypto Caribéen", rare: true,
      desc: "Analyse technique du Token REUSS et cryptos caribéennes. Signaux achat/vente, DeFi sur Polygon, stratégies DOM-TOM.",
      exemple: "Signal REUSS/POL + stratégie staking QuickSwap" },
    { icon: "🎙️", titre: "Studio Contenu Créole", rare: true,
      desc: "Génère scripts TikTok, podcasts, posts Instagram en créole et français. Adapté à la culture caribéenne pour maximiser l'engagement diaspora.",
      exemple: "Script TikTok viral en créole guadeloupéen" },
  ]

  const btn = {
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    color: '#000', padding: '15px 50px', borderRadius: '50px',
    border: 'none', fontSize: '1.2rem', fontWeight: '900',
    cursor: 'pointer', boxShadow: '0 10px 30px rgba(255,215,0,0.4)'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a, #1a0a2e)', color: '#fff', fontFamily: 'monospace' }}>
      <div style={{ padding: '15px 20px' }}>
        <a href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', border: '1px solid #333', padding: '6px 16px', borderRadius: '20px' }}>← Accueil</a>
      </div>
      
      <div style={{ textAlign: 'center', padding: '60px 20px 30px' }}>
        <div style={{ fontSize: '3rem' }}>👑</div>
        <h1 style={{ color: '#ffd700', fontSize: '2.5rem', margin: '10px 0' }}>REUSSITESS Premium</h1>
        <p style={{ color: '#888', maxWidth: '600px', margin: '0 auto 10px' }}>L'IA indispensable de la diaspora afro-caribéenne</p>
        <p style={{ color: '#00c853', fontSize: '1.3rem', fontWeight: 'bold' }}>10 modules exclusifs • 4,99€/mois</p>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '20px' }}>Sans engagement • PayPal sécurisé • Annulation à tout moment</p>
        <button onClick={subscribe} disabled={loading} style={btn}>
          {loading ? '⏳ Chargement...' : '💳 Souscrire 4,99€/mois'}
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px 20px 60px' }}>

        <h2 style={{ color: '#00c853', borderBottom: '1px solid #222', paddingBottom: '10px' }}>⚡ 5 Modules Essentiels</h2>
        <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
          {modules.filter(m => !m.rare).map((m, i) => (
            <div key={i} style={{ background: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', display: 'flex', gap: '15px' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>{m.icon}</div>
              <div>
                <h3 style={{ color: '#ffd700', margin: '0 0 8px' }}>{m.titre}</h3>
                <p style={{ color: '#ccc', margin: '0 0 8px', lineHeight: '1.5', fontSize: '0.9rem' }}>{m.desc}</p>
                <div style={{ background: '#1a1a1a', borderLeft: '3px solid #00c853', padding: '6px 10px', fontSize: '0.8rem', color: '#888' }}>💡 {m.exemple}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ color: '#ff6b6b', borderBottom: '1px solid #222', paddingBottom: '10px' }}>🔥 5 Modules Rares — Introuvables Ailleurs</h2>
        <div style={{ display: 'grid', gap: '15px', marginBottom: '40px' }}>
          {modules.filter(m => m.rare).map((m, i) => (
            <div key={i} style={{ background: '#111', border: '1px solid #ff6b6b44', borderRadius: '12px', padding: '20px', display: 'flex', gap: '15px' }}>
              <div style={{ fontSize: '2rem', flexShrink: 0 }}>{m.icon}</div>
              <div>
                <h3 style={{ color: '#ff6b6b', margin: '0 0 8px' }}>{m.titre} <span style={{ background: '#ff6b6b22', color: '#ff6b6b', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>RARE</span></h3>
                <p style={{ color: '#ccc', margin: '0 0 8px', lineHeight: '1.5', fontSize: '0.9rem' }}>{m.desc}</p>
                <div style={{ background: '#1a1a1a', borderLeft: '3px solid #ff6b6b', padding: '6px 10px', fontSize: '0.8rem', color: '#888' }}>💡 {m.exemple}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #111, #1a1a2e)', borderRadius: '20px', padding: '40px', border: '1px solid #ffd70044' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🇬🇵</div>
          <h2 style={{ color: '#ffd700' }}>Rejoins la diaspora qui réussit</h2>
          <p style={{ color: '#888', marginBottom: '5px' }}>50 millions d'afro-caribéens dans le monde. Tu mérites les meilleurs outils.</p>
          <div style={{ fontSize: '2rem', fontWeight: '900', color: '#00c853' }}>4,99€/mois</div>
          <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '20px' }}>Moins d'un café par semaine</p>
          <button onClick={subscribe} disabled={loading} style={btn}>
            {loading ? '⏳...' : '💳 Commencer maintenant'}
          </button>
          <div style={{ marginTop: '20px', padding: '15px', background: '#0a0a0a', borderRadius: '10px', fontSize: '0.75rem', color: '#555', textAlign: 'left' }}>
            <p style={{ margin: '0 0 5px', color: '#888' }}>⚖️ Mentions Légales</p>
            <p style={{ margin: '0' }}>© 2026 REUSSITESS®971 — Propriétaire : Rony Porinus — Auto-entrepreneur Guadeloupe 🇬🇵</p>
            <p style={{ margin: '0' }}>SIRET : 444699979700031 — Protection INPI DSO2026012614</p>
            <p style={{ margin: '0' }}>Abonnement mensuel résiliable à tout moment depuis votre espace PayPal.</p>
            <p style={{ margin: '0' }}>Conformément au droit de rétractation (14 jours) — Contact : influenceur@reussitess.fr</p>
          </div>
        </div>
      </div>
    </div>
  )
}
