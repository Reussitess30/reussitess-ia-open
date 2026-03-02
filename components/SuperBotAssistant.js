'use client'
import { useState, useEffect, useRef } from 'react'

const LANGUES = {
  'fr': { label: '🇫🇷 Français', voice: 'fr-FR', code: 'fr-FR' },
  'en': { label: '🇺🇸 English', voice: 'en-US', code: 'en-US' },
  'es': { label: '🇪🇸 Español', voice: 'es-ES', code: 'es-ES' },
  'de': { label: '🇩🇪 Deutsch', voice: 'de-DE', code: 'de-DE' },
  'pt': { label: '🇧🇷 Português', voice: 'pt-BR', code: 'pt-BR' },
  'it': { label: '🇮🇹 Italiano', voice: 'it-IT', code: 'it-IT' },
  'nl': { label: '🇳🇱 Nederlands', voice: 'nl-NL', code: 'nl-NL' },
  'sv': { label: '🇸🇪 Svenska', voice: 'sv-SE', code: 'sv-SE' },
}

export default function SuperBotAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [langue, setLangue] = useState('fr')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const botPersonality = {
    name: "REUSSITESS AI", origin: "Guadeloupe 🇬🇵",
    motto: "EXCELLENCE • INNOVATION • SUCCÈS", signature: "BOUDOUM",
    expertise: ["Expert mondial IA","Blockchain Polygon","195 langues","Entrepreneuriat caribéen"]
  }

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }
  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: `🌍 **Salutations du monde !**\n\nJe suis **REUSSITESS AI**, votre assistant révolutionnaire né en **Guadeloupe** 🇬🇵 - Terres de Champions !\n\n✨ IA Universelle • 🌐 195 langues • 🔐 Blockchain • 💎 Tokens REUSS\n\n🎤 **NOUVEAU** — Parlez-moi ! Cliquez sur le micro et je vous réponds en audio dans votre langue !\n\nChoisissez votre langue en haut à droite, puis cliquez sur 🎤\n\n**BOUDOUM** 🎯` }])
    }
  }, [])

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Utilisez Chrome pour la reconnaissance vocale.'); return }
    const recognition = new SR()
    recognitionRef.current = recognition
    recognition.lang = LANGUES[langue].code
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setIsListening(false)
      setTimeout(() => submitMessage(transcript), 300)
    }
    recognition.onerror = (event) => {
      setIsListening(false)
      if (event.error === 'not-allowed') alert('Autorisez le microphone dans votre navigateur.')
    }
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false) } }

  const speakResponse = (text, langCode) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/https?:\/\/\S+/g,'').replace(/[\u{1F300}-\u{1F9FF}]/gu,'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,3}/g,'').substring(0, 500)
    if (!cleanText.trim()) return
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = langCode || LANGUES[langue].voice
    utterance.rate = 1.0; utterance.pitch = 1.0; utterance.volume = 0.9
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const tl = (langCode || LANGUES[langue].voice).substring(0,2)
      const best = voices.find(v => v.lang.startsWith(tl) && (v.name.includes('Google') || v.name.includes('Microsoft'))) || voices.find(v => v.lang.startsWith(tl))
      if (best) utterance.voice = best
    }
    window.speechSynthesis.getVoices().length > 0 ? setVoice() : (window.speechSynthesis.onvoiceschanged = setVoice)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); setIsSpeaking(false) } }

  const submitMessage = async (msgText) => {
    const userMessage = (msgText || input).trim()
    if (!userMessage || isLoading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)
    try {
      const response = await fetch('/api/superbot/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, personality: botPersonality, context: messages, langue })
      })
      const data = await response.json()
      const botResponse = data.response || "Désolé, une erreur s'est produite. Réessayez ! 🔄"
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }])
      if (audioEnabled) speakResponse(botResponse, LANGUES[langue].voice)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connexion temporairement indisponible. Réessayez dans un instant. 💪" }])
    } finally { setIsLoading(false) }
  }

  const handleSubmit = (e) => { e.preventDefault(); submitMessage(input) }

  const btnStyle = (bg, disabled) => ({
    padding: '0.8rem', borderRadius: '15px', border: 'none',
    background: bg, color: 'white', cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '1.2rem', opacity: disabled ? 0.5 : 1, flexShrink: 0
  })

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="bot-button" style={{
        position:'fixed', bottom:'2rem', right:'2rem', width:'70px', height:'70px',
        borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#3b82f6)',
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        boxShadow:'0 10px 40px rgba(16,185,129,0.5)', zIndex:9999, transition:'all 0.3s', animation:'pulse 2s infinite'
      }}>
        <span style={{fontSize:'2rem'}}>{isOpen ? '✕' : '🤖'}</span>
      </div>

      {isOpen && (
        <div style={{
          position:'fixed', bottom:'6rem', right:'2rem', width:'400px',
          maxWidth:'calc(100vw - 4rem)', height:'620px', maxHeight:'calc(100vh - 10rem)',
          background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:'20px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column',
          zIndex:9998, border:'2px solid rgba(16,185,129,0.3)', overflow:'hidden'
        }}>

          {/* HEADER */}
          <div style={{ background:'linear-gradient(135deg,#10b981,#3b82f6)', padding:'1rem 1.5rem', color:'white' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.8rem' }}>
                <span style={{fontSize:'2rem'}}>🤖</span>
                <div>
                  <h3 style={{margin:0,fontSize:'1.1rem',fontWeight:'bold'}}>REUSSITESS AI</h3>
                  <p style={{margin:0,fontSize:'0.75rem',opacity:0.9}}>🇬🇵 Expert IA Mondial • Guadeloupe</p>
                </div>
              </div>
              <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
                <button onClick={() => { setAudioEnabled(!audioEnabled); if(!audioEnabled) stopSpeaking() }}
                  style={{background: audioEnabled?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)', border:'none', borderRadius:'8px', padding:'0.4rem 0.6rem', cursor:'pointer', fontSize:'1rem', color:'white'}}>
                  {audioEnabled ? '🔊' : '🔇'}
                </button>
                <div style={{position:'relative'}}>
                  <button onClick={() => setShowLangMenu(!showLangMenu)}
                    style={{background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'8px', padding:'0.4rem 0.6rem', cursor:'pointer', fontSize:'0.8rem', color:'white', fontWeight:'bold'}}>
                    {LANGUES[langue].label.split(' ')[0]} ▾
                  </button>
                  {showLangMenu && (
                    <div style={{position:'absolute',top:'110%',right:0,background:'#1e293b',border:'1px solid rgba(16,185,129,0.3)',borderRadius:'10px',overflow:'hidden',zIndex:10000,minWidth:'150px'}}>
                      {Object.entries(LANGUES).map(([code, lang]) => (
                        <div key={code} onClick={() => {setLangue(code);setShowLangMenu(false)}}
                          style={{padding:'0.6rem 1rem',cursor:'pointer',fontSize:'0.85rem',color: langue===code?'#10b981':'#e2e8f0',background: langue===code?'rgba(16,185,129,0.1)':'transparent',fontWeight: langue===code?'bold':'normal'}}>
                          {lang.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{flex:1,overflowY:'auto',padding:'1.5rem',display:'flex',flexDirection:'column',gap:'1rem'}}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{alignSelf: msg.role==='user'?'flex-end':'flex-start', maxWidth:'85%'}}>
                <div style={{
                  background: msg.role==='user'?'linear-gradient(135deg,#3b82f6,#8b5cf6)':'rgba(16,185,129,0.15)',
                  color:'white', padding:'1rem 1.5rem',
                  borderRadius: msg.role==='user'?'20px 20px 5px 20px':'20px 20px 20px 5px',
                  fontSize:'0.95rem', lineHeight:'1.6',
                  border: msg.role==='assistant'?'1px solid rgba(16,185,129,0.3)':'none',
                  whiteSpace:'pre-wrap'
                }}>
                  {msg.content}
                </div>
                {msg.role==='assistant' && audioEnabled && (
                  <button onClick={() => speakResponse(msg.content, LANGUES[langue].voice)}
                    style={{background:'none',border:'none',cursor:'pointer',fontSize:'0.75rem',color:'#10b981',padding:'0.2rem 0.5rem',marginTop:'0.2rem'}}>
                    🔊 Écouter
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{alignSelf:'flex-start',background:'rgba(16,185,129,0.15)',padding:'1rem 1.5rem',borderRadius:'20px 20px 20px 5px',border:'1px solid rgba(16,185,129,0.3)'}}>
                <span style={{color:'#10b981'}}>● ● ●</span> Réflexion en cours...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* BARRE AUDIO */}
          {isSpeaking && (
            <div style={{padding:'0.5rem 1.5rem',background:'rgba(16,185,129,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'#10b981',fontSize:'0.85rem'}}>🔊 Audio... ({LANGUES[langue].label})</span>
              <button onClick={stopSpeaking} style={{background:'#ef4444',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'10px',cursor:'pointer',fontSize:'0.8rem'}}>⏹ Stop</button>
            </div>
          )}

          {/* BARRE MICRO */}
          {isListening && (
            <div style={{padding:'0.5rem 1.5rem',background:'rgba(239,68,68,0.2)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{color:'#ef4444',fontSize:'0.85rem',animation:'blink 1s infinite'}}>🎤 Parlez maintenant...</span>
              <button onClick={stopListening} style={{background:'#ef4444',color:'white',border:'none',padding:'0.3rem 0.8rem',borderRadius:'10px',cursor:'pointer',fontSize:'0.8rem'}}>⏹ Stop</button>
            </div>
          )}

          {/* INPUT */}
          <form onSubmit={handleSubmit} style={{padding:'1rem 1.5rem',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
            <div style={{display:'flex',gap:'0.5rem',alignItems:'center'}}>
              <button type="button" onClick={isListening ? stopListening : startListening} disabled={isLoading}
                style={btnStyle(isListening?'linear-gradient(135deg,#ef4444,#dc2626)':'linear-gradient(135deg,#7c3aed,#5b21b6)', isLoading)}>
                {isListening ? '⏹' : '🎤'}
              </button>
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder={`Parlez ou écrivez en ${LANGUES[langue].label.split(' ')[1]}...`}
                disabled={isLoading || isListening}
                style={{flex:1,padding:'0.8rem 1rem',borderRadius:'15px',border:'2px solid rgba(16,185,129,0.3)',background:'rgba(15,23,42,0.8)',color:'white',fontSize:'0.9rem',outline:'none'}} />
              <button type="submit" disabled={isLoading || !input.trim()} style={btnStyle('linear-gradient(135deg,#10b981,#059669)', isLoading || !input.trim())}>
                ➤
              </button>
            </div>
            <p style={{color:'#475569',fontSize:'0.7rem',textAlign:'center',marginTop:'0.5rem',marginBottom:0}}>
              🎤 Micro • 🔊 Audio • 🌐 8 langues • 🇬🇵 BOUDOUM
            </p>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse { 0%,100%{transform:scale(1);box-shadow:0 10px 40px rgba(16,185,129,0.5)} 50%{transform:scale(1.05);box-shadow:0 15px 50px rgba(16,185,129,0.7)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .bot-button:hover { transform:scale(1.1); box-shadow:0 15px 50px rgba(16,185,129,0.7); }
        input:focus { border-color:#10b981 !important; }
      `}</style>
    </>
  )
}
