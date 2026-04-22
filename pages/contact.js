/* © Reussitess®971 INPI DSO2026012614 PORINUS Rony 2026 */
import Layout from '../components/Layout'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Layout>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '30px',
            padding: '3rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            marginBottom: '2rem'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: '900',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}>
              Contactez-nous
            </h1>

            <p style={{
              textAlign: 'center',
              color: '#64748b',
              fontSize: '1.1rem',
              marginBottom: '3rem'
            }}>
              Une question ? Un projet ? Nous sommes à votre écoute !
            </p>

            {/* INFORMATIONS DE CONTACT */}
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '20px',
              marginBottom: '3rem',
              textAlign: 'center'
            }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                📧 Informations de Contact
              </h2>
              
              <div style={{ fontSize: '1.1rem', lineHeight: '2' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>👨‍💼 Dirigeant :</strong> Porinus Rony Roger (@reussitess)
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>📋 SIRET :</strong> 444699979700031
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>💼 Statut :</strong> Auto-entrepreneur EI - IT & Amazon Influencer
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <strong>✉ Email :</strong>{' '}
                  <a 
                    href="mailto:influenceur@reussitess.fr"
                    style={{ 
                      color: 'white', 
                      textDecoration: 'underline',
                      fontWeight: 'bold'
                    }}
                  >
                    influenceur@reussitess.fr
                  </a>
                </p>
                <p style={{ marginTop: '1rem' }}>
                  <strong>🇬🇵 Origine :</strong> Guadeloupe - Terres de Champions
                </p>
              </div>
            </div>

            {/* FORMULAIRE DE CONTACT */}
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1e293b'
                  }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '1.2rem 3rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  📨 Envoyer le message
                </button>
              </form>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                borderRadius: '20px',
                border: '2px solid rgba(16, 185, 129, 0.3)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{
                  fontSize: '2rem',
                  color: '#10b981',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  Message envoyé !
                </h3>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                  Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais à l'adresse : <strong>{formData.email}</strong>
                </p>
                <p style={{ color: '#10b981', fontWeight: 'bold', marginTop: '1rem' }}>
                  BOUDOUM 🎯
                </p>
              </div>
            )}
          </div>

          {/* Bouton retour */}
          <div style={{ textAlign: 'center' }}>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#667eea',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}
            >
              ← Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
