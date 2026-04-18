'use client'
import { useState, useEffect } from 'react'

declare global {
  interface Window { ethereum?: any }
}

export default function IAPassport() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
      } catch { alert('Connexion annulée') }
    } else {
      window.open('https://metamask.io/download/', '_blank')
    }
  }

  const [counts, setCounts] = useState({ neuro: 0, sentinelles: 0, quiz: 0, supreme: 0 })

  useEffect(() => {
    const targets = { neuro: 60, sentinelles: 40, quiz: 99, supreme: 1 }
    const steps = 60
    let step = 0
    const timer = setInterval(() => {
      step++
      const ease = 1 - Math.pow(1 - step / steps, 3)
      setCounts({
        neuro: Math.round(targets.neuro * ease),
        sentinelles: Math.round(targets.sentinelles * ease),
        quiz: Math.round(targets.quiz * ease),
        supreme: step >= steps ? 1 : 0,
      })
      if (step >= steps) clearInterval(timer)
    }, 1800 / steps)
    return () => clearInterval(timer)
  }, [])

  const features = [
    {
      icon: '🤖',
      title: 'ÉCOSYSTÈME IA',
      desc: '200 agents IA actifs — 60 Neuro-X spécialisés, 40 Sentinelles, 99 Quiz, 1 IA Suprême. Système développé depuis la Guadeloupe.',
      statsAnimated: [
        { label: 'Neuro-X', count: 'neuro', color: '#10b981' },
        { label: 'Sentinelles', count: 'sentinelles', color: '#f59e0b' },
        { label: 'Quiz', count: 'quiz', color: '#06b6d4' },
        { label: 'IA Suprême', count: 'supreme', color: '#ec4899' },
      ],
      stats: ['60 Neuro-X', '40 Sentinelles', '99 Quiz', '1 IA Suprême'],
      links: [
        { text: '🧠 Explorer Neuro-X', url: 'https://reussitess.fr/neuro-x' },
        { text: '📚 Quiz Gratuits', url: 'https://reussitess.fr/quiz' },
        { text: '💻 Code Source GitHub', url: 'https://github.com/Reussitess30/reussitess-global-nexus' }
      ]
    },
    {
      icon: '🛡️',
      title: 'REUSSSHIELD',
      desc: 'Système de sécurité REUSSSHIELD : surveillance du contrat REUSS, détection anomalies blockchain, protection wallet fondateur.',
      stats: ['Surveillance 24/7', 'Blockchain Polygon', 'Contrat Vérifié', 'Anti-Injection'],
      links: [
        { text: '🔐 Contrat Vérifié PolygonScan', url: 'https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2' },
        { text: '📊 Transactions', url: 'https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2' }
      ]
    },
    {
      icon: '🧠',
      title: 'NEURO-X ANALYTICS',
      desc: '60 agents Neuro-X spécialisés : juridique, business, santé, culture caribéenne, crypto, emploi DOM-TOM, éducation et plus.',
      stats: ['60 Spécialistes', 'Emploi DOM-TOM', 'Culture Caraïbes', 'Business & Droit'],
      links: [
        { text: '🧠 Accéder à Neuro-X', url: 'https://reussitess.fr/neuro-x' },
        { text: '🌍 Bibliothèque Mondiale', url: 'https://reussitess.fr/bibliotheque' },
        { text: '🏆 Passeport de Réussite', url: 'https://reussitess.fr/champions' }
      ]
    },
    {
      icon: '🌍',
      title: 'RÉSEAU 14 PAYS',
      desc: '26 boutiques Amazon actives dans 14 pays sur 5 continents. Influencer ID : fb942837. Expansion en cours.',
      stats: ['26 Boutiques', '14 Pays', '5 Continents', 'Amazon Affilié'],
      links: [
        { text: '🛍️ Boutiques Amazon', url: 'https://reussitess.fr/boutiques' },
        { text: '🌐 Visa Universel', url: 'https://reussitess.fr/visa-universel' },
        { text: '🎓 Opportunities Mondiales', url: 'https://reussitess.fr/champions' }
      ]
    },
    {
      icon: '👑',
      title: 'IA SUPRÊME',
      desc: "L'IA maître orchestre tout l'écosystème REUSSITESS®971 — répond en 8 langues, données temps réel, génération PDF, voix.",
      stats: ['8 Langues', 'PDF Génération', 'Voix Synthèse', 'Temps Réel'],
      links: [
        { text: '💬 Parler à l\'IA', url: 'https://reussitess.fr' },
        { text: '🤖 Révolution IA', url: 'https://reussitess.fr/ma-revolution-ia' },
        { text: '📊 Dashboard Monitoring', url: '/monitoring-ia' }
      ]
    },
    {
      icon: '💎',
      title: 'TOKEN REUSS',
      desc: 'Token REUSS déployé sur Polygon Network. Contrat : 0xB375...EB2. Supply : 1 Milliard. Échangeable sur QuickSwap.',
      stats: ['1B Supply', 'Polygon Network', 'QuickSwap', 'Contrat Vérifié'],
      links: [
        { text: '💰 Acheter sur QuickSwap', url: 'https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137' },
        { text: '📊 PolygonScan', url: 'https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2' },
        { text: '⚛️ Pool de Liquidité', url: 'https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c' },
        { text: '📈 Investir REUSS', url: 'https://reussitess.fr/investir-reuss' }
      ]
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '5rem 2rem 3rem', background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(139,92,246,0.1))' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', background: 'linear-gradient(135deg, #10b981, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
          IA PASSPORT MONDIAL
        </h1>
        <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          REUSSITESS®971 — Terres de Champions 🇬🇵
        </p>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Écosystème IA né en Guadeloupe. 200 agents actifs. 14 pays. Token REUSS sur Polygon. BOUDOUM !
        </p>

        {/* Wallet */}
        {!walletConnected ? (
          <button onClick={connectWallet} style={{
            padding: '1rem 2.5rem', background: 'linear-gradient(135deg, #10b981, #8b5cf6)',
            border: 'none', borderRadius: '50px', color: 'white', fontSize: '1rem',
            fontWeight: 'bold', cursor: 'pointer'
          }}>
            🔗 Connecter MetaMask
          </button>
        ) : (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '20px', padding: '1rem 2rem', display: 'inline-block' }}>
            <span style={{ color: '#10b981' }}>✅ {walletAddress.slice(0,6)}...{walletAddress.slice(-4)} connecté</span>
          </div>
        )}
      </div>

      {/* MONITORING BOUTON */}
      <div style={{ textAlign: 'center', padding: '1rem 2rem 0' }}>
        <a href="/monitoring-ia" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
          padding: '1rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15))',
          border: '2px solid #10b981',
          borderRadius: '50px', color: '#10b981',
          fontSize: '1rem', fontWeight: '900',
          textDecoration: 'none', letterSpacing: '1px',
          boxShadow: '0 0 30px rgba(16,185,129,0.3)',
          transition: 'all 0.3s'
        }}>
          📊 DASHBOARD MONITORING IA →
        </a>
      </div>

      {/* FEATURES */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '900', marginBottom: '3rem', color: '#fff' }}>
          🤖 ARCHITECTURE DU SYSTÈME
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => (
            <div key={i} onClick={() => setSelectedFeature(selectedFeature === i ? null : i)}
              style={{
                background: selectedFeature === i ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedFeature === i ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '20px', padding: '2rem', cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: '#10b981', fontWeight: '900', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>{f.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {f.stats.map((s, j) => (
                  <span key={j} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '0.2rem 0.7rem', fontSize: '0.75rem', color: '#10b981' }}>{s}</span>
                ))}
              </div>
              {selectedFeature === i && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem', animation: 'fadeIn 0.3s ease' }}>
                  {f.links.map((l, k) => (
                    <a key={k} href={l.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem', padding: '0.5rem 1rem', background: 'rgba(139,92,246,0.1)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)' }}>
                      {l.text} →
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 14 PAYS */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fff', marginBottom: '2rem' }}>🌍 14 PAYS PARTENAIRES</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          {['🇬🇵 Guadeloupe', '🇫🇷 France', '🇧🇪 Belgique', '🇮🇹 Italie', '🇩🇪 Allemagne', '🇸🇪 Suède', '🇸🇬 Singapour', '🇦🇺 Australie', '🇪🇸 Espagne', '🇧🇷 Brésil', '🇬🇧 Royaume-Uni', '🇮🇳 Inde', '🇺🇸 États-Unis', '🇨🇦 Canada'].map((c, i) => (
            <span key={i} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '0.6rem 1rem', color: '#10b981', fontWeight: '600' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* INFOS TECHNIQUES */}
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '2rem' }}>
        <div style={{ background: 'rgba(10,10,10,0.9)', border: '2px solid rgba(139,92,246,0.4)', borderRadius: '30px', padding: '3rem 2rem' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '900', marginBottom: '2.5rem' }}>🛠️ INFORMATIONS TECHNIQUES</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', borderLeft: '6px solid #8b5cf6' }}>
              <h3 style={{ color: '#a78bfa', marginBottom: '1rem' }}>1. Infrastructure</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>Next.js sur Vercel, déploiement continu via GitHub. Sécurité A+ SecurityHeaders. PWA enabled.</p>
              <a href="https://github.com/Reussitess30/reussitess-global-nexus" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR LE CODE SOURCE →</a>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', borderLeft: '6px solid #10b981' }}>
              <h3 style={{ color: '#34d399', marginBottom: '1rem' }}>2. Smart Contract</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>Token REUSS déployé sur Polygon. Contrat vérifié et auditable publiquement sur PolygonScan. SIRET: 444699979700031.</p>
              <a href="https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR LE CONTRAT →</a>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', borderLeft: '6px solid #3b82f6' }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '1rem' }}>3. Système 200 IA</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>200 agents IA déployés : 60 Neuro-X, 40 Sentinelles, 99 Quiz, 1 IA Suprême. Rotation 3 clés Groq anti-429.</p>
              <a href="https://reussitess.fr/neuro-x" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR NEURO-X →</a>
            </div>
          </div>

          {/* Conformité */}
          <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(239,68,68,0.05)', borderRadius: '20px', border: '1px solid #ef4444' }}>
            <h3 style={{ color: '#f87171', marginBottom: '1rem' }}>⚖️ CONFORMITÉ RÉGLEMENTAIRE</h3>
            <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Projet en conformité avec <b>EU AI Act</b> et <b>RGPD</b>. Auto-entrepreneur Guadeloupe, SIRET: 444699979700031. Développement transparent — code open source sur GitHub.
            </p>
          </div>

          {/* Roadmap */}
          <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(245,158,11,0.05)', borderRadius: '20px', border: '1px dashed #f59e0b' }}>
            <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>🚀 Roadmap 2026</h3>
            <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
              <b>Q1 2026</b> : Consolidation infrastructure & 200 IA<br/>
              <b>Q2 2026</b> : PDF generator + PWA standalone<br/>
              <b>Q3-Q4 2026</b> : Déploiement progressif 14 pays + MiCA compliance
            </p>
          </div>

          {/* Badges */}
          <div style={{ marginTop: '2rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['✅ Code Open Source', '✅ Contrat Vérifié', '✅ 200 IA Actives', '✅ RGPD Conforme', '✅ Made in Guadeloupe'].map((b, i) => (
              <span key={i} style={{ background: '#1a1a1a', border: '1px solid #333', padding: '0.5rem 1.2rem', borderRadius: '50px', color: '#10b981', fontSize: '0.85rem' }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>REUSSITESS®971</h3>
        <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>POSITIVITÉ À L&apos;INFINI 🎯</p>
        <p style={{ color: '#64748b', fontWeight: 'bold', marginBottom: '2rem' }}>🏁 BOUDOUM ! Innovation Made in Guadeloupe</p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { text: '📊 PolygonScan', url: 'https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2' },
            { text: '💎 QuickSwap', url: 'https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137' },
            { text: '⚛️ Liquidity Pool', url: 'https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c' },
            { text: '💻 GitHub', url: 'https://github.com/Reussitess30/reussitess-global-nexus' },
            { text: '🛍️ Boutiques', url: 'https://reussitess.fr/boutiques' }
          ].map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '1rem' }}>{l.text}</a>
          ))}
        </div>
        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#444' }}>
          SIRET: 444699979700031 | contact: influenceur@reussitess.fr | Tous droits réservés REUSSITESS©
        </p>
      </div>
    </div>
  )
}
