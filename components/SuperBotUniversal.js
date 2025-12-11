import { useState, useEffect, useRef } from 'react'
import SUPER_KNOWLEDGE, { searchSuperKnowledge } from '../lib/superBotKnowledge'

export default function SuperBotUniversal() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState('fr-FR')
  const [securityScore, setSecurityScore] = useState(100)
  const messagesEndRef = useRef(null)

  const languages = [
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'it-IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'pt-BR', flag: '🇧🇷', name: 'Português' },
    { code: 'zh-CN', flag: '🇨🇳', name: '中文' },
    { code: 'ar-SA', flag: '🇸🇦', name: 'العربية' }
  ]

  const welcomeMsg = "Salut champion ! Je suis ton SUPER guide REUSSITESS 971 ! Je connais TOUT : 26 boutiques Amazon, Passeport, VISA, Quiz, DOM-TOM, Afrique, Caraibes, astuces, proverbes, politique, securite... Que veux-tu savoir ?"

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage(welcomeMsg, 'bot')
        if (typeof window !== 'undefined' && window.readText) {
          window.readText(welcomeMsg)
        }
      }, 500)
    }
    
    // Vérifier sécurité au démarrage
    const secCheck = SUPER_KNOWLEDGE.securite.checkSecurity()
    setSecurityScore(secCheck.score)
  }, [isOpen])

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, id: Date.now() }])
  }

  const getSmartResponse = (query) => {
    const q = query.toLowerCase()
    const results = searchSuperKnowledge(query)
    
    // QUIZ
    if (q.includes('quiz') || q.includes('test')) {
      const randomQuiz = SUPER_KNOWLEDGE.quiz.domTom[Math.floor(Math.random() * SUPER_KNOWLEDGE.quiz.domTom.length)]
      return `🎓 QUIZ DOM-TOM !\n\n${randomQuiz.q}\n\nA) ${randomQuiz.options[0]}\nB) ${randomQuiz.options[1]}\nC) ${randomQuiz.options[2]}\nD) ${randomQuiz.options[3]}\n\nRéponse : ${randomQuiz.options[randomQuiz.correct]}\n\n💡 ${randomQuiz.explanation}`
    }
    
    // ASTUCES AMAZON
    if (q.includes('astuce') || q.includes('amazon') || q.includes('conseil')) {
      const randomAstuce = SUPER_KNOWLEDGE.astucesAmazon[Math.floor(Math.random() * SUPER_KNOWLEDGE.astucesAmazon.length)]
      return `🛍️ ASTUCE AMAZON PRO :\n\n${randomAstuce}\n\nVeux une autre astuce ? Redemande-moi ! Nos 26 boutiques : /boutiques`
    }
    
    // PROVERBES
    if (q.includes('proverbe') || q.includes('sagesse') || q.includes('creole')) {
      const randomProverbe = SUPER_KNOWLEDGE.proverbesAntillais[Math.floor(Math.random() * SUPER_KNOWLEDGE.proverbesAntillais.length)]
      return `🌴 SAGESSE ANTILLAISE :\n\n${randomProverbe}\n\nLa culture créole regorge de sagesse ! Veux un autre proverbe ?`
    }
    
    // POLITIQUES ANTILLAIS
    if (q.includes('cesaire') || q.includes('politique') || q.includes('histoire')) {
      const randomPolitique = SUPER_KNOWLEDGE.politiquesAntillais[Math.floor(Math.random() * SUPER_KNOWLEDGE.politiquesAntillais.length)]
      return `👤 ${randomPolitique.nom} (${randomPolitique.annees})\n\n📍 ${randomPolitique.territoire}\n🎖️ ${randomPolitique.role}\n\n💡 ${randomPolitique.impact}\n\n"${randomPolitique.citation || 'Figure historique majeure'}"\n\nNos héros nous inspirent ! 🇬🇵`
    }
    
    // SÉCURITÉ
    if (q.includes('securite') || q.includes('hack') || q.includes('proteger')) {
      const secCheck = SUPER_KNOWLEDGE.securite.checkSecurity()
      return `🛡️ RAPPORT DE SÉCURITÉ REUSSITESS\n\nScore : ${secCheck.score}/100 ${secCheck.status}\n\n✅ Protections actives :\n${SUPER_KNOWLEDGE.securite.alertes.join('\n')}\n\n📋 Recommandations :\n${SUPER_KNOWLEDGE.securite.recommendations.slice(0, 3).join('\n')}\n\nTon site est SÉCURISÉ ! 🔒`
    }
    
    // ACTUALITÉS
    if (q.includes('actu') || q.includes('news')) {
      return `📰 ACTUALITÉS REUSSITESS :\n\n🏝️ DOM-TOM :\n${SUPER_KNOWLEDGE.actualites.domTom.slice(0, 2).join('\n')}\n\n🌍 Afrique :\n${SUPER_KNOWLEDGE.actualites.afrique.slice(0, 2).join('\n')}\n\nRejoins notre newsletter sur /contact !`
    }
    
    // SAVOIR-VIVRE
    if (q.includes('savoir') || q.includes('culture') || q.includes('tradition')) {
      return `🤝 SAVOIR-VIVRE ANTILLAIS :\n\n${SUPER_KNOWLEDGE.savoirVivre.slice(0, 4).join('\n\n')}\n\nLa culture antillaise est riche et chaleureuse ! 🇬🇵`
    }
    
    // INFOS UTILES
    if (q.includes('urgence') || q.includes('sante') || q.includes('numero')) {
      return `📞 INFOS UTILES DOM-TOM :\n\n🚨 Urgences Guadeloupe : SAMU 15, Pompiers 18, Police 17, Europe 112\n\n💊 Santé :\n${SUPER_KNOWLEDGE.infosUtiles.sante.join('\n')}\n\nPrends soin de toi champion ! 💪`
    }
    
    // NAVIGATION
    if (q.includes('boutique')) {
      return "🛍️ 26 boutiques Amazon dans 14 pays ! France, USA, UK, Allemagne, Espagne, Italie, Canada, Inde, Pays-Bas, Suede, Singapour, Australie, Belgique, Bresil ! Visite /boutiques"
    }
    if (q.includes('passeport') || q.includes('champion')) {
      return "🏆 Passeport de Reussite ! 127 pays, 15247 champions ! Cree le tien sur /champions"
    }
    if (q.includes('visa') || q.includes('bourse')) {
      return "🌍 VISA Universel ! 10000 bourses, 50000 emplois ! Va sur /visa-universel"
    }
    
    return "🤔 Je peux t'aider avec : Quiz, Astuces Amazon, Proverbes creoles, Histoire politique, Securite, Actualites, Savoir-vivre, Infos utiles, Boutiques, Passeport, VISA ! Que veux-tu ?"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userInput = input.trim()
    if (!userInput) return

    addMessage(userInput, 'user')
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const response = getSmartResponse(userInput)
      addMessage(response, 'bot')
      setIsLoading(false)
      
      if (typeof window !== 'undefined' && window.readText) {
        window.readText(response)
      }
    }, 800)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '100px',
          right: '30px',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 8px 30px rgba(251,191,36,0.5)',
          cursor: 'pointer',
          fontSize: '2rem',
          zIndex: 1000
        }}
      >
        🌟
      </button>
    )
  }

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '550px',
      maxWidth: '95vw',
      height: '650px',
      background: 'linear-gradient(135deg, #4338ca, #7c3aed, #ec4899)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '4px solid #fbbf24'
    }}>
      
      <div style={{
        background: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ef4444)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: 'white', fontWeight: '900', fontSize: '1.2rem' }}>
              🌟 SUPER GUIDE 971
            </div>
            <div style={{ color: 'white', fontSize: '0.7rem', opacity: 0.9 }}>
              Quiz • Astuces • Histoire • Securite {securityScore}%
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              fontSize: '2rem',
              cursor: 'pointer',
              borderRadius: '50%',
              width: '40px',
              height: '40px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setCurrentLang(lang.code)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                opacity: currentLang === lang.code ? 1 : 0.5
              }}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'rgba(0,0,0,0.2)'
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '0.75rem',
              borderRadius: '16px',
              background: msg.sender === 'user'
                ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                : 'rgba(255,255,255,0.15)',
              color: 'white',
              fontSize: '0.85rem',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ color: '#fbbf24', fontSize: '1.5rem' }}>💭...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{
        padding: '1rem',
        background: 'rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Quiz, astuces, proverbes, securite..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '20px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              border: 'none',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '1.2rem'
            }}
          >
            🚀
          </button>
        </div>
      </form>
    </div>
  )
}
