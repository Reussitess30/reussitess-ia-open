import { useState, useEffect, useRef } from 'react'
import SUPER_KNOWLEDGE from '../lib/superBotKnowledge'
import ULTRA_KNOWLEDGE from '../lib/ultraBotKnowledge'
import VISION_2030 from '../lib/vision2030'

export default function SuperBotUniversal() {
  const [isOpen, setIsOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState('fr-FR')
  const messagesEndRef = useRef(null)

  const languages = [
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français' },
    { code: 'en-US', flag: '🇺🇸', name: 'English' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español' },
    { code: 'de-DE', flag: '🇩🇪', name: 'Deutsch' }
  ]

  const welcomeMsg = "Salut champion ! Je suis ton SUPER guide REUSSITESS 971 ! Je connais TOUT : Boutiques, Passeport, VISA, Quiz, Culture, IA... Que veux-tu decouvrir ?"

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addMessage(welcomeMsg, 'bot')
        if (typeof window !== 'undefined' && window.readText) {
          window.readText(welcomeMsg)
        }
      }, 500)
    }
  }, [isOpen])

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, id: Date.now() }])
  }

  const getResponse = (query) => {
    const q = query.toLowerCase()
    
    // VISION 2030 - IA
    if (q.includes('vision') || q.includes('2030') || q.includes('ia') || q.includes('ai') || q.includes('futur')) {
      return `🚀 VISION 2030 : IA & OPPORTUNITES MONDIALES

📊 MARCHE IA :
• 2024 : 200 milliards USD
• 2030 : 1,800 milliards USD
• 97 MILLIONS nouveaux emplois IA

💼 TOP METIERS IA :
🤖 Ingenieur IA : 70-150K/an
💻 Data Scientist : 60-120K/an
🎨 Prompt Engineer : 50-100K/an

🏝️ OPPORTUNITES DOM-TOM :
✅ Tourisme IA (assistants creoles)
✅ AgriTech IA (cultures tropicales)
✅ Traduction IA (creole-francais)
✅ Patrimoine IA (Gwoka digital)

🎓 FORMATIONS GRATUITES :
• Google AI Essentials (certificat)
• DeepLearning.AI (Andrew Ng)
• Fast.ai (Deep Learning)

💰 FINANCEMENTS :
🇪🇺 FEDER : jusqu'a 500K
🇫🇷 BPI France : 50K-5M

Tape 'formation' pour cours gratuits !
Tape 'opportunites' pour niches DOM-TOM !

✨ L'avenir appartient a ceux qui osent ! 🇬🇵🚀`
    }
    
    // FORMATIONS
    if (q.includes('formation') || q.includes('cours')) {
      return `🎓 FORMATIONS IA GRATUITES

1. GOOGLE AI ESSENTIALS
   📍 grow.google/certificates
   ⏱️ 10 heures
   
2. DEEPLEARNING.AI
   📍 coursera.org
   👨‍🏫 Andrew Ng
   
3. FAST.AI
   📍 fast.ai
   💻 Pratique
   
4. MICROSOFT AI SCHOOL
   📍 microsoft.com/learn/ai
   
Investissement : 0 euros
Resultat : Competences 50-100K/an

Commence aujourd'hui ! 💪`
    }
    
    // QUIZ
    if (q.includes('quiz')) {
      const quiz = SUPER_KNOWLEDGE.quiz.domTom[0]
      return `🎓 QUIZ !\n\n${quiz.q}\n\nA) ${quiz.options[0]}\nB) ${quiz.options[1]}\nC) ${quiz.options[2]}\nD) ${quiz.options[3]}\n\nReponse : ${quiz.options[quiz.correct]}\n\n${quiz.explanation}`
    }
    
    // BOUDOUM
    if (q.includes('boudoum')) {
      return "💥 BOUDOUM ! Tu as trouve le cri de guerre de la Guadeloupe ! Fierte guadeloupeenne ! +200 points champion ! 🇬🇵"
    }
    
    // BLAGUE
    if (q.includes('blague')) {
      return "😄 Pourquoi les guadeloupeens sont toujours en retard ? Parce qu'ils vivent sur une ile ou le temps s'arrete ! ⏰"
    }
    
    // GUADELOUPE
    if (q.includes('guadeloupe') || q.includes('971')) {
      return `🇬🇵 GUADELOUPE (971) - TERRE DE CHAMPIONS

📍 Capitale : Basse-Terre
🦋 Forme : Papillon
👥 Population : 380,000
🎵 Musique : Gwoka (UNESCO)
🌋 Volcan : La Soufriere

🏆 CHAMPIONS :
• Teddy Riner - Judo (11x champion monde)
• Marie-Jose Perec - Athletisme (3 medailles or)
• Thierry Henry - Football (champion monde 1998)

Excellence • Innovation • Succes • BOUDOUM ! 🇬🇵`
    }
    
    // BOUTIQUES
    if (q.includes('boutique') || q.includes('amazon')) {
      return "🛍️ 26 boutiques Amazon dans 14 pays ! France, USA, UK, Allemagne... Visite /boutiques"
    }
    
    // PASSEPORT
    if (q.includes('passeport')) {
      return "🏆 Passeport de Reussite ! 127 pays, 15247 champions ! Cree le tien sur /champions"
    }
    
    // VISA
    if (q.includes('visa')) {
      return "🌍 VISA Universel ! 10000 bourses, 50000 emplois ! Va sur /visa-universel"
    }
    
    return "🤔 Je peux t'aider avec : Vision 2030 (IA), Quiz, Blague, Guadeloupe, Boutiques, Passeport, VISA, Formation... Que veux-tu ?"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const userInput = input.trim()
    if (!userInput) return

    addMessage(userInput, 'user')
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const response = getResponse(userInput)
      addMessage(response, 'bot')
      setIsLoading(false)
      
      if (typeof window !== 'undefined' && window.readText) {
        window.readText(response.substring(0, 150))
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
              SUPER GUIDE 971
            </div>
            <div style={{ color: 'white', fontSize: '0.7rem', opacity: 0.9 }}>
              IA • Culture • Opportunites
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

        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <div style={{ color: '#fbbf24' }}>...</div>
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
            placeholder="Vision 2030, quiz, blague, Guadeloupe..."
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
