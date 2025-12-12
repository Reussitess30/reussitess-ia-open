'use client'

import Layout from '../../components/Layout'
import { useState } from 'react'

export default function IAPassport() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        padding: '4rem 1rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animation: 'pulse 5s ease-in-out infinite'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            fontSize: '8rem',
            marginBottom: '2rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🌍
          </div>

          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '0.75rem 2rem',
            borderRadius: '50px',
            marginBottom: '2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
          }}>
            🇬🇵 MADE IN GUADELOUPE • TERRES DE CHAMPIONS
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-2px'
          }}>
            IA PASSPORT MONDIAL
          </h1>

          <p style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: '#94a3b8',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Le Premier Passeport Universel IA
          </p>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            color: '#64748b',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem'
          }}>
            Une révolution mondiale depuis la Guadeloupe 🚀
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            maxWidth: '1000px',
            margin: '0 auto 4rem'
          }}>
            {[
              { icon: '🤖', title: '100+ IA Connectées', desc: 'ChatGPT, Claude, Gemini & plus' },
              { icon: '🌐', title: '195 Langues', desc: 'Traduction instantanée universelle' },
              { icon: '🔐', title: 'Blockchain Sécurisé', desc: 'Identité digitale certifiée' },
              { icon: '💎', title: 'REUSSITESS Coins', desc: 'Monnaie virtuelle IA universelle' },
              { icon: '🎯', title: 'Assistant Personnel', desc: 'IA qui apprend de vous' },
              { icon: '⚡', title: 'Accès Instantané', desc: 'Une seule plateforme, tout l\'IA' }
            ].map((feature, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                transition: 'all 0.3s ease'
              }}
              className="feature-card">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  color: 'white',
                  marginBottom: '0.5rem' 
                }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '30px',
            padding: '3rem 2rem',
            maxWidth: '700px',
            margin: '0 auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1rem'
            }}>
              🚀 RÉVOLUTION 2025
            </h2>
            
            <p style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
              marginBottom: '2rem'
            }}>
              Rejoignez la liste d'attente exclusive pour l'accès anticipé
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
                  placeholder="Votre email pour l'accès BETA"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '1rem 1.5rem',
                    borderRadius: '50px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    background: 'rgba(15, 23, 42, 0.8)',
                    color: 'white',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '1rem 3rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  className="submit-btn"
                >
                  ✨ Rejoindre la Révolution
                </button>
              </form>
            ) : (
              <div style={{
                padding: '2rem',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '20px',
                border: '2px solid rgba(16, 185, 129, 0.5)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  color: '#10b981',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem'
                }}>
                  Inscription Confirmée !
                </h3>
                <p style={{ color: '#94a3b8' }}>
                  Vous êtes sur la liste BETA. Préparez-vous à la révolution ! 🚀
                </p>
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginTop: '4rem'
          }}>
            {[
              { num: '100+', label: 'IA Intégrées' },
              { num: '195', label: 'Langues' },
              { num: '∞', label: 'Possibilités' }
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.num}
                </div>
                <div style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1rem'
            }}>
              REUSSITESS®971
            </h3>
            <p style={{
              color: '#64748b',
              fontSize: '1rem'
            }}>
              EXCELLENCE • INNOVATION • SUCCÈS
            </p>
            <p style={{
              color: '#10b981',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              marginTop: '0.5rem'
            }}>
              POSITIVITÉ À L'INFINI 🎯
            </p>
            <p style={{
              color: '#64748b',
              fontSize: '0.9rem',
              marginTop: '1rem'
            }}>
              BOUDOUM
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .feature-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
        }

        input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </Layout>
  )
}
