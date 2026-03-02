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
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const stopListening = () => { if (recognitionRef.current) { recognitionRef.current.stop(); setIsListening(false) } }

  const speakResponse = (text, langCode) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/https?:\/\/\S+/g,'').replace(/[\u{1F300}-\u{1F9FF}]/gu,'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,3}/g,'').substring(0, 4000)
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
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connexion temporairement indisponible." }])
    } finally { setIsLoading(false) }
  }

  const handleSubmit = (e) => { e.preventDefault(); submitMessage(input) }

  return (
    <>
      <div onClick={() => setIsOpen(!isOpen)} className="bot-button" style={{
        position:'fixed', bottom:'2rem', right:'2rem', width:'70px', height:'70px',
        borderRadius:'50%', background:'linear-gradient(135deg,#10b981,#3b82f6)',
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
        boxShadow:'0 10px 40px rgba(16,185,129,0.5)', zIndex:9999, transition:'all 0.3s'
      }}>
        <span style={{fontSize:'2rem'}}>{isOpen ? '✕' : '🤖'}</span>
      </div>

      {isOpen && (
        <div style={{
          position:'fixed', bottom:'6rem', right:'2rem', width:'400px',
          maxWidth:'calc(100vw - 4rem)', height:'620px', background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:'20px',
          boxShadow:'0 20px 60px rgba(0,0,0,0.5)', display:'flex', flexDirection:'column', zIndex:9998, border:'2px solid rgba(16,185,129,0.3)', overflow:'hidden'
        }}>
          <div style={{ background:'linear-gradient(135deg,#10b981,#3b82f6)', padding:'1rem 1.5rem', color:'white', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.8rem'}}>
              <span style={{fontSize:'1.5rem'}}>🤖</span>
              <h3 style={{margin:0, fontSize:'1rem'}}>REUSSITESS AI</h3>
            </div>
            <button onClick={() => setAudioEnabled(!audioEnabled)} style={{background:'none', border:'none', color:'white', cursor:'pointer'}}>{audioEnabled ? '🔊' : '🔇'}</button>
          </div>

          <div style={{flex:1, overflowY:'auto', padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{alignSelf: msg.role==='user'?'flex-end':'flex-start', background: msg.role==='user'?'#3b82f6':'rgba(16,185,129,0.15)', color:'white', padding:'0.8rem 1.2rem', borderRadius:'15px', maxWidth:'85%', whiteSpace:'pre-wrap'}}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={{padding:'1rem', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', gap:'0.5rem'}}>
            <button type="button" onClick={isListening ? stopListening : startListening} style={{background:'#7c3aed', border:'none', borderRadius:'10px', padding:'0.5rem', color:'white'}}>{isListening ? '⏹' : '🎤'}</button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Message..." style={{flex:1, background:'#0f172a', border:'1px solid #10b981', borderRadius:'10px', color:'white', padding:'0.5rem'}} />
            <button type="submit" style={{background:'#10b981', border:'none', borderRadius:'10px', padding:'0.5rem', color:'white'}}>➤</button>
          </form>
        </div>
      )}
    </>
  )
}
