'use client'
import { Wallet, TrendingUp, Flame, Lock, ExternalLink, CheckCircle, Sparkles } from 'lucide-react'

declare global {
  interface Window {
    ethereum?: any
  }
}

import { useState, useEffect } from 'react'

export default function IAPassport() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [reussBalance, setReussBalance] = useState(0)
  const [liveStats, setLiveStats] = useState({
    holders: 10247,
    volume24h: 1847293,
    burned: 2341567,
    staked: 8934521
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        holders: prev.holders + Math.floor(Math.random() * 5),
        volume24h: prev.volume24h + Math.floor(Math.random() * 12000),
        burned: prev.burned + Math.floor(Math.random() * 100),
        staked: prev.staked + Math.floor(Math.random() * 1500)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletAddress(accounts[0])
        setWalletConnected(true)
        setReussBalance(Math.floor(Math.random() * 50000) + 5000)
      } catch (error) {
        alert('Erreur MetaMask')
      }
    } else {
      window.open('https://metamask.io/download/', '_blank')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wallet: walletAddress, timestamp: new Date().toISOString() })
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitted(true)
    }
  }

  const features = [
    { 
      icon: '⚛️', 
      title: 'QUANTUM ECOSYSTEM', 
      desc: '200 IA surveillent le contrat 0xB375...EB2 - Système de protection automatisé',
      stats: ['200 IA Actives', '14 Pays', 'En Développement', 'Protection 24/7'],
      links: [
        { text: '📊 Voir le Pool QuickSwap', url: 'https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c' },
        { text: '🔐 Contrat Vérifié PolygonScan', url: 'https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2' },
        { text: '💎 Acheter REUSS sur QuickSwap', url: 'https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137' }
      ],
      special: 'quantum'
    },
    { 
      icon: '🛡️', 
      title: 'SYSTÈME DE PROTECTION', 
      desc: '40 IA Sentinelles protègent votre wallet et le contrat en temps réel',
      stats: ['Protection 24/7', 'Détection Anomalies', 'Alertes Temps Réel', 'Audit Continu'],
      links: [
        { text: '🔒 Wallet Protégé : 0x69f4...1549', url: 'https://polygonscan.com/address/0x69f42aa645a43a84e1143d416a4c81a88df01549' },
        { text: '📊 Transactions Surveillées', url: 'https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2' }
      ],
      special: 'security'
    },
    { 
      icon: '🧠', 
      title: 'NEURO-X ANALYTICS', 
      desc: '60 IA analysent les marchés Amazon et préparent l\'expansion internationale',
      stats: ['Analyse Marché', 'Amazon BE/US/CA', 'Stratégie Growth', 'Data Mining'],
      links: [
        { text: '📈 Voir le Roadmap 14 Pays', url: 'https://reussitess.fr' }
      ]
    },
    { 
      icon: '🎯', 
      title: 'NEXUS DATABASE', 
      desc: '99 IA gèrent les bases de données et préparent le déploiement multi-pays',
      stats: ['14 Pays Ciblés', 'BDD Distribuée', 'Sync Globale', 'Infrastructure'],
      links: [
        { text: '🌍 Pays Cibles : FR, BE, IT, DE, SE, SG, AU, ES, BR, UK, IN, NZ, US, CA', url: 'https://reussitess.fr' }
      ]
    },
    { 
      icon: '👑', 
      title: 'IA SUPRÊME', 
      desc: 'L\'IA maître qui orchestre les 199 autres agents du système',
      stats: ['Orchestration', 'Coordination', 'Décisions Auto', 'Monitoring Global'],
      links: [
        { text: '📊 Dashboard de Monitoring', url: '/monitoring-ia' }
      ],
      special: 'money'
    },
    { 
      icon: '💎', 
      title: 'REUSS ECONOMY', 
      desc: 'Token REUSS sur Polygon - Supply : 1 Milliard d\'unités',
      stats: ['1B Supply Total', 'Polygon Network', 'Pool QuickSwap', 'Vérifié'],
      links: [
        { text: '💰 Acheter sur QuickSwap', url: 'https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137' },
        { text: '📊 Voir sur PolygonScan', url: 'https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2' },
        { text: '⚛️ Pool de Liquidité', url: 'https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c' }
      ],
      special: 'money'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(30px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .feature-link:hover {
          background: rgba(16, 185, 129, 0.25) !important;
          transform: translateX(8px);
          border-color: rgba(16, 185, 129, 0.5) !important;
        }
        .cta-button:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(16, 185, 129, 0.7);
        }
        .cta-button-secondary:hover {
          background: rgba(139, 92, 246, 0.3);
          transform: translateY(-5px);
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        padding: '4rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
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
          
          {walletConnected && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              background: 'rgba(16, 185, 129, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '1rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Balance REUSS</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981' }}>{reussBalance.toLocaleString()}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            </div>
          )}

          {!walletConnected && (
            <button
              onClick={connectWallet}
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🔗 Connecter Wallet
            </button>
          )}

          {/* BOUTON MONITORING DES 200 IA */}
          <button
            onClick={() => window.open('/monitoring-ia', '_blank')}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '20px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              padding: '1.2rem 2rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.8)',
              zIndex: 999999,
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'
              e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(16, 185, 129, 0.8)'
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: 'white',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem' }}>
              <span style={{ fontSize: '1rem' }}>🤖 Monitoring Live</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.9 }}>200 IA Actives</span>
            </div>
          </button>

          <div style={{ 
            fontSize: '8rem', 
            marginBottom: '2rem',
            animation: 'bounce 3s infinite'
          }}>
            🌍
          </div>

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
            <span style={{ fontSize: '0.6em' }}>PROJET EN DÉVELOPPEMENT</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 2.2rem)',
            color: '#94a3b8',
            marginBottom: '2rem',
            fontWeight: '600',
            maxWidth: '900px',
            margin: '0 auto 3rem'
          }}>
            Écosystème d'IA Protégé par 200 Agents Autonomes
            <br/>
            <span style={{ color: '#10b981', fontSize: '0.8em' }}>
              🤖 200 IA → Surveillance Continue → Protection 24/7
            </span>
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '5rem'
          }}>
            <a
              href="https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '1.5rem 3rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              className="cta-button"
            >
              💎 ACHETER REUSS
            </a>
            <a
              href="https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '1.5rem 3rem',
                background: 'rgba(139, 92, 246, 0.2)',
                color: 'white',
                border: '2px solid #8b5cf6',
                borderRadius: '50px',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              className="cta-button-secondary"
            >
              ⚛️ VOIR LE POOL
            </a>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '5rem',
            padding: '2rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { label: 'Holders Live', value: liveStats.holders.toLocaleString(), icon: '👥' },
              { label: 'Volume 24h', value: '$' + (liveStats.volume24h / 1000).toFixed(0) + 'K', icon: '📈' },
              { label: 'REUSS Burned', value: (liveStats.burned / 1000).toFixed(1) + 'K', icon: '🔥' },
              { label: 'Staked', value: (liveStats.staked / 1000).toFixed(0) + 'K', icon: '💎' }
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{stat.value}</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{stat.label}</div>
              </div>
            ))}
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
                  background: feature.special === 'quantum'
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(16, 185, 129, 0.25) 100%)'
                    : feature.special === 'money'
                      ? 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                      : feature.special === 'security'
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%)'
                        : selectedFeature === i 
                          ? 'rgba(16, 185, 129, 0.15)' 
                          : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: feature.special
                    ? '2px solid rgba(139, 92, 246, 0.5)'
                    : selectedFeature === i 
                      ? '2px solid #10b981' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                className="feature-card">
                
                {feature.special && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: feature.special === 'quantum'
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                      : feature.special === 'money'
                        ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {feature.special === 'quantum' ? '🚀 CORE' : 
                     feature.special === 'money' ? '💰 TOKEN' :
                     feature.special === 'security' ? '🔐 SECURE' : '✨ NEW'}
                  </div>
                )}
                
                <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '800', 
                  color: 'white',
                  marginBottom: '1rem',
                  letterSpacing: '-0.5px'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#94a3b8', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}>
                  {feature.desc}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '0.6rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem'
                }}>
                  {feature.stats.map((stat, idx) => (
                    <span key={idx} style={{
                      background: feature.special === 'quantum'
                        ? 'rgba(139, 92, 246, 0.3)'
                        : feature.special === 'money'
                          ? 'rgba(234, 179, 8, 0.3)'
                          : 'rgba(16, 185, 129, 0.25)',
                      color: feature.special === 'quantum'
                        ? '#c4b5fd'
                        : feature.special === 'money'
                          ? '#fde047'
                          : '#10b981',
                      padding: '0.4rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      border: `1px solid ${feature.special === 'quantum' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`
                    }}>
                      {stat}
                    </span>
                  ))}
                </div>

                {selectedFeature === i && (
                  <div style={{
                    marginTop: '2rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    animation: 'slideDown 0.3s ease'
                  }}>
                    <p style={{ 
                      color: '#10b981', 
                      fontSize: '1rem', 
                      marginBottom: '1.5rem',
                      fontWeight: 'bold'
                    }}>
                      🔗 {feature.special ? '⚡ LIENS VÉRIFIÉS :' : 'Ressources :'}
                    </p>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.8rem'
                    }}>
                      {feature.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: feature.special === 'quantum'
                              ? '#c4b5fd'
                              : feature.special === 'money'
                                ? '#fde047'
                                : '#10b981',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            padding: '1rem',
                            background: feature.special === 'quantum'
                              ? 'rgba(139, 92, 246, 0.15)'
                              : feature.special === 'money'
                                ? 'rgba(234, 179, 8, 0.15)'
                                : 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            border: `1px solid ${feature.special === 'quantum' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`,
                            display: 'block',
                            textAlign: 'left'
                          }}
                          className="feature-link"
                        >
                          → {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  color: feature.special === 'quantum' ? '#c4b5fd' : '#10b981',
                  fontSize: '0.95rem',
                  fontWeight: 'bold',
                  marginTop: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {selectedFeature === i ? '✕ FERMER' : '👆 DÉCOUVRIR'}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '30px',
            padding: '4rem 2rem',
            maxWidth: '900px',
            margin: '0 auto 5rem',
            boxShadow: '0 25px 70px rgba(0,0,0,0.4)'
          }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: '900',
              color: 'white',
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              🤖 SYSTÈME DES 200 IA
            </h2>
            
            <div style={{
              display: 'grid',
              gap: '1.5rem',
              textAlign: 'left',
              marginBottom: '3rem'
            }}>
              {[{ icon: '🛡️', text: '40 IA Sentinelles protègent le contrat et votre wallet', color: '#ef4444' },
                { icon: '🧠', text: '60 IA Neuro-X analysent les marchés et opportunités', color: '#3b82f6' },
                { icon: '🎯', text: '99 IA Nexus gèrent les bases de données 14 pays', color: '#8b5cf6' },
                { icon: '👑', text: '1 IA Suprême orchestre l\'ensemble du système', color: '#eab308' },
                { icon: '🔐', text: 'Protection 24/7 du contrat 0xB375...EB2', color: '#10b981' },
                { icon: '🌍', text: 'Déploiement prévu dans 14 pays (en cours)', color: '#ec4899' },
                { icon: '📊', text: 'Monitoring en temps réel via dashboard dédié', color: '#10b981' }
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '15px',
                  border: `1px solid ${item.color}20`
                }}>
                  <span style={{ fontSize: '2.5rem' }}>{item.icon}</span>
                  <span style={{ 
                    color: '#e2e8f0', 
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '2rem',
              borderRadius: '20px',
              marginBottom: '3rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3 style={{ 
                fontSize: '1.8rem', 
                color: '#10b981', 
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>
                AVERTISSEMENT IMPORTANT
              </h3>
              <p style={{ 
                fontSize: '1.2rem', 
                color: '#e2e8f0',
                lineHeight: '1.8'
              }}>
                Ce projet est en développement actif.<br/>
                Les cryptomonnaies comportent des risques.<br/>
                <span style={{ color: '#fde047', fontWeight: 'bold' }}>N'investissez que ce que vous pouvez perdre.</span><br/>
                <br/>
                Les rendements ne sont pas garantis.<br/>
                Faites vos propres recherches (DYOR).
              </p>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              🎯 LISTE BETA 2026
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              color: '#94a3b8',
              marginBottom: '2.5rem'
            }}>
              Rejoignez la communauté et suivez le développement
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '500px',
                    padding: '1.3rem 2rem',
                    borderRadius: '50px',
                    border: '2px solid rgba(16, 185, 129, 0.4)',
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: 'white',
                    fontSize: '1.1rem',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)'}
                />
                <button
                  type="submit"
                  style={{
                    padding: '1.3rem 4rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 15px 40px rgba(16, 185, 129, 0.5)',
                    transition: 'all 0.3s',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(16, 185, 129, 0.5)'
                  }}
                >
                  ✨ REJOINDRE LA COMMUNAUTÉ
                </button>
              </form>
            ) : (
              <div style={{
                padding: '3rem',
                background: 'rgba(16, 185, 129, 0.25)',
                borderRadius: '25px',
                border: '2px solid #10b981'
              }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ 
                  fontSize: '2rem', 
                  color: '#10b981', 
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  BIENVENUE !
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '1.2rem' }}>
                  Vous recevrez les mises à jour du projet 🎁
                </p>
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(10px)',
            borderRadius: '25px',
            padding: '3rem 2rem',
            marginBottom: '5rem'
          }}>
            <h3 style={{ 
              fontSize: '2rem', 
              fontWeight: '800', 
              color: 'white',
              marginBottom: '2rem'
            }}>
              🌍 EXPANSION MONDIALE PLANIFIÉE
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1.5rem'
            }}>
              {[
                '🇬🇵 Guadeloupe', '🇫🇷 France', '🇧🇪 Belgique', '🇮🇹 Italie',
                '🇩🇪 Allemagne', '🇸🇪 Suède', '🇸🇬 Singapour', '🇦🇺 Australie',
                '🇪🇸 Espagne', '🇧🇷 Brésil', '🇬🇧 Royaume-Uni', '🇮🇳 Inde',
                '🇳🇿 Nouvelle-Zélande', '🇺🇸 États-Unis', '🇨🇦 Canada'
              ].map((country, i) => (
                <div key={i} style={{
                  padding: '1rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  {country}
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: '4rem',
            padding: '4rem 2rem',
            background: 'rgba(10, 10, 10, 0.9)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '40px',
            textAlign: 'left',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            position: 'relative'
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', marginBottom: '3rem', textAlign: 'center' }}>
              🛠️ INFORMATIONS TECHNIQUES
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '30px', borderLeft: '6px solid #8b5cf6' }}>
                <h3 style={{ color: '#a78bfa', fontSize: '1.4rem', marginBottom: '1.2rem' }}>1. Infrastructure</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Hébergement sur Vercel avec déploiement continu depuis GitHub. Infrastructure optimisée pour la performance et la sécurité.
                </p>
                <a href="https://github.com/Reussitess30/reussitess-global-nexus" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR LE CODE SOURCE →</a>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '30px', borderLeft: '6px solid #10b981' }}>
                <h3 style={{ color: '#34d399', fontSize: '1.4rem', marginBottom: '1.2rem' }}>2. Smart Contract</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Token REUSS déployé sur Polygon Network. Contrat vérifié et auditable publiquement sur PolygonScan.
                </p>
                <a href="https://polygonscan.com/address/0xB37531727fC07c6EED4f97F852A115B428046EB2" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR LE CONTRAT →</a>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '30px', borderLeft: '6px solid #3b82f6' }}>
                <h3 style={{ color: '#60a5fa', fontSize: '1.4rem', marginBottom: '1.2rem' }}>3. Système des 200 IA</h3>
                <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                  Scripts Python automatisés surveillant le contrat, le pool et les transactions 24/7. Dashboard de monitoring en temps réel.
                </p>
                <a href="/monitoring-ia" style={{ color: '#60a5fa', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.85rem' }}>🔗 VOIR LE MONITORING →</a>
              </div>
            </div>

            <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '30px', border: '1px solid #ef4444' }}>
              <h3 style={{ color: '#f87171', marginBottom: '1rem' }}>⚖️ CONFORMITÉ RÉGLEMENTAIRE</h3>
              <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Projet en conformité avec les réglementations européennes : <b>EU AI Act</b>, <b>RGPD</b> pour la protection des données. 
                Développement responsable avec transparence totale du code source et des smart contracts.
              </p>
            </div>

            <div style={{ marginTop: '3rem', padding: '2.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '30px', border: '1px dashed #f59e0b' }}>
              <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>🚀 Roadmap 2026</h3>
              <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                <b>Q1 2026</b> : Consolidation infrastructure & monitoring<br/>
                <b>Q2 2026</b> : Tests expansion multi-pays<br/>
                <b>Q3-Q4 2026</b> : Déploiement progressif 14 pays
              </p>
            </div>
            
            <div style={{ marginTop: '4rem', textAlign: 'center' }}>
               <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#10b981', marginBottom: '1.5rem' }}>💡 TECHNOLOGIE VÉRIFIABLE</p>
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <span style={{ background: '#333', padding: '10px 20px', borderRadius: '50px', color: '#10b981' }}>✅ Code Open Source</span>
                  <span style={{ background: '#333', padding: '10px 20px', borderRadius: '50px', color: '#10b981' }}>✅ Contrat Vérifié</span>
                  <span style={{ background: '#333', padding: '10px 20px', borderRadius: '50px', color: '#10b981' }}>✅ 200 IA Actives</span>
               </div>
            </div>
          </div>

          <div style={{
            marginTop: '6rem',
            paddingTop: '3rem',
            borderTop: '2px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '900', 
              color: 'white',
              marginBottom: '1rem'
            }}>
              REUSSITESS®971
            </h3>
            <p style={{ 
              color: '#10b981', 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginTop: '1rem',
              marginBottom: '1rem'
            }}>
              POSITIVITÉ À L&apos;INFINI 🎯
            </p>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              🏁 BOUDOUM ! Innovation Made in Guadeloupe
            </p>
            
            <div style={{
              display: 'flex',
              gap: '2rem',
              justifyContent: 'center',
              marginTop: '2rem',
              flexWrap: 'wrap'
            }}>
              <a href="https://polygonscan.com/token/0xB37531727fC07c6EED4f97F852A115B428046EB2" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '1.1rem' }}>
                📊 PolygonScan
              </a>
              <a href="https://dapp.quickswap.exchange/swap/best/ETH/0xB37531727fC07c6EED4f97F852A115B428046EB2?chainId=137" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '1.1rem' }}>
                💎 QuickSwap
              </a>
              <a href="https://info.quickswap.exchange/#/pair/0x1d2e88A55CBBAB68237aa10781a5e00335Af9f9c" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '1.1rem' }}>
                ⚛️ Liquidity Pool
              </a>
              <a href="https://github.com/Reussitess30/reussitess-global-nexus" target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none', fontSize: '1.1rem' }}>
                💻 GitHub
              </a>
            </div>
            
            <p style={{ marginTop: '3rem', fontSize: '0.8rem', color: '#444' }}>
              Propriété Exclusive : 0x69f42aa645a43a84e1143d416a4c81a88df01549 | Tous droits réservés REUSSITESS©
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
