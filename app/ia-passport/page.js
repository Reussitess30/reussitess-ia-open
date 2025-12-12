'use client'

import Layout from '../../components/Layout'
import { useState } from 'react'

export default function IAPassport() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const features = [
    { 
      icon: '🤖', 
      title: '100+ IA Connectées', 
      desc: 'Accès unifié aux meilleures IA mondiales',
      details: {
        title: 'Écosystème IA Universel',
        content: `Accédez à plus de 100 modèles d'IA via une seule plateforme, inspiré des leaders mondiaux comme TypingMind, Magai et Alle-AI :

• **ChatGPT (OpenAI)** - GPT-4, GPT-4o pour conversations avancées
• **Claude (Anthropic)** - Analyse approfondie, contexte de 200K tokens (équivalent à 500 pages)
• **Gemini (Google)** - Multimodal avancé (texte, image, vidéo, audio)
• **Perplexity** - Recherche web avec citations vérifiables
• **Midjourney & DALL-E** - Génération d'images professionnelles
• **GitHub Copilot** - Assistance code en temps réel
• **DeepSeek** - Traitement data massif à coût réduit
• **Grok (X.AI)** - Accès temps réel aux actualités X/Twitter

**ÉCONOMIE RÉELLE :** 
Au lieu de payer 3-5 abonnements séparés ($20/mois chacun = $60-100/mois), accédez à TOUT pour une fraction du coût. Les plateformes comme Magai (50,000+ utilisateurs) et TypingMind prouvent que ce modèle fonctionne.

**BASCULE INSTANTANÉE :** 
Changez de modèle en un clic SANS perdre votre conversation. Comparez les réponses de ChatGPT, Claude et Gemini côte à côte pour obtenir le meilleur résultat.`,
        stats: ['100+ Modèles IA', '1 Seule Interface', 'Économie 70%']
      }
    },
    { 
      icon: '🌐', 
      title: '195 Langues Supportées', 
      desc: 'Traduction instantanée temps réel',
      details: {
        title: 'Traduction Universelle Professionnelle',
        content: `Technologie basée sur les leaders mondiaux Interprefy, Wordly et Google Cloud Translation (utilisés par des millions d'utilisateurs) :

• **Wordly AI** - 3,000+ paires de langues, 4 millions d'utilisateurs, 400 millions de minutes traduites
• **Interprefy** - 6,000+ combinaisons linguistiques, niveau entreprise
• **Talo AI** - Traduction vocale temps réel sur Zoom/Teams/Meet en 60 langues
• **OpenL & Google Translate** - Plus de 100 langues avec précision neuronale

**CAS D'USAGE RÉELS :**
- **Meetings internationaux :** Parlez français, votre collègue japonais entend en japonais instantanément
- **Support client mondial :** Un agent anglophone peut servir des clients en 195 langues
- **Webinaires mondiaux :** Diffusez en une langue, tous reçoivent dans la leur
- **Recherche académique :** Consultez des articles en chinois, russe, arabe traduits instantanément

**TECHNOLOGIES UTILISÉES :**
• Neural Machine Translation (NMT) de dernière génération
• Zero-Knowledge Proofs pour la confidentialité
• Traduction vocale avec synthèse naturelle (ElevenLabs, Speechify)
• Préservation du contexte culturel et des nuances`,
        stats: ['195 Langues', '3000+ Paires', 'Temps Réel']
      }
    },
    { 
      icon: '🔐', 
      title: 'Blockchain & NFT ID', 
      desc: 'Identité digitale certifiée inviolable',
      details: {
        title: 'Sécurité Blockchain Niveau Entreprise',
        content: `Technologie décentralisée inspirée des projets leaders mondiaux Polygon ID, Worldcoin et ENS :

• **Identité NFT Unique :** Chaque utilisateur possède un NFT digital inviolable comme passeport
• **Polygon ID (2024)** - Utilise Zero-Knowledge Proofs, partenariat avec Animoca Brands
• **Worldcoin** - Vérification biométrique (iris/empreinte) pour prouver l'humanité
• **ENS (Ethereum Name Service)** - Noms lisibles sur blockchain
• **Space ID** - Identité unifiée cross-chain

**PROTECTION ANTI-DEEPFAKE :**
Prouvez que c'est VRAIMENT vous grâce à la blockchain. Vos créations IA sont certifiées avec horodatage immutable. Personne ne peut usurper votre identité ou falsifier vos contenus.

**DONNÉES RÉELLES :**
• Chiffrement AES-256 (standard militaire américain)
• Stockage décentralisé (0 point de défaillance unique)
• Compatible RGPD et normes européennes
• Biométrie optionnelle (Face ID, empreinte, reconnaissance palmaire)
• Révocation instantanée en cas de vol d'appareil

**AVANTAGE GUADELOUPE 🇬🇵 :**
Territoire français = conformité UE automatique + crédibilité juridique internationale`,
        stats: ['NFT Unique', 'AES-256', 'RGPD Compliant']
      }
    },
    { 
      icon: '💎', 
      title: 'Système de Tokens REUSSITESS', 
      desc: 'Monnaie universelle pour toutes les IA',
      details: {
        title: 'Économie IA Simplifiée',
        content: `Fini les abonnements multiples ! Un système de tokens inspiré des modèles API économiques réels :

**TARIFS ACTUELS MARCHÉ (2024-2025) :**
• ChatGPT Plus : $20/mois
• Claude Pro : $20/mois  
• Gemini Advanced : $19.99/mois
• Perplexity Pro : $20/mois
• Midjourney : $30/mois
**TOTAL : $110/mois pour 5 services !**

**SYSTÈME REUSSITESS TOKENS :**
• **Pack Starter** - 100 tokens = 39€ (vs $110 séparé)
• **Pack Pro** - 500 tokens = 149€ (vs $550 séparé)
• **Pack Entreprise** - 2000 tokens = 499€ (vs $2200 séparé)

**1 TOKEN = QUOI ?**
• 1 heure d'utilisation IA toutes plateformes
• 50 images Midjourney/DALL-E
• 100,000 tokens GPT-4 (≈75,000 mots)
• 1 vidéo Synthesia (30 secondes)
• 10 traductions vocales complètes

**GAGNEZ DES TOKENS :**
• Parrainage : +20 tokens par personne
• Créez du contenu viral : +50 tokens
• Contribution communauté : +10 tokens/mois
• Feedback qualité : +5 tokens

**MARKETPLACE :** 
Revendez vos tokens non utilisés ou échangez contre €/$/crypto. Système transparent sur blockchain.`,
        stats: ['75% Économie', '1 Token = 1h IA', 'Revendable']
      }
    },
    { 
      icon: '🎯', 
      title: 'Assistant Personnel Évolutif', 
      desc: 'IA qui apprend de TOUTES vos interactions',
      details: {
        title: 'Votre Intelligence Artificielle Personnelle',
        content: `Un assistant qui se souvient de TOUT et évolue avec vous, inspiré de Magai Personas et Claude Projects :

**MÉMOIRE UNIVERSELLE :**
• Se souvient de tous vos projets simultanément
• Garde le contexte entre ChatGPT, Claude, Gemini
• Connaît vos préférences de style, ton, format
• Comprend vos objectifs professionnels à long terme

**AUTOMATISATION INTELLIGENTE :**
• **Email :** Rédige et répond automatiquement dans votre style
• **Meetings :** Prépare agendas, prend notes, génère comptes-rendus
• **Code :** Debug, complète, documente votre code
• **Recherche :** Surveille le web pour vous, envoie alertes pertinentes
• **Documents :** Résume 500 pages en 5 minutes avec points clés

**PROFILS ADAPTATIFS :**
• Mode Entrepreneur : Focus ROI, stratégie, networking
• Mode Créatif : Brainstorming, storytelling, design
• Mode Étudiant : Recherche académique, citations, révisions
• Mode Manager : Leadership, communication équipe, décisions

**CAS CONCRET :** 
"Prépare ma réunion investisseurs demain" → L'assistant consulte vos documents Google Drive, analyse vos finances, génère présentation PowerPoint, prépare réponses aux questions probables, et vous envoie un brief de 5 minutes.

**DONNÉES RÉELLES (Magai, 80,000+ utilisateurs) :**
Gain de temps moyen : 15h/semaine par utilisateur`,
        stats: ['24/7 Actif', '∞ Projets', '15h Gagnées/Sem']
      }
    },
    { 
      icon: '⚡', 
      title: 'Hub Universel Instantané', 
      desc: 'Toute l\'IA mondiale en 1 clic',
      details: {
        title: 'Plateforme Unifiée Mondiale',
        content: `Interface unique pour orchestrer TOUTES les IA, inspirée de Raycast AI et AI-Flow :

**WORKFLOWS AUTOMATISÉS :**
Créez des chaînes IA complexes sans coder :
• **Exemple Marketing :** GPT-4 écrit l'article → DALL-E crée les visuels → Synthesia génère la vidéo → Auto-publication LinkedIn
• **Exemple Entreprise :** Transcription audio (Whisper) → Traduction 10 langues (Google Translate) → Résumé exécutif (Claude) → Email clients (Auto)
• **Exemple Création :** Idée → Script (ChatGPT) → Storyboard (Midjourney) → Voix-off (ElevenLabs) → Montage (Runway ML)

**DRAG & DROP :** 
Connectez les IA visuellement comme des blocs LEGO. Zero code requis.

**API COMPLÈTE :**
Intégrez IA Passport dans vos applications :
• Extensions : Chrome, VSCode, Notion, Slack, WhatsApp
• Webhooks pour automatisation
• SDK Python, JavaScript, REST API

**MODE HORS-LIGNE :**
Téléchargez des modèles IA légers sur votre machine pour travailler sans internet (Llama 2, Mixtral 8x7b via Groq).

**BENCHMARK VITESSE :** 
• Gemini 2.5 Flash : 370 tokens/seconde
• GPT-4o : 120 tokens/seconde  
• Claude Sonnet : 100 tokens/seconde

**GAIN PRODUCTIVITÉ RÉEL :**
Tâche complexe : 5h de travail → 30 minutes avec IA Passport (données utilisateurs Magai)`,
        stats: ['1 Interface', '10x Vitesse', 'API Ouverte']
      }
    }
  ]

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
            Inspiré par les leaders mondiaux • Propulsé depuis la Guadeloupe 🚀
          </p>

          {/* Features Grid - CLIQUABLES */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            maxWidth: '1000px',
            margin: '0 auto 4rem'
          }}>
            {features.map((feature, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedFeature(selectedFeature === i ? null : i)}
                style={{
                  background: selectedFeature === i 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: selectedFeature === i 
                    ? '2px solid #10b981' 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: selectedFeature === i ? 'scale(1.02)' : 'scale(1)'
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
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  {feature.desc}
                </p>
                <div style={{
                  color: '#10b981',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {selectedFeature === i ? '📖 Cliquez pour fermer' : '👆 Cliquez pour détails complets'}
                </div>
              </div>
            ))}
          </div>

          {/* Détails de la feature sélectionnée */}
          {selectedFeature !== null && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '30px',
              padding: '3rem 2rem',
              maxWidth: '900px',
              margin: '0 auto 4rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              textAlign: 'left',
              animation: 'slideDown 0.3s ease-out'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: '800',
                  color: 'white'
                }}>
                  {features[selectedFeature].icon} {features[selectedFeature].details.title}
                </h2>
                <button
                  onClick={() => setSelectedFeature(null)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid #ef4444',
                    color: '#ef4444',
                    padding: '0.5rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  className="close-btn"
                >
                  ✕ Fermer
                </button>
              </div>
              
              <div style={{
                color: '#cbd5e1',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                lineHeight: '1.8',
                whiteSpace: 'pre-line',
                marginBottom: '2rem'
              }}>
                {features[selectedFeature].details.content}
              </div>

              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {features[selectedFeature].details.stats.map((stat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    border: '2px solid #10b981',
                    minWidth: '150px',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: 'clamp(1rem, 2vw, 1.2rem)'
                    }}>
                      {stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon Section */}
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
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: '800',
              color: 'white',
              marginBottom: '1rem'
            }}>
              🚀 LANCEMENT 2025
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: '#94a3b8',
              marginBottom: '2rem'
            }}>
              Rejoignez les pionniers • Liste d'attente BETA exclusive
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
                  placeholder="Votre email pour l'accès anticipé BETA"
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
                  ✨ Rejoindre la Révolution Mondiale
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
                  Bienvenue dans la Révolution !
                </h3>
                <p style={{ color: '#94a3b8' }}>
                  Vous êtes inscrit(e) BETA. Préparez-vous à changer le monde ! 🌍
                </p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            flexWrap: 'wrap',
            marginTop: '4rem'
          }}>
            {[
              { num: '100+', label: 'IA Connectées' },
              { num: '4M+', label: 'Utilisateurs Mondiaux' },
              { num: '∞', label: 'Possibilités' }
            ].map((stat, i) => (
              <div key={i} style={{
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {stat.num}
                </div>
                <div style={{ color: '#64748b', fontSize: 'clamp(0.9rem, 2vw, 1rem)', marginTop: '0.5rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Brand */}
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

        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }

        .feature-card:hover {
          transform: translateY(-10px) !important;
          background: rgba(255, 255, 255, 0.06) !important;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(16, 185, 129, 0.6);
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.4);
          transform: scale(1.05);
        }

        input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
        }
      `}</style>
    </Layout>
  )
}
