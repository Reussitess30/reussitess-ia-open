'use client'

async function fetchWikipedia(term) {
  try {
    const r = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`)
    const d = await r.json()
    return d.extract ? '📚 **Wikipedia :** ' + d.extract : null
  } catch(e) { return null }
}

import { useState, useEffect, useRef } from 'react'

export default function SuperBotUniversal() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentLang, setCurrentLang] = useState('fr-FR')
  const [userScore, setUserScore] = useState(0)
  const [quizMode, setQuizMode] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
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

  // QUIZ COMPLETS
  const allQuiz = [
    {
      question: "Quelle est la capitale administrative de la Guadeloupe ?",
      options: ["Pointe-à-Pitre", "Basse-Terre", "Les Abymes", "Le Gosier"],
      correct: 1,
      explanation: "Basse-Terre est la préfecture et capitale administrative, tandis que Pointe-à-Pitre est le pôle économique !"
    },
    {
      question: "Combien de fois Teddy Riner a-t-il été champion du monde de judo ?",
      options: ["5 fois", "8 fois", "11 fois", "15 fois"],
      correct: 2,
      explanation: "Teddy Riner (Guadeloupe) est 11x champion du monde et 3x champion olympique ! Le GOAT du judo !"
    },
    {
      question: "Quel est le volcan actif de la Martinique ?",
      options: ["La Soufrière", "Montagne Pelée", "Piton de la Fournaise", "Mont Pelé"],
      correct: 1,
      explanation: "La Montagne Pelée a détruit Saint-Pierre en 1902. C'est l'un des volcans les plus dangereux des Caraïbes !"
    },
    {
      question: "Où se trouve le Centre Spatial Guyanais ?",
      options: ["Cayenne", "Kourou", "Saint-Laurent", "Matoury"],
      correct: 1,
      explanation: "Le CSG de Kourou lance les fusées Ariane ! Position idéale près de l'équateur pour économiser du carburant !"
    },
    {
      question: "Le Gwoka de Guadeloupe est classé par :",
      options: ["L'ONU", "UNESCO", "L'Europe", "La France"],
      correct: 1,
      explanation: "Le Gwoka est patrimoine culturel immatériel de l'UNESCO depuis 2014 ! Musique, danse et chant traditionnels !"
    },
    {
      question: "Combien de médailles d'or olympiques Marie-José Pérec a-t-elle gagnées ?",
      options: ["1", "2", "3", "4"],
      correct: 2,
      explanation: "Marie-José Pérec (Guadeloupe) a 3 médailles d'or : 400m (1992, 1996) et 200m (1996) ! Légende !"
    },
    {
      question: "Quel pays africain n'a jamais été colonisé ?",
      options: ["Kenya", "Éthiopie", "Ghana", "Nigeria"],
      correct: 1,
      explanation: "L'Éthiopie a toujours conservé son indépendance (sauf occupation italienne 1936-1941) !"
    },
    {
      question: "Quelle ville africaine est surnommée 'Paris de l'Afrique' ?",
      options: ["Dakar", "Abidjan", "Kinshasa", "Yaoundé"],
      correct: 1,
      explanation: "Abidjan, capitale économique de Côte d'Ivoire, est connue pour son dynamisme et sa modernité !"
    }
  ]

  const welcomeMessages = {
    'fr-FR': "Salut champion ! Je suis ton SUPER guide REUSSITESS 971 ! Je connais TOUT : Quiz interactifs, Bibliothèque mondiale, Vision IA 2030, Blagues, Proverbes créoles, et bien plus ! Que veux-tu découvrir ?",
    'en-US': "Hey champion! I'm your SUPER guide REUSSITESS 971! I know EVERYTHING: Interactive quizzes, World library, AI Vision 2030, Jokes, Creole proverbs, and much more! What do you want to discover?",
    'es-ES': "Hola campeon! Soy tu SUPER guia REUSSITESS 971! Lo se TODO: Cuestionarios interactivos, Biblioteca mundial, Vision IA 2030, Chistes, Proverbios criollos, y mucho mas! Que quieres descubrir?",
    'de-DE': "Hallo Champion! Ich bin dein SUPER Guide REUSSITESS 971! Ich weiss ALLES: Interaktive Quiz, Weltbibliothek, KI Vision 2030, Witze, Kreolische Sprichworter! Was mochtest du entdecken?",
    'it-IT': "Ciao campione! Sono la tua SUPER guida REUSSITESS 971! So TUTTO: Quiz interattivi, Biblioteca mondiale, Visione IA 2030, Barzellette, Proverbi creoli! Cosa vuoi scoprire?",
    'pt-BR': "Ola campeao! Sou seu SUPER guia REUSSITESS 971! Sei TUDO: Questionarios interativos, Biblioteca mundial, Visao IA 2030, Piadas, Proverbios crioulos! O que quer descobrir?",
    'zh-CN': "你好冠军！我是你的超级向导REUSSITESS 971！我知道一切：互动测验、世界图书馆、AI愿景2030、笑话、克里奥尔谚语！你想发现什么？",
    'ar-SA': "مرحبا بطل! انا دليلك الفائق REUSSITESS 971! اعرف كل شيء: اختبارات تفاعلية، مكتبة عالمية، رؤية الذكاء الاصطناعي 2030، نكات، امثال كريولية! ماذا تريد ان تكتشف؟"
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const welcome = welcomeMessages[currentLang]
        addMessage(welcome, 'bot')
        speakText(welcome)
      }, 500)
    }
  }, [isOpen])

  // FONCTION VOCALE AMÉLIORÉE
  const speakText = (text, lang = currentLang) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.95
      utterance.pitch = 1.1
      utterance.volume = 1.0
      
      // Attendre que les voix soient chargées
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices()
        const voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]))
        if (voice) utterance.voice = voice
        window.speechSynthesis.speak(utterance)
      }
      
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice()
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice
      }
    }
  }

  const addMessage = (text, sender) => {
    setMessages(prev => [...prev, { text, sender, id: Date.now() }])
  }

  const startQuiz = () => {
    const randomQuiz = allQuiz[Math.floor(Math.random() * allQuiz.length)]
    setCurrentQuiz(randomQuiz)
    setQuizMode(true)
    setQuizAnswered(false)
    
    const quizText = `🎓 QUIZ TIME !\n\n${randomQuiz.question}\n\nA) ${randomQuiz.options[0]}\nB) ${randomQuiz.options[1]}\nC) ${randomQuiz.options[2]}\nD) ${randomQuiz.options[3]}\n\nRéponds avec A, B, C ou D !`
    
    addMessage(quizText, 'bot')
    speakText(randomQuiz.question)
  }

  const checkQuizAnswer = (userAnswer) => {
    if (!currentQuiz || quizAnswered) return null
    
    const answerIndex = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 }[userAnswer.toLowerCase()]
    
    if (answerIndex === undefined) {
      return "Réponds avec A, B, C ou D s'il te plaît !"
    }
    
    setQuizAnswered(true)
    
    if (answerIndex === currentQuiz.correct) {
      setUserScore(prev => prev + 10)
      const response = `✅ BRAVO ! C'est la bonne réponse !\n\n💡 ${currentQuiz.explanation}\n\n🏆 +10 points ! Score total : ${userScore + 10}\n\nTape 'quiz' pour un autre quiz !`
      speakText("Bravo ! C'est la bonne réponse ! " + currentQuiz.explanation)
      return response
    } else {
      const response = `❌ Oups ! La bonne réponse était : ${String.fromCharCode(65 + currentQuiz.correct)}) ${currentQuiz.options[currentQuiz.correct]}\n\n💡 ${currentQuiz.explanation}\n\nScore : ${userScore}\n\nTape 'quiz' pour réessayer !`
      speakText("Oups ! " + currentQuiz.explanation)
      return response
    }
  }

  const getResponse = (query) => {
    const q = query.toLowerCase()
    
    // MODE QUIZ
    if (quizMode && !quizAnswered) {
      const result = checkQuizAnswer(q)
      if (result) {
        setQuizMode(false)
        return result
      }
    }
    
    // NOUVEAU QUIZ
    if (q.includes('quiz')) {
      startQuiz()
      return null // Message déjà ajouté par startQuiz
    }
    
    // SCORE
    if (q.includes('score') || q.includes('points')) {
      return `🏆 TON SCORE : ${userScore} points\n\nContinue à jouer aux quiz pour gagner plus de points !\n\nTape 'quiz' pour commencer !`
    }
    
    // EASTER EGG BOUDOUM
    if (q.includes('boudoum')) {
      return "💥💥💥 BOUDOUM BOUDOUM BOUDOUM ! 💥💥💥\n\nTu as trouvé le CRI DE GUERRE de la Guadeloupe ! 🇬🇵\n\nC'est l'expression de la FIERTÉ guadeloupéenne !\n\n+200 POINTS CHAMPION ! 🏆\n\n✨ Positivité à l'infini • Excellence • BOUDOUM ! 🇬🇵"
    }
    
    // BLAGUE
    if (q.includes('blague') || q.includes('rire')) {
      const blagues = [
        "Pourquoi les guadeloupéens sont toujours en retard ? Parce qu'ils vivent sur une île où le temps s'arrête ! ⏰😄",
        "Comment appelle-t-on un Martiniquais qui court ? Un Madinina-sprint ! 🏃💨",
        "Pourquoi les créoles sont les meilleurs en géographie ? Parce qu'ils savent où se trouve le paradis : chez eux ! 🏝️"
      ]
      return blagues[Math.floor(Math.random() * blagues.length)]
    }
    
    // GUADELOUPE
    if (q.includes('guadeloupe') || q.includes('971')) {
      return `🇬🇵 GUADELOUPE (971) - TERRE DE CHAMPIONS

📍 Capitale : Basse-Terre (administrative), Pointe-à-Pitre (économique)
🦋 Forme : Papillon (Grande-Terre + Basse-Terre)
👥 Population : 380,000 habitants
🗣️ Langues : Français, Créole guadeloupéen
💶 Monnaie : Euro

🎵 CULTURE :
• Musique : Gwoka (UNESCO 2014), Zouk, Biguine
• Danse : Lewoz, Mazurka créole
• Gastronomie : Colombo, Accras, Bokit, Ti-punch

🏆 NOS CHAMPIONS :
• Teddy Riner - Judo (11x champion monde)
• Marie-José Pérec - Athlétisme (3 médailles or)
• Thierry Henry - Football (champion monde 1998)
• Lilian Thuram - Football (champion monde 1998)

Excellence • Innovation • Succès • BOUDOUM ! 🇬🇵`
    }
    
    // VISION 2030
    if (q.includes('vision') || q.includes('2030') || q.includes('ia')) {
      return `🚀 VISION 2030 : IA & OPPORTUNITÉS MONDIALES

📊 MARCHÉ IA :
• 2024 : 200 milliards USD
• 2030 : 1,800 milliards USD (+37%/an)
• 97 MILLIONS nouveaux emplois IA d'ici 2025

💼 TOP MÉTIERS IA :
🤖 Ingénieur IA : 70-150K€/an
💻 Data Scientist : 60-120K€/an
🎨 Prompt Engineer : 50-100K€/an

🏝️ OPPORTUNITÉS DOM-TOM :
✅ Tourisme IA (assistants créoles)
✅ AgriTech IA (cultures tropicales)
✅ Traduction IA (créole-français)

🎓 FORMATIONS GRATUITES :
• Google AI Essentials
• DeepLearning.AI (Andrew Ng)
• Fast.ai

Tape 'formation' pour plus d'infos !`
    }
    
    // BOUTIQUES
    if (q.includes('boutique') || q.includes('amazon')) {
      return "🛍️ 26 BOUTIQUES AMAZON dans 14 pays !\n\n🇫🇷 France • 🇺🇸 USA • 🇬🇧 UK • 🇩🇪 Allemagne\n🇪🇸 Espagne • 🇮🇹 Italie • 🇨🇦 Canada • 🇮🇳 Inde\n\nVisite /boutiques pour tout découvrir ! 🎯"
    }
    
    // PASSEPORT
    if (q.includes('passeport')) {
      return "🏆 PASSEPORT DE RÉUSSITE REUSSITESS®971 !\n\n✅ 15,247+ champions dans 127 pays\n✅ Certificat personnalisé\n✅ Phrase inspirante\n✅ Plan d'action 7 jours\n\nCrée le tien sur /champions ! 🚀"
    }
    
    // VISA
    if (q.includes('visa')) {
      return "🌍 VISA UNIVERSEL DE RÉUSSITE !\n\n✅ 10,000+ bourses internationales\n✅ 50,000+ opportunités d'emploi\n✅ 5,000+ mentors actifs\n✅ 100M€+ de fonds accessibles\n\nObtiens ton VISA sur /visa-universel ! 🎯"
    }
    
    return `🤔 Je peux t'aider avec :\n\n🎓 Quiz interactifs (tape 'quiz')\n🇬🇵 Guadeloupe & DOM-TOM\n🚀 Vision IA 2030\n😄 Blagues antillaises\n🛍️ Boutiques Amazon\n🏆 Passeport de Réussite\n🌍 VISA Universel\n💥 Easter Egg BOUDOUM\n\nQue veux-tu découvrir ? Score actuel : ${userScore} points`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const userInput = input.trim()
    if (!userInput) return

    addMessage(userInput, 'user')
    setInput('')
    setIsLoading(true)

    setTimeout(async () => {
      const response = getResponse(userInput)
      // Enrichissement Wikipedia
      const noiseWords = ["parle", "moi", "dis", "explique", "raconte", "cest", "quest"]
      const searchTerms = userInput.toLowerCase().split(" ").filter(w => w.length > 3 && !noiseWords.includes(w))
      let wikiExtra = ""
      if (searchTerms.length > 0) {
        const wd = await fetchWikipedia(searchTerms[searchTerms.length - 1])
        if (wd) wikiExtra = "\n\n" + wd
      }
      const isDefaultResponse = response && response.includes("Je peux t'aider")
      const finalResponse = wikiExtra ? (isDefaultResponse ? wikiExtra.trim() : response + wikiExtra) : response
      if (finalResponse) {
        addMessage(finalResponse, 'bot')
        speakText(finalResponse)
      }
      setIsLoading(false)
    }, 800)
  }

  // Changer de langue
  const changeLang = (newLang) => {
    setCurrentLang(newLang)
    const welcome = welcomeMessages[newLang]
    addMessage(welcome, 'bot')
    speakText(welcome, newLang)
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
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          border: 'none',
          borderRadius: '50%',
          boxShadow: '0 8px 30px rgba(251,191,36,0.5)',
          cursor: 'pointer',
          fontSize: '1.2rem',
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
      maxHeight: '85vh',
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
              Quiz • IA • Culture • Score: {userScore}pts
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

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLang(lang.code)}
              style={{
                background: currentLang === lang.code ? 'rgba(255,255,255,0.3)' : 'transparent',
                border: currentLang === lang.code ? '2px solid white' : 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.2rem',
                borderRadius: '8px'
              }}
              title={lang.name}
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
            placeholder="Tape quiz, blague, Guadeloupe, vision 2030..."
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
