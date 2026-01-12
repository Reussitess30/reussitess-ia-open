'use client'

import { useState, useEffect } from 'react'
import IALiveLog from '../../components/IALiveLog'

export default function IAPassport() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  // CONFIGURATION OFFICIELLE REUSSITESS©
  const TOKEN_ADDR = "0xB37531727fC07c6EED4f97F852A115B428046EB2"
  const POOL_ADDR = "0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c"
  const QUICKSWAP_LINK = `https://dapp.quickswap.exchange/swap/best/ETH/${TOKEN_ADDR}?chainId=137`
  const POOL_LINK = `https://info.quickswap.exchange/#/pair/${POOL_ADDR}`

  const features = [
    { 
      icon: '⚛️', 
      title: 'QUANTUM ECOSYSTEM', 
      desc: `200 IA gèrent ${POOL_ADDR.slice(0,6)}... - Premier pool auto-piloté au monde`,
      stats: ['200 IA Actives', '14 Pays', '$10M Target', 'APY 40-60%'],
      links: [
        { text: '🛡️ Quantum Guardian - Protection des actifs (détection 0.1s)', url: POOL_LINK },
        { text: '📊 Price Stabilizer - Analyse de liquidité par IA', url: POOL_LINK },
        { text: '💰 Yield Generator - Optimisation multi-protocoles DeFi', url: POOL_LINK },
        { text: '🌍 Global Bridge - Transferts 14 pays (Belgique incluse)', url: POOL_LINK },
        { text: '💎 ACHETER MAINTENANT - Pool Liquide', url: QUICKSWAP_LINK }
      ],
      special: 'quantum'
    },
    { 
      icon: '🧠', 
      title: 'AI UNIVERSAL BRAIN', 
      desc: 'Agrégateur de modèles - 1 REUSS pour accéder aux meilleures IA mondiales',
      stats: ['GPT-4o', 'Claude 3.5', 'Gemini 1.5 Pro', 'Llama 3'],
      links: [
        { text: '💬 Super-Chat - Multi-modèles simultanés', url: 'https://chat.openai.com' },
        { text: '🎨 Super-Image - Génération multi-moteurs', url: 'https://midjourney.com' },
        { text: '📊 Super-Data - Analyse prédictive croisée', url: 'https://claude.ai' }
      ]
    },
    { 
      icon: '🌐', 
      title: 'REAL-TIME EARTH TRANSLATOR', 
      desc: 'Traduction instantanée 195 langues - Précision linguistique supérieure',
      stats: ['195 Langues', '500+ Dialectes', 'Temps Réel', '99.8% Précision'],
      links: [
        { text: '🗣️ Live Translation - Traduction instantanée (0.2s)', url: 'https://translate.google.com' },
        { text: '💼 Legal Precision - Validation de documents internationaux', url: 'https://www.lionbridge.com' }
      ]
    },
    { 
      icon: '🔐', 
      title: 'QUANTUM ID BLOCKCHAIN', 
      desc: 'Identité digitale sécurisée - NFT biométrique + protection IA',
      stats: ['NFT ID', 'Biométrie', 'Quantum-Safe', 'Universel'],
      links: [
        { text: '👤 Biometric NFT - Empreinte digitale blockchain', url: 'https://polygon.technology/polygon-id' },
        { text: '🔒 Zero-Knowledge Proof - Authentification privée', url: 'https://worldcoin.org' }
      ],
      special: 'security'
    },
    { 
      icon: '💎', 
      title: 'REUSS ECONOMY', 
      desc: 'La crypto qui valorise l\'usage de l\'IA - Modèle économique circulaire',
      stats: ['Deflation 2%/an', 'Yield 40%', 'Burn Auto', 'Rewards Passifs'],
      links: [
        { text: '💰 Pay-to-Earn - Gagnez des REUSS par l\'usage', url: QUICKSWAP_LINK },
        { text: '🔥 Auto-Burn - 0.5% brûlé par transaction', url: `https://polygonscan.com/token/${TOKEN_ADDR}` }
      ],
      special: 'money'
    },
    { 
      icon: '🏥', 
      title: 'HEALTH OPTIMIZER AI', 
      desc: 'Optimisation du bien-être - IA de suivi de données santé 24/7',
      stats: ['Data Analysis', 'Prévention', 'Monitoring', '24/7'],
      links: [
        { text: '🧬 DNA Optimization - Analyse de profil biologique', url: 'https://www.23andme.com' },
        { text: '🏃 Longevity Plan - Nutrition & science du sport', url: 'https://www.insidetracker.com' }
      ],
      special: 'health'
    },
    { 
      icon: '🚀', 
      title: 'SPACE COLONIZATION DAO', 
      desc: 'Soutenez l\'exploration spatiale - DAO de financement communautaire',
      stats: ['Space NFT', 'DAO Participation', 'Research Support', 'Vision'],
      links: [
        { text: '🌙 Lunar Support - Financement de projets lunaires', url: 'https://www.marssociety.org' },
        { text: '🔴 Mars Colony - Gouvernance décentralisée', url: 'https://www.nasa.gov' }
      ],
      special: 'space'
    },
    {
      icon: '👑',
      title: 'HERITAGE PROTOCOL',
      desc: 'IA de gestion patrimoniale - Sécurisez votre fortune pour 100 ans',
      stats: ['Héritage Auto', 'Zéro Taxe', 'Multi-Génération', 'Privé'],
      links: [
        { text: '📜 Activer le Smart Testament - Transfert automatique', url: QUICKSWAP_LINK },
        { text: '🛡️ Quantum Vault - Coffre-fort indestructible', url: POOL_LINK }
      ],
      special: 'heritage'
    }
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        padding: '4rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float 20s infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'float 15s infinite reverse'
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          
          <div style={{ fontSize: '8rem', marginBottom: '2rem', animation: 'bounce 3s infinite' }}>🌍</div>

          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '1rem 2.5rem',
            borderRadius: '50px',
            marginBottom: '2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5)',
            animation: 'pulse 2s infinite'
          }}>
            🇬🇵 MADE IN GUADELOUPE - TERRES DE CHAMPIONS
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 10vw, 6rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 70%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-3px',
            lineHeight: '1.1'
          }}>
            IA PASSPORT<br/>
            <span style={{ fontSize: '0.6em' }}>RÉVOLUTION MONDIALE</span>
          </h1>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '5rem'
          }}>
            <a href={QUICKSWAP_LINK} target="_blank" rel="noopener noreferrer" style={{ padding: '1.5rem 3rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '50px', fontSize: '1.3rem', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5)' }}>💎 ACHETER REUSS</a>
            <a href={POOL_LINK} target="_blank" rel="noopener noreferrer" style={{ padding: '1.5rem 3rem', background: 'rgba(139, 92, 246, 0.2)', color: 'white', border: '2px solid #8b5cf6', borderRadius: '50px', fontSize: '1.3rem', fontWeight: 'bold', textDecoration: 'none' }}>⚛️ QUANTUM POOL</a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedFeature(selectedFeature === i ? null : i)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: selectedFeature === i ? '2px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s'
                }}>
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '1.5rem' }}>{feature.desc}</p>
                {selectedFeature === i && (
                  <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                    {feature.links.map((link, idx) => (
                      <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: '#10b981', padding: '10px 0', textDecoration: 'none', fontWeight: 'bold' }}>→ {link.text}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '3rem 2rem',
            marginBottom: '5rem'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', marginBottom: '2rem' }}>🌍 EXPANSION 14 PAYS PARTENAIRES</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
              {['🇬🇵 Guadeloupe', '🇫🇷 France', '🇧🇪 Belgique', '🇮🇹 Italie', '🇩🇪 Allemagne', '🇸🇪 Suède', '🇸🇬 Singapour', '🇦🇺 Australie', '🇪🇸 Espagne', '🇧🇷 Brésil', '🇮🇳 Inde', '🇳🇿 Nouvelle-Zélande', '🇺🇸 États-Unis', '🇨🇦 Canada'].map((country, i) => (
                <div key={i} style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981', fontWeight: '600', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{country}</div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '4rem', padding: '4rem 2rem', background: 'rgba(10, 10, 10, 0.9)', border: '2px solid rgba(139, 92, 246, 0.4)', borderRadius: '40px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '3rem', textAlign: 'center' }}>⚖️ PROTECTION RÉGLEMENTAIRE</h2>
            <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '1.1rem' }}>
              Conformité <b>EU AI Act</b>, <b>RGPD</b> et <b>ISO/IEC 42001</b>. 
              Le projet Reussitess© est sécurisé juridiquement pour les 14 pays partenaires.
            </p>
          </div>

          <footer style={{ marginTop: '6rem', paddingTop: '3rem', borderTop: '2px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'white' }}>REUSSITESS®971</h3>
            <div style={{ border: "1px solid #10b981", padding: "10px", borderRadius: "10px", display: "inline-block", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.7rem", color: "#10b981", margin: 0 }}>📜 CERTIFICAT DE PROPRIÉTÉ ÉMISE PAR IA</p>
              <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>PROPRIÉTAIRE : 0x69f42aa645a43a84e1143d416a4c81a88df01549</p>
            </div>
            <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 'bold' }}>POSITIVITÉ À L'INFINI 🎯</p>
            <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#444' }}>Propriété : 0x69f42aa645a43a84e1143d416a4c81a88df01549 | Contrat : {TOKEN_ADDR}</p>
          </footer>
        </div>
      </div>
      <style jsx>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
      `}</style>
    </div>
  )
}
